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
    const fn = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const go = (href: string) => {
    setOpen(false)
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled ? 'bg-white/92 backdrop-blur-2xl border-b border-border/60 shadow-xs' : ''
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-[62px] flex items-center justify-between">
        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <LogoFull />
        </button>

        <nav className="hidden md:flex items-center gap-0.5">
          {links.map(l => (
            <button key={l.label} onClick={() => go(l.href)}
              className="px-4 py-2 text-[14px] text-dim hover:text-ink rounded-lg hover:bg-surface transition-all duration-200 font-medium"
            >{l.label}</button>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <button className="px-4 py-2 text-[14px] text-dim hover:text-ink transition-colors duration-200 font-medium">
            Iniciar sesión
          </button>
          <button onClick={() => go('#precios')}
            className="btn-accent text-[13px] px-5 py-2.5 rounded-full"
          >
            Prueba gratis 7 días
          </button>
        </div>

        <button onClick={() => setOpen(!open)} className="md:hidden w-9 h-9 flex flex-col items-center justify-center gap-[5px]">
          <span className={`w-5 h-[1.5px] bg-ink transition-all duration-300 origin-center ${open ? 'rotate-45 translate-y-[3.3px]' : ''}`} />
          <span className={`w-5 h-[1.5px] bg-ink transition-all duration-300 ${open ? 'opacity-0 scale-x-0' : ''}`} />
          <span className={`w-5 h-[1.5px] bg-ink transition-all duration-300 origin-center ${open ? '-rotate-45 -translate-y-[3.3px]' : ''}`} />
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.28 }}
            className="md:hidden bg-white/95 backdrop-blur-xl border-b border-border overflow-hidden"
          >
            <div className="px-6 py-4 flex flex-col gap-1">
              {links.map(l => (
                <button key={l.label} onClick={() => go(l.href)}
                  className="text-left px-3 py-3 text-[14px] text-dim hover:text-ink rounded-xl hover:bg-surface transition-all"
                >{l.label}</button>
              ))}
              <div className="pt-3 mt-2 border-t border-border space-y-2">
                <button className="w-full text-left px-3 py-3 text-[14px] text-dim">Iniciar sesión</button>
                <button onClick={() => go('#precios')} className="w-full btn-accent justify-center rounded-full">
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
