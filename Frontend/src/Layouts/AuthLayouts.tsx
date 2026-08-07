import { Outlet } from "@tanstack/react-router";

function AuthLayout() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Outlet />
    </main>
  );
}

export default AuthLayout;
