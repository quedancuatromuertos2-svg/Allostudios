import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"
import { createCalendarEvent } from "@/lib/google-calendar"
import { updateVapiAssistant } from "@/lib/vapi"
import { buildSystemPrompt, SMART_MODE_SUFFIX } from "@/lib/agent-prompts"
import { addMinutes } from "date-fns"

async function resolveBusinessId(call: Record<string, unknown>): Promise<string | undefined> {
  const metaId = (call.metadata as Record<string, unknown> | undefined)?.businessId as string | undefined
  if (metaId) return metaId

  const assistantId = call.assistantId as string | undefined
  if (assistantId) {
    const { data } = await supabaseAdmin
      .from("businesses")
      .select("id")
      .eq("vapi_assistant_id", assistantId)
      .maybeSingle()
    if (data?.id) return data.id
  }

  const phoneNumberId = call.phoneNumberId as string | undefined
  if (phoneNumberId) {
    // Use containedBy JSON filter instead of loading all businesses
    const { data: rows } = await supabaseAdmin
      .from("businesses")
      .select("id")
      .contains("ai_config", { vapi_phone_number_id: phoneNumberId })
      .limit(1)
    if (rows?.[0]?.id) return rows[0].id
  }

  return undefined
}

async function checkAndApplySmartMode(businessId: string) {
  const month = new Date().toISOString().slice(0, 7)

  const [{ data: usage }, { data: sub }, { data: biz }] = await Promise.all([
    supabaseAdmin
      .from("billing_usage")
      .select("minutes_used")
      .eq("business_id", businessId)
      .eq("month", month)
      .maybeSingle(),
    supabaseAdmin
      .from("subscriptions")
      .select("calls_limit")
      .eq("business_id", businessId)
      .maybeSingle(),
    supabaseAdmin
      .from("businesses")
      .select("vapi_assistant_id, system_prompt, ai_config, name, agent_name")
      .eq("id", businessId)
      .single(),
  ])

  if (!biz?.vapi_assistant_id || !sub?.calls_limit) return

  const minutesUsed = (usage?.minutes_used as number) || 0
  const minutesIncluded = sub.calls_limit
  const ratio = minutesUsed / minutesIncluded

  const aiConfig = (biz.ai_config as Record<string, unknown>) || {}
  const currentMode = (aiConfig.optimization_mode as number) || 0
  const targetMode = ratio >= 0.70 ? 1 : 0

  if (targetMode === currentMode) return

  const basePrompt = (biz.system_prompt as string) || buildSystemPrompt(biz.name as string, biz.agent_name as string)
  const finalPrompt = targetMode === 1 ? basePrompt + SMART_MODE_SUFFIX : basePrompt

  await Promise.all([
    updateVapiAssistant(biz.vapi_assistant_id, { systemPrompt: finalPrompt }),
    supabaseAdmin.from("businesses")
      .update({ ai_config: { ...aiConfig, optimization_mode: targetMode } })
      .eq("id", businessId),
  ])
}


export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { message } = body

    if (!message) return NextResponse.json({ result: null })

    const { type } = message
    const call = (message.call || message.artifact?.call || {}) as Record<string, unknown>

    const businessId = await resolveBusinessId(call)

    switch (type) {
      case "status-update": {
        const status = message.status as string | undefined
        if (status === "in-progress") {
          if (!call?.id || !businessId) break
          await supabaseAdmin.from("calls").upsert({
            id: call.id,
            business_id: businessId,
            vapi_call_id: call.id,
            status: "in_progress",
            caller_number: (call.customer as Record<string, unknown> | undefined)?.number || null,
            started_at: call.startedAt || new Date().toISOString(),
          }, { onConflict: "vapi_call_id" })

          // Non-blocking: check usage and activate smart mode if needed
          checkAndApplySmartMode(businessId).catch(() => {})
        }
        break
      }

      case "end-of-call-report": {
        if (!call?.id || !businessId) break

        const duration = call.endedAt && call.startedAt
          ? Math.round((new Date(call.endedAt as string).getTime() - new Date(call.startedAt as string).getTime()) / 1000)
          : null

        const analysis = (message.analysis || call.analysis) as Record<string, unknown> | undefined

        await supabaseAdmin.from("calls").upsert({
          id: call.id,
          business_id: businessId,
          vapi_call_id: call.id,
          status: message.endedReason === "assistant-ended-call" ? "completed" : (message.endedReason || call.endedReason || "completed"),
          caller_number: (call.customer as Record<string, unknown> | undefined)?.number || null,
          started_at: call.startedAt || null,
          ended_at: call.endedAt || null,
          duration_seconds: duration,
          transcript: message.transcript || call.transcript || null,
          recording_url: call.recordingUrl || null,
          summary: analysis?.summary || null,
          sentiment: (analysis?.structuredData as Record<string, unknown> | undefined)?.sentiment || null,
          cost_cents: call.cost ? Math.round((call.cost as number) * 100) : null,
        }, { onConflict: "vapi_call_id" })

        await supabaseAdmin.rpc("increment_calls_used", { biz_id: businessId })

        // Track monthly usage
        if (duration !== null || call.cost) {
          const month = new Date().toISOString().slice(0, 7)
          const minutes = duration ? Math.ceil(duration / 60) : 0
          const costCents = call.cost ? Math.round((call.cost as number) * 100) : 0
          const { error: rpcError } = await supabaseAdmin.rpc("upsert_billing_usage", {
            p_business_id: businessId,
            p_month: month,
            p_minutes: minutes,
            p_cost_cents: costCents,
          })
          if (rpcError) {
            // Manual accumulation fallback
            const { data: existing } = await supabaseAdmin
              .from("billing_usage")
              .select("calls_count, minutes_used, estimated_cost_cents")
              .eq("business_id", businessId)
              .eq("month", month)
              .maybeSingle()

            await supabaseAdmin.from("billing_usage").upsert({
              business_id: businessId,
              month,
              calls_count: ((existing?.calls_count as number) || 0) + 1,
              minutes_used: ((existing?.minutes_used as number) || 0) + minutes,
              estimated_cost_cents: ((existing?.estimated_cost_cents as number) || 0) + costCents,
            }, { onConflict: "business_id,month" })
          }
        }
        break
      }

      case "function-call": {
        const { functionCall } = message
        if (!functionCall) break
        const result = await handleFunctionCall(functionCall, businessId, call)
        return NextResponse.json({ result })
      }

      case "tool-calls": {
        const toolCallList = message.toolCallList as Array<{
          id: string
          function: { name: string; arguments: string }
        }> | undefined
        if (!toolCallList?.length) break

        const results = await Promise.all(
          toolCallList.map(async (tc) => {
            const params = JSON.parse(tc.function.arguments || "{}")
            const result = await handleFunctionCall(
              { name: tc.function.name, parameters: params },
              businessId,
              call,
            )
            return { toolCallId: tc.id, result }
          })
        )
        return NextResponse.json({ results })
      }

      default:
        break
    }

    return NextResponse.json({ result: null })
  } catch (err) {
    console.error("Vapi webhook error:", err)
    return NextResponse.json({ result: null })
  }
}

async function handleFunctionCall(
  functionCall: { name: string; parameters: Record<string, unknown> },
  businessId?: string,
  call?: Record<string, unknown>,
) {
  const { name, parameters } = functionCall

  if (name === "checkAvailability") {
    const { date, service_id } = parameters as { date: string; service_id?: string }
    if (!businessId) return { available: false, message: "Negocio no encontrado" }

    let duration = 60
    if (service_id) {
      const { data: svc } = await supabaseAdmin
        .from("services").select("duration").eq("id", service_id).single()
      if (svc) duration = svc.duration
    }

    const dayStart = new Date(date)
    dayStart.setHours(8, 0, 0, 0)
    const dayEnd = new Date(date)
    dayEnd.setHours(20, 0, 0, 0)

    const { data: existing } = await supabaseAdmin
      .from("appointments")
      .select("scheduled_at, ends_at")
      .eq("business_id", businessId)
      .gte("scheduled_at", dayStart.toISOString())
      .lte("scheduled_at", dayEnd.toISOString())
      .neq("status", "cancelled")

    const slots: string[] = []
    let cursor = new Date(dayStart)
    while (cursor < dayEnd) {
      const slotEnd = addMinutes(cursor, duration)
      const overlap = (existing || []).some((appt) => {
        const s = new Date(appt.scheduled_at)
        const e = new Date(appt.ends_at)
        return cursor < e && slotEnd > s
      })
      if (!overlap) slots.push(cursor.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" }))
      cursor = addMinutes(cursor, 30)
    }

    return { available: slots.length > 0, slots: slots.slice(0, 6) }
  }

  if (name === "bookAppointment") {
    const { customer_name, customer_phone, customer_email, scheduled_at, service_id, notes } =
      parameters as Record<string, string>

    if (!businessId) return { success: false, message: "Negocio no encontrado" }

    let duration = 60
    let serviceName = "Cita"
    if (service_id) {
      const { data: svc } = await supabaseAdmin
        .from("services").select("duration, name").eq("id", service_id).single()
      if (svc) { duration = svc.duration; serviceName = svc.name }
    }

    const scheduledDate = new Date(scheduled_at)
    const endsAt = addMinutes(scheduledDate, duration)

    const { data, error } = await supabaseAdmin.from("appointments").insert({
      business_id: businessId,
      service_id: service_id || null,
      customer_name,
      customer_phone,
      customer_email: customer_email || null,
      notes: notes || null,
      scheduled_at: scheduledDate.toISOString(),
      ends_at: endsAt.toISOString(),
      status: "confirmed",
    }).select().single()

    if (error) return { success: false, message: error.message }

    const { data: biz } = await supabaseAdmin
      .from("businesses")
      .select("name, google_calendar_token")
      .eq("id", businessId)
      .single()

    if (biz?.google_calendar_token) {
      try {
        await createCalendarEvent(biz.google_calendar_token as Parameters<typeof createCalendarEvent>[0], {
          summary: `${serviceName} — ${customer_name}`,
          description: [
            `Cliente: ${customer_name}`,
            customer_phone ? `Teléfono: ${customer_phone}` : null,
            customer_email ? `Email: ${customer_email}` : null,
            notes ? `Notas: ${notes}` : null,
          ].filter(Boolean).join("\n"),
          startDateTime: scheduledDate.toISOString(),
          endDateTime: endsAt.toISOString(),
          attendeeEmail: customer_email || undefined,
        })
      } catch (e) {
        console.error("Google Calendar event creation failed:", e)
      }
    }

    return { success: true, appointment_id: data.id, message: `Cita confirmada para ${customer_name}` }
  }

  if (name === "captureLead") {
    const { name: lead_name, phone, email, interest, notes } = parameters as Record<string, string>
    if (!businessId) return { success: false }

    await supabaseAdmin.from("leads").insert({
      business_id: businessId,
      name: lead_name,
      phone: phone || null,
      email: email || null,
      interest: interest || null,
      notes: notes || null,
      source: "vapi_call",
    })

    return { success: true, message: `Lead capturado: ${lead_name}` }
  }

  if (name === "getBusinessInfo") {
    if (!businessId) return {}
    const { data } = await supabaseAdmin
      .from("businesses")
      .select("name, address, phone, description, ai_config")
      .eq("id", businessId)
      .single()
    return data || {}
  }

  return { error: `Unknown function: ${name}` }
}
