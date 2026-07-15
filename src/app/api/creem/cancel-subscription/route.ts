import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

// Creem API base URL - auto-detect test mode from API key prefix
const getCreemApi = () => {
  const key = process.env.CREEM_API_KEY || "";
  return key.startsWith("creem_test_")
    ? "https://test-api.creem.io/v1"
    : "https://api.creem.io/v1";
};

export async function POST() {
  const apiKey = process.env.CREEM_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Creem not configured" }, { status: 500 });
  }

  const cookieStore = await cookies();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

  if (!supabaseUrl.startsWith("http")) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
  }

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() { return cookieStore.getAll(); },
      setAll() {},
    },
  });

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const serviceClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: sub } = await serviceClient
    .from("subscriptions")
    .select("creem_subscription_id")
    .eq("user_id", user.id)
    .single();

  const creemSubscriptionId = sub?.creem_subscription_id;

  if (!creemSubscriptionId) {
    return NextResponse.json({ error: "No active subscription found" }, { status: 400 });
  }

  try {
    // Creem API: cancel subscription at period end
    const res = await fetch(`${getCreemApi()}/subscriptions/${creemSubscriptionId}/cancel`, {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ cancel_at_period_end: true }),
    });

    if (!res.ok) {
      console.error("Creem cancel error:", await res.text());
      return NextResponse.json({ error: "Failed to cancel subscription. Please try again." }, { status: 500 });
    }

    // Don't update DB status here — Creem webhook onSubscriptionCanceled will fire
    // when the cancellation takes effect (end of billing period) and will set
    // status to "canceled" and plan_id to "free" automatically.
    // User keeps Pro access until the current period ends.

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to cancel subscription" }, { status: 500 });
  }
}
