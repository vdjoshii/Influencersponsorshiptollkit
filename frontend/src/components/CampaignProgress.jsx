import { formatINR } from "../utils/formatters";
import { CheckCircle, Clock, XCircle, TrendingUp } from "lucide-react";

/**
 * Shows campaign budget utilisation and per-influencer deal progress.
 * Derived entirely from existing offers + brand data — no new API needed.
 */
export default function CampaignProgress({ offers = [], budget = 0 }) {
  const accepted = offers.filter((o) => o.status === "ACCEPTED");
  const pending  = offers.filter((o) => o.status === "PENDING");
  const rejected = offers.filter((o) => o.status === "REJECTED");

  const spent = accepted.reduce((s, o) => s + (o.proposedAmount || 0), 0);
  const committed = pending.reduce((s, o) => s + (o.proposedAmount || 0), 0);
  const total = budget || 1;

  const spentPct     = Math.min((spent / total) * 100, 100);
  const committedPct = Math.min((committed / total) * 100, 100 - spentPct);

  if (offers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <TrendingUp size={24} className="text-text-muted mb-2" />
        <p className="text-xs text-text-muted">No campaigns yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Budget bar */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-text-secondary">Budget Utilisation</span>
          <span className="text-xs text-text-muted">{formatINR(spent)} / {formatINR(budget)}</span>
        </div>
        <div className="h-2.5 bg-surface-100 rounded-full overflow-hidden flex">
          <div
            className="h-full bg-brand-green rounded-l-full transition-all duration-500"
            style={{ width: `${spentPct}%` }}
          />
          <div
            className="h-full bg-warning/60 transition-all duration-500"
            style={{ width: `${committedPct}%` }}
          />
        </div>
        <div className="flex items-center gap-4 mt-2">
          <span className="flex items-center gap-1.5 text-xs text-text-muted">
            <span className="w-2 h-2 rounded-full bg-brand-green inline-block" />
            Spent
          </span>
          <span className="flex items-center gap-1.5 text-xs text-text-muted">
            <span className="w-2 h-2 rounded-full bg-warning/60 inline-block" />
            Pending
          </span>
          <span className="flex items-center gap-1.5 text-xs text-text-muted">
            <span className="w-2 h-2 rounded-full bg-surface-200 inline-block" />
            Available
          </span>
        </div>
      </div>

      {/* Per-deal rows (top 5) */}
      <div className="space-y-2">
        {offers.slice(0, 5).map((offer) => {
          const pct = budget > 0 ? Math.min((offer.proposedAmount / budget) * 100, 100) : 0;
          const StatusIcon =
            offer.status === "ACCEPTED" ? CheckCircle
            : offer.status === "REJECTED" ? XCircle
            : Clock;
          const statusColor =
            offer.status === "ACCEPTED" ? "text-brand-green"
            : offer.status === "REJECTED" ? "text-danger"
            : "text-warning";

          return (
            <div key={offer.id} className="space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <StatusIcon size={13} className={`flex-shrink-0 ${statusColor}`} />
                  <span className="text-xs font-medium text-text-primary truncate">
                    {offer.influencer?.name}
                  </span>
                </div>
                <span className="text-xs text-text-muted flex-shrink-0 ml-2">
                  {formatINR(offer.proposedAmount)}
                </span>
              </div>
              <div className="h-1.5 bg-surface-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500
                    ${offer.status === "ACCEPTED" ? "bg-brand-green"
                    : offer.status === "REJECTED" ? "bg-danger/50"
                    : "bg-warning/60"}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
