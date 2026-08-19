-- Tabla para los leads del generador de demos público (/tu-web).
-- Ejecútala una vez en Supabase → SQL Editor → Run.
create table if not exists public.demo_leads (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  negocio     text not null,
  ciudad      text,
  sector      text,
  telefono    text,
  email       text,
  consent     boolean default false,
  place       jsonb,          -- datos reales de Google Places (reseñas, foto, dirección...)
  ip          text,
  contacted   boolean default false   -- Fran lo marca cuando lo contacta
);

-- Índices útiles para el rate-limit por IP y para ordenar por fecha.
create index if not exists demo_leads_ip_created_idx on public.demo_leads (ip, created_at desc);
create index if not exists demo_leads_created_idx on public.demo_leads (created_at desc);

-- Seguridad: RLS activado y SIN políticas públicas.
-- Solo el service role (las API routes del servidor) puede leer/escribir.
-- El formulario y la página de demo pasan por el servidor, así que funcionan;
-- nadie puede consultar los leads desde el navegador.
alter table public.demo_leads enable row level security;
