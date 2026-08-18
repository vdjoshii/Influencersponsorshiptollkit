export function Spinner({ size = "md" }) {
  const sizes = { sm: "w-4 h-4", md: "w-8 h-8", lg: "w-12 h-12" };
  return (
    <div
      className={`${sizes[size]} border-2 border-bg-border border-t-accent rounded-full animate-spin`}
    />
  );
}

export function PageLoader() {
  return (
    <div className="flex items-center justify-center h-48">
      <Spinner size="md" />
    </div>
  );
}

export function SkeletonRow() {
  return (
    <div className="flex gap-4 px-5 py-4 border-b border-bg-border animate-pulse">
      <div className="w-8 h-8 bg-bg-hover rounded-lg flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-3 bg-bg-hover rounded w-1/3" />
        <div className="h-3 bg-bg-hover rounded w-1/5" />
      </div>
      <div className="h-6 bg-bg-hover rounded-lg w-16" />
    </div>
  );
}