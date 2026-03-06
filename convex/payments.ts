"use node";

import { action } from "./_generated/server";
import { v } from "convex/values";
import Razorpay from "razorpay";

const getRazorpay = () => {
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;

  if (!key_id || !key_secret) {
    throw new Error("Razorpay credentials not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in your Convex environment.");
  }

  return new Razorpay({ key_id, key_secret });
};

export const createRazorpayOrder = action({
  args: {
    amount: v.number(), // amount in paise
    currency: v.optional(v.string()),
    receipt: v.string(),
    notes: v.optional(v.any()),
  },
  handler: async (_ctx, args) => {
    const razorpay = getRazorpay();

    const order = await razorpay.orders.create({
      amount: args.amount,
      currency: args.currency ?? "INR",
      receipt: args.receipt,
      notes: args.notes ?? {},
    });

    return {
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      status: order.status,
    };
  },
});

export const verifyPayment = action({
  args: {
    razorpayOrderId: v.string(),
    razorpayPaymentId: v.string(),
    razorpaySignature: v.string(),
  },
  handler: async (_ctx, args) => {
    const crypto = await import("crypto");
    const key_secret = process.env.RAZORPAY_KEY_SECRET;

    if (!key_secret) {
      throw new Error("RAZORPAY_KEY_SECRET not set.");
    }

    const body = args.razorpayOrderId + "|" + args.razorpayPaymentId;
    const expectedSignature = crypto
      .createHmac("sha256", key_secret)
      .update(body)
      .digest("hex");

    const isValid = expectedSignature === args.razorpaySignature;

    return { verified: isValid };
  },
});
