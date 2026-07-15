"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { FREE_LIMITS } from "@/lib/subscription";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const [email, setEmail] = useState("");
  const [plan, setPlan] = useState("free");
  const [status, setStatus] = useState("active");
  const [isPro, setIsPro] = useState(false);
  const [currentPeriodEnd, setCurrentPeriodEnd] = useState<string | null>(null);
  const [usage, setUsage] = useState<{ clients: number; quotes: number; contracts: number; invoices: number; totalDocuments: number } | null>(null);
  const [limits, setLimits] = useState<{ clients: number; documents: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const router = useRouter();

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    const supabase = createSupabaseBrowserClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setEmail(user.email || "");
    }

    // Fetch subscription info
    try {
      const res = await fetch("/api/subscription");
      const data = await res.json();
      if (data.plan) {
        setPlan(data.plan);
        setStatus(data.status);
        setIsPro(data.isPro);
        setCurrentPeriodEnd(data.currentPeriodEnd);
        setUsage(data.usage);
        setLimits(data.limits);
      }
    } catch (err) {
      console.error("Failed to load subscription:", err);
    }

    setLoading(false);
  }

  async function handleCancel() {
    if (!confirm("Are you sure you want to cancel your subscription? You'll lose Pro access at the end of the billing period.")) return;
    setCancelling(true);
    try {
      const res = await fetch("/api/creem/cancel-subscription", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        alert("Subscription cancelled. You'll retain Pro access until the end of the billing period.");
        loadProfile();
      } else {
        alert(data.error || "Failed to cancel subscription.");
      }
    } catch {
      alert("Failed to cancel subscription.");
    }
    setCancelling(false);
  }

  if (loading) return <p className="text-sm text-gray-500">Loading...</p>;

  const planNames: Record<string, string> = {
    free: "Free Plan",
    pro_monthly: "Pro Monthly",
    pro_yearly: "Pro Yearly",
    lifetime: "Lifetime",
  };

  return (
    <div className="max-w-lg">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your account and subscription.
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <h2 className="font-semibold text-gray-900">Profile</h2>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Input
              id="email"
              label="Email"
              value={email}
              disabled
            />
            <p className="text-xs text-gray-500">
              Email is managed through your authentication provider.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <h2 className="font-semibold text-gray-900">Subscription</h2>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="font-medium text-gray-900">
                {planNames[plan] || plan}
              </p>
              <p className="text-sm text-gray-500">
                {isPro ? "Unlimited clients & documents" : `Limited to ${FREE_LIMITS.clients} clients, ${FREE_LIMITS.documents} documents`}
              </p>
              {status === "past_due" && (
                <p className="text-sm text-red-500 mt-1">Payment past due — please update your payment method.</p>
              )}
              {currentPeriodEnd && isPro && (
                <p className="text-xs text-gray-400 mt-1">
                  {status === "canceled" ? "Access until: " : "Renews: "}
                  {new Date(currentPeriodEnd).toLocaleDateString()}
                </p>
              )}
            </div>
            {plan === "free" ? (
              <Button variant="outline" size="sm" onClick={() => router.push("/dashboard/pricing")}>
                Upgrade
              </Button>
            ) : (status === "active" || status === "past_due" || status === "paused") ? (
              <Button variant="outline" size="sm" onClick={handleCancel} disabled={cancelling}>
                {cancelling ? "Cancelling..." : "Cancel"}
              </Button>
            ) : null}
          </div>

          {usage && limits && !isPro && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Usage</h3>
              <div className="space-y-2">
                <UsageBar label="Clients" current={usage.clients} max={limits.clients} />
                <UsageBar label="Documents" current={usage.totalDocuments} max={limits.documents} />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function UsageBar({ label, current, max }: { label: string; current: number; max: number }) {
  const pct = Math.min((current / max) * 100, 100);
  return (
    <div>
      <div className="flex justify-between text-xs text-gray-500 mb-1">
        <span>{label}</span>
        <span>{current} / {max}</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all ${pct >= 90 ? "bg-red-500" : pct >= 70 ? "bg-yellow-500" : "bg-blue-500"}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
