import { useEffect, useRef, useState } from "react";
import { useOpportunitiesActions, useOpportunitiesState } from "@/state/opps/useOpps";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import { ArrowUp, ArrowDown } from "lucide-react";
import type { OpportunityStage } from "@/types/types";

const STAGE_OPTIONS: Array<OpportunityStage | "all"> = [
  "all",
  "prospecting",
  "proposal",
  "negotiation",
  "won",
  "lost",
];

export default function OpportunitiesToolbar() {
  const { view } = useOpportunitiesState();
  const { setSearch, setStageFilter, setSort } = useOpportunitiesActions();

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
    setSort(view.sortDir === "desc" ? "asc" : "desc");

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="flex flex-1 items-center gap-2">
        <label htmlFor="opp-search" className="sr-only">
          Search opportunities
        </label>
        <Input
          id="opp-search"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search name or account…"
          aria-label="Search opportunities by name or account"
          className="sm:max-w-xs"
        />

        <label htmlFor="stage-filter" className="sr-only">
          Filter by stage
        </label>
        <Select
          id="stage-filter"
          value={view.stageFilter}
          onChange={(e) =>
            setStageFilter(e.target.value as OpportunityStage | "all")
          }
          aria-label="Filter by stage"
        >
          {STAGE_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </Select>

        <Button
          onClick={toggleSort}
          label="Amount"
          variant="secondary"
          reverseLabel
          icon={view.sortDir === "desc" ? ArrowDown : ArrowUp}
          size={16}
        />
      </div>
    </div>
  );
}