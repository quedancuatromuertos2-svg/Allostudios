import type { Metadata } from 'next'
import Navigation from '@/components/Navigation'
import HeroGlass from '@/components/HeroGlass'
import DemoGeneratorSection from '@/components/DemoGeneratorSection'
import FAQSection from '@/components/FAQSection'
import ContactFormSection from '@/components/ContactFormSection'
import CTASection from '@/components/CTASection'
import Footer from '@/components/Footer'
import FloatingWhatsApp from '@/components/FloatingWhatsApp'
import LuzFondo from '@/components/LuzFondo'
import LuzPapel from '@/components/LuzPapel'
import CintaPacks from '@/components/home2/CintaPacks'
import PruebaMercado from '@/components/home2/PruebaMercado'
import CapituloPack from '@/components/home2/CapituloPack'
import ComparaPacks from '@/components/home2/ComparaPacks'
import Complementos from '@/components/home2/Complementos'
import { VisualWeb, VisualChat, VisualInforme } from '@/components/home2/Visuales'
import { porClave } from '@/lib/precios'

export const metadata: Metadata = {
  title: 'Home nueva (vista previa)',
  robots: { index: false, follow: false },
}

/*  Propuesta de home (18/09/2026): tres packs vendidos como productos, una idea por
    pantalla, con la estética de la marca. Cuando se apruebe, sustituye a app/page.tsx.  */

export default function PreviewHome() {
  const estandar = porClave('PACK_ESTANDAR')!
  const pro = porClave('PACK_PRO')!
  const max = porClave('PACK_MAX')!

  return (
    <div className="tema-oscuro">
      <LuzFondo />
      <LuzPapel />
      <Navigation />
      <CintaPacks />
      <main className="relative z-10">
        <HeroGlass />
        <PruebaMercado />

        <CapituloPack
          id="estandar" numero="01" nombre="Estándar"
          dolor="Trabajo bien y no me encuentran."
          quien="Para el negocio que hoy no aparece cuando lo buscan, o aparece con tres fotos y sin horario."
          luz="faro"
          visual={<VisualWeb />}
          fichas={[
            { n: '7 días', t: 'Tu web, publicada', d: 'Con tu marca, tus fotos y tus precios. Perfecta en el móvil, que es desde donde te miran.' },
            { n: '1.ª', t: 'pantalla de Google en tu barrio', d: 'Tu ficha completa y trabajada cada mes: horarios, fotos, servicios, palabras que la gente busca.' },
            { n: '5★', t: 'que se piden solas', d: 'Cada cliente contento recibe la invitación a dejar reseña. Tú no persigues a nadie.' },
          ]}
          precio={estandar.eur}
          incluye={['Web Arranque', 'Hosting, cambios y soporte', 'SEO local cada mes', 'Reseñas automatizadas', 'Informe el día 28']}
          url="/contratar/pack_estandar"
        />

        <CapituloPack
          id="pro" numero="02" nombre="Pro" destacado oscuro
          dolor="Contesto tarde y se van a otro."
          quien="Para el que está cortando el pelo, con un paciente o en cocina cuando le escriben."
          luz="haz"
          visual={<VisualChat />}
          fichas={[
            { n: '22:14', t: 'la hora a la que te escriben', d: 'Y a la que tú ya has cerrado. El primero que contesta se lleva la cita.' },
            { n: '8 s', t: 'en responder', d: 'Horarios, precios, dudas y citas resueltos al momento, con el tono de tu negocio.' },
            { n: '24/7', t: 'sin que toques nada', d: 'Cae en tu agenda. Si hace falta una persona, te avisa a ti. Tú sigues trabajando.' },
          ]}
          precio={pro.eur}
          incluye={['Todo lo del Estándar', 'Web Premium con tus reseñas', 'Asistente en tu WhatsApp 24/7', 'Prioridad de entrega']}
          url="/contratar/pack_pro"
        />

        <CapituloPack
          id="max" numero="03" nombre="Max"
          dolor="Quiero llenar la agenda, no solo estar."
          quien="Para el que tiene semanas flojas y ya ha quemado dinero en anuncios que no trajeron a nadie."
          luz="prisma"
          visual={<VisualInforme />}
          fichas={[
            { n: 'Tu zona', t: 'Anuncios en Meta y Google', d: 'Solo a la gente de tu barrio que busca lo que haces. Creatividades, públicos y optimización semanal.' },
            { n: 'Día 28', t: 'qué entró y qué costó', d: 'Contactos, coste por contacto, citas. Cinco líneas por WhatsApp, sin humo.' },
            { n: 'Tú decides', t: 'cuánto invertir', d: 'La inversión va aparte y la controlas tú desde tu cuenta. Nosotros ponemos la gestión.' },
          ]}
          precio={max.eur}
          incluye={['Todo lo del Pro', 'Campañas Meta y Google gestionadas', 'Informe mensual de resultados']}
          url="/contratar/pack_max"
        />

        <ComparaPacks />
        <Complementos />
        <DemoGeneratorSection />
        <FAQSection />
        <ContactFormSection />
        <CTASection />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  )
}
