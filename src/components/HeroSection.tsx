import { motion } from "framer-motion";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => (
  <section
    className="relative min-h-screen flex items-center justify-center overflow-hidden"
    id="home"
  >
    <img
      src={heroBg}
      alt="Abstract golden light"
      className="absolute inset-0 w-full h-full object-cover opacity-40"
      loading="eager"
    />
    <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background" />
    <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-sm tracking-[0.3em] uppercase text-primary mb-6 font-body"
      >
        Advanced Peptide Therapy
      </motion.p>
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.15 }}
        className="font-heading text-5xl md:text-7xl font-semibold leading-tight mb-6"
      >
        Unlock Your Body's <span className="text-primary">Full Potential</span>
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="text-lg text-muted-foreground max-w-xl mx-auto mb-10 font-body leading-relaxed"
      >
        Science-backed peptide protocols designed for longevity, performance, and recovery.
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.45 }}
        className="flex flex-col sm:flex-row gap-4 justify-center"
      >
        <a
          href="#contact"
          className="px-8 py-3 bg-primary text-primary-foreground font-medium tracking-wide uppercase text-sm rounded-sm hover:opacity-90 transition-opacity"
        >
          Schedule Consultation
        </a>
        <a
          href="#peptides"
          className="px-8 py-3 border border-primary/30 text-primary font-medium tracking-wide uppercase text-sm rounded-sm hover:bg-primary/10 transition-colors"
        >
          Explore Peptides
        </a>
      </motion.div>
    </div>
  </section>
);

export default HeroSection;
