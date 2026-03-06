import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useCartContext } from "@/components/CartProvider";
import { toast } from "sonner";

interface CheckoutFormProps {
  onBack: () => void;
  onSuccess: () => void;
}

const CheckoutForm = ({ onBack, onSuccess }: CheckoutFormProps) => {
  const { checkout, isProcessing, totalAmount, items } = useCartContext();
  const [form, setForm] = useState({ name: "", phone: "", email: "", whatsapp: "" });

  const formatPrice = (paise: number) => `₹${(paise / 100).toLocaleString("en-IN")}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) {
      toast.error("Please fill in your name and phone number.");
      return;
    }
    await checkout({
      name: form.name,
      phone: form.phone,
      email: form.email || undefined,
      whatsapp: form.whatsapp || undefined,
    });
    onSuccess();
  };

  const inputClass =
    "w-full bg-transparent border-b border-border py-3 text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none transition-colors duration-300 font-sans text-sm";

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 overflow-y-auto p-6">
        <button onClick={onBack} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6 font-sans text-xs uppercase tracking-wider">
          <ArrowLeft className="w-4 h-4" />
          Back to cart
        </button>

        {/* Order summary */}
        <div className="mb-8 space-y-2">
          <h3 className="font-display text-lg text-foreground mb-3">Order Summary</h3>
          {items.map((item) => (
            <div key={item.productId} className="flex justify-between text-sm font-sans">
              <span className="text-muted-foreground">
                {item.productName} × {item.quantity}
              </span>
              <span className="text-foreground">{formatPrice(item.price * item.quantity)}</span>
            </div>
          ))}
          <div className="border-t border-border pt-2 mt-3 flex justify-between">
            <span className="text-sm font-sans text-muted-foreground uppercase tracking-wider">Total</span>
            <span className="font-display text-xl text-gold">{formatPrice(totalAmount)}</span>
          </div>
        </div>

        {/* Customer form */}
        <form id="checkout-form" onSubmit={handleSubmit} className="space-y-6">
          <input
            type="text"
            placeholder="Your Name *"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className={inputClass}
            required
            maxLength={100}
          />
          <input
            type="tel"
            placeholder="Phone Number *"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className={inputClass}
            required
            maxLength={15}
          />
          <input
            type="email"
            placeholder="Email (for receipt)"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className={inputClass}
            maxLength={200}
          />
          <input
            type="text"
            placeholder="WhatsApp Number (if different)"
            value={form.whatsapp}
            onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
            className={inputClass}
            maxLength={15}
          />
        </form>
      </div>

      {/* Pay button */}
      <div className="border-t border-border p-6">
        <button
          type="submit"
          form="checkout-form"
          disabled={isProcessing}
          className="w-full py-4 border border-primary/40 text-primary text-sm tracking-[0.25em] uppercase font-sans hover:bg-primary hover:text-primary-foreground transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? "Processing…" : `Pay ${formatPrice(totalAmount)}`}
        </button>
      </div>
    </div>
  );
};

export default CheckoutForm;
