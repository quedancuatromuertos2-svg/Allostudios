'use client'

import { useState } from 'react'

const EXPERIENCIA = [
  'Nunca he vendido, pero quiero aprender',
  'He vendido algo (tienda, teleoperador, autónomo…)',
  'Vendo o he vendido de forma profesional',
  'Tengo cartera propia de negocios locales',
]

export default function AfiliadoForm() {
  const [estado, setEstado] = useState<'idle' | 'enviando' | 'ok' | 'error'>('idle')
  const [error, setError] = useState('')

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    const fd = new FormData(e.currentTarget)
    if (fd.get('web')) return // honeypot
    setEstado('enviando')
    try {
      const r = await fetch('/api/solicitud', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: fd.get('nombre'),
          telefono: fd.get('telefono'),
          email: fd.get('email'),
          servicio: 'QUIERE SER COMERCIAL',
          inmobiliaria: `${fd.get('ciudad') || 'Sin ciudad'} · ${fd.get('experiencia') || '—'}`,
          mensaje:
            `Solicitud del programa de comerciales.\n` +
            `Ciudad: ${fd.get('ciudad') || '—'}\n` +
            `Experiencia: ${fd.get('experiencia') || '—'}\n` +
            `Horas/semana: ${fd.get('horas') || '—'}\n` +
            `Cuenta: ${fd.get('mensaje') || '—'}`,
        }),
      })
      if (!r.ok) throw new Error()
      setEstado('ok')
    } catch {
      setEstado('error')
      setError('No se pudo enviar. Escríbenos por WhatsApp al 695 868 793 y lo hablamos.')
    }
  }

  if (estado === 'ok') {
    return (
      <div className="lg rounded-2xl p-8 md:p-10 text-center">
        <span className="inline-flex w-12 h-12 rounded-full bg-accent-light text-accent items-center justify-center mb-5">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="m5 12 5 5L20 7" />
          </svg>
        </span>
        <h3 className="font-display text-title font-semibold text-ink">Solicitud recibida.</h3>
        <p className="mt-3 text-dim font-light max-w-sm mx-auto">
          Te escribimos por WhatsApp en menos de 24 h. Si encajas, te pasamos los leads, la demo
          y el guion, y empiezas esa misma semana.
        </p>
      </div>
    )
  }

  const input =
    'w-full px-4 py-3 rounded-xl border border-border bg-white text-[14px] text-ink placeholder:text-muted focus:border-accent outline-none transition-colors'

  return (
    <form onSubmit={submit} className="lg rounded-2xl p-6 md:p-8 space-y-4">
      <input type="text" name="web" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-[12.5px] font-medium text-dim mb-1.5">Tu nombre *</label>
          <input name="nombre" required maxLength={80} placeholder="Nombre y apellido" className={input} />
        </div>
        <div>
          <label className="block text-[12.5px] font-medium text-dim mb-1.5">Ciudad *</label>
          <input name="ciudad" required maxLength={60} placeholder="Valencia, Madrid, remoto…" className={input} />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-[12.5px] font-medium text-dim mb-1.5">WhatsApp *</label>
          <input name="telefono" required type="tel" maxLength={30} placeholder="600 000 000" className={input} />
        </div>
        <div>
          <label className="block text-[12.5px] font-medium text-dim mb-1.5">Email</label>
          <input name="email" type="email" maxLength={120} placeholder="tu@email.com" className={input} />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-[12.5px] font-medium text-dim mb-1.5">Experiencia vendiendo *</label>
          <select name="experiencia" required defaultValue="" className={input}>
            <option value="" disabled>Elige…</option>
            {EXPERIENCIA.map((x) => <option key={x} value={x}>{x}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-[12.5px] font-medium text-dim mb-1.5">Horas que le puedes dedicar</label>
          <select name="horas" defaultValue="" className={input}>
            <option value="" disabled>Elige…</option>
            <option>Menos de 5 h/semana</option>
            <option>5-10 h/semana</option>
            <option>10-20 h/semana</option>
            <option>Jornada completa</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-[12.5px] font-medium text-dim mb-1.5">¿Por qué tú? (opcional)</label>
        <textarea
          name="mensaje"
          rows={3}
          maxLength={600}
          placeholder="Cuéntanos en dos líneas qué has vendido antes o por qué te ves haciendo esto."
          className={`${input} resize-none`}
        />
      </div>

      {error && <p className="text-[13px] text-red-500">{error}</p>}

      <button
        type="submit"
        disabled={estado === 'enviando'}
        className="btn-accent w-full justify-center py-4 text-[15px] rounded-full disabled:opacity-60"
      >
        {estado === 'enviando' ? 'Enviando…' : 'Quiero entrar'}
      </button>
      <p className="text-[11.5px] text-muted text-center">
        Sin cuotas ni inversión · No pagas nada por entrar · Puedes dejarlo cuando quieras
      </p>
    </form>
  )
}
