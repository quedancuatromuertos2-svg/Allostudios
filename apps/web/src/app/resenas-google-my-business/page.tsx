import type { Metadata } from 'next'
import GuiaSeo, { Seccion, Pasos, Aviso, TrabajoMensual } from '@/components/GuiaSeo'

export const metadata: Metadata = {
  title: 'Reseñas en Google My Business: cómo conseguirlas (guía 2026)',
  description:
    'Cómo conseguir reseñas en Google My Business paso a paso: dónde está tu enlace para pedirlas, el mensaje exacto que funciona, cómo responderlas y qué está prohibido.',
  alternates: { canonical: '/resenas-google-my-business' },
  openGraph: {
    title: 'Reseñas en Google My Business: cómo conseguirlas',
    description:
      'El enlace para pedirlas, el mensaje que funciona, cómo responderlas y qué prohíbe Google.',
    url: 'https://allostudios.net/resenas-google-my-business',
    type: 'article',
  },
}

const faqs = [
  {
    p: '¿Cuántas reseñas necesito para notar algo?',
    r: 'No hay un número mágico, pero por debajo de diez la gente desconfía y por encima de veinte deja de fijarse en la cantidad y mira la nota y las tres últimas. El objetivo razonable de un negocio pequeño es llegar a veinte el primer año y no quedarse parado después: Google también mira que sigan entrando.',
  },
  {
    p: '¿Puedo regalar algo a cambio de una reseña?',
    r: 'No. Las políticas de contenido de Google prohíben ofrecer descuentos, regalos o cualquier incentivo a cambio de una reseña, y también pedir solo reseñas buenas. Si te pillan pueden quitarte las reseñas o inhabilitar el perfil. Lo que sí puedes hacer es pedirla siempre, a todo el mundo y en el mejor momento.',
  },
  {
    p: '¿Se puede borrar una reseña mala?',
    r: 'Solo si incumple las políticas de Google: insultos, contenido falso de alguien que no ha sido cliente, datos personales, spam o conflicto de intereses. Puedes marcarla como inadecuada desde el propio perfil. Si simplemente es una crítica negativa pero real, no se puede borrar, y lo mejor que puedes hacer es responderla bien.',
  },
  {
    p: '¿Dónde se gestionan hoy las reseñas de Google My Business?',
    r: 'Ya no hay una aplicación aparte. Google retiró la app de Google My Business y ahora el perfil se gestiona desde la propia Búsqueda de Google o desde Maps, con la sesión iniciada con la cuenta propietaria: buscas el nombre de tu negocio y te aparece el panel con Reseñas, Fotos, Publicaciones y Editar perfil.',
  },
  {
    p: '¿Cuánto tarda en aparecer una reseña?',
    r: 'Normalmente es inmediata, aunque a veces tarda unas horas. Si una reseña desaparece a los pocos días, suele ser el filtro antispam de Google: pasa cuando llegan muchas de golpe desde la misma red wifi o desde cuentas recién creadas.',
  },
]

export default function Page() {
  return (
    <GuiaSeo
      h1="Reseñas en Google My Business: cómo conseguirlas sin dar vergüenza"
      entradilla="Las reseñas son lo primero que mira alguien que no te conoce, y lo que más pesa para salir arriba en tu zona. Aquí está todo el proceso: dónde está tu enlace, qué mensaje mandar, cuándo mandarlo y qué está prohibido."
      actualizado="septiembre de 2026"
      faqs={faqs}
      cierre={{
        titulo: 'O lo hacemos nosotros y tú no te enteras',
        texto:
          'Pedimos la reseña por ti a cada cliente que entra, en el momento justo, con su nombre y por el canal que use. Tú solo ves cómo suben. Va incluido en el Pack Estándar desde 199 €/mes, o suelto por 79 €/mes sin permanencia.',
        enlace: '/servicios',
        boton: 'Ver cómo funciona',
      }}
    >
      <Seccion titulo="Por qué importan más de lo que parece">
        <p>
          Dos cosas pasan cuando alguien busca «peluquería cerca de mí» o «taller en Museros». La
          primera: Google decide a quién enseña arriba, y las reseñas son una de las señales que
          usa junto a la distancia y a lo completo que esté tu perfil. La segunda, y más
          importante: de los tres o cuatro negocios que salen, la persona elige en dos segundos
          mirando la nota y leyendo por encima las últimas opiniones.
        </p>
        <p>
          Por eso un negocio con 4,8 y 60 reseñas se lleva llamadas que otro con 5,0 y 3 reseñas no
          verá nunca. La nota perfecta con pocas opiniones no convence a nadie: parece de amigos.
        </p>
      </Seccion>

      <Seccion titulo="Dónde está tu enlace para pedir reseñas">
        <p>
          Google te da un enlace corto que abre directamente la ventana de escribir la reseña, con
          las estrellas ya delante. Es la diferencia entre que te la dejen o que se pierdan por el
          camino.
        </p>
        <Pasos
          items={[
            {
              t: 'Busca tu negocio en Google',
              d: 'Con la sesión iniciada con la cuenta que administra el perfil. Te aparecerá el panel de gestión encima de los resultados.',
            },
            {
              t: 'Pulsa «Pedir reseñas»',
              d: 'Está entre los botones del panel, junto a Promocionar o Editar perfil. Desde el móvil, en Google Maps, está en la pestaña Perfil de empresa.',
            },
            {
              t: 'Copia el enlace corto',
              d: 'Tiene la forma g.page/r/…/review. Ese es el que se manda, no la dirección de tu ficha: el enlace de la ficha obliga a buscar el botón y mucha gente abandona ahí.',
            },
            {
              t: 'Guárdalo donde lo tengas a mano',
              d: 'En las respuestas rápidas de WhatsApp Business, en un código QR en el mostrador y en el pie de tus correos. El enlace no caduca.',
            },
          ]}
        />
      </Seccion>

      <Seccion titulo="El mensaje que funciona">
        <p>
          El error habitual es mandar un mensaje largo, formal y pidiendo un favor. Funciona mejor
          uno corto, con su nombre, recordando lo que acaba de pasar y con una sola cosa que hacer:
        </p>
        <div className="mt-5 rounded-2xl bg-white/[.05] ring-1 ring-white/10 p-5 text-[15px] leading-relaxed text-white/85">
          <p className="m-0">
            Hola María 👋 Gracias por venir esta mañana. Si te ha gustado cómo ha quedado, ¿me
            dejas una reseña en Google? Son 20 segundos y a un negocio pequeño como el nuestro le
            ayuda muchísimo:
            <br />
            <span className="text-white/50">[tu enlace]</span>
          </p>
        </div>
        <p>
          Tres reglas que cambian el resultado: que lleve <strong>su nombre</strong>, que se mande{' '}
          <strong>el mismo día</strong> (al día siguiente ya se ha olvidado) y que
          <strong> no pidas una reseña buena</strong>, solo una reseña. Pedir únicamente las
          positivas está prohibido por Google y además se nota.
        </p>
      </Seccion>

      <Seccion titulo="Cuándo pedirla">
        <p>
          Es lo que más influye y casi nadie lo cuida. El momento bueno es justo después de que el
          cliente esté contento: al salir por la puerta, al terminar la entrega, al resolverle un
          problema. Si esperas a la semana siguiente, la respuesta baja en picado.
        </p>
        <p>
          Si atiendes por WhatsApp, deja el mensaje guardado como respuesta rápida y mándalo al
          cerrar la conversación. Si el cliente viene al local, un QR en el mostrador con «¿Nos
          dejas una reseña?» recoge muchas más de las que parece.
        </p>
      </Seccion>

      <Seccion titulo="Cómo responder, incluidas las malas">
        <p>
          Responde a todas. A Google le gusta ver actividad en el perfil y, sobre todo, quien lee
          las reseñas antes de decidir se fija mucho en cómo contestas a las quejas.
        </p>
        <Pasos
          items={[
            {
              t: 'A las buenas, corto y con nombre',
              d: '«Gracias, María. Nos alegra un montón. Te esperamos.» Dos líneas bastan; las respuestas copiadas y pegadas se ven a la legua.',
            },
            {
              t: 'A las malas, sin defenderte',
              d: 'Reconoce lo que pasó, discúlpate una vez y ofrece arreglarlo por privado. Nunca discutas datos ni digas que miente: quien lo lee no está juzgando el caso, está juzgando cómo tratas a la gente cuando algo sale mal.',
            },
            {
              t: 'A las falsas, denúncialas',
              d: 'Desde la propia reseña, en los tres puntos, «Marcar como inadecuada». Y responde igualmente, en tono neutro, diciendo que no encontráis ese pedido o esa visita.',
            },
          ]}
        />
      </Seccion>

      <Seccion titulo="Lo que no puedes hacer">
        <Aviso>
          Google prohíbe <strong>comprar reseñas</strong>, <strong>incentivarlas</strong> con
          descuentos o regalos, pedirlas <strong>solo a los clientes contentos</strong>, escribirlas
          tú mismo o pedírselas a tus empleados, y dejarlas a la competencia. No es una regla
          simbólica: la sanción habitual es que desaparezcan todas las reseñas del perfil de golpe,
          y recuperarlo es muy difícil.
        </Aviso>
        <p className="mt-5">
          También conviene evitar las ráfagas: veinte reseñas en dos días desde la misma wifi
          activan el filtro antispam y desaparecen solas. Mejor un goteo constante.
        </p>
      </Seccion>

      <Seccion titulo="Cuánto trabajo es esto al mes">
        <p>
          Todo lo de arriba se puede hacer solo, y mucha gente lo hace. Conviene saber a qué te
          comprometes: no es una tarde, es una rutina. Estas son las horas reales de un negocio que
          atiende a unos cuarenta clientes al mes.
        </p>
        <TrabajoMensual
          tareas={[
            { que: 'Pedir la reseña a cada cliente, el mismo día', cada: 'cliente', min: '2 min × 40' },
            { que: 'Responder todas las reseñas nuevas', cada: 'semana', min: '15 min × 4' },
            { que: 'Revisar si el filtro ha tumbado alguna', cada: 'mes', min: '15 min' },
            { que: 'Denunciar y contestar las falsas', cada: 'cuando toca', min: '20 min' },
          ]}
          total="≈ 2 h 15 min"
          nota="No es mucho tiempo. El problema nunca es el tiempo: es que hay que acordarse el día que vas con prisa, y ese es justo el día en que el cliente estaba contento. Los negocios que consiguen reseñas de verdad son los que lo tienen automatizado, no los que se lo proponen."
        />
      </Seccion>

      <Seccion titulo="Cómo automatizar la petición">
        <p>
          Lo que de verdad hace que esto funcione no es el mensaje, es que se mande siempre. Y eso,
          a mano, se deja de hacer a las dos semanas.
        </p>
        <p>
          La forma sencilla de automatizarlo es enganchar la petición al momento en el que el
          cliente termina: cuando cierras la venta, cuando marcas la cita como hecha o a los pocos
          días de la entrega. Ahí sale solo un WhatsApp o un correo con su nombre y el enlace, y si
          en una semana no ha dejado la reseña, un único recordatorio. Uno, no tres.
        </p>
      </Seccion>
    </GuiaSeo>
  )
}
