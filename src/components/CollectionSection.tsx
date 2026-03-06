import { motion } from "framer-motion";
import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";
import product4 from "@/assets/product-4.jpg";
import product5 from "@/assets/product-5.jpg";
import product6 from "@/assets/product-6.jpg";
import product7 from "@/assets/product-7.jpg";
import product8 from "@/assets/product-8.jpg";

interface Product {
  name: string;
  description: string;
  price: number;
  image: string;
}

const products: Product[] = [
  { name: "Nataraja in Cosmic Dance", description: "Chola-era bronze, 18th century reproduction", price: 85000, image: product1 },
  { name: "Temple Diya — Eternal Flame", description: "Ornate brass oil lamp with sacred motifs", price: 24000, image: product2 },
  { name: "Sandalwood Ganesha", description: "Hand-carved Mysore sandalwood, 12 inches", price: 45000, image: product3 },
  { name: "Ceremonial Puja Thali", description: "Antique copper with temple engravings", price: 18000, image: product4 },
  { name: "Sacred Stone Stele", description: "Ancient carved stone on brass pedestal", price: 120000, image: product5 },
  { name: "Saraswati with Veena", description: "Museum-grade bronze, lost-wax casting", price: 95000, image: product6 },
  { name: "Temple Kumkum Casket", description: "Silver-plated with mythological relief", price: 55000, image: product7 },
  { name: "Mandir Ghanta — Temple Bell", description: "Consecrated brass bell with sacred chain", price: 32000, image: product8 },
];

const formatPrice = (price: number) =>
  `₹${price.toLocaleString("en-IN")}`;

const ProductCard = ({ product, index }: { product: Product; index: number }) => {
  const isHighTicket = product.price > 50000;
  const whatsappMsg = encodeURIComponent(`Hi, I'm interested in "${product.name}" (${formatPrice(product.price)}) from Lakshya.`);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group"
    >
      <div className="relative overflow-hidden bg-card border border-transparent hover:border-primary/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_60px_-15px_hsl(43_52%_54%_/_0.15)]">
        <div className="aspect-[4/5] overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
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
              <button className="w-full py-3 border border-primary/40 text-primary text-xs tracking-[0.2em] uppercase font-sans hover:bg-primary hover:text-primary-foreground transition-all duration-300">
                Claim This Piece
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const CollectionSection = () => {
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, i) => (
            <ProductCard key={product.name} product={product} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CollectionSection;
