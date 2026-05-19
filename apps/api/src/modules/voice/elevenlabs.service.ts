import { Injectable, Logger } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import axios from "axios"

@Injectable()
export class ElevenLabsService {
  private readonly logger = new Logger(ElevenLabsService.name)
  private readonly baseUrl = "https://api.elevenlabs.io/v1"
  private readonly apiKey: string

  constructor(private config: ConfigService) {
    this.apiKey = config.get("ELEVENLABS_API_KEY", "")
  }

  async textToSpeech(params: {
    text: string
    voiceId?: string
    stability?: number
    similarityBoost?: number
  }): Promise<Buffer> {
    const voiceId = params.voiceId || this.config.get("ELEVENLABS_VOICE_ID", "21m00Tcm4TlvDq8ikWAM")

    const response = await axios.post(
      `${this.baseUrl}/text-to-speech/${voiceId}`,
      {
        text: params.text,
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          stability: params.stability ?? 0.5,
          similarity_boost: params.similarityBoost ?? 0.75,
          style: 0.0,
          use_speaker_boost: true,
        },
      },
      {
        headers: {
          "xi-api-key": this.apiKey,
          "Content-Type": "application/json",
          Accept: "audio/mpeg",
        },
        responseType: "arraybuffer",
      },
    )

    return Buffer.from(response.data)
  }

  async getVoices(): Promise<Array<{ voice_id: string; name: string; category: string }>> {
    const response = await axios.get(`${this.baseUrl}/voices`, {
      headers: { "xi-api-key": this.apiKey },
    })
    return response.data.voices
  }

  async streamTextToSpeech(params: {
    text: string
    voiceId: string
  }): Promise<NodeJS.ReadableStream> {
    const response = await axios.post(
      `${this.baseUrl}/text-to-speech/${params.voiceId}/stream`,
      {
        text: params.text,
        model_id: "eleven_multilingual_v2",
        voice_settings: { stability: 0.5, similarity_boost: 0.75 },
      },
      {
        headers: {
          "xi-api-key": this.apiKey,
          "Content-Type": "application/json",
          Accept: "audio/mpeg",
        },
        responseType: "stream",
      },
    )

    return response.data
  }
}
