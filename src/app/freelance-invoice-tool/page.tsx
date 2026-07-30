import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Freelance Invoice Tool — Send Invoices, Get Paid Online | QuoteBox",
  description:
    "A simple freelance invoice tool that does more than invoicing: quotes, contracts with e-signatures, and online payments. Free plan, then $9/month. Start in 2 minutes.",
  keywords: [
    "freelance invoice tool",
    "free invoice tool for freelancers",
    "invoice software freelance",
    "send invoice online",
    "invoice with payment link",
    "freelance billing tool",
    "best invoice tool for freelancers",
  ],
  openGraph: {
    title: "Freelance Invoice Tool — Send & Get Paid | QuoteBox",
    description:
      "Create professional invoices with online payment links. Free plan for 3 clients. Pro for $9/month with unlimited everything. Start in 2 minutes.",
    url: "https://quotebox.pro/freelance-invoice-tool",
  },
};

export default function InvoiceToolPage() {
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

      {/* Hero */}
      <section className="mx-auto max-w-4xl px-6 py-20 text-center">
        <p className="mb-4 text-sm font-medium uppercase tracking-wide text-blue-600">
          FOR FREELANCERS WHO WANT TO GET PAID
        </p>
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          The Freelance Invoice Tool<br />
          <span className="text-blue-600">That Actually Helps You Get Paid</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-gray-600">
          Most invoice tools just generate PDFs. QuoteBox generates PDFs with online payment links, tracks who paid and who hasn't, and connects your invoices to your quotes and contracts — so clients can pay with one click.
        </p>
        <div className="mt-10 flex items-center justify-center gap-4">
          <Link
            href="/login"
            className="rounded-lg bg-blue-600 px-8 py-3 text-base font-semibold text-white shadow-sm hover:bg-blue-700 transition"
          >
            Send Your First Invoice — Free
          </Link>
          <Link
            href="#features"
            className="rounded-lg border border-gray-300 px-8 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 transition"
          >
            See Features ↓
          </Link>
        </div>
        <p className="mt-3 text-sm text-gray-400">
          Free plan: 3 clients, 5 documents. No credit card needed.
        </p>
      </section>

      {/* What makes it different */}
      <section id="features" className="mx-auto max-w-4xl px-6 pb-16">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">
          What Makes This Different From Other Invoice Tools?
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          {[
            {
              title: "Online payment links built in",
              desc: "Every invoice includes a secure payment link. Your client clicks, pays by credit card, and you get notified. No \"please wire transfer to this account\" emails.",
            },
            {
              title: "Connected to quotes & contracts",
              desc: "Your invoice isn't a standalone PDF. It connects to the quote your client accepted and the contract they signed — so everything is in one place.",
            },
            {
              title: "Automatic payment tracking",
              desc: "Dashboard shows paid, unpaid, and overdue invoices at a glance. No more scrolling through your inbox wondering who hasn't paid yet.",
            },
            {
              title: "Professional PDF exports",
              desc: "Invoices look professional out of the box. Add your logo, line items, tax, and discounts. Download as PDF or send a client-friendly link.",
            },
            {
              title: "Tax and discount support",
              desc: "Add tax rates per line item. Apply percentage or fixed discounts. Your totals are always accurate.",
            },
            {
              title: "Free to start, cheap to scale",
              desc: "Free for 3 clients and 5 documents. Pro is $9/month for unlimited everything. Compare that to $20-36/month for alternatives that bundle features you don't need.",
            },
          ].map((feat, i) => (
            <div key={i} className="rounded-xl border border-gray-200 p-6 hover:border-blue-200 transition">
              <h3 className="font-bold text-gray-900">{feat.title}</h3>
              <p className="mt-2 text-sm text-gray-600 leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-gray-100 bg-gray-50 px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">
            Send an Invoice in 3 Steps
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              { step: "1", title: "Add your client", desc: "Name, email, and company. Takes 30 seconds." },
              { step: "2", title: "Create the invoice", desc: "Add line items, set tax and discounts. Preview before sending." },
              { step: "3", title: "Send & get paid", desc: "Client gets a link. They view, pay by card, and you're done." },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white text-xl font-bold">
                  {item.step}
                </div>
                <h3 className="mt-4 font-bold text-gray-900">{item.title}</h3>
                <p className="mt-2 text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="mx-auto max-w-4xl px-6 py-16">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">
          Simple Pricing
        </h2>
        <div className="grid gap-8 md:grid-cols-2 max-w-2xl mx-auto">
          <div className="rounded-xl border border-gray-200 p-8 text-center">
            <p className="text-sm font-semibold text-gray-500 uppercase">Free</p>
            <p className="mt-4 text-4xl font-bold text-gray-900">$0</p>
            <p className="text-sm text-gray-500 mt-1">Forever free</p>
            <ul className="mt-6 space-y-2 text-left text-sm text-gray-600">
              <li className="flex gap-2"><span className="text-green-500">✓</span> 3 clients</li>
              <li className="flex gap-2"><span className="text-green-500">✓</span> 5 documents total</li>
              <li className="flex gap-2"><span className="text-green-500">✓</span> E-signatures</li>
              <li className="flex gap-2"><span className="text-green-500">✓</span> Payment links</li>
              <li className="flex gap-2"><span className="text-green-500">✓</span> PDF exports</li>
            </ul>
            <Link href="/login" className="mt-6 block rounded-lg border border-gray-300 px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition">
              Start Free
            </Link>
          </div>
          <div className="rounded-xl border-2 border-blue-500 bg-white p-8 text-center relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-3 py-0.5 text-xs font-medium text-white">
              MOST POPULAR
            </div>
            <p className="text-sm font-semibold text-gray-500 uppercase">Pro</p>
            <p className="mt-4 text-4xl font-bold text-gray-900">$9<span className="text-lg text-gray-400">/month</span></p>
            <p className="text-sm text-gray-500 mt-1">or $90/year ($7.50/mo)</p>
            <ul className="mt-6 space-y-2 text-left text-sm text-gray-600">
              <li className="flex gap-2"><span className="text-green-500">✓</span> Unlimited clients</li>
              <li className="flex gap-2"><span className="text-green-500">✓</span> Unlimited documents</li>
              <li className="flex gap-2"><span className="text-green-500">✓</span> E-signatures</li>
              <li className="flex gap-2"><span className="text-green-500">✓</span> Online payments</li>
              <li className="flex gap-2"><span className="text-green-500">✓</span> PDF exports</li>
              <li className="flex gap-2"><span className="text-green-500">✓</span> Priority support</li>
            </ul>
            <Link href="/dashboard/pricing" className="mt-6 block rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition">
              Upgrade to Pro
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-gray-100 bg-gray-50 px-6 py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {[
              {
                q: "Can I really send invoices for free?",
                a: "Yes. The free plan includes 3 clients and 5 documents. You can send invoices with payment links, no credit card required. Upgrade to Pro ($9/month) when you need more.",
              },
              {
                q: "How do my clients pay?",
                a: "Clients click the payment link on the invoice and pay by credit card (Visa, Mastercard, Amex) through Creem's secure checkout. You get notified when payment is received.",
              },
              {
                q: "Does this replace my accounting software?",
                a: "No — QuoteBox is a client-facing invoicing tool, not accounting software. It handles sending invoices and collecting payments. For bookkeeping, you'd still use QuickBooks, Xero, or Wave.",
              },
              {
                q: "Can I customize the invoice template?",
                a: "Yes. Add your business name, logo, line items, tax rates, and discounts. The invoice layout is clean and professional by default.",
              },
              {
                q: "What if I also need quotes and contracts?",
                a: "QuoteBox handles all three: quotes, contracts with e-signatures, and invoices. They're connected — a signed contract automatically feeds into your invoice, saving you re-entering data.",
              },
            ].map((faq, i) => (
              <details key={i} className="group rounded-xl border border-gray-200 bg-white p-6">
                <summary className="cursor-pointer font-medium text-gray-900 list-none">
                  {faq.q}
                </summary>
                <p className="mt-3 text-gray-600 leading-relaxed">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-4xl px-6 pb-20 text-center">
        <div className="rounded-2xl bg-gray-900 px-8 py-14 text-white">
          <h2 className="text-3xl font-bold">
            Send your first invoice in 2 minutes.
          </h2>
          <p className="mt-4 text-lg text-gray-400">
            Free plan. No credit card. Professional invoices with online payment links.
          </p>
          <Link
            href="/login"
            className="mt-8 inline-block rounded-lg bg-white px-8 py-3 text-base font-semibold text-gray-900 hover:bg-gray-100 transition"
          >
            Start Free
          </Link>
        </div>
      </section>

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
            "@type": "SoftwareApplication",
            name: "QuoteBox Invoice Tool",
            applicationCategory: "BusinessApplication",
            operatingSystem: "Web",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "USD",
              description: "Free plan with 3 clients and 5 documents",
            },
            description:
              "A simple freelance invoice tool with online payment links. Send professional invoices, track payments, and get paid. Free plan available.",
            url: "https://quotebox.pro/freelance-invoice-tool",
          }),
        }}
      />
    </main>
  );
}
