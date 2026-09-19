/*  Reglas de comisión de los comerciales (20/09/2026):
      - Escalera SEMANAL (lunes a domingo, hora de Madrid), se reinicia cada semana:
          venta 1.ª y 2.ª → 20 % · 3.ª y 4.ª → 25 % · 5.ª en adelante → 30 %.
      - El % se fija al pagar la primera cuota y se aplica a todas las cuotas de ese cliente
        durante sus 12 primeros meses (`pedidos.comision_pct`).
      - Cada cuota cobrada (invoice.paid) genera una fila en `comisiones`; el día 5 se liquida el mes.
    Es la única fuente de verdad: la calculadora de /afiliados y el panel leen de aquí.           */

import { supabaseAdmin } from '@/lib/supabase'

export { ESCALERA, MESES_COMISION, DIA_PAGO, pctParaVenta } from './comisiones-reglas'
import { MESES_COMISION, pctParaVenta } from './comisiones-reglas'

/* Semana ISO (lunes-domingo) en hora de Madrid: '2026-W39' */
export function semanaISO(fecha: Date = new Date()) {
  const f = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Madrid', year: 'numeric', month: '2-digit', day: '2-digit' }).format(fecha) // AAAA-MM-DD
  const [y, m, d] = f.split('-').map(Number)
  const dt = new Date(Date.UTC(y, m - 1, d))
  const dia = dt.getUTCDay() || 7                 // lunes=1 … domingo=7
  dt.setUTCDate(dt.getUTCDate() + 4 - dia)        // jueves de esa semana
  const anio = dt.getUTCFullYear()
  const primero = new Date(Date.UTC(anio, 0, 1))
  const semana = Math.ceil(((dt.getTime() - primero.getTime()) / 86400000 + 1) / 7)
  return `${anio}-W${String(semana).padStart(2, '0')}`
}

export const mesDe = (fecha: Date = new Date()) => new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Madrid', year: 'numeric', month: '2-digit' }).format(fecha).slice(0, 7)

/* Al pagar la primera cuota: cuenta las ventas del comercial esa semana y fija el % de este pedido */
export async function fijarComisionVenta(pedidoId: string, comercial: string, pagadoAt: Date) {
  const semana = semanaISO(pagadoAt)
  const { count } = await supabaseAdmin.from('pedidos').select('id', { count: 'exact', head: true })
    .eq('comercial', comercial).eq('semana_venta', semana).eq('estado', 'pagado').neq('id', pedidoId)
  const numero = (count || 0) + 1
  const pct = pctParaVenta(numero)
  await supabaseAdmin.from('pedidos').update({ comision_pct: pct, semana_venta: semana }).eq('id', pedidoId)
  return { numero, pct, semana }
}

/* Cada cuota cobrada → una comisión (idempotente por invoice). Devuelve null si no hay comercial o ya van 12. */
export async function registrarCuota(opts: { pedidoId: string; stripeInvoiceId: string; baseCent: number; cobradoAt: Date }) {
  const { data: p } = await supabaseAdmin.from('pedidos').select('id, comercial, comision_pct').eq('id', opts.pedidoId).maybeSingle()
  if (!p?.comercial || !p.comision_pct) return null
  const { count } = await supabaseAdmin.from('comisiones').select('id', { count: 'exact', head: true }).eq('pedido_id', p.id)
  const numero = (count || 0) + 1
  if (numero > MESES_COMISION) return null
  const importe = Math.round(opts.baseCent * Number(p.comision_pct) / 100)
  const fila = { pedido_id: p.id, comercial: p.comercial, stripe_invoice_id: opts.stripeInvoiceId, numero_cuota: numero, base_cent: opts.baseCent, pct: p.comision_pct, importe_cent: importe, mes: mesDe(opts.cobradoAt), cobrado_at: opts.cobradoAt.toISOString() }
  const { error } = await supabaseAdmin.from('comisiones').insert(fila)
  if (error && !/duplicate|unique/i.test(error.message)) throw error
  return error ? null : fila
}

/* Cierre de un mes: una liquidación por comercial con lo acumulado. Idempotente. */
export async function cerrarMes(mes: string) {
  const { data: filas } = await supabaseAdmin.from('comisiones').select('id, comercial, importe_cent').eq('mes', mes).is('liquidacion_id', null)
  const por = new Map<string, { total: number; ids: string[] }>()
  for (const f of filas || []) { const a = por.get(f.comercial) || { total: 0, ids: [] }; a.total += f.importe_cent; a.ids.push(f.id); por.set(f.comercial, a) }
  const hechas: { comercial: string; total_cent: number; cuotas: number }[] = []
  for (const [comercial, a] of Array.from(por.entries())) {
    const { data: liq } = await supabaseAdmin.from('liquidaciones').upsert({ comercial, mes, total_cent: a.total, cuotas: a.ids.length }, { onConflict: 'comercial,mes' }).select('id').single()
    if (liq?.id) await supabaseAdmin.from('comisiones').update({ liquidacion_id: liq.id }).in('id', a.ids)
    hechas.push({ comercial, total_cent: a.total, cuotas: a.ids.length })
  }
  return hechas
}

/* Resumen para el panel de un comercial */
export async function resumenComercial(slug: string) {
  const semana = semanaISO(), mes = mesDe()
  const [ventasSemana, ventas, comisionesMes, liquidaciones] = await Promise.all([
    supabaseAdmin.from('pedidos').select('id', { count: 'exact', head: true }).eq('comercial', slug).eq('semana_venta', semana).eq('estado', 'pagado'),
    supabaseAdmin.from('pedidos').select('id, nombre, negocio, importe_cent, comision_pct, pagado_at, estado, semana_venta').eq('comercial', slug).not('pagado_at', 'is', null).order('pagado_at', { ascending: false }).limit(50),
    supabaseAdmin.from('comisiones').select('importe_cent, numero_cuota, mes, pedido_id').eq('comercial', slug).eq('mes', mes),
    supabaseAdmin.from('liquidaciones').select('mes, total_cent, cuotas, estado, pagada_at').eq('comercial', slug).order('mes', { ascending: false }).limit(12),
  ])
  const n = ventasSemana.count || 0
  return {
    semana, mes,
    ventasSemana: n,
    pctActual: pctParaVenta(n + 1),          // lo que cobraría la PRÓXIMA venta
    faltanPara: n < 2 ? { ventas: 3 - n, pct: 25 } : n < 4 ? { ventas: 5 - n, pct: 30 } : null,
    ventas: ventas.data || [],
    mesCent: (comisionesMes.data || []).reduce((t, c) => t + c.importe_cent, 0),
    cuotasMes: (comisionesMes.data || []).length,
    liquidaciones: liquidaciones.data || [],
  }
}

/* Ranking del mes (para cuando haya varios comerciales) */
export async function rankingMes(mes: string = mesDe()) {
  const { data } = await supabaseAdmin.from('pedidos').select('comercial, importe_cent').eq('estado', 'pagado').not('comercial', 'is', null).gte('pagado_at', `${mes}-01`)
  const por = new Map<string, { ventas: number; mrr: number }>()
  for (const p of data || []) { const a = por.get(p.comercial) || { ventas: 0, mrr: 0 }; a.ventas++; a.mrr += p.importe_cent; por.set(p.comercial, a) }
  return Array.from(por.entries()).map(([comercial, a]) => ({ comercial, ...a })).sort((a, b) => b.ventas - a.ventas || b.mrr - a.mrr)
}
