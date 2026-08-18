import { useState } from "react";
import { Menu } from "lucide-react";
import Sidebar from "./Sidebar";
import NotificationBell from "./NotificationBell";

export default function AppLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen bg-bg-primary overflow-hidden">

      {/* Desktop sidebar */}
      <div className="hidden md:flex">
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative z-10 animate-slide-up">
            <Sidebar />
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        {/* Top bar — desktop notification bell + mobile hamburger */}
        <div className="flex items-center justify-between px-4 md:px-7 py-3 border-b border-bg-border bg-bg-secondary sticky top-0 z-40">
          {/* Mobile: hamburger */}
          <button
            onClick={() => setMobileOpen(true)}
            className="md:hidden p-2 rounded-lg hover:bg-surface-50 text-text-secondary"
          >
            <Menu size={20} />
          </button>
          <span className="font-bold text-text-primary text-sm md:hidden">SponsorLink</span>

          {/* Desktop: spacer */}
          <div className="hidden md:block" />

          {/* Notification bell — always visible */}
          <NotificationBell />
        </div>

        <div className="max-w-5xl mx-auto px-4 md:px-7 py-6 md:py-8 animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  );
}
