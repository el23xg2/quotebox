"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { Plus, Search } from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";

interface Contract {
  id: string;
  title: string;
  status: string;
  created_at: string;
  clients: { name: string } | null;
}

export default function ContractsPage() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadContracts();
  }, []);

  async function loadContracts() {
    const supabase = createSupabaseBrowserClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("contracts")
      .select("*, clients(name)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (data) setContracts(data);
    setLoading(false);
  }

  const filtered = contracts.filter(
    (c) =>
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.clients?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contracts</h1>
          <p className="mt-1 text-sm text-gray-500">
            Create and send contracts for e-signature.
          </p>
        </div>
        <Link href="/dashboard/contracts/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" /> New Contract
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search contracts..."
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
              <p className="text-sm text-gray-500 mb-4">No contracts found.</p>
              <Link href="/dashboard/contracts/new">
                <span className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors">
                  Create your first contract
                </span>
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filtered.map((contract) => (
                <div
                  key={contract.id}
                  className="flex items-center justify-between py-3 cursor-pointer hover:bg-gray-50 px-2 rounded-lg transition-colors"
                  onClick={() => router.push(`/dashboard/contracts/${contract.id}`)}
                >
                  <div>
                    <p className="font-medium text-gray-900">{contract.title}</p>
                    <p className="text-sm text-gray-500">
                      {contract.clients?.name || "Unknown"} &middot; {formatDate(contract.created_at)}
                    </p>
                  </div>
                  <Badge status={contract.status} />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
