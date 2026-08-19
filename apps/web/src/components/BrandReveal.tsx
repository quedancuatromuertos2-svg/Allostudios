'use client'

/**
 * BrandReveal — el reveal con aberración cromática.
 *
 * Adaptación del logo "MOTH": negro, un latido de oscuridad, y la marca que
 * entra de golpe con el canal de color separado y luego converge. El rojo del
 * original se sustituye por los dos extremos del degradado de AlloStudios
 * (#4f6bff azul / #d95bc0 rosa), así el efecto es el mismo pero en la marca.
 *
 * La separación se controla con la variable CSS --ab, que anima de 22px a 0
 * con un rebote intermedio (el "glitch" que hace que se sienta vivo).
 */

import type { MotionProps } from 'framer-motion'
import { motion, useReducedMotion } from 'framer-motion'

const WORD = 'AlloStudios'
const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number]
const TIMES = [0, 0.34, 0.52, 0.74, 1]

/** Separación cromática: entra abierta, casi cierra, rebota y se asienta. */
const AB_KEYFRAMES = ['22px', '3px', '13px', '1px', '0px']

const CHROMA_FILTER =
  'drop-shadow(var(--ab) 0 0 #4f6bff) drop-shadow(calc(var(--ab) * -1) 0 0 #d95bc0) drop-shadow(0 0 26px rgba(138,91,255,0.45))'

const CHROMA_TEXT_SHADOW =
  'var(--ab) 0 0 #4f6bff, calc(var(--ab) * -1) 0 0 #d95bc0, 0 0 34px rgba(138,91,255,0.35)'

const VIEWPORT = { once: true, margin: '-25% 0px' }

/** framer-motion sí anima custom properties en runtime, pero sus tipos no las
 *  contemplan; el cast se aísla aquí en vez de repartirse por el JSX. */
const asMotion = (p: Record<string, unknown>) => p as MotionProps

/** La "A" de AlloStudios con las 5 barras de audio, en sólido para el reveal. */
function Mark({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden>
      <path d="M24 5 L4 43" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M24 5 L44 43" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="16" y1="40" x2="16" y2="35" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      <line x1="20" y1="40" x2="20" y2="30" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      <line x1="24" y1="40" x2="24" y2="23" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      <line x1="28" y1="40" x2="28" y2="30" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      <line x1="32" y1="40" x2="32" y2="35" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  )
}

export default function BrandReveal() {
  const reduce = useReducedMotion()

  const markAnim: MotionProps = reduce
    ? {}
    : asMotion({
        initial: { opacity: 0, scale: 1.22, filter: 'blur(14px)' },
        whileInView: {
          '--ab': AB_KEYFRAMES,
          opacity: [0, 1, 1, 1, 1],
          scale: [1.22, 0.98, 1.02, 1, 1],
          filter: CHROMA_FILTER,
        },
        viewport: VIEWPORT,
        transition: { duration: 1.15, delay: 0.4, ease: EASE, times: TIMES },
      })

  const wordAnim: MotionProps = reduce
    ? {}
    : asMotion({
        initial: { '--ab': '18px' },
        whileInView: { '--ab': AB_KEYFRAMES },
        viewport: VIEWPORT,
        transition: { duration: 1.2, delay: 0.62, ease: EASE, times: TIMES },
      })

  const letterAnim = (i: number): MotionProps =>
    reduce
      ? {}
      : {
          initial: { y: '38%', scaleY: 1.75, opacity: 0, filter: 'blur(7px)' },
          whileInView: { y: '0%', scaleY: 1, opacity: 1, filter: 'blur(0px)' },
          viewport: VIEWPORT,
          transition: { duration: 0.72, delay: 0.62 + i * 0.035, ease: EASE },
        }

  const fadeUp = (delay: number): MotionProps =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 12 },
          whileInView: { opacity: 1, y: 0 },
          viewport: VIEWPORT,
          transition: { duration: 0.8, delay, ease: EASE },
        }

  return (
    <section
      aria-label="AlloStudios"
      className="relative isolate flex w-full flex-col items-center justify-center overflow-hidden bg-[#08070d] px-6"
      style={{ minHeight: 'clamp(380px, 52vh, 540px)' }}
    >
      {/* Halo que florece detrás de la marca */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[70vh] w-[70vh] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(138,91,255,0.22) 0%, rgba(79,107,255,0.10) 38%, transparent 68%)' }}
        initial={{ opacity: 0, scale: 0.6 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={VIEWPORT}
        transition={{ duration: 1.8, delay: 0.35, ease: EASE }}
      />

      <div className="relative z-10 flex flex-col items-center">
        {/* ── Marca ── */}
        <motion.div
          className="will-change-transform"
          style={{ ['--ab' as string]: '0px', filter: CHROMA_FILTER, color: '#fff' }}
          {...markAnim}
        >
          <Mark className="h-[clamp(74px,13vw,128px)] w-auto" />
        </motion.div>

        {/* ── Wordmark, letra a letra con onda ── */}
        <motion.div
          className="font-display mt-5 flex select-none text-[clamp(2.4rem,9vw,5.4rem)] font-extrabold leading-none tracking-[-0.045em] text-white"
          style={{ ['--ab' as string]: '0px' }}
          {...wordAnim}
        >
          {WORD.split('').map((ch, i) => (
            <motion.span key={ch + i} style={{ textShadow: CHROMA_TEXT_SHADOW }} {...letterAnim(i)}>
              {ch}
            </motion.span>
          ))}
        </motion.div>

        {/* ── Firma ── */}
        <motion.p
          className="mt-7 font-mono text-[10px] uppercase tracking-[0.34em] text-white/40"
          {...fadeUp(1.35)}
        >
          Webs · Instagram · Anuncios · IA
        </motion.p>

        <motion.a
          href="https://wa.me/34695868793?text=Hola%2C%20quiero%20mi%20demo%20gratis.%20Mi%20negocio%20es%3A%20"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-[13px] font-medium text-white/85 transition-all duration-300 hover:-translate-y-0.5 hover:border-white/45 hover:bg-white/5 hover:text-white active:scale-[0.98]"
          {...fadeUp(1.5)}
        >
          Pide tu demo gratis
          <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden>
            <path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.a>
      </div>
    </section>
  )
}
