import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Droplets, Heart, Flame, Brain, ShieldCheck, TrendingUp, TrendingDown, Minus, ChevronDown, ChevronUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Line, XAxis, YAxis, ReferenceLine, ResponsiveContainer, Tooltip, Area, ComposedChart } from "recharts";

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

const categoryConfig: Record<string, { icon: any; markers: { name: string; unit: string; low: number; high: number }[] }> = {
  Hormones: {
    icon: Activity,
    markers: [
      { name: "Testosterone (Total)", unit: "ng/dL", low: 300, high: 1000 },
      { name: "Free Testosterone", unit: "ng/dL", low: 9, high: 30 },
      { name: "Estradiol (E2)", unit: "pg/mL", low: 20, high: 50 },
      { name: "IGF-1", unit: "ng/mL", low: 100, high: 300 },
      { name: "DHEA-S", unit: "µg/dL", low: 100, high: 400 },
    ],
  },
  "Metabolic Panel": {
    icon: Flame,
    markers: [
      { name: "Fasting Glucose", unit: "mg/dL", low: 70, high: 99 },
      { name: "HbA1c", unit: "%", low: 4.0, high: 5.7 },
      { name: "Insulin (Fasting)", unit: "µIU/mL", low: 2, high: 25 },
    ],
  },
  Thyroid: {
    icon: ShieldCheck,
    markers: [
      { name: "TSH", unit: "mIU/L", low: 0.4, high: 4.0 },
      { name: "Free T3", unit: "pg/mL", low: 2.3, high: 4.2 },
      { name: "Free T4", unit: "ng/dL", low: 0.8, high: 1.8 },
    ],
  },
  Inflammation: {
    icon: Heart,
    markers: [
      { name: "hs-CRP", unit: "mg/L", low: 0, high: 1.0 },
      { name: "Homocysteine", unit: "µmol/L", low: 5, high: 15 },
      { name: "ESR", unit: "mm/hr", low: 0, high: 20 },
    ],
  },
  "Liver & Kidney": {
    icon: Droplets,
    markers: [
      { name: "ALT", unit: "U/L", low: 7, high: 56 },
      { name: "AST", unit: "U/L", low: 10, high: 40 },
      { name: "Creatinine", unit: "mg/dL", low: 0.7, high: 1.3 },
      { name: "BUN", unit: "mg/dL", low: 7, high: 20 },
    ],
  },
  "Cognitive & Neuro": {
    icon: Brain,
    markers: [
      { name: "Vitamin D (25-OH)", unit: "ng/mL", low: 40, high: 80 },
      { name: "Vitamin B12", unit: "pg/mL", low: 200, high: 900 },
      { name: "Folate", unit: "ng/mL", low: 2.7, high: 17 },
    ],
  },
};

function getStatus(value: number, low: number, high: number): string {
  if (value < low) return "below";
  if (value > high) return "above";
  return "optimal";
}

const statusStyles: Record<string, string> = {
  optimal: "bg-green-500/20 text-green-400 border-green-500/30",
  above: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  below: "bg-destructive/20 text-destructive border-destructive/30",
  pending: "bg-muted text-muted-foreground border-border",
};

const statusLabel: Record<string, string> = {
  optimal: "In Range",
  above: "Above Range",
  below: "Below Range",
  pending: "Awaiting Labs",
};

function TrendIcon({ results }: { results: BiomarkerResult[] }) {
  if (results.length < 2) return <Minus size={14} className="text-muted-foreground" />;
  const latest = results[0].value;
  const previous = results[1].value;
  if (latest > previous) return <TrendingUp size={14} className="text-green-400" />;
  if (latest < previous) return <TrendingDown size={14} className="text-destructive" />;
  return <Minus size={14} className="text-muted-foreground" />;
}

function MarkerChart({ results, low, high }: { results: BiomarkerResult[]; low: number; high: number }) {
  const data = [...results].reverse().map((r) => ({
    date: new Date(r.lab_date).toLocaleDateString("en-US", { month: "short", year: "2-digit" }),
    value: r.value,
  }));

  const minVal = Math.min(low * 0.7, ...data.map((d) => d.value));
  const maxVal = Math.max(high * 1.3, ...data.map((d) => d.value));

  return (
    <div className="h-32 mt-3">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="rangeGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.08} />
              <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.02} />
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
              borderRadius: 4,
              fontSize: 12,
              fontFamily: "var(--font-body)",
            }}
            labelStyle={{ color: "hsl(var(--foreground))" }}
          />
          <ReferenceLine y={high} stroke="hsl(var(--primary))" strokeDasharray="4 4" strokeOpacity={0.5} />
          <ReferenceLine y={low} stroke="hsl(var(--destructive))" strokeDasharray="4 4" strokeOpacity={0.5} />
          <Area
            type="monotone"
            dataKey="value"
            fill="url(#rangeGradient)"
            stroke="none"
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            dot={{ r: 4, fill: "hsl(var(--primary))", strokeWidth: 0 }}
            activeDot={{ r: 6, fill: "hsl(var(--primary))", strokeWidth: 2, stroke: "hsl(var(--background))" }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

function RangeBar({ value, low, high }: { value: number; low: number; high: number }) {
  const range = high - low;
  const paddedMin = low - range * 0.3;
  const paddedMax = high + range * 0.3;
  const total = paddedMax - paddedMin;
  const lowPct = ((low - paddedMin) / total) * 100;
  const highPct = ((high - paddedMin) / total) * 100;
  const valuePct = Math.max(0, Math.min(100, ((value - paddedMin) / total) * 100));

  return (
    <div className="relative h-2 w-full rounded-full bg-muted mt-2">
      <div
        className="absolute h-full rounded-full bg-green-500/30"
        style={{ left: `${lowPct}%`, width: `${highPct - lowPct}%` }}
      />
      <div
        className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-background shadow-sm"
        style={{
          left: `${valuePct}%`,
          transform: `translate(-50%, -50%)`,
          backgroundColor: value >= low && value <= high ? "hsl(142, 71%, 45%)" : value < low ? "hsl(var(--destructive))" : "hsl(45, 93%, 47%)",
        }}
      />
    </div>
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
    const optimal = tested.filter((m) => {
      const r = getMarkerResults(m.name);
      return r.length > 0 && getStatus(r[0].value, m.low, m.high) === "optimal";
    });
    return { tested: tested.length, total: catMarkers.length, optimal: optimal.length };
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-heading font-light text-foreground">Premier Markers</h2>
        <p className="text-sm text-muted-foreground font-body font-light mt-1">
          Track your biomarkers over time — see where you've been, where you are, and where you're headed.
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {Object.entries(categoryConfig).map(([catName, config]) => {
          const Icon = config.icon;
          const summary = getCategorySummary(catName);
          return (
            <button
              key={catName}
              onClick={() => setExpandedCategory(expandedCategory === catName ? null : catName)}
              className={`text-left p-4 border rounded-sm transition-colors ${
                expandedCategory === catName
                  ? "border-primary/60 bg-primary/5"
                  : "border-border bg-card hover:border-primary/30"
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <Icon size={14} strokeWidth={1.2} className="text-primary" />
                <span className="text-xs tracking-[0.15em] uppercase text-foreground font-body font-light">
                  {catName}
                </span>
              </div>
              {summary.tested > 0 ? (
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-heading font-light text-foreground">
                    {summary.optimal}/{summary.tested}
                  </span>
                  <span className="text-xs text-muted-foreground font-body font-light">in range</span>
                </div>
              ) : (
                <span className="text-xs text-muted-foreground font-body font-light italic">No labs yet</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Expanded category detail */}
      {expandedCategory && (
        <Card className="border-border bg-card">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg font-heading font-light text-foreground">
              {(() => { const Icon = categoryConfig[expandedCategory].icon; return <Icon size={18} strokeWidth={1.2} className="text-primary" />; })()}
              {expandedCategory}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {categoryConfig[expandedCategory].markers.map((marker) => {
              const markerResults = getMarkerResults(marker.name);
              const latest = markerResults[0];
              const status = latest ? getStatus(latest.value, marker.low, marker.high) : "pending";
              const isExpanded = expandedMarker === marker.name;

              return (
                <div key={marker.name} className="border-b border-border last:border-0 pb-4 last:pb-0">
                  <button
                    onClick={() => setExpandedMarker(isExpanded ? null : marker.name)}
                    className="w-full flex items-center justify-between text-left"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-body font-light text-foreground">{marker.name}</span>
                        {markerResults.length > 1 && <TrendIcon results={markerResults} />}
                      </div>
                      <span className="text-xs text-muted-foreground font-body font-light">
                        Range: {marker.low}–{marker.high} {marker.unit}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      {latest && (
                        <span className="text-lg font-heading font-light text-foreground">
                          {latest.value} <span className="text-xs text-muted-foreground font-body">{marker.unit}</span>
                        </span>
                      )}
                      <Badge variant="outline" className={`text-[10px] ${statusStyles[status]}`}>
                        {statusLabel[status]}
                      </Badge>
                      {markerResults.length > 0 && (
                        isExpanded ? <ChevronUp size={14} className="text-muted-foreground" /> : <ChevronDown size={14} className="text-muted-foreground" />
                      )}
                    </div>
                  </button>

                  {latest && <RangeBar value={latest.value} low={marker.low} high={marker.high} />}

                  {isExpanded && markerResults.length > 1 && (
                    <div className="mt-3">
                      <MarkerChart results={markerResults} low={marker.low} high={marker.high} />
                      <div className="mt-3 space-y-1">
                        {markerResults.map((r) => (
                          <div key={r.id} className="flex items-center justify-between text-xs font-body font-light text-muted-foreground">
                            <span>{new Date(r.lab_date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
                            <span className={`${getStatus(r.value, marker.low, marker.high) === "optimal" ? "text-green-400" : getStatus(r.value, marker.low, marker.high) === "below" ? "text-destructive" : "text-yellow-400"}`}>
                              {r.value} {marker.unit}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {results.length === 0 && (
        <Card className="border-border bg-card">
          <CardContent className="py-12 text-center">
            <Activity size={32} strokeWidth={1} className="text-primary/40 mx-auto mb-4" />
            <p className="text-sm text-muted-foreground font-body font-light">
              No lab results yet. Once your provider processes your bloodwork, your biomarkers will appear here with trend tracking.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
