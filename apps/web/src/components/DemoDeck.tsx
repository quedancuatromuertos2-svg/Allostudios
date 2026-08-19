'use client'

/**
 * DemoDeck — baraja de webs de demostración.
 *
 * Adaptación del "card stack" de portadas: las tarjetas entran desde abajo
 * escalonadas y se abren en abanico. La de delante sale volando cada pocos
 * segundos y vuelve al fondo, así el visitante ve los 6 sectores sin hacer nada.
 * Click / teclado también avanzan. Se detiene al pasar el ratón por encima.
 */

import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useInView, useReducedMotion } from 'framer-motion'

type Demo = {
  sector: string
  name: string
  domain: string
  accent: string
  cta: string
}

const DEMOS: Demo[] = [
  { sector: 'Peluquería · Barbería', name: 'Reserva tu cita\nen 20 segundos', domain: 'estudiolaluz.es',   accent: '#E8734A', cta: 'Reservar cita' },
  { sector: 'Clínica dental',        name: 'Primera visita\ngratuita',        domain: 'dentalcolibri.com', accent: '#3B9AE1', cta: 'Pedir cita' },
  { sector: 'Restaurante',           name: 'Mesa para dos,\nesta noche',      domain: 'casaverdi.es',      accent: '#D64545', cta: 'Reservar mesa' },
  { sector: 'Gimnasio · Centro',     name: 'Tu primera\nsemana gratis',       domain: 'nucleofit.es',      accent: '#22B573', cta: 'Empezar ahora' },
  { sector: 'Estética · Uñas',       name: 'Manos nuevas\ncada semana',       domain: 'kathynails.es',     accent: '#D95BC0', cta: 'Pedir hora' },
  { sector: 'Taller · Automoción',   name: 'Presupuesto\nen el día',          domain: 'tallerpatraix.com', accent: '#F0A32A', cta: 'Pedir cita' },
]

/** Posición de reposo de cada tarjeta según su profundidad en la baraja.
 *  Los desplazamientos van en % del propio tamaño de la tarjeta → responsive. */
const FAN = [
  { x: '0%',   y: '0%',     rot: 0,    s: 1     },
  { x: '13%',  y: '-5%',    rot: 5,    s: 0.955 },
  { x: '-12%', y: '-9.5%',  rot: -6,   s: 0.915 },
  { x: '22%',  y: '-13.5%', rot: 10,   s: 0.878 },
  { x: '-20%', y: '-17%',   rot: -9,   s: 0.845 },
  { x: '7%',   y: '-20%',   rot: 3.5,  s: 0.815 },
]

const OUT_MS = 420      // lo que tarda la tarjeta de delante en salir de cuadro
const CYCLE_MS = 3600   // cada cuánto avanza sola
const EASE_OUT = [0.16, 1, 0.3, 1] as [number, number, number, number]
const EASE_IN = [0.42, 0, 1, 1] as [number, number, number, number]

function MiniSite({ d }: { d: Demo }) {
  const [line1, line2] = d.name.split('\n')
  return (
    <div
      className="h-full w-full overflow-hidden rounded-[18px] border border-white/12 bg-[#0e0e18]"
      style={{ boxShadow: '0 30px 80px -20px rgba(0,0,0,.85), inset 0 2px 0 rgba(255,255,255,.06)' }}
    >
      {/* Barra del navegador */}
      <div className="flex items-center gap-1.5 border-b border-white/8 bg-white/[0.04] px-3.5 py-2.5">
        <span className="h-2 w-2 rounded-full bg-white/15" />
        <span className="h-2 w-2 rounded-full bg-white/15" />
        <span className="h-2 w-2 rounded-full bg-white/15" />
        <div className="mx-2 flex flex-1 items-center gap-1.5 rounded-md bg-white/[0.06] px-2.5 py-1 font-mono text-[9px] text-white/35">
          <svg width="7" height="7" viewBox="0 0 8 8" fill="none" aria-hidden>
            <path d="M2.6 3.4V2.4a1.4 1.4 0 0 1 2.8 0v1" stroke="currentColor" strokeWidth="1" />
            <rect x="1.9" y="3.4" width="4.2" height="3.2" rx="0.7" stroke="currentColor" strokeWidth="1" />
          </svg>
          {d.domain}
        </div>
      </div>

      {/* Hero de la web */}
      <div className="relative overflow-hidden px-5 pt-5 pb-4">
        <div
          className="pointer-events-none absolute -right-10 -top-14 h-40 w-40 rounded-full blur-3xl"
          style={{ background: d.accent, opacity: 0.22 }}
        />
        <div
          className="pointer-events-none absolute -bottom-16 -left-8 h-28 w-28 rounded-full blur-2xl"
          style={{ background: d.accent, opacity: 0.12 }}
        />

        <div className="relative text-[9px] font-semibold uppercase tracking-[0.2em]" style={{ color: d.accent }}>
          {d.sector}
        </div>
        <div className="font-display relative mt-2 text-[clamp(17px,4.4vw,22px)] font-bold leading-[1.06] text-white">
          {line1}
          <br />
          {line2}
        </div>

        <div className="relative mt-3 space-y-1.5">
          <div className="h-1.5 w-[68%] rounded-full bg-white/12" />
          <div className="h-1.5 w-[46%] rounded-full bg-white/[0.07]" />
        </div>

        <div className="relative mt-4 flex items-center gap-2">
          <span
            className="rounded-full px-3.5 py-1.5 text-[10px] font-semibold text-white"
            style={{ background: d.accent, boxShadow: `0 6px 18px -6px ${d.accent}` }}
          >
            {d.cta}
          </span>
          <span className="rounded-full border border-white/15 px-3 py-1.5 text-[10px] text-white/45">
            Cómo llegar
          </span>
        </div>
      </div>

      {/* Fila de tarjetas de servicio */}
      <div className="flex gap-1.5 px-5 pb-5">
        {[0, 1, 2].map(i => (
          <div key={i} className="flex-1 rounded-lg border border-white/[0.07] bg-white/[0.03] p-2">
            <div className="mb-1.5 h-5 w-5 rounded" style={{ background: d.accent, opacity: 0.22 }} />
            <div className="mb-1 h-1 rounded-full bg-white/12" />
            <div className="h-1 w-2/3 rounded-full bg-white/[0.07]" />
          </div>
        ))}
      </div>
    </div>
  )
}

export default function DemoDeck() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { margin: '-12% 0px' })
  const reduce = useReducedMotion()

  const [order, setOrder] = useState<number[]>(() => DEMOS.map((_, i) => i))
  const [flying, setFlying] = useState<number | null>(null)
  const [entered, setEntered] = useState(false)
  const [paused, setPaused] = useState(false)

  // Refs para que `step` sea estable: si cambiase de identidad en cada ciclo,
  // el intervalo se reiniciaría y la baraja no avanzaría nunca.
  const orderRef = useRef(order)
  orderRef.current = order
  const busy = useRef(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Marca la entrada como terminada para que el ciclo no herede los delays escalonados
  useEffect(() => {
    if (!inView || entered) return
    const t = setTimeout(() => setEntered(true), 1300)
    return () => clearTimeout(t)
  }, [inView, entered])

  const step = useCallback(() => {
    if (busy.current) return // ya hay una tarjeta en vuelo
    busy.current = true
    setFlying(orderRef.current[0])
    timer.current = setTimeout(() => {
      setOrder(cur => [...cur.slice(1), cur[0]])
      setFlying(null)
      busy.current = false
    }, OUT_MS)
  }, [])

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current) }, [])

  useEffect(() => {
    if (reduce || !inView || !entered || paused) return
    const id = setInterval(step, CYCLE_MS)
    return () => clearInterval(id)
  }, [reduce, inView, entered, paused, step])

  const front = DEMOS[order[0]]

  return (
    <div className="relative mx-auto w-full max-w-[560px]">
      <div
        ref={ref}
        role="button"
        tabIndex={0}
        aria-label="Ver la siguiente web de ejemplo"
        onClick={step}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            step()
          }
        }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
        className="relative flex h-[clamp(320px,66vw,420px)] cursor-pointer items-end justify-center rounded-3xl outline-none focus-visible:ring-2 focus-visible:ring-white/40"
      >
        {DEMOS.map((d, i) => {
          const depth = order.indexOf(i)
          const rest = FAN[depth] ?? FAN[FAN.length - 1]
          const isFlying = flying === i

          const hidden = { x: '0%', y: '78%', rotate: rest.rot * 2.6, scale: 0.88, opacity: 0 }
          const out = { x: '-64%', y: '9%', rotate: -15, scale: 1.02, opacity: 0.9 }
          const at = { x: rest.x, y: rest.y, rotate: rest.rot, scale: rest.s, opacity: 1 }

          return (
            <motion.div
              key={d.domain}
              className="absolute inset-x-0 bottom-0 mx-auto w-[70%] sm:w-[min(78%,392px)] will-change-transform"
              style={{ zIndex: isFlying ? 90 : DEMOS.length - depth, transformOrigin: '50% 100%' }}
              initial={hidden}
              animate={!entered && !inView ? hidden : isFlying ? out : at}
              transition={
                isFlying
                  ? { duration: OUT_MS / 1000, ease: EASE_IN }
                  : { duration: reduce ? 0 : 0.78, ease: EASE_OUT, delay: entered || reduce ? 0 : depth * 0.085 }
              }
            >
              <MiniSite d={d} />
            </motion.div>
          )
        })}

        {/* Badge — PageSpeed */}
        <motion.div
          animate={inView && !reduce ? { y: [0, -7, 0] } : undefined}
          transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}
          className="pointer-events-none absolute -left-1 top-1 z-[95] flex items-center gap-2.5 rounded-2xl border border-border bg-white px-3.5 py-2.5 shadow-xl sm:-left-6"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-green-400 text-[10px] font-bold text-green-600">
            99
          </span>
          <span className="hidden sm:block">
            <span className="block text-[12px] font-semibold leading-none text-ink">PageSpeed</span>
            <span className="mt-0.5 block text-[10px] text-muted">Rendimiento perfecto</span>
          </span>
        </motion.div>

        {/* Badge — Entrega */}
        <motion.div
          animate={inView && !reduce ? { y: [0, 7, 0] } : undefined}
          transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut', delay: 0.7 }}
          className="pointer-events-none absolute -right-1 bottom-6 z-[95] rounded-2xl border border-border bg-white px-3.5 py-2.5 shadow-xl sm:-right-4"
        >
          <span className="block text-[17px] font-semibold leading-none tracking-[-0.03em] text-ink">7 días</span>
          <span className="mt-0.5 block text-[10px] text-muted">tiempo de entrega</span>
        </motion.div>
      </div>

      {/* Pie: sector actual + indicadores */}
      <div className="mt-7 flex flex-col items-center gap-3">
        <div className="h-5 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.span
              key={front.domain}
              initial={{ y: 14, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -14, opacity: 0 }}
              transition={{ duration: 0.35, ease: EASE_OUT }}
              className="block text-[12px] font-medium tracking-[0.02em] text-white/55"
            >
              {front.sector}
            </motion.span>
          </AnimatePresence>
        </div>
        <div className="flex items-center gap-1.5" aria-hidden>
          {DEMOS.map((d, i) => (
            <span
              key={d.domain}
              className="h-1 rounded-full transition-all duration-500"
              style={{
                width: order[0] === i ? 22 : 6,
                background: order[0] === i ? d.accent : 'rgba(255,255,255,0.18)',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
