import { CheckCircle, XCircle, Clock, Send, TrendingUp } from "lucide-react";
import { formatINR } from "../utils/formatters";

const EVENT_CONFIG = {
  ACCEPTED: {
    icon: CheckCircle,
    color: "text-brand-green",
    bg: "bg-brand-greenLight",
    label: (o, isBrand) =>
      isBrand
        ? `${o.influencer?.name} accepted your offer`
        : `You accepted ${o.brand?.name}'s offer`,
  },
  REJECTED: {
    icon: XCircle,
    color: "text-danger",
    bg: "bg-danger-soft",
    label: (o, isBrand) =>
      isBrand
        ? `${o.influencer?.name} declined your offer`
        : `You declined ${o.brand?.name}'s offer`,
  },
  PENDING: {
    icon: isBrand => isBrand ? Send : Clock,
    color: "text-accent",
    bg: "bg-accent-soft",
    label: (o, isBrand) =>
      isBrand
        ? `Offer sent to ${o.influencer?.name}`
        : `New offer from ${o.brand?.name}`,
  },
};

export default function ActivityFeed({ offers = [], isBrand = true, maxItems = 8 }) {
  // Sort by id descending (newest first — proxy for time since no createdAt)
  const sorted = [...offers]
    .sort((a, b) => b.id - a.id)
    .slice(0, maxItems);

  if (sorted.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <TrendingUp size={24} className="text-text-muted mb-2" />
        <p className="text-xs text-text-muted">No activity yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-0">
      {sorted.map((offer, idx) => {
        const cfg = EVENT_CONFIG[offer.status] || EVENT_CONFIG.PENDING;
        const Icon = typeof cfg.icon === "function" && cfg.icon.length === 1
          ? cfg.icon(isBrand)
          : cfg.icon;
        const label = cfg.label(offer, isBrand);

        return (
          <div key={offer.id}
            className={`flex items-start gap-3 px-5 py-3.5 ${idx < sorted.length - 1 ? "border-b border-bg-border" : ""} hover:bg-surface-50 transition-colors`}>
            {/* Timeline dot */}
            <div className={`w-7 h-7 rounded-lg ${cfg.bg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
              <Icon size={14} className={cfg.color} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-text-primary font-medium leading-snug">{label}</p>
              <p className="text-xs text-text-muted mt-0.5">{formatINR(offer.proposedAmount)}</p>
            </div>
            <span className={`badge flex-shrink-0 mt-0.5
              ${offer.status === "ACCEPTED" ? "badge-accepted"
              : offer.status === "REJECTED" ? "badge-rejected"
              : "badge-pending"}`}>
              {offer.status === "ACCEPTED" ? "Accepted"
               : offer.status === "REJECTED" ? "Declined"
               : "Pending"}
            </span>
          </div>
        );
      })}
    </div>
  );
}
