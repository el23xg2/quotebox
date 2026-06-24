"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { formatDate } from "@/lib/utils";
import { ArrowLeft, Send, Receipt } from "lucide-react";
import Link from "next/link";

interface ContractDetail {
  id: string;
  title: string;
  content: string;
  status: string;
  signed_at: string | null;
  created_at: string;
  clients: { id: string; name: string; email: string } | null;
  quote_id: string | null;
}

export default function ContractDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [contract, setContract] = useState<ContractDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    loadContract();
  }, [params.id]);

  async function loadContract() {
    const supabase = createSupabaseBrowserClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("contracts")
      .select("*, clients(id, name, email)")
      .eq("id", params.id)
      .single();

    if (data) setContract(data);
    setLoading(false);
  }

  async function handleSend() {
    if (!contract) return;
    setSending(true);

    await fetch(`/api/contracts/${contract.id}/send`, { method: "POST" });

    setContract({ ...contract, status: "sent" });
    setSending(false);
  }

  if (loading) return <p className="text-sm text-gray-500">Loading...</p>;
  if (!contract) return <p>Contract not found</p>;

  return (
    <div className="max-w-3xl">
      <button
        onClick={() => router.back()}
        className="mb-6 flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900"
      >
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      <div className="mb-8 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">{contract.title}</h1>
            <Badge status={contract.status} />
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Created {formatDate(contract.created_at)}
            {contract.clients?.name && ` — for ${contract.clients.name}`}
          </p>
        </div>
        <div className="flex gap-2">
          {contract.status === "draft" && (
            <Button onClick={handleSend} disabled={sending} className="gap-1">
              <Send className="h-4 w-4" /> {sending ? "Sending..." : "Send for Signature"}
            </Button>
          )}
          {contract.status === "signed" && (
            <Link href={`/dashboard/invoices/new?contract_id=${contract.id}`}>
              <Button variant="outline" className="gap-1">
                <Receipt className="h-4 w-4" /> Create Invoice
              </Button>
            </Link>
          )}
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <h2 className="font-semibold text-gray-900">Contract Terms</h2>
        </CardHeader>
        <CardContent>
          <pre className="whitespace-pre-wrap font-sans text-sm text-gray-700">
            {contract.content}
          </pre>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Signature</h2>
            {contract.status === "signed" && contract.signed_at && (
              <p className="text-sm text-green-600">
                Signed on {formatDate(contract.signed_at)}
              </p>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {contract.status === "signed" ? (
            <div className="flex items-center gap-2 text-green-600">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              <span>Signed by {contract.clients?.name || "Client"}</span>
            </div>
          ) : contract.status === "sent" ? (
            <p className="text-sm text-gray-500">Waiting for client to sign...</p>
          ) : (
            <p className="text-sm text-gray-500">
              Send the contract to your client for e-signature.
            </p>
          )}
        </CardContent>
      </Card>

      {contract.status === "draft" && (
        <div className="mt-6">
          <p className="text-sm text-gray-500 mb-2">
            Client signature link:{" "}
            <a
              href={`${window.location.origin}/public/contracts/${contract.id}`}
              target="_blank"
              className="text-blue-600 hover:underline"
            >
              {`${window.location.origin}/public/contracts/${contract.id}`}
            </a>
          </p>
        </div>
      )}
    </div>
  );
}
