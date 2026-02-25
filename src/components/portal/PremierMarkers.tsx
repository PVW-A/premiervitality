import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Activity, Droplets, Heart, Flame, Brain, ShieldCheck, TrendingUp, TrendingDown, ChevronRight, Info } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";
import { Line, XAxis, YAxis, ResponsiveContainer, Tooltip, ComposedChart, ReferenceLine, Area } from "recharts";

interface BiomarkerResult {
  id: string;
  marker_name: string;
  category: string;
  value: number;
  unit: string;
  reference_low: number | null;
  reference_high: number | null;
  status: string;
  lab_date: string;
}

interface MarkerDef {
  name: string;
  unit: string;
  low: number;
  high: number;
  optimalLow: number;
  optimalHigh: number;
  what: string;
  tips: string[];
}

const categoryConfig: Record<string, { icon: any; color: string; desc: string; markers: MarkerDef[] }> = {
  Hormones: {
    icon: Activity, color: "168, 85%, 57%",
    desc: "Hormones regulate energy, mood, muscle, and metabolism.",
    markers: [
      { name: "Testosterone (Total)", unit: "ng/dL", low: 300, high: 1000, optimalLow: 500, optimalHigh: 800,
        what: "Your primary anabolic hormone — drives energy, muscle mass, mood, and libido.",
        tips: ["Strength training 3–4x/week", "Sleep 7–9 hours", "Reduce excess body fat", "Manage chronic stress"] },
      { name: "Free Testosterone", unit: "ng/dL", low: 9, high: 30, optimalLow: 15, optimalHigh: 25,
        what: "The unbound, active form of testosterone your body can actually use.",
        tips: ["Optimize total testosterone first", "Reduce SHBG with zinc & magnesium", "Avoid excess alcohol"] },
      { name: "Estradiol (E2)", unit: "pg/mL", low: 20, high: 50, optimalLow: 25, optimalHigh: 40,
        what: "Estrogen balance — too high or low affects joints, mood, and cardiovascular health.",
        tips: ["Maintain healthy body composition", "Eat cruciferous vegetables", "Limit alcohol intake"] },
      { name: "IGF-1", unit: "ng/mL", low: 100, high: 300, optimalLow: 150, optimalHigh: 250,
        what: "Growth factor tied to cellular repair, recovery, and anti-aging.",
        tips: ["Prioritize quality sleep", "High-protein diet", "Consider growth peptide therapy"] },
      { name: "DHEA-S", unit: "µg/dL", low: 100, high: 400, optimalLow: 200, optimalHigh: 350,
        what: "Adrenal hormone precursor — supports energy, immune function, and stress resilience.",
        tips: ["Manage stress with meditation/breathwork", "Get regular sunlight", "Consider DHEA supplementation"] },
    ],
  },
  "Metabolic Panel": {
    icon: Flame, color: "25, 95%, 53%",
    desc: "Metabolic markers show how your body processes energy and sugar.",
    markers: [
      { name: "Fasting Glucose", unit: "mg/dL", low: 70, high: 99, optimalLow: 75, optimalHigh: 90,
        what: "Your blood sugar after fasting — a snapshot of metabolic health.",
        tips: ["Reduce refined carbs & sugar", "Walk after meals", "Maintain consistent meal timing"] },
      { name: "HbA1c", unit: "%", low: 4.0, high: 5.7, optimalLow: 4.5, optimalHigh: 5.2,
        what: "Your 3-month blood sugar average — the most reliable metabolic marker.",
        tips: ["Prioritize fiber-rich foods", "Regular exercise", "Limit processed foods"] },
      { name: "Insulin (Fasting)", unit: "µIU/mL", low: 2, high: 25, optimalLow: 3, optimalHigh: 10,
        what: "How hard your body works to manage blood sugar — lower is generally better.",
        tips: ["Intermittent fasting", "Reduce sugar intake", "Build lean muscle mass"] },
    ],
  },
  Thyroid: {
    icon: ShieldCheck, color: "262, 83%, 58%",
    desc: "Your thyroid controls metabolism, energy levels, and body temperature.",
    markers: [
      { name: "TSH", unit: "mIU/L", low: 0.4, high: 4.0, optimalLow: 1.0, optimalHigh: 2.5,
        what: "Thyroid-stimulating hormone — higher means your thyroid may be underperforming.",
        tips: ["Ensure adequate iodine & selenium", "Manage stress", "Check for thyroid antibodies"] },
      { name: "Free T3", unit: "pg/mL", low: 2.3, high: 4.2, optimalLow: 3.0, optimalHigh: 3.8,
        what: "The active thyroid hormone — drives your day-to-day energy and metabolism.",
        tips: ["Support with selenium-rich foods", "Adequate zinc intake", "Reduce inflammation"] },
      { name: "Free T4", unit: "ng/dL", low: 0.8, high: 1.8, optimalLow: 1.0, optimalHigh: 1.5,
        what: "The storage form of thyroid hormone — converted to active T3 as needed.",
        tips: ["Maintain iron levels", "Avoid excessive soy", "Regular exercise"] },
    ],
  },
  Inflammation: {
    icon: Heart, color: "0, 84%, 60%",
    desc: "Inflammation markers reveal hidden stress on your cardiovascular and immune system.",
    markers: [
      { name: "hs-CRP", unit: "mg/L", low: 0, high: 1.0, optimalLow: 0, optimalHigh: 0.5,
        what: "High-sensitivity C-reactive protein — your body's general inflammation alarm.",
        tips: ["Omega-3 fatty acids (fish oil)", "Anti-inflammatory diet", "Regular aerobic exercise", "Reduce visceral fat"] },
      { name: "Homocysteine", unit: "µmol/L", low: 5, high: 15, optimalLow: 6, optimalHigh: 10,
        what: "Amino acid linked to heart disease risk when elevated.",
        tips: ["B vitamins (B6, B12, folate)", "Reduce processed meat", "Stay hydrated"] },
      { name: "ESR", unit: "mm/hr", low: 0, high: 20, optimalLow: 0, optimalHigh: 10,
        what: "Erythrocyte sedimentation rate — a general marker of inflammation or infection.",
        tips: ["Address underlying infections", "Anti-inflammatory lifestyle", "Quality sleep"] },
    ],
  },
  "Liver & Kidney": {
    icon: Droplets, color: "199, 89%, 48%",
    desc: "These markers track how well your liver and kidneys filter and detoxify.",
    markers: [
      { name: "ALT", unit: "U/L", low: 7, high: 56, optimalLow: 10, optimalHigh: 30,
        what: "Liver enzyme — elevated levels suggest liver stress or damage.",
        tips: ["Limit alcohol", "Avoid unnecessary medications", "Eat liver-supportive foods (leafy greens)"] },
      { name: "AST", unit: "U/L", low: 10, high: 40, optimalLow: 12, optimalHigh: 25,
        what: "Found in liver and muscle — can rise from intense exercise or liver issues.",
        tips: ["Allow recovery between workouts", "Reduce alcohol", "Stay hydrated"] },
      { name: "Creatinine", unit: "mg/dL", low: 0.7, high: 1.3, optimalLow: 0.8, optimalHigh: 1.1,
        what: "Kidney filtration marker — reflects how well your kidneys clear waste.",
        tips: ["Stay well hydrated", "Moderate protein if very high", "Monitor with eGFR"] },
      { name: "BUN", unit: "mg/dL", low: 7, high: 20, optimalLow: 10, optimalHigh: 16,
        what: "Blood urea nitrogen — another kidney function indicator, also affected by diet.",
        tips: ["Drink adequate water", "Balance protein intake", "Check kidney function if persistently high"] },
    ],
  },
  "Cognitive & Neuro": {
    icon: Brain, color: "45, 93%, 47%",
    desc: "Vitamins and nutrients essential for brain health, mood, and nerve function.",
    markers: [
      { name: "Vitamin D (25-OH)", unit: "ng/mL", low: 40, high: 80, optimalLow: 50, optimalHigh: 70,
        what: "The sunshine vitamin — critical for immunity, bones, mood, and hormone production.",
        tips: ["15–20 min daily sun exposure", "Supplement D3 + K2", "Test levels seasonally"] },
      { name: "Vitamin B12", unit: "pg/mL", low: 200, high: 900, optimalLow: 400, optimalHigh: 700,
        what: "Essential for nerve function, red blood cells, and energy production.",
        tips: ["Eat animal proteins or supplement", "Methylcobalamin form preferred", "Check if on metformin"] },
      { name: "Folate", unit: "ng/mL", low: 2.7, high: 17, optimalLow: 5, optimalHigh: 12,
        what: "B-vitamin for DNA repair, cell division, and cardiovascular protection.",
        tips: ["Leafy greens, legumes, citrus", "Methylfolate if MTHFR+", "Pair with B12"] },
    ],
  },
};

type Grade = "critical" | "low" | "normal" | "optimal" | "high" | "critical_high";

function getGrade(value: number, m: MarkerDef): Grade {
  if (value < m.low * 0.8) return "critical";
  if (value < m.low) return "low";
  if (value >= m.optimalLow && value <= m.optimalHigh) return "optimal";
  if (value > m.high * 1.2) return "critical_high";
  if (value > m.high) return "high";
  return "normal";
}

const gradeInfo: Record<Grade, { label: string; color: string; dotColor: string }> = {
  critical: { label: "Critical", color: "text-red-400", dotColor: "#ef4444" },
  low: { label: "Low", color: "text-orange-400", dotColor: "#f97316" },
  normal: { label: "In Range", color: "text-blue-400", dotColor: "#60a5fa" },
  optimal: { label: "Optimal", color: "text-emerald-400", dotColor: "#34d399" },
  high: { label: "High", color: "text-amber-400", dotColor: "#f59e0b" },
  critical_high: { label: "Critical", color: "text-red-400", dotColor: "#ef4444" },
};

function TrendBadge({ results }: { results: BiomarkerResult[] }) {
  if (results.length < 2) return null;
  const diff = ((results[0].value - results[1].value) / results[1].value) * 100;
  if (Math.abs(diff) < 1) return null;
  const isUp = diff > 0;
  return (
    <span className={`inline-flex items-center gap-0.5 text-[10px] font-body ${isUp ? "text-emerald-400/70" : "text-orange-400/70"}`}>
      {isUp ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
      {Math.abs(diff).toFixed(0)}%
    </span>
  );
}

/* ── Simple Range Bar ── */
function RangeBar({ value, marker }: { value: number; marker: MarkerDef }) {
  const { low, high, optimalLow, optimalHigh } = marker;
  const range = high - low;
  const pad = range * 0.35;
  const min = low - pad;
  const max = high + pad;
  const total = max - min;
  const toPct = (v: number) => Math.max(0, Math.min(100, ((v - min) / total) * 100));
  const grade = getGrade(value, marker);

  return (
    <div className="relative h-2 w-full rounded-full overflow-hidden mt-2" style={{ background: "hsl(0 0% 100% / 0.04)" }}>
      {/* Optimal zone */}
      <div
        className="absolute h-full"
        style={{
          left: `${toPct(optimalLow)}%`,
          width: `${toPct(optimalHigh) - toPct(optimalLow)}%`,
          background: "hsl(152 69% 50% / 0.2)",
          borderRadius: 4,
        }}
      />
      {/* Value indicator */}
      <motion.div
        className="absolute top-1/2 w-3 h-3 rounded-full border-2"
        style={{
          backgroundColor: gradeInfo[grade].dotColor,
          borderColor: "hsl(0 0% 8%)",
          boxShadow: `0 0 8px ${gradeInfo[grade].dotColor}60`,
          transform: "translate(-50%, -50%)",
        }}
        initial={{ left: "50%", opacity: 0 }}
        animate={{ left: `${toPct(value)}%`, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.1 }}
      />
    </div>
  );
}

/* ── Simple Trend Chart ── */
function TrendChart({ results, marker, catColor }: { results: BiomarkerResult[]; marker: MarkerDef; catColor: string }) {
  const data = [...results].reverse().map((r) => ({
    date: new Date(r.lab_date).toLocaleDateString("en-US", { month: "short", year: "2-digit" }),
    value: r.value,
  }));

  const vals = data.map(d => d.value);
  const yMin = Math.min(marker.low * 0.7, ...vals);
  const yMax = Math.max(marker.high * 1.3, ...vals);
  const col = `hsl(${catColor})`;

  return (
    <motion.div
      className="h-32 mt-3"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 5, right: 5, left: -15, bottom: 0 }}>
          <defs>
            <linearGradient id={`g-${marker.name}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={col} stopOpacity={0.12} />
              <stop offset="100%" stopColor={col} stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="date" tick={{ fontSize: 9, fill: "hsl(0 0% 100% / 0.25)" }} axisLine={false} tickLine={false} />
          <YAxis domain={[yMin, yMax]} tick={{ fontSize: 9, fill: "hsl(0 0% 100% / 0.25)" }} axisLine={false} tickLine={false} width={35} />
          <Tooltip
            contentStyle={{ background: "hsl(0 0% 6%)", border: "1px solid hsl(0 0% 100% / 0.08)", borderRadius: 6, fontSize: 11 }}
            formatter={(val: number) => [`${val} ${marker.unit}`, ""]}
          />
          <ReferenceLine y={marker.optimalHigh} stroke="hsl(152 69% 50% / 0.15)" strokeDasharray="2 4" />
          <ReferenceLine y={marker.optimalLow} stroke="hsl(152 69% 50% / 0.15)" strokeDasharray="2 4" />
          <Area type="monotone" dataKey="value" fill={`url(#g-${marker.name})`} stroke="none" />
          <Line
            type="monotone" dataKey="value"
            stroke={col} strokeWidth={2}
            dot={{ r: 4, fill: col, strokeWidth: 2, stroke: "hsl(0 0% 6%)" }}
            activeDot={{ r: 6, fill: col, strokeWidth: 2, stroke: "hsl(0 0% 6%)" }}
            animationDuration={800}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </motion.div>
  );
}

export default function PremierMarkers() {
  const { user } = useAuth();
  const [results, setResults] = useState<BiomarkerResult[]>([]);
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [openMarker, setOpenMarker] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("biomarker_results")
      .select("*")
      .eq("user_id", user.id)
      .order("lab_date", { ascending: false })
      .then(({ data }) => { if (data) setResults(data as BiomarkerResult[]); });
  }, [user]);

  const getMarkerResults = (name: string) => results.filter((r) => r.marker_name === name);

  const getCatStats = (catName: string) => {
    const markers = categoryConfig[catName].markers;
    const tested = markers.filter(m => getMarkerResults(m.name).length > 0);
    const optimal = tested.filter(m => getGrade(getMarkerResults(m.name)[0].value, m) === "optimal");
    return { tested: tested.length, total: markers.length, optimal: optimal.length };
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-heading font-light text-foreground">Premier Markers</h2>
        <p className="text-xs text-muted-foreground/60 font-body font-light mt-0.5">
          Tap any category to see your results, what they mean, and how to improve.
        </p>
      </div>

      {/* Categories */}
      <div className="space-y-2">
        {Object.entries(categoryConfig).map(([catName, config], idx) => {
          const Icon = config.icon;
          const stats = getCatStats(catName);
          const isOpen = openCategory === catName;

          return (
            <motion.div
              key={catName}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04, duration: 0.3 }}
            >
              {/* Category header */}
              <button
                onClick={() => { setOpenCategory(isOpen ? null : catName); setOpenMarker(null); }}
                className="w-full flex items-center gap-3 px-4 py-3.5 rounded-lg transition-all duration-200"
                style={{
                  background: isOpen ? `hsl(${config.color} / 0.06)` : "hsl(0 0% 100% / 0.02)",
                  border: `1px solid ${isOpen ? `hsl(${config.color} / 0.2)` : "hsl(0 0% 100% / 0.04)"}`,
                }}
              >
                <div className="p-1.5 rounded-md" style={{ background: `hsl(${config.color} / 0.1)` }}>
                  <Icon size={14} strokeWidth={1.5} style={{ color: `hsl(${config.color})` }} />
                </div>
                <div className="flex-1 text-left">
                  <span className="text-sm font-body font-light text-foreground/90">{catName}</span>
                  {stats.tested > 0 && (
                    <span className="text-[10px] text-muted-foreground/40 ml-2">
                      {stats.optimal}/{stats.tested} optimal
                    </span>
                  )}
                </div>
                {stats.tested > 0 ? (
                  <div className="flex gap-0.5">
                    {categoryConfig[catName].markers.map((m) => {
                      const mr = getMarkerResults(m.name);
                      if (mr.length === 0) return <div key={m.name} className="w-1.5 h-1.5 rounded-full bg-muted/20" />;
                      const g = getGrade(mr[0].value, m);
                      return <div key={m.name} className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: gradeInfo[g].dotColor }} />;
                    })}
                  </div>
                ) : (
                  <span className="text-[10px] text-muted-foreground/30">No data</span>
                )}
                <motion.div animate={{ rotate: isOpen ? 90 : 0 }} transition={{ duration: 0.15 }}>
                  <ChevronRight size={14} className="text-muted-foreground/30" />
                </motion.div>
              </button>

              {/* Expanded markers */}
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <p className="text-[11px] text-muted-foreground/40 font-body font-light px-4 pt-2 pb-1">
                      {config.desc}
                    </p>
                    <div className="space-y-0.5 pt-1 pb-2">
                      {config.markers.map((marker, mIdx) => {
                        const markerResults = getMarkerResults(marker.name);
                        const latest = markerResults[0];
                        const grade = latest ? getGrade(latest.value, marker) : null;
                        const gi = grade ? gradeInfo[grade] : null;
                        const isMarkerOpen = openMarker === marker.name;

                        return (
                          <motion.div
                            key={marker.name}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: mIdx * 0.04 }}
                          >
                            <button
                              onClick={() => setOpenMarker(isMarkerOpen ? null : marker.name)}
                              className="w-full px-4 py-2.5 flex items-center gap-3 text-left rounded-md transition-colors hover:bg-white/[0.02]"
                            >
                              {/* Grade dot */}
                              <div
                                className="w-2 h-2 rounded-full flex-shrink-0"
                                style={{ backgroundColor: gi ? gi.dotColor : "hsl(0 0% 100% / 0.08)" }}
                              />
                              {/* Name */}
                              <span className="flex-1 text-[13px] font-body font-light text-foreground/75">
                                {marker.name}
                              </span>
                              {/* Value + grade */}
                              {latest ? (
                                <div className="flex items-center gap-2">
                                  <TrendBadge results={markerResults} />
                                  <span className="text-base font-heading font-light text-foreground tabular-nums">
                                    {latest.value}
                                  </span>
                                  <span className="text-[9px] text-muted-foreground/40">{marker.unit}</span>
                                  <Badge
                                    variant="outline"
                                    className={`text-[8px] tracking-wider uppercase border-0 px-1.5 py-0 ${gi!.color}`}
                                    style={{ background: "hsl(0 0% 100% / 0.03)" }}
                                  >
                                    {gi!.label}
                                  </Badge>
                                </div>
                              ) : (
                                <span className="text-[10px] text-muted-foreground/25">—</span>
                              )}
                            </button>

                            {/* Range bar always visible when has data */}
                            {latest && (
                              <div className="px-4 pb-1">
                                <RangeBar value={latest.value} marker={marker} />
                              </div>
                            )}

                            {/* Expanded: explanation + tips + chart */}
                            <AnimatePresence>
                              {isMarkerOpen && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: "auto" }}
                                  exit={{ opacity: 0, height: 0 }}
                                  transition={{ duration: 0.25 }}
                                  className="overflow-hidden"
                                >
                                  <div className="px-4 pb-4 space-y-3">
                                    {/* What it means */}
                                    <div className="flex gap-2 items-start p-3 rounded-md" style={{ background: "hsl(0 0% 100% / 0.02)" }}>
                                      <Info size={13} className="text-muted-foreground/40 mt-0.5 flex-shrink-0" />
                                      <div>
                                        <p className="text-[11px] text-foreground/60 font-body font-light leading-relaxed">
                                          {marker.what}
                                        </p>
                                        {latest && (
                                          <p className="text-[10px] mt-1.5 font-body font-light" style={{ color: `hsl(${config.color} / 0.7)` }}>
                                            Optimal range: {marker.optimalLow}–{marker.optimalHigh} {marker.unit}
                                          </p>
                                        )}
                                      </div>
                                    </div>

                                    {/* Improvement tips */}
                                    {grade && grade !== "optimal" && (
                                      <div className="p-3 rounded-md" style={{ background: "hsl(0 0% 100% / 0.015)" }}>
                                        <p className="text-[10px] tracking-[0.15em] uppercase text-muted-foreground/50 font-body mb-2">
                                          How to improve
                                        </p>
                                        <div className="space-y-1.5">
                                          {marker.tips.map((tip, i) => (
                                            <div key={i} className="flex items-start gap-2">
                                              <div className="w-1 h-1 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: `hsl(${config.color} / 0.5)` }} />
                                              <span className="text-[11px] text-foreground/50 font-body font-light">{tip}</span>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    )}

                                    {grade === "optimal" && (
                                      <div className="p-3 rounded-md flex items-center gap-2" style={{ background: "hsl(152 69% 50% / 0.05)" }}>
                                        <span className="text-emerald-400 text-sm">✓</span>
                                        <span className="text-[11px] text-emerald-400/70 font-body font-light">
                                          This marker is in the optimal range — keep doing what you're doing.
                                        </span>
                                      </div>
                                    )}

                                    {/* Trend chart */}
                                    {markerResults.length > 1 && (
                                      <TrendChart results={markerResults} marker={marker} catColor={config.color} />
                                    )}

                                    {/* History */}
                                    {markerResults.length > 0 && (
                                      <div className="space-y-0.5">
                                        {markerResults.map((r) => {
                                          const rg = getGrade(r.value, marker);
                                          return (
                                            <div key={r.id} className="flex items-center justify-between py-1 px-1 text-[10px] font-body font-light">
                                              <span className="text-muted-foreground/40">
                                                {new Date(r.lab_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                                              </span>
                                              <span className={gradeInfo[rg].color}>
                                                {r.value} {marker.unit}
                                              </span>
                                            </div>
                                          );
                                        })}
                                      </div>
                                    )}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </motion.div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Empty state */}
      {results.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-lg border border-border/20 p-10 text-center"
          style={{ background: "hsl(0 0% 100% / 0.015)" }}
        >
          <motion.div animate={{ y: [0, -4, 0] }} transition={{ duration: 3, repeat: Infinity }}>
            <Activity size={24} strokeWidth={1} className="text-primary/25 mx-auto mb-3" />
          </motion.div>
          <p className="text-xs text-muted-foreground/40 font-body font-light">
            Upload your bloodwork above — AI will read it and chart your markers automatically.
          </p>
        </motion.div>
      )}
    </div>
  );
}
