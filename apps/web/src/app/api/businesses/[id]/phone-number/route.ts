import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"
import { searchAvailableNumbers, buyPhoneNumber, releasePhoneNumber, TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN } from "@/lib/twilio"
import { vapiRequest } from "@/lib/vapi"

// GET — search available Spanish numbers
export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const raw = await searchAvailableNumbers("ES", "Mobile", 8)
    const numbers = raw.map((n) => ({
      number: n.phone_number,
      friendlyName: n.friendly_name,
      locality: n.locality,
      region: n.region,
    }))
    return NextResponse.json({ numbers })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error"
    if (msg === "twilio_not_configured") {
      return NextResponse.json({ error: "twilio_not_configured" }, { status: 503 })
    }
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

// POST — buy a number and connect to Vapi assistant
export async function POST(req: Request, { params }: { params: { id: string } }) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { data: business } = await supabaseAdmin
    .from("businesses")
    .select("id, vapi_assistant_id, ai_config")
    .eq("id", params.id)
    .eq("owner_clerk_id", userId)
    .single()

  if (!business) return NextResponse.json({ error: "Not found" }, { status: 404 })

  const { phoneNumber } = await req.json()
  if (!phoneNumber) return NextResponse.json({ error: "phoneNumber required" }, { status: 400 })

  try {
    // 1. Buy the number in Twilio
    const purchased = await buyPhoneNumber(phoneNumber)

    // 2. Register in Vapi linked to the assistant
    let vapiPhoneId: string | null = null
    if (business.vapi_assistant_id) {
      try {
        const vapiPhone = await vapiRequest("/phone-number", {
          method: "POST",
          body: JSON.stringify({
            provider: "twilio",
            number: phoneNumber,
            twilioAccountSid: TWILIO_ACCOUNT_SID,
            twilioAuthToken: TWILIO_AUTH_TOKEN,
            assistantId: business.vapi_assistant_id,
            name: `business-${params.id}`,
          }),
        })
        vapiPhoneId = vapiPhone?.id ?? null
      } catch {}
    }

    // 3. Update ai_config — new number IS the bot number, no forwarding needed
    const existingConfig = (business.ai_config as Record<string, unknown>) || {}
    const updatedConfig = {
      ...existingConfig,
      vapi_phone_number: phoneNumber,
      vapi_phone_number_id: vapiPhoneId,
      vapi_routing_number: null,
      custom_phones: [],
      twilio_sid: purchased.sid,
    }

    await supabaseAdmin
      .from("businesses")
      .update({ ai_config: updatedConfig })
      .eq("id", params.id)

    return NextResponse.json({ success: true, number: phoneNumber, twilioSid: purchased.sid })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error comprando número"
    if (msg === "twilio_not_configured") {
      return NextResponse.json({ error: "twilio_not_configured" }, { status: 503 })
    }
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

// DELETE — release a purchased number
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { data: business } = await supabaseAdmin
    .from("businesses")
    .select("id, ai_config")
    .eq("id", params.id)
    .eq("owner_clerk_id", userId)
    .single()

  if (!business) return NextResponse.json({ error: "Not found" }, { status: 404 })

  const aiConfig = (business.ai_config as Record<string, unknown>) || {}
  const twilioSid = aiConfig.twilio_sid as string | undefined

  if (twilioSid) {
    try { await releasePhoneNumber(twilioSid) } catch {}
  }

  const updatedConfig = { ...aiConfig, vapi_phone_number: null, vapi_phone_number_id: null, twilio_sid: null }
  await supabaseAdmin.from("businesses").update({ ai_config: updatedConfig }).eq("id", params.id)

  return NextResponse.json({ success: true })
}
