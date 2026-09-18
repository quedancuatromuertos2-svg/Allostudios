'use client'

import { useEffect } from 'react'

// Botón de imprimir/guardar PDF. Con ?print=1 abre el diálogo solo (venta presencial).
export default function BotonImprimir({ auto }: { auto?: boolean }) {
  useEffect(() => {
    if (auto) {
      const t = setTimeout(() => window.print(), 400)
      return () => clearTimeout(t)
    }
  }, [auto])
  return (
    <button type="button" className="p" onClick={() => window.print()}>
      Imprimir / guardar PDF
    </button>
  )
}
