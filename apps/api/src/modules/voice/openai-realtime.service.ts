import { Injectable, Logger } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import OpenAI from "openai"

interface CallSummaryResult {
  summary: string
  sentiment: "positive" | "neutral" | "negative"
  appointmentBooked: boolean
  leadCaptured: boolean
  intent: string
  keyPoints: string[]
}

@Injectable()
export class OpenAIRealtimeService {
  private readonly logger = new Logger(OpenAIRealtimeService.name)
  private openai: OpenAI

  constructor(private config: ConfigService) {
    this.openai = new OpenAI({
      apiKey: config.get("OPENAI_API_KEY"),
    })
  }

  async generateCallSummary(
    transcript: string,
    businessName: string,
  ): Promise<CallSummaryResult> {
    const response = await this.openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `Eres un analizador de llamadas para ${businessName}. Analiza la transcripción y devuelve un JSON con: summary (resumen en español), sentiment (positive/neutral/negative), appointmentBooked (boolean), leadCaptured (boolean), intent (string), keyPoints (array de strings). Solo devuelve JSON válido.`,
        },
        { role: "user", content: transcript },
      ],
      response_format: { type: "json_object" },
      max_tokens: 500,
    })

    const content = response.choices[0].message.content
    return JSON.parse(content || "{}")
  }

  async generateAIResponse(params: {
    systemPrompt: string
    conversationHistory: Array<{ role: "user" | "assistant"; content: string }>
    userInput: string
    businessContext: Record<string, unknown>
  }): Promise<string> {
    const messages = [
      { role: "system" as const, content: params.systemPrompt },
      ...params.conversationHistory,
      { role: "user" as const, content: params.userInput },
    ]

    const response = await this.openai.chat.completions.create({
      model: "gpt-4o",
      messages,
      max_tokens: 200,
      temperature: 0.7,
    })

    return response.choices[0].message.content || ""
  }

  getRealtimeSessionConfig(systemPrompt: string, voice = "shimmer") {
    return {
      model: this.config.get("OPENAI_REALTIME_MODEL", "gpt-4o-realtime-preview"),
      voice,
      instructions: systemPrompt,
      input_audio_format: "g711_ulaw",
      output_audio_format: "g711_ulaw",
      turn_detection: {
        type: "server_vad",
        threshold: 0.5,
        prefix_padding_ms: 300,
        silence_duration_ms: 500,
      },
      temperature: 0.7,
    }
  }
}
