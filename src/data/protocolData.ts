/* ═══════════════════════════════════════════════════════════════════
   Protocol Data — shared between Protocols listing + ProtocolDetail
   ═══════════════════════════════════════════════════════════════════ */

/* ───────────────────────────── types ───────────────────────────── */

export interface ProtocolCard {
  id: string;
  name: string;
  duration: string;
}

export type TieredProtocols = {
  premier: ProtocolCard[];
  core: ProtocolCard[];
  essential: ProtocolCard[];
};

export interface StandardCategory {
  id: string;
  name: string;
  description: string;
  gendered: false;
  tiers: TieredProtocols;
}

export interface GenderedCategory {
  id: string;
  name: string;
  description: string;
  gendered: true;
  her: TieredProtocols;
  him: TieredProtocols;
}

export type CategoryData = StandardCategory | GenderedCategory;

export type Tier = (typeof TIERS)[number];

/* ───────────────────────────── tier meta ───────────────────────── */

export const tierMeta = {
  premier: {
    label: "PREMIER",
    accent: "#AB8F5F",
    borderIdle: "rgba(255,255,255,0.08)",
    borderHover: "rgba(255,255,255,0.15)",
    badge: "text-white/50",
    badgeBg: "rgba(255,255,255,0.04)",
    badgeBorder: "rgba(255,255,255,0.08)",
    description: "Elevated solutions for full-spectrum optimization",
  },
  core: {
    label: "CORE",
    accent: "#AB8F5F",
    borderIdle: "rgba(255,255,255,0.08)",
    borderHover: "rgba(255,255,255,0.15)",
    badge: "text-white/50",
    badgeBg: "rgba(255,255,255,0.04)",
    badgeBorder: "rgba(255,255,255,0.08)",
    description: "Strategic balance of efficacy and value",
  },
  essential: {
    label: "ESSENTIAL",
    accent: "#AB8F5F",
    borderIdle: "rgba(255,255,255,0.08)",
    borderHover: "rgba(255,255,255,0.15)",
    badge: "text-white/50",
    badgeBg: "rgba(255,255,255,0.04)",
    badgeBorder: "rgba(255,255,255,0.08)",
    description: "Foundational support for targeted needs",
  },
} as const;

export const TIERS = ["premier", "core", "essential"] as const;

/* ───────────────────────────── data ───────────────────────────── */

export const CATEGORIES: CategoryData[] = [
  /* ── Weight Management ── */
  {
    id: "weight",
    name: "Weight Management",
    description: "Physician-directed protocols targeting metabolic optimization, appetite regulation, and sustainable body composition change.",
    gendered: false,
    tiers: {
      premier: [
        { id: "wm-p1", name: "GLP-1+GIP / GH Secretagogue", duration: "12 weeks" },
        { id: "wm-p2", name: "GLP-1+GIP / Mitochondrial Uncoupler", duration: "12 weeks" },
        { id: "wm-p3", name: "GLP-1+GIP / Weight Loss / Thermogenesis", duration: "12 weeks" },
        { id: "wm-p4", name: "Lyophilized GLP-1+GIP / GH Secretagogue", duration: "12 weeks" },
        { id: "wm-p5", name: "Capsule Mitochondrial Uncoupler", duration: "12 weeks" },
      ],
      core: [
        { id: "wm-c1", name: "GLP-1+GIP / GH Secretagogue", duration: "12 weeks" },
        { id: "wm-c2", name: "GLP-1+GIP / Mitochondrial Uncoupler", duration: "12 weeks" },
        { id: "wm-c3", name: "GLP-1+GIP / Weight Loss / Thermogenesis", duration: "12 weeks" },
        { id: "wm-c4", name: "Lyophilized GLP-1+GIP / GH Secretagogue", duration: "12 weeks" },
        { id: "wm-c5", name: "Capsule Mitochondrial Uncoupler", duration: "12 weeks" },
      ],
      essential: [
        { id: "wm-e1", name: "GLP-1+GIP / GH Secretagogue", duration: "12 weeks" },
        { id: "wm-e2", name: "GLP-1+GIP / Mitochondrial Uncoupler", duration: "12 weeks" },
        { id: "wm-e3", name: "GLP-1+GIP / Weight Loss / Thermogenesis", duration: "12 weeks" },
        { id: "wm-e4", name: "Lyophilized GLP-1+GIP / GH Secretagogue", duration: "12 weeks" },
        { id: "wm-e5", name: "Capsule Mitochondrial Uncoupler", duration: "12 weeks" },
      ],
    },
  },

  /* ── Injury & Repair ── */
  {
    id: "injury",
    name: "Injury & Repair",
    description: "Targeted tissue repair protocols combining healing peptides with growth factors for accelerated recovery from injury.",
    gendered: false,
    tiers: {
      premier: [
        { id: "ir-p1", name: "Tissue Repair / GH Secretagogue", duration: "8 weeks" },
        { id: "ir-p2", name: "Tissue Repair / Immuno-Modulating I", duration: "8 weeks" },
        { id: "ir-p3", name: "Tissue Repair / Immuno-Modulating II", duration: "8 weeks" },
        { id: "ir-p4", name: "Lyophilized Tissue Repair", duration: "8 weeks" },
        { id: "ir-p5", name: "Capsule Tissue Repair Protocol", duration: "8 weeks" },
      ],
      core: [
        { id: "ir-c1", name: "Tissue Repair / GH Secretagogue", duration: "8 weeks" },
        { id: "ir-c2", name: "Tissue Repair / Immuno-Modulating I", duration: "8 weeks" },
        { id: "ir-c3", name: "Tissue Repair / Immuno-Modulating II", duration: "8 weeks" },
        { id: "ir-c4", name: "Lyophilized Tissue Repair", duration: "8 weeks" },
        { id: "ir-c5", name: "Capsule Tissue Repair Protocol", duration: "8 weeks" },
      ],
      essential: [
        { id: "ir-e1", name: "Tissue Repair / GH Secretagogue", duration: "8 weeks" },
        { id: "ir-e2", name: "Tissue Repair / Immuno-Modulating I", duration: "8 weeks" },
        { id: "ir-e3", name: "Tissue Repair / Immuno-Modulating II", duration: "8 weeks" },
        { id: "ir-e4", name: "Lyophilized Tissue Repair", duration: "8 weeks" },
        { id: "ir-e5", name: "Capsule Tissue Repair Protocol", duration: "8 weeks" },
      ],
    },
  },

  /* ── Performance ── */
  {
    id: "performance",
    name: "Performance",
    description: "Elite protocols for athletic performance, lean mass, and accelerated recovery between training sessions.",
    gendered: false,
    tiers: {
      premier: [
        { id: "pf-p1", name: "GH Secretagogue / Mitochondrial", duration: "12 weeks" },
        { id: "pf-p2", name: "GH Secretagogue High-Dose / IGF-1", duration: "12 weeks" },
        { id: "pf-p3", name: "GH / Vitamin / Neuropeptide", duration: "12 weeks" },
        { id: "pf-p4", name: "Lyophilized GH Secretagogue", duration: "12 weeks" },
        { id: "pf-p5", name: "Capsule Performance Protocol", duration: "12 weeks" },
      ],
      core: [
        { id: "pf-c1", name: "GH Secretagogue / Mitochondrial", duration: "12 weeks" },
        { id: "pf-c2", name: "GH Secretagogue High-Dose / IGF-1", duration: "12 weeks" },
        { id: "pf-c3", name: "GH / Vitamin / Neuropeptide", duration: "12 weeks" },
        { id: "pf-c4", name: "Lyophilized GH Secretagogue", duration: "12 weeks" },
        { id: "pf-c5", name: "Capsule Performance Protocol", duration: "12 weeks" },
      ],
      essential: [
        { id: "pf-e1", name: "GH Secretagogue / Mitochondrial", duration: "12 weeks" },
        { id: "pf-e2", name: "GH Secretagogue / IGF-1", duration: "12 weeks" },
        { id: "pf-e3", name: "GH / Vitamin / Neuropeptide", duration: "12 weeks" },
        { id: "pf-e4", name: "Lyophilized GH Secretagogue", duration: "12 weeks" },
        { id: "pf-e5", name: "Capsule Performance Protocol", duration: "12 weeks" },
      ],
    },
  },

  /* ── Immunity ── */
  {
    id: "immunity",
    name: "Immunity",
    description: "Immune-modulating protocols designed to strengthen resilience, support gut barrier integrity, and optimize immune surveillance.",
    gendered: false,
    tiers: {
      premier: [
        { id: "im-p1", name: "Thymosin Alpha-1 / Beta-4", duration: "8 weeks" },
        { id: "im-p2", name: "TA1 / Glutathione / Larazotide", duration: "8 weeks" },
        { id: "im-p3", name: "Lyophilized Immune Protocol", duration: "8 weeks" },
        { id: "im-p4", name: "Capsule Immune Protocol", duration: "8 weeks" },
      ],
      core: [
        { id: "im-c1", name: "Thymosin Alpha-1 / Beta-4", duration: "8 weeks" },
        { id: "im-c2", name: "TA1 / Glutathione / Larazotide", duration: "8 weeks" },
        { id: "im-c3", name: "Lyophilized Immune Protocol", duration: "8 weeks" },
        { id: "im-c4", name: "Capsule Immune Protocol", duration: "8 weeks" },
      ],
      essential: [
        { id: "im-e1", name: "Thymosin Alpha-1 / Beta-4", duration: "8 weeks" },
        { id: "im-e2", name: "TA1 / Glutathione / Larazotide", duration: "8 weeks" },
        { id: "im-e3", name: "Lyophilized Immune Protocol", duration: "8 weeks" },
        { id: "im-e4", name: "Capsule Immune Protocol", duration: "8 weeks" },
      ],
    },
  },

  /* ── Sexual Well-Being (gendered) ── */
  {
    id: "sexual",
    name: "Sexual Well-Being",
    description: "Targeted protocols for sexual health, libido, and intimate wellness - with formulations designed specifically for her and for him.",
    gendered: true,
    her: {
      premier: [
        { id: "sx-hp1", name: "SQ Injectable & Topical", duration: "4 weeks" },
      ],
      core: [
        { id: "sx-hc1", name: "Nasal Spray & Topical", duration: "4 weeks" },
      ],
      essential: [
        { id: "sx-he1", name: "Nasal Spray", duration: "4 weeks" },
        { id: "sx-he2", name: "Troche Protocol", duration: "4 weeks" },
      ],
    },
    him: {
      premier: [
        { id: "sx-mp1", name: "Injectable & SQ", duration: "4 weeks" },
      ],
      core: [
        { id: "sx-mc1", name: "Nasal Spray & Troche", duration: "4 weeks" },
      ],
      essential: [
        { id: "sx-me1", name: "Troche Protocol", duration: "4 weeks" },
      ],
    },
  },

  /* ── Cognitive Enhancement ── */
  {
    id: "cognitive",
    name: "Cognitive Enhancement",
    description: "Neuropeptide protocols for focus, memory, and cognitive longevity - from foundational nootropic support to advanced neurotrophin stacks.",
    gendered: false,
    tiers: {
      premier: [
        { id: "ce-p1", name: "Rg3 / Methylcobalamin / Alpha-GPC / Dihexa", duration: "8 weeks" },
        { id: "ce-p2", name: "Semax / Dihexa", duration: "8 weeks" },
        { id: "ce-p3", name: "Rg3 / NAD+ / Dihexa", duration: "8 weeks" },
      ],
      core: [
        { id: "ce-c1", name: "Rg3 / Methylcobalamin / Alpha-GPC", duration: "8 weeks" },
        { id: "ce-c2", name: "Semax / Nootropic Support", duration: "8 weeks" },
        { id: "ce-c3", name: "Rg3 / NAD+", duration: "8 weeks" },
      ],
      essential: [
        { id: "ce-e1", name: "Rg3 / Methylcobalamin", duration: "8 weeks" },
        { id: "ce-e2", name: "Semax Nasal", duration: "8 weeks" },
        { id: "ce-e3", name: "Rg3 / NAD+", duration: "8 weeks" },
      ],
    },
  },

  /* ── Hair Restore (gendered) ── */
  {
    id: "hair",
    name: "Hair Restore",
    description: "Clinically informed hair restoration protocols combining growth factors, DHT blockers, and follicle-stimulating peptides.",
    gendered: true,
    her: {
      premier: [
        { id: "hr-hp1", name: "GHK-Cu + Zinc Thymulin / Bimatoprost", duration: "12 weeks" },
      ],
      core: [
        { id: "hr-hc1", name: "GHK-Cu / Bimatoprost", duration: "12 weeks" },
      ],
      essential: [
        { id: "hr-he1", name: "GHK-Cu Topical Combo", duration: "12 weeks" },
      ],
    },
    him: {
      premier: [
        { id: "hr-mp1", name: "Dutasteride / Minoxidil / Bimatoprost", duration: "12 weeks" },
      ],
      core: [
        { id: "hr-mc1", name: "Bimatoprost / Finasteride", duration: "12 weeks" },
      ],
      essential: [
        { id: "hr-me1", name: "Finasteride Topical", duration: "12 weeks" },
        { id: "hr-me2", name: "Minoxidil Combo", duration: "12 weeks" },
      ],
    },
  },

  /* ── Derm & Aesthetics ── */
  {
    id: "derm",
    name: "Derm & Aesthetics",
    description: "Skin rejuvenation and anti-aging protocols combining collagen-stimulating peptides, growth factors, and targeted topicals.",
    gendered: false,
    tiers: {
      premier: [
        { id: "da-p1", name: "GAL Cream / NAD+ / GH Secretagogue", duration: "12 weeks" },
        { id: "da-p2", name: "GHK-Cu / BPC-157 / Oxytocin", duration: "12 weeks" },
        { id: "da-p3", name: "GAL Cream / GHK-Cu / BPC-157", duration: "12 weeks" },
      ],
      core: [
        { id: "da-c1", name: "GAL Cream / NAD+", duration: "12 weeks" },
        { id: "da-c2", name: "GHK-Cu / BPC-157", duration: "12 weeks" },
        { id: "da-c3", name: "GAL Cream / GHK-Cu", duration: "12 weeks" },
      ],
      essential: [
        { id: "da-e1", name: "GAL Cream Topical", duration: "12 weeks" },
        { id: "da-e2", name: "GHK-Cu Topical", duration: "12 weeks" },
        { id: "da-e3", name: "BPC-157 Topical", duration: "12 weeks" },
      ],
    },
  },

  /* ── Anti-Inflammatory ── */
  {
    id: "antiinflam",
    name: "Anti-Inflammatory",
    description: "Systemic anti-inflammatory protocols combining tissue-repair peptides with immune modulators to reduce chronic inflammation.",
    gendered: false,
    tiers: {
      premier: [
        { id: "ai-p1", name: "BPC-157+TB4 / GH Secretagogue", duration: "8 weeks" },
        { id: "ai-p2", name: "BPC-157+TB4 / ABP-7 I", duration: "8 weeks" },
        { id: "ai-p3", name: "BPC-157+TB4 / ABP-7 II", duration: "8 weeks" },
        { id: "ai-p4", name: "Lyophilized Anti-Inflammatory", duration: "8 weeks" },
        { id: "ai-p5", name: "Capsule Anti-Inflammatory Protocol", duration: "8 weeks" },
      ],
      core: [
        { id: "ai-c1", name: "BPC-157+TB4 / GH Secretagogue", duration: "8 weeks" },
        { id: "ai-c2", name: "BPC-157+TB4 / ABP-7 I", duration: "8 weeks" },
        { id: "ai-c3", name: "BPC-157+TB4 / ABP-7 II", duration: "8 weeks" },
        { id: "ai-c4", name: "Lyophilized Anti-Inflammatory", duration: "8 weeks" },
        { id: "ai-c5", name: "Capsule Anti-Inflammatory Protocol", duration: "8 weeks" },
      ],
      essential: [
        { id: "ai-e1", name: "BPC-157+TB4 / GH Secretagogue", duration: "8 weeks" },
        { id: "ai-e2", name: "BPC-157+TB4 / ABP-7 I", duration: "8 weeks" },
        { id: "ai-e3", name: "BPC-157+TB4 / ABP-7 II", duration: "8 weeks" },
        { id: "ai-e4", name: "Lyophilized Anti-Inflammatory", duration: "8 weeks" },
        { id: "ai-e5", name: "Capsule Anti-Inflammatory Protocol", duration: "8 weeks" },
      ],
    },
  },
];

/* ───────────────────────── compound info ───────────────────────── */

export interface CompoundInfo {
  description: string;
  mechanism: string;
}

export const COMPOUND_INFO: Record<string, CompoundInfo> = {
  "GLP-1+GIP": {
    description:
      "Dual incretin receptor agonist targeting both GLP-1 and GIP pathways for superior appetite regulation and glycemic control compared to single-receptor agents.",
    mechanism:
      "Activates GLP-1 and GIP receptors in the hypothalamus and pancreas, suppressing appetite, slowing gastric emptying, enhancing insulin sensitivity, and promoting satiety through central nervous system signaling.",
  },
  "GH Secretagogue": {
    description:
      "Growth hormone secretagogue peptide that stimulates the pituitary gland to release endogenous growth hormone in a pulsatile, physiologic pattern.",
    mechanism:
      "Binds to the ghrelin/growth hormone secretagogue receptor (GHS-R1a), triggering pulsatile GH release from the anterior pituitary. This supports lean body mass, fat metabolism, tissue repair, and recovery without suppressing the natural GH axis.",
  },
  "Mitochondrial Uncoupler": {
    description:
      "Controlled mitochondrial uncoupling agent that increases basal energy expenditure by dissipating the proton gradient across the inner mitochondrial membrane as heat.",
    mechanism:
      "Shuttles protons across the inner mitochondrial membrane independent of ATP synthase, converting stored energy into thermogenesis. This elevates basal metabolic rate, increases fat oxidation, and supports sustained caloric expenditure at rest.",
  },
  "BPC-157": {
    description:
      "Body Protection Compound-157, a stable gastric pentadecapeptide with broad tissue-repair and cytoprotective properties across musculoskeletal, gastrointestinal, and vascular systems.",
    mechanism:
      "Upregulates growth factor expression (VEGF, EGF, FGF), promotes angiogenesis, accelerates tendon-to-bone healing, modulates nitric oxide pathways, and protects the gut mucosal lining. Also demonstrates neuroprotective and anti-inflammatory effects through the FAK-paxillin signaling pathway.",
  },
  TB4: {
    description:
      "Thymosin Beta-4, a 43-amino-acid peptide that plays a central role in tissue repair, wound healing, and modulation of inflammatory cascades throughout the body.",
    mechanism:
      "Sequesters G-actin to regulate cell migration and differentiation, promotes angiogenesis, reduces pro-inflammatory cytokines (IL-1, TNF-alpha), and activates cardiac progenitor cells. Supports tendon, ligament, muscle, and cardiac tissue regeneration.",
  },
  "Thymosin Beta-4": {
    description:
      "Thymosin Beta-4, a 43-amino-acid peptide that plays a central role in tissue repair, wound healing, and modulation of inflammatory cascades throughout the body.",
    mechanism:
      "Sequesters G-actin to regulate cell migration and differentiation, promotes angiogenesis, reduces pro-inflammatory cytokines (IL-1, TNF-alpha), and activates cardiac progenitor cells. Supports tendon, ligament, muscle, and cardiac tissue regeneration.",
  },
  "Thymosin Alpha-1": {
    description:
      "Thymosin Alpha-1, a thymic peptide that modulates both innate and adaptive immune responses. Clinically used worldwide for immunodeficiency, chronic viral infections, and as an immune adjuvant.",
    mechanism:
      "Enhances dendritic cell maturation, promotes T-cell differentiation (Th1 over Th2), increases natural killer cell activity, and upregulates MHC class I expression. Restores immune surveillance while reducing excessive inflammatory signaling.",
  },
  TA1: {
    description:
      "Thymosin Alpha-1, a potent immune-modulating peptide derived from the thymus gland that restores and enhances immune system function across multiple cell lineages.",
    mechanism:
      "Enhances dendritic cell maturation, promotes T-cell differentiation (Th1 over Th2), increases natural killer cell activity, and upregulates MHC class I expression. Restores immune surveillance while reducing excessive inflammatory signaling.",
  },
  Glutathione: {
    description:
      "The body's master antioxidant and primary intracellular detoxification agent. A tripeptide (glutamate-cysteine-glycine) essential for neutralizing free radicals, supporting liver phase II detoxification, and maintaining cellular redox balance.",
    mechanism:
      "Directly neutralizes reactive oxygen species, regenerates vitamins C and E, conjugates toxins and heavy metals for hepatic excretion via glutathione S-transferase, and supports mitochondrial integrity. Critical for immune cell proliferation and optimal lymphocyte function.",
  },
  Larazotide: {
    description:
      "A tight-junction regulator peptide that restores intestinal barrier integrity by preventing zonulin-mediated increases in gut permeability, commonly referred to as 'leaky gut.'",
    mechanism:
      "Antagonizes the zonulin pathway at the tight-junction complex, preventing disassembly of claudin and occludin proteins between enterocytes. Reduces paracellular transport of antigens and endotoxins, lowering systemic inflammatory burden originating from the gut.",
  },
  Rg3: {
    description:
      "Ginsenoside Rg3, a rare bioactive ginsenoside with potent neuroprotective, anti-inflammatory, and cognitive-enhancing properties derived from Panax ginseng.",
    mechanism:
      "Modulates NMDA receptor activity, inhibits voltage-gated calcium channels, reduces neuroinflammation through NF-kB suppression, and promotes BDNF expression. Enhances cerebral blood flow, supports synaptic plasticity, and protects neurons against oxidative damage.",
  },
  Methylcobalamin: {
    description:
      "The bioactive, methylated form of vitamin B12 essential for nerve myelin synthesis, homocysteine metabolism, and methylation reactions critical to neurological function and DNA repair.",
    mechanism:
      "Serves as a cofactor for methionine synthase in the conversion of homocysteine to methionine, supporting SAMe-dependent methylation. Promotes Schwann cell function and nerve myelination, reduces neurotoxic homocysteine levels, and supports red blood cell formation.",
  },
  "Alpha-GPC": {
    description:
      "Alpha-glycerophosphocholine, a highly bioavailable choline source that crosses the blood-brain barrier to support acetylcholine synthesis, cognitive function, and growth hormone secretion.",
    mechanism:
      "Rapidly absorbed and converted to phosphatidylcholine and free choline in the brain, directly fueling acetylcholine biosynthesis. Supports cell membrane phospholipid turnover, enhances cholinergic neurotransmission for memory and attention, and augments pituitary GH release during exercise.",
  },
  Dihexa: {
    description:
      "A hexapeptide analog of angiotensin IV with extraordinarily potent neurotrophin-like activity, capable of enhancing synaptic connectivity and memory formation at picomolar concentrations.",
    mechanism:
      "Binds hepatocyte growth factor (HGF) and potentiates its interaction with the c-Met receptor, driving dendritic spine formation, synaptogenesis, and long-term potentiation. Approximately 10-million-fold more potent than BDNF in promoting new synaptic connections relevant to memory encoding.",
  },
  Semax: {
    description:
      "A synthetic heptapeptide analog of ACTH(4-10) developed for cognitive enhancement, neuroprotection, and treatment of cerebrovascular disorders. Widely studied for focus, memory, and stress resilience.",
    mechanism:
      "Upregulates BDNF, NGF, and GDNF expression in the hippocampus and prefrontal cortex. Modulates serotonergic and dopaminergic neurotransmission, enhances attention and working memory, reduces oxidative stress in neural tissue, and promotes cerebral microcirculation.",
  },
  "NAD+": {
    description:
      "Nicotinamide adenine dinucleotide, a critical coenzyme present in every living cell that declines with age. Essential for mitochondrial energy production, DNA repair, and activation of longevity-associated sirtuin enzymes.",
    mechanism:
      "Serves as an electron carrier in the mitochondrial electron transport chain (complexes I and II), fuels sirtuin-mediated deacetylation of histones and transcription factors, activates PARP enzymes for DNA repair, and regulates circadian clock proteins. Restoring NAD+ levels reverses age-related mitochondrial dysfunction.",
  },
  "GHK-Cu": {
    description:
      "Copper peptide GHK-Cu, a naturally occurring tripeptide-copper complex that declines with age and plays a central role in skin remodeling, wound healing, collagen synthesis, and hair follicle health.",
    mechanism:
      "Stimulates collagen I, III, and elastin synthesis via TGF-beta signaling, activates metalloproteinases for controlled tissue remodeling, attracts immune cells and fibroblasts to repair sites, promotes angiogenesis, and upregulates hair follicle stem cell activity. Also functions as a potent antioxidant through superoxide dismutase activation.",
  },
  Bimatoprost: {
    description:
      "A prostaglandin analog originally developed for glaucoma that was discovered to significantly stimulate hair follicle growth, prolong the anagen (active growth) phase, and increase follicle size and pigmentation.",
    mechanism:
      "Binds prostamide receptors in the dermal papilla of hair follicles, extending the anagen growth phase, stimulating melanogenesis for thicker and darker hair, and increasing the percentage of follicles in active growth. Enhances blood flow to the follicular bulb.",
  },
  Dutasteride: {
    description:
      "A potent dual 5-alpha-reductase inhibitor (types I and II) that reduces dihydrotestosterone (DHT) levels by over 90%, significantly more than single-type inhibitors, to combat androgenetic alopecia.",
    mechanism:
      "Irreversibly inhibits both type I and type II 5-alpha-reductase enzymes, blocking the conversion of testosterone to DHT in the scalp, liver, and skin. Reduces follicular miniaturization, extends the growth phase of genetically susceptible hair follicles, and preserves hair density.",
  },
  Finasteride: {
    description:
      "A selective type II 5-alpha-reductase inhibitor that lowers scalp DHT levels to slow and partially reverse male-pattern hair loss. One of the most extensively studied treatments for androgenetic alopecia.",
    mechanism:
      "Competitively inhibits type II 5-alpha-reductase, reducing serum DHT by approximately 70% and scalp DHT proportionally. Reverses follicular miniaturization in the vertex and mid-scalp regions, increases hair count, and slows progression of androgenetic alopecia.",
  },
  Minoxidil: {
    description:
      "A vasodilator and potassium channel opener that stimulates hair growth through enhanced follicular blood supply and direct activation of hair follicle stem cells, effective in both male and female pattern hair loss.",
    mechanism:
      "Opens ATP-sensitive potassium channels in vascular smooth muscle, increasing dermal papilla blood flow. Upregulates VEGF expression, prolongs the anagen growth phase, stimulates follicular cell proliferation, and promotes the transition of miniaturized vellus follicles back to terminal hair production.",
  },
  "GAL Cream": {
    description:
      "A proprietary topical skin rejuvenation formulation combining growth factors, antioxidants, and lipid-soluble actives designed to reduce fine lines, improve skin texture, and restore youthful luminosity.",
    mechanism:
      "Delivers bioactive growth factors and antioxidants transdermally to stimulate fibroblast proliferation, boost collagen and elastin deposition, neutralize UV-induced free radical damage, and enhance epidermal turnover for smoother, more radiant skin.",
  },
  Oxytocin: {
    description:
      "A neuropeptide hormone traditionally associated with social bonding and reproduction, now recognized for its roles in wound healing, skin regeneration, anti-inflammatory signaling, and intimate wellness.",
    mechanism:
      "Binds oxytocin receptors in dermal fibroblasts and keratinocytes, promoting wound contraction and re-epithelialization. Reduces cortisol-mediated skin aging, modulates inflammatory cytokine release, and stimulates stem cell activity in skin tissue. Also acts centrally to support arousal and intimate response.",
  },
  "PT-141": {
    description:
      "Bremelanotide (PT-141), a melanocortin receptor agonist that acts centrally in the brain to enhance sexual desire and arousal, FDA-approved for hypoactive sexual desire disorder in premenopausal women.",
    mechanism:
      "Activates melanocortin-4 receptors (MC4R) in the hypothalamus, stimulating dopaminergic pathways involved in sexual arousal and desire. Unlike PDE5 inhibitors, it acts on the central nervous system rather than peripheral vasculature, addressing the neurological component of sexual function.",
  },
  Bremelanotide: {
    description:
      "Bremelanotide (PT-141), a melanocortin receptor agonist that acts centrally in the brain to enhance sexual desire and arousal, FDA-approved for hypoactive sexual desire disorder in premenopausal women.",
    mechanism:
      "Activates melanocortin-4 receptors (MC4R) in the hypothalamus, stimulating dopaminergic pathways involved in sexual arousal and desire. Unlike PDE5 inhibitors, it acts on the central nervous system rather than peripheral vasculature, addressing the neurological component of sexual function.",
  },
  "IGF-1": {
    description:
      "Insulin-like Growth Factor-1, a peptide hormone structurally similar to insulin that mediates many of growth hormone's anabolic effects on muscle, bone, and connective tissue recovery.",
    mechanism:
      "Binds the IGF-1 receptor to activate PI3K/Akt and MAPK signaling cascades, promoting muscle protein synthesis, satellite cell activation, osteoblast differentiation, and chondrocyte proliferation. Enhances nitrogen retention and post-exercise recovery while supporting collagen turnover in tendons and ligaments.",
  },
  "ABP-7": {
    description:
      "An anti-inflammatory peptide that targets key inflammatory mediators to reduce systemic and local inflammation, supporting tissue recovery and pain reduction.",
    mechanism:
      "Inhibits pro-inflammatory cytokine cascades (TNF-alpha, IL-6, IL-1beta), modulates NF-kB transcriptional activity, and promotes the resolution phase of inflammation through specialized pro-resolving mediator pathways. Reduces oxidative stress at injury sites and supports anti-inflammatory macrophage polarization (M2 phenotype).",
  },
  Lyophilized: {
    description:
      "Freeze-dried peptide formulation that preserves molecular stability and potency through the removal of water under controlled vacuum conditions, enabling longer shelf life and precise reconstitution dosing.",
    mechanism:
      "Lyophilization removes water from the peptide solution through sublimation, maintaining the three-dimensional structure and biological activity of the active compound. Reconstituted with bacteriostatic water prior to administration for consistent dosing accuracy.",
  },
  Capsule: {
    description:
      "Oral capsule delivery system formulated with specialized absorption enhancers to improve peptide and compound bioavailability through the gastrointestinal tract, offering a convenient non-injectable administration route.",
    mechanism:
      "Enteric-coated or absorption-enhanced capsule technology protects active compounds from gastric degradation, releasing them in the small intestine where specialized excipients facilitate transepithelial absorption into systemic circulation.",
  },
};

/* ───────────────────────── helpers ─────────────────────────────── */

/** Convert a name to a URL-safe slug */
export function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Look up a specific protocol by category slug + protocol slug */
export function findProtocol(
  categorySlug: string,
  protocolSlug: string,
): {
  category: CategoryData;
  tier: Tier;
  card: ProtocolCard;
  gender?: "her" | "him";
} | null {
  const category = CATEGORIES.find((c) => slugify(c.id) === categorySlug || slugify(c.name) === categorySlug);
  if (!category) return null;

  const searchTiers = (tiers: TieredProtocols, gender?: "her" | "him") => {
    for (const tier of TIERS) {
      for (const card of tiers[tier]) {
        if (slugify(card.name) === protocolSlug) {
          return { category, tier, card, gender };
        }
      }
    }
    return null;
  };

  if (category.gendered) {
    const gendered = category as GenderedCategory;
    const herResult = searchTiers(gendered.her, "her");
    if (herResult) return herResult;
    const himResult = searchTiers(gendered.him, "him");
    if (himResult) return himResult;
  } else {
    const standard = category as StandardCategory;
    return searchTiers(standard.tiers);
  }

  return null;
}

/** Parse compound names from a protocol name and return matched info */
export function getCompoundsFromName(
  protocolName: string,
): Array<{ name: string; description: string; mechanism: string }> {
  const results: Array<{ name: string; description: string; mechanism: string }> = [];
  const seen = new Set<string>();

  // Split on " / " and "+" separators, then try to match each segment
  const segments = protocolName
    .split(/\s*\/\s*/)
    .flatMap((s) => s.split(/\s*\+\s*/))
    .map((s) => s.trim())
    .filter(Boolean);

  for (const segment of segments) {
    // Try exact match first
    if (COMPOUND_INFO[segment] && !seen.has(segment)) {
      seen.add(segment);
      results.push({ name: segment, ...COMPOUND_INFO[segment] });
      continue;
    }

    // Try matching compound keys that appear within the segment
    for (const [key, info] of Object.entries(COMPOUND_INFO)) {
      if (!seen.has(key) && segment.toLowerCase().includes(key.toLowerCase())) {
        seen.add(key);
        results.push({ name: key, ...info });
      }
    }
  }

  // If nothing matched, try a broader scan against the full protocol name
  if (results.length === 0) {
    const lowerName = protocolName.toLowerCase();
    for (const [key, info] of Object.entries(COMPOUND_INFO)) {
      if (!seen.has(key) && lowerName.includes(key.toLowerCase())) {
        seen.add(key);
        results.push({ name: key, ...info });
      }
    }
  }

  return results;
}

/** Generate a clinical description for a protocol based on its name and category */
export function getProtocolDescription(
  protocolName: string,
  categoryName: string,
): string {
  const compounds = getCompoundsFromName(protocolName);

  if (compounds.length === 0) {
    return `This ${categoryName.toLowerCase()} protocol is a physician-directed treatment plan designed to address your specific health goals. It combines clinically selected compounds in a structured regimen optimized for measurable outcomes over the treatment duration.`;
  }

  const compoundNames = compounds.map((c) => c.name);
  const mechanisms = compounds
    .map((c) => {
      // Extract a short action phrase from the mechanism
      const firstSentence = c.mechanism.split(".")[0];
      return firstSentence.toLowerCase();
    })
    .slice(0, 3);

  const nameList =
    compoundNames.length === 1
      ? compoundNames[0]
      : compoundNames.length === 2
        ? `${compoundNames[0]} and ${compoundNames[1]}`
        : `${compoundNames.slice(0, -1).join(", ")}, and ${compoundNames[compoundNames.length - 1]}`;

  const intro = `This ${categoryName.toLowerCase()} protocol combines ${nameList} in a physician-directed regimen designed for synergistic clinical outcomes.`;

  const mechanismSummary =
    mechanisms.length > 0
      ? ` The active compounds work by targeting complementary pathways: ${mechanisms.join("; ")}.`
      : "";

  const categoryContext = getCategoryContext(categoryName);

  return `${intro}${mechanismSummary}${categoryContext}`;
}

function getCategoryContext(categoryName: string): string {
  const map: Record<string, string> = {
    "Weight Management":
      " Together, these agents support sustainable fat loss, appetite control, and metabolic optimization under clinical supervision.",
    "Injury & Repair":
      " This combination accelerates tissue healing, reduces inflammation at injury sites, and supports structural recovery of tendons, ligaments, and muscle.",
    Performance:
      " The protocol is engineered to enhance recovery capacity, lean body composition, and sustained athletic output.",
    Immunity:
      " These agents strengthen immune surveillance, restore gut barrier integrity, and promote resilient immune function.",
    "Sexual Well-Being":
      " This formulation targets the neurological and physiological pathways of sexual health to enhance desire, arousal, and intimate wellness.",
    "Cognitive Enhancement":
      " The synergistic combination supports memory formation, executive function, and long-term neuroprotection.",
    "Hair Restore":
      " Working together, these compounds stimulate follicular growth, block hormonal miniaturization, and improve hair density and quality.",
    "Derm & Aesthetics":
      " The combined action promotes collagen remodeling, cellular renewal, and visible improvement in skin texture and radiance.",
    "Anti-Inflammatory":
      " This multi-targeted approach reduces chronic systemic inflammation, supports tissue repair, and addresses underlying inflammatory drivers.",
  };
  return map[categoryName] || " All protocols are monitored by our clinical team to ensure safety and efficacy.";
}
