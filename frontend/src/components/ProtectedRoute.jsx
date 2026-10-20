import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ admin = false }) {
  const { user, token } = useAuth();
  const location = useLocation();

  // Not logged in
  if (!token || !user) {
    return (
      <Navigate
        to="/login"
        state={{ from: location }}
        replace
      />
    );
  }

  // Check admin using either role OR is_admin
  const isAdmin =
    user?.role === "admin" ||
    user?.is_admin === true ||
    user?.is_admin === 1 ||
    user?.is_admin === "1";

  // Admin page requires admin
  if (admin && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  // Normal user pages should not be accessible by admin
  if (!admin && isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  return <Outlet />;
}