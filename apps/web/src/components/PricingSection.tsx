'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

const packs = [
  {
    id: 'bot',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.21h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.96a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
      </svg>
    ),
    tag: 'IA para Llamadas',
    name: 'Bot IA',
    priceMonthly: 99,
    priceAnnual: 79,
    priceNote: '/mes',
    priceType: 'sub',
    desc: 'Ideal para negocios que quieren automatizar su atención telefónica desde hoy.',
    highlight: false,
    cta: 'Empezar 7 días gratis',
    features: [
      'Asistente IA · 1 número',
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
    id: 'web',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
      </svg>
    ),
    tag: 'Páginas Web',
    name: 'Web Premium',
    priceMonthly: 799,
    priceAnnual: 799,
    priceNote: 'pago único',
    priceType: 'once',
    desc: 'Una web profesional, rápida y diseñada para convertir visitas en clientes desde el día 1.',
    highlight: false,
    cta: 'Solicitar propuesta',
    features: [
      'Diseño premium a medida',
      'Velocidad 99+ PageSpeed',
      'SEO optimizado desde el inicio',
      'Integración con WhatsApp',
      'Formulario de reservas integrado',
      'Diseño 100% responsive',
      'Entrega en 7–10 días',
      '12 meses de mantenimiento',
    ],
    callout: 'Precio orientativo. Contacta para presupuesto personalizado.',
  },
  {
    id: 'premium',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
      </svg>
    ),
    tag: 'Todo incluido',
    badge: 'Más popular',
    name: 'Pack Premium',
    priceMonthly: 199,
    priceAnnual: 159,
    priceNote: '/mes',
    priceType: 'sub',
    desc: 'Web premium + IA para llamadas + automatizaciones. La solución completa para tu negocio.',
    highlight: true,
    cta: 'Empezar 7 días gratis',
    features: [
      'Web premium incluida',
      'Bot IA · 3 números',
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

export default function PricingSection() {
  const [annual, setAnnual] = useState(false)

  return (
    <section id="precios" className="py-section bg-canvas">
      <div className="max-w-6xl mx-auto px-6 md:px-12">

        <div className="text-center mb-12">
          <motion.span
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
            viewport={{ once: true }} className="eyebrow block mb-4"
          >Planes y precios</motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ delay: 0.08 }}
            className="text-headline font-semibold text-ink"
          >
            Elige tu plan.<br />Empieza a crecer hoy.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ delay: 0.16 }}
            className="mt-4 text-dim font-light max-w-sm mx-auto"
          >
            7 días de prueba incluidos. Cancela en cualquier momento.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
            viewport={{ once: true }} transition={{ delay: 0.24 }}
            className="inline-flex items-center gap-1 mt-8 p-1 bg-surface rounded-full border border-border"
          >
            <button
              onClick={() => setAnnual(false)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${!annual ? 'bg-white shadow-sm text-ink' : 'text-muted hover:text-ink'}`}
            >Mensual</button>
            <button
              onClick={() => setAnnual(true)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 ${annual ? 'bg-white shadow-sm text-ink' : 'text-muted hover:text-ink'}`}
            >
              Anual
              <span className="text-[10px] font-semibold text-accent bg-accent-light px-2 py-0.5 rounded-full">−20%</span>
            </button>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
          {packs.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className={`relative rounded-2xl p-7 flex flex-col ${
                p.highlight
                  ? 'bg-white border-2 border-accent shadow-[0_0_0_4px_rgba(91,91,214,0.08)]'
                  : 'bg-white border border-border shadow-sm'
              }`}
            >
              {p.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-accent text-white text-[11px] font-semibold tracking-[0.1em] uppercase rounded-full shadow-md">
                  {p.badge}
                </div>
              )}

              <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-semibold tracking-[0.1em] uppercase mb-5 w-fit ${
                p.highlight ? 'bg-accent-light text-accent' : 'bg-surface text-muted'
              }`}>
                <span className="w-3.5 h-3.5">{p.icon}</span>
                {p.tag}
              </div>

              <div className="text-[20px] font-semibold text-ink mb-1">{p.name}</div>
              <p className="text-[13px] text-dim font-light leading-relaxed mb-6">{p.desc}</p>

              <div className="mb-6">
                {p.priceType === 'once' ? (
                  <>
                    <div className="flex items-end gap-1.5">
                      <span className="text-[11px] text-muted font-medium pb-2">desde</span>
                      <span className="text-4xl font-semibold text-ink tracking-[-0.03em]">€{p.priceMonthly}</span>
                    </div>
                    <div className="text-[12px] text-muted mt-1">{p.priceNote}</div>
                  </>
                ) : (
                  <>
                    <div className="flex items-end gap-1">
                      <span className="text-4xl font-semibold text-ink tracking-[-0.03em]">
                        €{annual ? p.priceAnnual : p.priceMonthly}
                      </span>
                      <span className="text-sm text-muted pb-1.5">{p.priceNote}</span>
                    </div>
                    {annual && p.priceType === 'sub' && (
                      <div className="text-[12px] text-muted mt-1">
                        Facturado anualmente · Ahorras €{(p.priceMonthly - p.priceAnnual) * 12}/año
                      </div>
                    )}
                  </>
                )}
              </div>

              <button
                onClick={() => p.id === 'web'
                  ? window.open('https://wa.me/34611430660?text=Hola%2C%20me%20interesa%20una%20p%C3%A1gina%20web%20premium', '_blank')
                  : document.querySelector('#demo')?.scrollIntoView({ behavior: 'smooth' })
                }
                className={`w-full py-3.5 rounded-full text-[13px] font-semibold mb-7 transition-all duration-300 ${
                  p.highlight
                    ? 'bg-accent hover:bg-accent-dark text-white shadow-glow'
                    : 'bg-ink hover:bg-zinc-700 text-white'
                }`}
              >
                {p.cta}
              </button>

              <ul className="space-y-3 flex-1">
                {p.features.map(f => (
                  <li key={f} className="flex items-start gap-2.5 text-[13px] text-dim">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0 mt-px text-accent">
                      <circle cx="8" cy="8" r="7" fill="currentColor" fillOpacity="0.12"/>
                      <path d="M5 8l2.2 2.2L11 5.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>

              {p.callout && (
                <p className="mt-5 text-[11px] text-muted/80 leading-relaxed border-t border-border pt-4">{p.callout}</p>
              )}
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
          viewport={{ once: true }} transition={{ delay: 0.4 }}
          className="text-center mt-8 text-[12px] text-muted"
        >
          Todos los planes de suscripción incluyen 7 días de prueba gratuita · Se requiere tarjeta · Cancela cuando quieras
        </motion.p>
      </div>
    </section>
  )
}
