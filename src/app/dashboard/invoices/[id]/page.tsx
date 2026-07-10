"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { formatCurrency, formatDate } from "@/lib/utils";
import { ArrowLeft, Send, CreditCard } from "lucide-react";

interface InvoiceDetail {
  id: string;
  invoice_number: string;
  status: string;
  total: number;
  paid_amount: number;
  due_date: string;
  created_at: string;
  clients: { id: string; name: string; email: string } | null;
  invoice_items: { id: string; description: string; quantity: number; unit_price: number; amount: number }[];
}

export default function InvoiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [invoice, setInvoice] = useState<InvoiceDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    loadInvoice();
  }, [params.id]);

  async function loadInvoice() {
    const supabase = createSupabaseBrowserClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("invoices")
      .select("*, clients(id, name, email), invoice_items(*)")
      .eq("id", params.id)
      .single();

    if (data) setInvoice(data);
    setLoading(false);
  }

  async function handleSend() {
    if (!invoice) return;
    setSending(true);

    try {
      const res = await fetch(`/api/invoices/${invoice.id}/send`, { method: "POST" });
      const data = await res.json();

      if (!res.ok) {
        alert(`发送失败: ${data.error || "未知错误"}`);
        setSending(false);
        return;
      }

      alert("发票已成功发送给客户！");
      setInvoice({ ...invoice, status: "sent" });
    } catch (err) {
      alert("发送失败: 网络错误");
      console.error(err);
    }
    setSending(false);
  }

  if (loading) return <p className="text-sm text-gray-500">Loading...</p>;
  if (!invoice) return <p>Invoice not found</p>;

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
            <h1 className="text-2xl font-bold text-gray-900">{invoice.invoice_number}</h1>
            <Badge status={invoice.status} />
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Created {formatDate(invoice.created_at)} &middot; Due {formatDate(invoice.due_date)}
            {invoice.clients?.name && ` — ${invoice.clients.name}`}
          </p>
        </div>
        <div className="flex gap-2">
          {invoice.status === "draft" && (
            <Button onClick={handleSend} disabled={sending} className="gap-1">
              <Send className="h-4 w-4" /> {sending ? "Sending..." : "Send to Client"}
            </Button>
          )}
          {(invoice.status === "sent" || invoice.status === "partial") && (
            <Button disabled className="gap-1" variant="outline">
              <CreditCard className="h-4 w-4" /> Awaiting Payment
            </Button>
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <h2 className="font-semibold text-gray-900">Invoice Preview</h2>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg p-8">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h3 className="text-xl font-bold text-gray-900">INVOICE</h3>
                <p className="text-sm text-gray-500 mt-1">#{invoice.invoice_number}</p>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-900">{invoice.clients?.name || "Client"}</p>
                <p className="text-sm text-gray-500">{invoice.clients?.email}</p>
              </div>
            </div>

            <table className="w-full mb-8">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 text-sm font-medium text-gray-500">Description</th>
                  <th className="text-right py-3 text-sm font-medium text-gray-500">Qty</th>
                  <th className="text-right py-3 text-sm font-medium text-gray-500">Price</th>
                  <th className="text-right py-3 text-sm font-medium text-gray-500">Amount</th>
                </tr>
              </thead>
              <tbody>
                {invoice.invoice_items.map((item) => (
                  <tr key={item.id} className="border-b border-gray-100">
                    <td className="py-3 text-sm text-gray-900">{item.description}</td>
                    <td className="py-3 text-sm text-right text-gray-700">{item.quantity}</td>
                    <td className="py-3 text-sm text-right text-gray-700">{formatCurrency(item.unit_price)}</td>
                    <td className="py-3 text-sm text-right font-medium">{formatCurrency(item.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-end">
              <div className="w-64 space-y-2">
                <div className="flex justify-between font-semibold text-gray-900 pt-2 border-t">
                  <span>Total</span>
                  <span>{formatCurrency(invoice.total)}</span>
                </div>
                {invoice.status === "partial" && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Paid</span>
                    <span>{formatCurrency(invoice.paid_amount)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
