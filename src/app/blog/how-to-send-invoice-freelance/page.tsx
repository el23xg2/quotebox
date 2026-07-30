import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "How to Send an Invoice as a Freelancer in 2026 — Step-by-Step Guide | QuoteBox",
  description:
    "Learn how to send professional invoices as a freelance photographer, designer, or consultant. Includes free invoice template, payment tips, and tools that make it easy.",
  keywords: [
    "how to send invoice freelance",
    "freelance invoice template",
    "send invoice freelance photographer",
    "freelance invoice tool",
    "invoice for freelancers",
    "how to invoice as a freelancer",
  ],
  openGraph: {
    title: "How to Send an Invoice as a Freelancer — Complete Guide",
    description:
      "Step-by-step guide for freelancers: what to include in an invoice, how to send it, and tools that make getting paid fast and easy.",
    url: "https://quotebox.pro/blog/how-to-send-invoice-freelance",
  },
};

export default function InvoiceGuidePage() {
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

      <article className="mx-auto max-w-3xl px-6 py-16">
        <p className="mb-2 text-sm font-medium uppercase tracking-wide text-blue-600">
          Guides for Freelancers
        </p>
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          How to Send an Invoice as a Freelancer
        </h1>
        <p className="mt-4 text-lg text-gray-500">
          Step-by-step guide for photographers, designers, consultants, and solo pros. Updated for 2026.
        </p>

        <div className="mt-10 space-y-8 text-gray-700 leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">What should a freelance invoice include?</h2>
            <p className="mb-3">A professional invoice needs these 7 elements:</p>
            <ol className="list-decimal pl-6 space-y-2">
              <li><strong>Your name and business info</strong> — legal name, address, email, phone</li>
              <li><strong>Client's name and info</strong> — who is paying you</li>
              <li><strong>Invoice number</strong> — a unique ID like INV-2026-001</li>
              <li><strong>Issue date and due date</strong> — Net 15 or Net 30 is standard</li>
              <li><strong>Line items</strong> — description, quantity, unit price, total</li>
              <li><strong>Tax and discounts</strong> — if applicable</li>
              <li><strong>Payment instructions</strong> — how and where to pay</li>
            </ol>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Step 1: Choose your invoice format</h2>
            <p className="mb-3">
              You have three options:
            </p>
            <div className="grid gap-4 sm:grid-cols-3 my-6">
              {[
                { title: "PDF from a tool", pros: "Professional, trackable, includes pay link", cons: "Free tools have limits", best: true },
                { title: "Google Docs / Word", pros: "Free, familiar", cons: "Manual tracking, no pay links", best: false },
                { title: "Handwritten or email text", pros: "Quick for one-offs", cons: "Unprofessional, hard to track", best: false },
              ].map((opt) => (
                <div key={opt.title} className={`rounded-xl border p-5 ${opt.best ? "border-blue-300 bg-blue-50" : "border-gray-200"}`}>
                  <h3 className="font-semibold text-gray-900 text-sm">{opt.title}</h3>
                  <p className="mt-1 text-xs text-green-700">✓ {opt.pros}</p>
                  <p className="mt-1 text-xs text-red-600">✗ {opt.cons}</p>
                  {opt.best && <span className="mt-2 inline-block rounded-full bg-blue-600 px-2 py-0.5 text-xs text-white">Recommended</span>}
                </div>
              ))}
            </div>
            <p>For most freelancers, using a tool that generates PDF invoices with online payment links saves hours of admin time per month.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Step 2: Set clear payment terms</h2>
            <p className="mb-3">
              Don't leave payment timing ambiguous. Standard terms:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Net 15</strong> — payment due within 15 days (common for small projects)</li>
              <li><strong>Net 30</strong> — payment due within 30 days (standard for larger projects)</li>
              <li><strong>Due on receipt</strong> — payment expected immediately (for small quick-turn work)</li>
              <li><strong>50% upfront / 50% on delivery</strong> — recommended for projects over $1,000</li>
            </ul>
            <p className="mt-3 p-4 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-sm">
              <strong>Pro tip:</strong> Clients pay 40% faster when you include a "Pay Now" link directly on the invoice — no bank transfer instructions, no "let me find my checkbook."
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Step 3: Send it the right way</h2>
            <p className="mb-3">Email is the standard. Here's a template:</p>
            <blockquote className="border-l-4 border-gray-200 pl-4 py-2 my-4 text-gray-600 italic text-sm bg-gray-50 rounded-r-lg">
              <p>Hi [Client Name],</p>
              <p className="mt-2">Thanks for a great shoot on [date]! Attached is the invoice for [project name]. You can view and pay online here:</p>
              <p className="mt-2">[Invoice Link]</p>
              <p className="mt-2">Amount: $[total]<br />Due: [date]</p>
              <p className="mt-2">Let me know if you have any questions!</p>
              <p className="mt-2">Best,<br />[Your Name]</p>
            </blockquote>
            <p>Keep it short. The invoice itself has all the details — the email just needs to get them to open it.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Step 4: Follow up on unpaid invoices</h2>
            <p className="mb-3">If a client hasn't paid by the due date:</p>
            <ol className="list-decimal pl-6 space-y-2">
              <li><strong>Day 1 after due:</strong> Friendly reminder — "Just checking if you saw the invoice!"</li>
              <li><strong>Day 7 after due:</strong> Second reminder — mention the due date has passed</li>
              <li><strong>Day 14 after due:</strong> Final notice — mention that late fees may apply (if in your contract)</li>
            </ol>
            <p className="mt-3">This is why using a tool with automatic payment tracking matters — you know exactly who has and hasn't paid without digging through emails.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">What's the best tool for sending freelance invoices?</h2>
            <p className="mb-3">
              The best tool depends on what you do. Here's a quick comparison:
            </p>
            <div className="overflow-x-auto mt-4 rounded-xl border border-gray-200">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="px-4 py-3 font-semibold text-gray-900">Tool</th>
                    <th className="px-4 py-3 font-semibold text-gray-900">Price</th>
                    <th className="px-4 py-3 font-semibold text-gray-900">Best for</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {[
                    ["QuoteBox", "$9/month (free plan available)", "Solo freelancers who need quotes + contracts + invoices in one workflow"],
                    ["HoneyBook", "$36/month", "Creative agencies and teams"],
                    ["QuickBooks", "$15-30/month", "Freelancers who also need accounting"],
                    ["Wave", "Free (payment processing fees apply)", "Freelancers who only need invoicing with no quotes or contracts"],
                    ["FreshBooks", "$19/month", "Freelancers who want time tracking + invoicing"],
                  ].map((row, i) => (
                    <tr key={i} className={i === 0 ? "bg-blue-50" : "hover:bg-gray-50"}>
                      <td className="px-4 py-3 font-medium text-gray-900">{row[0]}</td>
                      <td className="px-4 py-3 text-gray-600">{row[1]}</td>
                      <td className="px-4 py-3 text-gray-600">{row[2]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-sm text-gray-500">
              If you only need invoices, Wave is free. If you also send quotes and contracts, a tool like QuoteBox keeps everything in one place — no jumping between apps.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick checklist before you send</h2>
            <ul className="space-y-2">
              {[
                "Invoice number is unique and sequential",
                "Your business name and contact info is correct",
                "Client name is spelled correctly (double-check!)",
                "Line items are clear — no jargon your client won't understand",
                "Tax is calculated correctly for your region",
                "Payment due date is clearly visible",
                "Payment method is easy — include a link if possible",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-green-100 text-xs text-green-700 font-bold">{i + 1}</span>
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* CTA */}
        <div className="mt-16 rounded-2xl bg-gray-900 px-8 py-12 text-center text-white">
          <h2 className="text-2xl font-bold">
            Send your first invoice in 2 minutes
          </h2>
          <p className="mt-3 text-gray-400">
            QuoteBox lets you create and send professional invoices with online payment links. Free plan — no credit card required.
          </p>
          <Link
            href="/login"
            className="mt-6 inline-block rounded-lg bg-white px-8 py-3 text-base font-semibold text-gray-900 hover:bg-gray-100 transition"
          >
            Start Free — Send Your First Invoice
          </Link>
        </div>
      </article>

      <footer className="border-t border-gray-100 px-6 py-8 text-center text-sm text-gray-400">
        <Link href="/" className="hover:text-gray-600">QuoteBox</Link>
        <span className="mx-3">·</span>
        <Link href="/privacy" className="hover:text-gray-600">Privacy</Link>
        <span className="mx-3">·</span>
        <Link href="/terms" className="hover:text-gray-600">Terms</Link>
      </footer>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: "How to Send an Invoice as a Freelancer in 2026",
            description: "Step-by-step guide for freelancers: what to include in an invoice, how to send it, and tools that make getting paid fast and easy.",
            author: { "@type": "Organization", name: "QuoteBox" },
            publisher: { "@type": "Organization", name: "QuoteBox", url: "https://quotebox.pro" },
            datePublished: "2026-07-27",
          }),
        }}
      />
    </main>
  );
}
