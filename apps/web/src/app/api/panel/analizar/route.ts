import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { getPanelContext } from '@/lib/panel'
import { analizarLead, filaDesdeLead, cfg } from '@/lib/captador/motor'

export const runtime = 'nodejs'
export const maxDuration = 60

// Los que no tienen web se analizan al instante, asi que caben muchos por tanda;
// el presupuesto de tiempo corta solo cuando toca bajarse webs de verdad.
const TANDA = 60
const PRESUPUESTO_MS = 40_000

// Analiza la web de los leads que quedaron pendientes en la búsqueda: saca
// problemas reales, contacto escondido en la web y la puntuación buena.
// Va por tandas para no pasarse del tiempo máximo; el panel lo llama en bucle.
export async function POST() {
  const ctx = await getPanelContext()
  const member = ctx?.member
  if (!member || !member.active || member.role !== 'admin') {
    return NextResponse.json({ error: 'Solo el admin' }, { status: 403 })
  }

  const { data: pendientes } = await supabaseAdmin
    .from('captador_leads')
    .select('id, external_id, name, sector, sector_label, phone, website, instagram, address, city, lat, lon, rating, reviews')
    .eq('workspace', member.workspace)
    .is('analyzed_at', null)
    .neq('status', 'descartado')
    .order('website', { ascending: true, nullsFirst: true })
    .limit(TANDA)

  if (!pendientes?.length) {
    return NextResponse.json({ ok: true, analizados: 0, quedan: 0 })
  }

  const limite = Date.now() + PRESUPUESTO_MS
  let hechos = 0

  await pool(pendientes, cfg.ANALYZE_CONCURRENCY || 6, async (row) => {
    if (Date.now() > limite) return
    const lead: Record<string, unknown> = { ...row, id: row.external_id }
    await analizarLead(lead)
    const fila = filaDesdeLead(lead, { workspace: member.workspace, sector: row.sector || undefined })

    // Solo lo que sale del análisis: ni tocamos estado, ni notas, ni asignación.
    await supabaseAdmin
      .from('captador_leads')
      .update({
        score: fila.score,
        tier: fila.tier,
        problems: fila.problems,
        hook: fila.hook,
        message: fila.message,
        email: fila.email,
        phone: fila.phone || row.phone,
        instagram: fila.instagram || row.instagram,
        analyzed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', row.id)
    hechos++
  })

  const { count } = await supabaseAdmin
    .from('captador_leads')
    .select('id', { count: 'exact', head: true })
    .eq('workspace', member.workspace)
    .is('analyzed_at', null)
    .neq('status', 'descartado')

  return NextResponse.json({ ok: true, analizados: hechos, quedan: count ?? 0 })
}

// Cuántos quedan sin analizar (para pintar el aviso en el panel)
export async function GET() {
  const ctx = await getPanelContext()
  if (!ctx?.member || ctx.member.role !== 'admin') {
    return NextResponse.json({ error: 'Solo el admin' }, { status: 403 })
  }
  const { count } = await supabaseAdmin
    .from('captador_leads')
    .select('id', { count: 'exact', head: true })
    .eq('workspace', ctx.member.workspace)
    .is('analyzed_at', null)
    .neq('status', 'descartado')
  return NextResponse.json({ quedan: count ?? 0 })
}

async function pool<T>(items: T[], n: number, fn: (item: T) => Promise<void>) {
  let i = 0
  const workers = Array.from({ length: Math.min(n, items.length) }, async () => {
    while (i < items.length) {
      const item = items[i++]
      try { await fn(item) } catch { /* un lead que falla no tumba la tanda */ }
    }
  })
  await Promise.all(workers)
}
