import type { Metadata } from 'next'
import Link from 'next/link'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { CATALOGO, PACKS, WEBS, SERVICIOS, eur, luzDe, type Articulo } from '@/lib/precios'
import LuzFondo from '@/components/LuzFondo'
import { ESTADOS_INTERIOR } from '@/lib/luces'

export const metadata: Metadata = {
  title: 'Contratar tu pack, tu web o un servicio',
  description:
    'Contrata tu pack, tu web o un servicio suelto online, con pago seguro, 0 € de entrada y una cuota mensual clara.',
  alternates: { canonical: 'https://allostudios.net/contratar' },
}

// El upgrade Cinematográfica no se lista suelto: se añade dentro del pago de un pack.
void CATALOGO

function Grupo({ titulo, nota, items }: { titulo: string; nota: string; items: Articulo[] }) {
  return (
    <div className="mb-12">
      <div className="mb-5">
        <h2 className="text-[17px] font-semibold text-ink">{titulo}</h2>
        <p className="text-[13px] text-muted mt-1">{nota}</p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((a) => (
          <Link
            key={a.clave}
            href={`/contratar/${a.clave.toLowerCase()}`}
            className="card p-2 pb-6 flex flex-col hover:-translate-y-0.5 transition-transform duration-300"
          >
            <div className="h-28 rounded-[14px] mb-5" style={{ backgroundImage: `url(/marca/luces/${luzDe(a.clave)}.jpg)`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
            <div className="px-4 flex flex-col flex-1">
              <h3 className="text-[16px] font-semibold text-ink">{a.nombre}</h3>
              <p className="text-[13px] text-dim font-light leading-relaxed mt-2 flex-1">{a.desc}</p>
              <div className="mt-5 pt-4 border-t border-border">
                <div className="flex items-baseline gap-1.5">
                  <span className="font-display text-[1.7rem] leading-none font-semibold text-ink tracking-[-0.03em]">
                    {eur(a.eur)}
                  </span>
                  <span className="text-[12.5px] text-muted">al mes</span>
                </div>
                <p className="text-[12px] text-muted mt-1.5">
                  {a.permanencia ? `0 € de entrada · ${a.permanencia} meses` : 'Sin permanencia'}
                </p>
                <span className="btn-accent w-full justify-center mt-4 rounded-full text-[13.5px] py-3">
                  Ver desglose
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default function ContratarPage() {

  return (
    <div className="tema-oscuro">
      <LuzFondo estados={[ESTADOS_INTERIOR[0], ESTADOS_INTERIOR[5]]} />
      <Navigation />
      <main className="relative z-10 pt-36 pb-section">
        <div className="max-w-5xl mx-auto px-6 md:px-12">
          <div className="text-center mb-12">
            <span className="eyebrow block mb-4">Contratar</span>
            <h1 className="font-display text-headline font-semibold text-ink text-balance">
              Elige tu servicio y págalo aquí mismo.
            </h1>
            <p className="mt-4 text-dim font-light max-w-lg mx-auto">
              Sin llamadas ni transferencias: 0 € de entrada y una cuota mensual clara. Antes de
              pagar verás exactamente qué pagas hoy y qué se cobra después.
            </p>
          </div>

          <Grupo titulo="Packs" nota="Lo que recomendamos: todo en una cuota, 0 € de entrada y 12 meses de permanencia." items={PACKS} />
          <Grupo titulo="Solo la web" nota="Para quien de verdad solo quiere web. Hosting, cambios y soporte incluidos, 12 meses." items={WEBS} />
          <Grupo titulo="Servicios sueltos" nota="Se añaden a cualquier pack o se contratan solos. Sin permanencia." items={SERVICIOS} />

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
    </div>
  )
}
