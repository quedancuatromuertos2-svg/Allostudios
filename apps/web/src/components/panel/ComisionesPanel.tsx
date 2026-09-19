import { ESCALERA, DIA_PAGO, resumenComercial, rankingMes, mesDe } from '@/lib/comisiones'
import { supabaseAdmin } from '@/lib/supabase'
import type { PanelMember } from '@/lib/panel'

/*  «Mis comisiones» en el panel: escalera de la semana, ventas, lo acumulado este mes y las
    liquidaciones. El admin ve además el ranking del mes y el cierre pendiente.               */

const eur = (c: number) => (c / 100).toLocaleString('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })
const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']
const nombreMes = (m: string) => `${MESES[Number(m.slice(5, 7)) - 1]} ${m.slice(0, 4)}`

export default async function ComisionesPanel({ member }: { member: PanelMember & { slug?: string | null } }) {
  // El slug es la identidad comercial (va en los enlaces ?c=slug). Si no lo tiene, se le propone uno.
  const slug = member.slug || ''
  const r = slug ? await resumenComercial(slug) : null
  const esAdmin = member.role === 'admin'
  const ranking = esAdmin ? await rankingMes() : []
  const { data: pendientes } = esAdmin
    ? await supabaseAdmin.from('comisiones').select('comercial, importe_cent, mes').is('liquidacion_id', null)
    : { data: [] as { comercial: string; importe_cent: number; mes: string }[] }
  const porCerrar = new Map<string, number>()
  for (const c of pendientes || []) if (c.mes < mesDe()) porCerrar.set(c.mes, (porCerrar.get(c.mes) || 0) + c.importe_cent)

  return (
    <section className="mb-10">
      <div className="flex items-end justify-between gap-4 mb-4">
        <div>
          <h2 className="font-display text-[1.5rem] font-semibold text-ink tracking-[-0.02em]">Mis comisiones</h2>
          <p className="text-[13px] text-dim mt-1">El 20 % de cada cuota durante 12 meses; más si cierras varias en la misma semana. Se paga el día {DIA_PAGO}, contra factura.</p>
        </div>
        {slug && <div className="text-right text-[12px] text-muted">Tu enlace: <span className="font-mono text-ink">allostudios.net/?c={slug}</span></div>}
      </div>

      {!slug ? (
        <div className="card p-6 text-[14px] text-dim">
          Todavía no tienes código de comercial. Pídele a Ángel que te ponga uno (p. ej. <span className="font-mono text-ink">fran</span>): tus ventas se atribuyen con el enlace <span className="font-mono">allostudios.net/?c=tu-código</span> o escribiéndolo en el pago.
        </div>
      ) : r && (
        <>
          {/* Escalera de la semana */}
          <div className="card p-5 md:p-6 mb-4">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div className="text-[11px] uppercase tracking-[0.16em] text-muted font-semibold">Esta semana ({r.semana}) · de lunes a domingo</div>
              <div className="text-[13px] text-dim">
                <strong className="text-ink">{r.ventasSemana}</strong> {r.ventasSemana === 1 ? 'venta' : 'ventas'} · la próxima va al <strong className="text-accent">{r.pctActual} %</strong>
                {r.faltanPara && <> · te {r.faltanPara.ventas === 1 ? 'falta' : 'faltan'} {r.faltanPara.ventas} para el {r.faltanPara.pct} %</>}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {ESCALERA.map((e, i) => {
                const activo = r.pctActual === e.pct
                const hecho = r.pctActual > e.pct
                return (
                  <div key={e.pct} className={`rounded-xl p-4 border ${activo ? 'border-accent bg-accent/10' : hecho ? 'border-emerald-300 bg-emerald-50' : 'border-border bg-surface'}`}>
                    <div className={`font-display text-[1.6rem] leading-none font-semibold tracking-[-0.03em] ${activo ? 'text-accent' : 'text-ink'}`}>{e.pct} %</div>
                    <div className="text-[12px] text-dim mt-1.5">{e.etiqueta}</div>
                    {i < ESCALERA.length - 1 && <div className="text-[10.5px] text-muted mt-1">hasta {ESCALERA[i + 1].desde - 1}.ª</div>}
                  </div>
                )
              })}
            </div>
            <p className="text-[12px] text-muted mt-3">El % de cada venta se fija al cobrar su primera cuota y se aplica a las 12 cuotas de ese cliente. El lunes se vuelve a empezar desde el 20 %.</p>
          </div>

          {/* Este mes + liquidaciones */}
          <div className="grid md:grid-cols-[1fr_1fr] gap-4 mb-4">
            <div className="card p-5">
              <div className="text-[11px] uppercase tracking-[0.16em] text-muted font-semibold">Acumulado en {nombreMes(r.mes)}</div>
              <div className="mt-2 font-display text-[2.2rem] leading-none font-semibold text-ink tracking-[-0.03em]">{eur(r.mesCent)}</div>
              <div className="text-[12.5px] text-dim mt-2">{r.cuotasMes} {r.cuotasMes === 1 ? 'cuota cobrada' : 'cuotas cobradas'} a tus clientes este mes. Se liquida el día {DIA_PAGO} del mes que viene.</div>
            </div>
            <div className="card p-5">
              <div className="text-[11px] uppercase tracking-[0.16em] text-muted font-semibold">Liquidaciones</div>
              {r.liquidaciones.length === 0 ? <p className="text-[13px] text-dim mt-2">Todavía ninguna. La primera sale el día {DIA_PAGO} del mes siguiente a tu primera cuota cobrada.</p> : (
                <ul className="mt-2 divide-y divide-border text-[13px]">
                  {r.liquidaciones.map((l) => (
                    <li key={l.mes} className="py-2 flex items-center justify-between gap-3">
                      <span className="text-ink">{nombreMes(l.mes)} <span className="text-muted">· {l.cuotas} cuotas</span></span>
                      <span className="flex items-center gap-2"><strong className="text-ink">{eur(l.total_cent)}</strong><span className={`text-[10.5px] uppercase tracking-wide px-2 py-0.5 rounded-full ${l.estado === 'pagada' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{l.estado}</span></span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Ventas */}
          <div className="card p-5">
            <div className="text-[11px] uppercase tracking-[0.16em] text-muted font-semibold mb-2">Tus ventas</div>
            {r.ventas.length === 0 ? <p className="text-[13px] text-dim">Aún ninguna venta atribuida. Usa tu enlace o pon tu código al contratar.</p> : (
              <table className="w-full text-[13px]">
                <thead><tr className="text-left text-[11px] uppercase tracking-wide text-muted"><th className="py-1.5 font-semibold">Cliente</th><th className="py-1.5 font-semibold">Producto</th><th className="py-1.5 font-semibold text-right">Cuota</th><th className="py-1.5 font-semibold text-right">Tu %</th><th className="py-1.5 font-semibold text-right">Al mes</th><th className="py-1.5 font-semibold text-right hidden sm:table-cell">Fecha</th></tr></thead>
                <tbody className="divide-y divide-border">
                  {r.ventas.map((v) => (
                    <tr key={v.id} className={v.estado !== 'pagado' ? 'opacity-50' : ''}>
                      <td className="py-2 text-ink">{v.negocio || '—'}</td>
                      <td className="py-2 text-dim">{v.nombre}</td>
                      <td className="py-2 text-right text-dim">{eur(v.importe_cent)}</td>
                      <td className="py-2 text-right text-accent font-semibold">{v.comision_pct ? `${Number(v.comision_pct)} %` : '—'}</td>
                      <td className="py-2 text-right text-ink font-semibold">{v.comision_pct ? eur(Math.round(v.importe_cent * Number(v.comision_pct) / 100)) : '—'}</td>
                      <td className="py-2 text-right text-muted hidden sm:table-cell">{String(v.pagado_at || '').slice(0, 10)}{v.estado !== 'pagado' ? ` · ${v.estado}` : ''}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}

      {esAdmin && (
        <div className="grid md:grid-cols-2 gap-4 mt-4">
          <div className="card p-5">
            <div className="text-[11px] uppercase tracking-[0.16em] text-muted font-semibold mb-2">Ranking de {nombreMes(mesDe())}</div>
            {ranking.length === 0 ? <p className="text-[13px] text-dim">Sin ventas atribuidas este mes.</p> : (
              <ol className="text-[13px] space-y-1.5">
                {ranking.map((c, i) => <li key={c.comercial} className="flex justify-between"><span className="text-ink"><span className="text-muted mr-2">{i + 1}.</span>{c.comercial}</span><span className="text-dim">{c.ventas} ventas · {eur(c.mrr)}/mes</span></li>)}
              </ol>
            )}
          </div>
          <div className="card p-5">
            <div className="text-[11px] uppercase tracking-[0.16em] text-muted font-semibold mb-2">Cierre de mes</div>
            {porCerrar.size === 0 ? <p className="text-[13px] text-dim">No hay meses pendientes de liquidar.</p> : (
              <ul className="text-[13px] space-y-2">
                {Array.from(porCerrar.entries()).map(([mes, total]) => (
                  <li key={mes} className="flex items-center justify-between gap-3">
                    <span className="text-ink">{nombreMes(mes)} · <strong>{eur(total)}</strong> sin liquidar</span>
                    <form action={`/api/panel/liquidar?mes=${mes}`} method="post"><button className="btn-accent rounded-full text-[12px] px-3.5 py-1.5">Cerrar {mes}</button></form>
                  </li>
                ))}
              </ul>
            )}
            <p className="text-[12px] text-muted mt-3">Cerrar crea una liquidación por comercial (pendiente) y descarga el CSV para pagarles contra su factura. Marca «pagada» desde Supabase cuando transfieras.</p>
          </div>
        </div>
      )}
    </section>
  )
}
