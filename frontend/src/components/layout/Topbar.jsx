import { Menu, Bell, ChevronDown } from "lucide-react";
import { useState } from "react";

const roleLabels = {
  ADMIN: "Administrator",
  USER: "Normal User",
  STORE_OWNER: "Store Owner",
};

export default function Topbar({ user, onMenuClick, sidebarCollapsed = false }) {
  const [showMenu, setShowMenu] = useState(false);

  const userName = user?.name || "User";
  const userRole = user?.role || "USER";
  const roleLabel = roleLabels[userRole] || userRole;

  const initials = userName
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header
      className={`fixed right-0 top-0 z-30 h-16 border-b border-white/10 bg-indigo-950/60 backdrop-blur-2xl transition-all duration-300 ${
        sidebarCollapsed ? "left-0 lg:left-20" : "left-0 lg:left-64"
      }`}
      style={{ fontFamily: '"Plus Jakarta Sans", ui-sans-serif, system-ui, sans-serif' }}
    >
      <div className="flex h-full items-center justify-between px-4 sm:px-6">
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-2xl p-2 text-indigo-300/60 transition-all duration-200 hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-300/40 lg:hidden"
          aria-label="Open menu"
        >
          <Menu size={21} />
        </button>

        <div className="ml-auto flex items-center gap-2 sm:gap-4">
          <button
            type="button"
            className="relative rounded-2xl p-2.5 text-indigo-300/60 transition-all duration-200 hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-300/40"
            aria-label="Notifications"
          >
            <Bell size={19} />
            <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-amber-300 ring-2 ring-indigo-950" />
          </button>

          <div className="hidden h-6 w-px bg-white/10 sm:block" />

          <div className="relative">
            <button
              type="button"
              onClick={() => setShowMenu((prev) => !prev)}
              aria-expanded={showMenu}
              aria-haspopup="true"
              className="flex items-center gap-2.5 rounded-2xl px-2.5 py-1.5 transition-all duration-200 hover:bg-white/10 focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-300/40"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-r from-amber-300 to-orange-400 text-xs font-bold text-indigo-950 shadow-lg shadow-amber-400/20">
                {initials}
              </div>

              <div className="hidden text-left sm:block">
                <p className="max-w-[150px] truncate text-sm font-semibold text-white">{userName}</p>
                <p className="text-xs font-medium text-indigo-300/60">{roleLabel}</p>
              </div>

              <ChevronDown
                size={16}
                className={`hidden text-indigo-300/60 transition-transform duration-200 sm:block ${
                  showMenu ? "rotate-180 text-amber-300" : ""
                }`}
              />
            </button>

            {showMenu && (
              <div className="absolute right-0 top-full mt-2 w-56 overflow-hidden rounded-2xl border border-white/15 bg-indigo-950/90 p-1 shadow-2xl shadow-black/40 backdrop-blur-2xl">
                <div className="border-b border-white/10 px-3.5 py-3">
                  <p className="truncate text-sm font-semibold text-white">{userName}</p>
                  <p className="mt-0.5 text-xs font-medium text-amber-300">{roleLabel}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}