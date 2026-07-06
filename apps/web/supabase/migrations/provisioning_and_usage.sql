-- provisioning_jobs: tracks every step of agent setup per business
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

-- billing_usage: monthly aggregated call costs per business
CREATE TABLE IF NOT EXISTS billing_usage (
  id                    UUID    DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id           UUID    NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  month                 TEXT    NOT NULL,  -- 'YYYY-MM'
  calls_count           INTEGER NOT NULL DEFAULT 0,
  minutes_used          NUMERIC(10,2) NOT NULL DEFAULT 0,
  estimated_cost_cents  INTEGER NOT NULL DEFAULT 0,
  created_at            TIMESTAMPTZ DEFAULT NOW(),
  updated_at            TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (business_id, month)
);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trg_provisioning_jobs_updated_at
  BEFORE UPDATE ON provisioning_jobs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE OR REPLACE TRIGGER trg_billing_usage_updated_at
  BEFORE UPDATE ON billing_usage
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
