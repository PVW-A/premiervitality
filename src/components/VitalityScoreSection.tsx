import { motion } from "framer-motion";
import { Activity, Upload, BarChart3, Lightbulb } from "lucide-react";
import { useNavigate } from "react-router-dom";

const steps = [
  {
    icon: Upload,
    title: "Upload Your Bloodwork",
    desc: "Snap a photo or upload a PDF of your lab results — our AI reads it instantly.",
  },
  {
    icon: BarChart3,
    title: "Get Your Score",
    desc: "We grade 65+ biomarkers across hormones, metabolic health, lipids, thyroid, and more into one unified score.",
  },
  {
    icon: Lightbulb,
    title: "See How to Improve",
    desc: "Tap into personalized tips for every marker — know exactly what to optimize and how.",
  },
];

const VitalityScoreSection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-28 px-6 relative overflow-hidden">
      {/* Subtle background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 60% 50% at 50% 50%, hsl(var(--primary) / 0.04), transparent)",
        }}
      />

      <div className="max-w-5xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-xs tracking-[0.35em] uppercase text-primary font-body font-light mb-4">
            Free for Every Member
          </p>
          <h2 className="text-3xl md:text-5xl font-heading font-extralight text-foreground mb-5 tracking-tight">
            Your Vitality Score
          </h2>
          <p className="text-muted-foreground font-body font-light text-sm md:text-base max-w-xl mx-auto leading-relaxed">
            Upload your bloodwork and instantly receive a comprehensive health score — no appointment needed. See where you excel, where you're falling short, and exactly how to improve.
          </p>
        </motion.div>

        {/* Score demo visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="flex justify-center mb-16"
        >
          <div
            className="relative p-8 rounded-2xl flex flex-col items-center gap-4"
            style={{
              background: "linear-gradient(135deg, hsl(168 85% 57% / 0.06), hsl(0 0% 100% / 0.02))",
              border: "1px solid hsl(168 85% 57% / 0.12)",
            }}
          >
            <div className="relative w-28 h-28">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="54" fill="none" stroke="hsl(0 0% 100% / 0.04)" strokeWidth="5" />
                <motion.circle
                  cx="60" cy="60" r="54" fill="none"
                  stroke="hsl(168 85% 57%)"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 54}
                  initial={{ strokeDashoffset: 2 * Math.PI * 54 }}
                  whileInView={{ strokeDashoffset: 2 * Math.PI * 54 * (1 - 0.78) }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
                  style={{ filter: "drop-shadow(0 0 8px hsl(168 85% 57% / 0.4))" }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-heading font-light text-foreground tabular-nums">78</span>
                <span className="text-[9px] tracking-[0.2em] uppercase text-muted-foreground/50 font-body">/100</span>
              </div>
            </div>
            <span className="text-sm font-body font-light" style={{ color: "hsl(168 85% 57%)" }}>
              Good
            </span>

            {/* Mini category bars */}
            <div className="w-full max-w-[200px] space-y-1.5 mt-2">
              {[
                { name: "Hormones", score: 82, color: "168, 85%, 57%" },
                { name: "Metabolic", score: 91, color: "25, 95%, 53%" },
                { name: "Lipids", score: 64, color: "340, 82%, 52%" },
                { name: "Thyroid", score: 88, color: "262, 83%, 58%" },
              ].map((cat) => (
                <div key={cat.name} className="flex items-center gap-2">
                  <span className="text-[9px] text-muted-foreground/40 font-body w-16 text-right">{cat.name}</span>
                  <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: "hsl(0 0% 100% / 0.04)" }}>
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: `hsl(${cat.color})` }}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${cat.score}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, ease: "easeOut", delay: 0.5 }}
                    />
                  </div>
                  <span className="text-[9px] text-muted-foreground/50 font-body w-5 tabular-nums">{cat.score}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8 mb-14">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 + i * 0.1 }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 mb-4">
                <step.icon size={18} strokeWidth={1.3} className="text-primary" />
              </div>
              <h3 className="text-sm font-body font-light text-foreground mb-2">{step.title}</h3>
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
          <button
            onClick={() => navigate("/auth")}
            className="inline-block px-10 py-3 bg-primary text-primary-foreground font-light tracking-widest uppercase text-xs rounded-sm hover:opacity-90 transition-opacity"
          >
            Get Your Free Vitality Score
          </button>
          <p className="text-[10px] text-muted-foreground/40 font-body font-light mt-3">
            Create a free account · Upload labs · See your score in seconds
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default VitalityScoreSection;
