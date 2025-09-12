import { useEffect, useMemo, useReducer } from "react";
import leadsData from "@/data/leads.json";
import {
  LeadsContext,
  getInitialLeadsState,
  leadsReducer,
  persistLeadsView,
  persistLeads,
} from "@/state/leads/useLeads";

import type { Lead } from "@/types/types";
type LeadsProviderProps = { children: React.ReactNode };

export default function LeadsProvider({
  children,
}: Readonly<LeadsProviderProps>) {
  const [state, dispatch] = useReducer(
    leadsReducer,
    undefined,
    getInitialLeadsState
  );

  useEffect(() => {
    // Only load from JSON if no persisted leads exist
    if (state.leads.length === 0) {
      let mounted = true;
      (async () => {
        try {
          dispatch({ type: "load:start" });
          await new Promise((r) => setTimeout(r, 1200));
          const parsed: Lead[] = Array.isArray(leadsData)
            ? (leadsData as Lead[])
            : [];
          if (!mounted) return;
          dispatch({ type: "load:success", payload: parsed });
        } catch (err) {
          if (!mounted) return;
          const message =
            err instanceof Error ? err.message : "Failed to load leads.";
          dispatch({ type: "load:error", message });
        }
      })();
      return () => {
        mounted = false;
      };
    }
  }, [state.leads.length]);

  useEffect(() => {
    persistLeadsView(state.view);
  }, [state.view]);

  useEffect(() => {
    persistLeads(state.leads);
  }, [state.leads]);

  const value = useMemo(() => ({ state, dispatch }), [state]);

  return (
    <LeadsContext.Provider value={value}>{children}</LeadsContext.Provider>
  );
}
