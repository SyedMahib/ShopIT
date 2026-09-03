import { type FormEvent, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Menu, Search, ShoppingCart, User, LogOut, ChevronDown, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../store";
import { clearUser } from "../../store/authSlice";
import { useLogoutMutation } from "../../store/authApi";
import defaultProductImage from "../../assets/default_product.png";
import { useGetProductsQuery } from "../../store/productsApi";

const navItems = [
  { label: "Home", to: "/" },
  { label: "Shop", to: "/shop" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const searchRef = useRef<HTMLFormElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();

  const { currentData: suggestionData, isFetching: isLoadingSuggestions } = useGetProductsQuery(
    { keyword: debouncedSearchTerm, limit: 5 },
    { skip: debouncedSearchTerm.length < 2 },
  );
  const suggestions = suggestionData?.products ?? [];

  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const keyword = searchTerm.trim();
    navigate({
      to: "/shop",
      search: { keyword: keyword || undefined },
    });
    setIsSearchFocused(false);
    setOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      dispatch(clearUser());
      setUserMenuOpen(false);
      navigate({ to: "/" });
    } catch {
      // Force clear even if server request fails
      dispatch(clearUser());
      setUserMenuOpen(false);
      navigate({ to: "/" });
    }
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const timeout = window.setTimeout(() => setDebouncedSearchTerm(searchTerm.trim()), 250);
    return () => window.clearTimeout(timeout);
  }, [searchTerm]);

  useEffect(() => {
    const closeSuggestions = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener("mousedown", closeSuggestions);
    return () => document.removeEventListener("mousedown", closeSuggestions);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className={`sticky top-0 z-50 w-full border-b transition-colors duration-300 ${scrolled ? "border-slate-200 bg-white/95 text-slate-900 shadow-sm backdrop-blur" : "border-slate-200 bg-white/95 text-slate-900 shadow-sm backdrop-blur"}`}>
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-lg font-bold tracking-tight">ShopIT</span>
        </Link>

        <nav className="hidden flex-1 items-center justify-center gap-7 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3 lg:ml-0">
          <form ref={searchRef} className="relative hidden items-center sm:flex" onSubmit={submitSearch}>
            <Search className="pointer-events-none absolute left-3 h-4 w-4 text-slate-400" />
            <input
              type="search"
              value={searchTerm}
              onChange={(event) => {
                setSearchTerm(event.target.value);
                setIsSearchFocused(true);
              }}
              onFocus={() => setIsSearchFocused(true)}
              onKeyDown={(event) => { if (event.key === "Escape") setIsSearchFocused(false); }}
              placeholder="Search products..."
              aria-label="Search products"
              className="h-9 w-44 rounded-md border border-slate-200 bg-white pl-9 pr-10 text-sm text-slate-700 placeholder:text-slate-400 outline-none transition-colors focus:ring-2 focus:ring-slate-300 md:w-64"
            />
            <button type="submit" aria-label="Submit product search" className="absolute right-1 grid h-7 w-7 place-items-center rounded text-slate-500 transition-colors hover:bg-slate-100 hover:text-blue-600">
              <Search className="h-4 w-4" />
            </button>
            {isSearchFocused && debouncedSearchTerm.length >= 2 && (
              <div className="absolute right-0 top-11 z-50 w-80 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl" role="listbox">
                <div className="border-b border-slate-100 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Suggested products
                </div>
                {isLoadingSuggestions ? (
                  <p className="px-4 py-5 text-sm text-slate-500">Searching products...</p>
                ) : suggestions.length > 0 ? (
                  <>
                    <div className="max-h-80 overflow-y-auto py-1">
                      {suggestions.map((product) => (
                        <Link
                          key={product._id}
                          to="/products/$productId"
                          params={{ productId: product._id }}
                          onClick={() => setIsSearchFocused(false)}
                          className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-slate-50"
                          role="option"
                        >
                          <img
                            src={product.images?.[0]?.url || defaultProductImage}
                            alt=""
                            className="h-11 w-11 rounded-lg border border-slate-100 bg-slate-50 object-contain p-1"
                            onError={(event) => {
                              event.currentTarget.onerror = null;
                              event.currentTarget.src = defaultProductImage;
                            }}
                          />
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm font-medium text-slate-800">{product.name}</span>
                            <span className="mt-0.5 block text-xs text-slate-500">{product.category}</span>
                          </span>
                          <span className="text-sm font-semibold text-slate-900">${Number(product.price).toFixed(2)}</span>
                        </Link>
                      ))}
                    </div>
                    <Link
                      to="/shop"
                      search={{ keyword: debouncedSearchTerm }}
                      onClick={() => setIsSearchFocused(false)}
                      className="block border-t border-slate-100 px-4 py-3 text-center text-sm font-semibold text-blue-600 transition-colors hover:bg-blue-50"
                    >
                      View all results for "{debouncedSearchTerm}"
                    </Link>
                  </>
                ) : (
                  <p className="px-4 py-5 text-sm text-slate-500">No matching products found.</p>
                )}
              </div>
            )}
          </form>

          <button
            type="button"
            aria-label="Cart"
            className="relative rounded-md p-2 text-slate-700 transition-colors hover:bg-slate-100"
          >
            <ShoppingCart className="h-5 w-5" />
          </button>

          {isAuthenticated && user ? (
            <div className="relative" ref={userMenuRef}>
              <button
                type="button"
                onClick={() => setUserMenuOpen((v) => !v)}
                className="flex items-center gap-2 rounded-md p-2 text-slate-700 transition-colors hover:bg-slate-100"
                aria-label="Account menu"
                aria-expanded={userMenuOpen}
              >
                {user.avatar?.url ? (
                  <img
                    src={`/api/avatar/${user._id}`}
                    alt={user.name}
                    className="h-7 w-7 rounded-full object-cover ring-2 ring-slate-200"
                  />
                ) : (
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-600 ring-2 ring-slate-200">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="hidden text-sm font-medium text-slate-700 sm:block">{user.name}</span>
                <ChevronDown className={`h-4 w-4 text-slate-500 transition-transform ${userMenuOpen ? "rotate-180" : ""}`} />
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 top-full z-50 mt-2 w-70 rounded-md border border-slate-200 bg-white py-1 shadow-lg">
                  <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-2.5">
                    {user.avatar?.url ? (
                      <img src={`/api/avatar/${user._id}`} alt={user.name} className="h-9 w-9 rounded-full object-cover ring-2 ring-slate-200" />
                    ) : (
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-600 ring-2 ring-slate-200">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium text-slate-800">{user.name}</p>
                      <p className="text-xs text-slate-500">{user.email}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
                  >
                    <LogOut className="h-4 w-4" />
                    {isLoggingOut ? "Signing out..." : "Sign out"}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="rounded-md p-2 text-slate-700 transition-colors hover:bg-slate-100"
              aria-label="Login"
            >
              <User className="h-5 w-5" />
            </Link>
          )}

          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
            className="rounded-md p-2 text-slate-700 transition-colors hover:bg-slate-100 lg:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t bg-white lg:hidden">
          <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6">
            <form className="relative mb-3 sm:hidden" onSubmit={submitSearch}>
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search products..."
                aria-label="Search products"
                className="h-10 w-full rounded-md border border-slate-200 bg-white pl-9 pr-10 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-slate-300"
              />
              <button type="submit" aria-label="Submit product search" className="absolute right-1 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded text-slate-500 hover:bg-slate-100 hover:text-blue-600">
                <Search className="h-4 w-4" />
              </button>
            </form>
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                onClick={() => setOpen(false)}
                className="block py-2 text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
              >
                {item.label}
              </Link>
            ))}
            {!isAuthenticated && (
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="block py-2 text-sm font-medium text-blue-600 transition-colors hover:text-blue-500"
              >
                Sign in
              </Link>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}

export default Header;
