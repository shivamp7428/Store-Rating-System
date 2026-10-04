export default function Card({ children, title, description, action, className = "", padding = true }) {
  const hasHeader = title || description || action;

  return (
    <div className={`rounded-[28px] border border-white/15 bg-indigo-950/60 shadow-2xl shadow-black/40 backdrop-blur-2xl transition-all duration-200 ${className}`}>
      {hasHeader && (
        <div className="flex items-start justify-between gap-4 border-b border-white/10 px-6 py-5 sm:px-8">
          <div>
            {title && <h2 className="text-lg font-bold tracking-tight text-white">{title}</h2>}
            {description && <p className="mt-1 text-sm leading-relaxed text-indigo-200">{description}</p>}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}
      {padding ? <div className="p-6 sm:p-8">{children}</div> : children}
    </div>
  );
}