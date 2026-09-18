'use client'

import { motion } from 'framer-motion'

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
    desc: 'El asistente de IA y tu web conectados. Captas leads por la web y por WhatsApp en un solo sistema.',
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

const webs = [
  { slug: 'navaja', nombre: 'Navaja', tipo: 'Barbería · Ruzafa', url: 'https://concepto-navaja.vercel.app', nota: 'Verde botella, latón y una carta de precios como la de un barbero de verdad.' },
  { slug: 'serra', nombre: 'Clínica Serra', tipo: 'Dental · Benimaclet', url: 'https://concepto-serra.vercel.app', nota: 'Madera, salvia y la primera visita gratis como gancho para pedir cita.' },
  { slug: 'sequer', nombre: 'Sequer', tipo: 'Arrocería · El Palmar', url: 'https://concepto-sequer.vercel.app', nota: 'Carbón y brasa: la paella al fuego a pantalla completa y reserva en un toque.' },
]
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } }
const fadeUp = {
  hidden: { opacity: 0, y: 24, filter: 'blur(6px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
}

/*
  Páginas web: un solo apartado con el mensaje («mejor que una plantilla»), los seis rasgos como
  lista numerada y, debajo, la prueba: las tres webs de concepto reales. Sustituye a la maqueta
  de navegador con datos falsos y al apartado «Trabajo reciente» separado.
*/
export default function WebsSection({ titular = 'h2' }: { titular?: 'h1' | 'h2' }) {
  const H = titular === 'h1' ? motion.h1 : motion.h2
  return (
    <section id="webs" className="webs relative overflow-hidden py-[clamp(5rem,12vw,10rem)]">
      <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-12">

        <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} >
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-9">
            <div>
              <motion.span variants={fadeUp} className="eyebrow block mb-5">Una web que no parece de plantilla</motion.span>
              <H variants={fadeUp} className="text-headline font-semibold text-ink leading-[1.08] tracking-[-0.03em] text-balance">
                Si tu web parece de plantilla,<br />el cliente piensa que tu negocio también.
              </H>
            </div>
            <motion.p variants={fadeUp} className="text-dim font-light text-[14px] max-w-sm md:text-right">
              Tres conceptos publicados para tres sectores. Entra y tócalas: así de distinta puede ser la tuya.
            </motion.p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
            {webs.map(t => (
              <motion.a key={t.slug} variants={fadeUp} href={t.url} target="_blank" rel="noopener noreferrer"
                className="trabajo group block rounded-[1.6rem] p-1.5 transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-1">
                <div className="relative rounded-[calc(1.6rem-0.375rem)] overflow-hidden aspect-[4/3]">
                  <img src={`/marca/trabajo/${t.slug}.jpg`} alt={`Web de concepto ${t.nombre}`}
                    className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-[1200ms] ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-[1.03]" />
                  <img src={`/marca/trabajo/${t.slug}-m.jpg`} alt="" aria-hidden
                    className="absolute right-4 bottom-0 w-[22%] rounded-t-[10px] shadow-[0_20px_40px_-16px_rgba(0,0,0,.6)] translate-y-3 transition-transform duration-[1200ms] ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-y-1" />
                  <span className="absolute left-4 top-4 text-[10px] font-semibold tracking-[0.2em] uppercase px-2.5 py-1 rounded-full bg-black/40 text-white/85 backdrop-blur-md">Concepto</span>
                </div>
                <div className="px-3 pt-4 pb-2.5">
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="text-[17px] font-semibold text-ink">{t.nombre}</span>
                    <span className="text-[11px] tracking-[0.12em] uppercase text-muted whitespace-nowrap">{t.tipo}</span>
                  </div>
                  <p className="mt-1.5 text-[13.5px] text-dim font-light leading-relaxed">{t.nota}</p>
                </div>
              </motion.a>
            ))}
          </div>
          <motion.p variants={fadeUp} className="mt-8 text-[13px] text-muted text-center">
            Negocios y datos ficticios, diseño real. La tuya la ves gratis en{' '}
            <a href="#tu-web" className="text-ink underline underline-offset-4 hover:text-accent transition-colors">30 segundos</a>.
          </motion.p>
        </motion.div>

        <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.25 }}
          className="mt-20 md:mt-24 grid lg:grid-cols-[1.05fr_.95fr] gap-10 lg:gap-16 items-end">
          <div>
            <motion.h3 variants={fadeUp} className="font-display text-[clamp(1.6rem,2.8vw,2.4rem)] font-semibold text-ink leading-[1.1] tracking-[-0.03em] text-balance">
              Tu negocio merece algo<br />mejor que una plantilla.
            </motion.h3>
            <motion.p variants={fadeUp} className="mt-5 text-[1.05rem] text-dim font-light max-w-md leading-relaxed text-pretty">
              Diseñamos webs que transmiten confianza desde el primer segundo. Rápidas, a medida y construidas para que te escriban.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center gap-3 mt-8">
              <a href="/contratar" className="btn-primario group inline-flex items-center gap-2.5 pl-7 pr-2.5 py-3.5 rounded-full text-[14px] font-semibold">
                Ver precios y contratar
                <span className="w-8 h-8 rounded-full flex items-center justify-center bg-white/20 transition-transform duration-500 group-hover:translate-x-1"><svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></span>
              </a>
              <span className="text-[12px] text-muted">0 € de entrada · desglose claro</span>
            </motion.div>
          </div>
          <motion.ol variants={fadeUp} className="rasgos grid sm:grid-cols-2 gap-x-8 gap-y-4">
            {bentoFeatures.map((f, i) => (
              <li key={f.title} className="flex items-start gap-3.5">
                <span className="font-mono text-[11px] text-muted tabular-nums pt-1">{String(i + 1).padStart(2, '0')}</span>
                <span><span className="block text-[14.5px] font-semibold text-ink">{f.title}</span><span className="block text-[13px] text-dim font-light leading-relaxed mt-0.5">{f.desc}</span></span>
              </li>
            ))}
          </motion.ol>
        </motion.div>

      </div>
    </section>
  )
}
