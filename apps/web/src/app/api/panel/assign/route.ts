import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { getPanelContext } from '@/lib/panel'

export const runtime = 'nodejs'
export const maxDuration = 60

// Reparto de leads entre el equipo. Sin esto un comercial entra y no ve nada,
// porque los leads llegan del Captador sin asignar.
export async function POST(req: NextRequest) {
  const ctx = await getPanelContext()
  const admin = ctx?.member
  if (!admin || !admin.active || admin.role !== 'admin') {
    return NextResponse.json({ error: 'Solo el admin reparte' }, { status: 403 })
  }

  const body = await req.json().catch(() => ({}))

  // ── Reparto automático: los leads sin dueño se dividen entre los comerciales ──
  if (body?.auto) {
    const { data: equipo } = await supabaseAdmin
      .from('panel_members')
      .select('email, clerk_id, role')
      .eq('workspace', admin.workspace)
      .eq('active', true)

    const destinatarios = (equipo || []).filter((m) => m.role === 'admin' || m.role === 'comercial')
    if (!destinatarios.length) return NextResponse.json({ error: 'No hay a quién asignar' }, { status: 400 })

    const { data: libres } = await supabaseAdmin
      .from('captador_leads')
      .select('id')
      .eq('workspace', admin.workspace)
      .is('owner_email', null)
      .neq('status', 'descartado')
      .order('score', { ascending: false, nullsFirst: false })
      .limit(2000)

    if (!libres?.length) return NextResponse.json({ ok: true, repartidos: 0 })

    // Reparto en abanico: el mejor lead al primero, el siguiente al segundo…
    // así nadie se queda con la peor mitad de la lista.
    const porPersona = new Map<string, string[]>()
    libres.forEach((l, i) => {
      const d = destinatarios[i % destinatarios.length]
      const arr = porPersona.get(d.email) || []
      arr.push(l.id)
      porPersona.set(d.email, arr)
    })

    let total = 0
    for (const [email, ids] of Array.from(porPersona.entries())) {
      const clerk = destinatarios.find((d) => d.email === email)?.clerk_id || null
      for (let i = 0; i < ids.length; i += 300) {
        const trozo = ids.slice(i, i + 300)
        const { error } = await supabaseAdmin
          .from('captador_leads')
          .update({ owner_email: email, owner_clerk_id: clerk, updated_at: new Date().toISOString() })
          .in('id', trozo)
        if (error) return NextResponse.json({ error: error.message }, { status: 500 })
        total += trozo.length
      }
    }
    return NextResponse.json({ ok: true, repartidos: total, entre: destinatarios.length })
  }

  // ── Asignar leads concretos a una persona (o dejarlos libres) ──
  const ids: string[] = Array.isArray(body?.ids) ? body.ids.slice(0, 500).map(String) : []
  if (!ids.length) return NextResponse.json({ error: 'Faltan los leads' }, { status: 400 })

  const email = String(body?.email || '').trim().toLowerCase()
  let clerk: string | null = null
  if (email) {
    const { data: destino } = await supabaseAdmin
      .from('panel_members')
      .select('clerk_id')
      .eq('email', email)
      .eq('workspace', admin.workspace)
      .maybeSingle()
    if (!destino) return NextResponse.json({ error: 'Esa persona no está en el equipo' }, { status: 400 })
    clerk = destino.clerk_id
  }

  const { error } = await supabaseAdmin
    .from('captador_leads')
    .update({ owner_email: email || null, owner_clerk_id: clerk, updated_at: new Date().toISOString() })
    .eq('workspace', admin.workspace)
    .in('id', ids)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true, asignados: ids.length })
}
