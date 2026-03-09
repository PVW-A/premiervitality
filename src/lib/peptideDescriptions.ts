// Clinical descriptions for common compounds
// Language uses "research suggests / studies indicate" framing — not medical advice
// Review all entries before publishing. Consult your physician advisor for compliance sign-off.

export const peptideDescriptions: Record<string, string> = {

  // ── WEIGHT MANAGEMENT ──────────────────────────────────────────────────────

  "Semaglutide": "GLP-1 receptor agonist. Phase 3 STEP trials demonstrated mean body weight reductions of 14.9% over 68 weeks vs. 2.4% placebo (Wilding et al., NEJM 2021). Suppresses appetite via hypothalamic GLP-1 receptors and delays gastric emptying. FDA-approved for chronic weight management (Wegovy®) and T2DM (Ozempic®).",

  "Tirzepatide": "Dual GIP/GLP-1 receptor agonist. SURMOUNT-1 trial reported up to 22.5% mean weight loss at 72 weeks in non-diabetic adults (Jastreboff et al., NEJM 2022). Activates both incretin receptors, producing additive effects on satiety and insulin sensitivity. FDA-approved as Zepbound® for obesity.",

  "AOD-9604": "Synthetic analogue of the C-terminal fragment of human growth hormone (hGH 177–191). Preclinical studies in obese rodent models demonstrated lipolytic activity and inhibition of lipogenesis without impacting IGF-1 levels or inducing diabetogenic effects (Heffernan et al., 2001). No significant effects on blood glucose or GH axis reported in human phase 2 trials.",

  "Liraglutide": "GLP-1 receptor agonist with 97% sequence homology to native GLP-1. SCALE Obesity trial showed 8.4% mean weight reduction vs. 2.8% placebo over 56 weeks (Pi-Sunyer et al., NEJM 2015). FDA-approved for weight management as Saxenda® 3mg.",

  // ── GROWTH HORMONE PEPTIDES ────────────────────────────────────────────────

  "Sermorelin": "Growth hormone-releasing hormone (GHRH) analogue (29 AA). Stimulates endogenous pituitary GH secretion in a physiological pulsatile pattern. Studies show significant increases in IGF-1, lean body mass, and bone mineral density with minimal suppression of the hypothalamic-pituitary axis (Walker et al., 1990). Preferred over exogenous HGH for preserving feedback regulation.",

  "CJC-1295": "GHRH analogue with DAC (Drug Affinity Complex) modification extending half-life to 6–8 days via albumin binding. Phase 1/2 data demonstrated dose-dependent increases in mean plasma GH levels (2–10 fold) and IGF-1 levels sustained over 28 days (Teichman et al., J Clin Endocrinol Metab 2006).",

  "Ipamorelin": "Selective GH secretagogue and ghrelin receptor agonist (GHSR-1a). Notable for high GH specificity with minimal cortisol, prolactin, or ACTH co-stimulation compared to GHRP-2 and GHRP-6 (Raun et al., Eur J Endocrinol 1998). Often combined with CJC-1295 for synergistic pulsatile GH release.",

  "Tesamorelin": "Stabilized GHRH analogue (44 AA + trans-3-hexenoic acid). FDA-approved (Egrifta®) for HIV-associated lipodystrophy. Randomized trials showed significant reductions in visceral adipose tissue (15–18%) and trunk fat with improvements in lipid profiles (Falutz et al., NEJM 2010).",

  "GHRP-2": "Second-generation GH-releasing peptide, GHSR-1a agonist. Produces robust GH pulses with moderate elevation of cortisol and prolactin. Studies indicate enhanced GH secretion of 7–15 fold above baseline with synergistic amplification when combined with GHRH analogues (Arvat et al., 1997).",

  "GHRP-6": "First-generation hexapeptide GH secretagogue. In addition to GH release, exhibits cytoprotective and anti-inflammatory properties via GHS-R1a-independent pathways. Stimulates appetite via ghrelin pathways — clinically relevant in cachexia and muscle-wasting indications (Granado et al., 2011).",

  "Hexarelin": "Most potent synthetic GHRP to date. Produces maximal GH release in human subjects (Ghigo et al., 1994). Also demonstrates direct cardioprotective effects via CD36 scavenger receptor binding, independent of GH secretion — studied in ischemia-reperfusion models (Muccioli et al., 2004).",

  "MK-677": "Orally active, non-peptide GHSR-1a agonist (ibutamoren). 12-month trial in elderly subjects demonstrated sustained IGF-1 elevation (+39%), increases in lean body mass, and improved sleep quality with no significant impact on glucose homeostasis at 25mg/day (Nass et al., JCEM 2008).",

  // ── TISSUE REPAIR / RECOVERY ───────────────────────────────────────────────

  "BPC-157": "Pentadecapeptide derived from human gastric juice protein BPC (Body Protection Compound). Extensive rodent data documents accelerated healing of muscle, tendon, ligament, and intestinal tissue via upregulation of VEGF and nitric oxide synthesis. Modulates dopamine and serotonin systems in CNS injury models (Sikiric et al., 2016). Human trials limited but case series support GI mucosal healing applications.",

  "TB-500": "Synthetic analogue of Thymosin Beta-4 (Tβ4), a ubiquitous 43 AA intracellular peptide. Promotes actin polymerization, cell migration, and angiogenesis. Murine studies demonstrate accelerated wound closure, cardiac regeneration post-MI, and reduced fibrosis. Upregulates matrix metalloproteinases and inhibits inflammatory cytokines (Goldstein et al., 2012).",

  "Thymosin Beta-4": "Endogenous actin-sequestering peptide with pleiotropic repair functions. Phase 2 trial in chronic neurotrophic corneal epithelial defects showed significant healing vs. placebo (Sosne et al., 2015). Promotes angiogenesis, reduces apoptosis, and downregulates NF-κB-mediated inflammation.",

  "KPV": "C-terminal tripeptide of α-MSH (Lys-Pro-Val). Retains full anti-inflammatory potency of parent molecule without melanocortin receptor-mediated side effects. Murine colitis models demonstrate significant reductions in TNF-α, IL-6, and NF-κB activation. Studies support utility in inflammatory bowel conditions (Dalmasso et al., 2008).",

  "LL-37": "Sole member of human cathelicidin antimicrobial peptide family. Broad-spectrum antibacterial, antiviral, and antifungal activity. Additionally modulates immune response, promotes wound re-epithelialization, and demonstrates anti-biofilm properties. Studied in chronic wounds, rosacea, and atopic dermatitis (Gallo et al., 2012).",

  "VIP": "Vasoactive Intestinal Peptide — 28 AA neuropeptide with potent immunomodulatory and anti-inflammatory properties. Activates VPAC1/VPAC2 receptors, inhibiting production of TNF-α, IL-6, IL-12, and nitric oxide. Studied in rheumatoid arthritis, Crohn's disease, and pulmonary hypertension. Promotes Treg differentiation (Delgado et al., 2004).",

  "Dihexa": "Angiotensin IV analogue and HGF/Met system potentiator. Animal studies demonstrate up to 7-fold greater potency than BDNF in synaptogenesis assays. Crosses blood-brain barrier; improves spatial learning and memory in aged rodent models (McCoy et al., 2013). Investigated for cognitive decline and neurodegeneration.",

  "Semax": "Synthetic ACTH(4–10) analogue. Increases BDNF and NGF expression in the prefrontal cortex and hippocampus. Russian clinical data supports neuroprotective applications in ischemic stroke, optic nerve disease, and cognitive impairment. Activates dopaminergic and serotonergic transmission (Dolotov et al., 2006).",

  "Selank": "Heptapeptide analogue of tuftsin (Thr-Lys-Pro-Arg-Pro-Gly-Pro). Anxiolytic without sedation or dependence — modulates GABAergic, serotonergic, and dopaminergic systems. Russian phase 2/3 data shows efficacy in generalized anxiety disorder comparable to benzodiazepines without cognitive impairment (Zozulya et al., 2001). Upregulates IL-6 and stabilizes enkephalins.",

  "Epithalon": "Tetrapeptide (Ala-Glu-Asp-Gly) developed by the St. Petersburg Institute of Bioregulation. Stimulates telomerase activity and elongates telomeres in somatic cells in vitro (Khavinson et al., 2003). Russian longitudinal data in elderly cohorts reported reduced mortality, improved melatonin regulation, and decreased neoplasm incidence over 6–12 years of follow-up.",

  // ── SEXUAL WELL-BEING ──────────────────────────────────────────────────────

  "PT-141": "Bremelanotide — cyclic heptapeptide melanocortin receptor agonist (MC1R, MC3R, MC4R). FDA-approved as Vyleesi® for hypoactive sexual desire disorder (HSDD) in premenopausal women. MC4R activation in the CNS drives pro-erectile and libido-enhancing effects in both sexes. Phase 2 data in men with erectile dysfunction showed 80% response rate (Diamond et al., 2004).",

  "Oxytocin": "Hypothalamic neuropeptide and pituitary hormone. Beyond parturition and lactation, oxytocin mediates social bonding, trust, empathy, and sexual arousal. Intranasal administration studies demonstrate enhanced emotional recognition, reduced cortisol stress response, and improved sexual function. Modulates HPA axis and interacts with dopaminergic reward pathways (MacDonald & Macdonald, 2010).",

  // ── IMMUNE / THYMIC ────────────────────────────────────────────────────────

  "Thymosin Alpha-1": "N-terminal fragment of prothymosin alpha (28 AA). FDA-designated orphan drug. Potent immunomodulator — upregulates Th1 cytokines (IL-2, IFN-γ), enhances NK cell and dendritic cell activity, and promotes T-cell maturation. Approved in 35+ countries for hepatitis B/C and immunodeficiency. Studied in COVID-19 for cytokine storm modulation (Romani et al., 2012).",

  "Thymalin": "Polypeptide thymic extract with broad immunomodulatory activity. Restores T-cell differentiation and thymic function in aged and immunocompromised subjects. Russian clinical trials report reduced infection frequency and improved immune parameters in elderly patients with age-related immunodeficiency (Khavinson & Morozov, 2003).",

  // ── DERMATOLOGY ────────────────────────────────────────────────────────────

  "GHK-Cu": "Glycyl-L-histidyl-L-lysine copper complex. Endogenous tripeptide with declining plasma levels with age. Activates >4,000 human genes including those governing collagen synthesis, anti-inflammatory pathways, and DNA repair. Multiple double-blind trials demonstrate statistically significant improvements in skin laxity, fine lines, and photodamage vs. placebo (Pickart et al., 2015).",

  "Melanotan II": "Cyclic heptapeptide α-MSH analogue. Non-selective melanocortin receptor agonist (MC1R–MC5R). Stimulates eumelanin production (tanning) via MC1R, pro-erectile effects via MC4R, and appetite suppression via MC3R/MC4R. Phase 2 data demonstrated efficacy in erectile dysfunction and female sexual dysfunction. Not FDA-approved; used off-label.",

  "Tretinoin": "All-trans retinoic acid — biologically active form of Vitamin A. Extensively validated in randomized trials for photoaging: upregulates procollagen I/III synthesis, normalizes keratinocyte differentiation, and reduces matrix metalloproteinase expression. FDA-approved for acne vulgaris; extensive evidence base for facial rejuvenation (Griffiths et al., NEJM 1995).",

  "Hydroquinone": "Phenolic melanogenesis inhibitor. Competitively inhibits tyrosinase, the rate-limiting enzyme in melanin biosynthesis. Standard of care for melasma, post-inflammatory hyperpigmentation, and solar lentigines. Meta-analyses support efficacy at 4% concentration; combination with tretinoin and corticosteroids (Kligman formula) shows superior outcomes.",

  // ── HORMONE RESTORATION ────────────────────────────────────────────────────

  "Testosterone": "Primary androgen — steroid hormone governing libido, muscle protein synthesis, erythropoiesis, bone density, and cognitive function. Extensive RCT data supports testosterone replacement therapy (TRT) in hypogonadal men for improvements in body composition, sexual function, mood, and metabolic parameters (Bhasin et al., NEJM 2010). Aromatizes to estradiol — monitoring required.",

  "Estradiol": "Predominant endogenous estrogen (E2). Governs female reproductive function, bone mineral density, cardiovascular health, and cognitive function. Transdermal delivery avoids first-pass hepatic metabolism, reducing thrombotic risk vs. oral formulations. Women's Health Initiative and subsequent analyses support favorable benefit-risk profile for women initiating HRT within 10 years of menopause (Manson et al., 2017).",

  "Progesterone": "Endogenous progestogen. Bioidentical micronized progesterone (Prometrium) preferred over synthetic progestins due to superior cardiovascular and breast safety profile. Modulates GABA-A receptors (anxiolytic), supports luteal phase, protects endometrium, and improves sleep quality via neurosteroid metabolites (Prior, 2011).",

  "DHEA": "Precursor steroid produced by the adrenal cortex. Declines ~80% from peak by age 70. Converts peripherally to testosterone and estradiol. RCTs in adrenal insufficiency and aging demonstrate improvements in well-being, libido, bone density, and insulin sensitivity. Intravaginal DHEA (prasterone/Intrarosa) FDA-approved for dyspareunia.",

  "Pregnenolone": "Master neurosteroid synthesized from cholesterol. Precursor to all steroid hormones. Modulates NMDA and GABA-A receptors in the CNS. Animal and preliminary human data suggest memory enhancement, antidepressant activity, and neuroprotection. Declines significantly with age; studied in schizophrenia, PTSD, and cognitive aging.",

  // ── IV / IM / SQ THERAPY ──────────────────────────────────────────────────

  "NAD+": "Nicotinamide adenine dinucleotide — essential coenzyme in redox metabolism and substrate for sirtuins (SIRT1-7), PARP DNA repair enzymes, and CD38. Declines ~50% from age 40–60. IV repletion studies show rapid restoration of tissue NAD+ levels with reported improvements in energy, cognitive function, and metabolic flexibility. Preclinical data demonstrates neuroprotection and lifespan extension (Rajman et al., 2018).",

  "Glutathione": "Master endogenous antioxidant tripeptide (γ-Glu-Cys-Gly). Declines with age, chronic illness, and oxidative stress. IV/IM administration bypasses limited oral bioavailability. Clinical data supports utility in Parkinson's disease, liver disease, cisplatin-induced nephrotoxicity, and skin brightening via melanin pathway modulation. Regenerates vitamins C and E.",

  "Alpha Lipoic Acid": "Universal antioxidant — active in both aqueous and lipid environments. Regenerates glutathione, vitamins C and E, and CoQ10. Crosses blood-brain barrier. RCTs demonstrate significant reduction in peripheral neuropathy symptoms in diabetic patients (600mg IV/day). Anti-inflammatory via NF-κB inhibition.",

  "Phosphatidylcholine": "Major phospholipid constituent of cell membranes. IV infusion studied for non-surgical reduction of localized fat deposits (mesotherapy). Preclinical data supports hepatoprotective, neuroprotective, and cardiovascular benefits via membrane fluidity restoration. Precursor to acetylcholine — relevant in cognitive decline.",

  "Methylene Blue": "Mitochondrial electron carrier and MAO inhibitor. Low-dose studies (0.5–4 mg/kg) demonstrate enhanced mitochondrial respiration, neuroprotection, and cognitive augmentation. RCT data shows improved memory consolidation. Also investigated as a photosensitizer in antimicrobial photodynamic therapy (Rojas et al., 2012).",

  // ── HAIR RESTORATION ──────────────────────────────────────────────────────

  "Minoxidil": "Potassium channel opener originally developed as antihypertensive. Topical and oral formulations extend anagen phase and increase follicular size. FDA-approved for androgenetic alopecia. Systematic reviews confirm efficacy in male and female pattern hair loss; oral low-dose (0.25–1.25mg) demonstrates superior efficacy with acceptable tolerability (Randolph & Tosti, 2021).",

  "Finasteride": "5α-reductase type II inhibitor. Reduces scalp and serum DHT by ~65–70%. FDA-approved for male androgenetic alopecia. 5-year placebo-controlled trial showed 48% increase in hair count vs. baseline (Kaufman et al., 1998). Post-finasteride syndrome under ongoing investigation; comprehensive patient counseling required.",

  "Dutasteride": "Dual 5α-reductase inhibitor (type I and II). Reduces DHT by ~93% vs. ~65% with finasteride. Phase 3 data demonstrates superiority over finasteride for androgenetic alopecia at equivalent doses (Olsen et al., 2006). Off-label for AGA; approved for BPH.",
};

// Fallback: match partial base names
export const getDescription = (baseName: string): string | null => {
  // Exact match first
  if (peptideDescriptions[baseName]) return peptideDescriptions[baseName];

  // Partial match — check if any key is contained in the baseName or vice versa
  const lower = baseName.toLowerCase();
  for (const [key, desc] of Object.entries(peptideDescriptions)) {
    if (lower.includes(key.toLowerCase()) || key.toLowerCase().includes(lower)) {
      return desc;
    }
  }
  return null;
};
