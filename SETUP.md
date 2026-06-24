# QuoteBox Setup Guide

## 1. Supabase Setup

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Once created, go to Project Settings > API to find:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public key` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role key` → `SUPABASE_SERVICE_ROLE_KEY`
3. Go to SQL Editor and paste the contents of `supabase-migration.sql`
4. Run the SQL to create all tables and RLS policies

## 2. Stripe Setup

1. Go to [stripe.com](https://stripe.com) and create an account
2. Go to Developers > API keys
   - `Publishable key` → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - `Secret key` → `STRIPE_SECRET_KEY`
3. Go to Developers > Webhooks > Add endpoint
   - URL: `https://your-domain.com/api/stripe/webhook`
   - Events: `checkout.session.completed`
   - Get the signing secret → `STRIPE_WEBHOOK_SECRET`

## 3. Environment Variables

Copy `.env.local.example` to `.env.local` and fill in all values.

## 4. Run

```bash
npm run dev
```

## 5. Auth Setup (Supabase)

1. In Supabase Dashboard > Authentication > Settings
2. Enable "Email Auth" > "Magic Link"  
3. Configure Site URL to `http://localhost:3000` (for dev)
4. Add redirect URLs: `http://localhost:3000/auth/callback`
