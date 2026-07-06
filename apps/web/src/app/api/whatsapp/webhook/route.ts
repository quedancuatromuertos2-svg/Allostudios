import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"

// AlloStudios sales/support assistant — replies to WhatsApp messages
const SYSTEM_PROMPT = `Eres el asistente de WhatsApp de AlloStudios, una plataforma SaaS premium de asistentes de voz con IA para negocios en España.

TU OBJETIVO: calificar al lead, generar interés y llevarlo a registrarse en allostudios.net/register (7 días de prueba gratis).

QUÉ VENDE ALLOSTUDIOS:
- Recepcionista IA por voz para inmobiliarias: atiende llamadas 24/7, cualifica leads (compra/alquiler, zona, presupuesto) y agenda visitas
- Plan Starter: 399€/mes (1.500 min incluidos, ~375 llamadas)
- Plan Professional: 599€/mes (2.250 min incluidos, ~560 llamadas)
- También páginas web inmobiliarias premium desde 790€
- Para: agencias inmobiliarias, agentes independientes, promotoras, alquiler vacacional y administración de fincas
- Argumento clave: un lead inmobiliario vale miles de euros en comisión; perderlo por no coger el teléfono es carísimo. Marta cuesta mucho menos que una recepcionista.

CÓMO RESPONDER:
- Tono cercano, profesional y directo. Tutea. Usa máximo 2-3 frases por mensaje.
- Vende el RESULTADO (no perder clientes, más reservas, más tiempo libre), no la tecnología.
- Si preguntan precio, dilo claro y enfatiza los 7 días gratis.
- Si muestran interés, lleva siempre a: "Empieza tu prueba gratis en allostudios.net/register"
- Si piden hablar con una persona o algo complejo, di que un humano del equipo les escribe enseguida.
- Nunca inventes funciones que no existen. No uses markdown ni listas largas.
- Responde SIEMPRE en español.`

const MAX_HISTORY = 10

async function loadHistory(phone: string): Promise<{ role: string; content: string }[]> {
  try {
    const { data } = await supabaseAdmin
      .from("whatsapp_messages")
      .select("role, content")
      .eq("phone", phone)
      .order("created_at", { ascending: false })
      .limit(MAX_HISTORY)
    return (data || []).reverse().map((m) => ({ role: m.role, content: m.content }))
  } catch {
    return []
  }
}

async function saveMessage(phone: string, role: string, content: string) {
  try {
    await supabaseAdmin.from("whatsapp_messages").insert({ phone, role, content })
  } catch {
    // Table may not exist yet — bot still works statelessly
  }
}

function twiml(message: string) {
  const escaped = message
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
  return new NextResponse(
    `<?xml version="1.0" encoding="UTF-8"?><Response><Message>${escaped}</Message></Response>`,
    { status: 200, headers: { "Content-Type": "text/xml" } }
  )
}

export async function POST(req: Request) {
  let body: string
  let from: string
  try {
    const form = await req.formData()
    body = (form.get("Body") as string)?.trim() || ""
    from = (form.get("From") as string) || ""
  } catch {
    return twiml("Lo siento, no he podido leer tu mensaje. Inténtalo de nuevo.")
  }

  if (!body || !from) return twiml("¡Hola! Soy el asistente de AlloStudios. ¿En qué puedo ayudarte?")

  const phone = from.replace("whatsapp:", "")

  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    return twiml("Gracias por tu mensaje. Un miembro del equipo te responderá enseguida.")
  }

  const history = await loadHistory(phone)
  await saveMessage(phone, "user", body)

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...history,
          { role: "user", content: body },
        ],
        max_tokens: 220,
        temperature: 0.7,
      }),
    })

    if (!res.ok) {
      console.error("OpenAI WhatsApp error:", await res.text())
      return twiml("Gracias por escribir. Un miembro del equipo te responderá enseguida 👍")
    }

    const data = await res.json()
    const reply = data.choices?.[0]?.message?.content?.trim() ||
      "Gracias por tu mensaje. ¿En qué puedo ayudarte con AlloStudios?"

    await saveMessage(phone, "assistant", reply)
    return twiml(reply)
  } catch (e) {
    console.error("WhatsApp webhook error:", e)
    return twiml("Gracias por escribir. Un miembro del equipo te responderá enseguida 👍")
  }
}

// Twilio sometimes verifies the endpoint with GET
export async function GET() {
  return NextResponse.json({ status: "AlloStudios WhatsApp webhook active" })
}
