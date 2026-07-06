import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Política de Cookies",
  description: "Política de cookies de AlloStudios. Qué cookies usamos y cómo gestionarlas.",
}

export default function CookiesPage() {
  return (
    <main className="min-h-screen bg-white py-20 px-6">
      <div className="max-w-3xl mx-auto">
        <a href="/" className="inline-flex items-center gap-2 text-[13px] text-muted hover:text-ink transition-colors mb-10">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          Volver al inicio
        </a>

        <h1 className="text-3xl font-semibold text-ink mb-2">Política de Cookies</h1>
        <p className="text-muted text-[13px] mb-10">Última actualización: mayo de 2026</p>

        <div className="prose prose-sm max-w-none text-dim leading-relaxed space-y-8">

          <section>
            <h2 className="text-[17px] font-semibold text-ink mb-3">¿Qué son las cookies?</h2>
            <p>Las cookies son pequeños ficheros de texto que se almacenan en tu dispositivo cuando visitas un sitio web. Permiten recordar tus preferencias y mejorar tu experiencia de navegación.</p>
          </section>

          <section>
            <h2 className="text-[17px] font-semibold text-ink mb-3">Cookies que utilizamos</h2>

            <div className="overflow-x-auto mt-4">
              <table className="w-full text-[13px] border-collapse">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 pr-4 font-semibold text-ink">Cookie</th>
                    <th className="text-left py-2 pr-4 font-semibold text-ink">Tipo</th>
                    <th className="text-left py-2 font-semibold text-ink">Finalidad</th>
                  </tr>
                </thead>
                <tbody className="space-y-2">
                  <tr className="border-b border-border/50">
                    <td className="py-2.5 pr-4 font-mono text-[12px]">__clerk_*</td>
                    <td className="py-2.5 pr-4">Esencial</td>
                    <td className="py-2.5">Autenticación de sesión de usuario</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-2.5 pr-4 font-mono text-[12px]">__stripe_*</td>
                    <td className="py-2.5 pr-4">Esencial</td>
                    <td className="py-2.5">Procesamiento seguro de pagos</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-2.5 pr-4 font-mono text-[12px]">_vercel_*</td>
                    <td className="py-2.5 pr-4">Técnica</td>
                    <td className="py-2.5">Rendimiento y distribución del sitio</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-[17px] font-semibold text-ink mb-3">Tipos de cookies por finalidad</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Cookies esenciales:</strong> Necesarias para el funcionamiento básico del sitio. No pueden desactivarse.</li>
              <li><strong>Cookies técnicas:</strong> Mejoran el rendimiento y la distribución del contenido.</li>
              <li><strong>Cookies analíticas:</strong> Actualmente no utilizamos cookies de análisis de terceros.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-[17px] font-semibold text-ink mb-3">Gestión de cookies</h2>
            <p>Puedes gestionar o eliminar las cookies desde la configuración de tu navegador:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">Google Chrome</a></li>
              <li><a href="https://support.mozilla.org/es/kb/habilitar-y-deshabilitar-cookies-sitios-web-rastrear-preferencias" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">Mozilla Firefox</a></li>
              <li><a href="https://support.apple.com/es-es/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">Safari</a></li>
            </ul>
            <p className="mt-2">Ten en cuenta que desactivar las cookies esenciales puede impedir el correcto funcionamiento de la plataforma.</p>
          </section>

          <section>
            <h2 className="text-[17px] font-semibold text-ink mb-3">Contacto</h2>
            <p>Para cualquier consulta sobre cookies: <a href="mailto:hola@allostudios.net" className="text-accent hover:underline">hola@allostudios.net</a></p>
          </section>

        </div>
      </div>
    </main>
  )
}
