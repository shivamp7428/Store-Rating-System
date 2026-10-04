import { useState } from "react";
import { AlertCircle, ArrowLeft, CheckCircle2, ChevronDown, Loader2, Lock, Mail, MapPin, Shield, User, UserCog } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Logo from "../../components/common/Logo";
import { createUser } from "../../services/adminService";

const roleOptions = [
  { value: "USER", label: "Normal User" },
  { value: "STORE_OWNER", label: "Store Owner" },
  { value: "ADMIN", label: "Administrator" },
];

const initialForm = { name: "", email: "", password: "", address: "", role: "" };

const controlBase = "peer w-full rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3.5 text-[15px] text-white placeholder:text-indigo-300/50 transition-all duration-200 hover:border-white/20 hover:bg-white/10 focus:border-amber-300/70 focus:bg-white/10 focus:outline-none focus:ring-4 focus:ring-amber-300/10 disabled:cursor-not-allowed disabled:opacity-60";
const labelClass = "mb-1.5 block text-sm font-medium text-indigo-100";
const iconClass = "pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-indigo-300/60 transition-colors duration-200 peer-focus:text-amber-300";

function Field({ id, label, hint, children }) {
  return (
    <div>
      <label htmlFor={id} className={labelClass}>{label}</label>
      {children}
      {hint && <p id={`${id}-hint`} className="mt-1.5 text-xs text-indigo-300/60">{hint}</p>}
    </div>
  );
}

function TextInput({ label, hint, icon: Icon, ...props }) {
  const id = props.id || props.name;

  return (
    <Field id={id} label={label} hint={hint}>
      <div className="relative">
        <input {...props} id={id} aria-describedby={hint ? `${id}-hint` : undefined} className={`${controlBase} ${Icon ? "pl-11" : ""}`} />
        {Icon && <Icon size={18} className={iconClass} />}
      </div>
    </Field>
  );
}

function SelectInput({ label, hint, icon: Icon, options, placeholder, ...props }) {
  const id = props.id || props.name;

  return (
    <Field id={id} label={label} hint={hint}>
      <div className="relative">
        <select
          {...props}
          id={id}
          aria-describedby={hint ? `${id}-hint` : undefined}
          className={`${controlBase} appearance-none pr-11 ${Icon ? "pl-11" : ""} ${props.value ? "" : "text-indigo-300/50"}`}
        >
          <option value="" className="bg-indigo-950 text-white">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value} className="bg-indigo-950 text-white">{option.label}</option>
          ))}
        </select>
        {Icon && <Icon size={18} className={iconClass} />}
        <ChevronDown size={18} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-indigo-300/60" />
      </div>
    </Field>
  );
}

function Notice({ type, message }) {
  const isError = type === "error";
  const Icon = isError ? AlertCircle : CheckCircle2;
  const tone = isError ? "border-red-400/40 bg-red-500/10 text-red-200" : "border-emerald-400/30 bg-emerald-400/10 text-emerald-200";

  return (
    <div role={isError ? "alert" : "status"} className={`mb-5 flex items-start gap-3 rounded-2xl border px-4 py-3 text-sm ${tone}`}>
      <Icon size={18} className="mt-0.5 shrink-0" />
      <p>{message}</p>
    </div>
  );
}

export default function AddUser() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const goBack = () => navigate("/admin/users");

  const handleChange = ({ target: { name, value } }) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
    if (success) setSuccess("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!form.role) return setError("Please select a user role.");

    setLoading(true);

    try {
      await createUser(form);
      setSuccess("User created successfully.");
      setForm(initialForm);
    } catch (err) {
      setError(err?.response?.data?.message || "Unable to create user. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="relative min-h-screen overflow-hidden bg-gradient-to-br from-indigo-950 via-violet-950 to-fuchsia-950 px-4 py-8 sm:px-6"
      style={{ fontFamily: '"Plus Jakarta Sans", ui-sans-serif, system-ui, sans-serif' }}
    >
      <div className="pointer-events-none absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-violet-600/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-24 h-80 w-80 rounded-full bg-amber-400/20 blur-3xl" />

      <div className="relative mx-auto max-w-4xl space-y-6">
        <Logo variant="dark" />

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={goBack}
            aria-label="Back to users"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/[0.06] text-indigo-300/60 transition-all duration-200 hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-300/40"
          >
            <ArrowLeft size={18} />
          </button>

          <div>
            <p className="text-sm font-medium text-amber-300">Administration</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-white">Add user</h1>
            <p className="mt-1 text-sm text-indigo-200">Create a new user account and assign a role.</p>
          </div>
        </div>

        <section className="rounded-[28px] border border-white/15 bg-indigo-950/60 p-6 shadow-2xl shadow-black/40 backdrop-blur-2xl sm:p-10">
          <div className="mb-6">
            <h2 className="text-lg font-bold tracking-tight text-white">User information</h2>
            <p className="mt-1 text-sm text-indigo-200">Enter the required details for the new account.</p>
          </div>

          {error && <Notice type="error" message={error} />}
          {success && <Notice type="success" message={success} />}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-5 md:grid-cols-2">
              <TextInput label="Full name" name="name" placeholder="Enter full name" value={form.name} onChange={handleChange} icon={User} minLength={20} maxLength={60} hint="Must be between 20 and 60 characters." required />
              <TextInput label="Email address" name="email" type="email" placeholder="user@example.com" value={form.email} onChange={handleChange} icon={Mail} required />
              <TextInput label="Password" name="password" type="password" placeholder="Create password" value={form.password} onChange={handleChange} icon={Lock} minLength={8} maxLength={16} hint="8–16 characters, uppercase + special character." required />
              <SelectInput label="Role" name="role" value={form.role} onChange={handleChange} options={roleOptions} placeholder="Select user role" icon={UserCog} required />
            </div>

            <TextInput label="Address" name="address" placeholder="Enter complete address" value={form.address} onChange={handleChange} icon={MapPin} maxLength={400} hint="Maximum 400 characters." required />

            <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4">
              <div className="flex gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-indigo-300/30 bg-indigo-300/10">
                  <Shield size={18} className="text-indigo-300" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">Role-based access</h3>
                  <p className="mt-1 text-xs leading-5 text-indigo-200">The selected role determines which areas of the application this user can access.</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-white/10 pt-6 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={goBack}
                className="rounded-2xl border border-white/15 bg-white/[0.06] px-5 py-3.5 text-[15px] font-medium text-white transition-all duration-200 hover:bg-white/10 focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-300/40"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-300 to-orange-400 px-5 py-3.5 text-[15px] font-bold text-indigo-950 shadow-lg shadow-amber-400/20 transition-all duration-200 hover:from-amber-200 hover:to-orange-300 focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-300/40 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading && <Loader2 size={18} className="animate-spin" />}
                {loading ? "Creating..." : "Create user"}
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}