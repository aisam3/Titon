import { supabase } from "@/lib/supabase";
import {
  Asset, AssetFormData,
  Sop, SopFormData,
  Requirement, RequirementFormData,
  Audit, AuditFormData,
  VaultStats
} from "./types";

// ─────────────────────────────────────────────────────────────
// HELPER: Get next sequential ID from Supabase sequences table
// Falls back to client-side timestamp ID if RPC unavailable
// ─────────────────────────────────────────────────────────────
async function nextId(entity: 'asset' | 'sop' | 'requirement' | 'audit'): Promise<string> {
  try {
    const { data, error } = await supabase.rpc('km_next_id', { p_entity: entity });
    if (error) throw error;
    return data as string;
  } catch {
    // Fallback: generate client-side ID
    const prefix = { asset: 'AST', sop: 'SOP', requirement: 'REQ', audit: 'AUD' }[entity];
    return `${prefix}-${Date.now().toString().slice(-5)}`;
  }
}

// ─────────────────────────────────────────────────────────────
// CALCULATION HELPERS
// ─────────────────────────────────────────────────────────────
export function calculateComplianceScore(proofStatus: string, manualScore?: number): number {
  if (manualScore !== undefined && manualScore > 0) return manualScore;
  switch (proofStatus) {
    case 'Verified': return 100;
    case 'Pending':  return 50;
    case 'Rejected': return 0;
    case 'N/A':      return 75;
    default:         return 0;
  }
}

export function calculateAuditScore(passedChecks: number, totalChecks: number): number {
  if (totalChecks === 0) return 0;
  return parseFloat(((passedChecks / totalChecks) * 100).toFixed(2));
}

export function deriveAuditStatus(score: number): 'Passed' | 'Failed' | 'In Progress' | 'Pending' {
  if (score >= 80) return 'Passed';
  if (score > 0)   return 'In Progress';
  return 'Failed';
}

export function getAggregateCompliance(requirements: Requirement[]): number {
  if (requirements.length === 0) return 0;
  const total = requirements.reduce((sum, r) => sum + Number(r.compliance_score), 0);
  return parseFloat((total / requirements.length).toFixed(1));
}

// ─────────────────────────────────────────────────────────────
// VAULT STATS
// ─────────────────────────────────────────────────────────────
export const kmService = {

  async getVaultStats(): Promise<VaultStats> {
    try {
      const { data, error } = await supabase.rpc('km_vault_stats');
      if (error) throw error;
      return data as VaultStats;
    } catch {
      // Fallback: compute stats manually
      const [assets, sops, reqs, audits] = await Promise.all([
        supabase.from('km_assets').select('id', { count: 'exact', head: true }),
        supabase.from('km_sops').select('id', { count: 'exact', head: true }),
        supabase.from('km_requirements').select('compliance_score, proof_status'),
        supabase.from('km_audits').select('status', { count: 'exact', head: false }),
      ]);
      const reqData = (reqs.data || []) as Requirement[];
      const auditData = (audits.data || []) as Audit[];
      return {
        asset_count: assets.count || 0,
        sop_count: sops.count || 0,
        req_count: reqData.length,
        audit_count: auditData.length,
        avg_compliance: getAggregateCompliance(reqData),
        verified_reqs: reqData.filter(r => r.proof_status === 'Verified').length,
        passed_audits: auditData.filter(a => a.status === 'Passed').length,
      };
    }
  },

  // ─────────────────────────────────────────────────────────
  // ASSETS CRUD
  // ─────────────────────────────────────────────────────────
  async getAssets(): Promise<Asset[]> {
    const { data, error } = await supabase
      .from('km_assets')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data || []) as Asset[];
  },

  async createAsset(form: AssetFormData): Promise<Asset> {
    const { data: { user } } = await supabase.auth.getUser();
    const asset_id = await nextId('asset');
    const payload = {
      ...form,
      asset_id,
      user_id: user?.id,
    };
    const { data, error } = await supabase
      .from('km_assets')
      .insert([payload])
      .select()
      .single();
    if (error) throw error;
    return data as Asset;
  },

  async updateAsset(id: string, updates: Partial<AssetFormData>): Promise<Asset> {
    const { data, error } = await supabase
      .from('km_assets')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data as Asset;
  },

  async deleteAsset(id: string): Promise<void> {
    const { error } = await supabase.from('km_assets').delete().eq('id', id);
    if (error) throw error;
  },

  // ─────────────────────────────────────────────────────────
  // SOPs CRUD
  // ─────────────────────────────────────────────────────────
  async getSops(): Promise<Sop[]> {
    const { data, error } = await supabase
      .from('km_sops')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data || []) as Sop[];
  },

  async getSopById(id: string): Promise<Sop | null> {
    const { data, error } = await supabase
      .from('km_sops')
      .select('*')
      .eq('id', id)
      .single();
    if (error) return null;
    return data as Sop;
  },

  async createSop(form: SopFormData): Promise<Sop> {
    const { data: { user } } = await supabase.auth.getUser();
    const sop_id = await nextId('sop');
    const payload = {
      ...form,
      sop_id,
      user_id: user?.id,
      steps: form.steps || [],
    };
    const { data, error } = await supabase
      .from('km_sops')
      .insert([payload])
      .select()
      .single();
    if (error) throw error;
    return data as Sop;
  },

  async updateSop(id: string, updates: Partial<SopFormData>): Promise<Sop> {
    const { data, error } = await supabase
      .from('km_sops')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data as Sop;
  },

  async deleteSop(id: string): Promise<void> {
    const { error } = await supabase.from('km_sops').delete().eq('id', id);
    if (error) throw error;
  },

  // ─────────────────────────────────────────────────────────
  // REQUIREMENTS CRUD
  // ─────────────────────────────────────────────────────────
  async getRequirements(): Promise<Requirement[]> {
    const { data, error } = await supabase
      .from('km_requirements')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data || []) as Requirement[];
  },

  async createRequirement(form: RequirementFormData): Promise<Requirement> {
    const { data: { user } } = await supabase.auth.getUser();
    const requirement_id = await nextId('requirement');
    // Auto-calculate compliance score
    const compliance_score = calculateComplianceScore(form.proof_status, form.compliance_score);
    const payload = {
      ...form,
      requirement_id,
      user_id: user?.id,
      compliance_score,
    };
    const { data, error } = await supabase
      .from('km_requirements')
      .insert([payload])
      .select()
      .single();
    if (error) throw error;
    return data as Requirement;
  },

  async updateRequirement(id: string, updates: Partial<RequirementFormData>): Promise<Requirement> {
    // Recalculate compliance score on update
    const compliance_score = updates.proof_status
      ? calculateComplianceScore(updates.proof_status, updates.compliance_score)
      : updates.compliance_score;

    const { data, error } = await supabase
      .from('km_requirements')
      .update({ ...updates, compliance_score, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data as Requirement;
  },

  async deleteRequirement(id: string): Promise<void> {
    const { error } = await supabase.from('km_requirements').delete().eq('id', id);
    if (error) throw error;
  },

  // ─────────────────────────────────────────────────────────
  // AUDITS CRUD
  // ─────────────────────────────────────────────────────────
  async getAudits(): Promise<Audit[]> {
    const { data, error } = await supabase
      .from('km_audits')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data || []) as Audit[];
  },

  async createAudit(form: AuditFormData): Promise<Audit> {
    const { data: { user } } = await supabase.auth.getUser();
    const audit_id = await nextId('audit');
    const payload = {
      ...form,
      audit_id,
      user_id: user?.id,
    };
    const { data, error } = await supabase
      .from('km_audits')
      .insert([payload])
      .select()
      .single();
    if (error) throw error;
    return data as Audit;
  },

  async updateAudit(id: string, updates: Partial<AuditFormData>): Promise<Audit> {
    const { data, error } = await supabase
      .from('km_audits')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data as Audit;
  },

  async markAuditStatus(id: string, status: 'Passed' | 'Failed'): Promise<void> {
    const score = status === 'Passed' ? 100 : 0;
    const { error } = await supabase
      .from('km_audits')
      .update({ status, score, updated_at: new Date().toISOString() })
      .eq('id', id);
    if (error) throw error;
  },

  async deleteAudit(id: string): Promise<void> {
    const { error } = await supabase.from('km_audits').delete().eq('id', id);
    if (error) throw error;
  },

  // ─────────────────────────────────────────────────────────
  // GLOBAL SEARCH
  // ─────────────────────────────────────────────────────────
  async globalSearch(query: string) {
    const q = `%${query}%`;
    const [assets, sops, requirements] = await Promise.all([
      supabase.from('km_assets').select('id, name, asset_id, type, status').ilike('name', q).limit(5),
      supabase.from('km_sops').select('id, title, sop_id, status').ilike('title', q).limit(5),
      supabase.from('km_requirements').select('id, title, requirement_id, compliance_score').ilike('title', q).limit(5),
    ]);
    return {
      assets: assets.data || [],
      sops: sops.data || [],
      requirements: requirements.data || [],
    };
  },
};
