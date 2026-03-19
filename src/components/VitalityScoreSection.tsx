import { motion } from "framer-motion";
import { Upload, BarChart3, Lightbulb, Dna, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

const steps = [
  {
    icon: Upload,
    title: "Upload Your Bloodwork",
    desc: "Snap a photo or upload a PDF of your lab results - our AI reads it instantly.",
  },
  {
    icon: BarChart3,
    title: "Get Your Score",
    desc: "We grade 65+ biomarkers across hormones, metabolic health, lipids, thyroid, and more into one unified score.",
  },
  {
    icon: Lightbulb,
    title: "See How to Improve",
    desc: "Tap into personalized tips for every marker - know exactly what to optimize and how.",
  },
];

const categories = [
  { name: "Hormones", score: 82, hue: 168 },
  { name: "Metabolic", score: 91, hue: 25 },
  { name: "Lipids", score: 64, hue: 340 },
  { name: "Thyroid", score: 88, hue: 262 },
  { name: "Inflammation", score: 73, hue: 200 },
];

const RING_R = 58;
const RING_C = 2 * Math.PI * RING_R;
const DEMO_SCORE = 78;

const VitalityScoreSection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-28 px-6 relative overflow-hidden">
      {/* Layered background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 70% 50% at 50% 40%, hsl(var(--primary) / 0.05), transparent 70%)",
          }}
        />
        {/* Grid overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(hsl(var(--foreground) / 0.015) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground) / 0.015) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
            maskImage:
              "radial-gradient(ellipse 60% 50% at 50% 50%, black 20%, transparent 80%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 60% 50% at 50% 50%, black 20%, transparent 80%)",
          }}
        />
      </div>

      <div className="max-w-5xl mx-auto relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6"
            style={{
              background: "hsl(var(--primary) / 0.08)",
              border: "1px solid hsl(var(--primary) / 0.15)",
            }}
          >
            <Dna size={12} strokeWidth={1.5} className="text-primary" />
            <span className="text-[10px] tracking-[0.3em] uppercase text-primary font-body font-light">
              Free for Every Member
            </span>
          </motion.div>
          <h2 className="text-3xl md:text-5xl font-heading font-extralight text-foreground mb-5 tracking-tight">
            Your Vitality Score
          </h2>
          <p className="text-muted-foreground font-body font-light text-sm md:text-base max-w-xl mx-auto leading-relaxed">
            Upload your bloodwork and instantly receive a comprehensive health
            score - no appointment needed.
          </p>
        </motion.div>

        {/* Main score visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="flex justify-center mb-20"
        >
          <div className="relative">
            {/* Outer glow ring */}
            <div
              className="absolute -inset-8 rounded-full"
              style={{
                background:
                  "radial-gradient(circle, hsl(168 85% 57% / 0.06) 0%, transparent 70%)",
              }}
            />

            {/* Card */}
            <div
              className="relative p-10 rounded-2xl flex flex-col items-center gap-5 backdrop-blur-sm"
              style={{
                background:
                  "linear-gradient(160deg, hsl(var(--card) / 0.9), hsl(var(--background) / 0.6))",
                border: "1px solid hsl(var(--border) / 0.5)",
                boxShadow:
                  "0 0 60px -20px hsl(168 85% 57% / 0.08), inset 0 1px 0 hsl(0 0% 100% / 0.03)",
              }}
            >
              {/* Score ring */}
              <div className="relative w-36 h-36">
                {/* Animated ambient pulse */}
                <motion.div
                  className="absolute inset-0 rounded-full"
                  animate={{
                    boxShadow: [
                      "0 0 20px 0px hsl(168 85% 57% / 0.0)",
                      "0 0 40px 8px hsl(168 85% 57% / 0.08)",
                      "0 0 20px 0px hsl(168 85% 57% / 0.0)",
                    ],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />

                <svg
                  className="w-full h-full -rotate-90"
                  viewBox="0 0 128 128"
                >
                  {/* Track */}
                  <circle
                    cx="64"
                    cy="64"
                    r={RING_R}
                    fill="none"
                    stroke="hsl(var(--foreground) / 0.04)"
                    strokeWidth="4"
                  />
                  {/* Tick marks */}
                  {Array.from({ length: 60 }).map((_, i) => {
                    const angle = (i / 60) * 360;
                    const rad = (angle * Math.PI) / 180;
                    const inner = 51;
                    const outer = i % 5 === 0 ? 54 : 53;
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
                  {/* Progress arc */}
                  <motion.circle
                    cx="64"
                    cy="64"
                    r={RING_R}
                    fill="none"
                    stroke="url(#scoreGradient)"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray={RING_C}
                    initial={{ strokeDashoffset: RING_C }}
                    whileInView={{
                      strokeDashoffset: RING_C * (1 - DEMO_SCORE / 100),
                    }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.8, ease: "easeOut", delay: 0.3 }}
                    style={{
                      filter: "drop-shadow(0 0 6px hsl(168 85% 57% / 0.4))",
                    }}
                  />
                  {/* Gradient def */}
                  <defs>
                    <linearGradient
                      id="scoreGradient"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="hsl(168 85% 57%)" />
                      <stop offset="100%" stopColor="hsl(200 90% 55%)" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* Center content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <motion.span
                    className="text-4xl font-heading font-light text-foreground tabular-nums"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.8 }}
                  >
                    {DEMO_SCORE}
                  </motion.span>
                  <span className="text-[9px] tracking-[0.25em] uppercase text-muted-foreground/40 font-body mt-0.5">
                    / 100
                  </span>
                </div>
              </div>

              {/* Label */}
              <div className="flex items-center gap-2">
                <Zap
                  size={12}
                  strokeWidth={1.5}
                  style={{ color: "hsl(168 85% 57%)" }}
                />
                <span
                  className="text-sm font-body font-light tracking-wide"
                  style={{ color: "hsl(168 85% 57%)" }}
                >
                  Good
                </span>
              </div>

              {/* Category breakdown */}
              <div className="w-full max-w-[240px] space-y-2.5 mt-3">
                {categories.map((cat, i) => (
                  <motion.div
                    key={cat.name}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.6 + i * 0.08 }}
                    className="flex items-center gap-3"
                  >
                    <span className="text-[9px] text-muted-foreground/40 font-body w-20 text-right tracking-wide">
                      {cat.name}
                    </span>
                    <div
                      className="flex-1 h-1 rounded-full overflow-hidden"
                      style={{
                        background: "hsl(var(--foreground) / 0.04)",
                      }}
                    >
                      <motion.div
                        className="h-full rounded-full"
                        style={{
                          background: `linear-gradient(90deg, hsl(${cat.hue} 75% 55%), hsl(${cat.hue} 85% 65%))`,
                          boxShadow: `0 0 8px hsl(${cat.hue} 80% 55% / 0.3)`,
                        }}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${cat.score}%` }}
                        viewport={{ once: true }}
                        transition={{
                          duration: 0.9,
                          ease: "easeOut",
                          delay: 0.7 + i * 0.08,
                        }}
                      />
                    </div>
                    <span className="text-[9px] text-muted-foreground/50 font-body w-5 tabular-nums">
                      {cat.score}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Steps */}
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
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-5 left-[60%] w-[80%] h-px bg-gradient-to-r from-primary/15 to-transparent" />
              )}
              <div
                className="inline-flex items-center justify-center w-10 h-10 rounded-lg mb-5"
                style={{
                  background: "hsl(var(--primary) / 0.08)",
                  border: "1px solid hsl(var(--primary) / 0.12)",
                }}
              >
                <step.icon
                  size={17}
                  strokeWidth={1.3}
                  className="text-primary"
                />
              </div>
              <h3 className="text-sm font-body font-light text-foreground mb-2">
                {step.title}
              </h3>
              <p className="text-xs text-muted-foreground font-body font-light leading-relaxed max-w-[260px] mx-auto">
                {step.desc}
              </p>
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
            style={{
              boxShadow: "0 0 20px -4px hsl(var(--primary) / 0.25)",
            }}
          >
            Get Your Free Vitality Score
          </motion.button>
          <p className="text-[10px] text-muted-foreground/40 font-body font-light mt-3">
            Create a free account · Upload labs · See your score in seconds
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default VitalityScoreSection;
