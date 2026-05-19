import { Injectable, Logger } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import twilio from "twilio"

interface StreamTwiMLOptions {
  businessId: string
  greeting: string
  callSid: string
}

interface MediaStreamOptions {
  wsUrl: string
  greeting: string
}

@Injectable()
export class TwilioService {
  private readonly logger = new Logger(TwilioService.name)
  private client: twilio.Twilio
  private VoiceResponse = twilio.twiml.VoiceResponse

  constructor(private config: ConfigService) {
    this.client = twilio(
      config.get("TWILIO_ACCOUNT_SID"),
      config.get("TWILIO_AUTH_TOKEN"),
    )
  }

  buildAIStreamTwiML(options: StreamTwiMLOptions): string {
    const response = new this.VoiceResponse()
    const apiUrl = this.config.get("API_URL", "http://localhost:3001")

    // Connect to media stream for real-time AI
    const connect = response.connect()
    connect.stream({
      url: `${apiUrl.replace("http", "ws")}/api/voice/ws/${options.businessId}`,
    })

    // Fallback: use Gather with speech input if no WebSocket
    const gather = response.gather({
      input: ["speech"],
      action: `${apiUrl}/api/voice/process/${options.businessId}`,
      method: "POST",
      speechTimeout: "auto",
      language: "es-ES",
    })

    gather.say(
      {
        voice: "Polly.Lucia",
        language: "es-ES",
      },
      options.greeting,
    )

    response.redirect(`${apiUrl}/api/voice/webhook/inbound`)

    return response.toString()
  }

  buildMediaStreamTwiML(options: MediaStreamOptions): string {
    const response = new this.VoiceResponse()

    response.say(
      { voice: "Polly.Lucia", language: "es-ES" },
      options.greeting,
    )

    const connect = response.connect()
    connect.stream({ url: options.wsUrl })

    return response.toString()
  }

  buildNotFoundTwiML(): string {
    const response = new this.VoiceResponse()
    response.say(
      { voice: "Polly.Lucia", language: "es-ES" },
      "Lo sentimos, este número no está disponible en este momento. Por favor, inténtelo más tarde.",
    )
    response.hangup()
    return response.toString()
  }

  buildLimitReachedTwiML(): string {
    const response = new this.VoiceResponse()
    response.say(
      { voice: "Polly.Lucia", language: "es-ES" },
      "Lo sentimos, no podemos atender su llamada en este momento. Por favor, llame de nuevo más tarde.",
    )
    response.hangup()
    return response.toString()
  }

  async makeOutboundCall(params: {
    to: string
    from: string
    url: string
  }): Promise<string> {
    const call = await this.client.calls.create({
      to: params.to,
      from: params.from,
      url: params.url,
    })
    return call.sid
  }

  async sendSMS(params: {
    to: string
    from: string
    body: string
  }): Promise<void> {
    await this.client.messages.create({
      to: params.to,
      from: params.from,
      body: params.body,
    })
  }

  async sendWhatsApp(params: {
    to: string
    body: string
  }): Promise<void> {
    const from = this.config.get("TWILIO_WHATSAPP_FROM", "whatsapp:+14155238886")
    await this.client.messages.create({
      to: `whatsapp:${params.to}`,
      from,
      body: params.body,
    })
  }

  async purchasePhoneNumber(areaCode: string, country = "ES"): Promise<{
    sid: string
    number: string
    friendlyName: string
  }> {
    const available = await this.client
      .availablePhoneNumbers(country)
      .local.list({ areaCode: parseInt(areaCode), limit: 1 })

    if (!available.length) throw new Error("No available phone numbers")

    const purchased = await this.client.incomingPhoneNumbers.create({
      phoneNumber: available[0].phoneNumber,
    })

    return {
      sid: purchased.sid,
      number: purchased.phoneNumber,
      friendlyName: purchased.friendlyName,
    }
  }

  async updateWebhookUrl(
    phoneSid: string,
    webhookUrl: string,
    statusUrl: string,
  ): Promise<void> {
    await this.client.incomingPhoneNumbers(phoneSid).update({
      voiceUrl: webhookUrl,
      voiceMethod: "POST",
      statusCallback: statusUrl,
      statusCallbackMethod: "POST",
    })
  }
}
