import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { getPanelContext } from '@/lib/panel'
import { cfg, places } from '@/lib/captador/motor'

export const runtime = 'nodejs'
export const maxDuration = 60

// Ruta de visitas a puerta fría: coge los leads que tienes cerca del punto que
// elijas y los ordena por cercanía real, para hacer el recorrido más corto.

type Parada = {
  id: string
  name: string
  address: string | null
  phone: string | null
  website: string | null
  hook: string | null
  problems: string[] | null
  sector_label: string | null
  tier: string | null
  score: number | null
  lat: number
  lon: number
  km: number
  status: string
}

// Distancia real entre dos puntos, en km.
function km(aLat: number, aLon: number, bLat: number, bLon: number) {
  const R = 6371
  const rad = (d: number) => (d * Math.PI) / 180
  const dLat = rad(bLat - aLat)
  const dLon = rad(bLon - aLon)
  const s =
    Math.sin(dLat / 2) ** 2 + Math.cos(rad(aLat)) * Math.cos(rad(bLat)) * Math.sin(dLon / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(s))
}

export async function POST(req: NextRequest) {
  const ctx = await getPanelContext()
  const member = ctx?.member
  if (!member || !member.active) return NextResponse.json({ error: 'Sin acceso' }, { status: 403 })

  const body = await req.json().catch(() => ({}))
  const paradas = Math.min(Math.max(Number(body?.paradas) || 10, 3), 25)
  const radioKm = Math.min(Math.max(Number(body?.radioKm) || 2, 0.3), 25)
  const soloSinWeb = body?.soloSinWeb !== false

  // De dónde sales: tu ubicación, una zona del Captador o una dirección escrita.
  let lat = Number(body?.lat)
  let lon = Number(body?.lon)
  let desde = 'tu ubicación'

  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    const zona = String(body?.zona || '')
    const direccion = String(body?.direccion || '').trim()

    if (direccion) {
      const g = await places.geocode(direccion).catch(() => null)
      if (!g) return NextResponse.json({ error: `No encuentro "${direccion}"` }, { status: 400 })
      lat = g.lat; lon = g.lon; desde = g.label || direccion
    } else if (cfg.ZONES[zona]) {
      const b = cfg.ZONES[zona].bbox
      lat = (b.south + b.north) / 2
      lon = (b.west + b.east) / 2
      desde = cfg.ZONES[zona].label
    } else {
      return NextResponse.json({ error: 'Dime desde dónde sales' }, { status: 400 })
    }
  }

  // Candidatos: leads sin visitar, con coordenadas y dentro del radio.
  let q = supabaseAdmin
    .from('captador_leads')
    .select('id, name, address, phone, website, hook, problems, sector_label, tier, score, lat, lon, status')
    .eq('workspace', member.workspace)
    .in('status', ['nuevo', 'contactado'])
    .not('lat', 'is', null)
    .not('lon', 'is', null)
    .limit(3000)

  if (soloSinWeb) q = q.is('website', null)
  if (member.role !== 'admin') {
    q = q.or(`owner_clerk_id.eq.${member.clerk_id},owner_email.eq.${member.email}`)
  }

  const { data, error } = await q
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const cerca = (data || [])
    .map((l) => ({ ...l, km: km(lat, lon, l.lat as number, l.lon as number) }))
    .filter((l) => l.km <= radioKm)

  if (!cerca.length) {
    return NextResponse.json({
      ok: true, desde, paradas: [], total: 0,
      aviso: soloSinWeb
        ? `No hay negocios sin web a menos de ${radioKm} km. Prueba a ampliar el radio o quita el filtro.`
        : `No hay leads a menos de ${radioKm} km de ahí.`,
    })
  }

  // Vecino más cercano: arrancamos en tu posición y en cada paso vamos al más
  // próximo. Entre dos igual de cerca, gana el de mayor puntuación.
  const restantes = cerca.slice().sort((a, b) => (b.score || 0) - (a.score || 0))
  const ruta: Parada[] = []
  let curLat = lat
  let curLon = lon

  while (ruta.length < paradas && restantes.length) {
    let mejor = 0
    let mejorD = Infinity
    restantes.forEach((c, i) => {
      const d = km(curLat, curLon, c.lat as number, c.lon as number)
      if (d < mejorD - 0.02) { mejorD = d; mejor = i }
    })
    const sig = restantes.splice(mejor, 1)[0]
    ruta.push({ ...(sig as unknown as Parada), km: Math.round(mejorD * 100) / 100 })
    curLat = sig.lat as number
    curLon = sig.lon as number
  }

  const metros = ruta.reduce((t, p) => t + p.km, 0)

  // Enlace para navegar con Google Maps de tirón (destino + paradas intermedias).
  const puntos = ruta.map((p) => `${p.lat},${p.lon}`)
  const destino = puntos[puntos.length - 1]
  const intermedias = puntos.slice(0, -1).slice(0, 9).join('|')
  const maps =
    `https://www.google.com/maps/dir/?api=1&origin=${lat},${lon}&destination=${destino}` +
    (intermedias ? `&waypoints=${encodeURIComponent(intermedias)}` : '') +
    '&travelmode=walking'

  return NextResponse.json({
    ok: true,
    desde,
    total: cerca.length,
    kmTotales: Math.round(metros * 10) / 10,
    maps,
    paradas: ruta,
  })
}
