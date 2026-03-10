import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { useCartContext } from "@/components/CartProvider";
import { useIsMobile } from "@/hooks/use-mobile";
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

const ProductCard = ({
  product,
  index,
  isMobile,
}: {
  product: Product;
  index: number;
  isMobile: boolean;
}) => {
  const { addItem } = useCartContext();
  const isHighTicket = product.price > 5000000; // ₹50,000+
  const whatsappMsg = encodeURIComponent(`Hi, I'm interested in "${product.name}" (${formatPrice(product.price)}) from Lakshya.`);
  const cardRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"],
  });
  // Disable parallax on mobile for smooth touch scrolling
  const imageY = useTransform(
    scrollYProgress,
    [0, 1],
    isMobile ? ["0%", "0%"] : ["-6%", "6%"],
  );

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.08 }}
      className="group"
    >
      <div className="relative overflow-hidden bg-card border border-transparent hover:border-primary/50 transition-[border-color,box-shadow] duration-500 sm:hover:-translate-y-2 sm:hover:shadow-[0_20px_60px_-15px_hsl(43_52%_54%_/_0.15)]">
        <div className="aspect-[4/5] overflow-hidden">
          <motion.img
            style={{ y: imageY, willChange: "transform" }}
            src={resolveImage(product.image)}
            alt={product.name}
            className="w-full h-[120%] object-cover"
            loading="lazy"
          />
          {/* Hover zoom overlay — separate from parallax to avoid transform conflicts */}
          <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-105 pointer-events-none" />
        </div>
        <div className="p-4 sm:p-5 lg:p-6">
          <h3 className="font-display text-base sm:text-lg text-foreground mb-1 line-clamp-1">
            {product.name}
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground mb-3 font-sans line-clamp-2">
            {product.description}
          </p>
          <p className="font-display text-lg sm:text-xl text-gold">
            {formatPrice(product.price)}
          </p>

          {/* Always visible on mobile (no hover), reveal on hover for desktop */}
          <div className="mt-3 sm:mt-4 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-500">
            {isHighTicket ? (
              <a
                href={`https://wa.me/919999999999?text=${whatsappMsg}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center py-2.5 sm:py-3 border border-primary/40 text-primary text-xs tracking-[0.2em] uppercase font-sans hover:bg-primary hover:text-primary-foreground transition-all duration-300"
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
                className="w-full py-2.5 sm:py-3 border border-primary/40 text-primary text-xs tracking-[0.2em] uppercase font-sans hover:bg-primary hover:text-primary-foreground transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
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
  const isMobile = useIsMobile();

  useEffect(() => {
    fetchProducts().then((data) => setProducts(data as Product[])).catch(console.error);
  }, []);

  return (
    <section id="collection" className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-10 sm:mb-14 lg:mb-16"
        >
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-gold-gradient tracking-[0.1em] sm:tracking-[0.15em] uppercase font-light">
            The Collection
          </h2>
          <p className="text-muted-foreground mt-3 sm:mt-4 text-xs sm:text-sm tracking-[0.08em] sm:tracking-[0.1em] uppercase font-sans">
            Each piece, handpicked. Each story, sacred.
          </p>
        </motion.div>

        {products === undefined ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[4/5] bg-card border border-border" />
                <div className="p-4 sm:p-5 lg:p-6 space-y-3">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                  <div className="h-5 bg-muted rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {products.map((product, i) => (
              <ProductCard
                key={product.id}
                product={product}
                index={i}
                isMobile={isMobile}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default CollectionSection;
