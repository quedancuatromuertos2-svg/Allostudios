// Mensajes de venta personalizados por lead — por SERVICIO y dirigidos al DUEÑO.
// Plantillas, sin IA. Mantiene las claves de salida antiguas y añade:
//   demoEnvio  → mensaje con el enlace de la demo (se manda CUANDO RESPONDEN)
//   callScript → guion de llamada para números fijos
//   objeciones → respuestas rápidas a las 6 objeciones típicas
//
// REGLA DE ORO (anti-baneo + más respuestas): el PRIMER WhatsApp es corto,
// suena humano y NO lleva enlace. El enlace va en demoEnvio (tras respuesta)
// o en el seguimiento del día 3. WhatsApp banea números nuevos que mandan
// muchos mensajes iguales con link a desconocidos.
const cfg = require('./config');
const { recommendServices } = require('./services');

function lc(s) {
  return s ? s.charAt(0).toLowerCase() + s.slice(1) : '';
}

// Hash estable por lead → elige variante de mensaje (rotación anti-spam + A/B).
function variantOf(id, n) {
  let h = 0x811c9dc5;
  const s = String(id || '');
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = (h * 0x01000193) >>> 0;
  }
  return h % n;
}

// "Avenida Tirso de Molina, 3" → "Avenida Tirso de Molina" (para sonar local).
function zonaDe(lead) {
  const a = (lead.address || '').split(',')[0].trim();
  return a || 'la zona';
}

// Copy específico de cada servicio: rol con el que te presentas, propuesta, prueba y cierre.
function serviceCopy(key, lead) {
  const P = cfg.SERVICES[key] || cfg.SERVICES.web;
  const eur = (n) => `${n} €`;
  const map = {
    web: {
      role: 'diseñador web aquí en Valencia',
      value: 'te dejo una web nueva funcionando esta misma semana',
      proofWord: 'demo',
      price: `${eur(P.setup)} la web completa + ${eur(cfg.PRICES.monthly)}/mes (hosting, cambios y soporte). Sin permanencia`,
    },
    redes: {
      role: 'llevo las redes sociales de negocios locales aquí en Valencia',
      value: 'contenido profesional en vuestro Instagram cada semana, sin que toquéis nada',
      proofWord: 'ejemplo de contenido',
      price: `desde ${eur(P.monthly)}/mes, contenido + publicación incluidos. Sin permanencia`,
    },
    seo: {
      role: 'ayudo a negocios de Valencia a salir los primeros en Google',
      value: `que cuando alguien busque "${lc(lead.sectorLabel)} en Valencia" os encuentre a vosotros`,
      proofWord: 'mini auditoría',
      price: `auditoría + plan inicial ${eur(P.setup)}, y luego ${eur(P.monthly)}/mes de trabajo continuo`,
    },
    reservas: {
      role: 'monto sistemas de reserva de cita online para negocios como el vuestro',
      value: 'que vuestros clientes pidan cita solos, 24/7, sin llamadas ni mensajes',
      proofWord: 'ejemplo',
      price: `${eur(P.setup)} la instalación, listo en pocos días`,
    },
    resenas: {
      role: 'ayudo a negocios locales a conseguir más reseñas de 5★ en Google',
      value: 'subir en el mapa de Google para que os encuentren más clientes de la zona',
      proofWord: 'ejemplo',
      price: `${eur(P.monthly)}/mes, sin permanencia`,
    },
    chatbot: {
      role: 'monto asistentes de WhatsApp que atienden a los clientes 24/7',
      value: 'no perder nunca a quien escribe de noche o en fin de semana',
      proofWord: 'demo',
      price: `${eur(P.setup)} + ${eur(P.monthly)}/mes`,
    },
    ads: {
      role: 'gestiono campañas de Instagram y Google Ads para negocios locales',
      value: 'llenar la agenda con clientes de Valencia en pocas semanas',
      proofWord: 'propuesta',
      price: `${eur(P.monthly)}/mes de gestión + la inversión en anuncios que decidáis`,
    },
    automatizacion: {
      role: 'automatizo tareas repetitivas (recordatorios, presupuestos, seguimiento) para negocios',
      value: 'ahorraros horas de gestión cada semana con procesos automáticos',
      proofWord: 'ejemplo',
      price: `desde ${eur(P.setup)}, según lo que queramos automatizar`,
    },
  };
  return { ...P, ...(map[key] || map.web) };
}

function buildMessages(lead, service) {
  const S = cfg.SENDER;
  const senderPhone = cfg.phoneFor(lead.id);
  // Escalera de 3 niveles (anclaje de precios). Fallback por si config no la trae.
  const T = cfg.TIERS || {
    arranque: { setup: 499, monthly: 49, pitch: 'la demo afinada y online en 7 días' },
    premium: { setup: 790, monthly: 49, pitch: 'animaciones avanzadas y reseñas integradas' },
    cine: { setup: 1490, monthly: 79, pitch: 'efecto Apple con tu producto' },
  };
  const key = service || lead.bestService || 'web';
  const c = serviceCopy(key, lead);
  const nombre = lead.name;
  const zona = zonaDe(lead);
  // Nombre del comercial asignado a ESTE lead (Ángel o Fran), no siempre el mismo.
  const senderName = (typeof cfg.nameFor === 'function' ? cfg.nameFor(lead.id) : S.name) || S.name;
  const firstName = (senderName || '').split(' ')[0] || senderName; // "Fran de Allostudios" → "Fran"

  // El gancho debe ser el del SERVICIO elegido (no el global), para que el mensaje sea coherente.
  let hookText = lead.hook;
  try {
    const match = recommendServices(lead, lead.web).services.find((s) => s.key === key);
    if (match) hookText = match.reason;
  } catch { /* usamos lead.hook */ }
  const hook = lc(hookText || 'vuestra presencia online se puede mejorar mucho');

  // Saludo al dueño por su nombre si lo hemos encontrado.
  const ownerFirst = lead.owner && lead.owner.name ? lead.owner.name.trim().split(/\s+/)[0] : '';
  const hi = ownerFirst ? `Hola ${ownerFirst} 👋` : 'Hola 👋';
  const hiEmail = ownerFirst ? `Hola ${ownerFirst},` : 'Hola,';

  const demo = lead.demoUrl || '';
  const isWeb = key === 'web';
  const v = variantOf(lead.id, 3);

  // ── PRIMER CONTACTO: corto, humano, SIN enlace, termina en pregunta fácil ──
  let whatsapp;
  if (isWeb) {
    const variantes = [
      `${hi} Soy ${firstName}, ${c.role}. Quise ver la web de ${nombre} y ${hook}. Os he preparado una demo de cómo podría quedar — ya está hecha, verla es gratis. ¿Te la paso por aquí?`,
      `${hi} ¿Hablo con alguien de ${nombre}? Soy ${firstName}, diseñador web de Valencia. Me fijé en que ${hook}, así que me adelanté y os monté una demo de vuestra web. ¿Te la enseño? Ver no cuesta nada 🙂`,
      `${hi} Soy ${firstName}, ${c.role}. Pasé por ${zona} buscando ${lc(lead.sectorLabel)} y vi que ${hook}. Os hice una demo de cómo quedaría vuestra web (en serio, ya está hecha). ¿Te la paso y me dices qué te parece?`,
    ];
    whatsapp = variantes[v];
  } else {
    const variantes = [
      `${hi} Soy ${firstName}, ${c.role}. Vi ${nombre} y me fijé en que ${hook}. Me dedico justo a ${c.value}. ¿Te enseño un ${c.proofWord} hecho para vosotros? Sin compromiso.`,
      `${hi} ¿Hablo con alguien de ${nombre}? Soy ${firstName}, de AlloStudios (Valencia). Me fijé en que ${hook} y eso tiene fácil solución: ${c.value}. ¿Te cuento cómo en 2 líneas?`,
      `${hi} Soy ${firstName}, ${c.role}. ${nombre} me salió buscando ${lc(lead.sectorLabel)} por ${zona} y vi que ${hook}. Puedo prepararos un ${c.proofWord} esta semana. ¿Te lo paso por aquí?`,
    ];
    whatsapp = variantes[v];
  }

  // ── CUANDO RESPONDAN: entregar la demo/prueba con el enlace ──
  const demoEnvio = isWeb
    ? (demo
        ? `¡Aquí la tienes! 👇\n${demo}\n\nÁbrela desde el móvil mismo. Está hecha con vuestros datos públicos — fotos, textos y colores se cambian en un día por lo que me digáis.\n\nSi os gusta, la dejo funcionando esta misma semana: ${c.price}.\n\nY si quieres algo de otra liga, hay dos niveles más: ⭐ Premium ${T.premium.setup} € y 🎬 Cinematográfica desde ${T.cine.setup} € (tu producto despiezándose al hacer scroll, estilo Apple — pídeme un ejemplo y te lo enseño).\n\nVer la demo no compromete a nada 🙂`
        : `Te la paso en cuanto la termine de ajustar (hoy mismo). Mientras, dime: ¿tenéis fotos del local o las saco yo de Google/Instagram?`)
    : `Genial 🙌 Te preparo un ${c.proofWord} concreto para ${nombre} y te lo paso por aquí hoy o mañana. Precio para que lo tengas: ${c.price}. ¿Hay algo que os importe especialmente (más clientes, más reseñas, quitaros trabajo de encima)?`;

  // ── SEGUIMIENTO día 3: aquí SÍ va el enlace (los que leen sin responder pueden hacer clic) ──
  const followup = isWeb && demo
    ? `${hi} Te escribí hace unos días por la web de ${nombre}. Como no sé si lo viste, te dejo directamente la demo que os preparé: ${demo} — se abre desde el móvil en 30 segundos. Si no os interesa, con un "no, gracias" me vale y no molesto más 🙂`
    : `${hi} Soy ${firstName}, te escribí hace unos días por lo de ${nombre} (${lc(c.label)}). ¿Pudiste verlo? Si no es buen momento dímelo y no insisto más 🙂`;

  const breakup =
    `Hola, soy ${firstName} (lo de ${nombre}). Veo que no es el momento, así que no te escribo más. ` +
    `Te dejo mi contacto por si algún día queréis daros un empujón online: ${senderPhone}. ¡Mucha suerte! 👋`;

  // ── INTERESADO: escalera de 3 niveles (web) + razón del precio + cita concreta ──
  const interesado = isWeb
    ? `¡Genial! 🙌 Tienes tres niveles (todos sin permanencia, con hosting, cambios y soporte incluidos):\n\n` +
      `🥉 ARRANQUE — ${T.arranque.setup} € + ${T.arranque.monthly} €/mes: ${T.arranque.pitch}.\n` +
      `🥈 PREMIUM — ${T.premium.setup} € + ${T.premium.monthly} €/mes: ${T.premium.pitch}.\n` +
      `🥇 CINEMATOGRÁFICA — desde ${T.cine.setup} € + ${T.cine.monthly} €/mes: ${T.cine.pitch}.\n\n` +
      `¿Por qué estos precios? Estamos construyendo la cartera de lanzamiento en Valencia: los primeros 20 negocios entran así porque vuestras reseñas nos valen tanto como el dinero. Esta semana me caben 2 proyectos.\n` +
      `¿Hablamos 10 minutos? ¿Mañana a las 10:30 o mejor a las 17:00?`
    : `¡Genial! 🙌 Te lo cuento simple:\n` +
      `1) Te enseño un ${c.proofWord} concreto para ${nombre}.\n2) Si te encaja, lo ponemos en marcha en pocos días.\n` +
      `3) ${c.label}: ${c.price}.\n\n` +
      `Esta semana me caben 2 proyectos nuevos (los hago yo personalmente, no una plantilla).\n` +
      `¿Hablamos 10 minutos? ¿Te viene mejor mañana sobre las 10:30 o por la tarde a las 17:00?`;

  const demoFollowup =
    `${hi} ¿Pudiste ver ${isWeb ? `la demo de la web de ${nombre}` : `lo que te pasé de ${nombre}`}?${isWeb && demo ? ` Te la dejo otra vez: ${demo}` : ''} ` +
    `Si hay algo que cambiarías dímelo y te lo enseño adaptado — en un día lo tienes. 🙂`;

  // ── GUION DE LLAMADA (fijos): el objetivo NO es vender, es conseguir su WhatsApp ──
  const callScript =
    `OBJETIVO: conseguir su WhatsApp (o al responsable). NO vendas por teléfono.\n` +
    `────────────────────────────────\n` +
    `1) "Hola, buenos días, ¿${nombre}? Soy ${firstName}, diseñador web aquí en Valencia. ¿Está el dueño/la dueña? Es medio minuto."\n\n` +
    `2) SI COGE RECEPCIÓN / NO ESTÁ:\n"Nada urgente: ${isWeb ? `he preparado una demo de página web para ${nombre} — ya está hecha, solo quiero enseñarla` : `tengo una propuesta de ${lc(c.label)} para ${nombre}`}. ¿Me da un WhatsApp o email donde mandarla? ¿O a qué hora encuentro al responsable?"\n\n` +
    `3) SI SE PONE EL DUEÑO:\n"Le llamo porque ${hook}. ${isWeb ? `Le he preparado una demo de cómo quedaría su web — ya está hecha, verla es gratis` : `Me dedico a ${c.value}`}. ¿Le mando el enlace por WhatsApp? ¿A qué número?"\n\n` +
    `4) SI PREGUNTA PRECIO:\n"${isWeb ? `Tres niveles: desde ${T.arranque.setup} € la web completa con ${T.arranque.monthly} €/mes todo incluido, hasta la Cinematográfica con animaciones estilo Apple. Precio de lanzamiento de cartera` : c.price}. Pero primero vea${isWeb ? ' la demo' : 'lo'}, que verlo es gratis y sin compromiso."\n\n` +
    `5) CIERRE SIEMPRE: apunta el WhatsApp → envía la demo → marca el lead como Interesado.`;

  // ── OBJECIONES: respuestas rápidas (copiar la que toque) ──
  const objeciones =
    `«YA TENEMOS WEB»\n→ "La vi, sí. Justo por eso os escribo: [si es vieja] una web que no sale en Google o se ve mal en el móvil os quita clientes cada día. Os paso la demo, la comparáis en 30 segundos y me decís."\n\n` +
    `«¿CUÁNTO CUESTA?»\n→ "${isWeb ? `Tres niveles: Arranque ${T.arranque.setup} € + ${T.arranque.monthly} €/mes todo incluido, Premium ${T.premium.setup} €, y Cinematográfica desde ${T.cine.setup} € con animaciones estilo Apple` : c.price}. Sale a menos de 2 € al día y trabaja para vosotros 24/7. Y ver la ${c.proofWord} es gratis."\n\n` +
    `«ES CARO»\n→ "Con que os traiga UN cliente al mes ya está pagada. Es precio de lanzamiento: estamos construyendo la cartera de los primeros 20 negocios de Valencia — vuestras reseñas nos valen tanto como el dinero. No será para siempre."\n\n` +
    `«NO TENGO TIEMPO»\n→ "Por eso lo hice yo antes de escribirte: ya está hecho. Verlo son 30 segundos, te lo paso y lo miras cuando puedas. Tú solo me dices qué cambiarías."\n\n` +
    `«MÁNDAME INFO POR EMAIL»\n→ "Te lo mando, pero mejor por WhatsApp: es UN enlace y lo ves en 30 segundos. ¿Este número me vale?"\n\n` +
    `«YA TENEMOS A ALGUIEN»\n→ "Perfecto, no vengo a pisar a nadie. Guárdate mi contacto por si un día necesitáis algo puntual (web, reseñas, Instagram): ${senderPhone}. ¡Suerte! 🙌"`;

  const emailSubject = isWeb
    ? `${nombre}: os he preparado una demo de web (verla son 30 seg)`
    : `${c.emoji} ${c.label} para ${nombre}`;

  const emailBody = `${hiEmail}

Soy ${senderName}, ${c.role}. Estaba revisando ${lc(lead.sectorLabel)} de Valencia y al llegar a ${nombre} me fijé en una cosa: ${hook}.

Me dedico justo a ${c.value}.

${isWeb
  ? (demo ? `He preparado una demo real de cómo quedaría vuestra web. Podéis verla aquí (también desde el móvil):\n\n${demo}` : 'He preparado una demo real. Si me respondéis os la envío y la veis en 30 segundos.')
  : `Si os interesa, os preparo un ${c.proofWord} concreto para ${nombre} y lo vemos sin compromiso.`}

Precio: ${c.price}.

Si os encaja, esta misma semana lo dejamos funcionando.

Un saludo,
${senderName}
${senderPhone} · ${S.email}

--
Te escribo como contacto profesional público de ${nombre} (interés legítimo, art. 6.1.f RGPD). Si no quieres recibir más correos míos, responde "BAJA" y te elimino al momento.`;

  return {
    service: key,
    serviceLabel: `${c.emoji} ${c.label}`,
    whatsapp,
    demoEnvio,
    emailSubject,
    emailBody,
    followup,
    breakup,
    interesado,
    demoFollowup,
    callScript,
    objeciones,
  };
}

module.exports = { buildMessages };
