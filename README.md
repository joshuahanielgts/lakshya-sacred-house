# Lakshya — Sacred Artifacts

Curated house of sacred artifacts. Rare temple pieces, bronze sculptures, and devotional heirlooms for the discerning collector.

## Tech Stack

- **Frontend:** React, TypeScript, Vite, Tailwind CSS, shadcn/ui, Framer Motion
- **Database:** [Supabase](https://supabase.com) (PostgreSQL + Edge Functions)
- **Payments:** [Razorpay](https://razorpay.com)

## Getting Started

```sh
# 1. Clone the repo
git clone <YOUR_GIT_URL>
cd lakshya-sacred-house

# 2. Install dependencies
npm install

# 3. Create a Supabase project
# Go to https://supabase.com and create a new project.
# Run the SQL in supabase/schema.sql in the SQL Editor to create tables and seed data.

# 4. Set up environment variables
# Copy .env.example to .env.local and fill in your keys:
#   VITE_SUPABASE_URL      — your Supabase project URL
#   VITE_SUPABASE_ANON_KEY — your Supabase anon/public key
#   VITE_RAZORPAY_KEY_ID   — your Razorpay public key

# 5. Deploy Supabase Edge Functions (for Razorpay integration)
supabase functions deploy create-razorpay-order
supabase functions deploy verify-payment

# 6. Set Razorpay server-side keys as Supabase secrets
supabase secrets set RAZORPAY_KEY_ID=your_key_id
supabase secrets set RAZORPAY_KEY_SECRET=your_key_secret

# 7. Start the dev server
npm run dev
```

## Project Structure

```
src/
  components/      — UI components (Navbar, Cart, Checkout, etc.)
  hooks/           — Custom hooks (useCart, useMobile, etc.)
  lib/
    supabase.ts    — Supabase client initialization
    database.types.ts — TypeScript types for all tables
    db.ts          — Database helper functions (queries, mutations)
    razorpay.ts    — Razorpay SDK loader
    utils.ts       — General utilities
  pages/           — Route pages (Index, NotFound)
  assets/          — Product images
supabase/
  schema.sql       — PostgreSQL schema (products, orders, inquiries) + seed data
  functions/
    create-razorpay-order/ — Edge Function: creates Razorpay orders
    verify-payment/        — Edge Function: verifies payment signatures
```

## Environment Variables

| Variable | Where | Description |
|---|---|---|
| `VITE_SUPABASE_URL` | `.env.local` | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | `.env.local` | Supabase anon/public key |
| `VITE_RAZORPAY_KEY_ID` | `.env.local` | Razorpay public key ID |
| `RAZORPAY_KEY_ID` | Supabase secrets | Razorpay key ID (server-side) |
| `RAZORPAY_KEY_SECRET` | Supabase secrets | Razorpay secret (server-side) |

## Deployment

Build the frontend with `npm run build` and deploy the `dist/` folder to any static host (Vercel, Netlify, etc.). Supabase handles the backend (database + Edge Functions) automatically.
