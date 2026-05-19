"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  PhoneCall,
  BarChart3,
  Calendar,
  Settings,
  CreditCard,
  Brain,
  ChevronDown,
  LogOut,
  Plus,
} from "lucide-react"
import { useClerk, useUser } from "@clerk/nextjs"
import { useEffect, useState } from "react"
import { useBusinessStore } from "@/store/business.store"
import { api } from "@/lib/api"
import { useQuery } from "@tanstack/react-query"

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/calls", icon: PhoneCall, label: "Llamadas" },
  { href: "/analytics", icon: BarChart3, label: "Analytics" },
  { href: "/calendar", icon: Calendar, label: "Calendario" },
  { href: "/ai-config", icon: Brain, label: "Config. IA" },
  { href: "/billing", icon: CreditCard, label: "Facturación" },
  { href: "/settings", icon: Settings, label: "Ajustes" },
  { href: "/manual", icon: null, label: "📖 Manual" },
  { href: "/admin", icon: null, label: "🔧 Admin" },
]

const NICHE_ICONS: Record<string, string> = {
  BARBER_SHOP: "✂️",
  HAIR_SALON: "💇",
  RESTAURANT: "🍽️",
  DENTAL_CLINIC: "🦷",
  REAL_ESTATE: "🏠",
  GYM: "💪",
  SPA: "🧖",
  VET_CLINIC: "🐾",
}

export function DashboardSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { signOut } = useClerk()
  const { user } = useUser()
  const { currentBusinessId, businesses, setCurrentBusiness, setBusinesses } = useBusinessStore()
  const [selectorOpen, setSelectorOpen] = useState(false)

  const { data: fetchedBusinesses } = useQuery({
    queryKey: ["businesses"],
    queryFn: () => api.get("/api/businesses").then((r) => r.data),
    staleTime: 60_000,
  })

  useEffect(() => {
    if (fetchedBusinesses?.data?.length) {
      setBusinesses(fetchedBusinesses.data)
      if (!currentBusinessId) {
        setCurrentBusiness(fetchedBusinesses.data[0])
      }
    } else if (fetchedBusinesses?.data?.length === 0) {
      router.push("/onboarding")
    }
  }, [fetchedBusinesses])

  const currentBusiness = businesses.find((b) => b.id === currentBusinessId)

  return (
    <aside className="w-64 h-screen bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 flex flex-col">
      {/* Logo */}
      <div className="px-6 h-16 flex items-center border-b border-gray-100 dark:border-gray-800">
        <Link href="/dashboard" className="flex items-center gap-2 font-bold">
          <div className="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden" style={{ background: "#d41f1f" }}>
            <span style={{ fontFamily: "Georgia, serif", fontWeight: 900, color: "#fff", fontSize: "0.9rem", fontStyle: "italic" }}>a</span>
          </div>
          <span style={{ fontFamily: "Georgia, serif", fontWeight: 700, fontSize: "1.1rem", color: "#1a1614" }}>
            <span style={{ color: "#d41f1f" }}>allo</span>Studios
          </span>
        </Link>
      </div>

      {/* Business selector */}
      <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800 relative">
        <button
          onClick={() => setSelectorOpen((o) => !o)}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          <div className="w-8 h-8 rounded-lg bg-violet-100 dark:bg-violet-900/50 flex items-center justify-center text-sm">
            {currentBusiness ? NICHE_ICONS[currentBusiness.niche] || "🏢" : "🏢"}
          </div>
          <div className="flex-1 text-left">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {currentBusiness?.name || "Selecciona negocio"}
            </p>
            <p className="text-xs text-gray-500 capitalize">
              {currentBusiness?.niche?.replace(/_/g, " ").toLowerCase() || "—"}
            </p>
          </div>
          <ChevronDown className={cn("w-4 h-4 text-gray-400 transition-transform", selectorOpen && "rotate-180")} />
        </button>

        {selectorOpen && (
          <div className="absolute top-full left-4 right-4 z-50 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg overflow-hidden">
            {businesses.map((b) => (
              <button
                key={b.id}
                onClick={() => { setCurrentBusiness(b); setSelectorOpen(false) }}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left",
                  b.id === currentBusinessId && "bg-violet-50 dark:bg-violet-900/30",
                )}
              >
                <span className="text-lg">{NICHE_ICONS[b.niche] || "🏢"}</span>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{b.name}</p>
                  <p className="text-xs text-gray-500">{b.niche?.replace(/_/g, " ").toLowerCase()}</p>
                </div>
              </button>
            ))}
            <button
              onClick={() => { router.push("/onboarding"); setSelectorOpen(false) }}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 border-t border-gray-100 dark:border-gray-700 text-sm text-violet-600 dark:text-violet-400"
            >
              <Plus className="w-4 h-4" />
              Añadir negocio
            </button>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150",
                isActive
                  ? "bg-violet-50 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white",
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute left-0 w-1 h-8 bg-violet-600 rounded-r-full"
                />
              )}
              {item.icon && <item.icon className={cn("w-4 h-4", isActive && "text-violet-600 dark:text-violet-400")} />}
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* User */}
      <div className="px-4 py-4 border-t border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-violet-100 dark:bg-violet-900/50 flex items-center justify-center text-sm font-bold text-violet-600">
            {user?.firstName?.charAt(0) || "U"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {user?.fullName || "Usuario"}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {user?.primaryEmailAddress?.emailAddress || ""}
            </p>
          </div>
          <button
            onClick={() => signOut()}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  )
}
