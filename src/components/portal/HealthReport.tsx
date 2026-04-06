import { useState, useEffect, useRef, useCallback } from "react";
import {
  Upload,
  FileText,
  Activity,
  Clock,
  CheckCircle,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  TrendingUp,
  TrendingDown,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

/* ─── Types ─── */
interface Biomarker {
  name: string;
  value: number;
  unit: string;
  reference_range: string;
  status: "optimal" | "borderline" | "low" | "high";
}

interface HealthReportData {
  id: string;
  created_at: string;
  status: string;
  vitality_score: number | null;
  biological_age: number | null;
  summary: string | null;
  biomarkers: Biomarker[];
  file_name: string | null;
}

/* ─── Status colors ─── */
const statusDot: Record<string, string> = {
  optimal: "bg-emerald-400",
  borderline: "bg-amber-400",
  low: "bg-red-400",
  high: "bg-red-400",
};

const statusText: Record<string, string> = {
  optimal: "text-emerald-400",
  borderline: "text-amber-400",
  low: "text-red-400",
  high: "text-red-400",
};

const statusLabel: Record<string, string> = {
  optimal: "Optimal",
  borderline: "Borderline",
  low: "Low",
  high: "High",
};

/* ─── Vitality Gauge ─── */
function VitalityGauge({ score }: { score: number }) {
  const radius = 70;
  const stroke = 8;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;

  // Color based on score
  const color =
    score >= 85
      ? "#4ade80"
      : score >= 70
      ? "#C9A96E"
      : score >= 50
      ? "#fbbf24"
      : "#f87171";

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width="160" height="160" className="-rotate-90">
        {/* Background track */}
        <circle
          cx="80"
          cy="80"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          className="text-border/20"
        />
        {/* Progress arc */}
        <circle
          cx="80"
          cy="80"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          style={{ transition: "stroke-dashoffset 1.5s ease-out" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-heading font-light" style={{ color }}>
          {score}
        </span>
        <span className="text-[9px] tracking-[0.2em] uppercase text-muted-foreground/50 font-body">
          Vitality Score
        </span>
      </div>
    </div>
  );
}

/* ─── Main Component ─── */
export default function HealthReport() {
  const { user, loading: authLoading } = useAuth();
  const [reports, setReports] = useState<HealthReportData[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [selectedReport, setSelectedReport] = useState<HealthReportData | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [biomarkerFilter, setBiomarkerFilter] = useState<string | null>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const fetchReports = useCallback(async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("health_reports" as any)
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Failed to fetch health reports:", error);
    } else if (data) {
      const typed = data as unknown as HealthReportData[];
      setReports(typed);
      // Auto-select most recent completed report
      const completed = typed.find((r) => r.status === "completed");
      if (completed && !selectedReport) setSelectedReport(completed);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  // Poll for processing reports
  useEffect(() => {
    const processing = reports.find((r) => r.status === "processing");
    if (!processing) return;
    setAnalyzing(true);
    const interval = setInterval(async () => {
      const { data } = await supabase
        .from("health_reports" as any)
        .select("*")
        .eq("id", processing.id)
        .single();
      if (data && (data as any).status !== "processing") {
        setAnalyzing(false);
        fetchReports();
        if ((data as any).status === "completed") {
          setSelectedReport(data as unknown as HealthReportData);
          toast.success("Your bloodwork analysis is ready!");
        } else {
          toast.error("Analysis failed — please try uploading again.");
        }
        clearInterval(interval);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [reports, fetchReports]);

  const allowedTypes = [
    "application/pdf",
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/heic",
  ];

  const validateFile = (file: File): boolean => {
    if (file.size > 20 * 1024 * 1024) {
      toast.error("File must be under 20MB");
      return false;
    }
    // HEIC files sometimes report empty type on some browsers — allow by extension too
    const ext = file.name.split(".").pop()?.toLowerCase() || "";
    if (!allowedTypes.includes(file.type) && !["heic", "heif"].includes(ext)) {
      toast.error("Please upload a PDF or image (JPG, PNG, WebP, HEIC)");
      return false;
    }
    return true;
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && validateFile(file)) setPendingFile(file);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && validateFile(file)) setPendingFile(file);
  };

  const handleUpload = async () => {
    if (!pendingFile) return;
    if (!user) {
      toast.error("Please log in to upload bloodwork.");
      return;
    }

    setUploading(true);
    try {
      const ext = pendingFile.name.split(".").pop();
      const filePath = `${user.id}/${Date.now()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("bloodwork")
        .upload(filePath, pendingFile);
      if (uploadError) throw uploadError;

      // Create health report record
      const { data: report, error: dbError } = await supabase
        .from("health_reports" as any)
        .insert({
          user_id: user.id,
          file_path: filePath,
          file_name: pendingFile.name,
          status: "processing",
        })
        .select("id")
        .single();
      if (dbError) throw dbError;

      toast.success("Bloodwork uploaded — AI analysis in progress…");
      setPendingFile(null);
      await fetchReports();

      // Trigger edge function (non-blocking for UI, polling handles result)
      supabase.functions
        .invoke("analyze-bloodwork", { body: { report_id: report.id } })
        .catch((err) => console.error("analyze-bloodwork invoke error:", err));
    } catch (err: any) {
      toast.error(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const chronologicalAge = user
    ? (() => {
        // We don't have birthday in the user object, so we'll show relative age only when bio age exists
        return null;
      })()
    : null;

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  const completedReports = reports.filter((r) => r.status === "completed");
  const biomarkers = selectedReport?.biomarkers || [];
  const categories = [...new Set(biomarkers.map((b) => {
    // Group by common categories
    const name = b.name.toLowerCase();
    if (name.includes("cholesterol") || name.includes("ldl") || name.includes("hdl") || name.includes("triglyceride") || name.includes("vldl")) return "Lipid Panel";
    if (name.includes("tsh") || name.includes("t3") || name.includes("t4") || name.includes("thyroid")) return "Thyroid";
    if (name.includes("testosterone") || name.includes("estradiol") || name.includes("igf") || name.includes("dhea") || name.includes("shbg") || name.includes("prolactin") || name.includes("cortisol") || name.includes("lh") || name.includes("fsh") || name.includes("progesterone")) return "Hormones";
    if (name.includes("glucose") || name.includes("hba1c") || name.includes("insulin") || name.includes("uric")) return "Metabolic";
    if (name.includes("crp") || name.includes("homocysteine") || name.includes("esr")) return "Inflammation";
    if (name.includes("alt") || name.includes("ast") || name.includes("ggt") || name.includes("alp") || name.includes("albumin") || name.includes("bilirubin") || name.includes("creatinine") || name.includes("bun") || name.includes("egfr") || name.includes("ldh") || name.includes("protein")) return "Liver & Kidney";
    if (name.includes("wbc") || name.includes("rbc") || name.includes("hemoglobin") || name.includes("hematocrit") || name.includes("platelet") || name.includes("mcv") || name.includes("mch") || name.includes("rdw")) return "CBC";
    if (name.includes("sodium") || name.includes("potassium") || name.includes("calcium") || name.includes("magnesium") || name.includes("chloride") || name.includes("phosphorus") || name.includes("iron") || name.includes("ferritin") || name.includes("tibc") || name.includes("co2") || name.includes("bicarbonate")) return "Electrolytes";
    if (name.includes("vitamin") || name.includes("folate") || name.includes("b12")) return "Vitamins";
    return "Other";
  }))].sort();

  const filteredBiomarkers = biomarkerFilter
    ? biomarkers.filter((b) => {
        const name = b.name.toLowerCase();
        // Reuse same categorization
        const cat = categories.find((c) => {
          if (c === "Lipid Panel") return name.includes("cholesterol") || name.includes("ldl") || name.includes("hdl") || name.includes("triglyceride") || name.includes("vldl");
          if (c === "Thyroid") return name.includes("tsh") || name.includes("t3") || name.includes("t4") || name.includes("thyroid");
          if (c === "Hormones") return name.includes("testosterone") || name.includes("estradiol") || name.includes("igf") || name.includes("dhea") || name.includes("shbg") || name.includes("prolactin") || name.includes("cortisol") || name.includes("lh") || name.includes("fsh") || name.includes("progesterone");
          if (c === "Metabolic") return name.includes("glucose") || name.includes("hba1c") || name.includes("insulin") || name.includes("uric");
          if (c === "Inflammation") return name.includes("crp") || name.includes("homocysteine") || name.includes("esr");
          if (c === "Liver & Kidney") return name.includes("alt") || name.includes("ast") || name.includes("ggt") || name.includes("alp") || name.includes("albumin") || name.includes("bilirubin") || name.includes("creatinine") || name.includes("bun") || name.includes("egfr") || name.includes("ldh") || name.includes("protein");
          if (c === "CBC") return name.includes("wbc") || name.includes("rbc") || name.includes("hemoglobin") || name.includes("hematocrit") || name.includes("platelet") || name.includes("mcv") || name.includes("mch") || name.includes("rdw");
          if (c === "Electrolytes") return name.includes("sodium") || name.includes("potassium") || name.includes("calcium") || name.includes("magnesium") || name.includes("chloride") || name.includes("phosphorus") || name.includes("iron") || name.includes("ferritin") || name.includes("tibc") || name.includes("co2") || name.includes("bicarbonate");
          if (c === "Vitamins") return name.includes("vitamin") || name.includes("folate") || name.includes("b12");
          return false;
        });
        return cat === biomarkerFilter || (!cat && biomarkerFilter === "Other");
      })
    : biomarkers;

  const optimalCount = biomarkers.filter((b) => b.status === "optimal").length;
  const borderlineCount = biomarkers.filter((b) => b.status === "borderline").length;
  const outOfRangeCount = biomarkers.filter((b) => b.status === "low" || b.status === "high").length;

  return (
    <>
      {/* Header */}
      <div>
        <p className="text-[10px] tracking-[0.35em] uppercase text-primary mb-2">
          Health Intelligence
        </p>
        <h2 className="text-2xl sm:text-3xl font-light tracking-tight text-foreground">
          Health Report
        </h2>
        <p className="text-sm text-muted-foreground font-light mt-2">
          Upload your bloodwork and get an AI-powered analysis of your
          biomarkers, vitality score, and biological age.
        </p>
      </div>

      {/* Upload Zone */}
      <input
        ref={fileRef}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png,.webp,.heic,.heif"
        style={{ display: "none" }}
        onChange={handleFileSelect}
      />
      <div
        className={`rounded-xl border-2 border-dashed transition-colors cursor-pointer ${
          dragOver
            ? "border-primary/60 bg-primary/5"
            : "border-border/40 hover:border-primary/40"
        }`}
        style={{ background: dragOver ? undefined : "rgba(255,255,255,0.02)" }}
        onClick={() => !uploading && !analyzing && fileRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        <div className="px-6 py-8 flex flex-col items-center gap-3 text-center">
          {uploading || analyzing ? (
            <>
              <Loader2 size={28} className="text-primary animate-spin" strokeWidth={1.2} />
              <div>
                <p className="text-sm font-body font-light text-foreground">
                  {uploading ? "Uploading…" : "AI is analyzing your bloodwork…"}
                </p>
                <p className="text-[10px] text-muted-foreground font-body font-light mt-1">
                  {analyzing ? "This usually takes 15-30 seconds" : "Please wait"}
                </p>
              </div>
            </>
          ) : pendingFile ? (
            <>
              <FileText size={28} className="text-primary/60" strokeWidth={1.2} />
              <div>
                <p className="text-sm font-body font-light text-foreground">{pendingFile.name}</p>
                <p className="text-[10px] text-muted-foreground font-body font-light mt-1">
                  {(pendingFile.size / 1024).toFixed(0)} KB — Ready to analyze
                </p>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <button
                  onClick={(e) => { e.stopPropagation(); handleUpload(); }}
                  className="px-5 py-2 text-[10px] tracking-[0.15em] uppercase font-body font-light rounded-full border border-primary/40 text-primary hover:bg-primary/10 transition-colors"
                >
                  Analyze Bloodwork
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); setPendingFile(null); }}
                  className="px-3 py-2 text-[10px] tracking-[0.15em] uppercase font-body font-light text-muted-foreground hover:text-foreground transition-colors"
                >
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <>
              <Upload size={28} className="text-primary/60" strokeWidth={1.2} />
              <div>
                <p className="text-sm font-body font-light text-foreground">
                  {completedReports.length > 0 ? "Upload new bloodwork" : "Upload your lab results"}
                </p>
                <p className="text-[10px] text-muted-foreground font-body font-light mt-1">
                  Click to browse or drag and drop — PDF, JPG, PNG, HEIC — max 20MB
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Results */}
      {selectedReport && selectedReport.status === "completed" && (
        <>
          {/* Summary */}
          {selectedReport.summary && (
            <div
              className="rounded-xl border border-border/30 overflow-hidden"
              style={{ background: "rgba(255,255,255,0.02)" }}
            >
              <div className="px-6 py-4 border-b border-border/20 flex items-center justify-between">
                <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground">
                  Analysis Summary
                </p>
                <p className="text-[10px] text-muted-foreground/50 font-body font-light">
                  {new Date(selectedReport.created_at).toLocaleDateString(
                    "en-US",
                    { month: "short", day: "numeric", year: "numeric" }
                  )}
                </p>
              </div>
              <div className="px-6 py-5">
                <p className="text-sm font-body font-light text-foreground/80 leading-relaxed">
                  {selectedReport.summary}
                </p>
              </div>
            </div>
          )}

          {/* Score + Bio Age */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Vitality Score */}
            {selectedReport.vitality_score != null && (
              <div
                className="rounded-xl border border-border/30 overflow-hidden flex flex-col items-center py-8"
                style={{ background: "rgba(255,255,255,0.02)" }}
              >
                <VitalityGauge score={selectedReport.vitality_score} />
                <div className="flex items-center gap-4 mt-4 text-[10px] font-body text-muted-foreground/50">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    {optimalCount} optimal
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    {borderlineCount} borderline
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-red-400" />
                    {outOfRangeCount} flagged
                  </span>
                </div>
              </div>
            )}

            {/* Biological Age */}
            {selectedReport.biological_age != null && (
              <div
                className="rounded-xl border border-border/30 overflow-hidden flex flex-col items-center justify-center py-8"
                style={{ background: "rgba(255,255,255,0.02)" }}
              >
                <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground/50 font-body mb-2">
                  Biological Age
                </p>
                <span className="text-5xl font-heading font-light text-primary">
                  {selectedReport.biological_age}
                </span>
                <p className="text-[10px] text-muted-foreground/40 font-body font-light mt-2">
                  Based on your biomarker profile
                </p>
              </div>
            )}
          </div>

          {/* Biomarker Breakdown */}
          <div
            className="rounded-xl border border-border/30 overflow-hidden"
            style={{ background: "rgba(255,255,255,0.02)" }}
          >
            <div className="px-6 py-4 border-b border-border/20">
              <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground">
                Biomarker Breakdown
              </p>
              <p className="text-[10px] text-muted-foreground/40 font-body font-light mt-0.5">
                {biomarkers.length} markers analyzed
              </p>
            </div>

            {/* Category filters */}
            {categories.length > 1 && (
              <div className="px-6 pt-4 flex flex-wrap gap-1.5">
                <button
                  onClick={() => setBiomarkerFilter(null)}
                  className={`px-3 py-1 text-[9px] tracking-[0.15em] uppercase font-body font-extralight border transition-all ${
                    !biomarkerFilter
                      ? "bg-primary/10 text-primary/80 border-primary/20"
                      : "border-border/40 text-muted-foreground/50 hover:border-border/60"
                  }`}
                >
                  All
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() =>
                      setBiomarkerFilter(biomarkerFilter === cat ? null : cat)
                    }
                    className={`px-3 py-1 text-[9px] tracking-[0.15em] uppercase font-body font-extralight border transition-all ${
                      biomarkerFilter === cat
                        ? "bg-primary/10 text-primary/80 border-primary/20"
                        : "border-border/40 text-muted-foreground/50 hover:border-border/60"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}

            {/* Biomarker table */}
            <div className="px-6 py-4">
              <div className="space-y-1">
                {filteredBiomarkers.map((b, i) => (
                  <div
                    key={`${b.name}-${i}`}
                    className="flex items-center justify-between py-2.5 border-b border-border/10 last:border-0"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <span
                        className={`w-2 h-2 rounded-full shrink-0 ${statusDot[b.status]}`}
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-body font-light text-foreground/80 truncate">
                          {b.name}
                        </p>
                        <p className="text-[10px] text-muted-foreground/40 font-body font-light">
                          Ref: {b.reference_range}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-sm font-body font-light text-foreground tabular-nums">
                        {b.value} <span className="text-[10px] text-muted-foreground/40">{b.unit}</span>
                      </span>
                      <span
                        className={`text-[9px] tracking-[0.1em] uppercase font-body ${statusText[b.status]} w-16 text-right`}
                      >
                        {statusLabel[b.status]}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Error state */}
      {selectedReport && selectedReport.status === "error" && (
        <div
          className="rounded-xl border border-border/30 overflow-hidden"
          style={{ background: "rgba(255,255,255,0.02)" }}
        >
          <div className="px-6 py-8 flex flex-col items-center gap-3 text-center">
            <AlertTriangle
              size={28}
              className="text-amber-400/60"
              strokeWidth={1.2}
            />
            <p className="text-sm font-body font-light text-foreground">
              Analysis couldn't be completed
            </p>
            <p className="text-[10px] text-muted-foreground font-body font-light">
              Please try uploading a clearer image or PDF of your lab results.
            </p>
          </div>
        </div>
      )}

      {/* Empty state */}
      {reports.length === 0 && (
        <div
          className="rounded-xl border border-border/30 overflow-hidden"
          style={{ background: "rgba(255,255,255,0.02)" }}
        >
          <div className="px-6 py-12 flex flex-col items-center gap-4 text-center">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/5">
              <Activity
                size={28}
                className="text-primary/40"
                strokeWidth={1.2}
              />
            </div>
            <div>
              <p className="text-sm font-body font-light text-foreground">
                No health reports yet
              </p>
              <p className="text-[10px] text-muted-foreground font-body font-light mt-1">
                Upload your bloodwork above to get started with your first AI
                analysis.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Past Reports */}
      {completedReports.length > 1 && (
        <div
          className="rounded-xl border border-border/30 overflow-hidden"
          style={{ background: "rgba(255,255,255,0.02)" }}
        >
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-card/30 transition-colors"
          >
            <div>
              <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground text-left">
                Past Reports
              </p>
              <p className="text-[10px] text-muted-foreground/40 font-body font-light mt-0.5 text-left">
                {completedReports.length} reports on file
              </p>
            </div>
            {showHistory ? (
              <ChevronUp size={14} className="text-muted-foreground/40" />
            ) : (
              <ChevronDown size={14} className="text-muted-foreground/40" />
            )}
          </button>

          {showHistory && (
            <div className="border-t border-border/20 divide-y divide-border/10">
              {completedReports.map((r) => {
                const isSelected = selectedReport?.id === r.id;
                return (
                  <button
                    key={r.id}
                    onClick={() => {
                      setSelectedReport(r);
                      setBiomarkerFilter(null);
                    }}
                    className={`w-full px-6 py-3 flex items-center justify-between text-left transition-colors ${
                      isSelected
                        ? "bg-primary/5"
                        : "hover:bg-card/20"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <FileText
                        size={14}
                        strokeWidth={1.2}
                        className="text-primary/60"
                      />
                      <div>
                        <p className="text-xs font-body font-light text-foreground">
                          {r.file_name || "Lab Report"}
                        </p>
                        <p className="text-[10px] text-muted-foreground/40 font-body font-light">
                          {new Date(r.created_at).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {r.vitality_score != null && (
                        <span className="text-xs font-body text-primary/60 tabular-nums">
                          {r.vitality_score}/100
                        </span>
                      )}
                      {isSelected && (
                        <span className="text-[9px] tracking-[0.1em] uppercase text-primary/60 font-body">
                          Viewing
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </>
  );
}
