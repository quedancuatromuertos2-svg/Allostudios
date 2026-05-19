"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  ArrowRight,
  PhoneCall,
  CalendarCheck,
  Brain,
  Star,
  Zap,
} from "lucide-react"

const stats = [
  { label: "Llamadas atendidas", value: "2M+" },
  { label: "Negocios activos", value: "500+" },
  { label: "Citas reservadas", value: "150K+" },
  { label: "Ahorro de tiempo", value: "8h/día" },
]

const features = [
  { icon: PhoneCall, text: "Atiende llamadas 24/7" },
  { icon: CalendarCheck, text: "Reserva citas automáticamente" },
  { icon: Brain, text: "IA con memoria contextual" },
  { icon: Zap, text: "Respuesta en < 500ms" },
]

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center hero-gradient overflow-hidden">
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Floating orbs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-violet-400/20 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-400/15 rounded-full blur-3xl animate-pulse-slow" />

      <div className="relative max-w-7xl mx-auto px-6 py-32 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 bg-violet-50 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 text-sm font-medium px-4 py-2 rounded-full border border-violet-200 dark:border-violet-700 mb-8"
        >
          <Star className="w-4 h-4 fill-violet-500 text-violet-500" />
          El asistente telefónico con IA #1 para negocios locales
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-6 leading-[1.1]"
        >
          Tu recepcionista{" "}
          <span className="gradient-text">con IA</span>
          <br />
          atiende mientras<br />tú trabajas
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-10"
        >
          Conecta un número de teléfono y deja que nuestra IA atienda tus
          llamadas, reserve citas y capture leads — automáticamente, 24/7,
          con voz completamente natural.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <Link href="/register">
            <Button
              size="lg"
              className="bg-violet-600 hover:bg-violet-700 text-white px-8 h-12 text-base font-semibold gap-2"
            >
              Empieza gratis — 14 días sin tarjeta
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Button
            size="lg"
            variant="outline"
            className="h-12 px-8 text-base font-semibold"
          >
            <PhoneCall className="w-4 h-4 mr-2" />
            Ver demo en vivo
          </Button>
        </motion.div>

        {/* Feature pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-3 mb-20"
        >
          {features.map(({ icon: Icon, text }) => (
            <div
              key={text}
              className="flex items-center gap-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-full px-4 py-2 text-sm text-gray-600 dark:text-gray-400 shadow-sm"
            >
              <Icon className="w-4 h-4 text-violet-600" />
              {text}
            </div>
          ))}
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto"
        >
          {stats.map(({ label, value }) => (
            <div key={label} className="text-center">
              <div className="text-3xl font-extrabold text-gray-900 dark:text-white mb-1">
                {value}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">{label}</div>
            </div>
          ))}
        </motion.div>

        {/* Dashboard mockup preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-20 relative mx-auto max-w-5xl"
        >
          <div className="relative bg-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-700">
            <div className="flex items-center gap-2 px-4 py-3 bg-gray-800 border-b border-gray-700">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="ml-4 text-xs text-gray-400 font-mono">
                app.voiceflow.ai/dashboard
              </span>
            </div>
            <div className="p-6 grid grid-cols-4 gap-4">
              {[
                { label: "Llamadas hoy", value: "47", change: "+12%" },
                { label: "Citas reservadas", value: "23", change: "+8%" },
                { label: "Leads capturados", value: "11", change: "+22%" },
                { label: "Tasa conversión", value: "48%", change: "+5%" },
              ].map((stat) => (
                <div key={stat.label} className="bg-gray-800 rounded-xl p-4">
                  <p className="text-gray-400 text-xs mb-2">{stat.label}</p>
                  <p className="text-white text-2xl font-bold">{stat.value}</p>
                  <p className="text-green-400 text-xs mt-1">{stat.change}</p>
                </div>
              ))}
            </div>
            <div className="px-6 pb-6">
              <div className="bg-gray-800 rounded-xl p-4 h-32 flex items-end gap-1">
                {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 72, 88].map(
                  (h, i) => (
                    <div
                      key={i}
                      className="flex-1 bg-violet-500 rounded-sm opacity-80"
                      style={{ height: `${h}%` }}
                    />
                  ),
                )}
              </div>
            </div>
          </div>
          {/* Glow effect */}
          <div className="absolute -inset-4 bg-violet-500/20 rounded-3xl blur-2xl -z-10" />
        </motion.div>
      </div>
    </section>
  )
}
