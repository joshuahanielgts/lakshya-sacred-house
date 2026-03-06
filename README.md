# Lakshya —Sacred Artifacts

Curated house of sacred artifacts. Rare temple pieces, bronze sculptures, and devotional heirlooms for the discerning collector.

## Tech Stack

- **Frontend:** React, TypeScript, Vite, Tailwind CSS, shadcn/ui, Framer Motion
- **Database:** [Convex](https://convex.dev) (real-time backend)
- **Payments:** [Razorpay](https://razorpay.com)

## Getting Started

```sh
# 1. Clone the repo
git clone <YOUR_GIT_URL>
cd lakshya-sacred-house

# 2. Install dependencies
npm install

# 3. Set up environment variables
# Copy .env.local and fill in your keys:
#   VITE_CONVEX_URL       — your Convex deployment URL
#   VITE_RAZORPAY_KEY_ID  — your Razorpay public key

# 4. Start Convex dev server (in a separate terminal)
npx convex dev

# 5. Seed initial products (run once)
# From the Convex dashboard or via:
npx convex run products:seed

# 6. Set Razorpay server-side keys in Convex environment
npx convex env set RAZORPAY_KEY_ID your_key_id
npx convex env set RAZORPAY_KEY_SECRET your_key_secret

# 7. Start the dev server
npm run dev
```

## Project Structure

```
src/
  components/      — UI components (Navbar, Cart, Checkout, etc.)
  hooks/           — Custom hooks (useCart, useMobile, etc.)
  lib/             — Utilities (Razorpay SDK loader, cn helper)
  pages/           — Route pages (Index, NotFound)
  assets/          — Product images
convex/
  schema.ts        — Database schema (products, orders, inquiries)
  products.ts      — Product queries & seed mutation
  orders.ts        — Order mutations & queries
  inquiries.ts     — Inquiry mutations
  payments.ts      — Razorpay order creation & payment verification (Node action)
```

## Environment Variables

| Variable | Where | Description |
|---|---|---|
| `VITE_CONVEX_URL` | `.env.local` | Convex deployment URL |
| `VITE_RAZORPAY_KEY_ID` | `.env.local` | Razorpay public/key ID |
| `RAZORPAY_KEY_ID` | Convex env | Razorpay key ID (server-side) |
| `RAZORPAY_KEY_SECRET` | Convex env | Razorpay secret (server-side) |

## Deployment

Build the frontend with `npm run build` and deploy the `dist/` folder to any static host (Vercel, Netlify, etc.). Convex handles the backend automatically via `npx convex deploy`.
