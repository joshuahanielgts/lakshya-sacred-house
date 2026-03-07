import { supabase } from "./supabase";
import type { OrderItem } from "./database.types";

// ─── Products ──────────────────────────────────────────────

export async function fetchProducts() {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return data;
}

export async function fetchFeaturedProducts() {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("featured", true)
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return data;
}

export async function fetchProductsByCategory(category: string) {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("category", category)
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return data;
}

export async function fetchProductById(id: string) {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}

// ─── Orders ────────────────────────────────────────────────

export async function createOrder(order: {
  customerName: string;
  customerPhone: string;
  customerWhatsapp?: string;
  customerEmail?: string;
  items: OrderItem[];
  totalAmount: number;
  notes?: string;
}) {
  const { data, error } = await supabase
    .from("orders")
    .insert({
      customer_name: order.customerName,
      customer_phone: order.customerPhone,
      customer_whatsapp: order.customerWhatsapp ?? null,
      customer_email: order.customerEmail ?? null,
      items: order.items,
      total_amount: order.totalAmount,
      status: "pending",
      notes: order.notes ?? null,
    })
    .select("id")
    .single();

  if (error) throw error;
  return data.id;
}

export async function updateOrderPaymentInitiated(
  orderId: string,
  razorpayOrderId: string,
) {
  const { error } = await supabase
    .from("orders")
    .update({
      status: "payment_initiated",
      razorpay_order_id: razorpayOrderId,
    })
    .eq("id", orderId);

  if (error) throw error;
}

export async function markOrderPaid(
  orderId: string,
  razorpayPaymentId: string,
  razorpaySignature: string,
) {
  const { error } = await supabase
    .from("orders")
    .update({
      status: "paid",
      razorpay_payment_id: razorpayPaymentId,
      razorpay_signature: razorpaySignature,
    })
    .eq("id", orderId);

  if (error) throw error;
}

export async function fetchOrderById(id: string) {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}

// ─── Inquiries ─────────────────────────────────────────────

export async function createInquiry(inquiry: {
  name: string;
  phone: string;
  whatsapp?: string;
  interest?: string;
}) {
  const { data, error } = await supabase
    .from("inquiries")
    .insert({
      name: inquiry.name,
      phone: inquiry.phone,
      whatsapp: inquiry.whatsapp ?? null,
      interest: inquiry.interest ?? null,
      status: "new",
    })
    .select("id")
    .single();

  if (error) throw error;
  return data.id;
}

// ─── Razorpay (via Supabase Edge Function) ─────────────────

export async function createRazorpayOrder(params: {
  amount: number;
  currency?: string;
  receipt: string;
}) {
  const { data, error } = await supabase.functions.invoke(
    "create-razorpay-order",
    {
      body: {
        amount: params.amount,
        currency: params.currency ?? "INR",
        receipt: params.receipt,
      },
    },
  );

  if (error) throw error;
  return data as {
    id: string;
    amount: number;
    currency: string;
    status: string;
  };
}

export async function verifyPayment(params: {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}) {
  const { data, error } = await supabase.functions.invoke("verify-payment", {
    body: params,
  });

  if (error) throw error;
  return data as { verified: boolean };
}
