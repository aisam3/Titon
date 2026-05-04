export interface AuditResponses {
  fullName: string;
  agencyName: string;
  email: string;
  website: string;
  country: string;
  timezone: string;
  workflowCount: string;
  sopsDocumented: string;
  painPoints: string[];
  confidenceScore: number;
  quickBreakpoints: string[];
  targetWorkflow: string;
  ghlStatus: string;
  toolsUsed: string[];
  recommendedFleet: string;
  readinessTimeline: string;
}

export type Fleet = 'Charter' | 'Partner' | 'Extended' | '';

export interface AuditResults {
  quickBreakpointOpportunity: string;
  recommendedFirstProofTile: string;
  fleetRecommendation: Fleet;
  estimatedTimeToProof: string;
  quadrantMatch: 'Quick BreakPoints' | 'Fog Projects' | 'Transformation Bets' | 'Nice-to-Haves';
}
