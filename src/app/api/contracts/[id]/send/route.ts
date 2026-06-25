import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { sendEmail, getContractReadyEmail } from "@/lib/email";

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

  const { data: contract, error: dbError } = await supabase
    .from("contracts")
    .select("*, clients(name, email)")
    .eq("id", id)
    .single();

  if (dbError) {
    return NextResponse.json({ error: `DB error: ${dbError.message}` }, { status: 500 });
  }

  if (!contract) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const contractUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/public/contracts/${id}`;

  if (contract.clients?.email) {
    const emailContent = getContractReadyEmail(
      contract.clients.name || "Client",
      contract.title,
      contractUrl
    );

    const emailResult = await sendEmail({
      to: contract.clients.email,
      subject: emailContent.subject,
      html: emailContent.html,
    });

    if (!emailResult.success) {
      console.error("Email send failed:", emailResult.error || emailResult);
    }
  }

  await supabase
    .from("contracts")
    .update({ status: "sent" })
    .eq("id", id);

  return NextResponse.json({ success: true });
}
