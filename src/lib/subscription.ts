import { createClient } from "@supabase/supabase-js";

const FREE_LIMITS = {
  clients: 3,
  documents: 5, // total quotes + contracts + invoices
};

export interface SubscriptionInfo {
  plan_id: string;
  status: string;
  creem_customer_id: string | null;
  creem_subscription_id: string | null;
  current_period_end: string | null;
}

export function getServiceSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
  if (!url.startsWith("http") || !key) return null;
  return createClient(url, key);
}

export async function getUserSubscription(userId: string): Promise<SubscriptionInfo | null> {
  const supabase = getServiceSupabase();
  if (!supabase) return null;

  const { data } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", userId)
    .single();

  return data;
}

export async function checkUsageLimit(
  userId: string
): Promise<{ allowed: boolean; reason?: string }> {
  const supabase = getServiceSupabase();
  if (!supabase) {
    return { allowed: true }; // Allow if DB not configured
  }

  const sub = await getUserSubscription(userId);

  // Pro users with active subscriptions have no limits
  if (sub && sub.plan_id !== "free" && sub.status === "active") {
    return { allowed: true };
  }

  // Count clients
  const { count: clientCount } = await supabase
    .from("clients")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);

  if (clientCount && clientCount >= FREE_LIMITS.clients) {
    return {
      allowed: false,
      reason: `Free plan is limited to ${FREE_LIMITS.clients} clients. Upgrade to Pro for unlimited clients.`,
    };
  }

  // Count total documents (quotes + contracts + invoices)
  const [quotes, contracts, invoices] = await Promise.all([
    supabase.from("quotes").select("*", { count: "exact", head: true }).eq("user_id", userId),
    supabase.from("contracts").select("*", { count: "exact", head: true }).eq("user_id", userId),
    supabase.from("invoices").select("*", { count: "exact", head: true }).eq("user_id", userId),
  ]);

  const totalDocs =
    (quotes.count || 0) + (contracts.count || 0) + (invoices.count || 0);

  if (totalDocs >= FREE_LIMITS.documents) {
    return {
      allowed: false,
      reason: `Free plan is limited to ${FREE_LIMITS.documents} documents total. Upgrade to Pro for unlimited documents.`,
    };
  }

  return { allowed: true };
}

export function getPlanName(planId: string): string {
  const plans: Record<string, string> = {
    free: "Free",
    pro_monthly: "Pro Monthly",
    pro_yearly: "Pro Yearly",
    lifetime: "Lifetime",
  };
  return plans[planId] || planId;
}
