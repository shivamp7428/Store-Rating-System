import { useEffect } from "react";
import { X } from "lucide-react";

const sizes = {
  sm: "max-w-sm",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
};

export default function Modal({ isOpen, onClose, title, description, children, size = "md" }) {
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="absolute inset-0 bg-indigo-950/70 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      />

      <div
        className={`relative w-full ${sizes[size] || sizes.md} overflow-hidden rounded-[28px] border border-white/15 bg-indigo-950/60 shadow-2xl shadow-black/40 backdrop-blur-2xl transition-all duration-300`}
      >
        <div className="flex items-start justify-between border-b border-white/10 px-6 py-5 sm:px-8">
          <div className="pr-6">
            <h2 id="modal-title" className="text-lg font-bold tracking-tight text-white">{title}</h2>

            {description && (
              <p className="mt-1 text-sm leading-relaxed text-indigo-200">{description}</p>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl p-2 text-indigo-300/60 transition-all duration-200 hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-300/40"
            aria-label="Close modal"
          >
            <X size={19} />
          </button>
        </div>

        <div className="max-h-[75vh] overflow-y-auto p-6 text-indigo-200 sm:p-8">{children}</div>
      </div>
    </div>
  );
}