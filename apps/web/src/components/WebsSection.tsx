'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

/* ─── CSS Browser mockup ─── */
function BrowserMockup() {
  return (
    <div className="rounded-2xl overflow-hidden shadow-2xl border border-white/10">
      {/* Chrome bar */}
      <div className="flex items-center gap-1.5 px-4 py-3 bg-[#1a1a2e] border-b border-white/8">
        <div className="w-2.5 h-2.5 rounded-full bg-white/15" />
        <div className="w-2.5 h-2.5 rounded-full bg-white/15" />
        <div className="w-2.5 h-2.5 rounded-full bg-white/15" />
        <div className="flex-1 mx-3 bg-white/8 rounded-md px-3 py-1.5 text-[10px] text-white/30 font-mono flex items-center gap-2">
          <svg width="7" height="7" viewBox="0 0 8 8" fill="none"><circle cx="4" cy="4" r="3" stroke="currentColor" strokeWidth="1.2"/></svg>
          tunegocio.com
        </div>
      </div>
      {/* Page content */}
      <div className="bg-[#0d0d1a]">
        {/* Hero strip */}
        <div className="relative px-7 pt-7 pb-5 overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 rounded-full blur-3xl" style={{ background: 'rgba(91,91,214,0.18)' }} />
          <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full blur-2xl" style={{ background: 'rgba(124,124,232,0.12)' }} />
          <div className="w-20 h-1.5 rounded-full bg-accent/40 mb-3" />
          <div className="w-56 h-4 rounded-full bg-white/15 mb-1.5" />
          <div className="w-40 h-4 rounded-full bg-white/10 mb-4" />
          <div className="w-52 h-2 rounded-full bg-white/8 mb-1.5" />
          <div className="w-36 h-2 rounded-full bg-white/6 mb-6" />
          <div className="flex gap-2.5">
            <div className="h-8 w-24 rounded-full bg-accent/70 flex items-center justify-center">
              <div className="w-14 h-1.5 rounded-full bg-white/60" />
            </div>
            <div className="h-8 w-24 rounded-full border border-white/15 flex items-center justify-center">
              <div className="w-14 h-1.5 rounded-full bg-white/25" />
            </div>
          </div>
        </div>
        {/* Stats row */}
        <div className="flex gap-2 px-7 pb-4">
          {['#5B5BD6', '#16a34a', '#f59e0b', '#e11d48'].map((c, i) => (
            <div key={i} className="flex-1 rounded-xl p-3 border border-white/6 bg-white/3">
              <div className="w-6 h-3 rounded-full mb-2" style={{ background: `${c}40` }} />
              <div className="w-full h-1.5 rounded-full bg-white/10 mb-1" />
              <div className="w-2/3 h-1.5 rounded-full bg-white/6" />
            </div>
          ))}
        </div>
        {/* Card row */}
        <div className="flex gap-2 px-7 pb-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex-1 rounded-xl p-3 border border-white/6 bg-white/3">
              <div className="w-7 h-7 rounded-lg bg-accent/20 mb-2" />
              <div className="w-full h-1.5 rounded-full bg-white/12 mb-1" />
              <div className="w-3/4 h-1.5 rounded-full bg-white/7" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ─── Mobile mockup ─── */
function PhoneMockup() {
  return (
    <div className="w-[90px] rounded-[22px] overflow-hidden border border-white/12 shadow-xl bg-[#0d0d1a]">
      {/* Notch */}
      <div className="flex justify-center pt-2 pb-1">
        <div className="w-10 h-2 rounded-full bg-white/10" />
      </div>
      {/* Screen */}
      <div className="px-2 pb-3 space-y-1.5">
        <div className="w-full h-12 rounded-lg bg-accent/15 relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-10 h-1.5 rounded-full bg-white/20" />
          </div>
        </div>
        {[1, 2, 3].map(i => (
          <div key={i} className="w-full h-8 rounded-lg bg-white/5 border border-white/6 px-2 flex items-center gap-1.5">
            <div className="w-4 h-4 rounded bg-accent/20 shrink-0" />
            <div className="flex-1 space-y-1">
              <div className="h-1 rounded-full bg-white/15" />
              <div className="h-1 rounded-full bg-white/8 w-2/3" />
            </div>
          </div>
        ))}
        <div className="w-full h-6 rounded-full bg-accent/50 flex items-center justify-center">
          <div className="w-12 h-1.5 rounded-full bg-white/50" />
        </div>
      </div>
    </div>
  )
}

/* ─── Bento feature cards ─── */
const bentoFeatures = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/>
      </svg>
    ),
    title: 'Diseño a medida',
    desc: 'Sin plantillas. Cada web es un proyecto único diseñado desde cero para tu marca.',
    accent: 'bg-violet-50 text-violet-600 border-violet-100',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
      </svg>
    ),
    title: 'Velocidad 99+',
    desc: 'PageSpeed perfecto. Carga en menos de 1 segundo en cualquier dispositivo.',
    accent: 'bg-amber-50 text-amber-600 border-amber-100',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
    ),
    title: 'SEO técnico',
    desc: 'Estructura, metadatos y código optimizados para posicionar en Google desde el día 1.',
    accent: 'bg-blue-50 text-blue-600 border-blue-100',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/>
      </svg>
    ),
    title: 'Mobile-first',
    desc: 'Diseñada primero para móvil. El 70% de tus clientes entran desde el teléfono.',
    accent: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.21h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.96a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
      </svg>
    ),
    title: 'IA integrada',
    desc: 'Tu recepcionista IA y tu web conectados. Reservas online y por voz en un solo sistema.',
    accent: 'bg-purple-50 text-purple-600 border-purple-100',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/>
      </svg>
    ),
    title: 'Diseño que convierte',
    desc: 'CTAs, formularios y flujos pensados para convertir visitas en clientes reales.',
    accent: 'bg-rose-50 text-rose-600 border-rose-100',
  },
]

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
}
const fadeUp = {
  hidden: { opacity: 0, y: 20, filter: 'blur(6px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as [number,number,number,number] } },
}

export default function WebsSection() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y1 = useTransform(scrollYProgress, [0, 1], [-30, 30])
  const y2 = useTransform(scrollYProgress, [0, 1], [30, -30])

  return (
    <section id="webs" ref={ref} className="relative overflow-hidden bg-ink py-[clamp(5rem,12vw,10rem)]">

      {/* Ambient orbs */}
      <div className="absolute w-[700px] h-[700px] rounded-full blur-[120px] top-[-20%] right-[-20%] opacity-20 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #5B5BD6 0%, transparent 65%)' }} />
      <div className="absolute w-[500px] h-[500px] rounded-full blur-[100px] bottom-[-10%] left-[-15%] opacity-15 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #7C7CE8 0%, transparent 65%)' }} />

      {/* Grid */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
      }} />

      <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-12">

        {/* ── HEADER ── */}
        <motion.div
          variants={stagger} initial="hidden" whileInView="show"
          viewport={{ once: true }}
          className="text-center mb-16 md:mb-20"
        >
          <motion.span variants={fadeUp} className="inline-block text-[11px] font-bold tracking-[0.22em] uppercase text-accent mb-5">
            Diseño Web Premium
          </motion.span>
          <motion.h2 variants={fadeUp}
            className="text-headline font-semibold text-white leading-[1.08] tracking-[-0.03em] text-balance"
          >
            Tu negocio merece algo<br />mejor que una plantilla.
          </motion.h2>
          <motion.p variants={fadeUp}
            className="mt-5 text-[1.05rem] text-white/50 font-light max-w-xl mx-auto leading-relaxed text-pretty"
          >
            Diseñamos experiencias digitales que transmiten confianza desde el primer segundo.
            Webs rápidas, modernas y construidas para vender.
          </motion.p>
          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">
            <a
              href="https://wa.me/34611430660?text=Hola%2C%20quiero%20información%20sobre%20páginas%20web%20premium"
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white text-ink text-[13.5px] font-semibold hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300"
            >
              Solicitar propuesta
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                <path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
            <button
              onClick={() => document.querySelector('#precios')?.scrollIntoView({ behavior: 'smooth' })}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-white/15 text-white/60 hover:text-white hover:border-white/30 hover:bg-white/5 text-[13.5px] font-medium transition-all duration-300"
            >
              Ver precios
            </button>
          </motion.div>
        </motion.div>

        {/* ── MOCKUP SHOWCASE ── */}
        <div className="relative flex items-start justify-center gap-5 mb-16 md:mb-20">
          {/* Main browser */}
          <motion.div
            style={{ y: y1 }}
            initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="flex-1 max-w-[560px]"
          >
            <BrowserMockup />

            {/* Badge — PageSpeed */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -top-5 -left-6 bg-white rounded-2xl border border-border shadow-xl px-4 py-3 flex items-center gap-2.5"
            >
              <div className="w-8 h-8 rounded-full border-2 border-green-400 flex items-center justify-center">
                <span className="text-[10px] font-bold text-green-600">99</span>
              </div>
              <div>
                <div className="text-[12px] font-semibold text-ink leading-none">PageSpeed</div>
                <div className="text-[10px] text-muted mt-0.5">Rendimiento perfecto</div>
              </div>
            </motion.div>

            {/* Badge — Entrega */}
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.7 }}
              className="absolute -bottom-4 -right-6 bg-white rounded-2xl border border-border shadow-xl px-4 py-2.5"
            >
              <div className="text-[18px] font-semibold text-ink tracking-[-0.03em] leading-none">7 días</div>
              <div className="text-[10px] text-muted mt-0.5">tiempo de entrega</div>
            </motion.div>
          </motion.div>

          {/* Phone */}
          <motion.div
            style={{ y: y2 }}
            initial={{ opacity: 0, y: 60 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="hidden md:flex items-end pb-8 self-end"
          >
            <PhoneMockup />
          </motion.div>
        </div>

        {/* ── BENTO GRID ── */}
        <motion.div
          variants={stagger} initial="hidden" whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {bentoFeatures.map((f) => (
            <motion.div
              key={f.title}
              variants={fadeUp}
              className="bg-white/5 border border-white/8 rounded-2xl p-5 hover:bg-white/8 hover:border-white/15 transition-all duration-300 group"
            >
              <div className={`inline-flex w-10 h-10 rounded-xl items-center justify-center mb-4 border ${f.accent}`}>
                {f.icon}
              </div>
              <div className="text-[15px] font-semibold text-white mb-1.5">{f.title}</div>
              <div className="text-[13px] text-white/45 leading-relaxed font-light">{f.desc}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* ── BOTTOM STATEMENT ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ delay: 0.3 }}
          className="mt-14 text-center"
        >
          <p className="text-[13px] text-white/25 tracking-[0.12em] uppercase font-medium">
            No solo automatizamos negocios — construimos su presencia digital
          </p>
        </motion.div>

      </div>
    </section>
  )
}
