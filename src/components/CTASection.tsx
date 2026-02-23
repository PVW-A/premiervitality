import { motion } from "framer-motion";

const CTASection = () => (
  <section id="contact" className="py-28 px-6">
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
      className="max-w-2xl mx-auto text-center"
    >
      <p className="text-sm tracking-[0.3em] uppercase text-primary mb-3 font-body">
        Get Started
      </p>
      <h2 className="font-heading text-4xl md:text-5xl font-semibold mb-6">
        Ready to Optimize Your Health?
      </h2>
      <p className="text-muted-foreground font-body leading-relaxed mb-10 max-w-lg mx-auto">
        Book a free consultation to discuss your goals and discover the right peptide protocol for you.
      </p>
      <a
        href="mailto:hello@vitalis.com"
        className="inline-block px-10 py-4 bg-primary text-primary-foreground font-medium tracking-wide uppercase text-sm rounded-sm hover:opacity-90 transition-opacity"
      >
        Book Free Consultation
      </a>
    </motion.div>
  </section>
);

export default CTASection;
