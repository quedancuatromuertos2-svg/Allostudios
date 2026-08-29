import type { Metadata } from 'next'
import Link from 'next/link'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { CATALOGO, eur, porClave } from '@/lib/precios'

export const metadata: Metadata = {
  title: 'Contratar — AlloStudios',
  description:
    'Contrata tu web, tu Instagram o la captación de clientes online, con pago seguro y sin permanencia.',
  alternates: { canonical: 'https://allostudios.net/contratar' },
}

// Las mensualidades que acompañan a una web no se listan sueltas: se activan
// al entregar, con el enlace que le mandamos al cliente.
const ACOMPANANTES = new Set(CATALOGO.map((a) => a.acompana).filter(Boolean) as string[])

export default function ContratarPage() {
  const principales = CATALOGO.filter((a) => !ACOMPANANTES.has(a.clave))

  return (
    <>
      <Navigation />
      <main className="relative z-10 pt-36 pb-section">
        <div className="max-w-5xl mx-auto px-6 md:px-12">
          <div className="text-center mb-12">
            <span className="eyebrow block mb-4">Contratar</span>
            <h1 className="font-display text-headline font-semibold text-ink text-balance">
              Elige tu servicio y págalo aquí mismo.
            </h1>
            <p className="mt-4 text-dim font-light max-w-lg mx-auto">
              Sin llamadas, sin transferencias y sin permanencia. Antes de pagar verás
              exactamente qué pagas hoy y qué se cobra después.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {principales.map((a) => {
              const mant = a.acompana ? porClave(a.acompana) : undefined
              return (
                <Link
                  key={a.clave}
                  href={`/contratar/${a.clave.toLowerCase()}`}
                  className="card p-6 flex flex-col hover:-translate-y-0.5 transition-transform duration-300"
                >
                  <h2 className="text-[16px] font-semibold text-ink">{a.nombre}</h2>
                  <p className="text-[13px] text-dim font-light leading-relaxed mt-2 flex-1">{a.desc}</p>
                  <div className="mt-5 pt-4 border-t border-border">
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-display text-[1.7rem] leading-none font-semibold text-ink tracking-[-0.03em]">
                        {eur(a.eur)}
                      </span>
                      <span className="text-[12.5px] text-muted">
                        {a.cobro === 'mes' ? 'al mes' : 'pago único'}
                      </span>
                    </div>
                    {mant && (
                      <p className="text-[12px] text-muted mt-1.5">+ {eur(mant.eur)}/mes al entregar</p>
                    )}
                    <span className="btn-accent w-full justify-center mt-4 rounded-full text-[13.5px] py-3">
                      Ver desglose
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>

          <p className="text-[12.5px] text-muted text-center mt-10 max-w-xl mx-auto">
            ¿No sabes cuál te encaja?{' '}
            <a
              href="https://wa.me/34695868793"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent underline"
            >
              Escríbenos por WhatsApp
            </a>{' '}
            y te lo decimos en dos minutos, sin compromiso.
          </p>
        </div>
      </main>
      <Footer />
    </>
  )
}
