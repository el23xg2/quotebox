import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, FileSignature, Receipt, Users, DollarSign } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

const DEMO_STATS = {
  clients: 0,
  quotes: 0,
  contracts: 0,
  invoices: 0,
  earned: 0,
};

async function getDashboardData() {
  const supabase = await createSupabaseServerClient();

  // If Supabase is not configured, show demo/empty state
  if (!supabase) {
    return DEMO_STATS;
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return DEMO_STATS;

  const userId = user.id;

  const [clients, quotes, contracts, invoices] = await Promise.all([
    supabase.from("clients").select("*", { count: "exact", head: true }).eq("user_id", userId),
    supabase.from("quotes").select("*", { count: "exact", head: true }).eq("user_id", userId),
    supabase.from("contracts").select("*", { count: "exact", head: true }).eq("user_id", userId),
    supabase.from("invoices").select("*", { count: "exact", head: true }).eq("user_id", userId),
  ]);

  const { data: paidInvoices } = await supabase
    .from("invoices")
    .select("total, paid_amount")
    .eq("user_id", userId)
    .eq("status", "paid");

  const totalEarned = paidInvoices?.reduce((sum, inv) => sum + (inv.paid_amount || inv.total), 0) ?? 0;

  return {
    clients: clients.count ?? 0,
    quotes: quotes.count ?? 0,
    contracts: contracts.count ?? 0,
    invoices: invoices.count ?? 0,
    earned: totalEarned,
  };
}

export default async function DashboardPage() {
  const data = await getDashboardData();

  const stats = [
    { label: "Clients", value: data.clients, icon: Users, color: "text-blue-600 bg-blue-100", link: "/dashboard/clients" },
    { label: "Quotes", value: data.quotes, icon: FileText, color: "text-green-600 bg-green-100", link: "/dashboard/quotes" },
    { label: "Contracts", value: data.contracts, icon: FileSignature, color: "text-purple-600 bg-purple-100", link: "/dashboard/contracts" },
    { label: "Invoices", value: data.invoices, icon: Receipt, color: "text-orange-600 bg-orange-100", link: "/dashboard/invoices" },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Welcome to QuoteBox. Manage your quotes, contracts, and invoices.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.label} href={stat.link}>
              <Card className="cursor-pointer hover:shadow-md transition-shadow">
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
            </Link>
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
                {formatCurrency(data.earned)}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick actions */}
      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        <Card>
          <CardContent className="py-6">
            <h3 className="font-semibold text-gray-900">Create your first quote</h3>
            <p className="mt-1 text-sm text-gray-500">
              Add a client, describe your services, and send a professional quote in minutes.
            </p>
            <Link href="/dashboard/quotes/new">
              <Button className="mt-4" size="sm">New Quote</Button>
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-6">
            <h3 className="font-semibold text-gray-900">Add a client</h3>
            <p className="mt-1 text-sm text-gray-500">
              Build your client list to quickly create quotes and invoices.
            </p>
            <Link href="/dashboard/clients/new">
              <Button className="mt-4" size="sm" variant="outline">Add Client</Button>
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-6">
            <h3 className="font-semibold text-gray-900">View pricing</h3>
            <p className="mt-1 text-sm text-gray-500">
              Start free, upgrade when you&apos;re ready. $9/month for unlimited everything.
            </p>
            <Link href="/dashboard/pricing">
              <Button className="mt-4" size="sm" variant="outline">See Plans</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
