// ============================================================
//  CLASIFICACIÓN HONESTA DE LEADS
//  Arregla el fallo viejo: "sin web" = 88 = tier A (el vacío se
//  premiaba como oro). Aquí cada lead se juzga por lo que de
//  verdad importa para vender: ¿se le puede contactar HOY?, ¿por
//  qué canal?, y ¿cuánta oportunidad real hay?
//
//  Devuelve { contactable, reach, bucket, priority }:
//   - bucket 'activo'    → tiene teléfono o email → se le vende ya (va al lote).
//   - bucket 'visita'    → sin contacto remoto pero con ubicación → ruta presencial.
//   - bucket 'sin_datos' → ni contacto ni ubicación → basura, al fondo.
//   - priority 0-100     → orden real (contactable + móvil + sin web = arriba).
// ============================================================

function bestEmail(l) {
  return (l.email && String(l.email).trim()) || (l.guessedEmail && String(l.guessedEmail).trim()) || '';
}

// Teléfonos se guardan como '34XXXXXXXXX'. Móvil español = empieza por 6 o 7.
function phoneKind(p) {
  const d = String(p || '').replace(/^34/, '');
  if (!/^\d{9}$/.test(d)) return 'none';
  return /^[67]/.test(d) ? 'movil' : 'fijo';
}

// ¿Su web (si tiene) es una oportunidad de venta o ya está decente?
function webOpportunity(l) {
  if (!l.website) return 'sin_web';                 // no le encontramos web → oportunidad alta
  const w = l.web;
  if (!w || w.broken || (w.status && w.status >= 400)) return 'web_rota'; // web caída → oportunidad alta
  const decente = w.https && w.viewport && w.metaDesc && w.h1;
  return decente ? 'web_ok' : 'web_floja';
}

function classify(l) {
  const email = bestEmail(l);
  const kind = phoneKind(l.phone);
  const hasPhone = kind !== 'none';
  const hasInsta = Boolean(l.instagram);
  const hasGeo = Boolean(l.lat && l.lon);

  // Canal preferente para el primer toque.
  let reach = 'none';
  if (l.hasWhatsapp || kind === 'movil') reach = 'whatsapp';
  else if (kind === 'fijo') reach = 'fijo';
  else if (email) reach = 'email';
  else if (hasInsta) reach = 'instagram';

  const contactable = hasPhone || Boolean(email); // = lo que el lote considera contactable
  const bucket = contactable ? 'activo' : hasGeo ? 'visita' : 'sin_datos';

  const opp = webOpportunity(l);
  let priority;

  if (bucket === 'activo') {
    priority = 45;
    if (reach === 'whatsapp') priority += 25;        // 1-clic, mejor tasa de respuesta
    else if (reach === 'fijo') priority += 12;       // hay que llamar
    else if (reach === 'email') priority += 10;
    if (opp === 'web_rota') priority += 16;
    else if (opp === 'sin_web') priority += 14;
    else if (opp === 'web_floja') priority += 8;
    else priority += 4;                              // web_ok: aún hay servicios que venderle
    if (hasInsta) priority += 2;                     // más fácil de investigar / DM de apoyo
  } else if (bucket === 'visita') {
    priority = 12;
    if (opp === 'sin_web' || opp === 'web_rota') priority += 8;
    if (hasInsta) priority += 4;                     // al menos hay una vía online
  } else {
    priority = 5;
  }

  return { contactable, reach, bucket, priority: Math.min(100, priority) };
}

module.exports = { classify, phoneKind, bestEmail, webOpportunity };
