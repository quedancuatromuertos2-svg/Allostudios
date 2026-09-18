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
import { VisualInforme } from '@/components/home2/Visuales'
import { FichaGoogle, Notificacion, Agenda, Anuncio, CostePorContacto, Escena } from '@/components/home2/Piezas'

export const metadata: Metadata = {
  title: 'Home nueva (vista previa)',
  robots: { index: false, follow: false },
}

/*  Propuesta de home (18/09/2026): tres packs vendidos como productos, cada capítulo construido
    como una oferta (resultado → qué lleva con su valor → esfuerzo del cliente → precio sin riesgo →
    dudas). Cuando se apruebe, sustituye a app/page.tsx.                                           */

export default function PreviewHome() {
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
          id="estandar" numero="01" nombre="Estándar" clave="PACK_ESTANDAR"
          dolor="Trabajo bien y no me encuentran."
          quien="Para el negocio que hoy no aparece cuando lo buscan, o aparece con tres fotos y sin horario."
          efecto="busqueda"
          resultado="Cuando alguien busca lo que haces en tu barrio, sales tú. Con web, con horario y con reseñas. En 7 días."
          mosaico={[
            {
              titulo: 'Sales el primero cuando buscan «barbería Ruzafa».',
              sub: 'Tu ficha de Google completa y trabajada cada mes: horario, fotos, servicios y las palabras que la gente escribe.',
              nodo: <FichaGoogle />, ancho: 2,
            },
            {
              titulo: 'Las reseñas llegan solas.',
              sub: 'Cada cliente contento recibe la invitación. Tú no persigues a nadie.',
              nodo: <Notificacion app="Google" titulo="Nueva reseña ★★★★★" texto="«Me atendieron sin prisa y el corte quedó perfecto. Repetiré.» — Laura M." hora="hace 2 min" />,
            },
            {
              titulo: 'Cambiar el horario es un WhatsApp.',
              sub: 'Fotos nuevas, un precio, un servicio: en menos de 3 días está. Sin llamar a nadie.',
              nodo: <Notificacion app="WhatsApp" titulo="Ángel · AlloStudios" texto="Hecho: horario de agosto cambiado en la web y en Google. Te dejo el enlace para que lo veas 👌" hora="14:02" />,
            },
            {
              titulo: 'En 7 días, publicada. Con tu marca, tus fotos y tus precios.',
              sub: 'Perfecta en el móvil, que es desde donde te miran siete de cada diez. Con tu dominio, a tu nombre.',
              nodo: <Escena cuando="7 días" que="Desde que nos pasas el material hasta que tu web está online. Lo normal es que tarde menos." />, ancho: 2,
            },
          ]}
          esfuerzo={[
            ['Hoy · 2 minutos', 'Eliges Estándar y pagas la primera cuota. Lees el contrato antes.'],
            ['Mañana · 10 minutos', 'Nos mandas por WhatsApp el logo, 3-6 fotos, tus servicios con precio y el horario.'],
            ['Día 6 · 5 minutos', 'Ves la web terminada y nos dices si cambias algo. El día 7 está publicada.'],
          ]}
          bonus={['Dominio el primer año', 'Hosting, seguridad y copias', 'Cambios ilimitados en 3 días', 'Botón de WhatsApp, mapa y horario', 'Informe de 5 líneas el día 28', 'Un WhatsApp directo con Ángel']}
          dudas={[
            ['¿Y si ya tengo web?', 'La miramos gratis. Si vale, la dejamos y trabajamos Google y las reseñas. Si no se ve bien en el móvil o no sale en Google, te hacemos la nueva con lo que ya tienes y sin que pierdas el dominio.'],
            ['¿Por qué 12 meses?', 'Porque no te cobramos la web por adelantado: la hacemos nosotros el primer mes y la recuperamos con la cuota. A los 12 meses sigues mes a mes y te vas cuando quieras.'],
          ]}
          url="/contratar/pack_estandar"
        />

        {/* ── PRO: que te contesten ── */}
        <CapituloPack
          id="pro" numero="02" nombre="Pro" clave="PACK_PRO" destacado oscuro nivel={2}
          dolor="Contesto tarde y se van a otro."
          quien="Para el que está cortando el pelo, con un paciente o en cocina cuando le escriben."
          efecto="chat"
          resultado="Cada mensaje contestado en 8 segundos, a cualquier hora, con tu tono. Y la cita, en tu agenda antes de que la veas."
          mosaico={[
            {
              titulo: 'Te enteras por la mañana. La cita ya está en tu agenda.',
              sub: 'El asistente la deja en tu Google Calendar y te manda el aviso. Tú sigues durmiendo.',
              nodo: <Agenda />, ancho: 2,
            },
            {
              titulo: 'Cuando hace falta una persona, te avisa a ti.',
              sub: 'Un presupuesto raro, una queja, alguien que quiere hablar contigo: te lo pasa con el resumen.',
              nodo: <Notificacion app="WhatsApp" titulo="Asistente · aviso" texto="Carla pregunta por un tinte con mechas para una boda el sábado. Le he dicho que la llamas tú. Su número: 6XX…" hora="22:31" />,
            },
            {
              titulo: 'Habla como tú, no como un robot.',
              sub: 'Con tus precios, tus horarios y tu forma de decir las cosas. Lo pruebas en tu móvil antes de activarlo.',
              nodo: <Escena oscuro cuando="8 s" que="Lo que tarda en contestar a las 22:14 un domingo. El primero que responde se lleva la cita." />,
            },
            {
              titulo: 'Y la web Premium: tus reseñas dentro y acabado de agencia cara.',
              sub: 'Animaciones suaves, textos que venden y tus 5★ de Google a la vista. Parece más grande de lo que eres.',
              nodo: <Notificacion app="WhatsApp" titulo="Nueva cita desde la web" texto="Marcos · corte + barba · jueves 17:30. Confirmada. Le mando recordatorio el jueves a las 9." hora="22:15" />, ancho: 2,
            },
          ]}
          esfuerzo={[
            ['Hoy · 2 minutos', 'Eliges Pro y pagas la primera cuota. Lees el contrato antes.'],
            ['Día 2 · 15 minutos', 'Nos cuentas por WhatsApp horarios, precios, lo que más te preguntan y cómo hablas tú.'],
            ['Día 5 · 5 minutos', 'Pruebas el asistente en tu móvil como si fueras un cliente. Lo ajustamos. El día 7, todo en marcha.'],
          ]}
          bonus={['Todo lo del Estándar', 'Citas en tu Google Calendar', 'Recordatorio automático al cliente', 'Resumen de cada conversación', 'Prioridad de entrega', 'Ajustes del asistente ilimitados']}
          dudas={[
            ['¿Y si contesta algo mal?', 'Solo sabe lo que tú validas: precios, horarios, servicios. Cuando algo se sale de ahí, no inventa: te lo pasa a ti. Y lo pruebas antes de activarlo.'],
            ['¿Tengo que cambiar de número?', 'No. Va en el WhatsApp de tu negocio de siempre. Tú sigues viendo todas las conversaciones y puedes entrar cuando quieras.'],
          ]}
          url="/contratar/pack_pro"
        />

        {/* ── MAX: que te lleguen clientes ── */}
        <CapituloPack
          id="max" numero="03" nombre="Max" clave="PACK_MAX" oscuro nivel={3}
          dolor="Quiero llenar la agenda, no solo estar."
          quien="Para el que tiene semanas flojas y ya ha quemado dinero en anuncios que no trajeron a nadie."
          visual={<VisualInforme />}
          resultado="Clientes de tu zona cada semana, sabiendo lo que cuesta cada uno. Y el día 28, cinco líneas: qué entró y qué costó."
          mosaico={[
            {
              titulo: 'El anuncio lo ve tu vecino, no toda Valencia.',
              sub: 'Solo la gente de tu zona que busca lo que haces. Creatividades nuestras, públicos afinados cada semana.',
              nodo: <Anuncio />,
            },
            {
              titulo: 'Sabes lo que cuesta cada persona que te escribe.',
              sub: 'No "impresiones" ni "alcance": contactos y lo que ha costado cada uno. Si sube, lo arreglamos; si baja, subimos.',
              nodo: <CostePorContacto oscuro />, ancho: 2,
            },
            {
              titulo: 'La inversión la decides tú y va en tu cuenta.',
              sub: 'Desde 5 € al día. La subes, la bajas o la paras cuando quieras. Nosotros ponemos la gestión.',
              nodo: <Escena oscuro cuando="Tú decides" que="Tu tarjeta, tu cuenta publicitaria, tu límite. Nunca tocamos tu dinero." />, ancho: 2,
            },
            {
              titulo: 'Y el día 28, cinco líneas.',
              sub: 'Qué entró, qué costó, qué cambiamos. Por WhatsApp.',
              nodo: <Notificacion app="WhatsApp" titulo="Informe de octubre" texto="41 contactos por anuncios (4,7 € cada uno), 19 citas por el asistente, 11 reseñas nuevas. Este mes probamos un anuncio de tarde." hora="28 oct" />,
            },
          ]}
          esfuerzo={[
            ['Hoy · 2 minutos', 'Eliges Max y pagas la primera cuota. Lees el contrato antes.'],
            ['Día 3 · 15 minutos', 'Nos das acceso a tu cuenta publicitaria (te guiamos) y decides cuánto invertir al día.'],
            ['Día 10 · 0 minutos', 'Los anuncios ya están en tu zona. A los 7 días, primera lectura. Tú solo atiendes a los que llegan.'],
          ]}
          bonus={['Todo lo del Pro', 'Creatividades y textos de los anuncios', 'Públicos afinados cada semana', 'Píxel y medición instalados', 'Informe: contactos y coste por contacto', 'Una prueba nueva cada mes']}
          dudas={[
            ['¿Cuánto tengo que invertir?', 'Tú lo decides y va en tu cuenta. Con 5-10 € al día ya hay datos para saber qué funciona. Nosotros no tocamos tu dinero: cobramos la gestión, no la inversión.'],
            ['¿Y si los anuncios no traen a nadie?', 'Lo verás en el informe con números, no en promesas. Si a las 3 semanas el coste por contacto no baja, cambiamos el anuncio, el público o la oferta. Es lo que hacemos cada semana.'],
          ]}
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
