import { motion } from "framer-motion";
import { Microscope, CheckCircle2, Zap, Crown, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const baselineMarkers = [
  { category: "Cardiovascular", markers: ["ApoB", "Lp(a)", "Lipid Panel", "Homocysteine"], hue: 0 },
  { category: "Metabolic", markers: ["HbA1c", "Fasting Glucose", "Insulin", "C-peptide", "Uric Acid"], hue: 25 },
  { category: "Hormones", markers: ["Free & Total Testosterone", "Estradiol", "FSH/LH", "SHBG", "Prolactin", "IGF-1"], hue: 340 },
  { category: "Thyroid", markers: ["TSH", "Free T3", "Free T4", "Thyroid Antibodies"], hue: 262 },
  { category: "Inflammation", markers: ["hs-CRP", "Ferritin", "ESR", "WBC Differential"], hue: 168 },
  { category: "Liver & Kidney", markers: ["ALT", "AST", "GGT", "ALP", "Creatinine", "eGFR", "BUN"], hue: 200 },
  { category: "Nutrients", markers: ["Vitamin D", "Magnesium (RBC)", "Iron/TIBC", "OmegaCheck"], hue: 45 },
  { category: "Urinalysis", markers: ["Complete Urinalysis (14 markers)"], hue: 190 },
];

const coreMarkers = [
  "CBC w/ Differential", "Comprehensive Metabolic Panel", "TSH", "HbA1c",
  "hs-CRP", "Vitamin D", "Testosterone (Free & Total)", "Ferritin/Iron/TIBC",
];

const comparisonData = [
  { company: "Function Health", tests: "100+", price: "$499/yr", note: "No physician, self-serve only" },
  { company: "Superpower", tests: "110+", price: "$450/test", note: "Add-on coaching extra" },
  { company: "10X Health", tests: "60+", price: "$589/test", note: "One-time, no follow-up included" },
];

const BloodworkPanelsSection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-28 px-6 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(ellipse 70% 50% at 60% 40%, hsl(var(--primary) / 0.04), transparent 70%)",
          }}
        />
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
              background: "hsl(var(--primary) / 0.08)",
              border: "1px solid hsl(var(--primary) / 0.15)",
            }}
          >
            <Microscope size={12} strokeWidth={1.5} className="text-primary" />
            <span className="text-[10px] tracking-[0.3em] uppercase text-primary font-body font-light">
              Clinical-Grade Bloodwork
            </span>
          </motion.div>
          <h2 className="text-3xl md:text-5xl font-heading font-extralight text-foreground mb-5 tracking-tight">
            More Markers. Real Physicians. Better Care.
          </h2>
          <p className="text-muted-foreground font-body font-light text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            Every membership starts with a comprehensive 100+ biomarker baseline - then quarterly core checkups
            track what matters most. All physician-reviewed, not just data dumps.
          </p>
        </motion.div>

        {/* Two panels side by side */}
        <div className="grid lg:grid-cols-2 gap-6 mb-20">
          {/* Baseline Panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative rounded-2xl overflow-hidden"
            style={{
              background: "linear-gradient(160deg, hsl(var(--card) / 0.95), hsl(var(--background) / 0.7))",
              border: "1px solid hsl(var(--primary) / 0.15)",
              boxShadow: "0 0 60px -20px hsl(var(--primary) / 0.1)",
            }}
          >
            {/* Header stripe */}
            <div
              className="px-6 py-4 flex items-center justify-between"
              style={{
                background: "hsl(var(--primary) / 0.06)",
                borderBottom: "1px solid hsl(var(--primary) / 0.08)",
              }}
            >
              <div className="flex items-center gap-3">
                <Crown size={16} strokeWidth={1.3} className="text-primary" />
                <div>
                  <h3 className="text-sm font-body font-normal text-foreground">Baseline Panel</h3>
                  <span className="text-[9px] text-muted-foreground/50 font-body">At sign-up · Once per year</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-lg font-heading font-light text-primary">100+</span>
                <span className="text-[9px] text-muted-foreground/40 font-body block">biomarkers</span>
              </div>
            </div>

            {/* Marker categories */}
            <div className="p-6 space-y-4">
              {baselineMarkers.map((group, i) => (
                <motion.div
                  key={group.category}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.2 + i * 0.05 }}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: `hsl(${group.hue} 70% 55%)` }} />
                    <span className="text-[10px] tracking-[0.15em] uppercase text-muted-foreground/50 font-body">
                      {group.category}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pl-3.5">
                    {group.markers.map((marker) => (
                      <span
                        key={marker}
                        className="text-[10px] font-body font-light px-2 py-0.5 rounded-full text-foreground/70"
                        style={{
                          background: `hsl(${group.hue} 50% 50% / 0.06)`,
                          border: `1px solid hsl(${group.hue} 50% 50% / 0.08)`,
                        }}
                      >
                        {marker}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}

              <div className="pt-3 border-t border-border/30">
                <span className="text-[10px] text-muted-foreground/40 font-body font-light">
                  + CBC w/ Differential, Complete Metabolic Panel, PSA (male), Full Urinalysis, and more
                </span>
              </div>
            </div>
          </motion.div>

          {/* Core Checkup */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative rounded-2xl overflow-hidden flex flex-col"
            style={{
              background: "linear-gradient(160deg, hsl(var(--card) / 0.7), hsl(var(--background) / 0.5))",
              border: "1px solid hsl(var(--border) / 0.4)",
            }}
          >
            {/* Header stripe */}
            <div
              className="px-6 py-4 flex items-center justify-between"
              style={{
                background: "hsl(var(--foreground) / 0.02)",
                borderBottom: "1px solid hsl(var(--border) / 0.3)",
              }}
            >
              <div className="flex items-center gap-3">
                <Zap size={16} strokeWidth={1.3} style={{ color: "hsl(168 85% 57%)" }} />
                <div>
                  <h3 className="text-sm font-body font-normal text-foreground">Core Checkup</h3>
                  <span className="text-[9px] text-muted-foreground/50 font-body">Quarterly follow-ups</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-lg font-heading font-light" style={{ color: "hsl(168 85% 57%)" }}>40+</span>
                <span className="text-[9px] text-muted-foreground/40 font-body block">biomarkers</span>
              </div>
            </div>

            {/* Core markers list */}
            <div className="p-6 flex-1">
              <p className="text-xs text-muted-foreground/50 font-body font-light mb-5 leading-relaxed">
                The essential markers that change quarter-to-quarter - tracking your response to peptide therapy,
                lifestyle changes, and supplementation.
              </p>
              <div className="space-y-2.5">
                {coreMarkers.map((marker, i) => (
                  <motion.div
                    key={marker}
                    initial={{ opacity: 0, x: -8 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: 0.3 + i * 0.05 }}
                    className="flex items-center gap-2.5"
                  >
                    <CheckCircle2 size={13} strokeWidth={1.3} style={{ color: "hsl(168 85% 57% / 0.6)" }} />
                    <span className="text-xs font-body font-light text-foreground/70">{marker}</span>
                  </motion.div>
                ))}
              </div>

              {/* Upgrade callout */}
              <div
                className="mt-6 p-3 rounded-lg"
                style={{
                  background: "hsl(var(--primary) / 0.04)",
                  border: "1px dashed hsl(var(--primary) / 0.12)",
                }}
              >
                <span className="text-[10px] text-primary font-body font-light">
                  Want the full picture? Upgrade any Core Checkup to a full Baseline retest for $299.
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Competitor comparison */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h3 className="text-lg font-heading font-light text-foreground text-center mb-8">
            How We Compare
          </h3>
          <div className="grid md:grid-cols-4 gap-3 max-w-4xl mx-auto">
            {/* Us */}
            <div
              className="p-5 rounded-xl text-center relative"
              style={{
                background: "hsl(var(--primary) / 0.06)",
                border: "1px solid hsl(var(--primary) / 0.2)",
                boxShadow: "0 0 30px -10px hsl(var(--primary) / 0.1)",
              }}
            >
              <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[8px] tracking-[0.15em] uppercase font-body bg-primary text-primary-foreground">
                You're Here
              </div>
              <span className="text-xs font-body font-normal text-foreground block mb-1">Premier Vitality</span>
              <span className="text-2xl font-heading font-light text-primary block">100+</span>
              <span className="text-[9px] text-muted-foreground/50 font-body block mb-2">biomarkers</span>
              <span className="text-xs font-body font-light text-foreground/70 block mb-1">Included in membership</span>
              <span className="text-[9px] text-muted-foreground/40 font-body font-light block">
                Physician-directed · Peptide therapy integration
              </span>
            </div>

            {/* Competitors */}
            {comparisonData.map((comp) => (
              <div
                key={comp.company}
                className="p-5 rounded-xl text-center"
                style={{
                  background: "hsl(var(--card) / 0.4)",
                  border: "1px solid hsl(var(--border) / 0.3)",
                }}
              >
                <span className="text-xs font-body font-light text-muted-foreground/60 block mb-1">{comp.company}</span>
                <span className="text-2xl font-heading font-light text-muted-foreground/40 block">{comp.tests}</span>
                <span className="text-[9px] text-muted-foreground/30 font-body block mb-2">biomarkers</span>
                <span className="text-xs font-body font-light text-muted-foreground/50 block mb-1">{comp.price}</span>
                <span className="text-[9px] text-muted-foreground/30 font-body font-light block">{comp.note}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center"
        >
          <motion.button
            onClick={() => navigate("/services")}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-2 px-10 py-3 bg-primary text-primary-foreground font-light tracking-widest uppercase text-xs rounded-sm transition-all"
            style={{ boxShadow: "0 0 20px -4px hsl(var(--primary) / 0.25)" }}
          >
            View Membership Plans
            <ArrowRight size={14} strokeWidth={1.3} />
          </motion.button>
          <p className="text-[10px] text-muted-foreground/40 font-body font-light mt-3">
            All plans include a 100+ biomarker Baseline Panel at sign-up
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default BloodworkPanelsSection;
