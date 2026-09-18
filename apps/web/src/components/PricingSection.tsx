'use client'

import { motion } from 'framer-motion'
import { PACKS, WEBS, SERVICIOS, eur } from '@/lib/precios'

/*  Escalera de packs (18/09/2026): 0 € de entrada, cuota mensual, 12 meses.
    Estándar (que te encuentren) → Pro (que te respondan) → Max (que te lleguen clientes).
    Debajo, las webs solas y los servicios sueltos. Los importes salen del catálogo (precios.ts).   */

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

/* Textos de venta de cada pack (lo que el cliente consigue, no la lista técnica) */
const VENTA: Record<string, { etiqueta: string; para: string; puntos: string[] }> = {
  PACK_ESTANDAR: {
    etiqueta: 'Que te encuentren',
    para: 'Para el negocio que hoy no aparece cuando lo buscan.',
    puntos: [
      'Web profesional con tu marca, lista en 7 días',
      'Perfecta en el móvil, con WhatsApp, mapa y horarios',
      'SEO local cada mes: sales en Google en tu zona',
      'Reseñas 5★ que se piden solas a tus clientes',
      'Hosting, cambios y soporte incluidos',
    ],
  },
  PACK_PRO: {
    etiqueta: 'Que te respondan',
    para: 'Para el que pierde clientes por no contestar a tiempo.',
    puntos: [
      'Web Premium: animaciones, textos que venden y tus reseñas integradas',
      'Asistente de IA en tu WhatsApp 24/7: horarios, precios, dudas y citas',
      'Te avisa cuando hay que hablar contigo',
      'SEO local cada mes + reseñas 5★ automatizadas',
      'Prioridad de entrega y soporte',
    ],
  },
  PACK_MAX: {
    etiqueta: 'Que te lleguen clientes',
    para: 'Para el que quiere llenar la agenda, no solo estar.',
    puntos: [
      'Todo lo del Pack Pro',
      'Campañas de Meta y Google Ads gestionadas cada mes',
      'Creatividades, públicos y optimización semanal',
      'Informe mensual: qué entró y qué costó',
      'La inversión publicitaria va aparte (la decides tú)',
    ],
  },
}

export default function PricingSection() {
  const openWhatsApp = (msg: string) => window.open(waBase + encodeURIComponent(msg), '_blank')
  const [presencia, crecimiento, todo] = PACKS

  return (
    <section id="precios" className="papel papel-orbe relative py-section overflow-hidden">
      <div className="relative max-w-6xl mx-auto px-6 md:px-12">

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
            Una cuota al mes. <span className="acento">0 € de entrada</span>.<br />Y la web la ves gratis antes de decidir.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ delay: 0.16 }}
            className="mt-4 text-dim font-light max-w-md mx-auto"
          >
            Cada pack arregla una cosa: que te encuentren, que te contesten, que te lleguen clientes.
            Precio cerrado, 12 meses y después mes a mes. Año por adelantado: dos meses gratis.
          </motion.p>
        </div>

        {/* Escalera de 3 packs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">

          {/* PRESENCIA */}
          <motion.div
            initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.7, delay: 0, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="lg flex flex-col h-full rounded-2xl p-7">
              <div className="inline-flex items-center px-3 py-1.5 rounded-full text-[11px] font-semibold tracking-[0.1em] uppercase mb-5 w-fit text-emerald-600 bg-emerald-50">
                {VENTA.PACK_ESTANDAR.etiqueta}
              </div>
              <div className="text-[21px] font-semibold text-ink mb-0.5">Estándar</div>
              <p className="text-[13px] text-dim font-light mb-6">{VENTA.PACK_ESTANDAR.para}</p>

              <div className="mb-7">
                <div className="flex items-end gap-1">
                  <span className="text-5xl font-semibold text-ink tracking-[-0.04em] leading-none">{eur(presencia.eur)}</span>
                  <span className="text-sm text-muted pb-1.5">/mes</span>
                </div>
                <div className="text-[12px] text-muted mt-1.5">0 € de entrada · por separado {eur(presencia.sumaSuelto || 0)}</div>
              </div>

              <a
                href="/contratar/pack_estandar"
                className="w-full py-3.5 rounded-full text-[13.5px] font-semibold mb-7 bg-ink hover:bg-zinc-800 text-white transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.98] flex items-center justify-center"
              >
                Contratar · ver desglose
              </a>

              <ul className="space-y-3 flex-1">
                {VENTA.PACK_ESTANDAR.puntos.map(f => (
                  <li key={f} className="flex items-start gap-2.5 text-[13px] text-dim">
                    <CheckIcon />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* CRECIMIENTO (destacado) */}
          <motion.div
            initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="md:-mt-4"
          >
            <div className="destacado relative flex flex-col rounded-2xl" style={{
              background: 'linear-gradient(145deg, #18181b 0%, #1a1a2e 60%, #16162a 100%)',
              boxShadow: '0 0 0 1px rgba(255,122,42,.45), 0 0 0 6px rgba(255,122,42,.06), 0 0 90px -20px rgba(255,122,42,.55), 0 32px 80px -30px rgba(0,0,0,.5)',
            }}>
              <div className="absolute inset-0 pointer-events-none rounded-2xl overflow-hidden"
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
                  {VENTA.PACK_PRO.etiqueta}
                </div>
                <div className="text-[21px] font-semibold text-white mb-0.5">Pro</div>
                <p className="text-[13px] text-white/45 font-light mb-6">{VENTA.PACK_PRO.para}</p>

                <div className="mb-7">
                  <div className="flex items-end gap-1">
                    <span className="text-5xl font-semibold text-white tracking-[-0.04em] leading-none">{eur(crecimiento.eur)}</span>
                    <span className="text-sm text-white/35 pb-1.5">/mes</span>
                  </div>
                  <div className="text-[12px] text-white/35 mt-1.5">0 € de entrada · lo más elegido</div>
                </div>

                <a
                  href="/contratar/pack_pro"
                  className="w-full py-3.5 rounded-full text-[13.5px] font-semibold mb-7 bg-accent hover:bg-accent-dark text-white transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.98] flex items-center justify-center"
                  style={{ boxShadow: '0 4px 24px rgba(91,91,214,0.35)' }}
                >
                  Contratar · ver desglose
                </a>

                <div className="mb-5 p-3 rounded-xl bg-white/5 border border-white/8">
                  <div className="text-[11px] text-white/40 font-medium tracking-[0.08em] uppercase">Todo lo del Estándar, más:</div>
                </div>

                <ul className="space-y-3 flex-1">
                  {VENTA.PACK_PRO.puntos.map(f => (
                    <li key={f} className="flex items-start gap-2.5 text-[13px] text-white/65">
                      <CheckIcon dark />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>

          {/* TODO */}
          <motion.div
            initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="lg flex flex-col h-full rounded-2xl p-7">
              <div className="inline-flex items-center px-3 py-1.5 rounded-full text-[11px] font-semibold tracking-[0.1em] uppercase mb-5 w-fit text-accent bg-accent-light">
                {VENTA.PACK_MAX.etiqueta}
              </div>
              <div className="text-[21px] font-semibold text-ink mb-0.5">Max</div>
              <p className="text-[13px] text-dim font-light mb-6">{VENTA.PACK_MAX.para}</p>

              <div className="mb-7">
                <div className="flex items-end gap-1">
                  <span className="text-5xl font-semibold text-ink tracking-[-0.04em] leading-none">{eur(todo.eur)}</span>
                  <span className="text-sm text-muted pb-1.5">/mes</span>
                </div>
                <div className="text-[12px] text-muted mt-1.5">0 € de entrada · por separado {eur(todo.sumaSuelto || 0)}</div>
              </div>

              <a
                href="/contratar/pack_max"
                className="w-full py-3.5 rounded-full text-[13.5px] font-semibold mb-7 bg-ink hover:bg-zinc-800 text-white transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.98] flex items-center justify-center"
              >
                Contratar · ver desglose
              </a>

              <ul className="space-y-3 flex-1">
                {VENTA.PACK_MAX.puntos.map(f => (
                  <li key={f} className="flex items-start gap-2.5 text-[13px] text-dim">
                    <CheckIcon />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>

        {/* Webs solas + servicios sueltos */}
        <motion.div
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10"
        >
          <p className="text-center text-[12.5px] text-muted mb-8 -mt-2">
            ¿Quieres verla antes?{' '}
            <a href="#tu-web" className="text-accent font-medium underline underline-offset-2">
              Genera tu web gratis en 30 segundos
            </a>{' '}
            o{' '}
            <button onClick={() => openWhatsApp('Hola, tengo dudas sobre los packs de AlloStudios. Mi negocio es: ')}
              className="text-accent font-medium underline underline-offset-2">
              escríbenos por WhatsApp
            </button>.
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <div className="text-[12px] font-semibold tracking-[0.12em] uppercase text-muted mb-4">
                Solo la web · 12 meses, todo incluido
              </div>
              <div className="grid grid-cols-3 gap-3">
                {WEBS.map(w => (
                  <a
                    key={w.clave}
                    href={`/contratar/${w.clave.toLowerCase()}`}
                    className="lg group flex flex-col items-start text-left rounded-xl p-4 hover:-translate-y-0.5 transition-all duration-300 active:scale-[0.98]"
                  >
                    <span className="text-[13px] font-semibold text-ink leading-snug">{w.nombre.replace('Web ', '')}</span>
                    <span className="text-[12px] text-accent font-semibold mt-1">{eur(w.eur)}/mes</span>
                    <span className="text-[11px] text-muted mt-2 opacity-0 group-hover:opacity-100 transition-opacity">Ver y contratar → </span>
                  </a>
                ))}
              </div>
              <p className="text-[11.5px] text-muted mt-3">
                En cualquier pack puedes cambiar la web por la Cinematográfica por +100 €/mes.
              </p>
            </div>

            <div>
              <div className="text-[12px] font-semibold tracking-[0.12em] uppercase text-muted mb-4">
                Servicios sueltos · sin permanencia · se añaden a cualquier pack
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {SERVICIOS.map(s => (
                  <a
                    key={s.clave}
                    href={`/contratar/${s.clave.toLowerCase()}`}
                    className="lg group flex flex-col items-start text-left rounded-xl p-4 hover:-translate-y-0.5 transition-all duration-300 active:scale-[0.98]"
                  >
                    <span className="text-[13px] font-semibold text-ink leading-snug">{s.nombre}</span>
                    <span className="text-[12px] text-accent font-semibold mt-1">{eur(s.eur)}/mes{s.clave === 'ADS' ? ' + inversión' : ''}</span>
                    <span className="text-[11px] text-muted mt-2 opacity-0 group-hover:opacity-100 transition-opacity">Ver y contratar → </span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
          viewport={{ once: true }} transition={{ delay: 0.4 }}
          className="text-center mt-10 text-[12px] text-muted"
        >
          0 € de entrada · 12 meses y después mes a mes · La demo siempre es gratis
        </motion.p>
      </div>
    </section>
  )
}
