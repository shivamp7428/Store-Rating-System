import { Loader2 } from "lucide-react";

const variants = {
  primary: "bg-gradient-to-r from-amber-300 to-orange-400 font-bold text-indigo-950 shadow-lg shadow-amber-400/20 hover:from-amber-200 hover:to-orange-300 focus-visible:ring-4 focus-visible:ring-amber-300/40",
  secondary: "border border-white/15 bg-white/[0.06] text-white hover:bg-white/10 focus-visible:ring-4 focus-visible:ring-amber-300/40",
  danger: "border border-red-400/40 bg-red-500/10 text-red-200 hover:bg-red-500/20 hover:text-red-100 focus-visible:ring-4 focus-visible:ring-red-400/30",
  ghost: "bg-transparent text-indigo-300/60 hover:bg-white/10 hover:text-white focus-visible:ring-4 focus-visible:ring-amber-300/40",
};

const sizes = {
  sm: "px-3 py-1.5 text-xs rounded-xl gap-1.5",
  md: "px-4 py-2.5 text-sm rounded-2xl gap-2",
  lg: "px-5 py-3.5 text-[15px] rounded-2xl gap-2.5",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  icon: Icon,
  type = "button",
  className = "",
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 ${
        variants[variant] || variants.primary
      } ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {loading ? (
        <>
          <Loader2 size={18} className="animate-spin" />
          <span>Processing...</span>
        </>
      ) : (
        <>
          {Icon && <Icon size={18} className="shrink-0" />}
          {children}
        </>
      )}
    </button>
  );
}