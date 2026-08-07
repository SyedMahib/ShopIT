import { ArrowRight, Mail, ShoppingCart } from "lucide-react";
import Products from "../components/Products";

const brands = ["ASUS", "MSI", "Intel", "NVIDIA", "Corsair", "Logitech"];

const categories = [
  { name: "Laptops", icon: ShoppingCart },
  { name: "Components", icon: ShoppingCart },
  { name: "Peripherals", icon: ShoppingCart },
  { name: "Accessories", icon: ShoppingCart },
  { name: "Gaming", icon: ShoppingCart },
  { name: "Deals", icon: ShoppingCart },
];

function CountdownTimer() {
  return <div className="rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-sm">Ends in 03:14:22</div>;
}

const HomePage = () => {
  return (
    <div>
      <section className="relative overflow-hidden bg-slate-900 text-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
          <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
            <div className="max-w-xl">
              <h1 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
                Unleash Ultimate Performance.
              </h1>
              <p className="mt-4 text-base text-slate-300 sm:text-lg">
                Discover cutting-edge laptops, components, and peripherals built for gamers, creators, and professionals.
              </p>
              <div className="mt-6 flex flex-wrap gap-3 sm:mt-8">
                <a
                  href="#"
                  className="inline-flex items-center justify-center rounded-md bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition-all hover:bg-blue-500"
                >
                  Shop Now
                </a>
                <a
                  href="#"
                  className="inline-flex items-center justify-center rounded-md border border-white/30 bg-transparent px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-white/10"
                >
                  View Deals
                </a>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=80"
                alt="High-performance laptop showcasing speed and power"
                width={1200}
                height={800}
                className="w-full rounded-xl object-cover shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-white py-6 sm:py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="mb-4 text-center text-xs font-medium uppercase tracking-widest text-slate-500 sm:mb-6">
            Trusted by Industry Leaders
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
            {brands.map((brand) => (
              <span key={brand} className="text-sm font-bold tracking-wide text-slate-500 sm:text-base">
                {brand}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Shop by Category</h2>
            <p className="mt-2 text-sm text-slate-500 sm:text-base">Everything you need to build your perfect setup.</p>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6 lg:gap-6">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <a key={category.name} href="#" className="flex flex-col items-center rounded-xl border border-slate-200 bg-slate-50 p-4 text-center transition-all hover:border-blue-400 hover:shadow-md sm:p-6">
                  <div className="grid h-10 w-10 place-items-center rounded-full bg-white shadow-sm sm:h-12 sm:w-12">
                    <Icon className="h-5 w-5 text-slate-700 sm:h-6 sm:w-6" />
                  </div>
                  <span className="mt-3 text-xs font-medium text-slate-700 sm:text-sm">{category.name}</span>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-end justify-between sm:mb-10">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Best Sellers</h2>
              <p className="mt-1 text-sm text-slate-500">Our most popular products this week.</p>
            </div>
            <a href="#" className="hidden items-center gap-1 text-sm font-medium text-blue-600 sm:inline-flex">
              View all <ArrowRight className="h-4 w-4" />
            </a>
          </div>
          <Products perPage={4} title="Best Sellers" />
        </div>
      </section>

      <section className="bg-slate-900 py-12 text-white sm:py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
            <div>
              <span className="inline-block rounded bg-rose-500 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
                Limited Time
              </span>
              <h2 className="mt-4 text-2xl font-bold leading-tight tracking-tight sm:text-3xl lg:text-4xl">
                Flash Sale: Up to 40% Off Components
              </h2>
              <p className="mt-3 text-sm text-slate-300 sm:text-base">
                Upgrade your rig with premium GPUs, CPUs, RAM, and storage at unbeatable prices.
              </p>
              <div className="mt-6 sm:mt-8">
                <CountdownTimer />
              </div>
              <a href="#" className="mt-6 inline-flex items-center justify-center rounded-md bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition-all hover:bg-blue-500 sm:mt-8">
                Shop the Sale
              </a>
            </div>
            <div className="overflow-hidden rounded-xl">
              <img
                src="https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=900&q=80"
                alt="RGB gaming PC build featured in the flash sale"
                width={900}
                height={600}
                loading="lazy"
                className="w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">New Arrivals</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:gap-6">
            <div className="group relative overflow-hidden rounded-2xl">
              <img src="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80" alt="Studio Pro creative workstation setup" className="h-80 w-full object-cover" />
              <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 p-5 sm:p-7">
                <span className="rounded bg-blue-600 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-white">New</span>
                <h3 className="mt-2 text-xl font-bold text-white sm:text-2xl">Studio Pro Workstations</h3>
                <p className="mt-1 max-w-xs text-sm text-white/80">Built for creators, editors, and 3D artists.</p>
                <a href="#" className="mt-4 inline-flex items-center gap-1 rounded-md bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition-colors hover:bg-white/90">
                  Explore Now <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </div>
            <div className="group relative overflow-hidden rounded-2xl">
              <img src="https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=900&q=80" alt="Mesh WiFi and connectivity devices" className="h-80 w-full object-cover" />
              <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 p-5 sm:p-7">
                <span className="rounded bg-blue-600 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-white">New</span>
                <h3 className="mt-2 text-xl font-bold text-white sm:text-2xl">Mesh Core Connectivity</h3>
                <p className="mt-1 max-w-xs text-sm text-white/80">Whole-home WiFi coverage without dead zones.</p>
                <a href="#" className="mt-4 inline-flex items-center gap-1 rounded-md bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition-colors hover:bg-white/90">
                  Explore Now <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-slate-50 py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-2xl px-4 text-center sm:px-6 lg:px-8">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-blue-100">
            <Mail className="h-6 w-6 text-blue-600" />
          </div>
          <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Join the Inner Circle</h2>
          <p className="mt-2 text-sm text-slate-500 sm:text-base">Get exclusive deals, product drops, and tech tips delivered straight to your inbox.</p>
          <form className="mt-6 flex flex-col gap-3 sm:flex-row sm:gap-2">
            <input type="email" placeholder="Enter your email address" className="h-11 flex-1 rounded-md border border-slate-300 bg-white px-4 text-sm outline-none transition-all focus:ring-2 focus:ring-blue-500" />
            <button type="submit" className="h-11 rounded-md bg-slate-900 px-6 text-sm font-semibold text-white transition-colors hover:bg-slate-700">
              Subscribe
            </button>
          </form>
          <p className="mt-3 text-xs text-slate-500">No spam, unsubscribe at any time.</p>
        </div>
      </section>
    </div>
  );
};

export default HomePage;