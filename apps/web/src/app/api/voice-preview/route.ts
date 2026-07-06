import { NextResponse } from "next/server"

export const runtime = "nodejs"

export async function POST(req: Request) {
  const apiKey = process.env.ELEVENLABS_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: "ELEVENLABS_API_KEY not configured" }, { status: 503 })
  }

  const { voiceId } = await req.json()
  if (!voiceId) return NextResponse.json({ error: "voiceId required" }, { status: 400 })

  const text = "Hola, soy tu asistente de voz. ¿En qué puedo ayudarte hoy?"

  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
    method: "POST",
    headers: {
      "xi-api-key": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text,
      model_id: "eleven_multilingual_v2",
      voice_settings: { stability: 0.5, similarity_boost: 0.75 },
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    return NextResponse.json({ error: `ElevenLabs error: ${err}` }, { status: 502 })
  }

  const audio = await res.arrayBuffer()
  return new Response(audio, {
    headers: {
      "Content-Type": "audio/mpeg",
      "Cache-Control": "public, max-age=3600",
    },
  })
}
