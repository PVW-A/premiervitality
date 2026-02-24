import { motion } from "framer-motion";
import { openCalendly } from "@/hooks/useCalendly";

const CTASection = () => (
  <section id="contact" className="py-28 px-6">
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
      className="max-w-2xl mx-auto text-center"
    >
      <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-3 font-body font-light">
        Get Started
      </p>
      <h2 className="text-3xl md:text-5xl font-extralight mb-6 tracking-tight">
        Ready to Optimize Your Health?
      </h2>
      <p className="text-muted-foreground font-body font-light text-sm leading-relaxed mb-10 max-w-lg mx-auto">
        Book a free consultation to discuss your goals and discover the right peptide protocol for you.
      </p>
      <a
        href="mailto:hello@premiervitality.com"
        className="inline-block px-10 py-3 bg-primary text-primary-foreground font-light tracking-widest uppercase text-xs rounded-sm hover:opacity-90 transition-opacity"
      >
        Book Free Consultation
      </a>
    </motion.div>
  </section>
);

export default CTASection;
