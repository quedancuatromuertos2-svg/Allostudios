/*  Catálogo de AlloStudios enlazado con Stripe (cuenta en modo REAL).

    Modelo de suscripción (decidido el 2026-09-18, a partir del análisis de BenorMedia):
    0 € de entrada, cuota mensual y 12 meses de permanencia en packs y webs. Los servicios
    sueltos son mensuales sin permanencia. Todo se puede pagar el año por adelantado
    (= 10 cuotas, dos meses gratis). Ya no hay pagos únicos ni "mantenimiento" aparte:
    la cuota de la web lo incluye.

    Los identificadores de precio NO son secretos: son públicos por diseño y van en el
    navegador cuando se abre el pago. La clave secreta vive solo en Vercel.

    Los ids de los productos nuevos los escribe `scripts/crear-precios-suscripcion.mjs`
    en `stripe-ids.json` (precios inmutables en Stripe: cambiar un importe = price nuevo).
    Los servicios sueltos conservan los ids creados el 2026-08-23.                        */

import ids from './stripe-ids.json'

export type Cobro = 'mes'
export type Tipo = 'pack' | 'web' | 'servicio' | 'extra'

export type Articulo = {
  clave: string
  nombre: string
  desc: string
  eur: number
  cobro: Cobro
  priceId: string
  tipo: Tipo
  /** Meses de permanencia (packs y webs). Sin valor = cancela cuando quieras. */
  permanencia?: number
  /** Año por adelantado: 10 cuotas. Solo packs, webs y el upgrade. */
  anual?: { eur: number; priceId: string }
  /** Lo que lleva dentro (packs) */
  incluye?: string[]
  /** Lo que costaría contratando cada pieza por separado (packs) */
  sumaSuelto?: number
  /** Desglose en números de lo que lleva el pack: [pieza, €/mes por separado] */
  desglose?: [string, number][]
  /** Extras que se pueden añadir a este artículo en el checkout */
  extras?: string[]
}

type Ids = Record<string, { product?: string; mes?: string; anio?: string }>
const ID = ids as Ids
const mes = (clave: string) => ID[clave]?.mes || `PENDIENTE_${clave}_MES`
const anio = (clave: string, eurMes: number) => ({ eur: eurMes * 10, priceId: ID[clave]?.anio || `PENDIENTE_${clave}_ANIO` })

/* Piezas que forman los packs (para el desglose "por separado") */
const P = { WEB_ARRANQUE: 99, WEB_PREMIUM: 149, WEB_CINE: 249, SEO: 99, RESENAS: 79, ASISTENTE: 39, ADS: 199, AEO: 99 }

export const CATALOGO: Articulo[] = [
  /* ── Packs (la escalera visible en la web) ── */
  {
    clave: 'PACK_ESTANDAR', nombre: 'Pack Estándar', eur: 199, cobro: 'mes', tipo: 'pack', permanencia: 12,
    desc: 'Que te encuentren: web profesional, posicionamiento en Google y reseñas que llegan solas.',
    priceId: mes('PACK_ESTANDAR'), anual: anio('PACK_ESTANDAR', 199),
    incluye: ['Web Arranque con hosting, cambios y soporte', 'SEO local cada mes', 'Reseñas 5★ automatizadas'],
    sumaSuelto: P.WEB_ARRANQUE + P.SEO + P.RESENAS, extras: ['CINE_UPGRADE', 'AEO'],
    desglose: [['Web Arranque (hosting, cambios y soporte)', P.WEB_ARRANQUE], ['SEO local mensual', P.SEO], ['Reseñas 5★ automatizadas', P.RESENAS]],
  },
  {
    clave: 'PACK_PRO', nombre: 'Pack Pro', eur: 349, cobro: 'mes', tipo: 'pack', permanencia: 12,
    desc: 'Que te encuentren y te respondan: web premium, Google y un asistente de IA que atiende tu WhatsApp 24/7.',
    priceId: mes('PACK_PRO'), anual: anio('PACK_PRO', 349),
    incluye: ['Web Premium: animaciones, copy y tus reseñas integradas', 'SEO local cada mes', 'Reseñas 5★ automatizadas', 'Asistente de IA en WhatsApp 24/7'],
    sumaSuelto: P.WEB_PREMIUM + P.SEO + P.RESENAS + P.ASISTENTE, extras: ['CINE_UPGRADE', 'AEO'],
    desglose: [['Web Premium (hosting, cambios y soporte)', P.WEB_PREMIUM], ['SEO local mensual', P.SEO], ['Reseñas 5★ automatizadas', P.RESENAS], ['Asistente de IA en WhatsApp 24/7', P.ASISTENTE]],
  },
  {
    clave: 'PACK_MAX', nombre: 'Pack Max', eur: 499, cobro: 'mes', tipo: 'pack', permanencia: 12,
    desc: 'Que te lleguen clientes: todo lo del Pro más campañas de Meta y Google Ads gestionadas cada mes.',
    priceId: mes('PACK_MAX'), anual: anio('PACK_MAX', 499),
    incluye: ['Todo lo del Pack Pro', 'Campañas de Meta y Google Ads gestionadas (inversión publicitaria aparte)'],
    sumaSuelto: P.WEB_PREMIUM + P.SEO + P.RESENAS + P.ASISTENTE + P.ADS, extras: ['CINE_UPGRADE', 'AEO'],
    desglose: [['Web Premium (hosting, cambios y soporte)', P.WEB_PREMIUM], ['SEO local mensual', P.SEO], ['Reseñas 5★ automatizadas', P.RESENAS], ['Asistente de IA en WhatsApp 24/7', P.ASISTENTE], ['Campañas Meta y Google Ads (gestión)', P.ADS]],
  },

  /* ── Webs solas (para quien de verdad solo quiere web) ── */
  {
    clave: 'WEB_ARRANQUE', nombre: 'Web Arranque', eur: P.WEB_ARRANQUE, cobro: 'mes', tipo: 'web', permanencia: 12,
    desc: 'Web profesional a medida, online en 7 días. Diseño único, móvil y SEO local. Hosting, cambios y soporte incluidos.',
    priceId: mes('WEB_ARRANQUE'), anual: anio('WEB_ARRANQUE', P.WEB_ARRANQUE),
  },
  {
    clave: 'WEB_PREMIUM', nombre: 'Web Premium', eur: P.WEB_PREMIUM, cobro: 'mes', tipo: 'web', permanencia: 12,
    desc: 'Web con animaciones avanzadas, copy profesional y tus reseñas de Google integradas. Todo incluido.',
    priceId: mes('WEB_PREMIUM'), anual: anio('WEB_PREMIUM', P.WEB_PREMIUM),
  },
  {
    clave: 'WEB_CINE', nombre: 'Web Cinematográfica', eur: P.WEB_CINE, cobro: 'mes', tipo: 'web', permanencia: 12,
    desc: 'Web con efecto de scroll cinematográfico y dirección de arte. La más impactante del catálogo.',
    priceId: mes('WEB_CINE'), anual: anio('WEB_CINE', P.WEB_CINE),
  },

  /* ── Extra: cambia la web del pack por la Cinematográfica ── */
  {
    clave: 'CINE_UPGRADE', nombre: 'Web Cinematográfica en tu pack', eur: 100, cobro: 'mes', tipo: 'extra',
    desc: 'Sustituye la web del pack por la Cinematográfica: scroll de cine y dirección de arte.',
    priceId: mes('CINE_UPGRADE'), anual: anio('CINE_UPGRADE', 100),
  },

  /* ── Servicios sueltos (sin permanencia) ── */
  {
    clave: 'ASISTENTE_IA', nombre: 'Asistente de IA en WhatsApp', eur: P.ASISTENTE, cobro: 'mes', tipo: 'servicio',
    desc: 'Responde el WhatsApp de tu negocio 24/7: horarios, precios, dudas y peticiones de cita. Te avisa cuando hace falta.',
    priceId: 'price_1U9rzSAtD7Uqmi3UNNQRyt3o',
  },
  {
    clave: 'SEO_LOCAL', nombre: 'SEO local', eur: P.SEO, cobro: 'mes', tipo: 'servicio',
    desc: 'Ficha de Google, palabras clave y trabajo mensual para que te encuentren en tu zona y sigas arriba.',
    priceId: 'price_1U9rzSAtD7Uqmi3UVn1WseUF',
  },
  {
    clave: 'AEO', nombre: 'Que la IA te recomiende', eur: P.AEO, cobro: 'mes', tipo: 'servicio',
    desc: 'Cuando alguien le pregunte a ChatGPT, Perplexity o Google por un negocio como el tuyo en tu zona, que salga el tuyo. Ficha en Bing, datos para la IA en tu web, directorios y un informe mensual con las preguntas reales.',
    priceId: mes('AEO'),
  },
  {
    clave: 'RESENAS', nombre: 'Reseñas 5★ en Google', eur: P.RESENAS, cobro: 'mes', tipo: 'servicio',
    desc: 'Sistema para pedir reseñas a tus clientes contentos, automatizado.',
    priceId: 'price_1U9rzTAtD7Uqmi3UfZZZarF5',
  },
  {
    clave: 'ADS', nombre: 'Campañas Meta y Google Ads', eur: P.ADS, cobro: 'mes', tipo: 'servicio',
    desc: 'Creamos y optimizamos tus anuncios cada mes. La inversión publicitaria va aparte.',
    priceId: 'price_1U9rzTAtD7Uqmi3U2R8rEgzk',
  },
  {
    clave: 'CAPTACION', nombre: 'Captación de clientes', eur: 249, cobro: 'mes', tipo: 'servicio',
    desc: '40 negocios cualificados al mes de tu zona: teléfono verificado, ficha y motivo por el que te necesitan.',
    priceId: 'price_1U9qZUAtD7Uqmi3UwN9rzTWx',
  },
  {
    clave: 'CAPTACION_PRO', nombre: 'Captación Pro', eur: 449, cobro: 'mes', tipo: 'servicio',
    desc: '100 negocios cualificados al mes con seguimiento en el panel.',
    priceId: 'price_1U9qZUAtD7Uqmi3UQbe0OC53',
  },
]

export const porClave = (clave: string) => CATALOGO.find((a) => a.clave === clave)
export const PACKS = CATALOGO.filter((a) => a.tipo === 'pack')
export const WEBS = CATALOGO.filter((a) => a.tipo === 'web')
export const SERVICIOS = CATALOGO.filter((a) => a.tipo === 'servicio')
/** true mientras el precio no exista todavía en Stripe (falta ejecutar el script) */
export const sinStripe = (priceId: string) => priceId.startsWith('PENDIENTE_')

// Luz de la marca que acompaña a cada producto (imágenes en public/marca/luces/<luz>.jpg, generadas en MARCA-ALLOSTUDIOS/fondos)
export const LUZ_PRODUCTO: Record<string, string> = {
  PACK_ESTANDAR: 'faro', PACK_PRO: 'haz', PACK_MAX: 'prisma',
  WEB_ARRANQUE: 'velo', WEB_PREMIUM: 'aura', WEB_CINE: 'eclipse', CINE_UPGRADE: 'espectro',
  CAPTACION: 'cometa', CAPTACION_PRO: 'doble',
  ASISTENTE_IA: 'orbe', SEO_LOCAL: 'marea', RESENAS: 'latido', ADS: 'llama', AEO: 'espectro',
}
export const luzDe = (clave: string) => LUZ_PRODUCTO[clave] || 'faro'

export const eur = (n: number) =>
  n.toLocaleString('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })
