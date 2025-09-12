// ---- Leads ----
export type LeadStatus =
  | "new"
  | "contacted"
  | "qualified"
  | "unqualified"
  | "converted";

export interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  source: string;
  score: number;
  status: LeadStatus;
}

// ---- Opportunities ----
export type OpportunityStage =
  | "prospecting"
  | "proposal"
  | "negotiation"
  | "won"
  | "lost";

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
export type SortKey =
  | "id"
  | "name"
  | "company"
  | "email"
  | "source"
  | "score"
  | "status";

export type SortDir = "asc" | "desc";

export interface LeadsViewState {
  searchTerm: string;
  statusFilter: LeadStatus | "all";
  sortKey: SortKey;
  sortDir: SortDir;
  selectedLeadId: string | null;
  pageSize: number;
}
