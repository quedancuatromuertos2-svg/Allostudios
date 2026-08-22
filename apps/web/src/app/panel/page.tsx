import type { Metadata } from 'next'
import Link from 'next/link'
import { UserButton } from '@clerk/nextjs'
import { LogoFull } from '@/components/Logo'
import { getMember, getLeads } from '@/lib/panel'
import LeadsBoard from '@/components/panel/LeadsBoard'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Panel de captación',
  robots: { index: false, follow: false },
}

export default async function PanelPage() {
  const member = await getMember()

  // Sin acceso: no es un error, es que todavía no está dado de alta
  if (!member || !member.active) {
    return (
      <main className="min-h-[100dvh] flex items-center justify-center px-6 py-24">
        <div className="max-w-md w-full text-center">
          <div className="flex justify-center mb-8"><LogoFull /></div>
          <div className="card p-9">
            <h1 className="font-display text-title font-semibold text-ink">Todavía no tienes acceso.</h1>
            <p className="mt-3 text-[14px] text-dim font-light leading-relaxed">
              Esta zona es para el equipo comercial de AlloStudios. Si vas a trabajar con nosotros,
              pídenos que demos de alta tu email y entras con esta misma cuenta.
            </p>
            <div className="flex flex-col sm:flex-row gap-2.5 justify-center mt-7">
              <a
                href="https://wa.me/34695868793?text=Hola%2C%20quiero%20acceso%20al%20panel%20de%20captaci%C3%B3n."
                target="_blank" rel="noopener noreferrer"
                className="btn-accent justify-center rounded-full"
              >
                Pedir acceso
              </a>
              <Link href="/afiliados" className="btn-secondary justify-center rounded-full">
                Ver el programa
              </Link>
            </div>
          </div>
          <div className="mt-6 flex justify-center"><UserButton afterSignOutUrl="/" /></div>
        </div>
      </main>
    )
  }

  const leads = await getLeads(member)
  const activos = leads.filter((l) => l.status !== 'descartado')
  const clientes = leads.filter((l) => l.status === 'cliente').length
  const contactados = leads.filter((l) => l.contacted_at).length

  return (
    <main className="min-h-[100dvh] bg-canvas">
      {/* Cabecera */}
      <header className="border-b border-border bg-white/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-6 md:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <LogoFull />
            <span className="hidden sm:inline text-[12px] text-muted border-l border-border pl-4">
              Panel de captación
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:block text-[13px] text-dim truncate max-w-[180px]">
              {member.name || member.email}
              {member.role === 'admin' && <span className="ml-2 text-[10px] uppercase tracking-[0.14em] text-accent font-semibold">admin</span>}
            </span>
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 md:px-8 py-8 md:py-10">
        {/* Resumen */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {[
            { n: activos.length, l: 'leads activos' },
            { n: contactados, l: 'ya contactados' },
            { n: leads.filter((l) => l.status === 'interesado').length, l: 'interesados' },
            { n: clientes, l: 'convertidos en cliente' },
          ].map((s) => (
            <div key={s.l} className="card p-5">
              <div className="font-display text-[2rem] leading-none font-semibold text-ink tracking-[-0.03em]">{s.n}</div>
              <div className="text-[12px] text-muted mt-1.5">{s.l}</div>
            </div>
          ))}
        </div>

        <LeadsBoard leads={leads} member={member} />
      </div>
    </main>
  )
}
