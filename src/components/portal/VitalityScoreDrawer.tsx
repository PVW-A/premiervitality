import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, AlertTriangle } from "lucide-react";
import {
  type BiomarkerResult,
  computeCategoryScores,
  getWorstMarkers,
  getScoreColor,
  getScoreLabel,
  getAllMarkers,
  computeVitalityScore,
  gradeInfo,
} from "@/lib/vitality";

interface VitalityScoreDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  results: BiomarkerResult[];
  onViewAll: () => void;
}

export default function VitalityScoreDrawer({ open, onOpenChange, results, onViewAll }: VitalityScoreDrawerProps) {
  const allMarkers = getAllMarkers();
  const score = computeVitalityScore(results, allMarkers);
  const categoryScores = computeCategoryScores(results);
  const worstMarkers = getWorstMarkers(results, 5);

  if (score === null) return null;

  const color = getScoreColor(score);
  const label = getScoreLabel(score);
  const circumference = 2 * Math.PI * 54;
  const dashOffset = circumference - (score / 100) * circumference;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto rounded-t-2xl pb-8">
        <SheetHeader className="sr-only">
          <SheetTitle>Vitality Score</SheetTitle>
          <SheetDescription>Your health score breakdown and improvement tips</SheetDescription>
        </SheetHeader>

        <div className="max-w-md mx-auto space-y-6 pt-2">
          {/* Score ring */}
          <div className="flex flex-col items-center gap-2">
            <div className="relative w-28 h-28">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="54" fill="none" stroke="hsl(0 0% 100% / 0.04)" strokeWidth="5" />
                <motion.circle
                  cx="60" cy="60" r="54" fill="none"
                  stroke={`hsl(${color})`}
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset: dashOffset }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  style={{ filter: `drop-shadow(0 0 6px hsl(${color} / 0.4))` }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-heading font-light text-foreground tabular-nums">{score}</span>
                <span className="text-[8px] tracking-[0.15em] uppercase text-muted-foreground/40 font-body">/100</span>
              </div>
            </div>
            <span className="text-sm font-body font-light" style={{ color: `hsl(${color})` }}>
              {label}
            </span>
          </div>

          {/* Category breakdown */}
          {categoryScores.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground/50 font-body">
                Category Breakdown
              </h3>
              <div className="space-y-2">
                {categoryScores.map(({ catName, score: catScore, color: catColor }) => (
                  <div key={catName} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-body font-light text-foreground/70">{catName}</span>
                      <span className="text-xs font-heading font-light text-foreground tabular-nums">{catScore}</span>
                    </div>
                    <div className="relative h-1.5 w-full rounded-full overflow-hidden" style={{ background: "hsl(0 0% 100% / 0.04)" }}>
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: `hsl(${catColor})` }}
                        initial={{ width: 0 }}
                        animate={{ width: `${catScore}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Worst markers */}
          {worstMarkers.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground/50 font-body flex items-center gap-1.5">
                <AlertTriangle size={11} className="text-amber-400/60" />
                Top Areas to Improve
              </h3>
              <div className="space-y-2">
                {worstMarkers.map(({ marker, grade, value }) => {
                  const gi = gradeInfo[grade];
                  return (
                    <div
                      key={marker.name}
                      className="p-3 rounded-lg space-y-1.5"
                      style={{ background: "hsl(0 0% 100% / 0.02)", border: "1px solid hsl(0 0% 100% / 0.04)" }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-body font-light text-foreground/80">{marker.name}</span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-heading font-light text-foreground tabular-nums">{value}</span>
                          <span className="text-[9px] text-muted-foreground/40">{marker.unit}</span>
                          <span className={`text-[9px] font-body ${gi.color}`}>{gi.label}</span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        {marker.tips.slice(0, 2).map((tip, i) => (
                          <div key={i} className="flex items-start gap-1.5">
                            <div className="w-1 h-1 rounded-full mt-1.5 flex-shrink-0 bg-primary/40" />
                            <span className="text-[10px] text-muted-foreground/60 font-body font-light">{tip}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* CTA */}
          <Button
            variant="outline"
            className="w-full rounded-none border-primary/30 text-primary text-xs tracking-[0.15em] uppercase font-body font-light hover:bg-primary/10"
            onClick={() => {
              onViewAll();
              onOpenChange(false);
            }}
          >
            View All Biomarkers <ArrowRight size={14} className="ml-1.5" />
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
