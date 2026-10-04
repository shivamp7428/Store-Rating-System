import { forwardRef } from "react";

const Input = forwardRef(({ label, name, type = "text", placeholder, error, hint, icon: Icon, className = "", required = false, ...props }, ref) => {
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
        <input
          ref={ref}
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={`peer w-full rounded-2xl border bg-white/[0.06] px-4 py-3.5 text-[15px] text-white placeholder:text-indigo-300/50 outline-none transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60 ${Icon ? "pl-11" : ""} ${stateStyles} ${className}`}
          {...props}
        />
        {Icon && <Icon size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-indigo-300/60 transition-colors duration-200 peer-focus:text-amber-300" />}
      </div>

      {error && <p id={`${name}-error`} role="alert" className="mt-1.5 text-xs text-red-200">{error}</p>}
      {!error && hint && <p id={`${name}-hint`} className="mt-1.5 text-xs text-indigo-300/60">{hint}</p>}
    </div>
  );
});

Input.displayName = "Input";

export default Input;