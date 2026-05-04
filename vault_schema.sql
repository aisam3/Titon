-- ============================================================
-- TITON KM VAULT - COMPLETE SUPABASE SCHEMA
-- Run this in the Supabase SQL Editor (Dashboard > SQL Editor)
-- ============================================================

-- ============================================================
-- 1. ASSETS TABLE
-- Central registry of all enterprise assets
-- ============================================================
CREATE TABLE IF NOT EXISTS km_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  asset_id TEXT UNIQUE NOT NULL,               -- e.g. "AST-001" (auto-generated)
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('Service', 'Offer', 'Package', 'Question', 'UseCase', 'Framework', 'GHLAsset', 'GHLFeature')),
  status TEXT NOT NULL DEFAULT 'Draft' CHECK (status IN ('Active', 'Inactive', 'Archived', 'Draft')),
  owner TEXT NOT NULL,
  classification TEXT NOT NULL DEFAULT 'Internal' CHECK (classification IN ('Internal', 'External', 'Public', 'Restricted', 'Highly Confidential')),
  access_label TEXT DEFAULT 'Clearance Level 1',
  notes TEXT DEFAULT '',
  -- Calculated metric stored for fast retrieval
  linked_sop_count INTEGER DEFAULT 0,
  linked_req_count INTEGER DEFAULT 0,
  linked_audit_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- ============================================================
-- 2. SOPs TABLE
-- Standard Operating Procedures library
-- ============================================================
CREATE TABLE IF NOT EXISTS km_sops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  sop_id TEXT UNIQUE NOT NULL,                  -- e.g. "SOP-001"
  title TEXT NOT NULL,
  version TEXT NOT NULL DEFAULT '1.0.0',
  owner TEXT NOT NULL,
  department TEXT NOT NULL DEFAULT 'Operations',
  status TEXT NOT NULL DEFAULT 'Draft' CHECK (status IN ('Published', 'Draft', 'Review', 'Deprecated')),
  description TEXT DEFAULT '',
  steps JSONB DEFAULT '[]',                     -- Array of {id, title, content, order}
  attachments TEXT[] DEFAULT '{}',
  -- Calculated: number of steps, for quick display
  step_count INTEGER GENERATED ALWAYS AS (jsonb_array_length(steps)) STORED,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- ============================================================
-- 3. REQUIREMENTS TABLE
-- Governance compliance requirements
-- ============================================================
CREATE TABLE IF NOT EXISTS km_requirements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  requirement_id TEXT UNIQUE NOT NULL,          -- e.g. "REQ-001"
  title TEXT NOT NULL,
  governance_class TEXT NOT NULL DEFAULT 'Internal' CHECK (governance_class IN ('Regulatory', 'Standard', 'Internal', 'Client')),
  description TEXT DEFAULT '',
  next_best_action TEXT DEFAULT '',
  compliance_score NUMERIC(5,2) DEFAULT 0 CHECK (compliance_score >= 0 AND compliance_score <= 100),
  proof_status TEXT NOT NULL DEFAULT 'Pending' CHECK (proof_status IN ('Verified', 'Pending', 'Rejected', 'N/A')),
  -- Proof document URL or file reference
  proof_document TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- ============================================================
-- 4. AUDITS TABLE
-- Audit console records
-- ============================================================
CREATE TABLE IF NOT EXISTS km_audits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  audit_id TEXT UNIQUE NOT NULL,               -- e.g. "AUD-001"
  title TEXT NOT NULL,
  target_type TEXT DEFAULT 'System' CHECK (target_type IN ('Asset', 'SOP', 'Requirement', 'System', 'Process')),
  target_id UUID,                              -- FK to whichever entity is audited
  status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Passed', 'Failed', 'Pending', 'In Progress')),
  score NUMERIC(5,2) DEFAULT 0 CHECK (score >= 0 AND score <= 100),
  proof_url TEXT DEFAULT '',
  findings TEXT DEFAULT '',
  auditor TEXT DEFAULT 'System',
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- ============================================================
-- 5. RELATION TABLES (Junction / Mapping)
-- ============================================================

-- Asset <-> SOP
CREATE TABLE IF NOT EXISTS km_asset_sop_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id UUID NOT NULL REFERENCES km_assets(id) ON DELETE CASCADE,
  sop_id UUID NOT NULL REFERENCES km_sops(id) ON DELETE CASCADE,
  UNIQUE(asset_id, sop_id)
);

-- Asset <-> Requirement
CREATE TABLE IF NOT EXISTS km_asset_req_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id UUID NOT NULL REFERENCES km_assets(id) ON DELETE CASCADE,
  requirement_id UUID NOT NULL REFERENCES km_requirements(id) ON DELETE CASCADE,
  UNIQUE(asset_id, requirement_id)
);

-- SOP <-> Requirement
CREATE TABLE IF NOT EXISTS km_sop_req_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sop_id UUID NOT NULL REFERENCES km_sops(id) ON DELETE CASCADE,
  requirement_id UUID NOT NULL REFERENCES km_requirements(id) ON DELETE CASCADE,
  UNIQUE(sop_id, requirement_id)
);

-- Asset <-> Audit
CREATE TABLE IF NOT EXISTS km_asset_audit_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id UUID NOT NULL REFERENCES km_assets(id) ON DELETE CASCADE,
  audit_id UUID NOT NULL REFERENCES km_audits(id) ON DELETE CASCADE,
  UNIQUE(asset_id, audit_id)
);

-- ============================================================
-- 6. SEQUENCE COUNTERS (for auto-generating IDs like AST-001)
-- ============================================================
CREATE TABLE IF NOT EXISTS km_id_sequences (
  entity TEXT PRIMARY KEY,
  next_val INTEGER DEFAULT 1
);
INSERT INTO km_id_sequences (entity, next_val) VALUES
  ('asset', 1),
  ('sop', 1),
  ('requirement', 1),
  ('audit', 1)
ON CONFLICT (entity) DO NOTHING;

-- ============================================================
-- 7. ENABLE ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE km_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE km_sops ENABLE ROW LEVEL SECURITY;
ALTER TABLE km_requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE km_audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE km_asset_sop_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE km_asset_req_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE km_sop_req_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE km_asset_audit_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE km_id_sequences ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 8. RLS POLICIES
-- ============================================================

-- Assets: users only see their own
CREATE POLICY "km_assets_user_policy" ON km_assets FOR ALL USING (auth.uid()::uuid = user_id);

-- SOPs: users only see their own
CREATE POLICY "km_sops_user_policy" ON km_sops FOR ALL USING (auth.uid()::uuid = user_id);

-- Requirements: users only see their own
CREATE POLICY "km_requirements_user_policy" ON km_requirements FOR ALL USING (auth.uid()::uuid = user_id);

-- Audits: users only see their own
CREATE POLICY "km_audits_user_policy" ON km_audits FOR ALL USING (auth.uid()::uuid = user_id);

-- Junction tables: accessible if related asset/sop/req belongs to user
CREATE POLICY "km_asset_sop_links_policy" ON km_asset_sop_links FOR ALL
  USING (EXISTS (SELECT 1 FROM km_assets WHERE id = asset_id AND user_id = auth.uid()::uuid));

CREATE POLICY "km_asset_req_links_policy" ON km_asset_req_links FOR ALL
  USING (EXISTS (SELECT 1 FROM km_assets WHERE id = asset_id AND user_id = auth.uid()::uuid));

CREATE POLICY "km_sop_req_links_policy" ON km_sop_req_links FOR ALL
  USING (EXISTS (SELECT 1 FROM km_sops WHERE id = sop_id AND user_id = auth.uid()::uuid));

CREATE POLICY "km_asset_audit_links_policy" ON km_asset_audit_links FOR ALL
  USING (EXISTS (SELECT 1 FROM km_assets WHERE id = asset_id AND user_id = auth.uid()::uuid));

-- Sequences: allow authenticated users to read/update
CREATE POLICY "km_id_sequences_policy" ON km_id_sequences FOR ALL TO authenticated USING (true);

-- ============================================================
-- 9. FUNCTIONS
-- ============================================================

-- Function: Get next sequential ID for an entity
CREATE OR REPLACE FUNCTION km_next_id(p_entity TEXT)
RETURNS TEXT AS $$
DECLARE
  v_next INTEGER;
  v_prefix TEXT;
BEGIN
  UPDATE km_id_sequences SET next_val = next_val + 1 WHERE entity = p_entity RETURNING next_val - 1 INTO v_next;
  v_prefix := CASE p_entity
    WHEN 'asset' THEN 'AST'
    WHEN 'sop' THEN 'SOP'
    WHEN 'requirement' THEN 'REQ'
    WHEN 'audit' THEN 'AUD'
    ELSE UPPER(p_entity)
  END;
  RETURN v_prefix || '-' || LPAD(v_next::TEXT, 3, '0');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- 10. VAULT ANALYTICS FUNCTION
-- Returns aggregate stats for the dashboard header
-- ============================================================
CREATE OR REPLACE FUNCTION km_vault_stats()
RETURNS JSON AS $$
DECLARE
  v_user UUID := auth.uid()::uuid;
  v_asset_count INTEGER;
  v_sop_count INTEGER;
  v_req_count INTEGER;
  v_audit_count INTEGER;
  v_avg_compliance NUMERIC;
  v_verified_reqs INTEGER;
  v_passed_audits INTEGER;
BEGIN
  SELECT COUNT(*) INTO v_asset_count FROM km_assets WHERE user_id = v_user;
  SELECT COUNT(*) INTO v_sop_count FROM km_sops WHERE user_id = v_user;
  SELECT COUNT(*) INTO v_req_count FROM km_requirements WHERE user_id = v_user;
  SELECT COUNT(*) INTO v_audit_count FROM km_audits WHERE user_id = v_user;
  SELECT COALESCE(AVG(compliance_score), 0) INTO v_avg_compliance FROM km_requirements WHERE user_id = v_user;
  SELECT COUNT(*) INTO v_verified_reqs FROM km_requirements WHERE user_id = v_user AND proof_status = 'Verified';
  SELECT COUNT(*) INTO v_passed_audits FROM km_audits WHERE user_id = v_user AND status = 'Passed';

  RETURN json_build_object(
    'asset_count', v_asset_count,
    'sop_count', v_sop_count,
    'req_count', v_req_count,
    'audit_count', v_audit_count,
    'avg_compliance', ROUND(v_avg_compliance, 1),
    'verified_reqs', v_verified_reqs,
    'passed_audits', v_passed_audits
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- 11. COMPLIANCE SCORE AUTO-CALCULATION TRIGGER
-- When proof_status changes, auto-recalculate compliance_score
-- ============================================================
CREATE OR REPLACE FUNCTION km_calc_compliance_score()
RETURNS TRIGGER AS $$
BEGIN
  -- Auto-assign score based on proof status if not manually provided
  IF NEW.proof_status = 'Verified' AND NEW.compliance_score = 0 THEN
    NEW.compliance_score := 100;
  ELSIF NEW.proof_status = 'Pending' AND NEW.compliance_score = 0 THEN
    NEW.compliance_score := 50;
  ELSIF NEW.proof_status = 'Rejected' THEN
    NEW.compliance_score := 0;
  END IF;
  NEW.updated_at := now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER km_requirements_compliance_trigger
  BEFORE INSERT OR UPDATE ON km_requirements
  FOR EACH ROW EXECUTE FUNCTION km_calc_compliance_score();

-- Auto-update updated_at for assets
CREATE OR REPLACE FUNCTION km_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER km_assets_updated_at
  BEFORE UPDATE ON km_assets FOR EACH ROW EXECUTE FUNCTION km_set_updated_at();

CREATE OR REPLACE TRIGGER km_sops_updated_at
  BEFORE UPDATE ON km_sops FOR EACH ROW EXECUTE FUNCTION km_set_updated_at();

CREATE OR REPLACE TRIGGER km_audits_updated_at
  BEFORE UPDATE ON km_audits FOR EACH ROW EXECUTE FUNCTION km_set_updated_at();

-- ============================================================
-- 12. AUDIT SCORE CALCULATION FUNCTION
-- ============================================================
CREATE OR REPLACE FUNCTION km_calculate_audit_score(
  p_audit_id UUID,
  p_passed_checks INTEGER,
  p_total_checks INTEGER
) RETURNS NUMERIC AS $$
DECLARE
  v_score NUMERIC;
BEGIN
  IF p_total_checks = 0 THEN
    v_score := 0;
  ELSE
    v_score := ROUND((p_passed_checks::NUMERIC / p_total_checks) * 100, 2);
  END IF;
  
  UPDATE km_audits 
  SET score = v_score,
      status = CASE WHEN v_score >= 80 THEN 'Passed' WHEN v_score > 0 THEN 'In Progress' ELSE 'Failed' END
  WHERE id = p_audit_id;
  
  RETURN v_score;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- 13. USEFUL VIEWS
-- ============================================================

-- Vault overview: assets with their link counts
CREATE OR REPLACE VIEW km_asset_summary AS
  SELECT 
    a.*,
    COUNT(DISTINCT asl.sop_id) AS sop_link_count,
    COUNT(DISTINCT arl.requirement_id) AS req_link_count,
    COUNT(DISTINCT aal.audit_id) AS audit_link_count
  FROM km_assets a
  LEFT JOIN km_asset_sop_links asl ON asl.asset_id = a.id
  LEFT JOIN km_asset_req_links arl ON arl.asset_id = a.id
  LEFT JOIN km_asset_audit_links aal ON aal.asset_id = a.id
  GROUP BY a.id;

-- Compliance summary per governance class
CREATE OR REPLACE VIEW km_compliance_summary AS
  SELECT
    governance_class,
    COUNT(*) AS total,
    ROUND(AVG(compliance_score), 1) AS avg_score,
    COUNT(*) FILTER (WHERE proof_status = 'Verified') AS verified,
    COUNT(*) FILTER (WHERE proof_status = 'Pending') AS pending,
    COUNT(*) FILTER (WHERE proof_status = 'Rejected') AS rejected
  FROM km_requirements
  WHERE user_id = auth.uid()::uuid
  GROUP BY governance_class;

-- ============================================================
-- END OF SCHEMA
-- ============================================================
