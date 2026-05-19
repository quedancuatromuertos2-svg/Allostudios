import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"
import { addMinutes } from "date-fns"

export async function POST(req: Request) {
  const body = await req.json()
  const { message } = body

  if (!message) return NextResponse.json({ result: null })

  const { type, call } = message

  if (!call?.id) return NextResponse.json({ result: null })

  const businessId = call.metadata?.businessId as string | undefined

  switch (type) {
    case "call-started": {
      if (!businessId) break
      await supabaseAdmin.from("calls").upsert({
        id: call.id,
        business_id: businessId,
        vapi_call_id: call.id,
        status: "in_progress",
        caller_number: call.customer?.number || null,
        started_at: call.startedAt || new Date().toISOString(),
      }, { onConflict: "vapi_call_id" })
      break
    }

    case "call-ended": {
      if (!businessId) break
      const duration = call.endedAt && call.startedAt
        ? Math.round((new Date(call.endedAt).getTime() - new Date(call.startedAt).getTime()) / 1000)
        : null

      await supabaseAdmin.from("calls").upsert({
        id: call.id,
        business_id: businessId,
        vapi_call_id: call.id,
        status: call.endedReason === "assistant-ended-call" ? "completed" : (call.endedReason || "completed"),
        caller_number: call.customer?.number || null,
        started_at: call.startedAt || null,
        ended_at: call.endedAt || null,
        duration_seconds: duration,
        transcript: call.transcript || null,
        recording_url: call.recordingUrl || null,
        summary: call.analysis?.summary || null,
        sentiment: call.analysis?.structuredData?.sentiment || null,
        cost_cents: call.cost ? Math.round(call.cost * 100) : null,
      }, { onConflict: "vapi_call_id" })

      if (businessId) {
        await supabaseAdmin.rpc("increment_calls_used", { biz_id: businessId })
      }
      break
    }

    case "function-call": {
      const { functionCall } = message
      if (!functionCall) break

      const result = await handleFunctionCall(functionCall, businessId)
      return NextResponse.json({ result })
    }

    default:
      break
  }

  return NextResponse.json({ result: null })
}

async function handleFunctionCall(
  functionCall: { name: string; parameters: Record<string, unknown> },
  businessId?: string,
) {
  const { name, parameters } = functionCall

  if (name === "checkAvailability") {
    const { date, service_id } = parameters as { date: string; service_id?: string }
    if (!businessId) return { available: false, message: "Business not found" }

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

    if (!businessId) return { success: false, message: "Business not found" }

    let duration = 60
    if (service_id) {
      const { data: svc } = await supabaseAdmin
        .from("services").select("duration").eq("id", service_id).single()
      if (svc) duration = svc.duration
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
