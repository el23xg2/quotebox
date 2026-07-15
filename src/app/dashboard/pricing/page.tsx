"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check } from "lucide-react";
import { useRouter } from "next/navigation";

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null);
  const router = useRouter();

  // Creem product IDs from environment variables
  const PRODUCTS: Record<string, { id: string; planId: string }> = {
    pro_monthly: { id: process.env.NEXT_PUBLIC_CREEM_PRO_MONTHLY_ID || "", planId: "pro_monthly" },
    pro_yearly: { id: process.env.NEXT_PUBLIC_CREEM_PRO_YEARLY_ID || "", planId: "pro_yearly" },
    lifetime: { id: process.env.NEXT_PUBLIC_CREEM_LIFETIME_ID || "", planId: "lifetime" },
  };

  async function handleSubscribe(planKey: string, planName: string) {
    setLoading(planName);
    try {
      const product = PRODUCTS[planKey];
      if (!product || !product.id) {
        alert("Product not configured. Please contact support.");
        setLoading(null);
        return;
      }

      const res = await fetch("/api/creem/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          successUrl: `${window.location.origin}/dashboard/settings?success=true`,
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "Failed to start checkout.");
      }
    } catch (err) {
      alert("Failed to start subscription. Please try again.");
    }
    setLoading(null);
  }

  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Try QuoteBox with basic features.",
      features: [
        "3 clients",
        "5 documents total",
        "Basic templates",
        "Email support",
      ],
      cta: "Current Plan",
      disabled: true,
    },
    {
      name: "Pro Monthly",
      price: "$9",
      period: "/month",
      planKey: "pro_monthly",
      description: "Everything you need to run your freelance business.",
      features: [
        "Unlimited clients",
        "Unlimited quotes, contracts & invoices",
        "E-signatures (typed & drawn)",
        "Creem payment integration",
        "Client management",
        "PDF exports",
        "Priority support",
      ],
      popular: true,
    },
    {
      name: "Pro Yearly",
      price: "$99",
      period: "/year",
      planKey: "pro_yearly",
      description: "Save $9/year with annual billing.",
      features: [
        "Everything in Pro Monthly",
        "2 months free",
        "Annual billing discount",
      ],
    },
    {
      name: "Lifetime",
      price: "$249",
      period: "one-time",
      planKey: "lifetime",
      description: "Pay once, use forever.",
      features: [
        "Everything in Pro",
        "No recurring payments",
        "Future updates included",
      ],
    },
  ];

  return (
    <div>
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Pricing</h1>
        <p className="mt-1 text-sm text-gray-500">
          Choose the plan that fits your freelance business.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {plans.map((plan) => (
          <Card
            key={plan.name}
            className={`relative ${plan.popular ? "border-2 border-blue-500 shadow-lg" : ""}`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-3 py-0.5 text-xs font-medium text-white">
                POPULAR
              </div>
            )}
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
                <span className="text-sm text-gray-500">{plan.period}</span>
              </div>
              <p className="mt-2 text-sm text-gray-500">{plan.description}</p>

              <ul className="mt-6 space-y-2.5">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-gray-600">
                    <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                    {feature}
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                {plan.disabled ? (
                  <Button className="w-full" variant="secondary" disabled>
                    Current Plan
                  </Button>
                ) : (
                  <Button
                    className="w-full"
                    variant={plan.popular ? "primary" : "outline"}
                    onClick={() => handleSubscribe(plan.planKey!, plan.name)}
                    disabled={loading === plan.name}
                  >
                    {loading === plan.name
                      ? "Redirecting..."
                      : plan.name === "Lifetime"
                      ? "Buy Now"
                      : "Subscribe"}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
