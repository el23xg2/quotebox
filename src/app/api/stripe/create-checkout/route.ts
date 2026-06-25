import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  const Stripe = require("stripe");
  return new Stripe(key);
}

export async function POST(request: Request) {
  const { invoiceId } = await request.json();

  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 500 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: invoice } = await supabase
    .from("invoices")
    .select("*, clients(name, email)")
    .eq("id", invoiceId)
    .single();

  if (!invoice) {
    return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: `Invoice #${invoice.invoice_number}`,
            description: `Payment for ${invoice.clients?.name || "Client"}`,
          },
          unit_amount: invoice.total,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/public/invoices/${invoiceId}?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/public/invoices/${invoiceId}?canceled=true`,
    metadata: {
      invoice_id: invoiceId,
    },
  });

  return NextResponse.json({ url: session.url });
}
