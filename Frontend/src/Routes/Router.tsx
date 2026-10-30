import { createRootRoute, createRoute, createRouter } from "@tanstack/react-router";
import RootLayout from "../Layouts/RootLayouts";
import AboutPage from "../Pages/AboutPage";
import ContactPage from "../Pages/ContactPage";
import HomePage from "../Pages/HomePage";
import ShopPage from "../Pages/ShopPage";
import ProductDetailsPage from "../Pages/ProductDetailsPage";
import AuthLayout from "../Layouts/AuthLayouts";
import LoginPage from "../Pages/Auth/LoginPage";
import RegisterPage from "../Pages/Auth/RegisterPage";
import DashboardPage from "../Pages/DashboardPage";
import ProfilePage from "../Pages/ProfilePage";
import SettingsPage from "../Pages/SettingsPage";
import WishlistPage from "../Pages/WishlistPage";
import AuthGuard from "../components/guards/AuthGuard";

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

const routeTree = rootRoute.addChildren([
  indexRoute,
  shopRoute,
  productDetailsRoute,
  aboutRoute,
  contactRoute,
  authRoute.addChildren([loginRoute, registerRoute]),
  protectedRoute.addChildren([dashboardRoute, profileRoute, settingsRoute, wishlistRoute]),
]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
