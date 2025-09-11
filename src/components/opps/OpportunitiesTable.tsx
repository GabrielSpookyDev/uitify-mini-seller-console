import { useOpportunitiesState } from "@/state/opps/useOpps";

export default function OpportunitiesTable() {
  const { list } = useOpportunitiesState();

  if (list.length === 0) {
    return (
      <div className="rounded-xl border border-zinc-200 p-4 text-sm text-zinc-600">
        No opportunities yet. Convert a lead to see it here.
      </div>
    );
  }
  // TODO: Improve accessibility (e.g., keyboard navigation, screen reader support)
  // TODO: Fix horizontal scrolling
  // TODO: Add pagination and sorting
  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-200">
      <div className="max-h-[70vh] overflow-auto">
        <table className="min-w-full table-fixed">
          <thead className="sticky top-0 z-10 bg-zinc-50/95 backdrop-blur">
            <tr className="text-left text-sm text-zinc-600">
              <th className="px-3 py-2 w-56">Name</th>
              <th className="px-3 py-2 w-40">Account</th>
              <th className="px-3 py-2 w-32">Stage</th>
              <th className="px-3 py-2 w-28">Amount</th>
              <th className="px-3 py-2 w-40">Created</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {list.map((opp) => (
              <tr key={opp.id} className="odd:bg-white even:bg-zinc-50/50">
                <td className="px-3 py-2 text-sm font-medium text-zinc-900">
                  {opp.name}
                </td>
                <td className="px-3 py-2 text-sm text-zinc-800">
                  {opp.accountName}
                </td>
                <td className="px-3 py-2 text-sm text-zinc-700">{opp.stage}</td>
                <td className="px-3 py-2 text-sm tabular-nums">
                  {opp.amount != null
                    ? new Intl.NumberFormat(undefined, {
                        style: "currency",
                        currency: "USD",
                      }).format(opp.amount)
                    : "—"}
                </td>
                <td className="px-3 py-2 text-sm text-zinc-700">
                  {new Date(opp.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
