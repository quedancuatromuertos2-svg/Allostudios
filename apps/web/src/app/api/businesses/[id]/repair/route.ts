import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"
import { createVapiAssistant, updateVapiAssistant, vapiRequest } from "@/lib/vapi"
import { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, searchAvailableNumbers, buyPhoneNumber } from "@/lib/twilio"
import { buildSystemPrompt } from "@/lib/agent-prompts"

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { data: business } = await supabaseAdmin
    .from("businesses")
    .select("*")
    .eq("id", params.id)
    .eq("owner_clerk_id", userId)
    .single()

  if (!business) return NextResponse.json({ error: "Business not found" }, { status: 404 })

  const cfg = (business.ai_config as Record<string, unknown>) || {}
  const results: string[] = []

  // ── Step 1: Ensure Vapi assistant exists ─────────────────────────
  if (!business.vapi_assistant_id) {
    try {
      const systemPrompt = (business.system_prompt as string) || buildSystemPrompt(
        business.name,
        business.agent_name as string | undefined,
      )
      const assistant = await createVapiAssistant({
        name: `${business.name} — ${business.agent_name || "Asistente"}`,
        systemPrompt,
        greetingMessage: (business.greeting_message as string) ||
          `Hola, gracias por llamar a ${business.name}. ¿En qué puedo ayudarte?`,
      })
      await supabaseAdmin.from("businesses")
        .update({ vapi_assistant_id: assistant.id })
        .eq("id", business.id)
      business.vapi_assistant_id = assistant.id
      results.push(`✓ Asistente IA creado (${assistant.id})`)
    } catch (e) {
      results.push(`✗ Error creando asistente: ${e}`)
      return NextResponse.json({ success: false, results })
    }
  } else {
    // Sync the existing assistant (serverUrl, tools, prompt)
    try {
      const systemPrompt = (business.system_prompt as string) || buildSystemPrompt(
        business.name,
        business.agent_name as string | undefined,
      )
      await updateVapiAssistant(business.vapi_assistant_id, {
        systemPrompt,
        greetingMessage: (business.greeting_message as string) || undefined,
      })
      results.push(`✓ Asistente sincronizado`)
    } catch (e) {
      results.push(`⚠ Advertencia sincronizando asistente: ${e}`)
    }
  }

  // ── Step 2: Ensure phone number exists ───────────────────────────
  if (!cfg.vapi_phone_number_id) {
    // Try Twilio Spain first if configured and available
    if (TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN && !cfg.twilio_sid) {
      try {
        const available = await searchAvailableNumbers("ES", "Mobile", 5)
        if (available.length) {
          const purchased = await buyPhoneNumber(available[0].phone_number)
          cfg.vapi_phone_number = available[0].phone_number
          cfg.twilio_sid = purchased.sid
          results.push(`✓ Número Twilio ES comprado: ${available[0].phone_number}`)
        }
      } catch {
        // Twilio Spain not available — fall through to Vapi native number
      }
    }

    // If still no number, buy a Vapi native number (supports international calls on PAYG)
    if (!cfg.vapi_phone_number) {
      try {
        const vapiPhone = await vapiRequest("/phone-number", {
          method: "POST",
          body: JSON.stringify({
            provider: "vapi",
            numberDesiredAreaCode: "350",
            assistantId: business.vapi_assistant_id,
            name: `biz-${business.id.slice(0, 8)}`,
          }),
        })
        cfg.vapi_phone_number = vapiPhone?.number ?? null
        cfg.vapi_phone_number_id = vapiPhone?.id ?? null
        results.push(`✓ Número Vapi asignado: ${cfg.vapi_phone_number}`)
      } catch (e) {
        results.push(`✗ Error comprando número Vapi: ${e}`)
        return NextResponse.json({ success: false, results })
      }
    }

    // If we have a Twilio number, register it in Vapi
    if (cfg.twilio_sid && cfg.vapi_phone_number && !cfg.vapi_phone_number_id) {
      try {
        const vapiPhone = await vapiRequest("/phone-number", {
          method: "POST",
          body: JSON.stringify({
            provider: "twilio",
            number: cfg.vapi_phone_number,
            twilioAccountSid: TWILIO_ACCOUNT_SID,
            twilioAuthToken: TWILIO_AUTH_TOKEN,
            assistantId: business.vapi_assistant_id,
            name: `business-${business.id}`,
          }),
        })
        cfg.vapi_phone_number_id = vapiPhone?.id ?? null
        results.push(`✓ Número Twilio conectado a Vapi (${cfg.vapi_phone_number_id})`)
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e)
        if (msg.includes("already") || msg.includes("exist")) {
          const phones = await vapiRequest("/phone-number?limit=100")
          const match = Array.isArray(phones)
            ? phones.find((p: Record<string, unknown>) => p.number === cfg.vapi_phone_number)
            : null
          if (match?.id) {
            cfg.vapi_phone_number_id = match.id
            results.push(`✓ Número recuperado en Vapi (${match.id})`)
          }
        } else {
          results.push(`✗ Error conectando a Vapi: ${msg}`)
        }
      }
    }
  } else {
    results.push(`✓ Número ya conectado (${cfg.vapi_phone_number})`)
  }

  // ── Save updated config ───────────────────────────────────────────
  await supabaseAdmin.from("businesses")
    .update({ ai_config: cfg })
    .eq("id", business.id)

  // ── Mark provisioning job as success if all steps done ───────────
  if (cfg.vapi_phone_number_id && business.vapi_assistant_id) {
    await supabaseAdmin.from("provisioning_jobs").upsert({
      business_id: business.id,
      status: "success",
      completed_steps: ["create_agent", "assign_number", "connect_number"],
      retry_count: 0,
    }, { onConflict: "business_id" })
  }

  const { data: updated } = await supabaseAdmin
    .from("businesses")
    .select("ai_config, vapi_assistant_id")
    .eq("id", business.id)
    .single()

  const allGood = !!(updated?.vapi_assistant_id && (updated?.ai_config as Record<string, unknown>)?.vapi_phone_number_id)

  return NextResponse.json({ success: allGood, results, ai_config: updated?.ai_config })
}
