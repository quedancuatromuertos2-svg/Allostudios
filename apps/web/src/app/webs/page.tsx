import type { Metadata } from 'next'
import Navigation from '@/components/Navigation'
import WebsSection from '@/components/WebsSection'
import DemoGeneratorSection from '@/components/DemoGeneratorSection'
import ElegirPack from '@/components/home2/ElegirPack'
import SectoresSection from '@/components/SectoresSection'
import CTASection from '@/components/CTASection'
import Footer from '@/components/Footer'
import FloatingWhatsApp from '@/components/FloatingWhatsApp'
import LuzFondo from '@/components/LuzFondo'
import LuzPapel from '@/components/LuzPapel'

export const metadata: Metadata = {
  title: 'Páginas web para negocios locales desde 99 €/mes',
  description: 'Web Arranque, Pro o Cinematográfica: 0 € de entrada, lista en 7 días, con dominio, hosting, cambios y soporte incluidos. Mira gratis cómo quedaría la tuya.',
  alternates: { canonical: '/webs' },
}

export default function Webs() {
  return (
    <div className="tema-oscuro">
      <LuzFondo />
      <LuzPapel />
      <Navigation />
      <main className="relative z-10 pt-20">
        <WebsSection titular="h1" />
        {/* La tienda de la home, abierta en «Solo la web» */}
        <ElegirPack inicial={1} />
        <SectoresSection />
        <DemoGeneratorSection />
        <CTASection />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  )
}
