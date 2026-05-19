"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import {
  Scissors,
  Sparkles,
  UtensilsCrossed,
  Stethoscope,
  Building2,
  Dumbbell,
  Car,
  Star,
  Hotel,
} from "lucide-react"

const niches = [
  {
    icon: Scissors,
    label: "Barbería",
    emoji: "✂️",
    description: "Reserva cortes, barba, tratamientos. Pregunte por barbero preferido.",
    example: '"Quiero un corte para el viernes a las 5, con Carlos si puede ser"',
    color: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800",
    iconColor: "text-blue-600",
  },
  {
    icon: Sparkles,
    label: "Salón de belleza",
    emoji: "💅",
    description: "Gestiona citas de peluquería, estética y manicura.",
    example: '"¿Podría reservarme para un tinte y corte el martes por la tarde?"',
    color: "bg-pink-50 dark:bg-pink-900/20 border-pink-200 dark:border-pink-800",
    iconColor: "text-pink-600",
  },
  {
    icon: UtensilsCrossed,
    label: "Restaurante",
    emoji: "🍽️",
    description: "Reservas de mesa, menús y grupos especiales.",
    example: '"Somos 6 personas para cenar este sábado, ¿hay disponibilidad?"',
    color: "bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800",
    iconColor: "text-orange-600",
  },
  {
    icon: Stethoscope,
    label: "Clínica dental",
    emoji: "🦷",
    description: "Agenda consultas, prioriza urgencias y recoge síntomas.",
    example: '"Me duele una muela desde ayer, ¿puedo venir hoy?"',
    color: "bg-teal-50 dark:bg-teal-900/20 border-teal-200 dark:border-teal-800",
    iconColor: "text-teal-600",
  },
  {
    icon: Building2,
    label: "Inmobiliaria",
    emoji: "🏠",
    description: "Cualifica leads, recoge presupuesto y agenda visitas.",
    example: '"Busco piso de 2 habitaciones en el centro, presupuesto 200K"',
    color: "bg-violet-50 dark:bg-violet-900/20 border-violet-200 dark:border-violet-800",
    iconColor: "text-violet-600",
  },
  {
    icon: Dumbbell,
    label: "Gimnasio",
    emoji: "💪",
    description: "Inscripciones, clases y entrenamiento personal.",
    example: '"¿Tienen clases de yoga por la mañana? Querría apuntarme"',
    color: "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800",
    iconColor: "text-emerald-600",
  },
  {
    icon: Car,
    label: "Taller de coches",
    emoji: "🔧",
    description: "Citas para revisiones, ITV y reparaciones.",
    example: '"El coche hace un ruido raro, ¿podríais mirarlo esta semana?"',
    color: "bg-gray-50 dark:bg-gray-900/30 border-gray-200 dark:border-gray-700",
    iconColor: "text-gray-600",
  },
  {
    icon: Hotel,
    label: "Hotel",
    emoji: "🏨",
    description: "Reservas de habitación, precios y disponibilidad.",
    example: '"¿Tienen habitación doble libre del 15 al 18 de agosto?"',
    color: "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800",
    iconColor: "text-amber-600",
  },
]

export function NichesSection() {
  const [active, setActive] = useState(0)
  const ActiveIcon = niches[active].icon

  return (
    <section id="niches" className="py-32">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-sm font-semibold text-violet-600 dark:text-violet-400 uppercase tracking-widest mb-4">
            Sectores
          </p>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-5">
            Funciona para cualquier
            <br />
            <span className="gradient-text">negocio local</span>
          </h2>
          <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            Cada sector tiene su propio template de IA, servicios predefinidos y flujos de conversación adaptados.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-10 items-start">
          {/* Niche list */}
          <div className="grid grid-cols-2 gap-3">
            {niches.map((niche, i) => (
              <motion.button
                key={niche.label}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                onClick={() => setActive(i)}
                className={`flex items-center gap-3 p-4 rounded-xl border text-left transition-all ${
                  active === i
                    ? "border-violet-300 dark:border-violet-700 bg-violet-50 dark:bg-violet-900/30 shadow-sm"
                    : "border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700"
                }`}
              >
                <span className="text-2xl">{niche.emoji}</span>
                <span className="font-medium text-gray-900 dark:text-white text-sm">
                  {niche.label}
                </span>
              </motion.button>
            ))}
          </div>

          {/* Conversation demo */}
          <motion.div
            key={active}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 shadow-lg"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${niches[active].color}`}>
                <ActiveIcon className={`w-5 h-5 ${niches[active].iconColor}`} />
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {niches[active].label}
                </p>
                <p className="text-xs text-gray-500">{niches[active].description}</p>
              </div>
            </div>

            <div className="space-y-4">
              {/* AI greeting */}
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-violet-100 dark:bg-violet-900/50 flex items-center justify-center text-xs font-bold text-violet-600 flex-shrink-0">
                  IA
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl rounded-tl-sm px-4 py-3 text-sm text-gray-700 dark:text-gray-300 max-w-xs">
                  Hola, gracias por llamar. ¿En qué puedo ayudarte hoy?
                </div>
              </div>

              {/* Client message */}
              <div className="flex gap-3 justify-end">
                <div className="bg-violet-600 rounded-2xl rounded-tr-sm px-4 py-3 text-sm text-white max-w-xs">
                  {niches[active].example}
                </div>
                <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-xs font-bold text-gray-600 flex-shrink-0">
                  TÚ
                </div>
              </div>

              {/* AI response */}
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-violet-100 dark:bg-violet-900/50 flex items-center justify-center text-xs font-bold text-violet-600 flex-shrink-0">
                  IA
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl rounded-tl-sm px-4 py-3 text-sm text-gray-700 dark:text-gray-300 max-w-xs">
                  Perfecto, déjame comprobar la disponibilidad. ¿A qué nombre lo reservo y tienes alguna preferencia de horario?
                </div>
              </div>

              {/* Typing indicator */}
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-violet-100 dark:bg-violet-900/50 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs">⚡</span>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl rounded-tl-sm px-4 py-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center gap-2 text-xs text-gray-400">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              Cita registrada automáticamente en el calendario
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
