import { useEffect, useState } from "react";
import { AlertCircle, ArrowDownAZ, ArrowUpAZ, ChevronDown, ChevronLeft, ChevronRight, Eye, Loader2, Mail, MapPin, Plus, Search, UserRound, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getUsers } from "../../services/adminService";

const roleOptions = [
  { value: "USER", label: "Normal User" },
  { value: "STORE_OWNER", label: "Store Owner" },
  { value: "ADMIN", label: "Administrator" },
];

const sortOptions = [
  { value: "name", label: "Name" },
  { value: "email", label: "Email" },
  { value: "role", label: "Role" },
  { value: "address", label: "Address" },
];

const roles = {
  ADMIN: { label: "Administrator", variant: "primary" },
  STORE_OWNER: { label: "Store Owner", variant: "warning" },
  USER: { label: "Normal User", variant: "default" },
};

const controlBase = "peer w-full rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3.5 text-[15px] text-white placeholder:text-indigo-300/50 transition-all duration-200 hover:border-white/20 hover:bg-white/10 focus:border-amber-300/70 focus:bg-white/10 focus:outline-none focus:ring-4 focus:ring-amber-300/10";
const labelClass = "mb-1.5 block text-sm font-medium text-indigo-100";
const primaryBtn = "inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-300 to-orange-400 px-5 py-3.5 text-[15px] font-bold text-indigo-950 shadow-lg shadow-amber-400/20 transition-all duration-200 hover:from-amber-200 hover:to-orange-300 focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-300/40 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60";
const secondaryBtn = "inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/[0.06] px-4 py-3.5 text-sm font-medium text-white transition-all duration-200 hover:bg-white/10 focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-300/40 disabled:cursor-not-allowed disabled:opacity-40";

const badgeStyles = {
  primary: "border-indigo-300/30 bg-indigo-300/10 text-indigo-200",
  warning: "border-amber-300/30 bg-amber-300/10 text-amber-300",
  default: "border-white/15 bg-white/[0.06] text-indigo-100",
};

const getInitials = (name = "") => name.split(" ").map((word) => word[0]).join("").slice(0, 2).toUpperCase();

function Panel({ title, description, className = "", children }) {
  return (
    <section className={`rounded-[28px] border border-white/15 bg-indigo-950/60 shadow-2xl shadow-black/40 backdrop-blur-2xl ${className}`}>
      {title && (
        <div className="px-6 pb-4 pt-6 sm:px-8 sm:pt-8">
          <h2 className="text-lg font-bold tracking-tight text-white">{title}</h2>
          {description && <p className="mt-1 text-sm text-indigo-200">{description}</p>}
        </div>
      )}
      {children}
    </section>
  );
}

function SearchField({ value, onChange, onClear, placeholder }) {
  return (
    <div>
      <label htmlFor="user-search" className={labelClass}>Search</label>
      <div className="relative">
        <input id="user-search" type="text" value={value} onChange={onChange} placeholder={placeholder} className={`${controlBase} pl-11 ${value ? "pr-11" : ""}`} />
        <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-indigo-300/60 transition-colors duration-200 peer-focus:text-amber-300" />
        {value && (
          <button
            type="button"
            onClick={onClear}
            aria-label="Clear search"
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-indigo-300/60 transition-all duration-200 hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-300/40"
          >
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  );
}

function SelectField({ id, label, value, onChange, options, placeholder }) {
  return (
    <div>
      <label htmlFor={id} className={labelClass}>{label}</label>
      <div className="relative">
        <select id={id} value={value} onChange={onChange} className={`${controlBase} appearance-none pr-11 ${value ? "" : "text-indigo-300/50"}`}>
          <option value="" className="bg-indigo-950 text-white">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value} className="bg-indigo-950 text-white">{option.label}</option>
          ))}
        </select>
        <ChevronDown size={18} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-indigo-300/60" />
      </div>
    </div>
  );
}

function RoleBadge({ variant, children }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${badgeStyles[variant] || badgeStyles.default}`}>
      {children}
    </span>
  );
}

function Pager({ page, totalPages, onPageChange }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <p className="text-sm text-indigo-200">
        Page <span className="font-semibold text-white">{page}</span> of <span className="font-semibold text-white">{totalPages}</span>
      </p>

      <div className="flex gap-2">
        <button type="button" onClick={() => onPageChange(page - 1)} disabled={page <= 1} className={secondaryBtn}>
          <ChevronLeft size={16} />
          Previous
        </button>
        <button type="button" onClick={() => onPageChange(page + 1)} disabled={page >= totalPages} className={secondaryBtn}>
          Next
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

function TableHeader({ children, align = "left" }) {
  return <th className={`px-5 py-3.5 text-xs font-semibold text-indigo-300/70 ${align === "right" ? "text-right" : "text-left"}`}>{children}</th>;
}

function UserRow({ user, onView }) {
  const { label, variant } = roles[user.role] || roles.USER;

  return (
    <tr className="transition-all duration-200 hover:bg-white/[0.05]">
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-amber-300 to-orange-400 text-xs font-bold text-indigo-950">
            {getInitials(user.name) || "U"}
          </div>
          <div>
            <p className="text-sm font-semibold text-white">{user.name}</p>
            <p className="mt-0.5 text-xs text-indigo-300/60">ID #{user.id}</p>
          </div>
        </div>
      </td>

      <td className="px-5 py-4">
        <div className="flex items-center gap-2 text-sm text-indigo-100">
          <Mail size={14} className="text-indigo-300/60" />
          {user.email}
        </div>
      </td>

      <td className="max-w-xs px-5 py-4">
        <div className="flex items-start gap-2 text-sm text-indigo-100">
          <MapPin size={14} className="mt-0.5 shrink-0 text-indigo-300/60" />
          <span className="truncate">{user.address}</span>
        </div>
      </td>

      <td className="px-5 py-4">
        <RoleBadge variant={variant}>{label}</RoleBadge>
      </td>

      <td className="px-5 py-4 text-right">
        <button
          type="button"
          onClick={onView}
          className="inline-flex items-center gap-2 rounded-2xl px-3 py-2 text-sm font-medium text-amber-300 transition-all duration-200 hover:bg-white/10 hover:text-amber-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-300/40"
        >
          <Eye size={16} />
          View
        </button>
      </td>
    </tr>
  );
}

export default function Users() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const limit = 10;

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await getUsers({ page, limit, search, role, sortBy, sortOrder });
        setUsers(data.users || []);
        setTotalPages(Number(data.totalPages || 1));
      } catch (err) {
        setError(err?.response?.data?.message || "Unable to load users.");
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, [page, search, role, sortBy, sortOrder]);

  const onFilterChange = (setter) => (event) => {
    setter(event.target.value);
    setPage(1);
  };

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    setPage(1);
  };

  const clearSearch = () => {
    setSearch("");
    setPage(1);
  };

  const clearFilters = () => {
    setSearch("");
    setRole("");
    setSortBy("name");
    setSortOrder("asc");
    setPage(1);
  };

  const addUser = () => navigate("/admin/users/add");
  const hasFilters = search || role || sortBy !== "name" || sortOrder !== "asc";
  const SortIcon = sortOrder === "asc" ? ArrowUpAZ : ArrowDownAZ;

  return (
    <div
      className="relative min-h-screen overflow-hidden bg-gradient-to-br from-indigo-950 via-violet-950 to-fuchsia-950 px-4 py-8 sm:px-6"
      style={{ fontFamily: '"Plus Jakarta Sans", ui-sans-serif, system-ui, sans-serif' }}
    >
      <div className="pointer-events-none absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-violet-600/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-24 h-80 w-80 rounded-full bg-amber-400/20 blur-3xl" />

      <div className="relative space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-amber-300">Administration</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl">Users</h1>
            <p className="mt-2 text-sm text-indigo-200">Manage registered users and their account roles.</p>
          </div>

          <button type="button" onClick={addUser} className={primaryBtn}>
            <Plus size={18} />
            Add user
          </button>
        </div>

        <Panel className="p-6">
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_200px_200px_auto] lg:items-end">
            <SearchField value={search} onChange={onFilterChange(setSearch)} onClear={clearSearch} placeholder="Search by name, email or address..." />
            <SelectField id="user-role" label="Role" value={role} onChange={onFilterChange(setRole)} options={roleOptions} placeholder="All roles" />
            <SelectField id="user-sort" label="Sort by" value={sortBy} onChange={onFilterChange(setSortBy)} options={sortOptions} placeholder="Sort by" />

            <button type="button" onClick={toggleSortOrder} className={secondaryBtn}>
              <SortIcon size={16} />
              {sortOrder === "asc" ? "Ascending" : "Descending"}
            </button>
          </div>

          {hasFilters && (
            <div className="mt-4 border-t border-white/10 pt-4">
              <button
                type="button"
                onClick={clearFilters}
                className="rounded-lg text-sm font-medium text-amber-300 transition-all duration-200 hover:text-amber-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-300/40"
              >
                Clear all filters
              </button>
            </div>
          )}
        </Panel>

        {error && (
          <div role="alert" className="flex items-start gap-3 rounded-2xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            <AlertCircle size={18} className="mt-0.5 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <Panel title="All users" description="View and manage users registered on the platform.">
          {loading ? (
            <div role="status" className="flex min-h-72 items-center justify-center gap-3 text-sm text-indigo-200">
              <Loader2 size={20} className="animate-spin text-amber-300" />
              Loading users...
            </div>
          ) : users.length === 0 ? (
            <div className="p-5 sm:p-8 sm:pt-4">
              <div className="flex flex-col items-center rounded-2xl border border-dashed border-white/15 bg-white/[0.03] px-6 py-14 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-indigo-300/30 bg-indigo-300/10">
                  <UserRound size={26} className="text-indigo-300" />
                </div>
                <h3 className="mt-4 text-base font-bold text-white">No users found</h3>
                <p className="mt-1 max-w-sm text-sm text-indigo-200">
                  {search || role ? "Try changing your search or filter criteria." : "No users are available yet."}
                </p>
                <button type="button" onClick={addUser} className={`${primaryBtn} mt-5`}>
                  <Plus size={18} />
                  Add user
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[850px]">
                  <thead>
                    <tr className="border-y border-white/10 bg-white/[0.04]">
                      <TableHeader>User</TableHeader>
                      <TableHeader>Contact</TableHeader>
                      <TableHeader>Address</TableHeader>
                      <TableHeader>Role</TableHeader>
                      <TableHeader align="right">Action</TableHeader>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {users.map((user) => (
                      <UserRow key={user.id} user={user} onView={() => navigate(`/admin/users/${user.id}`)} />
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="border-t border-white/10 p-4 sm:px-8">
                <Pager page={page} totalPages={totalPages} onPageChange={setPage} />
              </div>
            </>
          )}
        </Panel>
      </div>
    </div>
  );
}