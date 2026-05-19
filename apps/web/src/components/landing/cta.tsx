"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, PhoneCall } from "lucide-react"

export function CTASection() {
  return (
    <section className="py-32">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative"
        >
          <div className="absolute -inset-4 bg-gradient-to-r from-violet-600/20 to-indigo-600/20 rounded-3xl blur-2xl" />
          <div className="relative bg-gradient-to-br from-violet-600 to-indigo-700 rounded-3xl p-12 md:p-16 overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
            </div>

            <div className="relative">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm mb-6">
                <PhoneCall className="w-8 h-8 text-white" />
              </div>

              <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4">
                Empieza hoy, gratis.
              </h2>
              <p className="text-xl text-violet-200 mb-10 max-w-xl mx-auto">
                14 días de prueba gratuita. Sin tarjeta de crédito. Cancela cuando quieras.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/register">
                  <Button
                    size="lg"
                    className="bg-white text-violet-700 hover:bg-violet-50 px-8 h-12 text-base font-semibold gap-2"
                  >
                    Crear cuenta gratis
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/40 text-white hover:bg-white/10 h-12 px-8 text-base"
                >
                  Ver demo
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
