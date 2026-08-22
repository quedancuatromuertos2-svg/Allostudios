'use client'

import { LogoFull } from './Logo'
import Link from 'next/link'

const SOCIAL_LINKS = [
  { label: 'ig', href: 'https://www.instagram.com/allostudios_' },
  { label: 'tt', href: 'https://www.tiktok.com/@allostudioss' },
]

const anchorLinks = {
  Producto: [['Servicios', '#servicios'], ['Tu web gratis', '#tu-web'], ['Cómo funciona', '#como'], ['Precios', '#precios'], ['FAQ', '#faq']],
}

const pageLinks = {
  Legal: [['Privacidad', '/privacidad'], ['Términos', '/terminos'], ['Cookies', '/cookies']],
}

export default function Footer() {
  const go = (href: string) => {
    const target = document.querySelector(href)
    // Si la sección no está en esta página (ej. /tu-web), volvemos a la home con el ancla
    if (!target) { window.location.href = `/${href}`; return }
    target.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <footer className="bg-white border-t border-border">
      <div className="max-w-6xl mx-auto px-6 md:px-12 py-16">
        <div className="grid grid-cols-2 md:grid-cols-[2fr_1fr_1fr] gap-10 md:gap-12">

          <div className="col-span-2 md:col-span-1">
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="mb-5 block">
              <LogoFull />
            </button>
            <p className="text-[13px] text-dim font-light leading-relaxed max-w-[220px]">
              Automatización de negocios con IA. Automatiza. Comunica. Crece.
            </p>
            <div className="flex gap-3 mt-6">
              {SOCIAL_LINKS.map(s => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-[11px] font-semibold text-muted hover:text-ink hover:border-ink transition-all duration-300">
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          {Object.entries(anchorLinks).map(([title, items]) => (
            <div key={title}>
              <h4 className="text-[11px] font-semibold tracking-[0.18em] uppercase text-muted mb-5">{title}</h4>
              <ul className="space-y-3">
                {items.map(([label, href]) => (
                  <li key={label}>
                    <button onClick={() => go(href)} className="text-[13px] text-dim hover:text-ink transition-colors duration-200">
                      {label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {Object.entries(pageLinks).map(([title, items]) => (
            <div key={title}>
              <h4 className="text-[11px] font-semibold tracking-[0.18em] uppercase text-muted mb-5">{title}</h4>
              <ul className="space-y-3">
                {items.map(([label, href]) => (
                  <li key={label}>
                    <Link href={href} className="text-[13px] text-dim hover:text-ink transition-colors duration-200">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 pt-7 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[12px] text-muted">© 2026 AlloStudios. Todos los derechos reservados.</p>
          <p className="text-[11px] text-muted/60 tracking-[0.06em]">AUTOMATIZA · COMUNICA · CRECE</p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-muted hover:text-ink hover:border-ink transition-all duration-300"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M6 10V2M2 6l4-4 4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </footer>
  )
}
