import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import FloatingWhatsApp from '@/components/FloatingWhatsApp'
import LuzFondo from '@/components/LuzFondo'
import LuzPapel from '@/components/LuzPapel'

/*  Guías de SEO: páginas de texto que responden una búsqueda concreta («reseñas google my business»,
    «google my business españa») y terminan en el servicio que la resuelve. No son blog: cada una
    existe para una keyword que hemos visto ganable (dificultad baja, volumen real).
    El cierre va al final, nunca arriba: primero se resuelve la duda, luego se ofrece.              */

export type Faq = { p: string; r: string }

export function Seccion({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section className="mt-14">
      <h2 className="font-display text-[clamp(1.4rem,3.2vw,2rem)] leading-[1.1] font-semibold tracking-[-0.035em] text-white text-balance">
        {titulo}
      </h2>
      <div className="mt-5 space-y-4 text-[16px] leading-relaxed text-white/70">{children}</div>
    </section>
  )
}

export function Pasos({ items }: { items: { t: string; d: string }[] }) {
  return (
    <ol className="mt-6 space-y-3 list-none p-0">
      {items.map((it, i) => (
        <li key={it.t} className="rounded-2xl p-1.5 bg-white/[.04] ring-1 ring-white/10">
          <div className="rounded-[calc(1rem-0.125rem)] bg-[rgba(16,15,22,.6)] p-5 flex gap-4">
            <span className="shrink-0 font-mono text-[12px] text-white/40 pt-1 tabular-nums">
              {String(i + 1).padStart(2, '0')}
            </span>
            <div>
              <div className="text-[15.5px] font-semibold text-white">{it.t}</div>
              <p className="mt-1.5 text-[15px] text-white/65 leading-relaxed">{it.d}</p>
            </div>
          </div>
        </li>
      ))}
    </ol>
  )
}

/*  El bloque que de verdad convierte: enseñar sin adornos cuánto trabajo mensual es esto.
    Quien lo lee y piensa «yo esto no lo hago» es exactamente nuestro cliente. Los minutos son
    estimaciones honestas de lo que cuesta hacerlo bien, no cifras infladas para asustar.        */
export function TrabajoMensual({
  tareas,
  total,
  nota,
}: {
  tareas: { que: string; cada: string; min: string }[]
  total: string
  nota: string
}) {
  return (
    <div className="mt-7 rounded-[1.6rem] p-1.5 bg-white/[.04] ring-1 ring-white/10">
      <div className="rounded-[calc(1.6rem-0.375rem)] bg-[rgba(16,15,22,.72)] p-6 md:p-7">
        <p className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-white/40 m-0">
          Lo que cuesta mantenerlo
        </p>
        <div className="mt-5 overflow-x-auto">
          <table className="w-full text-[14.5px] border-collapse min-w-[30rem]">
            <thead>
              <tr className="text-white/40 font-mono text-[10.5px] uppercase tracking-[0.14em]">
                <th className="text-left font-medium pb-3 pr-4">Tarea</th>
                <th className="text-left font-medium pb-3 pr-4">Cada</th>
                <th className="text-right font-medium pb-3 tabular-nums">Tiempo</th>
              </tr>
            </thead>
            <tbody>
              {tareas.map((t) => (
                <tr key={t.que} className="border-t border-white/10">
                  <td className="py-3 pr-4 text-white/80">{t.que}</td>
                  <td className="py-3 pr-4 text-white/50">{t.cada}</td>
                  <td className="py-3 text-right text-white/80 tabular-nums whitespace-nowrap">{t.min}</td>
                </tr>
              ))}
              <tr className="border-t border-white/20">
                <td className="pt-4 font-semibold text-white" colSpan={2}>
                  Total al mes
                </td>
                <td className="pt-4 text-right font-semibold text-accent tabular-nums whitespace-nowrap">
                  {total}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-5 mb-0 text-[14.5px] leading-relaxed text-white/60">{nota}</p>
      </div>
    </div>
  )
}

export function Aviso({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-6 rounded-2xl border border-amber-400/25 bg-amber-400/[.06] p-5 text-[15px] leading-relaxed text-white/80">
      {children}
    </div>
  )
}

export default function GuiaSeo({
  h1,
  entradilla,
  actualizado,
  faqs,
  cierre,
  etiqueta = 'Guía',
  schemaExtra,
  children,
}: {
  h1: string
  entradilla: string
  actualizado: string
  faqs: Faq[]
  cierre: { titulo: string; texto: string; enlace: string; boton: string }
  etiqueta?: string
  schemaExtra?: Record<string, unknown>
  children: React.ReactNode
}) {
  const jsonLd: Record<string, unknown>[] = [
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map((f) => ({
        '@type': 'Question',
        name: f.p,
        acceptedAnswer: { '@type': 'Answer', text: f.r },
      })),
    },
  ]
  if (schemaExtra) jsonLd.push(schemaExtra)

  return (
    <div className="tema-oscuro">
      <LuzFondo />
      <LuzPapel />
      <Navigation />
      <main className="relative z-10 pt-28 pb-24 px-6">
        <article className="max-w-[46rem] mx-auto">
          <span className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.2em] font-medium bg-white/[.06] ring-1 ring-white/10 text-white/70">
            {etiqueta}
          </span>
          <h1 className="mt-6 font-display text-[clamp(2rem,5.2vw,3.2rem)] leading-[1.03] font-semibold tracking-[-0.04em] text-white text-balance">
            {h1}
          </h1>
          <p className="mt-5 text-[17px] leading-relaxed text-white/70">{entradilla}</p>
          <p className="mt-4 text-[13px] text-white/40">Actualizado en {actualizado}</p>

          {children}

          <section className="mt-16">
            <h2 className="font-display text-[clamp(1.4rem,3.2vw,2rem)] leading-[1.1] font-semibold tracking-[-0.035em] text-white">
              Preguntas frecuentes
            </h2>
            <dl className="mt-6 divide-y divide-white/10 border-t border-white/10">
              {faqs.map((f) => (
                <div key={f.p} className="py-5">
                  <dt className="text-[15.5px] font-semibold text-white">{f.p}</dt>
                  <dd className="mt-2 text-[15px] leading-relaxed text-white/65">{f.r}</dd>
                </div>
              ))}
            </dl>
          </section>

          <div className="mt-16 rounded-[1.6rem] p-1.5 bg-white/[.04] ring-1 ring-white/10">
            <div className="rounded-[calc(1.6rem-0.375rem)] bg-[rgba(16,15,22,.72)] p-7 md:p-9">
              <h2 className="font-display text-[clamp(1.3rem,3vw,1.8rem)] leading-[1.1] font-semibold tracking-[-0.035em] text-white text-balance">
                {cierre.titulo}
              </h2>
              <p className="mt-3 text-[15.5px] leading-relaxed text-white/70">{cierre.texto}</p>
              <a
                href={cierre.enlace}
                className="mt-6 inline-flex items-center gap-3 rounded-full bg-white text-[#18181B] pl-6 pr-2 py-2.5 text-[14.5px] font-semibold transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:scale-[1.02] active:scale-[0.98] group"
              >
                {cierre.boton}
                <span className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-1">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                </span>
              </a>
            </div>
          </div>
        </article>
      </main>
      <Footer />
      <FloatingWhatsApp />
      {jsonLd.map((s, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }} />
      ))}
    </div>
  )
}
