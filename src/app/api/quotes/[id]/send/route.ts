import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { sendEmail, getQuoteSentEmail } from "@/lib/email";

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

  // Get quote with client info
  const { data: quote, error: dbError } = await supabase
    .from("quotes")
    .select("*, clients(name, email)")
    .eq("id", id)
    .single();

  if (dbError) {
    return NextResponse.json({ error: `DB error: ${dbError.message}` }, { status: 500 });
  }

  if (!quote) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const quoteUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/public/quotes/${id}`;

  // Send email to client
  if (quote.clients?.email) {
    const emailContent = getQuoteSentEmail(
      quote.clients.name || "Client",
      quote.quote_number,
      quoteUrl
    );

    const emailResult = await sendEmail({
      to: quote.clients.email,
      subject: emailContent.subject,
      html: emailContent.html,
    });

    if (!emailResult.success) {
      console.error("Email send failed:", emailResult.error || emailResult);
      return NextResponse.json({
        success: true,
        warning: "Quote saved but email delivery failed. Please try sending again.",
      });
    }
  }

  // Update status to sent
  await supabase
    .from("quotes")
    .update({ status: "sent", sent_at: new Date().toISOString() })
    .eq("id", id);

  return NextResponse.json({ success: true });
}
