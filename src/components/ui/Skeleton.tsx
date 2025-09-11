export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={[
        "animate-shimmer rounded-md bg-zinc-200/50 relative",
        className,
      ].join(" ")}
      aria-hidden
    />
  );
}

export function HeroSkeleton() {
  return (
    <header className="relative overflow-hidden text-white">
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-violet-600" />
      <div className="absolute inset-0 bg-white/10" />
      <div className="relative mx-auto max-w-6xl px-4 py-12">
        <Skeleton className="h-8 w-72 bg-white/30" />
        <Skeleton className="mt-3 h-4 w-96 bg-white/20" />
        <div className="mt-6 flex flex-wrap gap-2">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-6 w-20 rounded-full bg-white/20" />
          ))}
        </div>
      </div>
    </header>
  );
}

export function ToolbarSkeleton() {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 items-center gap-2">
        <Skeleton className="h-9 w-48" />
        <Skeleton className="h-9 w-28" />
        <Skeleton className="h-9 w-20" />
      </div>
      <Skeleton className="h-5 w-32" />
    </div>
  );
}

export function TableSkeleton({ rows = 8 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white/70 p-2">
        <div className="mb-2 flex gap-3 px-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-14" />
          <Skeleton className="h-4 w-20" />
        </div>
        <div className="space-y-2">
          {Array.from({ length: rows }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      </div>
    </div>
  );
}
