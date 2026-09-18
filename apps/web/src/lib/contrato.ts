/*  Contrato de prestación de servicios por suscripción (modelo del 18/09/2026).

    Una sola fuente de verdad para: la página /contrato (lectura e impresión), la
    aceptación en el checkout (versión que acepta el cliente) y la copia que se
    le envía por email al pagar. Si cambias una cláusula, sube CONTRATO_VERSION.  */

export const CONTRATO_VERSION = '2026-09-18'

// ⚠️ Ángel: cuando te des de alta como autónomo, rellena NIF y domicilio. Hasta entonces
// el contrato sale con [NIF] y el prestador identificado por nombre y web.
export const PRESTADOR = {
  nombre: 'AlloStudios (Ángel López)',
  nif: '[NIF]',
  domicilio: 'Valencia (España)',
  email: 'hola@allostudios.net',
  web: 'allostudios.net',
  telefono: '+34 695 868 793',
}

export type Clausula = { titulo: string; parrafos: string[] }

/** Cláusulas generales. Los datos concretos (pack, cuota, permanencia) van en la portada del contrato. */
export const CLAUSULAS: Clausula[] = [
  {
    titulo: '1. Objeto',
    parrafos: [
      'El Prestador se compromete a prestar al Cliente, por suscripción, los servicios digitales incluidos en el pack o producto indicado en la portada de este contrato (en adelante, «el Servicio»): diseño, publicación y mantenimiento de una página web y, según el pack, posicionamiento local en Google, sistema de solicitud de reseñas, asistente de inteligencia artificial para WhatsApp y gestión de campañas publicitarias.',
      'El Servicio se presta de forma continuada mientras la suscripción esté activa. El Cliente no adquiere la propiedad de la infraestructura (hosting, dominio gestionado por el Prestador, plantillas, código y automatizaciones), que se le cede en uso durante la vigencia del contrato.',
    ],
  },
  {
    titulo: '2. Precio y forma de pago',
    parrafos: [
      'No existe pago inicial (0 € de entrada). El Cliente abona una cuota mensual fija, indicada en la portada, mediante domiciliación en tarjeta a través de la pasarela de pago Stripe. La primera cuota se cobra en el momento de la contratación y las siguientes cada mes en la misma fecha.',
      'Opcionalmente, el Cliente puede abonar por adelantado un año de servicio por el importe de diez (10) cuotas mensuales, que cubre doce (12) meses de servicio.',
      'Los importes se expresan sin IVA salvo indicación contraria en la portada; el impuesto aplicable se refleja en cada factura, que se emite automáticamente por correo electrónico en cada cobro.',
      'La inversión publicitaria en plataformas de terceros (Meta, Google) no está incluida en ninguna cuota; la contrata y abona el Cliente directamente a la plataforma.',
    ],
  },
  {
    titulo: '3. Duración y permanencia',
    parrafos: [
      'El contrato entra en vigor en la fecha de contratación y tiene una duración inicial de doce (12) meses (periodo de permanencia). Transcurrido ese periodo, se prorroga automáticamente mes a mes, sin nueva permanencia, pudiendo cualquiera de las partes darlo por finalizado con un preaviso de quince (15) días antes del siguiente cobro.',
      'El periodo de permanencia responde a que el Prestador asume el coste del trabajo inicial (diseño y construcción de la web, configuración del SEO, del sistema de reseñas y del asistente) sin cobrarlo por adelantado, recuperándolo a lo largo de las cuotas.',
    ],
  },
  {
    titulo: '4. Baja anticipada e impago',
    parrafos: [
      'Si el Cliente resuelve el contrato antes de completar el periodo de permanencia, o deja de abonar las cuotas, deberá satisfacer las cuotas pendientes hasta completar los doce (12) meses, en concepto de compensación por el trabajo inicial no cobrado.',
      'Ante un cobro fallido, el Prestador lo reintentará durante quince (15) días y avisará al Cliente. Si no se regulariza, el Prestador podrá suspender el Servicio (la web dejará de estar publicada) hasta el pago, sin que ello interrumpa el devengo de las cuotas.',
      'No se realizan reembolsos de cuotas ya abonadas ni de los pagos anuales anticipados, salvo incumplimiento del Prestador.',
    ],
  },
  {
    titulo: '5. Obligaciones del Prestador',
    parrafos: [
      'Entregar la web publicada en un plazo orientativo de siete (7) días laborables desde que reciba del Cliente el material necesario (logotipo, fotografías, textos, accesos). El resto de servicios del pack se ponen en marcha durante el primer mes.',
      'Mantener la web operativa (hosting, seguridad, copias y actualizaciones), atender las peticiones razonables de cambios de contenido en un plazo orientativo de tres (3) días laborables y prestar soporte por WhatsApp o correo en horario laboral.',
      'Realizar mensualmente el trabajo de posicionamiento, reseñas, asistente y campañas que corresponda al pack contratado e informar al Cliente de los resultados cuando lo solicite.',
    ],
  },
  {
    titulo: '6. Obligaciones del Cliente',
    parrafos: [
      'Facilitar en plazo el material y los accesos necesarios (ficha de Google, número de WhatsApp del negocio, cuenta publicitaria) y responder a las validaciones que se le pidan. Los retrasos imputables al Cliente no suspenden el devengo de las cuotas.',
      'Garantizar que dispone de los derechos sobre los textos, imágenes, marcas y datos que aporta, y que la actividad del negocio es lícita. El Cliente responde del contenido que solicita publicar.',
      'Mantener actualizado el medio de pago y comunicar cualquier cambio en los datos de facturación.',
    ],
  },
  {
    titulo: '7. Asistente de inteligencia artificial',
    parrafos: [
      'El asistente responde en nombre del negocio a partir de la información que el Cliente facilita (horarios, precios, servicios, condiciones). El Cliente revisa y valida esa información y puede pedir ajustes en cualquier momento. El asistente puede cometer errores propios de la tecnología; el Prestador lo supervisa y corrige, pero el Cliente es responsable de confirmar citas, presupuestos y compromisos con sus clientes finales.',
    ],
  },
  {
    titulo: '8. Propiedad intelectual y contenidos',
    parrafos: [
      'Los textos, imágenes y marca aportados por el Cliente son de su propiedad. El diseño, el código, las plantillas, las automatizaciones y la configuración creados por el Prestador son propiedad del Prestador y se ceden en uso mientras dure el contrato.',
      'Al finalizar el contrato, el Cliente puede solicitar una copia de los contenidos aportados y de los textos e imágenes publicados en su web. Si el dominio fue contratado por el Prestador a petición del Cliente, se transferirá al Cliente a su solicitud, asumiendo este los costes de renovación en adelante.',
      'El Prestador podrá mencionar al Cliente como referencia y mostrar la web en su portfolio, salvo que el Cliente indique lo contrario por escrito.',
    ],
  },
  {
    titulo: '9. Protección de datos',
    parrafos: [
      'Ambas partes cumplirán el Reglamento (UE) 2016/679 y la LOPDGDD. Para los servicios en que el Prestador trate datos personales de los clientes del negocio por cuenta del Cliente (formularios de la web, asistente de WhatsApp, sistema de reseñas), el Prestador actúa como encargado del tratamiento: tratará los datos solo según las instrucciones del Cliente, con medidas de seguridad adecuadas, sin cederlos a terceros salvo los proveedores tecnológicos necesarios, y los suprimirá o devolverá al finalizar el contrato. La política de privacidad completa está en allostudios.net/privacidad.',
    ],
  },
  {
    titulo: '10. Responsabilidad',
    parrafos: [
      'El Prestador no garantiza resultados comerciales concretos (número de clientes, posiciones en Google, ventas): son servicios de medios, no de resultado. La responsabilidad total del Prestador frente al Cliente se limita al importe de las cuotas abonadas en los últimos doce (12) meses. Ninguna de las partes responde de daños indirectos ni del lucro cesante.',
      'El Prestador no responde de las interrupciones o cambios de las plataformas de terceros (Google, Meta, WhatsApp, Stripe, proveedores de hosting), aunque hará lo razonable para minimizar su impacto.',
    ],
  },
  {
    titulo: '11. Comunicaciones y modificaciones',
    parrafos: [
      'Las comunicaciones entre las partes se realizarán por WhatsApp o correo electrónico a los datos indicados en la portada, y tendrán plena validez. El Prestador podrá actualizar estas condiciones con un preaviso de treinta (30) días; si el cambio perjudica al Cliente, este podrá resolver el contrato sin penalización antes de que entre en vigor.',
    ],
  },
  {
    titulo: '12. Ley aplicable y fuero',
    parrafos: [
      'Este contrato se rige por la legislación española. Para cualquier controversia, las partes se someten a los juzgados y tribunales de Valencia, salvo que la normativa de consumidores establezca otro fuero imperativo.',
    ],
  },
]

/** Datos concretos de una contratación, para la portada del contrato y el email. */
export type DatosContrato = {
  producto: string      // nombre del pack / web / servicio
  cuota: number         // €/mes (con extras)
  permanencia?: number  // meses
  anual?: boolean       // año por adelantado
  extras?: string[]     // p. ej. "Web Cinematográfica en tu pack"
  negocio?: string
  titular?: string
  nif?: string
  direccion?: string
  email?: string
  telefono?: string
  fecha?: string        // ISO o texto
}
