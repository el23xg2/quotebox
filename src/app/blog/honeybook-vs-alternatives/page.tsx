import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "HoneyBook vs Dubsado vs QuoteBox vs Bonsai — Best Freelance Tool in 2026 | QuoteBox",
  description:
    "Compare the top freelance business tools side by side: HoneyBook ($36/mo), Dubsado ($20/mo), Bonsai ($24/mo), and QuoteBox ($9/mo). See which fits your budget and workflow.",
  keywords: [
    "honeybook vs dubsado",
    "honeybook alternative",
    "best freelance tool",
    "freelance crm comparison",
    "bonsai vs honeybook",
    "dubsado alternative",
    "cheap freelance tool",
    "honeybook too expensive",
  ],
  openGraph: {
    title: "HoneyBook vs Dubsado vs QuoteBox vs Bonsai — 2026 Comparison",
    description:
      "Side-by-side comparison of 4 top freelance tools. Prices, features, and which one is best for solo freelancers in 2026.",
    url: "https://quotebox.pro/blog/honeybook-vs-alternatives",
  },
};

const tools = [
  {
    name: "QuoteBox",
    tag: "Best for solo freelancers",
    price: "$9/month",
    freePlan: "Free plan (3 clients, 5 docs)",
    highlight: true,
    pros: [
      "Cheapest option ($9 vs $20-36)",
      "Quotes + contracts + invoices in one workflow",
      "E-signatures included on free plan",
      "Credit card payment links",
      "No team features you don't need",
    ],
    cons: [
      "No time tracking built in",
      "No accounting integration",
      "Newer tool (smaller community)",
    ],
    bestFor: "Solo photographers, designers, consultants who need quotes + contracts + invoices without paying for bloat.",
  },
  {
    name: "HoneyBook",
    tag: "Best for creative teams",
    price: "$36/month",
    freePlan: "No free plan",
    highlight: false,
    pros: [
      "All-in-one: contracts, invoices, scheduling, pipelines",
      "Strong brand and community",
      "Built specifically for creatives",
      "Mobile app available",
    ],
    cons: [
      "4x the price of QuoteBox",
      "Packed with features solo freelancers never use",
      "No free plan — $36/month minimum",
      "Can feel overwhelming for one-person businesses",
    ],
    bestFor: "Creative agencies with 2+ team members who need pipelines, automations, and team collaboration.",
  },
  {
    name: "Dubsado",
    tag: "Best for complex workflows",
    price: "$20/month",
    freePlan: "Free for first 3 clients",
    highlight: false,
    pros: [
      "Powerful automations and canned emails",
      "Scheduler built in",
      "Forms and questionnaires",
      "Good for service businesses with repeat workflows",
    ],
    cons: [
      "Steep learning curve",
      "UI feels dated",
      "$20/month is still 2x QuoteBox",
      "Can be overkill if you just send invoices",
    ],
    bestFor: "Service providers with complex, repeatable client onboarding processes (coaches, wedding planners).",
  },
  {
    name: "Bonsai",
    tag: "Best for proposals + time tracking",
    price: "$24/month",
    freePlan: "7-day free trial",
    highlight: false,
    pros: [
      "Beautiful proposal templates",
      "Built-in time tracking",
      "Accounting features (tax estimates, expense tracking)",
      "Widely used by freelancers",
    ],
    cons: [
      "More expensive than QuoteBox",
      "No free plan beyond trial",
      "Contract templates are US-focused",
      "Time tracking adds complexity for simple projects",
    ],
    bestFor: "Freelancers who bill by the hour and need time tracking + proposals + accounting in one app.",
  },
];

export default function ComparisonPage() {
  return (
    <main className="min-h-screen bg-white">
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

      <article className="mx-auto max-w-4xl px-6 py-16">
        <p className="mb-2 text-sm font-medium uppercase tracking-wide text-blue-600">
          Tool Comparison
        </p>
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          HoneyBook vs Dubsado vs Bonsai vs QuoteBox
        </h1>
        <p className="mt-4 text-lg text-gray-500 max-w-2xl">
          The four most popular freelance business tools compared. Honest breakdown of who each one is actually for — not marketing copy.
        </p>

        {/* Price at a glance */}
        <div className="mt-10 grid gap-4 sm:grid-cols-4">
          {tools.map((tool) => (
            <div
              key={tool.name}
              className={`rounded-xl border p-5 text-center ${
                tool.highlight ? "border-blue-400 bg-blue-50 ring-2 ring-blue-100" : "border-gray-200"
              }`}
            >
              <p className="text-xs font-semibold text-gray-500 uppercase">{tool.name}</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">{tool.price.split("/")[0]}<span className="text-base font-normal text-gray-400">/mo</span></p>
              <p className="mt-1 text-xs text-gray-400">{tool.freePlan}</p>
              {tool.highlight && (
                <span className="mt-2 inline-block rounded-full bg-blue-600 px-2 py-0.5 text-xs text-white">Best Value</span>
              )}
            </div>
          ))}
        </div>

        {/* Detailed comparisons */}
        <section className="mt-16 space-y-12">
          {tools.map((tool) => (
            <div
              key={tool.name}
              className={`rounded-2xl border-2 p-8 ${
                tool.highlight ? "border-blue-300 bg-gradient-to-br from-blue-50 to-white" : "border-gray-200"
              }`}
            >
              <div className="flex items-start justify-between flex-wrap gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-bold text-gray-900">{tool.name}</h2>
                    <span className="rounded-full bg-gray-100 px-3 py-0.5 text-xs font-medium text-gray-600">
                      {tool.tag}
                    </span>
                  </div>
                  <p className="mt-1 text-2xl font-bold text-gray-900">{tool.price}</p>
                  <p className="text-sm text-gray-500">{tool.freePlan}</p>
                </div>
                {tool.highlight && (
                  <Link
                    href="/login"
                    className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition"
                  >
                    Try QuoteBox Free
                  </Link>
                )}
              </div>

              <div className="mt-6 grid gap-6 sm:grid-cols-2">
                <div>
                  <h3 className="text-sm font-semibold text-green-700 mb-2">What it does well</h3>
                  <ul className="space-y-1.5">
                    {tool.pros.map((pro) => (
                      <li key={pro} className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="mt-0.5 text-green-500 font-bold">+</span>
                        {pro}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-red-600 mb-2">Drawbacks</h3>
                  <ul className="space-y-1.5">
                    {tool.cons.map((con) => (
                      <li key={con} className="flex items-start gap-2 text-sm text-gray-600">
                        <span className="mt-0.5 text-red-400 font-bold">−</span>
                        {con}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-500">
                  <strong className="text-gray-700">Best for:</strong> {tool.bestFor}
                </p>
              </div>
            </div>
          ))}
        </section>

        {/* Which should you choose? */}
        <section className="mt-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Which one should you choose?</h2>
          <div className="space-y-4">
            {[
              { q: "You're a solo freelancer who sends quotes, contracts, and invoices", a: "QuoteBox at $9/month. It does exactly those three things with no bloat. Free plan lets you try it risk-free." },
              { q: "You run a 3+ person creative agency with pipelines and automations", a: "HoneyBook at $36/month. The team features, scheduling, and pipeline tools justify the price at this scale." },
              { q: "You need complex client onboarding with forms and canned emails", a: "Dubsado at $20/month. The automation and form features are great for service businesses with repeat workflows." },
              { q: "You bill by the hour and need built-in time tracking", a: "Bonsai at $24/month. The time tracking + proposal combo works well if you're hourly-billed." },
              { q: "You're on a tight budget and just want to get started", a: "QuoteBox Free ($0). 3 clients, 5 documents — enough to test the workflow before committing." },
            ].map((item, i) => (
              <div key={i} className="rounded-xl border border-gray-200 p-5">
                <p className="font-semibold text-gray-900">{item.q}</p>
                <p className="mt-1 text-sm text-gray-600">{item.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="mt-16 rounded-2xl bg-gray-900 px-8 py-12 text-center text-white">
          <h2 className="text-2xl font-bold">
            Try QuoteBox free — no credit card
          </h2>
          <p className="mt-3 text-gray-400 max-w-lg mx-auto">
            $9/month for unlimited quotes, contracts, and invoices. No team features you don't need. No $36/month commitment.
          </p>
          <Link
            href="/login"
            className="mt-6 inline-block rounded-lg bg-white px-8 py-3 text-base font-semibold text-gray-900 hover:bg-gray-100 transition"
          >
            Start Free
          </Link>
        </div>
      </article>

      <footer className="border-t border-gray-100 px-6 py-8 text-center text-sm text-gray-400">
        <Link href="/" className="hover:text-gray-600">QuoteBox</Link>
        <span className="mx-3">·</span>
        <Link href="/privacy" className="hover:text-gray-600">Privacy</Link>
        <span className="mx-3">·</span>
        <Link href="/terms" className="hover:text-gray-600">Terms</Link>
        <span className="mx-3">·</span>
        <Link href="/honeybook-alternative" className="hover:text-gray-600">HoneyBook Alternative</Link>
      </footer>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: "HoneyBook vs Dubsado vs Bonsai vs QuoteBox — Best Freelance Tool Comparison 2026",
            description: "Side-by-side comparison of 4 top freelance business tools: HoneyBook, Dubsado, Bonsai, and QuoteBox. Prices, features, and which one is best for solo freelancers in 2026.",
            author: { "@type": "Organization", name: "QuoteBox" },
            publisher: { "@type": "Organization", name: "QuoteBox", url: "https://quotebox.pro" },
            datePublished: "2026-07-27",
          }),
        }}
      />
    </main>
  );
}
