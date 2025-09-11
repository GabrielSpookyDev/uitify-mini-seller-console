import { memo, useMemo, useState } from 'react';
import { useLeadsActions, useVisibleLeads } from '@/state/leads/useLeads';
import Pagination from '@/components/ui/Pagination';
import Badge from '@/components/ui/Badge';

import type { Tone } from '@/components/ui/Badge';

export default function LeadsTable() {
  const allLeads = useVisibleLeads();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const total = allLeads.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const pageItems = useMemo(() => {
    const startIdx = (page - 1) * pageSize;
    return allLeads.slice(startIdx, startIdx + pageSize);
  }, [allLeads, page, pageSize]);

  if (page > totalPages) queueMicrotask(() => setPage(totalPages));

  if (total === 0) {
    return (
      <div className="rounded-xl border border-zinc-200 p-6 text-center">
        <p className="text-zinc-800 font-medium">No results</p>
        <p className="mt-1 text-sm text-zinc-600">Try clearing search or changing filters.</p>
      </div>
    );
  }
// TODO: Improve accessibility (e.g., keyboard navigation, screen reader support)
// TODO: Fix horizontal scrolling
// TODO: Add sorting
  return (
    <div className="space-y-3">
      <div className="overflow-hidden rounded-2xl border border-zinc-200">
        <div className="max-h-[70vh] overflow-auto">
          <table className="min-w-full table-fixed" role="table">
            <thead className="sticky top-0 z-10 bg-zinc-50/95 backdrop-blur supports-[backdrop-filter]:bg-zinc-50/75">
              <tr className="text-left text-sm text-zinc-600">
                <th className="px-3 py-2 w-40">Name</th>
                <th className="px-3 py-2 w-40">Company</th>
                <th className="px-3 py-2">Email</th>
                <th className="px-3 py-2 w-20">Source</th>
                <th className="px-3 py-2 w-16">Score</th>
                <th className="px-3 py-2 w-28">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {pageItems.map((lead) => (
                <LeadRow key={lead.id} lead={lead} />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination
        page={page}
        pageSize={pageSize}
        totalItems={total}
        onPageChange={setPage}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setPage(1);
        }}
      />
    </div>
  );
}

const LeadRow = memo(function LeadRow({ lead }: { lead: ReturnType<typeof useVisibleLeads>[number] }) {
  const { selectLead } = useLeadsActions();
  let tone: Tone;
  switch (lead.status) {
    case 'qualified':
      tone = 'green';
      break;
    case 'contacted':
      tone = 'amber';
      break;
    case 'new':
      tone = 'indigo';
      break;
    case 'unqualified':
      tone = 'rose';
      break;
    default:
      tone = 'neutral';
  }

  return (
    <tr
      className="odd:bg-white even:bg-zinc-50/50 hover:bg-indigo-50/50 cursor-pointer"
      onClick={() => selectLead(lead.id)}
      aria-label={`Open details for ${lead.name}`}
    >
      <td className="px-3 py-2 text-sm font-medium text-zinc-900">{lead.name}</td>
      <td className="px-3 py-2 text-sm text-zinc-800">{lead.company}</td>
      <td className="px-3 py-2 text-sm text-zinc-700">{lead.email}</td>
      <td className="px-3 py-2 text-xs uppercase tracking-wide text-zinc-500">{lead.source}</td>
      <td className="px-3 py-2 text-sm tabular-nums">{lead.score}</td>
      <td className="px-3 py-2"><Badge tone={tone}>{lead.status}</Badge></td>
    </tr>
  );
});
