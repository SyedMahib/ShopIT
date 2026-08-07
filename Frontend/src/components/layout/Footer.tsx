import { Link } from "@tanstack/react-router";
import { Globe } from "lucide-react";

const columns = [
  { title: "Company", links: ["About Us", "Contact"] },
  { title: "Support", links: ["FAQ", "Shipping Info"] },
  { title: "Legal", links: ["Privacy Policy"] },
];

export function Footer() {
  return (
    <footer className="w-full bg-footer text-footer-foreground">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="max-w-xs">
            <Link to="/" className="text-lg font-bold tracking-tight">
              Shop<span className="font-extrabold">IT</span>
            </Link>
            <p className="mt-4 text-sm leading-6 text-footer-muted">
              Your premier destination for high-performance tech, enterprise
              solutions, and cutting-edge hardware.
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h2 className="text-sm font-bold">{col.title}</h2>
              <ul className="mt-4 space-y-2">
                {col.links.map((link) => (
                  <li key={link}>
                    <Link
                      to="/"
                      className="text-sm text-footer-muted transition-colors hover:text-footer-foreground"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-footer-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-footer-muted">
            &copy; {new Date().getFullYear()} ShopIT. All rights reserved.
          </p>
          <button
            type="button"
            aria-label="Change language or region"
            className="text-footer-muted transition-colors hover:text-footer-foreground sm:ml-auto"
          >
            <Globe className="h-5 w-5" />
          </button>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
