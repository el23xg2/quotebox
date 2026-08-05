import { createSupabaseServerClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  let body: { email?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const email = body.email?.trim();
  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "";

  if (!supabaseUrl.startsWith("http")) {
    return NextResponse.json(
      {
        error: "Authentication is not configured. Please set NEXT_PUBLIC_SUPABASE_URL on the server.",
        code: "not_configured",
      },
      { status: 503 }
    );
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json(
      {
        error: "Authentication service is unavailable.",
        code: "not_configured",
      },
      { status: 503 }
    );
  }

  const redirectBase = appUrl.startsWith("http")
    ? appUrl
    : new URL(request.url).origin;

  try {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${redirectBase}/auth/callback`,
      },
    });

    if (error) {
      console.error("Magic link error:", error);
      return NextResponse.json({ error: error.message, code: error.name }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Magic link fetch error:", err);

    if (message.includes("fetch failed") || message.includes("ENOTFOUND") || message.includes("getaddrinfo")) {
      return NextResponse.json(
        {
          error:
            "Cannot reach Supabase. The project may be paused or deleted. Check your Supabase dashboard and Railway environment variables.",
          code: "supabase_unreachable",
        },
        { status: 503 }
      );
    }

    return NextResponse.json({ error: message, code: "unknown" }, { status: 500 });
  }
}
