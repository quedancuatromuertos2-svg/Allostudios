import type { Metadata } from 'next'
import CristalPreview from '@/components/hero/CristalPreview'

// Pantalla de pruebas de la cabecera. No toca la web de verdad.
export const metadata: Metadata = {
  title: 'Prueba de cabecera',
  robots: { index: false, follow: false },
}

export default function PreviewHeroPage() {
  return <CristalPreview />
}
