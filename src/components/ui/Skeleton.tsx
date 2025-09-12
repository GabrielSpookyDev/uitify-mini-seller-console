export function Skeleton({ className = "" }: Readonly<{ className?: string }>) {
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
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <Skeleton className="h-8 w-72 bg-white/30" />
            <Skeleton className="mt-3 h-4 w-96 bg-white/20" />
            <Skeleton className="mt-3 h-4 w-48 bg-white/20" />
          </div>
          <div className="mt-16 flex flex-wrap gap-2">
            <Skeleton className="h-6 w-20 rounded-full bg-white/20" />
            <Skeleton className="h-6 w-32 rounded-full bg-white/20" />
          </div>
        </div>
      </div>
    </header>
  );
}

export function ToolbarSkeleton() {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <Skeleton className="h-5 w-32" />
      <div className="flex flex-1 justify-end items-center gap-2">
        <Skeleton className="h-9 w-72" />
        <Skeleton className="h-9 w-28" />
        <Skeleton className="h-9 w-20" />
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 8 }: Readonly<{ rows?: number }>) {
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
            <Skeleton key={i} className="h-10 " />
          ))}
        </div>
      </div>
    </div>
  );
}
