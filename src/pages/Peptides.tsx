import SEO from "@/components/SEO";
import { useState, useEffect, useMemo } from "react";
import { Search, ChevronDown, ChevronUp } from "lucide-react";
import Navbar from "@/components/Navbar";
import PopularPeptidesCarousel from "@/components/PopularPeptidesCarousel";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";

interface Product {
  id: string;
  category: string;
  subcategory: string | null;
  name: string;
  size: string;
  price: number;
}

interface Variant {
  id: string;
  size: string;
  price: number;
}

interface Formulation {
  fullName: string;
  displayName: string;
  variants: Variant[];
}

interface ProductGroup {
  baseName: string;
  category: string;
  formulations: Formulation[];
}

// ─── Clinical Descriptions ────────────────────────────────────────────────────
// All descriptions are research-framed. Not intended as medical advice.
const COMPOUND_DESCRIPTIONS: Record<string, string> = {
  // ── Weight Management ──
  "Semaglutide": "GLP-1 receptor agonist. In the SUSTAIN and STEP trials, subcutaneous semaglutide produced mean weight reductions of 14–17% over 68 weeks via suppression of hypothalamic appetite centers and delayed gastric emptying. Also demonstrated HbA1c reduction of ~1.5–2.0% in T2DM populations.",
  "Tirzepatide": "Dual GIP/GLP-1 receptor agonist (twincretin). The SURMOUNT-1 trial reported mean weight loss of 20.9% at the 15 mg dose over 72 weeks — the highest recorded in a pharmacological obesity trial to date. Superior glycemic control vs. semaglutide in head-to-head SURPASS trials.",
  "Liraglutide": "First-generation GLP-1 agonist. SCALE Obesity trial demonstrated 8% mean weight reduction at 3 mg/day over 56 weeks with favorable cardiovascular risk profile. Shorter half-life necessitates daily dosing vs. weekly for semaglutide.",
  "Peptide YY": "Endogenous satiety peptide released postprandially from distal gut L-cells. Peripheral PYY 3-36 administration reduces ad libitum energy intake by ~30% in short-term studies (Batterham et al., Nature 2002). Research into sustained-release formulations is ongoing.",
  "Oxyntomodulin": "Dual GLP-1/glucagon receptor agonist derived from proglucagon. Phase II studies show additive weight loss vs. GLP-1 agonism alone, attributable to glucagon-mediated increases in resting energy expenditure (~30 kcal/day).",

  // ── Growth Hormone / GHRH ──
  "Sermorelin": "GHRH(1-29) analogue. Stimulates pulsatile GH release from the anterior pituitary, preserving physiologic feedback inhibition — a key safety advantage over exogenous HGH. Studies report IGF-1 normalization, improved sleep architecture (SWS), and lean mass accretion in GH-deficient adults.",
  "CJC-1295": "Modified GHRH analogue with DAC (Drug Affinity Complex). Extends plasma half-life to 6–8 days via albumin binding. Clinical data show sustained elevations in GH and IGF-1 for up to 14 days post-injection. Often combined with a GHRP for amplified GH pulse.",
  "Ipamorelin": "Selective GHS-R1a agonist (ghrelin mimetic). Produces clean GH release with minimal cortisol or prolactin elevation — superior selectivity vs. GHRP-2 and GHRP-6. Pre-clinical and clinical data support fat loss, lean mass gains, and improved bone density with chronic use.",
  "Tesamorelin": "Stabilized GHRH analogue FDA-approved (Egrifta) for HIV-associated lipodystrophy. Reduces visceral adipose tissue by ~15–18% over 26 weeks. Mechanisms include IGF-1 upregulation and direct lipolytic effects on visceral fat depots.",
  "Hexarelin": "Potent synthetic GHRP and GHS-R1a agonist. Produces the highest GH pulse amplitude of the GHRP class. Also demonstrates cardioprotective properties independent of GH secretion — activates CD36 receptors on cardiac tissue in rodent models.",
  "MK-677": "Non-peptide ghrelin mimetic (ibutamoren). Orally bioavailable. The MK-677 extension study (Nuttall et al., 2008) showed sustained IGF-1 elevation and lean mass preservation in older adults over 2 years. Increases appetite — a practical consideration in clinical use.",

  // ── Tissue Repair / Recovery ──
  "BPC-157": "Body Protection Compound, derived from gastric juice protein. Extensive rodent data demonstrate accelerated tendon-to-bone healing (via VEGF upregulation), gut mucosal repair, and neuroprotection. Modulates dopamine and serotonin systems. No human RCTs published to date; currently in Phase II trials for inflammatory bowel disease.",
  "Thymosin Beta-4": "Actin-sequestering peptide with pleiotropic regenerative effects. Promotes endothelial and epicardial progenitor cell migration, reduces fibrosis (TGF-β modulation), and accelerates wound closure. Phase II cardiac data (RegeneRx) showed trends toward improved cardiac function post-MI.",
  "TB-500": "Synthetic analogue of the active region of Thymosin Beta-4 (Ac-SDKP). Shares the primary regenerative and anti-inflammatory mechanisms. Frequently used clinically for soft tissue injury recovery and chronic tendinopathy.",
  "AOD-9604": "C-terminal fragment of HGH (hGH 177-191). Retains lipolytic properties of native HGH without IGF-1 stimulation or adverse glycemic effects. Phase IIb/III data for osteoarthritis (Metabolic Pharmaceuticals) showed cartilage-protective effects.",

  // ── Immune / Thymus ──
  "Thymosin Alpha-1": "Thymic peptide and TLR agonist. FDA-orphan-designated; approved in 35+ countries for hepatitis B/C and as vaccine adjuvant. Stimulates T-cell differentiation, NK cell activity, and dendritic cell maturation. Emerging clinical data in post-COVID immune dysregulation and oncology.",
  "LL-37": "Human cathelicidin antimicrobial peptide. Broad-spectrum antimicrobial activity via membrane disruption. Also modulates innate immunity — activates TLR4/9, promotes wound healing via keratinocyte migration, and has demonstrated anti-biofilm activity in vivo.",

  // ── Sexual Well-Being ──
  "PT-141": "Melanocortin-4 receptor (MC4R) agonist. FDA-approved as Vyleesi for HSDD in premenopausal women. Centrally acting — does not require vascular response, making it effective in cases where PDE5 inhibitors fail. Mean FSFI improvement of ~2 points in Phase III trials.",
  "Kisspeptin": "Hypothalamic neuropeptide and KISS1R agonist. Upstream regulator of GnRH pulsatility. Clinical studies demonstrate restoration of LH pulsatility in hypothalamic amenorrhea and potentiation of sexual cognition/arousal via limbic system activation.",
  "Oxytocin": "Nonapeptide synthesized in the paraventricular nucleus. Modulates pair-bonding, trust, and sexual response via central oxytocin receptors. Clinical studies show enhancement of sexual arousal, orgasm intensity, and emotional intimacy. Also reduces HPA-axis stress reactivity.",

  // ── Cognitive / Neurological ──
  "Selank": "Synthetic analogue of tuftsin (Thr-Lys-Pro-Arg). Anxiolytic and nootropic; modulates GABAergic transmission and upregulates BDNF. Russian Phase II/III data demonstrate anxiolytic efficacy comparable to benzodiazepines without sedation or dependence.",
  "Semax": "ACTH(4-7)PGP analogue. Increases BDNF, NGF, and VEGF in the CNS. Russian studies report cognitive enhancement, neuroprotection post-stroke, and improvement in ADHD symptoms. Activates melanocortin receptors and serotonin pathways.",
  "Dihexa": "Hepatocyte growth factor (HGF) peptidomimetic. Crosses the BBB and potentiates HGF/MET signaling. Rodent data show restoration of associative memory in aged and cognitively impaired animals — reportedly 10⁷× more potent than BDNF in synaptic strengthening models.",
  "Epithalon": "Tetrapeptide (Ala-Glu-Asp-Gly). Activates telomerase in somatic cells, extending telomere length in vitro. Russian longitudinal data suggest reductions in cancer incidence and all-cause mortality in elderly cohorts. Also normalizes circadian melatonin secretion.",

  // ── Skin / Dermatology ──
  "GHK-Cu": "Copper-binding tripeptide naturally declining with age. Activates >4,000 genes involved in collagen synthesis, antioxidant defense, and DNA repair (Pickart & Margolina, 2018). Topical studies demonstrate increased skin density, reduced wrinkle depth, and enhanced wound healing via TGF-β1 upregulation.",
  "Tretinoin": "All-trans retinoic acid. Binds RAR-α/γ nuclear receptors, inducing keratinocyte differentiation, collagen synthesis, and epidermal thickening. The most evidence-based topical treatment for photoaging — multiple RCTs demonstrate measurable improvement in fine lines, texture, and hyperpigmentation within 12–24 weeks.",
  "Hydroquinone": "Tyrosinase inhibitor. Reduces melanin synthesis by blocking oxidation of tyrosine to DOPA. 4% formulation is the clinical gold standard for melasma and post-inflammatory hyperpigmentation. Most effective when combined with tretinoin and topical corticosteroid (Kligman formula).",
  "Niacinamide": "Vitamin B3 amide. Inhibits melanosome transfer to keratinocytes, reduces TEWL, and downregulates inflammatory cytokines. Clinical studies demonstrate improvement in hyperpigmentation, skin barrier function, and sebum regulation at 4–5% concentrations.",
  "Azelaic Acid": "Dicarboxylic acid with dual mechanism: tyrosinase inhibition and comedolytic/anti-inflammatory activity via inhibition of 5α-reductase and reactive oxygen species. FDA-approved for rosacea and acne; effective for PIH with a favorable safety profile in pregnancy.",

  // ── Hair Restoration ──
  "Finasteride": "5α-reductase type II inhibitor. Reduces scalp DHT by ~70%. The landmark Finasteride Male Pattern Hair Loss Study Group RCT demonstrated increased hair count and patient-reported improvement in 87% of men at 2 years. Prostate-specific antigen reduction of ~50% is a diagnostic confound to note.",
  "Minoxidil": "ATP-sensitive potassium channel opener. Extends anagen phase and increases follicular size. Topical 5% solution demonstrated superiority over 2% in vertex AGA (Olsen et al., 2002). Oral low-dose (0.25–1.25 mg) increasingly used off-label with strong clinical outcome data.",
  "Dutasteride": "Dual 5α-reductase (type I and II) inhibitor. Reduces scalp DHT by ~90% vs. ~70% for finasteride. RCT data show superior hair count outcomes vs. finasteride at 24 weeks. Not FDA-approved for AGA but widely used off-label.",

  // ── Hormones ──
  "Testosterone": "Primary androgen; binds AR to regulate protein synthesis, bone density, erythropoiesis, libido, and mood. TRT clinical trials (Testosterone Trials, NEJM 2016) demonstrated improvements in sexual function, bone density, lean mass, and anemia. Cardiovascular neutrality confirmed in TRAVERSE trial (2023).",
  "Estradiol": "Primary endogenous estrogen. Regulates bone metabolism, cardiovascular tone, cognitive function, and vaginal/urogenital health. WHI re-analysis and subsequent data support transdermal E2 as having neutral-to-favorable cardiovascular profile, particularly when initiated within 10 years of menopause (timing hypothesis).",
  "Progesterone": "Endogenous progestogen. Bioidentical micronized progesterone (Prometrium) has a more favorable safety profile than synthetic progestins — does not antagonize estrogen's cardioprotective effects and demonstrates neuroprotective, anxiolytic, and sleep-promoting properties via GABA-A modulation.",
  "DHEA": "Adrenal androgen precursor. Declines ~80% from peak by age 70 (adrenopause). Supplementation studies show improvements in libido, bone density, and mood, particularly in women with adrenal insufficiency. Intra-vaginal DHEA (prasterone/Intrarosa) is FDA-approved for dyspareunia.",
  "Pregnenolone": "Steroidogenic precursor synthesized from cholesterol in the adrenal cortex and CNS. Modulates NMDA and GABA-A receptors. Rodent and small human studies suggest pro-cognitive, anti-depressant, and memory-consolidating effects.",

  // ── Metabolic / IV ──
  "NAD+": "Essential coenzyme in >500 enzymatic reactions; declines ~50% between ages 40–60. Preclinical and early clinical data demonstrate NAD+ repletion improves mitochondrial function, activates sirtuins (SIRT1/3), and reduces markers of cellular aging. IV administration achieves rapid tissue saturation vs. oral precursors.",
  "Glutathione": "Master endogenous antioxidant. IV/IM administration bypasses limited oral bioavailability. Clinical data support reduction of oxidative stress markers, hepatoprotection in NAFLD, and melanin inhibition via tyrosinase suppression. Emerging data in Parkinson's disease (tremor reduction).",
  "Methylene Blue": "Mitochondrial electron carrier and MAO inhibitor. Enhances Complex I/IV activity, increasing ATP synthesis. Clinical data demonstrate neuroprotective effects in mild cognitive impairment (Wischik et al., 2008). Also used as a photosensitizer in antimicrobial photodynamic therapy.",
  "Alpha-Lipoic Acid": "Amphipathic antioxidant; regenerates vitamins C and E and glutathione. Inhibits NF-κB and reduces advanced glycation end products (AGEs). RCT data in diabetic peripheral neuropathy (SYDNEY trials) show significant improvement in neuropathy scores at 600 mg IV/day.",
  "Phosphatidylcholine": "Primary structural phospholipid of cell membranes. IV/mesotherapy administration studied for lipolysis via adipocyte membrane disruption and apoptosis induction. Also used clinically for hepatic steatosis (essential phospholipids / EPL therapy).",

  // ── LDN ──
  "Naltrexone": "Opioid receptor antagonist. At low doses (1.5–4.5 mg/day — LDN), brief opioid receptor blockade produces rebound upregulation of endogenous opioid production and modulates TLR4 on microglia, reducing neuroinflammatory signaling. Clinical data support benefit in fibromyalgia, Crohn's disease, MS fatigue, and autoimmune conditions.",

  // ── Peptides — misc ──
  "Gonadorelin": "Synthetic GnRH decapeptide. Stimulates pituitary LH and FSH release — used to maintain HPG axis activity and testicular size during TRT. Preferable to HCG in some protocols due to more physiologic LH pulsatility.",
  "Tadalafil": "Long-acting PDE5 inhibitor (t½ ~17.5 hrs). Enhances cGMP-mediated smooth muscle relaxation in penile and pulmonary vasculature. Daily low-dose (2.5–5 mg) demonstrates sustained improvement in erectile function scores vs. on-demand dosing and has FDA indication for BPH.",
  "Sildenafil": "Prototype PDE5 inhibitor. On-demand dosing; onset 30–60 min. Rigorous RCT evidence base for ED, PASP reduction in pulmonary arterial hypertension (Revatio), and emerging data in female sexual arousal disorder and altitude sickness.",
};

const DISCLAIMER = "For informational purposes only. Based on published preclinical and clinical research. Not a substitute for individualized medical evaluation. All therapies require physician oversight.";

const extractBaseName = (name: string): string => {
  return name
    .split(/\s+\+\s+/)[0]
    .replace(/\s+per\s+mL.*/i, "")
    .replace(/\s+in\s+(MCT|Ethyl).*/i, "")
    .replace(/\s+--\s+.*/g, "")
    .replace(/\s+\*\*.*?\*\*.*/g, "")
    .replace(/\s+\*.*?\*.*/g, "")
    .replace(/\s+(Topical|Injectable|Capsule|Tablet|Nasal|Oral|Ophthalmic|SQ|IM|IV|Lyophilized|Inhalation|Suspension|Lollipop|Troche|Suppository|Foam|Gel|Ointment|Solution|Spray|Cream)\b.*/i, "")
    .replace(/\s+\[\d+.*?\]\s*$/i, "")
    .trim();
};

const getDisplayName = (fullName: string, baseName: string): string => {
  if (fullName.toLowerCase().startsWith(baseName.toLowerCase())) {
    const rest = fullName.slice(baseName.length).replace(/^\s*\+?\s*/, "").trim();
    if (rest) {
      return rest
        .replace(/\s+per\s+mL\s*--\s*/i, " — ")
        .replace(/\s+in\s+Serum\s+Pump\s*$/i, "")
        .replace(/\s+in\s+Dropper\s+Bottle\s*$/i, "")
        .replace(/\s+in\s+Ointment\s+Jar\s*$/i, "")
        .replace(/\s+--\s+.*/g, "")
        .replace(/\s+\[\d+mL\]\s*$/i, "")
        .trim();
    }
  }
  return fullName
    .replace(/\s+per\s+mL\s*--\s*/i, " — ")
    .replace(/\s+in\s+Serum\s+Pump\s*$/i, "")
    .replace(/\s+--\s+.*/g, "")
    .trim();
};

// Find a description by checking if any key is contained in the base name
const findDescription = (baseName: string): string | null => {
  for (const [key, desc] of Object.entries(COMPOUND_DESCRIPTIONS)) {
    if (baseName.toLowerCase().includes(key.toLowerCase())) return desc;
  }
  return null;
};

const Peptides = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);
  const [expandedFormulation, setExpandedFormulation] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await supabase
        .from("products")
        .select("id, category, subcategory, name, size, price")
        .eq("active", true)
        .order("category")
        .order("name")
        .order("size");
      if (data) setProducts(data);
      setLoading(false);
    };
    fetchProducts();
  }, []);

  const groups = useMemo(() => {
    const groupMap = new Map<string, ProductGroup>();
    for (const p of products) {
      const base = extractBaseName(p.name);
      const groupKey = `${p.category}__${base}`;
      if (!groupMap.has(groupKey)) {
        groupMap.set(groupKey, { baseName: base, category: p.category, formulations: [] });
      }
      const group = groupMap.get(groupKey)!;
      let formulation = group.formulations.find((f: Formulation) => f.fullName === p.name);
      if (!formulation) {
        formulation = { fullName: p.name, displayName: getDisplayName(p.name, base), variants: [] };
        group.formulations.push(formulation);
      }
      formulation.variants.push({ id: p.id, size: p.size, price: p.price });
    }
    return Array.from(groupMap.values());
  }, [products]);

  const categories = useMemo(() => {
    return [...new Set(groups.map((g: ProductGroup) => g.category))].sort();
  }, [groups]);

  const filtered = useMemo(() => {
    return groups.filter((g: ProductGroup) => {
      const matchCategory = !activeCategory || g.category === activeCategory;
      const matchSearch = !search ||
        g.baseName.toLowerCase().includes(search.toLowerCase()) ||
        g.category.toLowerCase().includes(search.toLowerCase()) ||
        g.formulations.some((f: Formulation) => f.fullName.toLowerCase().includes(search.toLowerCase()));
      return matchCategory && matchSearch;
    });
  }, [groups, search, activeCategory]);

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Peptide Therapy Catalog"
        description="Browse our full catalog of compounded peptide therapy products."
        canonical="/peptides"
      />
      <Navbar />
      <PopularPeptidesCarousel />
      <main className="pb-20 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-muted-foreground/60 text-center max-w-md mx-auto mb-8 font-body font-extralight text-sm leading-relaxed">
            Select a compound to review clinical data, available formulations, and pricing.
          </p>

          <div className="max-w-md mx-auto mb-6">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search compounds, categories..."
                className="pl-10 bg-card/40 border-border/50 font-body font-extralight text-sm tracking-wide placeholder:text-muted-foreground/30"
              />
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-2 mb-12">
            <button
              onClick={() => setActiveCategory(null)}
              className={`px-4 py-2 text-[9px] tracking-[0.2em] uppercase font-body font-extralight border transition-all duration-300 ${
                !activeCategory ? "bg-primary/10 text-primary/80 border-primary/20" : "border-border/40 text-muted-foreground/50 hover:text-foreground/60 hover:border-border/60"
              }`}
            >
              All
            </button>
            {categories.map((cat: string) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
                className={`px-4 py-2 text-[9px] tracking-[0.2em] uppercase font-body font-extralight border transition-all duration-300 ${
                  activeCategory === cat ? "bg-primary/10 text-primary/80 border-primary/20" : "border-border/40 text-muted-foreground/50 hover:text-foreground/60 hover:border-border/60"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {loading && (
            <p className="text-center text-sm text-muted-foreground font-body font-light py-10 animate-pulse">
              Loading catalog...
            </p>
          )}

          <div className="space-y-2">
            {filtered.map((group: ProductGroup) => {
              const groupKey = `${group.category}__${group.baseName}`;
              const isGroupOpen = expandedGroup === groupKey;
              const description = findDescription(group.baseName);

              return (
                <div key={groupKey} className="border border-border/40 bg-card/20">
                  <button
                    onClick={() => {
                      setExpandedGroup(isGroupOpen ? null : groupKey);
                      setExpandedFormulation(null);
                    }}
                    className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-card/40 transition-colors"
                  >
                    <div>
                      <p className="text-sm font-body font-light tracking-wide text-foreground/90">
                        {group.baseName}
                      </p>
                      <p className="text-[10px] tracking-[0.15em] uppercase text-muted-foreground/50 font-body font-extralight mt-0.5">
                        {group.category}
                        {description && (
                          <span className="ml-2 text-primary/40">· research summary available</span>
                        )}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-[9px] tracking-[0.15em] uppercase text-muted-foreground/30 font-body">
                        {group.formulations.length} {group.formulations.length === 1 ? "formulation" : "formulations"}
                      </span>
                      {isGroupOpen
                        ? <ChevronUp size={14} className="text-muted-foreground/40" />
                        : <ChevronDown size={14} className="text-muted-foreground/40" />
                      }
                    </div>
                  </button>

                  {isGroupOpen && (
                    <div className="border-t border-border/20">

                      {/* Clinical description */}
                      {description && (
                        <div className="px-5 py-4 bg-card/30 border-b border-border/10">
                          <p className="text-[9px] tracking-[0.2em] uppercase text-primary/40 font-body font-extralight mb-2">
                            Research Summary
                          </p>
                          <p className="text-xs font-body font-extralight text-foreground/60 leading-relaxed">
                            {description}
                          </p>
                          <p className="text-[9px] font-body font-extralight text-muted-foreground/30 mt-3 leading-relaxed italic">
                            {DISCLAIMER}
                          </p>
                        </div>
                      )}

                      {/* Formulations */}
                      <div className="divide-y divide-border/10">
                        {group.formulations.map((formulation: Formulation) => {
                          const fKey = formulation.fullName;
                          const isFormOpen = expandedFormulation === fKey;
                          const isSingleVariant = formulation.variants.length === 1;
                          const selectedSize = selectedSizes[fKey];
                          const selectedVariant = formulation.variants.find((v: Variant) => v.size === selectedSize);

                          return (
                            <div key={fKey} className="bg-card/10">
                              <button
                                onClick={() => {
                                  if (isSingleVariant) return;
                                  setExpandedFormulation(isFormOpen ? null : fKey);
                                }}
                                className={`w-full flex items-center justify-between px-6 py-3 text-left transition-colors ${!isSingleVariant ? "hover:bg-card/30" : "cursor-default"}`}
                              >
                                <p className="text-xs font-body font-extralight tracking-wide text-foreground/70 flex-1 pr-4 truncate">
                                  {formulation.displayName || formulation.fullName}
                                </p>
                                <div className="flex items-center gap-3 shrink-0">
                                  {isSingleVariant ? (
                                    <span className="text-[10px] font-body text-muted-foreground/40">
                                      {formulation.variants[0].size} · ${formulation.variants[0].price.toFixed(2)}
                                    </span>
                                  ) : selectedVariant ? (
                                    <span className="text-xs font-body text-primary/70">
                                      {selectedVariant.size} · ${selectedVariant.price.toFixed(2)}
                                    </span>
                                  ) : (
                                    <span className="text-[9px] tracking-[0.1em] uppercase text-muted-foreground/30 font-body">
                                      select size
                                    </span>
                                  )}
                                  {!isSingleVariant && (
                                    isFormOpen
                                      ? <ChevronUp size={12} className="text-muted-foreground/30" />
                                      : <ChevronDown size={12} className="text-muted-foreground/30" />
                                  )}
                                </div>
                              </button>

                              {isFormOpen && !isSingleVariant && (
                                <div className="px-6 pb-4 flex flex-wrap gap-2">
                                  {formulation.variants.map((v: Variant) => {
                                    const isSelected = selectedSizes[fKey] === v.size;
                                    return (
                                      <button
                                        key={v.id}
                                        onClick={() => setSelectedSizes((prev) => ({ ...prev, [fKey]: v.size }))}
                                        className={`px-4 py-2 border text-xs font-body font-extralight tracking-wide transition-all duration-200 ${
                                          isSelected
                                            ? "border-primary/40 bg-primary/10 text-primary/80"
                                            : "border-border/30 text-muted-foreground/50 hover:border-border/50 hover:text-foreground/60"
                                        }`}
                                      >
                                        {v.size}{isSelected && <span className="ml-2 text-primary/70">${v.price.toFixed(2)}</span>}
                                      </button>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {!loading && filtered.length === 0 && (
              <p className="text-center text-sm text-muted-foreground font-body font-light py-10">
                No products match your search.
              </p>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Peptides;
