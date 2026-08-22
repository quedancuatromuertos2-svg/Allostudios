import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { getPanelContext } from '@/lib/panel'

export const runtime = 'nodejs'

const ROLES = ['admin', 'comercial', 'cliente']

async function soloAdmin() {
  const ctx = await getPanelContext()
  if (!ctx?.member || !ctx.member.active || ctx.member.role !== 'admin') return null
  return ctx.member
}

// Dar de alta a alguien por email. Puede entrar antes incluso de registrarse:
// cuando se cree la cuenta con ese email, el panel la reconoce sola.
export async function POST(req: NextRequest) {
  const admin = await soloAdmin()
  if (!admin) return NextResponse.json({ error: 'Solo el admin' }, { status: 403 })

  const body = await req.json().catch(() => ({}))
  const email = String(body?.email || '').trim().toLowerCase()
  const name = String(body?.name || '').trim().slice(0, 80) || null
  const role = ROLES.includes(String(body?.role)) ? String(body.role) : 'comercial'

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Ese email no es válido' }, { status: 400 })
  }

  const { data, error } = await supabaseAdmin
    .from('panel_members')
    .insert({ email, name, role, workspace: admin.workspace })
    .select('*')
    .single()

  if (error) {
    const yaEsta = error.code === '23505'
    return NextResponse.json(
      { error: yaEsta ? 'Ese email ya está dado de alta' : error.message },
      { status: yaEsta ? 409 : 500 },
    )
  }
  return NextResponse.json({ ok: true, member: data })
}

// Cambiar rol o desactivar a alguien
export async function PATCH(req: NextRequest) {
  const admin = await soloAdmin()
  if (!admin) return NextResponse.json({ error: 'Solo el admin' }, { status: 403 })

  const body = await req.json().catch(() => ({}))
  const id = String(body?.id || '')
  if (!id) return NextResponse.json({ error: 'Falta el id' }, { status: 400 })
  if (id === admin.id && (body.role !== undefined || body.active === false)) {
    return NextResponse.json({ error: 'No puedes quitarte a ti mismo el acceso' }, { status: 400 })
  }

  const cambios: Record<string, unknown> = {}
  if (body.role !== undefined) {
    if (!ROLES.includes(String(body.role))) return NextResponse.json({ error: 'Rol no válido' }, { status: 400 })
    cambios.role = String(body.role)
  }
  if (body.active !== undefined) cambios.active = Boolean(body.active)
  if (!Object.keys(cambios).length) return NextResponse.json({ error: 'Nada que cambiar' }, { status: 400 })

  const { error } = await supabaseAdmin
    .from('panel_members')
    .update(cambios)
    .eq('id', id)
    .eq('workspace', admin.workspace)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

// Quitar a alguien del equipo (sus leads quedan sin asignar)
export async function DELETE(req: NextRequest) {
  const admin = await soloAdmin()
  if (!admin) return NextResponse.json({ error: 'Solo el admin' }, { status: 403 })

  const id = req.nextUrl.searchParams.get('id') || ''
  if (!id) return NextResponse.json({ error: 'Falta el id' }, { status: 400 })
  if (id === admin.id) return NextResponse.json({ error: 'No puedes borrarte a ti mismo' }, { status: 400 })

  const { data: quien } = await supabaseAdmin
    .from('panel_members').select('email, clerk_id').eq('id', id).eq('workspace', admin.workspace).maybeSingle()

  if (quien) {
    await supabaseAdmin
      .from('captador_leads')
      .update({ owner_clerk_id: null, owner_email: null })
      .eq('workspace', admin.workspace)
      .eq('owner_email', quien.email)
  }

  const { error } = await supabaseAdmin
    .from('panel_members').delete().eq('id', id).eq('workspace', admin.workspace)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
