'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'

const waLink = 'https://wa.me/34695868793?text=Hola%2C%20quiero%20solicitar%20la%20auditor%C3%ADa%20SEO%20gratuita%20para%20mi%20negocio.'

const auditRows = [
  { label: 'Velocidad de carga',     score: 34, color: '#ef4444', status: 'Crítico' },
  { label: 'SEO y posicionamiento',  score: 58, color: '#f59e0b', status: 'Mejorable' },
  { label: 'Experiencia en móvil',   score: 41, color: '#ef4444', status: 'Crítico' },
  { label: 'Ratio de conversión',    score: 22, color: '#ef4444', status: 'Crítico' },
  { label: 'Estructura técnica',     score: 63, color: '#f59e0b', status: 'Mejorable' },
]

function AuditBar({ score, color, animated }: { score: number; color: string; animated: boolean }) {
  return (
    <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
      <div
        className="h-full rounded-full transition-all"
        style={{
          width: animated ? `${score}%` : '0%',
          background: color,
          transitionDuration: '1.1s',
          transitionTimingFunction: 'cubic-bezier(0.16,1,0.3,1)',
        }}
      />
    </div>
  )
}

function AuditMockup() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const [animated, setAnimated] = useState(false)

  useEffect(() => {
    if (inView) {
      const t = setTimeout(() => setAnimated(true), 200)
      return () => clearTimeout(t)
    }
  }, [inView])

  return (
    <div ref={ref} className="relative">
      {/* Glow behind card */}
      <div className="absolute inset-0 -m-8 rounded-[40px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 80% 70% at 50% 50%, rgba(91,91,214,0.12) 0%, transparent 70%)' }} />

      <div className="relative rounded-2xl overflow-hidden border"
        style={{
          background: 'linear-gradient(145deg, #111118 0%, #16161f 100%)',
          borderColor: 'rgba(255,255,255,0.08)',
          boxShadow: '0 32px 80px rgba(0,0,0,0.35), 0 0 0 1px rgba(91,91,214,0.15)',
        }}>

        {/* Window chrome */}
        <div className="flex items-center gap-1.5 px-5 py-3.5 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
          <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
          <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
          <div className="flex-1 mx-3 rounded-md px-3 py-1.5 flex items-center gap-2" style={{ background: 'rgba(255,255,255,0.05)' }}>
            <svg width="8" height="8" viewBox="0 0 12 12" fill="none"><circle cx="6" cy="6" r="5" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5"/><path d="M4 6l1.5 1.5L8 4" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <span className="text-[10px] font-mono text-white/25">tunegocio.com</span>
          </div>
          <span className="text-[9px] font-semibold tracking-[0.1em] uppercase px-2 py-1 rounded-full"
            style={{ background: 'rgba(239,68,68,0.15)', color: '#fca5a5' }}>
            Analizando
          </span>
        </div>

        {/* Scores */}
        <div className="px-6 py-5 space-y-4">
          {auditRows.map((row, i) => (
            <motion.div
              key={row.label}
              initial={{ opacity: 0, x: 12 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.1 + i * 0.08, duration: 0.5, ease: [0.16,1,0.3,1] }}
              className="flex items-center gap-3"
            >
              <div className="w-[142px] shrink-0">
                <div className="text-[11.5px] font-medium text-white/70">{row.label}</div>
              </div>
              <AuditBar score={row.score} color={row.color} animated={animated} />
              <div className="shrink-0 text-right" style={{ minWidth: 64 }}>
                <span className="text-[11px] font-semibold" style={{ color: row.color }}>{row.score}/100</span>
                <div className="text-[9px] text-white/30 mt-0.5">{row.status}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer */}
        <div className="mx-6 mb-6 rounded-xl px-4 py-3.5 flex items-center justify-between"
          style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.18)' }}>
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
              style={{ background: 'rgba(239,68,68,0.15)' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            </div>
            <div>
              <div className="text-[11.5px] font-semibold text-white/80">14 problemas detectados</div>
              <div className="text-[10px] text-white/35">Tu auditoría incluiría soluciones exactas</div>
            </div>
          </div>
          <div className="text-[10px] font-semibold text-white/25 shrink-0">Muestra</div>
        </div>
      </div>

      {/* Float badge — value */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-5 -right-4 bg-white rounded-2xl border border-border shadow-xl px-3.5 py-2.5"
      >
        <div className="text-[11px] font-semibold text-ink">Valorada en</div>
        <div className="text-[18px] font-semibold text-ink tracking-[-0.03em] leading-none">500€</div>
        <div className="text-[10px] text-green-600 font-semibold mt-0.5">Gratis para ti</div>
      </motion.div>
    </div>
  )
}

const features = [
  {
    title: 'Velocidad y rendimiento',
    desc: 'Las páginas lentas pierden el 70% de los visitantes. Detectamos exactamente qué los frena.',
  },
  {
    title: 'Posicionamiento en Google',
    desc: 'Por qué tu competencia aparece antes que tú y qué palabras clave te deberían traer clientes.',
  },
  {
    title: 'Experiencia móvil',
    desc: 'El 78% de búsquedas locales son desde el móvil. Analizamos cada punto de fricción.',
  },
  {
    title: 'Ratio de conversión',
    desc: 'Por qué los visitantes no llaman, no piden información y no dejan sus datos.',
  },
  {
    title: 'Errores técnicos',
    desc: 'Problemas de indexación, metadatos rotos y todo lo que Google penaliza en silencio.',
  },
  {
    title: 'Oportunidades de crecimiento',
    desc: 'Huecos en tu mercado local que tu competencia todavía no ha ocupado.',
  },
]

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } }
const fadeSlide = {
  hidden: { opacity: 0, y: 18, filter: 'blur(5px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] as [number,number,number,number] } },
}

export default function SEOAuditSection() {
  return (
    <section id="auditoria" className="relative overflow-hidden bg-canvas py-[clamp(5rem,10vw,9rem)]">

      {/* Ambient */}
      <div className="absolute w-[700px] h-[500px] rounded-full blur-[140px] -top-1/4 -right-1/4 opacity-[0.07] pointer-events-none"
        style={{ background: 'radial-gradient(circle, #5B5BD6 0%, transparent 65%)' }} />
      <div className="absolute w-[400px] h-[400px] rounded-full blur-[100px] bottom-0 left-0 opacity-[0.05] pointer-events-none"
        style={{ background: 'radial-gradient(circle, #7C7CE8 0%, transparent 65%)' }} />

      {/* Dot grid */}
      <div className="absolute inset-0 dot-grid opacity-[0.18] pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* —★ LEFT — Copy —★ */}
          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }}>

            <motion.div variants={fadeSlide} className="flex items-center gap-2.5 mb-7">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border text-[11px] font-semibold tracking-[0.1em] uppercase"
                style={{ background: 'rgba(34,197,94,0.06)', borderColor: 'rgba(34,197,94,0.2)', color: '#16a34a' }}>
                <svg width="8" height="8" viewBox="0 0 8 8"><circle cx="4" cy="4" r="4" fill="#22c55e"/></svg>
                Gratuita · Sin compromiso
              </span>
              <span className="text-[11px] text-muted font-medium">Valorada en 500€</span>
            </motion.div>

            <motion.h2 variants={fadeSlide}
              className="text-headline font-semibold text-ink leading-[1.08] tracking-[-0.03em] text-balance mb-6"
            >
              Sabemos exactamente por qué tu web no te trae más leads.
            </motion.h2>

            <motion.p variants={fadeSlide} className="text-[1.05rem] text-dim font-light leading-[1.75] max-w-lg text-pretty mb-8">
              Analizamos tu web en profundidad y te entregamos un informe con los problemas reales
              que están frenando tu captación de leads — y cómo resolverlos.
            </motion.p>

            {/* Feature list */}
            <motion.ul variants={stagger} className="space-y-3.5 mb-10">
              {features.map(f => (
                <motion.li key={f.title} variants={fadeSlide} className="flex items-start gap-3.5">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                    style={{ background: 'rgba(91,91,214,0.10)' }}>
                    <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
                      <path d="M2 5l2.2 2.2L8 2.5" stroke="#5B5BD6" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div>
                    <span className="text-[13.5px] font-semibold text-ink">{f.title}</span>
                    <span className="text-[13px] text-dim font-light"> — {f.desc}</span>
                  </div>
                </motion.li>
              ))}
            </motion.ul>

            {/* CTA */}
            <motion.div variants={fadeSlide} className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-full text-white text-[14px] font-semibold transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.98]"
                style={{
                  background: 'linear-gradient(135deg, #18181B 0%, #2d2d32 100%)',
                  boxShadow: '0 8px 28px rgba(0,0,0,0.18), 0 1px 0 rgba(255,255,255,0.06) inset',
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#22c55e">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.555 4.122 1.524 5.855L.057 23.943l6.088-1.467C7.878 23.44 9.9 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.988c-1.954 0-3.775-.526-5.332-1.44l-.381-.227-3.949.954.975-3.853-.249-.395C2.031 15.449 1.5 13.787 1.5 12 1.5 6.201 6.201 1.5 12 1.5c5.8 0 10.5 4.701 10.5 10.5 0 5.8-4.7 10.488-10.5 10.488z"/>
                </svg>
                Consultar ahora
                <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                  <path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
              <span className="text-[12px] text-muted">Respuesta en menos de 24h</span>
            </motion.div>
          </motion.div>

          {/* —★ RIGHT — Audit Mockup —★ */}
          <motion.div
            initial={{ opacity: 0, x: 32, filter: 'blur(8px)' }}
            whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <AuditMockup />
          </motion.div>

        </div>
      </div>
    </section>
  )
}
