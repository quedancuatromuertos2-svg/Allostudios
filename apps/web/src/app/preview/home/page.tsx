import type { Metadata } from 'next'
import Navigation from '@/components/Navigation'
import HeroGlass from '@/components/HeroGlass'
import DemoGeneratorSection from '@/components/DemoGeneratorSection'
import FAQSection from '@/components/FAQSection'
import ContactFormSection from '@/components/ContactFormSection'
import ComercialesSection from '@/components/ComercialesSection'
import CTASection from '@/components/CTASection'
import Footer from '@/components/Footer'
import FloatingWhatsApp from '@/components/FloatingWhatsApp'
import LuzFondo from '@/components/LuzFondo'
import LuzPapel from '@/components/LuzPapel'
import CintaPacks from '@/components/home2/CintaPacks'
import PruebaMercado from '@/components/home2/PruebaMercado'
import CapituloPack from '@/components/home2/CapituloPack'
import ComparaPacks from '@/components/home2/ComparaPacks'
import Complementos from '@/components/home2/Complementos'
import ElegirPack from '@/components/home2/ElegirPack'
import { VisualWeb, VisualChat, VisualInforme } from '@/components/home2/Visuales'
import { FichaGoogle, Notificacion, Agenda, Anuncio, CostePorContacto, Escena } from '@/components/home2/Piezas'
import { porClave } from '@/lib/precios'

export const metadata: Metadata = {
  title: 'Home nueva (vista previa)',
  robots: { index: false, follow: false },
}

/*  Propuesta de home (18/09/2026): tres packs vendidos como productos, una idea por
    pantalla, con la estética de la marca. Cuando se apruebe, sustituye a app/page.tsx.  */

export default function PreviewHome() {
  const estandar = porClave('PACK_ESTANDAR')!
  const pro = porClave('PACK_PRO')!
  const max = porClave('PACK_MAX')!

  return (
    <div className="tema-oscuro">
      <LuzFondo />
      <LuzPapel />
      <Navigation />
      <CintaPacks />
      <main className="relative z-10">
        <HeroGlass />
        <PruebaMercado />
        <ElegirPack />

        {/* ── ESTÁNDAR: que te encuentren ── */}
        <CapituloPack
          id="estandar" numero="01" nombre="Estándar"
          dolor="Trabajo bien y no me encuentran."
          quien="Para el negocio que hoy no aparece cuando lo buscan, o aparece con tres fotos y sin horario."
          luz="faro"
          visual={<VisualWeb />}
          mosaico={[
            {
              titulo: 'Cuando alguien busca «barbería Ruzafa», sales tú. Con horario, fotos y el botón de reservar.',
              sub: 'Tu ficha de Google completa y trabajada cada mes. Es lo primero que ve el que te busca, antes que tu web.',
              nodo: <FichaGoogle />, ancho: 2,
            },
            {
              titulo: 'Las reseñas llegan solas.',
              sub: 'Cada cliente contento recibe la invitación. Tú no persigues a nadie.',
              nodo: <Notificacion app="Google" titulo="Nueva reseña ★★★★★" texto="«Me atendieron sin prisa y el corte quedó perfecto. Repetiré.» — Laura M." hora="hace 2 min" />,
            },
            {
              titulo: 'Cambiar el horario es un WhatsApp.',
              sub: 'Fotos nuevas, un precio, un servicio: nos lo dices y en menos de 3 días está. Sin llamar a nadie, sin esperar semanas.',
              nodo: <Notificacion app="WhatsApp" titulo="Ángel · AlloStudios" texto="Hecho: horario de agosto cambiado en la web y en Google. Te dejo el enlace para que lo veas 👌" hora="14:02" />,
            },
            {
              titulo: 'En 7 días, publicada.',
              sub: 'Con tu marca, tus fotos y tus precios. Perfecta en el móvil, que es desde donde te miran siete de cada diez.',
              nodo: <Escena cuando="7 días" que="Desde que nos pasas el material hasta que tu web está online con tu dominio. Lo normal es que tarde menos." />, ancho: 2,
            },
          ]}
          precio={estandar.eur}
          incluye={['Web Arranque, a medida', 'Hosting, dominio y seguridad', 'Cambios en 3 días por WhatsApp', 'SEO local cada mes', 'Reseñas 5★ automatizadas', 'Informe el día 28']}
          timeline={[['Hoy', 'Eliges el pack y pagas la primera cuota. Lees el contrato antes.'], ['Mañana', 'Te escribimos por WhatsApp: logo, fotos, servicios, horario. Nada más.'], ['Día 7', 'Web publicada y ficha de Google al día. Empiezan las reseñas.']]}
          url="/contratar/pack_estandar"
        />

        {/* ── PRO: que te contesten ── */}
        <CapituloPack
          id="pro" numero="02" nombre="Pro" destacado oscuro
          dolor="Contesto tarde y se van a otro."
          quien="Para el que está cortando el pelo, con un paciente o en cocina cuando le escriben."
          luz="haz"
          visual={<VisualChat />}
          mosaico={[
            {
              titulo: 'Te enteras por la mañana. La cita ya está en tu agenda.',
              sub: 'El asistente la deja en tu Google Calendar y te manda el aviso. Tú sigues durmiendo.',
              nodo: <Agenda />, ancho: 2,
            },
            {
              titulo: 'Y cuando hace falta una persona, te avisa a ti.',
              sub: 'Un presupuesto raro, una queja, alguien que quiere hablar contigo: te lo pasa con el resumen.',
              nodo: <Notificacion app="WhatsApp" titulo="Asistente · aviso" texto="Carla pregunta por un tinte con mechas para una boda el sábado. Le he dicho que la llamas tú. Su número: 6XX…" hora="22:31" />,
            },
            {
              titulo: 'Habla como tú, no como un robot.',
              sub: 'Lo configuramos con tus precios, tus horarios y tu forma de decir las cosas. Lo pruebas antes de activarlo.',
              nodo: <Escena oscuro cuando="8 s" que="Lo que tarda en contestar a las 22:14, un domingo, con tu tono. El primero que responde se lleva la cita." />,
            },
            {
              titulo: 'Y la web, la Premium: con tus reseñas dentro y detalles de agencia cara.',
              sub: 'Animaciones suaves, textos que venden y tus 5★ de Google a la vista. La que hace que parezcas más grande de lo que eres.',
              nodo: <Notificacion app="WhatsApp" titulo="Nueva cita desde la web" texto="Marcos · corte + barba · jueves 17:30. Confirmada. Le mando recordatorio el jueves a las 9." hora="22:15" />, ancho: 2,
            },
          ]}
          precio={pro.eur}
          incluye={['Todo lo del Estándar', 'Web Premium con tus reseñas', 'Asistente en tu WhatsApp 24/7', 'Citas en tu Google Calendar', 'Avisos cuando hace falta una persona', 'Prioridad de entrega']}
          timeline={[['Hoy', 'Eliges Pro y pagas la primera cuota. Lees el contrato antes.'], ['Día 2-3', 'Nos pasas horarios, precios y cómo hablas. Pruebas el asistente en tu móvil.'], ['Día 7', 'Web publicada, Google al día y el asistente contestando tu WhatsApp.']]}
          url="/contratar/pack_pro"
        />

        {/* ── MAX: que te lleguen clientes ── */}
        <CapituloPack
          id="max" numero="03" nombre="Max"
          dolor="Quiero llenar la agenda, no solo estar."
          quien="Para el que tiene semanas flojas y ya ha quemado dinero en anuncios que no trajeron a nadie."
          luz="prisma"
          visual={<VisualInforme />}
          mosaico={[
            {
              titulo: 'El anuncio lo ve tu vecino, no toda Valencia.',
              sub: 'Solo la gente de tu zona que busca lo que haces. Creatividades hechas por nosotros, públicos afinados cada semana.',
              nodo: <Anuncio />,
            },
            {
              titulo: 'Sabes lo que cuesta cada persona que te escribe.',
              sub: 'No "impresiones" ni "alcance": contactos y lo que ha costado cada uno. Si sube, lo arreglamos; si baja, subimos.',
              nodo: <CostePorContacto />, ancho: 2,
            },
            {
              titulo: 'La inversión la decides tú y va en tu cuenta.',
              sub: 'Desde 5 € al día. La subes, la bajas o la paras cuando quieras. Nosotros ponemos la gestión.',
              nodo: <Escena cuando="Tú decides" que="Tu tarjeta, tu cuenta publicitaria, tu límite. Nunca tocamos tu dinero." />, ancho: 2,
            },
            {
              titulo: 'Y el día 28, cinco líneas.',
              sub: 'Qué entró, qué costó, qué cambiamos. Por WhatsApp.',
              nodo: <Notificacion app="WhatsApp" titulo="Informe de octubre" texto="41 contactos por anuncios (4,7 € cada uno), 19 citas por el asistente, 11 reseñas nuevas. Este mes probamos un anuncio de tarde." hora="28 oct" />,
            },
          ]}
          precio={max.eur}
          incluye={['Todo lo del Pro', 'Campañas en Meta y Google', 'Creatividades y públicos', 'Optimización semanal', 'Informe: qué entró y qué costó']}
          timeline={[['Hoy', 'Eliges Max y pagas la primera cuota. Lees el contrato antes.'], ['Día 7', 'Web, Google y asistente en marcha. Montamos tu cuenta publicitaria.'], ['Día 10', 'Primeros anuncios en tu zona. A los 7 días, primera lectura.']]}
          url="/contratar/pack_max"
        />

        <ComparaPacks />
        <Complementos />
        <DemoGeneratorSection />
        <FAQSection />
        <ContactFormSection />
        <ComercialesSection />
        <CTASection />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  )
}
