import { Injectable, Logger, NotFoundException } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { PrismaService } from "../../common/prisma/prisma.service"
import { TwilioService } from "./twilio.service"
import { PromptEngineService } from "./prompt-engine.service"
import { OpenAIRealtimeService } from "./openai-realtime.service"

interface InboundCallData {
  callSid: string
  from: string
  to: string
  direction: "INBOUND" | "OUTBOUND"
}

interface CallStatusUpdate {
  businessId: string
  callSid: string
  status: string
  duration?: string
  recordingUrl?: string
}

interface RecordingData {
  businessId: string
  callSid: string
  recordingUrl: string
  recordingSid: string
  duration: string
}

interface TranscriptionData {
  businessId: string
  callSid: string
  transcript: string
}

@Injectable()
export class VoiceService {
  private readonly logger = new Logger(VoiceService.name)

  constructor(
    private prisma: PrismaService,
    private twilioService: TwilioService,
    private promptEngine: PromptEngineService,
    private openAIRealtime: OpenAIRealtimeService,
    private config: ConfigService,
  ) {}

  async handleInboundCall(data: InboundCallData): Promise<string> {
    const { callSid, from, to } = data

    // Find business by phone number
    const phoneNumber = await this.prisma.phoneNumber.findUnique({
      where: { number: to },
      include: {
        business: {
          include: { aiConfig: true, subscription: true },
        },
      },
    })

    if (!phoneNumber?.business) {
      this.logger.warn(`No business found for number: ${to}`)
      return this.twilioService.buildNotFoundTwiML()
    }

    const { business } = phoneNumber

    // Check subscription limits
    const subscription = business.subscription
    if (subscription && subscription.callsUsed >= subscription.callsLimit) {
      this.logger.warn(`Business ${business.id} reached call limit`)
      return this.twilioService.buildLimitReachedTwiML()
    }

    // Create call record
    await this.prisma.call.create({
      data: {
        businessId: business.id,
        phoneNumberId: phoneNumber.id,
        twilioCallSid: callSid,
        direction: "INBOUND",
        status: "RINGING",
        callerNumber: from,
        startedAt: new Date(),
      },
    })

    // Update usage
    if (subscription) {
      await this.prisma.subscription.update({
        where: { businessId: business.id },
        data: { callsUsed: { increment: 1 } },
      })
    }

    // Generate TwiML with AI stream
    const aiConfig = business.aiConfig
    const greeting = aiConfig?.greetingMessage || `Gracias por llamar a ${business.name}. ¿En qué puedo ayudarte?`

    return this.twilioService.buildAIStreamTwiML({
      businessId: business.id,
      greeting,
      callSid,
    })
  }

  async updateCallStatus(data: CallStatusUpdate): Promise<void> {
    const { callSid, status, duration, recordingUrl } = data

    const twilioStatus = this.mapTwilioStatus(status)

    await this.prisma.call.updateMany({
      where: { twilioCallSid: callSid },
      data: {
        status: twilioStatus,
        duration: duration ? parseInt(duration) : undefined,
        recordingUrl: recordingUrl || undefined,
        endedAt: ["COMPLETED", "FAILED", "MISSED"].includes(twilioStatus)
          ? new Date()
          : undefined,
      },
    })

    this.logger.log(`Call ${callSid} status: ${status}`)
  }

  async processRecording(data: RecordingData): Promise<void> {
    const { callSid, recordingUrl, recordingSid } = data

    await this.prisma.call.updateMany({
      where: { twilioCallSid: callSid },
      data: { recordingUrl, recordingSid },
    })

    // Trigger async transcription & AI summary
    const call = await this.prisma.call.findFirst({
      where: { twilioCallSid: callSid },
    })

    if (call) {
      this.generateAISummary(call.id, recordingUrl).catch((e) =>
        this.logger.error(`Failed to generate summary: ${e.message}`),
      )
    }
  }

  async processTranscription(data: TranscriptionData): Promise<void> {
    const { callSid, transcript } = data

    await this.prisma.call.updateMany({
      where: { twilioCallSid: callSid },
      data: { transcript },
    })
  }

  async createMediaStreamTwiML(businessId: string): Promise<string> {
    const business = await this.prisma.business.findUnique({
      where: { id: businessId },
      include: { aiConfig: true },
    })

    if (!business) throw new NotFoundException("Business not found")

    const wsUrl = this.config.get("WEBSOCKET_URL", "wss://your-domain.com")
    return this.twilioService.buildMediaStreamTwiML({
      wsUrl: `${wsUrl}/api/voice/ws/${businessId}`,
      greeting: business.aiConfig?.greetingMessage || `Hola, bienvenido a ${business.name}`,
    })
  }

  private async generateAISummary(callId: string, recordingUrl: string): Promise<void> {
    try {
      const call = await this.prisma.call.findUnique({
        where: { id: callId },
        include: { business: { include: { aiConfig: true } } },
      })

      if (!call?.transcript) return

      const summary = await this.openAIRealtime.generateCallSummary(
        call.transcript,
        call.business.name,
      )

      await this.prisma.call.update({
        where: { id: callId },
        data: {
          aiSummary: summary.summary,
          sentiment: summary.sentiment,
        },
      })

      // Update analytics
      await this.updateDailyAnalytics(call.businessId, {
        appointmentBooked: summary.appointmentBooked,
        leadCaptured: summary.leadCaptured,
      })
    } catch (error) {
      this.logger.error(`Error generating AI summary: ${error.message}`)
    }
  }

  private async updateDailyAnalytics(
    businessId: string,
    data: { appointmentBooked: boolean; leadCaptured: boolean },
  ): Promise<void> {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    await this.prisma.callAnalytics.upsert({
      where: { businessId_date: { businessId, date: today } },
      update: {
        appointmentsBooked: data.appointmentBooked ? { increment: 1 } : undefined,
        leadsGenerated: data.leadCaptured ? { increment: 1 } : undefined,
      },
      create: {
        businessId,
        date: today,
        totalCalls: 1,
        answeredCalls: 1,
        appointmentsBooked: data.appointmentBooked ? 1 : 0,
        leadsGenerated: data.leadCaptured ? 1 : 0,
      },
    })
  }

  private mapTwilioStatus(twilioStatus: string): string {
    const map: Record<string, string> = {
      queued: "RINGING",
      ringing: "RINGING",
      "in-progress": "IN_PROGRESS",
      completed: "COMPLETED",
      busy: "MISSED",
      "no-answer": "MISSED",
      canceled: "FAILED",
      failed: "FAILED",
    }
    return map[twilioStatus] || "COMPLETED"
  }
}
