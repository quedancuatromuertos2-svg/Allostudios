import { createHmac, timingSafeEqual } from 'crypto'
import { deflateSync, inflateSync } from 'zlib'
import { cutText, type PlaceData } from './places'

// Plan B del generador de demos: si la tabla `demo_leads` de Supabase no existe
// (o la base de datos falla), la demo viaja firmada dentro de la propia URL en vez
// de guardarse. Así el visitante SIEMPRE ve su web — el lead se sigue avisando por
// email/WhatsApp desde /api/genera-demo.
//
// Formato del token: "d0.<payload deflate+base64url>.<firma HMAC recortada>"
// La firma evita que nadie fabrique una página con texto inventado en nuestro dominio.

export type DemoPayload = {
  n: string // negocio
  c: string // ciudad
  s: string // sector
  p: PlaceData | null // datos de Google Places
}

const PREFIX = 'd0'

function secret() {
  return (
    process.env.DEMO_TOKEN_SECRET ||
    process.env.CLERK_SECRET_KEY ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    'allostudios-demo-fallback'
  )
}

function sign(body: string) {
  return createHmac('sha256', secret()).update(body).digest('base64url').slice(0, 16)
}

export function isDemoToken(id: string) {
  return id.startsWith(`${PREFIX}.`)
}

export function encodeDemo(payload: DemoPayload): string {
  const body = deflateSync(Buffer.from(JSON.stringify(payload), 'utf8'), { level: 9 }).toString('base64url')
  return `${PREFIX}.${body}.${sign(body)}`
}

export function decodeDemo(token: string): DemoPayload | null {
  const parts = token.split('.')
  if (parts.length !== 3 || parts[0] !== PREFIX) return null
  const [, body, given] = parts
  try {
    const expected = sign(body)
    const a = Buffer.from(given)
    const b = Buffer.from(expected)
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null
    const json = inflateSync(Buffer.from(body, 'base64url')).toString('utf8')
    const payload = JSON.parse(json) as DemoPayload
    return typeof payload?.n === 'string' ? payload : null
  } catch {
    return null
  }
}

// Recorta los datos de Places a lo que la demo pinta, para que la URL no se dispare.
export function slimPlace(place: PlaceData | null): PlaceData | null {
  if (!place) return null
  return {
    ...place,
    topReviews: (place.topReviews || []).slice(0, 3).map((r) => ({
      ...r,
      text: cutText(r.text, 200),
    })),
  }
}
