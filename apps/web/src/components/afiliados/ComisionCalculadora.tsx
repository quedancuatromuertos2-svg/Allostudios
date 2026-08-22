'use client'

import { useState } from 'react'

const PRESETS = [
  { label: 'Web Arranque', ticket: 499 },
  { label: 'Web Premium', ticket: 790 },
  { label: 'Web + IA + redes', ticket: 1000 },
  { label: 'Web Cinematográfica', ticket: 1490 },
]

const eur = (n: number) =>
  n.toLocaleString('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })

export default function ComisionCalculadora({ compact = false }: { compact?: boolean }) {
  const [ticket, setTicket] = useState(499)
  const [ventas, setVentas] = useState(4)

  const comision = Math.round(ticket * 0.3)
  const mes = comision * ventas

  return (
    <div className={`lg rounded-2xl ${compact ? 'p-5' : 'p-6 md:p-8'}`}>
      {!compact && <div className="flex flex-wrap gap-2 mb-6">
        {PRESETS.map((p) => (
          <button
            key={p.label}
            type="button"
            onClick={() => setTicket(p.ticket)}
            className={`px-3.5 py-2 rounded-full text-[12.5px] font-medium border transition-all duration-200 ${
              ticket === p.ticket
                ? 'bg-accent text-white border-accent'
                : 'border-border text-dim hover:text-ink hover:border-ink/30'
            }`}
          >
            {p.label} · {eur(p.ticket)}
          </button>
        ))}
      </div>}

      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="af-ticket" className="block text-[12.5px] font-medium text-dim mb-2">
            Ticket que cierras
          </label>
          <div className="flex items-center gap-3">
            <input
              id="af-ticket"
              type="range"
              min={149}
              max={3000}
              step={1}
              value={ticket}
              onChange={(e) => setTicket(Number(e.target.value))}
              className="flex-1 accent-accent"
            />
            <span className="text-[15px] font-semibold text-ink tabular-nums w-[86px] text-right">{eur(ticket)}</span>
          </div>
        </div>

        <div>
          <label htmlFor="af-ventas" className="block text-[12.5px] font-medium text-dim mb-2">
            Ventas al mes
          </label>
          <div className="flex items-center gap-3">
            <input
              id="af-ventas"
              type="range"
              min={1}
              max={20}
              step={1}
              value={ventas}
              onChange={(e) => setVentas(Number(e.target.value))}
              className="flex-1 accent-accent"
            />
            <span className="text-[15px] font-semibold text-ink tabular-nums w-[86px] text-right">{ventas}</span>
          </div>
        </div>
      </div>

      <div className={`grid sm:grid-cols-2 gap-5 border-t border-border ${compact ? 'mt-5 pt-5' : 'mt-7 pt-7'}`}>
        <div>
          <div className="text-[12px] uppercase tracking-[0.14em] text-muted font-semibold mb-1.5">Por venta</div>
          <div className={`font-display leading-none font-semibold text-accent tracking-[-0.03em] ${compact ? 'text-[2rem]' : 'text-[2.4rem]'}`}>
            {eur(comision)}
          </div>
          <p className="text-[12.5px] text-muted mt-1.5">30 % del ticket, íntegro para ti</p>
        </div>
        <div>
          <div className="text-[12px] uppercase tracking-[0.14em] text-muted font-semibold mb-1.5">Al mes</div>
          <div className={`font-display leading-none font-semibold text-ink tracking-[-0.03em] ${compact ? 'text-[2rem]' : 'text-[2.4rem]'}`}>
            {eur(mes)}
          </div>
          <p className="text-[12.5px] text-muted mt-1.5">
            con {ventas} {ventas === 1 ? 'venta' : 'ventas'} cerradas
          </p>
        </div>
      </div>
    </div>
  )
}
