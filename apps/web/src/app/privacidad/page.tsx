import type { Metadata } from 'next'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Privacidad',
  robots: { index: false, follow: true },
}

// Política de privacidad básica (RGPD) para el formulario público y el generador de demos.
// ⚠️ Ángel: cuando te des de alta como autónomo, añade tu NIF donde pone [NIF].
export default function PrivacidadPage() {
  return (
    <>
      <Navigation />
      <main className="relative z-10 max-w-2xl mx-auto px-6 py-32">
        <h1 className="font-display text-headline font-semibold text-ink mb-8">Política de privacidad</h1>
        <div className="space-y-5 text-dim font-light text-[15px] leading-relaxed">
          <p><strong className="text-ink">Responsable del tratamiento:</strong> AlloStudios (Ángel) · NIF [NIF] · Valencia (España). Contacto: <a className="underline" href="mailto:hola.allostudios@gmail.com">hola.allostudios@gmail.com</a>.</p>

          <p><strong className="text-ink">Qué datos recogemos:</strong> los que nos facilitas en nuestros formularios — nombre del negocio, ciudad, sector, teléfono/WhatsApp y, si lo aportas, email. Para generar la demo de tu web consultamos datos públicos de tu negocio en Google (nombre, reseñas, dirección, foto y teléfono públicos de tu ficha).</p>

          <p><strong className="text-ink">Para qué los usamos (finalidad):</strong> generar tu demo, contactarte para enseñártela y enviarte un presupuesto si te interesa. No los usamos para otra cosa.</p>

          <p><strong className="text-ink">Base legal:</strong> tu consentimiento, que das al marcar la casilla y enviar el formulario.</p>

          <p><strong className="text-ink">Conservación:</strong> guardamos tus datos mientras gestionamos tu solicitud y, como máximo, 12 meses desde el último contacto, salvo que llegues a ser cliente.</p>

          <p><strong className="text-ink">Cesión a terceros:</strong> no vendemos ni cedemos tus datos. Usamos proveedores tecnológicos (alojamiento y envío de avisos) que solo los tratan por cuenta nuestra.</p>

          <p><strong className="text-ink">Tus derechos:</strong> puedes acceder, rectificar, suprimir, oponerte, limitar el tratamiento y portar tus datos escribiéndonos a <a className="underline" href="mailto:hola.allostudios@gmail.com">hola.allostudios@gmail.com</a>. También puedes reclamar ante la Agencia Española de Protección de Datos (aepd.es).</p>

          <p className="text-muted text-[13px] pt-4">Última actualización: agosto de 2026.</p>
        </div>
      </main>
      <Footer />
    </>
  )
}
