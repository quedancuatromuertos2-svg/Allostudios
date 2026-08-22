import type { Metadata } from 'next'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import ComisionCalculadora from '@/components/afiliados/ComisionCalculadora'
import AfiliadoForm from '@/components/afiliados/AfiliadoForm'

export const metadata: Metadata = {
  title: 'Programa de comerciales — gana el 30 % de cada venta | AlloStudios',
  description:
    'Vende webs y servicios digitales a negocios locales y llévate el 30 % de cada ticket. Nosotros ponemos los leads, la demo ya hecha, el guion y toda la producción. Tú solo llamas y cierras. 100 % remoto, sin inversión.',
  alternates: { canonical: 'https://allostudios.net/afiliados' },
  openGraph: {
    title: 'Gana el 30 % de cada venta — Programa de comerciales de AlloStudios',
    description: 'Te damos los leads con la demo ya hecha y el guion. Tú solo llamas y cierras. 100 % remoto y sin invertir un euro.',
    url: 'https://allostudios.net/afiliados',
  },
}

// El panel de leads vive en la propia web: cada comercial entra con su cuenta y ve los suyos.
const PANEL = '/panel'

const pasos = [
  {
    n: '01',
    t: 'Te damos la lista',
    d: 'Negocios locales ya filtrados: sin web o con una web vieja, con teléfono verificado y su ficha de Google. Tu lista es tuya — nunca dos comerciales al mismo negocio.',
  },
  {
    n: '02',
    t: 'La demo ya está hecha',
    d: 'Antes de llamar, el negocio ya tiene su web de muestra generada con sus fotos y sus reseñas. No vendes una idea: mandas un enlace y lo ve.',
  },
  {
    n: '03',
    t: 'Llamas y cierras',
    d: 'Con guion, objeciones resueltas y tu correo @allostudios.net. Es lo único que haces. No diseñas, no programas, no das soporte.',
  },
  {
    n: '04',
    t: 'Cobras el 30 %',
    d: 'El cliente paga a AlloStudios y tú cobras el día 5 del mes siguiente. Nosotros producimos, entregamos y mantenemos la web.',
  },
]

const ponemos = [
  'Los leads filtrados y su ficha completa',
  'La demo de su web, generada automáticamente',
  'El guion de llamada y las objeciones resueltas',
  'Correo @allostudios.net y material de marca',
  'Toda la producción: diseño, código, dominio y soporte',
  'La factura y el cobro al cliente',
]

const pones = [
  'Tu teléfono y tus ganas de llamar',
  'Constancia: esto va de volumen, no de suerte',
  'Ser tú mismo — nada de scripts robóticos',
]

const reglas = [
  {
    t: 'El cliente paga siempre a AlloStudios',
    d: 'Tú nunca cobras del cliente. Así ni te la juegas con facturas ni tienes que perseguir a nadie.',
  },
  {
    t: 'La comisión se gana cuando el cliente paga',
    d: 'No al firmar, no al prometer. Cuando el dinero entra, tu 30 % es tuyo.',
  },
  {
    t: 'Se paga el día 5 del mes siguiente',
    d: 'Contra factura tuya. Fecha fija, sin sorpresas ni "te lo paso la semana que viene".',
  },
  {
    t: 'El 30 % es del primer pago',
    d: 'Del ticket que cierres. La cuota mensual de mantenimiento se queda en AlloStudios: es lo que paga el soporte, el hosting y los cambios de por vida.',
  },
  {
    t: 'Nunca dos comerciales al mismo lead',
    d: 'Cada negocio está asignado a una sola persona. Si está en tu lista, es tuyo.',
  },
  {
    t: 'Sin cuotas, sin exclusividad, sin permanencia',
    d: 'No pagas nada por entrar y puedes dejarlo cuando quieras. Tampoco te pedimos dedicación completa.',
  },
]

const faqs = [
  {
    q: '¿Tengo que saber de webs o de diseño?',
    a: 'No. De hecho preferimos que no te metas ahí. Tú vendes; nosotros producimos. Si el cliente pregunta algo técnico, nos lo pasas y lo respondemos nosotros.',
  },
  {
    q: '¿Tengo que darme de alta de autónomo?',
    a: 'Para cobrar comisiones necesitas poder facturar. Si vas a hacer ventas puntuales, hablamos y buscamos la fórmula legal que te encaje. No queremos que te des de alta antes de haber cobrado tu primera comisión.',
  },
  {
    q: '¿De dónde salen los leads?',
    a: 'De una herramienta propia que rastrea negocios de una zona en Google, detecta cuáles no tienen web o la tienen anticuada y los puntúa. No son listas compradas: son negocios reales con un problema real.',
  },
  {
    q: '¿Cuánto tardo en cobrar la primera comisión?',
    a: 'Depende de lo que tardes en cerrar. Una web se cierra normalmente en 2-3 contactos. En cuanto el cliente paga, tu comisión entra en la liquidación del día 5 siguiente.',
  },
  {
    q: '¿Puedo vender fuera de Valencia?',
    a: 'Sí. Todo es remoto y el producto se entrega igual en cualquier punto de España. Si te traes tu propia cartera de negocios, mejor todavía.',
  },
  {
    q: '¿Y si no vendo nada?',
    a: 'No pierdes nada más que tu tiempo: no hay cuota de entrada ni inversión. Pero tampoco cobras — esto es comisión pura.',
  },
]

export default function AfiliadosPage() {
  return (
    <>
      <Navigation />

      <main className="relative z-10">
        {/* ── Hero ── */}
        <section className="relative overflow-hidden pt-40 pb-20 md:pb-24">
          <div className="absolute inset-0 pointer-events-none" style={{
            background: 'linear-gradient(170deg, #FAFAF9 0%, #F3F3FE 55%, #EDEDFB 100%)',
          }} />
          <div className="absolute w-[680px] h-[680px] rounded-full blur-[140px] opacity-40 -top-48 -right-40 pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(124,124,232,0.5) 0%, transparent 65%)' }} />
          <div className="absolute inset-0 line-grid opacity-60 pointer-events-none" />

          <div className="relative z-10 max-w-4xl mx-auto px-6 md:px-12 text-center">
            <span className="eyebrow inline-flex items-center gap-2 mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              Programa de comerciales
            </span>
            <h1 className="font-display text-display font-semibold text-ink text-balance">
              Tú solo llamas.<br />Nosotros hacemos el resto.
            </h1>
            <p className="mt-6 text-[1.08rem] text-dim font-light max-w-xl mx-auto leading-relaxed text-pretty">
              Te damos negocios locales ya filtrados, con su web de muestra ya generada y el guion
              de llamada. Cierras la venta y te llevas el <strong className="text-ink font-semibold">30 % del ticket</strong>.
              Sin invertir un euro y desde donde quieras.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-9">
              <a href="#solicitud" className="btn-accent px-8 py-4 text-[15px] rounded-full">
                Quiero entrar
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                  <path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
              <a href={PANEL} className="lg px-7 py-4 rounded-full font-semibold text-[14px] text-ink">
                Ya soy comercial · Entrar
              </a>
            </div>
            <p className="text-[12px] text-muted mt-5">
              Comisión pura · 100 % remoto · Toda España
            </p>
          </div>
        </section>

        {/* ── Cuánto se gana ── */}
        <section className="py-section">
          <div className="max-w-5xl mx-auto px-6 md:px-12">
            <div className="text-center mb-10">
              <span className="eyebrow block mb-4">Lo que se gana</span>
              <h2 className="text-headline font-semibold text-ink text-balance">
                El 30 % de todo lo que cierres.
              </h2>
              <p className="mt-4 text-dim font-light max-w-lg mx-auto">
                No hay tramos, ni objetivos, ni letra pequeña. Cuanto más caro vendas, más te llevas.
                Mueve las barras y míralo tú mismo.
              </p>
            </div>
            <ComisionCalculadora />
            <p className="text-[12px] text-muted text-center mt-5 max-w-lg mx-auto">
              Sobre el primer pago de cada cliente. La cuota mensual de mantenimiento (49 €/mes) cubre
              hosting, cambios y soporte, y se queda en AlloStudios.
            </p>
          </div>
        </section>

        {/* ── Cómo funciona ── */}
        <section className="py-section bg-ink relative overflow-hidden">
          <div className="absolute w-[600px] h-[600px] rounded-full blur-[120px] top-[-15%] right-[-15%] opacity-20 pointer-events-none"
            style={{ background: 'radial-gradient(circle, #5B5BD6 0%, transparent 65%)' }} />
          <div className="relative z-10 max-w-5xl mx-auto px-6 md:px-12">
            <div className="text-center mb-14">
              <span className="inline-block text-[11px] font-bold tracking-[0.22em] uppercase text-accent mb-5">
                Cómo funciona
              </span>
              <h2 className="text-headline font-semibold text-white text-balance">
                Cuatro pasos. Tú solo estás en uno.
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {pasos.map((p) => (
                <div
                  key={p.n}
                  className={`rounded-2xl p-6 border transition-all duration-300 ${
                    p.n === '03'
                      ? 'bg-accent/15 border-accent/40'
                      : 'bg-white/5 border-white/8 hover:bg-white/[0.07]'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`text-[12px] font-bold tracking-[0.1em] ${p.n === '03' ? 'text-accent-mid' : 'text-white/30'}`}>
                      {p.n}
                    </span>
                    {p.n === '03' && (
                      <span className="text-[10px] uppercase tracking-[0.16em] font-bold text-accent-mid border border-accent/40 rounded-full px-2.5 py-1">
                        Tu parte
                      </span>
                    )}
                  </div>
                  <h3 className="text-[17px] font-semibold text-white mb-2">{p.t}</h3>
                  <p className="text-[14px] text-white/50 font-light leading-relaxed">{p.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Reparto de trabajo ── */}
        <section className="py-section">
          <div className="max-w-5xl mx-auto px-6 md:px-12">
            <div className="text-center mb-12">
              <span className="eyebrow block mb-4">El trato</span>
              <h2 className="text-headline font-semibold text-ink text-balance">
                Quién hace qué.
              </h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="card p-7 md:p-8">
                <h3 className="text-[15px] font-semibold text-ink mb-5">Lo ponemos nosotros</h3>
                <ul className="space-y-3">
                  {ponemos.map((x) => (
                    <li key={x} className="flex items-start gap-3 text-[14px] text-dim font-light">
                      <span className="mt-[3px] w-4 h-4 shrink-0 rounded-full bg-accent-light text-accent flex items-center justify-center">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <path d="m5 12 5 5L20 7" />
                        </svg>
                      </span>
                      {x}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="card p-7 md:p-8">
                <h3 className="text-[15px] font-semibold text-ink mb-5">Lo pones tú</h3>
                <ul className="space-y-3">
                  {pones.map((x) => (
                    <li key={x} className="flex items-start gap-3 text-[14px] text-dim font-light">
                      <span className="mt-[3px] w-4 h-4 shrink-0 rounded-full bg-surface text-ink flex items-center justify-center">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <path d="m5 12 5 5L20 7" />
                        </svg>
                      </span>
                      {x}
                    </li>
                  ))}
                </ul>
                <p className="mt-6 pt-5 border-t border-border text-[13px] text-muted leading-relaxed">
                  Y ya está. No diseñas, no programas, no das soporte y no persigues cobros.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Reglas ── */}
        <section className="py-section bg-surface/60">
          <div className="max-w-5xl mx-auto px-6 md:px-12">
            <div className="text-center mb-12">
              <span className="eyebrow block mb-4">Las reglas, por delante</span>
              <h2 className="text-headline font-semibold text-ink text-balance">
                Todo lo que suele estar en la letra pequeña.
              </h2>
              <p className="mt-4 text-dim font-light max-w-lg mx-auto">
                Preferimos decirlo antes de que entres que discutirlo después de tu primera venta.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {reglas.map((r) => (
                <div key={r.t} className="bg-white rounded-2xl border border-border p-6">
                  <h3 className="text-[14.5px] font-semibold text-ink mb-2 leading-snug">{r.t}</h3>
                  <p className="text-[13px] text-dim font-light leading-relaxed">{r.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="py-section">
          <div className="max-w-3xl mx-auto px-6 md:px-12">
            <div className="text-center mb-10">
              <span className="eyebrow block mb-4">Dudas</span>
              <h2 className="text-headline font-semibold text-ink text-balance">Lo que todos preguntan.</h2>
            </div>
            <div className="space-y-3">
              {faqs.map((f) => (
                <details key={f.q} className="group bg-white rounded-2xl border border-border px-6 py-5">
                  <summary className="flex items-center justify-between gap-4 cursor-pointer list-none text-[15px] font-medium text-ink">
                    {f.q}
                    <span className="shrink-0 text-muted transition-transform duration-300 group-open:rotate-45">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                        <path d="M12 5v14M5 12h14" />
                      </svg>
                    </span>
                  </summary>
                  <p className="mt-3 text-[14px] text-dim font-light leading-relaxed">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ── Solicitud ── */}
        {/* La calculadora se repite aquí a propósito: es el momento en el que la
            persona decide, y lo que la mueve es ver el número. */}
        <section id="solicitud" className="py-section bg-surface/60">
          <div className="max-w-5xl mx-auto px-6 md:px-12">
            <div className="text-center mb-10">
              <span className="eyebrow block mb-4">Solicitud</span>
              <h2 className="text-headline font-semibold text-ink text-balance">
                Cuéntanos quién eres.
              </h2>
              <p className="mt-4 text-dim font-light">
                No buscamos currículums. Buscamos gente que coja el teléfono.
              </p>
            </div>
            <div className="grid lg:grid-cols-[1fr_1.15fr] gap-8 items-start">
              <div className="lg:sticky lg:top-24">
                <p className="text-[11px] uppercase tracking-[0.2em] text-muted font-semibold mb-3">
                  Esto es lo que ganarías
                </p>
                <ComisionCalculadora compact />
                <p className="text-[12px] text-muted mt-4 leading-relaxed">
                  Sin techo y sin objetivos. Si un mes cierras diez, cobras diez.
                </p>
              </div>
              <AfiliadoForm />
            </div>
          </div>
        </section>

        {/* ── Acceso comerciales ── */}
        <section className="pb-section">
          <div className="max-w-3xl mx-auto px-6 md:px-12">
            <div className="lg rounded-2xl p-7 md:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
              <div>
                <h3 className="text-[15.5px] font-semibold text-ink">¿Ya trabajas con nosotros?</h3>
                <p className="text-[13.5px] text-dim font-light mt-1.5">
                  Entra al panel para ver tus leads asignados, sus demos y el estado de cada uno.
                </p>
              </div>
              <a href={PANEL} className="btn-primary shrink-0 rounded-full">
                Entrar al panel
                <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden>
                  <path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
