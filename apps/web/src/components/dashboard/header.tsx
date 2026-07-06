"use client"

import { Bell, Menu } from "lucide-react"
import { useBusinessStore } from "@/store/business.store"
import { useUser } from "@clerk/nextjs"

interface DashboardHeaderProps {
  onMenuOpen?: () => void
}

export function DashboardHeader({ onMenuOpen }: DashboardHeaderProps) {
  const { businesses, currentBusinessId } = useBusinessStore()
  const { user } = useUser()
  const currentBusiness = businesses.find((b) => b.id === currentBusinessId)

  return (
    <header className="h-[60px] bg-white border-b border-border flex items-center justify-between px-4 md:px-6">
      <div className="flex items-center gap-3">
        {/* Hamburger — mobile only */}
        <button
          onClick={onMenuOpen}
          className="md:hidden w-8 h-8 rounded-xl flex items-center justify-center text-muted hover:text-ink hover:bg-surface transition-all"
          aria-label="Abrir menú"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <p className="text-[14px] font-semibold text-ink">
            {currentBusiness?.name || "Dashboard"}
          </p>
          <p className="text-[11px] text-muted capitalize">
            {currentBusiness?.niche?.replace(/_/g, " ").toLowerCase() || "Panel de control"}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          className="relative w-8 h-8 rounded-xl flex items-center justify-center text-muted hover:text-ink hover:bg-surface transition-all"
          aria-label="Notificaciones"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-accent rounded-full" />
        </button>

        <div className="w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold text-white"
          style={{ background: "#5B5BD6" }}>
          {user?.firstName?.charAt(0)?.toUpperCase() || "U"}
        </div>
      </div>
    </header>
  )
}
