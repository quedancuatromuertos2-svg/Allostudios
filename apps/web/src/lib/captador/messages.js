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
      price: `0 € de entrada y desde ${eur(P.monthly)}/mes con todo incluido (hosting, cambios y soporte); o el Pack Estándar a ${eur(cfg.PACKS.estandar.monthly)}/mes con Google y reseñas`,
    },
    seo: {
      role: 'ayudo a negocios de Valencia a salir los primeros en Google',
      value: `que cuando alguien busque "${lc(lead.sectorLabel)} en Valencia" os encuentre a vosotros`,
      proofWord: 'mini auditoría',
      price: `${eur(P.monthly)}/mes de trabajo continuo, sin entrada ni permanencia; o dentro de cualquier pack`,
    },
    resenas: {
      role: 'ayudo a negocios locales a conseguir más reseñas de 5★ en Google',
      value: 'subir en el mapa de Google para que os encuentren más clientes de la zona',
      proofWord: 'ejemplo',
      price: `${eur(P.monthly)}/mes, sin permanencia`,
    },
    chatbot: {
      role: 'monto asistentes de IA para WhatsApp que atienden a los clientes 24/7',
      value: 'no perder nunca a quien escribe de noche o en fin de semana: responde, resuelve dudas y agenda la cita',
      proofWord: 'demo',
      price: `${eur(P.monthly)}/mes suelto, o dentro del Pack Pro (${eur(cfg.PACKS.pro.monthly)}/mes con web premium, Google y reseñas)`,
    },
    aeo: {
      role: 'hago que ChatGPT y Perplexity recomienden negocios locales de Valencia',
      value: 'que cuando alguien le pregunte a la IA por un negocio como el vuestro en la zona, salga el vuestro',
      proofWord: 'informe de visibilidad en IA',
      price: `${eur(P.monthly)}/mes, sin permanencia; se añade a cualquier pack`,
    },
    ads: {
      role: 'gestiono campañas de Instagram y Google Ads para negocios locales',
      value: 'llenar la agenda con clientes de Valencia en pocas semanas',
      proofWord: 'propuesta',
      price: `${eur(P.monthly)}/mes de gestión + la inversión en anuncios que decidáis; o dentro del Pack Max (${eur(cfg.PACKS.max.monthly)}/mes con todo)`,
    },
  };
  return { ...P, ...(map[key] || map.web) };
}

function buildMessages(lead, service) {
  const S = cfg.SENDER;
  const senderPhone = cfg.phoneFor(lead.id);
  // Escalera de 3 niveles (anclaje de precios). Fallback por si config no la trae.
  const T = cfg.TIERS || {
    arranque: { setup: 0, monthly: 99, pitch: 'la demo afinada y online en 7 días' },
    premium: { setup: 0, monthly: 149, pitch: 'animaciones avanzadas y reseñas integradas' },
    cine: { setup: 0, monthly: 249, pitch: 'efecto Apple con tu producto' },
  };
  const PK = cfg.PACKS || {
    estandar: { monthly: 199, pitch: 'web + Google + reseñas' },
    pro:         { monthly: 349, pitch: 'web premium + Google + reseñas + asistente IA en WhatsApp' },
    max: { monthly: 499, pitch: 'todo + campañas de Meta y Google Ads' },
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
    ? `¡Genial! 🙌 Funciona como una suscripción: 0 € de entrada, una cuota al mes y 12 meses; después, mes a mes. Tres packs:\n\n` +
      `🥉 ESTÁNDAR — ${PK.estandar.monthly} €/mes: ${PK.estandar.pitch}.\n` +
      `🥈 PRO — ${PK.pro.monthly} €/mes: ${PK.pro.pitch}.\n` +
      `🥇 MAX — ${PK.max.monthly} €/mes: ${PK.max.pitch}.\n\n` +
      `Si solo queréis la web: desde ${T.arranque.monthly} €/mes con hosting, cambios y soporte incluidos. Y si pagáis el año por adelantado, dos meses gratis.\n` +
      `Esta semana me caben 2 proyectos. ¿Hablamos 10 minutos? ¿Mañana a las 10:30 o mejor a las 17:00?`
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
    `4) SI PREGUNTA PRECIO:\n"${isWeb ? `Sin entrada: una cuota al mes. La web sola desde ${T.arranque.monthly} €/mes con todo incluido, o el pack con Google y reseñas por ${PK.estandar.monthly} €/mes` : c.price}. Pero primero vea${isWeb ? ' la demo' : 'lo'}, que verlo es gratis y sin compromiso."\n\n` +
    `5) CIERRE SIEMPRE: apunta el WhatsApp → envía la demo → marca el lead como Interesado.`;

  // ── OBJECIONES: respuestas rápidas (copiar la que toque) ──
  const objeciones =
    `«YA TENEMOS WEB»\n→ "La vi, sí. Justo por eso os escribo: [si es vieja] una web que no sale en Google o se ve mal en el móvil os quita clientes cada día. Os paso la demo, la comparáis en 30 segundos y me decís."\n\n` +
    `«¿CUÁNTO CUESTA?»\n→ "${isWeb ? `0 € de entrada y una cuota al mes: la web sola desde ${T.arranque.monthly} €/mes con todo incluido, o el Pack Estándar por ${PK.estandar.monthly} €/mes con Google y reseñas` : c.price}. Sale a unos ${Math.round((isWeb ? PK.estandar.monthly : (c.monthly || PK.estandar.monthly)) / 30)} € al día y trabaja para vosotros 24/7. Y ver la ${c.proofWord} es gratis."\n\n` +
    `«ES CARO»\n→ "Con que os traiga UN cliente al mes ya está pagado. Y no ponéis nada por adelantado: el trabajo inicial lo hacemos nosotros y lo recuperamos con la cuota. Por eso hay 12 meses; luego es mes a mes."\n\n` +
    `«¿PERMANENCIA?»\n→ "12 meses, porque la entrada es 0 €: la web y la puesta en marcha las pagamos nosotros el primer mes. Pasado el año, seguís mes a mes y os vais cuando queráis. Y si pagáis el año por adelantado, dos meses gratis."\n\n` +
    `«NO TENGO TIEMPO»\n→ "Por eso lo hice yo antes de escribirte: ya está hecho. Verlo son 30 segundos, te lo paso y lo miras cuando puedas. Tú solo me dices qué cambiarías."\n\n` +
    `«MÁNDAME INFO POR EMAIL»\n→ "Te lo mando, pero mejor por WhatsApp: es UN enlace y lo ves en 30 segundos. ¿Este número me vale?"\n\n` +
    `«YA TENEMOS A ALGUIEN»\n→ "Perfecto, no vengo a pisar a nadie. Guárdate mi contacto por si un día necesitáis algo puntual (web, reseñas, asistente de WhatsApp): ${senderPhone}. ¡Suerte! 🙌"`;

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
