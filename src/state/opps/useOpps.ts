import React, { createContext, useContext, useMemo } from "react";
import type { Opportunity, OpportunityStage } from "@/types/types";
import { loadOpportunities, saveOpportunities, clearOpportunities, loadOpportunitiesViewState, saveOpportunitiesViewState } from "@/lib/storage";

export interface OpportunitiesViewState {
  searchTerm: string;
  stageFilter: OpportunityStage | "all";
  sortDir: "asc" | "desc";
  selectedOpportunityId: string | null;
  pageSize: number;
}

const DEFAULT_OPPORTUNITIES_VIEW_STATE: OpportunitiesViewState = {
  searchTerm: "",
  stageFilter: "all",
  sortDir: "desc",
  selectedOpportunityId: null,
  pageSize: 10,
};

export type OpportunitiesState = {
  list: Opportunity[];
  view: OpportunitiesViewState;
};

export type OppsAction =
  | { type: "opps:add"; payload: Opportunity }
  | { type: "opps:load"; payload: Opportunity[] }
  | { type: "opps:clear" }
  | { type: "opps:reset" }
  | { type: "view:setSearch"; searchTerm: string }
  | { type: "view:setStage"; stage: OpportunityStage | "all" }
  | { type: "view:setSort"; sortDir: "asc" | "desc" }
  | { type: "view:select"; opportunityId: string | null }
  | { type: "view:setPageSize"; pageSize: number }
  | { type: "opp:update"; id: string; patch: Partial<Opportunity> };

export function getInitialOpportunitiesState(): OpportunitiesState {
  const persisted = loadOpportunities();
  const persistedView = loadOpportunitiesViewState();
  return { 
    list: persisted,
    view: persistedView ?? DEFAULT_OPPORTUNITIES_VIEW_STATE,
  };
}

const initialState: OpportunitiesState = { 
  list: [],
  view: DEFAULT_OPPORTUNITIES_VIEW_STATE,
};

export function opportunitiesReducer(
  state: OpportunitiesState,
  action: OppsAction
): OpportunitiesState {
  switch (action.type) {
    case "opps:add":
      return { ...state, list: [action.payload, ...state.list] };
    case "opps:load":
      return { ...state, list: action.payload };
    case "opps:clear":
      return { ...state, list: [] };
    case "opps:reset":
      return { ...state, list: [] };
    case "view:setSearch":
      return {
        ...state,
        view: { ...state.view, searchTerm: action.searchTerm },
      };
    case "view:setStage":
      return { ...state, view: { ...state.view, stageFilter: action.stage } };
    case "view:setSort":
      return { ...state, view: { ...state.view, sortDir: action.sortDir } };
    case "view:select":
      return {
        ...state,
        view: { ...state.view, selectedOpportunityId: action.opportunityId },
      };
    case "view:setPageSize":
      return { ...state, view: { ...state.view, pageSize: action.pageSize } };
    case "opp:update": {
      const nextList = state.list.map((opp) =>
        opp.id === action.id ? { ...opp, ...action.patch } : opp
      );
      return { ...state, list: nextList };
    }
    default:
      return state;
  }
}

export type OppsContextValue = {
  state: OpportunitiesState;
  dispatch: React.Dispatch<OppsAction>;
};

const OpportunitiesContext = createContext<OppsContextValue | undefined>(
  undefined
);

export function useOppsContextStrict(): OppsContextValue {
  const ctx = useContext(OpportunitiesContext);
  if (!ctx)
    throw new Error(
      "Opportunities hooks must be used within <OpportunitiesProvider>"
    );
  return ctx;
}

export function useOpportunitiesState() {
  return useOppsContextStrict().state;
}

export function useOpportunitiesActions() {
  const { dispatch } = useOppsContextStrict();
  return {
    add(opportunity: Opportunity) {
      dispatch({ type: "opps:add", payload: opportunity });
    },
    load(opportunities: Opportunity[]) {
      dispatch({ type: "opps:load", payload: opportunities });
    },
    clear() {
      dispatch({ type: "opps:clear" });
    },
    reset() {
      dispatch({ type: "opps:reset" });
      clearOpportunities();
    },
    setSearch: (searchTerm: string) =>
      dispatch({ type: "view:setSearch", searchTerm }),
    setStageFilter: (stage: OpportunityStage | "all") =>
      dispatch({ type: "view:setStage", stage }),
    setSort: (sortDir: "asc" | "desc") =>
      dispatch({ type: "view:setSort", sortDir }),
    selectOpportunity: (opportunityId: string | null) =>
      dispatch({ type: "view:select", opportunityId }),
    updateOpportunity: (id: string, patch: Partial<Opportunity>) =>
      dispatch({ type: "opp:update", id, patch }),
    setPageSize: (pageSize: number) =>
      dispatch({ type: "view:setPageSize", pageSize }),
  };
}

// Persist opportunities changes
export function persistOpportunities(opportunities: Opportunity[]) {
  saveOpportunities(opportunities);
}

// Persist view changes
export function persistOpportunitiesView(view: OpportunitiesViewState) {
  saveOpportunitiesViewState(view);
}

function containsCI(text: string, query: string) {
  return text.toLocaleLowerCase().includes(query.toLocaleLowerCase());
}

export function useVisibleOpportunities(): Opportunity[] {
  const {
    list,
    view: { searchTerm, stageFilter, sortDir },
  } = useOpportunitiesState();

  return useMemo(() => {
    let result = list;

    if (searchTerm.trim()) {
      const q = searchTerm.trim();
      result = result.filter(
        (opp) => containsCI(opp.name, q) || containsCI(opp.accountName, q)
      );
    }
    if (stageFilter !== "all")
      result = result.filter((opp) => opp.stage === stageFilter);

    // Sort by amount (undefined amounts go to end)
    result = [...result].sort((a, b) => {
      const aAmount = a.amount ?? -1;
      const bAmount = b.amount ?? -1;
      const comparison = aAmount - bAmount;
      return sortDir === "asc" ? comparison : -comparison;
    });

    return result;
  }, [list, searchTerm, stageFilter, sortDir]);
}

export { OpportunitiesContext, initialState as initialOpportunitiesState };
