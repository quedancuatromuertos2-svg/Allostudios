'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LogoFull } from './Logo'

const links = [
  { label: 'Demo IA', href: '#demo' },
  { label: 'Páginas Web', href: '#webs' },
  { label: 'Precios', href: '#precios' },
  { label: 'FAQ', href: '#faq' },
]

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const go = (href: string) => {
    setOpen(false)
    setTimeout(() => {
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
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
          flex items-center justify-between h-[60px] px-6 transition-all duration-500
          ${scrolled
            ? 'bg-white/90 backdrop-blur-2xl rounded-2xl border border-border/50 shadow-sm'
            : 'bg-transparent'
          }
        `}>
          {/* Logo */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center"
            aria-label="Ir al inicio"
          >
            <LogoFull />
          </button>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-0.5">
            {links.map(l => (
              <button
                key={l.label}
                onClick={() => go(l.href)}
                className="px-4 py-2 text-[14px] text-dim hover:text-ink rounded-xl hover:bg-surface/80 transition-all duration-200 font-medium"
              >
                {l.label}
              </button>
            ))}
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-2.5">
            <button className="px-4 py-2 text-[13.5px] text-dim hover:text-ink transition-colors duration-200 font-medium rounded-xl hover:bg-surface/80">
              Iniciar sesión
            </button>
            <button
              onClick={() => go('#precios')}
              className="btn-accent text-[13px] px-5 py-2.5 rounded-full"
            >
              Prueba gratis 7 días
            </button>
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
              className="w-[18px] h-[1.5px] bg-ink block rounded-full origin-center"
            />
            <motion.span
              animate={open ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.2 }}
              className="w-[18px] h-[1.5px] bg-ink block rounded-full"
            />
            <motion.span
              animate={open ? { rotate: -45, y: -5.5 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.25 }}
              className="w-[18px] h-[1.5px] bg-ink block rounded-full origin-center"
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
            className="md:hidden mx-4 mt-1 bg-white/95 backdrop-blur-xl rounded-2xl border border-border shadow-lg overflow-hidden"
          >
            <div className="px-4 py-4 flex flex-col gap-1">
              {links.map(l => (
                <button
                  key={l.label}
                  onClick={() => go(l.href)}
                  className="text-left px-4 py-3 text-[14px] text-dim hover:text-ink rounded-xl hover:bg-surface transition-all font-medium"
                >
                  {l.label}
                </button>
              ))}
              <div className="pt-3 mt-1 border-t border-border/60 space-y-2">
                <button className="w-full text-left px-4 py-3 text-[14px] text-dim font-medium">
                  Iniciar sesión
                </button>
                <button
                  onClick={() => go('#precios')}
                  className="w-full btn-accent justify-center rounded-full text-[14px] py-3.5"
                >
                  Prueba gratis 7 días
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
