import { Inbox } from "lucide-react";

export default function EmptyState({
  icon: Icon = Inbox,
  title = "No data found",
  description = "There is nothing to display here yet.",
  action,
  className = "",
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 bg-white/[0.03] px-6 py-12 text-center ${className}`}
    >
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-indigo-300/30 bg-indigo-300/10">
        <Icon size={26} className="text-indigo-300" />
      </div>

      <h3 className="text-base font-bold text-white">{title}</h3>

      <p className="mt-1 max-w-sm text-sm leading-relaxed text-indigo-200">{description}</p>

      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}