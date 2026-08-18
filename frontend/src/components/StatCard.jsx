import { TrendingUp, TrendingDown } from "lucide-react";

/**
 * StatCard — modern dark SaaS analytics card
 * Props:
 *   label, value, sub, icon, gradient ("purple"|"green"|"blue"|"amber"),
 *   trend (number, optional), trendLabel (string, optional)
 */
export default function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  gradient = "purple",
  trend,
  trendLabel,
}) {
  const gradients = {
    purple: { bg: "bg-gradient-purple", icon: "text-accent",       ring: "bg-accent-soft" },
    green:  { bg: "bg-gradient-green",  icon: "text-brand-green",  ring: "bg-brand-greenLight" },
    blue:   { bg: "bg-gradient-blue",   icon: "text-brand-blue",   ring: "bg-brand-blueLight" },
    amber:  { bg: "bg-gradient-amber",  icon: "text-warning",      ring: "bg-warning-soft" },
  };
  const g = gradients[gradient] || gradients.purple;

  return (
    <div className={`card p-5 ${g.bg} transition-all duration-200 hover:border-surface-200 group`}
         style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.4)" }}>
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl ${g.ring} flex items-center justify-center flex-shrink-0`}>
          {Icon && <Icon size={19} className={g.icon} />}
        </div>
        {trend !== undefined && (
          <div className={trend >= 0 ? "trend-up" : "trend-down"}>
            {trend >= 0
              ? <TrendingUp size={13} />
              : <TrendingDown size={13} />
            }
            {Math.abs(trend)}%
          </div>
        )}
      </div>

      <div className="text-2xl font-bold text-text-primary tracking-tight">{value}</div>
      <div className="text-sm font-medium text-text-secondary mt-0.5">{label}</div>
      {sub && <div className="text-xs text-text-muted mt-1">{sub}</div>}
      {trendLabel && (
        <div className="text-xs text-text-muted mt-1">{trendLabel}</div>
      )}
    </div>
  );
}
