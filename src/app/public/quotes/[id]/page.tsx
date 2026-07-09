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
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="mx-auto max-w-3xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
              <span className="text-sm font-bold text-white">Q</span>
            </div>
            <span className="text-lg font-semibold text-gray-900">QuoteBox</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Quote</h1>
          <p className="text-gray-500">#{quote.quote_number}</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-10">
          <div className="flex flex-col sm:flex-row justify-between items-start mb-6 sm:mb-10 gap-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {quote.clients?.name || "Client"}
              </h2>
              <p className="text-sm text-gray-500">{quote.clients?.email}</p>
              {quote.clients?.company && (
                <p className="text-sm text-gray-500">{quote.clients.company}</p>
              )}
            </div>
            <div className="sm:text-right">
              <p className="text-sm text-gray-500">Date</p>
              <p className="font-medium">
                {new Date(quote.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
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
              {quote.quote_items.map((item: any) => (
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
            <div className="w-72 space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              {quote.tax_rate > 0 && (
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Tax ({quote.tax_rate}%)</span>
                  <span>{formatCurrency(taxAmount)}</span>
                </div>
              )}
              {discountAmount > 0 && (
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Discount</span>
                  <span>-{formatCurrency(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-lg text-gray-900 pt-2 border-t-2 border-gray-200">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          {quote.status === "sent" ? (
            <form
              action={`/api/quotes/${quote.id}/accept`}
              method="POST"
            >
              <button
                type="submit"
                className="rounded-lg bg-blue-600 px-8 py-3 text-sm font-medium text-white hover:bg-blue-700"
              >
                Accept Quote
              </button>
            </form>
          ) : quote.status === "accepted" ? (
            <p className="text-green-600 font-medium">This quote has been accepted.</p>
          ) : quote.status === "rejected" ? (
            <p className="text-red-600 font-medium">This quote has been declined.</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
