/* ─── Spinner ─────────────────────────────────────────────── */
export function Spinner({ size = "md" }) {
  const s = { sm: "w-4 h-4 border-2", md: "w-6 h-6 border-2", lg: "w-10 h-10 border-[3px]" }[size];
  return (
    <div className={`${s} border-surface-200 border-t-accent rounded-full animate-spin`} />
  );
}

export function PageSpinner() {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-3">
      <Spinner size="lg" />
      <span className="text-xs text-text-muted animate-pulse">Loading…</span>
    </div>
  );
}

/* ─── Skeleton primitives ─────────────────────────────────── */
export function Skeleton({ className = "" }) {
  return (
    <div className={`bg-surface-100 rounded-lg animate-pulse ${className}`} />
  );
}

/* ─── Stat card skeleton ──────────────────────────────────── */
export function CardSkeleton() {
  return (
    <div className="card p-5 space-y-3 animate-pulse">
      <div className="flex items-start justify-between">
        <Skeleton className="w-10 h-10 rounded-xl" />
      </div>
      <Skeleton className="h-7 w-1/2" />
      <Skeleton className="h-3.5 w-2/3" />
      <Skeleton className="h-3 w-1/2" />
    </div>
  );
}

/* ─── Table row skeleton ──────────────────────────────────── */
export function TableRowSkeleton({ cols = 4 }) {
  return (
    <tr className="border-b border-bg-border">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-5 py-4">
          <Skeleton className={`h-4 ${i === 0 ? "w-3/4" : "w-full"}`} />
        </td>
      ))}
    </tr>
  );
}

/* ─── Profile header skeleton ─────────────────────────────── */
export function ProfileSkeleton() {
  return (
    <div className="flex items-start gap-4 animate-pulse">
      <Skeleton className="w-14 h-14 rounded-2xl flex-shrink-0" />
      <div className="space-y-2 flex-1">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-32" />
      </div>
    </div>
  );
}

/* ─── Stats grid skeleton ─────────────────────────────────── */
export function StatsGridSkeleton({ count = 4 }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}
