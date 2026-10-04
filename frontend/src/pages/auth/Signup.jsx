import { useState } from "react";
import { AlertCircle, ArrowRight, Eye, EyeOff, Loader2, Lock, Mail, MapPin, Star, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../../components/common/Logo";
import { useAuth } from "../../context/AuthContext";

const initialForm = { name: "", email: "", address: "", password: "", confirmPassword: "" };

const field = "peer w-full rounded-2xl border border-white/10 bg-white/[0.06] py-3.5 pl-11 pr-4 text-[15px] text-white placeholder:text-indigo-300/50 transition-all duration-200 hover:border-white/20 hover:bg-white/10 focus:border-amber-300/70 focus:bg-white/10 focus:outline-none focus:ring-4 focus:ring-amber-300/10";
const labelClass = "mb-2 block text-sm font-medium text-indigo-100";
const fieldIcon = "pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-indigo-300/60 transition-colors duration-200 peer-focus:text-amber-300";

const ROW_ONE = [
  ["Green Basket Market", "4.8"],
  ["Urban Threads", "4.6"],
  ["Daily Brew Cafe", "4.9"],
  ["Pixel & Print", "4.4"],
  ["Fresh Mart", "4.7"],
  ["Book Nook", "4.5"],
];

const ROW_TWO = [
  ["Sunrise Bakery", "4.9"],
  ["Home Hardware Co.", "4.3"],
  ["The Pet Place", "4.8"],
  ["Orbit Electronics", "4.5"],
  ["Leaf & Petal", "4.7"],
  ["City Pharmacy", "4.6"],
];

function MarqueeRow({ items, reverse = false, className = "" }) {
  const loop = [...items, ...items];

  return (
    <div className={`flex w-max gap-4 ${className}`}>
      <div className={`glow-marquee flex shrink-0 gap-4 ${reverse ? "glow-marquee-reverse" : ""}`}>
        {loop.map(([name, score], index) => (
          <div key={`${name}-${index}`} className="flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.05] px-5 py-3 text-sm text-indigo-100/80">
            <span className="font-medium">{name}</span>
            <span className="flex items-center gap-1 font-semibold text-amber-300">
              <Star size={13} className="fill-current" />
              {score}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function TextField({ label, icon: Icon, ...props }) {
  return (
    <div>
      <label htmlFor={props.id} className={labelClass}>{label}</label>
      <div className="relative">
        <input {...props} className={field} />
        <Icon size={18} className={fieldIcon} />
      </div>
    </div>
  );
}

function PasswordField({ label, show, onToggle, toggleLabel, ...props }) {
  return (
    <div>
      <label htmlFor={props.id} className={labelClass}>{label}</label>
      <div className="relative">
        <input {...props} type={show ? "text" : "password"} className={`${field} pr-12`} />
        <Lock size={18} className={fieldIcon} />
        <button
          type="button"
          onClick={onToggle}
          aria-label={`${show ? "Hide" : "Show"} ${toggleLabel}`}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-xl p-2 text-indigo-300/60 transition-colors duration-200 hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-300/20"
        >
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );
}

export default function Signup() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [form, setForm] = useState(initialForm);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = ({ target: { name, value } }) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) return setError("Passwords do not match.");

    setLoading(true);

    try {
      const data = await signup({ name: form.name, email: form.email, address: form.address, password: form.password });
      sessionStorage.removeItem("lastProtectedPath");
      navigate(data?.user?.role === "USER" ? "/stores" : "/login", { replace: true });
    } catch (err) {
      setError(err?.response?.data?.message || "Unable to create account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-950 via-violet-950 to-fuchsia-950 px-5 py-12 selection:bg-amber-300 selection:text-indigo-950"
      style={{ fontFamily: "'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif" }}
    >
      <style>{`
        @keyframes glow-scroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .glow-marquee { animation: glow-scroll 60s linear infinite; }
        .glow-marquee-reverse { animation-direction: reverse; animation-duration: 75s; }
        @media (prefers-reduced-motion: reduce) { .glow-marquee { animation: none; } }
      `}</style>

      <div className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[720px] -translate-x-1/2 -translate-y-1/3 rounded-full bg-violet-600/40 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-80 w-80 translate-x-1/4 translate-y-1/4 rounded-full bg-amber-400/20 blur-3xl" />

      <div aria-hidden="true" className="pointer-events-none absolute inset-0 flex -rotate-6 scale-125 flex-col justify-center gap-5 opacity-70">
        <MarqueeRow items={ROW_ONE} />
        <MarqueeRow items={ROW_TWO} reverse className="-ml-40" />
        <MarqueeRow items={ROW_ONE} className="-ml-16" />
        <MarqueeRow items={ROW_TWO} reverse className="-ml-64" />
        <MarqueeRow items={ROW_ONE} className="-ml-24" />
      </div>

      <main className="relative w-full max-w-xl">
        <div className="rounded-[28px] border border-white/15 bg-indigo-950/60 p-8 shadow-2xl shadow-black/40 backdrop-blur-2xl sm:p-10">
          <div className="flex justify-center">
            <Logo variant="dark" />
          </div>

          <h1 className="mt-8 text-center text-3xl font-bold tracking-tight text-white">Create your account</h1>
          <p className="mt-2 text-center text-[15px] text-indigo-200">Rate stores you visit and see what others think.</p>

          {error && (
            <div role="alert" className="mt-6 flex items-start gap-3 rounded-2xl border border-red-400/40 bg-red-500/10 p-4 text-sm text-red-200">
              <AlertCircle size={18} className="mt-0.5 shrink-0 text-red-300" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <TextField label="Full name" id="name" name="name" type="text" required placeholder="Enter your full name" minLength={20} maxLength={60} value={form.name} onChange={handleChange} icon={User} />
            <TextField label="Email" id="email" name="email" type="email" required autoComplete="email" placeholder="you@example.com" value={form.email} onChange={handleChange} icon={Mail} />
            <TextField label="Address" id="address" name="address" type="text" required maxLength={400} placeholder="Enter your street address" value={form.address} onChange={handleChange} icon={MapPin} />

            <div className="grid gap-5 sm:grid-cols-2">
              <PasswordField
                label="Password" id="password" name="password" required minLength={8} maxLength={16} autoComplete="new-password" placeholder="Create password"
                value={form.password} onChange={handleChange} show={showPassword} onToggle={() => setShowPassword((prev) => !prev)} toggleLabel="password"
              />
              <PasswordField
                label="Confirm password" id="confirmPassword" name="confirmPassword" required minLength={8} maxLength={16} autoComplete="new-password" placeholder="Repeat password"
                value={form.confirmPassword} onChange={handleChange} show={showConfirmPassword} onToggle={() => setShowConfirmPassword((prev) => !prev)} toggleLabel="confirm password"
              />
            </div>

            <p className="text-xs leading-5 text-indigo-300/60">Use 8–16 characters with at least one uppercase letter and one special character.</p>

            <button
              type="submit"
              disabled={loading}
              className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-300 to-orange-400 px-5 py-3.5 text-[15px] font-bold text-indigo-950 shadow-lg shadow-amber-400/20 transition-all duration-200 hover:from-amber-200 hover:to-orange-300 focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-300/40 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  Create account
                  <ArrowRight size={18} className="transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none" />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-indigo-200">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-amber-300 transition-colors hover:text-amber-200 hover:underline">Sign in</Link>
        </p>
      </main>
    </div>
  );
}