'use client'

import { useEffect, useState } from 'react'

// Variantes de diseño en revisión: ?hero=cartel|marco|luz  ?webs=vitrina|editorial|luz  ?servicios=papel|grafito  ?cierre=faro|papel
// Cuando Ángel elige, la ganadora queda como única y este hook desaparece.
export function useVariante(clave: string, defecto: string) {
  const [v, setV] = useState(defecto)
  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get(clave)
    if (q) setV(q)
  }, [clave])
  return v
}
