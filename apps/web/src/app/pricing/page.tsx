import PricingSection from "@/components/PricingSection"
import { LogoFull } from "@/components/Logo"
import Link from "next/link"

export const metadata = { title: "Precios � AlloStudios", description: "Planes de recepcionista IA para tu negocio. Desde 399��/mes con 7 días de prueba gratuita." }

export default function PricingPage() {
  return (
    <div className="min-h-screen" style={{ background: "#FAFAF9" }}>
      <header className="border-b border-border bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/">
            <LogoFull size="sm" />
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-[13px] text-muted hover:text-ink transition-colors font-medium">
              Iniciar sesión
            </Link>
            <Link href="/register"
              className="px-4 py-2 rounded-lg bg-accent text-white text-[13px] font-semibold hover:bg-accent-dark transition-all">
              Empezar gratis
            </Link>
          </div>
        </div>
      </header>

      <div className="pt-12 pb-4 text-center px-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent/8 border border-accent/15 text-accent text-[12.5px] font-semibold mb-5">
          7 días de prueba gratuita · Sin compromiso
        </div>
        <h1 className="text-[2.2rem] sm:text-[2.8rem] font-semibold text-ink tracking-[-0.035em] leading-tight max-w-2xl mx-auto">
          Un precio claro.<br />Un bot que no para.
        </h1>
        <p className="text-dim text-[1rem] mt-4 max-w-md mx-auto leading-relaxed">
          Tu recepcionista IA atiende llamadas 24/7, reserva citas y captura leads. Sin contratos, sin permanencia.
        </p>
      </div>

      <PricingSection />

      <div className="py-16 text-center px-6 border-t border-border">
        <p className="text-[13.5px] text-muted mb-6">¿Tienes dudas? Escríbenos y te respondemos en menos de 1 hora.</p>
        <a href="https://wa.me/34695868793?text=Hola%2C%20quiero%20saber%20m%C3%A1s%20sobre%20AlloStudios"
          target="_blank"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#25D366] text-white text-[13.5px] font-semibold hover:opacity-90 transition-opacity">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347"/>
          </svg>
          Hablar por WhatsApp
        </a>
      </div>
    </div>
  )
}
