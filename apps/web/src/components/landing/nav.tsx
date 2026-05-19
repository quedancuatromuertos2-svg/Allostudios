"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Phone, Menu, X } from "lucide-react"

export function LandingNav() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 dark:bg-gray-950/95 backdrop-blur-md shadow-sm border-b border-gray-100 dark:border-gray-800"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center">
            <Phone className="w-4 h-4 text-white" />
          </div>
          <span className="gradient-text">VoiceFlow AI</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600 dark:text-gray-400">
          <Link href="#features" className="hover:text-gray-900 dark:hover:text-white transition-colors">
            Características
          </Link>
          <Link href="#niches" className="hover:text-gray-900 dark:hover:text-white transition-colors">
            Sectores
          </Link>
          <Link href="#pricing" className="hover:text-gray-900 dark:hover:text-white transition-colors">
            Precios
          </Link>
          <Link href="#faq" className="hover:text-gray-900 dark:hover:text-white transition-colors">
            FAQ
          </Link>
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost" size="sm">
              Iniciar sesión
            </Button>
          </Link>
          <Link href="/register">
            <Button
              size="sm"
              className="bg-violet-600 hover:bg-violet-700 text-white"
            >
              Prueba gratis 14 días
            </Button>
          </Link>
        </div>

        <button
          className="md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-white dark:bg-gray-950 border-b border-gray-100 dark:border-gray-800 px-6 py-4 space-y-4"
        >
          {["Características", "Sectores", "Precios", "FAQ"].map((item) => (
            <Link
              key={item}
              href={`#${item.toLowerCase()}`}
              className="block text-gray-600 dark:text-gray-400 hover:text-gray-900"
              onClick={() => setMobileOpen(false)}
            >
              {item}
            </Link>
          ))}
          <div className="pt-2 flex flex-col gap-2">
            <Link href="/login">
              <Button variant="outline" className="w-full">
                Iniciar sesión
              </Button>
            </Link>
            <Link href="/register">
              <Button className="w-full bg-violet-600 hover:bg-violet-700 text-white">
                Prueba gratis 14 días
              </Button>
            </Link>
          </div>
        </motion.div>
      )}
    </header>
  )
}
