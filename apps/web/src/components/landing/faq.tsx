"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import { ChevronDown } from "lucide-react"

const faqs = [
  {
    q: "¿Cuánto tiempo tarda en estar funcionando?",
    a: "En menos de 10 minutos. Te registras, eliges tu sector, configuras el perfil del negocio y conectas un número de Twilio. La IA empieza a atender llamadas de inmediato.",
  },
  {
    q: "¿Suena realmente como una persona?",
    a: "Sí. Usamos las mejores voces de ElevenLabs con IA conversacional de OpenAI. La latencia es inferior a 500ms y la conversación fluye de forma completamente natural. La mayoría de clientes no notan que hablan con una IA.",
  },
  {
    q: "¿Qué pasa si la IA no sabe responder algo?",
    a: "El agente puede transferir la llamada a tu teléfono real o dejar un mensaje para que llames de vuelta. Tú controlas en qué casos escalar al equipo humano.",
  },
  {
    q: "¿Puedo personalizar la voz y el tono del agente?",
    a: "Completamente. Puedes elegir el nombre del agente, su voz, tono, idioma y darle instrucciones personalizadas. También puedes editar el prompt del sistema para adaptarlo exactamente a tu negocio.",
  },
  {
    q: "¿Los datos de mis clientes son seguros?",
    a: "Sí. Cumplimos con el RGPD (GDPR). Los datos se almacenan en servidores dentro de la UE, están cifrados y nunca se comparten con terceros. Cada negocio tiene sus datos completamente aislados.",
  },
  {
    q: "¿Funciona fuera de España?",
    a: "Sí. La plataforma soporta múltiples idiomas y números de teléfono en más de 20 países. Puedes tener negocios en diferentes países con la misma cuenta.",
  },
  {
    q: "¿Qué pasa cuando se acaban las llamadas del plan?",
    a: "Te notificamos cuando alcances el 80% de tu límite. Puedes actualizar de plan en cualquier momento sin interrupciones del servicio.",
  },
  {
    q: "¿Puedo cancelar cuando quiera?",
    a: "Sí, sin permanencia. Cancelas en cualquier momento desde el panel de facturación. El servicio continúa hasta el final del período pagado.",
  },
]

export function FAQSection() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section id="faq" className="py-32 bg-gray-50 dark:bg-gray-900/50">
      <div className="max-w-3xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-sm font-semibold text-violet-600 dark:text-violet-400 uppercase tracking-widest mb-4">
            FAQ
          </p>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white">
            Preguntas frecuentes
          </h2>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={faq.q}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden"
            >
              <button
                className="w-full flex items-center justify-between px-6 py-4 text-left"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span className="font-medium text-gray-900 dark:text-white pr-4">
                  {faq.q}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-200 ${
                    open === i ? "rotate-180" : ""
                  }`}
                />
              </button>
              {open === i && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="px-6 pb-5"
                >
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {faq.a}
                  </p>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
