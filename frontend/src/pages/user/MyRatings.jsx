import { useEffect, useState } from "react";
import { AlertCircle, Loader2, MapPin, Star, Store as StoreIcon, X } from "lucide-react";

import { getUserRatings, updateRating } from "../../services/userService";

const glass =
  "rounded-[28px] border border-white/15 bg-indigo-950/60 shadow-2xl shadow-black/40 backdrop-blur-2xl";

const primaryBtn =
  "inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-300 to-orange-400 px-5 py-3.5 text-[15px] font-bold text-indigo-950 shadow-lg shadow-amber-400/20 transition-all duration-200 hover:from-amber-200 hover:to-orange-300 focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-300/40 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60";

const secondaryBtn =
  "inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/[0.06] px-5 py-3.5 text-[15px] font-semibold text-white transition-all duration-200 hover:bg-white/10 focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-300/40 disabled:cursor-not-allowed disabled:opacity-50";

const emptyPagination = { page: 1, limit: 9, total: 0, totalPages: 0 };

function Notice({ message }) {
  return (
    <div
      role="alert"
      className="flex items-start gap-3 rounded-2xl border border-red-400/40 bg-red-500/10 p-4 text-sm text-red-200"
    >
      <AlertCircle size={18} className="mt-0.5 shrink-0 text-red-300" />
      <p>{message}</p>
    </div>
  );
}

function Modal({ isOpen, onClose, title, description, children }) {
  useEffect(() => {
    if (!isOpen) return undefined;

    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKeyDown);

    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-indigo-950/70 p-4 backdrop-blur-md"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="w-full max-w-md rounded-[28px] border border-white/15 bg-indigo-950/80 p-7 shadow-2xl shadow-black/40 backdrop-blur-2xl sm:p-8"
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-white">{title}</h2>
            {description && <p className="mt-1 text-sm text-indigo-200">{description}</p>}
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-2xl p-2 text-indigo-300/60 transition-all duration-200 hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-300/40"
          >
            <X size={18} />
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}

export default function MyRatings() {
  const [ratings, setRatings] = useState([]);

  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(emptyPagination);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedRating, setSelectedRating] = useState(null);
  const [rating, setRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [ratingError, setRatingError] = useState("");

  useEffect(() => {
    loadRatings();
  }, [page]);

  const loadRatings = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getUserRatings({ page, limit: 9 });

      setRatings(data.ratings || []);
      setPagination(data.pagination || emptyPagination);
    } catch (err) {
      setError(err?.response?.data?.message || "Unable to load your ratings.");
      setRatings([]);
    } finally {
      setLoading(false);
    }
  };

  const openRatingModal = (item) => {
    setSelectedRating(item);
    setRating(item.rating ?? 0);
    setRatingError("");
  };

  const closeRatingModal = () => {
    if (submitting) return;

    setSelectedRating(null);
    setRating(0);
    setRatingError("");
  };

  const handleRatingUpdate = async () => {
    if (!selectedRating) return;

    if (!rating) {
      setRatingError("Please select a rating from 1 to 5.");
      return;
    }

    try {
      setSubmitting(true);
      setRatingError("");

      await updateRating(selectedRating.storeId, rating);

      setRatings((prev) =>
        prev.map((item) => (item.ratingId === selectedRating.ratingId ? { ...item, rating } : item))
      );

      setSubmitting(false);
      setSelectedRating(null);
      setRating(0);
    } catch (err) {
      console.error("Rating update error:", err);

      setRatingError(err?.response?.data?.message || "Unable to update rating.");
      setSubmitting(false);
    }
  };

  return (
    <div
      className="relative min-h-screen overflow-hidden bg-gradient-to-br from-indigo-950 via-violet-950 to-fuchsia-950 text-white selection:bg-amber-300 selection:text-indigo-950"
      style={{ fontFamily: "'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif" }}
    >
      <div className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[720px] -translate-x-1/2 -translate-y-1/3 rounded-full bg-violet-600/40 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-80 w-80 translate-x-1/4 translate-y-1/4 rounded-full bg-amber-400/20 blur-3xl" />

      <div className="relative">
        <div className="mx-auto max-w-6xl space-y-6 px-4 py-10 sm:px-6">
          <div>
            <p className="text-sm font-medium text-amber-300">Your activity</p>

            <h1 className="mt-1 text-3xl font-bold tracking-tight text-white sm:text-4xl">My ratings</h1>

            <p className="mt-2 text-sm text-indigo-200">View and modify the ratings you have submitted.</p>
          </div>

          {error && <Notice message={error} />}

          {loading ? (
            <div role="status" className="flex min-h-[45vh] items-center justify-center gap-3 text-sm text-indigo-200">
              <Loader2 size={20} className="animate-spin text-amber-300" />
              Loading your ratings...
            </div>
          ) : ratings.length === 0 ? (
            <div className="flex flex-col items-center rounded-[28px] border border-dashed border-white/15 bg-white/[0.03] px-6 py-16 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-indigo-300/30 bg-indigo-300/10">
                <StoreIcon size={26} className="text-indigo-300" />
              </div>

              <h3 className="mt-4 text-base font-bold text-white">No ratings yet</h3>

              <p className="mt-1 max-w-sm text-sm text-indigo-200">You haven't rated any stores yet.</p>
            </div>
          ) : (
            <>
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {ratings.map((item) => (
                  <RatingCard key={item.ratingId} item={item} onEdit={() => openRatingModal(item)} />
                ))}
              </div>

              {pagination.totalPages > 1 && (
                <div className="mt-8 flex items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={() => setPage((prev) => prev - 1)}
                    disabled={page === 1 || loading}
                    className={secondaryBtn}
                  >
                    Previous
                  </button>

                  <span className="text-sm font-medium text-indigo-200">
                    Page {page} of {pagination.totalPages}
                  </span>

                  <button
                    type="button"
                    onClick={() => setPage((prev) => prev + 1)}
                    disabled={page === pagination.totalPages || loading}
                    className={secondaryBtn}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <Modal
        isOpen={Boolean(selectedRating)}
        onClose={closeRatingModal}
        title="Modify your rating"
        description={selectedRating ? `Update your rating for ${selectedRating.storeName}.` : ""}
      >
        {selectedRating && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4">
              <p className="text-sm font-semibold text-white">{selectedRating.storeName}</p>

              <div className="mt-2 flex items-start gap-2 text-sm text-indigo-200">
                <MapPin size={15} className="mt-0.5 shrink-0 text-indigo-300/60" />
                <span>{selectedRating.storeAddress}</span>
              </div>
            </div>

            {ratingError && <Notice message={ratingError} />}

            <div>
              <p className="text-sm font-medium text-indigo-100">Your rating</p>

              <div className="mt-3 flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setRating(value)}
                    aria-label={`Rate ${value} out of 5`}
                    aria-pressed={value === rating}
                    className="rounded-xl p-1 transition-transform duration-150 hover:scale-110 focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-300/40 motion-reduce:hover:scale-100"
                  >
                    <Star
                      size={34}
                      className={value <= rating ? "fill-amber-300 text-amber-300" : "text-white/20"}
                    />
                  </button>
                ))}
              </div>

              <p className="mt-2 text-xs text-indigo-300/60">
                {rating ? `${rating} out of 5` : "Select a rating"}
              </p>
            </div>

            <div className="flex justify-end gap-3 border-t border-white/10 pt-5">
              <button type="button" onClick={closeRatingModal} disabled={submitting} className={secondaryBtn}>
                Cancel
              </button>

              <button type="button" onClick={handleRatingUpdate} disabled={submitting} className={primaryBtn}>
                {submitting && <Loader2 size={16} className="animate-spin" />}
                {submitting ? "Updating..." : "Update rating"}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

function RatingCard({ item, onEdit }) {
  return (
    <section
      className={`${glass} group p-6 transition-all duration-200 hover:-translate-y-1 hover:border-white/25 motion-reduce:hover:translate-y-0`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-indigo-300/30 bg-indigo-300/10">
          <StoreIcon size={23} className="text-indigo-300" />
        </div>

        <span className="inline-flex items-center gap-1 rounded-full border border-amber-300/30 bg-amber-300/10 px-2.5 py-1 text-xs font-semibold text-amber-300">
          <Star size={13} className="fill-current" />
          {item.rating}/5
        </span>
      </div>

      <div className="mt-5">
        <h2 className="text-lg font-bold tracking-tight text-white">{item.storeName}</h2>

        <div className="mt-2 flex items-start gap-2 text-sm leading-5 text-indigo-200">
          <MapPin size={16} className="mt-0.5 shrink-0 text-indigo-300/60" />
          <span>{item.storeAddress}</span>
        </div>
      </div>

      <div className="mt-5 border-t border-white/10 pt-4">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-sm font-medium text-indigo-300/70">Your rating</span>

          <div className="flex items-center gap-0.5" role="img" aria-label={`${item.rating} out of 5 stars`}>
            {[1, 2, 3, 4, 5].map((value) => (
              <Star
                key={value}
                size={16}
                className={value <= item.rating ? "fill-amber-300 text-amber-300" : "text-white/20"}
              />
            ))}
          </div>
        </div>

        <button type="button" onClick={onEdit} className={`${secondaryBtn} w-full`}>
          <Star size={16} />
          Modify rating
        </button>
      </div>
    </section>
  );
}