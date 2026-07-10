import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  const Stripe = require("stripe");
  return new Stripe(key);
}

export async function POST(request: Request) {
  try {
    const stripe = getStripe();
    if (!stripe) {
      return NextResponse.json({ error: "Stripe not configured" }, { status: 500 });
    }

    const body = await request.text();
    const sig = request.headers.get("stripe-signature")!;

    let event;

    try {
      event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error("Supabase not configured for webhook");
      return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Handle one-time invoice payment
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const invoiceId = session.metadata?.invoice_id;

      if (invoiceId) {
        const { error: invError } = await supabase
          .from("invoices")
          .update({
            status: "paid",
            paid_amount: session.amount_total!,
            paid_at: new Date().toISOString(),
          })
          .eq("id", invoiceId);

        if (invError) console.error("Failed to update invoice:", invError);
      }

      // Handle subscription checkout
      const userId = session.metadata?.user_id;
      const planIdFromMeta = session.metadata?.plan_id;
      const subscriptionId = session.subscription;
      const customerId = session.customer;

      console.log("checkout.session.completed:", { userId, planIdFromMeta, subscriptionId, customerId });

      if (userId) {
        if (subscriptionId && customerId) {
          // Subscription purchase (monthly/yearly)
          try {
            const subscription = await stripe.subscriptions.retrieve(subscriptionId);
            const priceId = subscription.items.data[0]?.price?.id;

            const priceToPlan: Record<string, string> = {
              price_1Tr7b3E3wdC54bTS6nwrElpd: "pro_monthly",
              price_1Tr7cQE3wdC54bTSuFC9Oncj: "pro_yearly",
              price_1Tr7eHE3wdC54bTSKgX90Hpr: "lifetime",
            };

            const planId = priceToPlan[priceId] || "pro_monthly";

            const { error: upsertError } = await supabase.from("subscriptions").upsert({
              user_id: userId,
              stripe_customer_id: customerId,
              stripe_subscription_id: subscriptionId,
              plan_id: planId,
              status: subscription.status === "active" || subscription.status === "trialing" ? "active" : subscription.status,
              current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
              current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            }, { onConflict: "user_id" });

            if (upsertError) {
              console.error("Failed to upsert subscription:", upsertError);
              return NextResponse.json({ error: upsertError.message }, { status: 500 });
            }

            console.log("Subscription upserted for user:", userId, "plan:", planId);
          } catch (err: any) {
            console.error("Failed to process subscription:", err);
            return NextResponse.json({ error: err.message }, { status: 500 });
          }
        } else if (planIdFromMeta === "lifetime") {
          // Lifetime purchase (one-time payment)
          const { error: upsertError } = await supabase.from("subscriptions").upsert({
            user_id: userId,
            stripe_customer_id: customerId,
            stripe_subscription_id: null,
            plan_id: "lifetime",
            status: "active",
            current_period_start: new Date().toISOString(),
            current_period_end: new Date(Date.now() + 100 * 365 * 24 * 60 * 60 * 1000).toISOString(),
          }, { onConflict: "user_id" });

          if (upsertError) {
            console.error("Failed to upsert lifetime:", upsertError);
            return NextResponse.json({ error: upsertError.message }, { status: 500 });
          }

          console.log("Lifetime upserted for user:", userId);
        }
      }
    }

    // Handle subscription renewals
    if (event.type === "invoice.paid") {
      const invoice = event.data.object;
      const subscriptionId = invoice.subscription;

      if (subscriptionId) {
        try {
          const subscription = await stripe.subscriptions.retrieve(subscriptionId);
          const { error } = await supabase
            .from("subscriptions")
            .update({
              status: subscription.status === "active" || subscription.status === "trialing" ? "active" : subscription.status,
              current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
              current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            })
            .eq("stripe_subscription_id", subscriptionId);

          if (error) console.error("Failed to update subscription period:", error);
        } catch (err: any) {
          console.error("Failed to process invoice.paid:", err);
        }
      }
    }

    // Handle subscription cancellation
    if (event.type === "customer.subscription.updated") {
      const subscription = event.data.object;
      const status = subscription.status;

      if (status === "canceled" || status === "past_due") {
        const { error } = await supabase
          .from("subscriptions")
          .update({
            status,
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
          })
          .eq("stripe_subscription_id", subscription.id);

        if (error) console.error("Failed to update subscription status:", error);
      }
    }

    // Handle subscription deletion
    if (event.type === "customer.subscription.deleted") {
      const subscription = event.data.object;

      const { error } = await supabase
        .from("subscriptions")
        .update({
          status: "canceled",
          plan_id: "free",
          stripe_subscription_id: null,
        })
        .eq("stripe_subscription_id", subscription.id);

      if (error) console.error("Failed to delete subscription:", error);
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error("Webhook unhandled error:", err);
    return NextResponse.json({ error: err.message || "Internal error" }, { status: 500 });
  }
}
