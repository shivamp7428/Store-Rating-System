import { useEffect, useState } from "react";
import { AlertCircle, Loader2, MapPin, Search, Star, Store as StoreIcon, X } from "lucide-react";
import { getUserStores, submitRating, updateRating } from "../../services/userService";

const emptyPagination = { page: 1, limit: 10, total: 0, totalPages: 0 };

const glass = "rounded-[28px] border border-white/15 bg-indigo-950/60 shadow-2xl shadow-black/30 backdrop-blur-2xl";
const field = "peer w-full rounded-2xl border border-white/10 bg-white/[0.06] py-3.5 pl-11 pr-11 text-[15px] text-white placeholder:text-indigo-300/50 transition-all duration-200 hover:border-white/20 hover:bg-white/10 focus:border-amber-300/70 focus:bg-white/10 focus:outline-none focus:ring-4 focus:ring-amber-300/10";
const primaryBtn = "inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-300 to-orange-400 px-5 py-3 text-sm font-bold text-indigo-950 shadow-lg shadow-amber-400/20 transition-all duration-200 hover:from-amber-200 hover:to-orange-300 focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-300/40 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60";
const secondaryBtn = "inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/[0.06] px-5 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-white/10 focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-300/30 disabled:cursor-not-allowed disabled:opacity-50";

const getUserRating = (store) => store?.userRating ?? store?.user_rating ?? null;

function GlowShell({ children }) {
  return (
    <div
      className="relative min-h-screen overflow-hidden bg-gradient-to-br from-indigo-950 via-violet-950 to-fuchsia-950 selection:bg-amber-300 selection:text-indigo-950"
      style={{ fontFamily: "'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif" }}
    >
      <div className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[720px] -translate-x-1/2 -translate-y-1/3 rounded-full bg-violet-600/40 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-80 w-80 translate-x-1/4 translate-y-1/4 rounded-full bg-amber-400/20 blur-3xl" />
      <div className="relative">{children}</div>
    </div>
  );
}

function Notice({ message }) {
  return (
    <div role="alert" className="flex items-start gap-3 rounded-2xl border border-red-400/40 bg-red-500/10 p-4 text-sm text-red-200">
      <AlertCircle size={18} className="mt-0.5 shrink-0 text-red-300" />
      <p>{message}</p>
    </div>
  );
}

function Modal({ isOpen, onClose, title, description, children }) {
  useEffect(() => {
    if (!isOpen) return undefined;
    const onKeyDown = (event) => event.key === "Escape" && onClose();
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-indigo-950/70 p-4 backdrop-blur-md"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <div role="dialog" aria-modal="true" aria-label={title} className={`${glass} w-full max-w-md bg-indigo-950/80 p-7`}>
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-white">{title}</h2>
            {description && <p className="mt-1 text-sm text-indigo-200">{description}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-xl p-2 text-indigo-300/60 transition-colors duration-200 hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-300/30"
          >
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function StoreCard({ store, onRate }) {
  const averageRating = store.averageRating ?? store.average_rating ?? null;
  const userRating = getUserRating(store);

  return (
    <section className={`${glass} group p-6 transition-all duration-200 hover:-translate-y-1 hover:border-white/25 motion-reduce:transition-none`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-indigo-300/30 bg-indigo-300/10">
          <StoreIcon size={23} className="text-indigo-200" />
        </div>

        {averageRating !== null && (
          <span className="inline-flex items-center gap-1 rounded-full border border-amber-300/30 bg-amber-300/10 px-2.5 py-1 text-xs font-semibold text-amber-300">
            <Star size={13} className="fill-current" />
            {Number(averageRating).toFixed(1)}
          </span>
        )}
      </div>

      <div className="mt-5">
        <h2 className="text-lg font-bold tracking-tight text-white">{store.storeName}</h2>
        <div className="mt-2 flex items-start gap-2 text-sm leading-5 text-indigo-200">
          <MapPin size={16} className="mt-0.5 shrink-0 text-indigo-300/60" />
          <span>{store.storeAddress}</span>
        </div>
      </div>

      <div className="mt-5 border-t border-white/10 pt-4">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-xs font-medium text-indigo-300/70">Your rating</span>
          {userRating ? (
            <span className="inline-flex items-center gap-1 text-sm font-semibold text-amber-300">
              <Star size={13} className="fill-current" />
              {userRating}/5
            </span>
          ) : (
            <span className="text-xs text-indigo-300/60">Not rated yet</span>
          )}
        </div>

        <button type="button" onClick={onRate} className={`${userRating ? secondaryBtn : primaryBtn} w-full`}>
          <Star size={16} />
          {userRating ? "Modify rating" : "Rate store"}
        </button>
      </div>
    </section>
  );
}

export default function Stores() {
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(emptyPagination);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedStore, setSelectedStore] = useState(null);
  const [rating, setRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [ratingError, setRatingError] = useState("");

  useEffect(() => {
    loadStores();
  }, [search, page]);

  const loadStores = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getUserStores({ search, page, limit: 9 });
      setStores(data.stores || []);
      setPagination(data.pagination || emptyPagination);
    } catch (err) {
      setError(err?.response?.data?.message || "Unable to load stores.");
      setStores([]);
    } finally {
      setLoading(false);
    }
  };

  const updateSearch = (value) => {
    setSearch(value);
    setPage(1);
  };

  const openRatingModal = (store) => {
    setSelectedStore(store);
    setRating(getUserRating(store) ?? 0);
    setRatingError("");
  };

  const closeRatingModal = () => {
    if (submitting) return;
    setSelectedStore(null);
    setRating(0);
    setRatingError("");
  };

  const handleRatingSubmit = async () => {
    if (!selectedStore) return;
    if (!rating) return setRatingError("Please select a rating from 1 to 5.");

    try {
      setSubmitting(true);
      setRatingError("");

      if (getUserRating(selectedStore)) await updateRating(selectedStore.id, rating);
      else await submitRating(selectedStore.id, rating);

      setStores((prev) => prev.map((store) => (store.id === selectedStore.id ? { ...store, userRating: rating, user_rating: rating } : store)));
      setSelectedStore(null);
      setRating(0);
    } catch (err) {
      console.error("Rating error:", err);
      setRatingError(err?.response?.data?.message || "Unable to save rating.");
    } finally {
      setSubmitting(false);
    }
  };

  const isEditing = Boolean(getUserRating(selectedStore));

  return (
    <GlowShell>
      <div className="mx-auto max-w-6xl space-y-6 px-4 py-10 sm:px-6">
        <div>
          <p className="text-sm font-medium text-amber-300">Discover</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-white sm:text-4xl">Stores</h1>
          <p className="mt-2 text-sm text-indigo-200">Discover stores and share your experience with a rating.</p>
        </div>

        <div className="relative">
          <input
            id="store-search"
            type="text"
            value={search}
            onChange={(event) => updateSearch(event.target.value)}
            placeholder="Search stores by name or address..."
            aria-label="Search stores"
            className={field}
          />
          <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-indigo-300/60 transition-colors duration-200 peer-focus:text-amber-300" />
          {search && (
            <button
              type="button"
              onClick={() => updateSearch("")}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-indigo-300/60 transition-colors hover:bg-white/10 hover:text-white"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {error && <Notice message={error} />}

        {loading ? (
          <div className="flex min-h-[45vh] items-center justify-center gap-3 text-sm text-indigo-200">
            <Loader2 size={20} className="animate-spin text-amber-300" />
            Loading stores...
          </div>
        ) : stores.length === 0 ? (
          <div className="flex flex-col items-center rounded-[28px] border border-dashed border-white/15 bg-white/[0.03] px-6 py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06]">
              <StoreIcon size={26} className="text-indigo-300" />
            </div>
            <h3 className="mt-4 text-base font-semibold text-white">No stores found</h3>
            <p className="mt-1 max-w-sm text-sm text-indigo-200">
              {search ? "Try searching with a different store name or address." : "There are no stores available yet."}
            </p>
          </div>
        ) : (
          <>
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {stores.map((store) => (
                <StoreCard key={store.id} store={store} onRate={() => openRatingModal(store)} />
              ))}
            </div>

            {pagination.totalPages > 1 && (
              <div className="mt-8 flex items-center justify-between gap-4">
                <button type="button" onClick={() => setPage((prev) => prev - 1)} disabled={page === 1 || loading} className={secondaryBtn}>
                  Previous
                </button>
                <span className="text-sm font-medium text-indigo-200">Page {page} of {pagination.totalPages}</span>
                <button type="button" onClick={() => setPage((prev) => prev + 1)} disabled={page === pagination.totalPages || loading} className={secondaryBtn}>
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <Modal
        isOpen={Boolean(selectedStore)}
        onClose={closeRatingModal}
        title={isEditing ? "Modify your rating" : "Rate this store"}
        description={selectedStore ? `Share your experience with ${selectedStore.storeName}.` : ""}
      >
        {selectedStore && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4">
              <p className="text-sm font-semibold text-white">{selectedStore.storeName}</p>
              <div className="mt-2 flex items-start gap-2 text-sm text-indigo-200">
                <MapPin size={15} className="mt-0.5 shrink-0 text-indigo-300/60" />
                <span>{selectedStore.storeAddress}</span>
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
                    className="rounded-xl p-1 transition-transform duration-150 hover:scale-110 focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-300/40 motion-reduce:transition-none"
                  >
                    <Star size={34} className={value <= rating ? "fill-amber-300 text-amber-300" : "text-white/20"} />
                  </button>
                ))}
              </div>

              <p className="mt-2 text-xs text-indigo-300/60">{rating ? `${rating} out of 5` : "Select a rating"}</p>
            </div>

            <div className="flex justify-end gap-3 border-t border-white/10 pt-5">
              <button type="button" onClick={closeRatingModal} disabled={submitting} className={secondaryBtn}>
                Cancel
              </button>
              <button type="button" onClick={handleRatingSubmit} disabled={submitting} className={primaryBtn}>
                {submitting && <Loader2 size={16} className="animate-spin" />}
                {submitting ? "Submitting..." : "Submit rating"}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </GlowShell>
  );
}