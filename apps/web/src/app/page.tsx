import Navigation from '@/components/Navigation'
import HeroGlass from '@/components/HeroGlass'
import LogoBand from '@/components/LogoBand'
import ServicesCatalogSection from '@/components/ServicesCatalogSection'
import ContactFormSection from '@/components/ContactFormSection'
import SectoresSection from '@/components/SectoresSection'
import WebsSection from '@/components/WebsSection'
import DemoGeneratorSection from '@/components/DemoGeneratorSection'
import ServicesSection from '@/components/ServicesSection'
import HowItWorksSection from '@/components/HowItWorksSection'
import PricingSection from '@/components/PricingSection'
import TestimonialsSection from '@/components/TestimonialsSection'
import FAQSection from '@/components/FAQSection'
import ComercialesSection from '@/components/ComercialesSection'
import CTASection from '@/components/CTASection'
import Footer from '@/components/Footer'
import FloatingWhatsApp from '@/components/FloatingWhatsApp'

export default function Home() {
  return (
    <>
      <Navigation />
      <main className="relative z-10">
        <HeroGlass />
        <LogoBand />
        <DemoGeneratorSection />
        <ServicesCatalogSection />
        <SectoresSection />
        <WebsSection />
        <ServicesSection />
        <HowItWorksSection />
        <TestimonialsSection />
        <PricingSection />
        <FAQSection />
        <ContactFormSection />
        <ComercialesSection />
        <CTASection />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </>
  )
}
