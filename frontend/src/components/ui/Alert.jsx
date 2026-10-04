import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from "lucide-react";

const variants = {
  success: {
    icon: CheckCircle2,
    wrapper: "border-emerald-400/30 bg-emerald-400/10 text-emerald-200",
    iconColor: "text-emerald-300",
    closeHover: "hover:bg-emerald-400/20 hover:text-emerald-100",
  },
  error: {
    icon: AlertCircle,
    wrapper: "border-red-400/40 bg-red-500/10 text-red-200",
    iconColor: "text-red-300",
    closeHover: "hover:bg-red-500/20 hover:text-red-100",
  },
  warning: {
    icon: AlertTriangle,
    wrapper: "border-amber-300/30 bg-amber-300/10 text-amber-200",
    iconColor: "text-amber-300",
    closeHover: "hover:bg-amber-300/20 hover:text-amber-100",
  },
  info: {
    icon: Info,
    wrapper: "border-indigo-300/30 bg-indigo-300/10 text-indigo-100",
    iconColor: "text-indigo-300",
    closeHover: "hover:bg-white/10 hover:text-white",
  },
};

export default function Alert({ type = "info", title, message, onClose, className = "" }) {
  const config = variants[type] || variants.info;
  const Icon = config.icon;

  return (
    <div
      role={type === "success" ? "status" : "alert"}
      className={`flex items-start gap-3.5 rounded-2xl border p-4 transition-all duration-200 ${config.wrapper} ${className}`}
    >
      <Icon size={19} className={`mt-0.5 shrink-0 ${config.iconColor}`} />

      <div className="min-w-0 flex-1">
        {title && <h4 className="text-sm font-bold leading-tight tracking-tight">{title}</h4>}

        {message && (
          <p className={`text-sm leading-relaxed opacity-90 ${title ? "mt-1" : ""}`}>{message}</p>
        )}
      </div>

      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className={`shrink-0 rounded-xl p-1.5 text-indigo-300/60 transition-all duration-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-300/40 ${config.closeHover}`}
          aria-label="Close alert"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}