import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "HoneyBook Alternative — $9/month vs $36/month | QuoteBox",
  description:
    "Looking for a cheaper HoneyBook alternative? QuoteBox does quotes, contracts with e-signatures, and invoices for $9/month. 75% cheaper, same core features. Free plan available.",
  keywords: [
    "honeybook alternative",
    "honeybook competitor",
    "cheaper honeybook",
    "honeybook vs quotebox",
    "freelance invoice alternative",
    "honeybook replacement",
  ],
  openGraph: {
    title: "HoneyBook Alternative — $9/month QuoteBox",
    description:
      "HoneyBook costs $36/month. QuoteBox does the same 3 core features for $9. Quotes, contracts, invoices. Free plan. No bloat.",
    url: "https://quotebox.pro/honeybook-alternative",
  },
};

export default function HoneyBookAlternativePage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="border-b border-gray-100">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold text-gray-900">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-black text-sm font-bold text-white">Q</span>
            QuoteBox
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900">
              Sign in
            </Link>
            <Link
              href="/login"
              className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="mx-auto max-w-4xl px-6 py-20 text-center">
        <p className="mb-4 text-sm font-medium uppercase tracking-wide text-blue-600">
          THE HONEYBOOK ALTERNATIVE FOR SOLO FREELANCERS
        </p>
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          HoneyBook Costs $36/month.<br />
          <span className="text-blue-600">QuoteBox Is $9/month.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-gray-600">
          Same three core features — quotes, contracts with e-signatures, invoices with online payments.
          No Kanban boards. No team seats. No features you never click. Just what you need to get paid.
        </p>
        <div className="mt-10 flex items-center justify-center gap-4">
          <Link
            href="/login"
            className="rounded-lg bg-blue-600 px-8 py-3 text-base font-semibold text-white shadow-sm hover:bg-blue-700 transition"
          >
            Try Free — No Credit Card
          </Link>
          <Link
            href="#compare"
            className="rounded-lg border border-gray-300 px-8 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 transition"
          >
            See Comparison ↓
          </Link>
        </div>
      </section>

      {/* Price banner */}
      <section className="mx-auto max-w-3xl rounded-2xl bg-gradient-to-br from-blue-50 to-white p-10 text-center border border-blue-100 mb-16 px-6">
        <p className="text-2xl font-bold text-gray-900">
          You save <span className="text-blue-600">$324/year</span> by switching from HoneyBook to QuoteBox
        </p>
        <p className="mt-2 text-gray-600">
          That&apos;s a new lens, a weekend trip, or a year of your favorite software subscriptions — back in your pocket.
        </p>
      </section>

      {/* Comparison table */}
      <section id="compare" className="mx-auto max-w-4xl px-6 pb-16">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">
          QuoteBox vs HoneyBook — Feature by Feature
        </h2>

        <div className="overflow-hidden rounded-xl border border-gray-200">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-6 py-4 text-sm font-semibold text-gray-900">Feature</th>
                <th className="px-6 py-4 text-sm font-semibold text-blue-600">QuoteBox Pro — $9/mo</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-500">HoneyBook — $36/mo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {[
                ["Unlimited quotes", "✓ Included", "✓ Included"],
                ["Unlimited contracts", "✓ Included", "✓ Included"],
                ["E-signatures (legally binding)", "✓ Included", "✓ Included"],
                ["Unlimited invoices", "✓ Included", "✓ Included"],
                ["Online payment processing", "✓ Included", "✓ Included"],
                ["Client management", "✓ Included", "✓ Included"],
                ["Free plan available", "✓ 3 clients, 5 docs", "✗ No free plan"],
                ["Team collaboration", "✗ (solo focused)", "✓ Included"],
                ["Kanban / pipelines", "✗ (not needed)", "✓ Included"],
                ["Workflow automations", "✗ (not needed)", "✓ Included"],
                ["Annual price", "$90/year ($7.50/mo)", "$432/year"],
                ["Monthly price", "$9/month", "$36/month"],
              ].map((row, i) => (
                <tr key={i} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-3 text-sm text-gray-700 font-medium">{row[0]}</td>
                  <td className="px-6 py-3 text-sm text-gray-900">{row[1]}</td>
                  <td className="px-6 py-3 text-sm text-gray-500">{row[2]}</td>
                </tr>
              ))}
              <tr className="bg-blue-50">
                <td className="px-6 py-4 text-sm font-bold text-gray-900">Your savings</td>
                <td className="px-6 py-4 text-lg font-bold text-blue-600">$9/month</td>
                <td className="px-6 py-4 text-sm text-gray-500">Save $27/mo → $324/yr</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Why the price difference */}
      <section className="mx-auto max-w-4xl px-6 pb-16">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">
          Why Is HoneyBook 4x More Expensive?
        </h2>
        <div className="grid gap-8 md:grid-cols-2">
          <div className="rounded-xl border border-gray-200 p-8">
            <h3 className="text-lg font-bold text-gray-900 mb-2">HoneyBook is built for teams</h3>
            <p className="text-gray-600 leading-relaxed">
              It includes multi-user seats, team permissions, Kanban boards, pipeline tracking, automations, and scheduling. If you run a 5-person creative agency, those features matter.
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 p-8">
            <h3 className="text-lg font-bold text-gray-900 mb-2">QuoteBox is built for you</h3>
            <p className="text-gray-600 leading-relaxed">
              If you&apos;re a solo photographer, designer, or consultant, you don&apos;t need a Kanban board. You need to send a quote, sign a contract, and get paid — fast. QuoteBox does exactly that.
            </p>
          </div>
        </div>
        <p className="text-center text-gray-500 mt-8 text-sm">
          HoneyBook is a great product. It&apos;s just priced for a different customer. QuoteBox is the stripped-down version for solo freelancers.
        </p>
      </section>

      {/* Who is this for */}
      <section className="mx-auto max-w-4xl px-6 pb-16">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">
          Who Should Switch to QuoteBox?
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { emoji: "📸", title: "Photographers", desc: "Send quotes for shoots, get contracts signed before the session, invoice after delivery." },
            { emoji: "🎨", title: "Designers", desc: "Quote a project, sign a scope-of-work contract, invoice milestones as you deliver." },
            { emoji: "💼", title: "Consultants", desc: "Retainer agreements, session invoices, monthly billing — all in one workflow." },
            { emoji: "🎥", title: "Videographers", desc: "Equipment deposit contracts, shoot day invoices, post-production payments." },
            { emoji: "✍️", title: "Writers & Editors", desc: "Per-project quotes, copyright contracts, final delivery invoices." },
            { emoji: "🏠", title: "Home Service Pros", desc: "Estimate → contract → invoice. Cleaners, handymen, organizers — all welcome." },
          ].map((item, i) => (
            <div key={i} className="rounded-xl border border-gray-200 p-6 hover:border-blue-200 hover:shadow-sm transition">
              <div className="text-2xl mb-2">{item.emoji}</div>
              <h3 className="font-bold text-gray-900">{item.title}</h3>
              <p className="mt-1 text-sm text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-4xl px-6 pb-16">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4 max-w-3xl mx-auto">
          {[
            {
              q: "Can I migrate my data from HoneyBook?",
              a: "QuoteBox doesn't offer an automatic importer yet, but you can export your clients from HoneyBook as a CSV and re-add them in under 10 minutes. Your quotes, contracts, and invoices are a fresh start.",
            },
            {
              q: "Are QuoteBox e-signatures legally binding?",
              a: "Yes. They comply with the ESIGN Act (US) and eIDAS (EU). Both typed and drawn signatures are supported.",
            },
            {
              q: "Do you offer a free trial of the paid plan?",
              a: "No trial needed — there's a free plan with 3 clients and 5 documents. Use it as long as you want. Upgrade to Pro ($9/month) when you need unlimited everything.",
            },
            {
              q: "Can I cancel anytime?",
              a: "Absolutely. No contracts, no lock-in. Pro plans keep access until the end of the billing period.",
            },
            {
              q: "Is there an annual plan?",
              a: "Yes — $90/year ($7.50/month). Available at checkout when you upgrade.",
            },
            {
              q: "What payment methods do my clients see?",
              a: "Clients can pay invoices by credit card (Visa, Mastercard, Amex) through Creem's secure checkout.",
            },
          ].map((faq, i) => (
            <details key={i} className="group rounded-xl border border-gray-200 p-6">
              <summary className="cursor-pointer font-medium text-gray-900 list-none">
                {faq.q}
              </summary>
              <p className="mt-3 text-gray-600 leading-relaxed">{faq.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-4xl px-6 pb-20 text-center">
        <div className="rounded-2xl bg-gray-900 px-8 py-14 text-white">
          <h2 className="text-3xl font-bold">
            Stop paying $36/month for features you never use.
          </h2>
          <p className="mt-4 text-lg text-gray-400">
            Try QuoteBox free. No credit card. 3 clients, 5 documents. Upgrade to unlimited for $9/month when you're ready.
          </p>
          <Link
            href="/login"
            className="mt-8 inline-block rounded-lg bg-white px-8 py-3 text-base font-semibold text-gray-900 hover:bg-gray-100 transition"
          >
            Start Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 px-6 py-8 text-center text-sm text-gray-400">
        <Link href="/" className="hover:text-gray-600">QuoteBox</Link>
        <span className="mx-3">·</span>
        <Link href="/privacy" className="hover:text-gray-600">Privacy</Link>
        <span className="mx-3">·</span>
        <Link href="/terms" className="hover:text-gray-600">Terms</Link>
        <span className="mx-3">·</span>
        <Link href="/honeybook-alternative" className="hover:text-gray-600">HoneyBook Alternative</Link>
      </footer>
    </main>
  );
}
