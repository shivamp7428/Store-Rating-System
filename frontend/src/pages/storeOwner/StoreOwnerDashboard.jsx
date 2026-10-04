import { useEffect, useState } from "react";
import { AlertCircle, Loader2, Star, Store as StoreIcon, TrendingUp, UserRound } from "lucide-react";

import { getOwnerDashboard } from "../../services/storeOwnerService";

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
    <section className={`${glass} ${className}`}>
      {title && (
        <div className="px-6 pb-4 pt-6 sm:px-8 sm:pt-8">
          <h2 className="text-xl font-bold tracking-tight text-white">{title}</h2>
          {description && <p className="mt-1 text-sm text-indigo-200">{description}</p>}
        </div>
      )}
      {children}
    </section>
  );
}

function RatingBadge({ children }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-amber-300/30 bg-amber-300/10 px-2.5 py-1 text-xs font-semibold text-amber-300">
      {children}
    </span>
  );
}

function EmptyBlock({ icon: Icon, title, description }) {
  return (
    <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.03] px-5 py-10 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06]">
        <Icon size={22} className="text-indigo-300" />
      </div>
      <p className="mt-4 text-sm font-semibold text-white">{title}</p>
      <p className="mt-1 text-xs text-indigo-200">{description}</p>
    </div>
  );
}

export default function StoreOwnerDashboard() {
  const [dashboard, setDashboard] = useState({ stores: [], ratings: [], averageRating: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getOwnerDashboard();

        setDashboard({
          stores: data.stores || [],
          ratings: data.ratings || [],
          averageRating: Number(data.averageRating ?? 0),
        });
      } catch (err) {
        setError(err?.response?.data?.message || "Unable to load dashboard.");
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

  const totalRatings = dashboard.ratings.length;

  return (
    <GlowShell>
      <div className="mx-auto max-w-6xl space-y-6 px-4 py-10 sm:px-6">
        <div>
          <p className="text-sm font-medium text-amber-300">Store management</p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Store owner dashboard
          </h1>

          <p className="mt-2 text-sm text-indigo-200">Monitor your store ratings and customer feedback.</p>
        </div>

        {error && (
          <div
            role="alert"
            className="flex items-start gap-3 rounded-2xl border border-red-400/40 bg-red-500/10 p-4 text-sm text-red-200"
          >
            <AlertCircle size={18} className="mt-0.5 shrink-0 text-red-300" />
            <p>{error}</p>
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <Panel className="p-6 transition-all duration-200 hover:border-white/25 sm:p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-indigo-200">Average rating</p>
                <p className="mt-2 text-5xl font-bold tracking-tight text-white">
                  {dashboard.averageRating.toFixed(1)}
                </p>
              </div>

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-amber-300/30 bg-amber-300/10">
                <Star size={26} className="fill-amber-300 text-amber-300" />
              </div>
            </div>

            <div className="mt-6 flex items-center gap-2 border-t border-white/10 pt-4">
              <TrendingUp size={15} className="text-emerald-300" />
              <span className="text-xs font-medium text-indigo-300/70">Overall store rating</span>
            </div>
          </Panel>

          <Panel className="p-6 transition-all duration-200 hover:border-white/25 sm:p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-indigo-200">Total ratings</p>
                <p className="mt-2 text-5xl font-bold tracking-tight text-white">
                  {totalRatings.toLocaleString()}
                </p>
              </div>

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-indigo-300/30 bg-indigo-300/10">
                <UserRound size={26} className="text-indigo-200" />
              </div>
            </div>

            <div className="mt-6 border-t border-white/10 pt-4">
              <span className="text-xs font-medium text-indigo-300/70">Customers who submitted ratings</span>
            </div>
          </Panel>
        </div>

        <Panel title="Your stores" description="Stores associated with your account.">
          <div className="px-6 pb-6 sm:px-8 sm:pb-8">
            {dashboard.stores.length === 0 ? (
              <EmptyBlock
                icon={StoreIcon}
                title="No stores found"
                description="No stores are currently associated with your account."
              />
            ) : (
              <div className="space-y-3">
                {dashboard.stores.map((store) => (
                  <div
                    key={store.id}
                    className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.06] p-4 transition-all duration-200 hover:border-white/20 hover:bg-white/10 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-indigo-300/30 bg-indigo-300/10">
                        <StoreIcon size={20} className="text-indigo-200" />
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-white">{store.storeName}</p>
                        <p className="mt-0.5 text-xs text-indigo-200">{store.storeAddress}</p>
                      </div>
                    </div>

                    <RatingBadge>
                      <Star size={12} className="fill-current" />
                      {Number(store.averageRating ?? store.average_rating ?? dashboard.averageRating).toFixed(1)}
                    </RatingBadge>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Panel>

        <Panel title="Customer ratings" description="Users who have submitted ratings for your stores.">
          {dashboard.ratings.length === 0 ? (
            <div className="px-6 pb-6 sm:px-8 sm:pb-8">
              <EmptyBlock
                icon={Star}
                title="No ratings yet"
                description="Customer ratings will appear here once users submit feedback."
              />
            </div>
          ) : (
            <div className="overflow-x-auto pb-2">
              <table className="w-full min-w-[650px]">
                <thead>
                  <tr className="border-y border-white/10 bg-white/[0.04]">
                    <TableHeader>User</TableHeader>
                    <TableHeader>Store</TableHeader>
                    <TableHeader>Rating</TableHeader>
                    <TableHeader align="right">Date</TableHeader>
                  </tr>
                </thead>

                <tbody className="divide-y divide-white/10">
                  {dashboard.ratings.map((rating) => (
                    <RatingRow key={rating.id} rating={rating} />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Panel>
      </div>
    </GlowShell>
  );
}

function TableHeader({ children, align = "left" }) {
  return (
    <th className={`px-6 py-3.5 text-xs font-semibold text-indigo-300/70 ${align === "right" ? "text-right" : "text-left"}`}>
      {children}
    </th>
  );
}

function RatingRow({ rating }) {
  const userName = rating.userName ?? rating.user_name ?? "User";
  const storeName = rating.storeName ?? rating.store_name ?? "Store";
  const ratingValue = rating.rating ?? 0;
  const date = rating.ratedAt ?? rating.createdAt ?? rating.created_at;

  return (
    <tr className="transition-colors duration-200 hover:bg-white/[0.05]">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full border border-indigo-300/30 bg-indigo-300/10 text-indigo-200">
            <UserRound size={16} />
          </div>

          <span className="text-sm font-medium text-white">{userName}</span>
        </div>
      </td>

      <td className="px-6 py-4 text-sm text-indigo-100">{storeName}</td>

      <td className="px-6 py-4">
        <RatingBadge>
          <Star size={12} className="fill-current" />
          {ratingValue}/5
        </RatingBadge>
      </td>

      <td className="px-6 py-4 text-right text-sm text-indigo-200">{date ? formatDate(date) : "—"}</td>
    </tr>
  );
}

function formatDate(date) {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}