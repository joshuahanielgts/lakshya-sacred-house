import { supabase } from "./supabase";
import type { OrderItem, Product } from "./database.types";

const demoProducts: Product[] = [
  { id: "1", name: "Sacred Rudraksha Mala", description: "108-bead prayer mala, hand-knotted with Nepalese Rudraksha", price: 1499900, image: "/assets/product-1.jpg", category: "malas", in_stock: true, featured: true, sort_order: 1, created_at: "", updated_at: "" },
  { id: "2", name: "Temple Gold Bangle", description: "22K gold-plated bangle inspired by ancient temple motifs", price: 3999900, image: "/assets/product-2.jpg", category: "jewelry", in_stock: true, featured: true, sort_order: 2, created_at: "", updated_at: "" },
  { id: "3", name: "Kashmiri Pashmina Shawl", description: "Hand-embroidered pure pashmina with paisley work", price: 8999900, image: "/assets/product-3.jpg", category: "textiles", in_stock: true, featured: true, sort_order: 3, created_at: "", updated_at: "" },
  { id: "4", name: "Brass Diya Set", description: "Hand-cast brass oil lamps with intricate filigree", price: 749900, image: "/assets/product-4.jpg", category: "decor", in_stock: true, featured: false, sort_order: 4, created_at: "", updated_at: "" },
  { id: "5", name: "Sandalwood Idol", description: "Mysore sandalwood Ganesh, hand-carved by master artisan", price: 12999900, image: "/assets/product-5.jpg", category: "idols", in_stock: true, featured: true, sort_order: 5, created_at: "", updated_at: "" },
  { id: "6", name: "Copper Puja Thali", description: "Handcrafted copper plate set for daily worship", price: 349900, image: "/assets/product-6.jpg", category: "puja", in_stock: true, featured: false, sort_order: 6, created_at: "", updated_at: "" },
  { id: "7", name: "Pearl Kundan Necklace", description: "Rajasthani kundan set with freshwater pearls", price: 5999900, image: "/assets/product-7.jpg", category: "jewelry", in_stock: true, featured: true, sort_order: 7, created_at: "", updated_at: "" },
  { id: "8", name: "Silk Pooja Mat", description: "Handwoven Banarasi silk mat with zari border", price: 249900, image: "/assets/product-8.jpg", category: "textiles", in_stock: true, featured: false, sort_order: 8, created_at: "", updated_at: "" },
];

// ─── Products ──────────────────────────────────────────────

export async function fetchProducts(): Promise<Product[]> {
  if (!supabase) return demoProducts;

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    console.warn("Failed to fetch products, using demo data:", error.message);
    return demoProducts;
  }
  return data as Product[];
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
