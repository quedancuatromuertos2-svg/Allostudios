'use client'

import { useState } from 'react'
import { ESCALERA, pctParaVenta } from '@/lib/comisiones-reglas'

/*  Cuánto gana un comercial. Tres pasos que se leen de arriba abajo:
      1. Elige el pack que sueles cerrar.
      2. Di cuántos clientes cierras a la semana (la escalera es semanal: 20 % → 25 % desde la 3.ª → 30 % desde la 5.ª).
      3. Mira lo que cobras: por cada cliente y lo que sumas cada mes.
    Reglas en lib/comisiones-reglas.ts (misma fuente que el webhook de Stripe y el panel).          */

const PACKS = [
  { label: 'Estándar', cuota: 199 },
  { label: 'Pro', cuota: 349 },
  { label: 'Max', cuota: 499 },
]
const MESES = 12
const SEMANAS_MES = 4.33
const eur = (n: number) => n.toLocaleString('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })

export default function ComisionCalculadora({ compact = false }: { compact?: boolean }) {
  const [pack, setPack] = useState(1)
  const [semana, setSemana] = useState(2)        // ventas por semana
  const cuota = PACKS[pack].cuota
  // Cada venta de la semana lleva su % según la escalera; la media pondera lo que cobras
  const pcts = Array.from({ length: semana }, (_, i) => pctParaVenta(i + 1))
  const pctMedio = pcts.reduce((t, p) => t + p, 0) / Math.max(1, semana)
  const porMes = Math.round(cuota * pctMedio / 100) // lo que te deja UN cliente cada mes (media)
  const porCliente = porMes * MESES               // lo que te deja UN cliente en total
  const clientes = Math.round(semana * SEMANAS_MES)
  const nuevoCadaMes = porMes * clientes          // lo que añades a tu sueldo cada mes que cierras así
  const alAno = nuevoCadaMes * MESES              // tu cobro mensual cuando llevas 12 meses cerrando así

  const Paso = ({ n, t }: { n: string; t: string }) => (
    <div className="flex items-center gap-3 mb-3">
      <span className="w-7 h-7 rounded-full bg-ink text-white text-[12px] font-semibold flex items-center justify-center">{n}</span>
      <span className="text-[14px] font-semibold text-ink">{t}</span>
    </div>
  )

  return (
    <div className={`lg rounded-2xl ${compact ? 'p-5' : 'p-6 md:p-8'} space-y-7`}>
      {/* 1 · Pack */}
      <div>
        <Paso n="1" t="El pack que cierras" />
        <div className="grid grid-cols-3 gap-2">
          {PACKS.map((p, i) => (
            <button key={p.label} type="button" onClick={() => setPack(i)}
              className={`rounded-xl px-3 py-3 text-left transition-all duration-300 border ${pack === i ? 'bg-accent text-white border-accent shadow-[0_12px_30px_-12px_rgba(91,91,214,.7)]' : 'border-border text-dim hover:text-ink hover:border-ink/30'}`}>
              <span className="block text-[13.5px] font-semibold">{p.label}</span>
              <span className={`block text-[12px] ${pack === i ? 'text-white/80' : 'text-muted'}`}>{eur(p.cuota)}/mes</span>
            </button>
          ))}
        </div>
      </div>

      {/* 2 · Ventas a la semana + escalera */}
      <div>
        <Paso n="2" t="Ventas que cierras a la semana" />
        <div className="flex items-center gap-4">
          <input id="af-ventas" type="range" min={1} max={7} step={1} value={semana} onChange={(e) => setSemana(Number(e.target.value))} className="flex-1 accent-accent" />
          <span className="text-[26px] font-display font-semibold text-ink tabular-nums w-10 text-right">{semana}</span>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {ESCALERA.map((e) => {
            const activo = pctParaVenta(semana) === e.pct
            return (
              <div key={e.pct} className={`rounded-xl px-3 py-2.5 border text-center transition-colors duration-300 ${activo ? 'border-accent bg-accent/10' : 'border-border'}`}>
                <div className={`text-[18px] font-display font-semibold leading-none ${activo ? 'text-accent' : 'text-ink'}`}>{e.pct} %</div>
                <div className="text-[11px] text-muted mt-1 leading-tight">{e.etiqueta}</div>
              </div>
            )
          })}
        </div>
        <p className="text-[12px] text-muted mt-2">De lunes a domingo; el lunes se vuelve a empezar. Con {semana} {semana === 1 ? 'venta' : 'ventas'} a la semana tu media es del {pctMedio.toFixed(0)} % y cierras unos {clientes} clientes al mes.</p>
      </div>

      {/* 3 · Lo que cobras */}
      <div>
        <Paso n="3" t="Lo que cobras" />
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="lg rounded-xl p-4">
            <div className="text-[11px] uppercase tracking-[0.14em] text-muted font-semibold">Por cada cliente</div>
            <div className="mt-1.5 font-display text-[2rem] leading-none font-semibold text-accent tracking-[-0.03em]">{eur(porCliente)}</div>
            <p className="text-[12.5px] text-dim mt-2 leading-relaxed">
              <strong className="text-ink">{eur(porMes)} al mes durante 12 meses.</strong> Es el {pctMedio.toFixed(0)} % de media de su cuota de {eur(cuota)}. Lo cobras mientras el cliente paga.
            </p>
          </div>
          <div className="lg rounded-xl p-4">
            <div className="text-[11px] uppercase tracking-[0.14em] text-muted font-semibold">Tu sueldo al cabo de un año</div>
            <div className="mt-1.5 font-display text-[2rem] leading-none font-semibold text-ink tracking-[-0.03em]">{eur(alAno)}<span className="text-[14px] text-muted font-normal tracking-normal"> /mes</span></div>
            <p className="text-[12.5px] text-dim mt-2 leading-relaxed">
              Cada mes que cierras {clientes} {clientes === 1 ? 'cliente' : 'clientes'} añades <strong className="text-ink">{eur(nuevoCadaMes)}/mes</strong> a lo que ya cobras. A los 12 meses estás en {eur(alAno)} al mes.
            </p>
          </div>
        </div>
        <p className="text-[12px] text-muted mt-3">Se paga el día 5 de cada mes, contra factura, de las cuotas cobradas el mes anterior. Si el cliente paga el año por adelantado, cobras tu parte de golpe. Sigues tus ventas y tu escalera en tu panel.</p>
      </div>
    </div>
  )
}
