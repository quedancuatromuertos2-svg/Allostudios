import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { getMember } from '@/lib/panel'

export const runtime = 'nodejs'

const ESTADOS = ['nuevo', 'contactado', 'interesado', 'cliente', 'descartado']

// Actualiza un lead desde el panel. Un comercial solo puede tocar los suyos.
export async function PATCH(req: NextRequest) {
  const member = await getMember()
  if (!member || !member.active) return NextResponse.json({ error: 'Sin acceso' }, { status: 403 })

  const body = await req.json().catch(() => ({}))
  const id = String(body?.id || '')
  if (!id) return NextResponse.json({ error: 'Falta el id' }, { status: 400 })

  const cambios: Record<string, unknown> = { updated_at: new Date().toISOString() }

  if (body.status !== undefined) {
    const s = String(body.status)
    if (!ESTADOS.includes(s)) return NextResponse.json({ error: 'Estado no válido' }, { status: 400 })
    cambios.status = s
    if (s === 'contactado') cambios.contacted_at = new Date().toISOString()
  }
  if (body.notes !== undefined) cambios.notes = String(body.notes).slice(0, 2000)

  // Reasignar un lead a otro comercial es cosa del admin
  if (body.owner_email !== undefined) {
    if (member.role !== 'admin') return NextResponse.json({ error: 'Solo el admin asigna' }, { status: 403 })
    const email = String(body.owner_email).trim().toLowerCase()
    cambios.owner_email = email || null
    const { data: destino } = await supabaseAdmin
      .from('panel_members').select('clerk_id').eq('email', email).maybeSingle()
    cambios.owner_clerk_id = destino?.clerk_id || null
  }

  let q = supabaseAdmin.from('captador_leads').update(cambios).eq('id', id).eq('workspace', member.workspace)
  if (member.role !== 'admin') {
    q = q.or(`owner_clerk_id.eq.${member.clerk_id},owner_email.eq.${member.email}`)
  }

  const { data, error } = await q.select('id').maybeSingle()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  if (!data) return NextResponse.json({ error: 'Ese lead no es tuyo' }, { status: 404 })

  return NextResponse.json({ ok: true })
}
