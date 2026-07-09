import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const cookieStore = await cookies();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

  if (!supabaseUrl.startsWith("http")) {
    return NextResponse.json({ plan: "free", status: "active", limits: { clients: 3, documents: 5 } });
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

  // Use service role to bypass RLS
  const { createClient } = await import("@supabase/supabase-js");
  const serviceClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: sub } = await serviceClient
    .from("subscriptions")
    .select("*")
    .eq("user_id", user.id)
    .single();

  const planId = sub?.plan_id || "free";
  const isPro = planId !== "free" && sub?.status === "active";

  // Count current usage
  const [clientCount, quotesCount, contractsCount, invoicesCount] = await Promise.all([
    serviceClient.from("clients").select("*", { count: "exact", head: true }).eq("user_id", user.id),
    serviceClient.from("quotes").select("*", { count: "exact", head: true }).eq("user_id", user.id),
    serviceClient.from("contracts").select("*", { count: "exact", head: true }).eq("user_id", user.id),
    serviceClient.from("invoices").select("*", { count: "exact", head: true }).eq("user_id", user.id),
  ]);

  const freeLimits = { clients: 3, documents: 5 };

  return NextResponse.json({
    plan: planId,
    status: sub?.status || "active",
    isPro,
    currentPeriodEnd: sub?.current_period_end || null,
    usage: {
      clients: clientCount.count || 0,
      quotes: quotesCount.count || 0,
      contracts: contractsCount.count || 0,
      invoices: invoicesCount.count || 0,
      totalDocuments: (quotesCount.count || 0) + (contractsCount.count || 0) + (invoicesCount.count || 0),
    },
    limits: isPro ? null : freeLimits,
  });
}
