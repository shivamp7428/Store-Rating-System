import { useState } from "react";
import { AlertCircle, ArrowLeft, CheckCircle2, Loader2, Lock, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { changePassword } from "../../services/authService";

const initialForm = { currentPassword: "", newPassword: "", confirmPassword: "" };

const field = "peer w-full rounded-2xl border border-white/10 bg-white/[0.06] py-3.5 pl-11 pr-4 text-[15px] text-white placeholder:text-indigo-300/50 transition-all duration-200 hover:border-white/20 hover:bg-white/10 focus:border-amber-300/70 focus:bg-white/10 focus:outline-none focus:ring-4 focus:ring-amber-300/10";
const labelClass = "mb-2 block text-sm font-medium text-indigo-100";
const fieldIcon = "pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-indigo-300/60 transition-colors duration-200 peer-focus:text-amber-300";

function TextInput({ label, icon: Icon, ...props }) {
  return (
    <div>
      <label htmlFor={props.name} className={labelClass}>{label}</label>
      <div className="relative">
        <input id={props.name} {...props} className={field} />
        {Icon && <Icon size={18} className={fieldIcon} />}
      </div>
    </div>
  );
}

function Notice({ type, message }) {
  const isError = type === "error";
  const Icon = isError ? AlertCircle : CheckCircle2;
  const tone = isError ? "border-red-400/40 bg-red-500/10 text-red-200" : "border-emerald-400/30 bg-emerald-400/10 text-emerald-200";
  const iconTone = isError ? "text-red-300" : "text-emerald-300";

  return (
    <div role={isError ? "alert" : "status"} className={`mb-5 flex items-start gap-3 rounded-2xl border p-4 text-sm ${tone}`}>
      <Icon size={18} className={`mt-0.5 shrink-0 ${iconTone}`} />
      <p>{message}</p>
    </div>
  );
}

export default function ChangePassword() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = ({ target: { name, value } }) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (form.newPassword !== form.confirmPassword) return setError("New passwords do not match.");
    if (form.currentPassword === form.newPassword) return setError("New password must be different from the current password.");

    setLoading(true);

    try {
      await changePassword({ currentPassword: form.currentPassword, newPassword: form.newPassword });
      setSuccess("Password changed successfully.");
      setForm(initialForm);
    } catch (err) {
      setError(err?.response?.data?.message || "Unable to change password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="relative min-h-screen overflow-hidden bg-gradient-to-br from-indigo-950 via-violet-950 to-fuchsia-950 px-4 py-10 selection:bg-amber-300 selection:text-indigo-950 sm:px-6"
      style={{ fontFamily: "'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif" }}
    >
      <div className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[720px] -translate-x-1/2 -translate-y-1/3 rounded-full bg-violet-600/40 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-80 w-80 translate-x-1/4 translate-y-1/4 rounded-full bg-amber-400/20 blur-3xl" />

      <div className="relative mx-auto max-w-2xl space-y-6">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="Go back"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/[0.06] text-indigo-200 backdrop-blur-xl transition-all duration-200 hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-300/30"
          >
            <ArrowLeft size={18} />
          </button>

          <div>
            <p className="text-sm font-medium text-amber-300">Account security</p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-white">Change password</h1>
            <p className="mt-1 text-sm text-indigo-200">Update your password to keep your account secure.</p>
          </div>
        </div>

        <section className="rounded-[28px] border border-white/15 bg-indigo-950/60 p-8 shadow-2xl shadow-black/40 backdrop-blur-2xl sm:p-10">
          <div className="mb-6">
            <h2 className="text-xl font-bold tracking-tight text-white">Update password</h2>
            <p className="mt-1 text-sm text-indigo-200">Enter your current password and choose a new one.</p>
          </div>

          {error && <Notice type="error" message={error} />}
          {success && <Notice type="success" message={success} />}

          <form onSubmit={handleSubmit} className="space-y-5">
            <TextInput label="Current password" name="currentPassword" type="password" placeholder="Enter current password" value={form.currentPassword} onChange={handleChange} icon={Lock} autoComplete="current-password" required />
            <TextInput label="New password" name="newPassword" type="password" placeholder="Enter new password" value={form.newPassword} onChange={handleChange} icon={Lock} minLength={8} maxLength={16} autoComplete="new-password" required />
            <TextInput label="Confirm new password" name="confirmPassword" type="password" placeholder="Confirm new password" value={form.confirmPassword} onChange={handleChange} icon={Lock} minLength={8} maxLength={16} autoComplete="new-password" required />

            <div className="rounded-2xl border border-amber-300/20 bg-amber-300/[0.07] p-4">
              <div className="flex gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-amber-300/30 bg-amber-300/10">
                  <ShieldCheck size={19} className="text-amber-300" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">Password requirements</h3>
                  <p className="mt-1 text-xs leading-5 text-indigo-200">Use 8–16 characters with at least one uppercase letter and one special character.</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end border-t border-white/10 pt-6">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-300 to-orange-400 px-6 py-3.5 text-[15px] font-bold text-indigo-950 shadow-lg shadow-amber-400/20 transition-all duration-200 hover:from-amber-200 hover:to-orange-300 focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-300/40 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading && <Loader2 size={18} className="animate-spin" />}
                {loading ? "Changing..." : "Change password"}
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}