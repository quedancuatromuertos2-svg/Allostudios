'use client'

import { useState } from 'react'
import { type Articulo, eur } from '@/lib/precios'

/*  Desglose y botón de pago.

    La regla que pidió Frangel: que en todo momento se vea qué se paga hoy y
    qué se paga después. El pago único va primero; la mensualidad se activa
    cuando se entrega el trabajo, no antes.                                  */

export default function Desglose({ art, mantenimiento }: { art: Articulo; mantenimiento?: Articulo }) {
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState('')
  const [negocio, setNegocio] = useState('')
  const [telefono, setTelefono] = useState('')
  const [email, setEmail] = useState('')

  const esMensual = art.cobro === 'mes'

  async function pagar(e: React.FormEvent) {
    e.preventDefault()
    setCargando(true)
    setError('')
    try {
      const r = await fetch('/api/pago', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clave: art.clave, negocio, telefono, email }),
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

  return (
    <div className="grid lg:grid-cols-[1fr_0.95fr] gap-6 items-start">
      {/* ── El desglose ── */}
      <div className="card p-6 md:p-8">
        <p className="eyebrow mb-4">Qué pagas y cuándo</p>

        <div className="flex items-baseline justify-between gap-4 pb-4 border-b border-border">
          <div>
            <div className="text-[15px] font-semibold text-ink">{art.nombre}</div>
            <div className="text-[12.5px] text-muted mt-0.5">
              {esMensual ? 'Suscripción mensual' : 'Pago único'}
            </div>
          </div>
          <div className="text-right shrink-0">
            <div className="font-display text-[1.9rem] leading-none font-semibold text-ink tracking-[-0.03em]">
              {eur(art.eur)}
            </div>
            {esMensual && <div className="text-[12px] text-muted mt-1">al mes</div>}
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 py-4 border-b border-border">
          <span className="text-[13.5px] font-semibold text-ink">Hoy pagas</span>
          <span className="text-[17px] font-semibold text-accent">{eur(art.eur)}</span>
        </div>

        {mantenimiento && (
          <div className="py-4 border-b border-border">
            <div className="flex items-center justify-between gap-4">
              <span className="text-[13.5px] text-dim">Después, {mantenimiento.nombre.toLowerCase()}</span>
              <span className="text-[14px] font-medium text-dim">{eur(mantenimiento.eur)}/mes</span>
            </div>
            <p className="text-[12.5px] text-muted mt-2 leading-relaxed">
              <strong className="text-dim font-semibold">No lo pagas ahora.</strong> Cuando te
              entreguemos la web te mandamos el enlace para activarlo. Así no pagas mantenimiento
              de algo que todavía no existe.
            </p>
          </div>
        )}

        <ul className="mt-5 space-y-2.5">
          {[
            esMensual ? 'Se cobra automáticamente cada mes' : 'Un solo cobro, no se repite',
            'Sin permanencia: te das de baja cuando quieras',
            'Pago seguro con Stripe · no guardamos tu tarjeta',
            'Factura automática a tu email',
          ].map((t) => (
            <li key={t} className="flex items-start gap-2.5 text-[13px] text-dim">
              <span className="mt-[3px] w-4 h-4 shrink-0 rounded-full bg-accent-light text-accent flex items-center justify-center">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m5 12 5 5L20 7" />
                </svg>
              </span>
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

        {error && <p className="text-[13px] text-red-500">{error}</p>}

        <button type="submit" disabled={cargando}
          className="btn-accent w-full justify-center py-4 text-[15px] rounded-full disabled:opacity-60">
          {cargando ? 'Abriendo el pago…' : `Pagar ${eur(art.eur)}${esMensual ? '/mes' : ''}`}
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
