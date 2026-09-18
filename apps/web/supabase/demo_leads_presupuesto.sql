-- Filtro de presupuesto del formulario /tu-web (18/09/2026).
-- Ejecútala una vez en Supabase → SQL Editor → Run. Hasta entonces el API guarda el lead sin este campo.
alter table public.demo_leads add column if not exists presupuesto text;  -- '<100' | '100-300' | '>300'
