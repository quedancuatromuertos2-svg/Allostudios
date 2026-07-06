import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Términos y Condiciones",
  description: "Términos y condiciones de uso de la plataforma AlloStudios.",
}

export default function TerminosPage() {
  return (
    <main className="min-h-screen bg-white py-20 px-6">
      <div className="max-w-3xl mx-auto">
        <a href="/" className="inline-flex items-center gap-2 text-[13px] text-muted hover:text-ink transition-colors mb-10">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          Volver al inicio
        </a>

        <h1 className="text-3xl font-semibold text-ink mb-2">Términos y Condiciones</h1>
        <p className="text-muted text-[13px] mb-10">Última actualización: mayo de 2026</p>

        <div className="prose prose-sm max-w-none text-dim leading-relaxed space-y-8">

          <section>
            <h2 className="text-[17px] font-semibold text-ink mb-3">1. Objeto</h2>
            <p>Los presentes Términos y Condiciones regulan el acceso y uso de la plataforma <strong>AlloStudios</strong> (en adelante, "la Plataforma"), disponible en <a href="https://allostudios.net" className="text-accent hover:underline">allostudios.net</a>, que proporciona servicios de asistente de voz con inteligencia artificial para negocios.</p>
          </section>

          <section>
            <h2 className="text-[17px] font-semibold text-ink mb-3">2. Acceso y registro</h2>
            <p>Para acceder a la Plataforma es necesario crear una cuenta y contratar uno de los planes disponibles. El usuario debe ser mayor de 18 años y proporcionar información veraz durante el registro. Es responsable de mantener la confidencialidad de sus credenciales.</p>
          </section>

          <section>
            <h2 className="text-[17px] font-semibold text-ink mb-3">3. Planes y facturación</h2>
            <p>AlloStudios ofrece los siguientes planes de suscripción:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li><strong>Starter:</strong> 399€/mes — 1.500 minutos de llamada incluidos</li>
              <li><strong>Professional:</strong> 599€/mes — 2.250 minutos de llamada incluidos</li>
            </ul>
            <p className="mt-2">El exceso de minutos se factura a <strong>0,25€/min</strong> y el servicio nunca se corta. Los precios incluyen IVA cuando corresponda. La facturación es mensual recurrente. Puedes cancelar en cualquier momento desde el panel de control.</p>
          </section>

          <section>
            <h2 className="text-[17px] font-semibold text-ink mb-3">4. Periodo de prueba</h2>
            <p>Todos los planes incluyen un periodo de prueba gratuita de <strong>7 días</strong>, previo registro de un método de pago válido. Si no cancelas antes de que finalice el periodo de prueba, se iniciará la facturación regular.</p>
          </section>

          <section>
            <h2 className="text-[17px] font-semibold text-ink mb-3">5. Uso aceptable</h2>
            <p>El usuario se compromete a no utilizar la Plataforma para:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Actividades ilegales o fraudulentas</li>
              <li>Spam o comunicaciones no solicitadas masivas</li>
              <li>Eludir las medidas de seguridad de la Plataforma</li>
              <li>Infringir derechos de terceros</li>
            </ul>
          </section>

          <section>
            <h2 className="text-[17px] font-semibold text-ink mb-3">6. Disponibilidad del servicio</h2>
            <p>AlloStudios se compromete a ofrecer una disponibilidad del servicio del 99,5% mensual. No garantizamos disponibilidad ininterrumpida. Las interrupciones programadas por mantenimiento se comunicarán con antelación.</p>
          </section>

          <section>
            <h2 className="text-[17px] font-semibold text-ink mb-3">7. Propiedad intelectual</h2>
            <p>Todo el contenido de la Plataforma (código, diseño, marca, textos) es propiedad de AlloStudios. El usuario no puede copiar, reproducir o distribuir ningún elemento sin autorización expresa.</p>
          </section>

          <section>
            <h2 className="text-[17px] font-semibold text-ink mb-3">8. Limitación de responsabilidad</h2>
            <p>AlloStudios no será responsable de daños indirectos, lucro cesante o pérdida de datos derivados del uso de la Plataforma. Nuestra responsabilidad máxima se limita al importe abonado en los últimos 3 meses.</p>
          </section>

          <section>
            <h2 className="text-[17px] font-semibold text-ink mb-3">9. Cancelación</h2>
            <p>Puedes cancelar tu suscripción en cualquier momento desde el panel de control. La cancelación será efectiva al final del periodo de facturación en curso. No se realizan reembolsos por el periodo restante.</p>
          </section>

          <section>
            <h2 className="text-[17px] font-semibold text-ink mb-3">10. Ley aplicable</h2>
            <p>Estos términos se rigen por la legislación española. Para cualquier disputa, las partes se someten a los juzgados y tribunales de España.</p>
          </section>

          <section>
            <h2 className="text-[17px] font-semibold text-ink mb-3">11. Contacto</h2>
            <p>Para cualquier consulta: <a href="mailto:hola@allostudios.net" className="text-accent hover:underline">hola@allostudios.net</a></p>
          </section>

        </div>
      </div>
    </main>
  )
}
