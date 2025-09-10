// src/types.ts

// ---- Leads ----
export type LeadStatus =
  | 'new'
  | 'contacted'
  | 'qualified'
  | 'unqualified'
  | 'converted';

export interface Lead {
  id: string;
  name: string;      // "Ava Stone"
  company: string;   // "Nimbus LLC"
  email: string;     // "ava@nimbus.io"
  source: string;    // "web" | "event" | "referral" | "ads" | etc.
  score: number;     // 0..100
  status: LeadStatus;
}

// ---- Opportunities ----
export type OpportunityStage =
  | 'prospecting'
  | 'proposal'
  | 'negotiation'
  | 'won'
  | 'lost';

export interface Opportunity {
  id: string;
  name: string;
  stage: OpportunityStage;
  amount?: number;
  accountName: string;
  leadId?: string;
  createdAt: string;
}

// ---- UI & Sorting ----
export type SortKey = 'score' | 'name';
export type SortDir = 'asc' | 'desc';

export interface LeadsViewState {
  searchTerm: string;
  statusFilter: LeadStatus | 'all';
  sortKey: SortKey;
  sortDir: SortDir;
  selectedLeadId: string | null;
}
