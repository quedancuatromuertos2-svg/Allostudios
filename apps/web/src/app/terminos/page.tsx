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
            <p>Los presentes Términos y Condiciones regulan el acceso y uso de la plataforma <strong>AlloStudios</strong> (en adelante, "la Plataforma"), disponible en <a href="https://allostudios.net" className="text-accent hover:underline">allostudios.net</a>, que presta servicios digitales para negocios locales: diseño y mantenimiento de páginas web, posicionamiento local en Google, sistemas de reseñas, gestión de campañas publicitarias y asistentes de inteligencia artificial para WhatsApp, contratados por suscripción.</p>
          </section>

          <section>
            <h2 className="text-[17px] font-semibold text-ink mb-3">2. Acceso y registro</h2>
            <p>La contratación se realiza en allostudios.net/contratar mediante pasarela de pago segura (Stripe), sin necesidad de crear una cuenta. El cliente debe ser mayor de 18 años, actuar en nombre de un negocio y proporcionar información veraz (nombre del negocio, teléfono y email de facturación).</p>
          </section>

          <section>
            <h2 className="text-[17px] font-semibold text-ink mb-3">3. Planes y facturación</h2>
            <p>Todos los servicios se contratan por suscripción, sin pago inicial (0 € de entrada). La primera cuota se cobra en el momento de la contratación y las siguientes cada mes en la misma fecha. Los precios vigentes son los publicados en allostudios.net/contratar en el momento de la contratación:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li><strong>Packs</strong> (Presencia, Crecimiento, Todo) y <strong>webs</strong> (Arranque, Premium, Cinematográfica): cuota mensual con un <strong>compromiso de permanencia de 12 meses</strong> desde la fecha de contratación. Transcurridos los 12 meses, la suscripción continúa mes a mes sin permanencia.</li>
              <li><strong>Servicios sueltos</strong> (SEO local, reseñas, asistente de IA, campañas, captación): cuota mensual sin permanencia.</li>
              <li><strong>Pago anual anticipado:</strong> opcionalmente, packs y webs pueden abonarse por adelantado por el importe de 10 cuotas mensuales, que cubre 12 meses de servicio.</li>
            </ul>
            <p className="mt-2">La inversión publicitaria en Meta o Google no está incluida en ninguna cuota y la abona el cliente directamente a la plataforma correspondiente. Los precios se muestran sin IVA salvo indicación contraria; el IVA aplicable se refleja en la factura, que se emite automáticamente por email en cada cobro.</p>
          </section>

          <section>
            <h2 className="text-[17px] font-semibold text-ink mb-3">4. Demo previa y entrega</h2>
            <p>Antes de contratar, el cliente puede ver una demo gratuita de su web en allostudios.net/tu-web, sin compromiso. Tras la contratación, AlloStudios entrega la web en un plazo orientativo de 7 días laborables desde que recibe del cliente el material necesario (fotos, textos, accesos). El resto de servicios del pack se ponen en marcha durante el primer mes.</p>
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
            <p>Los servicios sin permanencia pueden cancelarse en cualquier momento escribiendo a hola@allostudios.net o por WhatsApp; la cancelación es efectiva al final del periodo de facturación en curso. En packs y webs, la cancelación anticipada dentro de los 12 meses de permanencia conlleva el abono de las cuotas pendientes hasta completar dicho periodo, dado que AlloStudios no cobra el trabajo inicial por adelantado. No se realizan reembolsos por el periodo restante ni de los pagos anuales anticipados. Al finalizar la relación, la web deja de estar publicada; el cliente puede solicitar una copia de sus contenidos (textos e imágenes aportados).</p>
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
