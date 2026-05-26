'use client'

import { motion } from 'framer-motion'

const features = [
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
      </svg>
    ),
    label: 'Velocidad 99+ en PageSpeed',
    sub: 'Carga instantánea en cualquier dispositivo',
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
      </svg>
    ),
    label: 'SEO optimizado desde el día 1',
    sub: 'Aparece en Google sin esperar meses',
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/>
      </svg>
    ),
    label: 'Diseño 100% responsive',
    sub: 'Perfecta en móvil, tablet y escritorio',
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
    label: 'Integración con IA y reservas',
    sub: 'Tu web conectada con tu asistente IA',
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
    label: 'Entrega en 7–10 días',
    sub: 'Rápido, profesional, sin esperas',
  },
]

function BrowserMockup() {
  return (
    <div className="rounded-2xl overflow-hidden shadow-2xl border border-border/60">
      <div className="flex items-center gap-1.5 px-4 py-3 bg-[#f0f0f2] border-b border-border">
        <div className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
        <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/80" />
        <div className="w-2.5 h-2.5 rounded-full bg-green-400/80" />
        <div className="flex-1 mx-3 bg-white rounded-md px-3 py-1 text-[10px] text-muted font-mono flex items-center gap-1.5 min-w-0">
          <svg width="7" height="7" viewBox="0 0 8 8" fill="none">
            <circle cx="4" cy="4" r="3" stroke="#A09D99" strokeWidth="1.2"/>
          </svg>
          <span className="truncate">tunegocio.com</span>
        </div>
      </div>

      <div className="bg-white">
        <div className="flex items-center px-5 h-10 border-b border-border/40 gap-4">
          <div className="w-14 h-3 rounded-full bg-ink/80" />
          <div className="flex gap-3 ml-auto items-center">
            <div className="w-8 h-2 rounded-full bg-border" />
            <div className="w-8 h-2 rounded-full bg-border" />
            <div className="w-8 h-2 rounded-full bg-border" />
            <div className="w-16 h-6 rounded-full bg-accent ml-1" />
          </div>
        </div>

        <div className="relative px-7 pt-7 pb-5 overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-accent-light rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/3" />
          <div className="w-20 h-2 rounded-full bg-accent/25 mb-3" />
          <div className="w-60 h-5 rounded-full bg-ink/10 mb-1.5" />
          <div className="w-44 h-5 rounded-full bg-ink/10 mb-3" />
          <div className="w-52 h-2.5 rounded-full bg-border mb-1.5" />
          <div className="w-40 h-2.5 rounded-full bg-border mb-5" />
          <div className="flex gap-2.5">
            <div className="w-22 h-8 rounded-full bg-accent px-4 flex items-center justify-center">
              <div className="w-16 h-2 rounded-full bg-white/60" />
            </div>
            <div className="w-22 h-8 rounded-full border border-border bg-surface px-4 flex items-center justify-center">
              <div className="w-14 h-2 rounded-full bg-border" />
            </div>
          </div>
        </div>

        <div className="flex gap-2 px-7 pb-5">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="flex-1 bg-surface rounded-xl p-2.5">
              <div className="w-8 h-3.5 rounded-full bg-ink/10 mb-1.5" />
              <div className="w-full h-2 rounded-full bg-border" />
            </div>
          ))}
        </div>

        <div className="flex gap-2 px-7 pb-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex-1 bg-surface rounded-xl p-3 border border-border/50">
              <div className="w-6 h-6 rounded-lg bg-accent-light mb-2" />
              <div className="w-full h-2 rounded-full bg-border mb-1" />
              <div className="w-3/4 h-2 rounded-full bg-border/60" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function WebsSection() {
  return (
    <section id="webs" className="py-section bg-white">
      <div className="max-w-6xl mx-auto px-6 md:px-12">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="eyebrow block mb-4">Páginas Web Premium</span>
            <h2 className="text-headline font-semibold text-ink leading-[1.1] tracking-[-0.02em] mb-5">
              Tu web, rápida,<br />bonita y que convierte.
            </h2>
            <p className="text-[16px] text-dim font-light leading-relaxed mb-9 max-w-lg">
              Diseñamos páginas web profesionales con la última tecnología. Rápidas, elegantes y optimizadas para aparecer en Google desde el primer día. Diseñada para vender.
            </p>

            <ul className="space-y-4 mb-10">
              {features.map((f, i) => (
                <motion.li
                  key={f.label}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.05 + i * 0.07 }}
                  className="flex items-center gap-4"
                >
                  <div className="w-10 h-10 rounded-xl bg-accent-light flex items-center justify-center text-accent shadow-sm shrink-0">
                    {f.icon}
                  </div>
                  <div>
                    <div className="text-[14px] font-semibold text-ink">{f.label}</div>
                    <div className="text-[12px] text-muted mt-0.5">{f.sub}</div>
                  </div>
                </motion.li>
              ))}
            </ul>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => document.querySelector('#precios')?.scrollIntoView({ behavior: 'smooth' })}
                className="btn-accent px-7 py-3.5"
              >
                Ver planes web
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <a
                href="https://wa.me/34611430660?text=Hola%2C%20me%20gustar%C3%ADa%20informaci%C3%B3n%20sobre%20p%C3%A1ginas%20web"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full border border-border text-[14px] text-dim hover:text-ink hover:border-ink/30 hover:bg-surface transition-all duration-300 font-medium"
              >
                Pedir presupuesto
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24, y: 10 }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <div className="absolute inset-4 bg-accent-light blur-3xl opacity-25 rounded-3xl" />

            <div className="relative">
              <BrowserMockup />

              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3.1, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -top-5 -right-6 bg-white rounded-2xl border border-border shadow-lg px-4 py-3"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-green-50 flex items-center justify-center shrink-0">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                    </svg>
                  </div>
                  <div>
                    <div className="text-[13px] font-semibold text-ink">99+</div>
                    <div className="text-[10px] text-muted">PageSpeed</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                className="absolute -bottom-5 -left-6 bg-white rounded-2xl border border-border shadow-lg px-4 py-3"
              >
                <div className="text-xl font-semibold text-ink tracking-[-0.02em]">7 días</div>
                <div className="text-[10px] text-muted mt-0.5">tiempo de entrega</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
