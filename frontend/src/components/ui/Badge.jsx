const variants = {
  default: "border-white/15 bg-white/[0.06] text-indigo-100",
  primary: "border-indigo-300/30 bg-indigo-300/10 text-indigo-200",
  success: "border-emerald-400/30 bg-emerald-400/10 text-emerald-200",
  warning: "border-amber-300/30 bg-amber-300/10 text-amber-300",
  danger: "border-red-400/40 bg-red-500/10 text-red-200",
};

export default function Badge({
  children,
  variant = "default",
  className = "",
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold transition-all duration-200 ${
        variants[variant] || variants.default
      } ${className}`}
    >
      {children}
    </span>
  );
}