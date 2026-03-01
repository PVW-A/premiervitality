import { motion } from "framer-motion";
import { Users, FlaskConical, Star, ShieldCheck } from "lucide-react";

const stats = [
  { icon: Users, value: "500+", label: "Active Members" },
  { icon: FlaskConical, value: "100+", label: "Biomarkers Tracked" },
  { icon: Star, value: "4.9", label: "Average Rating" },
  { icon: ShieldCheck, value: "15+", label: "Years of Experience" },
];

const SocialProofStrip = () => (
  <section className="max-w-5xl mx-auto px-6 mb-20">
    <div className="border border-border bg-card p-8 md:p-12">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="flex flex-col items-center text-center"
          >
            <stat.icon size={20} className="text-primary mb-3" />
            <span className="text-2xl md:text-3xl font-heading font-light text-foreground mb-1">
              {stat.value}
            </span>
            <span className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground font-body font-light">
              {stat.label}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default SocialProofStrip;
