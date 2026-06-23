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

const waBase = 'https://wa.me/34613112671?text='

export default function PricingSection() {
  const openWhatsApp = (msg: string) => window.open(waBase + encodeURIComponent(msg), '_blank')

  return (
    <section id="precios" className="py-section bg-canvas overflow-hidden">
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
            className="text-headline font-semibold text-ink text-balance"
          >
            Invierte en tu inmobiliaria.<br />No pierdas un lead más.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ delay: 0.16 }}
            className="mt-4 text-dim font-light max-w-md mx-auto"
          >
            Sin permanencia. Sin costes ocultos.
            Empieza este mes y ve resultados desde el primero.
          </motion.p>
        </div>

        {/* 3-column grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">

          {/* STARTER */}
          <motion.div
            initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.7, delay: 0, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex flex-col h-full bg-white rounded-2xl border border-border shadow-sm p-7">
              <div className="inline-flex items-center px-3 py-1.5 rounded-full text-[11px] font-semibold tracking-[0.1em] uppercase mb-5 w-fit text-blue-600 bg-blue-50">
                Instagram
              </div>
              <div className="text-[21px] font-semibold text-ink mb-0.5">Esencial</div>
              <p className="text-[13px] text-dim font-light mb-6">Para empezar a tener una presencia profesional en redes.</p>

              <div className="mb-7">
                <div className="flex items-end gap-1">
                  <span className="text-5xl font-semibold text-ink tracking-[-0.04em] leading-none">€199</span>
                  <span className="text-sm text-muted pb-1.5">/mes</span>
                </div>
                <div className="text-[12px] text-muted mt-1.5">Sin permanencia · cancela cuando quieras</div>
              </div>

              <button
                onClick={() => openWhatsApp('Hola, me interesa la gestión de Instagram de AlloStudios para mi inmobiliaria. ¿Me contáis?')}
                className="w-full py-3.5 rounded-full text-[13.5px] font-semibold mb-7 bg-ink hover:bg-zinc-800 text-white transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.98]"
              >
                Empezar ahora
              </button>

              <ul className="space-y-3 flex-1">
                {[
                  '12 publicaciones al mes',
                  'Carruseles + posts de propiedades',
                  'Captions optimizados para captar',
                  'Calendario de contenido mensual',
                  'Diseño con la marca de tu agencia',
                  'Publicación programada por nosotros',
                  'Informe mensual de resultados',
                  'Soporte por email',
                ].map(f => (
                  <li key={f} className="flex items-start gap-2.5 text-[13px] text-dim">
                    <CheckIcon />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* PROFESSIONAL — Featured */}
          <motion.div
            initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="md:-mt-4"
          >
            <div className="relative flex flex-col rounded-2xl overflow-hidden" style={{
              background: 'linear-gradient(145deg, #18181b 0%, #1a1a2e 60%, #16162a 100%)',
              boxShadow: '0 0 0 1px rgba(91,91,214,0.35), 0 32px 80px rgba(91,91,214,0.2)',
            }}>
              {/* Ambient glow */}
              <div className="absolute inset-0 pointer-events-none"
                style={{ background: 'radial-gradient(ellipse 90% 55% at 50% 0%, rgba(91,91,214,0.22) 0%, transparent 70%)' }} />

              {/* Badge */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
                <div className="flex items-center gap-1.5 px-4 py-1.5 bg-accent text-white text-[10.5px] font-bold tracking-[0.14em] uppercase rounded-full whitespace-nowrap"
                  style={{ boxShadow: '0 0 20px rgba(91,91,214,0.5)' }}>
                  <StarIcon />
                  Recomendado
                </div>
              </div>

              <div className="relative z-10 flex flex-col h-full p-7 pt-8">
                <div className="inline-flex items-center px-3 py-1.5 rounded-full text-[11px] font-semibold tracking-[0.1em] uppercase mb-5 w-fit text-white/60 bg-white/10">
                  Instagram
                </div>
                <div className="text-[21px] font-semibold text-white mb-0.5">Pro</div>
                <p className="text-[13px] text-white/45 font-light mb-6">Para agencias que quieren crecer en serio en redes.</p>

                <div className="mb-7">
                  <div className="flex items-end gap-1">
                    <span className="text-5xl font-semibold text-white tracking-[-0.04em] leading-none">€349</span>
                    <span className="text-sm text-white/35 pb-1.5">/mes</span>
                  </div>
                  <div className="text-[12px] text-white/35 mt-1.5">Lo más contratado · sin permanencia</div>
                </div>

                <button
                  onClick={() => openWhatsApp('Hola, me interesa la gestión de Instagram de AlloStudios para mi inmobiliaria. ¿Me contáis?')}
                  className="w-full py-3.5 rounded-full text-[13.5px] font-semibold mb-7 bg-accent hover:bg-accent-dark text-white transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.98]"
                  style={{ boxShadow: '0 4px 24px rgba(91,91,214,0.35)' }}
                >
                  Empezar ahora
                </button>

                {/* Value comparison */}
                <div className="mb-5 p-3 rounded-xl bg-white/5 border border-white/8">
                  <div className="text-[11px] text-white/40 font-medium tracking-[0.08em] uppercase mb-2">Incluye todo del Esencial, más:</div>
                </div>

                <ul className="space-y-3 flex-1">
                  {[
                    '16 publicaciones + 4 reels al mes',
                    'Stories semanales',
                    'Anuncios Meta básicos incluidos',
                    'Gestión de comentarios y DMs',
                    'Calendario editorial completo',
                    'Informe mensual detallado',
                    'Diseño premium con tu marca',
                    'Soporte prioritario',
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

          {/* PACK WEB */}
          <motion.div
            initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex flex-col h-full bg-white rounded-2xl border border-border shadow-sm p-7">
              <div className="inline-flex items-center px-3 py-1.5 rounded-full text-[11px] font-semibold tracking-[0.1em] uppercase mb-5 w-fit text-emerald-600 bg-emerald-50">
                Pack Web
              </div>
              <div className="text-[21px] font-semibold text-ink mb-0.5">Web Inmobiliaria</div>
              <p className="text-[13px] text-dim font-light mb-6">Tu escaparate online que convierte visitas en leads.</p>

              <div className="mb-7">
                <div className="flex items-end gap-1">
                  <span className="text-sm text-muted pb-1.5">desde</span>
                  <span className="text-5xl font-semibold text-ink tracking-[-0.04em] leading-none">€790</span>
                </div>
                <div className="text-[12px] text-muted mt-1.5">pago único · entrega en 7 días</div>
              </div>

              <button
                onClick={() => openWhatsApp('Hola, tengo una inmobiliaria y me interesa una web premium de AlloStudios. ¿Podéis hacerme un presupuesto?')}
                className="w-full py-3.5 rounded-full text-[13.5px] font-semibold mb-7 bg-ink hover:bg-zinc-800 text-white transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.98]"
              >
                Solicitar propuesta
              </button>

              <ul className="space-y-3 flex-1">
                {[
                  'Diseño inmobiliario premium a medida',
                  'Buscador de inmuebles integrado',
                  'Velocidad 99+ en PageSpeed',
                  'SEO local para tu zona',
                  'Diseño 100% responsive',
                  'Formulario de contacto + WhatsApp',
                  'Entrega en 7 días',
                  '12 meses de mantenimiento',
                ].map(f => (
                  <li key={f} className="flex items-start gap-2.5 text-[13px] text-dim">
                    <CheckIcon />
                    {f}
                  </li>
                ))}
              </ul>

              <p className="mt-5 text-[11px] text-muted/70 leading-relaxed border-t border-border pt-4">
                Cada proyecto es único. Hablamos, entendemos tu negocio y te damos un precio exacto.
              </p>
            </div>
          </motion.div>
        </div>

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
            {/* Glows */}
            <div className="absolute top-0 left-1/4 w-96 h-64 rounded-full blur-[80px] opacity-25 pointer-events-none"
              style={{ background: 'radial-gradient(circle, #5B5BD6 0%, transparent 70%)' }} />
            <div className="absolute bottom-0 right-1/4 w-64 h-48 rounded-full blur-[60px] opacity-15 pointer-events-none"
              style={{ background: 'radial-gradient(circle, #7C7CE8 0%, transparent 70%)' }} />
            {/* Grid lines */}
            <div className="absolute inset-0 pointer-events-none" style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
              backgroundSize: '48px 48px',
            }} />

            <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center gap-8 p-8 md:p-10">
              {/* Left */}
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
                  Web + Instagram Full + Anuncios + Asistente IA
                </h3>
                <p className="text-[14px] text-white/45 font-light max-w-lg leading-relaxed mb-6">
                  La solución completa para agencias que quieren captar y cerrar más.
                  Web a medida, gestión completa de Instagram, campañas de Meta Ads y un asistente de IA que responde tus DMs — todo con un único partner.
                </p>

                <div className="flex flex-wrap gap-2">
                  {[
                    'Web inmobiliaria incluida',
                    'Instagram Full',
                    'Anuncios Meta',
                    'Asistente IA en DMs',
                    'Informes mensuales',
                    'Reseñas Google',
                    'Setup prioritario',
                    'Soporte prioritario',
                  ].map(tag => (
                    <span key={tag} className="text-[11px] font-medium text-white/55 bg-white/8 px-3 py-1.5 rounded-full border border-white/10">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Right */}
              <div className="flex flex-col items-start lg:items-end gap-4 shrink-0 lg:min-w-[220px]">
                <div className="text-left lg:text-right">
                  <div className="text-[12px] text-white/30 mb-1 tracking-[0.06em] uppercase">Precio personalizado</div>
                  <div className="text-[32px] font-semibold text-white tracking-[-0.03em] leading-none">A medida</div>
                  <div className="text-[12px] text-white/30 mt-1">respuesta en &lt; 24h</div>
                </div>
                <button
                  onClick={() => openWhatsApp('Hola, tengo una inmobiliaria y quiero información sobre el Pack Completo de AlloStudios (Web + Instagram + Anuncios + Asistente IA). Me interesa conocer el precio.')}
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

        {/* Footer note */}
        <motion.p
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
          viewport={{ once: true }} transition={{ delay: 0.4 }}
          className="text-center mt-10 text-[12px] text-muted"
        >
          Sin permanencia · Cancela cuando quieras · Resultados desde el primer mes
        </motion.p>
      </div>
    </section>
  )
}
