import { motion } from "framer-motion";
import { Search, ShieldCheck, Package } from "lucide-react";

const steps = [
  { icon: Search, title: "Browse", description: "Explore our curated collection of sacred artifacts" },
  { icon: ShieldCheck, title: "Claim", description: "Reserve your piece or inquire for high-value items" },
  { icon: Package, title: "Delivered", description: "Securely packaged and delivered to your sanctum" },
];

const ProcessSection = () => {
  return (
    <section id="process" className="py-32 px-6 bg-obsidian-light">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="font-display text-4xl sm:text-5xl text-gold-gradient tracking-[0.15em] uppercase font-light">
            How It Works
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.2 }}
              className="text-center relative"
            >
              <div className="w-16 h-16 mx-auto mb-6 border border-primary/30 flex items-center justify-center">
                <step.icon className="w-7 h-7 text-gold" strokeWidth={1.2} />
              </div>
              <h3 className="font-display text-2xl text-foreground mb-3">{step.title}</h3>
              <p className="text-sm text-muted-foreground font-sans leading-relaxed">{step.description}</p>

              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-[calc(50%+48px)] w-[calc(100%-96px)] h-px bg-gradient-to-r from-primary/30 to-primary/10" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
