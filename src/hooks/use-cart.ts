import { useState, useCallback } from "react";
import {
  createOrder,
  updateOrderPaymentInitiated,
  markOrderPaid,
  createRazorpayOrder,
  verifyPayment,
} from "@/lib/db";
import { loadRazorpayScript, openRazorpayCheckout } from "@/lib/razorpay";
import { toast } from "sonner";

const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID ?? "";

export interface CartItem {
  productId: string;
  productName: string;
  price: number; // in paise
  quantity: number;
  image: string;
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const addItem = useCallback((item: Omit<CartItem, "quantity">) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === item.productId);
      if (existing) {
        return prev.map((i) =>
          i.productId === item.productId ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    toast.success(`${item.productName} added to cart`);
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((i) => i.productId !== productId));
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.productId === productId ? { ...i, quantity } : i))
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const totalAmount = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  const checkout = useCallback(
    async (customer: {
      name: string;
      phone: string;
      whatsapp?: string;
      email?: string;
    }) => {
      if (items.length === 0) {
        toast.error("Your cart is empty.");
        return;
      }
      if (!RAZORPAY_KEY_ID) {
        toast.error("Payment is not configured yet. Please set VITE_RAZORPAY_KEY_ID.");
        return;
      }

      setIsProcessing(true);
      try {
        // 1. Create order in Supabase
        const orderId = await createOrder({
          customerName: customer.name,
          customerPhone: customer.phone,
          customerWhatsapp: customer.whatsapp,
          customerEmail: customer.email,
          items: items.map((i) => ({
            product_id: i.productId,
            product_name: i.productName,
            price: i.price,
            quantity: i.quantity,
          })),
          totalAmount,
        });

        // 2. Create Razorpay order via Supabase Edge Function
        const razorpayOrder = await createRazorpayOrder({
          amount: totalAmount,
          currency: "INR",
          receipt: orderId,
        });

        // 3. Update order with Razorpay order ID
        await updateOrderPaymentInitiated(orderId, razorpayOrder.id);

        // 4. Load Razorpay and open checkout
        await loadRazorpayScript();

        openRazorpayCheckout({
          key: RAZORPAY_KEY_ID,
          amount: totalAmount,
          currency: "INR",
          name: "Lakshya — Sacred Artifacts",
          description: `Order of ${items.length} sacred piece(s)`,
          order_id: razorpayOrder.id,
          prefill: {
            name: customer.name,
            contact: customer.phone,
            email: customer.email,
          },
          theme: { color: "#b8993e" },
          handler: async (response) => {
            try {
              // Verify signature server-side before trusting the payment
              const { verified } = await verifyPayment({
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              });
              if (!verified) {
                toast.error("Payment verification failed. Please contact support.");
                return;
              }
              await markOrderPaid(
                orderId,
                response.razorpay_payment_id,
                response.razorpay_signature,
              );
              toast.success("Payment successful! Your sacred pieces are on their way.");
              clearCart();
            } catch {
              toast.error("Payment recorded but order update failed. Contact support.");
            }
          },
          modal: {
            ondismiss: () => {
              toast.info("Payment cancelled.");
            },
          },
        });
      } catch (error) {
        console.error("Checkout error:", error);
        toast.error("Something went wrong. Please try again.");
      } finally {
        setIsProcessing(false);
      }
    },
    [items, totalAmount, clearCart]
  );

  return {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    totalAmount,
    itemCount,
    checkout,
    isProcessing,
  };
}
