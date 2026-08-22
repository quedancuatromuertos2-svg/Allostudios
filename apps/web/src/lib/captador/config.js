// ============================================================
//  CAPTADOR VALENCIA — Configuración
//  Edita SOLO la sección SENDER (y PRICES si cambias tarifas).
// ============================================================

module.exports = {
  PORT: process.env.PORT || 4321,

  // Acceso a la app: usuario y contraseña compartidos (tú y Fran). Cámbialos si quieres.
  // Protege el acceso tanto por wifi como por internet (túnel). Pon pass:'' para desactivar.
  AUTH: { user: process.env.CAPTADOR_USER || 'allostudios', pass: process.env.CAPTADOR_PASS || 'allostudios2026' }, // admin: ve TODOS los leads

  // Afiliados/comerciales: cada uno con su login → ve SOLO sus leads (su vendedor).
  // 'vendedor' casa con phoneFor: '1' = móvil 1 (Ángel), '2' = móvil 2 (Fran).
  // Añade más comerciales aquí cuando reclutes (usuario/contraseña/vendedor propios).
  USERS: [
    { user: 'angel', pass: 'angel2026', name: 'Ángel', vendedor: '1' },
    { user: 'fran',  pass: 'fran2026',  name: 'Fran',  vendedor: '2' },
  ],

  // Tus datos: aparecen en los mensajes de venta y en el pie de las demos.
  SENDER: {
    name: 'Ángel de Allostudios', // <-- comercial 1 (firma los leads del móvil 1)
    name2: 'Fran de Allostudios', // <-- comercial 2 (firma los leads del móvil 2). Cambia "Fran" por su nombre real.
    phone: '695868793',           // <-- móvil 1
    phone2: '655707471',          // <-- móvil 2 (los leads se reparten 50/50 entre los dos)
    email: 'hola.allostudios@gmail.com', // <-- Gmail de empresa
  },

  // Tus tarifas (salen en los mensajes de cierre y en las estadísticas).
  PRICES: {
    web: 499,        // € pago único por la web
    monthly: 49,     // €/mes mantenimiento (hosting + cambios + soporte)
  },

  // Escalera de 3 niveles para la web (anclaje: el de 400 pasa a ser "la opción prudente"
  // y un 20-30% elegirá el del medio). La razón del precio bajo: cartera de lanzamiento.
  TIERS: {
    arranque: { label: 'Arranque', setup: 499, monthly: 49, pitch: 'la demo que has visto, afinada y online en 7 días' },
    premium: { label: 'Premium', setup: 790, monthly: 49, pitch: 'animaciones avanzadas, secciones extra, copy profesional y tus reseñas de Google integradas' },
    cine: { label: 'Cinematográfica', setup: 1490, monthly: 79, pitch: 'efecto Apple: tu producto despiezándose al hacer scroll — nadie más en Valencia lo tiene' },
  },

  // Catálogo de servicios que vendes (no solo webs). El motor recomienda el que
  // mejor encaja con cada negocio, aunque ya tenga web. Edita precios a tu gusto.
  SERVICES: {
    web:            { label: 'Web nueva / rediseño',     emoji: '🌐', setup: 499, monthly: 49 },
    redes:          { label: 'Gestión de Instagram',     emoji: '📸', setup: 0,   monthly: 199 },
    seo:            { label: 'SEO — salir en Google',     emoji: '🔎', setup: 199, monthly: 99 },
    reservas:       { label: 'Reserva de cita online',    emoji: '📅', setup: 149, monthly: 0 },
    resenas:        { label: 'Reseñas 5★ en Google',      emoji: '⭐', setup: 0,   monthly: 79 },
    chatbot:        { label: 'Chatbot WhatsApp 24/7',     emoji: '💬', setup: 199, monthly: 39 },
    ads:            { label: 'Campañas Meta / Google Ads', emoji: '🎯', setup: 0,  monthly: 199 },
    automatizacion: { label: 'Automatizaciones',          emoji: '⚙️', setup: 149, monthly: 0 },
  },

  // Si publicas la carpeta demos/ en internet (Vercel/Netlify), pon aquí la URL base
  // (ej: 'https://demos-valencia.vercel.app') y los mensajes usarán enlaces públicos.
  PUBLIC_DEMO_BASE: 'https://demos-six-gold.vercel.app',

  // ⭐ Clave de Google Places (fuente de leads BUENA: teléfono, reseñas, abierto/cerrado).
  // Pega aquí tu clave y la app buscará en Google en vez de OpenStreetMap.
  // Cómo sacarla gratis en 5 min: mira PLACES-SETUP.md. Déjala vacía para seguir con OSM.
  GOOGLE_PLACES_KEY: process.env.GOOGLE_PLACES_KEY || 'AIzaSyB0JiKfAWLDntPpLyzwwsUcS_o7ggNDDgo',

  // Objetivo de contactos diarios (barra de progreso en Estadísticas).
  // Modo jornada completa ×2 vendedores: 30 por cabeza. El lote acepta ?limit=60 si hace falta más.
  DAILY_GOAL: 30,

  // Zonas de búsqueda (bounding boxes).
  ZONES: {
    valencia:   { label: 'València ciudad',                bbox: { south: 39.405, west: -0.46, north: 39.53, east: -0.29 } },
    oeste:      { label: 'Oeste: Torrent·Aldaia·Manises·Paterna', bbox: { south: 39.38, west: -0.56, north: 39.52, east: -0.42 } },
    norte:      { label: 'Norte: Burjassot·Montcada·Alboraia',    bbox: { south: 39.49, west: -0.47, north: 39.59, east: -0.29 } },
    sur:        { label: 'Sur: Paiporta·Catarroja·Silla',         bbox: { south: 39.30, west: -0.46, north: 39.43, east: -0.32 } },
    metropoli:  { label: 'Área metropolitana completa',           bbox: { south: 39.30, west: -0.56, north: 39.59, east: -0.29 } },
  },

  // Sectores disponibles y cómo se buscan en OpenStreetMap.
  SECTORS: {
    peluquerias:   { label: 'Peluquerías y barberías',  selectors: ['shop=hairdresser'] },
    estetica:      { label: 'Centros de estética',      selectors: ['shop=beauty'] },
    restaurantes:  { label: 'Restaurantes',             selectors: ['amenity=restaurant'] },
    cafeterias:    { label: 'Cafeterías y bares',       selectors: ['amenity=cafe', 'amenity=bar'] },
    dentistas:     { label: 'Clínicas dentales',        selectors: ['amenity=dentist'] },
    fisios:        { label: 'Fisioterapia',             selectors: ['healthcare=physiotherapist'] },
    clinicas:      { label: 'Clínicas y consultas',     selectors: ['amenity=clinic', 'amenity=doctors'] },
    talleres:      { label: 'Talleres mecánicos',       selectors: ['shop=car_repair'] },
    gimnasios:     { label: 'Gimnasios',                selectors: ['leisure=fitness_centre'] },
    abogados:      { label: 'Abogados',                 selectors: ['office=lawyer'] },
    inmobiliarias: { label: 'Inmobiliarias',            selectors: ['office=estate_agent'] },
    veterinarios:  { label: 'Veterinarios',             selectors: ['amenity=veterinary'] },
    fontaneros:    { label: 'Fontaneros y electricistas', selectors: ['craft=plumber', 'craft=electrician'] },
    fotografos:    { label: 'Fotógrafos',               selectors: ['craft=photographer', 'shop=photo'] },
    opticas:       { label: 'Ópticas',                  selectors: ['shop=optician'] },
    autoescuelas:  { label: 'Autoescuelas',             selectors: ['amenity=driving_school'] },
    tatuajes:      { label: 'Estudios de tatuaje',      selectors: ['shop=tattoo'] },
    floristerias:  { label: 'Floristerías',             selectors: ['shop=florist'] },
    panaderias:    { label: 'Panaderías y pastelerías', selectors: ['shop=bakery', 'shop=pastry'] },
    masajes:       { label: 'Centros de masaje',        selectors: ['shop=massage'] },
    podologos:     { label: 'Podólogos',                selectors: ['healthcare=podiatrist'] },
    psicologos:    { label: 'Psicólogos',               selectors: ['healthcare=psychotherapist', 'office=psychologist'] },
    joyerias:      { label: 'Joyerías',                 selectors: ['shop=jewelry'] },
    mascotas:      { label: 'Tiendas de mascotas',      selectors: ['shop=pet'] },
    // —— Sectores ampliados ——
    asesorias:     { label: 'Asesorías y gestorías',    selectors: ['office=accountant', 'office=tax_advisor', 'office=financial'] },
    arquitectos:   { label: 'Arquitectos y aparejadores', selectors: ['office=architect'] },
    agenciasviajes:{ label: 'Agencias de viajes',       selectors: ['shop=travel_agency'] },
    academias:     { label: 'Academias y formación',    selectors: ['amenity=language_school', 'amenity=prep_school'] },
    reformas:      { label: 'Reformas y construcción',  selectors: ['craft=builder', 'shop=doityourself'] },
    cerrajeros:    { label: 'Cerrajeros',               selectors: ['craft=locksmith'] },
    pintores:      { label: 'Pintores y decoradores',   selectors: ['craft=painter'] },
    ferreterias:   { label: 'Ferreterías',              selectors: ['shop=hardware', 'shop=trade'] },
    ropa:          { label: 'Tiendas de ropa y moda',   selectors: ['shop=clothes', 'shop=boutique'] },
    zapaterias:    { label: 'Zapaterías',               selectors: ['shop=shoes'] },
    muebles:       { label: 'Muebles y decoración',     selectors: ['shop=furniture', 'shop=interior_decoration'] },
    informatica:   { label: 'Informática y reparación', selectors: ['shop=computer', 'craft=electronics_repair'] },
    telefonia:     { label: 'Telefonía',                selectors: ['shop=mobile_phone'] },
    nutricion:     { label: 'Nutricionistas y dietética', selectors: ['healthcare=nutrition_counselling', 'shop=health_food'] },
    spa:           { label: 'Spa y balnearios',         selectors: ['leisure=spa'] },
    copisterias:   { label: 'Copisterías e imprentas',  selectors: ['shop=copyshop'] },
  },

  // ── FILTRO DE CALIDAD DEL LOTE DE LLAMADAS ──
  // Quita del lote lo que hace perder tiempo. Los pones en false para desactivar,
  // o añades/quitas nombres de cadenas (en minúscula) a tu gusto. En el lote puedes
  // saltarte el filtro con  /lote.html?...&all=1  si un día quieres verlos a todos.
  LEAD_FILTER: {
    soloSinWebDecente: true, // fuera negocios que YA tienen una web buena
    fueraCadenas: true,      // fuera franquicias / cadenas grandes (por nombre)
    // Nombres (o trozos) que identifican cadenas grandes. Todo en minúscula.
    cadenas: [
      // Peluquería / estética / belleza
      'marco aldany', 'jean louis david', 'llongueras', 'carmen navarro', 'the body shop',
      'druni', 'primor', 'perfumerías', 'perfumerias', 'hedonai', 'centros único', 'centros unico', 'body factory',
      // Dental / salud / óptica
      'vitaldent', 'dentix', 'sanitas', 'adeslas', 'asisa', 'dkv seguros', 'quirón', 'quiron',
      'clínica baviera', 'clinica baviera', 'imed', 'general óptica', 'general optica',
      'multiópticas', 'multiopticas', 'alain afflelou', 'afflelou', 'opticalia', 'visionlab',
      'soloptical', 'federóptica', 'federoptica',
      // Restaurantes / comida rápida / café
      'mcdonald', 'burger king', 'telepizza', 'domino', 'pizza hut', 'kfc', 'starbucks', "foster",
      'vips', '100 montaditos', '100montaditos', 'cervecería 100', 'cerveceria 100', 'ginos',
      'la tagliatella', 'the good burger', 'goiko', 'five guys', 'rodilla', 'pans & company',
      'pans and company', 'subway', 'taco bell', 'dunkin', 'santagloria', 'granier', 'la mafia',
      'tim hortons', 'llaollao', 'muerde la pasta', 'lizarran', 'la sureña', 'la surena',
      // Gimnasios
      'mcfit', 'basic-fit', 'basic fit', 'vivagym', 'anytime fitness', 'synergym', 'altafit',
      'viding', 'fitness park', 'brooklyn fitboxing', 'fitboxing', 'curves', 'metropolitan',
      'go fit', 'go-fit', 'infinit fitness',
      // Supermercados / retail / hogar
      'mercadona', 'carrefour', 'lidl', 'aldi', 'consum', 'eroski', 'alcampo',
      'el corte inglés', 'el corte ingles', 'hipercor', 'decathlon', 'media markt', 'mediamarkt',
      'worten', 'fnac', 'leroy merlin', 'ikea', 'conforama', 'jysk', 'kiwoko', 'tiendanimal',
      'bricomart', 'bricodepot', 'bricodepôt',
      // Telefonía
      'movistar', 'vodafone', 'orange', 'yoigo', 'phone house', 'masmovil', 'masmóvil', 'k-tuin',
      // Moda / calzado
      'zara', 'mango', 'pull&bear', 'pull & bear', 'bershka', 'stradivarius', 'springfield',
      'cortefiel', 'h&m', 'primark', 'kiabi', 'calzedonia', 'tezenis', "women'secret",
      'women secret', 'marypaz', 'merkal', 'foot locker', 'jd sports', 'décimas', 'decimas', 'sprinter',
      // Auto / talleres
      'norauto', 'feu vert', 'midas', 'aurgi', 'first stop', 'euromaster', 'confortauto',
      'rodi motor', 'carglass',
      // Inmobiliarias franquicia
      'tecnocasa', 'remax', 're/max', 'century 21', 'century21', 'engel & völkers',
      'engel & volkers', 'alfa inmobiliaria', 'donpiso', 'don piso', 'look & find', 'comprarcasa',
      // Academias / hoteles
      'kumon', 'helen doron', 'berlitz', 'vaughan', 'nh hoteles', 'meliá', 'barceló', 'barcelo',
      'holiday inn', 'ac hotels',
    ],
  },

  // Cuántas webs se analizan a la vez y tiempo máximo por web.
  ANALYZE_CONCURRENCY: 6,
  ANALYZE_TIMEOUT_MS: 12000,

  // Máximo de leads nuevos que se incorporan por búsqueda (puedes subirlo).
  MAX_NEW_PER_SEARCH: 80,

  // Reparte cada lead entre los 2 teléfonos del equipo (si SENDER.phone2 está puesto).
  // Cada negocio queda asignado siempre al mismo número → leads divididos 50/50.
  phoneFor(idStr) {
    const a = this.SENDER.phone;
    const b = this.SENDER.phone2;
    if (!b) return a;
    // FNV-1a: mezcla bien aunque los IDs se parezcan → reparto ~50/50.
    let h = 0x811c9dc5;
    const s = String(idStr || '');
    for (let i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = (h * 0x01000193) >>> 0;
    }
    return h % 1000 < 500 ? a : b;
  },

  // Nombre del comercial que FIRMA el mensaje, según a quién esté asignado el lead
  // (paralelo a phoneFor: mismo lead → mismo comercial → su nombre y su móvil).
  nameFor(idStr) {
    if (!this.SENDER.phone2) return this.SENDER.name;
    return this.phoneFor(idStr) === this.SENDER.phone2
      ? (this.SENDER.name2 || this.SENDER.name)
      : this.SENDER.name;
  },

  // Valida credenciales de acceso → devuelve { name, vendedor, admin } o null.
  // AUTH compartido = admin (ve todo). Cada USER = comercial atado a su vendedor.
  authUser(u, p) {
    if (this.AUTH && this.AUTH.pass && u === this.AUTH.user && p === this.AUTH.pass) {
      return { name: 'Admin', vendedor: null, admin: true };
    }
    const found = (this.USERS || []).find((x) => x.user === u && x.pass === p);
    return found ? { name: found.name, vendedor: found.vendedor || null, admin: Boolean(found.admin) } : null;
  },
};
