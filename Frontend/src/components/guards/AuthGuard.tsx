import { Navigate, Outlet } from "@tanstack/react-router";
import { useSelector } from "react-redux";
import type { RootState } from "../../store";

/**
 * Layout route for pages that require login.
 * Waits for RootLayout's /me check to finish, then either renders the
 * nested route or redirects to /login.
 */
export default function AuthGuard() {
  const { isAuthenticated, loading } = useSelector((state: RootState) => state.auth);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
}
