'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const scenarios = [
  {
    sector: 'Restaurante',
    icon: '🍽️',
    voice: 'Carmen',
    color: 'bg-orange-50 text-orange-600',
    ring: 'ring-orange-200',
    conversation: [
      { who: 'cliente', text: 'Hola, quería reservar una mesa para cuatro personas el sábado por la noche.' },
      { who: 'ia', text: 'Hola, gracias por llamar. Por supuesto, tenemos disponibilidad el sábado. ¿A qué hora le vendría mejor, a las 21:00 o a las 21:30?' },
      { who: 'cliente', text: 'A las 21:00 perfecto.' },
      { who: 'ia', text: 'Perfecto. Mesa para cuatro personas el sábado a las 21:00. ¿Me puede dar su nombre y un número de contacto para confirmar la reserva?' },
    ],
  },
  {
    sector: 'Clínica dental',
    icon: '🦷',
    voice: 'Lucía',
    color: 'bg-blue-50 text-blue-600',
    ring: 'ring-blue-200',
    conversation: [
      { who: 'cliente', text: 'Buenos días, necesito pedir cita para una limpieza dental lo antes posible.' },
      { who: 'ia', text: 'Buenos días. Tenemos disponibilidad esta semana. El miércoles a las 10:30 o el jueves a las 16:00. ¿Cuál le va mejor?' },
      { who: 'cliente', text: 'El jueves a las cuatro, perfecto.' },
      { who: 'ia', text: 'Anotado. Cita para limpieza dental el jueves a las 16:00. Le enviaré un recordatorio por SMS el día antes. ¿Algo más en lo que pueda ayudarle?' },
    ],
  },
  {
    sector: 'Salón de belleza',
    icon: '💇',
    voice: 'Sofía',
    color: 'bg-pink-50 text-pink-600',
    ring: 'ring-pink-200',
    conversation: [
      { who: 'cliente', text: 'Hola, quería saber si tenéis hueco esta tarde para un corte y tinte.' },
      { who: 'ia', text: 'Hola, buenas tardes. Esta tarde tenemos un hueco a las 17:30. El servicio de corte y tinte tarda aproximadamente dos horas. ¿Le va bien ese horario?' },
      { who: 'cliente', text: 'Sí, genial.' },
      { who: 'ia', text: 'Perfecto, le reservo el hueco a las 17:30. ¿Es la primera vez que viene o ya es cliente?' },
    ],
  },
  {
    sector: 'Inmobiliaria',
    icon: '🏠',
    voice: 'Diego',
    color: 'bg-emerald-50 text-emerald-600',
    ring: 'ring-emerald-200',
    conversation: [
      { who: 'cliente', text: 'Buenas, vi un piso de tres habitaciones en vuestra web y me gustaría visitarlo.' },
      { who: 'ia', text: 'Buenos días. Claro, podemos organizar una visita. ¿Tiene disponibilidad esta semana? Podemos mostrarle el inmueble cualquier día de lunes a sábado.' },
      { who: 'cliente', text: 'El viernes por la mañana me va bien.' },
      { who: 'ia', text: 'Perfecto. Le agendamos la visita para el viernes. Nuestro agente le contactará hoy para confirmar la hora exacta. ¿Me facilita su número?' },
    ],
  },
]

function VoiceWave({ active }: { active: boolean }) {
  const heights = [30, 60, 90, 70, 45, 80, 55, 95, 65, 40]
  return (
    <div className="flex items-center gap-[2px] h-7">
      {heights.map((h, i) => (
        <motion.div
          key={i}
          className="w-[3px] rounded-full bg-accent"
          style={{ height: `${h}%` }}
          animate={active ? { scaleY: [0.3, 1, 0.3] } : { scaleY: 0.15 }}
          transition={{ duration: 0.9 + i * 0.05, repeat: active ? Infinity : 0, delay: i * 0.06, ease: 'easeInOut' }}
        />
      ))}
    </div>
  )
}

export default function VoiceDemoSection() {
  const [selected, setSelected] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [step, setStep] = useState(-1)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const scenario = scenarios[selected]

  const play = () => {
    if (playing) {
      setPlaying(false)
      setStep(-1)
      if (timerRef.current) clearTimeout(timerRef.current)
      return
    }
    setPlaying(true)
    setStep(0)
    scenario.conversation.forEach((_, i) => {
      timerRef.current = setTimeout(() => {
        setStep(i)
        if (i === scenario.conversation.length - 1) {
          setTimeout(() => { setPlaying(false); setStep(-1) }, 2500)
        }
      }, i * 2200)
    })
  }

  const select = (i: number) => {
    setSelected(i)
    setPlaying(false)
    setStep(-1)
    if (timerRef.current) clearTimeout(timerRef.current)
  }

  return (
    <section id="demo" className="py-section bg-white">
      <div className="max-w-6xl mx-auto px-6 md:px-12">

        <div className="text-center mb-14">
          <motion.span
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="eyebrow block mb-4"
          >Demo interactivo</motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ delay: 0.08 }}
            className="text-headline font-semibold text-ink"
          >
            Escucha a tu IA en acción.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ delay: 0.16 }}
            className="mt-4 text-lg text-dim font-light max-w-xl mx-auto"
          >
            Pulsa play y simula una llamada real de un cliente a tu negocio.
            Cada sector tiene su propia voz y personalidad.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8 items-start">

          <motion.div
            initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.7 }}
            className="flex flex-col gap-2"
          >
            <div className="text-[11px] font-semibold tracking-[0.18em] uppercase text-muted mb-2 px-1">Selecciona tu sector</div>
            {scenarios.map((s, i) => (
              <button
                key={i}
                onClick={() => select(i)}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-left transition-all duration-250 ${
                  selected === i
                    ? `bg-accent text-white shadow-glow`
                    : 'bg-surface hover:bg-border/60 text-dim hover:text-ink'
                }`}
              >
                <span className="text-xl">{s.icon}</span>
                <div>
                  <div className={`text-[14px] font-semibold ${selected === i ? 'text-white' : 'text-ink'}`}>{s.sector}</div>
                  <div className={`text-[11px] ${selected === i ? 'text-white/60' : 'text-muted'}`}>Voz: {s.voice}</div>
                </div>
                {selected === i && (
                  <svg className="ml-auto" width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M3 7l3 3 5-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </button>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.1 }}
            className="bg-white rounded-2xl border border-border shadow-md overflow-hidden"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-surface/50">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-accent flex items-center justify-center text-white text-lg">
                  {scenario.icon}
                </div>
                <div>
                  <div className="text-[13px] font-semibold text-ink">{scenario.sector}</div>
                  <div className="text-[11px] text-muted">Asistente IA · Voz: {scenario.voice}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {playing && <VoiceWave active={playing && step % 2 === 1} />}
                <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${playing ? 'bg-green-100 text-green-600' : 'bg-surface text-muted'}`}>
                  {playing ? '● En llamada' : 'Listo'}
                </span>
              </div>
            </div>

            <div className="px-6 py-5 space-y-4 min-h-[260px]">
              <AnimatePresence>
                {scenario.conversation.map((msg, i) => {
                  if (i > step) return null
                  const isIA = msg.who === 'ia'
                  return (
                    <motion.div
                      key={`${selected}-${i}`}
                      initial={{ opacity: 0, y: 12, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      className={`flex ${isIA ? 'justify-start' : 'justify-end'}`}
                    >
                      <div className={`flex items-end gap-2 max-w-[85%] ${isIA ? 'flex-row' : 'flex-row-reverse'}`}>
                        {isIA && (
                          <div className="w-7 h-7 rounded-full bg-accent flex items-center justify-center shrink-0 mb-0.5">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
                              <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 3a3 3 0 1 1-3 3 3 3 0 0 1 3-3zm0 14.2a7.2 7.2 0 0 1-6-3.22c.03-1.99 4-3.08 6-3.08s5.97 1.09 6 3.08a7.2 7.2 0 0 1-6 3.22z"/>
                            </svg>
                          </div>
                        )}
                        <div className={`px-4 py-2.5 rounded-2xl text-[13px] leading-relaxed ${
                          isIA
                            ? 'bg-accent-light text-ink rounded-bl-sm'
                            : 'bg-ink text-white rounded-br-sm'
                        }`}>
                          {isIA && <span className="block text-[10px] font-semibold text-accent mb-1">IA · {scenario.voice}</span>}
                          {msg.text}
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </AnimatePresence>

              {step === -1 && !playing && (
                <div className="flex items-center justify-center h-full pt-8">
                  <p className="text-[13px] text-muted text-center">
                    Pulsa play para simular<br />una llamada real de un cliente
                  </p>
                </div>
              )}
            </div>

            <div className="px-6 py-4 border-t border-border flex items-center justify-between bg-surface/30">
              <div className="text-[12px] text-muted">
                {playing ? 'Simulando llamada en curso...' : 'Demo de conversación IA'}
              </div>
              <button
                onClick={play}
                className={`flex items-center gap-2.5 px-5 py-2.5 rounded-full text-[13px] font-semibold transition-all duration-300 ${
                  playing
                    ? 'bg-red-50 text-red-500 hover:bg-red-100'
                    : 'bg-accent text-white hover:bg-accent-dark shadow-glow'
                }`}
              >
                {playing ? (
                  <><svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor"><rect x="1" y="1" width="4" height="10" rx="1"/><rect x="7" y="1" width="4" height="10" rx="1"/></svg>Detener</>
                ) : (
                  <><svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor"><path d="M2 1l9 5-9 5V1z"/></svg>Reproducir</>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
