import { createSupabaseServerClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  // Always use the request URL origin (the actual site domain)
  const origin = new URL(request.url).origin;

  if (code) {
    const supabase = await createSupabaseServerClient();
    if (!supabase) {
      return NextResponse.redirect(`${origin}/login?error=not_configured`);
    }
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_failed`);
}
