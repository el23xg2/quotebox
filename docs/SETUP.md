# QuoteBox Setup Guide

## 1. Supabase Setup

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Once created, go to Project Settings > API to find:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public key` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role key` → `SUPABASE_SERVICE_ROLE_KEY`
3. Go to SQL Editor and paste the contents of `supabase-migration.sql`
4. Run the SQL to create all tables and RLS policies

## 2. Creem Setup

1. Go to [creem.io](https://www.creem.io) and create an account
2. Go to Developers > API & Webhooks
   - `API Key` → `CREEM_API_KEY`
   - `Webhook Secret` → `CREEM_WEBHOOK_SECRET`
3. Create products in Commerce > Products:

   | Product       | Type         | Price  | Billing Period |
   |---------------|--------------|--------|----------------|
   | Pro Monthly   | Subscription | $9 USD | Monthly        |
   | Pro Yearly    | Subscription | $99 USD| Yearly         |
   | Lifetime      | Single Payment | $249 USD | —           |
   | Invoice Payment (optional) | Single Payment | $0.01+ | — |

4. Copy product IDs to `.env.local`:
   - `NEXT_PUBLIC_CREEM_PRO_MONTHLY_ID=prod_xxx`
   - `NEXT_PUBLIC_CREEM_PRO_YEARLY_ID=prod_xxx`
   - `NEXT_PUBLIC_CREEM_LIFETIME_ID=prod_xxx`
   - `CREEM_INVOICE_PRODUCT_ID=prod_xxx` (optional, for one-time invoice payments)

5. Set up webhook in Developers > API & Webhooks:
   - URL: `https://your-domain.com/api/creem/webhook`
   - Events to subscribe: **All events** (checkout.completed, subscription.active, subscription.canceled, subscription.paid, refund.created, etc.)

6. **Important for invoice payments**: Creem doesn't support dynamic pricing per checkout. To accept invoice payments:
   - Create a separate product in Creem (e.g., "Invoice Payment") with a minimum price
   - Set `CREEM_INVOICE_PRODUCT_ID` in your environment
   - The actual invoice amount will be tracked via webhook metadata

## 3. Environment Variables

Copy `.env.local.example` to `.env.local` and fill in all values.

Required variables:
- `NEXT_PUBLIC_SUPABASE_URL` — Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase anon key
- `SUPABASE_SERVICE_ROLE_KEY` — Supabase service role key
- `CREEM_API_KEY` — Creem API key (starts with `creem_`)
- `CREEM_WEBHOOK_SECRET` — Creem webhook secret (starts with `whsec_`)
- `NEXT_PUBLIC_CREEM_PRO_MONTHLY_ID` — Creem product ID for Pro Monthly
- `NEXT_PUBLIC_CREEM_PRO_YEARLY_ID` — Creem product ID for Pro Yearly
- `NEXT_PUBLIC_CREEM_LIFETIME_ID` — Creem product ID for Lifetime
- `NEXT_PUBLIC_APP_URL` — Your app URL (e.g., `http://localhost:3000`)

## 4. Database Migration (Stripe → Creem)

If you previously used Stripe, run this SQL to rename columns:

```sql
ALTER TABLE subscriptions RENAME COLUMN stripe_customer_id TO creem_customer_id;
ALTER TABLE subscriptions RENAME COLUMN stripe_subscription_id TO creem_subscription_id;
DROP INDEX IF EXISTS idx_subscriptions_stripe_customer_id;
```

This is already included in `supabase-migration.sql` and will run automatically if the old columns exist.

## 5. Run

```bash
npm install
npm run dev
```

## 6. Auth Setup (Supabase)

1. In Supabase Dashboard > Authentication > Settings
2. Enable "Email Auth" > "Magic Link"  
3. Configure Site URL to `http://localhost:3000` (for dev)
4. Add redirect URLs: `http://localhost:3000/auth/callback`

## 7. Creem vs Stripe — What Changed

| Area | Before (Stripe) | After (Creem) |
|------|----------------|---------------|
| API routes | `/api/stripe/*` | `/api/creem/*` |
| Checkout | Stripe Checkout Sessions | Creem hosted checkout |
| Webhooks | Stripe webhook verification | `@creem_io/nextjs` Webhook handler |
| Pricing page | Stripe price IDs | Creem product IDs |
| DB columns | `stripe_customer_id`, `stripe_subscription_id` | `creem_customer_id`, `creem_subscription_id` |
| Tax compliance | You handle it | Creem handles (MoR) |
