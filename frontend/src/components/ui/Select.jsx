import { ChevronDown } from "lucide-react";

export default function Select({ label, name, value, onChange, options = [], placeholder = "Select an option", error, hint, required = false, disabled = false, icon: Icon, className = "", ...props }) {
  const describedBy = error ? `${name}-error` : hint ? `${name}-hint` : undefined;
  const stateStyles = error
    ? "border-red-400/40 hover:bg-white/10 focus:border-red-400/70 focus:bg-white/10 focus:ring-4 focus:ring-red-400/10"
    : "border-white/10 hover:border-white/20 hover:bg-white/10 focus:border-amber-300/70 focus:bg-white/10 focus:ring-4 focus:ring-amber-300/10";

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={name} className="mb-1.5 block text-sm font-medium text-indigo-100">
          {label}
          {required && <span className="ml-1 text-red-300">*</span>}
        </label>
      )}

      <div className="relative">
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={`peer w-full cursor-pointer appearance-none rounded-2xl border bg-white/[0.06] py-3.5 pl-4 pr-11 text-[15px] outline-none transition-all duration-200 [color-scheme:dark] disabled:cursor-not-allowed disabled:opacity-60 ${Icon ? "pl-11" : ""} ${value === "" ? "text-indigo-300/50" : "text-white"} ${stateStyles} ${className}`}
          {...props}
        >
          <option value="" disabled className="bg-indigo-950 text-indigo-300">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value} className="bg-indigo-950 text-white">{option.label}</option>
          ))}
        </select>

        {Icon && <Icon size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-indigo-300/60 transition-colors duration-200 peer-focus:text-amber-300" />}
        <ChevronDown size={18} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-indigo-300/60 transition-all duration-200 peer-focus:rotate-180 peer-focus:text-amber-300" />
      </div>

      {error && <p id={`${name}-error`} role="alert" className="mt-1.5 text-xs text-red-200">{error}</p>}
      {!error && hint && <p id={`${name}-hint`} className="mt-1.5 text-xs text-indigo-300/60">{hint}</p>}
    </div>
  );
}