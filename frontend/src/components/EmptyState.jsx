import { PackageOpen } from "lucide-react";

export default function EmptyState({
  title = "Nothing here yet",
  subtitle = "",
  action,
  icon: Icon = PackageOpen,
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center px-4">
      <div className="w-14 h-14 rounded-2xl bg-surface-50 border border-bg-border flex items-center justify-center mb-4">
        <Icon size={24} className="text-text-muted" />
      </div>
      <p className="text-text-primary font-semibold text-sm">{title}</p>
      {subtitle && (
        <p className="text-text-muted text-xs mt-1.5 max-w-xs leading-relaxed">{subtitle}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
