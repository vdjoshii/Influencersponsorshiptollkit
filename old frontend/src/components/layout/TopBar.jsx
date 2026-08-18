import { useLocation } from "react-router-dom";

const titles = {
  "/": "Dashboard",
  "/brands": "Brands",
  "/brands/new": "New Brand",
  "/influencers": "Influencers",
  "/influencers/new": "New Influencer",
  "/offers": "Offers",
  "/offers/new": "New Offer",
};

export default function TopBar() {
  const { pathname } = useLocation();
  const title = titles[pathname] ?? "Details";

  return (
    <header className="h-14 flex items-center justify-between px-6 border-b border-bg-border bg-bg-secondary/80 backdrop-blur-sm sticky top-0 z-10">
      <h1 className="font-display font-semibold text-text-primary text-base">{title}</h1>
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
        <span className="text-xs text-text-secondary">API Connected</span>
      </div>
    </header>
  );
}