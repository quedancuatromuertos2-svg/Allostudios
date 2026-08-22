'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

/* Slug para la barra de direcciones del mockup: "Peluquería Marta" -> peluqueriamarta.com */
function fakeDomain(name: string) {
  const clean = name
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .slice(0, 22)
  return `${clean || 'tunegocio'}.com`
}

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } }
const fadeUp = {
  hidden: { opacity: 0, y: 22, filter: 'blur(6px)' },
  show: {
    opacity: 1, y: 0, filter: 'blur(0px)',
    transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
}

const bullets = [
  {
    t: 'Con tus datos reales',
    d: 'Tus reseñas de Google, tus fotos y tu dirección — no una plantilla vacía.',
    icon: <><circle cx="12" cy="12" r="9" /><path d="m9 12 2 2 4-4" /></>,
  },
  {
    t: 'Lista en 30 segundos',
    d: 'La ves en pantalla al momento y te la puedes enviar por WhatsApp.',
    icon: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  },
  {
    t: 'Sin crear cuenta',
    d: 'Gratis y sin compromiso. Tú decides después si la quieres de verdad.',
    icon: <><rect x="4" y="10" width="16" height="10" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0" /></>,
  },
]

/* Mockup del navegador — refleja la demo real que se genera en /tu-web/[id] */
function DemoPreview({ negocio }: { negocio: string }) {
  const nombre = negocio.trim() || 'Tu Negocio'
  return (
    <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-[#0b0b12]">
      {/* Barra del navegador */}
      <div className="flex items-center gap-1.5 px-4 py-3 bg-[#16162a] border-b border-white/8">
        <div className="w-2.5 h-2.5 rounded-full bg-white/15" />
        <div className="w-2.5 h-2.5 rounded-full bg-white/15" />
        <div className="w-2.5 h-2.5 rounded-full bg-white/15" />
        <div className="flex-1 mx-3 bg-white/8 rounded-md px-3 py-1.5 text-[10px] text-white/35 font-mono truncate">
          {fakeDomain(negocio)}
        </div>
      </div>

      {/* Hero de la demo */}
      <div className="relative px-6 pt-7 pb-6 overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'radial-gradient(120% 100% at 20% 8%, #6a5bff 0%, #a05bff 42%, #12101d 100%)', opacity: 0.9 }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(8,8,14,.15) 0%, rgba(8,8,14,.85) 100%)' }} />
        <div className="relative">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] text-white/90 mb-4 border border-white/20" style={{ background: 'rgba(255,255,255,.12)' }}>
            <span style={{ color: '#ffd15c' }}>★★★★★</span>
            <span><b>4,8</b> · 127 reseñas en Google</span>
          </div>
          <div className="text-white font-semibold leading-[1.05] tracking-[-0.03em] text-[clamp(1.4rem,3.2vw,2rem)] break-words">
            {nombre}
          </div>
          <div className="text-white/65 text-[12.5px] mt-2 mb-4">Tu imagen, en las mejores manos</div>
          <div className="flex gap-2">
            <div className="h-8 px-4 rounded-full flex items-center text-[11px] font-semibold text-white" style={{ background: 'linear-gradient(100deg,#6a5bff,#a05bff)' }}>
              Reservar / Contactar
            </div>
            <div className="h-8 px-4 rounded-full flex items-center text-[11px] text-white/80 border border-white/25">
              Llamar
            </div>
          </div>
        </div>
      </div>

      {/* Tarjetas de servicios */}
      <div className="px-6 pb-6 pt-1">
        <div className="text-white/85 text-[12.5px] font-semibold mb-3">Lo que ofrecemos</div>
        <div className="grid grid-cols-3 gap-2">
          {[0, 1, 2].map(i => (
            <div key={i} className="rounded-xl p-3 border border-white/8" style={{ background: 'rgba(255,255,255,.04)' }}>
              <div className="w-6 h-6 rounded-lg mb-2.5" style={{ background: 'linear-gradient(135deg,#6a5bff,#a05bff)' }} />
              <div className="h-1.5 rounded-full bg-white/20 mb-1.5" />
              <div className="h-1.5 rounded-full bg-white/10 w-2/3" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function DemoGeneratorSection() {
  const router = useRouter()
  const [negocio, setNegocio] = useState('')
  const [ciudad, setCiudad] = useState('Valencia')
  const [going, setGoing] = useState(false)

  function submit(e: React.FormEvent) {
    e.preventDefault()
    setGoing(true)
    const q = new URLSearchParams({ negocio: negocio.trim(), ciudad: ciudad.trim() || 'Valencia' })
    router.push(`/tu-web?${q.toString()}`)
  }

  return (
    <section id="tu-web" className="relative overflow-hidden py-section">
      {/* Fondo suave con acento */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'linear-gradient(170deg, #FAFAF9 0%, #F3F3FE 45%, #EDEDFB 100%)',
      }} />
      <div className="absolute w-[620px] h-[620px] rounded-full blur-[130px] opacity-40 -top-40 -right-32 pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(124,124,232,0.45) 0%, transparent 65%)' }} />
      <div className="absolute inset-0 line-grid opacity-60 pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-12">
        <div className="grid lg:grid-cols-[1.05fr_1fr] gap-12 lg:gap-16 items-center">

          {/* Columna izquierda: copy + formulario */}
          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.25 }}>
            <motion.span variants={fadeUp} className="eyebrow inline-flex items-center gap-2 mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              Generador de webs · Gratis
            </motion.span>

            <motion.h2 variants={fadeUp} className="text-headline font-semibold text-ink text-balance">
              Mira cómo quedaría la web de tu negocio.
            </motion.h2>

            <motion.p variants={fadeUp} className="mt-5 text-[1.05rem] text-dim font-light leading-relaxed max-w-lg text-pretty">
              Escribe el nombre de tu negocio y te la generamos al momento — con tus reseñas
              de Google, tus fotos y tus datos reales. Si no tienes web (o tienes una
              anticuada), esto es justo lo que estás perdiendo.
            </motion.p>

            <motion.form variants={fadeUp} onSubmit={submit} className="mt-8 lg rounded-2xl p-5 md:p-6">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <label htmlFor="dg-negocio" className="block text-[12px] font-medium text-dim mb-1.5">Nombre de tu negocio</label>
                  <input
                    id="dg-negocio"
                    value={negocio}
                    onChange={e => setNegocio(e.target.value)}
                    required
                    maxLength={120}
                    placeholder="Ej: Peluquería Marta"
                    className="w-full px-4 py-3 rounded-xl border border-border bg-white text-[14px] text-ink placeholder:text-muted focus:border-accent outline-none transition-colors"
                  />
                </div>
                <div className="sm:w-[38%]">
                  <label htmlFor="dg-ciudad" className="block text-[12px] font-medium text-dim mb-1.5">Ciudad</label>
                  <input
                    id="dg-ciudad"
                    value={ciudad}
                    onChange={e => setCiudad(e.target.value)}
                    maxLength={80}
                    placeholder="Valencia"
                    className="w-full px-4 py-3 rounded-xl border border-border bg-white text-[14px] text-ink placeholder:text-muted focus:border-accent outline-none transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={going}
                className="btn-accent w-full justify-center mt-4 py-4 text-[15px] rounded-full disabled:opacity-60"
              >
                {going ? 'Abriendo el generador…' : 'Generar mi web gratis'}
                {!going && (
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                    <path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>

              <p className="text-[11.5px] text-muted text-center mt-3">
                Gratis · Sin crear cuenta · Nada de spam
              </p>
            </motion.form>

            <motion.ul variants={fadeUp} className="mt-8 space-y-3.5">
              {bullets.map(b => (
                <li key={b.t} className="flex items-start gap-3">
                  <span className="mt-0.5 w-7 h-7 shrink-0 rounded-lg bg-accent-light text-accent flex items-center justify-center">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                      {b.icon}
                    </svg>
                  </span>
                  <span>
                    <span className="text-[14px] font-semibold text-ink">{b.t}</span>
                    <span className="block text-[13px] text-dim font-light leading-relaxed">{b.d}</span>
                  </span>
                </li>
              ))}
            </motion.ul>
          </motion.div>

          {/* Columna derecha: preview en vivo */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="relative">
              <DemoPreview negocio={negocio} />

              {/* Badge flotante */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -bottom-5 -left-4 md:-left-8 bg-white rounded-2xl border border-border shadow-xl px-4 py-3 flex items-center gap-2.5"
              >
                <span className="w-8 h-8 rounded-full bg-accent-light text-accent flex items-center justify-center">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8Z" />
                  </svg>
                </span>
                <span>
                  <span className="block text-[12.5px] font-semibold text-ink leading-none">30 segundos</span>
                  <span className="block text-[10.5px] text-muted mt-0.5">y la tienes en pantalla</span>
                </span>
              </motion.div>
            </div>

            <p className="text-[11.5px] text-muted text-center mt-14">
              Ejemplo de demo generada · el diseño final se adapta a tu sector
            </p>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
