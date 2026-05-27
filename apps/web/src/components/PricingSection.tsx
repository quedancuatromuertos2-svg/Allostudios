'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

const packs = [
  {
    id: 'web',
    category: 'Páginas Web',
    categoryColor: 'text-emerald-600 bg-emerald-50',
    name: 'Pack Web',
    tagline: 'Tu presencia digital premium.',
    priceMonthly: 799,
    priceAnnual: 799,
    priceNote: 'pago único',
    priceType: 'once',
    highlight: false,
    cta: 'Solicitar propuesta',
    ctaAction: 'whatsapp',
    features: [
      'Diseño web premium a medida',
      'Velocidad 99+ en PageSpeed',
      'SEO técnico desde el inicio',
      'Diseño 100% responsive',
      'Formulario de reservas integrado',
      'Integración con WhatsApp',
      'Entrega en 7–10 días',
      '12 meses de mantenimiento',
    ],
    callout: 'Precio orientativo. Contacta para presupuesto personalizado.',
  },
  {
    id: 'ia',
    category: 'IA y Automatización',
    categoryColor: 'text-blue-600 bg-blue-50',
    name: 'Pack IA',
    tagline: 'Tu recepcionista trabaja 24/7.',
    priceMonthly: 99,
    priceAnnual: 79,
    priceNote: '/mes',
    priceType: 'sub',
    highlight: false,
    cta: 'Empezar 7 días gratis',
    ctaAction: 'demo',
    features: [
      'Asistente IA de voz · 1 número',
      '300 llamadas / mes',
      'Reservas automáticas 24/7',
      'Integración WhatsApp',
      'Sincronización Google Calendar',
      'Transcripciones de llamadas',
      'SMS de confirmación',
      'Soporte por email',
    ],
    callout: null,
  },
  {
    id: 'completo',
    category: 'Todo incluido',
    categoryColor: 'text-white/60 bg-white/10',
    badge: 'La opción más premium',
    name: 'Pack Completo',
    tagline: 'Web + IA + Automatizaciones.',
    priceMonthly: 199,
    priceAnnual: 159,
    priceNote: '/mes',
    priceType: 'sub',
    highlight: true,
    cta: 'Empezar 7 días gratis',
    ctaAction: 'demo',
    features: [
      'Web premium incluida (valor 799€)',
      'Bot IA de voz · 3 números',
      '1.000 llamadas / mes',
      'WhatsApp + Google Calendar',
      'Automatizaciones completas',
      'Dashboard analíticas en tiempo real',
      'Informes semanales con IA',
      'Soporte prioritario 24/7',
    ],
    callout: null,
  },
]

function CheckIcon({ dark }: { dark?: boolean }) {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" className="shrink-0 mt-px">
      <circle cx="8" cy="8" r="7" fill={dark ? 'rgba(255,255,255,0.1)' : 'rgba(91,91,214,0.1)'}/>
      <path d="M5 8l2.2 2.2L11 5.5" stroke={dark ? 'rgba(255,255,255,0.7)' : '#5B5BD6'} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

export default function PricingSection() {
  const [annual, setAnnual] = useState(false)

  const handleCta = (p: typeof packs[0]) => {
    if (p.ctaAction === 'whatsapp') {
      window.open('https://wa.me/34611430660?text=Hola%2C%20me%20interesa%20una%20p%C3%A1gina%20web%20premium', '_blank')
    } else {
      document.querySelector('#precios')?.scrollIntoView({ behavior: 'smooth' })
    }
  }

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
            Elige cómo modernizar<br />tu negocio.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ delay: 0.16 }}
            className="mt-4 text-dim font-light max-w-md mx-auto"
          >
            Web premium, IA de voz, o todo junto.
            7 días de prueba gratis en los planes de suscripción.
          </motion.p>

          {/* Toggle */}
          <motion.div
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
            viewport={{ once: true }} transition={{ delay: 0.24 }}
            className="inline-flex items-center gap-1 mt-8 p-1 bg-surface rounded-full border border-border"
          >
            <button
              onClick={() => setAnnual(false)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${!annual ? 'bg-white shadow-sm text-ink' : 'text-muted hover:text-dim'}`}
            >
              Mensual
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 ${annual ? 'bg-white shadow-sm text-ink' : 'text-muted hover:text-dim'}`}
            >
              Anual
              <span className="text-[10px] font-bold text-accent bg-accent-light px-2 py-0.5 rounded-full">−20%</span>
            </button>
          </motion.div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
          {packs.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className={p.highlight ? 'md:-mt-4' : ''}
            >
              {p.highlight ? (
                /* ── PACK COMPLETO — dark premium ── */
                <div className="relative flex flex-col rounded-2xl overflow-hidden" style={{
                  background: 'linear-gradient(135deg, #18181b 0%, #1a1a2e 100%)',
                  boxShadow: '0 0 0 1px rgba(91,91,214,0.3), 0 24px 80px rgba(91,91,214,0.15)',
                }}>
                  {/* Ambient glow */}
                  <div className="absolute inset-0 pointer-events-none"
                    style={{ background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(91,91,214,0.18) 0%, transparent 70%)' }} />

                  <div className="relative z-10 flex flex-col h-full p-7">
                    {/* Badge */}
                    {p.badge && (
                      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-accent text-white text-[10px] font-bold tracking-[0.14em] uppercase rounded-full shadow-glow whitespace-nowrap">
                        {p.badge}
                      </div>
                    )}

                    <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-[11px] font-semibold tracking-[0.1em] uppercase mb-5 w-fit ${p.categoryColor}`}>
                      {p.category}
                    </div>
                    <div className="text-[21px] font-semibold text-white mb-0.5">{p.name}</div>
                    <p className="text-[13px] text-white/45 font-light mb-6">{p.tagline}</p>

                    {/* Price */}
                    <div className="mb-7">
                      <div className="flex items-end gap-1">
                        <span className="text-5xl font-semibold text-white tracking-[-0.04em] leading-none">
                          €{annual ? p.priceAnnual : p.priceMonthly}
                        </span>
                        <span className="text-sm text-white/35 pb-1.5">{p.priceNote}</span>
                      </div>
                      {annual && (
                        <div className="text-[12px] text-white/35 mt-1.5">
                          Facturado anualmente · Ahorras €{(p.priceMonthly - p.priceAnnual) * 12}/año
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => handleCta(p)}
                      className="w-full py-3.5 rounded-full text-[13.5px] font-semibold mb-7 bg-accent hover:bg-accent-dark text-white shadow-glow transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.98]"
                    >
                      {p.cta}
                    </button>

                    <ul className="space-y-3 flex-1">
                      {p.features.map(f => (
                        <li key={f} className="flex items-start gap-2.5 text-[13px] text-white/60">
                          <CheckIcon dark />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                /* ── Regular plans ── */
                <div className="flex flex-col h-full bg-white rounded-2xl border border-border shadow-sm p-7">
                  <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-[11px] font-semibold tracking-[0.1em] uppercase mb-5 w-fit ${p.categoryColor}`}>
                    {p.category}
                  </div>
                  <div className="text-[21px] font-semibold text-ink mb-0.5">{p.name}</div>
                  <p className="text-[13px] text-dim font-light mb-6">{p.tagline}</p>

                  {/* Price */}
                  <div className="mb-7">
                    {p.priceType === 'once' ? (
                      <>
                        <div className="flex items-end gap-1.5">
                          <span className="text-[11px] text-muted font-medium pb-2">desde</span>
                          <span className="text-5xl font-semibold text-ink tracking-[-0.04em] leading-none">€{p.priceMonthly}</span>
                        </div>
                        <div className="text-[12px] text-muted mt-1.5">{p.priceNote}</div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-end gap-1">
                          <span className="text-5xl font-semibold text-ink tracking-[-0.04em] leading-none">
                            €{annual ? p.priceAnnual : p.priceMonthly}
                          </span>
                          <span className="text-sm text-muted pb-1.5">{p.priceNote}</span>
                        </div>
                        {annual && (
                          <div className="text-[12px] text-muted mt-1.5">
                            Facturado anualmente · Ahorras €{(p.priceMonthly - p.priceAnnual) * 12}/año
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  <button
                    onClick={() => handleCta(p)}
                    className="w-full py-3.5 rounded-full text-[13.5px] font-semibold mb-7 bg-ink hover:bg-zinc-800 text-white transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.98]"
                  >
                    {p.cta}
                  </button>

                  <ul className="space-y-3 flex-1">
                    {p.features.map(f => (
                      <li key={f} className="flex items-start gap-2.5 text-[13px] text-dim">
                        <CheckIcon />
                        {f}
                      </li>
                    ))}
                  </ul>

                  {p.callout && (
                    <p className="mt-5 text-[11px] text-muted/70 leading-relaxed border-t border-border pt-4">{p.callout}</p>
                  )}
                </div>
              )}
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
          viewport={{ once: true }} transition={{ delay: 0.4 }}
          className="text-center mt-10 text-[12px] text-muted"
        >
          Los planes de suscripción incluyen 7 días de prueba gratuita · Se requiere tarjeta · Cancela cuando quieras
        </motion.p>
      </div>
    </section>
  )
}
