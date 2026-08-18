import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Users, Handshake,
  LogOut, IndianRupee, Zap, ChevronRight,
  Bookmark, MessageSquare, Trophy, Sparkles,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const BRAND_LINKS = [
  { to: "/dashboard",       icon: LayoutDashboard, label: "Dashboard" },
  { to: "/influencers",     icon: Users,            label: "Find Creators" },
  { to: "/offers",          icon: Handshake,        label: "My Offers" },
  { to: "/bookmarks",       icon: Bookmark,         label: "Saved Creators" },
  { to: "/recommendations", icon: Sparkles,         label: "AI Picks" },
  { to: "/inbox",           icon: MessageSquare,    label: "Messages" },
  { to: "/badges",          icon: Trophy,           label: "Achievements" },
];

const INFLUENCER_LINKS = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/offers",    icon: Handshake,        label: "My Offers" },
  { to: "/earnings",  icon: IndianRupee,      label: "Earnings" },
  { to: "/inbox",     icon: MessageSquare,    label: "Messages" },
  { to: "/badges",    icon: Trophy,           label: "Achievements" },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const links = user?.role === "BRAND" ? BRAND_LINKS : INFLUENCER_LINKS;
  const isBrand = user?.role === "BRAND";

  function handleLogout() {
    logout();
    navigate("/login");
  }

  const initials = user?.name
    ? user.name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()
    : "?";

  return (
    <aside className="w-60 flex-shrink-0 flex flex-col h-screen sticky top-0 border-r border-bg-border bg-bg-secondary">

      {/* Logo */}
      <div className="px-5 pt-6 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-accent flex items-center justify-center shadow-glow flex-shrink-0">
            <Zap size={15} className="text-white" />
          </div>
          <div>
            <div className="font-bold text-text-primary text-sm leading-tight tracking-tight">SponsorLink</div>
            <div className="text-xs text-text-muted">Creator Platform</div>
          </div>
        </div>
      </div>

      <div className="divider mx-4" />

      {/* User pill */}
      <div className="mx-3 mt-4 mb-1 px-3 py-3 rounded-xl bg-surface-50 border border-bg-border flex items-center gap-3">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0
          ${isBrand ? "bg-accent-soft text-accent" : "bg-brand-greenLight text-brand-green"}`}>
          {initials}
        </div>
        <div className="min-w-0">
          <div className="text-xs font-semibold text-text-primary truncate">{user?.name}</div>
          <div className={`text-xs font-medium mt-0.5 ${isBrand ? "text-accent" : "text-brand-green"}`}>
            {isBrand ? "Brand" : "Influencer"}
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
        <p className="text-xs font-semibold text-text-muted uppercase tracking-widest px-3 mb-2 mt-1">
          Navigation
        </p>
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `nav-link ${isActive ? "nav-link-active" : ""}`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={16} className={isActive ? "text-accent" : "text-text-muted"} />
                <span className="flex-1">{label}</span>
                {isActive && <ChevronRight size={13} className="text-accent opacity-60" />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom */}
      <div className="px-3 pb-5 space-y-1 flex-shrink-0">
        <div className="divider mb-3" />
        <button
          onClick={handleLogout}
          className="nav-link w-full hover:bg-danger-soft hover:text-danger"
        >
          <LogOut size={16} className="text-text-muted" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
