'use client'

/*  Visuales compactos de las tarjetas de la tienda en modo «Startups y digitales».
    Tres escenas: la landing que explica el producto (Launch), el asistente que cualifica y
    agenda una demo (Growth) y el informe de coste por lead (Scale). Solo CSS, sin imágenes.  */

const V = { bg: '#07080F', acento: '#7C5CFF', menta: '#38E1B0' }

/* Launch: la cabecera de una landing SaaS, en un navegador pequeño */
export function VisualLanding() {
  return (
    <div className="w-full max-w-[300px] rounded-[14px] overflow-hidden ring-1 ring-black/10 shadow-[0_24px_50px_-28px_rgba(24,24,27,.5)]" style={{ background: V.bg, fontFamily: 'var(--font-geist-sans), Inter, sans-serif' }}>
      <div className="flex items-center gap-1.5 px-3 py-2 bg-white/[.06]">
        {['#FF5F57', '#FEBC2E', '#28C840'].map((c) => <span key={c} className="w-2 h-2 rounded-full" style={{ background: c }} />)}
        <span className="ml-2 h-3.5 flex-1 rounded-md bg-white/[.08]" />
      </div>
      <div className="relative px-4 pt-4 pb-4 text-center">
        <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(60% 50% at 50% 20%, ${V.acento}55, transparent 70%)` }} />
        <div className="relative inline-block text-[8px] font-mono tracking-[0.18em] uppercase text-white/50 mb-2">Vector · SaaS</div>
        <div className="relative text-white font-bold leading-[1.05] tracking-[-0.03em] text-[17px]">Tu producto explicado<br /><span style={{ color: V.acento }}>en cinco segundos.</span></div>
        <div className="relative mt-2 text-[9px] text-white/55 leading-snug">Una landing que convierte, con analítica y prueba social. Lista en 7 días.</div>
        <div className="relative mt-3 flex justify-center gap-1.5">
          <span className="rounded-full px-3 py-1 text-[9px] font-semibold text-[#07080F]" style={{ background: V.menta }}>Empieza gratis</span>
          <span className="rounded-full px-3 py-1 text-[9px] font-semibold text-white/80 ring-1 ring-white/15">Ver demo</span>
        </div>
        <div className="relative mt-3 flex justify-center gap-3 text-[8px] text-white/35 font-mono tracking-wider">{['ACME', 'NORTH', 'KIVA', 'ORBIT'].map((l) => <span key={l}>{l}</span>)}</div>
        <div className="relative mt-3 grid grid-cols-3 gap-1.5">
          {[['+2.4k', 'equipos'], ['4,8', 'en G2'], ['12 %', 'conversión']].map(([n, l]) => (
            <div key={l} className="rounded-lg bg-white/[.06] py-1.5"><div className="text-[12px] font-bold text-white leading-none">{n}</div><div className="text-[7.5px] text-white/45 mt-0.5">{l}</div></div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* Growth: el asistente cualificando a un lead y agendando la demo */
export function VisualCualificador() {
  const M = [
    { de: 'el', t: 'Hola, ¿tenéis plan para equipos de 10?' },
    { de: 'ia', t: 'Sí. ¿Lo usaríais para ventas o soporte? Así te enseño lo que encaja.' },
    { de: 'el', t: 'Ventas, somos 12 comerciales.' },
    { de: 'ia', t: 'Perfecto: plan Growth. Te agendo una demo de 20 min: ¿jueves 11:00 o viernes 16:30?' },
    { de: 'el', t: 'Jueves.' },
  ]
  return (
    <div className="w-full max-w-[300px] rounded-[14px] overflow-hidden ring-1 ring-white/10 shadow-[0_24px_50px_-28px_rgba(0,0,0,.6)]" style={{ background: '#0B0C14' }}>
      <div className="flex items-center gap-2 px-3 py-2 border-b border-white/10">
        <span className="w-6 h-6 rounded-full" style={{ background: `linear-gradient(135deg, ${V.acento}, ${V.menta})` }} />
        <div><div className="text-[10.5px] font-semibold text-white leading-none">Asistente · Vector</div><div className="text-[8px] mt-0.5" style={{ color: V.menta }}>cualifica y agenda</div></div>
      </div>
      <div className="p-3 space-y-1.5">
        {M.map((m, i) => (
          <div key={i} className={`max-w-[86%] rounded-xl px-2.5 py-1.5 text-[9.5px] leading-snug ${m.de === 'ia' ? 'bg-white/[.08] text-white' : 'ml-auto text-[#07080F] font-medium'}`} style={m.de === 'el' ? { background: V.menta } : undefined}>{m.t}</div>
        ))}
        <div className="mt-2 rounded-lg px-2.5 py-2 text-[9px] text-white flex items-center justify-between" style={{ background: `${V.acento}33`, boxShadow: `inset 0 0 0 1px ${V.acento}66` }}>
          <span>📅 Demo · jueves 11:00 · Google Calendar</span><span className="font-semibold" style={{ color: V.menta }}>agendada</span>
        </div>
      </div>
    </div>
  )
}

/* Scale: coste por lead por canal, la lectura semanal */
export function VisualCosteLead() {
  const F = [['LinkedIn', 38, 'bg-[#0A66C2]'], ['Google', 24, 'bg-[#34A853]'], ['Meta', 19, 'bg-[#FF4FA3]']] as const
  return (
    <div className="w-full max-w-[300px] rounded-[14px] p-4 ring-1 ring-white/10 shadow-[0_24px_50px_-28px_rgba(0,0,0,.6)]" style={{ background: '#0B0C14' }}>
      <div className="flex items-baseline justify-between">
        <div className="text-[8px] font-mono tracking-[0.18em] uppercase text-white/45">Semana 12 · coste por lead</div>
        <div className="text-[9px] text-white/45">47 leads</div>
      </div>
      <div className="mt-3 space-y-2">
        {F.map(([canal, n, c]) => (
          <div key={canal} className="flex items-center gap-2 text-[9.5px] text-white/80">
            <span className="w-14">{canal}</span>
            <span className="flex-1 h-2 rounded-full bg-white/[.06] overflow-hidden"><span className={`block h-full rounded-full ${c}`} style={{ width: `${(n / 40) * 100}%` }} /></span>
            <span className="w-9 text-right font-semibold text-white">{n} €</span>
          </div>
        ))}
      </div>
      <div className="mt-3 grid grid-cols-2 gap-1.5">
        <div className="rounded-lg bg-white/[.06] p-2"><div className="text-[13px] font-bold text-white leading-none">27 €</div><div className="text-[8px] text-white/45 mt-0.5">coste medio por lead</div></div>
        <div className="rounded-lg p-2" style={{ background: `${V.menta}22` }}><div className="text-[13px] font-bold leading-none" style={{ color: V.menta }}>−31 %</div><div className="text-[8px] text-white/45 mt-0.5">vs. semana 8</div></div>
      </div>
      <div className="mt-2.5 text-[8.5px] text-white/50 leading-snug">Esta semana: nueva landing para LinkedIn y pausa del público frío en Meta.</div>
    </div>
  )
}
