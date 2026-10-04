import { Star, Store } from "lucide-react";

export default function Logo({
  collapsed = false,
  className = "",
  variant = "dark",
}) {
  const isDark = variant === "dark";

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      <div className="relative shrink-0">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-300 to-orange-400 shadow-lg shadow-amber-400/25 transition-transform duration-200 hover:scale-105">
          <Store
            size={21}
            strokeWidth={2.2}
            className="text-indigo-950"
          />
        </div>

        <span
          className={`absolute -right-1.5 -top-1.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-indigo-950 ring-2 ${
            isDark ? "ring-indigo-900" : "ring-white"
          }`}
          style={{ width: 18, height: 18 }}
        >
          <Star size={10} className="fill-amber-300 text-amber-300" />
        </span>
      </div>

      {!collapsed && (
        <div className="flex flex-col leading-tight">
          <span
            className={`text-xl font-bold tracking-tight ${
              isDark ? "text-white" : "text-indigo-950"
            }`}
          >
            Storely
          </span>

          <span
            className={`text-xs font-medium ${
              isDark ? "text-indigo-200" : "text-indigo-600"
            }`}
          >
            Store ratings
          </span>
        </div>
      )}
    </div>
  );
}