"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { formatCurrency, formatDate } from "@/lib/utils";
import { ArrowLeft, Send, FileSignature } from "lucide-react";
import Link from "next/link";

interface QuoteDetail {
  id: string;
  quote_number: string;
  status: string;
  subtotal: number;
  tax_rate: number;
  discount: number;
  total: number;
  created_at: string;
  sent_at: string | null;
  clients: { id: string; name: string; email: string } | null;
  quote_items: { id: string; description: string; quantity: number; unit_price: number; amount: number }[];
}

export default function QuoteDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [quote, setQuote] = useState<QuoteDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    loadQuote();
  }, [params.id]);

  async function loadQuote() {
    const supabase = createSupabaseBrowserClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("quotes")
      .select("*, clients(id, name, email), quote_items(*)")
      .eq("id", params.id)
      .single();

    if (data) setQuote(data);
    setLoading(false);
  }

  async function handleSend() {
    if (!quote) return;
    setSending(true);

    await fetch(`/api/quotes/${quote.id}/send`, { method: "POST" });

    setQuote({ ...quote, status: "sent", sent_at: new Date().toISOString() });
    setSending(false);
  }

  if (loading) return <p className="text-sm text-gray-500">Loading...</p>;
  if (!quote) return <p>Quote not found</p>;

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
            <h1 className="text-2xl font-bold text-gray-900">
              {quote.quote_number}
            </h1>
            <Badge status={quote.status} />
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Created {formatDate(quote.created_at)}
            {quote.clients?.name && ` — for ${quote.clients.name}`}
          </p>
        </div>
        <div className="flex gap-2">
          {quote.status === "draft" && (
            <Button onClick={handleSend} disabled={sending} className="gap-1">
              <Send className="h-4 w-4" /> {sending ? "Sending..." : "Send to Client"}
            </Button>
          )}
          {quote.status === "draft" && (
            <Link href={`/dashboard/contracts/new?quote_id=${quote.id}`}>
              <Button variant="outline" className="gap-1">
                <FileSignature className="h-4 w-4" /> Create Contract
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Public link */}
      <Card className="mb-6">
        <CardContent className="py-3">
          <p className="text-sm text-gray-500">
            Client view link:{" "}
            <a
              href={`${window.location.origin}/public/quotes/${quote.id}`}
              target="_blank"
              className="text-blue-600 hover:underline"
            >
              {`${window.location.origin}/public/quotes/${quote.id}`}
            </a>
          </p>
        </CardContent>
      </Card>

      {/* Quote preview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Quote Preview</h2>
          </div>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg p-8">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h3 className="text-xl font-bold text-gray-900">QUOTE</h3>
                <p className="text-sm text-gray-500 mt-1">
                  #{quote.quote_number}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-900">
                  {quote.clients?.name || "Client"}
                </p>
                <p className="text-sm text-gray-500">
                  {quote.clients?.email}
                </p>
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
                {quote.quote_items.map((item) => (
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
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span>{formatCurrency(quote.subtotal)}</span>
                </div>
                {quote.tax_rate > 0 && (
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Tax ({quote.tax_rate}%)</span>
                    <span>{formatCurrency(Math.round(quote.subtotal * (quote.tax_rate / 100)))}</span>
                  </div>
                )}
                {quote.discount > 0 && (
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Discount</span>
                    <span>-{formatCurrency(quote.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between font-semibold text-gray-900 pt-2 border-t">
                  <span>Total</span>
                  <span>{formatCurrency(quote.total)}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
