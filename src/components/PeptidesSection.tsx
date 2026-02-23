import { motion } from "framer-motion";
import { Zap, Shield, HeartPulse, Brain, Lock } from "lucide-react";

const peptides = [
  {
    icon: HeartPulse,
    title: "BPC-157",
    desc: "Accelerates tissue repair and gut healing with clinically studied regenerative properties.",
  },
  {
    icon: Zap,
    title: "CJC-1295 / Ipamorelin",
    desc: "Stimulates natural growth hormone release for improved recovery, sleep, and body composition.",
  },
  {
    icon: Brain,
    title: "Selank",
    desc: "Enhances cognitive function, reduces anxiety, and supports immune modulation.",
  },
  {
    icon: Shield,
    title: "Thymosin Alpha-1",
    desc: "Boosts immune defense and supports chronic illness management through immune regulation.",
  },
];

const card = {
  hidden: { opacity: 0, y: 40 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.12 },
  }),
};

const PeptidesSection = () => (
  <section id="peptides" className="py-28 px-6">
    <div className="max-w-6xl mx-auto">
      <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground text-center mb-3 font-body font-light">
        Our Protocols
      </p>
      <h2 className="text-3xl md:text-5xl font-extralight text-center mb-4 tracking-tight">
        Featured Peptides
      </h2>
      <p className="text-muted-foreground text-center max-w-lg mx-auto mb-16 font-body font-light text-sm">
        Each protocol is tailored to your unique biology and wellness goals.
      </p>
      <div className="grid md:grid-cols-2 gap-6">
        {peptides.map((p, i) => (
          <motion.div
            key={p.title}
            variants={card}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            custom={i}
            className="bg-card border border-border rounded-lg p-8 hover:border-primary/30 transition-colors duration-300 group"
          >
            <p.icon className="w-6 h-6 text-primary mb-5 group-hover:scale-110 transition-transform duration-300" />
            <h3 className="text-xl font-light mb-3 tracking-tight">{p.title}</h3>
            <p className="text-muted-foreground font-body font-light text-sm leading-relaxed">{p.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* CTA to full catalog */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="mt-12 text-center"
      >
        <a
          href="/catalog"
          className="inline-flex items-center gap-2 px-6 py-3 text-xs font-body font-light tracking-[0.2em] uppercase border border-primary/40 text-primary hover:bg-primary/10 transition-colors"
        >
          <Lock size={14} strokeWidth={1.2} />
          View Full Catalog & Pricing
        </a>
        <p className="text-xs text-muted-foreground font-body font-light mt-3">
          Pricing available to registered patients only
        </p>
      </motion.div>
    </div>
  </section>
);

export default PeptidesSection;
