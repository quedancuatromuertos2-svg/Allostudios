// ============================================================
//  Calidad de leads para el LOTE de llamadas.
//  Quita del lote lo que hace perder tiempo: negocios que ya
//  tienen una web decente y cadenas/franquicias grandes.
//  (Lo de "cerrado" no viene en OpenStreetMap; para eso está el
//   botón "❌ No vale" en el lote y, a futuro, la fuente Google Maps.)
// ============================================================
const cfg = require('./config');

// ¿La web actual ya está lo bastante bien como para NO ofrecer una nueva?
// - Sin web            → NO es "decente" (es justo el objetivo).
// - Web caída/rota     → NO es "decente" (sigue siendo oportunidad).
// - Web que carga y    → SÍ decente si tiene lo básico: https, móvil,
//   con lo básico OK      meta description y un H1. Poca venta de web nueva.
function hasDecentWeb(lead) {
  if (!lead || !lead.website) return false;
  const w = lead.web;
  if (!w || !w.ok || w.status !== 200) return false;
  return Boolean(w.https && w.viewport && w.metaDesc && w.h1);
}

// ¿Cadena / franquicia / empresa grande? Heurística por nombre (lista en config).
function isChain(lead) {
  const name = (lead && lead.name || '').toLowerCase().trim();
  if (!name) return false;
  const list = (cfg.LEAD_FILTER && cfg.LEAD_FILTER.cadenas) || [];
  return list.some((c) => c && name.includes(c));
}

// Motivo por el que un lead NO entra en el lote de llamadas ('cadena' | 'web_ok' | null).
function loteSkipReason(lead, filter) {
  const f = filter || cfg.LEAD_FILTER || {};
  if (f.fueraCadenas !== false && isChain(lead)) return 'cadena';
  if (f.soloSinWebDecente !== false && hasDecentWeb(lead)) return 'web_ok';
  return null;
}

module.exports = { hasDecentWeb, isChain, loteSkipReason };
