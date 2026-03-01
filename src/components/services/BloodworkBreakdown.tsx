import { Droplets, TestTube } from "lucide-react";

const panelData: Record<
  string,
  { baseline: string; coreCount: number; coreLabel: string }
> = {
  essential: {
    baseline: "1 Baseline Panel (100+ biomarkers)",
    coreCount: 1,
    coreLabel: "1 Core Checkup / year",
  },
  premium: {
    baseline: "1 Baseline Panel (100+ biomarkers)",
    coreCount: 2,
    coreLabel: "2 Core Checkups / year",
  },
  elite: {
    baseline: "1 Baseline Panel (100+ biomarkers)",
    coreCount: 3,
    coreLabel: "3 Core Checkups / year",
  },
};

const baselineMarkers = [
  "Complete Metabolic Panel",
  "Lipid Panel",
  "Thyroid (TSH, T3, T4)",
  "Hormone Panel (Testosterone, Estradiol, DHEA-S)",
  "Inflammatory Markers (CRP, Homocysteine)",
  "Insulin & HbA1c",
  "Vitamin D, B12, Folate",
  "Iron Studies & Ferritin",
  "Liver & Kidney Function",
  "CBC with Differential",
];

const coreMarkers = [
  "Metabolic Panel",
  "Lipid Panel",
  "Thyroid (TSH)",
  "Testosterone & Estradiol",
  "CRP & Homocysteine",
  "HbA1c",
  "Vitamin D",
  "CBC",
];

interface Props {
  slug: string;
}

const BloodworkBreakdown = ({ slug }: Props) => {
  const info = panelData[slug];
  if (!info) return null;

  return (
    <div className="mt-6 border-t border-border pt-5 space-y-4 mb-8">
      <p className="text-[10px] tracking-[0.25em] uppercase text-primary font-body font-light">
        Included Bloodwork
      </p>

      {/* Baseline Panel */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-foreground font-body">
          <TestTube size={14} className="text-primary shrink-0" />
          <span className="font-medium">{info.baseline}</span>
        </div>
        <div className="pl-6 grid grid-cols-1 gap-1">
          {baselineMarkers.map((m) => (
            <span
              key={m}
              className="text-[11px] text-muted-foreground font-body font-light"
            >
              • {m}
            </span>
          ))}
          <span className="text-[11px] text-primary/70 font-body italic">
            + 90 more biomarkers
          </span>
        </div>
      </div>

      {/* Core Checkups */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-foreground font-body">
          <Droplets size={14} className="text-primary shrink-0" />
          <span className="font-medium">{info.coreLabel}</span>
        </div>
        <div className="pl-6 grid grid-cols-1 gap-1">
          {coreMarkers.map((m) => (
            <span
              key={m}
              className="text-[11px] text-muted-foreground font-body font-light"
            >
              • {m}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BloodworkBreakdown;
