import { Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { useSelector } from "react-redux";
import { CheckCircle2, Mail, Package, Phone } from "lucide-react";
import type { RootState } from "../store";

const inputClass =
  "mt-2 w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500";

function ContactPage() {
  const user = useSelector((state: RootState) => state.auth.user);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const body = Object.fromEntries(new FormData(e.currentTarget));

    setSending(true);
    setError("");
    try {
      const response = await fetch("/api/v1/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data?.message || "Could not send your message.");
      setSent(true);
    } catch (err) {
      setError((err as Error).message || "Could not send your message. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Contact us</h1>
        <p className="mt-4 text-slate-600">
          Questions about a product, an order or a return? Send us a message and our support team will get back to you
          by email.
        </p>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-3">
        <aside className="space-y-4">
          <a
            href="mailto:support@shopit.com"
            className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-colors hover:border-blue-200"
          >
            <Mail className="h-5 w-5 shrink-0 text-blue-600" />
            <div>
              <p className="font-semibold text-slate-900">Email</p>
              <p className="text-sm text-slate-600">support@shopit.com</p>
            </div>
          </a>
          <a
            href="tel:+15551234567"
            className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-colors hover:border-blue-200"
          >
            <Phone className="h-5 w-5 shrink-0 text-blue-600" />
            <div>
              <p className="font-semibold text-slate-900">Phone</p>
              <p className="text-sm text-slate-600">+1 (555) 123-4567</p>
            </div>
          </a>
          <div className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <Package className="h-5 w-5 shrink-0 text-blue-600" />
            <div>
              <p className="font-semibold text-slate-900">Order help</p>
              <p className="text-sm text-slate-600">
                Track, view or cancel orders from{" "}
                {user ? (
                  <Link to="/dashboard/orders" className="font-medium text-blue-600 hover:text-blue-700">
                    My Orders
                  </Link>
                ) : (
                  <Link to="/login" className="font-medium text-blue-600 hover:text-blue-700">
                    your account
                  </Link>
                )}
                . Orders can be cancelled until they ship.
              </p>
            </div>
          </div>
        </aside>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 lg:col-span-2">
          {sent ? (
            <div className="flex flex-col items-center py-10 text-center">
              <CheckCircle2 className="h-12 w-12 text-emerald-500" />
              <h2 className="mt-4 text-xl font-bold text-slate-900">Message sent</h2>
              <p className="mt-2 max-w-sm text-sm text-slate-600">
                Thanks for reaching out. We&apos;ll reply to the email address you gave us.
              </p>
              <button
                type="button"
                onClick={() => setSent(false)}
                className="mt-6 text-sm font-semibold text-blue-600 hover:text-blue-700"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-slate-700">Name</label>
                  <input id="name" name="name" required maxLength={100} defaultValue={user?.name} autoComplete="name" className={inputClass} />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700">Email</label>
                  <input id="email" name="email" type="email" required defaultValue={user?.email} autoComplete="email" className={inputClass} />
                </div>
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-slate-700">
                  Subject <span className="font-normal text-slate-400">(optional)</span>
                </label>
                <input id="subject" name="subject" maxLength={150} className={inputClass} placeholder="e.g. Question about order #92C07E" />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-slate-700">Message</label>
                <textarea id="message" name="message" required rows={6} maxLength={5000} className={inputClass} />
              </div>
              {error && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>}
              <button
                type="submit"
                disabled={sending}
                className="w-full rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-500 disabled:opacity-50 sm:w-auto sm:px-8"
              >
                {sending ? "Sending..." : "Send message"}
              </button>
            </form>
          )}
        </section>
      </div>
    </main>
  );
}

export default ContactPage;
