import {
  Controller,
  Post,
  Body,
  Req,
  Res,
  Param,
  HttpCode,
  Logger,
} from "@nestjs/common"
import { ApiTags, ApiOperation } from "@nestjs/swagger"
import { Response } from "express"
import { VoiceService } from "./voice.service"
import { TwilioService } from "./twilio.service"

@ApiTags("Voice")
@Controller("voice")
export class VoiceController {
  private readonly logger = new Logger(VoiceController.name)

  constructor(
    private readonly voiceService: VoiceService,
    private readonly twilioService: TwilioService,
  ) {}

  @Post("webhook/inbound")
  @HttpCode(200)
  @ApiOperation({ summary: "Twilio inbound call webhook" })
  async handleInboundCall(@Body() body: any, @Res() res: Response) {
    this.logger.log(`Inbound call from ${body.From} to ${body.To}`)

    const twiml = await this.voiceService.handleInboundCall({
      callSid: body.CallSid,
      from: body.From,
      to: body.To,
      direction: "INBOUND",
    })

    res.set("Content-Type", "text/xml")
    res.send(twiml)
  }

  @Post("webhook/status/:businessId")
  @HttpCode(200)
  @ApiOperation({ summary: "Twilio call status webhook" })
  async handleCallStatus(
    @Param("businessId") businessId: string,
    @Body() body: any,
  ) {
    await this.voiceService.updateCallStatus({
      businessId,
      callSid: body.CallSid,
      status: body.CallStatus,
      duration: body.CallDuration,
      recordingUrl: body.RecordingUrl,
    })
    return { ok: true }
  }

  @Post("webhook/recording/:businessId")
  @HttpCode(200)
  @ApiOperation({ summary: "Twilio recording webhook" })
  async handleRecording(
    @Param("businessId") businessId: string,
    @Body() body: any,
  ) {
    await this.voiceService.processRecording({
      businessId,
      callSid: body.CallSid,
      recordingUrl: body.RecordingUrl,
      recordingSid: body.RecordingSid,
      duration: body.RecordingDuration,
    })
    return { ok: true }
  }

  @Post("webhook/transcription/:businessId")
  @HttpCode(200)
  async handleTranscription(
    @Param("businessId") businessId: string,
    @Body() body: any,
  ) {
    await this.voiceService.processTranscription({
      businessId,
      callSid: body.CallSid,
      transcript: body.TranscriptionText,
    })
    return { ok: true }
  }

  @Post("stream/:businessId")
  @HttpCode(200)
  @ApiOperation({ summary: "WebSocket media stream endpoint" })
  async handleMediaStream(
    @Param("businessId") businessId: string,
    @Body() body: any,
    @Res() res: Response,
  ) {
    const twiml = await this.voiceService.createMediaStreamTwiML(businessId)
    res.set("Content-Type", "text/xml")
    res.send(twiml)
  }
}
