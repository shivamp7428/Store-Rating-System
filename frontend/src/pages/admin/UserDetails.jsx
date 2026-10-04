import { useEffect, useState } from "react";
import { AlertCircle, ArrowLeft, CalendarDays, Loader2, Mail, MapPin, ShieldCheck, Star, UserRound } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { getUserById } from "../../services/adminService";

const secondaryBtn = "inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/[0.06] px-5 py-3.5 text-[15px] font-medium text-white transition-all duration-200 hover:bg-white/10 focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-300/40";

const badgeStyles = {
  primary: "border-indigo-300/30 bg-indigo-300/10 text-indigo-200",
  warning: "border-amber-300/30 bg-amber-300/10 text-amber-300",
  default: "border-white/15 bg-white/[0.06] text-indigo-100",
};

const roles = {
  ADMIN: { label: "Administrator", variant: "primary" },
  STORE_OWNER: { label: "Store Owner", variant: "warning" },
  USER: { label: "Normal User", variant: "default" },
};

const getRole = (role) => roles[role] || roles.USER;

const getInitials = (name = "") => name.split(" ").map((word) => word[0]).join("").slice(0, 2).toUpperCase();

const formatDate = (date) => new Date(date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

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
    <section className={`rounded-[28px] border border-white/15 bg-indigo-950/60 p-6 shadow-2xl shadow-black/40 backdrop-blur-2xl sm:p-8 ${className}`}>
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

function RoleBadge({ variant, children }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${badgeStyles[variant] || badgeStyles.default}`}>
      {children}
    </span>
  );
}

function PageHeader({ onBack }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      <button
        type="button"
        onClick={onBack}
        aria-label="Back to users"
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/[0.06] text-indigo-300/60 transition-all duration-200 hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-300/40"
      >
        <ArrowLeft size={18} />
      </button>

      <div>
        <p className="text-sm font-medium text-amber-300">User management</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-white">User details</h1>
        <p className="mt-1 text-sm text-indigo-200">View account information and role details.</p>
      </div>
    </div>
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
    <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4 transition-all duration-200 hover:border-white/20 hover:bg-white/10">
      <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-amber-300/30 bg-amber-300/10">
        <Icon size={18} className="text-amber-300" />
      </div>
      <p className="mt-3 text-3xl font-bold tracking-tight text-white">{value}</p>
      <p className="mt-1 text-sm text-indigo-200">{label}</p>
    </div>
  );
}

export default function UserDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const goBack = () => navigate("/admin/users");

  useEffect(() => {
    const loadUser = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await getUserById(id);
        setUser(data.user || data);
      } catch (err) {
        setError(err?.response?.data?.message || "Unable to load user details.");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [id]);

  if (loading) {
    return (
      <Backdrop className="flex min-h-[60vh] items-center justify-center">
        <div role="status" className="relative flex items-center gap-3 text-sm text-indigo-200">
          <Loader2 size={20} className="animate-spin text-amber-300" />
          Loading user...
        </div>
      </Backdrop>
    );
  }

  if (!user) {
    return (
      <Backdrop className="min-h-screen">
        <div className="relative space-y-6">
          <PageHeader onBack={goBack} />

          {error && (
            <div role="alert" className="flex items-start gap-3 rounded-2xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              <AlertCircle size={18} className="mt-0.5 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <div className="flex flex-col items-center rounded-[28px] border border-dashed border-white/15 bg-white/[0.03] px-6 py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-indigo-300/30 bg-indigo-300/10">
              <UserRound size={26} className="text-indigo-300" />
            </div>
            <h3 className="mt-4 text-base font-bold text-white">User not found</h3>
            <p className="mt-1 max-w-sm text-sm text-indigo-200">No user details are currently available for user #{id}.</p>
            <button type="button" onClick={goBack} className={`${secondaryBtn} mt-5`}>Back to users</button>
          </div>
        </div>
      </Backdrop>
    );
  }

  const { label: roleLabel, variant: roleVariant } = getRole(user.role);
  const createdAt = user.createdAt || user.created_at;

  return (
    <Backdrop className="min-h-screen">
      <div className="relative space-y-6">
        <PageHeader onBack={goBack} />

        <Panel>
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-r from-amber-300 to-orange-400 text-lg font-bold text-indigo-950 shadow-lg shadow-amber-400/20">
              {getInitials(user.name)}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-xl font-bold tracking-tight text-white">{user.name}</h2>
                <RoleBadge variant={roleVariant}>{roleLabel}</RoleBadge>
              </div>
              <p className="mt-1 text-sm text-indigo-300/60">User ID #{user.id}</p>
            </div>
          </div>
        </Panel>

        <div className="grid gap-6 lg:grid-cols-2">
          <Panel title="Personal information" description="Basic account information.">
            <div className="space-y-5">
              <InfoRow icon={UserRound} label="Full name" value={user.name} />
              <InfoRow icon={Mail} label="Email address" value={user.email} />
              <InfoRow icon={MapPin} label="Address" value={user.address} />
              <InfoRow icon={ShieldCheck} label="Role" value={roleLabel} />
              {createdAt && <InfoRow icon={CalendarDays} label="Created at" value={formatDate(createdAt)} />}
            </div>
          </Panel>

          {user.role === "STORE_OWNER" && (
            <Panel title="Rating information" description="Rating activity associated with this store owner.">
              <div className="grid grid-cols-2 gap-4">
                <RatingStat icon={Star} label="Average rating" value={user.averageRating ?? user.average_rating ?? "—"} />
                <RatingStat icon={UserRound} label="Total ratings" value={user.totalRatings ?? user.total_ratings ?? "—"} />
              </div>

              <div className="mt-5 rounded-2xl border border-amber-300/30 bg-amber-300/10 p-4">
                <div className="flex items-start gap-3">
                  <Star size={19} className="mt-0.5 shrink-0 fill-amber-300 text-amber-300" />
                  <div>
                    <p className="text-sm font-semibold text-amber-200">Store rating summary</p>
                    <p className="mt-1 text-xs leading-5 text-amber-200/80">Rating information is loaded from the store owner data returned by the API.</p>
                  </div>
                </div>
              </div>
            </Panel>
          )}
        </div>
      </div>
    </Backdrop>
  );
}