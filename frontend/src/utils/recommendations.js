/**
 * AI Influencer Recommendation Engine
 * Scores influencers based on multiple signals using existing data.
 * No external API — fully deterministic, explainable scoring.
 */

/**
 * Score a single influencer for a brand context.
 * Returns { score: 0-100, reasons: string[], tier: "Top Pick"|"Good Match"|"Consider" }
 */
export function scoreInfluencer(influencer, context = {}) {
  const {
    budget = 0,
    preferredPlatform = null,
    existingOfferInfluencerIds = new Set(),
    avgRating = 0,
    totalRatings = 0,
  } = context;

  let score = 0;
  const reasons = [];

  // ── 1. Follower reach (0–25 pts) ──────────────────────
  const followers = influencer.followers || 0;
  if (followers >= 1_000_000) {
    score += 25; reasons.push("Mega influencer (1M+ followers)");
  } else if (followers >= 500_000) {
    score += 22; reasons.push("Large audience (500K+ followers)");
  } else if (followers >= 100_000) {
    score += 18; reasons.push("Strong reach (100K+ followers)");
  } else if (followers >= 50_000) {
    score += 14; reasons.push("Growing creator (50K+ followers)");
  } else if (followers >= 10_000) {
    score += 10; reasons.push("Micro-influencer (10K+ followers)");
  } else {
    score += 5;  reasons.push("Nano creator");
  }

  // ── 2. Platform match (0–20 pts) ──────────────────────
  if (preferredPlatform && influencer.platform === preferredPlatform) {
    score += 20; reasons.push(`Matches your preferred platform (${preferredPlatform})`);
  } else if (!preferredPlatform) {
    score += 10; // neutral — no preference set
  } else {
    score += 5;
  }

  // ── 3. Proven track record — earnings (0–20 pts) ──────
  const earnings = influencer.totalEarnings || 0;
  if (earnings >= 500_000) {
    score += 20; reasons.push("High-earning creator (₹5L+ total)");
  } else if (earnings >= 100_000) {
    score += 15; reasons.push("Experienced creator (₹1L+ earned)");
  } else if (earnings >= 10_000) {
    score += 10; reasons.push("Active in sponsorships");
  } else if (earnings > 0) {
    score += 6;  reasons.push("Has prior sponsorship experience");
  } else {
    score += 3;  reasons.push("Fresh creator — untapped potential");
  }

  // ── 4. Community rating (0–20 pts) ────────────────────
  if (totalRatings >= 3 && avgRating >= 4.5) {
    score += 20; reasons.push(`Highly rated (${avgRating.toFixed(1)}★ from ${totalRatings} reviews)`);
  } else if (totalRatings >= 2 && avgRating >= 4.0) {
    score += 15; reasons.push(`Well rated (${avgRating.toFixed(1)}★)`);
  } else if (totalRatings >= 1 && avgRating >= 3.0) {
    score += 10; reasons.push(`Rated ${avgRating.toFixed(1)}★`);
  } else if (totalRatings === 0) {
    score += 8;  reasons.push("No reviews yet — be the first!");
  } else {
    score += 4;
  }

  // ── 5. Budget fit (0–15 pts) ──────────────────────────
  // Estimate typical deal cost: ~0.5% of followers as INR
  const estimatedCost = followers * 0.005;
  if (budget > 0) {
    if (estimatedCost <= budget * 0.3) {
      score += 15; reasons.push("Very affordable for your budget");
    } else if (estimatedCost <= budget * 0.6) {
      score += 12; reasons.push("Good budget fit");
    } else if (estimatedCost <= budget) {
      score += 8;  reasons.push("Within budget");
    } else {
      score += 2;  reasons.push("May exceed budget");
    }
  } else {
    score += 8;
  }

  // ── 6. Novelty bonus — not yet approached (0–5 pts) ───
  if (!existingOfferInfluencerIds.has(influencer.id)) {
    score += 5; reasons.push("Haven't worked together yet");
  } else {
    reasons.push("Existing relationship");
  }

  // Clamp to 100
  score = Math.min(100, Math.round(score));

  const tier =
    score >= 75 ? "Top Pick" :
    score >= 55 ? "Good Match" :
    "Consider";

  return { score, reasons, tier };
}

/**
 * Rank a list of influencers and return top N with scores.
 */
export function rankInfluencers(influencers, context = {}, topN = 5) {
  return influencers
    .map((inf) => ({ ...inf, ...scoreInfluencer(inf, context) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, topN);
}

/** Tier badge styling */
export const TIER_STYLES = {
  "Top Pick":   { bg: "bg-warning-soft",      text: "text-warning",      border: "border-warning/20" },
  "Good Match": { bg: "bg-accent-soft",        text: "text-accent",       border: "border-accent/20" },
  "Consider":   { bg: "bg-brand-greenLight",   text: "text-brand-green",  border: "border-success/20" },
};
