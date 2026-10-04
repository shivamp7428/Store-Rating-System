import { LoaderCircle } from "lucide-react";

export default function Spinner({
  size = "md",
  text,
  className = "",
}) {
  const sizes = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-10 w-10",
    xl: "h-14 w-14",
  };

  return (
    <div
      role="status"
      className={`flex items-center justify-center gap-2.5 ${className}`}
    >
      <LoaderCircle
        className={`animate-spin text-amber-300 ${sizes[size] || sizes.md}`}
      />

      {text && (
        <span className="text-sm font-medium text-indigo-200">
          {text}
        </span>
      )}
    </div>
  );
}