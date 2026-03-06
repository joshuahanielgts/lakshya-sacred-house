import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  products: defineTable({
    name: v.string(),
    description: v.string(),
    price: v.number(), // price in paise (INR smallest unit)
    image: v.string(), // storage ID or URL
    category: v.string(),
    inStock: v.boolean(),
    featured: v.boolean(),
    sortOrder: v.number(),
  })
    .index("by_category", ["category"])
    .index("by_featured", ["featured"])
    .index("by_sortOrder", ["sortOrder"]),

  orders: defineTable({
    customerName: v.string(),
    customerPhone: v.string(),
    customerWhatsapp: v.optional(v.string()),
    customerEmail: v.optional(v.string()),
    items: v.array(
      v.object({
        productId: v.id("products"),
        productName: v.string(),
        price: v.number(),
        quantity: v.number(),
      })
    ),
    totalAmount: v.number(), // in paise
    status: v.union(
      v.literal("pending"),
      v.literal("payment_initiated"),
      v.literal("paid"),
      v.literal("shipped"),
      v.literal("delivered"),
      v.literal("cancelled")
    ),
    razorpayOrderId: v.optional(v.string()),
    razorpayPaymentId: v.optional(v.string()),
    razorpaySignature: v.optional(v.string()),
    notes: v.optional(v.string()),
  })
    .index("by_status", ["status"])
    .index("by_razorpayOrderId", ["razorpayOrderId"]),

  inquiries: defineTable({
    name: v.string(),
    phone: v.string(),
    whatsapp: v.optional(v.string()),
    interest: v.optional(v.string()),
    status: v.union(v.literal("new"), v.literal("contacted"), v.literal("closed")),
  }).index("by_status", ["status"]),
});
