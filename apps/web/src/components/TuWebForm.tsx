'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const SECTORES = [
  'Peluquería / Barbería',
  'Centro de estética / Spa',
  'Clínica dental',
  'Fisioterapia / Clínica',
  'Restaurante / Bar',
  'Cafetería',
  'Gimnasio / Entrenamiento',
  'Taller mecánico',
  'Abogado / Asesoría',
  'Inmobiliaria',
  'Veterinario',
  'Óptica',
  'Tienda / Comercio',
  'Autónomo / Otro',
]

type Props = {
  /* Precarga desde el generador de la home (/#tu-web) */
  defaultNegocio?: string
  defaultCiudad?: string
}

export default function TuWebForm({ defaultNegocio = '', defaultCiudad = 'Valencia' }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    const fd = new FormData(e.currentTarget)
    if (!fd.get('consent')) {
      setError('Marca la casilla para poder generar tu demo.')
      return
    }
    setLoading(true)
    const body = {
      negocio: fd.get('negocio'),
      ciudad: fd.get('ciudad'),
      sector: fd.get('sector'),
      telefono: fd.get('telefono'),
      email: fd.get('email'),
      consent: Boolean(fd.get('consent')),
      web: fd.get('web'), // honeypot (oculto)
    }
    try {
      const r = await fetch('/api/genera-demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const d = await r.json()
      if (!r.ok || !d.id) throw new Error(d.error || '__generic__')
      router.push(`/tu-web/${d.id}`)
    } catch (err) {
      const msg = err instanceof Error && err.message !== '__generic__' ? err.message : ''
      setError(msg || 'No se pudo generar. Escríbenos por WhatsApp y te la hacemos al momento.')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={submit} className="lg rounded-2xl p-7 md:p-9 space-y-4">
      {/* Honeypot anti-bots (oculto) */}
      <input type="text" name="web" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />

      <div>
        <label className="block text-[13px] font-medium text-dim mb-1.5">Nombre de tu negocio *</label>
        <input
          name="negocio"
          required
          defaultValue={defaultNegocio}
          autoFocus={!defaultNegocio}
          placeholder="Ej: Peluquería Marta"
          className="w-full px-4 py-3 rounded-xl border border-border bg-canvas text-[14px] text-ink focus:border-accent outline-none transition-colors"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-[13px] font-medium text-dim mb-1.5">Ciudad</label>
          <input
            name="ciudad"
            defaultValue={defaultCiudad}
            className="w-full px-4 py-3 rounded-xl border border-border bg-canvas text-[14px] text-ink focus:border-accent outline-none transition-colors"
          />
        </div>
        <div>
          <label className="block text-[13px] font-medium text-dim mb-1.5">Sector *</label>
          <select
            name="sector"
            required
            defaultValue=""
            className="w-full px-4 py-3 rounded-xl border border-border bg-canvas text-[14px] text-ink focus:border-accent outline-none transition-colors"
          >
            <option value="" disabled>Elige…</option>
            {SECTORES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-[13px] font-medium text-dim mb-1.5">Tu WhatsApp *</label>
        <input
          name="telefono"
          required
          type="tel"
          placeholder="600 000 000"
          className="w-full px-4 py-3 rounded-xl border border-border bg-canvas text-[14px] text-ink focus:border-accent outline-none transition-colors"
        />
        <p className="text-[11.5px] text-muted mt-1.5">Para enviarte tu demo y el presupuesto. Nada de spam.</p>
      </div>

      <label className="flex items-start gap-2.5 text-[12.5px] text-dim">
        <input type="checkbox" name="consent" className="mt-0.5" />
        <span>
          Acepto que AlloStudios use mis datos para contactarme sobre mi demo (
          <a href="/privacidad" className="underline">privacidad</a>).
        </span>
      </label>

      {error && <p className="text-[13px] text-red-500">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="btn-accent w-full justify-center py-4 text-[15px] rounded-full disabled:opacity-60"
      >
        {loading ? 'Generando tu web… buscando tu negocio en Google…' : 'Generar mi web gratis'}
      </button>
      <p className="text-[11.5px] text-muted text-center">
        Sin compromiso · No creamos ninguna cuenta · Tú decides si la quieres.
      </p>
    </form>
  )
}
