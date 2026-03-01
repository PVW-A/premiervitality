import { motion } from "framer-motion";
import {
  Upload,
  BarChart3,
  Lightbulb,
  Dna,
  Zap,
  TrendingDown,
  Activity,
  Brain,
  Heart,
  Flame,
  ShieldCheck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

/* ── Vitality Score data ── */
const categories = [
  { name: "Hormones", score: 82, hue: 168 },
  { name: "Metabolic", score: 91, hue: 25 },
  { name: "Lipids", score: 64, hue: 340 },
  { name: "Thyroid", score: 88, hue: 262 },
  { name: "Inflammation", score: 73, hue: 200 },
];
const RING_R = 54;
const RING_C = 2 * Math.PI * RING_R;
const DEMO_SCORE = 78;

/* ── Biological Age data ── */
const DEMO_CHRONO_AGE = 42;
const DEMO_BIO_AGE = 36.4;
const DEMO_YEARS_YOUNGER = DEMO_CHRONO_AGE - DEMO_BIO_AGE;

const agingFactors = [
  { icon: Flame, marker: "hs-CRP", category: "Inflammation", status: "optimal" as const, value: "0.4 mg/L", hue: 168 },
  { icon: Activity, marker: "HbA1c", category: "Metabolic", status: "optimal" as const, value: "5.1%", hue: 200 },
  { icon: Heart, marker: "ApoB", category: "Cardiovascular", status: "attention" as const, value: "98 mg/dL", hue: 25 },
  { icon: Brain, marker: "Homocysteine", category: "Neurological", status: "optimal" as const, value: "7.2 µmol/L", hue: 262 },
  { icon: ShieldCheck, marker: "IGF-1", category: "Hormones", status: "attention" as const, value: "142 ng/mL", hue: 340 },
];
const statusConfig = {
  optimal: { label: "Optimal", dotHue: 168 },
  attention: { label: "Monitor", dotHue: 25 },
};

const steps = [
  { icon: Upload, title: "Upload Your Bloodwork", desc: "Snap a photo or upload a PDF — our AI reads it instantly." },
  { icon: BarChart3, title: "Get Your Score & Age", desc: "We grade 65+ biomarkers into a unified score and estimate your biological age." },
  { icon: Lightbulb, title: "See How to Improve", desc: "Personalized tips for every marker — know exactly what to optimize." },
];

/* ── Component ── */
const HealthIntelligenceSection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-28 px-6 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 60% 50% at 30% 45%, hsl(var(--primary) / 0.04), transparent 60%), radial-gradient(ellipse 50% 40% at 75% 55%, hsl(200 90% 55% / 0.03), transparent 60%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(hsl(var(--foreground) / 0.012) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground) / 0.012) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
            maskImage: "radial-gradient(ellipse 70% 50% at 50% 50%, black 20%, transparent 80%)",
            WebkitMaskImage: "radial-gradient(ellipse 70% 50% at 50% 50%, black 20%, transparent 80%)",
          }}
        />
      </div>

      <div className="max-w-6xl mx-auto relative">
        {/* Section header */}
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
            style={{ background: "hsl(var(--primary) / 0.08)", border: "1px solid hsl(var(--primary) / 0.15)" }}
          >
            <Dna size={12} strokeWidth={1.5} className="text-primary" />
            <span className="text-[10px] tracking-[0.3em] uppercase text-primary font-body font-light">
              Free for Every Member
            </span>
          </motion.div>
          <h2 className="text-3xl md:text-5xl font-heading font-extralight text-foreground mb-5 tracking-tight">
            Your Health Intelligence
          </h2>
          <p className="text-muted-foreground font-body font-light text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            Upload your bloodwork and instantly receive a comprehensive vitality score
            and biological age estimate — no appointment needed.
          </p>
        </motion.div>

        {/* ─── Two-column: Score + Age ─── */}
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 mb-20">
          {/* LEFT: Vitality Score */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="flex flex-col items-center"
          >
            <div
              className="relative p-8 md:p-10 rounded-2xl w-full max-w-sm backdrop-blur-sm flex flex-col items-center"
              style={{
                background: "linear-gradient(160deg, hsl(var(--card) / 0.9), hsl(var(--background) / 0.6))",
                border: "1px solid hsl(var(--border) / 0.5)",
                boxShadow: "0 0 60px -20px hsl(168 85% 57% / 0.08), inset 0 1px 0 hsl(0 0% 100% / 0.03)",
              }}
            >
              {/* Label */}
              <span className="text-[9px] tracking-[0.3em] uppercase text-muted-foreground/40 font-body mb-5">
                Vitality Score
              </span>

              {/* Ring */}
              <div className="relative w-32 h-32 mb-5">
                <motion.div
                  className="absolute inset-0 rounded-full"
                  animate={{
                    boxShadow: [
                      "0 0 20px 0px hsl(168 85% 57% / 0.0)",
                      "0 0 40px 8px hsl(168 85% 57% / 0.08)",
                      "0 0 20px 0px hsl(168 85% 57% / 0.0)",
                    ],
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                />
                <svg className="w-full h-full -rotate-90" viewBox="0 0 128 128">
                  <circle cx="64" cy="64" r={RING_R} fill="none" stroke="hsl(var(--foreground) / 0.04)" strokeWidth="4" />
                  {Array.from({ length: 60 }).map((_, i) => {
                    const angle = (i / 60) * 360;
                    const rad = (angle * Math.PI) / 180;
                    const inner = 47;
                    const outer = i % 5 === 0 ? 50 : 49;
                    return (
                      <line
                        key={i}
                        x1={64 + inner * Math.cos(rad)}
                        y1={64 + inner * Math.sin(rad)}
                        x2={64 + outer * Math.cos(rad)}
                        y2={64 + outer * Math.sin(rad)}
                        stroke="hsl(var(--foreground) / 0.06)"
                        strokeWidth={i % 5 === 0 ? 1 : 0.5}
                      />
                    );
                  })}
                  <motion.circle
                    cx="64" cy="64" r={RING_R} fill="none"
                    stroke="url(#scoreGrad)" strokeWidth="4" strokeLinecap="round"
                    strokeDasharray={RING_C}
                    initial={{ strokeDashoffset: RING_C }}
                    whileInView={{ strokeDashoffset: RING_C * (1 - DEMO_SCORE / 100) }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.8, ease: "easeOut", delay: 0.3 }}
                    style={{ filter: "drop-shadow(0 0 6px hsl(168 85% 57% / 0.4))" }}
                  />
                  <defs>
                    <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="hsl(168 85% 57%)" />
                      <stop offset="100%" stopColor="hsl(200 90% 55%)" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <motion.span
                    className="text-3xl font-heading font-light text-foreground tabular-nums"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.8 }}
                  >
                    {DEMO_SCORE}
                  </motion.span>
                  <span className="text-[8px] tracking-[0.25em] uppercase text-muted-foreground/40 font-body mt-0.5">/ 100</span>
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center gap-2 mb-5">
                <Zap size={12} strokeWidth={1.5} style={{ color: "hsl(168 85% 57%)" }} />
                <span className="text-sm font-body font-light tracking-wide" style={{ color: "hsl(168 85% 57%)" }}>Good</span>
              </div>

              {/* Category bars */}
              <div className="w-full space-y-2">
                {categories.map((cat, i) => (
                  <motion.div
                    key={cat.name}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.6 + i * 0.08 }}
                    className="flex items-center gap-3"
                  >
                    <span className="text-[9px] text-muted-foreground/40 font-body w-20 text-right tracking-wide">{cat.name}</span>
                    <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: "hsl(var(--foreground) / 0.04)" }}>
                      <motion.div
                        className="h-full rounded-full"
                        style={{
                          background: `linear-gradient(90deg, hsl(${cat.hue} 75% 55%), hsl(${cat.hue} 85% 65%))`,
                          boxShadow: `0 0 8px hsl(${cat.hue} 80% 55% / 0.3)`,
                        }}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${cat.score}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.9, ease: "easeOut", delay: 0.7 + i * 0.08 }}
                      />
                    </div>
                    <span className="text-[9px] text-muted-foreground/50 font-body w-5 tabular-nums">{cat.score}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* RIGHT: Biological Age */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="flex flex-col items-center"
          >
            <div
              className="relative p-8 md:p-10 rounded-2xl w-full max-w-sm backdrop-blur-sm flex flex-col items-center"
              style={{
                background: "linear-gradient(160deg, hsl(var(--card) / 0.9), hsl(var(--background) / 0.6))",
                border: "1px solid hsl(var(--border) / 0.5)",
                boxShadow: "0 0 80px -20px hsl(200 90% 55% / 0.08), inset 0 1px 0 hsl(0 0% 100% / 0.03)",
              }}
            >
              {/* Chronological age */}
              <span className="text-[9px] tracking-[0.3em] uppercase text-muted-foreground/30 font-body mb-2">
                Chronological Age
              </span>
              <span className="text-4xl font-heading font-extralight text-muted-foreground/25 tabular-nums line-through decoration-muted-foreground/10 mb-4">
                {DEMO_CHRONO_AGE}
              </span>

              {/* Divider */}
              <div className="w-16 h-px mb-4" style={{ background: "linear-gradient(90deg, transparent, hsl(var(--foreground) / 0.08), transparent)" }} />

              {/* Biological age */}
              <span className="text-[9px] tracking-[0.3em] uppercase font-body mb-2" style={{ color: "hsl(168 85% 57% / 0.6)" }}>
                Biological Age
              </span>
              <motion.span
                className="text-6xl font-heading font-extralight tabular-nums block mb-4"
                style={{ color: "hsl(168 85% 57%)", textShadow: "0 0 40px hsl(168 85% 57% / 0.3)" }}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                {DEMO_BIO_AGE}
              </motion.span>

              {/* Delta badge */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-full mb-6"
                style={{ background: "hsl(168 85% 57% / 0.08)", border: "1px solid hsl(168 85% 57% / 0.15)" }}
              >
                <TrendingDown size={12} style={{ color: "hsl(168 85% 57%)" }} />
                <span className="text-xs font-body font-light" style={{ color: "hsl(168 85% 57%)" }}>
                  {DEMO_YEARS_YOUNGER.toFixed(1)} years younger
                </span>
              </motion.div>

              {/* Key biomarkers (compact) */}
              <div className="w-full space-y-2">
                {agingFactors.slice(0, 4).map((factor, i) => {
                  const cfg = statusConfig[factor.status];
                  return (
                    <motion.div
                      key={factor.marker}
                      initial={{ opacity: 0, y: 8 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: 0.4 + i * 0.06 }}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg"
                      style={{ background: "hsl(var(--card) / 0.4)", border: "1px solid hsl(var(--border) / 0.2)" }}
                    >
                      <factor.icon size={12} strokeWidth={1.3} style={{ color: `hsl(${factor.hue} 70% 55%)` }} />
                      <span className="text-[10px] font-body text-foreground/80 flex-1">{factor.marker}</span>
                      <div className="w-1.5 h-1.5 rounded-full" style={{ background: `hsl(${cfg.dotHue} 85% 57%)` }} />
                      <span className="text-[9px] font-body text-muted-foreground/50 tabular-nums">{factor.value}</span>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Steps row */}
        <div className="grid md:grid-cols-3 gap-10 mb-16">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 + i * 0.12 }}
              className="text-center relative"
            >
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-5 left-[60%] w-[80%] h-px bg-gradient-to-r from-primary/15 to-transparent" />
              )}
              <div
                className="inline-flex items-center justify-center w-10 h-10 rounded-lg mb-5"
                style={{ background: "hsl(var(--primary) / 0.08)", border: "1px solid hsl(var(--primary) / 0.12)" }}
              >
                <step.icon size={17} strokeWidth={1.3} className="text-primary" />
              </div>
              <h3 className="text-sm font-body font-light text-foreground mb-2">{step.title}</h3>
              <p className="text-xs text-muted-foreground font-body font-light leading-relaxed max-w-[260px] mx-auto">{step.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center"
        >
          <motion.button
            onClick={() => navigate("/auth")}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-block px-10 py-3 bg-primary text-primary-foreground font-light tracking-widest uppercase text-xs rounded-sm transition-all"
            style={{ boxShadow: "0 0 20px -4px hsl(var(--primary) / 0.25)" }}
          >
            Get Your Free Health Report
          </motion.button>
          <p className="text-[10px] text-muted-foreground/40 font-body font-light mt-3">
            Create a free account · Upload labs · See your score in seconds
          </p>
        </motion.div>

        {/* Epigenetic add-on callout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative p-8 rounded-2xl overflow-hidden max-w-3xl mx-auto text-center mt-20"
          style={{
            background: "linear-gradient(135deg, hsl(262 40% 20% / 0.3), hsl(200 40% 15% / 0.3))",
            border: "1px solid hsl(262 50% 50% / 0.12)",
          }}
        >
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
            <h3 className="text-xl md:text-2xl font-heading font-extralight text-foreground mb-3">Epigenetic Age Testing</h3>
            <p className="text-xs text-muted-foreground/60 font-body font-light max-w-lg mx-auto leading-relaxed">
              Go beyond blood markers with DNA methylation analysis. Measure your true epigenetic age
              with clinical-grade precision — available as an add-on for Elite members.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HealthIntelligenceSection;
