import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { sendEmail, getQuoteSentEmail } from "@/lib/email";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Get quote with client info
  const { data: quote } = await supabase
    .from("quotes")
    .select("*, clients(name, email), users(email)")
    .eq("id", id)
    .single();

  if (!quote) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const quoteUrl = `${process.env.NEXT_PUBLIC_APP_URL}/public/quotes/${id}`;

  // Send email to client
  if (quote.clients?.email) {
    const emailContent = getQuoteSentEmail(
      quote.clients.name || "Client",
      quote.quote_number,
      quoteUrl
    );

    await sendEmail({
      to: quote.clients.email,
      subject: emailContent.subject,
      html: emailContent.html,
    });
  }

  // Update status to sent
  await supabase
    .from("quotes")
    .update({ status: "sent", sent_at: new Date().toISOString() })
    .eq("id", id);

  return NextResponse.json({ success: true });
}
