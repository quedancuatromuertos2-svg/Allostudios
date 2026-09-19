import type { Metadata } from 'next'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import TuWebForm from '@/components/TuWebForm'
import LuzFondo from '@/components/LuzFondo'
import { ESTADOS_INTERIOR } from '@/lib/luces'

export const metadata: Metadata = {
  title: 'Genera la web de tu negocio gratis',
  description:
    'Escribe el nombre de tu negocio y te generamos una demo real de tu web en 30 segundos, con tus reseñas y datos de Google. Gratis y sin crear cuenta.',
  alternates: { canonical: 'https://allostudios.net/tu-web' },
}

export default function TuWebPage({
  searchParams,
}: {
  searchParams?: { negocio?: string; ciudad?: string; nivel?: string; sector?: string }
}) {
  // Datos que llegan del generador de la home (/#tu-web) para no repetir formulario
  const negocio = String(searchParams?.negocio || '').slice(0, 120)
  const ciudad = String(searchParams?.ciudad || '').slice(0, 80) || 'Valencia'
  const nivel = ['arranque', 'premium', 'cine'].includes(String(searchParams?.nivel)) ? String(searchParams?.nivel) : 'arranque'
  const sector = String(searchParams?.sector || '').slice(0, 60) // viene de /webs/<sector>

  return (
    <div className="tema-oscuro">
      <LuzFondo estados={[ESTADOS_INTERIOR[0], ESTADOS_INTERIOR[5]]} />
      <Navigation />
      <main className="relative z-10 min-h-[100dvh] flex items-center justify-center px-6 py-32">
        <div className="max-w-xl w-full">
          <div className="text-center mb-9">
            <span className="eyebrow block mb-4">Gratis · sin crear cuenta</span>
            <h1 className="font-display text-headline font-semibold text-ink text-balance">
              Mira cómo quedaría la web de tu negocio.
            </h1>
            <p className="mt-4 text-dim font-light max-w-md mx-auto">
              {negocio
                ? 'Solo falta tu sector y un WhatsApp donde enviártela. Generamos la demo con tus datos reales de Google en 30 segundos.'
                : '¿Tu negocio no tiene web (o tiene una anticuada)? Cuando te buscan en Google, acaban en la competencia. Escribe tu negocio y te generamos una demo real — con tus reseñas y tus datos — en 30 segundos.'}
            </p>
          </div>

          <div className="hero-bandeja p-1.5 rounded-[1.6rem]">
            <div className="lg rounded-[calc(1.6rem-0.375rem)] p-6 md:p-8">
              <TuWebForm defaultNegocio={negocio} defaultCiudad={ciudad} defaultNivel={nivel} defaultSector={sector} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
