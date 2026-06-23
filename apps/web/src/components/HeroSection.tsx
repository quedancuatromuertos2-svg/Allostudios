'use client'

import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { useRef } from 'react'

function LiveBars({ color = '#5B5BD6' }: { color?: string }) {
  const bars = [{ h: 35 }, { h: 70 }, { h: 100 }, { h: 80 }, { h: 50 }, { h: 30 }, { h: 65 }, { h: 90 }, { h: 45 }]
  return (
    <div className="flex items-end gap-[2.5px] h-4">
      {bars.map((b, i) => (
        <motion.div key={i}
          className="w-[2.5px] rounded-full"
          style={{ height: `${b.h}%`, background: color, willChange: 'transform' }}
          animate={{ scaleY: [0.3, 1, 0.3] }}
          transition={{ duration: 1.1 + i * 0.08, repeat: Infinity, delay: i * 0.07, ease: 'easeInOut' }}
        />
      ))}
    </div>
  )
}

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } }
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
}

/* Two product chips shown in stats bar */
const stats = [
  { n: '+3×', l: 'alcance en redes' },
  { n: '24/7', l: 'DMs respondidos' },
  { n: '16', l: 'posts al mes' },
  { n: '0', l: 'leads perdidos' },
]

function AICallMockup() {
  return (
    <div className="relative w-[300px] lg:w-[320px] xl:w-[340px]">
      {/* Glow */}
      <div className="absolute inset-0 -m-4 rounded-[36px] bg-gradient-to-br from-accent/12 via-transparent to-accent-mid/8 blur-2xl pointer-events-none" />

      {/* Card — liquid glass absorbs the vivid mesh from behind */}
      <div className="relative rounded-[28px] border overflow-hidden" style={{
        backdropFilter: 'blur(36px) saturate(200%) brightness(1.08)',
        WebkitBackdropFilter: 'blur(36px) saturate(200%) brightness(1.08)',
        background: 'rgba(255,255,255,0.76)',
        border: '1px solid rgba(255,255,255,0.68)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.95), 0 24px 70px rgba(91,91,214,0.18), 0 4px 16px rgba(0,0,0,0.06)',
      }}>
        <div className="absolute top-0 right-0 w-52 h-52 rounded-full blur-3xl bg-accent-light opacity-35 -translate-y-1/3 translate-x-1/3 pointer-events-none" />

        {/* Header */}
        <div className="relative flex items-center gap-3 px-5 py-4 border-b border-border/50">
          <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center shrink-0">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.21h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.96a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[13px] font-semibold text-ink">Instagram · Mensaje directo</div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <motion.div className="w-1.5 h-1.5 rounded-full bg-green-500" animate={{ opacity: [1, 0.2, 1] }} transition={{ duration: 1.8, repeat: Infinity }} />
              <span className="text-[11px] text-green-600 font-medium">IA respondiendo…</span>
              <span className="ml-1"><LiveBars /></span>
            </div>
          </div>
          <span className="text-[10px] font-bold text-accent bg-accent-light px-2.5 py-1 rounded-full shrink-0">IA</span>
        </div>

        {/* Messages */}
        <div className="relative px-5 py-4 space-y-3">
          <div className="bg-surface rounded-2xl rounded-tl-sm px-3.5 py-2.5 max-w-[88%]">
            <div className="text-[10px] font-semibold text-muted mb-1 tracking-[0.06em] uppercase">Interesado</div>
            <div className="text-[12.5px] text-ink leading-relaxed">¿El piso de Calle Goya sigue disponible?</div>
          </div>
          <div className="bg-accent-light rounded-2xl rounded-tr-sm px-3.5 py-2.5 max-w-[88%] ml-auto">
            <div className="text-[10px] font-semibold text-accent mb-1 tracking-[0.06em] uppercase">IA · AlloStudios</div>
            <div className="text-[12.5px] text-ink leading-relaxed">Sí, sigue disponible. ¿Le agendo una visita mañana a las 18:00?</div>
          </div>
        </div>

        {/* Confirmation */}
        <div className="mx-5 mb-5 bg-surface rounded-xl px-3.5 py-3 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center shrink-0">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[12px] font-semibold text-ink leading-none mb-0.5">Visita agendada</div>
            <div className="text-[10.5px] text-muted">Mañana 18:00 · Lead enviado al agente ✓</div>
          </div>
          <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center shrink-0">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2.5 6l2.5 2.5 4.5-5" stroke="#16a34a" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Float badge — web */}
      <motion.div
        animate={{ y: [0, -9, 0] }}
        transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
        style={{ willChange: 'transform' }}
        className="absolute -top-8 -left-12 bg-white rounded-2xl border border-border shadow-lg px-4 py-2.5"
      >
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.2" strokeLinecap="round">
              <rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
            </svg>
          </div>
          <div>
            <div className="text-[11px] font-semibold text-ink leading-none">Web en 7 días</div>
            <div className="text-[9px] text-muted mt-0.5">PageSpeed 99+</div>
          </div>
        </div>
      </motion.div>

      {/* Float badge — uptime */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        style={{ willChange: 'transform' }}
        className="absolute -bottom-7 -right-10 bg-white rounded-2xl border border-border shadow-lg px-3.5 py-2.5"
      >
        <div className="flex items-center gap-2">
          <div className="relative w-7 h-7 rounded-full bg-green-50 flex items-center justify-center shrink-0">
            <motion.div className="w-2.5 h-2.5 rounded-full bg-green-500" animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }} transition={{ duration: 2, repeat: Infinity }} />
          </div>
          <div>
            <div className="text-[12px] font-semibold text-ink leading-none mb-0.5">24/7 activo</div>
            <div className="text-[10px] text-muted">sin descanso</div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default function HeroSection() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const rawY = useTransform(scrollYProgress, [0, 1], [0, 55])
  const y = useSpring(rawY, { stiffness: 60, damping: 20 })

  // Simplified scroll layers — only GPU-compositable transforms (no opacity changes on scroll)
  const meshY = useTransform(scrollYProgress, [0, 1], [0, -80])
  const wavyY = useTransform(scrollYProgress, [0, 1], [0, -40])

  // SVG wavy lines (image 3 style — white waves on lavender)
  const wavySvg = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 400' preserveAspectRatio='xMidYMid slice'%3E%3Cpath d='M-20 60 C80 20 160 100 280 60 S440 20 560 60 S720 100 820 60' stroke='rgba(147%2C112%2C219%2C0.22)' fill='none' stroke-width='2'/%3E%3Cpath d='M-20 120 C80 80 160 160 280 120 S440 80 560 120 S720 160 820 120' stroke='rgba(147%2C112%2C219%2C0.16)' fill='none' stroke-width='1.5'/%3E%3Cpath d='M-20 180 C80 140 160 220 280 180 S440 140 560 180 S720 220 820 180' stroke='rgba(91%2C91%2C214%2C0.13)' fill='none' stroke-width='1.5'/%3E%3Cpath d='M-20 240 C80 200 160 280 280 240 S440 200 560 240 S720 280 820 240' stroke='rgba(124%2C124%2C232%2C0.10)' fill='none' stroke-width='1'/%3E%3Cpath d='M-20 300 C80 260 160 340 280 300 S440 260 560 300 S720 340 820 300' stroke='rgba(147%2C112%2C219%2C0.08)' fill='none' stroke-width='1'/%3E%3Cpath d='M-20 360 C80 320 160 400 280 360 S440 320 560 360 S720 400 820 360' stroke='rgba(91%2C91%2C214%2C0.07)' fill='none' stroke-width='1'/%3E%3C/svg%3E")`

  return (
    <section ref={ref} className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-20 pb-12">

      {/* ── LAYER A — Pixel mesh color map ── */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: [
            'radial-gradient(ellipse 48% 38% at 72% 4%,  rgba(255,0,200,0.96)  0%, rgba(200,0,180,0.60) 40%, transparent 58%)',
            'radial-gradient(ellipse 38% 30% at 11% 16%, rgba(230,20,240,0.88)  0%, rgba(180,0,220,0.55) 38%, transparent 54%)',
            'radial-gradient(ellipse 30% 50% at 2%  52%, rgba(0,80,255,0.84)    0%, rgba(0,60,200,0.50) 40%, transparent 56%)',
            'radial-gradient(ellipse 55% 42% at 5%  93%, rgba(0,220,255,0.90)   0%, rgba(0,170,230,0.55) 40%, transparent 56%)',
            'radial-gradient(ellipse 45% 38% at 95% 90%, rgba(0,190,245,0.82)   0%, rgba(0,140,220,0.50) 38%, transparent 54%)',
            'radial-gradient(ellipse 42% 42% at 55% 42%, rgba(200,140,255,0.48) 0%, rgba(160,80,240,0.28) 45%, transparent 60%)',
            'linear-gradient(145deg, #12006e 0%, #480090 28%, #0a0060 55%, #002268 100%)',
          ].join(', '),
          y: meshY,
          opacity: 0.38,
          willChange: 'transform',
        }}
        aria-hidden
      />

      {/* ── LAYER B — Dense halftone pixel grid ── */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='6' height='6'%3E%3Ccircle cx='3' cy='3' r='1.8' fill='rgba(255%2C255%2C255%2C0.30)'/%3E%3C/svg%3E")`,
          backgroundSize: '6px 6px',
          mixBlendMode: 'overlay',
          y: meshY,
          opacity: 0.44,
          willChange: 'transform',
        }}
        aria-hidden
      />

      {/* ── LAYER C — Liquid glass frosted overlay (static — no scroll-driven opacity) ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backdropFilter: 'blur(6px) saturate(130%) brightness(1.12)',
          WebkitBackdropFilter: 'blur(6px) saturate(130%) brightness(1.12)',
          background: 'rgba(255,255,255,0.10)',
        }}
        aria-hidden
      />

      {/* ── LAYER D — Wavy organic lines for depth ── */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: wavySvg,
          backgroundSize: '800px 400px',
          backgroundRepeat: 'repeat-y',
          y: wavyY,
          opacity: 0.52,
          willChange: 'transform',
        }}
        aria-hidden
      />

      {/* ── READABILITY VEIL — static ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(105deg, rgba(250,250,249,0.90) 0%, rgba(250,250,249,0.70) 28%, rgba(250,250,249,0.30) 52%, rgba(250,250,249,0.06) 72%, transparent 100%)',
          opacity: 0.52,
        }}
        aria-hidden
      />

      {/* Noise */}
      <div className="noise" aria-hidden />

      {/* Mesh — animated (slow breath) */}
      <div className="absolute inset-0 mesh-hero pointer-events-none" />

      {/* Orbs */}
      <div className="orb w-[800px] h-[800px] bg-accent-light top-[-25%] left-[-25%] opacity-45 animate-orb" />
      <div className="orb w-[600px] h-[600px] bg-[#e8e8ff] bottom-[-15%] right-[-20%] opacity-35 animate-orb2" />

      {/* Dot pattern */}
      <div className="absolute inset-0 dot-grid opacity-20 pointer-events-none" />

      <div className="relative z-10 w-full max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 xl:gap-24 items-center">

          {/* ── LEFT — Copy ── */}
          <motion.div variants={stagger} initial="hidden" animate="show" className="text-center lg:text-left">

            {/* Product chips — clarity pills */}
            <motion.div variants={item} className="flex flex-wrap justify-center lg:justify-start gap-2 mb-7">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[12px] font-semibold text-accent" style={{
                backdropFilter: 'blur(20px) saturate(180%)',
                WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                background: 'rgba(238,239,255,0.82)',
                border: '1px solid rgba(91,91,214,0.18)',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.9)',
              }}>
                <LiveBars color="#5B5BD6" />
                Instagram gestionado
              </div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[12px] font-semibold text-emerald-700" style={{
                backdropFilter: 'blur(20px) saturate(180%)',
                WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                background: 'rgba(240,253,244,0.82)',
                border: '1px solid rgba(34,197,94,0.18)',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.9)',
              }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                  <rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/>
                </svg>
                Webs Inmobiliarias
              </div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[12px] font-semibold text-orange-700" style={{
                backdropFilter: 'blur(20px) saturate(180%)',
                WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                background: 'rgba(255,247,237,0.82)',
                border: '1px solid rgba(249,115,22,0.18)',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.9)',
              }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                </svg>
                Anuncios Meta
              </div>
            </motion.div>

            {/* Live indicator */}
            <motion.div variants={item} className="flex justify-center lg:justify-start mb-6">
              <div className="inline-flex items-center gap-2.5 px-3.5 py-2 rounded-full bg-white/85 border border-border/60 shadow-sm glass text-[11.5px] font-medium text-dim">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse-slow shrink-0" />
                Marketing activo · Captando clientes cada día
              </div>
            </motion.div>

            {/* Headline */}
            <motion.h1 variants={item}
              className="text-display font-semibold text-ink leading-[1.05] tracking-[-0.035em] text-balance"
            >
              Más captaciones.
              <span className="block gradient-text">Sin tocar el marketing.</span>
            </motion.h1>

            {/* Sub — both products crystal clear */}
            <motion.p variants={item}
              className="mt-6 text-[1.05rem] text-dim font-light leading-[1.75] max-w-lg mx-auto lg:mx-0 text-pretty"
            >
              Gestionamos el Instagram, los anuncios y la web de tu inmobiliaria.
              Y un asistente de IA responde tus DMs, cualifica al interesado
              y agenda la visita — 24/7. Tú solo cierras.
            </motion.p>

            {/* CTAs — dual product */}
            <motion.div variants={item} className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 mt-9">
              <button
                onClick={() => document.querySelector('#servicios')?.scrollIntoView({ behavior: 'smooth' })}
                className="btn-accent text-[14px] px-8 py-4 rounded-full shadow-glow"
              >
                Captar más leads
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <a
                href="https://wa.me/34613112671?text=Hola%2C%20me%20gustar%C3%ADa%20saber%20m%C3%A1s%20sobre%20AlloStudios"
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full border border-border text-[14px] text-dim hover:text-ink hover:border-ink/30 hover:bg-white/60 transition-all duration-300 font-medium"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="#22c55e">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.555 4.122 1.524 5.855L.057 23.943l6.088-1.467C7.878 23.44 9.9 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.988c-1.954 0-3.775-.526-5.332-1.44l-.381-.227-3.949.954.975-3.853-.249-.395C2.031 15.449 1.5 13.787 1.5 12 1.5 6.201 6.201 1.5 12 1.5c5.8 0 10.5 4.701 10.5 10.5 0 5.8-4.7 10.488-10.5 10.488z"/>
                </svg>
                Hablar con un experto
              </a>
            </motion.div>

            <motion.p variants={item} className="mt-4 text-[11.5px] text-muted text-center lg:text-left">
              Sin permanencia · Resultados desde el primer mes
            </motion.p>
          </motion.div>

          {/* ── RIGHT — Mockup ── */}
          <motion.div
            style={{ y, willChange: 'transform' }}
            initial={{ opacity: 0, x: 50, y: 20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 1.2, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="hidden lg:flex relative items-center justify-center py-14 px-8"
          >
            <AICallMockup />
          </motion.div>
        </div>
      </div>

      {/* ── Stats — covers both products ── */}
      <motion.div
        initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 mt-16 grid grid-cols-2 md:grid-cols-4 gap-3 px-6 max-w-3xl w-full mx-auto"
      >
        {stats.map(s => (
          <div key={s.l} className="rounded-2xl px-5 py-4 text-center" style={{
            backdropFilter: 'blur(24px) saturate(180%) brightness(1.06)',
            WebkitBackdropFilter: 'blur(24px) saturate(180%) brightness(1.06)',
            background: 'rgba(255,255,255,0.72)',
            border: '1px solid rgba(255,255,255,0.65)',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.95), 0 4px 16px rgba(91,91,214,0.07)',
          }}>
            <div className="text-[1.55rem] font-semibold text-ink tracking-[-0.03em] leading-none">{s.n}</div>
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
