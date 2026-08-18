export const formatCurrency = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value ?? 0);

export const formatNumber = (value) =>
  new Intl.NumberFormat("en-US", { notation: "compact" }).format(value ?? 0);

export const platformColors = {
  Instagram: { bg: "rgba(225,48,108,0.13)", text: "#e1306c" },
  YouTube: { bg: "rgba(255,0,0,0.13)", text: "#ff4444" },
  TikTok: { bg: "rgba(105,201,208,0.13)", text: "#69c9d0" },
};

export const statusConfig = {
  PENDING: { bg: "rgba(245,158,11,0.13)", text: "#f59e0b", label: "Pending" },
  ACCEPTED: { bg: "rgba(34,211,160,0.13)", text: "#22d3a0", label: "Accepted" },
  REJECTED: { bg: "rgba(239,68,68,0.13)", text: "#ef4444", label: "Rejected" },
};