// Da de alta (o actualiza) un asistente de WhatsApp desde un JSON de la carpeta asistentes/.
// Uso:  node --env-file=.env.local scripts/asistente-alta.mjs asistentes/navaja.json
// Necesita NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY en el entorno.
import { readFileSync } from 'node:fs'
import { randomBytes } from 'node:crypto'
import { createClient } from '@supabase/supabase-js'

const ruta = process.argv[2]
if (!ruta) { console.error('Falta el JSON: node scripts/asistente-alta.mjs asistentes/<slug>.json'); process.exit(1) }
const cfg = JSON.parse(readFileSync(ruta, 'utf8'))
const url = process.env.NEXT_PUBLIC_SUPABASE_URL, key = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!url || !key) { console.error('Faltan NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY (ejecuta con node --env-file=.env.local …)'); process.exit(1) }
const db = createClient(url, key)

// claves que se generan solas si no vienen en el JSON
cfg.verify_token ||= randomBytes(12).toString('hex')
cfg.clave_admin ||= randomBytes(16).toString('hex')
if (Array.isArray(cfg.conocimiento)) cfg.conocimiento = cfg.conocimiento.join('\n')

const { data, error } = await db.from('asistentes').upsert(cfg, { onConflict: 'slug' }).select('slug, verify_token, clave_admin').single()
if (error) { console.error(error.message); process.exit(1) }
console.log(`
Asistente «${data.slug}» listo.

  Webhook (Meta for Developers → tu app → WhatsApp → Configuración → Webhook):
    URL:           https://allostudios.net/api/asistente/${data.slug}
    Verify token:  ${data.verify_token}
    Campo a suscribir: messages

  Conectar el Google Calendar del negocio (abrir con el dueño, una sola vez):
    https://allostudios.net/api/asistente/${data.slug}/google?clave=${data.clave_admin}
`)
