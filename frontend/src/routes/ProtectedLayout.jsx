import { Outlet } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import Layout from "../components/layout/Layout";

export default function ProtectedLayout() {
  const { user, logout } = useAuth();

  return (
    <Layout
      user={user}
      onLogout={logout}
    >
      <Outlet />
    </Layout>
  );
}