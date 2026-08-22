import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'AlloStudios — Webs, Instagram y Anuncios para negocios locales de Valencia'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#0E0E10',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'flex-end',
          padding: '72px 80px',
          position: 'relative',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        {/* Background gradient */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(ellipse 80% 60% at 60% 20%, rgba(91,91,214,0.28) 0%, transparent 70%)',
          }}
        />
        {/* Grid lines subtle */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        {/* Logo mark */}
        <div style={{ position: 'absolute', top: 64, left: 80, display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            background: '#5B5BD6',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" fill="white"/>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              <line x1="12" y1="19" x2="12" y2="23" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              <line x1="8" y1="23" x2="16" y2="23" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <span style={{ color: 'white', fontSize: 22, fontWeight: 700, letterSpacing: '-0.5px' }}>AlloStudios</span>
        </div>

        {/* Tags */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 24, position: 'relative', zIndex: 10 }}>
          {['Webs desde 499 €', 'Instagram gestionado', 'Anuncios · IA 24/7'].map((tag) => (
            <div
              key={tag}
              style={{
                background: 'rgba(91,91,214,0.18)',
                border: '1px solid rgba(91,91,214,0.4)',
                borderRadius: 100,
                padding: '6px 16px',
                color: '#9090F0',
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: '0.02em',
              }}
            >
              {tag}
            </div>
          ))}
        </div>

        {/* Headline */}
        <div style={{ position: 'relative', zIndex: 10, marginBottom: 20 }}>
          <div style={{
            fontSize: 58,
            fontWeight: 800,
            color: 'white',
            lineHeight: 1.1,
            letterSpacing: '-2px',
            maxWidth: 780,
          }}>
            Tu negocio, lleno.
            <br />
            <span style={{ color: '#7B7BDE' }}>Tu marketing, resuelto.</span>
          </div>
        </div>

        {/* Subheadline */}
        <div style={{
          fontSize: 22,
          color: 'rgba(255,255,255,0.55)',
          fontWeight: 400,
          maxWidth: 640,
          lineHeight: 1.5,
          position: 'relative',
          zIndex: 10,
          marginBottom: 40,
        }}>
          Webs, Instagram, anuncios y un asistente de IA que responde 24/7. Para negocios locales de Valencia.
        </div>

        {/* Stats row */}
        <div style={{ display: 'flex', gap: 40, position: 'relative', zIndex: 10 }}>
          {[['7 días', 'Tu web online'], ['24/7', 'IA respondiendo'], ['499 €', 'Desde']].map(([n, l]) => (
            <div key={n} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={{ color: 'white', fontSize: 28, fontWeight: 800, letterSpacing: '-1px' }}>{n}</span>
              <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, fontWeight: 500 }}>{l}</span>
            </div>
          ))}
        </div>

        {/* URL badge */}
        <div style={{
          position: 'absolute',
          bottom: 64,
          right: 80,
          color: 'rgba(255,255,255,0.3)',
          fontSize: 16,
          fontWeight: 500,
          letterSpacing: '0.05em',
        }}>
          allostudios.net
        </div>
      </div>
    ),
    { ...size }
  )
}
