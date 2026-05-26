'use client'

import { LogoFull } from './Logo'

const links = {
  Producto: [['Servicios', '#servicios'], ['Cómo funciona', '#como'], ['Precios', '#precios'], ['FAQ', '#faq']],
  Empresa:  [['Sobre nosotros', '#'], ['Blog', '#'], ['Trabaja con nosotros', '#'], ['Prensa', '#']],
  Legal:    [['Privacidad', '#'], ['Términos', '#'], ['Cookies', '#'], ['RGPD', '#']],
}

export default function Footer() {
  const go = (href: string) => {
    if (href === '#') return
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <footer className="bg-white border-t border-border">
      <div className="max-w-6xl mx-auto px-6 md:px-12 py-16">
        <div className="grid grid-cols-2 md:grid-cols-[2fr_1fr_1fr_1fr] gap-10 md:gap-12">

          <div className="col-span-2 md:col-span-1">
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="mb-5 block">
              <LogoFull />
            </button>
            <p className="text-[13px] text-dim font-light leading-relaxed max-w-[220px]">
              Automatización de negocios con IA. Automatiza. Comunica. Crece.
            </p>
            <div className="flex gap-3 mt-6">
              {['𝕏', 'in', 'ig'].map(s => (
                <a key={s} href="#" className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-[11px] font-semibold text-muted hover:text-ink hover:border-ink transition-all duration-300">
                  {s}
                </a>
              ))}
            </div>
          </div>

          {Object.entries(links).map(([title, items]) => (
            <div key={title}>
              <h4 className="text-[11px] font-semibold tracking-[0.18em] uppercase text-muted mb-5">{title}</h4>
              <ul className="space-y-3">
                {items.map(([label, href]) => (
                  <li key={label}>
                    <button
                      onClick={() => go(href)}
                      className="text-[13px] text-dim hover:text-ink transition-colors duration-200"
                    >
                      {label}
                    </button>
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
