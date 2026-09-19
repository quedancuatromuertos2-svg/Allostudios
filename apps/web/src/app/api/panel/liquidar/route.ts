import { NextRequest, NextResponse } from 'next/server'
import { getPanelContext } from '@/lib/panel'
import { cerrarMes } from '@/lib/comisiones'
import { supabaseAdmin } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

/*  Cierre de mes de comisiones (solo admin): crea las liquidaciones del mes y devuelve un CSV con
    una fila por comercial (slug, nombre, email, NIF, IBAN, cuotas, total) para pagarles contra factura.
    GET ?mes=AAAA-MM → CSV de un mes ya cerrado · POST ?mes=AAAA-MM → cierra y devuelve el CSV.    */

async function csvDe(mes: string) {
  const { data: liqs } = await supabaseAdmin.from('liquidaciones').select('comercial, total_cent, cuotas, estado').eq('mes', mes)
  const { data: miembros } = await supabaseAdmin.from('panel_members').select('slug, name, email, nif, iban')
  const m = new Map((miembros || []).map((x) => [x.slug, x]))
  const filas = [['mes', 'comercial', 'nombre', 'email', 'nif', 'iban', 'cuotas', 'total_eur', 'estado']]
  for (const l of liqs || []) {
    const p = m.get(l.comercial)
    filas.push([mes, l.comercial, p?.name || '', p?.email || '', p?.nif || '', p?.iban || '', String(l.cuotas), (l.total_cent / 100).toFixed(2).replace('.', ','), l.estado])
  }
  return filas.map((f) => f.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(';')).join('\r\n')
}

async function admin() {
  const ctx = await getPanelContext()
  return ctx?.member?.active && ctx.member.role === 'admin'
}

export async function GET(req: NextRequest) {
  if (!(await admin())) return NextResponse.json({ error: 'Solo admin' }, { status: 403 })
  const mes = req.nextUrl.searchParams.get('mes') || ''
  if (!/^\d{4}-\d{2}$/.test(mes)) return NextResponse.json({ error: 'mes=AAAA-MM' }, { status: 400 })
  return new NextResponse('﻿' + (await csvDe(mes)), { headers: { 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': `attachment; filename="liquidaciones-${mes}.csv"` } })
}

export async function POST(req: NextRequest) {
  if (!(await admin())) return NextResponse.json({ error: 'Solo admin' }, { status: 403 })
  const mes = req.nextUrl.searchParams.get('mes') || ''
  if (!/^\d{4}-\d{2}$/.test(mes)) return NextResponse.json({ error: 'mes=AAAA-MM' }, { status: 400 })
  await cerrarMes(mes)
  return new NextResponse('﻿' + (await csvDe(mes)), { headers: { 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': `attachment; filename="liquidaciones-${mes}.csv"` } })
}
