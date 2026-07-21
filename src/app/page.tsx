import { Navbar } from "@/components/landing/navbar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { Metadata } from "next";
import {
  FileText,
  FileSignature,
  Receipt,
  ArrowRight,
  Check,
  Zap,
  Users,
  Shield,
  CreditCard,
  ChevronRight,
  BarChart3,
  Clock,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Quotes, Contracts & Invoices for Freelancers — $9/month | QuoteBox",
  description:
    "The simplest HoneyBook alternative for freelancers. Send professional quotes, get contracts signed online with e-signatures, and accept payments — all for $9/month. Free plan available.",
};

const faqs = [
  {
    q: "What is QuoteBox?",
    a: "QuoteBox is a simple all-in-one tool for freelancers to send professional quotes, get contracts signed online with e-signatures, and send invoices with online payments. It's designed as a HoneyBook alternative — same core features at $9/month instead of $36.",
  },
  {
    q: "Who is QuoteBox for?",
    a: "QuoteBox is built for solo freelancers and small creative businesses — photographers, designers, consultants, videographers, and anyone who sends quotes, contracts, and invoices to clients. If you work with a handful of clients per month and don't need enterprise team features, QuoteBox is for you.",
  },
  {
    q: "How much does QuoteBox cost?",
    a: "QuoteBox has a Free plan (up to 3 clients and 5 documents, no credit card required) and a Pro plan at $9/month (unlimited clients, unlimited documents, e-signatures, and online payments). That's 75% cheaper than HoneyBook's $36/month plan.",
  },
  {
    q: "How does QuoteBox compare to HoneyBook?",
    a: "Both handle quotes, contracts with e-signatures, and invoices. The difference: HoneyBook costs $36/month and includes team features, Kanban boards, and automations that most solo freelancers never use. QuoteBox strips away the bloat and gives you just the core three tools for $9/month.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Absolutely. No contracts, no lock-in. If you're on Pro, you keep access until the end of your billing period.",
  },
  {
    q: "Are contracts legally binding?",
    a: "Yes. Electronic signatures on QuoteBox are legally binding under the ESIGN Act (US) and eIDAS (EU). Both typed names and drawn signatures are supported.",
  },
  {
    q: "Is my data secure?",
    a: "Yes. All data is encrypted in transit and at rest. We use Supabase (HIPAA-compliant infrastructure) and never share your data with third parties.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-20 px-6">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-white" />
        <div className="relative mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-700">
            🎉 Free plan available — no credit card required
          </div>
          <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Quotes, Contracts &amp; Invoices for Freelancers.
            <br />
            <span className="text-blue-600">$9/month. Nothing you don&apos;t need.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-xl text-gray-600">
            The simplest HoneyBook alternative for solo freelancers. Send
            professional quotes, sign contracts online, and get paid — all for
            $9/month. Start free, no credit card required.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Link href="/login?tab=signup">
              <Button size="lg" className="gap-2 text-base px-8 py-6">
                Get Started Free <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="#features">
              <Button variant="outline" size="lg" className="text-base px-8 py-6">
                See Features
              </Button>
            </Link>
          </div>
          <p className="mt-4 text-sm text-gray-400">
            Free plan: 3 clients &middot; 5 documents &middot; No credit card
          </p>
        </div>
      </section>


      {/* Pricing comparison */}
      <section className="border-t border-gray-100 bg-gray-50 px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">
              The features you need. Half the price.
            </h2>
            <p className="mt-3 text-lg text-gray-600">
              Why pay $36/month for features you never use? QuoteBox starts free.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {/* QuoteBox */}
            <div className="rounded-xl border-2 border-blue-500 bg-white p-8 shadow-lg relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-4 py-1 text-xs font-medium text-white">
                BEST VALUE
              </div>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex h-6 w-6 items-center justify-center rounded bg-blue-600">
                  <span className="text-xs font-bold text-white">Q</span>
                </div>
                <span className="font-bold text-gray-900">QuoteBox</span>
              </div>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-bold text-gray-900">$9</span>
                <span className="text-gray-500">/month</span>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Or start free — upgrade when you need more.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  "Unlimited quotes",
                  "Unlimited contracts with eSignatures",
                  "Unlimited invoices",
                  "Credit card payments",
                  "Client management",
                  "Beautiful PDF exports",
                  "Free plan available",
                ].map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-gray-600">
                    <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link href="/login?tab=signup" className="mt-8 block">
                <Button className="w-full">Start Free Trial</Button>
              </Link>
            </div>

            {/* HoneyBook */}
            <div className="rounded-xl border border-gray-200 bg-white p-8 opacity-60">
              <h3 className="text-xl font-bold text-gray-900">HoneyBook</h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-bold text-gray-900">$36</span>
                <span className="text-gray-500">/month</span>
              </div>
              <p className="text-sm text-gray-500 mt-1">4x the price. Same core features.</p>
              <ul className="mt-6 space-y-3">
                {[
                  "Unlimited quotes",
                  "Unlimited contracts with eSignatures",
                  "Unlimited invoices",
                  "Payment processing",
                  "Client management",
                  "+ team features, Kanban, automations",
                  "No free plan",
                ].map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-gray-600">
                    <CloseIcon />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* DIY (Excel/Google Docs) */}
            <div className="rounded-xl border border-gray-200 bg-white p-8 opacity-60">
              <h3 className="text-xl font-bold text-gray-900">Doing It Yourself</h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-bold text-gray-900">$0</span>
                <span className="text-gray-500">"free"</span>
              </div>
              <p className="text-sm text-gray-500 mt-1">But your time is worth something.</p>
              <ul className="mt-6 space-y-3">
                {[
                  "Manually create documents",
                  "Print, sign & scan contracts",
                  "Chase payments manually",
                  "No online payment links",
                  "No client portal",
                  "Spreadsheets to track everything",
                  "Hours wasted every week",
                ].map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-gray-500">
                    <MinusIcon />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Features grid */}
      <section id="features" className="px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">
              Everything a freelancer needs
            </h2>
            <p className="mt-3 text-lg text-gray-600">
              No fluff. Just the tools that actually help you get paid.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="rounded-xl border border-gray-200 p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">
                Professional Quotes
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Create beautiful quotes in seconds. Add line items, set tax and discounts,
                and send a client-facing link. Clients accept with one click.
              </p>
            </div>

            <div className="rounded-xl border border-gray-200 p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                <FileSignature className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">
                E-Signatures
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Turn accepted quotes into contracts instantly. Clients sign with a
                typed name or drawn signature — right from their phone. Legally binding.
              </p>
            </div>

            <div className="rounded-xl border border-gray-200 p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
                <Receipt className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">
                Invoices & Payments
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Generate invoices from contracts. Accept credit card payments.
                Track paid, overdue, and pending — automatically.
              </p>
            </div>

            <div className="rounded-xl border border-gray-200 p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-100">
                <Users className="h-6 w-6 text-amber-600" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">
                Client Management
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Keep all your client info in one place. See their quote, contract,
                and invoice history at a glance.
              </p>
            </div>

            <div className="rounded-xl border border-gray-200 p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-100">
                <BarChart3 className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">
                Dashboard & Analytics
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                See your total earned, outstanding invoices, and recent activity
                all from one dashboard.
              </p>
            </div>

            <div className="rounded-xl border border-gray-200 p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-teal-100">
                <Shield className="h-6 w-6 text-teal-600" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">
                Secure & Private
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Encrypted data, secure authentication, and role-based access.
                Your client data stays yours.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-gray-100 bg-gray-50 px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center text-3xl font-bold text-gray-900">
            How it works
          </h2>
          <p className="text-center mt-3 text-lg text-gray-600">
            From first contact to getting paid in under 5 minutes.
          </p>
          <div className="mt-12 grid gap-8 md:grid-cols-4">
            {[
              { step: "1", title: "Add Client", desc: "Name, email, done.", icon: Users },
              { step: "2", title: "Create Quote", desc: "Add services, set price, send.", icon: FileText },
              { step: "3", title: "Sign Contract", desc: "Client signs online instantly.", icon: FileSignature },
              { step: "4", title: "Get Paid", desc: "Invoice + secure payment link.", icon: CreditCard },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.step} className="text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-600">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="mt-4 mx-auto flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                    {item.step}
                  </div>
                  <h3 className="mt-2 font-semibold text-gray-900">{item.title}</h3>
                  <p className="mt-1 text-sm text-gray-600">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center text-3xl font-bold text-gray-900 mb-12">
            Frequently asked questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <details key={faq.q} className="group rounded-xl border border-gray-200 [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer items-center justify-between p-5 text-sm font-medium text-gray-900">
                  <span>{faq.q}</span>
                  <ChevronRight className="h-4 w-4 text-gray-500 transition-transform group-open:rotate-90" />
                </summary>
                <div className="border-t border-gray-100 px-5 py-4">
                  <p className="text-sm text-gray-600 leading-relaxed">{faq.a}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-gray-100 bg-gradient-to-br from-blue-600 to-blue-700 px-6 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-white">
            Stop overpaying for features you don&apos;t use.
          </h2>
          <p className="mt-4 text-lg text-blue-100">
            Start free. No credit card. Upgrade when you&apos;re ready.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <Link href="/login?tab=signup">
              <Button size="lg" variant="secondary" className="gap-2 text-base px-8 py-6 bg-white text-blue-700 hover:bg-blue-50">
                Get Started Free <Zap className="h-5 w-5" />
              </Button>
            </Link>
          </div>
          <p className="mt-4 text-sm text-blue-200">
            Free plan: 3 clients &middot; 5 documents &middot; No credit card needed
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 px-6 py-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-blue-600">
              <span className="text-xs font-bold text-white">Q</span>
            </div>
            <span className="text-sm text-gray-500">QuoteBox</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
              Terms of Service
            </Link>
            <Link href="/honeybook-alternative" className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
              HoneyBook Alternative
            </Link>
            <p className="text-sm text-gray-400">
              &copy; {new Date().getFullYear()} QuoteBox. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "QuoteBox",
            applicationCategory: "BusinessApplication",
            operatingSystem: "Web",
            offers: {
              "@type": "Offer",
              price: "9.00",
              priceCurrency: "USD",
              description: "Pro monthly plan",
            },
            description:
              "The simplest tool for freelancers to send professional quotes, get contracts signed online with e-signatures, and accept payments. Start free, Pro for $9/month.",
            url: "https://quotebox.pro",
          }),
        }}
      />
    </div>
  );
}

function CloseIcon() {
  return (
    <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

function MinusIcon() {
  return (
    <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" d="M5 12h14" />
    </svg>
  );
}
