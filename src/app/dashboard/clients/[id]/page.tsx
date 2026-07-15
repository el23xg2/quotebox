"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { formatCurrency } from "@/lib/utils";
import { ArrowLeft, FileText, FileSignature, Receipt, Pencil } from "lucide-react";
import Link from "next/link";

interface ClientDetail {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  created_at: string;
}

interface RelatedItem {
  id: string;
  status: string;
  total: number;
  created_at: string;
}

interface RelatedContract extends RelatedItem {
  title: string;
}

export default function ClientDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [client, setClient] = useState<ClientDetail | null>(null);
  const [quotes, setQuotes] = useState<RelatedItem[]>([]);
  const [contracts, setContracts] = useState<RelatedContract[]>([]);
  const [invoices, setInvoices] = useState<RelatedItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadClient();
  }, [params.id]);

  async function loadClient() {
    const supabase = createSupabaseBrowserClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: clientData } = await supabase
      .from("clients")
      .select("*")
      .eq("id", params.id)
      .single();

    if (!clientData) {
      router.push("/dashboard/clients");
      return;
    }

    setClient(clientData);

    const [quotesRes, contractsRes, invoicesRes] = await Promise.all([
      supabase.from("quotes").select("*").eq("client_id", params.id).order("created_at", { ascending: false }),
      supabase.from("contracts").select("id, title, status, total, created_at").eq("client_id", params.id).order("created_at", { ascending: false }),
      supabase.from("invoices").select("*").eq("client_id", params.id).order("created_at", { ascending: false }),
    ]);

    if (quotesRes.data) setQuotes(quotesRes.data);
    if (contractsRes.data) setContracts(contractsRes.data);
    if (invoicesRes.data) setInvoices(invoicesRes.data);
    setLoading(false);
  }

  function goBack() {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/dashboard/clients");
    }
  }

  if (loading) return <p className="text-sm text-gray-500">Loading...</p>;
  if (!client) return null;

  return (
    <div>
      <button
        onClick={goBack}
        className="mb-6 flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900"
      >
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{client.name}</h1>
          <p className="mt-1 text-sm text-gray-500">{client.email}</p>
          {client.company && (
            <p className="text-sm text-gray-500">{client.company}</p>
          )}
        </div>
        <div className="flex gap-2">
          <Link href={`/dashboard/quotes/new?client_id=${client.id}`}>
            <Button variant="outline" size="sm" className="gap-1">
              <FileText className="h-4 w-4" /> New Quote
            </Button>
          </Link>
          <Link href={`/dashboard/invoices/new?client_id=${client.id}`}>
            <Button variant="outline" size="sm" className="gap-1">
              <Receipt className="h-4 w-4" /> New Invoice
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Quotes ({quotes.length})</h3>
              <Link href={`/dashboard/quotes/new?client_id=${client.id}`}>
                <Button variant="ghost" size="sm">New Quote</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {quotes.length === 0 ? (
              <p className="text-sm text-gray-500">No quotes yet.</p>
            ) : (
              <div className="divide-y divide-gray-100">
                {quotes.map((q) => (
                  <div key={q.id} className="flex items-center justify-between py-2">
                    <p className="text-sm font-medium text-gray-900">
                      {formatCurrency(q.total)}
                    </p>
                    <Badge status={q.status} />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Contracts ({contracts.length})</h3>
              <Link href={`/dashboard/contracts/new?client_id=${client.id}`}>
                <Button variant="ghost" size="sm">New Contract</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {contracts.length === 0 ? (
              <p className="text-sm text-gray-500">No contracts yet.</p>
            ) : (
              <div className="divide-y divide-gray-100">
                {contracts.map((c) => (
                  <div key={c.id} className="flex items-center justify-between py-2">
                    <p className="text-sm text-gray-900">{c.title}</p>
                    <Badge status={c.status} />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Invoices ({invoices.length})</h3>
              <Link href={`/dashboard/invoices/new?client_id=${client.id}`}>
                <Button variant="ghost" size="sm">New Invoice</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {invoices.length === 0 ? (
              <p className="text-sm text-gray-500">No invoices yet.</p>
            ) : (
              <div className="divide-y divide-gray-100">
                {invoices.map((inv) => (
                  <div key={inv.id} className="flex items-center justify-between py-2">
                    <p className="text-sm font-medium text-gray-900">
                      {formatCurrency(inv.total)}
                    </p>
                    <Badge status={inv.status} />
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
