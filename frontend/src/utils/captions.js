/**
 * AI Caption Suggestion Engine
 * Generates platform-optimised campaign captions using template interpolation.
 * No external API — works offline, instant results.
 */

const HASHTAG_SETS = {
  Instagram: ["#ad", "#sponsored", "#collab", "#brandpartner", "#influencer", "#creator", "#instacreator"],
  YouTube:   ["#sponsored", "#ad", "#collab", "#youtuber", "#creator", "#brandpartner"],
  TikTok:    ["#ad", "#sponsored", "#fyp", "#foryou", "#tiktokcreator", "#brandpartner", "#collab"],
};

const EMOJI_SETS = {
  Instagram: ["✨", "🔥", "💫", "🌟", "💥", "🎯", "💎"],
  YouTube:   ["🎬", "📹", "🔔", "🎯", "💡", "🚀", "⭐"],
  TikTok:    ["🔥", "💃", "🎵", "✨", "💥", "🤩", "🎯"],
};

const TEMPLATES = [
  // Excitement / Discovery
  (ctx) => `${ctx.emoji} Excited to partner with ${ctx.brand} for this one! ${ctx.product} has genuinely changed my routine — and I think it'll change yours too. Use my link to grab yours! ${ctx.hashtags}`,

  // Storytelling
  (ctx) => `Real talk — I've been using ${ctx.brand}'s ${ctx.product} for the past few weeks and the results speak for themselves ${ctx.emoji} This isn't just a sponsorship, it's something I actually believe in. Check it out! ${ctx.hashtags}`,

  // FOMO / Urgency
  (ctx) => `${ctx.emoji} Don't sleep on this! ${ctx.brand} just dropped something incredible and I'm here for it. Limited time offer — link in bio! ${ctx.hashtags}`,

  // Community / Trust
  (ctx) => `You asked, I answered ${ctx.emoji} So many of you wanted to know what I use — partnering with ${ctx.brand} to bring you ${ctx.product}. My honest review: absolutely worth it. ${ctx.hashtags}`,

  // Aspirational
  (ctx) => `Levelling up with ${ctx.brand} ${ctx.emoji} If you're serious about your goals, ${ctx.product} is the move. Proud to be a brand partner — link below! ${ctx.hashtags}`,

  // Casual / Authentic
  (ctx) => `Okay so ${ctx.brand} reached out and I said yes immediately ${ctx.emoji} ${ctx.product} is exactly what I've been looking for. Grab yours using my link! ${ctx.hashtags}`,

  // Question hook
  (ctx) => `Have you tried ${ctx.product} yet? ${ctx.emoji} I partnered with ${ctx.brand} because I genuinely love what they're doing. Drop a comment if you want to know more! ${ctx.hashtags}`,
];

const PLATFORM_NOTES = {
  Instagram: "Keep under 2,200 chars. First line is the hook — make it count before 'more'.",
  YouTube:   "Pin this in comments. Add your affiliate link and a clear CTA.",
  TikTok:    "Short and punchy. First 3 words decide if they watch. Use trending sounds.",
};

/**
 * Generate caption suggestions for a campaign.
 * @param {object} params
 * @param {string} params.brandName
 * @param {string} params.influencerName
 * @param {string} params.platform  — "Instagram" | "YouTube" | "TikTok"
 * @param {string} [params.product] — optional product/service name
 * @param {number} [params.amount]  — deal amount in INR
 * @returns {{ captions: string[], tip: string }}
 */
export function generateCaptions({ brandName, influencerName, platform, product, amount }) {
  const emojis   = EMOJI_SETS[platform]    || EMOJI_SETS.Instagram;
  const hashTags = HASHTAG_SETS[platform]  || HASHTAG_SETS.Instagram;

  const ctx = {
    brand:   brandName,
    creator: influencerName,
    product: product || brandName,
    emoji:   emojis[Math.floor(Math.random() * emojis.length)],
    hashtags: hashTags.slice(0, 4).join(" "),
  };

  // Pick 3 varied templates deterministically (based on brand name length)
  const seed = brandName.length % TEMPLATES.length;
  const indices = [
    seed % TEMPLATES.length,
    (seed + 2) % TEMPLATES.length,
    (seed + 4) % TEMPLATES.length,
  ];

  const captions = indices.map((i) => {
    // Refresh emoji per caption
    ctx.emoji = emojis[i % emojis.length];
    return TEMPLATES[i](ctx);
  });

  return {
    captions,
    tip: PLATFORM_NOTES[platform] || PLATFORM_NOTES.Instagram,
  };
}
