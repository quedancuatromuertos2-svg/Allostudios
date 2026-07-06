-- Estado del monitor de salud (anti-spam de alertas).
-- Opcional: si esta tabla no existe, el health-check sigue funcionando,
-- sólo que sin cooldown entre avisos repetidos.
-- Ejecutar en el SQL Editor de Supabase.

create table if not exists monitor_state (
  id text primary key,
  fingerprint text,
  last_sent_at timestamptz,
  updated_at timestamptz default now()
);

alter table monitor_state enable row level security;
-- Sólo el service role (supabaseAdmin) accede; sin políticas para anon/auth.
