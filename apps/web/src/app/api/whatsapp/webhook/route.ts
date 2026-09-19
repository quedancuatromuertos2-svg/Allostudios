import { NextResponse } from "next/server"
import { cargarAsistente, responder } from "@/lib/asistente/motor"

/*  Webhook antiguo de Twilio (WhatsApp de AlloStudios). Antes llevaba un prompt del bot de voz
    para inmobiliarias (399 €/mes) que ya no existe. Ahora delega en el motor de asistentes con el
    asistente «allo» (setter/closer de AlloStudios; ver supabase/asistentes.sql y asistentes/allo.json).
    Si el asistente «allo» no existe todavía, contesta con un mensaje neutro y no inventa nada.    */

function twiml(message: string) {
  const escaped = message.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
  return new NextResponse(
    `<?xml version="1.0" encoding="UTF-8"?><Response><Message>${escaped}</Message></Response>`,
    { status: 200, headers: { "Content-Type": "text/xml" } }
  )
}

export async function POST(req: Request) {
  let body = "", from = "", sid = ""
  try {
    const form = await req.formData()
    body = String(form.get("Body") || "").trim()
    from = String(form.get("From") || "")
    sid = String(form.get("MessageSid") || "")
  } catch {
    return twiml("No he podido leer tu mensaje. ¿Me lo repites?")
  }
  if (!body || !from) return twiml("¡Hola! Soy el asistente de AlloStudios. ¿En qué te ayudo?")
  const telefono = from.replace("whatsapp:", "").replace("+", "")
  const a = await cargarAsistente("allo")
  if (!a) return twiml("Gracias por escribir. Ángel te contesta hoy mismo 👍")
  const r = await responder(a, telefono, body, sid || undefined)
  return twiml(r || "")
}

export async function GET() {
  return NextResponse.json({ status: "AlloStudios WhatsApp webhook (asistente allo)" })
}
