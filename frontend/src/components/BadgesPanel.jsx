import { Trophy, Zap, Star, TrendingUp, Users, Award, Target, Flame, Crown, Shield } from "lucide-react";

/**
 * Gamification Badges — derived entirely from existing offer/influencer data.
 * Works for both BRAND and INFLUENCER roles.
 */

// ── Badge definitions ──────────────────────────────────────────────────────
const BRAND_BADGES = [
  {
    id: "first_offer",
    icon: Zap,
    label: "First Move",
    desc: "Sent your first sponsorship offer",
    color: "text-accent",
    bg: "bg-accent-soft",
    border: "border-accent/20",
    check: ({ offers }) => offers.length >= 1,
  },
  {
    id: "deal_maker",
    icon: Trophy,
    label: "Deal Maker",
    desc: "Closed 3 accepted deals",
    color: "text-warning",
    bg: "bg-warning-soft",
    border: "border-warning/20",
    check: ({ accepted }) => accepted >= 3,
  },
  {
    id: "big_spender",
    icon: TrendingUp,
    label: "Big Spender",
    desc: "Spent ₹1L+ on campaigns",
    color: "text-brand-green",
    bg: "bg-brand-greenLight",
    border: "border-success/20",
    check: ({ totalSpent }) => totalSpent >= 100_000,
  },
  {
    id: "scout",
    icon: Users,
    label: "Talent Scout",
    desc: "Worked with 5+ creators",
    color: "text-brand-blue",
    bg: "bg-brand-blueLight",
    border: "border-brand-blue/20",
    check: ({ uniqueInfluencers }) => uniqueInfluencers >= 5,
  },
  {
    id: "power_brand",
    icon: Crown,
    label: "Power Brand",
    desc: "Spent ₹5L+ on campaigns",
    color: "text-warning",
    bg: "bg-warning-soft",
    border: "border-warning/20",
    check: ({ totalSpent }) => totalSpent >= 500_000,
  },
  {
    id: "networker",
    icon: Target,
    label: "Networker",
    desc: "Sent 10+ offers",
    color: "text-accent",
    bg: "bg-accent-soft",
    border: "border-accent/20",
    check: ({ offers }) => offers.length >= 10,
  },
];

const INFLUENCER_BADGES = [
  {
    id: "first_deal",
    icon: Zap,
    label: "First Deal",
    desc: "Accepted your first sponsorship",
    color: "text-accent",
    bg: "bg-accent-soft",
    border: "border-accent/20",
    check: ({ accepted }) => accepted >= 1,
  },
  {
    id: "rising_star",
    icon: Star,
    label: "Rising Star",
    desc: "Earned ₹10K+ from sponsorships",
    color: "text-warning",
    bg: "bg-warning-soft",
    border: "border-warning/20",
    check: ({ totalEarnings }) => totalEarnings >= 10_000,
  },
  {
    id: "influencer_pro",
    icon: Award,
    label: "Influencer Pro",
    desc: "Completed 5 brand deals",
    color: "text-brand-green",
    bg: "bg-brand-greenLight",
    border: "border-success/20",
    check: ({ accepted }) => accepted >= 5,
  },
  {
    id: "top_earner",
    icon: TrendingUp,
    label: "Top Earner",
    desc: "Earned ₹1L+ total",
    color: "text-brand-blue",
    bg: "bg-brand-blueLight",
    border: "border-brand-blue/20",
    check: ({ totalEarnings }) => totalEarnings >= 100_000,
  },
  {
    id: "hot_creator",
    icon: Flame,
    label: "Hot Creator",
    desc: "3+ pending offers at once",
    color: "text-danger",
    bg: "bg-danger-soft",
    border: "border-danger/20",
    check: ({ pending }) => pending >= 3,
  },
  {
    id: "elite",
    icon: Crown,
    label: "Elite Creator",
    desc: "Earned ₹5L+ total",
    color: "text-warning",
    bg: "bg-warning-soft",
    border: "border-warning/20",
    check: ({ totalEarnings }) => totalEarnings >= 500_000,
  },
  {
    id: "trusted",
    icon: Shield,
    label: "Trusted Partner",
    desc: "Worked with 3+ different brands",
    color: "text-accent",
    bg: "bg-accent-soft",
    border: "border-accent/20",
    check: ({ uniqueBrands }) => uniqueBrands >= 3,
  },
];

function computeBrandStats(offers) {
  const accepted = offers.filter((o) => o.status === "ACCEPTED");
  return {
    offers,
    accepted: accepted.length,
    totalSpent: accepted.reduce((s, o) => s + (o.proposedAmount || 0), 0),
    uniqueInfluencers: new Set(accepted.map((o) => o.influencer?.id)).size,
  };
}

function computeInfluencerStats(offers, influencer) {
  const accepted = offers.filter((o) => o.status === "ACCEPTED");
  return {
    accepted: accepted.length,
    pending: offers.filter((o) => o.status === "PENDING").length,
    totalEarnings: influencer?.totalEarnings || 0,
    uniqueBrands: new Set(accepted.map((o) => o.brand?.id)).size,
  };
}

export default function BadgesPanel({ role, offers = [], influencer = null }) {
  const isBrand = role === "BRAND";
  const badges  = isBrand ? BRAND_BADGES : INFLUENCER_BADGES;
  const stats   = isBrand
    ? computeBrandStats(offers)
    : computeInfluencerStats(offers, influencer);

  const earned  = badges.filter((b) => b.check(stats));
  const locked  = badges.filter((b) => !b.check(stats));

  return (
    <div className="space-y-4">
      {/* Earned */}
      {earned.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-3">
            Earned · {earned.length}/{badges.length}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {earned.map((b) => {
              const Icon = b.icon;
              return (
                <div key={b.id}
                  className={`card p-3.5 border ${b.border} ${b.bg} flex flex-col items-center text-center gap-2`}>
                  <div className={`w-10 h-10 rounded-xl ${b.bg} border ${b.border} flex items-center justify-center`}>
                    <Icon size={20} className={b.color} />
                  </div>
                  <div>
                    <div className={`text-xs font-bold ${b.color}`}>{b.label}</div>
                    <div className="text-[10px] text-text-muted mt-0.5 leading-tight">{b.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Locked */}
      {locked.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">
            Locked · {locked.length} remaining
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {locked.map((b) => {
              const Icon = b.icon;
              return (
                <div key={b.id}
                  className="card p-3.5 flex flex-col items-center text-center gap-2 opacity-40">
                  <div className="w-10 h-10 rounded-xl bg-surface-100 flex items-center justify-center">
                    <Icon size={20} className="text-text-muted" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-text-muted">{b.label}</div>
                    <div className="text-[10px] text-text-muted mt-0.5 leading-tight">{b.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {earned.length === 0 && (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <Trophy size={28} className="text-text-muted mb-2" />
          <p className="text-sm font-semibold text-text-primary">No badges yet</p>
          <p className="text-xs text-text-muted mt-1">
            {isBrand ? "Send your first offer to start earning badges" : "Accept your first deal to start earning badges"}
          </p>
        </div>
      )}
    </div>
  );
}
