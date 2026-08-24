'use client'

import { useState } from 'react'
import CristalTermico, { type Rampa } from '@/components/hero/CristalTermico'

/*  Banco de pruebas de la cabecera: permite comparar las tres rampas
    térmicas y el número de franjas en vivo, antes de tocar la home.  */

const RAMPAS: { k: Rampa; label: string; pista: string }[] = [
  { k: 'violeta', label: 'Violeta', pista: 'La más fiel a la marca' },
  { k: 'magenta', label: 'Magenta', pista: 'Más contraste, quema antes' },
  { k: 'brasa', label: 'Brasa', pista: 'Guiño a tus referencias' },
]

const wa = 'https://wa.me/34695868793?text=' + encodeURIComponent('Hola, quiero mi demo gratis. Mi negocio es: ')

export default function CristalPreview() {
  const [rampa, setRampa] = useState<Rampa>('violeta')
  const [franjas, setFranjas] = useState(46)
  const [fuerza, setFuerza] = useState(0.7)
  const [palabra, setPalabra] = useState('Allostudios')

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <section className="ct">
        <CristalTermico rampa={rampa} franjas={franjas} fuerza={fuerza} palabra={palabra} className="ct-lienzo" />
        <div className="ct-oscurece" />

        <div className="ct-in">
          <h1 className="ct-h1">
            Que te encuentren. Que te escriban. <span>Que compren.</span>
          </h1>
          <p className="ct-sub">
            Webs, Instagram, anuncios y un asistente de IA que responde 24/7 para negocios
            locales de Valencia. Te enseñamos tu web <strong>antes</strong> de que pagues nada.
          </p>
          <div className="ct-ctas">
            <a href="#" className="ct-btn ct-btn-p">
              Mira tu web gratis
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
                <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
            <a href={wa} target="_blank" rel="noopener noreferrer" className="ct-btn ct-btn-s">
              Hablar por WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Mandos de la prueba — esto no iría en la web final */}
      <div className="ct-mandos">
        <div className="ct-grupo">
          <span className="ct-eti">Rampa</span>
          {RAMPAS.map((r) => (
            <button
              key={r.k}
              onClick={() => setRampa(r.k)}
              className={`ct-op ${rampa === r.k ? 'is-on' : ''}`}
              title={r.pista}
            >
              {r.label}
            </button>
          ))}
        </div>
        <div className="ct-grupo">
          <span className="ct-eti">Detrás</span>
          {[['A', 'Una letra'], ['ALLO', 'ALLO'], ['Allostudios', 'Completo']].map(([v, l]) => (
            <button key={v} onClick={() => setPalabra(v)} className={`ct-op ${palabra === v ? 'is-on' : ''}`}>
              {l}
            </button>
          ))}
        </div>
        <div className="ct-grupo">
          <span className="ct-eti">Franjas · {franjas}</span>
          <input type="range" min={14} max={90} value={franjas}
            onChange={(e) => setFranjas(Number(e.target.value))} className="ct-rango" />
        </div>
        <div className="ct-grupo">
          <span className="ct-eti">Refracción · {fuerza.toFixed(1)}</span>
          <input type="range" min={0} max={2.5} step={0.1} value={fuerza}
            onChange={(e) => setFuerza(Number(e.target.value))} className="ct-rango" />
        </div>
        <p className="ct-nota">{RAMPAS.find((r) => r.k === rampa)?.pista}. Mueve el ratón por la cabecera.</p>
      </div>
    </>
  )
}

const CSS = `
.ct{position:relative;min-height:100dvh;display:flex;align-items:center;justify-content:center;
overflow:hidden;background:#05050a;padding:120px 24px 140px}
.ct-lienzo{position:absolute;inset:0;width:100%;height:100%;display:block}
/* Oscurece la mitad de abajo para que el texto se lea siempre */
.ct-oscurece{position:absolute;inset:0;pointer-events:none;
background:linear-gradient(180deg,rgba(5,5,10,.15) 0%,rgba(5,5,10,.05) 38%,rgba(5,5,10,.82) 100%)}

.ct-in{position:relative;z-index:2;max-width:940px;text-align:center;margin-top:auto}
.ct-h1{font-family:Inter,system-ui,sans-serif;font-size:clamp(1.7rem,4.4vw,3.1rem);font-weight:650;
letter-spacing:-.035em;line-height:1.08;color:#fff;margin:0;text-wrap:balance;
text-shadow:0 2px 30px rgba(0,0,0,.55)}
.ct-h1 span{background:linear-gradient(100deg,#c9b6ff,#ffd9f4);-webkit-background-clip:text;
background-clip:text;color:transparent}
.ct-sub{margin:18px auto 0;max-width:37rem;font-size:clamp(.95rem,1.6vw,1.06rem);line-height:1.65;
font-weight:300;color:rgba(255,255,255,.66);text-shadow:0 2px 20px rgba(0,0,0,.6)}
.ct-sub strong{color:#fff;font-weight:600}

.ct-ctas{display:flex;flex-wrap:wrap;gap:12px;justify-content:center;margin-top:30px}
.ct-btn{display:inline-flex;align-items:center;gap:9px;padding:15px 30px;border-radius:999px;
font-size:14.5px;font-weight:600;text-decoration:none;
transition:transform .25s cubic-bezier(.16,1,.3,1),box-shadow .25s,background .25s}
.ct-btn-p{color:#fff;background:linear-gradient(100deg,#6a5bff,#a05bff);
box-shadow:0 18px 44px -16px rgba(140,91,255,.95),inset 0 1px 0 rgba(255,255,255,.35)}
.ct-btn-p:hover{transform:translateY(-2px)}
.ct-btn-s{color:#fff;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.22);
backdrop-filter:blur(12px)}
.ct-btn-s:hover{background:rgba(255,255,255,.16);transform:translateY(-2px)}

.ct-mandos{position:fixed;left:50%;bottom:18px;transform:translateX(-50%);z-index:20;max-width:94vw;
display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:14px 18px;padding:13px 20px;border-radius:18px;
background:rgba(16,14,24,.9);border:1px solid rgba(255,255,255,.12);backdrop-filter:blur(16px);
font-family:Inter,system-ui,sans-serif;box-shadow:0 20px 50px -20px rgba(0,0,0,.9)}
.ct-grupo{display:flex;align-items:center;gap:8px}
.ct-eti{font-size:10.5px;text-transform:uppercase;letter-spacing:.16em;color:rgba(255,255,255,.42);
white-space:nowrap}
.ct-op{padding:7px 14px;border-radius:99px;font-size:12.5px;font-weight:600;cursor:pointer;
background:transparent;border:1px solid rgba(255,255,255,.16);color:rgba(255,255,255,.6);
transition:all .2s}
.ct-op:hover{color:#fff;border-color:rgba(255,255,255,.35)}
.ct-op.is-on{background:linear-gradient(100deg,#6a5bff,#a05bff);border-color:transparent;color:#fff}
.ct-rango{width:130px;accent-color:#a05bff}
.ct-nota{width:100%;margin:0;font-size:11.5px;color:rgba(255,255,255,.38);text-align:center}
`
