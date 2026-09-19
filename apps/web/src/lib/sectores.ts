/*  Páginas por sector (/webs/<slug>): lo que Google posiciona de verdad es «web para peluquerías
    en Valencia», no una home genérica. Cada sector tiene su dolor, su ejemplo, sus preguntas y
    el ADN de diseño que ya usa el generador (lib/adn.ts), así la demo que se ve es la de su
    gremio. `sectorForm` es la opción exacta del desplegable de /tu-web para preseleccionarla.   */

export type Sector = {
  slug: string
  adn: string               // clave en ADNS
  sectorForm: string        // opción del desplegable de TuWebForm
  nombre: string            // «peluquerías y barberías»
  singular: string          // «una peluquería»
  titulo: string            // h1
  sub: string
  busqueda: string          // lo que escribe el cliente en Google
  ejemplo: { nombre: string; claim: string; palabra: string; servicios: [string, string][]; cta: string }
  dolores: [string, string][]
  lleva: string[]
  faq: [string, string][]
}

export const SECTORES: Sector[] = [
  {
    slug: 'peluquerias', adn: 'barberia', sectorForm: 'Peluquería / Barbería',
    nombre: 'peluquerías y barberías', singular: 'una peluquería',
    titulo: 'Páginas web para peluquerías y barberías en Valencia',
    sub: 'Que te encuentren cuando buscan «barbería cerca de mí», vean tus precios y reserven sin llamar. Web lista en 7 días, desde 99 €/mes, 0 € de entrada.',
    busqueda: 'barbería Ruzafa',
    ejemplo: { nombre: 'Navaja', claim: 'Se nota quién te ha cortado', palabra: 'el pelo', servicios: [['Corte clásico', '18 €'], ['Corte + barba', '25 €'], ['Afeitado a navaja', '15 €']], cta: 'Reservar por WhatsApp' },
    dolores: [
      ['Te escriben mientras cortas', 'Cuando contestas, ya han reservado en otra. El asistente del Pack Pro responde en 8 segundos y deja la cita en tu agenda.'],
      ['Sales con tres fotos y sin horario', 'Tu ficha de Google es lo primero que ven. La dejamos completa y la trabajamos cada mes.'],
      ['Tienes reseñas, pero pocas', 'Cada cliente contento recibe la invitación. Sin perseguir a nadie.'],
    ],
    lleva: ['Carta de servicios con precios', 'Botón de reservar por WhatsApp', 'Horario, mapa y cómo llegar', 'Tus reseñas de Google dentro', 'Fotos de tus cortes, a pantalla completa', 'Ficha de Google optimizada'],
    faq: [
      ['¿Puedo poner reservas online?', 'Sí. Lo más rápido es reservar por WhatsApp (el cliente lo prefiere); con el Pack Pro el asistente confirma la cita y la deja en tu Google Calendar.'],
      ['¿Y si trabajo con Booksy o Treatwell?', 'Se enlaza. La web es tu escaparate en Google; la reserva puede seguir en la app que ya usas.'],
      ['¿Cuánto tarda?', 'Siete días desde que nos pasas logo, fotos, servicios y horario. Lo normal es que tarde menos.'],
    ],
  },
  {
    slug: 'estetica', adn: 'estetica', sectorForm: 'Centro de estética / Spa',
    nombre: 'centros de estética y spas', singular: 'un centro de estética',
    titulo: 'Páginas web para centros de estética en Valencia',
    sub: 'Tratamientos, bonos y primera visita, presentados como se merece tu centro. Que te encuentren, te escriban y reserven. Desde 99 €/mes, 0 € de entrada.',
    busqueda: 'centro de estética Benimaclet',
    ejemplo: { nombre: 'Seda', claim: 'Cuídate.', palabra: 'Te lo mereces.', servicios: [['Limpieza facial', '45 €'], ['Manicura semipermanente', '25 €'], ['Bono 5 sesiones', '180 €']], cta: 'Reservar / Contactar' },
    dolores: [
      ['Vendes bonos y nadie los ve', 'Tu web los pone delante con el precio y el botón. Y el asistente los explica a quien pregunta a las 22:00.'],
      ['Compites con cadenas', 'Una web con tu marca, tus fotos y tus reseñas te hace parecer más grande de lo que eres.'],
      ['Las clientas preguntan siempre lo mismo', 'Precios, duración, qué incluye: lo contesta el asistente del Pack Pro con tu tono.'],
    ],
    lleva: ['Tratamientos con precio y duración', 'Bonos y packs destacados', 'Reserva por WhatsApp', 'Antes/después y fotos del centro', 'Reseñas de Google integradas', 'Ficha de Google optimizada'],
    faq: [
      ['¿Puedo cambiar precios y promociones cada mes?', 'Sí, cambios ilimitados en 3 días. Nos lo mandas por WhatsApp y está.'],
      ['¿La web sirve para Instagram?', 'Es donde mandas desde la bio. Con tus bonos y el botón de reservar, Instagram deja de ser solo fotos.'],
      ['¿Qué pasa si ya tengo web?', 'La miramos gratis. Si sirve, la dejamos y trabajamos Google y reseñas; si no, la nueva con lo que ya tienes.'],
    ],
  },
  {
    slug: 'clinicas', adn: 'salud', sectorForm: 'Clínica dental',
    nombre: 'clínicas dentales y de salud', singular: 'una clínica',
    titulo: 'Páginas web para clínicas dentales, fisios y ópticas en Valencia',
    sub: 'Primera visita, tratamientos y una web que transmite confianza desde el primer segundo. Con el asistente que responde y da cita 24/7. Desde 99 €/mes.',
    busqueda: 'clínica dental Benimaclet',
    ejemplo: { nombre: 'Clínica Serra', claim: 'Venir al dentista no debería dar', palabra: 'ninguna pereza.', servicios: [['Primera visita', 'Gratis'], ['Limpieza', '45 €'], ['Ortodoncia invisible', 'desde 89 €/mes']], cta: 'Pedir cita' },
    dolores: [
      ['La primera visita gratis no se ve', 'Es tu mejor gancho. La web lo pone arriba, con el botón de pedir cita al lado.'],
      ['Te llaman en horario de consulta', 'Y nadie contesta. El asistente del Pack Pro da cita y la deja en tu agenda a cualquier hora.'],
      ['Las reseñas deciden', 'En salud, más que en ningún sitio. Las pedimos por ti a cada paciente contento.'],
    ],
    lleva: ['Tratamientos explicados sin tecnicismos', 'Primera visita y financiación destacadas', 'Cita por WhatsApp o teléfono', 'Equipo con foto y nombre', 'Reseñas de Google integradas', 'Ficha de Google optimizada'],
    faq: [
      ['¿Cumple con la normativa sanitaria?', 'Textos sin promesas de resultados, aviso legal y privacidad incluidos. Los datos de pacientes no pasan por la web.'],
      ['¿Puede el asistente dar citas de verdad?', 'Sí, con el Pack Pro: comprueba tus huecos en Google Calendar, confirma y manda recordatorio.'],
      ['¿Sirve para fisios, ópticas o veterinarios?', 'Sí. El diseño se adapta al tipo de consulta; el proceso es el mismo.'],
    ],
  },
  {
    slug: 'restaurantes', adn: 'restaurante', sectorForm: 'Restaurante / Bar',
    nombre: 'restaurantes y bares', singular: 'un restaurante',
    titulo: 'Páginas web para restaurantes y bares en Valencia',
    sub: 'Carta, reservas y fotos que dan hambre. Que te encuentren cuando buscan «dónde comer» y reserven sin llamar. Desde 99 €/mes, 0 € de entrada.',
    busqueda: 'arrocería El Palmar',
    ejemplo: { nombre: 'Sequer', claim: 'Leña de naranjo.', palabra: 'Sin excepciones.', servicios: [['Paella valenciana', '16 €/pers.'], ['Arroz del senyoret', '18 €/pers.'], ['Menú del día', '14 €']], cta: 'Reservar mesa' },
    dolores: [
      ['Tu carta es una foto en Instagram', 'Y no se lee desde el móvil. La web la lleva ordenada, con precios y alérgenos.'],
      ['Reservas por teléfono en pleno servicio', 'El asistente del Pack Pro reserva por WhatsApp, pregunta cuántos son y a qué hora, y te lo deja en la agenda.'],
      ['Las reseñas te bajan o te suben', 'Las pedimos al que sale contento. Las malas las contestamos contigo.'],
    ],
    lleva: ['Carta con precios y alérgenos', 'Reservar por WhatsApp o teléfono', 'Fotos a pantalla completa', 'Horario, mapa y parking', 'Reseñas de Google integradas', 'Ficha de Google optimizada'],
    faq: [
      ['¿Se puede cambiar la carta cada semana?', 'Sí, cambios ilimitados en 3 días. Menú del día incluido.'],
      ['¿Y el delivery?', 'Se enlaza a Glovo, Uber Eats o el que uses. La web es tu escaparate en Google.'],
      ['¿Sirve para bares y cafeterías?', 'Sí; para cafeterías tenemos un diseño propio. Mira la página de cafeterías.'],
    ],
  },
  {
    slug: 'cafeterias', adn: 'cafeteria', sectorForm: 'Cafetería',
    nombre: 'cafeterías y pastelerías', singular: 'una cafetería',
    titulo: 'Páginas web para cafeterías y pastelerías en Valencia',
    sub: 'Tu carta, tus horarios y tu sitio en el mapa cuando buscan «cafetería cerca». Encargos por WhatsApp sin descolgar el teléfono. Desde 99 €/mes.',
    busqueda: 'cafetería de especialidad Ruzafa',
    ejemplo: { nombre: 'Tueste', claim: 'Café de especialidad,', palabra: 'sin postureo.', servicios: [['Espresso', '1,80 €'], ['Tostada de aguacate', '6,50 €'], ['Tarta del día', '4,50 €']], cta: 'Cómo llegar' },
    dolores: [
      ['Te buscan y sale la de al lado', 'Con la ficha de Google completa y la web con tu carta, sales tú.'],
      ['Encargos de tartas por teléfono', 'El asistente del Pack Pro los recoge por WhatsApp: qué, para cuándo, para cuántos.'],
      ['Horarios que cambian', 'Un WhatsApp y lo cambiamos en la web y en Google.'],
    ],
    lleva: ['Carta con precios', 'Encargos por WhatsApp', 'Horario y mapa arriba del todo', 'Fotos del local y del producto', 'Reseñas de Google integradas', 'Ficha de Google optimizada'],
    faq: [
      ['¿Necesito web si ya tengo Instagram?', 'Instagram no sale en Google cuando alguien busca «cafetería cerca de mí». La web y la ficha, sí.'],
      ['¿Puedo vender online?', 'Encargos por WhatsApp, sí. Tienda online completa, no: no compensa para una cafetería.'],
      ['¿Cuánto cuesta?', 'Web sola desde 99 €/mes; con Google y reseñas, Pack Estándar 199 €/mes. 0 € de entrada.'],
    ],
  },
  {
    slug: 'gimnasios', adn: 'gimnasio', sectorForm: 'Gimnasio / Entrenamiento',
    nombre: 'gimnasios y entrenadores', singular: 'un gimnasio',
    titulo: 'Páginas web para gimnasios, boxes y entrenadores en Valencia',
    sub: 'Tarifas claras, clase de prueba y alta por WhatsApp. Que te encuentren cuando buscan «gimnasio cerca» y no se vayan a la cadena. Desde 99 €/mes.',
    busqueda: 'crossfit Benimaclet',
    ejemplo: { nombre: 'Voltio', claim: 'Entrena como si', palabra: 'fuera en serio.', servicios: [['Cuota mensual', '39 €'], ['Clase de prueba', 'Gratis'], ['Entreno personal', '30 €/sesión']], cta: 'Pide tu clase de prueba' },
    dolores: [
      ['La clase de prueba no se ve', 'Es lo que convierte. La web la pone arriba, con el botón de WhatsApp.'],
      ['Preguntan precio y desaparecen', 'El asistente del Pack Pro contesta al momento y propone la prueba.'],
      ['Compites con cadenas a 19 €', 'Tu web enseña lo que ellas no tienen: el entrenador, la comunidad, las fotos reales.'],
    ],
    lleva: ['Tarifas y clase de prueba destacadas', 'Horario de clases', 'Alta o prueba por WhatsApp', 'Fotos y vídeo del box', 'Reseñas de Google integradas', 'Ficha de Google optimizada'],
    faq: [
      ['¿Puede el asistente gestionar la clase de prueba?', 'Sí, con el Pack Pro: la agenda en tu calendario y manda recordatorio.'],
      ['¿Sirve para entrenadores personales?', 'Sí. Web de una página con tus servicios, resultados y reserva.'],
      ['¿Puedo enseñar el horario de clases?', 'Sí, y cambiarlo cuando quieras: cambios ilimitados en 3 días.'],
    ],
  },
  {
    slug: 'talleres', adn: 'taller', sectorForm: 'Taller mecánico',
    nombre: 'talleres y reformas', singular: 'un taller',
    titulo: 'Páginas web para talleres mecánicos y reformas en Valencia',
    sub: 'Presupuesto por WhatsApp, servicios claros y las reseñas que hacen que te llamen a ti. Web en 7 días, desde 99 €/mes, 0 € de entrada.',
    busqueda: 'taller mecánico Torrent',
    ejemplo: { nombre: 'Acero', claim: 'Tu coche,', palabra: 'sin sorpresas.', servicios: [['Revisión pre-ITV', '39 €'], ['Cambio de aceite', 'desde 59 €'], ['Diagnosis', '30 €']], cta: 'Pide presupuesto' },
    dolores: [
      ['Piden presupuesto y no contestas a tiempo', 'El asistente del Pack Pro recoge qué le pasa al coche y la matrícula, y te lo pasa.'],
      ['Desconfían del taller que no conocen', 'Reseñas, fotos reales y precios orientativos arriba. La confianza se gana antes de entrar.'],
      ['No sales en Google Maps', 'La ficha de Google es el 80 % de tus clientes nuevos. La dejamos completa.'],
    ],
    lleva: ['Servicios con precio orientativo', 'Presupuesto por WhatsApp', 'Horario, mapa y cómo llegar', 'Fotos reales del taller', 'Reseñas de Google integradas', 'Ficha de Google optimizada'],
    faq: [
      ['¿Sirve para reformas, fontaneros o electricistas?', 'Sí. Mismo proceso: servicios, zona, presupuesto por WhatsApp y reseñas.'],
      ['¿Puedo poner precios?', 'Orientativos, «desde». Los cambias cuando quieras.'],
      ['¿Cuánto tarda?', 'Siete días desde que nos pasas el material.'],
    ],
  },
  {
    slug: 'despachos', adn: 'despacho', sectorForm: 'Abogado / Asesoría',
    nombre: 'abogados, asesorías e inmobiliarias', singular: 'un despacho',
    titulo: 'Páginas web para abogados, asesorías e inmobiliarias en Valencia',
    sub: 'Una web seria, que explica en qué ayudas y cómo pedir cita. Que te encuentren cuando buscan «asesoría cerca» y te escriban. Desde 99 €/mes.',
    busqueda: 'asesoría autónomos Valencia',
    ejemplo: { nombre: 'Tinta', claim: 'Las cosas claras', palabra: 'desde el principio.', servicios: [['Primera consulta', '30 min gratis'], ['Autónomos', 'desde 49 €/mes'], ['Herencias', 'presupuesto cerrado']], cta: 'Pedir cita' },
    dolores: [
      ['Tu web parece de 2012', 'Y el cliente lo nota. Una web actual transmite lo que cobras.'],
      ['Consultas fuera de horario', 'El asistente del Pack Pro recoge el caso y propone cita. Tú lo ves por la mañana.'],
      ['Nadie sabe qué haces exactamente', 'Servicios explicados en una frase cada uno, sin jerga.'],
    ],
    lleva: ['Áreas o servicios explicados', 'Primera consulta destacada', 'Cita por WhatsApp o formulario', 'Equipo con foto y nombre', 'Reseñas de Google integradas', 'Ficha de Google optimizada'],
    faq: [
      ['¿Puede el asistente hablar con clientes de un despacho?', 'Solo lo que tú valides: horarios, servicios, cómo pedir cita. Lo delicado te lo pasa a ti.'],
      ['¿Inmobiliarias con cartera de pisos?', 'Sí, con enlace a tu portal o una selección destacada. La cartera completa se gestiona en tu CRM.'],
      ['¿Aviso legal y protección de datos?', 'Incluidos.'],
    ],
  },
  {
    slug: 'tiendas', adn: 'comercio', sectorForm: 'Tienda / Comercio',
    nombre: 'tiendas y comercios locales', singular: 'una tienda',
    titulo: 'Páginas web para tiendas y comercios locales en Valencia',
    sub: 'Que te encuentren cuando buscan lo que vendes en tu barrio, vean horario y producto, y te escriban. Web en 7 días, desde 99 €/mes, 0 € de entrada.',
    busqueda: 'floristería Benimaclet',
    ejemplo: { nombre: 'Coral', claim: 'Lo que buscas,', palabra: 'a dos calles.', servicios: [['Ramos desde', '18 €'], ['Encargos', 'por WhatsApp'], ['Envío en Valencia', '5 €']], cta: 'Escríbenos' },
    dolores: [
      ['Te buscan en Google y no existes', 'La ficha completa y la web con tu producto. Es lo que decide si entran o no.'],
      ['Preguntas repetidas por WhatsApp', '«¿Tenéis…?», «¿hasta qué hora?». El asistente del Pack Pro las contesta.'],
      ['Amazon está a un clic', 'Tú tienes lo que ellos no: hoy, aquí, con cara. La web lo cuenta.'],
    ],
    lleva: ['Producto o categorías con fotos', 'Encargos por WhatsApp', 'Horario, mapa y cómo llegar', 'Novedades y ofertas', 'Reseñas de Google integradas', 'Ficha de Google optimizada'],
    faq: [
      ['¿Es una tienda online?', 'No: es tu escaparate en Google con encargos por WhatsApp. Si necesitas vender online con carrito, te lo decimos claro y te proponemos otra cosa.'],
      ['¿Puedo cambiar productos cada semana?', 'Sí, cambios ilimitados en 3 días.'],
      ['¿Cuánto cuesta?', 'Web sola desde 99 €/mes; con Google y reseñas, Pack Estándar 199 €/mes. 0 € de entrada.'],
    ],
  },
]

export const sectorDe = (slug: string) => SECTORES.find((s) => s.slug === slug)
