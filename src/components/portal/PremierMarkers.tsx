import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, ChevronRight, ChevronDown, Info, Activity, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";
import { Line, XAxis, YAxis, ResponsiveContainer, Tooltip, ComposedChart, ReferenceLine, Area } from "recharts";
import {
  type BiomarkerResult,
  type MarkerDef,
  type CatConfig,
  categoryConfig,
  PRIMARY_CATEGORIES,
  SECONDARY_CATEGORIES,
  getGrade,
  gradeInfo,
  computeScoreHistory,
  computeVitalityScore,
  getAllMarkers,
  getScoreColor,
  linearTrend,
  MIN_TESTS_FOR_TREND,
} from "@/lib/vitality";

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
    <div className="relative h-2 w-full rounded-full overflow-hidden mt-2 bg-muted/40 dark:bg-[hsl(0_0%_100%/0.04)]">
      <div
        className="absolute h-full"
        style={{
          left: `${toPct(optimalLow)}%`,
          width: `${toPct(optimalHigh) - toPct(optimalLow)}%`,
          background: "hsl(152 69% 50% / 0.2)",
          borderRadius: 4,
        }}
      />
      <motion.div
        className="absolute top-1/2 w-3 h-3 rounded-full border-2"
        style={{
          backgroundColor: gradeInfo[grade].dotColor,
          borderColor: "hsl(var(--background))",
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
          <XAxis dataKey="date" tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
          <YAxis domain={[yMin, yMax]} tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} width={35} />
          <Tooltip
            contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 6, fontSize: 11 }}
            formatter={(val: number) => [`${val} ${marker.unit}`, ""]}
          />
          <ReferenceLine y={marker.optimalHigh} stroke="hsl(152 69% 50% / 0.15)" strokeDasharray="2 4" />
          <ReferenceLine y={marker.optimalLow} stroke="hsl(152 69% 50% / 0.15)" strokeDasharray="2 4" />
          <Area type="monotone" dataKey="value" fill={`url(#g-${marker.name})`} stroke="none" />
          <Line
            type="monotone" dataKey="value"
            stroke={col} strokeWidth={2}
            dot={{ r: 4, fill: col, strokeWidth: 2, stroke: "hsl(var(--background))" }}
            activeDot={{ r: 6, fill: col, strokeWidth: 2, stroke: "hsl(var(--background))" }}
            animationDuration={800}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </motion.div>
  );
}

function CategorySection({ catName, config, getMarkerResults, openCategory, setOpenCategory, openMarker, setOpenMarker, idx }: {
  catName: string; config: CatConfig; getMarkerResults: (n: string) => BiomarkerResult[];
  openCategory: string | null; setOpenCategory: (v: string | null) => void;
  openMarker: string | null; setOpenMarker: (v: string | null) => void; idx: number;
}) {
  const Icon = config.icon;
  const markers = config.markers;
  const tested = markers.filter(m => getMarkerResults(m.name).length > 0);
  const optimal = tested.filter(m => getGrade(getMarkerResults(m.name)[0].value, m) === "optimal");
  const isOpen = openCategory === catName;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.04, duration: 0.3 }}
    >
      <button
        onClick={() => { setOpenCategory(isOpen ? null : catName); setOpenMarker(null); }}
        className="w-full flex items-center gap-3 px-4 py-3.5 rounded-lg transition-all duration-200"
        style={{
          background: isOpen ? `hsl(${config.color} / 0.06)` : "hsl(var(--muted) / 0.4)",
          border: `1px solid ${isOpen ? `hsl(${config.color} / 0.2)` : "hsl(var(--border))"}`,
        }}
      >
        <div className="p-1.5 rounded-md" style={{ background: `hsl(${config.color} / 0.1)` }}>
          <Icon size={14} strokeWidth={1.5} style={{ color: `hsl(${config.color})` }} />
        </div>
        <div className="flex-1 text-left">
          <span className="text-sm font-body font-light text-foreground/90">{catName}</span>
          {tested.length > 0 && (
            <span className="text-[10px] text-muted-foreground/40 ml-2">
              {optimal.length}/{tested.length} optimal
            </span>
          )}
        </div>
        {tested.length > 0 ? (
          <div className="flex gap-0.5">
            {markers.map((m) => {
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
              {markers.map((marker, mIdx) => {
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
                      <div
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: gi ? gi.dotColor : "hsl(var(--muted-foreground) / 0.2)" }}
                      />
                      <span className="flex-1 text-[13px] font-body font-light text-foreground/75">
                        {marker.name}
                      </span>
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
                            style={{ background: "hsl(var(--muted) / 0.5)" }}
                          >
                            {gi!.label}
                          </Badge>
                        </div>
                      ) : (
                        <span className="text-[10px] text-muted-foreground/25">—</span>
                      )}
                    </button>

                    {latest && (
                      <div className="px-4 pb-1">
                        <RangeBar value={latest.value} marker={marker} />
                      </div>
                    )}

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
                            <div className="flex gap-2 items-start p-3 rounded-md bg-muted/30">
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

                            {/* Draw condition warning */}
                            {marker.drawCondition && grade && grade !== "optimal" && grade !== "normal" && (
                              <div className="flex gap-2 items-start p-3 rounded-md border border-amber-500/20" style={{ background: "hsl(45 93% 47% / 0.06)" }}>
                                <AlertTriangle size={13} className="text-amber-400/80 mt-0.5 flex-shrink-0" />
                                <div>
                                  <p className="text-[10px] font-body font-medium text-amber-400/90 tracking-wide uppercase mb-1">
                                    ⏰ {marker.drawCondition.label}
                                  </p>
                                  <p className="text-[11px] text-foreground/50 font-body font-light leading-relaxed">
                                    {marker.drawCondition.warning}
                                  </p>
                                </div>
                              </div>
                            )}

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

                            {markerResults.length > 1 && (
                              <TrendChart results={markerResults} marker={marker} catColor={config.color} />
                            )}

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
}

export default function PremierMarkers() {
  const { user } = useAuth();
  const [results, setResults] = useState<BiomarkerResult[]>([]);
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [openMarker, setOpenMarker] = useState<string | null>(null);
  const [showSecondary, setShowSecondary] = useState(false);

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

  // Score trend data
  const scoreHistory = computeScoreHistory(results);
  const hasEnoughForTrend = scoreHistory.length >= MIN_TESTS_FOR_TREND;
  const trend = hasEnoughForTrend ? linearTrend(scoreHistory.map(h => h.score)) : null;
  const latestScore = hasEnoughForTrend && scoreHistory.length > 0
    ? computeVitalityScore(results.filter(r => r.lab_date === scoreHistory[scoreHistory.length - 1].date), getAllMarkers())
    : null;
  const trendColor = latestScore !== null ? `hsl(${getScoreColor(latestScore)})` : "hsl(152 69% 50%)";

  // Check if secondary categories have any data
  const secondaryHasData = SECONDARY_CATEGORIES.some(catName =>
    categoryConfig[catName].markers.some(m => getMarkerResults(m.name).length > 0)
  );

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-heading font-light text-foreground">Vitality Score</h2>
        <p className="text-xs text-muted-foreground/60 font-body font-light mt-0.5">
          Your overall health at a glance — tap any category to explore.
        </p>
      </div>

      {/* Score trend projection — only after MIN_TESTS_FOR_TREND blood tests */}
      {hasEnoughForTrend && trend && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-lg p-4 space-y-3 overflow-hidden bg-card dark:bg-transparent"
          style={{
            background: undefined,
            border: `1px solid ${trendColor}20`,
            boxShadow: `0 0 30px ${trendColor}08, inset 0 1px 0 hsl(var(--border))`,
          }}
        >
          {/* Dark-only background layers */}
          <div className="absolute inset-0 hidden dark:block rounded-lg" style={{ background: "linear-gradient(135deg, hsl(0 0% 3%), hsl(0 0% 5%))" }} />
          {/* Scan line animation - dark only */}
          <motion.div
            className="absolute inset-0 pointer-events-none hidden dark:block"
            style={{
              background: `linear-gradient(180deg, transparent 0%, ${trendColor}06 50%, transparent 100%)`,
              height: "40%",
            }}
            animate={{ y: ["-40%", "280%"] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          />
          {/* Grid overlay */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.03]"
            style={{
              backgroundImage: `linear-gradient(${trendColor}40 1px, transparent 1px), linear-gradient(90deg, ${trendColor}40 1px, transparent 1px)`,
              backgroundSize: "20px 20px",
            }}
          />

          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-2">
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Activity size={14} style={{ color: trendColor, filter: `drop-shadow(0 0 6px ${trendColor})` }} />
              </motion.div>
              <span className="text-[10px] tracking-[0.2em] uppercase font-body text-foreground/50">Biometric Trend</span>
            </div>
            <div className="flex items-center gap-2">
              {trend.slope > 0.5 ? (
                <TrendingUp size={12} style={{ color: trendColor, filter: `drop-shadow(0 0 4px ${trendColor})` }} />
              ) : trend.slope < -0.5 ? (
                <TrendingDown size={12} className="text-orange-400" style={{ filter: "drop-shadow(0 0 4px hsl(25 95% 53%))" }} />
              ) : null}
              <span className="text-[10px] font-mono text-muted-foreground/40">
                PROJ: <motion.span
                  className="font-medium"
                  style={{ color: trendColor, textShadow: `0 0 8px ${trendColor}60` }}
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >{trend.projected}</motion.span>
              </span>
            </div>
          </div>

          <div className="relative h-24">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={[
                  ...scoreHistory.map(h => ({
                    date: new Date(h.date).toLocaleDateString("en-US", { month: "short", year: "2-digit" }),
                    score: h.score,
                  })),
                  { date: "PROJ", score: trend.projected },
                ]}
                margin={{ top: 5, right: 10, left: 10, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="scoreTrendGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={trendColor} stopOpacity={0.25} />
                    <stop offset="40%" stopColor={trendColor} stopOpacity={0.08} />
                    <stop offset="100%" stopColor={trendColor} stopOpacity={0} />
                  </linearGradient>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
                <XAxis dataKey="date" tick={{ fontSize: 8, fill: "hsl(var(--muted-foreground))", fontFamily: "monospace" }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} hide width={0} />
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--card))",
                    border: `1px solid ${trendColor}30`,
                    borderRadius: 4,
                    fontSize: 11,
                    fontFamily: "monospace",
                    boxShadow: `0 0 15px ${trendColor}15`,
                  }}
                  formatter={(val: number, _name: string, _props: any, index: number) => {
                    if (index > 0) return [null, null];
                    return [val, "score"];
                  }}
                  itemStyle={{ color: trendColor }}
                />
                <Area type="monotone" dataKey="score" fill="url(#scoreTrendGrad)" stroke="none" />
                {/* Glow line behind main line */}
                <Line
                  type="monotone" dataKey="score"
                  stroke={trendColor} strokeWidth={6}
                  dot={false}
                  style={{ filter: "url(#glow)", opacity: 0.3 }}
                  animationDuration={800}
                />
                <Line
                  type="monotone" dataKey="score"
                  stroke={trendColor} strokeWidth={2}
                  dot={(props: any) => {
                    const isLast = props.index === scoreHistory.length;
                    const size = isLast ? 5 : 4;
                    return (
                      <g>
                        {/* Outer pulse ring */}
                        <circle
                          cx={props.cx} cy={props.cy} r={size + 4}
                          fill="none"
                          stroke={trendColor}
                          strokeWidth={0.5}
                          opacity={isLast ? 0.4 : 0.15}
                        />
                        {/* Glow */}
                        <circle
                          cx={props.cx} cy={props.cy} r={size + 2}
                          fill={`${trendColor}`}
                          opacity={0.1}
                        />
                        {/* Core dot */}
                        <circle
                          cx={props.cx} cy={props.cy} r={size}
                          fill={isLast ? "hsl(var(--background))" : trendColor}
                          stroke={trendColor}
                          strokeWidth={isLast ? 1.5 : 2}
                          strokeDasharray={isLast ? "2 2" : "none"}
                          style={{ filter: `drop-shadow(0 0 6px ${trendColor})` }}
                        />
                        {/* Center bright point */}
                        {!isLast && (
                          <circle
                            cx={props.cx} cy={props.cy} r={1.5}
                            fill="white"
                            opacity={0.8}
                          />
                        )}
                      </g>
                    );
                  }}
                  animationDuration={800}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          <div className="relative flex items-center justify-between">
            <p className="text-[9px] font-mono text-muted-foreground/25 tracking-wider">
              {scoreHistory.length} SAMPLES ANALYZED
            </p>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-[1px]" style={{ background: trendColor }} />
              <span className="text-[8px] font-mono text-muted-foreground/30">ACTUAL</span>
              <div className="w-3 h-[1px] ml-2" style={{ background: trendColor, opacity: 0.4 }} />
              <span className="text-[8px] font-mono text-muted-foreground/30">PROJECTED</span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Not enough tests message */}
      {results.length > 0 && !hasEnoughForTrend && (
        <div className="rounded-lg p-3 flex items-center gap-2" style={{ background: "hsl(0 0% 100% / 0.015)", border: "1px solid hsl(0 0% 100% / 0.04)" }}>
          <Activity size={13} className="text-muted-foreground/30" />
          <p className="text-[10px] text-muted-foreground/40 font-body font-light">
            {MIN_TESTS_FOR_TREND - scoreHistory.length} more blood test{MIN_TESTS_FOR_TREND - scoreHistory.length !== 1 ? "s" : ""} needed to unlock score trend projections.
          </p>
        </div>
      )}

      {/* Primary categories */}
      <div className="space-y-2">
        {PRIMARY_CATEGORIES.map((catName, idx) => (
          <CategorySection
            key={catName}
            catName={catName}
            config={categoryConfig[catName]}
            getMarkerResults={getMarkerResults}
            openCategory={openCategory}
            setOpenCategory={setOpenCategory}
            openMarker={openMarker}
            setOpenMarker={setOpenMarker}
            idx={idx}
          />
        ))}
      </div>

      {/* Secondary categories toggle */}
      {SECONDARY_CATEGORIES.length > 0 && (
        <div>
          <button
            onClick={() => setShowSecondary(!showSecondary)}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-lg text-xs font-body text-muted-foreground/50 transition-colors hover:text-muted-foreground/70"
            style={{ background: "hsl(0 0% 100% / 0.015)", border: "1px solid hsl(0 0% 100% / 0.03)" }}
          >
            <span>{showSecondary ? "Hide" : "Show"} Additional Panels</span>
            {secondaryHasData && !showSecondary && (
              <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary/60">has data</span>
            )}
            <motion.div animate={{ rotate: showSecondary ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronDown size={14} />
            </motion.div>
          </button>

          <AnimatePresence>
            {showSecondary && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden space-y-2 pt-2"
              >
                {SECONDARY_CATEGORIES.map((catName, idx) => (
                  <CategorySection
                    key={catName}
                    catName={catName}
                    config={categoryConfig[catName]}
                    getMarkerResults={getMarkerResults}
                    openCategory={openCategory}
                    setOpenCategory={setOpenCategory}
                    openMarker={openMarker}
                    setOpenMarker={setOpenMarker}
                    idx={idx}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

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
