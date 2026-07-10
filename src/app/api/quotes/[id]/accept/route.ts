import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { sendEmail, getQuoteAcceptedEmail } from "@/lib/email";

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

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || new URL(request.url).origin;

  // Only allow accepting quotes that are currently in "sent" status
  const { data: existing } = await supabase
    .from("quotes")
    .select("status, user_id, quote_number, clients(name)")
    .eq("id", id)
    .single();

  if (!existing) {
    return NextResponse.redirect(
      new URL(`/public/quotes/${id}?error=not_found`, baseUrl)
    );
  }

  if (existing.status !== "sent") {
    return NextResponse.redirect(
      new URL(`/public/quotes/${id}`, baseUrl)
    );
  }

  const { error } = await supabase
    .from("quotes")
    .update({ status: "accepted", accepted_at: new Date().toISOString() })
    .eq("id", id)
    .eq("status", "sent");

  if (error) {
    return NextResponse.redirect(
      new URL(`/public/quotes/${id}?error=failed`, baseUrl)
    );
  }

  // Send notification email to the business owner
  const { data: owner } = await supabase.auth.admin.getUserById(existing.user_id);

  if (owner?.user?.email) {
    const dashboardUrl = `${baseUrl}/dashboard/quotes/${id}`;
    const emailContent = getQuoteAcceptedEmail(
      owner.user.email,
      (existing.clients as any)?.name || "Client",
      existing.quote_number,
      dashboardUrl
    );

    await sendEmail({
      to: owner.user.email,
      subject: emailContent.subject,
      html: emailContent.html,
    });
  }

  return NextResponse.redirect(
    new URL(`/public/quotes/${id}`, baseUrl)
  );
}
