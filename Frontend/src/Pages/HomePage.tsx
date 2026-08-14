import { Link } from "@tanstack/react-router";
import { ArrowRight, Camera, Check, ChevronRight, Cpu, Headphones, Laptop, PackageCheck, ShieldCheck, Sparkles, Star, Truck } from "lucide-react";
import { useEffect, useState } from "react";
import Products from "../components/Products";

const brands = ["ASUS", "MSI", "Intel", "NVIDIA", "Corsair", "Logitech"];

const categories = [
  { name: "Laptops", description: "Power for every day", icon: Laptop, tone: "bg-violet-50 text-violet-600" },
  { name: "Electronics", description: "Smart essentials", icon: Cpu, tone: "bg-blue-50 text-blue-600" },
  { name: "Headphones", description: "Sound made personal", icon: Headphones, tone: "bg-rose-50 text-rose-600" },
  { name: "Cameras", description: "Capture every detail", icon: Camera, tone: "bg-amber-50 text-amber-600" },
  { name: "Accessories", description: "Complete your setup", icon: PackageCheck, tone: "bg-emerald-50 text-emerald-600" },
  { name: "Food", description: "Everyday favourites", icon: Sparkles, tone: "bg-orange-50 text-orange-600" },
];

function CountdownTimer() {
  const [secondsRemaining, setSecondsRemaining] = useState(60 * 60 * 3 + 14 * 60 + 22);

  useEffect(() => {
    const interval = window.setInterval(() => setSecondsRemaining((current) => Math.max(0, current - 1)), 1000);
    return () => window.clearInterval(interval);
  }, []);

  const hours = String(Math.floor(secondsRemaining / 3600)).padStart(2, "0");
  const minutes = String(Math.floor((secondsRemaining % 3600) / 60)).padStart(2, "0");
  const seconds = String(secondsRemaining % 60).padStart(2, "0");

  return (
    <div className="flex items-center gap-2" aria-label={`Sale ends in ${hours} hours, ${minutes} minutes and ${seconds} seconds`}>
      {[hours, minutes, seconds].map((value, index) => (
        <span key={`${value}-${index}`} className="rounded-lg bg-white/10 px-3 py-2 font-mono text-base font-semibold text-white backdrop-blur-sm sm:text-lg">
          {value}
        </span>
      ))}
    </div>
  );
}

const HomePage = () => {
  return (
    <main className="overflow-hidden">
      <section className="relative isolate overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_30%,rgba(59,130,246,0.22),transparent_32%),radial-gradient(circle_at_82%_18%,rgba(139,92,246,0.18),transparent_28%)]" />
        <div className="absolute -right-32 top-1/3 h-80 w-80 rounded-full border border-white/10" />
        <div className="absolute -right-12 top-1/3 h-56 w-56 rounded-full border border-white/10" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-24">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-blue-300/20 bg-blue-400/10 px-3 py-1.5 text-xs font-semibold text-blue-100"><Sparkles className="h-3.5 w-3.5" /> Technology selected for real life</span>
            <h1 className="mt-6 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Find the gear that <span className="text-blue-300">fits your flow.</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-slate-300 sm:text-lg">
              Thoughtful technology and everyday essentials—easy to explore, simple to choose, and ready for what’s next.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/shop" className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-950/40 transition hover:bg-blue-500">
                Explore products <ArrowRight className="h-4 w-4" />
              </Link>
              <a href="#featured" className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
                See what’s popular
              </a>
            </div>
            <div className="mt-10 flex flex-wrap gap-x-7 gap-y-4 text-sm text-slate-300">
              <span className="inline-flex items-center gap-2"><Check className="h-4 w-4 text-blue-300" /> Curated selection</span>
              <span className="inline-flex items-center gap-2"><Check className="h-4 w-4 text-blue-300" /> Secure shopping</span>
              <span className="inline-flex items-center gap-2"><Check className="h-4 w-4 text-blue-300" /> Helpful support</span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
            <div className="absolute -inset-4 rounded-[2rem] bg-blue-500/15 blur-3xl" />
            <div className="relative overflow-hidden rounded-[2rem] border border-white/15 bg-slate-800 shadow-2xl shadow-black/30">
              <img src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=85" alt="Modern laptop on a desk" width={1200} height={800} className="aspect-[4/3] w-full object-cover opacity-90" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between gap-4 p-5 sm:p-6">
                <div><p className="text-xs font-medium uppercase tracking-[0.18em] text-blue-200">Built for every day</p><p className="mt-1 text-lg font-semibold">Work. Create. Play.</p></div>
                <Link to="/shop" className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white text-slate-900 transition hover:bg-blue-100" aria-label="Browse products"><ArrowRight className="h-4 w-4" /></Link>
              </div>
            </div>
            <div className="absolute -bottom-5 -left-3 hidden rounded-2xl border border-slate-200 bg-white p-4 text-slate-900 shadow-xl sm:block">
              <div className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-xl bg-amber-50 text-amber-500"><Star className="h-4 w-4 fill-current" /></span><div><p className="text-sm font-semibold">Highly rated picks</p><p className="text-xs text-slate-500">Chosen by customers</p></div></div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-white py-7">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Brands customers know and trust</p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 sm:gap-x-12">
            {brands.map((brand) => <span key={brand} className="text-sm font-bold tracking-wide text-slate-500 grayscale transition hover:text-slate-800 hover:grayscale-0">{brand}</span>)}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div><p className="text-sm font-semibold text-blue-600">Browse with ease</p><h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">Find your next favourite</h2><p className="mt-3 max-w-xl text-slate-600">Start with a category, then refine the details in the shop.</p></div>
            <Link to="/shop" className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 transition hover:text-blue-700">View everything <ArrowRight className="h-4 w-4" /></Link>
          </div>
          <div className="mt-9 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Link key={category.name} to="/shop" search={{ category: category.name }} className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md">
                  <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl ${category.tone}`}><Icon className="h-5 w-5" /></span>
                  <span className="min-w-0 flex-1"><span className="block font-semibold text-slate-900">{category.name}</span><span className="mt-1 block text-sm text-slate-500">{category.description}</span></span>
                  <ChevronRight className="h-5 w-5 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-blue-600" />
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section id="featured" className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-9 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-sm font-semibold text-blue-600">Customer favourites</p><h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">Popular right now</h2><p className="mt-3 text-slate-600">A few dependable choices customers keep coming back to.</p></div><Link to="/shop" className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700">Shop all products <ArrowRight className="h-4 w-4" /></Link></div>
          <Products perPage={4} />
        </div>
      </section>

      <section className="bg-slate-950 py-16 text-white sm:py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div className="max-w-xl"><span className="inline-flex rounded-full bg-rose-400/15 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-rose-200">Limited-time savings</span><h2 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">Make room for your next upgrade.</h2><p className="mt-4 leading-7 text-slate-300">Explore selected components, accessories, and essentials with special savings for a limited time.</p><div className="mt-7"><p className="mb-3 text-sm font-medium text-slate-300">Offer ends in</p><CountdownTimer /></div><Link to="/shop" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-blue-50">Shop the sale <ArrowRight className="h-4 w-4" /></Link></div>
          <div className="relative overflow-hidden rounded-3xl border border-white/10"><img src="https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=1000&q=85" alt="Modern PC setup" width={1000} height={700} loading="lazy" className="aspect-[4/3] w-full object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 to-transparent" /></div>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-5 lg:grid-cols-2">
            <Link to="/shop" search={{ category: "Laptops" }} className="group relative min-h-80 overflow-hidden rounded-3xl bg-slate-900 p-7 text-white sm:p-9"><img src="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1000&q=85" alt="Workspace technology" loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-55 transition duration-500 group-hover:scale-105" /><div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" /><div className="relative flex h-full max-w-sm flex-col justify-end"><p className="text-sm font-semibold text-blue-200">Made for momentum</p><h2 className="mt-2 text-2xl font-bold">Create your best workspace</h2><p className="mt-3 text-sm leading-6 text-slate-200">Reliable laptops and essentials for the work you want to do.</p><span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold">Explore laptops <ArrowRight className="h-4 w-4" /></span></div></Link>
            <Link to="/shop" search={{ category: "Electronics" }} className="group relative min-h-80 overflow-hidden rounded-3xl bg-slate-900 p-7 text-white sm:p-9"><img src="https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=1000&q=85" alt="Modern electronics" loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-55 transition duration-500 group-hover:scale-105" /><div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" /><div className="relative flex h-full max-w-sm flex-col justify-end"><p className="text-sm font-semibold text-blue-200">Everyday technology</p><h2 className="mt-2 text-2xl font-bold">Small upgrades, big difference</h2><p className="mt-3 text-sm leading-6 text-slate-200">Find thoughtful electronics for your home, desk, and daily routine.</p><span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold">Explore electronics <ArrowRight className="h-4 w-4" /></span></div></Link>
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-slate-50 py-10">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:grid-cols-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-white text-blue-600 shadow-sm"><ShieldCheck className="h-5 w-5" /></span><div><p className="font-semibold text-slate-900">Secure shopping</p><p className="text-sm text-slate-500">Protected at checkout</p></div></div>
          <div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-white text-blue-600 shadow-sm"><Truck className="h-5 w-5" /></span><div><p className="font-semibold text-slate-900">Reliable delivery</p><p className="text-sm text-slate-500">Updates every step</p></div></div>
          <div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-white text-blue-600 shadow-sm"><PackageCheck className="h-5 w-5" /></span><div><p className="font-semibold text-slate-900">Helpful support</p><p className="text-sm text-slate-500">Here when you need us</p></div></div>
        </div>
      </section>
    </main>
  );
};

export default HomePage;
