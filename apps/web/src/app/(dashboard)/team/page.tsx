"use client"

import { Users, Mail, Shield, Clock } from "lucide-react"
import { useUser } from "@clerk/nextjs"

export default function TeamPage() {
  const { user } = useUser()

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Equipo</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
          Gestiona los miembros de tu equipo y sus permisos
        </p>
      </div>

      {/* Current user */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
        <h2 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Users className="w-4 h-4 text-violet-600" />
          Miembros actuales
        </h2>

        <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-800">
          <div className="w-10 h-10 rounded-full bg-violet-100 dark:bg-violet-900/50 flex items-center justify-center font-bold text-violet-600 text-sm">
            {user?.firstName?.charAt(0) || "U"}
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {user?.fullName || "Usuario"}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {user?.primaryEmailAddress?.emailAddress || ""}
            </p>
          </div>
          <span className="flex items-center gap-1.5 text-xs font-medium bg-violet-100 dark:bg-violet-900/50 text-violet-700 dark:text-violet-300 px-2.5 py-1 rounded-full">
            <Shield className="w-3 h-3" />
            Propietario
          </span>
        </div>
      </div>

      {/* Coming soon */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-12 text-center">
        <div className="w-14 h-14 rounded-2xl bg-violet-50 dark:bg-violet-900/30 flex items-center justify-center mx-auto mb-4">
          <Clock className="w-7 h-7 text-violet-600" />
        </div>
        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
          Invitación de equipo — Próximamente
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
          Pronto podrás invitar a colaboradores, asignar roles y controlar el acceso a cada sección del panel.
        </p>
        <div className="flex items-center justify-center gap-2 mt-6">
          <div className="flex items-center gap-2 text-xs text-gray-400 bg-gray-50 dark:bg-gray-800 px-4 py-2 rounded-xl">
            <Mail className="w-3.5 h-3.5" />
            Invitar por email
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400 bg-gray-50 dark:bg-gray-800 px-4 py-2 rounded-xl">
            <Shield className="w-3.5 h-3.5" />
            Roles y permisos
          </div>
        </div>
      </div>
    </div>
  )
}
