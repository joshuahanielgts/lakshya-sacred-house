import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { useCartContext } from "@/components/CartProvider";
import { fetchProducts } from "@/lib/db";
import type { Product } from "@/lib/database.types";

// Static image imports as fallbacks for local dev / seed images
import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";
import product4 from "@/assets/product-4.jpg";
import product5 from "@/assets/product-5.jpg";
import product6 from "@/assets/product-6.jpg";
import product7 from "@/assets/product-7.jpg";
import product8 from "@/assets/product-8.jpg";

const localImages: Record<string, string> = {
  "/assets/product-1.jpg": product1,
  "/assets/product-2.jpg": product2,
  "/assets/product-3.jpg": product3,
  "/assets/product-4.jpg": product4,
  "/assets/product-5.jpg": product5,
  "/assets/product-6.jpg": product6,
  "/assets/product-7.jpg": product7,
  "/assets/product-8.jpg": product8,
};

const resolveImage = (img: string) => localImages[img] ?? img;

const formatPrice = (paise: number) =>
  `₹${(paise / 100).toLocaleString("en-IN")}`;

const ProductCard = ({ product, index }: { product: Product; index: number }) => {
  const { addItem } = useCartContext();
  const isHighTicket = product.price > 5000000; // ₹50,000+
  const whatsappMsg = encodeURIComponent(`Hi, I'm interested in "${product.name}" (${formatPrice(product.price)}) from Lakshya.`);
  const cardRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group"
    >
      <div className="relative overflow-hidden bg-card border border-transparent hover:border-primary/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_60px_-15px_hsl(43_52%_54%_/_0.15)]">
        <div className="aspect-[4/5] overflow-hidden">
          <motion.img
            style={{ y: imageY }}
            src={resolveImage(product.image)}
            alt={product.name}
            className="w-full h-[115%] object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
        </div>
        <div className="p-6">
          <h3 className="font-display text-lg text-foreground mb-1">{product.name}</h3>
          <p className="text-sm text-muted-foreground mb-3 font-sans">{product.description}</p>
          <p className="font-display text-xl text-gold">{formatPrice(product.price)}</p>

          {/* Reveal on hover */}
          <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            {isHighTicket ? (
              <a
                href={`https://wa.me/919999999999?text=${whatsappMsg}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center py-3 border border-primary/40 text-primary text-xs tracking-[0.2em] uppercase font-sans hover:bg-primary hover:text-primary-foreground transition-all duration-300"
              >
                Inquire on WhatsApp
              </a>
            ) : (
              <button
                onClick={() =>
                  addItem({
                    productId: product.id,
                    productName: product.name,
                    price: product.price,
                    image: resolveImage(product.image),
                  })
                }
                disabled={!product.in_stock}
                className="w-full py-3 border border-primary/40 text-primary text-xs tracking-[0.2em] uppercase font-sans hover:bg-primary hover:text-primary-foreground transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {product.in_stock ? "Add to Cart" : "Sold Out"}
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const CollectionSection = () => {
  const [products, setProducts] = useState<Product[] | undefined>(undefined);

  useEffect(() => {
    fetchProducts().then(setProducts).catch(console.error);
  }, []);

  return (
    <section id="collection" className="py-24 px-6 bg-background">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-4xl sm:text-5xl text-gold-gradient tracking-[0.15em] uppercase font-light">
            The Collection
          </h2>
          <p className="text-muted-foreground mt-4 text-sm tracking-[0.1em] uppercase font-sans">
            Each piece, handpicked. Each story, sacred.
          </p>
        </motion.div>

        {products === undefined ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[4/5] bg-card border border-border" />
                <div className="p-6 space-y-3">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                  <div className="h-5 bg-muted rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default CollectionSection;
