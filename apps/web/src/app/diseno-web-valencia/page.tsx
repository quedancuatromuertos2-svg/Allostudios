import type { Metadata } from 'next'
import GuiaSeo, { Seccion, Pasos } from '@/components/GuiaSeo'

export const metadata: Metadata = {
  title: 'Diseño web en Valencia: webs por suscripción desde 99 €/mes',
  description:
    'Agencia de diseño web en Valencia. Tu web a medida online en 7 días, sin pago de entrada: 99 €/mes con dominio, hosting, cambios y soporte incluidos. Mira gratis cómo quedaría la tuya.',
  alternates: { canonical: '/diseno-web-valencia' },
  openGraph: {
    title: 'Diseño web en Valencia: webs por suscripción desde 99 €/mes',
    description:
      'Tu web online en 7 días, 0 € de entrada, todo incluido. Mira gratis cómo quedaría antes de decidir.',
    url: 'https://allostudios.net/diseno-web-valencia',
    type: 'website',
  },
}

const negocio = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'AlloStudios',
  description:
    'Agencia de diseño web y marketing digital en Valencia. Webs por suscripción, SEO local, reseñas automatizadas, asistente de IA en WhatsApp y campañas de Meta y Google Ads.',
  url: 'https://allostudios.net',
  telephone: '+34695868793',
  priceRange: '€€',
  areaServed: [
    { '@type': 'City', name: 'Valencia' },
    { '@type': 'City', name: 'Torrent' },
    { '@type': 'City', name: 'Paterna' },
    { '@type': 'City', name: 'Mislata' },
    { '@type': 'City', name: 'Burjassot' },
    { '@type': 'City', name: 'Alboraya' },
  ],
  address: { '@type': 'PostalAddress', addressLocality: 'Valencia', addressRegion: 'Comunidad Valenciana', addressCountry: 'ES' },
  makesOffer: [
    { '@type': 'Offer', name: 'Web Arranque', price: '99', priceCurrency: 'EUR' },
    { '@type': 'Offer', name: 'Web Pro', price: '149', priceCurrency: 'EUR' },
    { '@type': 'Offer', name: 'Web Cinematográfica', price: '249', priceCurrency: 'EUR' },
    { '@type': 'Offer', name: 'Pack Estándar', price: '199', priceCurrency: 'EUR' },
  ],
}

const faqs = [
  {
    p: '¿Cuánto cuesta una página web en Valencia?',
    r: 'Lo habitual en una agencia de Valencia es entre 800 y 2.500 € de pago único, y el mantenimiento aparte. Nosotros lo hacemos por suscripción: desde 99 € al mes con 0 € de entrada, con dominio, hosting, cambios y soporte incluidos, 12 meses de permanencia y después mes a mes. Sale parecido al año pero sin desembolso inicial y sin facturas sorpresa.',
  },
  {
    p: '¿Cuánto tardáis en tenerla lista?',
    r: '7 días desde que nos pasas el logo, las fotos, los servicios y el horario. Ese plazo cuenta desde que tenemos el material, no desde que firmas: si tardas dos semanas en mandarnos las fotos, la web tarda dos semanas más.',
  },
  {
    p: '¿Puedo ver cómo quedaría antes de pagar?',
    r: 'Sí, y es lo que recomendamos. En allostudios.net/tu-web escribes el nombre de tu negocio y en 30 segundos te generamos una web con tus fotos, tus reseñas y tu horario reales de Google. Gratis, sin registro y sin que te llame nadie si no quieres.',
  },
  {
    p: '¿La web es mía o vuestra?',
    r: 'El contenido, el dominio y las fotos son tuyos siempre. Mientras la suscripción está activa nosotros nos encargamos del alojamiento, los cambios y el soporte. Si algún día te vas, te llevas el dominio y el contenido.',
  },
  {
    p: '¿Trabajáis solo en Valencia?',
    r: 'Todo el trabajo se hace en remoto, así que trabajamos con negocios de toda España. En Valencia y su área metropolitana podemos vernos en persona, que para un negocio local suele ser más cómodo.',
  },
  {
    p: '¿Qué pasa si quiero cambiar algo dentro de seis meses?',
    r: 'Los cambios van incluidos en la cuota. Nos escribes por WhatsApp lo que quieres cambiar y lo hacemos. No hay presupuesto aparte por tocar un texto, cambiar una foto o añadir un servicio.',
  },
]

export default function Page() {
  return (
    <GuiaSeo
      etiqueta="Valencia"
      h1="Diseño web en Valencia, por suscripción y sin pagar entrada"
      entradilla="Tu web a medida, online en 7 días, desde 99 € al mes con dominio, hosting, cambios y soporte incluidos. Y antes de decidir nada puedes ver gratis cómo quedaría la tuya."
      actualizado="septiembre de 2026"
      faqs={faqs}
      schemaExtra={negocio}
      cierre={{
        titulo: 'Míralo antes de hablar con nadie',
        texto:
          'Escribe el nombre de tu negocio y en 30 segundos te generamos tu web con tus fotos, tus reseñas y tu horario reales de Google. Gratis, sin registro y sin compromiso. Si te gusta, hablamos.',
        enlace: '/tu-web',
        boton: 'Ver mi web gratis',
      }}
    >
      <Seccion titulo="Por qué cobramos al mes y no 2.000 € de golpe">
        <p>
          El modelo clásico en Valencia es pagar entre 800 y 2.500 € por una web, recibirla y no
          volver a verla. A los dos años está desfasada, nadie la ha tocado y hay que pagar otra
          vez. Mientras tanto, el mantenimiento, el dominio y el hosting van llegando por separado.
        </p>
        <p>
          Nosotros lo hemos dado la vuelta: <strong>0 € de entrada</strong> y una cuota mensual que
          incluye todo. Al año sale parecido, pero sin desembolso inicial y sin facturas sorpresa. Y
          hay una diferencia de fondo: si cobramos todos los meses, nos interesa que la web te
          funcione todos los meses.
        </p>
        <div className="mt-7 overflow-x-auto">
          <table className="w-full text-[15px] border-collapse min-w-[30rem]">
            <thead>
              <tr className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-white/40">
                <th className="text-left font-medium pb-3 pr-4">Web</th>
                <th className="text-left font-medium pb-3 pr-4">Para quién</th>
                <th className="text-right font-medium pb-3 tabular-nums">Al mes</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Arranque', 'Negocios que aún no tienen web', '99 €'],
                ['Pro', 'Animaciones, copy y tus reseñas integradas', '149 €'],
                ['Cinematográfica', 'Cuando la web tiene que impresionar', '249 €'],
              ].map(([a, b, c]) => (
                <tr key={a} className="border-t border-white/10">
                  <td className="py-3 pr-4 text-white font-medium">{a}</td>
                  <td className="py-3 pr-4 text-white/60">{b}</td>
                  <td className="py-3 text-right text-white tabular-nums whitespace-nowrap">{c}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-5 text-[15px] text-white/60">
          Todas incluyen dominio, alojamiento, cambios y soporte. 12 meses de permanencia y después
          mes a mes. Si además quieres que te encuentren y que las reseñas entren solas, eso es el{' '}
          <a href="/servicios" className="text-accent underline underline-offset-4">Pack Estándar</a>, desde 199 €/mes.
        </p>
      </Seccion>

      <Seccion titulo="Cómo trabajamos">
        <Pasos
          items={[
            {
              t: 'Ves tu web antes de pagar',
              d: 'En /tu-web escribes el nombre de tu negocio y la generamos con tus datos reales de Google. Si no te convence, ahí se queda y no has perdido nada.',
            },
            {
              t: 'Nos pasas cuatro cosas',
              d: 'Logo, fotos, servicios con sus precios y horario. Nada más. Si no tienes fotos decentes, te decimos cómo hacerlas con el móvil.',
            },
            {
              t: 'Siete días',
              d: 'Te la enseñamos funcionando, en una dirección temporal, para que la toques desde el móvil antes de publicarla.',
            },
            {
              t: 'Publicamos y nos quedamos',
              d: 'Dominio conectado, ficha de Google enlazada y botón de WhatsApp a tu número. A partir de ahí, los cambios los pides por WhatsApp y van incluidos.',
            },
          ]}
        />
      </Seccion>

      <Seccion titulo="Una web sola no basta, y conviene decirlo">
        <p>
          Si alguien te promete que por tener web te van a llover los clientes, desconfía. Una web
          convierte a quien ya te ha encontrado. Para que te encuentren hacen falta otras dos cosas,
          y las dos son más baratas que la web:
        </p>
        <p>
          La primera, tu <a href="/google-my-business-espana" className="text-accent underline underline-offset-4">ficha de Google</a>{' '}
          bien montada y trabajada cada mes: es lo que te mete en el mapa cuando alguien busca cerca.
          La segunda, las{' '}
          <a href="/resenas-google-my-business" className="text-accent underline underline-offset-4">reseñas</a>, que son lo que
          hace que te elijan a ti y no al de al lado.
        </p>
        <p>
          Puedes hacer las dos por tu cuenta —en esas dos guías está el proceso entero, sin
          reservarnos nada— o contratarlas con la web dentro del Pack Estándar.
        </p>
      </Seccion>

      <Seccion titulo="Con qué negocios trabajamos">
        <p>
          Sobre todo negocios locales de Valencia y su área: peluquerías, clínicas y centros de
          estética, restaurantes, talleres, gimnasios, ópticas, reformas y comercio de barrio.
          También negocios online, autónomos y startups, que tienen otras necesidades y su propia
          página.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          {[
            ['Peluquerías y barberías', '/webs/peluquerias'],
            ['Clínicas y estética', '/webs/clinicas'],
            ['Restaurantes', '/webs/restaurantes'],
            ['Talleres', '/webs/talleres'],
            ['Startups y negocios online', '/startups'],
          ].map(([t, h]) => (
            <a
              key={h}
              href={h}
              className="rounded-full px-4 py-2 text-[14px] bg-white/[.05] ring-1 ring-white/10 text-white/80 hover:bg-white/[.09] hover:text-white transition-colors duration-300"
            >
              {t}
            </a>
          ))}
        </div>
      </Seccion>

      <Seccion titulo="Dónde nos movemos">
        <p>
          Todo el trabajo se hace en remoto, así que la distancia no cambia el precio ni el plazo.
          En <strong>Valencia capital, Torrent, Paterna, Mislata, Burjassot, Alboraya, Museros y
          l&apos;Horta Nord</strong> podemos vernos en persona, que para un negocio de barrio suele
          ser más cómodo que una videollamada.
        </p>
        <p>
          Fuera de ahí trabajamos igual, solo que por WhatsApp y con alguna llamada. Tenemos
          clientes fuera de la provincia y funciona exactamente igual.
        </p>
      </Seccion>
    </GuiaSeo>
  )
}
