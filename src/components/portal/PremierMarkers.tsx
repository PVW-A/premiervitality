import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Droplets, Heart, Flame, Brain, ShieldCheck } from "lucide-react";

const categories = [
  {
    title: "Hormones",
    icon: Activity,
    markers: [
      { name: "Testosterone (Total)", range: "300–1000 ng/dL", status: "optimal" },
      { name: "Free Testosterone", range: "9–30 ng/dL", status: "pending" },
      { name: "Estradiol (E2)", range: "20–50 pg/mL", status: "pending" },
      { name: "IGF-1", range: "100–300 ng/mL", status: "pending" },
      { name: "DHEA-S", range: "100–400 µg/dL", status: "pending" },
    ],
  },
  {
    title: "Metabolic Panel",
    icon: Flame,
    markers: [
      { name: "Fasting Glucose", range: "70–99 mg/dL", status: "pending" },
      { name: "HbA1c", range: "< 5.7%", status: "pending" },
      { name: "Insulin (Fasting)", range: "2–25 µIU/mL", status: "pending" },
      { name: "Lipid Panel (Total)", range: "< 200 mg/dL", status: "pending" },
    ],
  },
  {
    title: "Thyroid",
    icon: ShieldCheck,
    markers: [
      { name: "TSH", range: "0.4–4.0 mIU/L", status: "pending" },
      { name: "Free T3", range: "2.3–4.2 pg/mL", status: "pending" },
      { name: "Free T4", range: "0.8–1.8 ng/dL", status: "pending" },
    ],
  },
  {
    title: "Inflammation",
    icon: Heart,
    markers: [
      { name: "hs-CRP", range: "< 1.0 mg/L", status: "pending" },
      { name: "Homocysteine", range: "5–15 µmol/L", status: "pending" },
      { name: "ESR", range: "0–20 mm/hr", status: "pending" },
    ],
  },
  {
    title: "Liver & Kidney",
    icon: Droplets,
    markers: [
      { name: "ALT", range: "7–56 U/L", status: "pending" },
      { name: "AST", range: "10–40 U/L", status: "pending" },
      { name: "Creatinine", range: "0.7–1.3 mg/dL", status: "pending" },
      { name: "BUN", range: "7–20 mg/dL", status: "pending" },
    ],
  },
  {
    title: "Cognitive & Neuro",
    icon: Brain,
    markers: [
      { name: "Vitamin D (25-OH)", range: "40–80 ng/mL", status: "pending" },
      { name: "Vitamin B12", range: "200–900 pg/mL", status: "pending" },
      { name: "Folate", range: "2.7–17 ng/mL", status: "pending" },
    ],
  },
];

const statusStyles: Record<string, string> = {
  optimal: "bg-green-500/20 text-green-400 border-green-500/30",
  attention: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  pending: "bg-muted text-muted-foreground border-border",
};

export default function PremierMarkers() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-heading font-light text-foreground">Premier Markers</h2>
        <p className="text-sm text-muted-foreground font-body font-light mt-1">
          Your comprehensive biomarker dashboard — the foundation of precision peptide therapy.
        </p>
        <p className="text-xs text-muted-foreground/70 font-body font-light mt-3 italic">
          Lab results will populate here once your bloodwork is processed by your provider.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {categories.map((cat) => (
          <Card key={cat.title} className="border-border bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base font-heading font-light text-foreground">
                <cat.icon size={16} strokeWidth={1.2} className="text-primary" />
                {cat.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {cat.markers.map((m) => (
                <div key={m.name} className="flex items-center justify-between text-sm font-body font-light">
                  <div className="flex flex-col">
                    <span className="text-foreground">{m.name}</span>
                    <span className="text-xs text-muted-foreground">{m.range}</span>
                  </div>
                  <Badge variant="outline" className={`text-[10px] ${statusStyles[m.status]}`}>
                    {m.status === "pending" ? "Awaiting Labs" : m.status}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
