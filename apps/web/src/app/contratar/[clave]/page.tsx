import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import Desglose from '@/components/contratar/Desglose'
import { CATALOGO, porClave, eur, luzDe } from '@/lib/precios'
import LuzFondo from '@/components/LuzFondo'
import { ESTADOS_INTERIOR } from '@/lib/luces'

export function generateStaticParams() {
  return CATALOGO.filter((a) => a.tipo !== 'extra').map((a) => ({ clave: a.clave.toLowerCase() }))
}

export function generateMetadata({ params }: { params: { clave: string } }): Metadata {
  const art = porClave(params.clave.toUpperCase())
  if (!art) return { title: 'Contratar — AlloStudios' }
  return {
    title: `Contratar ${art.nombre} — ${eur(art.eur)}/mes`,
    description: art.desc,
    alternates: { canonical: `https://allostudios.net/contratar/${art.clave.toLowerCase()}` },
  }
}

export default function ContratarArticuloPage({
  params,
  searchParams,
}: {
  params: { clave: string }
  searchParams?: { cancelado?: string }
}) {
  const art = porClave(params.clave.toUpperCase())
  if (!art || art.tipo === 'extra') notFound()

  return (
    <div className="tema-oscuro">
      <LuzFondo estados={[ESTADOS_INTERIOR[1], ESTADOS_INTERIOR[5]]} />
      <Navigation />
      <main className="relative z-10 pt-28 pb-section">
        <div className="max-w-5xl mx-auto px-6 md:px-12">
          {/* Cabecera del producto: su luz de la marca en una bandeja de cristal */}
          <div className="producto-luz hero-bandeja p-1.5 rounded-[2rem] mb-10">
            <div className="relative overflow-hidden rounded-[calc(2rem-0.375rem)] min-h-[300px] md:min-h-[360px] flex flex-col justify-end p-7 md:p-10"
              style={{ backgroundImage: `url(/marca/luces/${luzDe(art.clave)}.jpg)`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
              <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(180deg,rgba(11,11,16,.05) 0%,rgba(11,11,16,.35) 55%,rgba(11,11,16,.82) 100%)' }} />
              <div className="relative">
                <Link href="/contratar" className="lg inline-flex px-3.5 py-1.5 rounded-full text-[11px] tracking-[0.14em] uppercase text-dim hover:text-ink transition-colors mb-6">
                  ← Todos los servicios
                </Link>
                <span className="eyebrow block mb-3 text-white/80">Contratar</span>
                <h1 className="font-display text-headline font-semibold text-white text-balance">{art.nombre}</h1>
                <p className="mt-3 text-white/80 font-light max-w-xl">{art.desc}</p>
              </div>
            </div>
          </div>

          {searchParams?.cancelado && (
            <p className="mb-6 text-[13.5px] text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
              Has salido del pago sin terminar. No se te ha cobrado nada — puedes volver a
              intentarlo cuando quieras.
            </p>
          )}

          <Desglose art={art} />
        </div>
      </main>
      <Footer />
    </div>
  )
}
