// Curated featured compounds — goal-oriented, patient-friendly
// Each compound maps to one or more goals and has both plain-English and clinical descriptions

import {
  Flame, Dumbbell, Sparkles, Zap, Heart, Droplets, Shield, TrendingUp,
  Activity, Syringe, Brain,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type Goal =
  | "Weight Loss"
  | "Muscle & Recovery"
  | "Anti-Aging"
  | "Energy & Focus"
  | "Sexual Health"
  | "Hair & Skin"
  | "Immunity"
  | "Hormones";

export interface FeaturedCompound {
  name: string;
  tagline: string;           // plain English — what a patient reads first
  clinicalSummary: string;   // one paragraph with study citations
  goals: Goal[];
  category: string;          // maps to products table category
  popular?: boolean;
}

export const GOALS: Goal[] = [
  "Weight Loss",
  "Muscle & Recovery",
  "Anti-Aging",
  "Energy & Focus",
  "Sexual Health",
  "Hair & Skin",
  "Immunity",
  "Hormones",
];

export const GOAL_ICONS: Record<Goal, LucideIcon> = {
  "Weight Loss": Flame,
  "Muscle & Recovery": Dumbbell,
  "Anti-Aging": Sparkles,
  "Energy & Focus": Zap,
  "Sexual Health": Heart,
  "Hair & Skin": Droplets,
  "Immunity": Shield,
  "Hormones": TrendingUp,
};

export const CATEGORY_ICONS: Record<string, LucideIcon> = {
  "Weight Management": Flame,
  "Wellness": Activity,
  "IM / IV / SQ Therapy": Zap,
  "Sexual Well-Being": Heart,
  "Dermatology": Sparkles,
  "Hair Restore": Droplets,
  "Hormone Restoration": TrendingUp,
  "Cognitive": Brain,
};

export const FEATURED_COMPOUNDS: FeaturedCompound[] = [
  // ── WEIGHT LOSS ──────────────────────────────────────────────────────────
  {
    name: "Semaglutide",
    tagline: "The most clinically proven weight loss peptide available.",
    clinicalSummary: "GLP-1 receptor agonist. Phase 3 STEP trials showed average body weight reduction of 14.9% over 68 weeks vs. 2.4% placebo (Wilding et al., NEJM 2021). Reduces appetite via hypothalamic GLP-1 receptors and slows gastric emptying. FDA-approved as Wegovy® and Ozempic®.",
    goals: ["Weight Loss"],
    category: "Weight Management",
    popular: true,
  },
  {
    name: "Tirzepatide",
    tagline: "Next-generation dual-action weight loss — up to 22% body weight reduction.",
    clinicalSummary: "Dual GIP/GLP-1 receptor agonist. SURMOUNT-1 trial reported up to 22.5% mean weight loss at 72 weeks in non-diabetic adults (Jastreboff et al., NEJM 2022). FDA-approved as Zepbound® for obesity.",
    goals: ["Weight Loss"],
    category: "Weight Management",
    popular: true,
  },
  {
    name: "AOD-9604",
    tagline: "Targets fat loss directly without affecting blood sugar or muscle.",
    clinicalSummary: "Synthetic fragment of growth hormone (hGH 177–191). Stimulates fat breakdown and inhibits fat storage without affecting IGF-1 or insulin. Human phase 2 trials showed favorable safety with no diabetogenic effects (Heffernan et al., 2001).",
    goals: ["Weight Loss"],
    category: "Weight Management",
  },

  // ── MUSCLE & RECOVERY ────────────────────────────────────────────────────
  {
    name: "BPC-157",
    tagline: "Accelerates healing of tendons, muscles, gut, and joints.",
    clinicalSummary: "Pentadecapeptide derived from human gastric protein. Extensive preclinical data demonstrates accelerated healing of muscle, tendon, and ligament via upregulation of VEGF and nitric oxide. Also shows GI mucosal healing and CNS neuroprotective properties (Sikiric et al., 2016).",
    goals: ["Muscle & Recovery", "Immunity"],
    category: "Wellness",
    popular: true,
  },
  {
    name: "TB-500",
    tagline: "Promotes tissue regeneration, reduces inflammation, and speeds recovery.",
    clinicalSummary: "Synthetic analogue of Thymosin Beta-4. Promotes actin polymerization, cell migration, and angiogenesis. Murine studies demonstrate accelerated wound closure, cardiac regeneration post-MI, and reduced fibrosis (Goldstein et al., 2012).",
    goals: ["Muscle & Recovery"],
    category: "Wellness",
  },
  {
    name: "CJC-1295",
    tagline: "Boosts growth hormone for better sleep, muscle gain, and fat loss.",
    clinicalSummary: "GHRH analogue with extended half-life of 6–8 days. Phase 1/2 data demonstrated 2–10 fold increases in GH levels and sustained IGF-1 elevation over 28 days (Teichman et al., JCEM 2006). Often stacked with Ipamorelin for synergistic effect.",
    goals: ["Muscle & Recovery", "Anti-Aging"],
    category: "Wellness",
    popular: true,
  },
  {
    name: "Ipamorelin",
    tagline: "Clean GH pulse with no cortisol spike — ideal for recovery and lean mass.",
    clinicalSummary: "Selective GH secretagogue with minimal cortisol, prolactin, or ACTH co-stimulation compared to older GHRPs (Raun et al., Eur J Endocrinol 1998). Commonly combined with CJC-1295 for amplified pulsatile GH release.",
    goals: ["Muscle & Recovery", "Anti-Aging"],
    category: "Wellness",
  },
  {
    name: "MK-677",
    tagline: "Oral GH booster — improves sleep quality, lean mass, and IGF-1 levels.",
    clinicalSummary: "Orally active GHSR-1a agonist (ibutamoren). 12-month trial in elderly subjects showed sustained IGF-1 elevation (+39%), increased lean body mass, and improved sleep architecture with no significant glucose impact at 25mg/day (Nass et al., JCEM 2008).",
    goals: ["Muscle & Recovery", "Anti-Aging"],
    category: "Wellness",
  },

  // ── ANTI-AGING ────────────────────────────────────────────────────────────
  {
    name: "Sermorelin",
    tagline: "Restores your body's natural growth hormone production — the safer alternative to HGH.",
    clinicalSummary: "GHRH analogue that stimulates endogenous pituitary GH in a physiological pulsatile pattern. Studies show significant increases in IGF-1, lean body mass, and bone mineral density without suppressing the hypothalamic-pituitary axis (Walker et al., 1990).",
    goals: ["Anti-Aging", "Muscle & Recovery"],
    category: "Wellness",
    popular: true,
  },
  {
    name: "Epithalon",
    tagline: "Activates telomerase — the enzyme linked to cellular longevity.",
    clinicalSummary: "Tetrapeptide developed at the St. Petersburg Institute of Bioregulation. Stimulates telomerase activity and elongates telomeres in somatic cells in vitro (Khavinson et al., 2003). Longitudinal Russian data in elderly cohorts reported reduced mortality and improved melatonin regulation over 6–12 years.",
    goals: ["Anti-Aging"],
    category: "Wellness",
  },
  {
    name: "NAD+",
    tagline: "Restores cellular energy — the coenzyme your mitochondria need most.",
    clinicalSummary: "Nicotinamide adenine dinucleotide — coenzyme in redox metabolism and substrate for SIRT1–7 and PARP DNA repair enzymes. Declines ~50% from age 40–60. IV repletion restores tissue NAD+ with reported improvements in energy, cognition, and metabolic flexibility (Rajman et al., Cell Metab 2018).",
    goals: ["Anti-Aging", "Energy & Focus"],
    category: "IM / IV / SQ Therapy",
    popular: true,
  },

  // ── ENERGY & FOCUS ───────────────────────────────────────────────────────
  {
    name: "Semax",
    tagline: "Sharpens cognitive function, boosts BDNF, and protects the brain.",
    clinicalSummary: "Synthetic ACTH(4–10) analogue. Increases BDNF and NGF in the prefrontal cortex and hippocampus. Russian clinical data supports neuroprotective applications in ischemic stroke and cognitive impairment. Activates dopaminergic and serotonergic transmission (Dolotov et al., 2006).",
    goals: ["Energy & Focus"],
    category: "Wellness",
  },
  {
    name: "Selank",
    tagline: "Reduces anxiety and improves focus — without sedation or dependency.",
    clinicalSummary: "Heptapeptide analogue of tuftsin. Anxiolytic without sedation — modulates GABAergic, serotonergic, and dopaminergic systems. Phase 2/3 data shows efficacy in generalized anxiety comparable to benzodiazepines without cognitive impairment (Zozulya et al., 2001).",
    goals: ["Energy & Focus"],
    category: "Wellness",
  },
  {
    name: "Dihexa",
    tagline: "Potent synaptogenesis activator — studied for memory and cognitive decline.",
    clinicalSummary: "Angiotensin IV analogue and HGF/Met system potentiator. Animal studies demonstrate up to 7-fold greater potency than BDNF in synaptogenesis assays. Crosses blood-brain barrier; improves spatial learning in aged rodent models (McCoy et al., 2013).",
    goals: ["Energy & Focus", "Anti-Aging"],
    category: "Wellness",
  },
  {
    name: "Methylene Blue",
    tagline: "Enhances mitochondrial function and cognitive performance.",
    clinicalSummary: "Mitochondrial electron carrier and MAO inhibitor. Low-dose studies (0.5–4 mg/kg) demonstrate enhanced mitochondrial respiration, neuroprotection, and memory consolidation in controlled trials (Rojas et al., 2012).",
    goals: ["Energy & Focus", "Anti-Aging"],
    category: "IM / IV / SQ Therapy",
  },

  // ── SEXUAL HEALTH ────────────────────────────────────────────────────────
  {
    name: "PT-141",
    tagline: "FDA-approved for low libido — works in the brain, not just the body.",
    clinicalSummary: "Bremelanotide — melanocortin receptor agonist. FDA-approved as Vyleesi® for hypoactive sexual desire disorder in premenopausal women. MC4R activation in the CNS drives pro-erectile and libido effects in both sexes. Phase 2 data in men showed 80% response rate (Diamond et al., 2004).",
    goals: ["Sexual Health"],
    category: "Sexual Well-Being",
    popular: true,
  },
  {
    name: "Oxytocin",
    tagline: "Deepens intimacy, reduces stress, and enhances sexual connection.",
    clinicalSummary: "Hypothalamic neuropeptide mediating social bonding, trust, and sexual arousal. Intranasal administration studies show enhanced emotional recognition, reduced cortisol, and improved sexual function. Modulates HPA axis and dopaminergic reward pathways (MacDonald & Macdonald, 2010).",
    goals: ["Sexual Health"],
    category: "Sexual Well-Being",
  },

  // ── HAIR & SKIN ──────────────────────────────────────────────────────────
  {
    name: "GHK-Cu",
    tagline: "Rebuilds collagen, repairs skin damage, and reverses visible aging.",
    clinicalSummary: "Glycyl-L-histidyl-L-lysine copper complex. Activates over 4,000 human genes governing collagen synthesis, anti-inflammatory pathways, and DNA repair. Multiple double-blind trials show significant improvements in skin laxity, fine lines, and photodamage vs. placebo (Pickart et al., 2015).",
    goals: ["Hair & Skin", "Anti-Aging"],
    category: "Dermatology",
    popular: true,
  },
  {
    name: "Tretinoin",
    tagline: "Gold standard for anti-aging skin — FDA-approved and extensively validated.",
    clinicalSummary: "All-trans retinoic acid. Upregulates procollagen I/III synthesis, normalizes keratinocyte differentiation, and reduces matrix metalloproteinase expression. FDA-approved for acne; extensive RCT evidence for photoaging (Griffiths et al., NEJM 1995).",
    goals: ["Hair & Skin"],
    category: "Dermatology",
  },
  {
    name: "Minoxidil",
    tagline: "Proven hair regrowth — extends the anagen phase and revives follicles.",
    clinicalSummary: "Potassium channel opener. Extends anagen phase and increases follicular size. FDA-approved for androgenetic alopecia. Oral low-dose (0.25–1.25mg) demonstrates superior efficacy to topical with acceptable tolerability (Randolph & Tosti, JAAD 2021).",
    goals: ["Hair & Skin"],
    category: "Hair Restore",
    popular: true,
  },
  {
    name: "Finasteride",
    tagline: "Stops DHT-driven hair loss at the source.",
    clinicalSummary: "5α-reductase type II inhibitor. Reduces scalp/serum DHT by ~65–70%. 5-year RCT showed 48% increase in hair count vs. baseline (Kaufman et al., 1998). Requires comprehensive patient counseling regarding post-finasteride syndrome reports.",
    goals: ["Hair & Skin"],
    category: "Hair Restore",
  },

  // ── IMMUNITY ─────────────────────────────────────────────────────────────
  {
    name: "Thymosin Alpha-1",
    tagline: "Supercharges your immune system — used in 35+ countries for chronic infections.",
    clinicalSummary: "N-terminal fragment of prothymosin alpha (28 AA). FDA-designated orphan drug. Upregulates Th1 cytokines, NK cells, and dendritic cell activity. Approved in 35+ countries for hepatitis B/C and immunodeficiency. Studied for COVID-19 cytokine storm modulation (Romani et al., 2012).",
    goals: ["Immunity", "Anti-Aging"],
    category: "Wellness",
  },
  {
    name: "VIP",
    tagline: "Powerful anti-inflammatory — studied for autoimmune and lung conditions.",
    clinicalSummary: "Vasoactive Intestinal Peptide. Activates VPAC1/VPAC2 receptors, inhibiting TNF-α, IL-6, IL-12, and nitric oxide. Studied in rheumatoid arthritis, Crohn's disease, and pulmonary hypertension. Promotes regulatory T-cell differentiation (Delgado et al., 2004).",
    goals: ["Immunity"],
    category: "Wellness",
  },

  // ── HORMONES ─────────────────────────────────────────────────────────────
  {
    name: "Testosterone",
    tagline: "Restores energy, strength, libido, and body composition in hypogonadal men.",
    clinicalSummary: "Primary androgen governing libido, muscle protein synthesis, erythropoiesis, and cognitive function. Extensive RCT data supports TRT in hypogonadal men for improvements in body composition, sexual function, mood, and metabolic parameters (Bhasin et al., NEJM 2010). Aromatase monitoring required.",
    goals: ["Hormones", "Muscle & Recovery", "Sexual Health"],
    category: "Hormone Restoration",
    popular: true,
  },
  {
    name: "Estradiol",
    tagline: "Bioidentical estrogen — restores hormonal balance, bone density, and cognitive function.",
    clinicalSummary: "Predominant endogenous estrogen (E2). Transdermal delivery avoids first-pass hepatic metabolism, reducing thrombotic risk vs. oral. WHI and subsequent analyses support favorable benefit-risk profile for women initiating HRT within 10 years of menopause (Manson et al., 2017).",
    goals: ["Hormones", "Anti-Aging"],
    category: "Hormone Restoration",
    popular: true,
  },
  {
    name: "DHEA",
    tagline: "The precursor to all sex hormones — declines 80% by age 70.",
    clinicalSummary: "Adrenal precursor steroid converting peripherally to testosterone and estradiol. RCTs in adrenal insufficiency and aging demonstrate improvements in libido, bone density, and insulin sensitivity. Intravaginal DHEA (Intrarosa) is FDA-approved for dyspareunia.",
    goals: ["Hormones", "Sexual Health", "Anti-Aging"],
    category: "Hormone Restoration",
  },
];
