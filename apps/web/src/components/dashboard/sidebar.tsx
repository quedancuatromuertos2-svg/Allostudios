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
  Users,
} from "lucide-react"
import { useClerk, useUser } from "@clerk/nextjs"
import { useEffect, useState } from "react"
import { useBusinessStore } from "@/store/business.store"
import { api } from "@/lib/api"
import { useQuery } from "@tanstack/react-query"
import { LogoFull } from "@/components/Logo"

const navItems = [
  { href: "/dashboard",  icon: LayoutDashboard, label: "Dashboard" },
  { href: "/calls",      icon: PhoneCall,        label: "Llamadas" },
  { href: "/analytics",  icon: BarChart3,         label: "Analytics" },
  { href: "/calendar",   icon: Calendar,          label: "Calendario" },
  { href: "/ai-config",  icon: Brain,             label: "Config. IA" },
  { href: "/team",       icon: Users,             label: "Equipo" },
  { href: "/billing",    icon: CreditCard,        label: "Facturación" },
  { href: "/settings",   icon: Settings,          label: "Ajustes" },
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

interface DashboardSidebarProps {
  mobileOpen?: boolean
  onClose?: () => void
}

export function DashboardSidebar({ mobileOpen = false, onClose }: DashboardSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { signOut } = useClerk()
  const { user } = useUser()
  const { currentBusinessId, businesses, setCurrentBusiness, setBusinesses } = useBusinessStore()
  const [selectorOpen, setSelectorOpen] = useState(false)

  // Auto-close sidebar on route change (mobile)
  useEffect(() => {
    onClose?.()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  const { data: fetchedBusinesses } = useQuery({
    queryKey: ["businesses"],
    queryFn: () => api.get("/api/businesses").then((r) => r.data),
    staleTime: 60_000,
  })

  useEffect(() => {
    if (fetchedBusinesses?.data?.length) {
      const list = fetchedBusinesses.data
      setBusinesses(list)
      const currentStillValid = list.some((b: { id: string }) => b.id === currentBusinessId)
      if (!currentBusinessId || !currentStillValid) {
        setCurrentBusiness(list[0])
      }
    } else if (fetchedBusinesses?.data !== undefined && fetchedBusinesses.data.length === 0) {
      router.push("/onboarding")
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchedBusinesses])

  const currentBusiness = businesses.find((b) => b.id === currentBusinessId)

  return (
    <aside className={cn(
      "w-60 h-screen bg-white border-r border-border flex flex-col shrink-0",
      // Desktop: always visible
      "md:relative md:translate-x-0",
      // Mobile: fixed drawer, slides in/out
      "fixed inset-y-0 left-0 z-40 transition-transform duration-300 ease-in-out md:transition-none",
      mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
    )}>
      {/* Logo */}
      <div className="px-5 h-[60px] flex items-center border-b border-border">
        <Link href="/dashboard">
          <LogoFull size="sm" />
        </Link>
      </div>

      {/* Business selector */}
      <div className="px-3 py-2.5 border-b border-border relative">
        <button
          onClick={() => setSelectorOpen((o) => !o)}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-surface transition-colors"
        >
          <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm shrink-0"
            style={{ background: "rgba(91,91,214,0.08)" }}>
            {currentBusiness ? NICHE_ICONS[currentBusiness.niche] || "🏢" : "🏢"}
          </div>
          <div className="flex-1 text-left min-w-0">
            <p className="text-[13px] font-semibold text-ink truncate">
              {currentBusiness?.name || "Selecciona negocio"}
            </p>
            <p className="text-[11px] text-muted capitalize truncate">
              {currentBusiness?.niche?.replace(/_/g, " ").toLowerCase() || "—"}
            </p>
          </div>
          <ChevronDown className={cn("w-3.5 h-3.5 text-muted transition-transform shrink-0", selectorOpen && "rotate-180")} />
        </button>

        {selectorOpen && (
          <div className="absolute top-full left-3 right-3 z-50 bg-white rounded-xl border border-border shadow-md overflow-hidden">
            {businesses.map((b) => (
              <button
                key={b.id}
                onClick={() => { setCurrentBusiness(b); setSelectorOpen(false) }}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-2.5 hover:bg-surface transition-colors text-left",
                  b.id === currentBusinessId && "bg-accent-light",
                )}
              >
                <span className="text-base">{NICHE_ICONS[b.niche] || "🏢"}</span>
                <div>
                  <p className="text-[13px] font-semibold text-ink">{b.name}</p>
                  <p className="text-[11px] text-muted capitalize">{b.niche?.replace(/_/g, " ").toLowerCase()}</p>
                </div>
              </button>
            ))}
            <button
              onClick={() => { router.push("/onboarding"); setSelectorOpen(false) }}
              className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-surface border-t border-border text-[13px] text-accent font-medium transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Añadir negocio
            </button>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-150",
                isActive
                  ? "bg-accent-light text-accent"
                  : "text-dim hover:bg-surface hover:text-ink",
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute left-0 w-0.5 h-5 bg-accent rounded-r-full"
                />
              )}
              <item.icon className={cn("w-[15px] h-[15px] shrink-0", isActive ? "text-accent" : "text-muted")} />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* User */}
      <div className="px-3 py-3 border-t border-border">
        <div className="flex items-center gap-2.5 px-2">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold text-white shrink-0"
            style={{ background: "#5B5BD6" }}>
            {user?.firstName?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-semibold text-ink truncate">
              {user?.fullName || user?.firstName || "Usuario"}
            </p>
            <p className="text-[11px] text-muted truncate">
              {user?.primaryEmailAddress?.emailAddress || ""}
            </p>
          </div>
          <button
            onClick={() => signOut()}
            className="text-muted hover:text-dim transition-colors p-1 rounded-lg hover:bg-surface"
            title="Cerrar sesión"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  )
}
