'use client'

import { useEffect, useState } from 'react'

type Parada = {
  id: string
  name: string
  address: string | null
  phone: string | null
  hook: string | null
  problems: string[] | null
  sector_label: string | null
  tier: string | null
  km: number
  lat: number
  lon: number
  status: string
}

type Ruta = {
  desde: string
  total: number
  kmTotales?: number
  maps?: string
  paradas: Parada[]
  aviso?: string
}

export default function RutaPanel() {
  const [abierto, setAbierto] = useState(false)
  const [zonas, setZonas] = useState<{ k: string; label: string }[]>([])
  const [origen, setOrigen] = useState<'aqui' | 'zona' | 'direccion'>('aqui')
  const [zona, setZona] = useState('valencia')
  const [direccion, setDireccion] = useState('')
  const [radioKm, setRadioKm] = useState(2)
  const [paradas, setParadas] = useState(10)
  const [soloSinWeb, setSoloSinWeb] = useState(true)
  const [ruta, setRuta] = useState<Ruta | null>(null)
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!abierto || zonas.length) return
    fetch('/api/panel/buscar')
      .then((r) => r.json())
      .then((d) => { if (d.zonas) setZonas(d.zonas) })
      .catch(() => {})
  }, [abierto, zonas.length])

  function miUbicacion(): Promise<{ lat: number; lon: number }> {
    return new Promise((ok, ko) => {
      if (!navigator.geolocation) return ko(new Error('Tu navegador no da la ubicación'))
      navigator.geolocation.getCurrentPosition(
        (p) => ok({ lat: p.coords.latitude, lon: p.coords.longitude }),
        () => ko(new Error('No me has dado permiso de ubicación. Elige una zona o escribe una calle.')),
        { enableHighAccuracy: true, timeout: 10000 },
      )
    })
  }

  async function calcular(e: React.FormEvent) {
    e.preventDefault()
    setCargando(true)
    setError('')
    setRuta(null)
    try {
      const cuerpo: Record<string, unknown> = { radioKm, paradas, soloSinWeb }
      if (origen === 'aqui') Object.assign(cuerpo, await miUbicacion())
      else if (origen === 'zona') cuerpo.zona = zona
      else cuerpo.direccion = direccion

      const r = await fetch('/api/panel/ruta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cuerpo),
      })
      const d = await r.json()
      if (!r.ok) throw new Error(d.error || 'No se pudo calcular')
      setRuta(d)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo calcular')
    } finally {
      setCargando(false)
    }
  }

  const input =
    'w-full px-3.5 py-2.5 rounded-xl border border-border bg-white text-[13.5px] text-ink placeholder:text-muted focus:border-accent outline-none'

  return (
    <div className="card mb-6 overflow-hidden">
      <button onClick={() => setAbierto(!abierto)} className="w-full flex items-center justify-between gap-4 p-5 text-left">
        <div>
          <h2 className="text-[15px] font-semibold text-ink">Ruta de visitas</h2>
          <p className="text-[12.5px] text-dim mt-0.5">
            El recorrido más corto para ir a puerta fría por la zona donde estés
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
          <form onSubmit={calcular} className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {[
                { k: 'aqui', label: 'Desde donde estoy' },
                { k: 'zona', label: 'Desde una zona' },
                { k: 'direccion', label: 'Desde una calle' },
              ].map((o) => (
                <button
                  key={o.k} type="button" onClick={() => setOrigen(o.k as typeof origen)}
                  className={`px-3.5 py-2 rounded-full text-[12.5px] font-medium border transition-all ${
                    origen === o.k ? 'bg-ink text-white border-ink' : 'border-border text-dim hover:text-ink hover:border-ink/30'
                  }`}
                >
                  {o.label}
                </button>
              ))}
            </div>

            {origen === 'zona' && (
              <select value={zona} onChange={(e) => setZona(e.target.value)} className={input}>
                {zonas.map((z) => <option key={z.k} value={z.k}>{z.label}</option>)}
              </select>
            )}
            {origen === 'direccion' && (
              <input
                value={direccion} onChange={(e) => setDireccion(e.target.value)} required
                placeholder="Ej: Ruzafa, o Av. del Puerto 40"
                className={input}
              />
            )}

            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-[12px] font-medium text-dim mb-2">
                  Radio · <span className="text-ink font-semibold">{radioKm} km</span>
                </label>
                <input type="range" min={0.3} max={10} step={0.1} value={radioKm}
                  onChange={(e) => setRadioKm(Number(e.target.value))} className="w-full accent-accent" />
              </div>
              <div>
                <label className="block text-[12px] font-medium text-dim mb-2">
                  Paradas · <span className="text-ink font-semibold">{paradas}</span>
                </label>
                <input type="range" min={3} max={25} step={1} value={paradas}
                  onChange={(e) => setParadas(Number(e.target.value))} className="w-full accent-accent" />
              </div>
            </div>

            <label className="flex items-center gap-2.5 text-[13px] text-dim">
              <input type="checkbox" checked={soloSinWeb} onChange={(e) => setSoloSinWeb(e.target.checked)} />
              Solo negocios sin web (los mejores para vender una)
            </label>

            <button disabled={cargando} className="btn-accent rounded-full px-5 py-2.5 text-[13px] disabled:opacity-60">
              {cargando ? 'Calculando…' : 'Calcular ruta'}
            </button>
          </form>

          {error && <p className="text-[13px] text-red-500">{error}</p>}
          {ruta?.aviso && <p className="text-[13px] text-amber-600">{ruta.aviso}</p>}

          {ruta && ruta.paradas.length > 0 && (
            <div className="space-y-3 pt-1 border-t border-border">
              <div className="flex flex-wrap items-center justify-between gap-3 pt-4">
                <p className="text-[13px] text-dim">
                  <span className="text-ink font-semibold">{ruta.paradas.length} paradas</span> desde {ruta.desde}
                  {ruta.kmTotales != null && <> · {ruta.kmTotales} km andando</>}
                  {ruta.total > ruta.paradas.length && <> · {ruta.total} disponibles en la zona</>}
                </p>
                {ruta.maps && (
                  <a href={ruta.maps} target="_blank" rel="noopener noreferrer" className="btn-primary rounded-full text-[13px]">
                    Abrir en Google Maps
                  </a>
                )}
              </div>

              <ol className="space-y-2">
                {ruta.paradas.map((p, i) => (
                  <li key={p.id} className="bg-surface/60 border border-border rounded-xl p-4 flex flex-wrap items-start gap-3">
                    <span className="w-7 h-7 shrink-0 rounded-full bg-ink text-white text-[12px] font-bold flex items-center justify-center">
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[14.5px] font-semibold text-ink truncate">{p.name}</span>
                        {p.tier && <span className="text-[10px] font-bold text-accent bg-accent-light rounded px-1.5 py-0.5">{p.tier}</span>}
                        <span className="text-[11.5px] text-muted shrink-0">{p.km} km</span>
                      </div>
                      {p.address && <div className="text-[12.5px] text-dim mt-0.5 truncate">{p.address}</div>}
                      {p.hook && <div className="text-[12.5px] text-accent mt-1">{p.hook}</div>}
                    </div>
                    <div className="flex gap-2">
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lon}`}
                        target="_blank" rel="noopener noreferrer"
                        className="btn-secondary text-[12px] px-3.5 py-2 rounded-full"
                      >
                        Ir
                      </a>
                      {p.phone && (
                        <a href={`tel:+${p.phone}`} className="btn-accent text-[12px] px-3.5 py-2 rounded-full">
                          Llamar
                        </a>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
