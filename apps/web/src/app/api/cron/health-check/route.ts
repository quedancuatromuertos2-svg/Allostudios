import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"
import { vapiRequest } from "@/lib/vapi"
import { provision } from "@/lib/provisioner"
import { sendAlertEmail } from "@/lib/email"

// Vercel Cron — health-check de los bots que están REALMENTE en producción.
// Detecta caídas, auto-repara lo conocido y avisa por email SOLO si algo
// quedó roto y no se pudo arreglar (con anti-spam por cooldown).
// Auth: Bearer CRON_SECRET (Vercel Cron lo envía). También permite el header de Vercel o ?secret=.

// Un ID de Vapi siempre es un UUID. Un negocio sólo está "vivo" y se monitoriza
// si tiene asistente Y número con IDs válidos. Lo demás = aún no aprovisionado
// (estado conocido, no es una incidencia) y se ignora para no generar ruido.
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const isVapiId = (v: unknown): v is string => typeof v === "string" && UUID.test(v)

// Cooldown anti-spam: no reenviar la misma incidencia más de una vez cada 6 h.
// Usa la tabla opcional `monitor_state`; si no existe, degrada sin romper.
const COOLDOWN_MS = 6 * 60 * 60 * 1000
async function shouldSendAlert(fingerprint: string): Promise<boolean> {
  try {
    const { data } = await supabaseAdmin
      .from("monitor_state")
      .select("fingerprint, last_sent_at")
      .eq("id", "health-check")
      .maybeSingle()
    const last = data?.last_sent_at ? new Date(data.last_sent_at).getTime() : 0
    const same = data?.fingerprint === fingerprint
    if (same && Date.now() - last < COOLDOWN_MS) return false // mismo fallo y dentro del cooldown → callar
    await supabaseAdmin
      .from("monitor_state")
      .upsert({ id: "health-check", fingerprint, last_sent_at: new Date().toISOString() })
    return true
  } catch {
    return true // sin tabla de estado: el filtro de arriba ya evita el ruido habitual
  }
}

export async function GET(req: Request) {
  const auth = req.headers.get("authorization")
  const isVercelCron = req.headers.get("x-vercel-cron") !== null
  const urlSecret = new URL(req.url).searchParams.get("secret")
  const secret = process.env.CRON_SECRET
  const authorized = isVercelCron || auth === `Bearer ${secret}` || urlSecret === secret
  if (!authorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const issues: string[] = []
  const repairs: string[] = []
  let checked = 0
  let skipped = 0

  const { data: businesses } = await supabaseAdmin
    .from("businesses")
    .select("id, name, vapi_assistant_id, ai_config, is_active, subscriptions(status)")

  for (const biz of businesses || []) {
    // Sólo negocios en producción
    if (biz.is_active === false) { skipped++; continue }
    const subs = (biz.subscriptions as Array<{ status: string }> | null) || []
    const status = subs[0]?.status?.toLowerCase()
    if (status && !["active", "trialing"].includes(status)) { skipped++; continue }

    const cfg = (biz.ai_config as Record<string, unknown>) || {}
    const assistantId = biz.vapi_assistant_id
    const phoneId = cfg.vapi_phone_number_id

    // Negocio aún no aprovisionado (sin IDs válidos) → no es una caída, se ignora.
    if (!isVapiId(assistantId) || !isVapiId(phoneId)) { skipped++; continue }

    checked++

    // ¿Sigue vivo el asistente en Vapi?
    let assistantOk = false
    try { await vapiRequest(`/assistant/${assistantId}`); assistantOk = true } catch {}

    // ¿Sigue activo el número en Vapi?
    let phoneOk = false
    try {
      const ph = await vapiRequest(`/phone-number/${phoneId}`)
      phoneOk = !!(ph && (ph.status === "active" || ph.number))
    } catch {}

    if (assistantOk && phoneOk) continue // bot sano

    // Caído → intentar auto-reparar. Sólo es incidencia si la reparación falla.
    try {
      const r = await provision(biz.id)
      if (r.ok) repairs.push(`${biz.name}: bot caído y re-aprovisionado automáticamente`)
      else issues.push(`${biz.name}: bot caído y NO se pudo reparar (${r.error || "desconocido"})`)
    } catch (e) {
      issues.push(`${biz.name}: bot caído, error al reparar (${e instanceof Error ? e.message : "?"})`)
    }
  }

  // Avisar por email SOLO si hay incidencias reales sin resolver, respetando el cooldown.
  let alerted = false
  if (issues.length > 0) {
    const fingerprint = [...issues].sort().join(" | ")
    if (await shouldSendAlert(fingerprint)) {
      try {
        await sendAlertEmail(`⚠️ AlloStudios: ${issues.length} bot(s) caído(s)`, issues, repairs)
        alerted = true
      } catch {}
    }
  }

  return NextResponse.json({
    checked,
    skipped,
    issues_count: issues.length,
    repairs_count: repairs.length,
    alerted,
    issues,
    repairs,
    timestamp: new Date().toISOString(),
  })
}
