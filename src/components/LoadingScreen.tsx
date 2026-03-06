import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const LoadingScreen = () => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 2400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="loader"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background"
        >
          {/* Shimmer line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="w-24 h-px bg-gradient-to-r from-transparent via-primary to-transparent origin-center mb-10"
          />

          {/* Wordmark */}
          <motion.h1
            initial={{ opacity: 0, letterSpacing: "0.6em" }}
            animate={{ opacity: 1, letterSpacing: "0.3em" }}
            transition={{ duration: 1.4, ease: "easeOut", delay: 0.3 }}
            className="font-display text-4xl sm:text-5xl text-gold-gradient font-light uppercase"
          >
            Lakshya
          </motion.h1>

          {/* Tagline shimmer */}
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 0.6, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="font-display text-sm tracking-[0.4em] text-muted-foreground italic mt-4"
          >
            Sacred. Rare. Eternal.
          </motion.p>

          {/* Bottom shimmer bar */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 2, ease: "easeInOut", delay: 0.5 }}
            className="absolute bottom-16 w-40 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent origin-left"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;
