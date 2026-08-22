// ============================================================
//  FUENTE DE LEADS: GOOGLE PLACES API (New) — el arreglo de raíz.
//  A diferencia de OpenStreetMap, aquí cada negocio viene con:
//   · teléfono real          · web
//   · estado ABIERTO/CERRADO  · valoración + nº de reseñas
//  Filtramos fuera los cerrados de una. Reemplaza a overpass.js
//  cuando GOOGLE_PLACES_KEY esté puesta (ver PLACES-SETUP.md).
//
//  Devuelve leads en el MISMO formato que overpass.fetchSector,
//  con extras: businessStatus, rating, reviews.  Uso directo:
//     node lib/places.js peluquerias valencia
// ============================================================
const cfg = require('./config');

const KEY = process.env.GOOGLE_PLACES_KEY || cfg.GOOGLE_PLACES_KEY || '';
const ENDPOINT = 'https://places.googleapis.com/v1/places:searchText';
const FIELDS = [
  'places.id',
  'places.displayName',
  'places.nationalPhoneNumber',
  'places.internationalPhoneNumber',
  'places.websiteUri',
  'places.businessStatus',
  'places.rating',
  'places.userRatingCount',
  'places.location',
  'places.formattedAddress',
  'nextPageToken',
].join(',');

// Términos de búsqueda por sector (en español, es como la gente busca en Maps).
const SECTOR_QUERY = {
  peluquerias: 'peluquería', estetica: 'centro de estética', restaurantes: 'restaurante',
  cafeterias: 'cafetería', dentistas: 'clínica dental', fisios: 'fisioterapia',
  clinicas: 'clínica médica', talleres: 'taller mecánico', gimnasios: 'gimnasio',
  abogados: 'abogado', inmobiliarias: 'inmobiliaria', veterinarios: 'veterinario',
  fontaneros: 'fontanero', fotografos: 'fotógrafo', opticas: 'óptica',
  autoescuelas: 'autoescuela', tatuajes: 'estudio de tatuaje', floristerias: 'floristería',
  panaderias: 'panadería', masajes: 'centro de masajes', podologos: 'podólogo',
  psicologos: 'psicólogo', joyerias: 'joyería', mascotas: 'tienda de mascotas',
  asesorias: 'asesoría gestoría', arquitectos: 'arquitecto', agenciasviajes: 'agencia de viajes',
  academias: 'academia', reformas: 'empresa de reformas', cerrajeros: 'cerrajero',
  pintores: 'pintor', ferreterias: 'ferretería', ropa: 'tienda de ropa',
  zapaterias: 'zapatería', muebles: 'tienda de muebles', informatica: 'reparación de ordenadores',
  telefonia: 'tienda de telefonía', nutricion: 'nutricionista', spa: 'spa',
  copisterias: 'copistería',
};

function normPhone(raw) {
  if (!raw) return '';
  let d = String(raw).replace(/[^\d]/g, '');
  if (d.startsWith('0034')) d = d.slice(4);
  if (d.length === 9 && /^[6789]/.test(d)) d = '34' + d;
  return d;
}

function postcodeFrom(addr) {
  const m = String(addr || '').match(/\b(\d{5})\b/);
  return m ? m[1] : '';
}

async function searchPage(textQuery, pageToken) {
  const body = { textQuery, languageCode: 'es', regionCode: 'ES', pageSize: 20 };
  if (pageToken) body.pageToken = pageToken;
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': KEY,
      'X-Goog-FieldMask': FIELDS,
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const t = await res.text().catch(() => '');
    throw new Error(`Places HTTP ${res.status} — ${t.slice(0, 200)}`);
  }
  return res.json();
}

function toLead(p, sectorKey) {
  const name = p.displayName && p.displayName.text;
  if (!name) return null;
  return {
    id: `gplace/${p.id}`,
    name: name.trim(),
    sector: sectorKey,
    sectorLabel: (cfg.SECTORS[sectorKey] || {}).label || sectorKey,
    phone: normPhone(p.nationalPhoneNumber || p.internationalPhoneNumber),
    website: p.websiteUri || '',
    instagram: '',
    facebook: '',
    address: p.formattedAddress || '',
    postcode: postcodeFrom(p.formattedAddress),
    openingHours: '',
    operator: '',
    lat: p.location && p.location.latitude,
    lon: p.location && p.location.longitude,
    // —— extras que OSM NO te daba ——
    businessStatus: p.businessStatus || '',        // OPERATIONAL / CLOSED_TEMPORARILY / CLOSED_PERMANENTLY
    rating: p.rating || null,
    reviews: p.userRatingCount || 0,
  };
}

// Misma firma que overpass.fetchSector(sectorKey, zoneKey).
async function fetchSector(sectorKey, zoneKey) {
  if (!KEY) throw new Error('Falta GOOGLE_PLACES_KEY (mira PLACES-SETUP.md).');
  const sector = cfg.SECTORS[sectorKey];
  if (!sector) throw new Error(`Sector desconocido: ${sectorKey}`);
  const zone = cfg.ZONES[zoneKey] || cfg.ZONES.valencia;
  const term = SECTOR_QUERY[sectorKey] || sector.label;
  const textQuery = `${term} en ${zone.label}`;

  const leads = [];
  const seen = new Set();
  let pageToken = null;
  for (let page = 0; page < 3; page++) { // hasta 60 resultados por sector
    const data = await searchPage(textQuery, pageToken);
    for (const p of data.places || []) {
      // 🔑 FILTRO CLAVE: fuera los cerrados. Esto es lo que OSM no permitía.
      if (p.businessStatus && p.businessStatus !== 'OPERATIONAL') continue;
      const lead = toLead(p, sectorKey);
      if (!lead) continue;
      const key = lead.name.toLowerCase() + '|' + (lead.address || '').toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      leads.push(lead);
    }
    pageToken = data.nextPageToken;
    if (!pageToken) break;
    await new Promise((r) => setTimeout(r, 1500)); // el token tarda un momento en activarse
  }
  return leads;
}

// Verifica UN negocio concreto por nombre + ubicación → datos reales
// (web, teléfono, estado abierto/cerrado, reseñas). Sirve para comprobar
// leads de OSM que no sabemos si tienen web. null si no hay match fiable.
async function lookupPlace(name, lat, lon) {
  if (!KEY || !name) return null;
  const body = { textQuery: String(name), languageCode: 'es', regionCode: 'ES', pageSize: 1 };
  if (lat && lon) body.locationBias = { circle: { center: { latitude: lat, longitude: lon }, radius: 250.0 } };
  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Goog-Api-Key': KEY, 'X-Goog-FieldMask': FIELDS },
      body: JSON.stringify(body),
    });
    if (!res.ok) return null;
    const data = await res.json();
    const p = (data.places || [])[0];
    if (!p) return null;
    return {
      name: p.displayName && p.displayName.text,
      phone: normPhone(p.nationalPhoneNumber || p.internationalPhoneNumber),
      website: p.websiteUri || '',
      businessStatus: p.businessStatus || '',
      rating: p.rating || null,
      reviews: p.userRatingCount || 0,
    };
  } catch { return null; }
}

// Convierte una zona/dirección escrita (ej "Ruzafa", "Av del Puerto 40") en
// coordenadas, sesgado a Valencia. Para centrar la ruta de visitas sin estar allí.
async function geocode(query) {
  if (!KEY || !query) return null;
  const body = { textQuery: String(query) + ', Valencia, España', languageCode: 'es', regionCode: 'ES', pageSize: 1 };
  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Goog-Api-Key': KEY, 'X-Goog-FieldMask': 'places.location,places.formattedAddress,places.displayName' },
      body: JSON.stringify(body),
    });
    if (!res.ok) return null;
    const p = ((await res.json()).places || [])[0];
    if (!p || !p.location) return null;
    return { lat: p.location.latitude, lon: p.location.longitude, label: (p.displayName && p.displayName.text) || p.formattedAddress || query };
  } catch { return null; }
}

module.exports = { fetchSector, lookupPlace, geocode };

// —— Autotest: node lib/places.js peluquerias valencia ——
if (require.main === module) {
  const [, , sector = 'peluquerias', zone = 'valencia'] = process.argv;
  fetchSector(sector, zone)
    .then((leads) => {
      console.log(`\n${leads.length} negocios ABIERTOS en ${sector}/${zone}:`);
      leads.slice(0, 15).forEach((l) =>
        console.log(`  · ${l.name} — tel:${l.phone || '—'} web:${l.website ? 'sí' : 'no'} ${l.rating ? `${l.rating}★(${l.reviews})` : ''}`)
      );
      const conTel = leads.filter((l) => l.phone).length;
      console.log(`\nCon teléfono: ${conTel}/${leads.length} (${Math.round((conTel / leads.length) * 100)}%) — compara con el ~35% de OSM.`);
    })
    .catch((e) => console.error('ERROR:', e.message));
}
