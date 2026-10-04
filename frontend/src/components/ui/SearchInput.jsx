import { Search, X } from "lucide-react";

export default function SearchInput({ value, onChange, placeholder = "Search...", onClear, className = "", ...props }) {
  return (
    <div className={`relative w-full ${className}`}>
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="peer w-full rounded-2xl border border-white/10 bg-white/[0.06] py-3.5 pl-11 pr-11 text-[15px] text-white placeholder:text-indigo-300/50 outline-none transition-all duration-200 hover:border-white/20 hover:bg-white/10 focus:border-amber-300/70 focus:bg-white/10 focus:ring-4 focus:ring-amber-300/10 disabled:cursor-not-allowed disabled:opacity-60"
        {...props}
      />

      <Search
        size={18}
        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-indigo-300/60 transition-colors duration-200 peer-focus:text-amber-300"
      />

      {value && (
        <button
          type="button"
          onClick={onClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-indigo-300/60 transition-all duration-200 hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-300/40"
          aria-label="Clear search"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}