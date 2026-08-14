import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Headphones, Mail, PackageCheck, ShieldCheck, Truck } from "lucide-react";

const footerLinkClass = "text-sm text-slate-400 transition-colors hover:text-white";

export function Footer() {
  return (
    <footer className="mt-16 bg-slate-900 text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <section className="flex flex-col gap-6 rounded-2xl border border-slate-700 bg-slate-800/70 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div className="flex items-start gap-4">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-blue-500/15 text-blue-300"><Headphones className="h-5 w-5" /></span>
            <div>
              <h2 className="text-lg font-semibold">Need help choosing the right product?</h2>
              <p className="mt-1 text-sm leading-6 text-slate-400">Our team is here to help with product questions and order support.</p>
            </div>
          </div>
          <Link to="/contact" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-500">
            Contact support <ArrowUpRight className="h-4 w-4" />
          </Link>
        </section>

        <div className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
          <div className="max-w-xs">
            <Link to="/" className="inline-flex items-center text-xl font-bold tracking-tight">
              Shop<span className="text-blue-400">IT</span>
            </Link>
            <p className="mt-4 text-sm leading-6 text-slate-400">
              A simpler way to find dependable technology, accessories, and everyday essentials.
            </p>
            <a href="mailto:support@shopit.com" className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-slate-300 transition-colors hover:text-white">
              <Mail className="h-4 w-4 text-blue-300" /> support@shopit.com
            </a>
          </div>

          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-200">Explore</h2>
            <ul className="mt-5 space-y-3">
              <li><Link to="/shop" className={footerLinkClass}>Shop all products</Link></li>
              <li><Link to="/about" className={footerLinkClass}>About ShopIT</Link></li>
              <li><Link to="/contact" className={footerLinkClass}>Get in touch</Link></li>
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-200">Customer care</h2>
            <ul className="mt-5 space-y-3">
              <li><Link to="/contact" className={footerLinkClass}>Order support</Link></li>
              <li><Link to="/contact" className={footerLinkClass}>Shipping &amp; delivery</Link></li>
              <li><Link to="/contact" className={footerLinkClass}>Returns &amp; refunds</Link></li>
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-200">Shop with confidence</h2>
            <div className="mt-5 space-y-5">
              <div className="flex items-start gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-blue-500/10 text-blue-300"><ShieldCheck className="h-4 w-4" /></span>
                <div>
                  <p className="text-sm font-semibold text-slate-200">Secure checkout</p>
                  <p className="mt-1 text-sm text-slate-400">Protected payments</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-blue-500/10 text-blue-300"><Truck className="h-4 w-4" /></span>
                <div>
                  <p className="text-sm font-semibold text-slate-200">Reliable delivery</p>
                  <p className="mt-1 text-sm text-slate-400">Order updates at every step</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-blue-500/10 text-blue-300"><PackageCheck className="h-4 w-4" /></span>
                <div>
                  <p className="text-sm font-semibold text-slate-200">Easy support</p>
                  <p className="mt-1 text-sm text-slate-400">Help when you need it</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-slate-800 pt-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} ShopIT. All rights reserved.</p>
          <p>Built for a simpler shopping experience.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
