import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
import ChangePassword from "../pages/auth/ChangePassword";
import AdminDashboard from "../pages/admin/AdminDashboard";
import Users from "../pages/admin/Users";
import AddUser from "../pages/admin/AddUser";
import UserDetails from "../pages/admin/UserDetails";
import AdminStores from "../pages/admin/Stores";
import AddStore from "../pages/admin/AddStore";
import UserDashboard from "../pages/user/UserDashboard";
import UserStores from "../pages/user/Stores";
import MyRatings from "../pages/user/MyRatings";
import StoreOwnerDashboard from "../pages/storeOwner/StoreOwnerDashboard";
import ProtectedRoute from "./ProtectedRoute";
import ProtectedLayout from "./ProtectedLayout";
import PublicRoute from "./PublicRoute";

const homeByRole = { ADMIN: "/admin/dashboard", STORE_OWNER: "/owner/dashboard" };

function Unauthorized() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const handleAction = () => navigate(isAuthenticated ? homeByRole[user?.role] || "/stores" : "/login");

  return (
    <div
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-950 via-violet-950 to-fuchsia-950 px-4"
      style={{ fontFamily: '"Plus Jakarta Sans", ui-sans-serif, system-ui, sans-serif' }}
    >
      <div className="pointer-events-none absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-violet-600/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-24 h-80 w-80 rounded-full bg-amber-400/20 blur-3xl" />

      <div className="relative w-full max-w-md rounded-[28px] border border-white/15 bg-indigo-950/60 p-8 text-center shadow-2xl shadow-black/40 backdrop-blur-2xl sm:p-10">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-red-400/40 bg-red-500/10 text-xl font-bold text-red-200">403</div>
        <h1 className="mt-6 text-2xl font-bold tracking-tight text-white">Access denied</h1>
        <p className="mt-2 text-sm leading-6 text-indigo-200">You do not have permission to access this page.</p>

        <button
          type="button"
          onClick={handleAction}
          className="mt-8 inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-amber-300 to-orange-400 px-5 py-3.5 text-[15px] font-bold text-indigo-950 shadow-lg shadow-amber-400/20 transition-all duration-200 hover:from-amber-200 hover:to-orange-300 focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-300/40 active:scale-[0.99]"
        >
          {isAuthenticated ? "Dashboard" : "Login"}
        </button>
      </div>
    </div>
  );
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
        <Route element={<ProtectedLayout />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<Users />} />
          <Route path="/admin/users/add" element={<AddUser />} />
          <Route path="/admin/users/:id" element={<UserDetails />} />
          <Route path="/admin/stores" element={<AdminStores />} />
          <Route path="/admin/stores/add" element={<AddStore />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={["USER"]} />}>
        <Route element={<ProtectedLayout />}>
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/stores" element={<UserStores />} />
          <Route path="/my-ratings" element={<MyRatings />} />
          <Route path="/change-password" element={<ChangePassword />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={["STORE_OWNER"]} />}>
        <Route element={<ProtectedLayout />}>
          <Route path="/owner/dashboard" element={<StoreOwnerDashboard />} />
          <Route path="/owner/change-password" element={<ChangePassword />} />
        </Route>
      </Route>

      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}