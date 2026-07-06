import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"
import { vapiRequest } from "@/lib/vapi"
import { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN } from "@/lib/twilio"

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { phoneNumber: rawPhone } = await req.json()
  if (!rawPhone) return NextResponse.json({ error: "phoneNumber required" }, { status: 400 })
  const digits = rawPhone.replace(/\D/g, "")
  const phoneNumber = `+34${digits.startsWith("34") ? digits.slice(2) : digits}`

  const { data: business } = await supabaseAdmin
    .from("businesses")
    .select("id, vapi_assistant_id, ai_config")
    .eq("id", params.id)
    .eq("owner_clerk_id", userId)
    .single()

  if (!business) return NextResponse.json({ error: "Not found" }, { status: 404 })
  if (!business.vapi_assistant_id) return NextResponse.json({ error: "no_assistant" }, { status: 400 })

  const aiConfig = (business.ai_config as Record<string, unknown>) || {}
  let vapiPhoneNumberId = aiConfig.vapi_phone_number_id as string | undefined

  // If Twilio number exists but not yet registered in Vapi → auto-register
  if (!vapiPhoneNumberId && aiConfig.twilio_sid && aiConfig.vapi_phone_number) {
    try {
      const vapiPhone = await vapiRequest("/phone-number", {
        method: "POST",
        body: JSON.stringify({
          provider: "twilio",
          number: aiConfig.vapi_phone_number,
          twilioAccountSid: TWILIO_ACCOUNT_SID,
          twilioAuthToken: TWILIO_AUTH_TOKEN,
          assistantId: business.vapi_assistant_id,
          name: `business-${business.id}`,
        }),
      })
      vapiPhoneNumberId = vapiPhone?.id ?? undefined
      if (vapiPhoneNumberId) {
        await supabaseAdmin.from("businesses")
          .update({ ai_config: { ...aiConfig, vapi_phone_number_id: vapiPhoneNumberId } })
          .eq("id", business.id)
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e)
      if (msg.includes("already") || msg.includes("exist")) {
        try {
          const phones = await vapiRequest("/phone-number?limit=100")
          const match = Array.isArray(phones)
            ? phones.find((p: Record<string, unknown>) => p.number === aiConfig.vapi_phone_number)
            : null
          if (match?.id) {
            vapiPhoneNumberId = match.id
            await supabaseAdmin.from("businesses")
              .update({ ai_config: { ...aiConfig, vapi_phone_number_id: vapiPhoneNumberId } })
              .eq("id", business.id)
          }
        } catch {}
      }
    }
  }

  if (!vapiPhoneNumberId) {
    return NextResponse.json({ error: "no_phone_number" }, { status: 400 })
  }

  try {
    const call = await vapiRequest("/call", {
      method: "POST",
      body: JSON.stringify({
        type: "outboundPhoneCall",
        phoneNumberId: vapiPhoneNumberId,
        assistantId: business.vapi_assistant_id,
        customer: { number: phoneNumber },
      }),
    })
    return NextResponse.json({ success: true, callId: call?.id })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error iniciando llamada"
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
