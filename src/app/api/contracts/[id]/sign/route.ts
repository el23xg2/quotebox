import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { sendEmail, getContractSignedEmail } from "@/lib/email";

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
  const { signatureType, signatureData, clientName } = await request.json();

  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
  }

  // Insert signature
  const { error: sigError } = await supabase.from("contract_signatures").insert({
    contract_id: id,
    type: signatureType,
    signature_data: signatureData,
  });

  if (sigError) {
    return NextResponse.json({ error: sigError.message }, { status: 500 });
  }

  // Update contract status to signed
  const { data: contract, error: updateError } = await supabase
    .from("contracts")
    .update({ status: "signed", signed_at: new Date().toISOString() })
    .eq("id", id)
    .select("title, user_id")
    .single();

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  // Send notification to the business owner
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const { data: owner } = await supabase.auth.admin.getUserById(contract.user_id);

  if (owner?.user?.email) {
    const dashboardUrl = `${baseUrl}/dashboard/contracts/${id}`;
    const emailContent = getContractSignedEmail(
      owner.user.email,
      clientName || "Client",
      contract.title,
      dashboardUrl
    );

    await sendEmail({
      to: owner.user.email,
      subject: emailContent.subject,
      html: emailContent.html,
    });
  }

  return NextResponse.json({ success: true });
}
