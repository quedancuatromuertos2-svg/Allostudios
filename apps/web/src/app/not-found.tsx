import type { Metadata } from 'next'
import Link from 'next/link'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Página no encontrada',
  robots: { index: false, follow: false },
}

/**
 * 404 propia. Antes no se veía nunca: el middleware mandaba cualquier
 * dirección desconocida a /login con un HTTP 200. Ahora las rutas que no
 * existen caen aquí, con el 404 de verdad y una salida hacia lo que la
 * persona probablemente venía buscando.
 */
const atajos = [
  { href: '/tu-web', titulo: 'Ver tu web gratis', texto: 'Escribe el nombre de tu negocio y te generamos una demo real.' },
  { href: '/contratar', titulo: 'Precios y contratar', texto: 'Packs desde 199 €/mes, webs desde 99 €/mes. 0 € de entrada.' },
  { href: '/afiliados', titulo: 'Programa de comerciales', texto: 'Llévate el 20 % de cada cuota durante 12 meses.' },
]

export default function NotFound() {
  return (
    <>
      <Navigation />
      <main className="relative z-10 px-6 pt-36 pb-section">
        <div className="max-w-2xl mx-auto text-center">
          <span className="eyebrow block mb-4">Error 404</span>
          <h1 className="font-display text-headline font-semibold text-ink text-balance">
            Esta página no existe.
          </h1>
          <p className="mt-4 text-dim font-light leading-relaxed max-w-md mx-auto">
            O la dirección está mal escrita, o hemos movido algo de sitio. Lo sentimos.
            Esto es lo que suele buscar la gente que acaba aquí:
          </p>

          <div className="grid sm:grid-cols-3 gap-3 mt-10 text-left">
            {atajos.map((a) => (
              <Link
                key={a.href}
                href={a.href}
                className="card p-5 hover:-translate-y-0.5 transition-transform duration-300"
              >
                <h2 className="text-[15px] font-semibold text-ink">{a.titulo}</h2>
                <p className="text-[13px] text-dim font-light leading-relaxed mt-1.5">{a.texto}</p>
              </Link>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-10">
            <Link href="/" className="btn-accent justify-center rounded-full">
              Volver al inicio
            </Link>
            <a
              href="https://wa.me/34695868793?text=Hola%2C%20buscaba%20algo%20en%20vuestra%20web%20y%20no%20lo%20encuentro."
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary justify-center rounded-full"
            >
              Preguntarnos por WhatsApp
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
