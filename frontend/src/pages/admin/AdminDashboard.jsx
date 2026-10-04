import { useEffect, useState } from "react";
import { AlertCircle, BarChart3, Loader2, Star, Store, TrendingUp, Users } from "lucide-react";

import { getAdminDashboard } from "../../services/adminService";

const defaultStats = { totalUsers: 0, totalStores: 0, totalRatings: 0 };

const glass =
  "rounded-[28px] border border-white/15 bg-indigo-950/60 shadow-2xl shadow-black/30 backdrop-blur-2xl";

function GlowShell({ children }) {
  return (
    <div
      className="relative min-h-screen overflow-hidden bg-gradient-to-br from-indigo-950 via-violet-950 to-fuchsia-950 selection:bg-amber-300 selection:text-indigo-950"
      style={{ fontFamily: "'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif" }}
    >
      <div className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[720px] -translate-x-1/2 -translate-y-1/3 rounded-full bg-violet-600/40 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-80 w-80 translate-x-1/4 translate-y-1/4 rounded-full bg-amber-400/20 blur-3xl" />
      <div className="relative">{children}</div>
    </div>
  );
}

function Panel({ title, description, className = "", children }) {
  return (
    <section className={`${glass} p-6 transition-all duration-200 hover:border-white/25 sm:p-8 ${className}`}>
      {title && (
        <div className="mb-6">
          <h2 className="text-xl font-bold tracking-tight text-white">{title}</h2>
          {description && <p className="mt-1 text-sm text-indigo-200">{description}</p>}
        </div>
      )}
      {children}
    </section>
  );
}

function Notice({ message }) {
  return (
    <div
      role="alert"
      className="flex items-start gap-3 rounded-2xl border border-red-400/40 bg-red-500/10 p-4 text-sm text-red-200"
    >
      <AlertCircle size={18} className="mt-0.5 shrink-0 text-red-300" />
      <p>{message}</p>
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(defaultStats);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getAdminDashboard();

        setStats({
          totalUsers: Number(data.totalUsers ?? 0),
          totalStores: Number(data.totalStores ?? 0),
          totalRatings: Number(data.totalRatings ?? 0),
        });
      } catch (err) {
        setError(err?.response?.data?.message || "Unable to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <GlowShell>
        <div className="flex min-h-screen items-center justify-center">
          <div className="flex items-center gap-3 text-sm text-indigo-200">
            <Loader2 size={20} className="animate-spin text-amber-300" />
            Loading dashboard...
          </div>
        </div>
      </GlowShell>
    );
  }

  return (
    <GlowShell>
      <div className="mx-auto max-w-6xl space-y-6 px-4 py-10 sm:px-6">
        <div>
          <p className="text-sm font-medium text-amber-300">Overview</p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Admin dashboard
          </h1>

          <p className="mt-2 text-sm text-indigo-200">
            Monitor users, stores, and ratings from one place.
          </p>
        </div>

        {error && <Notice message={error} />}

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <StatCard
            label="Total users"
            value={stats.totalUsers}
            icon={Users}
            tile="border-indigo-300/30 bg-indigo-300/10"
            iconColor="text-indigo-200"
          />

          <StatCard
            label="Total stores"
            value={stats.totalStores}
            icon={Store}
            tile="border-emerald-300/30 bg-emerald-300/10"
            iconColor="text-emerald-300"
          />

          <StatCard
            label="Total ratings"
            value={stats.totalRatings}
            icon={Star}
            tile="border-amber-300/30 bg-amber-300/10"
            iconColor="text-amber-300"
            filled
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Panel title="Rating overview" description="A quick view of platform rating activity.">
            <div className="flex min-h-52 flex-col items-center justify-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-amber-300/30 bg-amber-300/10">
                <BarChart3 size={29} className="text-amber-300" />
              </div>

              <h3 className="mt-4 text-base font-semibold text-white">Rating analytics</h3>

              <p className="mt-1 max-w-sm text-sm leading-6 text-indigo-200">
                The platform currently has{" "}
                <span className="font-bold text-amber-300">{stats.totalRatings.toLocaleString()}</span>{" "}
                submitted rating{stats.totalRatings !== 1 ? "s" : ""}.
              </p>
            </div>
          </Panel>

          <Panel title="Platform summary" description="Current system activity.">
            <div className="space-y-3">
              <SummaryRow icon={Users} label="Registered users" value={stats.totalUsers} />
              <SummaryRow icon={Store} label="Registered stores" value={stats.totalStores} />
              <SummaryRow icon={Star} label="Submitted ratings" value={stats.totalRatings} />
            </div>
          </Panel>
        </div>
      </div>
    </GlowShell>
  );
}

function StatCard({ label, value, icon: Icon, tile, iconColor, filled }) {
  return (
    <Panel className="hover:-translate-y-0.5 motion-reduce:transform-none">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-indigo-200">{label}</p>
          <p className="mt-2 text-5xl font-bold tracking-tight text-white">{value.toLocaleString()}</p>
        </div>

        <div className={`flex h-14 w-14 items-center justify-center rounded-2xl border ${tile}`}>
          <Icon size={26} className={`${iconColor} ${filled ? "fill-current" : ""}`} strokeWidth={2} />
        </div>
      </div>

      <div className="mt-6 flex items-center gap-2 border-t border-white/10 pt-4">
        <TrendingUp size={15} className="text-emerald-300" />
        <span className="text-xs font-medium text-indigo-300/70">Current total</span>
      </div>
    </Panel>
  );
}

function SummaryRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 transition-all duration-200 hover:border-white/20 hover:bg-white/10">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-indigo-300/30 bg-indigo-300/10">
          <Icon size={18} className="text-indigo-200" />
        </div>

        <span className="text-sm font-medium text-indigo-100">{label}</span>
      </div>

      <span className="text-base font-bold text-white">{value.toLocaleString()}</span>
    </div>
  );
}