import React, { createContext, useContext } from "react";
import type { Opportunity } from "@/types/types";

export type OpportunitiesState = {
  list: Opportunity[];
};

export type OppsAction =
  | { type: "opps:add"; payload: Opportunity }
  | { type: "opps:clear" }; // handy for tests/demos

const initialState: OpportunitiesState = { list: [] };

export function opportunitiesReducer(
  state: OpportunitiesState,
  action: OppsAction
): OpportunitiesState {
  switch (action.type) {
    case "opps:add":
      return { ...state, list: [action.payload, ...state.list] };
    case "opps:clear":
      return { ...state, list: [] };
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
    clear() {
      dispatch({ type: "opps:clear" });
    },
  };
}

export { OpportunitiesContext, initialState as initialOpportunitiesState };
