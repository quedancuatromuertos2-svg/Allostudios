import type { Metadata } from 'next'
import Link from 'next/link'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Gracias — AlloStudios',
  robots: { index: false, follow: false },
}

export default function GraciasPage() {
  return (
    <>
      <Navigation />
      <main className="relative z-10 min-h-[70dvh] flex items-center justify-center px-6 pt-36 pb-section">
        <div className="max-w-lg w-full text-center">
          <span className="inline-flex w-14 h-14 rounded-full bg-accent-light text-accent items-center justify-center mb-6">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="m5 12 5 5L20 7" />
            </svg>
          </span>
          <h1 className="font-display text-headline font-semibold text-ink text-balance">
            Pago recibido. Ya estamos con ello.
          </h1>
          <p className="mt-4 text-dim font-light leading-relaxed">
            Te acabamos de enviar la factura por email. Te escribimos por WhatsApp
            <strong className="text-ink font-semibold"> hoy mismo</strong> para pedirte lo poco que
            necesitamos: tus fotos, tus textos y poco más.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
            <a
              href="https://wa.me/34695868793?text=Hola%2C%20acabo%20de%20contratar%20y%20quiero%20empezar."
              target="_blank"
              rel="noopener noreferrer"
              className="btn-accent justify-center rounded-full"
            >
              Escribirnos ahora
            </a>
            <Link href="/" className="btn-secondary justify-center rounded-full">
              Volver al inicio
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
