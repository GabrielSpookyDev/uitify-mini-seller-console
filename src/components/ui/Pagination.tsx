import React from "react";

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
        Showing <span className="font-medium">{start}</span>-
        <span className="font-medium">{end}</span> of{" "}
        <span className="font-medium">{totalItems}</span>
      </div>

      <div className="flex items-center gap-3">
        {onPageSizeChange && (
          <label className="flex items-center gap-2 text-sm text-zinc-700">
            <span>Rows</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="rounded-xl border border-zinc-300 bg-white px-2.5 py-1.5 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              aria-label="Rows per page"
            >
              {pageSizeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </label>
        )}

        <nav
          className="inline-flex items-center gap-1.5"
          aria-label="Pagination"
        >
          <IconButton
            label="First page"
            disabled={!canPrev}
            onClick={() => goToPage(1)}
            icon={ChevronDoubleLeftIcon}
          />
          <IconButton
            label="Previous page"
            disabled={!canPrev}
            onClick={() => goToPage(page - 1)}
            icon={ChevronLeftIcon}
          />

          <span className="mx-2 min-w-[6rem] text-center text-sm text-zinc-700">
            Page <span className="font-medium">{page}</span> / {totalPages}
          </span>

          <IconButton
            label="Next page"
            disabled={!canNext}
            onClick={() => goToPage(page + 1)}
            icon={ChevronRightIcon}
          />
          <IconButton
            label="Last page"
            disabled={!canNext}
            onClick={() => goToPage(totalPages)}
            icon={ChevronDoubleRightIcon}
          />
        </nav>
      </div>
    </div>
  );
}

type IconRender = (props: React.SVGProps<SVGSVGElement>) => React.ReactNode;

function IconButton({
  label,
  onClick,
  disabled,
  icon: Icon,
}: Readonly<{
  label: string;
  onClick: () => void;
  disabled?: boolean;
  icon: IconRender;
}>) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={label}
      aria-label={label}
      className={[
        "inline-flex h-9 w-9 items-center justify-center rounded-full border text-zinc-700",
        "border-zinc-300 bg-white shadow-sm hover:bg-zinc-50",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500",
        "disabled:opacity-40 disabled:hover:bg-white",
      ].join(" ")}
    >
      {Icon({ className: "h-4 w-4", "aria-hidden": true })}
    </button>
  );
}

function ChevronLeftIcon(props: Readonly<React.SVGProps<SVGSVGElement>>) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      {...props}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15l-5-5 5-5" />
    </svg>
  );
}
function ChevronRightIcon(props: Readonly<React.SVGProps<SVGSVGElement>>) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      {...props}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 5l5 5-5 5" />
    </svg>
  );
}
function ChevronDoubleLeftIcon(props: Readonly<React.SVGProps<SVGSVGElement>>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      {...props}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M18 19l-7-7 7-7" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M11 19l-7-7 7-7" />
    </svg>
  );
}
function ChevronDoubleRightIcon(
  props: Readonly<React.SVGProps<SVGSVGElement>>
) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      {...props}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 5l7 7-7 7" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7" />
    </svg>
  );
}
