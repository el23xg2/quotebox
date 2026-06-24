import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: quote, error } = await supabase
    .from("quotes")
    .update({ status: "accepted", accepted_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.redirect(
      new URL(`/public/quotes/${id}?error=failed`, process.env.NEXT_PUBLIC_APP_URL!)
    );
  }

  return NextResponse.redirect(
    new URL(`/public/quotes/${id}`, process.env.NEXT_PUBLIC_APP_URL!)
  );
}
