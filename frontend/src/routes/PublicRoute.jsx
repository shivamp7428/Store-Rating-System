import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Spinner from "../components/ui/Spinner";

const dashboardByRole = {
  ADMIN: "/admin/dashboard",
  USER: "/dashboard",
  STORE_OWNER: "/owner/dashboard",
};

export default function PublicRoute() {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <Spinner size="lg" text="Loading..." />
      </div>
    );
  }

  if (!isAuthenticated) return <Outlet />;

  const lastProtectedPath = sessionStorage.getItem("lastProtectedPath");

  return <Navigate to={lastProtectedPath || dashboardByRole[user?.role] || "/login"} replace />;
}