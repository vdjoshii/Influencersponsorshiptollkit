export function Input({ label, error, className = "", ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-xs font-medium text-text-secondary uppercase tracking-wider">
          {label}
        </label>
      )}
      <input
        className={`
          w-full bg-bg-secondary border border-bg-border rounded-xl px-4 py-2.5
          text-text-primary placeholder-text-muted text-sm
          focus:outline-none focus:border-accent/60 focus:ring-1 focus:ring-accent/20
          transition-all duration-200
          ${error ? "border-danger/60" : ""}
          ${className}
        `}
        {...props}
      />
      {error && <span className="text-xs text-danger">{error}</span>}
    </div>
  );
}

export function Select({ label, error, children, className = "", ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-xs font-medium text-text-secondary uppercase tracking-wider">
          {label}
        </label>
      )}
      <select
        className={`
          w-full bg-bg-secondary border border-bg-border rounded-xl px-4 py-2.5
          text-text-primary text-sm
          focus:outline-none focus:border-accent/60 focus:ring-1 focus:ring-accent/20
          transition-all duration-200 cursor-pointer
          ${error ? "border-danger/60" : ""}
          ${className}
        `}
        {...props}
      >
        {children}
      </select>
      {error && <span className="text-xs text-danger">{error}</span>}
    </div>
  );
}