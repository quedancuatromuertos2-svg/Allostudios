'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

type Opcion = { k: string; label: string }
type Resultado = {
  encontrados: number
  nuevos: number
  yaEstaban: number
  analizados?: number
  pendientes?: number
  conTelefono?: number
  sinWeb?: number
  tiers?: Record<string, number>
}

export default function BuscarPanel() {
  const router = useRouter()
  const [abierto, setAbierto] = useState(false)
  const [sectores, setSectores] = useState<Opcion[]>([])
  const [zonas, setZonas] = useState<Opcion[]>([])
  const [sector, setSector] = useState('')
  const [zona, setZona] = useState('valencia')
  const [estado, setEstado] = useState<'idle' | 'buscando' | 'analizando'>('idle')
  const [res, setRes] = useState<Resultado | null>(null)
  const [error, setError] = useState('')
  const [quedan, setQuedan] = useState<number | null>(null)

  useEffect(() => {
    if (!abierto || sectores.length) return
    fetch('/api/panel/buscar')
      .then((r) => r.json())
      .then((d) => {
        if (d.sectores) { setSectores(d.sectores); setSector(d.sectores[0]?.k || '') }
        if (d.zonas) setZonas(d.zonas)
      })
      .catch(() => setError('No se pudieron cargar los sectores'))
    fetch('/api/panel/analizar').then((r) => r.json()).then((d) => setQuedan(d.quedan ?? null)).catch(() => {})
  }, [abierto, sectores.length])

  // Analiza en bucle hasta que no queden pendientes (cada tanda es una petición corta)
  async function analizarTodo() {
    setEstado('analizando')
    setError('')
    try {
      for (let vuelta = 0; vuelta < 60; vuelta++) {
        const r = await fetch('/api/panel/analizar', { method: 'POST' })
        const d = await r.json()
        if (!r.ok) throw new Error(d.error || 'No se pudo analizar')
        setQuedan(d.quedan)
        if (!d.quedan || !d.analizados) break
      }
      router.refresh()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo analizar')
    } finally {
      setEstado('idle')
    }
  }

  async function buscar(e: React.FormEvent) {
    e.preventDefault()
    setEstado('buscando')
    setError('')
    setRes(null)
    try {
      const r = await fetch('/api/panel/buscar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sector, zona }),
      })
      const d = await r.json()
      if (!r.ok) throw new Error(d.error || 'No se pudo buscar')
      setRes(d)
      setQuedan((q) => (q ?? 0) + (d.pendientes || 0))
      router.refresh()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo buscar')
    } finally {
      setEstado('idle')
    }
  }

  const trabajando = estado !== 'idle'

  return (
    <div className="card mb-6 overflow-hidden">
      <button onClick={() => setAbierto(!abierto)} className="w-full flex items-center justify-between gap-4 p-5 text-left">
        <div>
          <h2 className="text-[15px] font-semibold text-ink">Buscar negocios nuevos</h2>
          <p className="text-[12.5px] text-dim mt-0.5">
            {quedan
              ? `${quedan.toLocaleString('es-ES')} leads sin analizar`
              : 'Rastrea un sector y una zona en Google y mete los que no tengas'}
          </p>
        </div>
        <span className={`text-muted transition-transform duration-300 ${abierto ? 'rotate-45' : ''}`}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </span>
      </button>

      {abierto && (
        <div className="border-t border-border p-5 space-y-5">
          <form onSubmit={buscar} className="grid sm:grid-cols-[1.2fr_1fr_auto] gap-2.5 items-end">
            <div>
              <label className="block text-[12px] font-medium text-dim mb-1.5">Sector</label>
              <select
                value={sector} onChange={(e) => setSector(e.target.value)} required disabled={trabajando}
                className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-white text-[13.5px] text-ink focus:border-accent outline-none disabled:opacity-60"
              >
                {sectores.map((s) => <option key={s.k} value={s.k}>{s.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[12px] font-medium text-dim mb-1.5">Zona</label>
              <select
                value={zona} onChange={(e) => setZona(e.target.value)} disabled={trabajando}
                className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-white text-[13.5px] text-ink focus:border-accent outline-none disabled:opacity-60"
              >
                {zonas.map((z) => <option key={z.k} value={z.k}>{z.label}</option>)}
              </select>
            </div>
            <button disabled={trabajando || !sector} className="btn-accent rounded-full px-5 py-2.5 text-[13px] disabled:opacity-60">
              {estado === 'buscando' ? 'Buscando…' : 'Buscar'}
            </button>
          </form>

          {error && <p className="text-[13px] text-red-500">{error}</p>}

          {res && (
            <div className="bg-surface rounded-xl p-4 text-[13px] text-dim space-y-1.5">
              <p>
                <span className="text-ink font-semibold">{res.nuevos}</span> negocios nuevos
                {res.yaEstaban > 0 && <> · {res.yaEstaban} ya los tenías</>}
                {res.encontrados > 0 && <> · {res.encontrados} encontrados en Google</>}
              </p>
              {res.nuevos > 0 && (
                <p>
                  {res.sinWeb} sin web · {res.conTelefono} con teléfono
                  {res.tiers && <> · {res.tiers.A || 0} de máxima prioridad</>}
                </p>
              )}
              {(res.pendientes || 0) > 0 && (
                <p className="text-amber-600">
                  {res.pendientes} se quedaron sin analizar la web (tardan más). Dale a analizar.
                </p>
              )}
            </div>
          )}

          {(quedan ?? 0) > 0 && (
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-border">
              <p className="text-[12.5px] text-dim max-w-sm pt-3">
                Analizar la web de cada negocio saca sus problemas reales, el email escondido en la
                página y la puntuación buena. Va por tandas, puedes cerrar esto cuando acabe.
              </p>
              <button onClick={analizarTodo} disabled={trabajando} className="btn-primary rounded-full text-[13px] disabled:opacity-40">
                {estado === 'analizando'
                  ? `Analizando… quedan ${quedan}`
                  : `Analizar ${quedan} pendientes`}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
