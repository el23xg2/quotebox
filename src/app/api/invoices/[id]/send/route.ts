import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { sendEmail, getInvoiceSentEmail } from "@/lib/email";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: invoice } = await supabase
    .from("invoices")
    .select("*, clients(name, email)")
    .eq("id", id)
    .single();

  if (!invoice) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const invoiceUrl = `${process.env.NEXT_PUBLIC_APP_URL}/public/invoices/${id}`;
  const amount = (invoice.total / 100).toFixed(2);

  if (invoice.clients?.email) {
    const emailContent = getInvoiceSentEmail(
      invoice.clients.name || "Client",
      invoice.invoice_number,
      amount,
      invoiceUrl
    );

    await sendEmail({
      to: invoice.clients.email,
      subject: emailContent.subject,
      html: emailContent.html,
    });
  }

  await supabase
    .from("invoices")
    .update({ status: "sent" })
    .eq("id", id);

  return NextResponse.json({ success: true });
}
