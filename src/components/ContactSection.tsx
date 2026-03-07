import { motion } from "framer-motion";
import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { createInquiry } from "@/lib/db";

const ContactSection = () => {
  const [form, setForm] = useState({ name: "", phone: "", whatsapp: "", interest: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) {
      toast.error("Please fill in your name and phone number.");
      return;
    }
    try {
      await createInquiry({
        name: form.name,
        phone: form.phone,
        whatsapp: form.whatsapp || undefined,
        interest: form.interest || undefined,
      });
      toast.success("Thank you. We will reach out to you shortly.");
      setForm({ name: "", phone: "", whatsapp: "", interest: "" });
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  };

  const inputClass =
    "w-full bg-transparent border-b border-border py-3 text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none transition-colors duration-300 font-sans text-sm";

  return (
    <section id="contact" className="py-32 px-6 bg-background">
      <div className="max-w-xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-4xl sm:text-5xl text-gold-gradient tracking-[0.15em] uppercase font-light">
            Inquire
          </h2>
          <p className="text-muted-foreground mt-4 text-sm tracking-wider font-sans">
            For bespoke requests and high-value acquisitions
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          onSubmit={handleSubmit}
          className="space-y-8"
        >
          <input
            type="text"
            placeholder="Your Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className={inputClass}
            maxLength={100}
          />
          <input
            type="tel"
            placeholder="Phone Number"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className={inputClass}
            maxLength={15}
          />
          <input
            type="text"
            placeholder="WhatsApp Number (if different)"
            value={form.whatsapp}
            onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
            className={inputClass}
            maxLength={15}
          />
          <input
            type="text"
            placeholder="Item of Interest"
            value={form.interest}
            onChange={(e) => setForm({ ...form, interest: e.target.value })}
            className={inputClass}
            maxLength={200}
          />

          <button
            type="submit"
            className="w-full py-4 border border-primary/40 text-primary text-sm tracking-[0.25em] uppercase font-sans hover:bg-primary hover:text-primary-foreground transition-all duration-500 mt-4"
          >
            Submit Inquiry
          </button>
        </motion.form>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-center mt-12"
        >
          <p className="text-muted-foreground text-xs tracking-wider uppercase mb-4 font-sans">Or reach us directly</p>
          <a
            href="https://wa.me/919999999999?text=Hi%2C%20I%27m%20interested%20in%20Lakshya%20artifacts."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-gold hover:text-foreground transition-colors duration-300 text-sm tracking-wider font-sans"
          >
            <MessageCircle className="w-4 h-4" />
            WhatsApp Us
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactSection;
