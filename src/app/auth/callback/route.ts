import { createSupabaseServerClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  // Use the configured APP_URL explicitly, fall back to request origin
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "";

  if (!baseUrl.startsWith("http")) {
    // If APP_URL is not configured, try using request origin
    const fallbackOrigin = new URL(request.url).origin;
    return NextResponse.redirect(`${fallbackOrigin}/login?error=not_configured`);
  }

  if (code) {
    const supabase = await createSupabaseServerClient();
    if (!supabase) {
      return NextResponse.redirect(`${baseUrl}/login?error=not_configured`);
    }
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${baseUrl}${next}`);
    }
  }

  return NextResponse.redirect(`${baseUrl}/login?error=auth_failed`);
}
