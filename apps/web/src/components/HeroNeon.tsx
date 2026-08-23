'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

/*  Cabecera oscura con el logotipo en neón.
    Todo el brillo es CSS: se rerenderiza nítido a cualquier resolución,
    pesa 0 KB y se puede enganchar al ratón y al scroll — cosas que un
    vídeo de fondo no puede hacer.                                        */

const wa = 'https://wa.me/34695868793?text=' + encodeURIComponent('Hola, quiero mi demo gratis. Mi negocio es: ')

export default function HeroNeon() {
  const ref = useRef<HTMLElement>(null)
  const [p, setP] = useState({ x: 0, y: 0 })

  // Paralaje suave con el ratón: el logotipo y el halo se mueven distinto
  // y eso da sensación de profundidad sin que nada se note "animado".
  useEffect(() => {
    const fina = window.matchMedia('(pointer: fine)').matches
    const quieto = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!fina || quieto) return
    const mover = (e: MouseEvent) => {
      setP({ x: (e.clientX / window.innerWidth - 0.5) * 2, y: (e.clientY / window.innerHeight - 0.5) * 2 })
    }
    window.addEventListener('mousemove', mover, { passive: true })
    return () => window.removeEventListener('mousemove', mover)
  }, [])

  // Al bajar, el logotipo se aleja y se apaga
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const escala = useTransform(scrollYProgress, [0, 1], [1, 0.86])
  const opaco = useTransform(scrollYProgress, [0, 0.7], [1, 0])
  const sube = useTransform(scrollYProgress, [0, 1], [0, -60])

  return (
    <section ref={ref} className="hn">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      {/* Halo detrás del logotipo */}
      <div className="hn-halo" style={{ transform: `translate3d(${p.x * -14}px, ${p.y * -10}px, 0)` }} />
      <div className="hn-grid" />
      <div className="hn-vineta" />

      <motion.div className="hn-in" style={{ scale: escala, opacity: opaco, y: sube }}>
        <div className="hn-marca" style={{ transform: `translate3d(${p.x * 8}px, ${p.y * 6}px, 0)` }}>
          <span className="hn-bloom" aria-hidden>allostudios.</span>
          <h1 className="hn-word">
            allostudios<span className="hn-punto">.</span>
            <span className="hn-barrido" aria-hidden>allostudios.</span>
          </h1>
        </div>

        <p className="hn-claim">
          Más clientes. <span>Sin tocar el marketing.</span>
        </p>
        <p className="hn-sub">
          Webs, Instagram, anuncios y un asistente de IA que responde 24/7 —
          para negocios locales de Valencia. Tú solo cierras.
        </p>

        <div className="hn-ctas">
          <a href={wa} target="_blank" rel="noopener noreferrer" className="hn-btn hn-btn-p">
            Pide tu demo gratis
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
              <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
          <a href="#tu-web" className="hn-btn hn-btn-s">Mira tu web gratis</a>
        </div>

        <div className="hn-chips">
          {['Instagram gestionado', 'Webs profesionales', 'Anuncios · IA 24/7'].map((c) => (
            <span key={c} className="hn-chip">{c}</span>
          ))}
        </div>
      </motion.div>

      <div className="hn-scroll" aria-hidden><span /></div>
    </section>
  )
}

const CSS = `
.hn{position:relative;min-height:100dvh;display:flex;align-items:center;justify-content:center;
overflow:hidden;background:#05050a;isolation:isolate;padding:120px 24px 90px}

/* ── Fondo ── */
.hn-halo{position:absolute;left:50%;top:50%;width:min(1500px,140vw);height:min(900px,90vh);
transform:translate(-50%,-50%);pointer-events:none;
background:radial-gradient(closest-side,rgba(140,91,255,.42),rgba(106,91,255,.16) 45%,transparent 72%);
filter:blur(30px);animation:hnRespira 7s ease-in-out infinite;will-change:transform,opacity}
.hn-grid{position:absolute;inset:0;pointer-events:none;opacity:.5;
background-image:linear-gradient(rgba(255,255,255,.028) 1px,transparent 1px),
linear-gradient(90deg,rgba(255,255,255,.028) 1px,transparent 1px);background-size:64px 64px;
mask-image:radial-gradient(ellipse 70% 60% at 50% 50%,#000 30%,transparent 100%);
-webkit-mask-image:radial-gradient(ellipse 70% 60% at 50% 50%,#000 30%,transparent 100%)}
.hn-vineta{position:absolute;inset:0;pointer-events:none;
background:radial-gradient(ellipse 90% 80% at 50% 50%,transparent 40%,rgba(0,0,0,.85) 100%)}

.hn-in{position:relative;z-index:2;width:100%;max-width:1080px;text-align:center;
display:flex;flex-direction:column;align-items:center}

/* ── El logotipo ── */
.hn-marca{position:relative;width:100%;will-change:transform;transition:transform .5s cubic-bezier(.16,1,.3,1)}
.hn-word,.hn-bloom,.hn-barrido{
  font-family:Inter,system-ui,sans-serif;font-weight:600;letter-spacing:-.055em;line-height:.9;
  font-size:clamp(3.1rem,13.6vw,13rem);margin:0;white-space:nowrap}

/* Capa borrosa detrás = el resplandor del tubo */
.hn-bloom{position:absolute;inset:0;color:#8c5bff;filter:blur(26px);opacity:.42;
animation:hnRespira 7s ease-in-out infinite;pointer-events:none}

.hn-word{position:relative;color:#fff;
text-shadow:0 0 2px rgba(255,255,255,.9),0 0 11px rgba(223,201,255,.85),
0 0 34px rgba(160,91,255,.75),0 0 78px rgba(140,91,255,.5),
0 0 150px rgba(106,91,255,.32);
animation:hnEnciende 1.5s steps(1,end) both}
.hn-punto{color:#c39bff}

/* Destello que recorre las letras cada pocos segundos */
.hn-barrido{position:absolute;inset:0;color:transparent;pointer-events:none;
background:linear-gradient(100deg,transparent 38%,rgba(255,255,255,.92) 50%,transparent 62%);
background-size:280% 100%;background-position:180% 0;
-webkit-background-clip:text;background-clip:text;
animation:hnBarrido 9s cubic-bezier(.5,0,.3,1) 2.4s infinite}

/* ── Texto ── */
.hn-claim{margin:clamp(22px,4vw,38px) 0 0;font-family:Inter,system-ui,sans-serif;
font-size:clamp(1.25rem,3.4vw,2.1rem);font-weight:600;letter-spacing:-.03em;color:#fff;
animation:hnEntra .9s cubic-bezier(.16,1,.3,1) 1.15s both}
.hn-claim span{background:linear-gradient(100deg,#a58bff,#e0ccff);-webkit-background-clip:text;
background-clip:text;color:transparent}
.hn-sub{margin:16px auto 0;max-width:36rem;font-size:clamp(.94rem,1.6vw,1.06rem);line-height:1.65;
font-weight:300;color:rgba(255,255,255,.58);animation:hnEntra .9s cubic-bezier(.16,1,.3,1) 1.3s both}

.hn-ctas{display:flex;flex-wrap:wrap;gap:12px;justify-content:center;margin-top:clamp(26px,4vw,38px);
animation:hnEntra .9s cubic-bezier(.16,1,.3,1) 1.45s both}
.hn-btn{display:inline-flex;align-items:center;gap:9px;padding:15px 30px;border-radius:999px;
font-size:14.5px;font-weight:600;letter-spacing:-.01em;text-decoration:none;
transition:transform .25s cubic-bezier(.16,1,.3,1),box-shadow .25s,background .25s}
.hn-btn-p{color:#fff;background:linear-gradient(100deg,#6a5bff,#a05bff);
box-shadow:0 18px 44px -16px rgba(140,91,255,.9),inset 0 1px 0 rgba(255,255,255,.35)}
.hn-btn-p:hover{transform:translateY(-2px);box-shadow:0 24px 56px -16px rgba(140,91,255,1)}
.hn-btn-s{color:#fff;background:rgba(255,255,255,.055);border:1px solid rgba(255,255,255,.16);
backdrop-filter:blur(10px)}
.hn-btn-s:hover{background:rgba(255,255,255,.1);transform:translateY(-2px)}

.hn-chips{display:flex;flex-wrap:wrap;gap:9px;justify-content:center;margin-top:clamp(30px,5vw,46px);
animation:hnEntra .9s cubic-bezier(.16,1,.3,1) 1.6s both}
.hn-chip{display:inline-flex;align-items:center;gap:8px;padding:9px 17px;border-radius:999px;
font-size:12.5px;font-weight:500;color:rgba(255,255,255,.72);
background:rgba(255,255,255,.045);border:1px solid rgba(255,255,255,.09)}
.hn-chip::before{content:'';width:5px;height:5px;border-radius:50%;background:#a05bff;
box-shadow:0 0 8px #a05bff}

.hn-scroll{position:absolute;bottom:30px;left:50%;transform:translateX(-50%);z-index:2;
width:22px;height:36px;border:1px solid rgba(255,255,255,.2);border-radius:999px;
display:flex;justify-content:center;padding-top:7px;animation:hnEntra 1s ease 2s both}
.hn-scroll span{width:3px;height:7px;border-radius:99px;background:rgba(255,255,255,.55);
animation:hnRueda 2s ease-in-out infinite}

/* ── Movimiento ── */
@keyframes hnEnciende{
  0%,7%{opacity:0}
  8%{opacity:1}  11%{opacity:.15} 13%{opacity:1}
  17%{opacity:.25} 19%{opacity:1} 24%{opacity:.5}
  26%,100%{opacity:1}}
@keyframes hnRespira{0%,100%{opacity:.62}50%{opacity:1}}
@keyframes hnBarrido{0%{background-position:180% 0}22%,100%{background-position:-120% 0}}
@keyframes hnEntra{from{opacity:0;transform:translateY(16px);filter:blur(6px)}
to{opacity:1;transform:none;filter:blur(0)}}
@keyframes hnRueda{0%,100%{transform:translateY(0);opacity:1}50%{transform:translateY(8px);opacity:.3}}

@media (prefers-reduced-motion:reduce){
  .hn *,.hn-halo{animation:none!important;transition:none!important}
  .hn-word{opacity:1}}
`
