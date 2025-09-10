import React from 'react';
import { useLeadsState, useVisibleLeads } from '@/state/leads/useLeads';

function StatChip({ label, value }: Readonly<{ label: string; value: React.ReactNode }>) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 text-sm ring-1 ring-white/30">
      <span className="text-indigo-100">{label}:</span>
      <span className="font-semibold text-white">{value}</span>
    </span>
  );
}

export default function Header() {
  const { view, leads } = useLeadsState();
  const visibleLeads = useVisibleLeads();

  return (
    <header className="relative overflow-hidden text-white">
      <div className="absolute inset-0 bg-mesh" />
      <div className="absolute inset-0 bg-noise" />
      <div className="absolute inset-0 bg-grid mask-radial" />

      <div className="relative mx-auto max-w-6xl px-4 py-12">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Mini Seller Console</h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-indigo-100/90">
              Triage leads and convert them into opportunities. Local-first, fast, and beautiful.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <StatChip label="Leads" value={leads.length} />
            <StatChip label="Visible" value={visibleLeads.length} />
            <StatChip label="Sort" value={`${view.sortKey} ${view.sortDir === 'desc' ? '↓' : '↑'}`} />
            <StatChip label="Status" value={view.statusFilter} />
          </div>
        </div>
      </div>
    </header>
  );
}
