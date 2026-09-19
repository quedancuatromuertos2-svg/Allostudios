import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import FloatingWhatsApp from '@/components/FloatingWhatsApp'
import LuzFondo from '@/components/LuzFondo'
import LuzPapel from '@/components/LuzPapel'
import CTASection from '@/components/CTASection'
import { SECTORES, sectorDe, type Sector } from '@/lib/sectores'
import { ADNS } from '@/lib/adn'
import { PACKS, WEBS, eur } from '@/lib/precios'

/*  /webs/<sector>: la página que Google posiciona para «web para peluquerías en Valencia».
    Hero con el mock de una web del gremio en su propio ADN (colores y tipografías del generador),
    los tres dolores del sector, qué lleva la web, precios y preguntas frecuentes con schema FAQ.
    Estática: se generan las 9 en el build.                                                       */

export const dynamicParams = false
export function generateStaticParams() { return SECTORES.map((s) => ({ sector: s.slug })) }

export function generateMetadata({ params }: { params: { sector: string } }): Metadata {
  const s = sectorDe(params.sector)
  if (!s) return {}
  return {
    title: s.titulo,
    description: s.sub,
    alternates: { canonical: `/webs/${s.slug}` },
    openGraph: { title: s.titulo, description: s.sub, url: `https://allostudios.net/webs/${s.slug}`, images: [{ url: 'https://allostudios.net/marca/og.jpg', width: 1200, height: 630, alt: 'allo.' }] },
  }
}

/* El mock: la cabecera de una web del sector, en un portátil, con el ADN real del generador */
function MockWeb({ adn, ej, busqueda }: { adn: (typeof ADNS)[number]; ej: Sector['ejemplo']; busqueda: string }) {
  return (
    <div className="relative">
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link rel="stylesheet" href={adn.fuentes.url} />
      {/* la búsqueda que lo encuentra */}
      <div className="mx-auto mb-4 w-fit max-w-full flex items-center gap-2 rounded-full pl-3 pr-4 py-2 text-[13px]" style={{ background: "#fff", color: "#18181B", boxShadow: "0 10px 30px -14px rgba(0,0,0,.6)" }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4285F4" strokeWidth="2.2" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
        <span className="truncate">{busqueda}</span>
        <span className="ml-2 text-[11px] text-[#1a7f37] font-semibold whitespace-nowrap">· 1.º resultado</span>
      </div>
      <div className="rounded-[1.4rem] p-1.5 bg-white/[.06] ring-1 ring-white/10">
        <div className="rounded-[calc(1.4rem-0.375rem)] overflow-hidden relative aspect-[16/10]" style={{ background: adn.bg, fontFamily: adn.fuentes.texto }}>
          <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(60% 70% at 20% 30%, ${adn.luz[0]}66, transparent 70%), radial-gradient(50% 60% at 85% 75%, ${adn.luz[1]}55, transparent 70%)` }} />
          {/* barra */}
          <div className="relative flex items-center justify-between px-5 md:px-7 pt-4 md:pt-5 text-white/85">
            <span className="text-[13px] md:text-[15px] tracking-tight" style={{ fontFamily: adn.fuentes.display, fontWeight: adn.fuentes.displayPeso }}>{ej.nombre}</span>
            <span className="hidden sm:flex gap-4 text-[10px] uppercase tracking-[0.18em] text-white/55"><span>Servicios</span><span>Reseñas</span><span>Contacto</span></span>
            <span className="rounded-full px-3 py-1 text-[10px] md:text-[11px] font-semibold" style={{ background: adn.acento, color: adn.bg }}>{ej.cta}</span>
          </div>
          {/* titular */}
          <div className="relative px-5 md:px-7 pt-6 md:pt-10">
            <div className="text-[9px] md:text-[10px] uppercase tracking-[0.22em] text-white/50 mb-2 md:mb-3">{adn.eyebrow} · Valencia</div>
            <div className="text-white leading-[1.05] tracking-[-0.01em] text-[clamp(1.5rem,3.6vw,2.6rem)] max-w-full sm:max-w-[70%]" style={{ fontFamily: adn.fuentes.display, fontWeight: adn.fuentes.displayPeso }}>
              {ej.claim} <em style={{ color: adn.acento, fontStyle: adn.fuentes.display.includes('Serif') ? 'italic' : 'normal' }}>{ej.palabra}</em>
            </div>
            <div className="mt-3 md:mt-4 flex items-center gap-2 text-[10px] md:text-[11px] text-white/70">
              <span className="text-amber-300">★★★★★</span> 4,9 · 184 reseñas <span className="text-white/35">·</span> Abierto · cierra 20:30
            </div>
          </div>
          {/* carta */}
          <div className="hidden sm:block absolute right-4 md:right-7 bottom-4 md:bottom-6 w-[46%] md:w-[38%] rounded-xl p-3 md:p-4 text-[10px] md:text-[12px]" style={{ background: adn.papel, color: adn.tinta, boxShadow: '0 30px 60px -30px rgba(0,0,0,.7)' }}>
            <div className="text-[8.5px] md:text-[9.5px] uppercase tracking-[0.18em] opacity-60 mb-1.5 md:mb-2">Servicios</div>
            {ej.servicios.map(([n, p]) => (
              <div key={n} className="flex justify-between gap-2 py-1 md:py-1.5 border-t" style={{ borderColor: `${adn.tinta}1a` }}><span>{n}</span><span className="font-semibold" style={{ color: adn.acento2 }}>{p}</span></div>
            ))}
          </div>
          {/* whatsapp */}
          <div className="absolute left-5 md:left-7 bottom-4 md:bottom-6 flex items-center gap-2 rounded-full bg-[#25D366] text-white pl-2 pr-3 py-1.5 text-[10px] md:text-[11px] font-semibold shadow-lg">
            <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center"><svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2z" /></svg></span>
            Reservar por WhatsApp
          </div>
        </div>
      </div>
    </div>
  )
}

export default function SectorPage({ params }: { params: { sector: string } }) {
  const s = sectorDe(params.sector)
  if (!s) notFound()
  const adn = ADNS.find((a) => a.clave === s.adn) || ADNS[ADNS.length - 1]
  const generador = `/tu-web?sector=${encodeURIComponent(s.sectorForm)}`
  const otros = SECTORES.filter((o) => o.slug !== s.slug)
  const faqSchema = {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: s.faq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
  }
  const servicioSchema = {
    '@context': 'https://schema.org', '@type': 'Service', name: s.titulo, serviceType: 'Diseño web', areaServed: 'Valencia',
    provider: { '@type': 'Organization', name: 'AlloStudios', url: 'https://allostudios.net' },
    offers: { '@type': 'Offer', price: '99', priceCurrency: 'EUR', description: 'Web Arranque: 99 €/mes, 0 € de entrada, 12 meses' },
  }

  return (
    <div className="tema-oscuro">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([faqSchema, servicioSchema]) }} />
      <LuzFondo />
      <LuzPapel />
      <Navigation />
      <main className="relative z-10">
        {/* Hero */}
        <section className="relative pt-32 md:pt-40 pb-16 md:pb-24 px-6">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-[1fr_1.1fr] gap-12 lg:gap-16 items-center">
            <div>
              <span className="eyebrow block mb-5">Webs para {s.nombre} · Valencia</span>
              <h1 className="font-display text-[clamp(2.2rem,4.6vw,3.6rem)] leading-[1.04] font-semibold tracking-[-0.04em] text-ink text-balance">{s.titulo}</h1>
              <p className="mt-5 text-[16px] md:text-[17px] text-dim font-light leading-relaxed max-w-lg">{s.sub}</p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a href={generador} className="btn-accent rounded-full px-6 py-3 text-[14px] font-semibold inline-flex items-center gap-2">
                  Mira la tuya gratis en 30 s
                  <span className="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center"><svg width="12" height="12" viewBox="0 0 14 14" fill="none"><path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
                </a>
                <a href="/#elegir" className="lg btn-secundario rounded-full px-5 py-3 text-[14px] font-semibold text-ink">Ver packs</a>
              </div>
              <div className="mt-8 grid grid-cols-3 gap-4 max-w-md text-[12.5px] text-muted">
                <div><strong className="block text-ink text-[15px]">0 €</strong>de entrada</div>
                <div><strong className="block text-ink text-[15px]">7 días</strong>y publicada</div>
                <div><strong className="block text-ink text-[15px]">99 €/mes</strong>todo incluido</div>
              </div>
            </div>
            <MockWeb adn={adn} ej={s.ejemplo} busqueda={s.busqueda} />
          </div>
        </section>

        {/* Dolores */}
        <section className="papel relative py-section overflow-hidden">
          <div className="max-w-6xl mx-auto px-6 md:px-12">
            <span className="eyebrow block mb-4 text-center">Lo que te está costando clientes</span>
            <h2 className="font-display text-headline font-semibold text-ink text-center text-balance max-w-2xl mx-auto">Si tienes {s.singular}, esto te suena.</h2>
            <div className="mt-12 grid md:grid-cols-3 gap-4">
              {s.dolores.map(([t, d], i) => (
                <div key={t} className="card rounded-2xl p-6 bg-white">
                  <div className="text-[11px] font-mono text-muted mb-3">0{i + 1}</div>
                  <h3 className="text-[17px] font-semibold text-ink leading-snug">{t}</h3>
                  <p className="mt-2 text-[14px] text-dim leading-relaxed">{d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Qué lleva */}
        <section className="relative py-section">
          <div className="max-w-6xl mx-auto px-6 md:px-12 grid lg:grid-cols-[1fr_1fr] gap-12 items-start">
            <div>
              <span className="eyebrow block mb-4">Qué lleva la web de {s.singular}</span>
              <h2 className="font-display text-headline font-semibold text-ink text-balance">Hecha para que te escriban, no para que te miren.</h2>
              <p className="mt-4 text-dim font-light leading-relaxed max-w-md">Con tu marca, tus fotos y tus precios. Perfecta en el móvil, que es desde donde te buscan siete de cada diez. Dominio, hosting, cambios y soporte incluidos.</p>
              <a href={generador} className="mt-7 inline-flex items-center gap-2 text-accent font-semibold text-[14px] underline underline-offset-4">Genera la de tu negocio gratis →</a>
            </div>
            <ul className="grid sm:grid-cols-2 gap-3">
              {s.lleva.map((l) => (
                <li key={l} className="lg rounded-xl px-4 py-3.5 text-[14px] text-ink flex items-start gap-3">
                  <span className="mt-0.5 w-5 h-5 rounded-full bg-accent/20 text-accent flex items-center justify-center shrink-0"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 5 5L20 7" /></svg></span>
                  {l}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Precios */}
        <section className="papel papel-violeta relative py-section overflow-hidden">
          <div className="max-w-6xl mx-auto px-6 md:px-12">
            <span className="eyebrow block mb-4 text-center">Precios</span>
            <h2 className="font-display text-headline font-semibold text-ink text-center text-balance">Solo la web, o la web con Google y WhatsApp.</h2>
            <div className="mt-12 grid md:grid-cols-3 gap-4">
              {WEBS.map((w) => (
                <a key={w.clave} href={`/contratar/${w.clave.toLowerCase()}`} className="card rounded-2xl p-6 bg-white block hover:-translate-y-0.5 transition-transform duration-500">
                  <div className="text-[11px] uppercase tracking-[0.16em] text-muted font-semibold">Solo web</div>
                  <div className="mt-1 text-[19px] font-semibold text-ink">{w.nombre.replace('Web ', '')}</div>
                  <div className="mt-3 font-display text-[2rem] leading-none font-semibold text-ink tracking-[-0.03em]">{eur(w.eur)}<span className="text-[13px] text-muted font-normal tracking-normal">/mes</span></div>
                  <p className="mt-3 text-[13px] text-dim leading-relaxed">{w.desc}</p>
                </a>
              ))}
            </div>
            <div className="mt-6 grid md:grid-cols-3 gap-4">
              {PACKS.map((p, i) => (
                <a key={p.clave} href={`/#${['estandar', 'pro', 'max'][i]}`} className={`rounded-2xl p-6 block transition-transform duration-500 hover:-translate-y-0.5 ${i === 1 ? 'bg-ink text-white' : 'card bg-white'}`}>
                  <div className={`text-[11px] uppercase tracking-[0.16em] font-semibold ${i === 1 ? 'text-white/60' : 'text-muted'}`}>Pack</div>
                  <div className={`mt-1 text-[19px] font-semibold ${i === 1 ? 'text-white' : 'text-ink'}`}>{p.nombre.replace('Pack ', '')}</div>
                  <div className={`mt-3 font-display text-[2rem] leading-none font-semibold tracking-[-0.03em] ${i === 1 ? 'text-white' : 'text-ink'}`}>{eur(p.eur)}<span className={`text-[13px] font-normal tracking-normal ${i === 1 ? 'text-white/60' : 'text-muted'}`}>/mes</span></div>
                  <p className={`mt-3 text-[13px] leading-relaxed ${i === 1 ? 'text-white/75' : 'text-dim'}`}>{p.desc}</p>
                </a>
              ))}
            </div>
            <p className="mt-6 text-center text-[13px] text-muted">Todo con 0 € de entrada, 12 meses y después mes a mes. <a href="/contrato" className="underline underline-offset-4">Contrato a la vista</a>.</p>
          </div>
        </section>

        {/* FAQ */}
        <section className="relative py-section">
          <div className="max-w-3xl mx-auto px-6">
            <span className="eyebrow block mb-4 text-center">Dudas de {s.nombre}</span>
            <h2 className="font-display text-headline font-semibold text-ink text-center text-balance">Lo que nos preguntan antes de empezar.</h2>
            <div className="mt-10 space-y-3">
              {s.faq.map(([q, a]) => (
                <details key={q} className="lg rounded-2xl px-6 py-4 group">
                  <summary className="cursor-pointer list-none flex items-center justify-between gap-4 text-[15.5px] font-semibold text-ink">{q}<span className="text-muted group-open:rotate-45 transition-transform duration-500">+</span></summary>
                  <p className="mt-3 text-[14px] text-dim leading-relaxed">{a}</p>
                </details>
              ))}
            </div>
            <div className="mt-12 text-center">
              <span className="text-[12px] uppercase tracking-[0.18em] text-muted">Otros sectores</span>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {otros.map((o) => <a key={o.slug} href={`/webs/${o.slug}`} className="lg rounded-full px-4 py-2 text-[13px] text-ink">{o.nombre}</a>)}
              </div>
            </div>
          </div>
        </section>

        <CTASection />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  )
}
