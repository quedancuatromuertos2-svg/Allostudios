import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import Desglose from '@/components/contratar/Desglose'
import { CATALOGO, porClave, eur } from '@/lib/precios'

export function generateStaticParams() {
  return CATALOGO.map((a) => ({ clave: a.clave.toLowerCase() }))
}

export function generateMetadata({ params }: { params: { clave: string } }): Metadata {
  const art = porClave(params.clave.toUpperCase())
  if (!art) return { title: 'Contratar — AlloStudios' }
  return {
    title: `Contratar ${art.nombre} — ${eur(art.eur)}${art.cobro === 'mes' ? '/mes' : ''}`,
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
  if (!art) notFound()
  const mant = art.acompana ? porClave(art.acompana) : undefined

  return (
    <>
      <Navigation />
      <main className="relative z-10 pt-36 pb-section">
        <div className="max-w-5xl mx-auto px-6 md:px-12">
          <Link href="/contratar" className="text-[13px] text-muted hover:text-ink transition-colors">
            ← Todos los servicios
          </Link>

          <div className="mt-5 mb-9">
            <span className="eyebrow block mb-3">Contratar</span>
            <h1 className="font-display text-headline font-semibold text-ink text-balance">{art.nombre}</h1>
            <p className="mt-3 text-dim font-light max-w-xl">{art.desc}</p>
          </div>

          {searchParams?.cancelado && (
            <p className="mb-6 text-[13.5px] text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
              Has salido del pago sin terminar. No se te ha cobrado nada — puedes volver a
              intentarlo cuando quieras.
            </p>
          )}

          <Desglose art={art} mantenimiento={mant} />
        </div>
      </main>
      <Footer />
    </>
  )
}
