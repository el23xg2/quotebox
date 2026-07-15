import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { sendEmail, getInvoiceSentEmail } from "@/lib/email";

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
  if (!url.startsWith("http") || !key) return null;
  return createClient(url, key);
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
  }

  const { data: invoice, error: dbError } = await supabase
    .from("invoices")
    .select("*, clients(name, email)")
    .eq("id", id)
    .single();

  if (dbError) {
    return NextResponse.json({ error: `DB error: ${dbError.message}` }, { status: 500 });
  }

  if (!invoice) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const invoiceUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/public/invoices/${id}`;
  const amount = ((invoice.total / 100).toFixed(2));

  if (invoice.clients?.email) {
    const emailContent = getInvoiceSentEmail(
      invoice.clients.name || "Client",
      invoice.invoice_number,
      amount,
      invoiceUrl
    );

    const emailResult = await sendEmail({
      to: invoice.clients.email,
      subject: emailContent.subject,
      html: emailContent.html,
    });

    if (!emailResult.success) {
      console.error("Email send failed:", emailResult.error || emailResult);
      return NextResponse.json({
        success: true,
        warning: "Invoice saved but email delivery failed. Please try sending again.",
      });
    }
  }

  await supabase
    .from("invoices")
    .update({ status: "sent" })
    .eq("id", id);

  return NextResponse.json({ success: true });
}
