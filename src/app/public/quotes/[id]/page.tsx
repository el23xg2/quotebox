import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { formatCurrency } from "@/lib/utils";

async function getQuote(id: string) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
  if (!supabaseUrl.startsWith("http")) return null;

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      get: async (name: string) => {
        const cookieStore = await cookies();
        return cookieStore.get(name)?.value;
      },
      set: async () => {},
      remove: async () => {},
    },
  });

  const { data } = await supabase
    .from("quotes")
    .select("*, clients(name, email, company, phone), quote_items(*)")
    .eq("id", id)
    .single();

  return data;
}

export default async function PublicQuotePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const quote = await getQuote(id);

  if (!quote) notFound();

  const subtotal = quote.subtotal;
  const taxAmount = Math.round(subtotal * (quote.tax_rate / 100));
  const discountAmount = quote.discount;
  const total = quote.total;

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

        {/* Quote header */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Ribbon */}
          <div className="bg-gray-50 border-b border-gray-200 px-6 sm:px-10 py-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div>
                <h1 className="text-xl font-bold text-gray-900">QUOTE</h1>
                <p className="text-sm text-gray-500 font-mono">#{quote.quote_number}</p>
              </div>
              <div className="text-left sm:text-right">
                <p className="text-xs text-gray-400 uppercase tracking-wide">Date Issued</p>
                <p className="font-medium text-gray-900">
                  {new Date(quote.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-10">
            {/* Bill to / From */}
            <div className="grid sm:grid-cols-2 gap-8 mb-10">
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Bill To</p>
                <h2 className="text-lg font-bold text-gray-900">
                  {quote.clients?.name || "Client"}
                </h2>
                {quote.clients?.company && (
                  <p className="text-sm text-gray-700">{quote.clients.company}</p>
                )}
                <p className="text-sm text-gray-500">{quote.clients?.email}</p>
                {quote.clients?.phone && (
                  <p className="text-sm text-gray-500">{quote.clients.phone}</p>
                )}
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
                  {quote.quote_items.map((item: any) => (
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

            {/* Totals */}
            <div className="flex justify-end mt-8">
              <div className="w-full sm:w-72 space-y-2">
                <div className="flex justify-between text-sm text-gray-600 py-1">
                  <span>Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                {quote.tax_rate > 0 && (
                  <div className="flex justify-between text-sm text-gray-600 py-1">
                    <span>Tax ({quote.tax_rate}%)</span>
                    <span>{formatCurrency(taxAmount)}</span>
                  </div>
                )}
                {discountAmount > 0 && (
                  <div className="flex justify-between text-sm text-gray-600 py-1">
                    <span>Discount</span>
                    <span className="text-red-500">-{formatCurrency(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-base text-gray-900 pt-3 border-t-2 border-gray-300 mt-2">
                  <span>Total Due</span>
                  <span className="text-lg">{formatCurrency(total)}</span>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="mt-10 pt-6 border-t border-gray-200">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Notes & Terms</p>
              <p className="text-sm text-gray-500 leading-relaxed">
                Payment is due within 30 days. Please include the quote number with your payment.
                This quote is valid for 30 days from the date issued.
              </p>
            </div>
          </div>
        </div>

        {/* Action */}
        <div className="mt-8 text-center">
          {quote.status === "sent" ? (
            <form action={`/api/quotes/${quote.id}/accept`} method="POST">
              <button
                type="submit"
                className="rounded-xl bg-blue-600 px-10 py-4 text-base font-semibold text-white hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all"
              >
                Accept Quote
              </button>
              <p className="mt-2 text-xs text-gray-400">
                By clicking Accept, you agree to the terms outlined above.
              </p>
            </form>
          ) : quote.status === "accepted" ? (
            <div className="inline-flex items-center gap-2 rounded-xl bg-green-50 border border-green-200 px-6 py-3">
              <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              <span className="text-green-700 font-medium">This quote has been accepted</span>
            </div>
          ) : quote.status === "rejected" ? (
            <div className="inline-flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 px-6 py-3">
              <span className="text-red-700 font-medium">This quote has been declined</span>
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
