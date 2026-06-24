"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export default function SettingsPage() {
  const [email, setEmail] = useState("");
  const [plan, setPlan] = useState("free");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    const supabase = createSupabaseBrowserClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setEmail(user.email || "");
    }
    setLoading(false);
  }

  if (loading) return <p className="text-sm text-gray-500">Loading...</p>;

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

      <Card>
        <CardHeader>
          <h2 className="font-semibold text-gray-900">Subscription</h2>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">
                {plan === "free" ? "Free Plan" : "Pro Plan"}
              </p>
              <p className="text-sm text-gray-500">
                {plan === "free"
                  ? "1 client, 3 documents per month"
                  : "Unlimited clients & documents"}
              </p>
            </div>
            <Button variant="outline" size="sm">
              {plan === "free" ? "Upgrade" : "Manage"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
