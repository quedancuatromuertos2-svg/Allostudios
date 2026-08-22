import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { getPanelContext } from '@/lib/panel'
import { cfg, places, quality, analizarLead, filaDesdeLead } from '@/lib/captador/motor'

export const runtime = 'nodejs'
export const maxDuration = 60

// Presupuesto de tiempo: la petición muere a los 60 s, así que dejamos de
// analizar webs a los 38 s y el resto se queda pendiente para /api/panel/analizar.
const PRESUPUESTO_MS = 38_000

// Busca un sector en una zona con Google Places y mete los negocios nuevos en el panel.
export async function POST(req: NextRequest) {
  const ctx = await getPanelContext()
  const member = ctx?.member
  if (!member || !member.active || member.role !== 'admin') {
    return NextResponse.json({ error: 'Solo el admin busca' }, { status: 403 })
  }

  const body = await req.json().catch(() => ({}))
  const sector = String(body?.sector || '')
  const zona = String(body?.zona || 'valencia')

  if (!cfg.SECTORS[sector]) return NextResponse.json({ error: 'Sector no válido' }, { status: 400 })
  if (!cfg.ZONES[zona]) return NextResponse.json({ error: 'Zona no válida' }, { status: 400 })
  if (!process.env.GOOGLE_PLACES_KEY) {
    return NextResponse.json({ error: 'Falta la clave de Google Places' }, { status: 503 })
  }

  let encontrados: Record<string, unknown>[] = []
  try {
    encontrados = await places.fetchSector(sector, zona)
  } catch (e) {
    return NextResponse.json(
      { error: `Google Places falló: ${e instanceof Error ? e.message : 'error'}` },
      { status: 502 },
    )
  }

  // Fuera cadenas y franquicias: no le compran una web a un desconocido.
  const utiles = encontrados.filter((l) => !quality.isChain(l))

  const ids = utiles.map((l) => String(l.id)).filter(Boolean)
  const yaEstan = new Set<string>()
  for (let i = 0; i < ids.length; i += 300) {
    const { data } = await supabaseAdmin
      .from('captador_leads')
      .select('external_id')
      .eq('workspace', member.workspace)
      .in('external_id', ids.slice(i, i + 300))
    ;(data || []).forEach((r) => yaEstan.add(r.external_id))
  }

  const nuevos = utiles.filter((l) => !yaEstan.has(String(l.id))).slice(0, cfg.MAX_NEW_PER_SEARCH)
  if (!nuevos.length) {
    return NextResponse.json({
      ok: true, encontrados: encontrados.length, nuevos: 0, yaEstaban: yaEstan.size, pendientes: 0,
    })
  }

  // Analiza primero los que NO tienen web (instantáneos y además los mejores
  // para vender una web), y con el tiempo que sobre, los que sí la tienen.
  const orden = [...nuevos].sort((a, b) => (a.website ? 1 : 0) - (b.website ? 1 : 0))
  const limite = Date.now() + PRESUPUESTO_MS
  let analizados = 0

  await pool(orden, cfg.ANALYZE_CONCURRENCY || 6, async (lead) => {
    if (Date.now() > limite) return
    await analizarLead(lead)
    analizados++
  })

  const filas = orden.map((l) => filaDesdeLead(l, { workspace: member.workspace, sector }))

  const { error } = await supabaseAdmin
    .from('captador_leads')
    .upsert(filas, { onConflict: 'workspace,external_id', ignoreDuplicates: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const tiers: Record<string, number> = { A: 0, B: 0, C: 0 }
  filas.forEach((f) => { if (f.tier) tiers[f.tier] = (tiers[f.tier] || 0) + 1 })

  return NextResponse.json({
    ok: true,
    encontrados: encontrados.length,
    nuevos: filas.length,
    yaEstaban: yaEstan.size,
    analizados,
    pendientes: filas.length - analizados,
    conTelefono: filas.filter((f) => f.phone).length,
    sinWeb: filas.filter((f) => !f.website).length,
    tiers,
  })
}

// Sectores y zonas para los desplegables del panel
export async function GET() {
  const ctx = await getPanelContext()
  if (!ctx?.member || ctx.member.role !== 'admin') {
    return NextResponse.json({ error: 'Solo el admin' }, { status: 403 })
  }
  return NextResponse.json({
    sectores: Object.entries(cfg.SECTORS).map(([k, v]) => ({ k, label: (v as { label: string }).label })),
    zonas: Object.entries(cfg.ZONES).map(([k, v]) => ({ k, label: (v as { label: string }).label })),
  })
}

// Ejecuta fn sobre la lista con como mucho n en paralelo.
async function pool<T>(items: T[], n: number, fn: (item: T) => Promise<void>) {
  let i = 0
  const workers = Array.from({ length: Math.min(n, items.length) }, async () => {
    while (i < items.length) {
      const item = items[i++]
      try { await fn(item) } catch { /* un lead que falla no tumba la búsqueda */ }
    }
  })
  await Promise.all(workers)
}
