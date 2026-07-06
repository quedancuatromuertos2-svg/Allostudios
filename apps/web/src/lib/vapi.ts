const VAPI_BASE = "https://api.vapi.ai"
const VAPI_KEY = process.env.VAPI_API_KEY!
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://allostudios.net"

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
    throw new Error(`Vapi ${path} failed (${res.status}): ${err}`)
  }
  return res.json()
}

function buildFunctionTools() {
  return [
    {
      type: "function",
      function: {
        name: "checkAvailability",
        description: "Verifica los horarios disponibles para citas en una fecha específica. Úsala cuando el cliente quiera reservar.",
        parameters: {
          type: "object",
          properties: {
            date: { type: "string", description: "Fecha en formato YYYY-MM-DD" },
            service_id: { type: "string", description: "ID del servicio (opcional)" },
          },
          required: ["date"],
        },
      },
    },
    {
      type: "function",
      function: {
        name: "bookAppointment",
        description: "Reserva una cita para el cliente. Pide todos los datos necesarios antes de llamar a esta función.",
        parameters: {
          type: "object",
          properties: {
            customer_name: { type: "string", description: "Nombre completo del cliente" },
            customer_phone: { type: "string", description: "Teléfono del cliente" },
            customer_email: { type: "string", description: "Email del cliente (opcional)" },
            scheduled_at: { type: "string", description: "Fecha y hora en ISO 8601, ej: 2024-12-15T10:30:00" },
            service_id: { type: "string", description: "ID del servicio" },
            notes: { type: "string", description: "Notas adicionales" },
          },
          required: ["customer_name", "customer_phone", "scheduled_at"],
        },
      },
    },
    {
      type: "function",
      function: {
        name: "captureLead",
        description: "Registra los datos de un cliente interesado. Úsala cuando alguien pide información pero no reserva cita.",
        parameters: {
          type: "object",
          properties: {
            name: { type: "string", description: "Nombre del lead" },
            phone: { type: "string", description: "Teléfono de contacto" },
            email: { type: "string", description: "Email (opcional)" },
            interest: { type: "string", description: "En qué está interesado" },
            notes: { type: "string", description: "Notas adicionales" },
          },
          required: ["name", "phone"],
        },
      },
    },
    {
      type: "function",
      function: {
        name: "getBusinessInfo",
        description: "Obtiene información del negocio: nombre, dirección, servicios, horarios. Úsala cuando el cliente pregunta sobre el negocio.",
        parameters: {
          type: "object",
          properties: {},
          required: [],
        },
      },
    },
  ]
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
        tools: buildFunctionTools(),
      },
      voice: {
        provider: "11labs",
        voiceId: params.voice || "21m00Tcm4TlvDq8ikWAM",
        model: "eleven_multilingual_v2",
        stability: 0.5,
        similarityBoost: 0.75,
        style: 0,
        useSpeakerBoost: true,
      },
      firstMessage: params.greetingMessage,
      endCallFunctionEnabled: true,
      recordingEnabled: true,
      hipaaEnabled: false,
      serverUrl: `${APP_URL}/api/vapi/webhook`,
      // Correct Vapi serverMessages types:
      // "status-update" → call started/in-progress
      // "end-of-call-report" → call ended with full transcript + analysis
      // "function-call" → AI calls a function (legacy)
      // "tool-calls" → AI calls tools (newer format)
      serverMessages: ["status-update", "end-of-call-report", "function-call", "tool-calls"],
    }),
  })
}

export async function updateVapiAssistant(assistantId: string, params: Partial<{
  name: string
  systemPrompt: string
  greetingMessage: string
  voice: string
}>) {
  const body: Record<string, unknown> = {
    serverUrl: `${APP_URL}/api/vapi/webhook`,
    serverMessages: ["status-update", "end-of-call-report", "function-call", "tool-calls"],
  }
  if (params.name) body.name = params.name
  if (params.greetingMessage) body.firstMessage = params.greetingMessage
  if (params.systemPrompt) {
    body.model = {
      provider: "openai",
      model: "gpt-4o",
      messages: [{ role: "system", content: params.systemPrompt }],
      temperature: 0.7,
      maxTokens: 200,
      tools: buildFunctionTools(),
    }
  }
  if (params.voice) {
    body.voice = {
      provider: "11labs",
      voiceId: params.voice,
      model: "eleven_multilingual_v2",
      stability: 0.5,
      similarityBoost: 0.75,
      style: 0,
      useSpeakerBoost: true,
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
  businessId: string
  businessName: string
}) {
  const name = params.businessName.slice(0, 36)
  for (const areaCode of ["350", "341", "502", "212", "646", "443", "305"]) {
    try {
      return await vapiRequest("/phone-number", {
        method: "POST",
        body: JSON.stringify({
          provider: "vapi",
          numberDesiredAreaCode: areaCode,
          assistantId: params.assistantId,
          name,
        }),
      })
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e)
      if (!msg.includes("not available") && !msg.includes("area code")) throw e
    }
  }
  throw new Error("No Vapi phone numbers available in any area code")
}

export async function getVapiAssistant(assistantId: string) {
  return vapiRequest(`/assistant/${assistantId}`)
}

export async function listVapiAssistants() {
  return vapiRequest("/assistant")
}

export async function listVapiPhoneNumbers() {
  return vapiRequest("/phone-number")
}
