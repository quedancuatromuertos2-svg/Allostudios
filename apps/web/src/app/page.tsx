'use client'

import Navigation from '@/components/Navigation'
import HeroSection from '@/components/HeroSection'
import LogoBand from '@/components/LogoBand'
import SectoresSection from '@/components/SectoresSection'
import WebsSection from '@/components/WebsSection'
import ServicesSection from '@/components/ServicesSection'
import HowItWorksSection from '@/components/HowItWorksSection'
import PricingSection from '@/components/PricingSection'
import TestimonialsSection from '@/components/TestimonialsSection'
import FAQSection from '@/components/FAQSection'
import CTASection from '@/components/CTASection'
import Footer from '@/components/Footer'
import FloatingWhatsApp from '@/components/FloatingWhatsApp'

export default function Home() {
  return (
    <>
      <Navigation />
      <main>
        <HeroSection />
        <LogoBand />
        <SectoresSection />
        <WebsSection />
        <ServicesSection />
        <HowItWorksSection />
        <PricingSection />
        <TestimonialsSection />
        <FAQSection />
        <CTASection />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </>
  )
}
