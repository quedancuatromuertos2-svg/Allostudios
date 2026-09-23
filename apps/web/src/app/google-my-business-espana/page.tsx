import type { Metadata } from 'next'
import GuiaSeo, { Seccion, Pasos, Aviso, TrabajoMensual } from '@/components/GuiaSeo'

export const metadata: Metadata = {
  title: 'Google My Business en España: cómo darse de alta en 2026',
  description:
    'Google My Business ya se llama Perfil de Empresa y no tiene app propia. Cómo crear tu ficha en España, verificarla, qué poner en cada campo y los errores que te dejan fuera del mapa.',
  alternates: { canonical: '/google-my-business-espana' },
  openGraph: {
    title: 'Google My Business en España: cómo darse de alta en 2026',
    description:
      'Crear la ficha, verificarla, rellenarla bien y los errores que te dejan fuera del mapa.',
    url: 'https://allostudios.net/google-my-business-espana',
    type: 'article',
  },
}

const faqs = [
  {
    p: '¿Google My Business sigue existiendo?',
    r: 'Existe el producto, pero cambió de nombre: ahora se llama Perfil de Empresa de Google. Lo que desapareció fue la aplicación aparte; desde 2022 la ficha se gestiona directamente desde la Búsqueda de Google y desde Maps, con la sesión iniciada con la cuenta propietaria.',
  },
  {
    p: '¿Puedo tener ficha si trabajo desde casa y no recibo clientes?',
    r: 'Sí. Es lo que Google llama empresa con zona de servicio: marcas que no tienes un local que visiten los clientes, das una dirección que Google usa solo para verificarte y no se publica, y defines las zonas donde trabajas. Es lo normal en fontaneros, electricistas, fotógrafos o agencias.',
  },
  {
    p: '¿Cuánto tarda la verificación en España?',
    r: 'Google dice hasta cinco días. Lo habitual hoy es la verificación por vídeo: grabas con el móvil el exterior, el interior y algo que te vincule al negocio, sin cortes. Si sale bien puede resolverse en horas; si la rechazan, se puede repetir. Mientras tanto la ficha existe pero no es visible públicamente.',
  },
  {
    p: '¿Puedo poner varias ciudades para salir en todas?',
    r: 'Puedes añadir zonas de servicio, pero no funciona como la gente espera: Google recomienda no pasar de unas dos horas de coche desde tu ubicación y lo que más pesa para aparecer sigue siendo la distancia real entre quien busca y tu dirección. Poner veinte ciudades no te hace salir en veinte ciudades.',
  },
  {
    p: '¿Puedo poner palabras clave en el nombre del negocio?',
    r: 'No. El nombre tiene que ser el nombre real del negocio, el del rótulo. Añadir cosas como «peluquería Valencia centro» si no es tu nombre real es una de las causas más frecuentes de suspensión, y además cualquiera puede reportarlo, incluida tu competencia.',
  },
]

export default function Page() {
  return (
    <GuiaSeo
      h1="Google My Business en España: cómo darse de alta y que te encuentren"
      entradilla="Cambió de nombre, perdió su aplicación y sigue siendo lo que más clientes trae a un negocio local. Aquí está cómo crear la ficha desde cero en España, cómo pasar la verificación por vídeo y qué errores te dejan fuera del mapa."
      actualizado="septiembre de 2026"
      faqs={faqs}
      cierre={{
        titulo: 'Si prefieres no pelearte con esto',
        texto:
          'Te montamos la ficha entera, pasamos la verificación y la trabajamos cada mes: categorías, servicios, fotos, publicaciones y las reseñas pedidas solas. SEO local por 99 €/mes, o dentro del Pack Estándar con la web incluida desde 199 €/mes.',
        enlace: '/servicios',
        boton: 'Ver el SEO local',
      }}
    >
      <Seccion titulo="Primero: ya no se llama así, y no hay app">
        <p>
          Si estás buscando la aplicación de Google My Business, no la vas a encontrar. Google la
          retiró y movió todo a dos sitios que ya usas: la <strong>Búsqueda</strong> y{' '}
          <strong>Maps</strong>. El producto se llama ahora <strong>Perfil de Empresa de Google</strong>.
        </p>
        <p>
          Para entrar, inicia sesión con la cuenta propietaria y busca el nombre de tu negocio en
          Google. Encima de los resultados te aparece el panel con Reseñas, Fotos, Publicaciones y
          Editar perfil. Eso es todo el panel de gestión.
        </p>
      </Seccion>

      <Seccion titulo="Crear la ficha, paso a paso">
        <Pasos
          items={[
            {
              t: 'Entra en google.com/business',
              d: 'Con la cuenta de Google que vayas a usar siempre para el negocio, no con una personal que compartas con otras cosas. Cambiar de propietario después es un lío.',
            },
            {
              t: 'Nombre y categoría',
              d: 'El nombre, exactamente el del rótulo. La categoría principal es el campo que más influye en para qué búsquedas apareces: elige la más específica que exista («óptica», no «tienda»). Luego podrás añadir secundarias.',
            },
            {
              t: '¿Tienen que venir los clientes?',
              d: 'Si tienes local a pie de calle, pon la dirección. Si trabajas a domicilio o desde casa, di que no: entonces defines zonas de servicio y tu dirección queda oculta.',
            },
            {
              t: 'Teléfono y web',
              d: 'Un solo teléfono, el que atiendes de verdad. Si tienes web, ponla; si no la tienes, ese es justo el hueco por el que se te cuelan las cadenas, porque ellas sí salen en la Búsqueda además de en Maps.',
            },
            {
              t: 'Verificación',
              d: 'Google te pedirá confirmar que el negocio existe. En España lo más común hoy es el vídeo. Mientras se resuelve, la ficha aparece como no visible públicamente.',
            },
          ]}
        />
      </Seccion>

      <Seccion titulo="La verificación por vídeo, sin sustos">
        <p>
          Es una grabación con el móvil, sin cortes, en la que tienes que enseñar tres cosas: que el
          sitio existe y se corresponde con la dirección, que el negocio está en marcha y que tú
          tienes acceso a él.
        </p>
        <p>
          En la práctica: empiezas en la calle enseñando el portal o el rótulo y algo que sitúe la
          calle, entras, enseñas el interior y las herramientas o el material propios del oficio, y
          terminas enseñando algo que solo tendría el responsable: la caja, el almacén, una factura
          con el nombre del negocio. Todo en la misma toma, sin parar de grabar.
        </p>
        <Aviso>
          Si eres un negocio sin local, la verificación se centra en lo demás: el material de
          trabajo, el vehículo rotulado si lo hay, documentación a tu nombre. Lo que nunca funciona
          es dar una dirección que no es tuya. Es la forma más rápida de que te suspendan la ficha,
          y recuperarla lleva semanas.
        </Aviso>
      </Seccion>

      <Seccion titulo="Qué rellenar para salir arriba">
        <p>
          Una ficha a medias no compite. Estos son los campos que más mueven la aguja, por orden:
        </p>
        <Pasos
          items={[
            {
              t: 'Categoría principal',
              d: 'La más específica. Si te equivocas aquí, no sales en las búsquedas de tu oficio por mucho que hagas lo demás.',
            },
            {
              t: 'Servicios, uno a uno',
              d: 'Con nombres que la gente escriba de verdad. No «soluciones integrales»: «cambio de cristales», «revisión de la vista», «corte y barba».',
            },
            {
              t: 'Horario, y los festivos',
              d: 'Un horario mal puesto te cuesta clientes y reseñas malas. Los días especiales (agosto, Navidad, Fallas) se configuran aparte.',
            },
            {
              t: 'Fotos reales, y muchas',
              d: 'Del local, del equipo y del trabajo hecho. Nada de bancos de imágenes: se nota y Google prioriza lo que parece auténtico. Añade alguna cada mes.',
            },
            {
              t: 'Publicaciones',
              d: 'La ficha permite publicar novedades. Es de lo poco gratis que sigue dando señal de actividad y casi nadie lo usa.',
            },
            {
              t: 'Preguntas y respuestas',
              d: 'Puedes publicar tú las preguntas que te hacen siempre y responderlas. Si no lo haces tú, lo hará cualquiera.',
            },
          ]}
        />
      </Seccion>

      <Seccion titulo="Los errores que te dejan fuera del mapa">
        <p>
          Casi todos los negocios que no aparecen tienen alguno de estos, y todos se arreglan en una
          tarde:
        </p>
        <ul className="mt-4 space-y-2.5 list-none p-0">
          {[
            'Meter palabras clave en el nombre. Es causa directa de suspensión.',
            'Tener dos fichas duplicadas de la misma dirección, una antigua sin reclamar.',
            'Que el teléfono, el nombre o la dirección no coincidan con los de tu web y tus redes. Google compara y desconfía.',
            'Categoría genérica cuando existe una específica.',
            'Cero reseñas nuevas en seis meses.',
            'No responder a las reseñas, ni buenas ni malas.',
            'Fotos de banco de imágenes en lugar de las tuyas.',
          ].map((t) => (
            <li key={t} className="flex gap-3 text-[15.5px] text-white/70">
              <span className="text-rose-400 font-semibold leading-relaxed">✕</span>
              <span>{t}</span>
            </li>
          ))}
        </ul>
      </Seccion>

      <Seccion titulo="La parte que nadie cuenta: esto no se acaba">
        <p>
          Crear la ficha es un rato. Mantenerla arriba es lo que cuesta, porque Google premia la
          actividad y la competencia de al lado también está publicando. Estas son las horas reales
          de tener una ficha viva:
        </p>
        <TrabajoMensual
          tareas={[
            { que: 'Publicar una novedad', cada: 'semana', min: '15 min × 4' },
            { que: 'Subir fotos nuevas del trabajo', cada: 'mes', min: '30 min' },
            { que: 'Responder reseñas y preguntas', cada: 'semana', min: '15 min × 4' },
            { que: 'Revisar horarios, festivos y servicios', cada: 'mes', min: '20 min' },
            { que: 'Mirar el rendimiento y corregir', cada: 'mes', min: '30 min' },
          ]}
          total="≈ 3 h 20 min"
          nota="Tres horas al mes, todos los meses, durante años. Es perfectamente asumible si te gusta esto. Lo que casi nunca pasa es que un dueño de negocio lo sostenga en temporada alta, y ahí es donde la ficha se apaga y se cae del mapa sin que nadie se dé cuenta."
        />
      </Seccion>

      <Seccion titulo="Qué esperar de forma realista">
        <p>
          Una ficha bien montada empieza a notarse en semanas, no en días, y lo que verás primero no
          son ventas: son llamadas y solicitudes de ruta. Google te enseña esos datos en el propio
          panel, en Rendimiento.
        </p>
        <p>
          Y una advertencia que ahorra disgustos: quien te prometa que vas a salir el primero en
          Google Maps te está vendiendo humo. La posición depende en buena parte de la distancia
          entre quien busca y tu negocio, y eso no lo controla nadie. Lo que sí se controla es
          aparecer siempre que alguien cerca busque lo que haces, y que al aparecer te elija a ti.
        </p>
      </Seccion>
    </GuiaSeo>
  )
}
