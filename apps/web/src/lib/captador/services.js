// Motor de oportunidades: qué servicios encajan con cada negocio, aunque YA tenga web.
// Convierte cada lead en vendible (web, redes, SEO, reseñas, reservas, chatbot, ads, automatización).
// Cero IA, cero coste: solo reglas sobre los datos que ya tenemos.
const cfg = require('./config');

const BOOKING = new Set(['peluquerias', 'estetica', 'dentistas', 'fisios', 'clinicas', 'veterinarios', 'talleres', 'masajes', 'podologos', 'psicologos', 'tatuajes', 'opticas', 'autoescuelas']);
const VISUAL = new Set(['restaurantes', 'cafeterias', 'peluquerias', 'estetica', 'floristerias', 'panaderias', 'tatuajes', 'fotografos', 'joyerias', 'inmobiliarias', 'mascotas']);
const ADMIN = new Set(['inmobiliarias', 'abogados', 'clinicas', 'dentistas', 'talleres', 'autoescuelas', 'fisios', 'opticas']);

// Devuelve { services:[{key,label,emoji,setup,monthly,fit,reason}], bestService, serviceScore }
function recommendServices(lead, web) {
  web = web || lead.web || null;
  const sector = lead.sector;
  const out = [];

  // --- WEB (nueva o rediseño) ---
  if (!lead.website) {
    out.push({ key: 'web', fit: 95, reason: 'no tenéis web propia: cuando os buscan en Google acaban en la competencia' });
  } else if (web && web.broken) {
    out.push({ key: 'web', fit: 96, reason: 'vuestra web no carga o da error' });
  } else if (web && (!web.https || !web.viewport || web.oldYear || web.freeBuilder)) {
    const reason = !web.viewport ? 'vuestra web no se ve bien en el móvil'
      : !web.https ? "vuestra web sale como 'No segura' en el navegador"
      : web.oldYear ? `vuestra web no se actualiza desde ${web.oldYear}`
      : 'vuestra web está hecha con un constructor gratuito';
    out.push({ key: 'web', fit: 70, reason });
  }

  // --- REDES (gestión de Instagram) --- encaja AUNQUE tengan buena web
  if (!lead.instagram) {
    out.push({ key: 'redes', fit: VISUAL.has(sector) ? 86 : 64, reason: 'no tenéis un Instagram activo y vuestra competencia publica cada semana' });
  } else {
    out.push({ key: 'redes', fit: VISUAL.has(sector) ? 73 : 52, reason: 'tenéis Instagram pero sin un sistema de contenido constante que traiga clientes' });
  }

  // --- SEO ---
  if (lead.website && web && (!web.metaDesc || !web.h1)) {
    out.push({ key: 'seo', fit: 69, reason: 'vuestra web está mal optimizada para salir en Google (SEO)' });
  } else if (lead.website) {
    out.push({ key: 'seo', fit: 46, reason: 'se puede mejorar vuestra posición en Google y captar más búsquedas' });
  }

  // --- RESERVA DE CITA ONLINE ---
  if (BOOKING.has(sector) && (!web || !web.booking)) {
    out.push({ key: 'reservas', fit: 76, reason: 'no se puede pedir cita online: perdéis clientes que os escriben fuera de horario' });
  }

  // --- RESEÑAS / REPUTACIÓN (todo negocio local) ---
  out.push({ key: 'resenas', fit: 56, reason: 'un sistema para conseguir más reseñas de 5★ en Google os subiría en el mapa' });

  // --- CHATBOT WhatsApp ---
  if (BOOKING.has(sector) || VISUAL.has(sector)) {
    out.push({ key: 'chatbot', fit: 49, reason: 'un asistente por WhatsApp 24/7 evita que perdáis a quien escribe de noche o en fin de semana' });
  }

  // --- ADS (solo si ya tienen web decente a la que enviar tráfico) ---
  if (lead.website && web && !web.broken) {
    out.push({ key: 'ads', fit: 43, reason: 'con campañas en Instagram/Google podríais llenar la agenda en semanas' });
  }

  // --- AUTOMATIZACIÓN ---
  if (ADMIN.has(sector)) {
    out.push({ key: 'automatizacion', fit: 41, reason: 'automatizar recordatorios, presupuestos y seguimiento os ahorra horas de gestión' });
  }

  const services = out
    .map((s) => ({ ...s, ...(cfg.SERVICES[s.key] || { label: s.key, emoji: '•', setup: 0, monthly: 0 }) }))
    .sort((a, b) => b.fit - a.fit);

  const best = services[0];
  return { services, bestService: best ? best.key : 'web', serviceScore: best ? Math.round(best.fit) : 0 };
}

module.exports = { recommendServices };
