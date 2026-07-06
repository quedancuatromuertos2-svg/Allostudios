-- ──────────────────────────────────────────────────────────────────────────────
-- billing_minutes.sql
-- Run this in Supabase SQL Editor
-- ──────────────────────────────────────────────────────────────────────────────

-- 1. Ensure billing_usage table exists with correct columns
CREATE TABLE IF NOT EXISTS billing_usage (
  id                    UUID    DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id           UUID    NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  month                 TEXT    NOT NULL,
  calls_count           INTEGER NOT NULL DEFAULT 0,
  minutes_used          NUMERIC(10,2) NOT NULL DEFAULT 0,
  estimated_cost_cents  INTEGER NOT NULL DEFAULT 0,
  created_at            TIMESTAMPTZ DEFAULT NOW(),
  updated_at            TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (business_id, month)
);

-- 2. upsert_billing_usage: accumulates values (not replaces) on conflict
CREATE OR REPLACE FUNCTION upsert_billing_usage(
  p_business_id UUID,
  p_month TEXT,
  p_minutes NUMERIC,
  p_cost_cents INTEGER
) RETURNS void AS $$
BEGIN
  INSERT INTO billing_usage (business_id, month, calls_count, minutes_used, estimated_cost_cents)
  VALUES (p_business_id, p_month, 1, p_minutes, p_cost_cents)
  ON CONFLICT (business_id, month) DO UPDATE SET
    calls_count          = billing_usage.calls_count + 1,
    minutes_used         = billing_usage.minutes_used + EXCLUDED.minutes_used,
    estimated_cost_cents = billing_usage.estimated_cost_cents + EXCLUDED.estimated_cost_cents,
    updated_at           = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. provisioning_jobs table (idempotent, safe to re-run)
CREATE TABLE IF NOT EXISTS provisioning_jobs (
  id              UUID    DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id     UUID    NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  status          TEXT    NOT NULL DEFAULT 'pending'
                          CHECK (status IN ('pending','running','success','failed')),
  completed_steps JSONB   NOT NULL DEFAULT '[]',
  retry_count     INTEGER NOT NULL DEFAULT 0,
  error_message   TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (business_id)
);

CREATE INDEX IF NOT EXISTS idx_provisioning_jobs_status ON provisioning_jobs(status);

-- 4. Auto-update updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'trg_billing_usage_updated_at'
  ) THEN
    CREATE TRIGGER trg_billing_usage_updated_at
      BEFORE UPDATE ON billing_usage
      FOR EACH ROW EXECUTE FUNCTION update_updated_at();
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'trg_provisioning_jobs_updated_at'
  ) THEN
    CREATE TRIGGER trg_provisioning_jobs_updated_at
      BEFORE UPDATE ON provisioning_jobs
      FOR EACH ROW EXECUTE FUNCTION update_updated_at();
  END IF;
END $$;

-- 5. Update existing subscriptions to new minutes-based limits
UPDATE subscriptions SET calls_limit = 30  WHERE plan = 'STARTER'       AND status = 'trialing';
UPDATE subscriptions SET calls_limit = 30  WHERE plan = 'PROFESSIONAL'   AND status = 'trialing';
UPDATE subscriptions SET calls_limit = 30  WHERE plan = 'BUSINESS'       AND status = 'trialing';
UPDATE subscriptions SET calls_limit = 200 WHERE plan = 'STARTER'        AND status = 'active';
UPDATE subscriptions SET calls_limit = 500 WHERE plan = 'PROFESSIONAL'   AND status = 'active';
UPDATE subscriptions SET calls_limit = 1000 WHERE plan = 'BUSINESS'      AND status = 'active';
