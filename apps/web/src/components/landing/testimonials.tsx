"use client"

import { motion } from "framer-motion"
import { Star } from "lucide-react"

const testimonials = [
  {
    name: "Carlos Martínez",
    role: "Dueño, Barbería Urban Cut",
    avatar: "CM",
    content:
      "Desde que instalé VoiceFlow, no pierdo ninguna llamada cuando estoy cortando. El agente reserva las citas solo y los clientes no notan la diferencia con una persona real.",
    rating: 5,
    niche: "Barbería",
  },
  {
    name: "Laura Sánchez",
    role: "Directora, Salón Bella",
    avatar: "LS",
    content:
      "Increíble. Las clientas llaman y el agente les explica tratamientos, les aconseja y reserva sin problema. Hemos aumentado las citas un 40% en dos meses.",
    rating: 5,
    niche: "Salón de belleza",
  },
  {
    name: "Pedro Jiménez",
    role: "Gerente, Clínica DentalPlus",
    avatar: "PJ",
    content:
      "Teníamos muchas llamadas perdidas fuera de horario. Ahora el agente atiende 24/7, prioriza urgencias y el lunes ya tenemos la agenda llena. Indispensable.",
    rating: 5,
    niche: "Clínica dental",
  },
  {
    name: "Ana García",
    role: "CEO, Inmobiliaria Premier",
    avatar: "AG",
    content:
      "Cualifica los leads perfectamente. Recoge presupuesto, zona y tipo de propiedad. Ahorramos horas de llamadas de baja calidad. El ROI fue inmediato.",
    rating: 5,
    niche: "Inmobiliaria",
  },
  {
    name: "Mikel Etxebarria",
    role: "Propietario, Restaurante Bahía",
    avatar: "ME",
    content:
      "Mis clientes llaman para reservar mesa y el agente lo gestiona todo sin que yo tenga que moverme de la cocina. Perfecto para cuando estoy en el servicio.",
    rating: 5,
    niche: "Restaurante",
  },
  {
    name: "Rosa Fernández",
    role: "Directora, Gym FitPro",
    avatar: "RF",
    content:
      "Los nuevos clientes llaman para informarse y el agente les explica tarifas, les habla de las clases y les apunta a una evaluación física. Conversión altísima.",
    rating: 5,
    niche: "Gimnasio",
  },
]

export function TestimonialsSection() {
  return (
    <section className="py-32">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-sm font-semibold text-violet-600 dark:text-violet-400 uppercase tracking-widest mb-4">
            Testimonios
          </p>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-5">
            Negocios que ya lo están usando
          </h2>
          <p className="text-xl text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
            Más de 500 negocios en España confían en VoiceFlow AI.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-6">
                "{t.content}"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-violet-100 dark:bg-violet-900/50 flex items-center justify-center text-sm font-bold text-violet-600 dark:text-violet-400">
                  {t.avatar}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white text-sm">
                    {t.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{t.role}</p>
                </div>
                <span className="ml-auto text-xs bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 px-2 py-1 rounded-full">
                  {t.niche}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
