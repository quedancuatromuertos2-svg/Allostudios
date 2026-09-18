'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef, type ReactNode } from 'react'
import { eur, porClave } from '@/lib/precios'
import { BusquedaEnVivo, ChatEnVivo } from './Animadas'
import { FondoEstandar, FondoPro, FondoMax } from './Fondos'
import DemoPack, { type NivelDemo } from './DemoPack'

/*  Un capítulo por pack. Estructura de venta (no de catálogo):
      1. Nombre + dolor en boca del dueño + para quién.
      2. Visual grande animado con el scroll (la prueba de que existe).
      3. "Qué consigues": mosaico de piezas de producto, cada una con UN resultado.
      4. "Qué lleva dentro": cada pieza con lo que costaría suelta → total tachado → precio del pack.
      5. "Tú solo haces esto": el esfuerzo del cliente en tres pasos de 10 minutos.
      6. Caja de compra: precio, 0 € de entrada, año por adelantado, reversión del riesgo y el botón.
      7. Dos dudas que frenan, respondidas.
    Estética: doble bisel (bandeja + núcleo), radios concéntricos, luz de la marca, movimiento con masa.  */

export type Pieza = { titulo: string; sub?: string; nodo: ReactNode; ancho?: 1 | 2 }
const EASE = [0.32, 0.72, 0, 1] as const

export default function CapituloPack({
  id, numero, nombre, clave, dolor, quien, oscuro, visual, efecto, mosaico, resultado, esfuerzo, bonus, dudas, url, destacado, nivel = 1, demo,
}: {
  id: string
  numero: string
  nombre: string
  /** clave del catálogo (PACK_ESTANDAR…) para leer precio y desglose */
  clave: string
  dolor: string
  quien: string
  oscuro?: boolean
  visual?: ReactNode
  efecto?: 'busqueda' | 'chat'
  mosaico: Pieza[]
  /** el resultado en una frase, con número si lo hay */
  resultado: string
  /** lo que hace el cliente: [cuándo, qué] × 3 */
  esfuerzo: [string, string][]
  /** incluido sin coste (bonus reales) */
  bonus: string[]
  /** dos dudas que frenan */
  dudas: [string, string][]
  url: string
  destacado?: boolean
  nivel?: 1 | 2 | 3
  /** nivel de web que enseña el panel de demo de la derecha */
  demo: NivelDemo
}) {
  const art = porClave(clave)!
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const escala = useTransform(scrollYProgress, [0, 0.3], [0.92, 1])
  const subida = useTransform(scrollYProgress, [0, 0.3], [48, 0])
  // Max: el título se disuelve hacia abajo y crece mientras nace la palabra grande del fondo (una se convierte en la otra)
  const tituloOp = useTransform(scrollYProgress, [0.05, 0.115], [1, 0])
  const tituloEsc = useTransform(scrollYProgress, [0.05, 0.13], [1, 2.4])
  const tituloY = useTransform(scrollYProgress, [0.05, 0.13], ['0%', '120%'])

  const T = oscuro
    ? { ink: 'text-white', dim: 'text-white/60', muted: 'text-white/40', line: 'border-white/10', shell: 'bg-white/[.04] ring-1 ring-white/10', core: 'bg-[rgba(18,17,24,.78)] shadow-[inset_0_1px_1px_rgba(255,255,255,.12)]' }
    : { ink: 'text-ink', dim: 'text-dim', muted: 'text-muted', line: 'border-ink/10', shell: 'bg-black/[.04] ring-1 ring-black/5', core: 'bg-white/[.82] shadow-[inset_0_1px_1px_rgba(255,255,255,1)]' }
  const acento = nivel === 3 ? 'text-[#FF9A5C]' : 'text-accent'
  const fondo = oscuro ? 'relative overflow-clip' : 'papel relative overflow-clip'
  const ahorroMes = (art.sumaSuelto || 0) - art.eur

  /* Bandeja + núcleo (doble bisel) */
  const Caja = ({ children, className = '' }: { children: ReactNode; className?: string }) => (
    <div className={`rounded-[2rem] p-1.5 ${T.shell} ${className}`}>
      <div className={`rounded-[calc(2rem-0.375rem)] h-full ${T.core} ${nivel === 3 ? 'backdrop-blur-xl' : ''}`}>{children}</div>
    </div>
  )
  const Entrada = ({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) => (
    <motion.div initial={{ opacity: 0, y: 40, filter: 'blur(8px)' }} whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.9, delay, ease: EASE }} className={className}>
      {children}
    </motion.div>
  )
  const Pill = ({ children }: { children: ReactNode }) => (
    <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.2em] font-medium ${oscuro ? 'bg-white/[.06] ring-1 ring-white/10 text-white/70' : 'bg-white/70 ring-1 ring-black/5 text-dim'}`}>{children}</span>
  )

  return (
    <section id={id} ref={ref} className={`${fondo} py-28 md:py-40`}>
      {nivel === 3 ? <FondoMax progreso={scrollYProgress} palabra={nombre.toUpperCase()} /> : oscuro ? <FondoPro progreso={scrollYProgress} /> : <FondoEstandar progreso={scrollYProgress} />}

      <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-12">
        {/* 1 · Nombre + dolor */}
        <div className="text-center max-w-3xl mx-auto">
          <Entrada><Pill><span className={`w-1.5 h-1.5 rounded-full ${nivel === 3 ? 'bg-[#FF7A2A]' : 'bg-accent'}`} />Pack {numero}{destacado ? ' · el más elegido' : nivel === 3 ? ' · todo incluido' : ''}</Pill></Entrada>
          <motion.div style={nivel === 3 ? { opacity: tituloOp, scale: tituloEsc, y: tituloY, transformOrigin: '50% 100%' } : undefined}>
            <motion.h2
              initial={{ opacity: 0, y: 36, filter: 'blur(10px)' }} whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true }} transition={{ duration: 1, ease: EASE }}
              className={`mt-7 font-display text-[clamp(3.6rem,10vw,8.5rem)] leading-[.92] font-semibold tracking-[-0.05em] ${T.ink}`}
            >
              {nivel === 3
                ? <span style={{ background: 'linear-gradient(90deg,#fff 0%,#FFC2A0 50%,#FF7A2A 100%)', WebkitBackgroundClip: 'text', color: 'transparent' }}>{nombre}.</span>
                : <>{nombre}<span className="acento">.</span></>}
            </motion.h2>
          </motion.div>
          <Entrada delay={0.15}>
            <p className={`mt-7 text-[clamp(1.4rem,2.8vw,2.1rem)] leading-snug font-medium tracking-[-0.025em] ${T.ink} text-balance`}>«{dolor}»</p>
            <p className={`mt-3 text-[15px] ${T.dim} font-light`}>{quien}</p>
          </Entrada>
        </div>

        {/* 2 · Visual */}
        <div className={`${nivel === 3 ? 'mt-[30vh] md:mt-[36vh]' : 'mt-16 md:mt-24'} grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-10 lg:gap-8 items-start`}>
          <motion.div style={{ scale: escala, y: subida }} className="flex justify-center lg:justify-start min-w-0">
            {efecto === 'busqueda' ? <BusquedaEnVivo progreso={scrollYProgress} sinMovil /> : efecto === 'chat' ? <ChatEnVivo progreso={scrollYProgress} /> : visual}
          </motion.div>
          <div className="flex justify-center lg:justify-end">
            <DemoPack nivel={demo} pack={nombre} oscuro={oscuro} nivel3={nivel === 3} />
          </div>
        </div>

        {/* 3 · Qué consigues */}
        <div className="mt-24 md:mt-32">
          <Entrada className="max-w-2xl">
            <Pill>Qué consigues</Pill>
            <h3 className={`mt-5 font-display text-[clamp(1.8rem,3.4vw,2.6rem)] leading-[1.05] font-semibold tracking-[-0.035em] ${T.ink} text-balance`}>{resultado}</h3>
          </Entrada>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
            {mosaico.map((p, i) => (
              <Entrada key={p.titulo} delay={(i % 3) * 0.08} className={p.ancho === 2 ? 'md:col-span-2' : ''}>
                <Caja className="h-full">
                  <div className="p-6 md:p-8 flex flex-col h-full">
                    <h4 className={`font-display text-[clamp(1.25rem,2vw,1.55rem)] leading-tight font-semibold tracking-[-0.025em] ${T.ink} text-balance`}>{p.titulo}</h4>
                    {p.sub && <p className={`mt-2 text-[14px] ${T.dim} font-light leading-relaxed max-w-md`}>{p.sub}</p>}
                    <div className="mt-auto pt-6 flex justify-center md:justify-start">{p.nodo}</div>
                  </div>
                </Caja>
              </Entrada>
            ))}
          </div>
        </div>

        {/* 4 + 5 · Qué lleva · Tú solo haces */}
        <div className="mt-4 md:mt-5 grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-5">
          <Entrada className="lg:col-span-7">
            <Caja className="h-full">
              <div className="p-6 md:p-8">
                <Pill>Qué lleva dentro</Pill>
                <ul className={`mt-6 divide-y ${T.line}`}>
                  {(art.desglose || []).map(([t, e]) => (
                    <li key={t} className="flex items-center justify-between gap-4 py-3.5">
                      <span className={`flex items-center gap-3 text-[14.5px] ${T.ink}`}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={`${acento} shrink-0`}><path d="m5 12 5 5L20 7" /></svg>
                        {t}
                      </span>
                      <span className={`text-[13px] tabular-nums ${T.muted} line-through shrink-0`}>{eur(e)}/mes</span>
                    </li>
                  ))}
                </ul>
                <div className={`mt-4 pt-4 border-t ${T.line} flex items-baseline justify-between`}>
                  <span className={`text-[13px] ${T.muted}`}>Por separado</span>
                  <span className={`text-[14px] tabular-nums ${T.muted} line-through`}>{eur(art.sumaSuelto || 0)}/mes</span>
                </div>
                <div className="mt-1.5 flex items-baseline justify-between">
                  <span className={`text-[15px] font-semibold ${T.ink}`}>Pack {nombre}</span>
                  <span className={`text-[15px] font-semibold tabular-nums ${T.ink}`}>{eur(art.eur)}/mes</span>
                </div>
                {ahorroMes > 0 && <p className={`mt-2 text-[13px] font-medium ${acento}`}>Ahorras {eur(ahorroMes)} al mes · {eur(ahorroMes * 12)} al año.</p>}

                <div className={`mt-7 pt-6 border-t ${T.line}`}>
                  <p className={`text-[10px] uppercase tracking-[0.2em] font-medium ${T.muted}`}>Y además, incluido</p>
                  <ul className={`mt-3 grid sm:grid-cols-2 gap-x-6 gap-y-2 text-[13.5px] ${T.dim}`}>
                    {bonus.map((b) => <li key={b} className="flex items-start gap-2"><span className={`mt-[7px] w-1.5 h-1.5 rounded-full ${nivel === 3 ? 'bg-[#FF7A2A]' : 'bg-accent'} shrink-0`} />{b}</li>)}
                  </ul>
                </div>
              </div>
            </Caja>
          </Entrada>

          <Entrada delay={0.1} className="lg:col-span-5">
            <Caja className="h-full">
              <div className="p-6 md:p-8 h-full flex flex-col">
                <Pill>Tú solo haces esto</Pill>
                <ol className="mt-6 space-y-5 flex-1">
                  {esfuerzo.map(([cuando, que], i) => (
                    <li key={cuando} className="flex gap-4">
                      <span className={`shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-[12px] font-semibold ${oscuro ? 'bg-white/[.08] text-white' : 'bg-ink text-white'}`}>{i + 1}</span>
                      <div>
                        <div className={`text-[14px] font-semibold ${T.ink}`}>{cuando}</div>
                        <div className={`text-[13.5px] ${T.dim} leading-relaxed mt-0.5`}>{que}</div>
                      </div>
                    </li>
                  ))}
                </ol>
                <p className={`mt-6 pt-5 border-t ${T.line} text-[13px] ${T.dim}`}>Del resto nos encargamos nosotros. Sin herramientas que aprender, sin técnicos, sin reuniones.</p>
              </div>
            </Caja>
          </Entrada>
        </div>

        {/* 6 · Caja de compra */}
        <Entrada className="mt-4 md:mt-5">
          <Caja>
            <div className="grid lg:grid-cols-[1.15fr_1fr]">
              <div className="p-7 md:p-10">
                <Pill>Pack {nombre} · {nivel === 3 ? 'todo incluido' : destacado ? 'el más elegido' : 'la base'}</Pill>
                <div className="mt-5 flex items-end gap-3 flex-wrap">
                  <span className={`font-display text-[clamp(3.2rem,6.5vw,5.2rem)] leading-none font-semibold tracking-[-0.045em] ${T.ink}`}>{eur(art.eur)}</span>
                  <span className={`pb-2 text-[15px] ${T.dim}`}>al mes</span>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {['0 € de entrada', '12 meses, luego mes a mes', `Año por adelantado: ${eur(art.eur * 10)} (2 meses gratis)`].map((x) => (
                    <span key={x} className={`rounded-full px-3 py-1.5 text-[12px] font-medium ${oscuro ? 'bg-white/[.07] ring-1 ring-white/10 text-white/85' : 'bg-white ring-1 ring-black/5 text-ink'}`}>{x}</span>
                  ))}
                </div>
                <div className="mt-8 flex flex-col sm:flex-row gap-3">
                  <a href={url} className="group inline-flex items-center gap-3 rounded-full pl-7 pr-2 py-2 text-[15px] font-semibold text-white transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 active:scale-[0.98]"
                    style={nivel === 3 ? { background: 'linear-gradient(90deg,#FF7A2A,#FF4FA3)', boxShadow: '0 16px 40px -14px rgba(255,122,42,.75)' } : { background: '#5B5BD6', boxShadow: '0 16px 40px -14px rgba(91,91,214,.7)' }}>
                    Contratar {nombre}
                    <span className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-1 group-hover:-translate-y-[1px] group-hover:scale-105">
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </span>
                  </a>
                  <a href="#tu-web" className={`inline-flex items-center justify-center rounded-full px-6 py-3.5 text-[14px] font-semibold ring-1 transition-colors duration-500 ${oscuro ? 'ring-white/15 text-white hover:bg-white/[.06]' : 'ring-black/10 text-ink hover:bg-white'}`}>
                    Ver mi web gratis antes
                  </a>
                </div>
              </div>
              <div className={`p-7 md:p-10 ${oscuro ? 'border-t lg:border-t-0 lg:border-l border-white/10' : 'border-t lg:border-t-0 lg:border-l border-ink/[.06]'}`}>
                <Pill>Sin riesgo</Pill>
                <ul className={`mt-5 space-y-3.5 text-[14px] ${T.dim}`}>
                  {[
                    ['Lo ves antes de pagar.', 'Tu web hecha con tus datos reales, gratis, en 30 segundos. Si no te gusta, no pasa nada.'],
                    ['Contrato claro, lo lees antes.', 'Qué te damos, cuándo y qué pasa si algo falla. Sin letra pequeña.'],
                    ['Cada mes, cuentas.', 'El día 28 te decimos qué ha entrado y qué ha cambiado. Si un mes no ves nada, nos lo dices.'],
                    ['Un WhatsApp directo con Ángel.', 'No un ticket ni un formulario. Una persona con nombre.'],
                  ].map(([t, d]) => (
                    <li key={t} className="flex gap-3">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={`${acento} shrink-0 mt-[3px]`}><path d="M12 3 4 6v6c0 5 3.4 8.4 8 9 4.6-.6 8-4 8-9V6l-8-3z" /><path d="m9 12 2 2 4-4" /></svg>
                      <span><strong className={`font-semibold ${T.ink}`}>{t}</strong> {d}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Caja>
        </Entrada>

        {/* 7 · Dudas */}
        <div className="mt-4 md:mt-5 grid md:grid-cols-2 gap-4 md:gap-5">
          {dudas.map(([q, a], i) => (
            <Entrada key={q} delay={i * 0.08}>
              <Caja className="h-full">
                <div className="p-6 md:p-7">
                  <p className={`text-[15px] font-semibold ${T.ink}`}>{q}</p>
                  <p className={`mt-2 text-[13.5px] ${T.dim} leading-relaxed`}>{a}</p>
                </div>
              </Caja>
            </Entrada>
          ))}
        </div>
      </div>
    </section>
  )
}
