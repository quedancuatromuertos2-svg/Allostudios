import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"
import { searchAvailableNumbers, buyPhoneNumber, TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN } from "@/lib/twilio"
import { vapiRequest } from "@/lib/vapi"

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN) {
    return NextResponse.json({ error: "twilio_not_configured" }, { status: 503 })
  }

  const { data: business } = await supabaseAdmin
    .from("businesses")
    .select("id, vapi_assistant_id, ai_config")
    .eq("id", params.id)
    .eq("owner_clerk_id", userId)
    .single()

  if (!business) return NextResponse.json({ error: "Not found" }, { status: 404 })

  const aiConfig = (business.ai_config as Record<string, unknown>) || {}

  // Already has a Twilio number
  if (aiConfig.twilio_sid) {
    return NextResponse.json({ success: true, number: aiConfig.vapi_phone_number, alreadyAssigned: true })
  }

  const available = await searchAvailableNumbers("ES", "Mobile", 3)
  if (!available.length) return NextResponse.json({ error: "No Spanish numbers available" }, { status: 503 })

  const phoneNumber = available[0].phone_number
  const purchased = await buyPhoneNumber(phoneNumber)

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

  await supabaseAdmin
    .from("businesses")
    .update({
      ai_config: {
        ...aiConfig,
        vapi_phone_number: phoneNumber,
        vapi_phone_number_id: vapiPhoneId,
        vapi_routing_number: null,
        twilio_sid: purchased.sid,
      },
    })
    .eq("id", params.id)

  return NextResponse.json({ success: true, number: phoneNumber })
}
