import type { Metadata } from 'next'
import HeroNeon from '@/components/HeroNeon'

// Pantalla de prueba para ver la cabecera nueva sin tocar la web de verdad.
// Cuando dé el visto bueno, HeroNeon sustituye a HeroGlass en la home.
export const metadata: Metadata = {
  title: 'Prueba de cabecera',
  robots: { index: false, follow: false },
}

export default function PreviewHeroPage() {
  return (
    <>
      <HeroNeon />
      <section style={{ background: '#05050a', color: 'rgba(255,255,255,.35)', padding: '80px 24px', textAlign: 'center', fontSize: 13 }}>
        Aquí seguiría el resto de la web. Baja para ver cómo se apaga el logotipo al hacer scroll.
      </section>
    </>
  )
}
