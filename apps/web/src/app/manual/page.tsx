import Link from "next/link"

const sections = [
  {
    id: "intro",
    title: "1. Â¿QuÃ© es VoiceFlow AI?",
    content: `VoiceFlow AI es una plataforma SaaS que proporciona a negocios locales un agente de voz con inteligencia artificial disponible 24/7. El agente atiende llamadas telefÃ³nicas, gestiona reservas y citas, responde preguntas frecuentes, y captura leads â€” sin necesidad de personal humano.

El sistema funciona asÃ­:
1. El cliente llama al nÃºmero de telÃ©fono del negocio
2. Vapi (el proveedor de IA de voz) intercepta la llamada
3. El agente IA responde con voz natural en espaÃ±ol
4. Si se agenda una cita, queda registrada automÃ¡ticamente en el panel
5. Al finalizar la llamada, se genera un resumen y se almacena en la base de datos`,
  },
  {
    id: "onboarding",
    title: "2. Registro y configuraciÃ³n inicial",
    content: `Al registrarte por primera vez, el sistema te lleva automÃ¡ticamente al flujo de onboarding:

PASO 1 â€” Selecciona el tipo de negocio
Elige entre: BarberÃ­a, PeluquerÃ­a, Restaurante, ClÃ­nica Dental, Inmobiliaria, Gimnasio, Spa, Veterinaria. Cada sector tiene un prompt de IA, servicios y voz preconfigurados.

PASO 2 â€” Datos del negocio
Introduce el nombre, telÃ©fono, direcciÃ³n y una descripciÃ³n opcional. Esta informaciÃ³n la usarÃ¡ el agente durante las conversaciones.

Al confirmar, el sistema:
â€¢ Crea el negocio en la base de datos
â€¢ Genera automÃ¡ticamente un asistente en Vapi con la voz y el prompt correcto
â€¢ Crea una suscripciÃ³n de prueba con 50 llamadas gratuitas
â€¢ Te redirige al dashboard`,
  },
  {
    id: "dashboard",
    title: "3. Dashboard principal",
    content: `El dashboard es la vista principal del negocio. Muestra:

KPIs (tarjetas superiores):
â€¢ Llamadas totales en los Ãºltimos 30 dÃ­as
â€¢ Llamadas perdidas (sin respuesta)
â€¢ Citas reservadas por el agente IA
â€¢ Tasa de conversiÃ³n (llamadas â†’ citas)

GrÃ¡fico de volumen de llamadas â€” lÃ­nea temporal de los Ãºltimos 14 dÃ­as con llamadas totales y atendidas.

Resumen rÃ¡pido:
â€¢ DuraciÃ³n media de llamada
â€¢ PrÃ³ximas citas del dÃ­a/semana
â€¢ Leads calientes pendientes
â€¢ Total de leads generados

Llamadas recientes â€” Ãºltimas 5 llamadas con estado, duraciÃ³n y resumen IA.`,
  },
  {
    id: "calls",
    title: "4. Llamadas",
    content: `La secciÃ³n de Llamadas muestra el historial completo:

Lista paginada (20 por pÃ¡gina) con:
â€¢ NÃºmero del llamante
â€¢ Estado: Completada / Perdida / En curso / Transferida
â€¢ DuraciÃ³n
â€¢ Fecha y hora

Panel de detalle (al hacer clic en una llamada):
â€¢ TranscripciÃ³n completa de la conversaciÃ³n
â€¢ Resumen generado por IA
â€¢ AnÃ¡lisis de sentimiento
â€¢ GrabaciÃ³n de audio (si estÃ¡ activada en Vapi)

Filtros disponibles: por estado, por fecha, por duraciÃ³n.`,
  },
  {
    id: "analytics",
    title: "5. Analytics",
    content: `La secciÃ³n Analytics ofrece tres vistas:

Volumen de llamadas â€” GrÃ¡fico de Ã¡rea con el volumen diario. Permite ver tendencias y picos de actividad.

DistribuciÃ³n horaria â€” GrÃ¡fico de barras que muestra en quÃ© horas del dÃ­a se reciben mÃ¡s llamadas. Ãštil para ajustar horarios.

DistribuciÃ³n de resultados â€” GrÃ¡fico circular con el porcentaje de llamadas completadas, perdidas, transferidas.

Todos los grÃ¡ficos se pueden filtrar por rango de fechas: 7 dÃ­as, 30 dÃ­as o 90 dÃ­as.`,
  },
  {
    id: "ai-config",
    title: "6. ConfiguraciÃ³n de la IA",
    content: `Esta secciÃ³n permite personalizar el comportamiento del agente. Tiene tres pestaÃ±as:

PROMPT Y VOZ
â€¢ System Prompt: las instrucciones que definen la personalidad y comportamiento del agente. EdÃ­talo para adaptar el tono, los servicios que menciona, las preguntas que hace.
â€¢ Voz: selecciona entre voces masculinas/femeninas y diferentes acentos del espaÃ±ol.
â€¢ Mensaje de bienvenida: el primer mensaje que escucha el llamante.

PREGUNTAS FRECUENTES
AÃ±ade pares pregunta-respuesta. El agente los usarÃ¡ para responder consultas habituales (horarios, precios, ubicaciÃ³n, etc.).

CONFIGURACIÃ“N AVANZADA
â€¢ Activar/desactivar grabaciÃ³n de llamadas
â€¢ Activar detecciÃ³n de sentimiento
â€¢ Activar transferencia a agente humano
â€¢ Configurar nÃºmero de intentos antes de colgar

Todos los cambios se sincronizan automÃ¡ticamente con Vapi.`,
  },
  {
    id: "billing",
    title: "7. FacturaciÃ³n y planes",
    content: `VoiceFlow AI ofrece tres planes de suscripciÃ³n mensual:

STARTER â€” 79â‚¬/mes
â€¢ 200 llamadas/mes
â€¢ 1 nÃºmero de telÃ©fono
â€¢ Soporte bÃ¡sico
â€¢ Ideal para: negocios pequeÃ±os que reciben pocas llamadas

PROFESSIONAL â€” 199â‚¬/mes
â€¢ 1.000 llamadas/mes
â€¢ 1 nÃºmero de telÃ©fono
â€¢ Analytics avanzados
â€¢ Soporte prioritario
â€¢ Ideal para: negocios medianos con volumen moderado

ENTERPRISE â€” 499â‚¬/mes
â€¢ Llamadas ilimitadas
â€¢ MÃºltiples nÃºmeros
â€¢ API access
â€¢ Soporte dedicado
â€¢ Ideal para: franquicias, grupos de negocios

PERIODO DE PRUEBA
Al registrarse, cada negocio obtiene 50 llamadas gratuitas (14 dÃ­as). No se requiere tarjeta de crÃ©dito.

Para suscribirse, ve a FacturaciÃ³n â†’ selecciona el plan â†’ pago seguro con Stripe. Para gestionar o cancelar la suscripciÃ³n, usa el botÃ³n "Portal de Stripe".`,
  },
  {
    id: "settings",
    title: "8. Ajustes del negocio",
    content: `En Ajustes puedes modificar los datos bÃ¡sicos del negocio:
â€¢ Nombre comercial
â€¢ TelÃ©fono de contacto
â€¢ DirecciÃ³n fÃ­sica
â€¢ DescripciÃ³n del negocio

Importante: estos datos se usan en los prompts del agente IA. Mantenerlos actualizados garantiza que el agente dÃ© informaciÃ³n correcta a los clientes.

TambiÃ©n puedes gestionar mÃºltiples negocios desde el selector de negocio en la barra lateral izquierda. Cada negocio tiene su propio agente IA, historial de llamadas y configuraciÃ³n independiente.`,
  },
  {
    id: "vapi",
    title: "9. CÃ³mo funciona la integraciÃ³n con Vapi",
    content: `Vapi es el servicio de voz IA que procesa las llamadas en tiempo real.

FLUJO DE UNA LLAMADA:
1. Cliente llama al nÃºmero asignado por Vapi
2. Vapi conecta la llamada con el asistente IA del negocio
3. El asistente usa GPT-4o para entender y responder
4. La voz es generada por ElevenLabs (voces naturales en espaÃ±ol)
5. Si el cliente quiere agendar, Vapi llama a la funciÃ³n bookAppointment
6. Al colgar, Vapi envÃ­a un webhook a tu app con la transcripciÃ³n y resumen
7. Todo queda guardado en Supabase

WEBHOOK URL (para configurar en Vapi Dashboard):
https://TU_DOMINIO/api/vapi/webhook

FUNCIONES IA disponibles:
â€¢ checkAvailability(date, service_id) â€” comprueba huecos libres
â€¢ bookAppointment(...) â€” crea la cita en la base de datos
â€¢ captureLead(...) â€” guarda datos de contacto
â€¢ getBusinessInfo() â€” devuelve info del negocio al agente`,
  },
  {
    id: "admin",
    title: "10. Panel de AdministraciÃ³n",
    content: `El panel de administraciÃ³n (accesible en /admin) es exclusivo para el propietario de la plataforma y permite gestionar todos los clientes.

OVERVIEW â€” Vista global con:
â€¢ Total de negocios registrados
â€¢ MRR (ingresos recurrentes mensuales)
â€¢ Llamadas procesadas en el mes
â€¢ Negocios en periodo de prueba
â€¢ DistribuciÃ³n de planes

CLIENTES â€” Tabla completa con:
â€¢ Nombre y sector del negocio
â€¢ Plan actual y estado de la suscripciÃ³n
â€¢ Llamadas realizadas en los Ãºltimos 30 dÃ­as
â€¢ Barra de uso del plan
â€¢ Fecha de registro

DETALLE DE CLIENTE â€” Al hacer clic en un cliente:
â€¢ Historial de llamadas
â€¢ Citas registradas
â€¢ Leads capturados
â€¢ Cambio manual de plan (sin necesidad de Stripe)
â€¢ Activar/desactivar el acceso al negocio`,
  },
  {
    id: "faq",
    title: "11. Preguntas frecuentes",
    content: `Â¿El agente habla en espaÃ±ol?
SÃ­. Todos los agentes estÃ¡n configurados en espaÃ±ol por defecto. El modelo de transcripciÃ³n es Deepgram Nova-2 en modo espaÃ±ol, y las voces son de ElevenLabs optimizadas para espaÃ±ol.

Â¿Puedo tener varios negocios?
SÃ­. Puedes crear mÃºltiples negocios desde el mismo panel. Cada uno tiene su propio agente, nÃºmero de telÃ©fono y configuraciÃ³n.

Â¿QuÃ© pasa si el agente no sabe responder algo?
El agente reconoce cuando no tiene la informaciÃ³n y ofrece transferir la llamada o pedir al cliente que llame en otro momento. Puedes configurar este comportamiento en ConfiguraciÃ³n Avanzada.

Â¿Las llamadas quedan grabadas?
Opcional. Puedes activar/desactivar la grabaciÃ³n en Config. IA â†’ ConfiguraciÃ³n Avanzada. Las grabaciones se almacenan en Vapi.

Â¿CÃ³mo consigo un nÃºmero de telÃ©fono?
Desde el dashboard de Vapi (vapi.ai) puedes comprar nÃºmeros espaÃ±oles o internacionales y asignarlos a tu asistente.

Â¿Puedo probar el agente antes de activarlo?
SÃ­. Desde el dashboard de Vapi puedes hacer llamadas de prueba directamente en el navegador.`,
  },
]

export default function ManualPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <Link href="/dashboard" className="text-sm text-violet-600 dark:text-violet-400 hover:underline mb-6 inline-block">
            â† Volver al Dashboard
          </Link>
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-3">
            Manual de usuario
          </h1>
          <p className="text-lg text-gray-500 dark:text-gray-400">
            GuÃ­a completa de VoiceFlow AI â€” Agente de voz inteligente para negocios locales
          </p>
          <div className="mt-4 text-sm text-gray-400">VersiÃ³n 1.0 Â· Mayo 2026</div>
        </div>

        {/* Index */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 mb-10">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-4 text-sm uppercase tracking-wider">Ãndice</h2>
          <div className="grid sm:grid-cols-2 gap-y-2 gap-x-6">
            {sections.map(s => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="text-sm text-violet-600 dark:text-violet-400 hover:underline py-0.5"
              >
                {s.title}
              </a>
            ))}
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-12">
          {sections.map(s => (
            <section key={s.id} id={s.id} className="scroll-mt-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 pb-3 border-b border-gray-100 dark:border-gray-800">
                {s.title}
              </h2>
              <div className="prose prose-sm prose-gray dark:prose-invert max-w-none">
                {s.content.split("\n\n").map((para, i) => {
                  if (para.startsWith("â€¢")) {
                    const items = para.split("\n").filter(l => l.startsWith("â€¢"))
                    return (
                      <ul key={i} className="space-y-1 my-3">
                        {items.map((item, j) => (
                          <li key={j} className="flex gap-2 text-gray-600 dark:text-gray-300 text-sm">
                            <span className="text-violet-500 mt-0.5">â€¢</span>
                            <span>{item.replace("â€¢ ", "")}</span>
                          </li>
                        ))}
                      </ul>
                    )
                  }
                  if (para.match(/^[A-Z\s]+â€”/) || para.match(/^PASO \d/) || para.match(/^[A-Z\s]+:$/)) {
                    const [title, ...rest] = para.split("\n")
                    return (
                      <div key={i} className="my-4">
                        <div className="font-semibold text-gray-800 dark:text-gray-200 text-sm mb-1">{title}</div>
                        {rest.map((line, j) => (
                          <p key={j} className="text-gray-600 dark:text-gray-400 text-sm">{line}</p>
                        ))}
                      </div>
                    )
                  }
                  return (
                    <p key={i} className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed my-2">{para}</p>
                  )
                })}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-gray-100 dark:border-gray-800 text-center text-sm text-gray-400">
          VoiceFlow AI Â· Manual de usuario v1.0 Â· 2026
        </div>
      </div>
    </div>
  )
}
