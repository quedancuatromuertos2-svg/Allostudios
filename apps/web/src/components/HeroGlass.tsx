'use client'

import { motion } from 'framer-motion'
import { useVariante } from '@/lib/variante'

// Cabecera elegida el 17/09/2026 (propuesta B): dolor general + «tranquilo, nos encargamos» + datos
const TITULO = 'Estás perdiendo clientes'
const TITULO_GRAD = 'que ni sabes que existían.'
const SUB = 'Miran tu web, escriben por Instagram, llaman fuera de horario… y se van a otro. Tranquilo: de eso nos encargamos nosotros. Web nueva en 7 días, Instagram gestionado y una IA que responde 24/7.'
const datos = [
  { valor: 'Desde 499 €', texto: 'web completa, pago único' },
  { valor: '7 días', texto: 'de encargo a web publicada' },
  { valor: 'Gratis antes', texto: 'ves tu web y luego decides' },
]

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.09, delayChildren: 0.15 } } }
const item = {
  hidden: { opacity: 0, y: 24, filter: 'blur(6px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } },
}
const wa = 'https://wa.me/34695868793?text=' + encodeURIComponent('Hola, quiero mi demo gratis. Mi negocio es: ')

export default function HeroGlass() {
  // cartel: el cartel de cristal aprobado, anclado a la derecha y fundido con el grafito (no se deforma en 21:9)
  // marco:  sin cristal de fondo; el cartel 4:5 enmarcado a la derecha, como una pieza física
  // luz:    sin cristal; la luz de la marca y «allo.» como marca de agua
  const v = useVariante('hero', 'cartel')

  return (
    <section className={`hero hero-${v} relative min-h-[100dvh] flex flex-col justify-end md:justify-center px-6 pt-64 pb-16 md:pt-40 md:pb-24 overflow-hidden`}>
      {v === 'cartel' && <div className="hero-cartel-img absolute inset-y-0 right-0 pointer-events-none" aria-hidden />}
      {v === 'luz' && <div className="hero-luz-marca absolute inset-0 pointer-events-none" aria-hidden><span>allo.</span></div>}

      <motion.div variants={stagger} initial="hidden" animate="show" className={`hero-marco relative z-[2] w-full max-w-6xl mx-auto md:px-6 ${v === 'marco' ? 'grid md:grid-cols-[1.1fr_.9fr] gap-12 items-center' : ''}`}>
      <div className="hero-texto max-w-[40rem] mx-auto md:mx-0 text-center md:text-left">
        <motion.div variants={item} className="lg inline-flex items-center gap-2 px-4 py-2 rounded-full text-[10px] tracking-[0.22em] uppercase font-semibold text-dim mb-9">
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#2bb673', boxShadow: '0 0 8px #2bb673' }} />
          Agencia digital · Valencia
        </motion.div>

        <motion.h1 variants={item} className="lg-h hero-h1">
          {TITULO}
          <span className="lg-grad block">{TITULO_GRAD}</span>
        </motion.h1>

        <motion.p variants={item} className="hero-sub mt-6 max-w-lg mx-auto md:mx-0 text-dim">
          {SUB}
        </motion.p>

        <motion.div variants={item} className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-3 mt-8">
          <a href="#tu-web"
            className="group inline-flex items-center gap-2.5 pl-7 pr-2.5 py-3.5 rounded-full font-semibold text-[14px] text-white transition-transform duration-200 hover:-translate-y-0.5 active:scale-[0.98]"
            style={{ background: 'linear-gradient(100deg,#6a5bff,#a05bff)', boxShadow: '0 16px 40px -14px rgba(140,91,255,.6),inset 0 1px 0 rgba(255,255,255,.4)' }}>
            Mira tu web gratis
            <span className="w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-px" style={{ background: 'rgba(255,255,255,.22)', transitionTimingFunction: 'cubic-bezier(.32,.72,0,1)' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5"><path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </span>
          </a>
          <a href="#precios" className="lg px-7 py-4 rounded-full font-semibold text-[14px] text-ink">Ver planes</a>
        </motion.div>
        <motion.div variants={item} className="mt-4 text-[13px] text-muted">
          <a href={wa} target="_blank" rel="noopener noreferrer" className="hover:text-ink underline underline-offset-4 transition-colors">o hablar por WhatsApp</a>
        </motion.div>

        <motion.div variants={item} className="hero-bandeja mt-9 max-w-lg mx-auto md:mx-0 p-1.5 rounded-[1.6rem]">
        <div className="lg hero-datos grid grid-cols-1 sm:grid-cols-3 rounded-[calc(1.6rem-0.375rem)]">
          {datos.map(d => (
            <div key={d.valor} className="px-4 py-3 sm:py-4 flex sm:block items-baseline justify-between gap-3 text-left">
              <div className="text-ink font-semibold text-[16px] md:text-[18px] leading-tight">{d.valor}</div>
              <div className="text-muted text-[11.5px] md:text-[12.5px] sm:mt-1 leading-snug text-right sm:text-left">{d.texto}</div>
            </div>
          ))}
        </div>
        </motion.div>
      </div>

      {v === 'marco' && (
        <motion.div variants={item} className="hidden md:block justify-self-end">
          <div className="cartel-marco p-2 rounded-[2rem] rotate-[-2deg] transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:rotate-0">
            <img src="/marca/cartel.jpg" alt="Cartel allo." className="block w-[min(30vw,420px)] rounded-[calc(2rem-0.5rem)]" />
          </div>
        </motion.div>
      )}
      </motion.div>
    </section>
  )
}
