// Indian currency formatting (₹)
export function formatINR(amount) {
  if (amount === null || amount === undefined) return "₹0";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

// Compact follower count: 1.2L, 5K, 1.2Cr
export function formatFollowers(n) {
  if (!n) return "0";
  if (n >= 10000000) return (n / 10000000).toFixed(1) + " Cr";
  if (n >= 100000)   return (n / 100000).toFixed(1) + "L";
  if (n >= 1000)     return (n / 1000).toFixed(0) + "K";
  return n.toString();
}

export function getStatusBadgeClass(status) {
  switch (status) {
    case "ACCEPTED": return "badge-accepted";
    case "REJECTED": return "badge-rejected";
    default:         return "badge-pending";
  }
}

export function getStatusLabel(status) {
  switch (status) {
    case "ACCEPTED": return "Accepted";
    case "REJECTED": return "Rejected";
    default:         return "Pending";
  }
}

// Dark-theme platform colour tokens
export const PLATFORM_COLORS = {
  Instagram: {
    bg:     "bg-pink-500/10",
    text:   "text-pink-400",
    border: "border-pink-500/20",
    dot:    "#f472b6",
  },
  YouTube: {
    bg:     "bg-red-500/10",
    text:   "text-red-400",
    border: "border-red-500/20",
    dot:    "#f87171",
  },
  TikTok: {
    bg:     "bg-sky-500/10",
    text:   "text-sky-400",
    border: "border-sky-500/20",
    dot:    "#38bdf8",
  },
};

// Chart colour palette (for recharts)
export const CHART_COLORS = {
  purple: "#7c6fff",
  green:  "#22d3a0",
  blue:   "#38bdf8",
  amber:  "#f59e0b",
  pink:   "#f472b6",
};
