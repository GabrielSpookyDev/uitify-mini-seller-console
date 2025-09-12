import { createContext, useContext, useMemo } from "react";
import type {
  Lead,
  LeadStatus,
  LeadsViewState,
  SortDir,
  SortKey,
  Opportunity,
  OpportunityStage,
} from "@/types/types";
import {
  DEFAULT_LEADS_VIEW_STATE,
  loadLeadsViewState,
  saveLeadsViewState,
} from "@/lib/storage";
import { generateUuidV4 } from "@/lib/id";

// -------- Types --------
export type LoadState =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "loaded" }
  | { kind: "error"; message: string };

export interface LeadsState {
  load: LoadState;
  leads: Lead[];
  view: LeadsViewState;
  opportunities: Opportunity[];
}

export type LeadsAction =
  | { type: "load:start" }
  | { type: "load:success"; payload: Lead[] }
  | { type: "load:error"; message: string }
  | { type: "view:setSearch"; searchTerm: string }
  | { type: "view:setStatus"; status: LeadStatus | "all" }
  | { type: "view:setSort"; sortKey: SortKey; sortDir: SortDir }
  | { type: "view:select"; leadId: string | null }
  | { type: "lead:update"; id: string; patch: Partial<Lead> }
  | { type: "opportunity:add"; payload: Opportunity };

// -------- Init / Reducer --------
export function getInitialLeadsState(): LeadsState {
  const persisted = loadLeadsViewState();
  return {
    load: { kind: "idle" },
    leads: [],
    view: persisted ?? DEFAULT_LEADS_VIEW_STATE,
    opportunities: [],
  };
}

export function leadsReducer(
  state: LeadsState,
  action: LeadsAction
): LeadsState {
  switch (action.type) {
    case "load:start":
      return { ...state, load: { kind: "loading" } };
    case "load:success":
      return { ...state, load: { kind: "loaded" }, leads: action.payload };
    case "load:error":
      return { ...state, load: { kind: "error", message: action.message } };

    case "view:setSearch":
      return {
        ...state,
        view: { ...state.view, searchTerm: action.searchTerm },
      };
    case "view:setStatus":
      return { ...state, view: { ...state.view, statusFilter: action.status } };
    case "view:setSort":
      return {
        ...state,
        view: {
          ...state.view,
          sortKey: action.sortKey,
          sortDir: action.sortDir,
        },
      };
    case "view:select":
      return {
        ...state,
        view: { ...state.view, selectedLeadId: action.leadId },
      };

    case "lead:update": {
      const nextLeads = state.leads.map((lead) =>
        lead.id === action.id ? { ...lead, ...action.patch } : lead
      );
      return { ...state, leads: nextLeads };
    }

    case "opportunity:add":
      return {
        ...state,
        opportunities: [action.payload, ...state.opportunities],
      };

    default:
      return state;
  }
}

// Persist view changes (call from Provider effect)
export function persistLeadsView(view: LeadsViewState) {
  saveLeadsViewState(view);
}

// -------- Context + Hooks (no components exported) --------
export interface LeadsContextValue {
  state: LeadsState;
  dispatch: React.Dispatch<LeadsAction>;
}
export const LeadsContext = createContext<LeadsContextValue | undefined>(
  undefined
);

export function useLeadsContextStrict(): LeadsContextValue {
  const ctx = useContext(LeadsContext);
  if (!ctx) throw new Error("Leads hooks must be used within <LeadsProvider>");
  return ctx;
}

export function useLeadsState() {
  return useLeadsContextStrict().state;
}

export function useOpportunities(): Opportunity[] {
  return useLeadsContextStrict().state.opportunities;
}

export function useLeadsActions() {
  const { dispatch, state } = useLeadsContextStrict();

  return {
    setSearch: (searchTerm: string) =>
      dispatch({ type: "view:setSearch", searchTerm }),
    setStatusFilter: (status: LeadStatus | "all") =>
      dispatch({ type: "view:setStatus", status }),
    setSort: (sortKey: SortKey, sortDir: SortDir) =>
      dispatch({ type: "view:setSort", sortKey, sortDir }), //TODO: Fix sort on: id, status, source
    selectLead: (leadId: string | null) =>
      dispatch({ type: "view:select", leadId }),
    updateLead: (id: string, patch: Partial<Lead>) =>
      dispatch({ type: "lead:update", id, patch }),

    convertLead: (
      leadId: string,
      amount?: number,
      stage: OpportunityStage = "prospecting"
    ) => {
      const lead = state.leads.find((lead) => lead.id === leadId);
      if (!lead) return;

      const opp: Opportunity = {
        id: generateUuidV4(),
        name: lead.name,
        stage,
        amount,
        accountName: lead.company,
        leadId: lead.id,
        createdAt: new Date().toISOString(),
      };

      dispatch({ type: "opportunity:add", payload: opp });
      dispatch({
        type: "lead:update",
        id: lead.id,
        patch: { status: "converted" },
      });
    },
  };
}

function containsCI(text: string, query: string) {
  return text.toLocaleLowerCase().includes(query.toLocaleLowerCase());
}

export function useVisibleLeads(): Lead[] {
  const {
    leads,
    view: { searchTerm, statusFilter, sortKey, sortDir },
  } = useLeadsState();

  return useMemo(() => {
    let result = leads;

    if (searchTerm.trim()) {
      const q = searchTerm.trim();
      result = result.filter(
        (lead) => containsCI(lead.name, q) || containsCI(lead.company, q)
      );
    }
    if (statusFilter !== "all")
      result = result.filter((lead) => lead.status === statusFilter);

    result = [...result].sort((a, b) => {
      let primary =
        sortKey === "score"
          ? a.score - b.score
          : a.name.localeCompare(b.name, undefined, { sensitivity: "base" });
      if (primary === 0)
        primary = a.name.localeCompare(b.name, undefined, {
          sensitivity: "base",
        });
      return sortDir === "asc" ? primary : -primary;
    });

    return result;
  }, [leads, searchTerm, statusFilter, sortKey, sortDir]);
}
