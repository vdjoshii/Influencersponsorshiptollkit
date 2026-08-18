import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Building2,
  Users,
  Handshake,
  Zap,
} from "lucide-react";

const navItems = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/brands", icon: Building2, label: "Brands" },
  { to: "/influencers", icon: Users, label: "Influencers" },
  { to: "/offers", icon: Handshake, label: "Offers" },
];

export default function Sidebar() {
  return (
    <aside className="w-60 flex-shrink-0 bg-bg-secondary border-r border-bg-border flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-bg-border">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center shadow-glow-sm">
            <Zap size={16} className="text-white" />
          </div>
          <div>
            <div className="font-display font-bold text-sm text-text-primary tracking-tight">
              SponsorKit
            </div>
            <div className="text-xs text-text-muted">Influencer Platform</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group
              ${
                isActive
                  ? "bg-accent/10 text-accent border border-accent/20"
                  : "text-text-secondary hover:text-text-primary hover:bg-bg-hover"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon
                  size={16}
                  className={isActive ? "text-accent" : "text-text-muted group-hover:text-text-secondary"}
                />
                {label}
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-accent"
                  />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-bg-border">
        <div className="text-xs text-text-muted">v1.0.0 · REST API</div>
      </div>
    </aside>
  );
}