import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  const Stripe = require("stripe");
  return new Stripe(key);
}

// Map price IDs to plan IDs (update these with your real Stripe price IDs)
const PRICE_TO_PLAN: Record<string, string> = {
  price_1Tr7b3E3wdC54bTS6nwrElpd: "pro_monthly",
  price_1Tr7cQE3wdC54bTSuFC9Oncj: "pro_yearly",
  price_1Tr7eHE3wdC54bTSKgX90Hpr: "lifetime",
};

const LIFETIME_PRICES = new Set(["price_1Tr7eHE3wdC54bTSKgX90Hpr"]);

export async function POST(request: Request) {
  const { priceId } = await request.json();

  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 500 });
  }

  // Authenticate the user via session cookie
  const cookieStore = await cookies();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

  if (!supabaseUrl.startsWith("http")) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
  }

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll() {},
    },
  });

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const isLifetime = LIFETIME_PRICES.has(priceId);
  const planId = PRICE_TO_PLAN[priceId] || "pro_monthly";

  const sessionParams: any = {
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: isLifetime ? "payment" : "subscription",
    success_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard/settings?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard/pricing?canceled=true`,
    metadata: {
      user_id: user.id,
      plan_id: planId,
    },
  };

  const session = await stripe.checkout.sessions.create(sessionParams);

  return NextResponse.json({ url: session.url });
}
