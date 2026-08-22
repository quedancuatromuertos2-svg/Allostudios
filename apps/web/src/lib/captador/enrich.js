// Buscador de DUEÑO/responsable para prospección directa. Cero coste.
// Fuente nº1: la página de Aviso Legal / Privacidad (la ley LSSI-CE obliga a publicar
// el titular y su NIF/CIF). Fuente nº2: tag operator de OSM. Fuente nº3: enlaces de
// búsqueda manual listos para un click (Google, LinkedIn, Maps, eInforma).
const cfg = require('./config');

async function fetchHtml(url, timeoutMs = 10000) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      signal: ctrl.signal,
      redirect: 'follow',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml',
      },
    });
    return { status: res.status, finalUrl: res.url || url, html: (await res.text()).slice(0, 300000) };
  } finally {
    clearTimeout(timer);
  }
}

const NAME = '[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+(?:\\s+(?:de |del |la |los |las )?[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+){1,3}';

function rankLegal(u) {
  if (/aviso[-_\s]?legal/i.test(u)) return 4;
  if (/privac/i.test(u)) return 3;
  if (/(qui[eé]nes|nosotros|about|equipo|somos)/i.test(u)) return 2;
  if (/(legal|t[eé]rminos|condiciones)/i.test(u)) return 1;
  return 0;
}

function findLegalLinks(html, baseUrl) {
  const HINT = /(aviso[-_\s]?legal|privac|pol[ií]tica|t[eé]rminos|condiciones|qui[eé]nes[-_\s]?somos|sobre[-_\s]?nosotros|nosotros|about|equipo)/i;
  const set = new Set();
  for (const m of html.matchAll(/href=["']([^"'#]+)["']/gi)) {
    if (HINT.test(m[1])) {
      try { set.add(new URL(m[1], baseUrl).href); } catch { /* link roto */ }
    }
  }
  return [...set].sort((a, b) => rankLegal(b) - rankLegal(a)).slice(0, 3);
}

// Palabras que delatan que NO es un nombre propio sino una frase legal.
const STOP_WORDS = /\b(tratamiento|datos|fichero|responsable|titular|cl[ií]nica|empresa|sociedad|sitio|web|p[aá]gina|presente|aviso|legal|pol[ií]tica|cookies|usuario|servicio|condiciones|protecci[oó]n|reglamento|comercial|raz[oó]n|social|domicilio|direcci[oó]n|correo|tel[eé]fono|email|finalidad)\b/i;

function cleanName(s) {
  const n = s.trim().replace(/\s+/g, ' ').replace(/[.,;:]+$/, '');
  if (!/^[A-ZÁÉÍÓÚÑ]/.test(n)) return '';          // debe empezar por nombre propio (mayúscula)
  if (STOP_WORDS.test(n)) return '';                // descarta frases legales
  const words = n.split(' ').filter(Boolean);
  const caps = words.filter((w) => /^[A-ZÁÉÍÓÚÑ]/.test(w)).length;
  if (words.length < 2 || words.length > 5 || caps < 2) return '';  // mín. 2 palabras, mayoría con mayúscula
  // Si viene TODO en mayúsculas, lo pasamos a Capitalización normal.
  return n === n.toUpperCase() ? n.replace(/\S+/g, (w) => w.charAt(0) + w.slice(1).toLowerCase()) : n;
}

const COMPANY_SUFFIX = /\b(S\.?L\.?U?|S\.?A\.?U?|C\.?B|S\.?C\.?P?|S\.?L\.?L)\.?\b/i;

function extractOwner(html) {
  const t = html.replace(/<[^>]*>/g, ' ').replace(/&nbsp;|&aacute;|&oacute;/gi, ' ').replace(/\s+/g, ' ');
  const res = { name: '', company: '', nif: '', email: '' };
  let m;

  const labelled = new RegExp(`(?:Titular|Responsable(?:\\s+del\\s+(?:fichero|tratamiento|sitio|web|datos))?|Raz[oó]n\\s+social|a\\s+nombre\\s+de|propietari[oa]|administrad[oa]r)\\s*(?:es|:|\\-|–)?\\s*["']?(${NAME})`, 'i');
  if ((m = t.match(labelled))) res.name = cleanName(m[1]);

  if (!res.name && (m = t.match(new RegExp(`(?:D\\.|D[ñn]a\\.?|Don|Doña)\\s+(${NAME})`)))) res.name = cleanName(m[1]);

  // Nombre del titular en MAYÚSCULAS tras la etiqueta (formato típico de autónomos).
  if (!res.name) {
    const CAPS = '[A-ZÁÉÍÓÚÑ]{2,}(?:\\s+[A-ZÁÉÍÓÚÑ]{2,}){1,3}';
    const labCaps = new RegExp(`(?:Titular|Responsable(?:\\s+del\\s+(?:fichero|tratamiento|sitio|web|datos))?|a\\s+nombre\\s+de|propietari[oa])\\s*(?:es|:|\\-|–)?\\s*(${CAPS})`, 'i');
    if ((m = t.match(labCaps))) {
      const caps = m[1].trim();
      const words = caps.split(/\s+/);
      if (!STOP_WORDS.test(caps) && !/\b(S\.?L|S\.?A|C\.?B|S\.?C)\b/.test(caps) && words.length >= 2 && words.length <= 5) {
        res.name = caps.replace(/\S+/g, (w) => w.charAt(0) + w.slice(1).toLowerCase()); // a Capitalización normal
      }
    }
  }

  // Nombre de empresa (S.L., S.A., S.L.U., C.B., S.C.P.) — útil para prospección.
  if ((m = t.match(/\b([A-ZÁÉÍÓÚÑ][\wÁÉÍÓÚÑáéíóúñ&.\-]+(?:\s+[A-ZÁÉÍÓÚÑ0-9&.\-]+){0,4})\s+(S\.?L\.?U?\.?|S\.?A\.?U?\.?|S\.?C\.?P?\.?|C\.?B\.?)\b/))) {
    const c = `${m[1]} ${m[2]}`.replace(/\s+/g, ' ').trim();
    if (!STOP_WORDS.test(m[1])) res.company = c;
  }

  // NIF persona (8 dígitos + letra) o CIF empresa (letra + 7 dígitos + control)
  if ((m = t.match(/\b(\d{8}[-\s]?[A-Z]|[A-Z][-\s]?\d{7}[-\s]?[0-9A-Z])\b/))) res.nif = m[1].replace(/[-\s]/g, '');

  const em = t.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,8}/);
  if (em && !/noreply|no-reply|example|sentry|wixpress/i.test(em[0])) res.email = em[0].toLowerCase();

  // Si lo detectado como "nombre" lleva sufijo de empresa, es la empresa, no una persona.
  if (res.name && COMPANY_SUFFIX.test(res.name)) {
    if (!res.company) res.company = res.name;
    res.name = '';
  }

  return res;
}

function prospectLinks(lead) {
  const name = lead.name || '';
  const q = encodeURIComponent(name + ' Valencia');
  return {
    googleOwner: `https://www.google.com/search?q=${encodeURIComponent(`"${name}" Valencia (propietario OR gerente OR dueño OR fundador)`)}`,
    linkedin: `https://www.google.com/search?q=${encodeURIComponent(`${name} Valencia`)}+site%3Alinkedin.com`,
    maps: lead.lat && lead.lon
      ? `https://www.google.com/maps/search/?api=1&query=${lead.lat}%2C${lead.lon}`
      : `https://www.google.com/maps/search/?api=1&query=${q}`,
    einforma: `https://www.einforma.com/buscar-empresas?q=${q}`,
    instagram: lead.instagram || `https://www.instagram.com/explore/search/keyword/?q=${q}`,
  };
}

async function enrichOwner(lead) {
  const owner = { name: '', nif: '', email: '', source: '', confidence: 'baja', links: prospectLinks(lead), checkedAt: new Date().toISOString().slice(0, 10) };

  // Fuente OSM (a veces el negocio declara su operador/titular)
  if (lead.operator && /[a-zA-Z]/.test(lead.operator)) {
    const n = cleanName(lead.operator);
    if (n) {
      if (COMPANY_SUFFIX.test(n)) owner.company = n;   // "X S.L." es empresa, no persona
      else owner.name = n;
      owner.source = 'OpenStreetMap';
    }
  }

  if (lead.website) {
    try {
      const home = await fetchHtml(lead.website);
      let found = extractOwner(home.html);
      if ((found.name || found.company) && !owner.source) owner.source = 'web (inicio)';

      const legal = findLegalLinks(home.html, home.finalUrl);
      for (const url of legal) {
        if (owner.name && owner.nif) break;
        try {
          const page = await fetchHtml(url);
          const f = extractOwner(page.html);
          if ((f.name || f.nif || f.company) && /aviso|legal|privac/i.test(url)) owner.source = 'aviso legal';
          else if ((f.name || f.company) && !owner.source) owner.source = 'web';
          found = {
            name: owner.name || found.name || f.name,
            company: found.company || f.company,
            nif: found.nif || f.nif,
            email: found.email || f.email,
          };
        } catch { /* esa página no carga, seguimos */ }
      }

      owner.name = owner.name || found.name || '';
      owner.company = found.company || '';
      owner.nif = found.nif || '';
      owner.email = found.email || '';
    } catch { /* la web no carga: nos quedamos con los enlaces de búsqueda */ }
  }

  const got = owner.name || owner.company || owner.nif;
  owner.confidence = got ? (owner.source === 'aviso legal' ? 'alta' : 'media') : 'baja';
  return owner;
}

module.exports = { enrichOwner };
