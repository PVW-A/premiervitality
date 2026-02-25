import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Activity, Droplets, Heart, Flame, Brain, ShieldCheck, TrendingUp, TrendingDown, ChevronRight, ChevronDown, Info, TestTubes, Zap } from "lucide-react";
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

interface CatConfig {
  icon: any;
  color: string;
  desc: string;
  markers: MarkerDef[];
  priority: "primary" | "secondary";
}

const categoryConfig: Record<string, CatConfig> = {
  Hormones: {
    icon: Activity, color: "168, 85%, 57%", priority: "primary",
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
      { name: "SHBG", unit: "nmol/L", low: 10, high: 57, optimalLow: 20, optimalHigh: 40,
        what: "Sex hormone binding globulin — binds testosterone, affecting how much is available.",
        tips: ["Lose excess body fat if high", "Reduce sugar intake", "Zinc & magnesium supplementation"] },
      { name: "Cortisol (AM)", unit: "µg/dL", low: 6, high: 18, optimalLow: 10, optimalHigh: 15,
        what: "Morning stress hormone — too high or low signals adrenal imbalance.",
        tips: ["Morning sunlight exposure", "Adaptogenic herbs (ashwagandha)", "Consistent sleep schedule"] },
      { name: "Prolactin", unit: "ng/mL", low: 2, high: 18, optimalLow: 4, optimalHigh: 12,
        what: "Pituitary hormone — elevated levels can suppress testosterone and libido.",
        tips: ["Vitamin B6 (P5P form)", "Manage dopamine levels", "Check pituitary if very elevated"] },
      { name: "LH", unit: "mIU/mL", low: 1.5, high: 9.3, optimalLow: 3, optimalHigh: 7,
        what: "Luteinizing hormone — signals your testes to produce testosterone.",
        tips: ["Maintain healthy body weight", "Reduce endocrine disruptors", "Ensure adequate zinc"] },
      { name: "FSH", unit: "mIU/mL", low: 1.5, high: 12.4, optimalLow: 2, optimalHigh: 8,
        what: "Follicle-stimulating hormone — involved in sperm production and fertility.",
        tips: ["Manage stress", "Healthy fat intake", "Avoid heat exposure to testes"] },
      { name: "Progesterone", unit: "ng/mL", low: 0.2, high: 1.4, optimalLow: 0.3, optimalHigh: 1.0,
        what: "Supports sleep, mood, and balances other hormones.",
        tips: ["Manage stress and cortisol", "Adequate vitamin C", "Healthy fat intake"] },
    ],
  },
  "Metabolic Panel": {
    icon: Flame, color: "25, 95%, 53%", priority: "primary",
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
      { name: "Uric Acid", unit: "mg/dL", low: 3.5, high: 7.2, optimalLow: 4.0, optimalHigh: 6.0,
        what: "Elevated levels are linked to gout, kidney stones, and metabolic syndrome.",
        tips: ["Reduce purine-rich foods", "Stay well hydrated", "Limit fructose and alcohol"] },
    ],
  },
  "Lipid Panel": {
    icon: Heart, color: "340, 82%, 52%", priority: "primary",
    desc: "Cholesterol and fats — key indicators of cardiovascular risk.",
    markers: [
      { name: "Total Cholesterol", unit: "mg/dL", low: 125, high: 200, optimalLow: 150, optimalHigh: 190,
        what: "Overall cholesterol level — context matters more than the number alone.",
        tips: ["Increase soluble fiber", "Healthy fats (olive oil, nuts)", "Regular aerobic exercise"] },
      { name: "LDL Cholesterol", unit: "mg/dL", low: 0, high: 100, optimalLow: 0, optimalHigh: 80,
        what: "\"Bad\" cholesterol — the primary driver of arterial plaque buildup.",
        tips: ["Reduce saturated & trans fats", "Increase fiber (psyllium)", "Consider statins if persistently high"] },
      { name: "HDL Cholesterol", unit: "mg/dL", low: 40, high: 100, optimalLow: 50, optimalHigh: 80,
        what: "\"Good\" cholesterol — helps remove LDL from your arteries.",
        tips: ["Regular aerobic exercise", "Omega-3 fatty acids", "Moderate alcohol may help"] },
      { name: "Triglycerides", unit: "mg/dL", low: 0, high: 150, optimalLow: 0, optimalHigh: 100,
        what: "Blood fats from food — elevated levels signal metabolic and heart risk.",
        tips: ["Cut sugar and refined carbs", "Omega-3 supplements", "Limit alcohol"] },
      { name: "VLDL", unit: "mg/dL", low: 5, high: 40, optimalLow: 5, optimalHigh: 25,
        what: "Very low-density lipoprotein — carries triglycerides and contributes to plaque.",
        tips: ["Reduce triglycerides", "Healthy diet", "Exercise regularly"] },
    ],
  },
  Thyroid: {
    icon: ShieldCheck, color: "262, 83%, 58%", priority: "primary",
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
      { name: "Reverse T3", unit: "ng/dL", low: 9.2, high: 24.1, optimalLow: 10, optimalHigh: 18,
        what: "Inactive thyroid hormone — elevations signal stress, illness, or poor T4-to-T3 conversion.",
        tips: ["Reduce chronic stress", "Address inflammation", "Optimize selenium & iron"] },
      { name: "Thyroid Peroxidase Ab", unit: "IU/mL", low: 0, high: 9, optimalLow: 0, optimalHigh: 5,
        what: "Antibodies that attack your thyroid — elevated levels suggest autoimmune thyroiditis.",
        tips: ["Consider gluten-free trial", "Selenium supplementation", "Reduce gut inflammation"] },
    ],
  },
  Inflammation: {
    icon: Flame, color: "0, 84%, 60%", priority: "primary",
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
    icon: Droplets, color: "199, 89%, 48%", priority: "primary",
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
      { name: "GGT", unit: "U/L", low: 9, high: 48, optimalLow: 10, optimalHigh: 30,
        what: "Liver enzyme tied to bile duct function — very sensitive to alcohol use.",
        tips: ["Reduce or eliminate alcohol", "Maintain healthy weight", "Avoid hepatotoxic substances"] },
      { name: "ALP", unit: "U/L", low: 44, high: 147, optimalLow: 50, optimalHigh: 100,
        what: "Alkaline phosphatase — related to liver and bone health.",
        tips: ["Ensure adequate vitamin D & calcium", "Check liver if very elevated", "Bone-loading exercise"] },
      { name: "Albumin", unit: "g/dL", low: 3.5, high: 5.5, optimalLow: 4.0, optimalHigh: 5.0,
        what: "Protein made by the liver — reflects nutritional status and liver function.",
        tips: ["Adequate protein intake", "Stay hydrated", "Address chronic inflammation"] },
      { name: "Total Protein", unit: "g/dL", low: 6.0, high: 8.3, optimalLow: 6.5, optimalHigh: 7.8,
        what: "Sum of albumin and globulins — indicates overall protein balance.",
        tips: ["Balanced protein diet", "Check immunoglobulins if elevated", "Hydration"] },
      { name: "Bilirubin (Total)", unit: "mg/dL", low: 0.1, high: 1.2, optimalLow: 0.2, optimalHigh: 0.8,
        what: "Waste product from red blood cell breakdown — elevated can signal liver or gallbladder issues.",
        tips: ["Stay hydrated", "Limit alcohol", "Check for Gilbert syndrome if mildly elevated"] },
      { name: "eGFR", unit: "mL/min", low: 90, high: 120, optimalLow: 95, optimalHigh: 120,
        what: "Estimated kidney filtration rate — the gold standard for kidney function.",
        tips: ["Stay hydrated", "Control blood pressure", "Moderate protein if compromised"] },
      { name: "LDH", unit: "U/L", low: 140, high: 280, optimalLow: 150, optimalHigh: 220,
        what: "Lactate dehydrogenase — rises with tissue damage, exercise, or hemolysis.",
        tips: ["Allow recovery after hard workouts", "Check for underlying causes if persistently high"] },
    ],
  },
  "Cognitive & Neuro": {
    icon: Brain, color: "45, 93%, 47%", priority: "primary",
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
  "CBC": {
    icon: TestTubes, color: "280, 65%, 55%", priority: "secondary",
    desc: "Complete blood count — measures red cells, white cells, and platelets.",
    markers: [
      { name: "WBC", unit: "K/µL", low: 4.5, high: 11.0, optimalLow: 5.0, optimalHigh: 8.0,
        what: "White blood cells — your immune system's army. Elevated may signal infection or inflammation.",
        tips: ["Address infections", "Manage stress", "Anti-inflammatory diet"] },
      { name: "RBC", unit: "M/µL", low: 4.5, high: 5.5, optimalLow: 4.7, optimalHigh: 5.3,
        what: "Red blood cells — carry oxygen throughout your body.",
        tips: ["Iron-rich foods", "Stay hydrated", "Check for dehydration if high"] },
      { name: "Hemoglobin", unit: "g/dL", low: 13.5, high: 17.5, optimalLow: 14.5, optimalHigh: 16.5,
        what: "Oxygen-carrying protein in red blood cells — critical for energy.",
        tips: ["Iron supplementation if low", "Check for blood loss", "B12 and folate intake"] },
      { name: "Hematocrit", unit: "%", low: 38.3, high: 48.6, optimalLow: 40, optimalHigh: 46,
        what: "Percentage of blood that is red blood cells — affected by hydration and altitude.",
        tips: ["Stay hydrated", "Monitor on TRT", "Donate blood if too high"] },
      { name: "Platelets", unit: "K/µL", low: 150, high: 400, optimalLow: 180, optimalHigh: 320,
        what: "Blood clotting cells — too low risks bleeding, too high risks clotting.",
        tips: ["Check with doctor if out of range", "Omega-3 may help if high", "Avoid aspirin if low"] },
      { name: "MCV", unit: "fL", low: 80, high: 100, optimalLow: 85, optimalHigh: 95,
        what: "Mean cell volume — size of your red blood cells. Too large may indicate B12/folate deficiency.",
        tips: ["B12 and folate if high", "Iron if low", "Check thyroid function"] },
      { name: "MCH", unit: "pg", low: 27, high: 33, optimalLow: 28, optimalHigh: 32,
        what: "Average hemoglobin per red blood cell.",
        tips: ["Mirrors MCV — address same root causes", "Iron if low", "B12/folate if high"] },
      { name: "MCHC", unit: "g/dL", low: 32, high: 36, optimalLow: 33, optimalHigh: 35,
        what: "Average concentration of hemoglobin in each red blood cell.",
        tips: ["Iron supplementation if low", "Stay hydrated", "Investigate if persistently high"] },
      { name: "RDW", unit: "%", low: 11.5, high: 14.5, optimalLow: 11.8, optimalHigh: 13.5,
        what: "Red cell distribution width — variation in red blood cell size. High may indicate anemia.",
        tips: ["Iron, B12, or folate if elevated", "Address nutritional deficiencies", "Follow up with CBC trend"] },
    ],
  },
  "Electrolytes & Minerals": {
    icon: Zap, color: "190, 75%, 50%", priority: "secondary",
    desc: "Essential minerals that regulate hydration, nerve function, and muscle contractions.",
    markers: [
      { name: "Sodium", unit: "mEq/L", low: 136, high: 145, optimalLow: 138, optimalHigh: 143,
        what: "Primary electrolyte for fluid balance and blood pressure regulation.",
        tips: ["Stay hydrated", "Balance salt intake", "Monitor with blood pressure"] },
      { name: "Potassium", unit: "mEq/L", low: 3.5, high: 5.0, optimalLow: 3.8, optimalHigh: 4.5,
        what: "Critical for heart rhythm, muscle function, and nerve signals.",
        tips: ["Eat potassium-rich foods (bananas, avocado)", "Monitor with certain medications", "Stay hydrated"] },
      { name: "Calcium", unit: "mg/dL", low: 8.5, high: 10.5, optimalLow: 9.0, optimalHigh: 10.0,
        what: "Essential for bones, muscle contraction, and nerve signaling.",
        tips: ["Adequate vitamin D for absorption", "Dairy or fortified foods", "Weight-bearing exercise"] },
      { name: "Magnesium", unit: "mg/dL", low: 1.7, high: 2.2, optimalLow: 1.9, optimalHigh: 2.1,
        what: "Involved in 300+ enzymatic reactions — often deficient in modern diets.",
        tips: ["Supplement magnesium glycinate", "Eat dark leafy greens, nuts", "Reduce alcohol & caffeine"] },
      { name: "Chloride", unit: "mEq/L", low: 98, high: 106, optimalLow: 100, optimalHigh: 104,
        what: "Works with sodium to maintain fluid balance and acid-base equilibrium.",
        tips: ["Usually follows sodium", "Stay hydrated", "Check kidney function if abnormal"] },
      { name: "Phosphorus", unit: "mg/dL", low: 2.5, high: 4.5, optimalLow: 3.0, optimalHigh: 4.0,
        what: "Key for bone health and energy production (ATP).",
        tips: ["Balanced diet", "Monitor with kidney function", "Adequate vitamin D"] },
      { name: "Iron", unit: "µg/dL", low: 60, high: 170, optimalLow: 80, optimalHigh: 140,
        what: "Essential for oxygen transport — both low and high levels are problematic.",
        tips: ["Pair iron-rich foods with vitamin C", "Avoid iron with calcium/coffee", "Check ferritin for full picture"] },
      { name: "Ferritin", unit: "ng/mL", low: 20, high: 250, optimalLow: 50, optimalHigh: 150,
        what: "Iron storage protein — the best single marker for iron status.",
        tips: ["Iron supplementation if depleted", "Donate blood if too high", "Check inflammation (ferritin rises with hs-CRP)"] },
      { name: "TIBC", unit: "µg/dL", low: 250, high: 370, optimalLow: 260, optimalHigh: 340,
        what: "Total iron-binding capacity — reflects how much iron your blood can carry.",
        tips: ["High TIBC usually means low iron", "Pair with ferritin for full picture", "Iron-rich diet"] },
      { name: "CO2 (Bicarbonate)", unit: "mEq/L", low: 23, high: 29, optimalLow: 24, optimalHigh: 27,
        what: "Acid-base balance marker — abnormal levels can signal kidney or respiratory issues.",
        tips: ["Stay hydrated", "Alkaline foods (fruits, vegetables)", "Monitor with kidney function"] },
    ],
  },
};

const PRIMARY_CATEGORIES = Object.entries(categoryConfig).filter(([, c]) => c.priority === "primary").map(([n]) => n);
const SECONDARY_CATEGORIES = Object.entries(categoryConfig).filter(([, c]) => c.priority === "secondary").map(([n]) => n);

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
          background: isOpen ? `hsl(${config.color} / 0.06)` : "hsl(0 0% 100% / 0.02)",
          border: `1px solid ${isOpen ? `hsl(${config.color} / 0.2)` : "hsl(0 0% 100% / 0.04)"}`,
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
                        style={{ backgroundColor: gi ? gi.dotColor : "hsl(0 0% 100% / 0.08)" }}
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
                            style={{ background: "hsl(0 0% 100% / 0.03)" }}
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

function computeVitalityScore(results: BiomarkerResult[], allMarkers: MarkerDef[]): number | null {
  const graded: number[] = [];
  allMarkers.forEach((m) => {
    const mr = results.filter((r) => r.marker_name === m.name);
    if (mr.length === 0) return;
    const latest = mr.reduce((a, b) => (a.lab_date > b.lab_date ? a : b));
    const grade = getGrade(latest.value, m);
    const scoreMap: Record<Grade, number> = {
      critical: 15, low: 45, normal: 70, optimal: 100, high: 45, critical_high: 15,
    };
    graded.push(scoreMap[grade]);
  });
  if (graded.length === 0) return null;
  return Math.round(graded.reduce((a, b) => a + b, 0) / graded.length);
}

function getScoreColor(score: number): string {
  if (score >= 85) return "152, 69%, 50%";
  if (score >= 70) return "168, 85%, 57%";
  if (score >= 55) return "45, 93%, 47%";
  if (score >= 40) return "25, 95%, 53%";
  return "0, 84%, 60%";
}

function getScoreLabel(score: number): string {
  if (score >= 85) return "Excellent";
  if (score >= 70) return "Good";
  if (score >= 55) return "Fair";
  if (score >= 40) return "Needs Attention";
  return "Critical";
}

function VitalityScoreWidget({ score }: { score: number }) {
  const color = getScoreColor(score);
  const label = getScoreLabel(score);
  const circumference = 2 * Math.PI * 54;
  const dashOffset = circumference - (score / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center gap-3 py-6 px-4 rounded-xl"
      style={{
        background: `linear-gradient(135deg, hsl(${color} / 0.04), hsl(0 0% 100% / 0.01))`,
        border: `1px solid hsl(${color} / 0.1)`,
      }}
    >
      <div className="relative w-32 h-32">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="54" fill="none" stroke="hsl(0 0% 100% / 0.04)" strokeWidth="6" />
          <motion.circle
            cx="60" cy="60" r="54" fill="none"
            stroke={`hsl(${color})`}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: dashOffset }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
            style={{ filter: `drop-shadow(0 0 8px hsl(${color} / 0.4))` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className="text-3xl font-heading font-light text-foreground tabular-nums"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {score}
          </motion.span>
          <span className="text-[9px] tracking-[0.2em] uppercase text-muted-foreground/50 font-body">
            / 100
          </span>
        </div>
      </div>
      <div className="text-center">
        <span
          className="text-sm font-body font-light"
          style={{ color: `hsl(${color})` }}
        >
          {label}
        </span>
        <p className="text-[10px] text-muted-foreground/40 font-body font-light mt-0.5 max-w-[240px]">
          Aggregated from your latest biomarker results across all categories.
        </p>
      </div>
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

  const allMarkers = Object.values(categoryConfig).flatMap((c) => c.markers);
  const vitalityScore = computeVitalityScore(results, allMarkers);

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

      {vitalityScore !== null && <VitalityScoreWidget score={vitalityScore} />}

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