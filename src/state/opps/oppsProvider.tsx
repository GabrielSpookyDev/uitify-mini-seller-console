import React, { useEffect, useMemo, useReducer } from "react";
import {
  OpportunitiesContext,
  getInitialOpportunitiesState,
  opportunitiesReducer,
  persistOpportunities,
  persistOpportunitiesView,
} from "@/state/opps/useOpps";

type Props = { children: React.ReactNode };

export default function OpportunitiesProvider({ children }: Readonly<Props>) {
  const [state, dispatch] = useReducer(
    opportunitiesReducer,
    undefined,
    getInitialOpportunitiesState
  );

  useEffect(() => {
    persistOpportunities(state.list);
  }, [state.list]);

  useEffect(() => {
    persistOpportunitiesView(state.view);
  }, [state.view]);

  const value = useMemo(() => ({ state, dispatch }), [state]);
  return (
    <OpportunitiesContext.Provider value={value}>
      {children}
    </OpportunitiesContext.Provider>
  );
}
