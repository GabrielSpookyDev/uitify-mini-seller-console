import { useEffect, useRef, useState } from "react";
import { useLeadsActions, useLeadsState } from "@/state/leads/useLeads";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import { ArrowUp, ArrowDown } from "lucide-react";
import type { LeadStatus } from "@/types/types";

const STATUS_OPTIONS: Array<LeadStatus | "all"> = [
  "all",
  "new",
  "contacted",
  "qualified",
  "unqualified",
  "converted",
];

export default function LeadsToolbar() {
  const { view } = useLeadsState();
  const { setSearch, setStatusFilter, setSort } = useLeadsActions();

  const [searchInput, setSearchInput] = useState(view.searchTerm);
  const debounceRef = useRef<number | null>(null);
  const debounceValue = 250;

  useEffect(() => setSearchInput(view.searchTerm), [view.searchTerm]);

  useEffect(() => {
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(
      () => setSearch(searchInput),
      debounceValue
    );
    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    };
  }, [searchInput, setSearch]);

  const toggleSort = () =>
    setSort("score", view.sortDir === "desc" ? "asc" : "desc");

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 items-center gap-2">
        <label htmlFor="lead-search" className="sr-only">
          Search leads
        </label>
        <Input
          id="lead-search"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search name or company…"
          aria-label="Search leads by name or company"
          className="sm:max-w-xs"
        />

        <label htmlFor="status-filter" className="sr-only">
          Filter by status
        </label>
        <Select
          id="status-filter"
          value={view.statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value as LeadStatus | "all")
          }
          aria-label="Filter by status"
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </Select>

        <Button
          onClick={toggleSort}
          label="Score"
          variant="secondary"
          reverseLabel
          icon={view.sortDir === "desc" ? ArrowDown : ArrowUp}
          size={16}
        />
      </div>
    </div>
  );
}
