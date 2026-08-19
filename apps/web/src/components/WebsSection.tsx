'use client'

import { motion } from 'framer-motion'
import DemoDeck from '@/components/DemoDeck'

/*  Bento feature cards — */
const bentoFeatures = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/>
      </svg>
    ),
    title: 'Diseño a medida',
    desc: 'Sin plantillas. Cada web es un proyecto único diseñado desde cero para tu negocio.',
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
    desc: 'El asistente de IA y tu web conectados. Captas leads por la web y por tus DMs en un solo sistema.',
    accent: 'bg-purple-50 text-purple-600 border-purple-100',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/>
      </svg>
    ),
    title: 'Diseño que convierte',
    desc: 'Catálogo, formularios y CTAs pensados para convertir visitas en clientes.',
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
  return (
    <section id="webs" className="relative overflow-hidden bg-ink py-[clamp(5rem,12vw,10rem)]">

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

        {/* —★ HEADER —★ */}
        <motion.div
          variants={stagger} initial="hidden" whileInView="show"
          viewport={{ once: true }}
          className="text-center mb-16 md:mb-20"
        >
          <motion.span variants={fadeUp} className="inline-block text-[11px] font-bold tracking-[0.22em] uppercase text-accent mb-5">
            Webs Premium a medida
          </motion.span>
          <motion.h2 variants={fadeUp}
            className="text-headline font-semibold text-white leading-[1.08] tracking-[-0.03em] text-balance"
          >
            Tu negocio merece algo<br />mejor que una plantilla.
          </motion.h2>
          <motion.p variants={fadeUp}
            className="mt-5 text-[1.05rem] text-white/50 font-light max-w-xl mx-auto leading-relaxed text-pretty"
          >
            Diseñamos webs profesionales que transmiten confianza desde el primer segundo.
            Rápidas, modernas y construidas para captar leads.
          </motion.p>
          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">
            <a
              href="https://wa.me/34695868793?text=Hola%2C%20quiero%20información%20sobre%20páginas%20web%20premium"
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white text-ink text-[14px] font-semibold hover:-translate-y-0.5 hover:shadow-xl transition-all duration-300 active:scale-[0.98]"
              style={{ boxShadow: '0 8px 28px rgba(255,255,255,0.15), 0 1px 0 rgba(255,255,255,0.9) inset' }}
            >
              Solicitar presupuesto
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                <path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
            <span className="text-[12px] text-white/30">Respuesta en menos de 24h</span>
          </motion.div>
        </motion.div>

        {/* —★ BARAJA DE DEMOS —★ */}
        <div className="mb-16 md:mb-20">
          <DemoDeck />
          <p className="mt-5 text-center text-[11px] uppercase tracking-[0.18em] text-white/25">
            Toca la baraja para ver otro sector
          </p>
        </div>

        {/* —★ BENTO GRID —★ */}
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

        {/* —★ BOTTOM STATEMENT —★ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ delay: 0.3 }}
          className="mt-14 text-center"
        >
          <p className="text-[13px] text-white/25 tracking-[0.12em] uppercase font-medium">
            No solo captamos tus leads — construimos la presencia digital de tu negocio
          </p>
        </motion.div>

      </div>
    </section>
  )
}
