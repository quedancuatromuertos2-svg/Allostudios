// Análisis de la web de cada negocio + puntuación de oportunidad (0-100)
// + extracción de contactos reales (email, teléfono, WhatsApp, Instagram).
// Todo con peticiones HTTP normales: cero IA, cero coste.
const cfg = require('./config');
const { recommendServices } = require('./services');

async function fetchSite(url) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), cfg.ANALYZE_TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      signal: ctrl.signal,
      redirect: 'follow',
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml',
      },
    });
    const html = (await res.text()).slice(0, 400000);
    return { status: res.status, finalUrl: res.url || url, html };
  } finally {
    clearTimeout(timer);
  }
}

function inspectHtml(html) {
  const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
  const yearMatch = html.match(/(?:©|&copy;|&#169;|copyright)\s*(?:\d{4}\s*[-–]\s*)?((?:19|20)\d{2})/i);
  const year = yearMatch ? parseInt(yearMatch[1], 10) : null;
  return {
    title: titleMatch ? titleMatch[1].trim().slice(0, 120) : '',
    viewport: /<meta[^>]+name=["']viewport/i.test(html),
    metaDesc: /<meta[^>]+name=["']description/i.test(html),
    h1: /<h1[\s>]/i.test(html),
    instagram: /instagram\.com\//i.test(html),
    facebook: /facebook\.com\//i.test(html),
    booking: /reserva|pedir\s+cita|cita\s+online|book\s+now|booking/i.test(html),
    oldYear: year && year < new Date().getFullYear() - 1 ? year : null,
    freeBuilder: /wixsite\.com|wordpress\.com|webnode|jimdo|blogspot|\.wix\.com/i.test(html),
  };
}

// ---------- Extracción de contactos reales ----------

const BAD_EMAIL = /\.(png|jpe?g|gif|svg|webp|css|js)$|example\.|sentry|wixpress|@2x|@3x|schema\.org|your-?email|tu-?email|email@|noreply|no-reply/i;

function extractEmails(html) {
  const out = new Set();
  for (const m of html.matchAll(/mailto:([^"'?\s<>&]+)/gi)) {
    const e = m[1].toLowerCase().trim();
    if (!BAD_EMAIL.test(e) && e.includes('@')) out.add(e);
  }
  for (const m of html.matchAll(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,8}/g)) {
    const e = m[0].toLowerCase();
    if (!BAD_EMAIL.test(e)) out.add(e);
  }
  return [...out].slice(0, 3);
}

function extractPhones(html) {
  const out = new Set();
  // 1) Enlaces tel: y wa.me (la fuente más fiable)
  for (const m of html.matchAll(/(?:tel:|wa\.me\/|api\.whatsapp\.com\/send\?phone=)([+\d\s\-.()]{9,20})/gi)) {
    const d = m[1].replace(/[^\d]/g, '');
    const n = d.startsWith('34') ? d : d.length === 9 ? '34' + d : d;
    if (n.length === 11 && /^34[6789]/.test(n)) out.add(n);
  }
  // 2) Números españoles escritos en el texto (tras quitar separadores)
  const squashed = html.replace(/<[^>]*>/g, ' ').replace(/[\s.\-()]/g, '');
  for (const m of squashed.matchAll(/(?:0034|\+34)?([6789]\d{8})(?!\d)/g)) {
    const n = '34' + m[1];
    if (/^34[6789]/.test(n)) out.add(n);
  }
  return [...out].slice(0, 3);
}

function extractWhatsapp(html) {
  const m = html.match(/(?:wa\.me\/|api\.whatsapp\.com\/send\?phone=)(\d{9,15})/i);
  if (!m) return '';
  const d = m[1];
  return d.startsWith('34') ? d : d.length === 9 ? '34' + d : d;
}

function extractInstagram(html) {
  const SKIP = new Set(['p', 'reel', 'reels', 'explore', 'stories', 'accounts', 'share', 'tv']);
  for (const m of html.matchAll(/instagram\.com\/([a-zA-Z0-9_.]{2,30})/g)) {
    const handle = m[1].toLowerCase();
    if (!SKIP.has(handle)) return `https://instagram.com/${handle}`;
  }
  return '';
}

function findContactPage(html, baseUrl) {
  const m = html.match(/href=["']([^"']*(?:contact|contacto|contacta|contactanos|contáctanos)[^"']*)["']/i);
  if (!m) return '';
  try {
    return new URL(m[1], baseUrl).href;
  } catch {
    return '';
  }
}

async function extractContacts(html, finalUrl) {
  let emails = extractEmails(html);
  let phones = extractPhones(html);
  let whatsapp = extractWhatsapp(html);
  let instagram = extractInstagram(html);

  // Si falta algo, probamos su página de contacto (1 petición extra como mucho).
  if (!emails.length || !phones.length) {
    const contactUrl = findContactPage(html, finalUrl);
    if (contactUrl && contactUrl !== finalUrl) {
      try {
        const page = await fetchSite(contactUrl);
        if (!emails.length) emails = extractEmails(page.html);
        if (!phones.length) phones = extractPhones(page.html);
        if (!whatsapp) whatsapp = extractWhatsapp(page.html);
        if (!instagram) instagram = extractInstagram(page.html);
      } catch {
        /* la página de contacto no carga: seguimos con lo que hay */
      }
    }
  }
  return { emails, phones, whatsapp, instagram };
}

// ---------- Análisis y puntuación ----------

async function analyzeWebsite(url) {
  try {
    const { status, finalUrl, html } = await fetchSite(url);
    if (status >= 400) return { ok: false, broken: true, status };
    const info = inspectHtml(html);
    const contacts = await extractContacts(html, finalUrl);
    return { ok: true, status, https: finalUrl.startsWith('https://'), finalUrl, ...info, contacts };
  } catch (e) {
    return { ok: false, broken: true, error: e.name === 'AbortError' ? 'timeout' : e.message };
  }
}

// Sectores donde la reserva de cita online aporta mucho valor.
const BOOKING_SECTORS = new Set([
  'peluquerias', 'estetica', 'dentistas', 'fisios', 'clinicas', 'veterinarios', 'talleres',
  'masajes', 'podologos', 'psicologos', 'tatuajes', 'opticas',
]);

function guessEmail(website) {
  try {
    const host = new URL(website).hostname.replace(/^www\./, '');
    if (/wixsite|wordpress\.com|blogspot|facebook|instagram/i.test(host)) return '';
    return `info@${host}`;
  } catch {
    return '';
  }
}

function score(lead, web) {
  const problems = [];
  let score;

  if (!lead.website) {
    score = 88;
    problems.push(lead.instagram ? 'solo os encontré en Instagram, sin web propia' : 'no encontré vuestra página web por ningún lado');
    if (lead.phone) score += 4;
  } else if (!web || web.broken) {
    score = 92;
    problems.push('vuestra web no carga o da error');
  } else {
    score = 25;
    if (!web.https) { score += 18; problems.push("vuestra web sale como 'No segura' en el navegador (sin candado)"); }
    if (!web.viewport) { score += 22; problems.push('vuestra web no se adapta bien al móvil'); }
    if (web.oldYear) { score += 12; problems.push(`vuestra web lleva sin actualizarse desde ${web.oldYear}`); }
    if (web.freeBuilder) { score += 10; problems.push('vuestra web está hecha con un constructor gratuito'); }
    if (!web.metaDesc) { score += 8; problems.push('vuestra web está mal optimizada para salir en Google'); }
    if (!web.h1) { score += 5; problems.push('la estructura de la web es pobre para SEO'); }
    if (BOOKING_SECTORS.has(lead.sector) && !web.booking) { score += 8; problems.push('no se puede reservar cita online en vuestra web'); }
    if (!web.instagram && !web.facebook) { score += 4; problems.push('la web no enlaza vuestras redes sociales'); }
    if (problems.length === 0) problems.push('la web está bastante bien — oportunidad baja');
  }

  score = Math.min(100, score);
  const tier = score >= 70 ? 'A' : score >= 45 ? 'B' : 'C';
  return { score, tier, problems, hook: problems[0] };
}

async function analyzeLead(lead) {
  const web = lead.website ? await analyzeWebsite(lead.website) : null;
  const s = score(lead, web);
  const contacts = (web && web.contacts) || { emails: [], phones: [], whatsapp: '', instagram: '' };
  const webClean = web ? { ...web, contacts: undefined } : null;

  const result = {
    web: webClean,
    webScore: s.score,        // oportunidad SOLO de web (referencia)
    problems: s.problems,
    email: contacts.emails[0] || '',
    guessedEmail: lead.website ? guessEmail(lead.website) : '',
  };

  // Enriquecimiento: si OSM no tenía teléfono/instagram, usamos el de su web.
  if (!lead.phone && (contacts.whatsapp || contacts.phones[0])) {
    result.phone = contacts.whatsapp || contacts.phones[0];
    result.phoneSource = 'web';
  }
  if (contacts.whatsapp) result.hasWhatsapp = true;
  const instagram = !lead.instagram && contacts.instagram ? contacts.instagram : lead.instagram;
  if (!lead.instagram && contacts.instagram) result.instagram = contacts.instagram;

  // Servicios vendibles aunque YA tenga buena web (redes, SEO, reseñas, reservas, ads...).
  const rec = recommendServices({ ...lead, ...result, instagram, web: webClean }, webClean);
  result.bestService = rec.bestService;
  result.serviceScore = rec.serviceScore;

  // Score global = la MEJOR oportunidad (web O servicio). Así no enterramos negocios con web.
  result.score = Math.min(100, Math.max(s.score, rec.serviceScore));
  result.tier = result.score >= 70 ? 'A' : result.score >= 45 ? 'B' : 'C';
  result.hook = (rec.services[0] && rec.services[0].reason) || s.hook;

  return result;
}

module.exports = { analyzeLead };
