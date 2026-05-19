"use client"

import { motion } from "framer-motion"
import {
  PhoneCall,
  CalendarCheck,
  BarChart3,
  MessageSquare,
  Zap,
  Globe,
  ShieldCheck,
  BrainCircuit,
} from "lucide-react"

const features = [
  {
    icon: PhoneCall,
    title: "Llamadas atendidas 24/7",
    description:
      "Tu agente de IA nunca duerme. Atiende llamadas los 365 días del año, incluso fuera de horario, festivos y madrugadas.",
    color: "from-violet-500 to-purple-600",
  },
  {
    icon: CalendarCheck,
    title: "Reservas automáticas",
    description:
      "Detecta intención de reserva y agenda la cita directamente en tu calendario. Sin intervención humana.",
    color: "from-blue-500 to-indigo-600",
  },
  {
    icon: BrainCircuit,
    title: "IA con memoria contextual",
    description:
      "Recuerda el contexto durante toda la conversación. No repite preguntas. Parece completamente humana.",
    color: "from-emerald-500 to-teal-600",
  },
  {
    icon: MessageSquare,
    title: "WhatsApp & SMS automáticos",
    description:
      "Envía confirmaciones de cita, recordatorios y seguimientos automáticos por WhatsApp y SMS.",
    color: "from-green-500 to-emerald-600",
  },
  {
    icon: BarChart3,
    title: "Analytics en tiempo real",
    description:
      "Visualiza llamadas, conversiones, horarios punta y tasa de respuesta en un dashboard premium.",
    color: "from-orange-500 to-amber-600",
  },
  {
    icon: Zap,
    title: "Latencia ultra-baja",
    description:
      "Respuestas en menos de 500ms. La IA habla de forma natural, sin pausas incómodas ni silencios extraños.",
    color: "from-yellow-500 to-orange-500",
  },
  {
    icon: Globe,
    title: "Multi-idioma",
    description:
      "Español, inglés, francés, alemán y más. El agente detecta automáticamente el idioma del cliente.",
    color: "from-pink-500 to-rose-600",
  },
  {
    icon: ShieldCheck,
    title: "Seguridad enterprise",
    description:
      "Aislamiento multi-tenant, cifrado de extremo a extremo, cumplimiento GDPR y grabaciones seguras.",
    color: "from-slate-500 to-gray-600",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-32 bg-gray-50 dark:bg-gray-900/50">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-sm font-semibold text-violet-600 dark:text-violet-400 uppercase tracking-widest mb-4">
            Características
          </p>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-5">
            Todo lo que necesita<br />
            <span className="gradient-text">un negocio moderno</span>
          </h2>
          <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            Una plataforma completa para automatizar la atención telefónica y multiplicar la conversión de tu negocio.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="group bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 hover:border-violet-200 dark:hover:border-violet-800 hover:shadow-lg hover:shadow-violet-500/5 transition-all duration-300"
            >
              <div
                className={`w-11 h-11 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
              >
                <feature.icon className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
