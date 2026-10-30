import { Link } from "@tanstack/react-router";
import { Headphones, PackageCheck, RotateCcw, ShieldCheck, Star, Truck } from "lucide-react";

const values = [
  {
    icon: PackageCheck,
    title: "A curated selection",
    text: "Laptops, cameras, headphones, accessories and more, chosen for quality and value instead of endless lists.",
  },
  {
    icon: ShieldCheck,
    title: "Secure shopping",
    text: "Your account and orders are protected, and you can pay in cash when your order arrives.",
  },
  {
    icon: Truck,
    title: "Reliable delivery",
    text: "Follow every order from processing to delivery, with an email update at each step. Orders over $100 ship free.",
  },
  {
    icon: RotateCcw,
    title: "Easy changes",
    text: "Changed your mind? Cancel any order yourself until it ships, straight from your account.",
  },
  {
    icon: Star,
    title: "Honest reviews",
    text: "Only customers who received a product can review it, so the ratings you see come from real buyers.",
  },
  {
    icon: Headphones,
    title: "Helpful support",
    text: "Real people ready to help with products, orders and returns. Just send us a message.",
  },
];

function AboutPage() {
  return (
    <main>
      <section className="bg-slate-950 text-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-300">About ShopIT</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">
            The tech you need to work, create and play.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            ShopIT is an online store for IT and electronics. We keep shopping simple: a focused range of products,
            clear prices, and orders you can follow from checkout to your door.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">Why shop with us</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {values.map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-blue-50 text-blue-600">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-semibold text-slate-900">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-6 rounded-3xl bg-blue-600 p-8 text-white sm:flex-row sm:items-center sm:p-10">
          <div>
            <h2 className="text-2xl font-bold">Ready to find your next upgrade?</h2>
            <p className="mt-2 text-blue-100">Browse the full catalogue or get in touch with our team.</p>
          </div>
          <div className="flex shrink-0 gap-3">
            <Link to="/shop" className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-blue-700 hover:bg-blue-50">
              Shop now
            </Link>
            <Link to="/contact" className="rounded-xl border border-white/40 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10">
              Contact us
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export default AboutPage;
