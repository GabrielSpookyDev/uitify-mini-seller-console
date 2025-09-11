import React, { useMemo, useReducer } from "react";
import {
  OpportunitiesContext,
  initialOpportunitiesState,
  opportunitiesReducer,
} from "@/state/opps/useOpps";

type Props = { children: React.ReactNode };

export default function OpportunitiesProvider({ children }: Readonly<Props>) {
  const [state, dispatch] = useReducer(
    opportunitiesReducer,
    initialOpportunitiesState
  );
  const value = useMemo(() => ({ state, dispatch }), [state]);
  return (
    <OpportunitiesContext.Provider value={value}>
      {children}
    </OpportunitiesContext.Provider>
  );
}
