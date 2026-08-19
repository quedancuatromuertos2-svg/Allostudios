'use client'

/**
 * PosterBand — el póster líquido.
 *
 * Adaptación del cartel vertical: manchas de color que se deforman despacio,
 * un barrido de luz, la "A" de AlloStudios dibujada a línea fina en eco
 * topográfico, tipografía editorial y un ticker infinito abajo.
 * Los verdes ácidos del original pasan a la paleta de marca (índigo → violeta → rosa).
 */

import { useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'

const BLOBS = [
  { color: '#4f6bff', size: '52vw', top: '2%',  left: '-4%', dur: 19, path: { x: ['0%', '14%', '-4%', '0%'],  y: ['0%', '10%', '22%', '0%'],  scale: [1, 1.18, 0.94, 1] } },
  { color: '#d95bc0', size: '44vw', top: '46%', left: '-8%', dur: 23, path: { x: ['0%', '22%', '6%', '0%'],   y: ['0%', '-12%', '8%', '0%'],  scale: [1, 0.88, 1.22, 1] } },
  { color: '#8a5bff', size: '48vw', top: '26%', left: '50%',  dur: 26, path: { x: ['0%', '-16%', '8%', '0%'],  y: ['0%', '14%', '-10%', '0%'], scale: [1, 1.14, 0.9, 1] } },
  { color: '#22B573', size: '30vw', top: '62%', left: '58%',  dur: 21, path: { x: ['0%', '10%', '-12%', '0%'], y: ['0%', '-16%', '6%', '0%'],  scale: [1, 0.92, 1.16, 1] } },
]

const TICKER = [
  'Webs a medida',
  'Instagram gestionado',
  'Anuncios Meta & Google',
  'SEO local',
  'Reseñas de Google',
  'Asistente IA 24/7',
  'Sin permanencia',
]

/** La "A" de la marca a línea fina, con eco topográfico. */
function LineMark({ scale, opacity }: { scale: number; opacity: number }) {
  return (
    <g transform={`translate(24 24) scale(${scale}) translate(-24 -24)`} opacity={opacity}>
      <path d="M24 5 L4 43" stroke="currentColor" strokeWidth="0.5" strokeLinecap="round" fill="none" />
      <path d="M24 5 L44 43" stroke="currentColor" strokeWidth="0.5" strokeLinecap="round" fill="none" />
      <path d="M16 40 L16 35" stroke="currentColor" strokeWidth="0.4" strokeLinecap="round" />
      <path d="M20 40 L20 30" stroke="currentColor" strokeWidth="0.4" strokeLinecap="round" />
      <path d="M24 40 L24 23" stroke="currentColor" strokeWidth="0.4" strokeLinecap="round" />
      <path d="M28 40 L28 30" stroke="currentColor" strokeWidth="0.4" strokeLinecap="round" />
      <path d="M32 40 L32 35" stroke="currentColor" strokeWidth="0.4" strokeLinecap="round" />
    </g>
  )
}

export default function PosterBand() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { margin: '15% 0px' })
  const reduce = useReducedMotion()

  // Los bucles infinitos (manchas, barrido, deriva, ticker) solo corren con la
  // sección en pantalla: desenfocar superficies grandes es caro y no tiene
  // sentido pagarlo mientras el visitante está en otra parte de la página.
  const active = inView && !reduce

  return (
    <section
      ref={ref}
      aria-label="Obsesión por el detalle"
      className="relative isolate w-full overflow-hidden bg-[#0a0912]"
      style={{ minHeight: 'clamp(520px, 76vh, 720px)' }}
    >
      {/* ── Manchas de color que se deforman ── */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        {BLOBS.map((b, i) => (
          <motion.div
            key={b.color + i}
            className="absolute rounded-full"
            style={{
              width: b.size,
              height: b.size,
              top: b.top,
              left: b.left,
              background: `radial-gradient(circle at 40% 40%, ${b.color} 0%, ${b.color}00 68%)`,
              filter: 'blur(52px)',
              opacity: 0.82,
            }}
            animate={active ? b.path : undefined}
            transition={{ duration: b.dur, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}

        {/* Barrido de luz — la forma blanca rasgada del original, contenida
            arriba a la izquierda para que no se coma la tipografía */}
        <motion.div
          className="absolute -left-[22%] -top-[34%] h-[62vh] w-[56vw]"
          style={{
            background:
              'radial-gradient(ellipse at 34% 34%, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.16) 34%, rgba(255,255,255,0) 64%)',
            filter: 'blur(34px)',
            mixBlendMode: 'screen',
          }}
          animate={active ? { x: ['0%', '8%', '-4%', '0%'], y: ['0%', '12%', '4%', '0%'], scale: [1, 1.1, 0.95, 1] } : undefined}
          transition={{ duration: 28, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* ── La "A" a línea fina ── */}
      <motion.svg
        viewBox="0 0 48 48"
        aria-hidden
        className="pointer-events-none absolute bottom-[16%] right-[4%] h-[46%] w-auto text-white md:bottom-[18%] md:right-[10%] md:h-[58%]"
        initial={{ opacity: 0, scale: 0.94 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: '-20%' }}
        transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.g
          animate={active ? { rotate: [0, 1.4, -1, 0], y: [0, -6, 3, 0] } : undefined}
          transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '24px 24px' }}
        >
          <LineMark scale={1} opacity={0.42} />
          <LineMark scale={0.88} opacity={0.26} />
          <LineMark scale={0.74} opacity={0.15} />
          <LineMark scale={1.12} opacity={0.18} />
          <LineMark scale={1.26} opacity={0.1} />
        </motion.g>
      </motion.svg>

      {/* ── Velo oscuro por la izquierda: garantiza contraste del texto ── */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{ background: 'linear-gradient(100deg, rgba(10,9,18,0.66) 0%, rgba(10,9,18,0.26) 42%, rgba(10,9,18,0) 68%)' }}
      />

      {/* ── Etiquetas técnicas ── */}
      <div className="pointer-events-none absolute inset-0 hidden font-mono text-[10px] uppercase tracking-[0.18em] text-white/40 sm:block" aria-hidden>
        <span className="absolute right-6 top-7 md:right-12">&gt;99 pagespeed</span>
        <span className="absolute right-6 top-[24%] md:right-12">7 días · llave en mano</span>
        <span className="absolute left-6 bottom-[13%] md:left-14">39.47 N — 0.37 W</span>
        <span className="absolute right-6 bottom-[13%] md:right-12">24 / 7</span>
      </div>

      {/* ── Tipografía editorial ── */}
      <div className="relative z-10 flex flex-col justify-center px-6 pb-32 pt-24 md:px-14" style={{ minHeight: 'clamp(520px, 76vh, 720px)' }}>
        <motion.div
          initial={{ opacity: 0, y: 26, filter: 'blur(8px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, margin: '-15%' }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-[min(92vw,760px)]"
        >
          <span className="block font-mono text-[11px] lowercase tracking-[0.14em] text-white/50">
            (algo parecido a)
          </span>

          <h2 className="mt-1 leading-[0.86]">
            <span className="font-serif-display block text-[clamp(2.8rem,8vw,5.6rem)] italic text-white/90">
              obsesión
            </span>
            <span className="font-display -mt-[0.04em] block text-balance text-[clamp(2.6rem,7.4vw,5.8rem)] font-extrabold uppercase tracking-[-0.045em] text-white">
              por el detalle
            </span>
          </h2>

          <span className="mt-6 block font-mono text-[11px] tracking-[0.12em] text-white/45">
            en cada píxel de tu negocio
          </span>
        </motion.div>
      </div>

      {/* ── Ticker inferior ── */}
      <div className="absolute inset-x-0 bottom-0 z-10 border-t border-white/10 bg-black/25 py-3.5 backdrop-blur-sm">
        <div
          className="flex w-max animate-marquee items-center whitespace-nowrap will-change-transform motion-reduce:animate-none"
          style={{ animationPlayState: active ? 'running' : 'paused' }}
        >
          {[0, 1].map(copy => (
            <div key={copy} className="flex items-center" aria-hidden={copy === 1}>
              {TICKER.map(t => (
                <span key={copy + t} className="flex items-center">
                  <span className="px-5 text-[12px] font-semibold uppercase tracking-[0.14em] text-white/85">{t}</span>
                  <span className="text-[12px] text-white/25">·····</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
