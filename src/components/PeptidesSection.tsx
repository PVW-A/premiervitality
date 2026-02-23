import { motion } from "framer-motion";
import { Zap, Shield, HeartPulse, Brain } from "lucide-react";

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
            <p.icon className="w-8 h-8 text-primary mb-5 group-hover:scale-110 transition-transform duration-300" />
            <h3 className="font-heading text-2xl font-semibold mb-3">{p.title}</h3>
            <p className="text-muted-foreground font-body leading-relaxed">{p.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default PeptidesSection;
