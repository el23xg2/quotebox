import { Webhook } from "@creem_io/nextjs";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Map Creem product IDs to plan IDs
const PRODUCT_TO_PLAN: Record<string, string> = {
  [process.env.NEXT_PUBLIC_CREEM_PRO_MONTHLY_ID || ""]: "pro_monthly",
  [process.env.NEXT_PUBLIC_CREEM_PRO_YEARLY_ID || ""]: "pro_yearly",
  [process.env.NEXT_PUBLIC_CREEM_LIFETIME_ID || ""]: "lifetime",
};

function getPlanId(productId: string): string {
  return PRODUCT_TO_PLAN[productId] || "free";
}

function getSupabaseService() {
  return createClient(supabaseUrl, supabaseKey);
}

export const POST = Webhook({
  webhookSecret: process.env.CREEM_WEBHOOK_SECRET || "",

  onCheckoutCompleted: async ({ product, customer, order, id: checkoutId, metadata, subscription }) => {
    const supabase = getSupabaseService();

    // Handle invoice payments FIRST — no userId needed (client may not be logged in)
    const invoiceId = metadata?.invoice_id as string;
    if (invoiceId) {
      await supabase
        .from("invoices")
        .update({
          status: "paid",
          paid_amount: order?.amount_paid || order?.amount || 0,
          paid_at: new Date().toISOString(),
        })
        .eq("id", invoiceId);

      console.log("Invoice payment completed:", { invoiceId });
      return; // Invoice-only checkout, no subscription to update
    }

    const productId = typeof product === "string" ? product : product.id;
    const planId = metadata?.plan_id as string || getPlanId(productId);
    const userId = metadata?.referenceId as string;

    if (!userId) {
      console.error("No referenceId (userId) in checkout metadata");
      return;
    }

    const isLifetime = planId === "lifetime";

    if (isLifetime) {
      await supabase.from("subscriptions").upsert({
        user_id: userId,
        creem_customer_id: customer?.id || null,
        creem_subscription_id: null,
        plan_id: "lifetime",
        status: "active",
        current_period_start: new Date().toISOString(),
        current_period_end: new Date(Date.now() + 100 * 365 * 24 * 60 * 60 * 1000).toISOString(),
      }, { onConflict: "user_id" });
    } else {
      // Use the real subscription ID (sub_xxx), NOT the checkout session ID (chk_xxx)
      const realSubscriptionId = subscription?.id || checkoutId;
      await supabase.from("subscriptions").upsert({
        user_id: userId,
        creem_customer_id: customer?.id || null,
        creem_subscription_id: realSubscriptionId,
        plan_id: planId,
        status: "active",
        current_period_start: subscription?.current_period_start_date
          ? new Date(subscription.current_period_start_date).toISOString()
          : new Date().toISOString(),
        current_period_end: subscription?.current_period_end_date
          ? new Date(subscription.current_period_end_date).toISOString()
          : null,
      }, { onConflict: "user_id" });
    }
  },

  onSubscriptionPaid: async ({ id, current_period_start_date, current_period_end_date }) => {
    const supabase = getSupabaseService();
    await supabase
      .from("subscriptions")
      .update({
        status: "active",
        current_period_start: current_period_start_date
          ? new Date(current_period_start_date).toISOString()
          : undefined,
        current_period_end: current_period_end_date
          ? new Date(current_period_end_date).toISOString()
          : undefined,
      })
      .eq("creem_subscription_id", id);
  },

  onSubscriptionActive: async ({ id, current_period_start_date, current_period_end_date }) => {
    const supabase = getSupabaseService();
    await supabase
      .from("subscriptions")
      .update({
        status: "active",
        current_period_start: current_period_start_date
          ? new Date(current_period_start_date).toISOString()
          : undefined,
        current_period_end: current_period_end_date
          ? new Date(current_period_end_date).toISOString()
          : undefined,
      })
      .eq("creem_subscription_id", id);
  },

  onSubscriptionCanceled: async ({ id }) => {
    const supabase = getSupabaseService();
    await supabase
      .from("subscriptions")
      .update({
        status: "canceled",
        plan_id: "free",
        creem_subscription_id: null,
      })
      .eq("creem_subscription_id", id);
  },

  onSubscriptionPastDue: async ({ id, current_period_end_date }) => {
    const supabase = getSupabaseService();
    await supabase
      .from("subscriptions")
      .update({
        status: "past_due",
        current_period_end: current_period_end_date
          ? new Date(current_period_end_date).toISOString()
          : null,
      })
      .eq("creem_subscription_id", id);
  },

  onSubscriptionExpired: async ({ id }) => {
    const supabase = getSupabaseService();
    await supabase
      .from("subscriptions")
      .update({
        status: "expired",
        plan_id: "free",
        creem_subscription_id: null,
      })
      .eq("creem_subscription_id", id);
  },

  onSubscriptionPaused: async ({ id }) => {
    const supabase = getSupabaseService();
    await supabase
      .from("subscriptions")
      .update({
        status: "paused",
      })
      .eq("creem_subscription_id", id);
  },

  onSubscriptionUpdate: async ({ id, current_period_end_date }) => {
    const supabase = getSupabaseService();
    await supabase
      .from("subscriptions")
      .update({
        current_period_end: current_period_end_date
          ? new Date(current_period_end_date).toISOString()
          : undefined,
      })
      .eq("creem_subscription_id", id);
  },

  onRefundCreated: async ({ order }) => {
    const supabase = getSupabaseService();
    console.log("Refund created for order:", order);
  },

  onGrantAccess: async ({ reason, customer, metadata }) => {
    const userId = metadata?.referenceId as string;
    console.log(`Grant access: ${reason} to user ${userId}`);
  },

  onRevokeAccess: async ({ reason, customer, metadata }) => {
    const userId = metadata?.referenceId as string;
    console.log(`Revoke access: ${reason} from user ${userId}`);
  },
});
