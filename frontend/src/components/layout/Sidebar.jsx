import { NavLink } from "react-router-dom";
import { LayoutDashboard, Users, Store, UserPlus, KeyRound, LogOut, ChevronLeft, ChevronRight, PlusCircle, Star } from "lucide-react";

import Logo from "../common/Logo";

const navigation = {
  ADMIN: [
    { label: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Users", path: "/admin/users", icon: Users },
    { label: "Add User", path: "/admin/users/add", icon: UserPlus },
    { label: "Stores", path: "/admin/stores", icon: Store },
    { label: "Add Store", path: "/admin/stores/add", icon: PlusCircle },
  ],
  USER: [
    { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { label: "Stores", path: "/stores", icon: Store },
    { label: "My Ratings", path: "/my-ratings", icon: Star },
    { label: "Change Password", path: "/change-password", icon: KeyRound },
  ],
  STORE_OWNER: [
    { label: "Dashboard", path: "/owner/dashboard", icon: LayoutDashboard },
    { label: "Change Password", path: "/owner/change-password", icon: KeyRound },
  ],
};

export default function Sidebar({ role, collapsed = false, onToggle, onLogout }) {
  const items = navigation[role] || [];

  return (
    <aside
      className={`fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-white/15 bg-indigo-950/60 shadow-2xl shadow-black/40 backdrop-blur-2xl transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      }`}
      style={{ fontFamily: '"Plus Jakarta Sans", ui-sans-serif, system-ui, sans-serif' }}
    >
      <div
        className={`flex h-16 shrink-0 items-center border-b border-white/10 ${
          collapsed ? "justify-center px-3" : "px-5"
        }`}
      >
        <Logo collapsed={collapsed} variant="dark" />
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-5">
        <p className={`mb-3 px-3 text-xs font-semibold text-indigo-300/60 ${collapsed ? "hidden" : "block"}`}>
          Menu
        </p>

        <div className="space-y-1.5">
          {items.map((item) => {
            const Icon = item.icon;
            const hasNestedSibling = items.some(
              (other) => other.path !== item.path && other.path.startsWith(`${item.path}/`)
            );

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={hasNestedSibling}
                title={collapsed ? item.label : undefined}
                className={({ isActive }) =>
                  `group relative flex items-center gap-3 rounded-2xl border px-3.5 py-3 text-sm font-medium transition-all duration-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-300/40 ${
                    isActive
                      ? "border-amber-300/30 bg-amber-300/10 text-amber-300"
                      : "border-transparent text-indigo-200 hover:bg-white/10 hover:text-white"
                  } ${collapsed ? "justify-center" : ""}`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      size={19}
                      strokeWidth={2}
                      className={`shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                        isActive ? "text-amber-300" : "text-indigo-300/60 group-hover:text-white"
                      }`}
                    />

                    {!collapsed && <span className="truncate">{item.label}</span>}

                    {isActive && (
                      <span className="absolute right-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-l-full bg-gradient-to-b from-amber-300 to-orange-400" />
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </div>
      </nav>

      <div className="space-y-2 border-t border-white/10 p-3">
        <button
          type="button"
          onClick={onLogout}
          title={collapsed ? "Logout" : undefined}
          className={`group flex w-full items-center gap-3 rounded-2xl border border-transparent px-3.5 py-3 text-sm font-medium text-indigo-200 transition-all duration-200 hover:border-red-400/40 hover:bg-red-500/10 hover:text-red-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-300/40 ${
            collapsed ? "justify-center" : ""
          }`}
        >
          <LogOut size={19} className="shrink-0 transition-transform duration-200 group-hover:scale-110" />
          {!collapsed && <span>Logout</span>}
        </button>

        <button
          type="button"
          onClick={onToggle}
          className="flex w-full items-center justify-center rounded-2xl border border-white/15 bg-white/[0.06] py-2.5 text-indigo-300/60 transition-all duration-200 hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-300/40"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>
    </aside>
  );
}