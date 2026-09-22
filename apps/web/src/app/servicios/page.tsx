import type { Metadata } from 'next'
import Navigation from '@/components/Navigation'
import ServicesCatalogSection from '@/components/ServicesCatalogSection'
import Complementos from '@/components/home2/Complementos'
import SectoresSection from '@/components/SectoresSection'
import HowItWorksSection from '@/components/HowItWorksSection'
import ContactFormSection from '@/components/ContactFormSection'
import CTASection from '@/components/CTASection'
import Footer from '@/components/Footer'
import FloatingWhatsApp from '@/components/FloatingWhatsApp'
import ChatAllo from '@/components/ChatAllo'
import LuzFondo from '@/components/LuzFondo'
import LuzPapel from '@/components/LuzPapel'

export const metadata: Metadata = {
  title: 'Servicios sueltos: web, SEO local, reseñas, asistente de WhatsApp y anuncios',
  description: 'Cada pieza de los packs, por separado y por meses: web, salir en Google, reseñas, asistente que contesta tu WhatsApp, anuncios y captación de clientes.',
  alternates: { canonical: '/servicios' },
}

export default function Servicios() {
  return (
    <div className="tema-oscuro">
      <LuzFondo />
      <LuzPapel />
      <Navigation />
      <main className="relative z-10 pt-20">
        <ServicesCatalogSection titular="h1" />
        <Complementos />
        <SectoresSection />
        <HowItWorksSection />
        <ContactFormSection />
        <CTASection />
      </main>
      <Footer />
      <FloatingWhatsApp />
      <ChatAllo />
    </div>
  )
}
