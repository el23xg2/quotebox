"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { formatDate } from "@/lib/utils";
import { ArrowLeft, Send, Receipt, Printer } from "lucide-react";
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
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

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

  function startEditing() {
    if (!contract) return;
    setEditTitle(contract.title);
    setEditContent(contract.content);
    setEditing(true);
  }

  async function handleSaveEdit() {
    if (!contract) return;
    if (!editTitle.trim()) { alert("Title is required."); return; }

    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase
      .from("contracts")
      .update({ title: editTitle, content: editContent })
      .eq("id", contract.id);

    if (error) { alert("Failed to save: " + error.message); return; }

    setContract({ ...contract, title: editTitle, content: editContent });
    setEditing(false);
  }

  async function handleSend() {
    if (!contract) return;
    setSending(true);

    try {
      const res = await fetch(`/api/contracts/${contract.id}/send`, { method: "POST" });
      const data = await res.json();

      if (!res.ok) {
        alert(`发送失败: ${data.error || "未知错误"}`);
        setSending(false);
        return;
      }

      alert("合同已成功发送给客户签名！");
      setContract({ ...contract, status: "sent" });
    } catch (err) {
      alert("发送失败: 网络错误");
      console.error(err);
    }
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
        <div className="flex gap-2 no-print">
          <Button variant="outline" onClick={() => window.print()} className="gap-1">
            <Printer className="h-4 w-4" /> PDF
          </Button>
          {contract.status === "draft" && (
            <>
              {editing ? (
                <Button onClick={handleSaveEdit}>Save</Button>
              ) : (
                <Button variant="outline" onClick={startEditing}>Edit</Button>
              )}
              <Button onClick={handleSend} disabled={sending} className="gap-1">
                <Send className="h-4 w-4" /> {sending ? "Sending..." : "Send for Signature"}
              </Button>
            </>
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
          {editing ? (
            <div className="space-y-4">
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-lg font-semibold focus:border-blue-500 focus:outline-none"
              />
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                rows={20}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-mono focus:border-blue-500 focus:outline-none"
              />
            </div>
          ) : (
            <pre className="whitespace-pre-wrap font-sans text-sm text-gray-700">
              {contract.content}
            </pre>
          )}
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
    </div>
  );
}
