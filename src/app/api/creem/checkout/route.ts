import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

// Creem API base URL - auto-detect test mode from API key prefix
const getCreemApi = () => {
  const key = process.env.CREEM_API_KEY || "";
  return key.startsWith("creem_test_")
    ? "https://test-api.creem.io/v1"
    : "https://api.creem.io/v1";
};

// Map Creem product IDs to plan IDs
const PRODUCT_TO_PLAN: Record<string, string> = {
  [process.env.NEXT_PUBLIC_CREEM_PRO_MONTHLY_ID || ""]: "pro_monthly",
  [process.env.NEXT_PUBLIC_CREEM_PRO_YEARLY_ID || ""]: "pro_yearly",
  [process.env.NEXT_PUBLIC_CREEM_LIFETIME_ID || ""]: "lifetime",
};

export async function POST(request: Request) {
  try {
    const apiKey = process.env.CREEM_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Creem not configured" }, { status: 500 });
    }

    const { productId, metadata, successUrl, invoiceId, invoiceTotal } = await request.json();

    // Get the authenticated user
    const cookieStore = await cookies();
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

    let userId: string | null = null;
    if (supabaseUrl.startsWith("http")) {
      const supabase = createServerClient(supabaseUrl, supabaseKey, {
        cookies: {
          getAll() { return cookieStore.getAll(); },
          setAll() {},
        },
      });
      const { data: { user } } = await supabase.auth.getUser();
      userId = user?.id || null;
    }

    // For invoice payments - we need a product-based checkout since Creem doesn't do dynamic pricing
    if (invoiceId) {
      // Look up the invoice
      const { createClient } = await import("@supabase/supabase-js");
      const svc = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );
      const { data: invoice } = await svc
        .from("invoices")
        .select("total")
        .eq("id", invoiceId)
        .single();

      // Check for a configured invoice product ID, or use lifetime product as generic
      const invoiceProductId = process.env.CREEM_INVOICE_PRODUCT_ID;
      if (!invoiceProductId) {
        return NextResponse.json({
          error: "Invoice payment requires a Creem product. Please set CREEM_INVOICE_PRODUCT_ID in env.",
        }, { status: 500 });
      }

      const invoiceTotal = invoice?.total || 0;
      const invoiceTotalCents = Math.round(invoiceTotal * 100);

      // Creem requires minimum 100 cents ($1.00)
      const customPrice = Math.max(invoiceTotalCents, 100);
      if (customPrice > 99999999) {
        return NextResponse.json({ error: "Invoice amount exceeds maximum allowed." }, { status: 400 });
      }

      const body: Record<string, unknown> = {
        product_id: invoiceProductId,
        custom_price: customPrice,
        units: 1,
        success_url: successUrl || `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/public/invoices/${invoiceId}?success=true`,
        metadata: {
          ...(metadata || {}),
          invoice_id: invoiceId,
          invoice_total: invoiceTotal,
          referenceId: userId,
        },
      };

      const res = await fetch(`${getCreemApi()}/checkouts`, {
        method: "POST",
        headers: {
          "x-api-key": apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.text();
        return NextResponse.json({ error: `Creem API error: ${err}` }, { status: 500 });
      }

      const data = await res.json();
      return NextResponse.json({ url: data.checkout_url });
    }

    // Standard product checkout (subscriptions / lifetime)
    if (!productId) {
      return NextResponse.json({ error: "productId or invoiceId required" }, { status: 400 });
    }

    const planId = PRODUCT_TO_PLAN[productId] || "pro_monthly";
    const isLifetime = planId === "lifetime";

    const body: Record<string, unknown> = {
      product_id: productId,
      success_url: successUrl || `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard/settings?success=true`,
      metadata: {
        ...(metadata || {}),
        referenceId: userId,
        plan_id: planId,
      },
    };

    if (userId) {
      body.request_id = `${userId}-${Date.now()}`;
    }

    const res = await fetch(`${getCreemApi()}/checkouts`, {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const err = await res.text();
      return NextResponse.json({ error: `Creem API error: ${err}` }, { status: 500 });
    }

    const data = await res.json();

    // Optionally save checkout session to checkout_sessions table (if it exists)
    if (userId && data.id) {
      try {
        const { createClient } = await import("@supabase/supabase-js");
        const svc = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.SUPABASE_SERVICE_ROLE_KEY!
        );
        await svc.from("checkout_sessions").insert({
          user_id: userId,
          creem_checkout_id: data.id,
          plan_id: planId,
          status: "pending",
        }).maybeSingle();
      } catch {
        // Table may not exist, ignore
      }
    }

    return NextResponse.json({ url: data.checkout_url });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Internal error" }, { status: 500 });
  }
}
