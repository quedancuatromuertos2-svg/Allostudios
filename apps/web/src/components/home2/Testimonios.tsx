'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

/*  Prueba social: vídeos cortos de clientes y sus reseñas. Es lo único que la web no tenía y lo que
    más pesa en la decisión. Los vídeos van en /public/marca/testimonios/<slug>.mp4 con su cartel
    <slug>.jpg; si un cliente no tiene vídeo, sale solo la cita. Nada de esto se inventa: si la
    lista está vacía, la sección no se muestra.                                                    */

export type Testimonio = {
  slug: string
  nombre: string        // «Ana Salmerón»
  negocio: string       // «Distribución de cosmética · Valencia»
  cita: string          // lo que dice, en sus palabras
  dato?: string         // un número suyo, si lo hay («+18 llamadas al mes»)
  video?: boolean       // hay /marca/testimonios/<slug>.mp4
  enlace?: string       // su web, si la hicimos nosotros
}

export const TESTIMONIOS: Testimonio[] = [
  // Se rellena cuando estén grabados. Ejemplo de formato:
  // { slug: 'ana-salmeron', nombre: 'Ana Salmerón', negocio: 'Cosmética profesional · Valencia',
  //   cita: 'En dos semanas empezaron a llamarme por la web. Antes ni aparecía.', dato: '+12 llamadas al mes',
  //   video: true, enlace: 'https://ana-salmeron-demo.vercel.app' },
]

function Tarjeta({ t, i }: { t: Testimonio; i: number }) {
  const [reproduce, setReproduce] = useState(false)
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }}
      transition={{ delay: i * 0.08, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-[1.6rem] p-1.5 bg-white/[.04] ring-1 ring-white/10"
    >
      <div className="rounded-[calc(1.6rem-0.375rem)] overflow-hidden bg-[rgba(16,15,22,.72)] md:backdrop-blur-xl">
        {t.video && (
          <div className="relative aspect-[9/12] bg-black">
            {reproduce ? (
              <video src={`/marca/testimonios/${t.slug}.mp4`} poster={`/marca/testimonios/${t.slug}.jpg`} controls autoPlay playsInline className="w-full h-full object-cover" />
            ) : (
              <button type="button" onClick={() => setReproduce(true)} className="absolute inset-0 w-full h-full group" aria-label={`Ver el vídeo de ${t.nombre}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/marca/testimonios/${t.slug}.jpg`} alt="" className="w-full h-full object-cover" loading="lazy" />
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-[0_20px_40px_-16px_rgba(0,0,0,.7)] transition-transform duration-500 group-hover:scale-105">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="#18181B"><path d="M8 5v14l11-7z" /></svg>
                  </span>
                </span>
              </button>
            )}
          </div>
        )}
        <div className="p-6">
          <div className="text-amber-300 text-[13px] tracking-[0.1em]">★★★★★</div>
          <p className="mt-3 text-[15px] text-white leading-relaxed">«{t.cita}»</p>
          {t.dato && <p className="mt-3 text-[13px] font-semibold text-accent">{t.dato}</p>}
          <div className="mt-4 pt-4 border-t border-white/10">
            <div className="text-[14px] font-semibold text-white">{t.nombre}</div>
            <div className="text-[12.5px] text-white/50">{t.negocio}</div>
            {t.enlace && <a href={t.enlace} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-[12.5px] text-white/70 underline underline-offset-4">Ver su web ↗</a>}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function Testimonios() {
  if (TESTIMONIOS.length === 0) return null
  return (
    <section id="clientes" className="relative py-24 md:py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.2em] font-medium bg-white/[.06] ring-1 ring-white/10 text-white/70">Clientes</span>
          <h2 className="mt-6 font-display text-[clamp(2rem,4.4vw,3.4rem)] leading-[1.02] font-semibold tracking-[-0.04em] text-white text-balance">
            No te lo contamos nosotros.
          </h2>
          <p className="mt-4 text-[15px] text-white/55">Negocios de aquí, con nombre y apellidos, contando qué les ha cambiado.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {TESTIMONIOS.map((t, i) => <Tarjeta key={t.slug} t={t} i={i} />)}
        </div>
        <p className="text-center text-[13px] text-white/45 mt-8">
          Todas las reseñas son de clientes reales.{' '}
          <a href={process.env.NEXT_PUBLIC_GOOGLE_REVIEW_URL || 'https://allostudios.net'} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">Míralas en Google ↗</a>
        </p>
      </div>
    </section>
  )
}
