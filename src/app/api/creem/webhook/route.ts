import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";
import { NextResponse } from "next/server";
import { getInvoicePaidEmail, sendEmail } from "@/lib/email";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

function getPlanId(productId: string): string {
  const map: Record<string, string> = {};
  const proMonthly = process.env.NEXT_PUBLIC_CREEM_PRO_MONTHLY_ID;
  const proYearly = process.env.NEXT_PUBLIC_CREEM_PRO_YEARLY_ID;
  const lifetime = process.env.NEXT_PUBLIC_CREEM_LIFETIME_ID;
  if (proMonthly) map[proMonthly] = "pro_monthly";
  if (proYearly) map[proYearly] = "pro_yearly";
  if (lifetime) map[lifetime] = "lifetime";
  return map[productId] || "free";
}

function getSupabase() {
  return createClient(supabaseUrl, supabaseKey);
}

// Verify Creem webhook HMAC-SHA256 signature
function verifySignature(rawBody: string, signature: string, secret: string): boolean {
  try {
    const computed = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
    return crypto.timingSafeEqual(Buffer.from(computed, "hex"), Buffer.from(signature, "hex"));
  } catch {
    return false;
  }
}

// Extract string ID from an object or string
function resolveId(value: unknown): string | undefined {
  if (typeof value === "string") return value;
  if (value && typeof value === "object" && "id" in (value as any)) return (value as any).id;
  return undefined;
}

export async function POST(request: Request) {
  const secret = process.env.CREEM_WEBHOOK_SECRET;
  if (!secret) {
    console.error("CREEM_WEBHOOK_SECRET not configured");
    return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
  }

  // Read raw body for signature verification
  const rawBody = await request.text();
  const signature = request.headers.get("creem-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 401 });
  }

  if (!verifySignature(rawBody, signature, secret)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  // Parse event
  let event: { eventType: string; id: string; object: any };
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { eventType, object } = event;
  const supabase = getSupabase();

  try {
    switch (eventType) {
      case "checkout.completed": {
        const checkout = object;
        const metadata = checkout.metadata || {};
        const customer = checkout.customer;
        const order = checkout.order;

        // Handle invoice payments first — no userId needed (client may not be logged in)
        const invoiceId = metadata.invoice_id as string;
        if (invoiceId) {
          await supabase
            .from("invoices")
            .update({
              status: "paid",
              paid_amount: order?.amount_paid || order?.amount || 0,
              paid_at: new Date().toISOString(),
            })
            .eq("id", invoiceId);

          // Send payment notification to business owner
          try {
            const { data: invoice } = await supabase
              .from("invoices")
              .select("invoice_number, total, user_id, clients(name)")
              .eq("id", invoiceId)
              .single();

            if (invoice?.user_id) {
              const { data: userData } = await supabase.auth.admin.getUserById(invoice.user_id);
              const ownerEmail = userData?.user?.email;
              const clientName = (invoice.clients as any)?.name || "a client";
              const amount = ((invoice.total || 0) / 100).toFixed(2);
              const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://quotebox.pro";

              if (ownerEmail) {
                await sendEmail({
                  to: ownerEmail,
                  ...getInvoicePaidEmail(clientName, invoice.invoice_number, amount, `${appUrl}/dashboard`),
                });
              }
            }
          } catch (emailErr) {
            console.error("Failed to send invoice paid email:", emailErr);
          }

          console.log("Invoice payment completed:", { invoiceId });
          return NextResponse.json({ received: true });
        }

        // Handle subscription purchase
        const productId = resolveId(checkout.product) || "";
        const planId = (metadata.plan_id as string) || getPlanId(productId);
        const userId = metadata.referenceId as string;

        if (!userId) {
          console.error("No referenceId in checkout metadata");
          return NextResponse.json({ received: true });
        }

        const customerId = resolveId(customer);
        const isLifetime = planId === "lifetime";

        if (isLifetime) {
          await supabase.from("subscriptions").upsert({
            user_id: userId,
            creem_customer_id: customerId || null,
            creem_subscription_id: null,
            plan_id: "lifetime",
            status: "active",
            current_period_start: new Date().toISOString(),
            current_period_end: new Date(Date.now() + 100 * 365 * 24 * 60 * 60 * 1000).toISOString(),
          }, { onConflict: "user_id" });
        } else {
          // subscription could be a string ID or expanded object
          const sub = checkout.subscription;
          const realSubscriptionId = resolveId(sub);

          const periodStart = sub?.current_period_start_date
            ? new Date(sub.current_period_start_date).toISOString()
            : new Date().toISOString();
          const periodEnd = sub?.current_period_end_date
            ? new Date(sub.current_period_end_date).toISOString()
            : null;

          await supabase.from("subscriptions").upsert({
            user_id: userId,
            creem_customer_id: customerId || null,
            creem_subscription_id: realSubscriptionId || null,
            plan_id: planId,
            status: "active",
            current_period_start: periodStart,
            current_period_end: periodEnd,
          }, { onConflict: "user_id" });
        }
        break;
      }

      case "subscription.active":
      case "subscription.paid": {
        const sub = object;
        const subId = sub.id || sub.subscription_id;
        await supabase
          .from("subscriptions")
          .update({
            status: "active",
            current_period_start: sub.current_period_start_date
              ? new Date(sub.current_period_start_date).toISOString()
              : undefined,
            current_period_end: sub.current_period_end_date
              ? new Date(sub.current_period_end_date).toISOString()
              : undefined,
          })
          .eq("creem_subscription_id", subId);
        break;
      }

      case "subscription.canceled": {
        const sub = object;
        const subId = sub.id || sub.subscription_id;
        await supabase
          .from("subscriptions")
          .update({
            status: "canceled",
            creem_subscription_id: null,
          })
          .eq("creem_subscription_id", subId);
        break;
      }

      case "subscription.past_due": {
        const sub = object;
        const subId = sub.id || sub.subscription_id;
        await supabase
          .from("subscriptions")
          .update({
            status: "past_due",
            current_period_end: sub.current_period_end_date
              ? new Date(sub.current_period_end_date).toISOString()
              : null,
          })
          .eq("creem_subscription_id", subId);
        break;
      }

      case "subscription.expired": {
        const sub = object;
        const subId = sub.id || sub.subscription_id;
        await supabase
          .from("subscriptions")
          .update({
            status: "expired",
            creem_subscription_id: null,
          })
          .eq("creem_subscription_id", subId);
        break;
      }

      case "subscription.paused": {
        const sub = object;
        const subId = sub.id || sub.subscription_id;
        await supabase
          .from("subscriptions")
          .update({ status: "paused" })
          .eq("creem_subscription_id", subId);
        break;
      }

      case "subscription.update": {
        const sub = object;
        const subId = sub.id || sub.subscription_id;
        await supabase
          .from("subscriptions")
          .update({
            current_period_end: sub.current_period_end_date
              ? new Date(sub.current_period_end_date).toISOString()
              : undefined,
          })
          .eq("creem_subscription_id", subId);
        break;
      }

      case "refund.created": {
        console.log("Refund created:", object);
        break;
      }

      default:
        console.log("Unhandled webhook event:", eventType);
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error("Webhook handler error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
