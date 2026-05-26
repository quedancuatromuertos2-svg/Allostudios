'use client'

import { motion } from 'framer-motion'

const sectores = [
  { icon: '✂️', name: 'Barberías',        desc: 'Reservas automáticas, gestión de turnos y recordatorios sin esfuerzo.', color: 'bg-orange-50' },
  { icon: '🍽️', name: 'Restaurantes',     desc: 'Atiende reservas de mesa 24/7 aunque estés en cocina.',                color: 'bg-red-50' },
  { icon: '🦷', name: 'Clínicas Dentales', desc: 'Gestiona citas, responde dudas y envía recordatorios automáticos.',    color: 'bg-blue-50' },
  { icon: '🏠', name: 'Inmobiliarias',    desc: 'Captura leads, agenda visitas y filtra contactos en piloto automático.', color: 'bg-emerald-50' },
  { icon: '💪', name: 'Gimnasios',        desc: 'Alta de socios, clases y consultas sin intervención del equipo.',       color: 'bg-yellow-50' },
  { icon: '💇', name: 'Salones de Belleza', desc: 'Llena la agenda con reservas automáticas de tratamientos y servicios.', color: 'bg-pink-50' },
  { icon: '🏨', name: 'Hoteles',          desc: 'Check-in virtual, consultas de disponibilidad y atención 24/7.',       color: 'bg-purple-50' },
  { icon: '🐾', name: 'Veterinarias',     desc: 'Consultas urgentes, citas y seguimiento de pacientes automatizado.',   color: 'bg-teal-50' },
]

export default function SectoresSection() {
  return (
    <section id="sectores" className="py-section bg-canvas">
      <div className="max-w-6xl mx-auto px-6 md:px-12">

        <div className="text-center mb-14">
          <motion.span
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
            viewport={{ once: true }} className="eyebrow block mb-4"
          >Compatible con tu negocio</motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ delay: 0.08 }}
            className="text-headline font-semibold text-ink"
          >
            Para cualquier sector.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ delay: 0.16 }}
            className="mt-4 text-dim font-light max-w-md mx-auto"
          >
            AlloStudios se adapta a cualquier negocio que reciba llamadas o necesite gestionar citas.
          </motion.p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {sectores.map((s, i) => (
            <motion.div
              key={s.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
              className="bg-white rounded-2xl border border-border p-5 hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-default"
            >
              <div className={`w-11 h-11 rounded-xl ${s.color} flex items-center justify-center text-2xl mb-4`}>
                {s.icon}
              </div>
              <div className="text-[14px] font-semibold text-ink mb-1.5">{s.name}</div>
              <div className="text-[12px] text-dim font-light leading-relaxed">{s.desc}</div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ delay: 0.4 }}
          className="text-center mt-10"
        >
          <p className="text-[13px] text-muted mb-4">¿No ves tu sector? Podemos adaptarlo a cualquier negocio.</p>
          <a
            href="https://wa.me/34611430660?text=Hola%2C%20quiero%20saber%20si%20AlloStudios%20funciona%20para%20mi%20negocio"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[13px] font-semibold text-accent hover:text-accent-dark transition-colors duration-200"
          >
            Consultar mi sector
            <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
              <path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  )
}
