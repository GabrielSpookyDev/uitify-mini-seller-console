import { useMemo } from "react";
import LeadsProvider from "@/state/leads/LeadsProvider";
import { useLeadsState } from "@/state/leads/useLeads";
import { AnimatePresence } from "motion/react";
import Header from "@/components/layout/Header";
import Card from "@/components/ui/Card";
import LeadsToolbar from "@/components/leads/LeadsToolbar";
import LeadsTable from "@/components/leads/LeadsTable";
import LeadDetailPanel from "@/components/leads/LeadDetailPanel";
import OpportunitiesTable from "@/components/opps/OpportunitiesTable";
import OpportunitiesToolbar from "@/components/opps/OpportunitiesToolbar";
import {
  HeroSkeleton,
  ToolbarSkeleton,
  TableSkeleton,
} from "@/components/ui/Skeleton";
import OpportunitiesProvider from "@/state/opps/oppsProvider";

function AppContent() {
  const { load, view, leads } = useLeadsState();
  const selectedLead = useMemo(
    () => leads.find((lead) => lead.id === view.selectedLeadId) || null,
    [leads, view.selectedLeadId]
  );

  if (load.kind === "loading" || load.kind === "idle") {
    return (
      <main className="min-h-screen bg-gradient-to-b from-zinc-50 to-white">
        <HeroSkeleton />
        <section className="mx-auto max-w-6xl px-4 py-6">
          <div className="space-y-3">
            <div className="rounded-2xl border border-zinc-200 bg-white/70 p-4">
              <ToolbarSkeleton />
              <div className="mt-3" />
              <TableSkeleton rows={12} />
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (load.kind === "error") {
    return (
      <main className="min-h-screen bg-gradient-to-b from-rose-50 to-white">
        <header className="bg-rose-600 text-white">
          <div className="mx-auto max-w-6xl px-4 py-8">
            <h1 className="text-2xl font-semibold tracking-tight">
              Mini Seller Console
            </h1>
            <p className="mt-1 text-sm leading-6 text-rose-100">
              We couldn't load your leads.
            </p>
          </div>
        </header>
        <section className="mx-auto max-w-6xl px-4 py-8">
          <div className="rounded-xl border border-rose-200 bg-white p-6 shadow-sm">
            <h2 className="text-rose-700 font-semibold">
              Something went wrong
            </h2>
            <p className="mt-1 text-sm text-rose-600">{load.message}</p>
            <p className="mt-2 text-xs text-rose-500">
              Tip: Refresh the page to retry.
            </p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-zinc-50 to-white">
      <Header />

      <section className="flex flex-col mx-auto max-w-6xl px-4 py-6">
        <div>
          <Card className="p-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <h2 className="font-semibold text-zinc-900 md:text-xl">Leads</h2>
              <div className="min-w-1/2">
                <LeadsToolbar />
              </div>
            </div>
            <div className="mt-3" />
            <LeadsTable />
          </Card>
        </div>

        <aside>
          <Card className="p-4 mt-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <h2 className="font-semibold text-zinc-900 md:text-xl">
                Opportunities
              </h2>
              <div className="min-w-1/2">
                <OpportunitiesToolbar />
              </div>
            </div>
            <div className="mt-3" />
            <OpportunitiesTable />
          </Card>
        </aside>
      </section>
      <AnimatePresence>
        {selectedLead && (
          <LeadDetailPanel key={selectedLead.id} selectedLead={selectedLead} />
        )}
      </AnimatePresence>
    </main>
  );
}

export default function App() {
  return (
    <OpportunitiesProvider>
      <LeadsProvider>
        <AppContent />
      </LeadsProvider>
    </OpportunitiesProvider>
  );
}
