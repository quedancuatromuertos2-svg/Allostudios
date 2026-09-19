import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { supabaseAdmin } from '@/lib/supabase'
import { getPlaceDetails, type PlaceData } from '@/lib/places'
import { decodeDemo, isDemoToken } from '@/lib/demo-token'
import LuzFondo from '@/components/LuzFondo'
import LuzPapel from '@/components/LuzPapel'
import { adnDe, type ADN } from '@/lib/adn'

// Niveles de la demo = las tres tarifas de web. Cada nivel suma sobre el anterior, sin quitar nada.
export type Nivel = 'arranque' | 'premium' | 'cine'
const NIVELES: { k: Nivel; n: string; p: string; d: string }[] = [
  { k: 'arranque', n: 'Arranque', p: '99 €/mes', d: 'Web completa con tus datos reales' },
  { k: 'premium', n: 'Pro', p: '149 €/mes', d: 'Luz de fondo, cristal y animaciones' },
  { k: 'cine', n: 'Cinematográfica', p: '249 €/mes', d: 'Cabecera de cristal en vivo y dirección de arte' },
]
function nivelDe(v: unknown): Nivel { return v === 'premium' || v === 'cine' ? v : 'arranque' }

export const dynamic = 'force-dynamic'

type DemoBase = {
  negocio: string
  ciudad: string | null
  sector: string | null
  place: PlaceData | null
  placeId: string
  rating: number | null
  reviews: number
}

async function getBase(id: string): Promise<DemoBase | null> {
  // Plan B: la demo viene firmada dentro de la propia URL (sin base de datos)
  if (isDemoToken(id)) {
    const p = decodeDemo(id)
    if (!p) return null
    return {
      negocio: p.n, ciudad: p.c || null, sector: p.s || null, place: null,
      placeId: p.i || '', rating: p.r ?? null, reviews: p.v || 0,
    }
  }

  if (!/^[0-9a-fA-F-]{20,}$/.test(id)) return null
  try {
    const { data, error } = await supabaseAdmin
      .from('demo_leads')
      .select('negocio, ciudad, sector, place')
      .eq('id', id)
      .single()
    if (error || !data) return null
    const place = (data.place || null) as PlaceData | null
    return {
      negocio: data.negocio, ciudad: data.ciudad, sector: data.sector, place,
      placeId: place?.placeId || '', rating: place?.rating ?? null, reviews: place?.reviews || 0,
    }
  } catch {
    return null
  }
}

// Los datos pesados de Google (fotos, horario, reseñas) se piden aquí y no se guardan:
// el nombre de una sola foto ocupa ~476 caracteres y no cabe en la URL del plan B.
async function getDemo(id: string) {
  const base = await getBase(id)
  if (!base) return null
  let place = base.place
  if (base.placeId) {
    const fresh = await getPlaceDetails(base.placeId)
    if (fresh) place = { ...fresh, name: fresh.name || place?.name || base.negocio }
  }
  return { ...base, place }
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const base = await getBase(params.id)
  const name = base?.place?.name || base?.negocio || 'Tu negocio'
  return { title: `Web de ${name} — demo`, robots: { index: false, follow: false } }
}

/* ─────────── Contenido por sector ─────────── */

type Service = { t: string; d: string; k: IconKey }
type IconKey = 'calendar' | 'gallery' | 'team' | 'menu' | 'delivery' | 'clock' | 'shield' | 'car' | 'dumbbell' | 'heart' | 'tag' | 'info' | 'phone'

const ICONS: Record<IconKey, string> = {
  calendar: 'M8 2v3M16 2v3M3.5 9h17M4 6.5h16a1 1 0 0 1 1 1V19a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7.5a1 1 0 0 1 1-1Z',
  gallery: 'M3 5.5h18v13H3zM3 15l4.5-4.5L12 15M14 12l2.5-2.5L21 14M16 8.5h.01',
  team: 'M16 19v-1.5a3.5 3.5 0 0 0-3.5-3.5h-5A3.5 3.5 0 0 0 4 17.5V19M10 10.5a3.25 3.25 0 1 0 0-6.5 3.25 3.25 0 0 0 0 6.5ZM20 19v-1.5a3.5 3.5 0 0 0-2.6-3.4M15.5 4.2a3.25 3.25 0 0 1 0 6.1',
  menu: 'M4 4h16v4H4zM4 12h10M4 16h13M4 20h7',
  delivery: 'M3 7h11v9H3zM14 10h3.5l2.5 3v3h-6M6.5 19a1.75 1.75 0 1 0 0-3.5 1.75 1.75 0 0 0 0 3.5ZM17.5 19a1.75 1.75 0 1 0 0-3.5 1.75 1.75 0 0 0 0 3.5Z',
  clock: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM12 7.5V12l3 2',
  shield: 'M12 3l7 3v5.5c0 4.2-2.9 7.6-7 9.5-4.1-1.9-7-5.3-7-9.5V6l7-3Z',
  car: 'M5 16.5h14M6.5 16.5V19H4.8v-2.5M19.2 16.5V19h-1.7v-2.5M4 12.5l1.7-4.4A2 2 0 0 1 7.6 6.8h8.8a2 2 0 0 1 1.9 1.3l1.7 4.4v4H4v-4ZM7 14h.01M17 14h.01',
  dumbbell: 'M6.5 8v8M4 10v4M17.5 8v8M20 10v4M8 12h8',
  heart: 'M12 20s-7-4.4-7-9.2A3.8 3.8 0 0 1 12 8a3.8 3.8 0 0 1 7 2.8C19 15.6 12 20 12 20Z',
  tag: 'M11 3.5H20v9l-8.5 8.5L3 12.5l8-9ZM16.5 8h.01',
  info: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM12 11v5M12 8h.01',
  phone: 'M6.8 4h3l1.4 3.6-2 1.4a11 11 0 0 0 5.8 5.8l1.4-2 3.6 1.4v3a1.6 1.6 0 0 1-1.8 1.6C11 18.2 5.8 13 5.2 5.8A1.6 1.6 0 0 1 6.8 4Z',
}

function sectorContent(sector: string | null): { tagline: string; services: Service[] } {
  const s = (sector || '').toLowerCase()
  if (s.includes('peluq') || s.includes('barb'))
    return { tagline: 'Tu imagen, en las mejores manos', services: [
      { t: 'Reserva online', d: 'Pide cita en 30 segundos, sin llamar ni esperar.', k: 'calendar' },
      { t: 'Nuestros trabajos', d: 'Galería de cortes, colores y estilismos.', k: 'gallery' },
      { t: 'Nuestro equipo', d: 'Profesionales con años de experiencia.', k: 'team' }] }
  if (s.includes('estét') || s.includes('spa') || s.includes('masaj'))
    return { tagline: 'Cuídate. Te lo mereces.', services: [
      { t: 'Tratamientos', d: 'Faciales, corporales y bienestar.', k: 'heart' },
      { t: 'Reserva online', d: 'Elige día y hora al instante.', k: 'calendar' },
      { t: 'Bonos y packs', d: 'Ahorra con nuestros bonos de sesiones.', k: 'tag' }] }
  if (s.includes('dental') || s.includes('clínic') || s.includes('fisio') || s.includes('veterin') || s.includes('óptic'))
    return { tagline: 'Tu salud, nuestra prioridad', services: [
      { t: 'Pide cita', d: 'Reserva online las 24 horas.', k: 'calendar' },
      { t: 'Tratamientos', d: 'Todo lo que necesitas, en un solo sitio.', k: 'shield' },
      { t: 'Primera visita', d: 'Valoración sin compromiso.', k: 'info' }] }
  if (s.includes('restaur') || s.includes('bar') || s.includes('cafet'))
    return { tagline: 'Sabor que se recuerda', services: [
      { t: 'Nuestra carta', d: 'Descubre todos nuestros platos.', k: 'menu' },
      { t: 'Reserva mesa', d: 'Asegura tu sitio en dos clics.', k: 'calendar' },
      { t: 'A domicilio', d: 'Pide y te lo llevamos a casa.', k: 'delivery' }] }
  if (s.includes('gimnas') || s.includes('entren'))
    return { tagline: 'Tu mejor versión empieza hoy', services: [
      { t: 'Clases y horarios', d: 'Todas nuestras actividades de la semana.', k: 'clock' },
      { t: 'Prueba gratis', d: 'Ven a entrenar sin compromiso.', k: 'dumbbell' },
      { t: 'Tarifas', d: 'Planes que se adaptan a ti.', k: 'tag' }] }
  if (s.includes('taller') || s.includes('mecán'))
    return { tagline: 'Tu coche, en buenas manos', services: [
      { t: 'Pide cita', d: 'Reserva tu revisión online.', k: 'calendar' },
      { t: 'Servicios', d: 'Mecánica, chapa, neumáticos y más.', k: 'car' },
      { t: 'Presupuesto', d: 'Sin sorpresas, todo claro desde el principio.', k: 'info' }] }
  if (s.includes('abogad') || s.includes('asesor') || s.includes('inmobil'))
    return { tagline: 'Asesoramiento claro, sin letra pequeña', services: [
      { t: 'Primera consulta', d: 'Cuéntanos tu caso sin compromiso.', k: 'calendar' },
      { t: 'Áreas de trabajo', d: 'En qué te podemos ayudar.', k: 'shield' },
      { t: 'Contacto directo', d: 'Hablas siempre con la misma persona.', k: 'phone' }] }
  return { tagline: 'Bienvenido a nuestra web', services: [
    { t: 'Servicios', d: 'Todo lo que ofrecemos.', k: 'shield' },
    { t: 'Contacto', d: 'Estamos aquí para ayudarte.', k: 'phone' },
    { t: 'Sobre nosotros', d: 'Conoce a nuestro equipo.', k: 'team' }] }
}

function Icon({ k, size = 22 }: { k: IconKey; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d={ICONS[k]} />
    </svg>
  )
}

// Día de hoy en Madrid, para resaltar el horario correcto
function todayIndex(hours: string[]): number {
  if (!hours.length) return -1
  try {
    const dia = new Intl.DateTimeFormat('es-ES', { weekday: 'long', timeZone: 'Europe/Madrid' }).format(new Date())
    return hours.findIndex((h) => h.toLowerCase().startsWith(dia.toLowerCase()))
  } catch {
    return -1
  }
}

/* ─────────── Página ─────────── */


/* ─────────── Cabecera Cinematográfica: un concepto por identidad ─────────── */
type HeroCineProps = { adn: ADN; name: string; intro: string; hero: string | null; galeria: string[]; rating: number | null; reviews: number; horaHoy: string; phone: string; telVisible: string; services: Service[]; ciudad: string; tipo: string }
function Palabras({ texto }: { texto: string }) {
  // cada palabra entra con su propio retardo (revelado)
  return <>{texto.split(' ').map((w, i) => <span key={i} className="dm-w" style={{ animationDelay: `${.15 + i * .09}s` }}>{w}&nbsp;</span>)}</>
}
function Cursiva({ texto }: { texto: string }) {
  // la última palabra en cursiva (aura)
  const p = texto.trim().split(' '); if (p.length < 2) return <>{texto}</>
  return <>{p.slice(0, -1).join(' ')} <em>{p[p.length - 1]}</em></>
}
function HeroCine({ adn, name, intro, hero, galeria, rating, reviews, horaHoy, phone, telVisible, services, ciudad, tipo }: HeroCineProps) {
  const c = adn.cine
  const img = hero ? <img src={hero} alt={name} className="dm-hero-img" /> : <div className="dm-hero-img dm-hero-grad" />
  const nota = rating ? <span className="dm-pill"><span className="dm-stars">{'★'.repeat(Math.round(rating))}</span><b>{rating.toFixed(1).replace('.', ',')}</b> · {reviews} reseñas</span> : null
  const ctas = (
    <div className="dm-cta-row">
      <a href="#contacto" className="dm-btn dm-btn-lg">Reservar / Contactar</a>
      {phone && <a href={`tel:+${phone}`} className="dm-btn dm-btn-ghost dm-btn-lg">Llamar {telVisible}</a>}
    </div>
  )
  const cinta = (
    <div className="dm-cinta" aria-hidden>
      <div className="dm-cinta-in">{[...services, ...services, ...services].map((sv, i) => <span key={i}>{sv.t}<i /></span>)}</div>
    </div>
  )
  if (c === 'revelado') return (
    <>
      <section className="dm-hero dm-cine-revelado">
        {img}<div className="dm-hero-veil" />
        <div className="dm-hero-in">
          <p className="dm-adn-eyebrow">{tipo} · {ciudad}</p>
          <h1 className="dm-h1"><Palabras texto={name} /></h1>
          <div className="dm-rev-fila">
            <p className="dm-sub">{intro}</p>
            <div>{nota}{horaHoy && <span className="dm-pill dm-pill-soft">Hoy · {horaHoy}</span>}</div>
          </div>
          {ctas}
        </div>
      </section>
      {cinta}
    </>
  )
  if (c === 'aura') return (
    <>
      <section className="dm-hero dm-cine-aura">
        <div className="dm-aura" aria-hidden />
        <div className="dm-hero-in">
          <p className="dm-adn-eyebrow">{tipo} · {ciudad}</p>
          <h1 className="dm-h1"><Cursiva texto={name} /></h1>
          <p className="dm-sub">{intro}</p>
          {ctas}
          <div className="dm-pills">{nota}{horaHoy && <span className="dm-pill dm-pill-soft">Hoy · {horaHoy}</span>}</div>
        </div>
        <div className="dm-flotantes" aria-hidden>
          {services.slice(0, 3).map((sv, i) => (
            <div key={sv.t} className={`dm-flot dm-flot-${i}`}>
              {galeria[i] ? <img src={galeria[i]} alt="" /> : <span className="dm-flot-ico"><Icon k={sv.k} size={26} /></span>}
              <b>{sv.t}</b>
            </div>
          ))}
        </div>
      </section>
      {cinta}
    </>
  )
  if (c === 'dividido') return (
    <section className="dm-hero dm-cine-dividido">
      <div className="dm-div-papel">
        <p className="dm-adn-eyebrow">{tipo} · {ciudad}</p>
        <h1 className="dm-h1">{name}</h1>
        <p className="dm-sub">{intro}</p>
        <div className="dm-cita">
          <div className="dm-cita-t">Pide tu cita</div>
          <div className="dm-cita-campos"><span>Nombre</span><span>Teléfono</span><span>Día que te viene bien</span></div>
          <a href="#contacto" className="dm-btn">Enviar solicitud</a>
          <small>Te confirmamos por WhatsApp en menos de una hora.</small>
        </div>
        <div className="dm-pills">{nota}{horaHoy && <span className="dm-pill dm-pill-soft">Hoy · {horaHoy}</span>}</div>
      </div>
      <div className="dm-div-foto">
        <div className="dm-marco">{img}</div>
        {galeria[0] && <div className="dm-marco dm-marco-2"><img src={galeria[0]} alt="" /></div>}
      </div>
    </section>
  )
  if (c === 'poster') return (
    <>
      <section className="dm-hero dm-cine-poster">
        <div className="dm-sello" aria-hidden>
          <svg viewBox="0 0 200 200"><defs><path id="dm-sello-c" d="M100,100 m-72,0 a72,72 0 1,1 144,0 a72,72 0 1,1 -144,0" /></defs><text><textPath href="#dm-sello-c">{`${tipo} · ${ciudad} · desde siempre · `}</textPath></text></svg>
        </div>
        <div className="dm-hero-in">
          <p className="dm-adn-eyebrow">{tipo} · {ciudad}</p>
          <h1 className="dm-h1">{name}</h1>
          <p className="dm-sub">{intro}</p>
          {ctas}
        </div>
        <div className="dm-ventana">{img}</div>
        <div className="dm-pills">{nota}{horaHoy && <span className="dm-pill dm-pill-soft">Hoy · {horaHoy}</span>}</div>
      </section>
      {cinta}
    </>
  )
  // velocidad
  return (
    <>
      <section className="dm-hero dm-cine-velocidad">
        {img}<div className="dm-hero-veil" /><div className="dm-diagonal" aria-hidden />
        <div className="dm-hero-in">
          <p className="dm-adn-eyebrow">{tipo} · {ciudad}</p>
          <h1 className="dm-h1 dm-h1-contorno" data-texto={name}>{name}</h1>
          <p className="dm-sub">{intro}</p>
          {ctas}
        </div>
        <div className="dm-contadores">
          {rating && <div><b>{rating.toFixed(1).replace('.', ',')}</b><span>en Google</span></div>}
          {reviews > 0 && <div><b>{reviews}</b><span>opiniones</span></div>}
          <div><b>{services.length}</b><span>servicios</span></div>
          {horaHoy && <div><b>{horaHoy.split('–')[0].trim()}</b><span>abrimos hoy</span></div>}
        </div>
      </section>
      {cinta}
    </>
  )
}

export default async function DemoPage({ params, searchParams }: { params: { id: string }; searchParams?: { nivel?: string } }) {
  const demo = await getDemo(params.id)
  if (!demo) notFound()
  const nivel = nivelDe(searchParams?.nivel)
  const premium = nivel !== 'arranque', cine = nivel === 'cine'
  const adn = adnDe(demo.sector)

  const place = demo.place
  const name = place?.name || demo.negocio
  const { tagline, services } = sectorContent(demo.sector)
  const photos = (place?.photos || []).map((p) => `/api/place-photo?name=${encodeURIComponent(p)}`)
  const hero = photos[0] || null
  const galeria = photos.slice(1, 6)
  const rating = place?.rating ?? demo.rating
  const reviews = place?.reviews || demo.reviews
  const buenaNota = typeof rating === 'number' && rating >= 4
  const address = place?.address || ''
  const phone = place?.phone || ''
  const telVisible = phone ? phone.replace(/^34/, '').replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3') : ''
  const hours = place?.hours || []
  const hoy = todayIndex(hours)
  const horaHoy = hoy >= 0 ? hours[hoy].split(': ').slice(1).join(': ') : ''
  const mapsUrl = place?.mapsUri ||
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${name} ${address || demo.ciudad || 'Valencia'}`)}`
  const intro = place?.summary || tagline
  const wa = `https://wa.me/34695868793?text=${encodeURIComponent(`Hola, me gusta la demo de la web de ${name}. Quiero presupuesto.`)}`

  return (
    <div className={`dm dm-${nivel}${premium ? ` tema-oscuro adn-${adn.clave} dm-cab-${adn.cabecera}` : ''}`}
      style={premium ? ({
        '--f-display': adn.fuentes.display, '--f-texto': adn.fuentes.texto, '--f-peso': adn.fuentes.displayPeso,
        '--bg': adn.bg, '--papel': adn.papel, '--tinta': adn.tinta, '--acento': adn.acento, '--acento2': adn.acento2,
        '--luz1': adn.luz[0], '--luz2': adn.luz[1], '--luzp1': adn.luzPapel[0], '--luzp2': adn.luzPapel[1],
      } as React.CSSProperties) : undefined}>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      {premium && <link rel="stylesheet" href={adn.fuentes.url} />}
      {premium && <LuzFondo paleta="sector" colores={{ a: adn.luz[1], b: adn.acento2, c: adn.luz[0], d: adn.luz[0], e: adn.cristal.c4, f: adn.acento, g: adn.cristal.c3, h: adn.luz[1], o: adn.bg }} />}
      {cine && <LuzPapel />}

      {/* ── Conmutador de nivel (para enseñar las tres al cliente) ── */}
      <div className="dm-niveles">
        <span className="dm-niveles-t">Ver esta demo como</span>
        {NIVELES.map(n => (
          <a key={n.k} href={`?nivel=${n.k}`} className={`dm-nivel${n.k === nivel ? ' is-on' : ''}`} title={n.d}>
            {n.n} <em>{n.p}</em>
          </a>
        ))}
      </div>

      {/* ── Cabecera fija ── */}
      <header className="dm-nav">
        <div className="dm-nav-in">
          <div className="dm-brand">
            <span className="dm-brand-dot" />
            <span className="dm-brand-name">{name}</span>
            <span className="dm-tag">demo</span>
          </div>
          <nav className="dm-links">
            <a href="#servicios">Servicios</a>
            {galeria.length >= 2 && <a href="#galeria">Galería</a>}
            {place?.topReviews?.length ? <a href="#resenas">Reseñas</a> : null}
            <a href="#contacto">Contacto</a>
          </nav>
          <a href="#contacto" className="dm-btn dm-btn-sm">Reservar</a>
        </div>
      </header>

      {/* ── Hero ── */}
      <main className="dm-main">
      {cine ? (
        <HeroCine adn={adn} name={name} intro={intro} hero={hero} galeria={galeria} rating={buenaNota ? (rating as number) : null} reviews={reviews} horaHoy={horaHoy} phone={phone} telVisible={telVisible} services={services} ciudad={demo.ciudad || 'Valencia'} tipo={place?.type || adn.eyebrow} />
      ) : (
      <section className="dm-hero">
        {hero ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={hero} alt={name} className="dm-hero-img" />
        ) : (
          <div className="dm-hero-img dm-hero-grad" />
        )}
        <div className="dm-hero-veil" />
        <div className="dm-hero-in">
          {premium && <p className="dm-adn-eyebrow">{adn.eyebrow} · {demo.ciudad || 'Valencia'}</p>}
          <div className="dm-pills">
            {buenaNota && (
              <span className="dm-pill">
                <span className="dm-stars">{'★'.repeat(Math.round(rating as number))}</span>
                <b>{(rating as number).toFixed(1).replace('.', ',')}</b> · {reviews} reseñas en Google
              </span>
            )}
            {place?.type && <span className="dm-pill dm-pill-soft">{place.type}</span>}
            {horaHoy && <span className="dm-pill dm-pill-soft">Hoy · {horaHoy}</span>}
          </div>
          <h1 className="dm-h1">{name}</h1>
          <p className="dm-sub">{intro}</p>
          <div className="dm-cta-row">
            <a href="#contacto" className="dm-btn dm-btn-lg">Reservar / Contactar</a>
            {phone && <a href={`tel:+${phone}`} className="dm-btn dm-btn-ghost dm-btn-lg">Llamar {telVisible}</a>}
          </div>
        </div>
      </section>

      )}

      {/* ── Franja de confianza ── */}
      <section className="dm-strip">
        {buenaNota && <div><b>{(rating as number).toFixed(1).replace('.', ',')}★</b><span>valoración en Google</span></div>}
        {reviews > 0 && <div><b>{reviews.toLocaleString('es-ES')}</b><span>clientes nos han valorado</span></div>}
        <div><b>24/7</b><span>reserva online cuando quieras</span></div>
        <div><b>{demo.ciudad || 'Valencia'}</b><span>{address ? address.split(',')[0] : 'estamos cerca de ti'}</span></div>
      </section>

      {/* ── Servicios ── */}
      <section id="servicios" className="dm-sec">
        <p className="dm-eyebrow">Lo que ofrecemos</p>
        <h2 className="dm-h2">Todo pensado para que tus clientes lo tengan fácil.</h2>
        {premium && adn.carta ? (
          <ol className="dm-carta">
            {services.map((sv, i) => (
              <li key={sv.t}>
                <span className="dm-carta-n">{String(i + 1).padStart(2, '0')}</span>
                <span className="dm-carta-t"><h3>{sv.t}</h3><p>{sv.d}</p></span>
                <span className="dm-carta-ico"><Icon k={sv.k} /></span>
              </li>
            ))}
          </ol>
        ) : (
        <div className="dm-grid-3">
          {services.map((sv) => (
            <div key={sv.t} className="dm-card dm-card-hover">
              <span className="dm-ico"><Icon k={sv.k} /></span>
              <h3>{sv.t}</h3>
              <p>{sv.d}</p>
            </div>
          ))}
        </div>
        )}
      </section>

      {/* ── Galería con fotos reales del negocio ── */}
      {galeria.length >= 2 && (
        <section id="galeria" className="dm-sec">
          <p className="dm-eyebrow">Galería</p>
          <h2 className="dm-h2">Así es {name.length > 34 ? 'nuestro sitio' : name}.</h2>
          <div className="dm-gal">
            {galeria.map((src, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={i} src={src} alt={`${name} ${i + 1}`} className={i === 0 ? 'dm-gal-big' : ''} loading="lazy" />
            ))}
          </div>
        </section>
      )}

      {/* ── Reseñas reales (solo las buenas) ── */}
      {place?.topReviews && place.topReviews.length > 0 && (
        <section id="resenas" className={`dm-sec${premium ? ' dm-papel papel' : ''}`}>
          <p className="dm-eyebrow">Opiniones</p>
          <h2 className="dm-h2">Lo que dicen nuestros clientes.</h2>
          <div className={place.topReviews.length === 1 ? 'dm-grid-3 dm-grid-1' : 'dm-grid-3'}>
            {place.topReviews.map((r, i) => (
              <figure key={i} className="dm-card dm-quote">
                <div className="dm-stars">{'★'.repeat(Math.max(1, Math.round(r.rating || 5)))}</div>
                <blockquote>{r.text}</blockquote>
                <figcaption>
                  <span className="dm-avatar">{r.author.trim().charAt(0).toUpperCase()}</span>
                  <span>{r.author}{r.when ? <em> · {r.when}</em> : null}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}

      {/* ── Horario y ubicación ── */}
      <section id="contacto" className="dm-sec">
        <p className="dm-eyebrow">Visítanos</p>
        <h2 className="dm-h2">Dónde estamos y cuándo abrimos.</h2>
        <div className="dm-two">
          <div className="dm-card">
            <h3 className="dm-card-t">Cómo llegar</h3>
            {address && <p className="dm-addr">{address}</p>}
            {phone && <p className="dm-addr"><a href={`tel:+${phone}`}>{telVisible}</a></p>}
            <div className="dm-actions">
              <a href={mapsUrl} target="_blank" rel="noreferrer" className="dm-btn dm-btn-ghost">Ver en Google Maps</a>
              {phone && <a href={`tel:+${phone}`} className="dm-btn">Llamar ahora</a>}
            </div>
          </div>
          {hours.length > 0 ? (
            <div className="dm-card">
              <h3 className="dm-card-t">Horario</h3>
              <ul className="dm-hours">
                {hours.map((h, i) => {
                  const [dia, ...resto] = h.split(': ')
                  return (
                    <li key={i} className={i === hoy ? 'is-today' : ''}>
                      <span>{dia}</span><span>{resto.join(': ') || '—'}</span>
                    </li>
                  )
                })}
              </ul>
            </div>
          ) : (
            <div className="dm-card">
              <h3 className="dm-card-t">Escríbenos</h3>
              <p className="dm-addr">Cuéntanos qué necesitas y te respondemos enseguida. Aquí iría tu formulario de contacto conectado a tu email y a tu WhatsApp.</p>
            </div>
          )}
        </div>
      </section>

      {/* ── Cierre AlloStudios ── */}
      <section className="dm-sec dm-sec-last">
        <div className="dm-final">
          <p className="dm-final-eyebrow">Demo generada por AlloStudios</p>
          <h2 className="dm-final-h">¿Te gusta cómo queda la web de {name}?</h2>
          <p className="dm-final-p">
            Todo lo que has visto se ha montado solo, con los datos públicos de tu negocio.
            La dejamos funcionando de verdad — con tu dominio, tus fotos y tus textos — en 7 días.
          </p>
          <a href={wa} target="_blank" rel="noreferrer" className="dm-btn dm-btn-white dm-btn-lg">Solicitar presupuesto</a>
          <p className="dm-final-note">Sin compromiso · Respuesta en menos de 24 h</p>
        </div>
        <p className="dm-foot">Web por <a href="https://allostudios.net" style={{ color: 'inherit', fontWeight: 600, textDecoration: 'none' }}>allo.</a> · Webs · Google · Anuncios · Asistente IA en WhatsApp</p>
      </section>

      </main>

      {/* ── Barra fija en móvil ── */}
      <div className="dm-bar">
        {phone && <a href={`tel:+${phone}`} className="dm-btn dm-btn-ghost">Llamar</a>}
        <a href={wa} target="_blank" rel="noreferrer" className="dm-btn">La quiero así</a>
      </div>
    </div>
  )
}

const CSS = `
.dm{--bg:#0a0a11;--card:rgba(255,255,255,.045);--line:rgba(255,255,255,.09);--txt:#f4f2f8;--dim:rgba(244,242,248,.62);--faint:rgba(244,242,248,.4);--g:linear-gradient(100deg,#6a5bff,#a05bff);
background:var(--bg);color:var(--txt);min-height:100dvh;font-family:Inter,system-ui,sans-serif;-webkit-font-smoothing:antialiased;overflow-x:hidden}
.dm h1,.dm h2,.dm h3{font-family:'Bricolage Grotesque',Inter,sans-serif;letter-spacing:-.035em;line-height:1.04;margin:0}
.dm a{color:inherit;text-decoration:none}
.dm ::selection{background:rgba(160,91,255,.35)}

.dm-nav{position:sticky;top:0;z-index:40;backdrop-filter:blur(14px);background:rgba(10,10,17,.72);border-bottom:1px solid var(--line)}
.dm-nav-in{max-width:1060px;margin:0 auto;padding:0 22px;height:62px;display:flex;align-items:center;justify-content:space-between;gap:16px}
.dm-brand{display:flex;align-items:center;gap:9px;min-width:0}
.dm-brand-dot{width:9px;height:9px;border-radius:50%;background:var(--g);flex:none;box-shadow:0 0 12px rgba(140,91,255,.8)}
.dm-brand-name{font-weight:650;font-size:14.5px;letter-spacing:-.02em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:42vw}
.dm-tag{font-size:9.5px;letter-spacing:.16em;text-transform:uppercase;color:var(--faint);border:1px solid var(--line);border-radius:999px;padding:2px 7px;flex:none}
.dm-links{display:none;gap:26px;font-size:13.5px;color:var(--dim)}
.dm-links a:hover{color:var(--txt)}

.dm .dm-btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;background:var(--g);color:#fff;border-radius:999px;padding:11px 20px;font-size:13.5px;font-weight:650;letter-spacing:-.01em;transition:transform .2s ease,box-shadow .2s ease,background .2s ease;white-space:nowrap}
.dm .dm-btn:hover{transform:translateY(-1px);box-shadow:0 12px 30px -12px rgba(140,91,255,.85)}
.dm .dm-btn-sm{padding:9px 17px;font-size:12.5px}
.dm .dm-btn-lg{padding:15px 28px;font-size:15px}
.dm .dm-btn-ghost{background:transparent;border:1px solid rgba(255,255,255,.26)}
.dm .dm-btn-ghost:hover{background:rgba(255,255,255,.07);box-shadow:none}
.dm .dm-btn-white{background:#fff;color:#171325}
.dm .dm-btn-white:hover{box-shadow:0 14px 34px -14px rgba(255,255,255,.6)}

.dm-hero{position:relative;min-height:78vh;display:flex;align-items:flex-end;overflow:hidden}
.dm-hero-img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;animation:dmZoom 18s ease-out both}
.dm-hero-grad{background:radial-gradient(120% 100% at 20% 8%,#6a5bff 0%,#a05bff 42%,#12101d 100%)}
.dm-hero-veil{position:absolute;inset:0;background:linear-gradient(180deg,rgba(8,8,14,.3) 0%,rgba(8,8,14,.55) 48%,rgba(10,10,17,.98) 100%)}
.dm-hero-in{position:relative;width:100%;max-width:1060px;margin:0 auto;padding:0 22px 62px;animation:dmUp .9s cubic-bezier(.16,1,.3,1) both}
.dm-pills{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:20px}
.dm-pill{display:inline-flex;align-items:center;gap:7px;background:rgba(255,255,255,.13);backdrop-filter:blur(8px);border:1px solid rgba(255,255,255,.2);border-radius:999px;padding:7px 14px;font-size:12.5px}
.dm-pill-soft{background:rgba(255,255,255,.07);color:var(--dim)}
.dm-stars{color:#ffd15c;letter-spacing:1px}
.dm-h1{font-size:clamp(2.5rem,7vw,4.9rem);font-weight:800;text-wrap:balance}
.dm-sub{font-size:clamp(1rem,2.2vw,1.32rem);color:rgba(255,255,255,.8);margin:16px 0 28px;max-width:640px;line-height:1.5;font-weight:300}
.dm-cta-row{display:flex;gap:11px;flex-wrap:wrap}

.dm-strip{max-width:1060px;margin:0 auto;padding:34px 22px;display:grid;grid-template-columns:repeat(2,1fr);gap:22px;border-bottom:1px solid var(--line)}
.dm-strip div{display:flex;flex-direction:column;gap:3px}
.dm-strip b{font-family:'Bricolage Grotesque',sans-serif;font-size:clamp(1.35rem,3vw,1.85rem);letter-spacing:-.03em}
.dm-strip span{font-size:12.5px;color:var(--faint);line-height:1.35}

.dm-sec{max-width:1060px;margin:0 auto;padding:76px 22px 0}
.dm-sec-last{padding-bottom:112px}
.dm-eyebrow{font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:#a89bff;font-weight:600;margin:0 0 12px}
.dm-h2{font-size:clamp(1.65rem,4vw,2.6rem);font-weight:700;margin-bottom:30px;text-wrap:balance}

.dm-grid-3{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:16px}
.dm-grid-1{max-width:560px}
.dm-card{background:var(--card);border:1px solid var(--line);border-radius:18px;padding:24px}
.dm-card-hover{transition:transform .3s cubic-bezier(.16,1,.3,1),background .3s,border-color .3s}
.dm-card-hover:hover{transform:translateY(-3px);background:rgba(255,255,255,.075);border-color:rgba(255,255,255,.18)}
.dm-card h3{font-size:17.5px;font-weight:650;margin-bottom:7px}
.dm-card p{color:var(--dim);font-size:14.5px;line-height:1.55;margin:0}
.dm-ico{display:inline-flex;align-items:center;justify-content:center;width:44px;height:44px;border-radius:13px;background:var(--g);color:#fff;margin-bottom:17px}
.dm-card-t{font-size:18px;font-weight:650;margin-bottom:13px}

.dm-gal{display:grid;grid-template-columns:repeat(2,1fr);gap:11px}
.dm-gal img{width:100%;height:170px;object-fit:cover;border-radius:15px;border:1px solid var(--line);transition:transform .5s cubic-bezier(.16,1,.3,1)}
.dm-gal img:hover{transform:scale(1.02)}
.dm-gal-big{grid-column:span 2;height:300px!important}

.dm-quote blockquote{margin:12px 0 16px;font-size:14.5px;line-height:1.62;color:rgba(244,242,248,.87)}
.dm-quote blockquote::before{content:'“'}
.dm-quote blockquote::after{content:'”'}
.dm-quote figcaption{display:flex;align-items:center;gap:9px;font-size:12.5px;color:var(--faint)}
.dm-quote figcaption em{font-style:normal;opacity:.75}
.dm-avatar{width:26px;height:26px;border-radius:50%;background:var(--g);display:inline-flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;color:#fff;flex:none}

.dm-two{display:grid;grid-template-columns:1fr;gap:16px}
.dm-addr{color:var(--dim);font-size:14.5px;line-height:1.55;margin:0 0 6px}
.dm-addr a:hover{color:var(--txt)}
.dm-actions{display:flex;gap:10px;flex-wrap:wrap;margin-top:18px}
.dm-hours{list-style:none;margin:0;padding:0;font-size:14px}
.dm-hours li{display:flex;justify-content:space-between;gap:14px;padding:8px 0;border-bottom:1px solid rgba(255,255,255,.055);color:var(--dim)}
.dm-hours li:last-child{border-bottom:0}
.dm-hours li.is-today{color:var(--txt);font-weight:600}
.dm-hours li.is-today span:first-child::after{content:' · hoy';color:#a89bff;font-weight:500}

.dm-final{background:var(--g);border-radius:26px;padding:56px 30px;text-align:center;position:relative;overflow:hidden}
.dm-final::after{content:'';position:absolute;inset:0;background:radial-gradient(80% 120% at 50% 0%,rgba(255,255,255,.22),transparent 60%);pointer-events:none}
.dm-final-eyebrow{position:relative;font-size:11.5px;letter-spacing:.18em;text-transform:uppercase;opacity:.85;margin:0 0 14px}
.dm-final-h{position:relative;font-size:clamp(1.7rem,4.4vw,2.7rem);font-weight:800;margin-bottom:14px;text-wrap:balance}
.dm-final-p{position:relative;opacity:.92;max-width:540px;margin:0 auto 28px;font-size:15.5px;line-height:1.6}
.dm-final .dm-btn{position:relative}
.dm-final-note{position:relative;font-size:12px;opacity:.75;margin:18px 0 0}
.dm-foot{text-align:center;color:var(--faint);font-size:12px;margin:26px 0 0}

.dm-bar{position:fixed;left:12px;right:12px;bottom:12px;z-index:45;display:flex;gap:9px;padding:9px;border-radius:999px;background:rgba(14,14,24,.86);backdrop-filter:blur(14px);border:1px solid var(--line)}
.dm-bar .dm-btn{flex:1}

@keyframes dmUp{from{opacity:0;transform:translateY(26px)}to{opacity:1;transform:none}}
@keyframes dmZoom{from{transform:scale(1.09)}to{transform:scale(1)}}
@media (prefers-reduced-motion:reduce){.dm *{animation:none!important;transition:none!important}}

@media (min-width:760px){
  .dm-links{display:flex}
  .dm-strip{grid-template-columns:repeat(auto-fit,minmax(150px,1fr));padding:40px 22px}
  .dm-sec{padding-top:96px}
  .dm-two{grid-template-columns:1fr 1fr;gap:18px}
  .dm-gal{grid-template-columns:repeat(4,1fr)}
  .dm-gal img{height:190px}
  .dm-gal-big{grid-column:span 2;grid-row:span 2;height:391px!important}
  .dm-card{padding:28px}
  .dm-final{padding:70px 40px}
  .dm-sec-last{padding-bottom:70px}
  .dm-bar{display:none}
}

/* ══ Conmutador de nivel ══ */
.dm-niveles{position:fixed;left:50%;bottom:18px;transform:translateX(-50%);z-index:60;display:flex;align-items:center;gap:6px;padding:6px 8px 6px 14px;border-radius:999px;background:rgba(10,10,17,.72);backdrop-filter:blur(16px);border:1px solid rgba(255,255,255,.14);box-shadow:0 20px 50px -20px rgba(0,0,0,.7);font-size:12px;white-space:nowrap;max-width:calc(100vw - 24px);overflow:auto}
.dm-niveles-t{color:var(--faint);letter-spacing:.08em;text-transform:uppercase;font-size:10px;margin-right:4px}
.dm-nivel{display:inline-flex;align-items:center;gap:6px;padding:7px 12px;border-radius:999px;color:var(--dim);border:1px solid transparent}
.dm-nivel em{font-style:normal;color:var(--faint);font-size:11px}
.dm-nivel:hover{color:var(--txt)}
.dm-nivel.is-on{background:rgba(255,255,255,.1);border-color:rgba(255,255,255,.16);color:#fff}
.dm-nivel.is-on em{color:#FFD23F}
@media (max-width:640px){.dm-niveles{bottom:74px}.dm-nivel em{display:none}}

/* ══ PREMIUM: la luz que viaja, cristal de verdad, títulos Outfit, papel con luz ══ */
.dm-premium,.dm-cine{--bg:#121216;--card:rgba(255,255,255,.05);--line:rgba(255,255,255,.1);background:var(--bg)}
.dm-premium .dm-main,.dm-cine .dm-main{position:relative;z-index:2}
.dm-premium .dm-nav,.dm-cine .dm-nav{background:rgba(18,18,22,.55);backdrop-filter:blur(18px) saturate(1.2)}
.dm-premium .dm-card,.dm-cine .dm-card{background:rgba(255,255,255,.06);border-color:rgba(255,255,255,.12);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);
  box-shadow:inset 0 1px 0 rgba(255,255,255,.14),inset 0 -1px 1px rgba(255,255,255,.04),0 24px 50px -30px rgba(0,0,0,.6);border-radius:22px}
.dm-premium .dm-card-hover:hover,.dm-cine .dm-card-hover:hover{background:rgba(255,255,255,.09);border-color:rgba(255,255,255,.2)}
.dm-premium .dm-grid-3 .dm-card-hover,.dm-cine .dm-grid-3 .dm-card-hover{position:relative}
.dm-premium .dm-ico,.dm-cine .dm-ico{background:rgba(255,255,255,.08);box-shadow:inset 0 1px 0 rgba(255,255,255,.18)}
.dm-premium .dm-pill,.dm-cine .dm-pill{background:rgba(255,255,255,.1);backdrop-filter:blur(12px);box-shadow:inset 0 1px 0 rgba(255,255,255,.2)}
.dm-premium .dm-hero-veil,.dm-cine .dm-hero-veil{background:linear-gradient(180deg,rgba(18,18,22,.25) 0%,rgba(18,18,22,.5) 48%,rgba(18,18,22,.98) 100%)}
.dm-premium .dm-eyebrow,.dm-cine .dm-eyebrow{color:#B4A8FF}
.dm-premium .dm-strip,.dm-cine .dm-strip{border-color:rgba(255,255,255,.1)}
/* apartado de papel (reseñas): mismo papel que allostudios.net, con su orbe */
.dm-papel{--txt:#18181B;--dim:#4E4A5E;--faint:#6E6A7C;color:#18181B;max-width:none;padding:76px 22px 76px;margin:76px 0 0;position:relative;isolation:isolate;overflow:hidden}
.dm-papel>*{max-width:1060px;margin-left:auto;margin-right:auto}
.dm-papel .dm-eyebrow{color:#5B5BD6}
.dm-papel .dm-card{background:rgba(255,255,255,.62);border-color:rgba(255,255,255,.9);backdrop-filter:blur(18px);box-shadow:inset 0 1px 0 #fff,0 20px 44px -24px rgba(24,24,27,.28)}
.dm-papel .dm-stars{color:#E0A500}
.dm-papel .dm-avatar{background:#18181B;color:#fff}
.dm-papel + .dm-sec{padding-top:76px}
.dm-premium .dm-final,.dm-cine .dm-final{background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);backdrop-filter:blur(14px)}

/* ══ CINEMATOGRÁFICA: entradas animadas de cada apartado ══ */
.dm-cine .dm-sec>*{animation:dmUp .9s cubic-bezier(.16,1,.3,1) both;animation-timeline:view();animation-range:entry 0% entry 40%}
@media (prefers-reduced-motion:reduce){.dm-cine .dm-sec>*{animation:none}}

/* ══ ADN por sector (Pro y Cinematográfica): variables que vienen del servidor ══ */
.dm-premium,.dm-cine{background:var(--bg);font-family:var(--f-texto)}
/* escalera tipográfica por tarifa: Arranque = sans genérica · Pro = la sans limpia del sector · Cinematográfica = la display expresiva del sector */
.dm-premium h1,.dm-premium h2,.dm-premium h3,.dm-premium .dm-strip b{font-family:var(--f-texto);font-weight:600;letter-spacing:-.025em}
.dm-cine h1,.dm-cine h2,.dm-cine h3,.dm-cine .dm-strip b,.dm-cine .dm-carta-n,.dm-cine .dm-cita-t,.dm-cine .dm-flot b,.dm-cine .dm-contadores b,.dm-cine .dm-cinta span{font-family:var(--f-display);font-weight:var(--f-peso);letter-spacing:-.02em}
.dm-premium .dm-h1{font-weight:600}.dm-cine .dm-h1{font-weight:var(--f-peso)}
.dm-premium .dm-eyebrow,.dm-cine .dm-eyebrow{color:var(--acento)}
.dm-premium .dm-brand-dot,.dm-cine .dm-brand-dot{background:var(--acento);box-shadow:0 0 12px var(--acento)}
.dm-premium .dm-btn,.dm-cine .dm-btn{background:var(--acento);color:var(--bg);box-shadow:0 12px 30px -14px var(--acento)}
.dm-premium .dm-btn:hover,.dm-cine .dm-btn:hover{box-shadow:0 16px 36px -14px var(--acento)}
.dm-premium .dm-btn-ghost,.dm-cine .dm-btn-ghost{background:transparent;color:var(--txt);box-shadow:none}
.dm-premium .dm-btn-white,.dm-cine .dm-btn-white{background:#fff;color:#171325}
.dm-premium .dm-stars,.dm-cine .dm-stars{color:var(--acento2)}
.dm-premium .dm-nav,.dm-cine .dm-nav{background:color-mix(in srgb,var(--bg) 60%,transparent)}
.dm-adn-eyebrow{font-size:11px;letter-spacing:.24em;text-transform:uppercase;color:var(--acento);margin:0 0 14px;font-weight:500}
/* luz de fondo con los colores del sector */
.dm-premium .luz-fondo,.dm-cine .luz-fondo{--grafito:var(--bg)}
.dm-premium .luz-velo,.dm-cine .luz-velo{background:radial-gradient(120% 80% at 50% 50%,transparent 30%,color-mix(in srgb,var(--bg) 60%,transparent) 100%)}
/* papel del sector: su color, su orbe */
.dm-premium .dm-papel,.dm-cine .dm-papel{background:var(--papel) !important;--txt:var(--tinta);--dim:color-mix(in srgb,var(--tinta) 70%,var(--papel));--faint:color-mix(in srgb,var(--tinta) 50%,var(--papel));color:var(--tinta)}
.dm-premium .dm-papel::before,.dm-cine .dm-papel::before{background:radial-gradient(closest-side,var(--luzp1) 0%,var(--luzp2) 55%,transparent 100%) !important}
.dm-premium .dm-papel .dm-eyebrow,.dm-cine .dm-papel .dm-eyebrow{color:var(--tinta)}
.dm-premium .dm-papel .dm-avatar,.dm-cine .dm-papel .dm-avatar{background:var(--tinta);color:var(--papel)}
/* carta (servicios como lista) */
.dm-carta{list-style:none;margin:0;padding:0;border-top:1px solid var(--line)}
.dm-carta li{display:grid;grid-template-columns:44px 1fr 40px;gap:18px;align-items:start;padding:22px 4px;border-bottom:1px solid var(--line)}
.dm-carta-n{font-family:var(--f-display);font-weight:var(--f-peso);font-size:20px;color:var(--acento);padding-top:2px}
.dm-carta h3{font-size:clamp(1.2rem,2.4vw,1.6rem);margin:0 0 6px}
.dm-carta p{margin:0;color:var(--dim);font-size:14.5px;line-height:1.55;max-width:60ch}
.dm-carta-ico{color:var(--acento);opacity:.8;padding-top:4px}
.dm-carta li:hover .dm-carta-ico{opacity:1}
/* ── composiciones de cabecera ── */
.dm-premium.dm-cab-editorial .dm-hero-in{padding-bottom:70px}
.dm-premium.dm-cab-editorial .dm-h1{font-size:clamp(3rem,9vw,7rem);line-height:.96;letter-spacing:-.03em;max-width:12ch}
.dm-premium.dm-cab-editorial .dm-sub{max-width:520px}
.dm-premium.dm-cab-editorial .dm-hero-veil{background:linear-gradient(180deg,color-mix(in srgb,var(--bg) 20%,transparent) 0%,color-mix(in srgb,var(--bg) 55%,transparent) 50%,var(--bg) 100%)}
.dm-premium.dm-cab-centro .dm-hero{align-items:center;text-align:center}
.dm-premium.dm-cab-centro .dm-hero-in{display:flex;flex-direction:column;align-items:center;padding-bottom:0}
.dm-premium.dm-cab-centro .dm-pills{justify-content:center}
.dm-premium.dm-cab-centro .dm-h1{max-width:16ch}
.dm-premium.dm-cab-centro .dm-sub{margin-left:auto;margin-right:auto}
.dm-premium.dm-cab-centro .dm-cta-row{justify-content:center}
.dm-premium.dm-cab-centro .dm-hero-veil{background:radial-gradient(70% 60% at 50% 45%,color-mix(in srgb,var(--bg) 25%,transparent) 0%,color-mix(in srgb,var(--bg) 70%,transparent) 70%,var(--bg) 100%)}
/* cine: el panel de cristal toma el color del sector; en centro va centrado; en editorial, sin panel (el texto va sobre la luz) */

/* ══ CINEMATOGRÁFICA · conceptos de cabecera (ninguno es el cristal de allo) ══ */
.dm-cine .dm-hero{min-height:100dvh}
.dm-cine .dm-hero-grad{background:radial-gradient(90% 70% at 70% 20%,var(--luz2) 0%,var(--luz1) 45%,var(--bg) 100%)}
.dm-cine .dm-hero-img{animation:dmZoom 22s ease-out both}
/* cinta de servicios en marcha */
.dm-cinta{overflow:hidden;border-top:1px solid var(--line);border-bottom:1px solid var(--line);background:color-mix(in srgb,var(--bg) 70%,transparent);backdrop-filter:blur(10px)}
.dm-cinta-in{display:flex;gap:0;white-space:nowrap;width:max-content;animation:dmCinta 38s linear infinite}
.dm-cinta span{display:inline-flex;align-items:center;gap:26px;padding:14px 26px 14px 0;font-family:var(--f-display);font-weight:var(--f-peso);font-size:clamp(1rem,1.8vw,1.35rem);letter-spacing:-.01em;color:var(--dim)}
.dm-cinta i{width:6px;height:6px;border-radius:50%;background:var(--acento);display:inline-block}
@keyframes dmCinta{to{transform:translateX(-33.333%)}}
@media (prefers-reduced-motion:reduce){.dm-cinta-in{animation:none}}
/* revelado */
.dm-cine-revelado{align-items:flex-end}
.dm-cine-revelado .dm-hero-in{padding-bottom:64px;animation:none}
.dm-cine-revelado .dm-h1{font-size:clamp(3.4rem,10vw,8.4rem);line-height:.94;letter-spacing:-.035em;max-width:14ch;overflow:hidden}
.dm-w{display:inline-block;animation:dmPalabra 1.1s cubic-bezier(.16,1,.3,1) both}
@keyframes dmPalabra{from{transform:translateY(110%) rotate(3deg);opacity:0}to{transform:none;opacity:1}}
.dm-rev-fila{display:grid;grid-template-columns:1fr auto;gap:24px;align-items:end;margin:22px 0 28px}
.dm-rev-fila .dm-sub{margin:0;max-width:560px}
.dm-rev-fila>div{display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end}
@media (max-width:760px){.dm-rev-fila{grid-template-columns:1fr}.dm-rev-fila>div{justify-content:flex-start}}
.dm-cine-revelado .dm-hero-veil{background:linear-gradient(180deg,color-mix(in srgb,var(--bg) 15%,transparent) 0%,color-mix(in srgb,var(--bg) 40%,transparent) 55%,var(--bg) 100%)}
/* aura */
.dm-cine-aura{align-items:center;text-align:center;overflow:hidden;background:var(--bg)}
.dm-aura{position:absolute;inset:-20%;filter:blur(90px);opacity:.75;background:radial-gradient(38% 42% at 50% 42%,var(--acento) 0%,var(--luz2) 40%,transparent 72%),radial-gradient(40% 40% at 20% 80%,var(--luz1) 0%,transparent 70%),radial-gradient(35% 35% at 82% 20%,var(--acento2) 0%,transparent 70%);animation:dmAura 26s ease-in-out infinite alternate}
@keyframes dmAura{0%{transform:translate(0,0) scale(1)}50%{transform:translate(4%,-3%) scale(1.06)}100%{transform:translate(-3%,3%) scale(.97)}}
.dm-cine-aura .dm-hero-in{display:flex;flex-direction:column;align-items:center;padding:110px 22px 220px}
.dm-cine-aura .dm-h1{font-size:clamp(3rem,8vw,6.6rem);max-width:16ch;line-height:1}
.dm-cine-aura .dm-h1 em{font-style:italic;color:var(--acento)}
.dm-cine-aura .dm-sub{margin-left:auto;margin-right:auto}
.dm-cine-aura .dm-cta-row{justify-content:center}
.dm-cine-aura .dm-pills{justify-content:center;margin-top:22px}
.dm-flotantes{position:absolute;inset:auto 0 0 0;height:210px;pointer-events:none}
.dm-flot{position:absolute;bottom:34px;width:220px;padding:10px 10px 12px;border-radius:18px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.16);backdrop-filter:blur(14px);box-shadow:inset 0 1px 0 rgba(255,255,255,.2),0 30px 60px -30px rgba(0,0,0,.7);animation:dmFlota 7s ease-in-out infinite alternate}
.dm-flot img{width:100%;height:110px;object-fit:cover;border-radius:12px;display:block;margin-bottom:8px}
.dm-flot-ico{display:flex;align-items:center;justify-content:center;height:110px;border-radius:12px;background:color-mix(in srgb,var(--acento) 18%,transparent);color:var(--acento);margin-bottom:8px}
.dm-flot b{display:block;font-family:var(--f-display);font-weight:var(--f-peso);font-size:15px;text-align:left;padding:0 4px}
.dm-flot-0{left:8%;transform:rotate(-6deg)}.dm-flot-1{left:calc(50% - 110px);bottom:10px;transform:rotate(2deg);animation-delay:-2s}.dm-flot-2{right:8%;transform:rotate(5deg);animation-delay:-4s}
@keyframes dmFlota{to{translate:0 -14px}}
@media (max-width:760px){.dm-flot-1{display:none}.dm-flot{width:150px}.dm-flot img,.dm-flot-ico{height:80px}}
/* dividido */
.dm-cine-dividido{display:grid;grid-template-columns:1fr 1fr;min-height:100dvh;align-items:stretch}
.dm-div-papel{background:var(--papel);color:var(--tinta);--txt:var(--tinta);--dim:color-mix(in srgb,var(--tinta) 72%,var(--papel));padding:150px 56px 70px;display:flex;flex-direction:column;justify-content:center;gap:0;position:relative;z-index:1}
.dm-div-papel .dm-h1{font-size:clamp(2.6rem,5vw,4.6rem);line-height:1.02}
.dm-div-papel .dm-sub{color:var(--dim);max-width:460px}
.dm-div-papel .dm-adn-eyebrow{color:var(--tinta)}
.dm-div-papel .dm-pill{background:color-mix(in srgb,var(--tinta) 8%,transparent);border-color:color-mix(in srgb,var(--tinta) 14%,transparent);color:var(--tinta)}
.dm-div-papel .dm-pill-soft{color:var(--dim)}
.dm-cita{margin:8px 0 26px;padding:22px;border-radius:20px;background:#fff;box-shadow:0 0 0 1px color-mix(in srgb,var(--tinta) 8%,transparent),0 30px 60px -36px color-mix(in srgb,var(--tinta) 45%,transparent)}
.dm-cita-t{font-family:var(--f-display);font-weight:var(--f-peso);font-size:22px;margin-bottom:12px}
.dm-cita-campos{display:grid;gap:8px;margin-bottom:14px}
.dm-cita-campos span{display:block;padding:12px 14px;border-radius:12px;border:1px solid color-mix(in srgb,var(--tinta) 14%,transparent);color:color-mix(in srgb,var(--tinta) 55%,var(--papel));font-size:13.5px;background:#fff}
.dm-cita .dm-btn{width:100%;background:var(--tinta);color:var(--papel);box-shadow:none}
.dm-cita small{display:block;margin-top:10px;font-size:12px;color:color-mix(in srgb,var(--tinta) 60%,var(--papel))}
.dm-div-foto{position:relative;background:var(--bg);overflow:hidden;padding:120px 40px 60px}
.dm-marco{position:absolute;inset:100px 44px 90px;padding:8px;border-radius:32px;background:rgba(255,255,255,.06);box-shadow:inset 0 0 0 1px rgba(255,255,255,.12),0 50px 100px -40px rgba(0,0,0,.8)}
.dm-marco .dm-hero-img,.dm-marco img{position:static;width:100%;height:100%;object-fit:cover;border-radius:24px;display:block}
.dm-marco-2{inset:auto 24px 40px auto;width:240px;height:170px;padding:6px;border-radius:22px;transform:rotate(-4deg);background:rgba(255,255,255,.1)}
.dm-marco-2 img{border-radius:16px}
@media (max-width:900px){.dm-cine-dividido{grid-template-columns:1fr}.dm-div-papel{padding:120px 22px 40px}.dm-div-foto{min-height:60vh;padding:0}.dm-marco{inset:20px 16px 70px}.dm-marco-2{width:150px;height:110px}}
/* póster (cabecera clara) */
.dm-cine-poster{background:var(--papel);color:var(--tinta);--txt:var(--tinta);--dim:color-mix(in srgb,var(--tinta) 72%,var(--papel));--faint:color-mix(in srgb,var(--tinta) 55%,var(--papel));display:grid;grid-template-columns:1.1fr .9fr;align-items:center;gap:40px;padding:150px 56px 90px;overflow:hidden;position:relative}
.dm-cine-poster::after{content:"";position:absolute;inset:0;pointer-events:none;opacity:.12;mix-blend-mode:multiply;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E");background-size:280px}
.dm-cine-poster .dm-hero-in{padding:0;animation:none;max-width:none}
.dm-cine-poster .dm-adn-eyebrow{color:var(--acento2)}
.dm-cine-poster .dm-h1{font-size:clamp(3.2rem,8vw,7.2rem);line-height:.96;color:var(--tinta)}
.dm-cine-poster .dm-sub{color:var(--dim)}
.dm-cine-poster .dm-btn-ghost{color:var(--tinta);border-color:color-mix(in srgb,var(--tinta) 30%,transparent)}
.dm-ventana{position:relative;aspect-ratio:4/5;border-radius:200px 200px 28px 28px;overflow:hidden;box-shadow:0 40px 80px -40px color-mix(in srgb,var(--tinta) 60%,transparent)}
.dm-ventana .dm-hero-img{position:absolute;inset:0;animation:dmZoom 22s ease-out both}
.dm-cine-poster .dm-pills{position:absolute;left:56px;bottom:40px}
.dm-cine-poster .dm-pill{background:#fff;border-color:color-mix(in srgb,var(--tinta) 12%,transparent);color:var(--tinta)}
.dm-cine-poster .dm-pill-soft{color:var(--dim)}
.dm-sello{position:absolute;right:calc(.9fr);top:96px;right:44%;width:150px;height:150px;animation:dmGira 24s linear infinite;z-index:2}
.dm-sello svg{width:100%;height:100%;overflow:visible}
.dm-sello text{font-family:var(--f-texto);font-size:16.5px;letter-spacing:.22em;text-transform:uppercase;fill:var(--tinta);font-weight:500}
@keyframes dmGira{to{transform:rotate(360deg)}}
@media (max-width:900px){.dm-cine-poster{grid-template-columns:1fr;padding:120px 22px 70px}.dm-sello{right:16px;top:90px;width:110px;height:110px}.dm-cine-poster .dm-pills{position:static;margin-top:18px}}
/* velocidad */
.dm-cine-velocidad{align-items:flex-end}
.dm-diagonal{position:absolute;inset:0;background:linear-gradient(112deg,var(--bg) 0%,var(--bg) 42%,transparent 42.2%);opacity:.92}
.dm-cine-velocidad .dm-hero-veil{background:linear-gradient(180deg,transparent 0%,color-mix(in srgb,var(--bg) 60%,transparent) 70%,var(--bg) 100%)}
.dm-cine-velocidad .dm-hero-in{padding-bottom:150px}
.dm-h1-contorno{position:relative;font-size:clamp(3.4rem,9.5vw,8rem);line-height:.92;letter-spacing:-.02em;text-transform:uppercase;max-width:12ch}
.dm-h1-contorno::before{content:attr(data-texto);position:absolute;left:.06em;top:.06em;color:transparent;-webkit-text-stroke:1.5px var(--acento);z-index:-1;opacity:.9}
.dm-contadores{position:absolute;left:0;right:0;bottom:0;display:grid;grid-template-columns:repeat(4,1fr);border-top:1px solid var(--line);background:color-mix(in srgb,var(--bg) 78%,transparent);backdrop-filter:blur(12px)}
.dm-contadores div{padding:20px 22px;border-right:1px solid var(--line)}
.dm-contadores b{display:block;font-family:var(--f-display);font-weight:var(--f-peso);font-size:clamp(1.6rem,3vw,2.4rem);color:var(--acento);letter-spacing:-.02em}
.dm-contadores span{font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:var(--faint)}
@media (max-width:760px){.dm-contadores{grid-template-columns:repeat(2,1fr)}}
`
