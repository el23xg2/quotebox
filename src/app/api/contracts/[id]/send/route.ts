import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { sendEmail, getContractReadyEmail } from "@/lib/email";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: contract } = await supabase
    .from("contracts")
    .select("*, clients(name, email)")
    .eq("id", id)
    .single();

  if (!contract) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const contractUrl = `${process.env.NEXT_PUBLIC_APP_URL}/public/contracts/${id}`;

  if (contract.clients?.email) {
    const emailContent = getContractReadyEmail(
      contract.clients.name || "Client",
      contract.title,
      contractUrl
    );

    await sendEmail({
      to: contract.clients.email,
      subject: emailContent.subject,
      html: emailContent.html,
    });
  }

  await supabase
    .from("contracts")
    .update({ status: "sent" })
    .eq("id", id);

  return NextResponse.json({ success: true });
}
