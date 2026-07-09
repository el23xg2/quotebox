"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { formatCurrency } from "@/lib/utils";

declare global {
  interface Window {
    Stripe: any;
  }
}

export default function PublicInvoicePage() {
  const params = useParams();
  const [invoice, setInvoice] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    loadInvoice();
  }, [params.id]);

  async function loadInvoice() {
    const supabase = createSupabaseBrowserClient();
    const { data } = await supabase
      .from("invoices")
      .select("*, clients(name, email, company), invoice_items(*)")
      .eq("id", params.id)
      .single();

    if (data) setInvoice(data);
    setLoading(false);
  }

  async function handlePay() {
    if (!invoice) return;
    setPaying(true);
    try {
      const res = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invoiceId: invoice.id }),
      });
      const { url } = await res.json();
      if (url) window.location.href = url;
    } catch (err) {
      alert("Payment failed. Please try again.");
    }
    setPaying(false);
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center"><p className="text-gray-500">Loading...</p></div>;
  if (!invoice) return <div className="min-h-screen flex items-center justify-center"><p className="text-red-500">Invoice not found.</p></div>;

  const isPaid = invoice.status === "paid";
  const dueDate = new Date(invoice.due_date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="mx-auto max-w-3xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
              <span className="text-sm font-bold text-white">Q</span>
            </div>
            <span className="text-lg font-semibold text-gray-900">QuoteBox</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Invoice</h1>
          <p className="text-gray-500">#{invoice.invoice_number}</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-10 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start mb-6 sm:mb-10 gap-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">{invoice.clients?.name || "Client"}</h2>
              <p className="text-sm text-gray-500">{invoice.clients?.email}</p>
            </div>
            <div className="sm:text-right">
              <p className="text-sm text-gray-500">Due Date</p>
              <p className="font-medium">{dueDate}</p>
            </div>
          </div>

          <div className="overflow-x-auto -mx-6 sm:-mx-10">
            <table className="w-full mb-10 min-w-[500px] px-6 sm:px-10">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-3 text-sm font-semibold text-gray-700">Description</th>
                <th className="text-right py-3 text-sm font-semibold text-gray-700">Qty</th>
                <th className="text-right py-3 text-sm font-semibold text-gray-700">Price</th>
                <th className="text-right py-3 text-sm font-semibold text-gray-700">Amount</th>
              </tr>
            </thead>
            <tbody>
              {invoice.invoice_items.map((item: any) => (
                <tr key={item.id} className="border-b border-gray-100">
                  <td className="py-4 text-sm text-gray-900">{item.description}</td>
                  <td className="py-4 text-sm text-right text-gray-700">{item.quantity}</td>
                  <td className="py-4 text-sm text-right text-gray-700">
                    {formatCurrency(item.unit_price)}
                  </td>
                  <td className="py-4 text-sm text-right font-medium">
                    {formatCurrency(item.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>

          <div className="flex justify-end">
            <div className="w-72">
              <div className="flex justify-between font-bold text-lg text-gray-900 pt-2 border-t-2 border-gray-200">
                <span>Total Due</span>
                <span>{formatCurrency(invoice.total)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          {isPaid ? (
            <div className="bg-white rounded-2xl border border-green-200 shadow-sm p-8">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 mb-4">
                <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900">Payment Received</h2>
              <p className="text-gray-500 mt-2">Thank you! This invoice has been paid.</p>
            </div>
          ) : invoice.status === "sent" ? (
            <button
              onClick={handlePay}
              disabled={paying}
              className="rounded-lg bg-blue-600 px-12 py-3 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {paying ? "Redirecting to payment..." : `Pay ${formatCurrency(invoice.total)}`}
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
