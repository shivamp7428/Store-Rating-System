import { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function Layout({ children, user, onLogout }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const handleLogout = () => {
    setMobileSidebarOpen(false);
    onLogout?.();
  };

  return (
    <div
      className="relative min-h-screen w-full bg-gradient-to-br from-indigo-950 via-violet-950 to-fuchsia-950 text-indigo-200 selection:bg-amber-300 selection:text-indigo-950"
      style={{
        fontFamily: '"Plus Jakarta Sans", ui-sans-serif, system-ui, sans-serif',
      }}
    >
      <div className="pointer-events-none fixed -top-40 left-1/2 z-0 h-96 w-96 -translate-x-1/2 rounded-full bg-violet-600/40 blur-3xl" />
      <div className="pointer-events-none fixed -bottom-32 -right-24 z-0 h-80 w-80 rounded-full bg-amber-400/20 blur-3xl" />

      <div className="hidden lg:block">
        <Sidebar
          role={user?.role}
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed((prev) => !prev)}
          onLogout={handleLogout}
        />
      </div>

      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-indigo-950/70 backdrop-blur-md transition-opacity duration-300 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 transform border-r border-white/15 bg-indigo-950/90 shadow-2xl shadow-black/40 backdrop-blur-2xl transition-transform duration-300 ease-in-out lg:hidden ${
          mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar
          role={user?.role}
          collapsed={false}
          onToggle={() => setMobileSidebarOpen(false)}
          onLogout={handleLogout}
        />
      </div>

      <Topbar
        user={user}
        sidebarCollapsed={sidebarCollapsed}
        onMenuClick={() => setMobileSidebarOpen(true)}
      />

      <main
        className={`relative z-10 min-h-screen pt-16 transition-all duration-300 ease-in-out ${
          sidebarCollapsed ? "lg:pl-20" : "lg:pl-64"
        }`}
      >
        <div className="mx-auto w-full max-w-[1600px] p-4 sm:p-6 lg:p-8">
          <div className="rounded-[28px] border border-white/15 bg-indigo-950/60 p-4 shadow-2xl shadow-black/40 backdrop-blur-2xl sm:p-6 lg:p-8">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}