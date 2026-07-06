'use client'

import { motion } from 'framer-motion'

function CheckIcon({ dark }: { dark?: boolean }) {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" className="shrink-0 mt-px">
      <circle cx="8" cy="8" r="7" fill={dark ? 'rgba(255,255,255,0.1)' : 'rgba(91,91,214,0.1)'}/>
      <path d="M5 8l2.2 2.2L11 5.5" stroke={dark ? 'rgba(255,255,255,0.75)' : '#5B5BD6'} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function StarIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="#5B5BD6" className="shrink-0">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
    </svg>
  )
}

const waBase = 'https://wa.me/34695868793?text='

/* Servicios mensuales recurrentes (fila de apoyo bajo la escalera de webs) */
const monthly = [
  { n: 'Gestión de Instagram', p: 'desde 199 €/mes', msg: 'Hola, me interesa la gestión de Instagram de AlloStudios para mi negocio.' },
  { n: 'Instagram Pro + Ads', p: '349 €/mes', msg: 'Hola, me interesa el plan Instagram Pro de AlloStudios.' },
  { n: 'Asistente IA en WhatsApp/DMs', p: '199 € + 39 €/mes', msg: 'Hola, me interesa el asistente de IA que responde mensajes 24/7.' },
  { n: 'SEO local · salir en Google', p: '199 € + 99 €/mes', msg: 'Hola, quiero que mi negocio salga en Google (SEO local).' },
  { n: 'Reseñas 5★ en Google', p: '79 €/mes', msg: 'Hola, me interesa el sistema de reseñas 5 estrellas.' },
  { n: 'Campañas Meta · Google Ads', p: '199 €/mes', msg: 'Hola, me interesan las campañas de anuncios para mi negocio.' },
]

export default function PricingSection() {
  const openWhatsApp = (msg: string) => window.open(waBase + encodeURIComponent(msg), '_blank')

  return (
    <section id="precios" className="py-section overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 md:px-12">

        {/* Header */}
        <div className="text-center mb-14">
          <motion.span
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
            viewport={{ once: true }} className="eyebrow block mb-4"
          >
            Planes y precios
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ delay: 0.08 }}
            className="font-display text-headline font-semibold text-ink text-balance"
          >
            Tu web nueva, en tres niveles.<br />Y la ves gratis antes de pagar.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ delay: 0.16 }}
            className="mt-4 text-dim font-light max-w-md mx-auto"
          >
            Precio de lanzamiento para los primeros 20 negocios de Valencia.
            Sin permanencia. Sin costes ocultos.
          </motion.p>
        </div>

        {/* Escalera de 3 niveles de web */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">

          {/* NIVEL 1 — ARRANQUE */}
          <motion.div
            initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.7, delay: 0, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="lg flex flex-col h-full rounded-2xl p-7">
              <div className="inline-flex items-center px-3 py-1.5 rounded-full text-[11px] font-semibold tracking-[0.1em] uppercase mb-5 w-fit text-emerald-600 bg-emerald-50">
                Web · Nivel 1
              </div>
              <div className="text-[21px] font-semibold text-ink mb-0.5">Arranque</div>
              <p className="text-[13px] text-dim font-light mb-6">Tu web profesional funcionando en 7 días. La ves terminada antes de pagar nada.</p>

              <div className="mb-7">
                <div className="flex items-end gap-1">
                  <span className="text-5xl font-semibold text-ink tracking-[-0.04em] leading-none">€400</span>
                  <span className="text-sm text-muted pb-1.5">+ 49 €/mes</span>
                </div>
                <div className="text-[12px] text-muted mt-1.5">todo incluido · entrega en 7 días</div>
              </div>

              <button
                onClick={() => openWhatsApp('Hola, quiero ver la demo GRATIS de mi web (nivel Arranque). Mi negocio es: ')}
                className="w-full py-3.5 rounded-full text-[13.5px] font-semibold mb-7 bg-ink hover:bg-zinc-800 text-white transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.98]"
              >
                Quiero mi demo gratis
              </button>

              <ul className="space-y-3 flex-1">
                {[
                  'Demo GRATIS antes de pagar nada',
                  'Diseño con tu marca: colores, logo y tipografía',
                  'Perfecta en el móvil (donde te buscan)',
                  'Botón de WhatsApp, mapa y horarios',
                  'Hosting, cambios y soporte incluidos',
                  'SEO local básico para tu zona',
                  'Sin permanencia',
                ].map(f => (
                  <li key={f} className="flex items-start gap-2.5 text-[13px] text-dim">
                    <CheckIcon />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* NIVEL 2 — PREMIUM (destacado) */}
          <motion.div
            initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="md:-mt-4"
          >
            <div className="relative flex flex-col rounded-2xl overflow-hidden" style={{
              background: 'linear-gradient(145deg, #18181b 0%, #1a1a2e 60%, #16162a 100%)',
              boxShadow: '0 0 0 1px rgba(91,91,214,0.35), 0 32px 80px rgba(91,91,214,0.2)',
            }}>
              <div className="absolute inset-0 pointer-events-none"
                style={{ background: 'radial-gradient(ellipse 90% 55% at 50% 0%, rgba(91,91,214,0.22) 0%, transparent 70%)' }} />

              <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
                <div className="flex items-center gap-1.5 px-4 py-1.5 bg-accent text-white text-[10.5px] font-bold tracking-[0.14em] uppercase rounded-full whitespace-nowrap"
                  style={{ boxShadow: '0 0 20px rgba(91,91,214,0.5)' }}>
                  <StarIcon />
                  Recomendado
                </div>
              </div>

              <div className="relative z-10 flex flex-col h-full p-7 pt-8">
                <div className="inline-flex items-center px-3 py-1.5 rounded-full text-[11px] font-semibold tracking-[0.1em] uppercase mb-5 w-fit text-white/60 bg-white/10">
                  Web · Nivel 2
                </div>
                <div className="text-[21px] font-semibold text-white mb-0.5">Premium</div>
                <p className="text-[13px] text-white/45 font-light mb-6">Para destacar de verdad: animaciones y acabado de agencia cara.</p>

                <div className="mb-7">
                  <div className="flex items-end gap-1">
                    <span className="text-5xl font-semibold text-white tracking-[-0.04em] leading-none">€790</span>
                    <span className="text-sm text-white/35 pb-1.5">+ 49 €/mes</span>
                  </div>
                  <div className="text-[12px] text-white/35 mt-1.5">lo más elegido · sin permanencia</div>
                </div>

                <button
                  onClick={() => openWhatsApp('Hola, me interesa la Web Premium de AlloStudios (790 €). Mi negocio es: ')}
                  className="w-full py-3.5 rounded-full text-[13.5px] font-semibold mb-7 bg-accent hover:bg-accent-dark text-white transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.98]"
                  style={{ boxShadow: '0 4px 24px rgba(91,91,214,0.35)' }}
                >
                  Quiero la Premium
                </button>

                <div className="mb-5 p-3 rounded-xl bg-white/5 border border-white/8">
                  <div className="text-[11px] text-white/40 font-medium tracking-[0.08em] uppercase">Todo lo del Arranque, más:</div>
                </div>

                <ul className="space-y-3 flex-1">
                  {[
                    'Animaciones y micro-detalles premium',
                    'Textos profesionales que venden',
                    'Tus reseñas de Google integradas',
                    'Secciones extra a tu medida',
                    'Galería / catálogo de tu trabajo',
                    'Favicon + imagen para compartir',
                    'Prioridad de entrega',
                  ].map(f => (
                    <li key={f} className="flex items-start gap-2.5 text-[13px] text-white/65">
                      <CheckIcon dark />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>

          {/* NIVEL 3 — CINEMATOGRÁFICA */}
          <motion.div
            initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="lg flex flex-col h-full rounded-2xl p-7">
              <div className="inline-flex items-center px-3 py-1.5 rounded-full text-[11px] font-semibold tracking-[0.1em] uppercase mb-5 w-fit text-accent bg-accent-light">
                Web · Nivel 3
              </div>
              <div className="text-[21px] font-semibold text-ink mb-0.5">Cinematográfica</div>
              <p className="text-[13px] text-dim font-light mb-6">La web que nadie más tiene: tu producto cobra vida con el scroll, estilo Apple.</p>

              <div className="mb-7">
                <div className="flex items-end gap-1">
                  <span className="text-[15px] text-muted pb-6">desde</span>
                  <span className="text-5xl font-semibold text-ink tracking-[-0.04em] leading-none">€1.490</span>
                  <span className="text-sm text-muted pb-1.5">+ 79 €/mes</span>
                </div>
                <div className="text-[12px] text-muted mt-1.5">100% a medida · dirección de arte incluida</div>
              </div>

              <button
                onClick={() => openWhatsApp('Hola, me interesa la Web Cinematográfica de AlloStudios (el efecto del scroll estilo Apple). Mi negocio es: ')}
                className="w-full py-3.5 rounded-full text-[13.5px] font-semibold mb-3 bg-ink hover:bg-zinc-800 text-white transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.98]"
              >
                Quiero algo único
              </button>
              <a
                href="https://demos-six-gold.vercel.app/efecto-apple/"
                target="_blank" rel="noopener noreferrer"
                className="block text-center text-[12.5px] font-semibold text-accent hover:underline mb-7"
              >
                Ver un ejemplo en vivo → 
              </a>

              <ul className="space-y-3 flex-1">
                {[
                  'Efecto Apple: el scroll controla la película',
                  'Vídeo IA de tu producto (despiece por capas)',
                  'Scroll suave + intro de cine',
                  'Dirección de arte a tu medida',
                  'Hecha a mano, pieza a pieza',
                  'Nadie más la tiene en Valencia',
                ].map(f => (
                  <li key={f} className="flex items-start gap-2.5 text-[13px] text-dim">
                    <CheckIcon />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>

        {/* Servicios mensuales — la fila que acumula recurrente */}
        <motion.div
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10"
        >
          <div className="text-center text-[12px] font-semibold tracking-[0.12em] uppercase text-muted mb-4">
            Y los servicios que hacen crecer tu negocio cada mes
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {monthly.map(s => (
              <button
                key={s.n}
                onClick={() => openWhatsApp(s.msg)}
                className="lg group flex flex-col items-start text-left rounded-xl p-4 hover:-translate-y-0.5 transition-all duration-300 active:scale-[0.98]"
              >
                <span className="text-[13px] font-semibold text-ink leading-snug">{s.n}</span>
                <span className="text-[12px] text-accent font-semibold mt-1">{s.p}</span>
                <span className="text-[11px] text-muted mt-2 opacity-0 group-hover:opacity-100 transition-opacity">Pedir info → </span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* PACK COMPLETO — Full-width featured */}
        <motion.div
          initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="mt-5"
        >
          <div className="relative overflow-hidden rounded-2xl" style={{
            background: 'linear-gradient(120deg, #0f0f1a 0%, #141428 50%, #0d0d20 100%)',
            boxShadow: '0 0 0 1px rgba(91,91,214,0.25), 0 24px 80px rgba(91,91,214,0.12)',
          }}>
            <div className="absolute top-0 left-1/4 w-96 h-64 rounded-full blur-[80px] opacity-25 pointer-events-none"
              style={{ background: 'radial-gradient(circle, #5B5BD6 0%, transparent 70%)' }} />
            <div className="absolute bottom-0 right-1/4 w-64 h-48 rounded-full blur-[60px] opacity-15 pointer-events-none"
              style={{ background: 'radial-gradient(circle, #7C7CE8 0%, transparent 70%)' }} />
            <div className="absolute inset-0 pointer-events-none" style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
              backgroundSize: '48px 48px',
            }} />

            <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center gap-8 p-8 md:p-10">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className="inline-flex items-center px-3 py-1.5 rounded-full text-[11px] font-semibold tracking-[0.1em] uppercase text-white/60 bg-white/10">
                    Pack Completo
                  </span>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-accent/15 border border-accent/25 rounded-full">
                    <StarIcon />
                    <span className="text-[11px] font-bold text-accent tracking-[0.08em] uppercase">La mejor opción</span>
                  </div>
                </div>

                <h3 className="text-[clamp(1.25rem,2.5vw,1.6rem)] font-semibold text-white tracking-[-0.02em] mb-3">
                  Web + Instagram + Anuncios + Asistente IA
                </h3>
                <p className="text-[14px] text-white/45 font-light max-w-lg leading-relaxed mb-6">
                  La solución completa para negocios que quieren captar y cerrar más.
                  Web a medida, gestión completa de Instagram, campañas de Meta Ads y un asistente de IA que responde tus mensajes — todo con un único partner.
                </p>

                <div className="flex flex-wrap gap-2">
                  {[
                    'Web profesional incluida',
                    'Instagram gestionado',
                    'Anuncios Meta',
                    'Asistente IA en DMs y WhatsApp',
                    'Reseñas Google',
                    'Informes mensuales',
                    'Setup prioritario',
                    'Soporte prioritario',
                  ].map(tag => (
                    <span key={tag} className="text-[11px] font-medium text-white/55 bg-white/8 px-3 py-1.5 rounded-full border border-white/10">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-col items-start lg:items-end gap-4 shrink-0 lg:min-w-[220px]">
                <div className="text-left lg:text-right">
                  <div className="text-[12px] text-white/30 mb-1 tracking-[0.06em] uppercase">Precio personalizado</div>
                  <div className="text-[32px] font-semibold text-white tracking-[-0.03em] leading-none">A medida</div>
                  <div className="text-[12px] text-white/30 mt-1">respuesta en &lt; 24h</div>
                </div>
                <button
                  onClick={() => openWhatsApp('Hola, tengo un negocio y quiero información sobre el Pack Completo de AlloStudios (Web + Instagram + Anuncios + Asistente IA).')}
                  className="w-full lg:w-auto px-8 py-3.5 rounded-full bg-accent hover:bg-accent-dark text-white text-[13.5px] font-semibold transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.98] whitespace-nowrap"
                  style={{ boxShadow: '0 4px 20px rgba(91,91,214,0.4)' }}
                >
                  Solicitar propuesta
                </button>
                <p className="text-[11px] text-white/25 text-left lg:text-right">Sin compromiso</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
          viewport={{ once: true }} transition={{ delay: 0.4 }}
          className="text-center mt-10 text-[12px] text-muted"
        >
          Sin permanencia · La demo siempre es gratis · Precio de lanzamiento: primeros 20 negocios de Valencia
        </motion.p>
      </div>
    </section>
  )
}
