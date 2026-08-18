import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, ChevronRight, Info, Plus } from "lucide-react";
import { rankInfluencers, TIER_STYLES } from "../utils/recommendations";
import { formatFollowers, formatINR, PLATFORM_COLORS } from "../utils/formatters";
import StarRating from "./StarRating";

/**
 * AI Influencer Recommendations Panel
 * Props:
 *   influencers  — full list from API
 *   budget       — brand's marketing budget
 *   platform     — preferred platform (optional)
 *   existingOfferInfluencerIds — Set of influencer IDs already offered
 *   ratingsMap   — { [influencerId]: { averageRating, totalRatings } }
 */
export default function RecommendationsPanel({
  influencers = [],
  budget = 0,
  platform = null,
  existingOfferInfluencerIds = new Set(),
  ratingsMap = {},
}) {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(null);

  if (influencers.length === 0) return null;

  const context = {
    budget,
    preferredPlatform: platform,
    existingOfferInfluencerIds,
  };

  // Enrich context with ratings per influencer
  const ranked = rankInfluencers(
    influencers.map((inf) => ({
      ...inf,
      avgRating:    ratingsMap[inf.id]?.averageRating  || 0,
      totalRatings: ratingsMap[inf.id]?.totalRatings   || 0,
    })),
    context,
    5
  );

  return (
    <div className="card overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2.5 px-5 py-4 border-b border-bg-border bg-gradient-purple">
        <div className="w-7 h-7 rounded-lg bg-accent-soft flex items-center justify-center flex-shrink-0">
          <Sparkles size={14} className="text-accent" />
        </div>
        <div className="flex-1">
          <h2 className="font-semibold text-text-primary text-sm">AI Recommendations</h2>
          <p className="text-xs text-text-muted">Scored for your budget &amp; goals</p>
        </div>
        <span className="text-xs text-text-muted">Top {ranked.length}</span>
      </div>

      {/* Ranked list */}
      <div>
        {ranked.map((inf, idx) => {
          const pc = PLATFORM_COLORS[inf.platform] || PLATFORM_COLORS.Instagram;
          const tier = TIER_STYLES[inf.tier] || TIER_STYLES["Consider"];
          const isExpanded = expanded === inf.id;

          return (
            <div key={inf.id} className="border-b border-bg-border last:border-0">
              <div
                className="flex items-center gap-3 px-5 py-3.5 hover:bg-surface-50 transition-colors cursor-pointer"
                onClick={() => setExpanded(isExpanded ? null : inf.id)}
              >
                {/* Rank */}
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0
                  ${idx === 0 ? "bg-warning text-bg-primary" : "bg-surface-100 text-text-muted"}`}>
                  {idx + 1}
                </span>

                {/* Avatar */}
                <div className="w-8 h-8 rounded-full bg-accent-soft flex items-center justify-center text-accent font-bold text-sm flex-shrink-0">
                  {inf.name[0]}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-text-primary truncate">{inf.name}</span>
                    <span className={`badge text-[10px] px-1.5 py-0.5 ${tier.bg} ${tier.text} border ${tier.border}`}>
                      {inf.tier}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={`text-xs ${pc.text}`}>{inf.platform}</span>
                    <span className="text-xs text-text-muted">·</span>
                    <span className="text-xs text-text-muted">{formatFollowers(inf.followers)}</span>
                    {inf.totalRatings > 0 && (
                      <>
                        <span className="text-xs text-text-muted">·</span>
                        <StarRating value={inf.avgRating} total={inf.totalRatings} size={11} />
                      </>
                    )}
                  </div>
                </div>

                {/* Score */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <div className="text-right">
                    <div className="text-sm font-bold text-text-primary">{inf.score}</div>
                    <div className="text-[10px] text-text-muted">/ 100</div>
                  </div>
                  <ChevronRight
                    size={14}
                    className={`text-text-muted transition-transform ${isExpanded ? "rotate-90" : ""}`}
                  />
                </div>
              </div>

              {/* Expanded reasons */}
              {isExpanded && (
                <div className="px-5 pb-4 animate-slide-up">
                  {/* Score bar */}
                  <div className="h-1.5 bg-surface-100 rounded-full overflow-hidden mb-3">
                    <div
                      className="h-full bg-accent rounded-full transition-all duration-500"
                      style={{ width: `${inf.score}%` }}
                    />
                  </div>

                  {/* Reasons */}
                  <div className="space-y-1 mb-3">
                    {inf.reasons.map((r, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-text-secondary">
                        <span className="text-accent mt-0.5 flex-shrink-0">✓</span>
                        {r}
                      </div>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); navigate(`/influencers/${inf.id}`); }}
                      className="flex-1 btn-secondary py-1.5 text-xs"
                    >
                      View Profile
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate("/offers/new", { state: { influencerId: inf.id, influencerName: inf.name } });
                      }}
                      className="flex-1 btn-primary py-1.5 text-xs flex items-center justify-center gap-1"
                    >
                      <Plus size={12} />
                      Send Offer
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-bg-border flex items-center gap-1.5 bg-bg-secondary">
        <Info size={12} className="text-text-muted flex-shrink-0" />
        <p className="text-xs text-text-muted">
          Scores based on reach, platform fit, earnings history, ratings &amp; budget.
        </p>
      </div>
    </div>
  );
}
