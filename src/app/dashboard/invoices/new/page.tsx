"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { generateInvoiceNumber, formatCurrency } from "@/lib/utils";
import { Plus, Trash2 } from "lucide-react";
import Link from "next/link";

interface Client {
  id: string;
  name: string;
}

interface Contract {
  id: string;
  title: string;
}

interface LineItem {
  description: string;
  quantity: number;
  unit_price: number;
}

function NewInvoiceForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedClientId = searchParams.get("client_id");
  const preselectedContractId = searchParams.get("contract_id");

  const [clients, setClients] = useState<Client[]>([]);
  const [contractData, setContractData] = useState<Contract | null>(null);
  const [clientId, setClientId] = useState(preselectedClientId || "");
  const [items, setItems] = useState<LineItem[]>([
    { description: "", quantity: 1, unit_price: 0 },
  ]);
  const [dueDate, setDueDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().split("T")[0];
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [invoiceId, setInvoiceId] = useState("");

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

    if (preselectedContractId) {
      const { data } = await supabase
        .from("contracts")
        .select("id, title")
        .eq("id", preselectedContractId)
        .single();
      if (data) setContractData(data);
    }
  }

  const subtotal = items.reduce(
    (sum, item) => sum + item.quantity * item.unit_price,
    0
  );
  const total = Math.round(subtotal);

  function addItem() {
    setItems([...items, { description: "", quantity: 1, unit_price: 0 }]);
  }

  function removeItem(index: number) {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  }

  function updateItem(index: number, field: keyof LineItem, value: string | number) {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  }

  async function handleSubmit(e: React.FormEvent) {
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

    const invoiceNumber = generateInvoiceNumber();

    const { data: invoice, error: invError } = await supabase
      .from("invoices")
      .insert({
        user_id: user.id,
        client_id: clientId,
        contract_id: preselectedContractId || null,
        invoice_number: invoiceNumber,
        status: "draft",
        total: total,
        paid_amount: 0,
        due_date: new Date(dueDate).toISOString(),
      })
      .select()
      .single();

    if (invError) {
      setError(invError.message);
      setLoading(false);
      return;
    }

    if (!invoice) {
      setError("Failed to create invoice. Please try again.");
      setLoading(false);
      return;
    }

    const { error: itemsError } = await supabase.from("invoice_items").insert(
      items.map((item) => ({
        invoice_id: invoice.id,
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

    setInvoiceId(invoice.id);
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
        <h2 className="mt-4 text-xl font-semibold text-gray-900">Invoice created!</h2>
        <p className="mt-2 text-sm text-gray-600">Send it to your client for payment.</p>
        <div className="mt-8 flex justify-center gap-3">
          <Link href={`/dashboard/invoices/${invoiceId}`}>
            <Button>View Invoice</Button>
          </Link>
          <Link href="/dashboard/invoices">
            <Button variant="outline">All Invoices</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">New Invoice</h1>
        <p className="mt-1 text-sm text-gray-500">Create and send an invoice to your client.</p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="mb-6">
          <CardHeader><h2 className="font-semibold text-gray-900">Details</h2></CardHeader>
          <CardContent className="space-y-4">
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
            <Input
              id="dueDate"
              label="Due date"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
            />
            {contractData && (
              <p className="text-sm text-gray-500">Based on: {contractData.title}</p>
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
                      placeholder="Description"
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
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-sm text-gray-400">$</span>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={(item.unit_price / 100) || ""}
                        onChange={(e) => updateItem(index, "unit_price", Math.round(parseFloat(e.target.value || "0") * 100))}
                        className="w-full rounded-lg border border-gray-300 pl-7 pr-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                        required
                      />
                    </div>
                  </div>
                  <div className="w-24 pt-2 text-right text-sm text-gray-700">
                    {formatCurrency(item.quantity * item.unit_price)}
                  </div>
                  <button type="button" onClick={() => removeItem(index)} className="pt-2 text-gray-400 hover:text-red-500">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardContent className="py-4">
            <div className="flex justify-end">
              <div className="w-64">
                <div className="flex justify-between font-semibold text-gray-900">
                  <span>Total</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

        <div className="flex gap-3">
          <Button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Invoice"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}

export default function NewInvoicePage() {
  return (
    <Suspense fallback={<div className="max-w-3xl"><p className="text-sm text-gray-500">Loading...</p></div>}>
      <NewInvoiceForm />
    </Suspense>
  );
}
