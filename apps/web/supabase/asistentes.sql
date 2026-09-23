-- Asistente de IA en WhatsApp para los negocios de los clientes (Pack Pro/Max) y para AlloStudios
-- (setter/closer). Un asistente = un número de WhatsApp + el conocimiento de ese negocio.
-- Ejecutar en Supabase → SQL editor. (20/09/2026)

create table if not exists asistentes (
  id            uuid primary key default gen_random_uuid(),
  slug          text unique not null,              -- 'navaja', 'allo'… va en la URL del webhook
  nombre        text not null,                     -- «Barbería Navaja»
  activo        boolean not null default true,
  canal         text not null default 'meta',      -- 'meta' (WhatsApp Cloud API) | 'twilio'
  -- WhatsApp Cloud API (Meta for Developers → app → WhatsApp → API setup)
  meta_phone_number_id text,                       -- «Phone number ID»
  meta_token    text,                              -- token permanente del sistema (System User)
  verify_token  text not null,                     -- lo que se pega en «Verify token» del webhook
  -- Instagram (mismos webhooks de Meta; el token puede ser el mismo que meta_token)
  ig_user_id    text,                              -- id de la cuenta profesional de Instagram
  ig_token      text,
  clave_admin   text not null,                     -- clave para el enlace de conectar Google Calendar
  -- Cómo es el negocio (texto libre, lo lee el modelo tal cual)
  conocimiento  text not null,                     -- servicios y precios, horario, dirección, cómo llegar, FAQs
  tono          text default 'cercano y directo, tuteando, frases cortas, sin emojis salvo alguno suelto',
  reglas        text,                              -- lo que NO puede hacer/decir; cuándo pasar a una persona
  -- Citas
  citas         boolean not null default true,
  duracion_min  int not null default 30,
  horario       jsonb not null default '{"lun":["09:30-14:00","16:00-20:00"],"mar":["09:30-14:00","16:00-20:00"],"mie":["09:30-14:00","16:00-20:00"],"jue":["09:30-14:00","16:00-20:00"],"vie":["09:30-14:00","16:00-20:00"],"sab":["09:30-14:00"],"dom":[]}',
  google_tokens jsonb,                             -- access/refresh token de Google Calendar del negocio
  -- Avisos al dueño
  aviso_email   text,
  aviso_whatsapp text,                             -- número del dueño (E.164 sin +) para avisos por CallMeBot
  created_at    timestamptz not null default now()
);

create table if not exists asistente_mensajes (
  id            bigserial primary key,
  asistente_id  uuid not null references asistentes(id) on delete cascade,
  telefono      text not null,                     -- cliente (E.164 sin +)
  role          text not null,                     -- 'user' | 'assistant'
  content       text not null,
  wa_id         text,                              -- id del mensaje de WhatsApp (para no procesar dos veces)
  created_at    timestamptz not null default now()
);
create index if not exists asistente_mensajes_conv on asistente_mensajes (asistente_id, telefono, created_at desc);
create unique index if not exists asistente_mensajes_wa on asistente_mensajes (wa_id) where wa_id is not null;

create table if not exists asistente_citas (
  id            uuid primary key default gen_random_uuid(),
  asistente_id  uuid not null references asistentes(id) on delete cascade,
  telefono      text not null,
  nombre        text,
  servicio      text,
  inicio        timestamptz not null,
  fin           timestamptz not null,
  estado        text not null default 'confirmada', -- confirmada | cancelada
  calendar_event_id text,
  created_at    timestamptz not null default now()
);
create index if not exists asistente_citas_prox on asistente_citas (asistente_id, inicio);

-- Avisos pendientes de leer por el dueño (cuando el asistente pasa la conversación a una persona)
create table if not exists asistente_avisos (
  id            bigserial primary key,
  asistente_id  uuid not null references asistentes(id) on delete cascade,
  telefono      text not null,
  motivo        text not null,
  resumen       text,
  atendido      boolean not null default false,
  created_at    timestamptz not null default now()
);
