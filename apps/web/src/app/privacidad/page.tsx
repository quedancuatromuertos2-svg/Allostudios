import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Política de Privacidad",
  description: "Política de privacidad de AlloStudios. Cómo recopilamos, usamos y protegemos tus datos personales.",
}

export default function PrivacidadPage() {
  return (
    <main className="min-h-screen bg-white py-20 px-6">
      <div className="max-w-3xl mx-auto">
        <a href="/" className="inline-flex items-center gap-2 text-[13px] text-muted hover:text-ink transition-colors mb-10">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          Volver al inicio
        </a>

        <h1 className="text-3xl font-semibold text-ink mb-2">Política de Privacidad</h1>
        <p className="text-muted text-[13px] mb-10">Última actualización: mayo de 2026</p>

        <div className="prose prose-sm max-w-none text-dim leading-relaxed space-y-8">

          <section>
            <h2 className="text-[17px] font-semibold text-ink mb-3">1. Responsable del tratamiento</h2>
            <p>El responsable del tratamiento de los datos personales recogidos en este sitio web es <strong>AlloStudios</strong>, con correo electrónico de contacto: <a href="mailto:hola@allostudios.net" className="text-accent hover:underline">hola@allostudios.net</a>.</p>
          </section>

          <section>
            <h2 className="text-[17px] font-semibold text-ink mb-3">2. Datos que recopilamos</h2>
            <p>Recopilamos los siguientes datos personales:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Nombre y apellidos</li>
              <li>Dirección de correo electrónico</li>
              <li>Información de facturación (gestionada por Stripe)</li>
              <li>Datos del negocio (nombre, sector, teléfono, dirección)</li>
              <li>Registros de llamadas procesadas por el asistente IA</li>
              <li>Datos de uso de la plataforma</li>
            </ul>
          </section>

          <section>
            <h2 className="text-[17px] font-semibold text-ink mb-3">3. Finalidad del tratamiento</h2>
            <p>Utilizamos tus datos para:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Prestarte el servicio de asistente IA de voz contratado</li>
              <li>Gestionar tu cuenta y suscripción</li>
              <li>Enviarte comunicaciones relacionadas con el servicio</li>
              <li>Mejorar la plataforma y resolver incidencias</li>
              <li>Cumplir con obligaciones legales y fiscales</li>
            </ul>
          </section>

          <section>
            <h2 className="text-[17px] font-semibold text-ink mb-3">4. Base jurídica</h2>
            <p>El tratamiento de tus datos se basa en:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li><strong>Ejecución del contrato:</strong> necesario para prestarte el servicio</li>
              <li><strong>Consentimiento:</strong> para comunicaciones de marketing (puedes retirarlo en cualquier momento)</li>
              <li><strong>Cumplimiento de obligaciones legales</strong></li>
            </ul>
          </section>

          <section>
            <h2 className="text-[17px] font-semibold text-ink mb-3">5. Transferencias internacionales</h2>
            <p>Utilizamos proveedores tecnológicos de terceros que pueden procesar datos fuera del Espacio Económico Europeo, incluyendo:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li><strong>Supabase</strong> — almacenamiento de datos</li>
              <li><strong>Stripe</strong> — procesamiento de pagos</li>
              <li><strong>OpenAI / Vapi</strong> — procesamiento de voz e IA</li>
              <li><strong>Clerk</strong> — autenticación</li>
            </ul>
            <p className="mt-2">Todos cumplen con el RGPD y/o disponen de mecanismos de transferencia adecuados (cláusulas contractuales tipo, etc.).</p>
          </section>

          <section>
            <h2 className="text-[17px] font-semibold text-ink mb-3">6. Plazo de conservación</h2>
            <p>Conservamos tus datos mientras mantengas una cuenta activa y durante el tiempo legalmente exigido (5 años para datos fiscales). Los registros de llamadas se eliminan a los 12 meses.</p>
          </section>

          <section>
            <h2 className="text-[17px] font-semibold text-ink mb-3">7. Tus derechos</h2>
            <p>Tienes derecho a:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li><strong>Acceso</strong> a tus datos personales</li>
              <li><strong>Rectificación</strong> de datos inexactos</li>
              <li><strong>Supresión</strong> (derecho al olvido)</li>
              <li><strong>Portabilidad</strong> de tus datos</li>
              <li><strong>Oposición</strong> al tratamiento</li>
              <li><strong>Limitación</strong> del tratamiento</li>
            </ul>
            <p className="mt-2">Para ejercer tus derechos, escríbenos a <a href="mailto:hola@allostudios.net" className="text-accent hover:underline">hola@allostudios.net</a>. También puedes presentar una reclamación ante la <a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">Agencia Española de Protección de Datos (AEPD)</a>.</p>
          </section>

          <section>
            <h2 className="text-[17px] font-semibold text-ink mb-3">8. Seguridad</h2>
            <p>Aplicamos medidas técnicas y organizativas adecuadas para proteger tus datos frente a accesos no autorizados, pérdida o divulgación, incluyendo cifrado en tránsito (HTTPS) y en reposo.</p>
          </section>

          <section>
            <h2 className="text-[17px] font-semibold text-ink mb-3">9. Cambios en esta política</h2>
            <p>Nos reservamos el derecho a actualizar esta política. Te notificaremos por email si los cambios son relevantes.</p>
          </section>

          <section>
            <h2 className="text-[17px] font-semibold text-ink mb-3">10. Contacto</h2>
            <p>Para cualquier consulta sobre privacidad: <a href="mailto:hola@allostudios.net" className="text-accent hover:underline">hola@allostudios.net</a></p>
          </section>

        </div>
      </div>
    </main>
  )
}
