"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { Plus, Search } from "lucide-react";
import Link from "next/link";
import { formatCurrency, formatDate } from "@/lib/utils";

interface Quote {
  id: string;
  quote_number: string;
  status: string;
  total: number;
  created_at: string;
  clients: { name: string } | null;
}

export default function QuotesPage() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadQuotes();
  }, []);

  async function loadQuotes() {
    const supabase = createSupabaseBrowserClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("quotes")
      .select("*, clients(name)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (data) setQuotes(data);
    setLoading(false);
  }

  const filtered = quotes.filter(
    (q) =>
      q.quote_number.toLowerCase().includes(search.toLowerCase()) ||
      q.clients?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quotes</h1>
          <p className="mt-1 text-sm text-gray-500">
            Create and send professional quotes.
          </p>
        </div>
        <Link href="/dashboard/quotes/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" /> New Quote
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search quotes..."
              className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-gray-500">Loading...</p>
          ) : filtered.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-sm text-gray-500">No quotes found.</p>
              <Link href="/dashboard/quotes/new">
                <Button variant="outline" className="mt-4">
                  Create your first quote
                </Button>
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filtered.map((quote) => (
                <div
                  key={quote.id}
                  className="flex items-center justify-between py-3 cursor-pointer hover:bg-gray-50 px-2 rounded-lg transition-colors"
                  onClick={() => router.push(`/dashboard/quotes/${quote.id}`)}
                >
                  <div>
                    <p className="font-medium text-gray-900">
                      {quote.clients?.name || "Unknown"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {quote.quote_number} &middot; {formatDate(quote.created_at)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-gray-900">
                      {formatCurrency(quote.total)}
                    </span>
                    <Badge status={quote.status} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
