import { useState } from "react";
import { ShoppingBag, X, Plus, Minus, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCartContext } from "@/components/CartProvider";
import CheckoutForm from "@/components/CheckoutForm";

const formatPrice = (paise: number) =>
  `₹${(paise / 100).toLocaleString("en-IN")}`;

const CartDrawer = () => {
  const [open, setOpen] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const { items, removeItem, updateQuantity, totalAmount, itemCount, clearCart } = useCartContext();

  return (
    <>
      {/* Cart trigger button */}
      <button
        onClick={() => { setOpen(true); setShowCheckout(false); }}
        className="relative p-2 text-foreground hover:text-gold transition-colors duration-300"
        aria-label="Open cart"
      >
        <ShoppingBag className="w-5 h-5" />
        {itemCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-gold text-primary-foreground text-[10px] font-sans font-semibold flex items-center justify-center rounded-full">
            {itemCount}
          </span>
        )}
      </button>

      {/* Backdrop */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* Drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 bottom-0 z-[70] w-full max-w-md bg-background border-l border-border flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="font-display text-2xl text-gold tracking-wider">
                {showCheckout ? "Checkout" : "Your Cart"}
              </h2>
              <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {showCheckout ? (
              <CheckoutForm onBack={() => setShowCheckout(false)} onSuccess={() => setOpen(false)} />
            ) : (
              <>
                {/* Items */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {items.length === 0 ? (
                    <div className="text-center py-16">
                      <ShoppingBag className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" />
                      <p className="text-muted-foreground font-sans text-sm">Your cart is empty</p>
                      <p className="text-muted-foreground/60 font-sans text-xs mt-1">Explore our sacred collection</p>
                    </div>
                  ) : (
                    items.map((item) => (
                      <div key={item.productId} className="flex gap-4 border border-border p-3">
                        <img src={item.image} alt={item.productName} className="w-20 h-20 object-cover" />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-display text-sm text-foreground truncate">{item.productName}</h3>
                          <p className="text-gold font-display text-lg">{formatPrice(item.price)}</p>
                          <div className="flex items-center gap-3 mt-2">
                            <button onClick={() => updateQuantity(item.productId, item.quantity - 1)} className="text-muted-foreground hover:text-foreground">
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="text-xs font-sans text-foreground w-4 text-center">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.productId, item.quantity + 1)} className="text-muted-foreground hover:text-foreground">
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => removeItem(item.productId)} className="ml-auto text-muted-foreground hover:text-destructive">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Footer */}
                {items.length > 0 && (
                  <div className="border-t border-border p-6 space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="font-sans text-sm text-muted-foreground uppercase tracking-wider">Total</span>
                      <span className="font-display text-2xl text-gold">{formatPrice(totalAmount)}</span>
                    </div>
                    <button
                      onClick={() => setShowCheckout(true)}
                      className="w-full py-4 border border-primary/40 text-primary text-sm tracking-[0.25em] uppercase font-sans hover:bg-primary hover:text-primary-foreground transition-all duration-500"
                    >
                      Proceed to Checkout
                    </button>
                    <button
                      onClick={clearCart}
                      className="w-full py-2 text-xs text-muted-foreground hover:text-destructive transition-colors font-sans tracking-wider uppercase"
                    >
                      Clear Cart
                    </button>
                  </div>
                )}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CartDrawer;
