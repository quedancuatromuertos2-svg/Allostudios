'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const services = [
  {
    id: 'llamadas',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.21h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.96a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
      </svg>
    ),
    tag: 'Principal',
    tagColor: 'bg-accent-light text-accent',
    name: 'IA para Llamadas',
    headline: 'Tu recepcionista nunca descansa.',
    desc: 'Un asistente de voz con IA responde cada llamada en menos de 2 segundos. Gestiona preguntas frecuentes, capta datos, agenda citas y filtra contactos — todo sin intervención humana.',
    points: ['Respuesta en menos de 2 segundos', 'Reservas automáticas en tu calendario', 'Transcripciones de cada llamada', 'Múltiples idiomas y voces', 'Compatible con cualquier número'],
    sectors: ['Restaurantes', 'Clínicas', 'Salones', 'Inmobiliarias', 'Gimnasios', 'Veterinarias'],
  },
  {
    id: 'webs',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
      </svg>
    ),
    tag: 'Presencia',
    tagColor: 'bg-emerald-50 text-emerald-600',
    name: 'Páginas Web Premium',
    headline: 'Tu web, rápida, bonita y que convierte.',
    desc: 'Diseñamos y desarrollamos páginas web profesionales con la última tecnología. Rápidas, elegantes y optimizadas para aparecer en Google desde el primer día.',
    points: ['Diseño premium a medida', 'Velocidad perfecta (99+ en PageSpeed)', 'SEO optimizado desde el inicio', 'Integración con IA y reservas', 'Entrega en 7-10 días'],
    sectors: ['Todos los negocios'],
  },
  {
    id: 'facturas',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
      </svg>
    ),
    tag: 'Finanzas',
    tagColor: 'bg-amber-50 text-amber-600',
    name: 'Facturas Inteligentes',
    headline: 'Sube tus facturas. La IA hace el resto.',
    desc: 'Fotografía o sube tus facturas y la IA las clasifica, organiza y genera resúmenes automáticos. Sabe exactamente cuánto gastas, en qué y cuándo.',
    points: ['Clasificación automática por categoría', 'Resúmenes mensuales inteligentes', 'Gráficas de gastos en tiempo real', 'Exportación a Excel o PDF', 'Alertas de facturas vencidas'],
    sectors: ['Todos los negocios'],
  },
  {
    id: 'analiticas',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>
      </svg>
    ),
    tag: 'Analíticas',
    tagColor: 'bg-purple-50 text-purple-600',
    name: 'Reportes y Analíticas',
    headline: 'Entiende tu negocio sin esfuerzo.',
    desc: 'Recibe cada semana un informe automático con todo lo que necesitas saber: llamadas, reservas, ingresos y tendencias. Tu negocio explicado en un vistazo.',
    points: ['Informe semanal automático por email', 'Dashboard en tiempo real', 'Métricas de llamadas y reservas', 'Comparativa semana a semana', 'Insights accionables con IA'],
    sectors: ['Todos los negocios'],
  },
  {
    id: 'automatizaciones',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
      </svg>
    ),
    tag: 'Automatización',
    tagColor: 'bg-blue-50 text-blue-600',
    name: 'Automatizaciones',
    headline: 'Conecta todo. Automatiza todo.',
    desc: 'Conecta tu IA con WhatsApp, Google Calendar, tu CRM y más. Configura flujos automáticos que gestionan clientes, envían recordatorios y hacen seguimiento sin que toques nada.',
    points: ['Integración con Google Calendar', 'Mensajes automáticos por WhatsApp', 'CRM automático de clientes', 'Recordatorios de citas sin esfuerzo', 'Seguimiento post-visita automático'],
    sectors: ['Todos los negocios'],
  },
]

export default function ServicesSection() {
  const [active, setActive] = useState(0)
  const s = services[active]

  return (
    <section id="servicios" className="py-section bg-canvas">
      <div className="max-w-6xl mx-auto px-6 md:px-12">

        <div className="text-center mb-14">
          <motion.span
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="eyebrow block mb-4"
          >Todo lo que necesitas</motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ delay: 0.08 }}
            className="text-headline font-semibold text-ink"
          >
            Un sistema.<br />Tu negocio entero.
          </motion.h2>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {services.map((svc, i) => (
            <button
              key={svc.id}
              onClick={() => setActive(i)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-[13px] font-medium transition-all duration-300 ${
                active === i
                  ? 'bg-ink text-white shadow-md'
                  : 'bg-white border border-border text-dim hover:text-ink hover:border-ink/30'
              }`}
            >
              <span className={`w-4 h-4 ${active === i ? 'text-white' : 'text-muted'}`}>
                {svc.icon}
              </span>
              {svc.name}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center"
          >
            <div>
              <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-semibold tracking-[0.12em] uppercase mb-5 ${s.tagColor}`}>
                <span className="w-3.5 h-3.5">{s.icon}</span>
                {s.tag}
              </div>
              <h3 className="text-[2rem] font-semibold text-ink leading-[1.15] tracking-[-0.02em] mb-4">{s.headline}</h3>
              <p className="text-[16px] text-dim font-light leading-relaxed mb-8">{s.desc}</p>

              <ul className="space-y-3 mb-8">
                {s.points.map(p => (
                  <li key={p} className="flex items-center gap-3 text-[14px] text-dim">
                    <div className="w-5 h-5 rounded-full bg-accent-light flex items-center justify-center shrink-0">
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path d="M2 5l2.5 2.5L8 2.5" stroke="#5B5BD6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    {p}
                  </li>
                ))}
              </ul>

              {s.sectors.length > 1 && (
                <div>
                  <div className="text-[11px] font-semibold text-muted tracking-[0.16em] uppercase mb-3">Sectores compatibles</div>
                  <div className="flex flex-wrap gap-2">
                    {s.sectors.map(sec => (
                      <span key={sec} className="px-3 py-1.5 rounded-full bg-surface border border-border text-[12px] font-medium text-dim">{sec}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="relative">
              <div className="bg-white rounded-3xl border border-border shadow-lg p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-accent-light rounded-full blur-3xl opacity-40 -translate-y-1/2 translate-x-1/2" />

                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${s.tagColor}`}>
                  <span className="scale-125">{s.icon}</span>
                </div>

                <div className="text-[22px] font-semibold text-ink tracking-[-0.015em] mb-2">{s.name}</div>
                <p className="text-[14px] text-dim font-light mb-8">{s.headline}</p>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    { n: active === 0 ? '98%' : active === 1 ? '99+' : active === 2 ? '3×' : active === 3 ? 'Semanal' : '5×', l: active === 0 ? 'llamadas respondidas' : active === 1 ? 'PageSpeed score' : active === 2 ? 'más rápido' : active === 3 ? 'informe auto' : 'tiempo ahorrado' },
                    { n: active === 0 ? '<2s' : active === 1 ? '7 días' : active === 2 ? '100%' : active === 3 ? 'Tiempo real' : '24/7', l: active === 0 ? 'tiempo de respuesta' : active === 1 ? 'entrega' : active === 2 ? 'automático' : active === 3 ? 'dashboard' : 'activo' },
                  ].map(stat => (
                    <div key={stat.l} className="bg-surface rounded-xl px-4 py-3">
                      <div className="text-xl font-semibold text-ink">{stat.n}</div>
                      <div className="text-[11px] text-muted mt-0.5">{stat.l}</div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => document.querySelector('#precios')?.scrollIntoView({ behavior: 'smooth' })}
                  className="w-full mt-6 py-3 rounded-xl bg-ink text-white text-[13px] font-semibold hover:bg-zinc-700 transition-colors duration-300"
                >
                  Empezar con {s.name}
                </button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}
