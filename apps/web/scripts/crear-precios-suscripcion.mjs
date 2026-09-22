// Crea en Stripe los productos del modelo de suscripción (18/09/2026): packs, webs y upgrade Cinematográfica.
// Cada uno con precio mensual y precio anual por adelantado (= 10 cuotas, 2 meses gratis).
// Uso: node --env-file=.env.local scripts/crear-precios-suscripcion.mjs [--dry] [--archivar]
//   --archivar: además, archiva en Stripe los productos del modelo antiguo (pagos únicos, mantenimientos, Instagram)
//              para que no se puedan cobrar por error. Los precios antiguos quedan inactivos; el historial se conserva.
// Solo imprime los ids; los precios son inmutables en Stripe, así que se ejecuta UNA vez.
import Stripe from 'stripe'
import { writeFileSync, readFileSync, existsSync } from 'node:fs'

const SALIDA = new URL('../src/lib/stripe-ids.json', import.meta.url)

const key = process.env.STRIPE_SECRET_KEY || ''
if (!key) { console.error('Falta STRIPE_SECRET_KEY'); process.exit(1) }
console.log('Modo de la clave:', key.startsWith('sk_live') || key.startsWith('rk_live') ? 'LIVE (real)' : 'test')
const dry = process.argv.includes('--dry')
const stripe = new Stripe(key, { apiVersion: '2024-06-20' })

const PRODUCTOS = [
  { clave: 'PACK_ESTANDAR',   nombre: 'Pack Estándar',           mes: 199, desc: 'Web Arranque + SEO local mensual + Reseñas 5★. 12 meses de permanencia.' },
  { clave: 'PACK_PRO', nombre: 'Pack Pro',         mes: 349, desc: 'Web Premium + SEO local + Reseñas + Asistente de IA en WhatsApp 24/7. 12 meses.' },
  { clave: 'PACK_MAX',        nombre: 'Pack Max',                mes: 499, desc: 'Pack Pro + campañas de Meta y Google Ads gestionadas (inversión aparte). 12 meses.' },
  { clave: 'WEB_ARRANQUE',     nombre: 'Web Arranque',             mes: 99,  desc: 'Web profesional a medida con hosting, cambios y soporte. 12 meses de permanencia.' },
  { clave: 'WEB_PREMIUM',      nombre: 'Web Premium',              mes: 149, desc: 'Web con animaciones, copy profesional y reseñas integradas. 12 meses.' },
  { clave: 'WEB_CINE',         nombre: 'Web Cinematográfica',      mes: 249, desc: 'Web con scroll cinematográfico y dirección de arte. 12 meses.' },
  { clave: 'CINE_UPGRADE',     nombre: 'Upgrade Cinematográfica',  mes: 100, desc: 'Sustituye la web del pack por la Cinematográfica.' },
  { clave: 'AEO',              nombre: 'Que la IA te recomiende',  mes: 99,  desc: 'Visibilidad en ChatGPT, Perplexity y Google AI: Bing Places, datos estructurados, directorios e informe mensual. Sin permanencia.', soloMes: true },
  // Startups y negocios digitales (20/09/2026)
  { clave: 'PACK_LAUNCH',      nombre: 'Pack Launch',              mes: 399, desc: 'Landing que convierte + analítica y píxeles + prueba social + una iteración semanal. 12 meses, 0 € de entrada.' },
  { clave: 'PACK_GROWTH',      nombre: 'Pack Growth',              mes: 699, desc: 'Pack Launch + asistente que cualifica leads en web y WhatsApp y agenda demos. 12 meses, 0 € de entrada.' },
  { clave: 'PACK_SCALE',       nombre: 'Pack Scale',               mes: 999, desc: 'Pack Growth + campañas en Meta, Google y LinkedIn gestionadas (inversión aparte) con informe semanal. 12 meses, 0 € de entrada.' },
  // Servicios sueltos, sin permanencia (solo cuota mensual)
  { clave: 'ASISTENTE_IA',     nombre: 'Asistente de IA en WhatsApp', mes: 149, desc: 'Responde tu WhatsApp 24/7 con tus precios y horarios, deja la cita en tu Google Calendar y te avisa cuando hace falta una persona. Sin permanencia.', soloMes: true },
  { clave: 'WEB_CUIDADO',      nombre: 'Cuidamos tu web',          mes: 79,  desc: 'Mantenimiento de una web existente: cambios ilimitados en 3 días, velocidad, copias, correcciones técnicas y cookies. Sin permanencia.', soloMes: true },
  { clave: 'SEO_LOCAL',        nombre: 'SEO local',                mes: 99,  desc: 'Ficha de Google trabajada cada mes, palabras clave y contenido para salir en tu zona. Sin permanencia.', soloMes: true },
  { clave: 'RESENAS',          nombre: 'Reseñas 5★ en Google',      mes: 79,  desc: 'Sistema para pedir reseñas a cada cliente contento, automatizado, y respuesta a todas. Sin permanencia.', soloMes: true },
  { clave: 'ADS',              nombre: 'Campañas Meta y Google Ads', mes: 199, desc: 'Creamos y optimizamos tus anuncios cada mes con informe. La inversión publicitaria va aparte. Sin permanencia.', soloMes: true },
  { clave: 'CAPTACION',        nombre: 'Captación de clientes',     mes: 249, desc: '40 negocios cualificados al mes de tu zona: teléfono verificado, ficha y motivo. Sin permanencia.', soloMes: true },
  { clave: 'CAPTACION_PRO',    nombre: 'Captación Pro',             mes: 449, desc: '100 negocios cualificados al mes con seguimiento en el panel. Sin permanencia.', soloMes: true },
]

const out = existsSync(SALIDA) ? JSON.parse(readFileSync(SALIDA, 'utf8')) : {}
for (const p of PRODUCTOS) {
  if (dry) { console.log('[dry]', p.clave, p.mes, '€/mes ·', p.soloMes ? 'solo mensual' : p.mes * 10 + ' €/año'); continue }
  if (out[p.clave]?.mes) { console.log(p.clave, 'ya existe →', out[p.clave].mes); continue }
  const prod = await stripe.products.create({ name: p.nombre, description: p.desc, metadata: { clave: p.clave } })
  const mes = await stripe.prices.create({ product: prod.id, currency: 'eur', unit_amount: p.mes * 100, recurring: { interval: 'month' }, metadata: { clave: p.clave, periodo: 'mes' } })
  const anio = p.soloMes ? null : await stripe.prices.create({ product: prod.id, currency: 'eur', unit_amount: p.mes * 10 * 100, recurring: { interval: 'year' }, metadata: { clave: p.clave, periodo: 'anio' } })
  out[p.clave] = { product: prod.id, mes: mes.id, ...(anio ? { anio: anio.id } : {}) }
  console.log(p.clave, '→', prod.id, '| mes', mes.id, anio ? '| año ' + anio.id : '| solo mensual')
}
if (!dry) console.log('\nJSON:\n' + JSON.stringify(out, null, 2))
