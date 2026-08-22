import { createHmac, timingSafeEqual } from 'crypto'
import { deflateSync, inflateSync } from 'zlib'

// Plan B del generador de demos: si la tabla `demo_leads` de Supabase no existe
// (o la base de datos falla), la demo viaja firmada dentro de la propia URL en vez
// de guardarse. Así el visitante SIEMPRE ve su web — el lead se sigue avisando por
// email/WhatsApp desde /api/genera-demo.
//
// Formato del token: "d0.<payload deflate+base64url>.<firma HMAC recortada>"
// La firma evita que nadie fabrique una página con texto inventado en nuestro dominio.
//
// Dentro solo van 4 datos cortos: los de Google se piden al pintar la página con el
// placeId, porque el nombre de UNA sola foto de Places ocupa ~476 caracteres.

export type DemoPayload = {
  n: string // negocio
  c: string // ciudad
  s: string // sector
  i?: string // placeId de Google (27 caracteres)
  r?: number // valoración, por si Places falla al pintar
  v?: number // nº de reseñas
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
