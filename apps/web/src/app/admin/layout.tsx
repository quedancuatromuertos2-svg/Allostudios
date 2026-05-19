import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import Link from "next/link"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { userId } = await auth()
  if (!userId) redirect("/login")

  return (
    <div className="min-h-screen bg-gray-950 text-white flex">
      <aside className="w-56 border-r border-gray-800 flex flex-col p-4 gap-1 shrink-0">
        <div className="px-3 py-4 mb-2">
          <div className="text-xs font-bold text-violet-400 uppercase tracking-widest">VoiceFlow</div>
          <div className="text-lg font-bold text-white">Admin Panel</div>
        </div>
        {[
          { href: "/admin", label: "📊 Overview" },
          { href: "/admin/clients", label: "👥 Clientes" },
          { href: "/admin/calls", label: "📞 Llamadas" },
          { href: "/admin/subscriptions", label: "💳 Suscripciones" },
          { href: "/dashboard", label: "← Mi Dashboard" },
        ].map(item => (
          <Link
            key={item.href}
            href={item.href}
            className="px-3 py-2 rounded-lg text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
          >
            {item.label}
          </Link>
        ))}
      </aside>
      <main className="flex-1 p-8 overflow-y-auto">{children}</main>
    </div>
  )
}
