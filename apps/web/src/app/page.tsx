import Navigation from '@/components/Navigation'
import HeroGlass from '@/components/HeroGlass'
import ServicesCatalogSection from '@/components/ServicesCatalogSection'
import ContactFormSection from '@/components/ContactFormSection'
import SectoresSection from '@/components/SectoresSection'
import WebsSection from '@/components/WebsSection'
import DemoGeneratorSection from '@/components/DemoGeneratorSection'
import ServicesSection from '@/components/ServicesSection'
import HowItWorksSection from '@/components/HowItWorksSection'
import PricingSection from '@/components/PricingSection'
import FAQSection from '@/components/FAQSection'
import ComercialesSection from '@/components/ComercialesSection'
import CTASection from '@/components/CTASection'
import Footer from '@/components/Footer'
import FloatingWhatsApp from '@/components/FloatingWhatsApp'
import LuzFondo from '@/components/LuzFondo'
import LuzPapel from '@/components/LuzPapel'

export default function Home() {
  return (
    <div className="tema-oscuro">
      <LuzFondo />
      <LuzPapel />
      <Navigation />
      <main className="relative z-10">
        <HeroGlass />
        <DemoGeneratorSection />
        <ServicesCatalogSection />
        <SectoresSection />
        <WebsSection />
        <ServicesSection />
        <HowItWorksSection />
        <PricingSection />
        <FAQSection />
        <ContactFormSection />
        <ComercialesSection />
        <CTASection />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  )
}
