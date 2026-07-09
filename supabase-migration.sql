-- QuoteBox Database Schema
-- Run this in Supabase SQL Editor to set up your database

-- Clients
CREATE TABLE IF NOT EXISTS clients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_clients_user_id ON clients(user_id);

-- Subscriptions
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL UNIQUE,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  plan_id TEXT NOT NULL DEFAULT 'free',
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'past_due', 'canceled', 'incomplete', 'trialing')),
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_customer_id ON subscriptions(stripe_customer_id);

-- Quotes
CREATE TABLE IF NOT EXISTS quotes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  client_id UUID REFERENCES clients(id) NOT NULL,
  quote_number TEXT NOT NULL UNIQUE,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'viewed', 'accepted', 'rejected', 'expired')),
  subtotal INTEGER NOT NULL DEFAULT 0,
  tax_rate NUMERIC(5,2) DEFAULT 0,
  discount INTEGER DEFAULT 0,
  total INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  sent_at TIMESTAMPTZ,
  viewed_at TIMESTAMPTZ,
  accepted_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_quotes_user_id ON quotes(user_id);
CREATE INDEX IF NOT EXISTS idx_quotes_client_id ON quotes(client_id);

-- Quote Items
CREATE TABLE IF NOT EXISTS quote_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  quote_id UUID REFERENCES quotes(id) ON DELETE CASCADE NOT NULL,
  description TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price INTEGER NOT NULL DEFAULT 0,
  amount INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_quote_items_quote_id ON quote_items(quote_id);

-- Contracts
CREATE TABLE IF NOT EXISTS contracts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  client_id UUID REFERENCES clients(id) NOT NULL,
  quote_id UUID REFERENCES quotes(id),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'signed', 'expired')),
  signed_at TIMESTAMPTZ,
  pdf_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_contracts_user_id ON contracts(user_id);
CREATE INDEX IF NOT EXISTS idx_contracts_client_id ON contracts(client_id);

-- Contract Signatures
CREATE TABLE IF NOT EXISTS contract_signatures (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  contract_id UUID REFERENCES contracts(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('typed', 'drawn')),
  signature_data TEXT NOT NULL,
  signed_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_contract_signatures_contract_id ON contract_signatures(contract_id);

-- Invoices
CREATE TABLE IF NOT EXISTS invoices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  client_id UUID REFERENCES clients(id) NOT NULL,
  contract_id UUID REFERENCES contracts(id),
  invoice_number TEXT NOT NULL UNIQUE,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'partial', 'paid', 'overdue', 'cancelled')),
  total INTEGER NOT NULL DEFAULT 0,
  paid_amount INTEGER DEFAULT 0,
  due_date TIMESTAMPTZ NOT NULL,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_invoices_user_id ON invoices(user_id);
CREATE INDEX IF NOT EXISTS idx_invoices_client_id ON invoices(client_id);

-- Invoice Items
CREATE TABLE IF NOT EXISTS invoice_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  invoice_id UUID REFERENCES invoices(id) ON DELETE CASCADE NOT NULL,
  description TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price INTEGER NOT NULL DEFAULT 0,
  amount INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_invoice_items_invoice_id ON invoice_items(invoice_id);

-- Enable Row Level Security
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quote_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE contract_signatures ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only see their own data
CREATE POLICY IF NOT EXISTS "Users can manage their own clients"
  ON clients FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can manage their own subscriptions"
  ON subscriptions FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can manage their own quotes"
  ON quotes FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can manage their own quote items"
  ON quote_items FOR ALL USING (
    EXISTS (SELECT 1 FROM quotes WHERE quotes.id = quote_items.quote_id AND quotes.user_id = auth.uid())
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM quotes WHERE quotes.id = quote_items.quote_id AND quotes.user_id = auth.uid())
  );

CREATE POLICY IF NOT EXISTS "Users can manage their own contracts"
  ON contracts FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can manage their own contract signatures"
  ON contract_signatures FOR ALL USING (
    EXISTS (SELECT 1 FROM contracts WHERE contracts.id = contract_signatures.contract_id AND contracts.user_id = auth.uid())
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM contracts WHERE contracts.id = contract_signatures.contract_id AND contracts.user_id = auth.uid())
  );

CREATE POLICY IF NOT EXISTS "Users can manage their own invoices"
  ON invoices FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can manage their own invoice items"
  ON invoice_items FOR ALL USING (
    EXISTS (SELECT 1 FROM invoices WHERE invoices.id = invoice_items.invoice_id AND invoices.user_id = auth.uid())
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM invoices WHERE invoices.id = invoice_items.invoice_id AND invoices.user_id = auth.uid())
  );

-- Public access policies (for client-facing pages)
-- Allow public read access to quotes
CREATE POLICY IF NOT EXISTS "Public can view quotes"
  ON quotes FOR SELECT USING (status IN ('sent', 'accepted'));

-- Allow public read access to contracts
CREATE POLICY IF NOT EXISTS "Public can view contracts"
  ON contracts FOR SELECT USING (status IN ('sent', 'signed'));

-- Allow public read access to invoices
CREATE POLICY IF NOT EXISTS "Public can view invoices"
  ON invoices FOR SELECT USING (status IN ('sent', 'partial', 'paid'));

-- Allow public insert to contract signatures
CREATE POLICY IF NOT EXISTS "Anyone can add signatures"
  ON contract_signatures FOR INSERT WITH CHECK (true);

-- Allow public update to contract status (for signing)
CREATE POLICY IF NOT EXISTS "Anyone can update contract status to signed"
  ON contracts FOR UPDATE USING (true) WITH CHECK (true);

-- Allow public update to quote status (for accepting)
CREATE POLICY IF NOT EXISTS "Anyone can update quote status to accepted"
  ON quotes FOR UPDATE USING (true) WITH CHECK (true);

-- Function to ensure new users get a free subscription
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.subscriptions (user_id, plan_id, status)
  VALUES (NEW.id, 'free', 'active');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-create subscription on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
