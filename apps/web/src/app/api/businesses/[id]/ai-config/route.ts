import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"
import { vapiRequest } from "@/lib/vapi"

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { data: business } = await supabaseAdmin
    .from("businesses")
    .select("id, vapi_assistant_id, ai_config")
    .eq("id", params.id)
    .eq("owner_clerk_id", userId)
    .single()

  if (!business) return NextResponse.json({ error: "Not found" }, { status: 404 })

  let vapiConfig = null
  if (business.vapi_assistant_id) {
    try {
      vapiConfig = await vapiRequest(`/assistant/${business.vapi_assistant_id}`)
    } catch {}
  }

  return NextResponse.json({ ai_config: business.ai_config, vapi: vapiConfig })
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { data: business } = await supabaseAdmin
    .from("businesses")
    .select("id, vapi_assistant_id")
    .eq("id", params.id)
    .eq("owner_clerk_id", userId)
    .single()

  if (!business) return NextResponse.json({ error: "Not found" }, { status: 404 })

  const body = await req.json()
  const { system_prompt, voice_id, voice_provider, first_message, faqs, settings } = body

  const ai_config = { system_prompt, voice_id, voice_provider, first_message, faqs, settings }

  const { error } = await supabaseAdmin
    .from("businesses")
    .update({ ai_config })
    .eq("id", params.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  if (business.vapi_assistant_id) {
    try {
      const updatePayload: Record<string, unknown> = {}
      if (system_prompt) updatePayload.instructions = system_prompt
      if (first_message) updatePayload.firstMessage = first_message
      if (voice_id || voice_provider) {
        updatePayload.voice = {
          provider: voice_provider || "11labs",
          voiceId: voice_id || "rachel",
        }
      }
      if (Object.keys(updatePayload).length > 0) {
        await vapiRequest(`/assistant/${business.vapi_assistant_id}`, {
          method: "PATCH",
          body: JSON.stringify(updatePayload),
        })
      }
    } catch {}
  }

  return NextResponse.json({ success: true })
}
