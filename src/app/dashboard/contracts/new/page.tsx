"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";

interface Client {
  id: string;
  name: string;
}

interface Quote {
  id: string;
  quote_number: string;
  total: number;
  client_id?: string;
  clients?: any;
}

const DEFAULT_TERMS = `SCOPE OF SERVICES
The service provider agrees to perform the services described in the accompanying quote or as outlined in this agreement.

PAYMENT TERMS
Payment is due within 30 days of the invoice date. Late payments may incur a 1.5% monthly fee.

TERMINATION
Either party may terminate this agreement with 14 days written notice.

LIMITATION OF LIABILITY
The service provider's total liability shall not exceed the total amount paid under this agreement.

GOVERNING LAW
This agreement shall be governed by the laws of the State of [State].`;

function NewContractForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedQuoteId = searchParams.get("quote_id");
  const preselectedClientId = searchParams.get("client_id");

  const [clients, setClients] = useState<Client[]>([]);
  const [quoteData, setQuoteData] = useState<Quote | null>(null);
  const [clientId, setClientId] = useState(preselectedClientId || "");
  const [title, setTitle] = useState("Service Agreement");
  const [content, setContent] = useState(DEFAULT_TERMS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [contractId, setContractId] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const supabase = createSupabaseBrowserClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: clientsData } = await supabase
      .from("clients")
      .select("id, name")
      .eq("user_id", user.id);

    if (clientsData) setClients(clientsData);

    if (preselectedQuoteId) {
      const { data } = await supabase
        .from("quotes")
        .select("id, quote_number, total, clients(name)")
        .eq("id", preselectedQuoteId)
        .single();

      if (data) {
        setQuoteData(data);
        setTitle(`Service Agreement - ${data.quote_number}`);
        setContent(`SCOPE OF SERVICES\nThe service provider agrees to perform the services described in Quote #${data.quote_number} for a total of ${formatCurrency(data.total)}.\n\n${DEFAULT_TERMS}`);
      }
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!clientId && !quoteData) {
      setError("Please select a client.");
      return;
    }
    if (!title.trim()) {
      setError("Title is required.");
      return;
    }

    setLoading(true);
    setError("");

    // Check usage limit for free users
    const limitRes = await fetch("/api/check-limit?type=document");
    const limitData = await limitRes.json();
    if (!limitData.allowed) {
      setError(`${limitData.reason} Please upgrade to Pro to create more documents.`);
      setLoading(false);
      return;
    }

    const supabase = createSupabaseBrowserClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const targetClientId = clientId || (quoteData as any)?.client_id;
    const targetQuoteId = preselectedQuoteId || null;

    const { data: contract, error: insertError } = await supabase
      .from("contracts")
      .insert({
        user_id: user.id,
        client_id: targetClientId,
        quote_id: targetQuoteId,
        title,
        content,
        status: "draft",
      })
      .select()
      .single();

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
      return;
    }

    setContractId(contract.id);
    setSuccess(true);
    setLoading(false);
  }

  if (success) {
    return (
      <div className="max-w-lg mx-auto text-center py-12">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
          <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <h2 className="mt-4 text-xl font-semibold text-gray-900">Contract created!</h2>
        <p className="mt-2 text-sm text-gray-600">Send it to your client for e-signature.</p>
        <div className="mt-8 flex justify-center gap-3">
          <Link href={`/dashboard/contracts/${contractId}`}>
            <Button>View Contract</Button>
          </Link>
          <Link href="/dashboard/contracts">
            <Button variant="outline">All Contracts</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">New Contract</h1>
        <p className="mt-1 text-sm text-gray-500">Create a contract for your client to sign.</p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="mb-6">
          <CardHeader><h2 className="font-semibold text-gray-900">Details</h2></CardHeader>
          <CardContent className="space-y-4">
            <Input
              id="title"
              label="Contract title *"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            {!quoteData && (
              <select
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                required
              >
                <option value="">Select a client...</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            )}
            {quoteData && (
              <p className="text-sm text-gray-600">
                Based on Quote #{quoteData.quote_number} — {formatCurrency(quoteData.total)}
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader><h2 className="font-semibold text-gray-900">Terms & Conditions</h2></CardHeader>
          <CardContent>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={15}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-mono focus:border-blue-500 focus:outline-none"
              required
            />
          </CardContent>
        </Card>

        {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

        <div className="flex gap-3">
          <Button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Contract"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}

export default function NewContractPage() {
  return (
    <Suspense fallback={<div className="max-w-3xl"><p className="text-sm text-gray-500">Loading...</p></div>}>
      <NewContractForm />
    </Suspense>
  );
}
