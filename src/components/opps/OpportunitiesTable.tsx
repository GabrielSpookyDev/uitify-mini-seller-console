import { useMemo, useState, memo } from "react";
import { motion } from "motion/react";
import {
  useVisibleOpportunities,
  useOpportunitiesActions,
  useOpportunitiesState,
} from "@/state/opps/useOpps";
import Pagination from "@/components/ui/Pagination";
import type { Opportunity } from "@/types/types";

export default function OpportunitiesTable() {
  const list = useVisibleOpportunities();
  const { view } = useOpportunitiesState();
  const { setPageSize } = useOpportunitiesActions();
  const [page, setPage] = useState(1);
  const pageSize = view.pageSize;

  const total = list.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const pageItems = useMemo(() => {
    const startIdx = (page - 1) * pageSize;
    return list.slice(startIdx, startIdx + pageSize);
  }, [list, page, pageSize]);

  if (page > totalPages) queueMicrotask(() => setPage(totalPages));

  if (total === 0) {
    return (
      <div className="rounded-xl border border-zinc-200 p-4 text-sm text-zinc-600">
        No opportunities yet. Convert a lead to see it here.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="overflow-hidden rounded-2xl border border-zinc-200">
        <div className="max-h-[70vh] overflow-auto">
          <table className="min-w-full table-fixed">
            <thead className="sticky top-0 z-10 bg-zinc-50/95 backdrop-blur">
              <tr className="text-left text-sm text-zinc-600">
                <th className="px-3 py-2 w-32">ID</th>
                <th className="px-3 py-2 w-56">Name</th>
                <th className="px-3 py-2 w-32">Stage</th>
                <th className="px-3 py-2 w-28">Amount</th>
                <th className="px-3 py-2 w-40">Account</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {pageItems.map((opp) => (
                <OpportunityRow key={opp.id} opportunity={opp} />
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

const OpportunityRow = memo(function OpportunityRow({
  opportunity,
}: {
  opportunity: Opportunity;
}) {
  const { selectOpportunity } = useOpportunitiesActions();

  return (
    <motion.tr
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className="odd:bg-white even:bg-zinc-50/50 hover:bg-indigo-50/50 cursor-pointer"
      onClick={() => selectOpportunity(opportunity.id)}
      aria-label={`Open details for ${opportunity.name}`}
    >
      <td
        className="px-3 py-2 text-sm font-medium text-zinc-900"
        title={opportunity.id}
      >
        {opportunity.id.slice(0, 8)}...
      </td>
      <td className="px-3 py-2 text-sm font-medium text-zinc-900">
        {opportunity.name}
      </td>
      <td className="px-3 py-2 text-sm text-zinc-700">{opportunity.stage}</td>
      <td className="px-3 py-2 text-sm tabular-nums">
        {opportunity.amount != null
          ? new Intl.NumberFormat(undefined, {
              style: "currency",
              currency: "USD",
            }).format(opportunity.amount)
          : "—"}
      </td>
      <td className="px-3 py-2 text-sm text-zinc-800">
        {opportunity.accountName}
      </td>
    </motion.tr>
  );
});
