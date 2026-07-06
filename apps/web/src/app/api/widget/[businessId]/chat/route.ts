import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"

const MAX_MESSAGES = 20

export async function POST(req: Request, { params }: { params: { businessId: string } }) {
  const { messages } = await req.json()
  if (!messages?.length) return NextResponse.json({ error: "Missing messages" }, { status: 400 })
  if (messages.length > MAX_MESSAGES * 2) return NextResponse.json({ error: "Too many messages" }, { status: 429 })

  const { data } = await supabaseAdmin
    .from("businesses")
    .select("name, ai_config, system_prompt, agent_name")
    .eq("id", params.businessId)
    .single()

  if (!data) return NextResponse.json({ error: "Not found" }, { status: 404 })

  const cfg = (data.ai_config as Record<string, unknown>) || {}
  const systemPrompt = (data.system_prompt as string) ||
    (cfg.system_prompt as string) ||
    `Eres el asistente virtual de ${data.name}. Responde de forma amigable y concisa en español. Ayuda a los clientes con información sobre el negocio, servicios y citas.`

  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) return NextResponse.json({ error: "Chat not configured" }, { status: 500 })

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt + "\n\nEres el asistente de chat de la web. Responde en máximo 2-3 frases. No uses markdown." },
        ...messages.slice(-10),
      ],
      max_tokens: 200,
      temperature: 0.7,
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    console.error("OpenAI error:", err)
    return NextResponse.json({ error: "Error generating response" }, { status: 500 })
  }

  const data2 = await res.json()
  const reply = data2.choices?.[0]?.message?.content || "Lo siento, no puedo responder ahora mismo."

  return NextResponse.json({ reply })
}
