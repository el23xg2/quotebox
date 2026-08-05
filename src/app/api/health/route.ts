import { NextResponse } from "next/server";

export async function GET() {
  const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").trim();
  const appUrl = (process.env.NEXT_PUBLIC_APP_URL || "").trim();
  const hasAnonKey = Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  const hasServiceKey = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);

  const checks: Record<string, { ok: boolean; detail: string }> = {
    supabase_url: {
      ok: supabaseUrl.startsWith("http"),
      detail: supabaseUrl ? "configured" : "missing NEXT_PUBLIC_SUPABASE_URL",
    },
    supabase_anon_key: {
      ok: hasAnonKey,
      detail: hasAnonKey ? "configured" : "missing NEXT_PUBLIC_SUPABASE_ANON_KEY",
    },
    supabase_service_key: {
      ok: hasServiceKey,
      detail: hasServiceKey ? "configured" : "missing SUPABASE_SERVICE_ROLE_KEY",
    },
    app_url: {
      ok: appUrl.startsWith("http"),
      detail: appUrl || "missing NEXT_PUBLIC_APP_URL",
    },
  };

  let supabaseReachable = false;
  let supabaseDetail = "not checked";

  if (supabaseUrl.startsWith("http")) {
    try {
      const res = await fetch(`${supabaseUrl.replace(/\/$/, "")}/auth/v1/health`, {
        signal: AbortSignal.timeout(5000),
      });
      supabaseReachable = res.ok;
      supabaseDetail = supabaseReachable ? "reachable" : `HTTP ${res.status}`;
    } catch (err) {
      const message = err instanceof Error ? err.message : "unknown";
      supabaseDetail = message.includes("ENOTFOUND") || message.includes("getaddrinfo")
        ? "DNS lookup failed — Supabase project may be deleted or paused"
        : `unreachable: ${message}`;
    }
  }

  checks.supabase_reachable = { ok: supabaseReachable, detail: supabaseDetail };

  const allOk = Object.values(checks).every((c) => c.ok);

  return NextResponse.json(
    { status: allOk ? "healthy" : "degraded", checks },
    { status: allOk ? 200 : 503 }
  );
}
