import { motion } from "framer-motion";
import { openCalendly } from "@/hooks/useCalendly";

const CTASection = () => (
  <section id="contact" className="py-28 px-6" style={{ background: "#0a0a0e" }}>
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
      className="max-w-2xl mx-auto text-center"
    >
      <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-3">
        Your Next Step
      </p>
      <h2 className="font-light mb-6 tracking-tight">
        Ready to Optimize Your Biology?
      </h2>
      <p className="text-muted-foreground text-base leading-relaxed mb-10 max-w-lg mx-auto">
        Schedule a complimentary physician consultation. We will review your goals, discuss your options, and determine if our protocols are the right fit.
      </p>
      <button
        onClick={openCalendly}
        className="inline-block px-10 py-3 bg-primary text-primary-foreground tracking-widest uppercase text-xs rounded-sm hover:opacity-90 transition-opacity"
      >
        Book a Consultation
      </button>
    </motion.div>
  </section>
);

export default CTASection;
