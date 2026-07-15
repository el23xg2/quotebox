import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type"); // 'client' | 'document'

  const cookieStore = await cookies();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

  if (!supabaseUrl.startsWith("http")) {
    return NextResponse.json({ allowed: true });
  }

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() { return cookieStore.getAll(); },
      setAll() {},
    },
  });

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ allowed: false, reason: "Not authenticated" }, { status: 401 });
  }

  const serviceClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: sub } = await serviceClient
    .from("subscriptions")
    .select("plan_id, status")
    .eq("user_id", user.id)
    .single();

  const isPro = sub?.plan_id !== "free" && sub?.status === "active";

  if (isPro) {
    return NextResponse.json({ allowed: true, isPro: true });
  }

  if (type === "client") {
    const { count } = await serviceClient
      .from("clients")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id);

    if (count && count >= 3) {
      return NextResponse.json({
        allowed: false,
        isPro: false,
        reason: "Free plan is limited to 3 clients. Upgrade to Pro for unlimited clients.",
      });
    }
  }

  if (type === "document") {
    const [quotes, contracts, invoices] = await Promise.all([
      serviceClient.from("quotes").select("*", { count: "exact", head: true }).eq("user_id", user.id),
      serviceClient.from("contracts").select("*", { count: "exact", head: true }).eq("user_id", user.id),
      serviceClient.from("invoices").select("*", { count: "exact", head: true }).eq("user_id", user.id),
    ]);

    const total = (quotes.count || 0) + (contracts.count || 0) + (invoices.count || 0);
    if (total >= 5) {
      return NextResponse.json({
        allowed: false,
        isPro: false,
        reason: "Free plan is limited to 5 documents total. Upgrade to Pro for unlimited documents.",
      });
    }
  }

  return NextResponse.json({ allowed: true, isPro: false });
}
