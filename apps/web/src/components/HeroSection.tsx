'use client'

import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { useRef } from 'react'

function LiveBars() {
  const bars = [
    { h: 35, d: 0 }, { h: 70, d: 0.12 }, { h: 100, d: 0.24 },
    { h: 80, d: 0.36 }, { h: 50, d: 0.48 }, { h: 30, d: 0.6 },
    { h: 65, d: 0.72 }, { h: 90, d: 0.18 }, { h: 45, d: 0.42 },
  ]
  return (
    <div className="flex items-end gap-[2.5px] h-5">
      {bars.map((b, i) => (
        <motion.div key={i}
          className="w-[2.5px] rounded-full bg-accent"
          style={{ height: `${b.h}%` }}
          animate={{ scaleY: [0.3, 1, 0.3] }}
          transition={{ duration: 1.2 + b.d, repeat: Infinity, delay: b.d, ease: 'easeInOut' }}
        />
      ))}
    </div>
  )
}

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.085 } },
}
const item = {
  hidden: { opacity: 0, y: 24, filter: 'blur(8px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
}

const stats = [
  { n: '+40%', l: 'más reservas' },
  { n: '98%', l: 'llamadas atendidas' },
  { n: '<2s', l: 'respuesta' },
  { n: '24/7', l: 'sin parar' },
]

function CalendarCard() {
  return (
    <motion.div
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
      className="absolute -top-8 -left-12 bg-white rounded-2xl border border-border shadow-lg px-4 py-3 min-w-[160px]"
    >
      <div className="flex items-center gap-2 mb-1.5">
        <div className="w-6 h-6 rounded-lg bg-accent flex items-center justify-center shrink-0">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
        </div>
        <span className="text-[11px] font-semibold text-ink">Cita reservada</span>
      </div>
      <div className="text-[10px] text-muted">Martes 10:30 · SMS enviado ✓</div>
    </motion.div>
  )
}

function UptimeCard() {
  return (
    <motion.div
      animate={{ y: [0, 7, 0] }}
      transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut', delay: 1.1 }}
      className="absolute -bottom-7 -right-10 bg-white rounded-2xl border border-border shadow-lg px-3.5 py-2.5"
    >
      <div className="flex items-center gap-2">
        <div className="relative w-7 h-7 rounded-full bg-green-50 flex items-center justify-center shrink-0">
          <motion.div
            className="w-2.5 h-2.5 rounded-full bg-green-500"
            animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
        <div>
          <div className="text-[12px] font-semibold text-ink leading-none mb-0.5">98% uptime</div>
          <div className="text-[10px] text-muted">Activo · 24/7</div>
        </div>
      </div>
    </motion.div>
  )
}

function AICallMockup() {
  return (
    <div className="relative w-[300px] lg:w-[320px] xl:w-[340px]">
      <div className="absolute inset-0 -m-3 rounded-[36px] bg-gradient-to-br from-accent/10 via-transparent to-accent-mid/5 blur-2xl" />
      <div className="relative bg-white rounded-[28px] border border-border/80 shadow-xl overflow-hidden">
        <div className="absolute top-0 right-0 w-56 h-56 rounded-full blur-3xl bg-accent-light opacity-40 -translate-y-1/3 translate-x-1/3 pointer-events-none" />

        {/* Header */}
        <div className="relative flex items-center gap-3 px-5 py-4 border-b border-border/50">
          <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center shrink-0">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.21h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.96a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[13px] font-semibold text-ink">Llamada activa</div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <motion.div className="w-1.5 h-1.5 rounded-full bg-green-500" animate={{ opacity: [1, 0.2, 1] }} transition={{ duration: 1.8, repeat: Infinity }} />
              <span className="text-[11px] text-green-600 font-medium">En curso · 0:42</span>
            </div>
          </div>
          <span className="text-[10px] font-bold text-accent bg-accent-light px-2.5 py-1 rounded-full">IA</span>
        </div>

        {/* Chat */}
        <div className="relative px-5 py-4 space-y-3">
          <div className="bg-surface rounded-2xl rounded-tl-sm px-3.5 py-2.5 max-w-[88%]">
            <div className="text-[10px] font-semibold text-muted mb-1 tracking-[0.06em] uppercase">Cliente</div>
            <div className="text-[12.5px] text-ink leading-relaxed">¿Tienen hueco el martes para una revisión?</div>
          </div>
          <div className="bg-accent-light rounded-2xl rounded-tr-sm px-3.5 py-2.5 max-w-[88%] ml-auto">
            <div className="text-[10px] font-semibold text-accent mb-1 tracking-[0.06em] uppercase">AlloStudios IA</div>
            <div className="text-[12.5px] text-ink leading-relaxed">Por supuesto. Tenemos el martes a las 10:30 o 16:00. ¿Cuál prefiere?</div>
          </div>
        </div>

        {/* Booking confirmation */}
        <div className="mx-5 mb-5 bg-surface rounded-xl px-3.5 py-3 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center shrink-0">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[12px] font-semibold text-ink leading-none mb-0.5">Cita reservada</div>
            <div className="text-[10.5px] text-muted">Martes 10:30 · SMS de confirmación ✓</div>
          </div>
          <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center shrink-0">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2.5 6l2.5 2.5 4.5-5" stroke="#16a34a" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>

      <CalendarCard />
      <UptimeCard />
    </div>
  )
}

export default function HeroSection() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const rawY = useTransform(scrollYProgress, [0, 1], [0, 60])
  const y = useSpring(rawY, { stiffness: 60, damping: 20 })

  return (
    <section ref={ref} className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-20 pb-12">

      {/* Noise */}
      <div className="noise" aria-hidden />

      {/* Mesh background */}
      <div className="absolute inset-0 mesh-hero pointer-events-none" />

      {/* Soft orbs */}
      <div className="orb w-[800px] h-[800px] bg-accent-light top-[-25%] left-[-25%] opacity-50 animate-orb" />
      <div className="orb w-[600px] h-[600px] bg-[#e8e8ff] bottom-[-15%] right-[-20%] opacity-40 animate-orb2" />
      <div className="orb w-[400px] h-[400px] bg-[#f0f0ff] top-[35%] right-[8%] opacity-25" style={{ animation: 'orb 22s ease-in-out infinite reverse' }} />

      {/* Dot pattern */}
      <div className="absolute inset-0 dot-grid opacity-25 pointer-events-none" />

      <div className="relative z-10 w-full max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 xl:gap-24 items-center">

          {/* Left — Copy */}
          <motion.div
            variants={stagger} initial="hidden" animate="show"
            className="text-center lg:text-left"
          >
            {/* Live badge */}
            <motion.div variants={item} className="flex justify-center lg:justify-start mb-8">
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/90 border border-border/80 shadow-sm glass">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse-slow" />
                <span className="text-[12px] font-semibold text-dim tracking-[0.05em]">IA activa · Respondiendo ahora mismo</span>
                <span className="w-px h-3.5 bg-border" />
                <LiveBars />
              </div>
            </motion.div>

            {/* Headline */}
            <motion.h1 variants={item}
              className="text-display font-semibold text-ink leading-[1.05] tracking-[-0.035em] text-balance"
            >
              Tu negocio funciona.
              <span className="block gradient-text">Aunque tú no estés.</span>
            </motion.h1>

            {/* Sub */}
            <motion.p variants={item}
              className="mt-6 text-[1.1rem] text-dim font-light leading-[1.7] max-w-lg mx-auto lg:mx-0 text-pretty"
            >
              Automatiza llamadas, reservas y clientes con IA de voz.
              Mientras tú duermes, tu recepcionista IA trabaja.
            </motion.p>

            {/* CTAs */}
            <motion.div variants={item} className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 mt-10">
              <button
                onClick={() => document.querySelector('#demo')?.scrollIntoView({ behavior: 'smooth' })}
                className="btn-accent text-[14px] px-8 py-4 rounded-full shadow-glow"
              >
                Ver demo en vivo
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <a
                href="https://wa.me/34611430660?text=Hola%2C%20me%20gustar%C3%ADa%20saber%20m%C3%A1s%20sobre%20AlloStudios"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full border border-border text-[14px] text-dim hover:text-ink hover:border-ink/30 hover:bg-white/60 transition-all duration-300 font-medium"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="#22c55e">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.555 4.122 1.524 5.855L.057 23.943l6.088-1.467C7.878 23.44 9.9 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.988c-1.954 0-3.775-.526-5.332-1.44l-.381-.227-3.949.954.975-3.853-.249-.395C2.031 15.449 1.5 13.787 1.5 12 1.5 6.201 6.201 1.5 12 1.5c5.8 0 10.5 4.701 10.5 10.5 0 5.8-4.7 10.488-10.5 10.488z"/>
                </svg>
                Hablar por WhatsApp
              </a>
            </motion.div>

            <motion.p variants={item} className="mt-5 text-[12px] text-muted text-center lg:text-left">
              Sin permanencia · Sin tarjeta para empezar · Cancela cuando quieras
            </motion.p>
          </motion.div>

          {/* Right — Mockup */}
          <motion.div
            style={{ y }}
            initial={{ opacity: 0, x: 50, y: 20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 1.2, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="hidden lg:flex relative items-center justify-center py-14 px-8"
          >
            <AICallMockup />
          </motion.div>
        </div>
      </div>

      {/* Stats bar */}
      <motion.div
        initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 mt-16 grid grid-cols-2 md:grid-cols-4 gap-3 px-6 max-w-3xl w-full mx-auto"
      >
        {stats.map(s => (
          <div key={s.l} className="glass bg-white/75 border border-border/70 rounded-2xl px-5 py-4 text-center shadow-sm">
            <div className="text-[1.6rem] font-semibold text-ink tracking-[-0.03em] leading-none">{s.n}</div>
            <div className="text-[11px] text-muted mt-1.5 font-medium">{s.l}</div>
          </div>
        ))}
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }} transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          className="w-px h-10 bg-gradient-to-b from-border to-transparent mx-auto"
        />
      </motion.div>
    </section>
  )
}
