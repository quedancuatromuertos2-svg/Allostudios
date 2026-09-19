'use client'

import { useEffect, useState } from 'react'
import { type Articulo, eur, porClave } from '@/lib/precios'

/*  Desglose y botón de pago.

    La regla que pidió Frangel: que en todo momento se vea qué se paga hoy y
    qué se paga después. Con el modelo de suscripción (18/09/2026) es sencillo:
    0 € de entrada, hoy pagas la primera cuota y cada mes la misma. Packs y
    webs llevan 12 meses de permanencia; el año por adelantado son 10 cuotas.  */

export default function Desglose({ art }: { art: Articulo }) {
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState('')
  const [negocio, setNegocio] = useState('')
  const [telefono, setTelefono] = useState('')
  const [email, setEmail] = useState('')
  const [anual, setAnual] = useState(false)
  const [extras, setExtras] = useState<string[]>([])
  // código del comercial (cookie allo_c puesta por ?c=<slug>); el cliente puede corregirlo
  const [comercial, setComercial] = useState('')
  useEffect(() => { const m = document.cookie.match(/(?:^|;\s*)allo_c=([a-z0-9-]{2,30})/i); if (m) setComercial(m[1]) }, [])
  const [acepta, setAcepta] = useState(false)

  const extrasDisponibles = (art.extras || []).map(porClave).filter((e): e is Articulo => !!e)
  const extrasElegidos = extrasDisponibles.filter((e) => extras.includes(e.clave))
  const cuota = art.eur + extrasElegidos.reduce((t, e) => t + e.eur, 0)
  const puedeAnual = !!art.anual
  // Los extras sin precio anual (p. ej. AEO) se cobran mes a mes aunque el pack se pague por adelantado.
  const extrasAnuales = extrasElegidos.filter((e) => e.anual).reduce((t, e) => t + e.eur, 0)
  const extrasMensuales = extrasElegidos.filter((e) => !e.anual).reduce((t, e) => t + e.eur, 0)
  const hoy = anual && puedeAnual ? (art.eur + extrasAnuales) * 10 + extrasMensuales : cuota

  async function pagar(e: React.FormEvent) {
    e.preventDefault()
    setCargando(true)
    setError('')
    try {
      const r = await fetch('/api/pago', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clave: art.clave, negocio, telefono, email, periodo: anual ? 'anio' : 'mes', extras, aceptaContrato: acepta, comercial }),
      })
      const d = await r.json()
      if (!r.ok || !d.url) throw new Error(d.error || 'No se pudo abrir el pago')
      window.location.href = d.url
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo abrir el pago')
      setCargando(false)
    }
  }

  const input =
    'w-full px-4 py-3 rounded-xl border border-border bg-white text-[14px] text-ink placeholder:text-muted focus:border-accent outline-none transition-colors'

  const condiciones = [
    'Entrada: 0 €. Hoy pagas la primera cuota y empezamos',
    art.permanencia
      ? `${art.permanencia} meses de permanencia; después, mes a mes sin compromiso`
      : 'Sin permanencia: te das de baja cuando quieras',
    'Pago seguro con Stripe · no guardamos tu tarjeta',
    'Factura automática a tu email',
  ]

  return (
    <div className="grid lg:grid-cols-[1fr_0.95fr] gap-6 items-start">
      {/* ── El desglose ── */}
      <div className="card p-6 md:p-8">
        <p className="eyebrow mb-4">Qué pagas y cuándo</p>

        <div className="flex items-baseline justify-between gap-4 pb-4 border-b border-border">
          <div>
            <div className="text-[15px] font-semibold text-ink">{art.nombre}</div>
            <div className="text-[12.5px] text-muted mt-0.5">
              {art.permanencia ? `Suscripción · ${art.permanencia} meses` : 'Suscripción mensual'}
            </div>
          </div>
          <div className="text-right shrink-0">
            <div className="font-display text-[1.9rem] leading-none font-semibold text-ink tracking-[-0.03em]">
              {eur(art.eur)}
            </div>
            <div className="text-[12px] text-muted mt-1">al mes</div>
          </div>
        </div>

        {art.desglose ? (
          <div className="py-4 border-b border-border">
            <p className="text-[11.5px] font-semibold tracking-[0.12em] uppercase text-muted mb-2">Qué lleva y lo que costaría por separado</p>
            <ul className="divide-y divide-border">
              {art.desglose.map(([t, e]) => (
                <li key={t} className="flex items-center justify-between gap-4 py-2 text-[13px]">
                  <span className="flex items-center gap-2.5 text-dim"><Check />{t}</span>
                  <span className="text-muted tabular-nums line-through decoration-muted/60">{eur(e)}/mes</span>
                </li>
              ))}
            </ul>
            <div className="flex items-center justify-between gap-4 pt-3 mt-1 border-t border-border text-[13px]">
              <span className="text-muted">Por separado</span>
              <span className="text-muted tabular-nums">{eur(art.sumaSuelto || 0)}/mes</span>
            </div>
            <div className="flex items-center justify-between gap-4 pt-1.5 text-[13.5px]">
              <span className="font-semibold text-ink">{art.nombre}</span>
              <span className="font-semibold text-ink tabular-nums">{eur(art.eur)}/mes</span>
            </div>
            {art.sumaSuelto && art.sumaSuelto > art.eur && (
              <p className="mt-2 text-[12.5px] text-accent font-medium">Ahorras {eur(art.sumaSuelto - art.eur)} cada mes · {eur((art.sumaSuelto - art.eur) * 12)} al año.</p>
            )}
          </div>
        ) : art.incluye && (
          <ul className="py-4 border-b border-border space-y-2">
            {art.incluye.map((t) => (
              <li key={t} className="flex items-start gap-2.5 text-[13px] text-dim">
                <Check />
                {t}
              </li>
            ))}
          </ul>
        )}

        {extrasDisponibles.length > 0 && (
          <div className="py-4 border-b border-border space-y-2">
            {extrasDisponibles.map((e) => (
              <label key={e.clave} className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="mt-1"
                  checked={extras.includes(e.clave)}
                  onChange={(ev) =>
                    setExtras((xs) => (ev.target.checked ? [...xs, e.clave] : xs.filter((x) => x !== e.clave)))
                  }
                />
                <span className="flex-1">
                  <span className="block text-[13.5px] font-semibold text-ink">{e.nombre} · +{eur(e.eur)}/mes</span>
                  <span className="block text-[12.5px] text-muted mt-0.5">{e.desc}</span>
                </span>
              </label>
            ))}
          </div>
        )}

        {puedeAnual && (
          <label className="flex items-start gap-3 cursor-pointer py-4 border-b border-border">
            <input type="checkbox" className="mt-1" checked={anual} onChange={(e) => setAnual(e.target.checked)} />
            <span className="flex-1">
              <span className="block text-[13.5px] font-semibold text-ink">
                Pagar el año por adelantado · {eur((art.eur + extrasAnuales) * 10)}
              </span>
              <span className="block text-[12.5px] text-muted mt-0.5">
                10 cuotas en vez de 12: te ahorras {eur((art.eur + extrasAnuales) * 2)}.{extrasMensuales ? ` Los extras sin permanencia (${eur(extrasMensuales)}/mes) siguen mes a mes.` : ''}
              </span>
            </span>
          </label>
        )}

        <div className="flex items-center justify-between gap-4 py-4 border-b border-border">
          <span className="text-[13.5px] font-semibold text-ink">Hoy pagas</span>
          <span className="text-[17px] font-semibold text-accent">{eur(hoy)}</span>
        </div>
        <div className="flex items-center justify-between gap-4 py-4 border-b border-border">
          <span className="text-[13.5px] text-dim">Después</span>
          <span className="text-[14px] font-medium text-dim">
            {anual && puedeAnual ? `${eur((art.eur + extrasAnuales) * 10)} cada año${extrasMensuales ? ` + ${eur(extrasMensuales)} cada mes` : ''}` : `${eur(cuota)} cada mes`}
          </span>
        </div>

        <ul className="mt-5 space-y-2.5">
          {condiciones.map((t) => (
            <li key={t} className="flex items-start gap-2.5 text-[13px] text-dim">
              <Check />
              {t}
            </li>
          ))}
        </ul>
      </div>

      {/* ── Los datos y el botón ── */}
      <form onSubmit={pagar} className="lg rounded-2xl p-6 md:p-8 space-y-4">
        <div>
          <label className="block text-[12.5px] font-medium text-dim mb-1.5">Nombre de tu negocio *</label>
          <input value={negocio} onChange={(e) => setNegocio(e.target.value)} required
            maxLength={120} placeholder="Ej: Peluquería Marta" className={input} />
        </div>
        <div>
          <label className="block text-[12.5px] font-medium text-dim mb-1.5">Tu WhatsApp *</label>
          <input value={telefono} onChange={(e) => setTelefono(e.target.value)} required
            type="tel" maxLength={30} placeholder="600 000 000" className={input} />
          <p className="text-[11.5px] text-muted mt-1.5">Para avisarte en cuanto empecemos.</p>
        </div>
        <div>
          <label className="block text-[12.5px] font-medium text-dim mb-1.5">Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email"
            maxLength={160} placeholder="tu@email.com" className={input} />
          <p className="text-[11.5px] text-muted mt-1.5">Donde te llega la factura. Si lo dejas vacío te lo pide Stripe.</p>
        </div>

        <label className="flex items-start gap-3 cursor-pointer text-[12.5px] text-dim leading-relaxed">
          <input type="checkbox" required className="mt-1" checked={acepta} onChange={(e) => setAcepta(e.target.checked)} />
          <span>
            He leído y acepto el{' '}
            <a
              href={`/contrato?pack=${art.clave.toLowerCase()}${extras.includes('CINE_UPGRADE') ? '&cine=1' : ''}${anual && puedeAnual ? '&anual=1' : ''}${negocio ? `&negocio=${encodeURIComponent(negocio)}` : ''}`}
              target="_blank" rel="noopener noreferrer" className="underline text-ink"
            >
              contrato de suscripción
            </a>
            {art.permanencia ? ` (${art.permanencia} meses de permanencia, 0 € de entrada)` : ' (sin permanencia)'}. Recibiré una copia por email.
          </span>
        </label>

        {error && <p className="text-[13px] text-red-500">{error}</p>}

        <button type="submit" disabled={cargando || !acepta}
          className="btn-accent w-full justify-center py-4 text-[15px] rounded-full disabled:opacity-60">
          {cargando ? 'Abriendo el pago…' : `Pagar ${eur(hoy)}${anual && puedeAnual ? '/año' : '/mes'}`}
          {!cargando && (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
              <path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </button>

        <p className="text-[11.5px] text-muted text-center leading-relaxed">
          Te lleva a la pantalla segura de Stripe. Tus datos de tarjeta no pasan por nuestra web
          en ningún momento.
        </p>
      </form>
    </div>
  )
}

function Check() {
  return (
    <span className="mt-[3px] w-4 h-4 shrink-0 rounded-full bg-accent-light text-accent flex items-center justify-center">
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <path d="m5 12 5 5L20 7" />
      </svg>
    </span>
  )
}
