/**
 * TITON KM Vault - Full Type Definitions
 */

// ---- ASSETS ----
export type AssetStatus = 'Active' | 'Inactive' | 'Archived' | 'Draft';
export type AssetType = 'Service' | 'Offer' | 'Package' | 'Question' | 'UseCase' | 'Framework' | 'GHLAsset' | 'GHLFeature';
export type Classification = 'Internal' | 'External' | 'Public' | 'Restricted' | 'Highly Confidential';

export interface Asset {
  id: string;
  user_id?: string;
  asset_id: string;
  name: string;
  type: AssetType;
  status: AssetStatus;
  owner: string;
  classification: Classification;
  access_label: string;
  notes: string;
  linked_sop_count: number;
  linked_req_count: number;
  linked_audit_count: number;
  created_at: string;
  updated_at: string;
  // joined relation counts (from view)
  sop_link_count?: number;
  req_link_count?: number;
  audit_link_count?: number;
}

export type AssetFormData = Omit<Asset, 'id' | 'user_id' | 'asset_id' | 'created_at' | 'updated_at' | 'linked_sop_count' | 'linked_req_count' | 'linked_audit_count'>;

// ---- SOPs ----
export type SopStatus = 'Published' | 'Draft' | 'Review' | 'Deprecated';

export interface SopStep {
  id: string;
  title: string;
  content: string;
  order: number;
}

export interface Sop {
  id: string;
  user_id?: string;
  sop_id: string;
  title: string;
  version: string;
  owner: string;
  department: string;
  status: SopStatus;
  description: string;
  steps: SopStep[];
  step_count?: number;
  attachments: string[];
  created_at: string;
  updated_at: string;
}

export type SopFormData = Omit<Sop, 'id' | 'user_id' | 'sop_id' | 'created_at' | 'updated_at' | 'step_count'>;

// ---- REQUIREMENTS ----
export type GovernanceClass = 'Regulatory' | 'Standard' | 'Internal' | 'Client';
export type ProofStatus = 'Verified' | 'Pending' | 'Rejected' | 'N/A';

export interface Requirement {
  id: string;
  user_id?: string;
  requirement_id: string;
  title: string;
  governance_class: GovernanceClass;
  description: string;
  next_best_action: string;
  compliance_score: number;
  proof_status: ProofStatus;
  proof_document: string;
  created_at: string;
  updated_at: string;
}

export type RequirementFormData = Omit<Requirement, 'id' | 'user_id' | 'requirement_id' | 'created_at' | 'updated_at'>;

// ---- AUDITS ----
export type AuditStatus = 'Passed' | 'Failed' | 'Pending' | 'In Progress';
export type AuditTargetType = 'Asset' | 'SOP' | 'Requirement' | 'System' | 'Process';

export interface Audit {
  id: string;
  user_id?: string;
  audit_id: string;
  title: string;
  target_type: AuditTargetType;
  target_id?: string;
  status: AuditStatus;
  score: number;
  proof_url: string;
  findings: string;
  auditor: string;
  created_at: string;
  updated_at: string;
}

export type AuditFormData = Omit<Audit, 'id' | 'user_id' | 'audit_id' | 'created_at' | 'updated_at'>;

// ---- VAULT STATS ----
export interface VaultStats {
  asset_count: number;
  sop_count: number;
  req_count: number;
  audit_count: number;
  avg_compliance: number;
  verified_reqs: number;
  passed_audits: number;
}
