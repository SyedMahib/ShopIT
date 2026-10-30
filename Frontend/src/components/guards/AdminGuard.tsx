import { Link, Navigate, Outlet } from "@tanstack/react-router";
import { useSelector } from "react-redux";
import { LayoutDashboard, Package, ShoppingBag, Users } from "lucide-react";
import type { RootState } from "../../store";

const navItems = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { to: "/admin/orders", label: "Orders", icon: ShoppingBag, exact: false },
  { to: "/admin/products", label: "Products", icon: Package, exact: false },
  { to: "/admin/users", label: "Users", icon: Users, exact: false },
] as const;

/**
 * Layout route for the admin panel. Sits inside AuthGuard, so the user is
 * already known to be logged in; non-admins are sent to their dashboard.
 */
export default function AdminGuard() {
  const user = useSelector((state: RootState) => state.auth.user);

  if (user?.role !== "admin") {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-8 lg:flex-row">
        <nav className="shrink-0 lg:w-56">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Admin Panel</p>
          <ul className="flex gap-2 overflow-x-auto lg:flex-col">
            {navItems.map(({ to, label, icon: Icon, exact }) => (
              <li key={to}>
                <Link
                  to={to}
                  activeOptions={{ exact }}
                  className="flex items-center gap-3 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
                  activeProps={{ className: "bg-slate-900 text-white hover:bg-slate-900 hover:text-white" }}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="min-w-0 flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
