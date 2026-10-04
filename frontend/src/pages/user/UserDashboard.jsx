import { useEffect, useState } from "react";
import { AlertCircle, ArrowRight, CalendarDays, Loader2, Mail, MapPin, ShieldCheck, Star, Store as StoreIcon, UserRound } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { getUserRatings } from "../../services/userService";

const primaryBtn =
  "inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-300 to-orange-400 px-5 py-3.5 text-[15px] font-bold text-indigo-950 shadow-lg shadow-amber-400/20 transition-all duration-200 hover:from-amber-200 hover:to-orange-300 focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-300/40 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60";

const secondaryBtn =
  "inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/[0.06] px-5 py-3.5 text-[15px] font-medium text-white transition-all duration-200 hover:bg-white/10 focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-300/40";

const panelClass =
  "rounded-[28px] border border-white/15 bg-indigo-950/60 shadow-2xl shadow-black/40 backdrop-blur-2xl";

const thClass = "px-4 py-3 text-xs font-semibold text-indigo-300/70";

function Backdrop({ className = "", children }) {
  return (
    <div
      className={`relative overflow-hidden bg-gradient-to-br from-indigo-950 via-violet-950 to-fuchsia-950 px-4 py-8 sm:px-6 ${className}`}
      style={{ fontFamily: '"Plus Jakarta Sans", ui-sans-serif, system-ui, sans-serif' }}
    >
      <div className="pointer-events-none absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-violet-600/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-24 h-80 w-80 rounded-full bg-amber-400/20 blur-3xl" />
      {children}
    </div>
  );
}

function Panel({ title, description, className = "", children }) {
  return (
    <section className={`${panelClass} p-6 sm:p-8 ${className}`}>
      {title && (
        <div className="mb-5">
          <h2 className="text-lg font-bold tracking-tight text-white">{title}</h2>
          {description && <p className="mt-1 text-sm text-indigo-200">{description}</p>}
        </div>
      )}
      {children}
    </section>
  );
}

function RoleBadge() {
  return (
    <span className="inline-flex items-center rounded-full border border-white/15 bg-white/[0.06] px-2.5 py-1 text-xs font-semibold text-indigo-100">
      Normal User
    </span>
  );
}

export default function UserDashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [totalRatings, setTotalRatings] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const storedUser = localStorage.getItem("user");

        if (storedUser) {
          try {
            setUser(JSON.parse(storedUser));
          } catch {
            localStorage.removeItem("user");
          }
        }

        const data = await getUserRatings({ page: 1, limit: 9 });

        setRatings(Array.isArray(data?.ratings) ? data.ratings : []);
        setTotalRatings(Number(data?.pagination?.total || 0));
      } catch (err) {
        console.error("User dashboard error:", err);

        setError(err?.response?.data?.message || "Unable to load dashboard information.");
        setRatings([]);
        setTotalRatings(0);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const recentRatings = ratings.slice(0, 5);

  if (loading) {
    return (
      <Backdrop className="flex min-h-[60vh] items-center justify-center">
        <div role="status" className="relative flex items-center gap-3 text-sm text-indigo-200">
          <Loader2 size={20} className="animate-spin text-amber-300" />
          Loading dashboard...
        </div>
      </Backdrop>
    );
  }

  return (
    <Backdrop className="min-h-screen">
      <div className="relative mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-amber-300">Account overview</p>

            <h1 className="mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl">My Dashboard</h1>

            <p className="mt-1 text-sm text-indigo-200">View your account information and rating activity.</p>
          </div>

          <button type="button" onClick={() => navigate("/stores")} className={primaryBtn}>
            <StoreIcon size={18} />
            Browse stores
            <ArrowRight size={17} />
          </button>
        </div>

        {error && (
          <div
            role="alert"
            className="flex items-start gap-3 rounded-2xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-200"
          >
            <AlertCircle size={18} className="mt-0.5 shrink-0 text-red-300" />
            <p>{error}</p>
          </div>
        )}

        <Panel>
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-r from-amber-300 to-orange-400 text-lg font-bold text-indigo-950 shadow-lg shadow-amber-400/20">
              {getInitials(user?.name)}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-xl font-bold tracking-tight text-white">{user?.name || "User"}</h2>
                <RoleBadge />
              </div>

              {user?.id && <p className="mt-1 text-sm text-indigo-300/60">User ID #{user.id}</p>}
            </div>
          </div>
        </Panel>

        <div className="grid gap-6 lg:grid-cols-2">
          <Panel title="Personal information" description="Your account information.">
            <div className="space-y-5">
              <InfoRow icon={UserRound} label="Full name" value={user?.name} />
              <InfoRow icon={Mail} label="Email address" value={user?.email} />
              <InfoRow icon={MapPin} label="Address" value={user?.address} />
              <InfoRow icon={ShieldCheck} label="Role" value="Normal User" />

              {(user?.createdAt || user?.created_at) && (
                <InfoRow
                  icon={CalendarDays}
                  label="Created at"
                  value={formatDate(user.createdAt || user.created_at)}
                />
              )}
            </div>
          </Panel>

          <Panel title="Rating information" description="Your rating activity across stores.">
            <div className="grid grid-cols-1 gap-4">
              <RatingStat icon={Star} label="Total ratings" value={totalRatings} />
            </div>

            <div className="mt-5 rounded-2xl border border-amber-300/30 bg-amber-300/10 p-4">
              <div className="flex items-start gap-3">
                <Star size={19} className="mt-0.5 shrink-0 fill-amber-300 text-amber-300" />

                <div>
                  <p className="text-sm font-semibold text-amber-200">Rating activity</p>

                  <p className="mt-1 text-xs leading-5 text-amber-200/80">
                    Your total rating count is synchronized with the My Ratings section.
                  </p>
                </div>
              </div>
            </div>
          </Panel>
        </div>

        <Panel title="Recent ratings" description="Your latest ratings from My Ratings.">
          {recentRatings.length === 0 ? (
            <EmptyRatings onBrowse={() => navigate("/stores")} />
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[680px] border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 text-left">
                      <th className={thClass}>Store</th>
                      <th className={thClass}>Address</th>
                      <th className={thClass}>Your rating</th>
                      <th className={thClass}>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {recentRatings.map((item) => (
                      <RatingRow key={item.ratingId} item={item} onView={() => navigate("/my-ratings")} />
                    ))}
                  </tbody>
                </table>
              </div>

              {totalRatings > recentRatings.length && (
                <div className="mt-5 flex justify-end border-t border-white/10 pt-5">
                  <button type="button" onClick={() => navigate("/my-ratings")} className={secondaryBtn}>
                    View all ratings
                    <ArrowRight size={16} />
                  </button>
                </div>
              )}
            </>
          )}
        </Panel>
      </div>
    </Backdrop>
  );
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-indigo-300/30 bg-indigo-300/10">
        <Icon size={18} className="text-indigo-300" />
      </div>

      <div className="min-w-0">
        <p className="text-sm font-medium text-indigo-300/60">{label}</p>
        <p className="mt-0.5 break-words text-[15px] font-medium text-white">{value || "—"}</p>
      </div>
    </div>
  );
}

function RatingStat({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-5 transition-all duration-200 hover:border-white/20 hover:bg-white/10">
      <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-amber-300/30 bg-amber-300/10">
        <Icon size={18} className="text-amber-300" />
      </div>

      <p className="mt-4 text-3xl font-bold tracking-tight text-white">{value}</p>
      <p className="mt-1 text-sm text-indigo-200">{label}</p>
    </div>
  );
}

function RatingRow({ item, onView }) {
  const rating = Number(item?.rating || 0);

  return (
    <tr className="border-b border-white/5 last:border-b-0">
      <td className="px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-indigo-300/30 bg-indigo-300/10">
            <StoreIcon size={17} className="text-indigo-300" />
          </div>

          <div className="min-w-0">
            <p className="font-medium text-white">{item?.storeName || "—"}</p>
          </div>
        </div>
      </td>

      <td className="max-w-[320px] px-4 py-4">
        <div className="flex items-start gap-2">
          <MapPin size={15} className="mt-0.5 shrink-0 text-indigo-300/60" />
          <p className="text-sm leading-5 text-indigo-200">{item?.storeAddress || item?.address || "—"}</p>
        </div>
      </td>

      <td className="px-4 py-4">
        <div className="flex items-center gap-1.5">
          <Star size={17} className="fill-amber-300 text-amber-300" />
          <span className="font-semibold text-white">{rating}</span>
        </div>
      </td>

      <td className="px-4 py-4">
        <button type="button" onClick={onView} className={secondaryBtn}>
          View
          <ArrowRight size={16} />
        </button>
      </td>
    </tr>
  );
}

function EmptyRatings({ onBrowse }) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-white/15 bg-white/[0.03] px-6 py-12 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-indigo-300/30 bg-indigo-300/10">
        <Star size={26} className="text-indigo-300" />
      </div>

      <h3 className="mt-4 text-base font-bold text-white">No ratings yet</h3>

      <p className="mt-1 max-w-sm text-sm text-indigo-200">
        You have not rated any stores yet. Browse the available stores to get started.
      </p>

      <button type="button" onClick={onBrowse} className={`${primaryBtn} mt-5`}>
        Browse stores
        <ArrowRight size={17} />
      </button>
    </div>
  );
}

function getInitials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function formatDate(date) {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}