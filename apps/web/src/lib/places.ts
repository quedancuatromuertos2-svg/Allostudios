// Búsqueda de un negocio en Google Places (New) para el generador de demos público.
// Devuelve datos REALES: reseñas, valoración, dirección, teléfono, fotos, horario → así la
// demo se siente "mi negocio" y no una plantilla vacía. Necesita GOOGLE_PLACES_KEY.
const KEY = process.env.GOOGLE_PLACES_KEY || ''
const SEARCH = 'https://places.googleapis.com/v1/places:searchText'
const DETAILS = 'https://places.googleapis.com/v1/places'

// Campos sin prefijo (para /places/{id}); la búsqueda los pide con "places." delante.
const FIELDS = [
  'id',
  'displayName',
  'nationalPhoneNumber',
  'internationalPhoneNumber',
  'websiteUri',
  'businessStatus',
  'rating',
  'userRatingCount',
  'location',
  'formattedAddress',
  'photos',
  'reviews',
  'regularOpeningHours.weekdayDescriptions',
  'editorialSummary',
  'primaryTypeDisplayName',
  'googleMapsUri',
]

const SEARCH_MASK = FIELDS.map((f) => `places.${f}`).join(',')
const DETAILS_MASK = FIELDS.join(',')

export type PlaceReview = { author: string; rating: number; text: string; when: string }

export type PlaceData = {
  found: boolean
  placeId: string
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
  photos: string[]
  hours: string[]
  summary: string
  type: string
  mapsUri: string
  topReviews: PlaceReview[]
}

export const EMPTY_PLACE = (name: string): PlaceData => ({
  found: false, placeId: '', name, rating: null, reviews: 0, address: '', phone: '', website: '',
  lat: null, lon: null, open: true, photoName: null, photos: [], hours: [], summary: '', type: '',
  mapsUri: '', topReviews: [],
})

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

// Una reseña de 4★ puede traer un texto de queja ("su actitud deja bastante que desear").
// Como la demo es material de venta, se descarta cualquier texto con tufo a queja.
const QUEJAS = [
  'estafa', 'timo', 'engañ', 'nefast', 'penoso', 'asco', 'sucio', 'sucia', 'maleducad',
  'grosero', 'borde', 'horrible', 'fatal', 'malísim', 'malisim', 'pésim', 'pesim',
  'decepcion', 'vergüenza', 'verguenza', 'lamentable', 'no vuelvo', 'nunca más', 'nunca mas',
  'no recomiendo', 'deja bastante que desear', 'dejar que desear', 'lo peor', 'la peor',
  'tardaron', 'esperamos mucho', 'mala experiencia', 'no lo recomiendo', 'huir', 'cuidado con',
]

function suenaMal(text: string) {
  const t = text.toLowerCase()
  return QUEJAS.some((q) => t.includes(q))
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
    .filter((r) => r.rating >= 4 && r.text.length > 15 && !suenaMal(r.text))
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 3)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapPlace(p: any, fallbackName: string): PlaceData {
  // El hero y la foto grande de la galería se recortan fatal con fotos verticales,
  // así que las apaisadas van primero.
  type GPhoto = { name?: string; widthPx?: number; heightPx?: number }
  const conNombre: GPhoto[] = (p.photos || []).filter((f: GPhoto) => Boolean(f?.name))
  const apaisada = (f: GPhoto) => (f.widthPx || 0) >= (f.heightPx || 0) * 1.15
  const photos: string[] = [...conNombre.filter(apaisada), ...conNombre.filter((f) => !apaisada(f))]
    .map((f) => f.name as string)
    .slice(0, 6)
  return {
    found: true,
    placeId: p.id || '',
    name: p.displayName?.text || fallbackName,
    rating: typeof p.rating === 'number' ? p.rating : null,
    reviews: p.userRatingCount || 0,
    address: p.formattedAddress || '',
    phone: normPhone(p.nationalPhoneNumber || p.internationalPhoneNumber),
    website: p.websiteUri || '',
    lat: p.location?.latitude ?? null,
    lon: p.location?.longitude ?? null,
    open: !p.businessStatus || p.businessStatus === 'OPERATIONAL',
    photoName: photos[0] || null,
    photos,
    hours: p.regularOpeningHours?.weekdayDescriptions || [],
    summary: cutText(String(p.editorialSummary?.text || ''), 180),
    type: p.primaryTypeDisplayName?.text || '',
    mapsUri: p.googleMapsUri || '',
    topReviews: mapReviews(p.reviews),
  }
}

export async function lookupBusiness(negocio: string, ciudad: string): Promise<PlaceData | null> {
  if (!KEY || !negocio) return null
  const textQuery = `${negocio}, ${ciudad || 'Valencia'}, España`
  try {
    const res = await fetch(SEARCH, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Goog-Api-Key': KEY, 'X-Goog-FieldMask': SEARCH_MASK },
      body: JSON.stringify({ textQuery, languageCode: 'es', regionCode: 'ES', pageSize: 1 }),
      cache: 'no-store',
    })
    if (!res.ok) return null
    const data = await res.json()
    const p = (data.places || [])[0]
    if (!p) return EMPTY_PLACE(negocio)
    return mapPlace(p, negocio)
  } catch {
    return null
  }
}

// Datos frescos al pintar la demo. Guardamos solo el placeId (27 caracteres) porque el
// nombre de cada foto de Google ocupa ~476 y no cabe en la URL del plan B sin base de datos.
// Se cachea 1 h para no pagar una llamada a Places por cada visita al enlace compartido.
export async function getPlaceDetails(placeId: string): Promise<PlaceData | null> {
  if (!KEY || !placeId) return null
  try {
    const res = await fetch(`${DETAILS}/${encodeURIComponent(placeId)}?languageCode=es&regionCode=ES`, {
      headers: { 'X-Goog-Api-Key': KEY, 'X-Goog-FieldMask': DETAILS_MASK },
      next: { revalidate: 3600 },
    })
    if (!res.ok) return null
    return mapPlace(await res.json(), '')
  } catch {
    return null
  }
}
