import { motion } from "framer-motion";
import { UserPlus, TestTube, TrendingUp } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    title: "Choose Your Plan",
    description: "Select the membership tier that fits your goals. No contracts — cancel anytime.",
  },
  {
    icon: TestTube,
    title: "Get Your Labs",
    description: "Receive a comprehensive baseline panel with 100+ biomarkers drawn at a local lab.",
  },
  {
    icon: TrendingUp,
    title: "Get Optimized",
    description: "Your physician reviews results and builds a personalized peptide & wellness protocol.",
  },
];

const HowItWorks = () => (
  <section className="max-w-5xl mx-auto px-6 mb-14 md:mb-20">
    <motion.p
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center text-xs tracking-[0.35em] uppercase text-primary font-body font-light mb-6 md:mb-10"
    >
      How It Works
    </motion.p>

    <div className="grid md:grid-cols-3 gap-5 md:gap-8">
      {steps.map((step, i) => (
        <motion.div
          key={step.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: i * 0.15 }}
          className="flex flex-col items-center text-center"
        >
          {/* Step number + icon */}
          <div className="relative mb-5">
            <div className="w-16 h-16 border border-primary/30 flex items-center justify-center">
              <step.icon size={24} className="text-primary" />
            </div>
            <span className="absolute -top-2 -right-2 w-6 h-6 bg-primary text-primary-foreground text-[10px] font-body flex items-center justify-center">
              {i + 1}
            </span>
          </div>

          <h3 className="text-sm tracking-[0.2em] uppercase font-body font-medium text-foreground mb-2">
            {step.title}
          </h3>
          <p className="text-xs text-muted-foreground font-body font-light leading-relaxed max-w-xs">
            {step.description}
          </p>
        </motion.div>
      ))}
    </div>

    {/* Connecting line (desktop only) */}
    <div className="hidden md:block relative -mt-[88px] mx-auto max-w-[70%]">
      <div className="border-t border-dashed border-primary/20" />
    </div>
  </section>
);

export default HowItWorks;
