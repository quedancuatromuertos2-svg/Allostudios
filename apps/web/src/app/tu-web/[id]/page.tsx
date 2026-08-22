import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { supabaseAdmin } from '@/lib/supabase'
import { getPlaceDetails, type PlaceData } from '@/lib/places'
import { decodeDemo, isDemoToken } from '@/lib/demo-token'

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

export default async function DemoPage({ params }: { params: { id: string } }) {
  const demo = await getDemo(params.id)
  if (!demo) notFound()

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
    <div className="dm">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

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
      <section className="dm-hero">
        {hero ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={hero} alt={name} className="dm-hero-img" />
        ) : (
          <div className="dm-hero-img dm-hero-grad" />
        )}
        <div className="dm-hero-veil" />
        <div className="dm-hero-in">
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
        <div className="dm-grid-3">
          {services.map((sv) => (
            <div key={sv.t} className="dm-card dm-card-hover">
              <span className="dm-ico"><Icon k={sv.k} /></span>
              <h3>{sv.t}</h3>
              <p>{sv.d}</p>
            </div>
          ))}
        </div>
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
        <section id="resenas" className="dm-sec">
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
        <p className="dm-foot">allostudios.net · Webs · Instagram · Anuncios · Asistente IA 24/7</p>
      </section>

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
`
