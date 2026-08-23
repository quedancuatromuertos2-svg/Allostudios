'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LogoFull } from './Logo'

const links: { label: string; href: string; highlight?: boolean; page?: boolean }[] = [
  { label: 'Servicios', href: '#catalogo' },
  { label: 'Páginas Web', href: '#webs' },
  { label: 'Tu web gratis', href: '#tu-web', highlight: true },
  { label: 'Precios', href: '#precios' },
  { label: 'Trabaja con nosotros', href: '/afiliados', page: true },
]

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const [sobreOscuro, setSobreOscuro] = useState(false)
  const [open, setOpen] = useState(false)

  // Mientras la barra esté por encima de la cabecera oscura va en claro;
  // al salir de ella vuelve a la pastilla blanca del resto de la web.
  useEffect(() => {
    const hero = document.getElementById('hero-oscuro')
    const fn = () => {
      const y = window.scrollY
      setScrolled(y > 24)
      setSobreOscuro(hero ? y < hero.offsetHeight - 90 : false)
    }
    fn()
    window.addEventListener('scroll', fn, { passive: true })
    window.addEventListener('resize', fn)
    return () => {
      window.removeEventListener('scroll', fn)
      window.removeEventListener('resize', fn)
    }
  }, [])

  const go = (href: string) => {
    setOpen(false)
    setTimeout(() => {
      const target = document.querySelector(href)
      // Si la sección no está en esta página (ej. /tu-web), volvemos a la home con el ancla
      if (!target) { window.location.href = `/${href}`; return }
      target.scrollIntoView({ behavior: 'smooth' })
    }, open ? 200 : 0)
  }

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 inset-x-0 z-50 transition-all duration-500"
    >
      {/* Frosted pill that appears on scroll */}
      <div className={`
        mx-auto transition-all duration-500 ease-out
        ${scrolled
          ? 'max-w-5xl mt-3 px-2'
          : 'max-w-6xl mt-0 px-0'
        }
      `}>
        <div className={`
          flex items-center justify-between h-[60px] px-6 rounded-full transition-all duration-500
          ${!scrolled ? 'bg-transparent'
            : sobreOscuro
              ? 'bg-white/[0.07] border border-white/10 backdrop-blur-xl shadow-lg'
              : 'lg shadow-md'}
        `}>
          {/* Logo */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className={`flex items-center transition-all duration-500 ${
              'opacity-100'
            } ${sobreOscuro ? 'text-white' : 'text-ink'}`}
            aria-label="Ir al inicio"
          >
            <LogoFull />
          </button>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-0.5">
            {links.map(l => {
              const cls = `px-4 py-2 text-[14px] rounded-xl transition-all duration-200 font-medium ${
                l.highlight
                  ? sobreOscuro
                    ? 'text-[#c3a5ff] hover:text-white hover:bg-white/10'
                    : 'text-accent hover:text-accent-dark hover:bg-accent-light/70'
                  : sobreOscuro
                    ? 'text-white/70 hover:text-white hover:bg-white/10'
                    : 'text-dim hover:text-ink hover:bg-surface/80'
              }`
              // Los enlaces a otra página son <a>; los demás hacen scroll a su sección
              return l.page ? (
                <a key={l.label} href={l.href} className={cls}>{l.label}</a>
              ) : (
                <button key={l.label} onClick={() => go(l.href)} className={cls}>{l.label}</button>
              )
            })}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-2.5">
            <a
              href="https://wa.me/34695868793?text=Hola%2C%20quiero%20mi%20demo%20gratis.%20Mi%20negocio%20es%3A%20"
              target="_blank" rel="noopener noreferrer"
              className="btn-accent text-[13px] px-5 py-2.5 rounded-full"
            >
              Pide tu demo gratis
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setOpen(!open)}
            aria-label="Menú"
            className="md:hidden w-9 h-9 flex flex-col items-center justify-center gap-[5.5px]"
          >
            <motion.span
              animate={open ? { rotate: 45, y: 5.5 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.25 }}
              className={`w-[18px] h-[1.5px] block rounded-full origin-center ${sobreOscuro && !open ? "bg-white" : "bg-ink"}`}
            />
            <motion.span
              animate={open ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.2 }}
              className={`w-[18px] h-[1.5px] block rounded-full ${sobreOscuro && !open ? "bg-white" : "bg-ink"}`}
            />
            <motion.span
              animate={open ? { rotate: -45, y: -5.5 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.25 }}
              className={`w-[18px] h-[1.5px] block rounded-full origin-center ${sobreOscuro && !open ? "bg-white" : "bg-ink"}`}
            />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="lg md:hidden mx-4 mt-1 rounded-2xl overflow-hidden"
          >
            <div className="px-4 py-4 flex flex-col gap-1">
              {links.map(l => {
                const cls = `text-left px-4 py-3 text-[14px] rounded-xl transition-all font-medium ${
                  l.highlight ? 'text-accent hover:bg-accent-light/70' : 'text-dim hover:text-ink hover:bg-surface'
                }`
                return l.page ? (
                  <a key={l.label} href={l.href} className={cls}>{l.label}</a>
                ) : (
                  <button key={l.label} onClick={() => go(l.href)} className={cls}>{l.label}</button>
                )
              })}
              <div className="pt-3 mt-1 border-t border-border/60">
                <a
                  href="https://wa.me/34695868793?text=Hola%2C%20quiero%20mi%20demo%20gratis.%20Mi%20negocio%20es%3A%20"
                  target="_blank" rel="noopener noreferrer"
                  className="w-full btn-accent justify-center rounded-full text-[14px] py-3.5 text-center block"
                >
                  Pide tu demo gratis
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
