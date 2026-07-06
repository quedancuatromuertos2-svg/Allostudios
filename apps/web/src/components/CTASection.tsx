'use client'

import { motion } from 'framer-motion'

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
}
const item = {
  hidden: { opacity: 0, y: 20, filter: 'blur(6px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
}

export default function CTASection() {
  return (
    <section className="relative overflow-hidden py-[clamp(5rem,10vw,9rem)] px-6 md:px-12" style={{
      background: 'linear-gradient(160deg, #f8f8ff 0%, #f0f0fd 40%, #e8e8fa 100%)',
    }}>

      {/* Soft ambient orbs */}
      <div className="absolute w-[600px] h-[600px] rounded-full blur-[120px] top-[-20%] left-[-15%] opacity-25 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #5B5BD6 0%, transparent 70%)' }} />
      <div className="absolute w-[400px] h-[400px] rounded-full blur-[80px] bottom-[-10%] right-[-10%] opacity-15 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #7C7CE8 0%, transparent 70%)' }} />

      {/* Wavy lines — image 3 style (white waves on lavender) */}
      <div className="absolute inset-0 pointer-events-none wavy-drift" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 400' preserveAspectRatio='xMidYMid slice'%3E%3Cpath d='M-20 60 C80 20 160 100 280 60 S440 20 560 60 S720 100 820 60' stroke='rgba(91%2C91%2C214%2C0.18)' fill='none' stroke-width='1.5'/%3E%3Cpath d='M-20 140 C80 100 160 180 280 140 S440 100 560 140 S720 180 820 140' stroke='rgba(124%2C124%2C232%2C0.13)' fill='none' stroke-width='1.5'/%3E%3Cpath d='M-20 220 C80 180 160 260 280 220 S440 180 560 220 S720 260 820 220' stroke='rgba(147%2C112%2C219%2C0.10)' fill='none' stroke-width='1'/%3E%3Cpath d='M-20 300 C80 260 160 340 280 300 S440 260 560 300 S720 340 820 300' stroke='rgba(91%2C91%2C214%2C0.08)' fill='none' stroke-width='1'/%3E%3Cpath d='M-20 380 C80 340 160 420 280 380 S440 340 560 380 S720 420 820 380' stroke='rgba(124%2C124%2C232%2C0.06)' fill='none' stroke-width='1'/%3E%3C/svg%3E")`,
        backgroundSize: '800px 400px',
        backgroundRepeat: 'repeat-y',
        opacity: 0.9,
      }} />

      {/* Dot grid */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.35]" style={{
        backgroundImage: 'radial-gradient(circle, rgba(91,91,214,0.18) 1px, transparent 1px)',
        backgroundSize: '28px 28px',
      }} />

      {/* Content */}
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="relative z-10 max-w-3xl mx-auto text-center"
      >
        {/* Eyebrow badge */}
        <motion.div variants={item} className="flex justify-center mb-6">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-accent/20 shadow-sm text-[11px] font-semibold tracking-[0.12em] uppercase text-accent">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            Plazas limitadas este mes
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h2 variants={item}
          className="text-headline font-semibold text-ink leading-[1.1] tracking-[-0.03em] text-balance"
        >
          Tu negocio, captando clientes solo.
        </motion.h2>

        {/* Sub */}
        <motion.p variants={item}
          className="mt-5 text-lg text-dim font-light max-w-xl mx-auto leading-relaxed text-pretty"
        >
          Únete a los negocios que usan AlloStudios para llenar sus redes de contenido,
          captar interesados y responder cada DM con IA — sin perder un solo lead.
        </motion.p>

        {/* CTAs */}
        <motion.div variants={item} className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-10">
          <button
            onClick={() => document.querySelector('#precios')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-4 rounded-full bg-accent hover:bg-accent-dark text-white text-sm font-semibold transition-all duration-300 hover:shadow-glow hover:-translate-y-0.5 active:scale-[0.98] flex items-center gap-2"
          >
            Empieza ahora
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <a
            href="https://wa.me/34695868793?text=Hola%2C%20quiero%20hablar%20con%20un%20experto%20de%20AlloStudios"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 rounded-full border border-ink/15 text-ink/70 hover:text-ink hover:border-ink/30 hover:bg-white/60 text-sm font-medium transition-all duration-300 backdrop-blur-sm"
          >
            Hablar con un experto
          </a>
        </motion.div>

        {/* Trust line */}
        <motion.p variants={item} className="mt-6 text-[12px] text-muted">
          Sin permanencia · En marcha en una semana · Cancela cuando quieras
        </motion.p>
      </motion.div>
    </section>
  )
}
