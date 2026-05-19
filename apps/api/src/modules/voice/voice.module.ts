import { Module } from "@nestjs/common"
import { VoiceController } from "./voice.controller"
import { VoiceService } from "./voice.service"
import { TwilioService } from "./twilio.service"
import { OpenAIRealtimeService } from "./openai-realtime.service"
import { ElevenLabsService } from "./elevenlabs.service"
import { PromptEngineService } from "./prompt-engine.service"

@Module({
  controllers: [VoiceController],
  providers: [
    VoiceService,
    TwilioService,
    OpenAIRealtimeService,
    ElevenLabsService,
    PromptEngineService,
  ],
  exports: [VoiceService, TwilioService],
})
export class VoiceModule {}
