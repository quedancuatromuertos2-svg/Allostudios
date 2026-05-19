import { Module } from "@nestjs/common"
import { AutomationsService } from "./automations.service"
import { VoiceModule } from "../voice/voice.module"

@Module({
  imports: [VoiceModule],
  providers: [AutomationsService],
  exports: [AutomationsService],
})
export class AutomationsModule {}
