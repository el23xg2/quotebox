"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { formatCurrency } from "@/lib/utils";

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
      const res = await fetch("/api/creem/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invoiceId: invoice.id,
          metadata: { invoice_id: invoice.id },
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      alert(data.error || "Payment failed. Please try again.");
    } catch (err) {
      alert("Payment failed. Please try again.");
      console.error(err);
    }
    setPaying(false);
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center"><p className="text-gray-500">Loading...</p></div>;
  if (!invoice) return <div className="min-h-screen flex items-center justify-center"><p className="text-red-500">Invoice not found.</p></div>;

  const isPaid = invoice.status === "paid";
  const due_date = invoice.due_date;
  const dueDate = new Date(due_date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6">
      <div className="mx-auto max-w-4xl">
        {/* Company branding */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
              <span className="text-lg font-bold text-white">Q</span>
            </div>
            <div>
              <span className="text-xl font-bold text-gray-900">QuoteBox</span>
              <p className="text-xs text-gray-400">Quotes, Contracts & Invoices</p>
            </div>
          </div>
        </div>

        {/* Invoice header */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Ribbon */}
          <div className={`border-b border-gray-200 px-6 sm:px-10 py-4 ${isPaid ? 'bg-green-50' : 'bg-gray-50'}`}>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div>
                <h1 className="text-xl font-bold text-gray-900">INVOICE</h1>
                <p className="text-sm text-gray-500 font-mono">#{invoice.invoice_number}</p>
              </div>
              <div className="flex items-center gap-4">
                {isPaid ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    PAID
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
                    DUE
                  </span>
                )}
                <div className="text-left sm:text-right">
                  <p className="text-xs text-gray-400 uppercase tracking-wide">Due Date</p>
                  <p className={`font-semibold ${isPaid ? 'text-green-700' : 'text-gray-900'}`}>{dueDate}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-10">
            {/* Bill to */}
            <div className="grid sm:grid-cols-2 gap-8 mb-10">
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Bill To</p>
                <h2 className="text-lg font-bold text-gray-900">{invoice.clients?.name || "Client"}</h2>
                {invoice.clients?.company && (
                  <p className="text-sm text-gray-700">{invoice.clients.company}</p>
                )}
                <p className="text-sm text-gray-500">{invoice.clients?.email}</p>
              </div>
              <div className="sm:text-right">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">From</p>
                <p className="text-sm font-medium text-gray-900">QuoteBox</p>
                <p className="text-sm text-gray-500">support@quotebox.app</p>
              </div>
            </div>

            {/* Items table */}
            <div className="overflow-x-auto -mx-6 sm:-mx-10">
              <table className="w-full min-w-[500px]">
                <thead>
                  <tr className="border-b-2 border-gray-300">
                    <th className="text-left py-3 px-6 sm:px-10 text-xs font-semibold text-gray-500 uppercase tracking-wide">Description</th>
                    <th className="text-right py-3 px-6 sm:px-10 text-xs font-semibold text-gray-500 uppercase tracking-wide">Qty</th>
                    <th className="text-right py-3 px-6 sm:px-10 text-xs font-semibold text-gray-500 uppercase tracking-wide">Rate</th>
                    <th className="text-right py-3 px-6 sm:px-10 text-xs font-semibold text-gray-500 uppercase tracking-wide">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.invoice_items.map((item: any) => (
                    <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50/50">
                      <td className="py-4 px-6 sm:px-10 text-sm text-gray-900">{item.description}</td>
                      <td className="py-4 px-6 sm:px-10 text-sm text-right text-gray-700">{item.quantity}</td>
                      <td className="py-4 px-6 sm:px-10 text-sm text-right text-gray-700">{formatCurrency(item.unit_price)}</td>
                      <td className="py-4 px-6 sm:px-10 text-sm text-right font-medium text-gray-900">{formatCurrency(item.amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Total */}
            <div className="flex justify-end mt-8">
              <div className="w-full sm:w-72">
                <div className="flex justify-between font-bold text-lg text-gray-900 pt-3 border-t-2 border-gray-300">
                  <span>Total Due</span>
                  <span>{formatCurrency(invoice.total)}</span>
                </div>
              </div>
            </div>

            {/* Payment info */}
            <div className="mt-10 pt-6 border-t border-gray-200">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Payment Information</p>
              <p className="text-sm text-gray-500 leading-relaxed">
                Please pay the total amount above by the due date. We accept Visa, Mastercard, and American Express.
              </p>
            </div>
          </div>
        </div>

        {/* Pay button */}
        <div className="mt-8 text-center">
          {isPaid ? (
            <div className="inline-flex items-center gap-2 rounded-xl bg-green-50 border border-green-200 px-8 py-4">
              <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              <div className="text-left">
                <p className="font-semibold text-green-700">Payment Received</p>
                <p className="text-sm text-green-600">Thank you! This invoice has been paid.</p>
              </div>
            </div>
          ) : invoice.status === "sent" ? (
            <div>
              <button
                onClick={handlePay}
                disabled={paying}
                className="rounded-xl bg-blue-600 px-12 py-4 text-base font-semibold text-white hover:bg-blue-700 disabled:opacity-50 shadow-lg shadow-blue-200 transition-all"
              >
                {paying ? "Redirecting to payment..." : `Pay ${formatCurrency(invoice.total)}`}
              </button>
              <p className="mt-2 text-xs text-gray-400">
                Secure payment powered by Creem
              </p>
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-400">
            Powered by QuoteBox &middot; support@quotebox.app
          </p>
        </div>
      </div>
    </div>
  );
}
