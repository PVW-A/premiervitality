import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Droplets, Heart, Flame, Brain, ShieldCheck, TrendingUp, TrendingDown, Minus, ChevronDown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";
import { Line, XAxis, YAxis, ResponsiveContainer, Tooltip, Bar, ComposedChart, Cell, ReferenceLine } from "recharts";

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

const categoryConfig: Record<string, { icon: any; markers: MarkerDef[] }> = {
  Hormones: {
    icon: Activity,
    markers: [
      { name: "Testosterone (Total)", unit: "ng/dL", low: 300, high: 1000, optimalLow: 500, optimalHigh: 800 },
      { name: "Free Testosterone", unit: "ng/dL", low: 9, high: 30, optimalLow: 15, optimalHigh: 25 },
      { name: "Estradiol (E2)", unit: "pg/mL", low: 20, high: 50, optimalLow: 25, optimalHigh: 40 },
      { name: "IGF-1", unit: "ng/mL", low: 100, high: 300, optimalLow: 150, optimalHigh: 250 },
      { name: "DHEA-S", unit: "µg/dL", low: 100, high: 400, optimalLow: 200, optimalHigh: 350 },
    ],
  },
  "Metabolic Panel": {
    icon: Flame,
    markers: [
      { name: "Fasting Glucose", unit: "mg/dL", low: 70, high: 99, optimalLow: 75, optimalHigh: 90 },
      { name: "HbA1c", unit: "%", low: 4.0, high: 5.7, optimalLow: 4.5, optimalHigh: 5.2 },
      { name: "Insulin (Fasting)", unit: "µIU/mL", low: 2, high: 25, optimalLow: 3, optimalHigh: 10 },
    ],
  },
  Thyroid: {
    icon: ShieldCheck,
    markers: [
      { name: "TSH", unit: "mIU/L", low: 0.4, high: 4.0, optimalLow: 1.0, optimalHigh: 2.5 },
      { name: "Free T3", unit: "pg/mL", low: 2.3, high: 4.2, optimalLow: 3.0, optimalHigh: 3.8 },
      { name: "Free T4", unit: "ng/dL", low: 0.8, high: 1.8, optimalLow: 1.0, optimalHigh: 1.5 },
    ],
  },
  Inflammation: {
    icon: Heart,
    markers: [
      { name: "hs-CRP", unit: "mg/L", low: 0, high: 1.0, optimalLow: 0, optimalHigh: 0.5 },
      { name: "Homocysteine", unit: "µmol/L", low: 5, high: 15, optimalLow: 6, optimalHigh: 10 },
      { name: "ESR", unit: "mm/hr", low: 0, high: 20, optimalLow: 0, optimalHigh: 10 },
    ],
  },
  "Liver & Kidney": {
    icon: Droplets,
    markers: [
      { name: "ALT", unit: "U/L", low: 7, high: 56, optimalLow: 10, optimalHigh: 30 },
      { name: "AST", unit: "U/L", low: 10, high: 40, optimalLow: 12, optimalHigh: 25 },
      { name: "Creatinine", unit: "mg/dL", low: 0.7, high: 1.3, optimalLow: 0.8, optimalHigh: 1.1 },
      { name: "BUN", unit: "mg/dL", low: 7, high: 20, optimalLow: 10, optimalHigh: 16 },
    ],
  },
  "Cognitive & Neuro": {
    icon: Brain,
    markers: [
      { name: "Vitamin D (25-OH)", unit: "ng/mL", low: 40, high: 80, optimalLow: 50, optimalHigh: 70 },
      { name: "Vitamin B12", unit: "pg/mL", low: 200, high: 900, optimalLow: 400, optimalHigh: 700 },
      { name: "Folate", unit: "ng/mL", low: 2.7, high: 17, optimalLow: 5, optimalHigh: 12 },
    ],
  },
};

type GradeLevel = "critical_low" | "below" | "normal" | "optimal" | "excellent" | "normal_high" | "above" | "critical_high" | "pending";

function getGrade(value: number, m: MarkerDef): GradeLevel {
  if (value < m.low * 0.8) return "critical_low";
  if (value < m.low) return "below";
  if (value < m.optimalLow) return "normal";
  if (value <= m.optimalHigh) return "excellent";
  if (value > m.optimalHigh && value <= m.high) return "normal_high";
  if (value > m.high && value <= m.high * 1.2) return "above";
  if (value > m.high * 1.2) return "critical_high";
  return "optimal";
}

const gradeConfig: Record<GradeLevel, { label: string; color: string; bg: string; emoji: string }> = {
  critical_low: { label: "Critical Low", color: "text-red-400", bg: "bg-red-500/20 border-red-500/40", emoji: "🔴" },
  below: { label: "Below Range", color: "text-orange-400", bg: "bg-orange-500/20 border-orange-500/40", emoji: "🟠" },
  normal: { label: "Normal", color: "text-blue-400", bg: "bg-blue-500/20 border-blue-500/40", emoji: "🔵" },
  optimal: { label: "Optimal", color: "text-emerald-400", bg: "bg-emerald-500/20 border-emerald-500/40", emoji: "🟢" },
  excellent: { label: "Excellent", color: "text-emerald-300", bg: "bg-emerald-400/20 border-emerald-400/40", emoji: "✨" },
  normal_high: { label: "Normal High", color: "text-blue-400", bg: "bg-blue-500/20 border-blue-500/40", emoji: "🔵" },
  above: { label: "Above Range", color: "text-yellow-400", bg: "bg-yellow-500/20 border-yellow-500/40", emoji: "🟡" },
  critical_high: { label: "Critical High", color: "text-red-400", bg: "bg-red-500/20 border-red-500/40", emoji: "🔴" },
  pending: { label: "Awaiting Labs", color: "text-muted-foreground", bg: "bg-muted border-border", emoji: "⏳" },
};

function TrendIcon({ results }: { results: BiomarkerResult[] }) {
  if (results.length < 2) return <Minus size={14} className="text-muted-foreground" />;
  const latest = results[0].value;
  const previous = results[1].value;
  const diff = ((latest - previous) / previous) * 100;
  if (Math.abs(diff) < 1) return <Minus size={14} className="text-muted-foreground" />;
  if (diff > 0) return <TrendingUp size={14} className="text-emerald-400" />;
  return <TrendingDown size={14} className="text-orange-400" />;
}

/* ── Gradient Range Bar ── */
function GradientRangeBar({ value, marker, animate = true }: { value: number; marker: MarkerDef; animate?: boolean }) {
  const { low, high, optimalLow, optimalHigh } = marker;
  const range = high - low;
  const padMin = low - range * 0.4;
  const padMax = high + range * 0.4;
  const total = padMax - padMin;

  const toPct = (v: number) => Math.max(0, Math.min(100, ((v - padMin) / total) * 100));

  const lowPct = toPct(low);
  const optLowPct = toPct(optimalLow);
  const optHighPct = toPct(optimalHigh);
  const highPct = toPct(high);
  const valuePct = toPct(value);

  const grade = getGrade(value, marker);
  const dotColor =
    grade === "excellent" || grade === "optimal" ? "hsl(152, 69%, 50%)" :
    grade === "normal" || grade === "normal_high" ? "hsl(217, 91%, 60%)" :
    grade === "below" || grade === "above" ? "hsl(38, 92%, 50%)" :
    "hsl(0, 72%, 51%)";

  return (
    <div className="relative h-3 w-full mt-3 mb-1">
      {/* Background track */}
      <div className="absolute inset-0 rounded-full bg-muted/50 overflow-hidden">
        {/* Red zone left */}
        <div className="absolute h-full bg-red-500/15 rounded-l-full" style={{ left: 0, width: `${lowPct}%` }} />
        {/* Orange zone - normal low */}
        <div className="absolute h-full bg-blue-500/15" style={{ left: `${lowPct}%`, width: `${optLowPct - lowPct}%` }} />
        {/* Green zone - optimal */}
        <div
          className="absolute h-full"
          style={{
            left: `${optLowPct}%`,
            width: `${optHighPct - optLowPct}%`,
            background: "linear-gradient(90deg, hsl(152, 69%, 50%, 0.2), hsl(152, 69%, 50%, 0.35), hsl(152, 69%, 50%, 0.2))",
          }}
        />
        {/* Blue zone - normal high */}
        <div className="absolute h-full bg-blue-500/15" style={{ left: `${optHighPct}%`, width: `${highPct - optHighPct}%` }} />
        {/* Red zone right */}
        <div className="absolute h-full bg-red-500/15 rounded-r-full" style={{ left: `${highPct}%`, width: `${100 - highPct}%` }} />
      </div>

      {/* Zone labels */}
      <div className="absolute -bottom-4 text-[8px] text-muted-foreground/50 font-body" style={{ left: `${(optLowPct + optHighPct) / 2}%`, transform: "translateX(-50%)" }}>
        optimal
      </div>

      {/* Value dot */}
      <motion.div
        className="absolute top-1/2 z-10"
        initial={animate ? { left: "50%", opacity: 0, scale: 0 } : false}
        animate={{ left: `${valuePct}%`, opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 120, damping: 15, delay: 0.1 }}
        style={{ transform: "translate(-50%, -50%)" }}
      >
        <div className="relative">
          <div
            className="w-4 h-4 rounded-full border-2 border-background shadow-lg"
            style={{ backgroundColor: dotColor, boxShadow: `0 0 10px ${dotColor}80` }}
          />
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{ backgroundColor: dotColor }}
            animate={{ scale: [1, 1.8, 1], opacity: [0.4, 0, 0.4] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
    </div>
  );
}

/* ── Trend Sparkline with Bar + Line combo ── */
function TrendChart({ results, marker }: { results: BiomarkerResult[]; marker: MarkerDef }) {
  const data = [...results].reverse().map((r, i) => ({
    date: new Date(r.lab_date).toLocaleDateString("en-US", { month: "short", year: "2-digit" }),
    value: r.value,
    grade: getGrade(r.value, marker),
    index: i,
  }));

  const barColor = (grade: GradeLevel) => {
    if (grade === "excellent" || grade === "optimal") return "hsl(152, 69%, 50%)";
    if (grade === "normal" || grade === "normal_high") return "hsl(217, 91%, 60%)";
    if (grade === "below" || grade === "above") return "hsl(38, 92%, 50%)";
    return "hsl(0, 72%, 51%)";
  };

  const allValues = data.map((d) => d.value);
  const minVal = Math.min(marker.low * 0.7, ...allValues);
  const maxVal = Math.max(marker.high * 1.3, ...allValues);

  return (
    <motion.div
      className="h-40 mt-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="lineGlow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.6} />
              <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="date"
            tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            domain={[minVal, maxVal]}
            tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
            axisLine={false}
            tickLine={false}
            width={40}
          />
          <Tooltip
            contentStyle={{
              background: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: 8,
              fontSize: 12,
              fontFamily: "var(--font-body)",
              boxShadow: "0 8px 32px hsl(var(--primary) / 0.15)",
            }}
            labelStyle={{ color: "hsl(var(--foreground))" }}
            formatter={(val: number) => [`${val} ${marker.unit}`, marker.name]}
          />
          {/* Optimal zone band */}
          <ReferenceLine y={marker.optimalHigh} stroke="hsl(152, 69%, 50%)" strokeDasharray="3 6" strokeOpacity={0.3} />
          <ReferenceLine y={marker.optimalLow} stroke="hsl(152, 69%, 50%)" strokeDasharray="3 6" strokeOpacity={0.3} />
          <ReferenceLine y={marker.high} stroke="hsl(0, 72%, 51%)" strokeDasharray="4 4" strokeOpacity={0.2} />
          <ReferenceLine y={marker.low} stroke="hsl(0, 72%, 51%)" strokeDasharray="4 4" strokeOpacity={0.2} />
          {/* Bars for each reading */}
          <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={28} animationDuration={800} animationEasing="ease-out">
            {data.map((entry, idx) => (
              <Cell key={idx} fill={barColor(entry.grade)} fillOpacity={0.3} />
            ))}
          </Bar>
          {/* Trend line on top */}
          <Line
            type="monotone"
            dataKey="value"
            stroke="hsl(var(--primary))"
            strokeWidth={2.5}
            dot={{ r: 5, fill: "hsl(var(--primary))", strokeWidth: 2, stroke: "hsl(var(--background))" }}
            activeDot={{ r: 8, fill: "hsl(var(--primary))", strokeWidth: 3, stroke: "hsl(var(--background))" }}
            animationDuration={1200}
            animationEasing="ease-out"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </motion.div>
  );
}

export default function PremierMarkers() {
  const { user } = useAuth();
  const [results, setResults] = useState<BiomarkerResult[]>([]);
  const [expandedMarker, setExpandedMarker] = useState<string | null>(null);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("biomarker_results")
      .select("*")
      .eq("user_id", user.id)
      .order("lab_date", { ascending: false })
      .then(({ data }) => {
        if (data) setResults(data as BiomarkerResult[]);
      });
  }, [user]);

  const getMarkerResults = (markerName: string) =>
    results.filter((r) => r.marker_name === markerName);

  const getCategorySummary = (catName: string) => {
    const catMarkers = categoryConfig[catName].markers;
    const tested = catMarkers.filter((m) => getMarkerResults(m.name).length > 0);
    const excellent = tested.filter((m) => {
      const r = getMarkerResults(m.name);
      const g = getGrade(r[0].value, m);
      return g === "excellent" || g === "optimal";
    });
    return { tested: tested.length, total: catMarkers.length, excellent: excellent.length };
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-heading font-light text-foreground">Premier Markers</h2>
        <p className="text-sm text-muted-foreground font-body font-light mt-1">
          Track your biomarkers over time — see where you've been, where you are, and where you're headed.
        </p>
      </div>

      {/* Category summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {Object.entries(categoryConfig).map(([catName, config], catIdx) => {
          const Icon = config.icon;
          const summary = getCategorySummary(catName);
          const isActive = expandedCategory === catName;
          return (
            <motion.button
              key={catName}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: catIdx * 0.08, duration: 0.4 }}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setExpandedCategory(isActive ? null : catName)}
              className={`text-left p-4 border rounded-lg transition-all duration-300 ${
                isActive
                  ? "border-primary/60 bg-primary/5 shadow-[0_0_20px_hsl(var(--primary)/0.1)]"
                  : "border-border bg-card hover:border-primary/30 hover:shadow-[0_4px_16px_hsl(var(--primary)/0.05)]"
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <motion.div
                  animate={isActive ? { rotate: [0, -10, 10, 0] } : {}}
                  transition={{ duration: 0.5 }}
                >
                  <Icon size={14} strokeWidth={1.2} className="text-primary" />
                </motion.div>
                <span className="text-xs tracking-[0.15em] uppercase text-foreground font-body font-light">
                  {catName}
                </span>
              </div>
              {summary.tested > 0 ? (
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-heading font-light text-foreground">
                    {summary.excellent}/{summary.tested}
                  </span>
                  <span className="text-xs text-muted-foreground font-body font-light">optimal</span>
                </div>
              ) : (
                <span className="text-xs text-muted-foreground font-body font-light italic">No labs yet</span>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Expanded category */}
      <AnimatePresence mode="wait">
        {expandedCategory && (
          <motion.div
            key={expandedCategory}
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            <Card className="border-border bg-card overflow-hidden">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg font-heading font-light text-foreground">
                  {(() => { const Icon = categoryConfig[expandedCategory].icon; return <Icon size={18} strokeWidth={1.2} className="text-primary" />; })()}
                  {expandedCategory}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                {categoryConfig[expandedCategory].markers.map((marker, mIdx) => {
                  const markerResults = getMarkerResults(marker.name);
                  const latest = markerResults[0];
                  const grade = latest ? getGrade(latest.value, marker) : "pending";
                  const gc = gradeConfig[grade];
                  const isExpanded = expandedMarker === marker.name;

                  return (
                    <motion.div
                      key={marker.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: mIdx * 0.06, duration: 0.3 }}
                      className="border-b border-border/50 last:border-0 pb-5 pt-3 last:pb-0"
                    >
                      <button
                        onClick={() => setExpandedMarker(isExpanded ? null : marker.name)}
                        className="w-full flex items-center justify-between text-left group"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-body font-light text-foreground group-hover:text-primary transition-colors">
                              {marker.name}
                            </span>
                            {markerResults.length > 1 && <TrendIcon results={markerResults} />}
                          </div>
                          <span className="text-[10px] text-muted-foreground/60 font-body font-light">
                            Range: {marker.low}–{marker.high} {marker.unit} · Optimal: {marker.optimalLow}–{marker.optimalHigh}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          {latest && (
                            <motion.span
                              className="text-lg font-heading font-light text-foreground"
                              key={latest.value}
                              initial={{ scale: 0.8, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ type: "spring", stiffness: 200 }}
                            >
                              {latest.value}{" "}
                              <span className="text-[10px] text-muted-foreground font-body">{marker.unit}</span>
                            </motion.span>
                          )}
                          <Badge variant="outline" className={`text-[9px] ${gc.bg} ${gc.color}`}>
                            <span className="mr-1">{gc.emoji}</span>
                            {gc.label}
                          </Badge>
                          {markerResults.length > 0 && (
                            <motion.div
                              animate={{ rotate: isExpanded ? 180 : 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              <ChevronDown size={14} className="text-muted-foreground" />
                            </motion.div>
                          )}
                        </div>
                      </button>

                      {latest && <GradientRangeBar value={latest.value} marker={marker} />}

                      <AnimatePresence>
                        {isExpanded && markerResults.length > 0 && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.35, ease: "easeInOut" }}
                            className="overflow-hidden"
                          >
                            {markerResults.length > 1 && (
                              <TrendChart results={markerResults} marker={marker} />
                            )}

                            <div className="mt-4 space-y-1.5">
                              {markerResults.map((r, rIdx) => {
                                const rGrade = getGrade(r.value, marker);
                                const rGc = gradeConfig[rGrade];
                                return (
                                  <motion.div
                                    key={r.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: rIdx * 0.05 }}
                                    className="flex items-center justify-between text-xs font-body font-light px-2 py-1.5 rounded-md hover:bg-muted/30 transition-colors"
                                  >
                                    <span className="text-muted-foreground">
                                      {new Date(r.lab_date).toLocaleDateString("en-US", {
                                        month: "long",
                                        day: "numeric",
                                        year: "numeric",
                                      })}
                                    </span>
                                    <div className="flex items-center gap-2">
                                      <span className={rGc.color}>
                                        {r.value} {marker.unit}
                                      </span>
                                      <span className="text-[9px]">{rGc.emoji}</span>
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
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {results.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="border-border bg-card">
            <CardContent className="py-12 text-center">
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <Activity size={32} strokeWidth={1} className="text-primary/40 mx-auto mb-4" />
              </motion.div>
              <p className="text-sm text-muted-foreground font-body font-light">
                No lab results yet. Upload your bloodwork and AI will automatically extract and chart your biomarkers.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
