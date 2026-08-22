import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { supabaseAdmin } from '@/lib/supabase'
import type { PlaceData } from '@/lib/places'
import { decodeDemo, isDemoToken } from '@/lib/demo-token'

export const dynamic = 'force-dynamic'

type DemoRow = {
  id: string
  negocio: string
  ciudad: string | null
  sector: string | null
  place: PlaceData | null
}

async function getDemo(id: string): Promise<DemoRow | null> {
  // Plan B: la demo viene firmada dentro de la propia URL (sin base de datos)
  if (isDemoToken(id)) {
    const p = decodeDemo(id)
    if (!p) return null
    return { id, negocio: p.n, ciudad: p.c || null, sector: p.s || null, place: p.p }
  }

  if (!/^[0-9a-fA-F-]{20,}$/.test(id)) return null
  try {
    const { data, error } = await supabaseAdmin
      .from('demo_leads')
      .select('id, negocio, ciudad, sector, place')
      .eq('id', id)
      .single()
    if (error || !data) return null
    return data as DemoRow
  } catch {
    return null
  }
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const demo = await getDemo(params.id)
  const name = demo?.place?.name || demo?.negocio || 'Tu negocio'
  return { title: `Web de ${name} — demo`, robots: { index: false, follow: false } }
}

function sectorContent(sector: string | null): { tagline: string; services: { t: string; d: string }[] } {
  const s = (sector || '').toLowerCase()
  if (s.includes('peluq') || s.includes('barb'))
    return { tagline: 'Tu imagen, en las mejores manos', services: [{ t: 'Reserva online', d: 'Pide cita en 30 segundos, sin llamar.' }, { t: 'Nuestros trabajos', d: 'Galería de cortes y estilismos.' }, { t: 'Nuestro equipo', d: 'Profesionales con años de experiencia.' }] }
  if (s.includes('estét') || s.includes('spa') || s.includes('masaj'))
    return { tagline: 'Cuídate. Te lo mereces.', services: [{ t: 'Tratamientos', d: 'Faciales, corporales y bienestar.' }, { t: 'Reserva online', d: 'Elige día y hora al instante.' }, { t: 'Bonos y packs', d: 'Ahorra con nuestros bonos.' }] }
  if (s.includes('dental') || s.includes('clínic') || s.includes('fisio') || s.includes('veterin') || s.includes('óptic'))
    return { tagline: 'Tu salud, nuestra prioridad', services: [{ t: 'Pide cita', d: 'Reserva online 24/7.' }, { t: 'Tratamientos', d: 'Todo lo que necesitas, en un solo sitio.' }, { t: 'Primera visita', d: 'Valoración sin compromiso.' }] }
  if (s.includes('restaur') || s.includes('bar') || s.includes('cafet'))
    return { tagline: 'Sabor que se recuerda', services: [{ t: 'Nuestra carta', d: 'Descubre todos nuestros platos.' }, { t: 'Reserva mesa', d: 'Asegura tu sitio online.' }, { t: 'A domicilio', d: 'Pide y te lo llevamos a casa.' }] }
  if (s.includes('gimnas') || s.includes('entren'))
    return { tagline: 'Tu mejor versión empieza hoy', services: [{ t: 'Clases y horarios', d: 'Todas nuestras actividades.' }, { t: 'Prueba gratis', d: 'Ven a entrenar sin compromiso.' }, { t: 'Tarifas', d: 'Planes que se adaptan a ti.' }] }
  if (s.includes('taller') || s.includes('mecán'))
    return { tagline: 'Tu coche, en buenas manos', services: [{ t: 'Pide cita', d: 'Reserva tu revisión online.' }, { t: 'Servicios', d: 'Mecánica, chapa, neumáticos y más.' }, { t: 'Presupuesto', d: 'Sin sorpresas, todo claro.' }] }
  return { tagline: 'Bienvenido a nuestra web', services: [{ t: 'Servicios', d: 'Todo lo que ofrecemos.' }, { t: 'Contacto', d: 'Estamos aquí para ayudarte.' }, { t: 'Sobre nosotros', d: 'Conoce a nuestro equipo.' }] }
}

const card: React.CSSProperties = { background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 18, padding: 24 }
const pill = (bg: string, color: string): React.CSSProperties => ({ background: bg, color, padding: '14px 26px', borderRadius: 999, fontWeight: 700, fontSize: 15, textDecoration: 'none', display: 'inline-block' })

export default async function DemoPage({ params }: { params: { id: string } }) {
  const demo = await getDemo(params.id)
  if (!demo) notFound()

  const place = demo.place
  const name = place?.name || demo.negocio
  const { tagline, services } = sectorContent(demo.sector)
  const photo = place?.photoName ? `/api/place-photo?name=${encodeURIComponent(place.photoName)}` : null
  const rating = place?.rating ?? null
  const reviews = place?.reviews || 0
  const address = place?.address || ''
  const phone = place?.phone || ''
  const telVisible = phone ? phone.replace(/^34/, '') : ''
  const mapsQuery = encodeURIComponent(`${name} ${address || demo.ciudad || 'Valencia'}`)
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`
  const wa = `https://wa.me/34695868793?text=${encodeURIComponent(`Hola, me gusta la demo de la web de ${name}. Quiero presupuesto.`)}`

  return (
    <div style={{ background: '#0b0b12', color: '#f4f2f8', minHeight: '100dvh', fontFamily: 'var(--font-geist-sans), system-ui, sans-serif' }}>
      {/* HERO */}
      <section style={{ position: 'relative', minHeight: '82vh', display: 'flex', alignItems: 'flex-end', overflow: 'hidden' }}>
        {photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={photo} alt={name} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(120% 100% at 20% 8%, #6a5bff 0%, #a05bff 42%, #12101d 100%)' }} />
        )}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(8,8,14,.25) 0%, rgba(8,8,14,.55) 55%, rgba(8,8,14,.96) 100%)' }} />
        <div style={{ position: 'relative', padding: '0 24px 56px', maxWidth: 1000, margin: '0 auto', width: '100%' }}>
          {/* La demo vende: solo presumimos de la nota si es buena */}
          {rating && rating >= 4 ? (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,.12)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,.18)', borderRadius: 999, padding: '7px 14px', fontSize: 13, marginBottom: 18 }}>
              <span style={{ color: '#ffd15c' }}>{'★'.repeat(Math.round(rating))}</span>
              <span><b>{rating.toFixed(1).replace('.', ',')}</b> · {reviews} reseñas en Google</span>
            </div>
          ) : null}
          <h1 style={{ fontSize: 'clamp(2.6rem,7vw,5rem)', fontWeight: 800, letterSpacing: '-.03em', lineHeight: 1.02, margin: 0 }}>{name}</h1>
          <p style={{ fontSize: 'clamp(1.05rem,2.4vw,1.5rem)', opacity: .9, margin: '14px 0 26px', maxWidth: 620 }}>{tagline}</p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <span style={pill('linear-gradient(100deg,#6a5bff,#a05bff)', '#fff')}>Reservar / Contactar</span>
            {phone ? <a href={`tel:+${phone}`} style={{ ...pill('transparent', '#fff'), border: '1px solid rgba(255,255,255,.3)' }}>Llamar {telVisible}</a> : null}
          </div>
        </div>
      </section>

      {/* SERVICIOS */}
      <section style={{ padding: '72px 24px', maxWidth: 1000, margin: '0 auto' }}>
        <h2 style={{ fontSize: 'clamp(1.6rem,4vw,2.4rem)', fontWeight: 700, marginBottom: 8 }}>Lo que ofrecemos</h2>
        <p style={{ opacity: .55, marginBottom: 34 }}>Todo pensado para que tus clientes lo tengan fácil.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 18 }}>
          {services.map((sv) => (
            <div key={sv.t} style={card}>
              <div style={{ width: 42, height: 42, borderRadius: 12, background: 'linear-gradient(135deg,#6a5bff,#a05bff)', marginBottom: 16 }} />
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>{sv.t}</h3>
              <p style={{ opacity: .6, fontSize: 14.5, lineHeight: 1.5 }}>{sv.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* RESEÑAS REALES */}
      {place?.topReviews && place.topReviews.length > 0 ? (
        <section style={{ padding: '10px 24px 72px', maxWidth: 1000, margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(1.6rem,4vw,2.4rem)', fontWeight: 700, marginBottom: 26 }}>Lo que dicen nuestros clientes</h2>
          {/* Con una sola reseña buena, una tarjeta a todo lo ancho queda vacía */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 18, maxWidth: place.topReviews.length === 1 ? 560 : undefined }}>
            {place.topReviews.map((r, i) => (
              <div key={i} style={card}>
                <div style={{ color: '#ffd15c', marginBottom: 10 }}>{'★'.repeat(Math.max(1, Math.round(r.rating || 5)))}</div>
                <p style={{ fontSize: 14.5, lineHeight: 1.6, opacity: .85, marginBottom: 12 }}>“{r.text}”</p>
                <div style={{ fontSize: 13, opacity: .5 }}>{r.author}{r.when ? ` · ${r.when}` : ''}</div>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {/* CONTACTO */}
      <section style={{ padding: '10px 24px 72px', maxWidth: 1000, margin: '0 auto' }}>
        <div style={{ ...card, display: 'flex', flexWrap: 'wrap', gap: 20, justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>Visítanos</h3>
            {address ? <p style={{ opacity: .7, fontSize: 14.5, margin: 0 }}>{address}</p> : null}
            {phone ? <p style={{ opacity: .7, fontSize: 14.5, margin: '4px 0 0' }}>Tel: {telVisible}</p> : null}
          </div>
          <a href={mapsUrl} target="_blank" rel="noreferrer" style={{ ...pill('transparent', '#fff'), border: '1px solid rgba(255,255,255,.3)', fontSize: 14 }}>Ver en Google Maps</a>
        </div>
      </section>

      {/* BANNER AlloStudios — conversión */}
      <section style={{ padding: '10px 24px 90px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', background: 'linear-gradient(100deg,#6a5bff,#a05bff)', borderRadius: 24, padding: '46px 32px', textAlign: 'center' }}>
          <p style={{ fontSize: 12.5, textTransform: 'uppercase', letterSpacing: '.18em', opacity: .85, marginBottom: 12 }}>Demo generada por AlloStudios</p>
          <h2 style={{ fontSize: 'clamp(1.7rem,4.4vw,2.6rem)', fontWeight: 800, lineHeight: 1.1, margin: '0 0 14px' }}>¿Te gusta cómo queda la web de {name}?</h2>
          <p style={{ opacity: .92, maxWidth: 520, margin: '0 auto 26px', fontSize: 16 }}>Esto es solo una demo. La dejamos funcionando de verdad — con tu dominio, tus fotos y tus textos — en 7 días.</p>
          <a href={wa} target="_blank" rel="noreferrer" style={pill('#fff', '#1e1a2b')}>Solicitar presupuesto</a>
        </div>
        <p style={{ textAlign: 'center', opacity: .4, fontSize: 12, marginTop: 20 }}>allostudios.net · Webs · Instagram · Anuncios · Asistente IA 24/7</p>
      </section>
    </div>
  )
}
