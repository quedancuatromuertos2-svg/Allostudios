import type { Metadata } from 'next'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import FloatingWhatsApp from '@/components/FloatingWhatsApp'
import ChatAllo from '@/components/ChatAllo'
import LuzFondo from '@/components/LuzFondo'
import LuzPapel from '@/components/LuzPapel'
import CTASection from '@/components/CTASection'
import ContactFormSection from '@/components/ContactFormSection'
import ElegirPack from '@/components/home2/ElegirPack'
import CapituloPack from '@/components/home2/CapituloPack'
import { Notificacion, Escena } from '@/components/home2/Piezas'
import { VisualLanding, VisualCualificador, VisualCosteLead } from '@/components/home2/VisualesDigital'
import SubsectoresDigital from '@/components/home2/SubsectoresDigital'
import { PACKS_DIGITAL, eur } from '@/lib/precios'

/*  /startups — la «home» del segmento digital. Mismo motor que la home local (tienda + tres
    capítulos como ofertas) con otros packs (Launch / Growth / Scale), otro discurso y otro precio:
    su negocio ES la web. Referencia visual: los shots de «saas landing page dark» de Dribbble.   */

export const metadata: Metadata = {
  title: 'Landing, leads y demos para startups y negocios digitales — por suscripción',
  description: 'Tu negocio es la web: landing que convierte en 7 días, un asistente que cualifica leads y agenda demos, y campañas con coste por lead. Packs desde 399 €/mes, 0 € de entrada. Valencia · online.',
  alternates: { canonical: '/startups' },
  openGraph: { title: 'AlloStudios para startups y negocios digitales', description: 'Landing, asistente que cualifica y agenda demos, y campañas. Desde 399 €/mes, 0 € de entrada.', url: 'https://allostudios.net/startups', images: [{ url: 'https://allostudios.net/marca/og.jpg', width: 1200, height: 630, alt: 'allo.' }] },
}

export default function Startups() {
  const [launch, growth, scale] = PACKS_DIGITAL
  const schema = {
    '@context': 'https://schema.org', '@type': 'Service', name: 'Landing, leads y demos para startups', serviceType: 'Diseño web y captación', areaServed: 'ES',
    provider: { '@type': 'Organization', name: 'AlloStudios', url: 'https://allostudios.net' },
    offers: PACKS_DIGITAL.map((p) => ({ '@type': 'Offer', name: p.nombre, price: String(p.eur), priceCurrency: 'EUR', description: p.desc })),
  }
  return (
    <div className="tema-oscuro">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <LuzFondo />
      <LuzPapel />
      <Navigation />
      <main className="relative z-10">
        {/* Hero: ADN Vector (negro azulado, un acento eléctrico, grotesca, cifras) */}
        <section className="relative pt-32 md:pt-44 pb-16 md:pb-24 px-6 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none" aria-hidden style={{ background: 'radial-gradient(45% 40% at 50% 0%, rgba(124,92,255,.35) 0%, transparent 70%), radial-gradient(30% 30% at 75% 35%, rgba(56,225,176,.14) 0%, transparent 70%)' }} />
          <div className="relative max-w-4xl mx-auto text-center">
            <span className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.2em] font-medium bg-white/[.06] ring-1 ring-white/10 text-white/70">Startups y negocios digitales · Valencia · online</span>
            <h1 className="mt-6 font-display text-[clamp(2.6rem,6.4vw,5.4rem)] leading-[.98] font-semibold tracking-[-0.045em] text-white text-balance">
              Tu negocio es la web. <span style={{ color: '#B4A2FF' }}>Aquí se trata como tal.</span>
            </h1>
            <p className="mt-6 text-[17px] md:text-[19px] text-white/65 font-light leading-relaxed max-w-2xl mx-auto">
              Una landing que explica tu producto en cinco segundos, un asistente que cualifica cada lead y agenda la demo, y campañas con el coste por lead en el informe. Por suscripción, 0 € de entrada, iterando cada semana.
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <a href="#elegir" className="rounded-full px-6 py-3 text-[14.5px] font-semibold text-[#07080F] inline-flex items-center gap-2 transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5" style={{ background: '#38E1B0' }}>
                Ver los tres packs
                <span className="w-7 h-7 rounded-full bg-black/10 flex items-center justify-center"><svg width="12" height="12" viewBox="0 0 14 14" fill="none"><path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
              </a>
              <a href="https://concepto-vector.vercel.app" target="_blank" rel="noopener noreferrer" className="lg rounded-full px-5 py-3 text-[14.5px] font-semibold text-ink">Ver una landing de concepto ↗</a>
            </div>
            <div className="mt-12 grid grid-cols-3 gap-4 max-w-lg mx-auto text-[12.5px] text-white/50">
              <div><strong className="block text-white text-[22px] font-display tracking-[-0.03em]">7 días</strong>y publicada</div>
              <div><strong className="block text-white text-[22px] font-display tracking-[-0.03em]">8 s</strong>respuesta a cada lead</div>
              <div><strong className="block text-white text-[22px] font-display tracking-[-0.03em]">0 €</strong>de entrada</div>
            </div>
          </div>
        </section>

        {/* Tienda en modo digital, sin selector (aquí no hay que elegir segmento) */}
        <ElegirPack segmento="digital" fijo />

        {/* Un diseño por tipo de negocio */}
        <SubsectoresDigital />

        {/* ── LAUNCH ── */}
        <CapituloPack
          id="launch" numero="01" nombre="Launch" clave="PACK_LAUNCH" demo="vector" efecto="busqueda"
          dolor="La landing la hizo el CTO un domingo."
          quien="Para el producto que ya funciona pero cuya web explica la tecnología, no el problema que resuelve."
          resultado="Una landing que se entiende en cinco segundos, mide todo y se mejora cada semana. Publicada en 7 días."
          mosaico={[
            { titulo: 'El mensaje, en una frase. Para el que paga, no para el que programa.', sub: 'Reescribimos qué haces, para quién y por qué ahora. Y lo probamos con la gente que te compra.', nodo: <VisualLanding />, ancho: 2 },
            { titulo: 'Todo medido desde el día uno.', sub: 'GA4, píxeles de Meta y LinkedIn, eventos en cada botón. Sabes qué convierte antes de gastar un euro.', nodo: <Notificacion app="Analítica" titulo="Semana 1" texto="1.240 visitas · 3,1 % pidió demo · el botón del hero convierte 2× más que el del footer." hora="lun 9:00" /> },
            { titulo: 'Prueba social sin inventar nada.', sub: 'Logos, cifras y testimonios reales, puestos donde el visitante duda. Si aún no tienes, montamos el sistema para conseguirlos.', nodo: <Escena oscuro cuando="Semana 2" que="Primera iteración: cambiamos el orden de los planes y el CTA. La prueba dura una semana; lo que gana se queda." /> },
            { titulo: 'Una iteración cada semana. No «la web ya está».', sub: 'Una landing no se termina: se prueba. Cambios ilimitados en 3 días y una prueba de conversión a la semana.', nodo: <Notificacion app="WhatsApp" titulo="Ángel · AlloStudios" texto="Hecho: nueva sección de precios con el plan Growth destacado. Te dejo el enlace 👌" hora="14:02" />, ancho: 2 },
          ]}
          esfuerzo={[
            ['Hoy · 2 minutos', 'Eliges Launch y pagas la primera cuota. Lees el contrato antes.'],
            ['Día 1 · 30 minutos', 'Videollamada: qué haces, para quién, qué planes tienes y qué te preguntan. Nos pasas logo y capturas del producto.'],
            ['Día 6 · 10 minutos', 'Ves la landing terminada y comentas. El día 7 está publicada con analítica y píxeles.'],
          ]}
          bonus={['Dominio y hosting', 'Cambios ilimitados en 3 días', 'GA4, píxeles y eventos', 'Una prueba de conversión a la semana', 'Informe el día 28', 'Un WhatsApp directo con Ángel']}
          dudas={[
            ['¿Y si ya tengo landing?', 'La auditamos gratis: mensaje, velocidad, medición, conversión. Si merece la pena, la rehacemos con lo que ya tienes; si no, empezamos de cero sin perder el dominio.'],
            ['¿Por qué 12 meses?', 'Porque no te cobramos la landing por adelantado: la hacemos el primer mes y la recuperamos con la cuota. A los 12 meses sigues mes a mes.'],
          ]}
          url="/contratar/pack_launch"
        />

        {/* ── GROWTH ── */}
        <CapituloPack
          id="growth" numero="02" nombre="Growth" clave="PACK_GROWTH" destacado oscuro nivel={2} demo="vector" efecto="chat"
          dolor="Los leads llegan y nadie contesta hasta el lunes."
          quien="Para el equipo pequeño que vende cada día y pierde demos por contestar tarde o por atender a quien no va a comprar."
          resultado="Cada lead cualificado en segundos, en la web y en WhatsApp. La demo, en el calendario del comercial que toca."
          mosaico={[
            { titulo: 'Cualifica antes de que tú lo veas.', sub: 'Tamaño, caso de uso, presupuesto. Decide si es demo, prueba gratis o «todavía no». Con tu tono.', nodo: <VisualCualificador />, ancho: 2 },
            { titulo: 'La demo, agendada. Con recordatorio.', sub: 'Mira los huecos del comercial en Google Calendar, propone dos y confirma. Nadie escribe «¿te viene bien el jueves?».', nodo: <Notificacion app="Google Calendar" titulo="Demo · jueves 11:00" texto="Kiva · 12 comerciales · plan Growth · le interesa la integración con HubSpot." hora="hace 1 min" /> },
            { titulo: 'Cada lead, resumido en tu CRM.', sub: 'HubSpot, Pipedrive, Notion o un email: llega con quién es, qué quiere y qué le hemos dicho.', nodo: <Escena oscuro cuando="8 s" que="Lo que tarda en contestar a las 23:40 un martes. El primero que responde se lleva la demo." /> },
            { titulo: 'Y todo lo del Launch: landing, analítica, prueba social e iteración semanal.', sub: 'El asistente vive dentro de una landing que ya convierte. No es un chat pegado a una web vieja.', nodo: <Notificacion app="Asistente" titulo="Aviso para ti" texto="Un lead pide precio para 80 usuarios y facturación en dólares. Se sale de lo que sé: te lo paso con el resumen." hora="23:41" />, ancho: 2 },
          ]}
          esfuerzo={[
            ['Hoy · 2 minutos', 'Eliges Growth y pagas la primera cuota.'],
            ['Día 2 · 30 minutos', 'Nos cuentas planes, preguntas frecuentes, criterios de cualificación y quién hace las demos. Conectas Google Calendar en un clic.'],
            ['Día 6 · 10 minutos', 'Pruebas el asistente como si fueras un lead. Lo ajustamos. El día 7, todo en marcha.'],
          ]}
          bonus={['Todo lo del Launch', 'Asistente en web y WhatsApp', 'Demos en el calendario de cada comercial', 'Resumen de cada lead a tu CRM', 'Ajustes ilimitados del asistente', 'Prioridad de entrega']}
          dudas={[
            ['¿Y si contesta algo mal?', 'Solo sabe lo que validas: planes, precios, integraciones, criterios. Cuando algo se sale de ahí, no inventa: te lo pasa con el resumen. Lo pruebas antes de activarlo.'],
            ['¿Funciona con nuestro CRM y nuestro calendario?', 'Google Calendar en un clic; HubSpot, Pipedrive, Notion y Slack por integración; cualquier otro, por email o webhook.'],
          ]}
          url="/contratar/pack_growth"
        />

        {/* ── SCALE ── */}
        <CapituloPack
          id="scale" numero="03" nombre="Scale" clave="PACK_SCALE" oscuro nivel={3} demo="vector"
          dolor="Quemé 3.000 € en ads y no sé qué pasó."
          quien="Para el que ya convierte y quiere leads cada semana sin aprender Meta, Google y LinkedIn a golpes."
          visual={<div className="w-full max-w-[520px]"><VisualCosteLead /></div>}
          resultado="Leads cada semana, sabiendo lo que cuesta cada uno por canal. Y una landing de campaña por público, no una para todos."
          mosaico={[
            { titulo: 'Meta, Google y LinkedIn, gestionados cada semana.', sub: 'Públicos, creatividades y pujas se tocan cada semana con los datos, no con intuición.', nodo: <VisualCosteLead />, ancho: 2 },
            { titulo: 'Una landing por público.', sub: 'El que llega desde LinkedIn no lee lo mismo que el que llega desde una búsqueda. Cada campaña aterriza en su página.', nodo: <Escena oscuro cuando="Semana 12" que="Coste medio por lead 27 € (−31 % vs. semana 8). Nueva landing para LinkedIn; pausado el público frío en Meta." /> },
            { titulo: 'La inversión la decides tú y va en tus cuentas.', sub: 'Desde 20 € al día. La subes, la bajas o la paras cuando quieras. Nosotros ponemos la gestión.', nodo: <Escena oscuro cuando="Tú decides" que="Tus cuentas publicitarias, tu tarjeta, tu límite. Nunca tocamos tu dinero." /> },
            { titulo: 'Informe semanal: leads, coste por lead, qué cambiamos.', sub: 'Cinco líneas cada lunes. Si un canal no baja el coste en tres semanas, se cambia el anuncio, el público o la oferta.', nodo: <Notificacion app="WhatsApp" titulo="Informe semana 12" texto="47 leads · 27 € de media · LinkedIn 38, Google 24, Meta 19. Esta semana probamos vídeo corto en Meta." hora="lun 9:00" />, ancho: 2 },
          ]}
          esfuerzo={[
            ['Hoy · 2 minutos', 'Eliges Scale y pagas la primera cuota.'],
            ['Día 3 · 30 minutos', 'Nos das acceso a tus cuentas publicitarias (te guiamos) y decides la inversión diaria.'],
            ['Día 10 · 0 minutos', 'Campañas en marcha. Primera lectura a los 7 días. Tú solo atiendes las demos que entran.'],
          ]}
          bonus={['Todo lo del Growth', 'Creatividades y textos de campaña', 'Landings de campaña por público', 'Píxeles, conversiones y medición', 'Informe semanal con coste por lead', 'Una prueba nueva cada semana']}
          dudas={[
            ['¿Cuánto tengo que invertir?', 'Tú lo decides y va en tus cuentas. Con 20-40 € al día ya hay datos para saber qué funciona en dos semanas.'],
            ['¿Y si no llegan leads?', 'Lo verás en el informe con números. Si a las tres semanas el coste por lead no baja, cambiamos anuncio, público u oferta. Es lo que hacemos cada semana.'],
          ]}
          url="/contratar/pack_scale"
        />

        {/* Precios, una línea */}
        <section className="relative py-20 md:py-28 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-display text-[clamp(2rem,4.4vw,3.4rem)] font-semibold tracking-[-0.04em] text-white text-balance">Tres packs. Uno por etapa.</h2>
            <div className="mt-10 grid md:grid-cols-3 gap-4">
              {[launch, growth, scale].map((p, i) => (
                <a key={p.clave} href={`/contratar/${p.clave.toLowerCase()}`} className={`rounded-[1.6rem] p-6 text-left transition-transform duration-500 hover:-translate-y-0.5 ${i === 1 ? 'bg-white text-[#18181B]' : 'lg text-ink'}`}>
                  <div className={`text-[11px] uppercase tracking-[0.16em] font-semibold ${i === 1 ? 'text-[#5B5BD6]' : 'text-muted'}`}>{p.nombre}</div>
                  <div className="mt-2 font-display text-[2.2rem] leading-none font-semibold tracking-[-0.03em]">{eur(p.eur)}<span className={`text-[13px] font-normal tracking-normal ${i === 1 ? 'text-[#6E6A7C]' : 'text-muted'}`}>/mes</span></div>
                  <p className={`mt-3 text-[13px] leading-relaxed ${i === 1 ? 'text-[#4E4A5E]' : 'text-dim'}`}>{p.desc}</p>
                </a>
              ))}
            </div>
            <p className="mt-6 text-[13px] text-white/50">0 € de entrada · 12 meses y después mes a mes · año por adelantado: 10 cuotas · <a href="/contrato" className="underline underline-offset-4">contrato a la vista</a>.</p>
          </div>
        </section>

        <ContactFormSection />
        <CTASection />
      </main>
      <Footer />
      <FloatingWhatsApp />
      <ChatAllo />
    </div>
  )
}
