import { createRootRoute, createRoute, createRouter, lazyRouteComponent } from "@tanstack/react-router";
import RootLayout from "../Layouts/RootLayouts";
import AboutPage from "../Pages/AboutPage";
import ContactPage from "../Pages/ContactPage";
import HomePage from "../Pages/HomePage";
import ShopPage from "../Pages/ShopPage";
import ProductDetailsPage from "../Pages/ProductDetailsPage";
import AuthLayout from "../Layouts/AuthLayouts";
import LoginPage from "../Pages/Auth/LoginPage";
import RegisterPage from "../Pages/Auth/RegisterPage";
import ForgotPasswordPage from "../Pages/Auth/ForgotPasswordPage";
import ResetPasswordPage from "../Pages/Auth/ResetPasswordPage";
import DashboardPage from "../Pages/DashboardPage";
import ProfilePage from "../Pages/ProfilePage";
import SettingsPage from "../Pages/SettingsPage";
import WishlistPage from "../Pages/WishlistPage";
import AuthGuard from "../components/guards/AuthGuard";
import CartPage from "../Pages/CartPage";
import ShippingPage from "../Pages/ShippingPage";
import ConfirmOrderPage from "../Pages/ConfirmOrderPage";
import OrderDetailsPage from "../Pages/OrderDetailsPage";
import MyOrdersPage from "../Pages/MyOrdersPage";
import AdminGuard from "../components/guards/AdminGuard";

// Admin pages are loaded on demand so regular shoppers never download them
const AdminDashboardPage = lazyRouteComponent(() => import("../Pages/admin/AdminDashboardPage"));
const AdminOrdersPage = lazyRouteComponent(() => import("../Pages/admin/AdminOrdersPage"));
const AdminProductsPage = lazyRouteComponent(() => import("../Pages/admin/AdminProductsPage"));
const ProductFormPage = lazyRouteComponent(() => import("../Pages/admin/ProductFormPage"));
const AdminUsersPage = lazyRouteComponent(() => import("../Pages/admin/AdminUsersPage"));

const rootRoute = createRootRoute({
  component: RootLayout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

const shopRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/shop",
  validateSearch: (search: Record<string, unknown>): { keyword?: string; category?: string } => {
    const keyword = typeof search.keyword === "string" ? search.keyword : undefined;
    const category = typeof search.category === "string" ? search.category : undefined;
    return { ...(keyword ? { keyword } : {}), ...(category ? { category } : {}) };
  },
  component: ShopPage,
});

const productDetailsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/products/$productId",
  component: ProductDetailsPage,
});

const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/about",
  component: AboutPage,
});

const contactRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/contact",
  component: ContactPage,
});

const cartRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/cart",
  component: CartPage,
});

// Auth routes
const authRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "auth",
  component: AuthLayout,
});

const loginRoute = createRoute({
  getParentRoute: () => authRoute,
  path: "/login",
  component: LoginPage,
});

const registerRoute = createRoute({
  getParentRoute: () => authRoute,
  path: "/register",
  component: RegisterPage,
});

// Protected routes (require login)
const protectedRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "protected",
  component: AuthGuard,
});

const forgotPasswordRoute = createRoute({
  getParentRoute: () => authRoute,
  path: "/password/forgot",
  component: ForgotPasswordPage,
});

const resetPasswordRoute = createRoute({
  getParentRoute: () => authRoute,
  path: "/password/reset/$token",
  component: ResetPasswordPage,
});

const dashboardRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/dashboard",
  component: DashboardPage,
});

const profileRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/dashboard/profile",
  component: ProfilePage,
});

const settingsRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/dashboard/settings",
  component: SettingsPage,
});

const wishlistRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/dashboard/wishlist",
  component: WishlistPage,
});

const shippingRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/shipping",
  component: ShippingPage,
});

const confirmOrderRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/checkout/confirm",
  component: ConfirmOrderPage,
});

const myOrdersRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/dashboard/orders",
  component: MyOrdersPage,
});

const orderDetailsRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/dashboard/orders/$orderId",
  // success: COD order just placed. payment: back from the Stripe checkout page.
  validateSearch: (search: Record<string, unknown>): { success?: boolean; payment?: "success" | "cancelled" } => ({
    ...((search.success === true || search.success === "true") && { success: true }),
    ...((search.payment === "success" || search.payment === "cancelled") && { payment: search.payment }),
  }),
  component: OrderDetailsPage,
});

// Admin routes (require admin role)
const adminRoute = createRoute({
  getParentRoute: () => protectedRoute,
  id: "admin",
  component: AdminGuard,
});

const adminDashboardRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: "/admin",
  component: AdminDashboardPage,
});

const adminOrdersRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: "/admin/orders",
  component: AdminOrdersPage,
});

const adminProductsRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: "/admin/products",
  component: AdminProductsPage,
});

const adminNewProductRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: "/admin/products/new",
  component: ProductFormPage,
});

const adminEditProductRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: "/admin/products/$productId/edit",
  component: ProductFormPage,
});

const adminUsersRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: "/admin/users",
  component: AdminUsersPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  shopRoute,
  productDetailsRoute,
  aboutRoute,
  contactRoute,
  cartRoute,
  authRoute.addChildren([loginRoute, registerRoute, forgotPasswordRoute, resetPasswordRoute]),
  protectedRoute.addChildren([
    dashboardRoute,
    profileRoute,
    settingsRoute,
    wishlistRoute,
    shippingRoute,
    confirmOrderRoute,
    myOrdersRoute,
    orderDetailsRoute,
    adminRoute.addChildren([
      adminDashboardRoute,
      adminOrdersRoute,
      adminProductsRoute,
      adminNewProductRoute,
      adminEditProductRoute,
      adminUsersRoute,
    ]),
  ]),
]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
