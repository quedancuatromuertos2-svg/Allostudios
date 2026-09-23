-- Instagram en los asistentes (23/09/2026). Ejecutar si ya se ejecutó antes asistentes.sql
alter table public.asistentes add column if not exists ig_user_id text;
alter table public.asistentes add column if not exists ig_token   text;
