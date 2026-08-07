import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, Search, ShoppingCart, User, X } from "lucide-react";
import logoSrc from "../../assets/shopit_logo.png";

const navItems = [
  { label: "Home", to: "/" },
  { label: "Shop", to: "/shop" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-50 w-full border-b transition-colors duration-300 ${scrolled ? "border-slate-200 bg-white/95 text-slate-900 shadow-sm backdrop-blur" : "border-slate-200 bg-white/95 text-slate-900 shadow-sm backdrop-blur"}`}>
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <img src={logoSrc} alt="ShopIT logo" className="h-10 w-auto" />
          <span className="text-lg font-bold tracking-tight">ShopIT</span>
        </Link>

        <nav className="hidden flex-1 items-center justify-center gap-7 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              className={`text-sm font-medium transition-colors ${scrolled ? "text-slate-600 hover:text-slate-900" : "text-slate-600 hover:text-slate-900"}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3 lg:ml-0">
          <label className="relative hidden items-center sm:flex">
            <Search className={`pointer-events-none absolute left-3 h-4 w-4 ${scrolled ? "text-slate-400" : "text-slate-400"}`} />
            <input
              type="search"
              placeholder="Search products..."
              aria-label="Search products"
              className={`h-9 w-44 rounded-md border pl-9 pr-3 text-sm outline-none transition-colors md:w-64 ${scrolled ? "border-slate-200 bg-white text-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-slate-300" : "border-slate-200 bg-white text-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-slate-300"}`}
            />
          </label>

          <button
            type="button"
            aria-label="Cart"
            className={`relative rounded-md p-2 transition-colors ${scrolled ? "text-slate-700 hover:bg-slate-100" : "text-slate-700 hover:bg-slate-100"}`}
          >
            <ShoppingCart className="h-5 w-5" />
          </button>
          <button
            type="button"
            aria-label="Account"
            className={`rounded-md p-2 transition-colors ${scrolled ? "text-slate-700 hover:bg-slate-100" : "text-slate-700 hover:bg-slate-100"}`}
          >
            <User className="h-5 w-5" />
          </button>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
            className={`rounded-md p-2 transition-colors ${scrolled ? "text-slate-700 hover:bg-slate-100" : "text-slate-700 hover:bg-slate-100"} lg:hidden`}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className={`border-t lg:hidden ${scrolled ? "border-slate-200 bg-white" : "border-white/20 bg-slate-900/95"}`}>
          <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                onClick={() => setOpen(false)}
                className={`block py-2 text-sm font-medium transition-colors ${scrolled ? "text-slate-600 hover:text-slate-900" : "text-slate-200 hover:text-white"}`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}

export default Header;