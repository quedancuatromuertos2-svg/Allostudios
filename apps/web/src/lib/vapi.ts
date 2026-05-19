const VAPI_BASE = "https://api.vapi.ai"
const VAPI_KEY = process.env.VAPI_API_KEY!

export async function vapiRequest(path: string, options: RequestInit = {}) {
  const res = await fetch(`${VAPI_BASE}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${VAPI_KEY}`,
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Vapi ${path} failed: ${err}`)
  }
  return res.json()
}

export async function createVapiAssistant(params: {
  name: string
  systemPrompt: string
  greetingMessage: string
  voice?: string
}) {
  return vapiRequest("/assistant", {
    method: "POST",
    body: JSON.stringify({
      name: params.name,
      transcriber: { provider: "deepgram", model: "nova-2", language: "es" },
      model: {
        provider: "openai",
        model: "gpt-4o",
        messages: [{ role: "system", content: params.systemPrompt }],
        temperature: 0.7,
        maxTokens: 200,
      },
      voice: {
        provider: "11labs",
        voiceId: params.voice || "ErXwobaYiN019PkySvjV", // Antoni — español natural
        stability: 0.5,
        similarityBoost: 0.75,
        style: 0,
        useSpeakerBoost: true,
      },
      firstMessage: params.greetingMessage,
      endCallFunctionEnabled: true,
      recordingEnabled: true,
      hipaaEnabled: false,
      serverMessages: ["end-of-call-report", "transcript", "function-call"],
    }),
  })
}

export async function updateVapiAssistant(assistantId: string, params: Partial<{
  name: string
  systemPrompt: string
  greetingMessage: string
  voice: string
}>) {
  const body: Record<string, unknown> = {}
  if (params.name) body.name = params.name
  if (params.greetingMessage) body.firstMessage = params.greetingMessage
  if (params.systemPrompt) {
    body.model = {
      provider: "openai",
      model: "gpt-4o",
      messages: [{ role: "system", content: params.systemPrompt }],
    }
  }
  return vapiRequest(`/assistant/${assistantId}`, {
    method: "PATCH",
    body: JSON.stringify(body),
  })
}

export async function getVapiCalls(assistantId: string, limit = 20) {
  return vapiRequest(`/call?assistantId=${assistantId}&limit=${limit}`)
}

export async function getVapiCall(callId: string) {
  return vapiRequest(`/call/${callId}`)
}

export async function createVapiPhoneNumber(params: {
  assistantId: string
  twilioAccountSid?: string
  twilioAuthToken?: string
}) {
  return vapiRequest("/phone-number", {
    method: "POST",
    body: JSON.stringify({
      provider: "vapi",
      assistantId: params.assistantId,
      name: "VoiceFlow AI Number",
    }),
  })
}

export async function listVapiAssistants() {
  return vapiRequest("/assistant")
}
