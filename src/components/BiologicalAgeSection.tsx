import { motion } from "framer-motion";
import { Dna, TrendingDown, Activity, Brain, Heart, Flame, ShieldCheck } from "lucide-react";

const DEMO_CHRONO_AGE = 42;
const DEMO_BIO_AGE = 36.4;
const DEMO_YEARS_YOUNGER = DEMO_CHRONO_AGE - DEMO_BIO_AGE;

const agingFactors = [
  {
    icon: Flame,
    marker: "hs-CRP",
    category: "Inflammation",
    impact: "Chronic inflammation accelerates cellular aging by 2-4 years",
    status: "optimal" as const,
    value: "0.4 mg/L",
    hue: 168,
  },
  {
    icon: Activity,
    marker: "HbA1c",
    category: "Metabolic",
    impact: "Insulin resistance drives glycation damage to proteins & DNA",
    status: "optimal" as const,
    value: "5.1%",
    hue: 200,
  },
  {
    icon: Heart,
    marker: "ApoB",
    category: "Cardiovascular",
    impact: "Arterial plaque burden directly correlates with vascular age",
    status: "attention" as const,
    value: "98 mg/dL",
    hue: 25,
  },
  {
    icon: Brain,
    marker: "Homocysteine",
    category: "Neurological",
    impact: "Elevated levels linked to cognitive decline & brain volume loss",
    status: "optimal" as const,
    value: "7.2 µmol/L",
    hue: 262,
  },
  {
    icon: ShieldCheck,
    marker: "IGF-1",
    category: "Hormones",
    impact: "Growth factor signaling governs tissue repair & regeneration rate",
    status: "attention" as const,
    value: "142 ng/mL",
    hue: 340,
  },
];

const statusConfig = {
  optimal: { label: "Optimal", dotHue: 168 },
  attention: { label: "Monitor", dotHue: 25 },
};

const BiologicalAgeSection = () => {
  return (
    <section className="py-28 px-6 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 80% 60% at 30% 50%, hsl(200 90% 55% / 0.04), transparent 60%), radial-gradient(ellipse 60% 50% at 80% 30%, hsl(262 70% 60% / 0.03), transparent 60%)",
          }}
        />
        {/* DNA helix lines */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.015]" viewBox="0 0 1200 800" preserveAspectRatio="none">
          {Array.from({ length: 12 }).map((_, i) => (
            <motion.path
              key={i}
              d={`M${-50 + i * 110},0 Q${50 + i * 110},200 ${-50 + i * 110},400 T${-50 + i * 110},800`}
              fill="none"
              stroke="hsl(var(--foreground))"
              strokeWidth="1"
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 2, delay: i * 0.1 }}
            />
          ))}
        </svg>
      </div>

      <div className="max-w-6xl mx-auto relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6"
            style={{
              background: "hsl(200 90% 55% / 0.08)",
              border: "1px solid hsl(200 90% 55% / 0.15)",
            }}
          >
            <Dna size={12} strokeWidth={1.5} style={{ color: "hsl(200 90% 55%)" }} />
            <span className="text-[10px] tracking-[0.3em] uppercase font-body font-light" style={{ color: "hsl(200 90% 55%)" }}>
              Biological Age Estimation
            </span>
          </motion.div>
          <h2 className="text-3xl md:text-5xl font-heading font-extralight text-foreground mb-5 tracking-tight">
            Your Blood Tells the Truth
          </h2>
          <p className="text-muted-foreground font-body font-light text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            Your chronological age is just a number. Using the Levine PhenoAge algorithm and key biomarkers,
            we calculate your <em className="text-foreground/80 not-italic font-normal">true biological age</em> - the age
            your cells are actually performing at.
          </p>
        </motion.div>

        {/* Age comparison visual */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
          {/* Left: Age dial */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="flex justify-center"
          >
            <div className="relative">
              {/* Outer orbit ring */}
              <motion.div
                className="absolute -inset-12 rounded-full"
                style={{ border: "1px solid hsl(var(--foreground) / 0.03)" }}
                animate={{ rotate: 360 }}
                transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
              >
                <div
                  className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full"
                  style={{ background: "hsl(200 90% 55% / 0.4)" }}
                />
              </motion.div>

              <div
                className="relative p-12 rounded-3xl"
                style={{
                  background: "linear-gradient(160deg, hsl(var(--card) / 0.95), hsl(var(--background) / 0.7))",
                  border: "1px solid hsl(var(--border) / 0.5)",
                  boxShadow: "0 0 80px -20px hsl(200 90% 55% / 0.08), inset 0 1px 0 hsl(0 0% 100% / 0.03)",
                }}
              >
                {/* Chronological age - faded */}
                <div className="text-center mb-6">
                  <span className="text-[9px] tracking-[0.3em] uppercase text-muted-foreground/30 font-body block mb-1">
                    Chronological Age
                  </span>
                  <span className="text-5xl font-heading font-extralight text-muted-foreground/25 tabular-nums line-through decoration-muted-foreground/10">
                    {DEMO_CHRONO_AGE}
                  </span>
                </div>

                {/* Divider */}
                <div className="w-16 h-px mx-auto mb-6" style={{ background: "linear-gradient(90deg, transparent, hsl(var(--foreground) / 0.08), transparent)" }} />

                {/* Biological age - prominent */}
                <div className="text-center">
                  <span className="text-[9px] tracking-[0.3em] uppercase font-body block mb-2" style={{ color: "hsl(168 85% 57% / 0.6)" }}>
                    Biological Age
                  </span>
                  <motion.span
                    className="text-7xl font-heading font-extralight tabular-nums block"
                    style={{
                      color: "hsl(168 85% 57%)",
                      textShadow: "0 0 40px hsl(168 85% 57% / 0.3)",
                    }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                  >
                    {DEMO_BIO_AGE}
                  </motion.span>
                </div>

                {/* Delta badge */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6 }}
                  className="flex items-center justify-center gap-1.5 mt-6 mx-auto px-4 py-1.5 rounded-full w-fit"
                  style={{
                    background: "hsl(168 85% 57% / 0.08)",
                    border: "1px solid hsl(168 85% 57% / 0.15)",
                  }}
                >
                  <TrendingDown size={12} style={{ color: "hsl(168 85% 57%)" }} />
                  <span className="text-xs font-body font-light" style={{ color: "hsl(168 85% 57%)" }}>
                    {DEMO_YEARS_YOUNGER.toFixed(1)} years younger
                  </span>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Right: Aging factors */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h3 className="text-lg font-heading font-light text-foreground mb-2">
              How Biomarkers Drive Your Biological Age
            </h3>
            <p className="text-xs text-muted-foreground/60 font-body font-light mb-8 leading-relaxed">
              Each marker contributes to an algorithmic estimate based on published aging clocks.
              Here's how they map to your cellular age.
            </p>

            <div className="space-y-3">
              {agingFactors.map((factor, i) => {
                const cfg = statusConfig[factor.status];
                return (
                  <motion.div
                    key={factor.marker}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.2 + i * 0.08 }}
                    className="group relative p-4 rounded-xl cursor-default transition-all duration-300"
                    style={{
                      background: "hsl(var(--card) / 0.5)",
                      border: "1px solid hsl(var(--border) / 0.3)",
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{
                          background: `hsl(${factor.hue} 70% 55% / 0.08)`,
                          border: `1px solid hsl(${factor.hue} 70% 55% / 0.12)`,
                        }}
                      >
                        <factor.icon size={14} strokeWidth={1.3} style={{ color: `hsl(${factor.hue} 70% 55%)` }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-body font-normal text-foreground">{factor.marker}</span>
                          <span className="text-[8px] tracking-[0.15em] uppercase text-muted-foreground/40 font-body">
                            {factor.category}
                          </span>
                          <div className="ml-auto flex items-center gap-1.5">
                            <div
                              className="w-1.5 h-1.5 rounded-full"
                              style={{ background: `hsl(${cfg.dotHue} 85% 57%)` }}
                            />
                            <span className="text-[9px] font-body text-muted-foreground/50">{cfg.label}</span>
                          </div>
                        </div>
                        <p className="text-[10px] text-muted-foreground/50 font-body font-light leading-relaxed">
                          {factor.impact}
                        </p>
                      </div>
                      <span className="text-xs font-body font-light text-muted-foreground/60 tabular-nums flex-shrink-0">
                        {factor.value}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Epigenetic add-on callout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative p-8 rounded-2xl overflow-hidden max-w-3xl mx-auto text-center"
          style={{
            background: "linear-gradient(135deg, hsl(262 40% 20% / 0.3), hsl(200 40% 15% / 0.3))",
            border: "1px solid hsl(262 50% 50% / 0.12)",
          }}
        >
          {/* Subtle grid */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(hsl(262 50% 60% / 0.03) 1px, transparent 1px), linear-gradient(90deg, hsl(262 50% 60% / 0.03) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
          <div className="relative">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4" style={{ background: "hsl(262 60% 60% / 0.1)", border: "1px solid hsl(262 60% 60% / 0.15)" }}>
              <Dna size={10} style={{ color: "hsl(262 60% 60%)" }} />
              <span className="text-[9px] tracking-[0.2em] uppercase font-body" style={{ color: "hsl(262 60% 60%)" }}>Coming Soon</span>
            </div>
            <h3 className="text-xl md:text-2xl font-heading font-extralight text-foreground mb-3">
              Epigenetic Age Testing
            </h3>
            <p className="text-xs text-muted-foreground/60 font-body font-light max-w-lg mx-auto leading-relaxed">
              Go beyond blood markers with DNA methylation analysis. Measure your true epigenetic age
              with clinical-grade precision - available as an add-on for Elite members.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default BiologicalAgeSection;
