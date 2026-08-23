'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

/*  Cabecera oscura: logotipo en neón sobre una aurora violeta.

    El logotipo es TEXTO, no un vídeo. Se probó con el vídeo de Higgsfield y
    se le veía el rectángulo: mix-blend-mode:screen no podía fundirlo con el
    fondo porque la animación de scroll del contenedor aísla la composición,
    y el vídeo salía además más blando que el texto. En texto se rerenderiza
    nítido a cualquier resolución y pesa cero.                              */

const wa = 'https://wa.me/34695868793?text=' + encodeURIComponent('Hola, quiero mi demo gratis. Mi negocio es: ')

export default function HeroNeon() {
  const ref = useRef<HTMLElement>(null)
  const [p, setP] = useState({ x: 0, y: 0 })

  // Paralaje con el ratón: logotipo y aurora se mueven distinto = profundidad
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

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const escala = useTransform(scrollYProgress, [0, 1], [1, 0.88])
  const opaco = useTransform(scrollYProgress, [0, 0.75], [1, 0])
  const sube = useTransform(scrollYProgress, [0, 1], [0, -70])

  return (
    <section ref={ref} id="hero-oscuro" className="hn">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      {/* ── Fondo: aurora + haces de luz + rejilla + grano ── */}
      <div className="hn-fondo" aria-hidden>
        <div className="hn-aurora hn-a1" style={{ transform: `translate3d(${p.x * -26}px, ${p.y * -18}px, 0)` }} />
        <div className="hn-aurora hn-a2" style={{ transform: `translate3d(${p.x * 18}px, ${p.y * 14}px, 0)` }} />
        <div className="hn-aurora hn-a3" style={{ transform: `translate3d(${p.x * -10}px, ${p.y * 8}px, 0)` }} />
        <div className="hn-haces" />
        <div className="hn-grid" />
        <div className="hn-vineta" />
        <div className="hn-grano" />
      </div>

      <motion.div className="hn-in" style={{ scale: escala, opacity: opaco, y: sube }}>
        <div className="hn-marca" style={{ transform: `translate3d(${p.x * 9}px, ${p.y * 7}px, 0)` }}>
          <span className="hn-bloom" aria-hidden>allostudios.</span>
          <h1 className="hn-word">
            allostudios<span className="hn-punto">.</span>
            <span className="hn-barrido" aria-hidden>allostudios.</span>
          </h1>
        </div>

        <p className="hn-claim">
          Que te encuentren. Que te escriban. <span>Que compren.</span>
        </p>
        <p className="hn-sub">
          Webs, Instagram, anuncios y un asistente de IA que responde 24/7 para negocios
          locales de Valencia. Te enseñamos tu web <strong>antes</strong> de que pagues nada.
        </p>

        <div className="hn-ctas">
          <a href="#tu-web" className="hn-btn hn-btn-p">
            Mira tu web gratis
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
              <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
          <a href={wa} target="_blank" rel="noopener noreferrer" className="hn-btn hn-btn-s">
            Hablar por WhatsApp
          </a>
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
overflow:hidden;background:#05050a;isolation:isolate;padding:104px 24px 80px}

/* ── Fondo ───────────────────────────────────────────────── */
.hn-fondo{position:absolute;inset:0;pointer-events:none;overflow:hidden}

/* Aurora: tres manchas de color que se mueven muy despacio y a distinta
   velocidad. Da la sensación de que el fondo está vivo sin que se note. */
.hn-aurora{position:absolute;border-radius:50%;filter:blur(90px);will-change:transform,opacity}
.hn-a1{width:58vw;height:46vw;left:8%;top:-6%;
background:radial-gradient(closest-side,rgba(106,91,255,.40),transparent 70%);
animation:hnDeriva1 26s ease-in-out infinite alternate}
.hn-a2{width:52vw;height:40vw;right:2%;top:16%;
background:radial-gradient(closest-side,rgba(160,91,255,.34),transparent 70%);
animation:hnDeriva2 32s ease-in-out infinite alternate}
.hn-a3{width:46vw;height:34vw;left:26%;bottom:-14%;
background:radial-gradient(closest-side,rgba(70,60,220,.30),transparent 70%);
animation:hnDeriva3 38s ease-in-out infinite alternate}

/* Haces de luz cayendo desde arriba, muy sutiles */
.hn-haces{position:absolute;inset:-20% -10% 0;opacity:.5;
background:
 linear-gradient(178deg,rgba(160,120,255,.09) 0%,transparent 42%),
 conic-gradient(from 200deg at 30% -10%,transparent 0deg,rgba(160,120,255,.10) 14deg,transparent 30deg),
 conic-gradient(from 160deg at 72% -10%,transparent 0deg,rgba(106,91,255,.09) 12deg,transparent 26deg);
animation:hnHaces 22s ease-in-out infinite alternate}

.hn-grid{position:absolute;inset:0;opacity:.45;
background-image:linear-gradient(rgba(255,255,255,.026) 1px,transparent 1px),
linear-gradient(90deg,rgba(255,255,255,.026) 1px,transparent 1px);background-size:68px 68px;
mask-image:radial-gradient(ellipse 68% 58% at 50% 46%,#000 25%,transparent 100%);
-webkit-mask-image:radial-gradient(ellipse 68% 58% at 50% 46%,#000 25%,transparent 100%)}

.hn-vineta{position:absolute;inset:0;
background:radial-gradient(ellipse 92% 78% at 50% 46%,transparent 38%,rgba(0,0,0,.9) 100%)}

/* Grano. Además de dar aspecto de película, TAPA el bandeado: los degradados
   oscuros se ven a escalones en muchas pantallas y el ruido lo disimula. */
.hn-grano{position:absolute;inset:-100%;opacity:.055;pointer-events:none;
background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23n)'/%3E%3C/svg%3E");
animation:hnGrano .7s steps(2,end) infinite}

.hn-in{position:relative;z-index:2;width:100%;max-width:1080px;text-align:center;
display:flex;flex-direction:column;align-items:center}

/* ── El logotipo ─────────────────────────────────────────── */
.hn-marca{position:relative;width:100%;will-change:transform;
transition:transform .5s cubic-bezier(.16,1,.3,1)}

.hn-word,.hn-bloom,.hn-barrido{font-family:Inter,system-ui,sans-serif;font-weight:600;letter-spacing:-.055em;
line-height:.9;font-size:clamp(2.7rem,11.8vw,11rem);margin:0;white-space:nowrap}
.hn-bloom{position:absolute;inset:0;color:#8c5bff;filter:blur(26px);opacity:.42;pointer-events:none;
animation:hnRespira 7s ease-in-out infinite}
.hn-word{position:relative;display:block;margin:0;color:#fff;
animation:hnEnciende 1.4s steps(1,end) both;
text-shadow:0 0 2px rgba(255,255,255,.9),0 0 11px rgba(223,201,255,.85),
0 0 34px rgba(160,91,255,.75),0 0 78px rgba(140,91,255,.5),0 0 150px rgba(106,91,255,.32)}
.hn-punto{color:#c39bff}

/* Destello que recorre las letras cada 9 s, como un reflejo sobre el cristal */
.hn-barrido{position:absolute;inset:0;color:transparent;pointer-events:none;
background:linear-gradient(100deg,transparent 38%,rgba(255,255,255,.95) 50%,transparent 62%);
background-size:280% 100%;background-position:180% 0;
-webkit-background-clip:text;background-clip:text;
animation:hnBarrido 9s cubic-bezier(.5,0,.3,1) 1.8s infinite}

/* ── Texto ───────────────────────────────────────────────── */
.hn-claim{margin:clamp(20px,3.4vw,40px) 0 0;font-family:Inter,system-ui,sans-serif;
font-size:clamp(1.22rem,3.3vw,2.05rem);font-weight:600;letter-spacing:-.03em;color:#fff;
animation:hnEntra .9s cubic-bezier(.16,1,.3,1) .5s both}
.hn-claim span{background:linear-gradient(100deg,#a58bff,#e0ccff);-webkit-background-clip:text;
background-clip:text;color:transparent}
.hn-sub strong{color:rgba(255,255,255,.9);font-weight:600}
.hn-sub{margin:15px auto 0;max-width:36rem;font-size:clamp(.94rem,1.6vw,1.05rem);line-height:1.65;
font-weight:300;color:rgba(255,255,255,.56);animation:hnEntra .9s cubic-bezier(.16,1,.3,1) .65s both}

.hn-ctas{display:flex;flex-wrap:wrap;gap:12px;justify-content:center;margin-top:clamp(24px,3.4vw,34px);
animation:hnEntra .9s cubic-bezier(.16,1,.3,1) .8s both}
.hn-btn{display:inline-flex;align-items:center;gap:9px;padding:15px 30px;border-radius:999px;
font-size:14.5px;font-weight:600;letter-spacing:-.01em;text-decoration:none;
transition:transform .25s cubic-bezier(.16,1,.3,1),box-shadow .25s,background .25s}
.hn-btn-p{color:#fff;background:linear-gradient(100deg,#6a5bff,#a05bff);
box-shadow:0 18px 44px -16px rgba(140,91,255,.9),inset 0 1px 0 rgba(255,255,255,.35)}
.hn-btn-p:hover{transform:translateY(-2px);box-shadow:0 24px 56px -16px rgba(140,91,255,1)}
.hn-btn-s{color:#fff;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.16);
backdrop-filter:blur(10px)}
.hn-btn-s:hover{background:rgba(255,255,255,.11);transform:translateY(-2px)}

.hn-chips{display:flex;flex-wrap:wrap;gap:9px;justify-content:center;margin-top:clamp(26px,4vw,40px);
animation:hnEntra .9s cubic-bezier(.16,1,.3,1) .95s both}
.hn-chip{display:inline-flex;align-items:center;gap:8px;padding:9px 17px;border-radius:999px;
font-size:12.5px;font-weight:500;color:rgba(255,255,255,.72);
background:rgba(255,255,255,.045);border:1px solid rgba(255,255,255,.09)}
.hn-chip::before{content:'';width:5px;height:5px;border-radius:50%;background:#a05bff;
box-shadow:0 0 8px #a05bff}

.hn-scroll{position:absolute;bottom:26px;left:50%;transform:translateX(-50%);z-index:2;
width:22px;height:36px;border:1px solid rgba(255,255,255,.18);border-radius:999px;
display:flex;justify-content:center;padding-top:7px;animation:hnEntra 1s ease 1.4s both}
.hn-scroll span{width:3px;height:7px;border-radius:99px;background:rgba(255,255,255,.5);
animation:hnRueda 2s ease-in-out infinite}

/* ── Movimiento ──────────────────────────────────────────── */
@keyframes hnDeriva1{from{transform:translate(0,0) scale(1)}to{transform:translate(7%,5%) scale(1.14)}}
@keyframes hnDeriva2{from{transform:translate(0,0) scale(1.08)}to{transform:translate(-8%,7%) scale(.94)}}
@keyframes hnDeriva3{from{transform:translate(0,0) scale(.96)}to{transform:translate(5%,-6%) scale(1.16)}}
@keyframes hnHaces{from{opacity:.34}to{opacity:.62}}
@keyframes hnRespira{0%,100%{opacity:.62}50%{opacity:1}}
@keyframes hnBarrido{0%{background-position:180% 0}22%,100%{background-position:-120% 0}}
@keyframes hnEnciende{0%,7%{opacity:0}8%{opacity:1}11%{opacity:.15}13%{opacity:1}
17%{opacity:.25}19%{opacity:1}24%{opacity:.5}26%,100%{opacity:1}}
@keyframes hnEntra{from{opacity:0;transform:translateY(16px);filter:blur(6px)}
to{opacity:1;transform:none;filter:blur(0)}}
@keyframes hnRueda{0%,100%{transform:translateY(0);opacity:1}50%{transform:translateY(8px);opacity:.3}}
@keyframes hnGrano{
 0%{transform:translate(0,0)} 25%{transform:translate(-2%,1%)}
 50%{transform:translate(1%,-2%)} 75%{transform:translate(-1%,-1%)} 100%{transform:translate(0,0)}}

@media (prefers-reduced-motion:reduce){.hn *{animation:none!important;transition:none!important}}
@media (max-width:640px){.hn-grano{opacity:.04}.hn-aurora{filter:blur(60px)}}
`
