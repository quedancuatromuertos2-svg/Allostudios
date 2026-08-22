// Búsqueda de un negocio en Google Places (New) para el generador de demos público.
// Devuelve datos REALES: reseñas, valoración, dirección, teléfono, foto → así la
// demo se siente "mi negocio" y no una plantilla vacía. Necesita GOOGLE_PLACES_KEY.
const KEY = process.env.GOOGLE_PLACES_KEY || ''
const ENDPOINT = 'https://places.googleapis.com/v1/places:searchText'

const FIELDS = [
  'places.id',
  'places.displayName',
  'places.nationalPhoneNumber',
  'places.internationalPhoneNumber',
  'places.websiteUri',
  'places.businessStatus',
  'places.rating',
  'places.userRatingCount',
  'places.location',
  'places.formattedAddress',
  'places.photos',
  'places.reviews',
].join(',')

export type PlaceReview = { author: string; rating: number; text: string; when: string }

export type PlaceData = {
  found: boolean
  name: string
  rating: number | null
  reviews: number
  address: string
  phone: string
  website: string
  lat: number | null
  lon: number | null
  open: boolean
  photoName: string | null
  topReviews: PlaceReview[]
}

function normPhone(raw?: string): string {
  if (!raw) return ''
  let d = String(raw).replace(/[^\d]/g, '')
  if (d.startsWith('0034')) d = d.slice(4)
  if (d.length === 9 && /^[6789]/.test(d)) d = '34' + d
  return d
}

// Corta por la última palabra entera para que no queden frases a medias.
export function cutText(raw: string, max: number): string {
  const t = raw.trim()
  if (t.length <= max) return t
  const cut = t.slice(0, max)
  const sp = cut.lastIndexOf(' ')
  return `${(sp > max * 0.6 ? cut.slice(0, sp) : cut).replace(/[,;:.\s]+$/, '')}…`
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapReviews(reviews: any[]): PlaceReview[] {
  return (reviews || [])
    .map((r) => ({
      author: r?.authorAttribution?.displayName || 'Cliente',
      rating: Number(r?.rating) || 5,
      text: cutText(String(r?.text?.text || r?.originalText?.text || ''), 240),
      when: r?.relativePublishTimeDescription || '',
    }))
    // La demo es material de VENTA: solo reseñas buenas. Google devuelve también las
    // malas y enseñarle a un negocio su reseña de 1★ en su propia web mata el trato.
    .filter((r) => r.rating >= 4 && r.text.length > 15)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 3)
}

export async function lookupBusiness(negocio: string, ciudad: string): Promise<PlaceData | null> {
  if (!KEY || !negocio) return null
  const textQuery = `${negocio}, ${ciudad || 'Valencia'}, España`
  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Goog-Api-Key': KEY, 'X-Goog-FieldMask': FIELDS },
      body: JSON.stringify({ textQuery, languageCode: 'es', regionCode: 'ES', pageSize: 1 }),
      cache: 'no-store',
    })
    if (!res.ok) return null
    const data = await res.json()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const p: any = (data.places || [])[0]
    if (!p) {
      return { found: false, name: negocio, rating: null, reviews: 0, address: '', phone: '', website: '', lat: null, lon: null, open: true, photoName: null, topReviews: [] }
    }
    return {
      found: true,
      name: p.displayName?.text || negocio,
      rating: typeof p.rating === 'number' ? p.rating : null,
      reviews: p.userRatingCount || 0,
      address: p.formattedAddress || '',
      phone: normPhone(p.nationalPhoneNumber || p.internationalPhoneNumber),
      website: p.websiteUri || '',
      lat: p.location?.latitude ?? null,
      lon: p.location?.longitude ?? null,
      open: !p.businessStatus || p.businessStatus === 'OPERATIONAL',
      photoName: p.photos?.[0]?.name || null,
      topReviews: mapReviews(p.reviews),
    }
  } catch {
    return null
  }
}
