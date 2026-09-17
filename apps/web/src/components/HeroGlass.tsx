'use client'

import { motion } from 'framer-motion'

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
  // Cabecera definitiva (18/09/2026): el cartel de cristal aprobado. Composición fija en un escenario 16:9
  // (ancho = min(100vw, 100dvh·16/9), centrado): texto, panel e imagen se escalan juntos y se ven igual en
  // cualquier pantalla. En 21:9 sobran bandas de grafito a los lados; en 16:10, arriba y abajo.
  return (
    <section className="hero relative min-h-[100dvh] overflow-hidden">
      <div className="hero-escenario">
        <div className="hero-cartel-img absolute inset-0" aria-hidden />
        <motion.div variants={stagger} initial="hidden" animate="show" className="hero-panel-marco absolute">
          <div className="hero-panel">
            <motion.div variants={item} className="hero-etiqueta inline-flex items-center gap-2 rounded-full font-semibold text-dim">
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#2bb673', boxShadow: '0 0 8px #2bb673' }} />
              Agencia digital · Valencia
            </motion.div>
            <motion.h1 variants={item} className="lg-h hero-h1">
              {TITULO}
              <span className="lg-grad block">{TITULO_GRAD}</span>
            </motion.h1>
            <motion.p variants={item} className="hero-sub text-dim">{SUB}</motion.p>
            <motion.div variants={item} className="hero-botones flex flex-wrap items-center">
              <a href="#tu-web" className="btn-primario group inline-flex items-center gap-2.5 rounded-full font-semibold text-white">
                Mira tu web gratis
                <span className="hero-flecha rounded-full flex items-center justify-center transition-transform duration-500 group-hover:translate-x-1" style={{ background: 'rgba(255,255,255,.22)' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5"><path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </span>
              </a>
              <a href="#precios" className="lg btn-secundario rounded-full font-semibold text-ink">Ver planes</a>
              <a href={wa} target="_blank" rel="noopener noreferrer" className="hero-wa text-muted hover:text-ink underline underline-offset-4 transition-colors">o hablar por WhatsApp</a>
            </motion.div>
            <motion.div variants={item} className="hero-datos grid grid-cols-3">
              {datos.map(d => (
                <div key={d.valor}>
                  <div className="hero-dato text-ink font-semibold leading-tight">{d.valor}</div>
                  <div className="hero-dato-txt text-muted leading-snug">{d.texto}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
