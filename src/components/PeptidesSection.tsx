import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import peptideVial from "@/assets/pv-branded-vial.png";

const highlights = [
  { category: "Recovery & Healing", count: 2 },
  { category: "Weight Management", count: 2 },
  { category: "Anti-Aging & Performance", count: 3 },
  { category: "Cognitive & Mood", count: 2 },
  { category: "Immune Support", count: 1 },
  { category: "And More…", count: null },
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
        Our Protocols
      </motion.p>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-3xl md:text-5xl font-extralight mb-6 tracking-tight font-heading"
      >
        Peptide Catalog
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="text-muted-foreground max-w-lg mx-auto mb-14 font-body font-light text-sm leading-relaxed"
      >
        15+ physician-directed peptide protocols spanning recovery, longevity, weight management, cognitive health, and beyond.
      </motion.p>

      {/* Category preview grid */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-14"
      >
        {highlights.map((h, i) => (
          <div
            key={h.category}
            className="border border-border rounded-lg p-5 flex flex-col items-center gap-3 bg-card hover:border-primary/20 transition-colors"
          >
            <img src={peptideVial} alt="" className="w-10 h-10 object-contain opacity-60" />
            <p className="text-xs tracking-[0.15em] uppercase font-body font-light text-foreground">
              {h.category}
            </p>
            {h.count && (
              <p className="text-[10px] text-muted-foreground font-body font-light">
                {h.count} protocols
              </p>
            )}
          </div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <Link
          to="/peptides"
          className="inline-flex items-center gap-3 px-10 py-3 border border-primary/30 text-xs font-body font-light tracking-[0.25em] uppercase text-foreground hover:bg-primary/5 transition-colors"
        >
          Explore All Protocols
          <ArrowRight size={14} strokeWidth={1.2} />
        </Link>
      </motion.div>
    </div>
  </section>
);

export default PeptidesSection;
