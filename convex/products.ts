import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("products").withIndex("by_sortOrder").collect();
  },
});

export const featured = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("products")
      .withIndex("by_featured")
      .filter((q) => q.eq(q.field("featured"), true))
      .collect();
  },
});

export const getById = query({
  args: { id: v.id("products") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const byCategory = query({
  args: { category: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("products")
      .withIndex("by_category", (q) => q.eq("category", args.category))
      .collect();
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    price: v.number(),
    image: v.string(),
    category: v.string(),
    inStock: v.boolean(),
    featured: v.boolean(),
    sortOrder: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("products", args);
  },
});

export const seed = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("products").first();
    if (existing) return "Products already exist, skipping seed.";

    const products = [
      { name: "Nataraja in Cosmic Dance", description: "Chola-era bronze, 18th century reproduction", price: 8500000, image: "/assets/product-1.jpg", category: "bronze", inStock: true, featured: true, sortOrder: 1 },
      { name: "Temple Diya — Eternal Flame", description: "Ornate brass oil lamp with sacred motifs", price: 2400000, image: "/assets/product-2.jpg", category: "brass", inStock: true, featured: true, sortOrder: 2 },
      { name: "Sandalwood Ganesha", description: "Hand-carved Mysore sandalwood, 12 inches", price: 4500000, image: "/assets/product-3.jpg", category: "wood", inStock: true, featured: true, sortOrder: 3 },
      { name: "Ceremonial Puja Thali", description: "Antique copper with temple engravings", price: 1800000, image: "/assets/product-4.jpg", category: "copper", inStock: true, featured: false, sortOrder: 4 },
      { name: "Sacred Stone Stele", description: "Ancient carved stone on brass pedestal", price: 12000000, image: "/assets/product-5.jpg", category: "stone", inStock: true, featured: true, sortOrder: 5 },
      { name: "Saraswati with Veena", description: "Museum-grade bronze, lost-wax casting", price: 9500000, image: "/assets/product-6.jpg", category: "bronze", inStock: true, featured: true, sortOrder: 6 },
      { name: "Temple Kumkum Casket", description: "Silver-plated with mythological relief", price: 5500000, image: "/assets/product-7.jpg", category: "silver", inStock: true, featured: false, sortOrder: 7 },
      { name: "Mandir Ghanta — Temple Bell", description: "Consecrated brass bell with sacred chain", price: 3200000, image: "/assets/product-8.jpg", category: "brass", inStock: true, featured: false, sortOrder: 8 },
    ];

    for (const product of products) {
      await ctx.db.insert("products", product);
    }

    return "Seeded 8 products.";
  },
});
