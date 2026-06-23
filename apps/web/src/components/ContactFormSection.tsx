'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const SERVICIOS = [
  'Gestión de Instagram',
  'Anuncios Meta',
  'Asistente IA en DMs',
  'Web Inmobiliaria',
  'SEO',
  'Reseñas Google',
  'Pack Completo',
  'No estoy seguro',
]

function Field({ name, label, required, type = 'text' }: { name: string; label: string; required?: boolean; type?: string }) {
  return (
    <div>
      <label className="block text-[13px] font-medium text-dim mb-1.5">{label}</label>
      <input
        name={name}
        type={type}
        required={required}
        className="w-full px-4 py-3 rounded-xl border border-border bg-canvas text-[14px] text-ink focus:border-accent outline-none transition-colors"
      />
    </div>
  )
}

export default function ContactFormSection() {
  const [servicio, setServicio] = useState('Gestión de Instagram')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const h = (e: Event) => {
      const detail = (e as CustomEvent).detail as string
      if (detail) setServicio(SERVICIOS.includes(detail) ? detail : 'Pack Completo')
    }
    window.addEventListener('selectService', h as EventListener)
    return () => window.removeEventListener('selectService', h as EventListener)
  }, [])

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const fd = new FormData(e.currentTarget)
    const body = {
      nombre: fd.get('nombre'),
      inmobiliaria: fd.get('inmobiliaria'),
      telefono: fd.get('telefono'),
      email: fd.get('email'),
      servicio,
      mensaje: fd.get('mensaje'),
    }
    try {
      const r = await fetch('/api/solicitud', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!r.ok) throw new Error()
      setSent(true)
    } catch {
      setError('No se pudo enviar. Escríbenos por WhatsApp y lo solucionamos al momento.')
    }
    setLoading(false)
  }

  return (
    <section id="contratar" className="py-section bg-canvas overflow-hidden">
      <div className="max-w-2xl mx-auto px-6 md:px-12">

        <div className="text-center mb-10">
          <motion.span
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="eyebrow block mb-4"
          >
            Empieza hoy
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ delay: 0.08 }}
            className="text-headline font-semibold text-ink text-balance"
          >
            Contrata o pide tu propuesta gratis.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ delay: 0.16 }}
            className="mt-4 text-dim font-light max-w-md mx-auto"
          >
            Déjanos tus datos y el servicio que te interesa. Te respondemos en menos de 24h con todo claro.
          </motion.p>
        </div>

        {sent ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl border border-border shadow-sm p-10 text-center"
          >
            <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-5">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
            <h3 className="text-[20px] font-semibold text-ink mb-2">¡Solicitud recibida!</h3>
            <p className="text-dim font-light max-w-sm mx-auto">Te contactamos en menos de 24h. Si tienes prisa, escríbenos directamente por WhatsApp.</p>
            <a
              href="https://wa.me/34613112671?text=Hola%2C%20acabo%20de%20enviar%20una%20solicitud%20en%20la%20web"
              target="_blank" rel="noopener noreferrer"
              className="btn-accent inline-flex mt-7 px-7 py-3.5 rounded-full"
            >
              Hablar por WhatsApp
            </a>
          </motion.div>
        ) : (
          <motion.form
            onSubmit={submit}
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="bg-white rounded-2xl border border-border shadow-sm p-7 md:p-9 space-y-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field name="nombre" label="Tu nombre *" required />
              <Field name="inmobiliaria" label="Inmobiliaria" />
              <Field name="telefono" label="Teléfono / WhatsApp *" required type="tel" />
              <Field name="email" label="Email" type="email" />
            </div>

            <div>
              <label className="block text-[13px] font-medium text-dim mb-1.5">Servicio que te interesa *</label>
              <select
                value={servicio}
                onChange={(e) => setServicio(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-border bg-canvas text-[14px] text-ink focus:border-accent outline-none transition-colors"
              >
                {SERVICIOS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-[13px] font-medium text-dim mb-1.5">Mensaje (opcional)</label>
              <textarea
                name="mensaje"
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-border bg-canvas text-[14px] text-ink focus:border-accent outline-none transition-colors resize-none"
              />
            </div>

            {error && <p className="text-[13px] text-red-500">{error}</p>}

            <button type="submit" disabled={loading} className="btn-accent w-full justify-center py-4 text-[15px] rounded-full disabled:opacity-60">
              {loading ? 'Enviando…' : 'Solicitar propuesta'}
            </button>
            <p className="text-[11.5px] text-muted text-center">Sin compromiso · Respuesta en menos de 24h</p>
          </motion.form>
        )}
      </div>
    </section>
  )
}
