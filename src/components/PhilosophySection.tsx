import { motion } from "framer-motion";

const PhilosophySection = () => {
  return (
    <section id="philosophy" className="py-32 px-6 bg-background">
      <div className="max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1 }}
        >
          <div className="divider-gold mb-12" />
          <p className="font-display text-2xl sm:text-3xl lg:text-4xl leading-relaxed text-foreground font-light">
            Every artifact we curate carries the weight of devotion,
            <span className="text-gold italic"> centuries of prayer</span>, and
            the silence of sacred spaces.
          </p>
          <p className="font-display text-lg sm:text-xl text-muted-foreground mt-8 font-light italic">
            We do not sell objects. We reunite them with those who understand their power.
          </p>
          <div className="divider-gold mt-12" />
        </motion.div>
      </div>
    </section>
  );
};

export default PhilosophySection;
