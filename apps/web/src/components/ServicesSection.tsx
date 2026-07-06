'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

// ─── Voice Waveform — CSS-animated bars (performant, no JS per-frame) ───
const waveProfile = [14, 26, 42, 60, 78, 92, 82, 64, 48, 70, 88, 96, 80, 58, 40, 62, 84, 94, 76, 54, 36, 56, 76, 88, 70, 48, 30, 50, 68, 82, 60, 38, 22, 44, 62, 75, 55, 34, 18, 32]

function VoiceWave({ size = 'lg' }: { size?: 'sm' | 'lg' }) {
  const h = size === 'lg' ? 'h-20' : 'h-5'
  const w = size === 'lg' ? 3.5 : 2
  const gap = size === 'lg' ? 3.5 : 2.5
  const count = size === 'lg' ? waveProfile.length : 12

  return (
    <div className={`flex items-center justify-center ${h}`} style={{ gap }}>
      {waveProfile.slice(0, count).map((pct, i) => (
        <div
          key={i}
          className="rounded-full animate-wave"
          style={{
            width: w,
            height: `${pct}%`,
            background: size === 'lg'
              ? 'linear-gradient(to top, #5B5BD6 0%, rgba(91,91,214,0.18) 100%)'
              : 'rgba(91,91,214,0.55)',
            animationDuration: `${0.85 + (i % 7) * 0.18}s`,
            animationDelay: `${(i * 0.042) % 1.1}s`,
            transformOrigin: 'bottom',
          }}
        />
      ))}
    </div>
  )
}

// ─── Live AI Call Card ───
function LiveCallCard() {
  return (
    <div className="relative">
      <div className="bg-white rounded-3xl border border-border/80 shadow-xl overflow-hidden" style={{ maxWidth: 320, boxShadow: '0 20px 60px rgba(91,91,214,0.12), 0 4px 16px rgba(0,0,0,0.06)' }}>

        {/* Header bar */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-border/40 bg-white">
          <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center shrink-0">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.21h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.96a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
          </div>
          <div className="flex-1">
            <div className="text-[13px] font-semibold text-ink">Instagram · Mensaje directo</div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <motion.div
                className="w-1.5 h-1.5 rounded-full bg-green-500"
                animate={{ opacity: [1, 0.2, 1] }}
                transition={{ duration: 1.8, repeat: Infinity }}
              />
              <span className="text-[11px] text-green-600 font-medium">IA respondiendo…</span>
            </div>
          </div>
          <span className="text-[10px] font-bold text-accent bg-accent-light px-2.5 py-1 rounded-full">IA</span>
        </div>

        {/* Waveform */}
        <div className="px-5 py-7" style={{ background: 'linear-gradient(180deg, rgba(238,239,255,0.5) 0%, transparent 100%)' }}>
          <VoiceWave size="lg" />
          <p className="text-[10.5px] text-center text-muted/60 mt-3 font-medium tracking-[0.04em]">
            AlloStudios IA · Escribiendo respuesta
          </p>
        </div>

        {/* Chat messages */}
        <div className="px-5 space-y-2.5 pb-1">
          <div className="bg-surface rounded-2xl rounded-tl-sm px-3.5 py-2.5 max-w-[85%]">
            <div className="text-[10px] font-semibold text-muted mb-0.5 tracking-[0.06em] uppercase">Interesado</div>
            <div className="text-[12px] text-ink leading-relaxed">Hola, ¿tenéis hueco esta semana?</div>
          </div>
          <div className="bg-accent-light rounded-2xl rounded-tr-sm px-3.5 py-2.5 max-w-[85%] ml-auto">
            <div className="text-[10px] font-semibold text-accent mb-0.5 tracking-[0.06em] uppercase">IA</div>
            <div className="text-[12px] text-ink leading-relaxed">¡Sí! ¿Le agendo cita mañana a las 18:00?</div>
          </div>
        </div>

        {/* Confirmation */}
        <div className="mx-5 mt-3 mb-5 bg-surface rounded-xl px-3.5 py-3 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center shrink-0">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round">
              <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
          </div>
          <div className="flex-1">
            <div className="text-[12px] font-semibold text-ink">Visita agendada</div>
            <div className="text-[10.5px] text-muted">Mañana 18:00 · Lead enviado ✓</div>
          </div>
          <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center shrink-0">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M2 5l2.2 2.2L8 2.5" stroke="#16a34a" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Float badges */}
      <motion.div
        animate={{ y: [0, -7, 0] }}
        transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-5 -right-6 bg-white rounded-2xl border border-border shadow-md px-3.5 py-2.5"
      >
        <div className="text-[13px] font-bold text-ink">98%</div>
        <div className="text-[10px] text-muted">mensajes atendidos</div>
      </motion.div>

      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 4.1, repeat: Infinity, ease: 'easeInOut', delay: 0.9 }}
        className="absolute -bottom-5 -left-6 rounded-2xl px-3.5 py-2.5"
        style={{ background: '#5B5BD6', boxShadow: '0 4px 20px rgba(91,91,214,0.4)' }}
      >
        <div className="text-[13px] font-bold text-white">&lt;2s</div>
        <div className="text-[10px] text-white/65">respuesta IA</div>
      </motion.div>
    </div>
  )
}

// ─── Automation Flow ───
const flowNodes = [
  { d: '<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>', label: 'Mensaje\nentrante',  bg: '#EFF6FF', border: '#BFDBFE', color: '#1D4ED8' },
  { d: '<path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/>', label: 'IA cualifica\nel lead', bg: '#EEEFFF', border: 'rgba(91,91,214,0.3)', color: '#5B5BD6' },
  { d: '<rect width="18" height="18" x="3" y="4" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/><path d="m9 16 2 2 4-4"/>', label: 'Visita\nagendada',   bg: '#ECFDF5', border: '#A7F3D0', color: '#065F46' },
  { d: '<path d="M10.268 21a2 2 0 0 0 3.464 0"/><path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"/>', label: 'Aviso a\ntu equipo',   bg: '#F0FDF4', border: '#BBF7D0', color: '#166534' },
  { d: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>', label: 'Cliente\ncaptado',       bg: '#FFFBEB', border: '#FDE68A', color: '#92400E' },
]

function AutoFlow() {
  return (
    <>
      {/* Desktop horizontal */}
      <div className="hidden lg:flex items-center gap-0">
        {flowNodes.map((node, i) => (
          <div key={node.label} className="flex items-center">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center gap-2 p-3.5 rounded-2xl border"
              style={{ background: node.bg, borderColor: node.border, minWidth: 80 }}
            >
              <span className="leading-none" style={{ color: node.color }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" dangerouslySetInnerHTML={{ __html: node.d }} />
              </span>
              <span className="text-[10px] font-semibold text-center leading-tight whitespace-pre-line" style={{ color: node.color }}>
                {node.label}
              </span>
            </motion.div>

            {i < flowNodes.length - 1 && (
              <div className="relative mx-1.5 flex items-center" style={{ width: 28 }}>
                <div className="w-full h-px bg-border" />
                {/* Moving dot */}
                <div className="absolute inset-0 overflow-hidden flex items-center">
                  <motion.div
                    className="absolute w-2 h-2 rounded-full bg-accent"
                    animate={{ x: ['-50%', '200%'] }}
                    transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.32, ease: 'linear' }}
                  />
                </div>
                {/* Arrow tip */}
                <div className="absolute right-0 flex items-center justify-center">
                  <svg width="7" height="7" viewBox="0 0 7 7" fill="none">
                    <path d="M1 3.5h5M4 1.5l2 2-2 2" stroke="#A09D99" strokeWidth="1.1" strokeLinecap="round"/>
                  </svg>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Mobile vertical */}
      <div className="lg:hidden flex flex-col items-start gap-0">
        {flowNodes.map((node, i) => (
          <div key={node.label} className="flex flex-col items-center w-full">
            <motion.div
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.09 }}
              className="flex items-center gap-3 px-4 py-3 rounded-2xl border w-full max-w-xs"
              style={{ background: node.bg, borderColor: node.border }}
            >
              <span className="leading-none shrink-0" style={{ color: node.color }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" dangerouslySetInnerHTML={{ __html: node.d }} />
              </span>
              <span className="text-[12.5px] font-semibold leading-tight" style={{ color: node.color }}>
                {node.label.replace('\n', ' ')}
              </span>
            </motion.div>
            {i < flowNodes.length - 1 && (
              <div className="relative h-7 w-px bg-border mx-auto overflow-hidden">
                <motion.div
                  className="absolute left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-accent"
                  animate={{ y: ['-100%', '400%'] }}
                  transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.28, ease: 'linear' }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  )
}

// ─── Dashboard Card ───
function DashboardCard() {
  const bars = [38, 55, 44, 70, 62, 85, 76]
  const metrics = [
    { label: 'Alcance en redes', value: '34.2k', delta: '+18%' },
    { label: 'Leads captados', value: '184', delta: '+24%' },
    { label: 'Visitas agendadas', value: '96', delta: '+12%' },
  ]

  return (
    <div className="bg-white rounded-2xl border border-border shadow-md overflow-hidden">
      {/* Window chrome */}
      <div className="flex items-center gap-1.5 px-4 py-3 border-b border-border bg-surface/60">
        <div className="w-2.5 h-2.5 rounded-full bg-red-400/70" />
        <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/70" />
        <div className="w-2.5 h-2.5 rounded-full bg-green-400/70" />
        <span className="ml-3 text-[11px] text-muted font-mono">AlloStudios · Analytics</span>
      </div>

      <div className="p-5 space-y-4">
        {metrics.map(m => (
          <div key={m.label} className="flex items-center justify-between">
            <div>
              <div className="text-[11px] text-muted mb-0.5">{m.label}</div>
              <div className="text-[19px] font-semibold text-ink tracking-[-0.025em] leading-none">{m.value}</div>
            </div>
            <div className="flex items-center gap-1 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full">
              <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                <path d="M4.5 1.5L7.5 6H1.5L4.5 1.5Z" fill="#16a34a"/>
              </svg>
              <span className="text-[11px] font-bold text-emerald-700">{m.delta}</span>
            </div>
          </div>
        ))}

        {/* Micro bar chart */}
        <div className="pt-3 border-t border-border">
          <div className="text-[10.5px] text-muted mb-2.5 font-medium">Interacciones — últimos 7 días</div>
          <div className="flex items-end gap-1.5 h-10">
            {bars.map((h, i) => (
              <motion.div
                key={i}
                className="flex-1 rounded-sm bg-accent/25"
                initial={{ scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                viewport={{ once: true }}
                style={{ height: `${h}%`, transformOrigin: 'bottom' }}
                transition={{ delay: 0.3 + i * 0.07, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── blur-fade stagger helpers ───
const fadeSlide = (dir: 'left' | 'right', delay = 0) => ({
  initial: { opacity: 0, x: dir === 'left' ? -28 : 28, filter: 'blur(6px)' },
  whileInView: { opacity: 1, x: 0, filter: 'blur(0px)' },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.85, delay, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
})

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
}
const lineItem = {
  hidden: { opacity: 0, x: -16 },
  show: { opacity: 1, x: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
}

export default function ServicesSection() {
  const iaRef = useRef<HTMLDivElement>(null)
  const autoRef = useRef<HTMLDivElement>(null)
  const iaInView = useInView(iaRef, { once: true, margin: '-80px' })
  const autoInView = useInView(autoRef, { once: true, margin: '-80px' })

  return (
    <section id="servicios" className="overflow-hidden">

      {/* ════════════════════════════════════════════
          BLOCK 1 — IA DE VOZ
      ════════════════════════════════════════════ */}
      <div className="relative py-[clamp(5rem,10vw,9rem)] bg-canvas">
        {/* Ambient glow top-right */}
        <div className="absolute top-[-10%] right-[-10%] w-[520px] h-[520px] rounded-full blur-[100px] opacity-[0.18] pointer-events-none"
          style={{ background: 'radial-gradient(circle, #5B5BD6 0%, transparent 65%)' }} />
        {/* Dot grid overlay */}
        <div className="absolute inset-0 dot-grid opacity-[0.12] pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

            {/* Copy — left */}
            <div ref={iaRef}>
              <motion.div {...fadeSlide('left')} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-light border border-accent/15 text-[11px] font-bold tracking-[0.13em] uppercase text-accent mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse-slow" />
                Asistente IA · DMs 24/7
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
                animate={iaInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
                transition={{ duration: 0.85, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="text-headline font-semibold text-ink leading-[1.1] tracking-[-0.03em] text-balance mb-5"
              >
                Cada mensaje,<br />respondido al instante.
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 18 }}
                animate={iaInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
                className="text-[16px] text-dim font-light leading-relaxed mb-8 max-w-lg"
              >
                Un asistente de IA responde tus DMs de Instagram y WhatsApp en segundos,
                cualifica al interesado, agenda la cita
                y te avisa — mientras tú atiendes, vendes o descansas.
              </motion.p>

              <motion.ul
                variants={stagger} initial="hidden"
                animate={iaInView ? 'show' : 'hidden'}
                className="space-y-3.5 mb-10"
              >
                {[
                  'Responde en segundos, 24/7',
                  'Visitas agendadas en tu Google Calendar',
                  'Cualificación del lead: compra/alquiler, presupuesto y zona',
                  'Resumen de cada conversación enviado al instante',
                  'Responde con el tono y la marca de tu negocio',
                  'En Instagram, WhatsApp y tu web — sin cambiar nada',
                ].map(f => (
                  <motion.li key={f} variants={lineItem} className="flex items-center gap-3 text-[14px] text-dim">
                    <div className="w-5 h-5 rounded-full bg-accent-light flex items-center justify-center shrink-0">
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path d="M2 5l2.5 2.5L8 2.5" stroke="#5B5BD6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    {f}
                  </motion.li>
                ))}
              </motion.ul>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={iaInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.55 }}
              >
                <button
                  onClick={() => document.querySelector('#precios')?.scrollIntoView({ behavior: 'smooth' })}
                  className="btn-accent text-[14px] px-7 py-3.5 rounded-full"
                >
                  Ver planes
                  <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                    <path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </button>
              </motion.div>
            </div>

            {/* Visual — right */}
            <motion.div
              initial={{ opacity: 0, x: 36, filter: 'blur(10px)' }}
              animate={iaInView ? { opacity: 1, x: 0, filter: 'blur(0px)' } : {}}
              transition={{ duration: 1, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="hidden lg:flex items-center justify-center py-10 px-6"
            >
              <LiveCallCard />
            </motion.div>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════
          BLOCK 2 — AUTOMATIZACIÓN
      ════════════════════════════════════════════ */}
      <div className="relative py-[clamp(5rem,10vw,9rem)] overflow-hidden" style={{ background: 'linear-gradient(180deg, #F4F3F1 0%, #FAFAF9 100%)' }}>
        {/* Ambient glow bottom-left */}
        <div className="absolute bottom-[-5%] left-[-8%] w-[420px] h-[420px] rounded-full blur-[80px] opacity-[0.15] pointer-events-none"
          style={{ background: 'radial-gradient(circle, #5B5BD6 0%, transparent 70%)' }} />

        <div className="relative max-w-6xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

            {/* Visual — LEFT on desktop (order-1) */}
            <motion.div
              ref={autoRef}
              initial={{ opacity: 0, x: -32, filter: 'blur(8px)' }}
              animate={autoInView ? { opacity: 1, x: 0, filter: 'blur(0px)' } : {}}
              transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="order-2 lg:order-1 space-y-6"
            >
              <div>
                <p className="text-[11px] font-semibold text-muted tracking-[0.15em] uppercase mb-4">Flujo en tiempo real</p>
                <AutoFlow />
              </div>
              <DashboardCard />
            </motion.div>

            {/* Copy — RIGHT on desktop (order-2) */}
            <div className="order-1 lg:order-2">
              <motion.div {...fadeSlide('right')}>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-50 border border-orange-200/60 text-[11px] font-bold tracking-[0.13em] uppercase text-orange-700 mb-6">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                  </svg>
                  Automatización total
                </div>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
                animate={autoInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
                transition={{ duration: 0.85, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="text-headline font-semibold text-ink leading-[1.1] tracking-[-0.03em] text-balance mb-5"
              >
                Todo conectado.<br />Nada manual.
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 18 }}
                animate={autoInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
                className="text-[16px] text-dim font-light leading-relaxed mb-8 max-w-lg"
              >
                Conecta tu IA con WhatsApp, Google Calendar y tu CRM.
                Los flujos automáticos reparten los leads a tu equipo, envían información
                y hacen seguimiento — sin que toques nada.
              </motion.p>

              <motion.div
                variants={stagger} initial="hidden"
                animate={autoInView ? 'show' : 'hidden'}
                className="grid grid-cols-2 gap-2.5 mb-10"
              >
                {[
                  { d: '<rect width="18" height="18" x="3" y="4" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>', name: 'Google Calendar' },
                  { d: '<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>', name: 'WhatsApp' },
                  { d: '<path d="M3 3v16a2 2 0 0 0 2 2h16"/><path d="M7 16h8"/><path d="M7 11h12"/><path d="M7 6h3"/>', name: 'Dashboard de leads' },
                  { d: '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>', name: 'Email y SMS' },
                  { d: '<path d="M9 17H7A5 5 0 0 1 7 7h2"/><path d="M15 7h2a5 5 0 1 1 0 10h-2"/><line x1="8" x2="16" y1="12" y2="12"/>', name: 'Tu CRM' },
                  { d: '<path d="M3 3v16a2 2 0 0 0 2 2h16"/><path d="m19 9-5 5-4-4-3 3"/>', name: 'Informes semanales' },
                ].map(item => (
                  <motion.div key={item.name} variants={lineItem}
                    className="flex items-center gap-2.5 bg-white rounded-xl border border-border px-3.5 py-3 hover:shadow-sm transition-shadow duration-200"
                  >
                    <span className="text-accent">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" dangerouslySetInnerHTML={{ __html: item.d }} />
                    </span>
                    <span className="text-[12.5px] font-medium text-ink">{item.name}</span>
                  </motion.div>
                ))}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={autoInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.55 }}
              >
                <button
                  onClick={() => document.querySelector('#precios')?.scrollIntoView({ behavior: 'smooth' })}
                  className="btn-accent text-[14px] px-7 py-3.5 rounded-full"
                >
                  Ver automatizaciones
                  <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                    <path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </button>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

    </section>
  )
}
