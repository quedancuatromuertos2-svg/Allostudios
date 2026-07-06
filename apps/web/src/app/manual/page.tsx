import Link from "next/link"

const sections = [
  {
    id: "intro",
    title: "1. ¿Qué es VoiceFlow AI?",
    content: `VoiceFlow AI es una plataforma SaaS que proporciona a negocios locales un agente de voz con inteligencia artificial disponible 24/7. El agente atiende llamadas telefónicas, gestiona reservas y citas, responde preguntas frecuentes, y captura leads � sin necesidad de personal humano.

El sistema funciona así:
1. El cliente llama al número de teléfono del negocio
2. Vapi (el proveedor de IA de voz) intercepta la llamada
3. El agente IA responde con voz natural en español
4. Si se agenda una cita, queda registrada automáticamente en el panel
5. Al finalizar la llamada, se genera un resumen y se almacena en la base de datos`,
  },
  {
    id: "onboarding",
    title: "2. Registro y configuración inicial",
    content: `Al registrarte por primera vez, el sistema te lleva automáticamente al flujo de onboarding:

PASO 1 � Selecciona el tipo de negocio
Elige entre: Barbería, Peluquería, Restaurante, Clínica Dental, Inmobiliaria, Gimnasio, Spa, Veterinaria. Cada sector tiene un prompt de IA, servicios y voz preconfigurados.

PASO 2 � Datos del negocio
Introduce el nombre, teléfono, dirección y una descripción opcional. Esta información la usará el agente durante las conversaciones.

Al confirmar, el sistema:
⬢ Crea el negocio en la base de datos
⬢ Genera automáticamente un asistente en Vapi con la voz y el prompt correcto
⬢ Crea una suscripción de prueba con 50 llamadas gratuitas
⬢ Te redirige al dashboard`,
  },
  {
    id: "dashboard",
    title: "3. Dashboard principal",
    content: `El dashboard es la vista principal del negocio. Muestra:

KPIs (tarjetas superiores):
⬢ Llamadas totales en los últimos 30 días
⬢ Llamadas perdidas (sin respuesta)
⬢ Citas reservadas por el agente IA
⬢ Tasa de conversión (llamadas �  citas)

Gráfico de volumen de llamadas � línea temporal de los últimos 14 días con llamadas totales y atendidas.

Resumen rápido:
⬢ Duración media de llamada
⬢ Próximas citas del día/semana
⬢ Leads calientes pendientes
⬢ Total de leads generados

Llamadas recientes � últimas 5 llamadas con estado, duración y resumen IA.`,
  },
  {
    id: "calls",
    title: "4. Llamadas",
    content: `La sección de Llamadas muestra el historial completo:

Lista paginada (20 por página) con:
⬢ Número del llamante
⬢ Estado: Completada / Perdida / En curso / Transferida
⬢ Duración
⬢ Fecha y hora

Panel de detalle (al hacer clic en una llamada):
⬢ Transcripción completa de la conversación
⬢ Resumen generado por IA
⬢ Análisis de sentimiento
⬢ Grabación de audio (si está activada en Vapi)

Filtros disponibles: por estado, por fecha, por duración.`,
  },
  {
    id: "analytics",
    title: "5. Analytics",
    content: `La sección Analytics ofrece tres vistas:

Volumen de llamadas � Gráfico de área con el volumen diario. Permite ver tendencias y picos de actividad.

Distribución horaria � Gráfico de barras que muestra en qué horas del día se reciben más llamadas. �atil para ajustar horarios.

Distribución de resultados � Gráfico circular con el porcentaje de llamadas completadas, perdidas, transferidas.

Todos los gráficos se pueden filtrar por rango de fechas: 7 días, 30 días o 90 días.`,
  },
  {
    id: "ai-config",
    title: "6. Configuración de la IA",
    content: `Esta sección permite personalizar el comportamiento del agente. Tiene tres pestañas:

PROMPT Y VOZ
⬢ System Prompt: las instrucciones que definen la personalidad y comportamiento del agente. Edítalo para adaptar el tono, los servicios que menciona, las preguntas que hace.
⬢ Voz: selecciona entre voces masculinas/femeninas y diferentes acentos del español.
⬢ Mensaje de bienvenida: el primer mensaje que escucha el llamante.

PREGUNTAS FRECUENTES
Añade pares pregunta-respuesta. El agente los usará para responder consultas habituales (horarios, precios, ubicación, etc.).

CONFIGURACI�N AVANZADA
⬢ Activar/desactivar grabación de llamadas
⬢ Activar detección de sentimiento
⬢ Activar transferencia a agente humano
⬢ Configurar número de intentos antes de colgar

Todos los cambios se sincronizan automáticamente con Vapi.`,
  },
  {
    id: "billing",
    title: "7. Facturación y planes",
    content: `VoiceFlow AI ofrece tres planes de suscripción mensual:

STARTER � 79��/mes
⬢ 200 llamadas/mes
⬢ 1 número de teléfono
⬢ Soporte básico
⬢ Ideal para: negocios pequeños que reciben pocas llamadas

PROFESSIONAL � 199��/mes
⬢ 1.000 llamadas/mes
⬢ 1 número de teléfono
⬢ Analytics avanzados
⬢ Soporte prioritario
⬢ Ideal para: negocios medianos con volumen moderado

ENTERPRISE � 499��/mes
⬢ Llamadas ilimitadas
⬢ Múltiples números
⬢ API access
⬢ Soporte dedicado
⬢ Ideal para: franquicias, grupos de negocios

PERIODO DE PRUEBA
Al registrarse, cada negocio obtiene 50 llamadas gratuitas (14 días). No se requiere tarjeta de crédito.

Para suscribirse, ve a Facturación �  selecciona el plan �  pago seguro con Stripe. Para gestionar o cancelar la suscripción, usa el botón "Portal de Stripe".`,
  },
  {
    id: "settings",
    title: "8. Ajustes del negocio",
    content: `En Ajustes puedes modificar los datos básicos del negocio:
⬢ Nombre comercial
⬢ Teléfono de contacto
⬢ Dirección física
⬢ Descripción del negocio

Importante: estos datos se usan en los prompts del agente IA. Mantenerlos actualizados garantiza que el agente dé información correcta a los clientes.

También puedes gestionar múltiples negocios desde el selector de negocio en la barra lateral izquierda. Cada negocio tiene su propio agente IA, historial de llamadas y configuración independiente.`,
  },
  {
    id: "vapi",
    title: "9. Cómo funciona la integración con Vapi",
    content: `Vapi es el servicio de voz IA que procesa las llamadas en tiempo real.

FLUJO DE UNA LLAMADA:
1. Cliente llama al número asignado por Vapi
2. Vapi conecta la llamada con el asistente IA del negocio
3. El asistente usa GPT-4o para entender y responder
4. La voz es generada por ElevenLabs (voces naturales en español)
5. Si el cliente quiere agendar, Vapi llama a la función bookAppointment
6. Al colgar, Vapi envía un webhook a tu app con la transcripción y resumen
7. Todo queda guardado en Supabase

WEBHOOK URL (para configurar en Vapi Dashboard):
https://TU_DOMINIO/api/vapi/webhook

FUNCIONES IA disponibles:
⬢ checkAvailability(date, service_id) � comprueba huecos libres
⬢ bookAppointment(...) � crea la cita en la base de datos
⬢ captureLead(...) � guarda datos de contacto
⬢ getBusinessInfo() � devuelve info del negocio al agente`,
  },
  {
    id: "admin",
    title: "10. Panel de Administración",
    content: `El panel de administración (accesible en /admin) es exclusivo para el propietario de la plataforma y permite gestionar todos los clientes.

OVERVIEW � Vista global con:
⬢ Total de negocios registrados
⬢ MRR (ingresos recurrentes mensuales)
⬢ Llamadas procesadas en el mes
⬢ Negocios en periodo de prueba
⬢ Distribución de planes

CLIENTES � Tabla completa con:
⬢ Nombre y sector del negocio
⬢ Plan actual y estado de la suscripción
⬢ Llamadas realizadas en los últimos 30 días
⬢ Barra de uso del plan
⬢ Fecha de registro

DETALLE DE CLIENTE � Al hacer clic en un cliente:
⬢ Historial de llamadas
⬢ Citas registradas
⬢ Leads capturados
⬢ Cambio manual de plan (sin necesidad de Stripe)
⬢ Activar/desactivar el acceso al negocio`,
  },
  {
    id: "faq",
    title: "11. Preguntas frecuentes",
    content: `¿El agente habla en español?
Sí. Todos los agentes están configurados en español por defecto. El modelo de transcripción es Deepgram Nova-2 en modo español, y las voces son de ElevenLabs optimizadas para español.

¿Puedo tener varios negocios?
Sí. Puedes crear múltiples negocios desde el mismo panel. Cada uno tiene su propio agente, número de teléfono y configuración.

¿Qué pasa si el agente no sabe responder algo?
El agente reconoce cuando no tiene la información y ofrece transferir la llamada o pedir al cliente que llame en otro momento. Puedes configurar este comportamiento en Configuración Avanzada.

¿Las llamadas quedan grabadas?
Opcional. Puedes activar/desactivar la grabación en Config. IA �  Configuración Avanzada. Las grabaciones se almacenan en Vapi.

¿Cómo consigo un número de teléfono?
Desde el dashboard de Vapi (vapi.ai) puedes comprar números españoles o internacionales y asignarlos a tu asistente.

¿Puedo probar el agente antes de activarlo?
Sí. Desde el dashboard de Vapi puedes hacer llamadas de prueba directamente en el navegador.`,
  },
]

export default function ManualPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <Link href="/dashboard" className="text-sm text-violet-600 dark:text-violet-400 hover:underline mb-6 inline-block">
            � � Volver al Dashboard
          </Link>
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-3">
            Manual de usuario
          </h1>
          <p className="text-lg text-gray-500 dark:text-gray-400">
            Guía completa de VoiceFlow AI � Agente de voz inteligente para negocios locales
          </p>
          <div className="mt-4 text-sm text-gray-400">Versión 1.0 · Mayo 2026</div>
        </div>

        {/* Index */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 mb-10">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-4 text-sm uppercase tracking-wider">Índice</h2>
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
                  if (para.startsWith("⬢")) {
                    const items = para.split("\n").filter(l => l.startsWith("⬢"))
                    return (
                      <ul key={i} className="space-y-1 my-3">
                        {items.map((item, j) => (
                          <li key={j} className="flex gap-2 text-gray-600 dark:text-gray-300 text-sm">
                            <span className="text-violet-500 mt-0.5">⬢</span>
                            <span>{item.replace("⬢ ", "")}</span>
                          </li>
                        ))}
                      </ul>
                    )
                  }
                  if (para.match(/^[A-Z\s]+�/) || para.match(/^PASO \d/) || para.match(/^[A-Z\s]+:$/)) {
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
          VoiceFlow AI · Manual de usuario v1.0 · 2026
        </div>
      </div>
    </div>
  )
}
