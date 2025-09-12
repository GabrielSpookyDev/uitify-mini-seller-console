import Select from "@/components/ui/Select";
import IconButton from "@/components/ui/IconButton";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

type Props = {
  page: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: number[];
};

export default function Pagination({
  page,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50],
}: Readonly<Props>) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const canPrev = page > 1;
  const canNext = page < totalPages;

  const start = totalItems === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(totalItems, page * pageSize);

  const goToPage = (p: number) =>
    onPageChange(Math.min(totalPages, Math.max(1, p)));

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="text-sm text-zinc-600">
        Showing <span className="font-medium">{start}</span> -{" "}
        <span className="font-medium">{end}</span> of{" "}
        <span className="font-medium">{totalItems}</span>
      </div>

      <div className="flex items-center gap-3">
        {onPageSizeChange && (
          <label className="flex items-center gap-2 text-sm text-zinc-700">
            <span>Rows</span>
            <Select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="rounded-xl border border-zinc-300 bg-white px-2.5 py-1.5 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 hover:cursor-pointer"
              aria-label="Rows per page"
            >
              {pageSizeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </Select>
          </label>
        )}

        <nav
          className="inline-flex items-center gap-1.5"
          aria-label="Pagination"
        >
          <IconButton
            disabled={!canPrev}
            onClick={() => goToPage(1)}
            icon={ChevronsLeft}
          />
          <IconButton
            disabled={!canPrev}
            onClick={() => goToPage(page - 1)}
            icon={ChevronLeft}
          />

          <span className="mx-2 min-w-[6rem] text-center text-sm text-zinc-700">
            Page <span className="font-medium">{page}</span> / {totalPages}
          </span>

          <IconButton
            disabled={!canNext}
            onClick={() => goToPage(page + 1)}
            icon={ChevronRight}
          />
          <IconButton
            disabled={!canNext}
            onClick={() => goToPage(totalPages)}
            icon={ChevronsRight}
          />
        </nav>
      </div>
    </div>
  );
}
