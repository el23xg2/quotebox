import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, FileSignature, Receipt, Users, TrendingUp, DollarSign } from "lucide-react";

async function getDashboardData() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const userId = user.id;

  const [clients, quotes, contracts, invoices] = await Promise.all([
    supabase.from("clients").select("*", { count: "exact", head: true }).eq("user_id", userId),
    supabase.from("quotes").select("*", { count: "exact", head: true }).eq("user_id", userId),
    supabase.from("contracts").select("*", { count: "exact", head: true }).eq("user_id", userId),
    supabase.from("invoices").select("*", { count: "exact", head: true }).eq("user_id", userId),
  ]);

  // Get recent items
  const { data: recentQuotes } = await supabase
    .from("quotes")
    .select("*, clients(name)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(5);

  const { data: recentInvoices } = await supabase
    .from("invoices")
    .select("*, clients(name)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(5);

  // Get total paid
  const { data: paidInvoices } = await supabase
    .from("invoices")
    .select("total, paid_amount")
    .eq("user_id", userId)
    .eq("status", "paid");

  const totalEarned = paidInvoices?.reduce((sum, inv) => sum + (inv.paid_amount || inv.total), 0) ?? 0;

  return {
    counts: {
      clients: clients.count ?? 0,
      quotes: quotes.count ?? 0,
      contracts: contracts.count ?? 0,
      invoices: invoices.count ?? 0,
    },
    totalEarned,
    recentQuotes: recentQuotes ?? [],
    recentInvoices: recentInvoices ?? [],
  };
}

export default async function DashboardPage() {
  const data = await getDashboardData();

  const stats = [
    { label: "Clients", value: data.counts.clients, icon: Users, color: "text-blue-600 bg-blue-100" },
    { label: "Quotes", value: data.counts.quotes, icon: FileText, color: "text-green-600 bg-green-100" },
    { label: "Contracts", value: data.counts.contracts, icon: FileSignature, color: "text-purple-600 bg-purple-100" },
    { label: "Invoices", value: data.counts.invoices, icon: Receipt, color: "text-orange-600 bg-orange-100" },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Welcome back! Here&apos;s your business at a glance.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardContent className="flex items-center gap-4 py-4">
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
        <Card>
          <CardContent className="flex items-center gap-4 py-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100">
              <DollarSign className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Earned</p>
              <p className="text-2xl font-bold text-gray-900">
                ${(data.totalEarned / 100).toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent activity */}
      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <Card>
          <CardContent className="py-4">
            <h3 className="mb-4 font-semibold text-gray-900">Recent Quotes</h3>
            {data.recentQuotes.length === 0 ? (
              <p className="text-sm text-gray-500">No quotes yet. Create your first one!</p>
            ) : (
              <div className="space-y-3">
                {data.recentQuotes.map((quote) => (
                  <div key={quote.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {(quote as any).clients?.name || "Unknown"}
                      </p>
                      <p className="text-xs text-gray-500">
                        ${(quote.total / 100).toFixed(2)}
                      </p>
                    </div>
                    <span className="text-xs capitalize text-gray-500">{quote.status}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="py-4">
            <h3 className="mb-4 font-semibold text-gray-900">Recent Invoices</h3>
            {data.recentInvoices.length === 0 ? (
              <p className="text-sm text-gray-500">No invoices yet.</p>
            ) : (
              <div className="space-y-3">
                {data.recentInvoices.map((inv) => (
                  <div key={inv.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {(inv as any).clients?.name || "Unknown"}
                      </p>
                      <p className="text-xs text-gray-500">
                        ${(inv.total / 100).toFixed(2)}
                      </p>
                    </div>
                    <span className="text-xs capitalize text-gray-500">{inv.status}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
