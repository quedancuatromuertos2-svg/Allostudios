'use client'

import { useEffect, useState } from 'react'

/*  Cinta de productos (como la de Apple bajo la cabecera): fija mientras se recorren
    los capítulos, marca el que está en pantalla. Solo aparece pasado el hero.          */

const ITEMS = [
  ['estandar', 'Estándar'],
  ['pro', 'Pro'],
  ['max', 'Max'],
  ['compara', 'Compara'],
  ['complementos', 'Complementos'],
]

export default function CintaPacks() {
  const [activo, setActivo] = useState('')
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const secs = ITEMS.map(([id]) => document.getElementById(id)).filter(Boolean) as HTMLElement[]
    const onScroll = () => {
      setVisible(window.scrollY > window.innerHeight * 0.8)
      const y = window.scrollY + window.innerHeight * 0.4
      let a = ''
      for (const s of secs) if (s.offsetTop <= y) a = s.id
      setActivo(a)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div
      className={`fixed left-1/2 -translate-x-1/2 z-40 transition-all duration-500 ${visible ? 'top-[84px] opacity-100' : 'top-[60px] opacity-0 pointer-events-none'}`}
    >
      <nav className="lg rounded-full px-2 py-1.5 flex items-center gap-1 text-[12.5px] font-medium">
        {ITEMS.map(([id, label]) => (
          <a
            key={id}
            href={`#${id}`}
            className={`px-3.5 py-1.5 rounded-full transition-colors ${activo === id ? 'bg-ink text-white' : 'text-dim hover:text-ink'}`}
          >
            {label}
          </a>
        ))}
      </nav>
    </div>
  )
}
