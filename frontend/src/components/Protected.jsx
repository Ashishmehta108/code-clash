import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function Protected({ roles }) {
  const { token, user, loading } = useAuth();

  if (loading) return <div className="p-6">Loading...</div>;
  if (!token) return <Navigate to="/login" replace />;

  if (roles?.length && user?.role && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
}

