import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Scale, Heart, Zap, Shield, Sparkles, Scissors, Bandage, Flame } from "lucide-react";

const protocolCategories = [
  { name: "Weight Management", icon: Scale },
  { name: "Wellness", icon: Heart },
  { name: "Sexual Well-being", icon: Flame },
  { name: "Skin Care", icon: Sparkles },
  { name: "Hair Restoration", icon: Scissors },
  { name: "Injury & Repair", icon: Bandage },
  { name: "Performance", icon: Zap },
  { name: "Immunity Health", icon: Shield },
];

const PeptidesSection = () => (
  <section id="peptides" className="py-28 px-6">
    <div className="max-w-4xl mx-auto text-center">
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-3 font-body font-light"
      >
        Precision Protocols
      </motion.p>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-3xl md:text-5xl font-extralight mb-6 tracking-tight font-heading"
      >
        Curated Treatment Packages
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="text-muted-foreground max-w-lg mx-auto mb-14 font-body font-light text-sm leading-relaxed"
      >
        Physician-directed multi-compound protocols across 8 health categories,
        each available in Premier, Core, and Essential tiers.
      </motion.p>

      {/* Category preview grid */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="flex flex-wrap justify-center gap-3 md:gap-4 mb-14 max-w-3xl mx-auto"
      >
        {protocolCategories.map((cat) => {
          const Icon = cat.icon;
          return (
            <div
              key={cat.name}
              className="border border-border/60 px-6 py-4 flex items-center gap-3 bg-card hover:border-primary/30 transition-colors"
            >
              <Icon size={18} strokeWidth={1.2} className="text-primary/60" />
              <p className="text-[10px] tracking-[0.18em] uppercase font-body font-light text-foreground whitespace-nowrap">
                {cat.name}
              </p>
            </div>
          );
        })}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="flex flex-col sm:flex-row items-center justify-center gap-4"
      >
        <Link
          to="/protocols"
          className="inline-flex items-center gap-3 px-10 py-3 bg-primary text-primary-foreground text-xs font-body font-light tracking-[0.25em] uppercase hover:bg-primary/90 transition-colors"
        >
          View Protocols
          <ArrowRight size={14} strokeWidth={1.2} />
        </Link>
        <Link
          to="/peptides"
          className="inline-flex items-center gap-3 px-10 py-3 border border-primary/30 text-xs font-body font-light tracking-[0.25em] uppercase text-foreground hover:bg-primary/5 transition-colors"
        >
          Browse Peptides
          <ArrowRight size={14} strokeWidth={1.2} />
        </Link>
      </motion.div>
    </div>
  </section>
);

export default PeptidesSection;
