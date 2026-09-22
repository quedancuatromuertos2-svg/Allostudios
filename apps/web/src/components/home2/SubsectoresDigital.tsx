'use client'

import { motion } from 'framer-motion'
import { ADNS } from '@/lib/adn'

/*  «Un diseño por tipo de negocio»: seis ADN digitales (SaaS, app, e-commerce, fintech, IA, agencia).
    Cada tarjeta enseña su paleta y su tipografía de verdad, no un icono: es la prueba de que la
    landing no sale de una plantilla. Al pulsar, el generador se abre con ese sector.              */

const SUB = [
  { adn: 'startup', sector: 'Startup / SaaS / software', titulo: 'SaaS y software', claim: 'Explica el producto', linea: 'Grotesca apretada, un acento eléctrico, cifras grandes y planes claros.' },
  { adn: 'app', sector: 'App móvil', titulo: 'Apps móviles', claim: 'La pantalla manda', linea: 'Colores vivos, formas redondeadas y la app siempre delante.' },
  { adn: 'ecommerce', sector: 'E-commerce / tienda online', titulo: 'E-commerce', claim: 'El producto, enorme', linea: 'Fondo cálido, foto a sangre y un botón de compra sin ruido.' },
  { adn: 'fintech', sector: 'Fintech / finanzas', titulo: 'Fintech', claim: 'Confianza por precisión', linea: 'Grafito y verde, cifras en monoespaciada, nada decorativo.' },
  { adn: 'ia', sector: 'Producto de IA', titulo: 'Productos de IA', claim: 'Terminal cara', linea: 'Negro absoluto, cian eléctrico y detalles técnicos en mono.' },
  { adn: 'agencia', sector: 'Agencia / servicios digitales', titulo: 'Agencias y servicios', claim: 'Tipografía enorme', linea: 'Editorial en blanco y negro con un acento ácido.' },
]

export default function SubsectoresDigital() {
  return (
    <section id="disenos" className="relative py-20 md:py-28 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.2em] font-medium bg-white/[.06] ring-1 ring-white/10 text-white/70">Un diseño por tipo de negocio</span>
          <h2 className="mt-6 font-display text-[clamp(2rem,4.4vw,3.4rem)] leading-[1.02] font-semibold tracking-[-0.04em] text-white text-balance">
            Un SaaS no se parece a una fintech. Tu landing tampoco.
          </h2>
          <p className="mt-4 text-[15px] text-white/55">Seis identidades propias: colores, tipografías y composición. Elige la tuya y te generamos la landing con ese ADN.</p>
        </div>

        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SUB.map((s, i) => {
            const a = ADNS.find((x) => x.clave === s.adn)
            if (!a) return null
            return (
              <motion.a
                key={s.adn}
                href={`/tu-web?sector=${encodeURIComponent(s.sector)}&nivel=premium`}
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: i * 0.06, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -5 }}
                className="group rounded-[1.6rem] p-1.5 bg-white/[.04] ring-1 ring-white/10 block"
              >
                {/* eslint-disable-next-line @next/next/no-page-custom-font */}
                <link rel="stylesheet" href={a.fuentes.url} />
                <div className="rounded-[calc(1.6rem-0.375rem)] overflow-hidden" style={{ background: a.bg }}>
                  <div className="relative h-[168px] p-5 flex flex-col justify-end overflow-hidden">
                    <div className="absolute inset-0" style={{ background: `radial-gradient(70% 60% at 25% 20%, ${a.luz[0]}cc, transparent 70%), radial-gradient(50% 50% at 85% 80%, ${a.acento}66, transparent 70%)` }} />
                    {/* el epígrafe va en blanco: algunos acento2 son casi negros (e-commerce, agencia) y no se leían */}
                    <div className="relative text-[9.5px] uppercase tracking-[0.2em] mb-2 text-white/70">{a.eyebrow} · ADN «{a.nombre}»</div>
                    <div className="relative text-[26px] leading-[1.02] tracking-[-0.03em]" style={{ fontFamily: a.fuentes.display, fontWeight: a.fuentes.displayPeso, color: '#fff' }}>
                      {s.claim}<span style={{ color: a.acento }}>.</span>
                    </div>
                    <div className="relative mt-3 flex gap-1.5">
                      {[a.acento, a.acento2, a.papel].map((c) => <span key={c} className="w-5 h-5 rounded-md ring-1 ring-white/20" style={{ background: c }} />)}
                    </div>
                  </div>
                  <div className="px-5 py-4 border-t border-white/10">
                    <div className="text-[15px] font-semibold text-white">{s.titulo}</div>
                    <p className="mt-1 text-[12.5px] text-white/50 leading-snug">{s.linea}</p>
                    <span className="mt-3 inline-block text-[12.5px] font-medium text-white/70 group-hover:text-white group-hover:underline underline-offset-4">Ver la mía con este diseño ›</span>
                  </div>
                </div>
              </motion.a>
            )
          })}
        </div>
      </div>
    </section>
  )
}
