"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { generateQuoteNumber, formatCurrency } from "@/lib/utils";
import { Plus, Trash2 } from "lucide-react";
import Link from "next/link";

interface Client {
  id: string;
  name: string;
}

interface LineItem {
  description: string;
  quantity: number;
  unit_price: number;
}

function NewQuoteForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedClientId = searchParams.get("client_id");

  const [clients, setClients] = useState<Client[]>([]);
  const [clientId, setClientId] = useState(preselectedClientId || "");
  const [items, setItems] = useState<LineItem[]>([
    { description: "", quantity: 1, unit_price: 0 },
  ]);
  const [taxRate, setTaxRate] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [quoteId, setQuoteId] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    loadClients();
  }, []);

  async function loadClients() {
    const supabase = createSupabaseBrowserClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("clients")
      .select("id, name")
      .eq("user_id", user.id)
      .order("name");

    if (data) setClients(data);
  }

  const subtotal = items.reduce(
    (sum, item) => sum + item.quantity * item.unit_price,
    0
  );
  const taxAmount = Math.round(subtotal * (taxRate / 100));
  const discountAmount = Math.round(subtotal * (discount / 100));
  const total = Math.round(subtotal + taxAmount - discountAmount);

  function addItem() {
    setItems([...items, { description: "", quantity: 1, unit_price: 0 }]);
  }

  function removeItem(index: number) {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  }

  function updateItem(index: number, field: keyof LineItem, value: string | number) {
    const newItems = [...items];
    (newItems[index] as any)[field] = value;
    setItems(newItems);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!clientId) {
      setError("Please select a client.");
      return;
    }
    if (items.some((i) => !i.description.trim())) {
      setError("All line items need a description.");
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

    const quoteNumber = generateQuoteNumber();

    const { data: quote, error: quoteError } = await supabase
      .from("quotes")
      .insert({
        user_id: user.id,
        client_id: clientId,
        quote_number: quoteNumber,
        status: "draft",
        subtotal: subtotal,
        tax_rate: taxRate,
        discount: discountAmount,
        total: total,
      })
      .select()
      .single();

    if (quoteError) {
      setError(quoteError.message);
      setLoading(false);
      return;
    }

    // Insert line items
    const { error: itemsError } = await supabase.from("quote_items").insert(
      items.map((item) => ({
        quote_id: quote.id,
        description: item.description,
        quantity: item.quantity,
        unit_price: item.unit_price,
        amount: Math.round(item.quantity * item.unit_price),
      }))
    );

    if (itemsError) {
      setError(itemsError.message);
      setLoading(false);
      return;
    }

    setQuoteId(quote.id);
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
        <h2 className="mt-4 text-xl font-semibold text-gray-900">
          Quote created!
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Your quote has been created. You can now preview and send it to your client.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link href={`/dashboard/quotes/${quoteId}`}>
            <Button>View Quote</Button>
          </Link>
          <Link href="/dashboard/quotes">
            <Button variant="outline">All Quotes</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">New Quote</h1>
        <p className="mt-1 text-sm text-gray-500">
          Create a professional quote for your client.
        </p>
      </div>

      <form onSubmit={handleSave}>
        <Card className="mb-6">
          <CardHeader>
            <h2 className="font-semibold text-gray-900">Client</h2>
          </CardHeader>
          <CardContent>
            {clients.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-sm text-gray-500 mb-3">No clients yet.</p>
                <Link href="/dashboard/clients/new">
                  <Button type="button" variant="outline" size="sm">
                    Add a client first
                  </Button>
                </Link>
              </div>
            ) : (
              <select
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                required
              >
                <option value="">Select a client...</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            )}
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader className="flex flex-row items-center justify-between">
            <h2 className="font-semibold text-gray-900">Line Items</h2>
            <Button type="button" variant="ghost" size="sm" onClick={addItem} className="gap-1">
              <Plus className="h-4 w-4" /> Add Item
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {items.map((item, index) => (
                <div key={index} className="flex gap-3 items-start">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Service description"
                      value={item.description}
                      onChange={(e) => updateItem(index, "description", e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                      required
                    />
                  </div>
                  <div className="w-20">
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateItem(index, "quantity", parseInt(e.target.value) || 0)}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                      required
                    />
                  </div>
                  <div className="w-28">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      value={item.unit_price / 100 || ""}
                      onChange={(e) => updateItem(index, "unit_price", Math.round(parseFloat(e.target.value || "0") * 100))}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                      required
                    />
                  </div>
                  <div className="w-24 pt-2 text-right text-sm text-gray-700">
                    {formatCurrency(item.quantity * item.unit_price)}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="pt-2 text-gray-400 hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <h2 className="font-semibold text-gray-900">Summary</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tax Rate (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={taxRate}
                    onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Discount (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={discount}
                    onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="border-t pt-3 space-y-1">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                {taxRate > 0 && (
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Tax ({taxRate}%)</span>
                    <span>{formatCurrency(taxAmount)}</span>
                  </div>
                )}
                {discount > 0 && (
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Discount ({discount}%)</span>
                    <span>-{formatCurrency(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between font-semibold text-gray-900 pt-1 border-t">
                  <span>Total</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {error && (
          <p className="mb-4 text-sm text-red-600">{error}</p>
        )}

        <div className="flex gap-3">
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save Quote"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}

export default function NewQuotePage() {
  return (
    <Suspense fallback={<div className="max-w-3xl"><p className="text-sm text-gray-500">Loading...</p></div>}>
      <NewQuoteForm />
    </Suspense>
  );
}
