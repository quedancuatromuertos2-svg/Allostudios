import { HeroSection } from "@/components/landing/hero"
import { FeaturesSection } from "@/components/landing/features"
import { NichesSection } from "@/components/landing/niches"
import { TestimonialsSection } from "@/components/landing/testimonials"
import { PricingSection } from "@/components/landing/pricing"
import { FAQSection } from "@/components/landing/faq"
import { CTASection } from "@/components/landing/cta"
import { LandingNav } from "@/components/landing/nav"
import { Footer } from "@/components/landing/footer"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <LandingNav />
      <main>
        <HeroSection />
        <FeaturesSection />
        <NichesSection />
        <TestimonialsSection />
        <PricingSection />
        <FAQSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}
