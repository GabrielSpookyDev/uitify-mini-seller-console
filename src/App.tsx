import LeadsProvider from '@/state/leads/LeadsProvider';
import { useLeadsState } from '@/state/leads/useLeads';
import Header from '@/components/layout/Header';
import Card from '@/components/ui/Card';
import LeadsToolbar from '@/components/leads/LeadsToolbar';
import LeadsTable from '@/components/leads/LeadsTable';
import LeadDetailPanel from '@/components/leads/LeadDetailPanel';
import OpportunitiesTable from '@/components/opps/OpportunitiesTable';
import { HeroSkeleton, ToolbarSkeleton, TableSkeleton, Skeleton } from '@/components/ui/Skeleton';
import OpportunitiesProvider from './state/opps/oppsProvider';

function AppContent() {
  const { load } = useLeadsState();

  if (load.kind === 'loading' || load.kind === 'idle') {
    return (
      <main className="min-h-screen bg-gradient-to-b from-zinc-50 to-white">
        <HeroSkeleton />
        <section className="mx-auto max-w-6xl px-4 py-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-3">
            <div className="rounded-2xl border border-zinc-200 bg-white/70 p-4">
              <ToolbarSkeleton />
              <div className="mt-3" />
              <TableSkeleton rows={8} />
            </div>
          </div>
          <aside className="lg:col-span-1">
            <div className="rounded-2xl border border-zinc-200 bg-white/70 p-4">
              <Skeleton className="h-5 w-32 mb-2" />
              <Skeleton className="h-4 w-48" />
            </div>
          </aside>
        </section>
      </main>
    );
  }

  if (load.kind === 'error') {
    return (
      <main className="min-h-screen bg-gradient-to-b from-rose-50 to-white">
        <header className="bg-rose-600 text-white">
          <div className="mx-auto max-w-6xl px-4 py-8">
            <h1 className="text-2xl font-semibold tracking-tight">Mini Seller Console</h1>
            <p className="mt-1 text-sm leading-6 text-rose-100">We couldn't load your leads.</p>
          </div>
        </header>
        <section className="mx-auto max-w-6xl px-4 py-8">
          <div className="rounded-xl border border-rose-200 bg-white p-6 shadow-sm">
            <h2 className="text-rose-700 font-semibold">Something went wrong</h2>
            <p className="mt-1 text-sm text-rose-600">{load.message}</p>
            <p className="mt-2 text-xs text-rose-500">Tip: Refresh the page to retry.</p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-zinc-50 to-white">
      <Header />

      <section className="mx-auto max-w-6xl px-4 py-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card className="p-4">
            <LeadsToolbar />
            <div className="mt-3" />
            <LeadsTable />
          </Card>
        </div>

        <aside className="lg:col-span-1">
          <Card className="p-4">
            <h2 className="text-sm font-semibold text-zinc-900">Opportunities</h2>
            <div className="mt-3" />
            <OpportunitiesTable />
          </Card>
        </aside>

      </section>
      <LeadDetailPanel />
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
