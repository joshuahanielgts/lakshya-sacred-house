-- ============================================================
-- Lakshya Sacred House — Supabase Schema
-- Run this file in the Supabase SQL Editor (https://supabase.com/dashboard → SQL Editor)
-- Safe to re-run: uses DROP IF EXISTS to reset cleanly.
-- ============================================================

-- 0. Cleanup (safe on fresh DB)
-- CASCADE drops dependent triggers automatically.
-- ============================================================
drop table if exists public.inquiries cascade;
drop table if exists public.orders    cascade;
drop table if exists public.products  cascade;
drop function if exists public.handle_updated_at();

-- 1. Extensions
-- ============================================================
create extension if not exists "uuid-ossp";

-- ============================================================
-- 2. PRODUCTS
-- ============================================================
create table public.products (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  description text not null,
  price       bigint not null,               -- price in paise (INR smallest unit)
  image       text not null,                  -- storage path or URL
  category    text not null,
  in_stock    boolean not null default true,
  featured    boolean not null default false,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index idx_products_category   on public.products (category);
create index idx_products_featured   on public.products (featured) where featured = true;
create index idx_products_sort_order on public.products (sort_order);

-- ============================================================
-- 3. ORDERS
-- ============================================================
create table public.orders (
  id                    uuid primary key default uuid_generate_v4(),
  customer_name         text not null,
  customer_phone        text not null,
  customer_whatsapp     text,
  customer_email        text,
  items                 jsonb not null default '[]'::jsonb,
  -- items schema: [{ "product_id": uuid, "product_name": text, "price": bigint, "quantity": int }]
  total_amount          bigint not null,     -- in paise
  status                text not null default 'pending'
                        check (status in ('pending','payment_initiated','paid','shipped','delivered','cancelled')),
  razorpay_order_id     text,
  razorpay_payment_id   text,
  razorpay_signature    text,
  notes                 text,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

create index idx_orders_status             on public.orders (status);
create index idx_orders_razorpay_order_id  on public.orders (razorpay_order_id) where razorpay_order_id is not null;

-- ============================================================
-- 4. INQUIRIES
-- ============================================================
create table public.inquiries (
  id         uuid primary key default uuid_generate_v4(),
  name       text not null,
  phone      text not null,
  whatsapp   text,
  interest   text,
  status     text not null default 'new'
             check (status in ('new','contacted','closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_inquiries_status on public.inquiries (status);

-- ============================================================
-- 5. Auto-update updated_at trigger
-- ============================================================
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_products_updated_at
  before update on public.products
  for each row execute function public.handle_updated_at();

create trigger set_orders_updated_at
  before update on public.orders
  for each row execute function public.handle_updated_at();

create trigger set_inquiries_updated_at
  before update on public.inquiries
  for each row execute function public.handle_updated_at();

-- ============================================================
-- 6. Row Level Security (RLS)
-- ============================================================

-- PRODUCTS — public read, no public write
alter table public.products enable row level security;

create policy "Products are publicly readable"
  on public.products for select
  using (true);

-- ORDERS — anonymous inserts, reads, and updates (for checkout/payment flow)
alter table public.orders enable row level security;

create policy "Anyone can create orders"
  on public.orders for insert
  with check (true);

create policy "Anyone can read their own order by id"
  on public.orders for select
  using (true);

create policy "Anyone can update orders (for payment flow)"
  on public.orders for update
  using (true);

-- INQUIRIES — anonymous inserts only
alter table public.inquiries enable row level security;

create policy "Anyone can create inquiries"
  on public.inquiries for insert
  with check (true);

-- ============================================================
-- 7. SEED DATA — 8 curated products
-- ============================================================
insert into public.products (name, description, price, image, category, in_stock, featured, sort_order) values
  ('Nataraja in Cosmic Dance',      'Chola-era bronze, 18th century reproduction',     8500000,  '/assets/product-1.jpg', 'bronze', true,  true,  1),
  ('Temple Diya — Eternal Flame',   'Ornate brass oil lamp with sacred motifs',        2400000,  '/assets/product-2.jpg', 'brass',  true,  true,  2),
  ('Sandalwood Ganesha',            'Hand-carved Mysore sandalwood, 12 inches',        4500000,  '/assets/product-3.jpg', 'wood',   true,  true,  3),
  ('Ceremonial Puja Thali',         'Antique copper with temple engravings',           1800000,  '/assets/product-4.jpg', 'copper', true,  false, 4),
  ('Sacred Stone Stele',            'Ancient carved stone on brass pedestal',           12000000, '/assets/product-5.jpg', 'stone',  true,  true,  5),
  ('Saraswati with Veena',          'Museum-grade bronze, lost-wax casting',           9500000,  '/assets/product-6.jpg', 'bronze', true,  true,  6),
  ('Temple Kumkum Casket',          'Silver-plated with mythological relief',          5500000,  '/assets/product-7.jpg', 'silver', true,  false, 7),
  ('Mandir Ghanta — Temple Bell',   'Consecrated brass bell with sacred chain',        3200000,  '/assets/product-8.jpg', 'brass',  true,  false, 8);

-- ============================================================
-- Done! Next steps:
--
-- 1. Deploy Edge Functions:
--    supabase functions deploy create-razorpay-order
--    supabase functions deploy verify-payment
--
-- 2. Set Edge Function secrets:
--    supabase secrets set RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
--    supabase secrets set RAZORPAY_KEY_SECRET=your-secret-here
--
-- 3. Set client env vars in .env:
--    VITE_SUPABASE_URL=https://your-project.supabase.co
--    VITE_SUPABASE_ANON_KEY=your-anon-key
--    VITE_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
-- ============================================================
