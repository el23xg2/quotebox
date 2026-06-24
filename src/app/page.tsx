import { Navbar } from "@/components/landing/navbar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  FileText,
  FileSignature,
  Receipt,
  ArrowRight,
  Check,
  Zap,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-4 py-1.5 text-sm text-gray-600">
            HoneyBook alternative — $9/month
          </div>
          <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Quotes, Contracts & Invoices.
            <br />
            <span className="text-blue-600">Nothing you don&apos;t need.</span>
          </h1>
          <p className="mt-6 text-xl text-gray-600">
            The simplest way to send professional quotes, sign contracts online,
            and get paid. No bloat. No learning curve. Just the tools you
            actually use.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Link href="/login?tab=signup">
              <Button size="lg" className="gap-2">
                Start Free Trial <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="#features">
              <Button variant="outline" size="lg">
                See Features
              </Button>
            </Link>
          </div>
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
              Why pay $36/month for features you never use?
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="rounded-xl border-2 border-blue-500 bg-white p-8 shadow-lg relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-4 py-1 text-xs font-medium text-white">
                BEST VALUE
              </div>
              <h3 className="text-xl font-bold text-gray-900">QuoteBox</h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-bold text-gray-900">$9</span>
                <span className="text-gray-500">/month</span>
              </div>
              <ul className="mt-6 space-y-3">
                {[
                  "Unlimited quotes",
                  "Unlimited contracts with eSignatures",
                  "Unlimited invoices",
                  "Stripe payments",
                  "Client management",
                  "Beautiful PDF exports",
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

            <div className="rounded-xl border border-gray-200 bg-white p-8 opacity-60">
              <h3 className="text-xl font-bold text-gray-900">HoneyBook</h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-bold text-gray-900">$36</span>
                <span className="text-gray-500">/month</span>
              </div>
              <ul className="mt-6 space-y-3">
                {[
                  "Unlimited quotes",
                  "Unlimited contracts with eSignatures",
                  "Unlimited invoices",
                  "Payment processing",
                  "Client management",
                  "+ team features, Kanban, automations you don't need",
                ].map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-gray-600">
                    <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-8 opacity-60">
              <h3 className="text-xl font-bold text-gray-900">Workdeck</h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-bold text-gray-900">$12</span>
                <span className="text-gray-500">/month</span>
              </div>
              <ul className="mt-6 space-y-3">
                {[
                  "Unlimited quotes",
                  "Unlimited contracts",
                  "Unlimited invoices",
                  "Time tracking",
                  "Expense tracking",
                  "+ AI features you might not need",
                ].map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-gray-600">
                    <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">
              Three tools. One flow. Five minutes.
            </h2>
            <p className="mt-3 text-lg text-gray-600">
              From first contact to getting paid in one seamless workflow.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="rounded-xl border border-gray-200 p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">
                Quotes
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Create professional quotes in seconds. Add services, set prices,
                and send a beautiful online link. Your client can review and
                accept with one click.
              </p>
            </div>

            <div className="rounded-xl border border-gray-200 p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                <FileSignature className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">
                Contracts
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Turn accepted quotes into legally binding contracts instantly.
                Clients sign online with a typed or drawn signature. Signed PDFs
                are stored automatically.
              </p>
            </div>

            <div className="rounded-xl border border-gray-200 p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
                <Receipt className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">
                Invoices
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Generate invoices from signed contracts. Accept payments via
                Stripe. Track who has paid and who hasn&apos;t — automatically.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Flow */}
      <section className="border-t border-gray-100 bg-gray-50 px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center text-3xl font-bold text-gray-900">
            How it works
          </h2>
          <div className="mt-12 grid gap-8 md:grid-cols-4">
            {[
              { step: "1", title: "Add Client", desc: "Name, email, done." },
              { step: "2", title: "Create Quote", desc: "Add services, set price, send." },
              { step: "3", title: "Sign Contract", desc: "Client signs online instantly." },
              { step: "4", title: "Get Paid", desc: "Invoice + Stripe payment link." },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-lg font-bold text-white">
                  {item.step}
                </div>
                <h3 className="mt-4 font-semibold text-gray-900">{item.title}</h3>
                <p className="mt-1 text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            Stop overpaying for features you don&apos;t use.
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Join freelancers who switched from HoneyBook and saved 75%.
          </p>
          <div className="mt-8">
            <Link href="/login?tab=signup">
              <Button size="lg" className="gap-2">
                Get Started Free <Zap className="h-4 w-4" />
              </Button>
            </Link>
          </div>
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
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} QuoteBox. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
