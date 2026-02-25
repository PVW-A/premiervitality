import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Activity, Droplets, Heart, Flame, Brain, ShieldCheck, TrendingUp, TrendingDown, Minus, ChevronDown } from "lucide-react";
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
}

const categoryConfig: Record<string, { icon: any; color: string; markers: MarkerDef[] }> = {
  Hormones: {
    icon: Activity, color: "168, 85%, 57%",
    markers: [
      { name: "Testosterone (Total)", unit: "ng/dL", low: 300, high: 1000, optimalLow: 500, optimalHigh: 800 },
      { name: "Free Testosterone", unit: "ng/dL", low: 9, high: 30, optimalLow: 15, optimalHigh: 25 },
      { name: "Estradiol (E2)", unit: "pg/mL", low: 20, high: 50, optimalLow: 25, optimalHigh: 40 },
      { name: "IGF-1", unit: "ng/mL", low: 100, high: 300, optimalLow: 150, optimalHigh: 250 },
      { name: "DHEA-S", unit: "µg/dL", low: 100, high: 400, optimalLow: 200, optimalHigh: 350 },
    ],
  },
  "Metabolic Panel": {
    icon: Flame, color: "25, 95%, 53%",
    markers: [
      { name: "Fasting Glucose", unit: "mg/dL", low: 70, high: 99, optimalLow: 75, optimalHigh: 90 },
      { name: "HbA1c", unit: "%", low: 4.0, high: 5.7, optimalLow: 4.5, optimalHigh: 5.2 },
      { name: "Insulin (Fasting)", unit: "µIU/mL", low: 2, high: 25, optimalLow: 3, optimalHigh: 10 },
    ],
  },
  Thyroid: {
    icon: ShieldCheck, color: "262, 83%, 58%",
    markers: [
      { name: "TSH", unit: "mIU/L", low: 0.4, high: 4.0, optimalLow: 1.0, optimalHigh: 2.5 },
      { name: "Free T3", unit: "pg/mL", low: 2.3, high: 4.2, optimalLow: 3.0, optimalHigh: 3.8 },
      { name: "Free T4", unit: "ng/dL", low: 0.8, high: 1.8, optimalLow: 1.0, optimalHigh: 1.5 },
    ],
  },
  Inflammation: {
    icon: Heart, color: "0, 84%, 60%",
    markers: [
      { name: "hs-CRP", unit: "mg/L", low: 0, high: 1.0, optimalLow: 0, optimalHigh: 0.5 },
      { name: "Homocysteine", unit: "µmol/L", low: 5, high: 15, optimalLow: 6, optimalHigh: 10 },
      { name: "ESR", unit: "mm/hr", low: 0, high: 20, optimalLow: 0, optimalHigh: 10 },
    ],
  },
  "Liver & Kidney": {
    icon: Droplets, color: "199, 89%, 48%",
    markers: [
      { name: "ALT", unit: "U/L", low: 7, high: 56, optimalLow: 10, optimalHigh: 30 },
      { name: "AST", unit: "U/L", low: 10, high: 40, optimalLow: 12, optimalHigh: 25 },
      { name: "Creatinine", unit: "mg/dL", low: 0.7, high: 1.3, optimalLow: 0.8, optimalHigh: 1.1 },
      { name: "BUN", unit: "mg/dL", low: 7, high: 20, optimalLow: 10, optimalHigh: 16 },
    ],
  },
  "Cognitive & Neuro": {
    icon: Brain, color: "45, 93%, 47%",
    markers: [
      { name: "Vitamin D (25-OH)", unit: "ng/mL", low: 40, high: 80, optimalLow: 50, optimalHigh: 70 },
      { name: "Vitamin B12", unit: "pg/mL", low: 200, high: 900, optimalLow: 400, optimalHigh: 700 },
      { name: "Folate", unit: "ng/mL", low: 2.7, high: 17, optimalLow: 5, optimalHigh: 12 },
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

const gradeInfo: Record<Grade, { label: string; dot: string; text: string }> = {
  critical: { label: "Critical", dot: "bg-red-500", text: "text-red-400" },
  low: { label: "Low", dot: "bg-orange-500", text: "text-orange-400" },
  normal: { label: "Normal", dot: "bg-blue-400", text: "text-blue-400" },
  optimal: { label: "Optimal", dot: "bg-emerald-400", text: "text-emerald-400" },
  high: { label: "High", dot: "bg-yellow-500", text: "text-yellow-400" },
  critical_high: { label: "Critical", dot: "bg-red-500", text: "text-red-400" },
};

function TrendIcon({ results }: { results: BiomarkerResult[] }) {
  if (results.length < 2) return <Minus size={12} className="text-muted-foreground/40" />;
  const diff = results[0].value - results[1].value;
  if (Math.abs(diff) < 0.5) return <Minus size={12} className="text-muted-foreground/40" />;
  return diff > 0
    ? <TrendingUp size={12} className="text-emerald-400" />
    : <TrendingDown size={12} className="text-orange-400" />;
}

/* ── Circular Progress Ring ── */
function ScoreRing({ score, total, catColor }: { score: number; total: number; catColor: string }) {
  const pct = total > 0 ? (score / total) * 100 : 0;
  const r = 20;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;

  return (
    <svg width="52" height="52" viewBox="0 0 52 52" className="flex-shrink-0">
      <circle cx="26" cy="26" r={r} fill="none" stroke="hsl(0 0% 100% / 0.06)" strokeWidth="4" />
      <motion.circle
        cx="26" cy="26" r={r} fill="none"
        stroke={`hsl(${catColor})`}
        strokeWidth="4" strokeLinecap="round"
        strokeDasharray={circ}
        initial={{ strokeDashoffset: circ }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
        transform="rotate(-90 26 26)"
      />
      <text x="26" y="26" textAnchor="middle" dominantBaseline="central"
        fill={`hsl(${catColor})`} fontSize="13" fontWeight="300" fontFamily="var(--font-heading)">
        {score}
      </text>
    </svg>
  );
}

/* ── Inline range indicator ── */
function RangeStrip({ value, marker }: { value: number; marker: MarkerDef }) {
  const { low, high, optimalLow, optimalHigh } = marker;
  const range = high - low;
  const pad = range * 0.4;
  const min = low - pad;
  const max = high + pad;
  const total = max - min;
  const toPct = (v: number) => Math.max(0, Math.min(100, ((v - min) / total) * 100));
  const grade = getGrade(value, marker);
  const dotCol = grade === "optimal" ? "#34d399" : grade === "normal" ? "#60a5fa" : grade === "low" || grade === "high" ? "#f59e0b" : "#ef4444";

  return (
    <div className="relative h-1.5 w-full rounded-full overflow-hidden" style={{ background: "hsl(0 0% 100% / 0.04)" }}>
      {/* Optimal zone */}
      <div
        className="absolute h-full rounded-full"
        style={{
          left: `${toPct(optimalLow)}%`,
          width: `${toPct(optimalHigh) - toPct(optimalLow)}%`,
          background: "linear-gradient(90deg, hsl(152 69% 50% / 0.15), hsl(152 69% 50% / 0.3), hsl(152 69% 50% / 0.15))",
        }}
      />
      {/* Normal zone left */}
      <div
        className="absolute h-full"
        style={{
          left: `${toPct(low)}%`,
          width: `${toPct(optimalLow) - toPct(low)}%`,
          background: "hsl(217 91% 60% / 0.1)",
        }}
      />
      {/* Normal zone right */}
      <div
        className="absolute h-full"
        style={{
          left: `${toPct(optimalHigh)}%`,
          width: `${toPct(high) - toPct(optimalHigh)}%`,
          background: "hsl(217 91% 60% / 0.1)",
        }}
      />
      {/* Value dot */}
      <motion.div
        className="absolute top-1/2 w-2.5 h-2.5 rounded-full"
        style={{ backgroundColor: dotCol, boxShadow: `0 0 6px ${dotCol}80`, transform: "translate(-50%, -50%)" }}
        initial={{ left: "50%", opacity: 0 }}
        animate={{ left: `${toPct(value)}%`, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 14, delay: 0.15 }}
      />
    </div>
  );
}

/* ── Trend Chart ── */
function TrendChart({ results, marker, catColor }: { results: BiomarkerResult[]; marker: MarkerDef; catColor: string }) {
  const data = [...results].reverse().map((r) => ({
    date: new Date(r.lab_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "2-digit" }),
    value: r.value,
  }));

  const vals = data.map(d => d.value);
  const yMin = Math.min(marker.low * 0.7, ...vals);
  const yMax = Math.max(marker.high * 1.3, ...vals);
  const hslColor = `hsl(${catColor})`;

  return (
    <motion.div
      className="h-36 mt-3"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 8, right: 8, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id={`grad-${marker.name}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={hslColor} stopOpacity={0.15} />
              <stop offset="100%" stopColor={hslColor} stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="date" tick={{ fontSize: 9, fill: "hsl(0 0% 100% / 0.3)" }} axisLine={false} tickLine={false} />
          <YAxis domain={[yMin, yMax]} tick={{ fontSize: 9, fill: "hsl(0 0% 100% / 0.3)" }} axisLine={false} tickLine={false} width={35} />
          <Tooltip
            contentStyle={{ background: "hsl(0 0% 8%)", border: "1px solid hsl(0 0% 100% / 0.1)", borderRadius: 8, fontSize: 11 }}
            labelStyle={{ color: "hsl(0 0% 70%)" }}
            formatter={(val: number) => [`${val} ${marker.unit}`, ""]}
          />
          {/* Optimal band */}
          <ReferenceLine y={marker.optimalHigh} stroke="hsl(152 69% 50% / 0.2)" strokeDasharray="2 4" />
          <ReferenceLine y={marker.optimalLow} stroke="hsl(152 69% 50% / 0.2)" strokeDasharray="2 4" />
          <ReferenceLine y={marker.high} stroke="hsl(0 72% 51% / 0.15)" strokeDasharray="3 6" />
          <ReferenceLine y={marker.low} stroke="hsl(0 72% 51% / 0.15)" strokeDasharray="3 6" />
          <Area type="monotone" dataKey="value" fill={`url(#grad-${marker.name})`} stroke="none" />
          <Line
            type="monotone" dataKey="value"
            stroke={hslColor} strokeWidth={2}
            dot={{ r: 4, fill: hslColor, strokeWidth: 2, stroke: "hsl(0 0% 6%)" }}
            activeDot={{ r: 7, fill: hslColor, strokeWidth: 3, stroke: "hsl(0 0% 6%)" }}
            animationDuration={1000}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </motion.div>
  );
}

export default function PremierMarkers() {
  const { user } = useAuth();
  const [results, setResults] = useState<BiomarkerResult[]>([]);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [expandedMarker, setExpandedMarker] = useState<string | null>(null);

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
    const optimal = tested.filter(m => {
      const r = getMarkerResults(m.name);
      return getGrade(r[0].value, m) === "optimal";
    });
    return { tested: tested.length, total: markers.length, optimal: optimal.length };
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-heading font-light text-foreground">Premier Markers</h2>
        <p className="text-xs text-muted-foreground font-body font-light mt-1">
          Your biomarker intelligence — past, present, and projected trajectory.
        </p>
      </div>

      {/* Category grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5">
        {Object.entries(categoryConfig).map(([catName, config], idx) => {
          const Icon = config.icon;
          const stats = getCatStats(catName);
          const isActive = expandedCategory === catName;

          return (
            <motion.button
              key={catName}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.06, duration: 0.35 }}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                setExpandedCategory(isActive ? null : catName);
                setExpandedMarker(null);
              }}
              className="relative overflow-hidden rounded-lg p-4 text-left transition-all duration-300"
              style={{
                background: isActive
                  ? `linear-gradient(135deg, hsl(${config.color} / 0.12), hsl(${config.color} / 0.04))`
                  : "hsl(0 0% 100% / 0.02)",
                border: `1px solid ${isActive ? `hsl(${config.color} / 0.3)` : "hsl(0 0% 100% / 0.06)"}`,
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-md" style={{ background: `hsl(${config.color} / 0.1)` }}>
                    <Icon size={13} strokeWidth={1.5} style={{ color: `hsl(${config.color})` }} />
                  </div>
                  <span className="text-[10px] tracking-[0.2em] uppercase text-foreground/70 font-body font-light">
                    {catName}
                  </span>
                </div>
                <ScoreRing score={stats.optimal} total={stats.tested} catColor={config.color} />
              </div>
              {stats.tested > 0 ? (
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xs font-body font-light" style={{ color: `hsl(${config.color} / 0.7)` }}>
                    {stats.optimal}/{stats.tested} optimal
                  </span>
                  <span className="text-[9px] text-muted-foreground/40">· {stats.total - stats.tested} pending</span>
                </div>
              ) : (
                <span className="text-[10px] text-muted-foreground/40 font-body font-light">No data yet</span>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Expanded markers panel */}
      <AnimatePresence mode="wait">
        {expandedCategory && (
          <motion.div
            key={expandedCategory}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div
              className="rounded-lg border p-5 space-y-1"
              style={{
                background: "hsl(0 0% 100% / 0.015)",
                borderColor: `hsl(${categoryConfig[expandedCategory].color} / 0.15)`,
              }}
            >
              {categoryConfig[expandedCategory].markers.map((marker, mIdx) => {
                const markerResults = getMarkerResults(marker.name);
                const latest = markerResults[0];
                const grade = latest ? getGrade(latest.value, marker) : ("pending" as const);
                const gi = grade !== "pending" ? gradeInfo[grade] : { label: "Pending", dot: "bg-muted", text: "text-muted-foreground" };
                const isOpen = expandedMarker === marker.name;
                const catColor = categoryConfig[expandedCategory].color;

                return (
                  <motion.div
                    key={marker.name}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: mIdx * 0.05, duration: 0.3 }}
                    className="rounded-md transition-colors"
                    style={{ background: isOpen ? "hsl(0 0% 100% / 0.02)" : "transparent" }}
                  >
                    <button
                      onClick={() => setExpandedMarker(isOpen ? null : marker.name)}
                      className="w-full px-3 py-3 flex items-center gap-3 text-left group"
                    >
                      {/* Grade dot */}
                      <motion.div
                        className={`w-2 h-2 rounded-full flex-shrink-0 ${gi.dot}`}
                        animate={grade === "optimal" ? { scale: [1, 1.3, 1], opacity: [1, 0.7, 1] } : {}}
                        transition={{ duration: 2.5, repeat: Infinity }}
                      />
                      {/* Name */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-body font-light text-foreground/80 group-hover:text-foreground transition-colors truncate">
                            {marker.name}
                          </span>
                          {markerResults.length > 1 && <TrendIcon results={markerResults} />}
                        </div>
                        <span className="text-[9px] text-muted-foreground/40 font-body">
                          {marker.optimalLow}–{marker.optimalHigh} {marker.unit} optimal
                        </span>
                      </div>
                      {/* Value */}
                      {latest ? (
                        <div className="flex items-center gap-2.5 flex-shrink-0">
                          <div className="text-right">
                            <motion.span
                              className="text-lg font-heading font-light text-foreground block leading-tight"
                              key={latest.value}
                              initial={{ y: -8, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                            >
                              {latest.value}
                            </motion.span>
                            <span className="text-[9px] text-muted-foreground/50 font-body">{marker.unit}</span>
                          </div>
                          <Badge
                            variant="outline"
                            className={`text-[8px] tracking-wider uppercase border-0 px-2 py-0.5 ${gi.text}`}
                            style={{ background: "hsl(0 0% 100% / 0.04)" }}
                          >
                            {gi.label}
                          </Badge>
                          <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                            <ChevronDown size={12} className="text-muted-foreground/30" />
                          </motion.div>
                        </div>
                      ) : (
                        <span className="text-[10px] text-muted-foreground/30 font-body">—</span>
                      )}
                    </button>

                    {/* Range strip always visible */}
                    {latest && (
                      <div className="px-3 pb-2">
                        <RangeStrip value={latest.value} marker={marker} />
                      </div>
                    )}

                    {/* Expanded detail */}
                    <AnimatePresence>
                      {isOpen && markerResults.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden px-3 pb-4"
                        >
                          {markerResults.length > 1 && (
                            <TrendChart results={markerResults} marker={marker} catColor={catColor} />
                          )}
                          <div className="mt-3 space-y-0.5">
                            {markerResults.map((r, rIdx) => {
                              const rGrade = getGrade(r.value, marker);
                              const rGi = gradeInfo[rGrade];
                              return (
                                <motion.div
                                  key={r.id}
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={{ delay: rIdx * 0.04 }}
                                  className="flex items-center justify-between py-1.5 px-2 rounded text-xs font-body font-light"
                                  style={{ background: rIdx === 0 ? "hsl(0 0% 100% / 0.02)" : "transparent" }}
                                >
                                  <span className="text-muted-foreground/60">
                                    {new Date(r.lab_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                                  </span>
                                  <div className="flex items-center gap-2">
                                    <span className={rGi.text}>{r.value} {marker.unit}</span>
                                    <div className={`w-1.5 h-1.5 rounded-full ${rGi.dot}`} />
                                  </div>
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
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty state */}
      {results.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="rounded-lg border border-border/30 p-12 text-center"
          style={{ background: "hsl(0 0% 100% / 0.015)" }}
        >
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <Activity size={28} strokeWidth={1} className="text-primary/30 mx-auto mb-3" />
          </motion.div>
          <p className="text-sm text-muted-foreground/50 font-body font-light">
            Upload your bloodwork — AI will extract and chart your biomarkers automatically.
          </p>
        </motion.div>
      )}
    </div>
  );
}
