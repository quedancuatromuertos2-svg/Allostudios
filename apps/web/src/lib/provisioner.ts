import { supabaseAdmin } from "./supabase"
import { createVapiAssistant, vapiRequest } from "./vapi"
import { searchAvailableNumbers, buyPhoneNumber, TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN } from "./twilio"
import { buildSystemPrompt } from "./agent-prompts"

type Step = "create_agent" | "assign_number" | "connect_number"
const STEPS: Step[] = ["create_agent", "assign_number", "connect_number"]
const MAX_RETRIES = 5
const BACKOFF_MS = [2000, 5000, 10000, 30000, 60000]

export async function provision(businessId: string): Promise<{ ok: boolean; error?: string }> {
  // ── Get or create job (UNIQUE on business_id = idempotency) ──
  const { data: existing } = await supabaseAdmin
    .from("provisioning_jobs")
    .select("*")
    .eq("business_id", businessId)
    .maybeSingle()

  if (existing?.status === "success") return { ok: true }
  if (existing?.status === "running") return { ok: true } // already in progress

  let job = existing
  if (!job) {
    const { data } = await supabaseAdmin
      .from("provisioning_jobs")
      .insert({ business_id: businessId, status: "pending", completed_steps: [] })
      .select()
      .single()
    job = data
  }

  if (!job) return { ok: false, error: "Could not create provisioning job" }
  if (job.retry_count >= MAX_RETRIES) return { ok: false, error: "max_retries_exceeded" }

  // Mark running
  await supabaseAdmin
    .from("provisioning_jobs")
    .update({ status: "running" })
    .eq("id", job.id)

  const completed: Step[] = Array.isArray(job.completed_steps) ? job.completed_steps : []

  try {
    const { data: business } = await supabaseAdmin
      .from("businesses")
      .select("id, name, vapi_assistant_id, ai_config, system_prompt, greeting_message, agent_name")
      .eq("id", businessId)
      .single()

    if (!business) throw new Error("Business not found")

    // ── Step 1: create_agent ──────────────────────────────────────
    if (!completed.includes("create_agent")) {
      if (!business.vapi_assistant_id) {
        const systemPrompt = (business as any).system_prompt || buildSystemPrompt(
          business.name,
          (business as any).agent_name,
        )
        const greetingMessage = (business as any).greeting_message ||
          `Hola, gracias por llamar a ${business.name}. ¿En qué puedo ayudarte?`

        const assistant = await createVapiAssistant({
          name: `${business.name} — ${(business as any).agent_name || "Asistente"}`,
          systemPrompt,
          greetingMessage,
        })
        await supabaseAdmin
          .from("businesses")
          .update({
            vapi_assistant_id: assistant.id,
            // Store computed prompt so smart mode can append suffix
            system_prompt: (business as any).system_prompt || systemPrompt,
          })
          .eq("id", businessId)
        business.vapi_assistant_id = assistant.id
      }
      await markStepDone(job.id, completed, "create_agent")
      completed.push("create_agent")
    }

    // ── Step 2: assign_number ─────────────────────────────────────
    if (!completed.includes("assign_number")) {
      const aiConfig = (business.ai_config as Record<string, unknown>) || {}
      if (!aiConfig.vapi_phone_number) {
        // Try Twilio ES first
        let assigned = false
        if (TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN && !aiConfig.twilio_sid) {
          try {
            const available = await searchAvailableNumbers("ES", "Mobile", 5)
            if (available.length) {
              const purchased = await buyPhoneNumber(available[0].phone_number)
              const updatedConfig = { ...aiConfig, vapi_phone_number: available[0].phone_number, twilio_sid: purchased.sid, vapi_phone_number_id: null }
              await supabaseAdmin.from("businesses").update({ ai_config: updatedConfig }).eq("id", businessId)
              business.ai_config = updatedConfig
              assigned = true
            }
          } catch { /* Twilio ES not available — fallback to Vapi native */ }
        }

        // Fallback: buy Vapi native number (PAYG accounts support international calls)
        if (!assigned) {
          for (const areaCode of ["350", "341", "502", "212", "646"]) {
            try {
              const vapiPhone = await vapiRequest("/phone-number", {
                method: "POST",
                body: JSON.stringify({
                  provider: "vapi",
                  numberDesiredAreaCode: areaCode,
                  assistantId: business.vapi_assistant_id,
                  name: `biz-${businessId.slice(0, 8)}`,
                }),
              })
              if (vapiPhone?.id) {
                const updatedConfig = { ...aiConfig, vapi_phone_number: vapiPhone.number, vapi_phone_number_id: vapiPhone.id }
                await supabaseAdmin.from("businesses").update({ ai_config: updatedConfig }).eq("id", businessId)
                business.ai_config = updatedConfig
                assigned = true
                break
              }
            } catch { continue }
          }
        }

        if (!assigned) throw new Error("No phone number available (Twilio ES and Vapi native both failed)")
      }
      await markStepDone(job.id, completed, "assign_number")
      completed.push("assign_number")
    }

    // ── Step 3: connect_number ────────────────────────────────────
    if (!completed.includes("connect_number")) {
      const aiConfig = (business.ai_config as Record<string, unknown>) || {}
      const phoneNumber = aiConfig.vapi_phone_number as string | undefined
      const alreadyConnected = aiConfig.vapi_phone_number_id as string | undefined
      const twilioSid = aiConfig.twilio_sid as string | undefined

      // Only register in Vapi if it's a Twilio number (Vapi native numbers are already connected)
      if (phoneNumber && !alreadyConnected && twilioSid && business.vapi_assistant_id) {
        try {
          const vapiPhone = await vapiRequest("/phone-number", {
            method: "POST",
            body: JSON.stringify({
              provider: "twilio",
              number: phoneNumber,
              twilioAccountSid: TWILIO_ACCOUNT_SID,
              twilioAuthToken: TWILIO_AUTH_TOKEN,
              assistantId: business.vapi_assistant_id,
              name: `biz-${businessId.slice(0, 8)}`,
            }),
          })
          if (vapiPhone?.id) {
            await supabaseAdmin
              .from("businesses")
              .update({ ai_config: { ...aiConfig, vapi_phone_number_id: vapiPhone.id } })
              .eq("id", businessId)
          }
        } catch (e) {
          console.error("Vapi phone registration failed:", e)
        }
      }
      await markStepDone(job.id, completed, "connect_number")
      completed.push("connect_number")
    }

    // ── All steps done ────────────────────────────────────────────
    await supabaseAdmin
      .from("provisioning_jobs")
      .update({ status: "success", completed_steps: completed })
      .eq("id", job.id)

    return { ok: true }

  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    const newRetryCount = (job.retry_count || 0) + 1

    await supabaseAdmin
      .from("provisioning_jobs")
      .update({
        status: newRetryCount >= MAX_RETRIES ? "failed" : "pending",
        retry_count: newRetryCount,
        error_message: msg,
        completed_steps: completed,
      })
      .eq("id", job.id)

    return { ok: false, error: msg }
  }
}

async function markStepDone(jobId: string, completed: Step[], step: Step) {
  await supabaseAdmin
    .from("provisioning_jobs")
    .update({ completed_steps: [...completed, step] })
    .eq("id", jobId)
}

export function getBackoffMs(retryCount: number): number {
  return BACKOFF_MS[Math.min(retryCount, BACKOFF_MS.length - 1)]
}
