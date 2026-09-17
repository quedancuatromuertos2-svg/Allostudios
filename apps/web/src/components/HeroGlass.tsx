'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

// Propuestas de cabecera (se eligen con ?hero=a|b|c|d mientras decidimos; la elegida se queda como única)
type Variante = {
  titulo: string; grad: string; sub: string
  generador: boolean                              // formulario del generador dentro de la cabecera
  datos: { valor: string; texto: string }[]
}
const VARIANTES: Record<string, Variante> = {
  a: {
    titulo: 'Te buscan en Google.', grad: '¿Qué encuentran?',
    sub: 'Una web floja o un Instagram parado pierden clientes cada día sin que lo veas. Te hacemos la web nueva en 7 días y la ves gratis antes de pagar.',
    generador: true,
    datos: [{ valor: 'Desde 499 €', texto: 'web completa, pago único' }, { valor: '7 días', texto: 'de encargo a web publicada' }, { valor: 'Gratis antes', texto: 'ves tu web y luego decides' }],
  },
  b: {
    titulo: 'Estás perdiendo clientes', grad: 'que ni sabes que existían.',
    sub: 'Miran tu web, escriben por Instagram, llaman fuera de horario… y se van a otro. Web nueva en 7 días, Instagram gestionado y una IA que responde 24/7.',
    generador: false,
    datos: [{ valor: 'Desde 499 €', texto: 'web completa, pago único' }, { valor: '7 días', texto: 'de encargo a web publicada' }, { valor: 'Gratis antes', texto: 'ves tu web y luego decides' }],
  },
  c: {
    titulo: 'Tus clientes ya te buscan online.', grad: 'Que te encuentren a ti.',
    sub: 'No a la competencia. Web nueva en 7 días, Instagram que trabaja por ti y una IA que responde 24/7, para negocios de Valencia.',
    generador: true,
    datos: [{ valor: 'Desde 499 €', texto: 'web completa, pago único' }, { valor: '7 días', texto: 'de encargo a web publicada' }, { valor: 'Gratis antes', texto: 'ves tu web y luego decides' }],
  },
  d: {
    titulo: 'Sin web. Sin tiempo. Sin respuestas.', grad: 'Lo arreglamos en 7 días.',
    sub: 'Tú te ocupas de tu negocio; nosotros de que te encuentren, te escriban y les contesten. Escribe el nombre de tu negocio y mira cómo quedaría.',
    generador: true,
    datos: [{ valor: 'Web en 7 días', texto: 'desde 499 €, la ves gratis antes' }, { valor: 'Instagram', texto: 'gestionado cada semana' }, { valor: 'IA 24/7', texto: 'responde DMs y WhatsApp' }],
  },
}

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.09, delayChildren: 0.15 } } }
const item = {
  hidden: { opacity: 0, y: 24, filter: 'blur(6px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } },
}
const wa = 'https://wa.me/34695868793?text=' + encodeURIComponent('Hola, quiero mi demo gratis. Mi negocio es: ')

export default function HeroGlass() {
  const router = useRouter()
  const [v, setV] = useState<Variante>(VARIANTES.a)
  const [negocio, setNegocio] = useState('')
  useEffect(() => {
    const k = new URLSearchParams(window.location.search).get('hero') || ''
    if (VARIANTES[k]) setV(VARIANTES[k])
  }, [])
  function generar(e: React.FormEvent) {
    e.preventDefault()
    const q = new URLSearchParams({ negocio: negocio.trim(), ciudad: 'Valencia' })
    router.push(`/tu-web?${q.toString()}`)
  }

  return (
    <section className="hero-cristal relative min-h-[100dvh] flex flex-col justify-end md:justify-center px-6 pt-64 pb-16 md:pt-40 md:pb-24 overflow-hidden">
      <motion.div variants={stagger} initial="hidden" animate="show" className="relative z-[2] w-full max-w-6xl mx-auto md:px-6">
      <div className="max-w-[40rem] mx-auto md:mx-0 text-center md:text-left">
        <motion.div variants={item} className="lg inline-flex items-center gap-2 px-4 py-2 rounded-full text-[10px] tracking-[0.22em] uppercase font-semibold text-dim mb-9">
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#2bb673', boxShadow: '0 0 8px #2bb673' }} />
          Agencia digital · Valencia
        </motion.div>

        <motion.h1 variants={item} className="lg-h" style={{ fontSize: 'clamp(2.3rem,4.4vw,3.7rem)' }}>
          {v.titulo}
          <span className="lg-grad block">{v.grad}</span>
        </motion.h1>

        <motion.p variants={item} className="mt-6 max-w-lg mx-auto md:mx-0 text-dim" style={{ fontSize: 'clamp(1rem,1.5vw,1.12rem)', lineHeight: 1.6 }}>
          {v.sub}
        </motion.p>

        {v.generador ? (
          <motion.form variants={item} onSubmit={generar} className="lg hero-generador flex flex-col sm:flex-row items-stretch gap-2 p-2 rounded-full mt-8 max-w-lg mx-auto md:mx-0">
            <input value={negocio} onChange={e => setNegocio(e.target.value)} required minLength={2}
              placeholder="Nombre de tu negocio, ej: Peluquería Marta"
              className="flex-1 min-w-0 px-5 py-3.5 rounded-full bg-transparent text-[14px] text-ink placeholder:text-muted outline-none border-0" />
            <button type="submit"
              className="group inline-flex items-center justify-center gap-2.5 pl-6 pr-2.5 py-3 rounded-full font-semibold text-[14px] text-white whitespace-nowrap transition-transform duration-200 hover:-translate-y-0.5 active:scale-[0.98]"
              style={{ background: 'linear-gradient(100deg,#6a5bff,#a05bff)', boxShadow: '0 16px 40px -14px rgba(140,91,255,.6),inset 0 1px 0 rgba(255,255,255,.4)' }}>
              Ver mi web gratis
              <span className="w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-500 group-hover:translate-x-1" style={{ background: 'rgba(255,255,255,.22)' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5"><path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </span>
            </button>
          </motion.form>
        ) : (
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
        )}
        <motion.div variants={item} className="mt-4 text-[13px] text-muted">
          {v.generador ? <>Sin registro, sin tarjeta · <a href="#precios" className="hover:text-ink underline underline-offset-4 transition-colors">ver planes</a> · </> : null}
          <a href={wa} target="_blank" rel="noopener noreferrer" className="hover:text-ink underline underline-offset-4 transition-colors">o hablar por WhatsApp</a>
        </motion.div>

        <motion.div variants={item} className="lg hero-datos grid grid-cols-1 sm:grid-cols-3 rounded-2xl mt-9 max-w-lg mx-auto md:mx-0">
          {v.datos.map(d => (
            <div key={d.valor} className="px-4 py-3 sm:py-4 flex sm:block items-baseline justify-between gap-3 text-left">
              <div className="text-ink font-semibold text-[16px] md:text-[18px] leading-tight">{d.valor}</div>
              <div className="text-muted text-[11.5px] md:text-[12.5px] sm:mt-1 leading-snug text-right sm:text-left">{d.texto}</div>
            </div>
          ))}
        </motion.div>
      </div>
      </motion.div>
    </section>
  )
}
