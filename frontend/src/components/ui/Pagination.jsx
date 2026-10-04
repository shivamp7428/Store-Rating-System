import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

export default function Pagination({ page, totalPages, onPageChange, className = "" }) {
  if (!totalPages || totalPages <= 1) return null;

  const goToPage = (newPage) => {
    if (newPage < 1 || newPage > totalPages || newPage === page) return;
    onPageChange(newPage);
  };

  const getPages = () => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);

    const pages = [1];
    if (page > 3) pages.push("...");

    const start = Math.max(2, page - 1);
    const end = Math.min(totalPages - 1, page + 1);
    for (let i = start; i <= end; i++) pages.push(i);

    if (page < totalPages - 2) pages.push("...");
    pages.push(totalPages);

    return pages;
  };

  const isFirst = page === 1;
  const isLast = page === totalPages;

  return (
    <div className={`flex flex-wrap items-center justify-between gap-3 ${className}`}>
      <p className="text-sm text-indigo-200">
        Page <span className="font-semibold text-white">{page}</span> of <span className="font-semibold text-white">{totalPages}</span>
      </p>

      <div className="flex items-center gap-1">
        <PageButton onClick={() => goToPage(1)} disabled={isFirst} aria-label="First page"><ChevronsLeft size={16} /></PageButton>
        <PageButton onClick={() => goToPage(page - 1)} disabled={isFirst} aria-label="Previous page"><ChevronLeft size={16} /></PageButton>

        {getPages().map((item, index) =>
          item === "..." ? (
            <span key={`ellipsis-${index}`} className="px-2 text-sm text-indigo-300/60">...</span>
          ) : (
            <PageButton key={item} active={item === page} onClick={() => goToPage(item)} aria-label={`Page ${item}`} aria-current={item === page ? "page" : undefined}>
              {item}
            </PageButton>
          )
        )}

        <PageButton onClick={() => goToPage(page + 1)} disabled={isLast} aria-label="Next page"><ChevronRight size={16} /></PageButton>
        <PageButton onClick={() => goToPage(totalPages)} disabled={isLast} aria-label="Last page"><ChevronsRight size={16} /></PageButton>
      </div>
    </div>
  );
}

function PageButton({ children, active = false, disabled = false, onClick, ...props }) {
  const base = "flex h-9 min-w-9 items-center justify-center rounded-xl px-2 text-sm transition-all duration-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-300/40 disabled:cursor-not-allowed disabled:opacity-30";
  const state = active
    ? "bg-gradient-to-r from-amber-300 to-orange-400 font-bold text-indigo-950 shadow-lg shadow-amber-400/20"
    : "font-medium text-indigo-300/60 hover:bg-white/10 hover:text-white";

  return (
    <button type="button" onClick={onClick} disabled={disabled} className={`${base} ${state}`} {...props}>
      {children}
    </button>
  );
}