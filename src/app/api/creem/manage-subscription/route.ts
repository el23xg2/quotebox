import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

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

  // Get authenticated user
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll() {},
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const serviceClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Get the Creem customer ID from the user's subscription
    const { data: sub } = await serviceClient
      .from("subscriptions")
      .select("creem_customer_id")
      .eq("user_id", user.id)
      .single();

    const customerId = sub?.creem_customer_id;

    if (!customerId) {
      return NextResponse.json({ error: "No customer record found" }, { status: 400 });
    }

    // Creem customer portal: create a portal session
    const res = await fetch(`${getCreemApi()}/customers/${customerId}/portal`, {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        return_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard/settings`,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      return NextResponse.json({ error: `Portal error: ${err}` }, { status: 500 });
    }

    const data = await res.json();
    return NextResponse.json({ url: data.portal_url });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to create portal link" }, { status: 500 });
  }
}
