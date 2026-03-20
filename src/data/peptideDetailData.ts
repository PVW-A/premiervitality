// Full detail data for every peptide/compound in the PV formulary.
// Source of truth for individual peptide detail pages.

export interface PeptideDetail {
  name: string;
  slug: string;
  category: string;
  popular?: boolean;
  goals: string[];
  tagline: string;
  whatItIs: string;
  howItWorks: string;
  benefits: string[];
  whoItsFor: string;
  whatToExpect: string;
  researchNotes: string;
}

export const PEPTIDE_DETAILS: PeptideDetail[] = [
  // ── WEIGHT MANAGEMENT ───────────────────────────────────────────────────────
  {
    name: "Semaglutide",
    slug: "semaglutide",
    category: "Weight Management",
    popular: true,
    goals: ["Weight Loss"],
    tagline: "The most clinically proven weight loss peptide available.",
    whatItIs:
      "Semaglutide is a glucagon-like peptide-1 (GLP-1) receptor agonist originally developed for type 2 diabetes and subsequently approved for chronic weight management. It is a modified version of the naturally occurring GLP-1 hormone, engineered with a fatty acid side chain that extends its half-life to approximately seven days. It is FDA-approved under the brand names Wegovy (for obesity) and Ozempic (for diabetes).",
    howItWorks:
      "Semaglutide binds to GLP-1 receptors in the hypothalamus, particularly in the arcuate nucleus and area postrema, reducing appetite and increasing satiety signaling. It slows gastric emptying, meaning food stays in the stomach longer and you feel full sooner. It also modulates reward-related brain circuits, reducing cravings and food-seeking behavior. Peripherally, it enhances insulin secretion in a glucose-dependent manner and suppresses glucagon release, improving glycemic control independently of weight loss.",
    benefits: [
      "Average body weight reduction of 14.9% over 68 weeks in clinical trials",
      "Significant reduction in waist circumference and visceral adipose tissue",
      "Improved cardiovascular risk markers including blood pressure, HbA1c, and lipid profile",
      "Reduced cravings and appetite without stimulant-related side effects",
      "Once-weekly subcutaneous injection for consistent, sustained results",
      "Demonstrated reduction in major adverse cardiovascular events (SELECT trial)",
    ],
    whoItsFor:
      "Semaglutide is appropriate for adults with a BMI of 30 or greater, or a BMI of 27 or greater with at least one weight-related comorbidity such as hypertension, dyslipidemia, or type 2 diabetes. It is well-suited for patients who have struggled with diet and exercise alone and are looking for a medically supervised, evidence-based intervention with the strongest clinical data available for pharmacological weight loss.",
    whatToExpect:
      "Treatment begins with a low dose (0.25 mg weekly) that is gradually titrated over 16–20 weeks to minimize GI side effects, primarily nausea. Most patients notice reduced appetite within the first 1–2 weeks. Meaningful weight loss (5%+ of body weight) typically appears by weeks 8–12. Peak efficacy is observed at 60–72 weeks of continuous treatment. The most common side effects are transient nausea, constipation, and diarrhea, which generally resolve as the body adjusts.",
    researchNotes:
      "The STEP (Semaglutide Treatment Effect in People with Obesity) program is the landmark trial series. STEP 1 (Wilding et al., New England Journal of Medicine, 2021) enrolled 1,961 non-diabetic adults and demonstrated 14.9% mean body weight reduction at 68 weeks vs. 2.4% with placebo. STEP 2 studied patients with type 2 diabetes, showing 9.6% weight loss. STEP 3 combined semaglutide with intensive behavioral therapy for 16% reduction. STEP 5 confirmed sustained efficacy over 104 weeks. The SELECT trial (Lincoff et al., NEJM 2023) demonstrated a 20% reduction in major adverse cardiovascular events in overweight/obese adults without diabetes, leading to expanded cardiovascular indications.",
  },
  {
    name: "Tirzepatide",
    slug: "tirzepatide",
    category: "Weight Management",
    popular: true,
    goals: ["Weight Loss"],
    tagline: "Next-generation dual-action weight loss - up to 22% body weight reduction.",
    whatItIs:
      "Tirzepatide is a first-in-class dual glucose-dependent insulinotropic polypeptide (GIP) and GLP-1 receptor agonist. Developed by Eli Lilly, it represents the next evolution in incretin-based therapies by engaging two complementary appetite and metabolic pathways simultaneously. It is FDA-approved as Zepbound for chronic weight management and as Mounjaro for type 2 diabetes.",
    howItWorks:
      "Tirzepatide activates both GIP and GLP-1 receptors, producing additive effects on appetite suppression, insulin sensitivity, and fat metabolism. GLP-1 receptor activation reduces appetite and slows gastric emptying, while GIP receptor activation enhances fat oxidation and improves adipose tissue insulin sensitivity. The dual mechanism produces greater weight loss than GLP-1 agonism alone. Tirzepatide also improves beta-cell function and reduces hepatic steatosis through direct metabolic effects.",
    benefits: [
      "Up to 22.5% mean body weight reduction at 72 weeks — the highest of any approved pharmacotherapy",
      "Superior reductions in waist circumference compared to GLP-1 agonists alone",
      "Significant improvements in insulin sensitivity and HbA1c even in non-diabetic patients",
      "Reduction in liver fat content by up to 37% (relevant for NAFLD/MASH)",
      "Favorable lipid profile changes including reduced triglycerides and increased HDL",
      "Once-weekly subcutaneous injection with dose flexibility (5, 10, or 15 mg)",
    ],
    whoItsFor:
      "Tirzepatide is ideal for patients seeking the most aggressive pharmacological weight loss currently available, particularly those with significant weight to lose (BMI 35+) or metabolic syndrome features including insulin resistance, fatty liver, or prediabetes. It is also appropriate for patients who have plateaued on GLP-1 monotherapy and need additional metabolic support.",
    whatToExpect:
      "Like semaglutide, tirzepatide requires slow dose titration starting at 2.5 mg weekly for 4 weeks, then increasing in 2.5 mg increments every 4 weeks. Appetite reduction is often noticeable within the first week. Weight loss of 5% is common by weeks 8–12, with continued acceleration through 40–72 weeks. GI side effects (nausea, diarrhea, constipation) are the most common and tend to correlate with dose increases, improving within 1–2 weeks at each new dose level.",
    researchNotes:
      "The SURMOUNT trial program established tirzepatide as the most effective weight loss pharmacotherapy to date. SURMOUNT-1 (Jastreboff et al., New England Journal of Medicine, 2022) enrolled 2,539 non-diabetic adults with obesity and demonstrated 15.0%, 19.5%, and 22.5% weight loss at the 5, 10, and 15 mg doses, respectively, over 72 weeks. Over one-third of participants in the 15 mg group lost more than 25% of body weight. SURMOUNT-2 (Garvey et al., Lancet, 2023) showed 12.8–14.7% weight loss in patients with type 2 diabetes. SURMOUNT-3 demonstrated 26.6% weight loss when combined with intensive lifestyle intervention. SURPASS trials established glycemic efficacy, with SURPASS-2 showing superiority to semaglutide 1 mg for HbA1c reduction.",
  },
  {
    name: "AOD-9604",
    slug: "aod-9604",
    category: "Weight Management",
    goals: ["Weight Loss"],
    tagline: "Targets fat loss directly without affecting blood sugar or muscle.",
    whatItIs:
      "AOD-9604 is a synthetic peptide consisting of the last 15 amino acids (fragment 177–191) of human growth hormone, with an added tyrosine at the N-terminus. It was developed by Metabolic Pharmaceuticals in Australia specifically to isolate the fat-loss properties of growth hormone without its growth-promoting or diabetogenic effects. It is classified as a modified fragment peptide.",
    howItWorks:
      "AOD-9604 mimics the lipolytic (fat-burning) domain of growth hormone by stimulating beta-3 adrenergic receptors on adipocytes, activating hormone-sensitive lipase and promoting triglyceride breakdown. Unlike full-length GH, it does not bind to the GH receptor or increase IGF-1 levels, meaning it has no effect on blood sugar, insulin resistance, or tissue growth. It also inhibits lipogenesis (new fat formation), creating a dual mechanism of enhanced fat breakdown and reduced fat storage.",
    benefits: [
      "Targeted fat reduction without impact on blood glucose or insulin sensitivity",
      "No effect on IGF-1 levels, avoiding the proliferative risks of full-length growth hormone",
      "Preserves lean muscle mass during caloric deficit",
      "Favorable safety profile demonstrated in human clinical trials",
      "Can be combined with GLP-1 agonists or other peptides for synergistic fat loss",
    ],
    whoItsFor:
      "AOD-9604 is well-suited for patients who want targeted fat reduction but are concerned about the metabolic side effects of growth hormone therapy or GLP-1 agonists. It is appropriate for individuals with moderate body composition goals who are already following a structured diet and exercise program and want additional support. Patients with prediabetes or insulin sensitivity concerns may find it preferable to full-length GH secretagogues.",
    whatToExpect:
      "AOD-9604 is typically administered as a daily subcutaneous injection, ideally in the morning on an empty stomach. Effects on body composition are gradual — most patients notice changes in how clothing fits and in body measurements before the scale changes significantly. Meaningful results generally appear between weeks 8 and 12. It is not associated with the appetite suppression of GLP-1 agonists; its mechanism is purely lipolytic, so dietary adherence remains important.",
    researchNotes:
      "Heffernan et al. (2001) conducted Phase 2 clinical trials demonstrating that AOD-9604 promoted fat loss in obese subjects without affecting glucose tolerance, HbA1c, or IGF-1 — confirming the separation of lipolytic from diabetogenic effects. The peptide received GRAS (Generally Recognized As Safe) status from the FDA in 2014 for use in food products, though it is not FDA-approved as a pharmaceutical. Preclinical studies by Ng and Borgeaud (Obesity Research, 2000) showed that the 177–191 fragment reproduced the full lipolytic activity of hGH in ob/ob mice without triggering the growth or insulin-resistance pathways associated with intact growth hormone.",
  },

  // ── MUSCLE & RECOVERY ──────────────────────────────────────────────────────
  {
    name: "BPC-157",
    slug: "bpc-157",
    category: "Wellness",
    popular: true,
    goals: ["Muscle & Recovery", "Immunity"],
    tagline: "Accelerates healing of tendons, muscles, gut, and joints.",
    whatItIs:
      "BPC-157 (Body Protection Compound-157) is a 15-amino-acid synthetic peptide derived from a naturally occurring protective protein found in human gastric juice. It belongs to a class of compounds known as cytoprotective peptides — molecules the body produces to maintain and repair tissue integrity. It has been extensively studied in preclinical models for its broad regenerative and anti-inflammatory properties.",
    howItWorks:
      "BPC-157 acts through multiple complementary pathways. It upregulates vascular endothelial growth factor (VEGF), stimulating new blood vessel formation at injury sites and increasing nutrient delivery. It modulates the nitric oxide system, promoting vasodilation and tissue oxygenation. It accelerates fibroblast proliferation and collagen deposition in tendons and ligaments. In the gastrointestinal tract, it promotes mucosal integrity by enhancing tight junction formation and cytoprotective prostaglandin release. It also exhibits neuroprotective properties through interaction with the dopaminergic system.",
    benefits: [
      "Accelerates healing of tendons, ligaments, and muscle tears in preclinical studies",
      "Promotes gastrointestinal mucosal healing — studied in models of IBD, ulcers, and leaky gut",
      "Reduces inflammation through modulation of the nitric oxide pathway",
      "Demonstrates neuroprotective effects and supports peripheral nerve regeneration",
      "Counters NSAID-induced gut damage while preserving their anti-inflammatory benefit",
      "Favorable safety profile across extensive animal studies with no reported organ toxicity",
    ],
    whoItsFor:
      "BPC-157 is appropriate for patients recovering from musculoskeletal injuries (tendon, ligament, or muscle), those dealing with chronic joint pain or tendinopathy, and individuals with gastrointestinal issues such as leaky gut, IBS, or NSAID-related gastric irritation. Athletes and active adults seeking to accelerate recovery from training-related tissue stress are common candidates.",
    whatToExpect:
      "BPC-157 is administered via subcutaneous injection, often near the site of injury or in the abdominal area for systemic effects. Patients with acute injuries often report noticeable improvement in pain and mobility within 1–2 weeks. Chronic tendinopathies and gut healing typically require 4–8 weeks for meaningful improvement. It is commonly cycled for 6–12 weeks. Side effects are rare in clinical practice and typically limited to mild injection site irritation.",
    researchNotes:
      "Sikiric et al. (Journal of Physiology Paris, 2016; Current Pharmaceutical Design, 2018) have published extensively on BPC-157, documenting its effects across over 20 different tissue types in rodent and canine models. Studies demonstrate accelerated healing of transected Achilles tendons (Staresinic et al., Journal of Orthopaedic Research, 2003), crushed muscle tissue, and anastomotic wounds. Chang et al. (Life Sciences, 2011) showed that BPC-157 promoted tendon-to-bone healing with increased collagen fiber density. GI studies by Sikiric's group demonstrated complete reversal of NSAID-induced gastric lesions and accelerated healing in multiple colitis models. No human randomized controlled trials have been published to date, though clinical use is widespread.",
  },
  {
    name: "TB-500",
    slug: "tb-500",
    category: "Wellness",
    goals: ["Muscle & Recovery"],
    tagline: "Promotes tissue regeneration, reduces inflammation, and speeds recovery.",
    whatItIs:
      "TB-500 is a synthetic version of the 43-amino-acid active region of Thymosin Beta-4, a naturally occurring peptide present in virtually all human cells. Thymosin Beta-4 is one of the most abundant intracellular peptides in the body, playing a central role in tissue repair, cell migration, and inflammation resolution. TB-500 replicates its key regenerative properties in a form suitable for therapeutic administration.",
    howItWorks:
      "TB-500 promotes actin polymerization — the assembly of the structural protein that forms the cell's internal skeleton. This enables cells to migrate toward injury sites more efficiently, a process critical for wound healing. It upregulates Akt (protein kinase B) signaling, promoting cell survival and reducing apoptosis in damaged tissue. TB-500 also stimulates angiogenesis (new blood vessel growth) and reduces pro-inflammatory cytokines including IL-1β and TNF-α. In cardiac and skeletal muscle, it activates progenitor cells that contribute to tissue regeneration rather than scar formation.",
    benefits: [
      "Promotes migration of repair cells to injury sites through actin regulation",
      "Reduces fibrosis and scar tissue formation during healing",
      "Stimulates new blood vessel growth to improve tissue perfusion",
      "Reduces systemic and local inflammation through cytokine modulation",
      "Supports cardiac tissue protection and regeneration in preclinical models",
    ],
    whoItsFor:
      "TB-500 is suited for patients dealing with chronic soft tissue injuries, slow-healing wounds, or post-surgical recovery. It is commonly used by athletes and physically active adults recovering from muscle strains, tendon injuries, or ligament damage. It is also considered for patients with fibrotic conditions where reducing scar tissue and promoting functional tissue regeneration is a priority.",
    whatToExpect:
      "TB-500 is administered via subcutaneous injection, typically twice weekly during a loading phase (4–6 weeks) and then once weekly for maintenance. Many patients report reduced pain and improved range of motion within 2–3 weeks. Full regenerative effects on chronic injuries generally take 8–12 weeks. It is often stacked with BPC-157 for complementary mechanisms of action. Side effects are uncommon and generally mild, including occasional fatigue or lightheadedness after injection.",
    researchNotes:
      "Goldstein et al. (Expert Opinion on Biological Therapy, 2012) reviewed the extensive literature on Thymosin Beta-4, documenting its role in wound healing, cardiac repair, and neuronal regeneration. Bock-Marquette et al. (Nature, 2004) demonstrated that Thymosin Beta-4 promoted survival of cardiomyocytes and reduced scar size following myocardial infarction in mouse models. Sosne et al. (Annals of the New York Academy of Sciences, 2010) showed accelerated corneal wound healing. Philp et al. (Wound Repair and Regeneration, 2006) documented enhanced dermal wound healing with improved angiogenesis and collagen deposition. While most data references the parent compound Thymosin Beta-4, TB-500 contains the identical active sequence responsible for these regenerative effects.",
  },
  {
    name: "CJC-1295",
    slug: "cjc-1295",
    category: "Wellness",
    popular: true,
    goals: ["Muscle & Recovery", "Anti-Aging"],
    tagline: "Boosts growth hormone for better sleep, muscle gain, and fat loss.",
    whatItIs:
      "CJC-1295 is a synthetic analogue of growth hormone-releasing hormone (GHRH) consisting of 29 amino acids, modified with a Drug Affinity Complex (DAC) that extends its half-life from minutes to approximately 6–8 days. This modification allows it to maintain elevated growth hormone (GH) and IGF-1 levels with less frequent dosing than natural GHRH. It stimulates the pituitary gland to produce and release GH in a physiological pulsatile pattern.",
    howItWorks:
      "CJC-1295 binds to the GHRH receptor on somatotroph cells in the anterior pituitary gland, triggering the synthesis and secretion of growth hormone. The DAC modification enables it to bind to albumin in the bloodstream, protecting it from enzymatic degradation and extending its biological activity. This results in sustained GH pulses over several days rather than the brief spike produced by endogenous GHRH. The elevated GH in turn stimulates hepatic IGF-1 production, which mediates many downstream effects on tissue growth, repair, and metabolism. It is frequently combined with Ipamorelin, a growth hormone secretagogue, for synergistic amplification of GH release.",
    benefits: [
      "Sustained 2–10 fold increases in growth hormone levels lasting several days per dose",
      "Increased lean muscle mass and improved body composition",
      "Enhanced deep-wave sleep quality through GH-mediated sleep architecture improvement",
      "Accelerated recovery from exercise-induced muscle damage",
      "Improved skin elasticity and collagen synthesis via IGF-1 elevation",
      "Reduced visceral adiposity through GH-driven lipolysis",
    ],
    whoItsFor:
      "CJC-1295 is ideal for adults over 30 experiencing age-related decline in growth hormone output, particularly those noticing slower recovery, increased body fat despite consistent training, disrupted sleep quality, or reduced skin elasticity. It is commonly prescribed for patients who want the benefits of growth hormone optimization without the risks or cost of exogenous GH injection.",
    whatToExpect:
      "CJC-1295 is typically administered via subcutaneous injection 2–3 times per week, often before bedtime to coincide with natural nocturnal GH pulses. Improved sleep quality is frequently the first benefit patients notice, often within the first 1–2 weeks. Changes in body composition, recovery speed, and skin quality become apparent over 8–12 weeks. A typical treatment cycle runs 3–6 months. Side effects are generally mild and may include transient flushing, water retention, or tingling at the injection site.",
    researchNotes:
      "Teichman et al. (Journal of Clinical Endocrinology & Metabolism, 2006) conducted Phase 1/2 studies of CJC-1295 in healthy adults, demonstrating dose-dependent increases in GH (2–10 fold) and sustained IGF-1 elevation over 28 days with weekly dosing. Mean IGF-1 increased by 36–105% depending on dose. The drug was well-tolerated with the most common adverse events being injection site reactions and transient flushing. Ionescu and Bhatt (Endocrine Reviews, 2005) reviewed the pharmacokinetics of CJC-1295 DAC and confirmed its extended half-life relative to native GHRH and earlier analogues like tesamorelin. The CJC-1295/Ipamorelin combination, while lacking a dedicated large-scale RCT, is supported by the complementary pharmacology of GHRH-mediated amplification and ghrelin-mimetic GH release.",
  },
  {
    name: "Ipamorelin",
    slug: "ipamorelin",
    category: "Wellness",
    goals: ["Muscle & Recovery", "Anti-Aging"],
    tagline: "Clean GH pulse with no cortisol spike - ideal for recovery and lean mass.",
    whatItIs:
      "Ipamorelin is a synthetic pentapeptide growth hormone secretagogue that stimulates the pituitary gland to release growth hormone. It belongs to the ghrelin-mimetic family, acting on the same receptor as the hunger hormone ghrelin, but it has been engineered for exceptional selectivity — it triggers GH release without the cortisol, prolactin, or ACTH co-stimulation seen with older secretagogues like GHRP-6 or GHRP-2.",
    howItWorks:
      "Ipamorelin binds to the growth hormone secretagogue receptor (GHSR-1a) on pituitary somatotrophs, mimicking the action of ghrelin. This triggers an intracellular calcium cascade that stimulates GH vesicle release. Its selectivity is its defining feature: unlike other ghrelin-mimetics, ipamorelin does not significantly activate ACTH or cortisol release, and it produces minimal prolactin elevation. This means patients get a clean GH pulse without the appetite surge, cortisol-driven fat storage, or hormonal side effects associated with less selective compounds. When combined with CJC-1295, ipamorelin amplifies the GH pulse generated by GHRH stimulation.",
    benefits: [
      "Selective GH release without cortisol, prolactin, or ACTH co-stimulation",
      "Improved recovery from exercise and injury through elevated GH and IGF-1",
      "Enhanced deep sleep quality due to amplified nocturnal GH secretion",
      "Supports lean body mass development and reduces body fat percentage",
      "No significant appetite stimulation, unlike GHRP-6 and other ghrelin mimetics",
    ],
    whoItsFor:
      "Ipamorelin is well-suited for adults seeking growth hormone optimization without the side effect burden of less selective secretagogues. It is particularly appropriate for patients sensitive to cortisol-driven symptoms (anxiety, insomnia, abdominal weight gain), those using GH support for recovery rather than bodybuilding, and anyone looking for a conservative, well-tolerated entry point into peptide therapy.",
    whatToExpect:
      "Ipamorelin is administered via subcutaneous injection, most commonly once daily before bed (or twice daily for accelerated protocols). When combined with CJC-1295, improved sleep is often the first reported benefit within 1–2 weeks. Enhanced recovery, reduced soreness, and subtle body composition changes develop over 6–12 weeks. Side effects are rare and typically limited to mild head rush or tingling at the injection site. A standard treatment cycle is 3–6 months.",
    researchNotes:
      "Raun et al. (European Journal of Endocrinology, 1998) established ipamorelin's selectivity profile in a series of in vivo and in vitro studies, showing potent GH release with no statistically significant increase in cortisol or ACTH compared to GHRP-6 and hexarelin. The study demonstrated a clear dose-response curve for GH secretion in swine models. Anderson et al. (Journal of Clinical Endocrinology & Metabolism, 2001) confirmed the GH secretory potency in human subjects. Hansen et al. (European Journal of Endocrinology, 1999) showed that ipamorelin maintained its GH-releasing efficacy without desensitization over repeated dosing, an advantage over some older secretagogues.",
  },
  {
    name: "MK-677",
    slug: "mk-677",
    category: "Wellness",
    goals: ["Muscle & Recovery", "Anti-Aging"],
    tagline: "Oral GH booster - improves sleep quality, lean mass, and IGF-1 levels.",
    whatItIs:
      "MK-677 (ibutamoren mesylate) is an orally active, non-peptide growth hormone secretagogue that mimics the action of ghrelin at the GHSR-1a receptor. Unlike injectable peptides such as CJC-1295 or ipamorelin, MK-677 is taken by mouth and maintains elevated GH and IGF-1 levels for up to 24 hours per dose. It is classified as a small molecule rather than a peptide, which gives it oral bioavailability.",
    howItWorks:
      "MK-677 binds to the ghrelin receptor (GHSR-1a) in the hypothalamus and pituitary, stimulating growth hormone release in a pulsatile fashion that mimics normal physiology. It also suppresses somatostatin signaling, removing the primary brake on GH secretion. The combined effect produces sustained GH elevation without disrupting the hypothalamic-pituitary feedback loop, meaning the pituitary retains its sensitivity and endogenous GH production is not suppressed. MK-677 increases both GH pulse amplitude and IGF-1 levels, with IGF-1 elevation persisting for the duration of treatment.",
    benefits: [
      "Sustained IGF-1 elevation of approximately 39% with daily oral dosing",
      "Increased lean body mass without structured resistance training in clinical trials",
      "Significantly improved sleep quality, particularly deep (stage 3/4) sleep",
      "Oral administration — no injections required",
      "Maintained GH responsiveness over 12+ months without pituitary desensitization",
      "Improved nitrogen balance, indicating enhanced protein synthesis",
    ],
    whoItsFor:
      "MK-677 is ideal for patients who want growth hormone optimization but prefer oral dosing over injections. It is particularly suited for adults over 40 experiencing age-related GH decline, patients with poor sleep architecture, and those looking to support lean mass and recovery. It is also appropriate for patients who have used injectable GH secretagogues and want a more convenient maintenance option.",
    whatToExpect:
      "MK-677 is taken once daily, typically at bedtime due to its GH-amplifying effects on sleep. Improved sleep quality is the most commonly reported early effect, often within the first week. Some patients experience increased appetite in the first 2–4 weeks due to ghrelin receptor activation, which typically subsides. Body composition changes and recovery improvements develop over 8–16 weeks. Mild water retention is common initially and generally resolves. Fasting glucose should be monitored, as some patients experience transient increases.",
    researchNotes:
      "Nass et al. (Journal of Clinical Endocrinology & Metabolism, 2008) conducted a 12-month randomized, double-blind, placebo-controlled trial in healthy elderly adults receiving 25 mg/day MK-677. IGF-1 levels increased 39% to levels typical of young adults, lean body mass increased significantly, and GH secretory dynamics were restored to youthful patterns without tachyphylaxis. Murphy et al. (JCEM, 1998) demonstrated increased lean mass and basal metabolic rate in obese males. Chapman et al. (JCEM, 1996) showed that MK-677 restored GH pulsatility in GH-deficient elderly subjects to levels comparable to young controls, with improved sleep quality including increased REM and stage IV sleep by 50%. The most notable safety signal across trials was a modest increase in fasting glucose, generally not reaching diabetic thresholds.",
  },

  // ── ANTI-AGING ─────────────────────────────────────────────────────────────
  {
    name: "Sermorelin",
    slug: "sermorelin",
    category: "Wellness",
    popular: true,
    goals: ["Anti-Aging", "Muscle & Recovery"],
    tagline: "Restores your body's natural growth hormone production - the safer alternative to HGH.",
    whatItIs:
      "Sermorelin is a synthetic peptide consisting of the first 29 amino acids of human growth hormone-releasing hormone (GHRH 1–29). It is the shortest fully functional fragment of GHRH, retaining complete biological activity. Unlike exogenous growth hormone (which bypasses the pituitary), sermorelin stimulates the patient's own pituitary gland to produce and release GH in a natural, pulsatile pattern. It was previously FDA-approved as Geref for diagnostic use and pediatric GH deficiency.",
    howItWorks:
      "Sermorelin binds to GHRH receptors on pituitary somatotroph cells, activating the cAMP/PKA intracellular signaling cascade that triggers GH gene transcription and vesicle release. Because it works through the native GHRH receptor, the resulting GH secretion maintains the body's normal pulsatile rhythm and remains subject to somatostatin-mediated negative feedback. This means GH levels rise but cannot exceed the physiological ceiling imposed by the hypothalamic-pituitary axis — a critical safety advantage over exogenous GH injection, which bypasses this regulation entirely.",
    benefits: [
      "Restores physiological GH pulsatility without suppressing endogenous production",
      "Increases IGF-1, lean body mass, and bone mineral density",
      "Improves sleep quality through enhanced nocturnal GH secretion",
      "Safer profile than exogenous GH due to preserved negative feedback regulation",
      "Supports skin collagen production, improving elasticity and reducing fine lines",
      "Enhances fat metabolism and reduces visceral adiposity over time",
    ],
    whoItsFor:
      "Sermorelin is ideal for adults over 35 with documented or symptomatic age-related GH decline — fatigue, increased body fat, reduced exercise recovery, thinning skin, and poor sleep quality. It is particularly appropriate for patients who want GH optimization but prefer a more conservative approach than exogenous GH, or for those transitioning off growth hormone therapy to a maintenance protocol that preserves pituitary function.",
    whatToExpect:
      "Sermorelin is administered via daily subcutaneous injection, typically at bedtime. Improved sleep quality is usually the first noticeable effect, appearing within 2–4 weeks. Energy and recovery improvements develop over 4–8 weeks. Measurable changes in body composition, skin quality, and IGF-1 levels generally require 3–6 months of consistent use. Side effects are uncommon and typically limited to mild injection site reactions, occasional flushing, or transient dizziness.",
    researchNotes:
      "Walker et al. (1990) demonstrated that sermorelin administration significantly increased GH secretion in healthy adults without disrupting the hypothalamic-pituitary axis. Vittone et al. (Journal of Clinical Endocrinology & Metabolism, 1997) conducted a 6-month placebo-controlled trial in elderly subjects showing significant increases in IGF-1, lean body mass, and skin thickness. Khorram et al. (Clinical Endocrinology, 1997) showed increased growth hormone secretion, lean body mass, and reduced body fat in healthy older men and women with 16 weeks of sermorelin treatment. The compound's safety advantage lies in its preserved negative feedback: unlike exogenous GH, which suppresses endogenous production, sermorelin maintains pituitary responsiveness and cannot produce supraphysiological GH levels.",
  },
  {
    name: "Epithalon",
    slug: "epithalon",
    category: "Wellness",
    goals: ["Anti-Aging"],
    tagline: "Activates telomerase - the enzyme linked to cellular longevity.",
    whatItIs:
      "Epithalon (also spelled Epitalon) is a synthetic tetrapeptide (Ala-Glu-Asp-Gly) developed by Professor Vladimir Khavinson at the St. Petersburg Institute of Bioregulation and Gerontology. It is based on the natural peptide epithalamin, which is produced by the pineal gland. Epithalon belongs to a class known as bioregulatory peptides — short peptides that influence gene expression related to aging and cellular maintenance.",
    howItWorks:
      "Epithalon activates telomerase, the ribonucleoprotein enzyme responsible for maintaining telomere length at chromosome ends. Telomeres shorten with each cell division, and their progressive erosion is a hallmark of cellular aging. By upregulating telomerase in somatic cells, epithalon slows or partially reverses telomere attrition, potentially extending the replicative lifespan of cells. Additionally, epithalon normalizes circadian melatonin production from the pineal gland, which declines significantly with age, improving sleep-wake regulation and providing antioxidant benefits through melatonin's free radical scavenging activity.",
    benefits: [
      "Activates telomerase and supports telomere maintenance in human cell cultures",
      "Restores age-related decline in melatonin production and circadian rhythm",
      "Demonstrated reduced mortality rates in longitudinal elderly cohort studies",
      "Provides antioxidant protection through enhanced endogenous melatonin synthesis",
      "Well-tolerated with no significant adverse effects reported across clinical studies",
    ],
    whoItsFor:
      "Epithalon is appropriate for adults interested in proactive longevity protocols who understand that the evidence base, while promising, is primarily from cell culture and longitudinal observational studies rather than large-scale Western RCTs. It is suited for patients over 40 seeking to address the biological underpinnings of aging — telomere attrition, declining melatonin, and impaired circadian function.",
    whatToExpect:
      "Epithalon is typically administered as a subcutaneous injection, often in 10-day cycles repeated 2–3 times per year. The effects are not immediately perceptible in the way a growth hormone secretagogue might be. Patients who track biomarkers may observe improved melatonin levels and sleep quality within the first cycle. Measurable effects on telomere length require longer-term use and periodic testing. Many patients report improved sleep regularity and subjective well-being after the first cycle.",
    researchNotes:
      "Khavinson et al. (Bulletin of Experimental Biology and Medicine, 2003; Neuroendocrinology Letters, 2003) demonstrated that epithalon activated telomerase in human fetal fibroblasts and somatic cells in vitro, extending their replicative lifespan. Anisimov et al. (Experimental Gerontology, 2003) showed that epithalon treatment in aging mice increased lifespan by 13.6% and reduced the incidence of spontaneous tumors. The most notable clinical data comes from longitudinal studies conducted at the St. Petersburg Institute, where elderly cohorts receiving epithalon (administered as the natural extract epithalamin) demonstrated significantly lower mortality rates over 6–12 years compared to controls (Khavinson & Morozov, Gerontology, 2003). These studies also documented restoration of melatonin secretion, improved immune markers, and normalized cortisol rhythms. The limitations are the absence of large-scale, Western peer-reviewed RCTs.",
  },
  {
    name: "NAD+",
    slug: "nad-plus",
    category: "IM / IV / SQ Therapy",
    popular: true,
    goals: ["Anti-Aging", "Energy & Focus"],
    tagline: "Restores cellular energy - the coenzyme your mitochondria need most.",
    whatItIs:
      "NAD+ (nicotinamide adenine dinucleotide) is a coenzyme present in every living cell, essential for cellular energy production, DNA repair, and gene expression regulation. It exists in oxidized (NAD+) and reduced (NADH) forms and participates in hundreds of metabolic reactions. NAD+ levels decline by approximately 50% between the ages of 40 and 60, contributing to the metabolic dysfunction, cognitive decline, and impaired repair capacity associated with aging.",
    howItWorks:
      "NAD+ serves as the primary electron carrier in mitochondrial oxidative phosphorylation — the process that generates 90% of cellular ATP (energy). Beyond energy metabolism, NAD+ is consumed as a substrate by three critical enzyme families: sirtuins (SIRT1–7), which regulate gene silencing, inflammation, and circadian rhythm; PARPs, which repair DNA damage; and CD38, which modulates immune cell function. As NAD+ declines with age, these repair and regulatory pathways become progressively compromised. IV or subcutaneous NAD+ repletion rapidly restores tissue levels, reactivating mitochondrial function, DNA repair, and sirtuin-mediated gene regulation.",
    benefits: [
      "Restores mitochondrial ATP production and cellular energy output",
      "Activates sirtuin pathways involved in DNA repair, inflammation control, and longevity",
      "Supports PARP-mediated DNA damage repair, reducing accumulated genomic stress",
      "Improves cognitive clarity, focus, and mental stamina",
      "Enhances metabolic flexibility — the ability to efficiently switch between fuel sources",
      "May improve exercise endurance and reduce recovery time through enhanced cellular respiration",
    ],
    whoItsFor:
      "NAD+ therapy is appropriate for adults over 35 experiencing symptoms of cellular energy decline — persistent fatigue, brain fog, reduced exercise tolerance, slow recovery, and general loss of vitality. It is particularly relevant for patients with high cognitive demands, chronic stress, or those with biomarker evidence of metabolic dysfunction. Patients recovering from illness, surgery, or prolonged periods of poor sleep also benefit from NAD+ repletion.",
    whatToExpect:
      "NAD+ is administered intravenously (typically over 2–4 hours for a full dose of 250–500 mg) or via subcutaneous injection for maintenance. IV infusions often produce noticeable improvements in mental clarity and energy within 24–48 hours of the first session. A typical initial protocol involves 2–4 IV sessions over 1–2 weeks, followed by subcutaneous maintenance injections 2–3 times per week. During IV infusion, patients may experience chest tightness, nausea, or flushing if the drip rate is too fast — these resolve immediately when the rate is slowed.",
    researchNotes:
      "Rajman et al. (Cell Metabolism, 2018) published a comprehensive review of NAD+ biology and its therapeutic potential, documenting the age-related decline in NAD+ and the downstream consequences for mitochondrial function, DNA repair, and sirtuin activity. Yoshino et al. (Cell Metabolism, 2018) demonstrated that NMN (an NAD+ precursor) restored NAD+ levels and improved insulin sensitivity in aged mice. Imai and Guarente (Trends in Cell Biology, 2014) established the connection between NAD+ decline, sirtuin deactivation, and age-related metabolic dysfunction. Martens et al. (Nature Communications, 2018) showed that chronic NMN supplementation improved vascular function and reduced arterial stiffness in healthy older adults. While oral precursors (NMN, NR) are well-studied, direct IV NAD+ repletion is based on the pharmacological principle that bypassing gut metabolism achieves more rapid and complete tissue saturation.",
  },

  // ── ENERGY & FOCUS ─────────────────────────────────────────────────────────
  {
    name: "Semax",
    slug: "semax",
    category: "Wellness",
    goals: ["Energy & Focus"],
    tagline: "Sharpens cognitive function, boosts BDNF, and protects the brain.",
    whatItIs:
      "Semax is a synthetic heptapeptide derived from ACTH(4–10), the biologically active fragment of adrenocorticotropic hormone that affects cognitive function independently of adrenal stimulation. It was developed at the Institute of Molecular Genetics of the Russian Academy of Sciences and has been approved in Russia since 1996 as a prescription nootropic and neuroprotective agent. It is administered intranasally, providing rapid CNS delivery.",
    howItWorks:
      "Semax increases brain-derived neurotrophic factor (BDNF) and nerve growth factor (NGF) expression in the prefrontal cortex and hippocampus — the brain regions most involved in working memory, executive function, and learning. It modulates dopaminergic and serotonergic neurotransmission, enhancing attentional focus and mood without the overstimulation associated with amphetamine-class drugs. Semax also promotes neuronal survival under hypoxic and oxidative stress by upregulating anti-apoptotic proteins and reducing inflammatory cytokine expression in brain tissue.",
    benefits: [
      "Increases BDNF and NGF expression in key cognitive brain regions",
      "Enhances working memory, attention, and information processing speed",
      "Provides neuroprotection against hypoxic and ischemic brain injury",
      "Modulates dopamine and serotonin transmission for improved focus and mood",
      "Non-stimulant mechanism — no jitteriness, tolerance, or withdrawal",
    ],
    whoItsFor:
      "Semax is appropriate for professionals and executives experiencing cognitive fatigue, brain fog, or attention difficulties who want a non-stimulant nootropic approach. It is also suited for patients recovering from mild traumatic brain injury, post-concussion syndrome, or those dealing with age-related cognitive decline. Patients who have experienced side effects from traditional stimulants or who want to support long-term brain health are common candidates.",
    whatToExpect:
      "Semax is administered intranasally, typically 1–2 drops per nostril, 1–3 times daily. Many patients notice improved mental clarity and focus within the first few days of use. The cognitive benefits tend to build over 2–4 weeks of consistent use. Unlike stimulants, there is no acute peak-and-crash pattern. Semax is typically used in 2–4 week cycles with breaks in between. Side effects are rare and may include mild nasal irritation or transient headache.",
    researchNotes:
      "Dolotov et al. (Neuroscience, 2006) demonstrated that Semax significantly increased BDNF mRNA and protein levels in the rat hippocampus and basal forebrain, with effects persisting for 24 hours after a single administration. Eremin et al. (Doklady Biological Sciences, 2005) showed upregulation of neurotrophic factor gene expression. Russian Phase 2/3 clinical trials (Gusev et al., Zhurnal Nevrologii, 2005) demonstrated efficacy in acute ischemic stroke, with Semax-treated patients showing accelerated neurological recovery and improved cognitive outcomes. Ashmarin et al. (Neuroscience Research Communications, 1995) documented cognitive enhancement in healthy volunteers, including improved verbal memory and selective attention. Semax holds regulatory approval in Russia as both a nootropic and an acute stroke intervention, though it has not undergone FDA review.",
  },
  {
    name: "Selank",
    slug: "selank",
    category: "Wellness",
    goals: ["Energy & Focus"],
    tagline: "Reduces anxiety and improves focus - without sedation or dependency.",
    whatItIs:
      "Selank is a synthetic heptapeptide analogue of tuftsin, a naturally occurring immunomodulatory peptide produced by enzymatic cleavage of IgG in the spleen. Developed at the Institute of Molecular Genetics of the Russian Academy of Sciences alongside Semax, Selank has been approved in Russia as an anxiolytic and nootropic since 2009. It provides anxiety relief with cognitive enhancement — a combination not achieved by traditional anxiolytics like benzodiazepines.",
    howItWorks:
      "Selank modulates the GABAergic system by enhancing GABA-A receptor sensitivity without directly binding the benzodiazepine site, producing anxiolysis without sedation, cognitive impairment, or dependence. It simultaneously increases serotonin metabolism in the frontal cortex and hippocampus, supporting mood regulation. Selank also modulates dopaminergic transmission, which contributes to its focus-enhancing effects. As a tuftsin analogue, it retains immunomodulatory activity, stabilizing IL-6 and influencing enkephalin expression, linking its anti-anxiety effect to neuroimmune regulation.",
    benefits: [
      "Reduces generalized anxiety with efficacy comparable to benzodiazepines in clinical trials",
      "No sedation, cognitive impairment, or risk of physical dependence",
      "Improves focus and attention through balanced monoamine modulation",
      "Provides mild immunomodulatory support through tuftsin-related pathways",
      "Compatible with other nootropics and does not impair psychomotor performance",
    ],
    whoItsFor:
      "Selank is well-suited for patients dealing with generalized anxiety, situational stress, or performance anxiety who want relief without the cognitive dulling or dependency risk of benzodiazepines or the side effect profile of SSRIs. It is also appropriate for professionals who need to maintain sharp cognitive function while managing anxiety, and for patients using it in combination with Semax for comprehensive cognitive and emotional optimization.",
    whatToExpect:
      "Selank is administered intranasally, typically 2–3 times daily. Anxiolytic effects are often noticeable within the first 1–3 days, with full efficacy developing over 1–2 weeks. Unlike SSRIs, it does not require a prolonged loading period. Many patients describe a calm, clear-headed state rather than the numbing or sedation associated with traditional anxiolytics. It is commonly used in 2–4 week cycles. Side effects are rare and generally limited to mild nasal irritation.",
    researchNotes:
      "Zozulya et al. (Bulletin of Experimental Biology and Medicine, 2001) conducted Phase 2/3 clinical trials demonstrating Selank's anxiolytic efficacy in patients with generalized anxiety disorder, with effect sizes comparable to phenazepam (a benzodiazepine) but without sedation or cognitive impairment. Seredenin et al. (Bulletin of Experimental Biology and Medicine, 1998) documented Selank's effects on monoamine metabolism in the brain, showing increased serotonin turnover in the frontal cortex without depleting serotonin stores. Kozlovskii et al. (Eksperimental'naya i Klinicheskaya Farmakologiya, 2003) demonstrated that Selank enhanced memory consolidation and retrieval in animal models while simultaneously reducing anxiety-related behaviors. The dual anxiolytic-nootropic profile distinguishes Selank from both traditional anxiolytics and conventional nootropics.",
  },
  {
    name: "Dihexa",
    slug: "dihexa",
    category: "Wellness",
    goals: ["Energy & Focus", "Anti-Aging"],
    tagline: "Potent synaptogenesis activator - studied for memory and cognitive decline.",
    whatItIs:
      "Dihexa (N-hexanoic-Tyr-Ile-(6) aminohexanoic amide) is a synthetic peptide derivative of angiotensin IV, developed at Washington State University. It is a potent activator of hepatocyte growth factor (HGF) signaling through the c-Met receptor, a pathway critical for synapse formation and cognitive function. In preclinical assays, dihexa has demonstrated synaptogenic (synapse-forming) potency up to seven times greater than brain-derived neurotrophic factor (BDNF).",
    howItWorks:
      "Dihexa acts as a potentiator of the HGF/c-Met signaling system. HGF is a pleiotropic growth factor that promotes neuronal survival, neurite outgrowth, and synaptogenesis — the formation of new synaptic connections between neurons. Dihexa stabilizes HGF by inhibiting its endogenous inhibitor, allowing sustained Met receptor activation. This promotes the formation of new functional synapses, particularly in the hippocampus, which is central to learning and memory. Dihexa crosses the blood-brain barrier and is active at very low doses, making it one of the most potent pro-cognitive compounds studied to date.",
    benefits: [
      "Up to 7-fold greater synaptogenic potency than BDNF in laboratory assays",
      "Improves spatial learning and memory in aged animal models",
      "Crosses the blood-brain barrier with activity at picomolar concentrations",
      "Promotes new synaptic connections through HGF/c-Met pathway activation",
      "Studied as a potential intervention for age-related cognitive decline and dementia",
    ],
    whoItsFor:
      "Dihexa is appropriate for patients experiencing meaningful age-related cognitive decline, memory difficulties, or early signs of neurodegenerative changes who want an aggressive nootropic intervention. It is suited for patients who have already optimized foundational factors (sleep, exercise, nutrition, hormones) and are looking for additional neurological support. Given that the evidence is preclinical, patients should understand its investigational status.",
    whatToExpect:
      "Dihexa is typically administered subcutaneously or intranasally, with dosing protocols varying by clinician. Some patients report improved recall and verbal fluency within 1–2 weeks. Cognitive effects tend to build gradually over 4–8 weeks. Because the compound promotes structural changes (new synapse formation) rather than simply modulating neurotransmitter levels, the timeline for benefit is longer than acute stimulants but potentially more durable. Treatment cycles are generally 4–8 weeks.",
    researchNotes:
      "McCoy et al. (Journal of Pharmacology and Experimental Therapeutics, 2013) demonstrated that dihexa was approximately seven times more potent than BDNF in promoting synaptogenesis in hippocampal cell cultures. The same study showed that oral and subcutaneous dihexa restored cognitive function in scopolamine-impaired and aged rats across multiple spatial learning paradigms (Morris water maze, radial arm maze). Benoist et al. (Neurobiology of Learning and Memory, 2011) established the role of the HGF/c-Met system in hippocampal-dependent memory formation. Wright et al. (Frontiers in Neuroscience, 2015) reviewed the angiotensin IV/AT4 receptor system and its role in cognitive function, providing the theoretical framework for dihexa's mechanism. No human clinical trials have been published to date.",
  },
  {
    name: "Methylene Blue",
    slug: "methylene-blue",
    category: "IM / IV / SQ Therapy",
    goals: ["Energy & Focus", "Anti-Aging"],
    tagline: "Enhances mitochondrial function and cognitive performance.",
    whatItIs:
      "Methylene blue (methylthioninium chloride) is a synthetic compound first produced in 1876 that has a long history of medical use spanning over 140 years. It is the original synthetic drug and has been used as an antimalarial, a surgical dye, an antidote for methemoglobinemia, and more recently as a mitochondrial enhancer and neuroprotective agent. At low doses (0.5–4 mg/kg), it functions as an alternative electron carrier in the mitochondrial electron transport chain.",
    howItWorks:
      "At low concentrations, methylene blue acts as an auxiliary electron carrier in the mitochondrial electron transport chain, shuttling electrons between Complex I and Complex III. This bypasses dysfunctional segments of the respiratory chain, increases oxygen consumption, and enhances ATP production even in cells with impaired mitochondria. It is also a monoamine oxidase (MAO) inhibitor at therapeutic doses, increasing synaptic availability of serotonin, norepinephrine, and dopamine. Additionally, methylene blue is a potent antioxidant that scavenges reactive oxygen species and reduces nitric oxide-mediated oxidative damage. In neurons, it inhibits tau aggregation and supports autophagy of misfolded proteins.",
    benefits: [
      "Enhances mitochondrial ATP production by serving as an alternative electron carrier",
      "Improves memory consolidation and retrieval through enhanced neuronal metabolism",
      "Provides neuroprotection against oxidative stress and excitotoxicity",
      "Inhibits tau protein aggregation — studied in the context of Alzheimer's pathology",
      "Mild MAO inhibition increases synaptic monoamine availability",
      "Long safety record spanning over a century of clinical use",
    ],
    whoItsFor:
      "Methylene blue is appropriate for patients interested in mitochondrial optimization, particularly those experiencing cognitive fatigue, brain fog, or age-related decline in mental sharpness. It is suited for individuals with evidence of mitochondrial dysfunction (low energy, exercise intolerance) and those seeking neuroprotective support. Patients should be screened for SSRI/SNRI use due to potential serotonin syndrome risk, and for G6PD deficiency.",
    whatToExpect:
      "Methylene blue is administered orally or intravenously at low doses. Many patients report improved mental clarity and sustained energy within the first few days. Cognitive benefits tend to consolidate over 2–4 weeks of use. The most obvious visible effect is blue-green discoloration of urine (harmless and expected). Mild GI discomfort can occur at higher oral doses. Treatment protocols vary but commonly involve daily low-dose oral use or periodic IV sessions.",
    researchNotes:
      "Rojas et al. (Neuroscience, 2012) conducted controlled trials demonstrating that low-dose methylene blue (0.5–4 mg/kg) enhanced memory consolidation in fear-conditioning and object recognition tasks, with increased cytochrome c oxidase activity in prefrontal cortex and hippocampus. Gonzalez-Lima and Bruchey (Learning & Memory, 2004) showed enhanced memory retention in rats with low-dose methylene blue treatment. Wischik et al. (Journal of Alzheimer's Disease, 2015) published Phase 2 data on LMTM (a methylene blue derivative) showing reduced tau aggregation in Alzheimer's patients, though Phase 3 results were mixed. Wen et al. (Journal of Biological Chemistry, 2011) demonstrated that methylene blue enhanced mitochondrial function and reduced oxidative stress in cellular models of neurodegeneration. Its safety profile is well-established, with over a century of clinical use at appropriate doses.",
  },

  // ── SEXUAL HEALTH ──────────────────────────────────────────────────────────
  {
    name: "PT-141",
    slug: "pt-141",
    category: "Sexual Well-Being",
    popular: true,
    goals: ["Sexual Health"],
    tagline: "FDA-approved for low libido - works in the brain, not just the body.",
    whatItIs:
      "PT-141 (bremelanotide) is a synthetic melanocortin receptor agonist derived from the tanning peptide Melanotan II. Unlike phosphodiesterase inhibitors (such as sildenafil), which act on vascular smooth muscle, PT-141 acts directly in the central nervous system to stimulate sexual desire and arousal. It is FDA-approved as Vyleesi for hypoactive sexual desire disorder (HSDD) in premenopausal women and is used off-label in men for erectile dysfunction with a desire component.",
    howItWorks:
      "PT-141 activates melanocortin-4 receptors (MC4R) in the hypothalamus and limbic system — brain regions that regulate sexual motivation, arousal, and reward. This central mechanism distinguishes it from PDE5 inhibitors, which only increase blood flow without affecting desire. MC4R activation triggers downstream dopaminergic signaling in mesolimbic reward pathways, increasing sexual motivation and anticipatory arousal. In men, this central arousal signal also facilitates erectile response through descending autonomic pathways to the pelvic vasculature.",
    benefits: [
      "Directly increases sexual desire and motivation through CNS melanocortin pathways",
      "Effective in both men and women — addresses desire, not just mechanical function",
      "Works independently of vascular function — an option when PDE5 inhibitors are insufficient",
      "Administered as-needed via subcutaneous injection approximately 45 minutes before activity",
      "FDA-approved with established safety data from Phase 3 clinical trials",
    ],
    whoItsFor:
      "PT-141 is suited for men and women experiencing reduced sexual desire, arousal difficulty, or diminished libido that is not adequately addressed by hormonal optimization or PDE5 inhibitors alone. Women with hypoactive sexual desire disorder and men with erectile dysfunction that has a desire or psychological component are primary candidates. It is particularly useful when the issue is wanting to want — low motivation rather than purely physical dysfunction.",
    whatToExpect:
      "PT-141 is administered as a subcutaneous injection approximately 45 minutes before anticipated sexual activity. Effects typically begin within 30–60 minutes and can last 6–12 hours. Patients commonly report heightened arousal, increased sensitivity, and stronger desire. The most common side effect is transient nausea (approximately 40% of patients), which is usually mild and can be mitigated by antiemetic pretreatment. Facial flushing and mild headache may also occur. It is used on an as-needed basis, not daily.",
    researchNotes:
      "Diamond et al. (Journal of Urology, 2004) conducted Phase 2 studies in men with erectile dysfunction, demonstrating an 80% response rate with improved erection quality and sexual satisfaction compared to placebo. The RECONNECT Phase 3 trials (Kingsberg et al., Obstetrics & Gynecology, 2019) in premenopausal women with HSDD showed statistically significant increases in satisfying sexual events and desire scores, leading to FDA approval of Vyleesi. Clayton et al. (Journal of Women's Health, 2016) confirmed the favorable benefit-risk profile in women. Importantly, PT-141 demonstrated efficacy even in patients who had failed PDE5 inhibitor therapy, supporting the distinct central mechanism of action. Nausea was the most common adverse event across all trials, occurring in approximately 40% of subjects but rated as mild in the majority.",
  },
  {
    name: "Oxytocin",
    slug: "oxytocin",
    category: "Sexual Well-Being",
    goals: ["Sexual Health"],
    tagline: "Deepens intimacy, reduces stress, and enhances sexual connection.",
    whatItIs:
      "Oxytocin is a nine-amino-acid neuropeptide produced primarily in the hypothalamus (paraventricular and supraoptic nuclei) and released by the posterior pituitary gland. It is one of the most fundamental signaling molecules in human social and reproductive biology, mediating pair bonding, trust, maternal behavior, and sexual response. For therapeutic use, it is administered intranasally or sublingually to achieve CNS delivery for its psychosocial and sexual health effects.",
    howItWorks:
      "Oxytocin binds to oxytocin receptors distributed throughout the brain, particularly in the amygdala (reducing fear and anxiety), the nucleus accumbens (enhancing reward), and the hypothalamus (facilitating sexual arousal). It modulates the HPA axis by reducing cortisol release, producing a calming effect that enhances emotional receptivity. During sexual activity, oxytocin increases tactile sensitivity, enhances orgasm intensity, and strengthens the emotional bonding component of intimacy. It also modulates dopaminergic reward circuits, reinforcing partner-associated pleasure.",
    benefits: [
      "Reduces cortisol and HPA axis reactivity, lowering stress and performance anxiety",
      "Enhances emotional bonding, trust, and interpersonal connection",
      "Increases tactile sensitivity and physical pleasure during intimacy",
      "Intensifies orgasmic response in both men and women",
      "Improves emotional recognition and empathy in social interactions",
    ],
    whoItsFor:
      "Oxytocin therapy is appropriate for individuals or couples seeking to deepen emotional and physical intimacy, particularly when stress, anxiety, or emotional disconnection is affecting sexual satisfaction. It is also suited for patients with high cortisol levels or chronic stress impacting their relational well-being, and for individuals who find that performance anxiety interferes with sexual function and enjoyment.",
    whatToExpect:
      "Oxytocin is typically administered intranasally or sublingually approximately 30–60 minutes before intimacy. Effects include a sense of calm, increased emotional openness, heightened tactile sensitivity, and enhanced connection with a partner. The effects are subtle but meaningful — patients generally describe feeling more present and emotionally available rather than experiencing a dramatic pharmacological effect. It is well-tolerated with minimal side effects; occasional mild headache or nasal irritation with intranasal use has been reported.",
    researchNotes:
      "MacDonald and MacDonald (Harvard Review of Psychiatry, 2010) reviewed the extensive evidence for oxytocin's role in social bonding, trust, and sexual behavior, establishing the neurobiological framework for its therapeutic use. Kosfeld et al. (Nature, 2005) demonstrated that intranasal oxytocin significantly increased trust in economic game paradigms. Ditzen et al. (Psychoneuroendocrinology, 2009) showed reduced cortisol reactivity and improved positive communication in couples following intranasal oxytocin. Behnia et al. (Journal of Sexual Medicine, 2014) found that intranasal oxytocin increased orgasm intensity and satisfaction in healthy men. Muin et al. (Journal of Sexual Medicine, 2015) demonstrated improved sexual function scores in women receiving intranasal oxytocin. The compound is FDA-approved as Pitocin for labor induction; intranasal use for psychosocial and sexual health represents an off-label application.",
  },

  // ── HAIR & SKIN ────────────────────────────────────────────────────────────
  {
    name: "GHK-Cu",
    slug: "ghk-cu",
    category: "Dermatology",
    popular: true,
    goals: ["Hair & Skin", "Anti-Aging"],
    tagline: "Rebuilds collagen, repairs skin damage, and reverses visible aging.",
    whatItIs:
      "GHK-Cu (glycyl-L-histidyl-L-lysine copper complex) is a naturally occurring tripeptide-copper complex found in human plasma, saliva, and urine. It was first identified in 1973 by Dr. Loren Pickart, who discovered that plasma from young individuals contained a factor that caused aged liver cells to behave like younger cells — that factor was GHK-Cu. Plasma levels of GHK-Cu decline significantly with age, from approximately 200 ng/mL at age 20 to 80 ng/mL by age 60.",
    howItWorks:
      "GHK-Cu activates over 4,000 human genes, broadly shifting gene expression toward a regenerative, anti-inflammatory pattern. It upregulates collagen I, III, and IV synthesis, increases elastin production, and stimulates glycosaminoglycan (GAG) synthesis — the major structural components of youthful skin. The copper ion is essential for lysyl oxidase activity, which cross-links collagen and elastin fibers for structural integrity. GHK-Cu also activates metalloproteinases that remodel damaged tissue, reduces pro-inflammatory cytokines (IL-6, TNF-α), enhances antioxidant enzyme expression (SOD, glutathione), and promotes stem cell activity in hair follicles and skin.",
    benefits: [
      "Increases collagen I synthesis by up to 70% in treated skin in clinical trials",
      "Improves skin laxity, firmness, and elasticity with measurable tightening effects",
      "Reduces fine lines, wrinkles, and photodamage visible within 12 weeks of topical use",
      "Promotes DNA repair and reduces oxidative damage through antioxidant gene activation",
      "Stimulates hair follicle stem cell activity and may improve hair thickness",
      "Anti-inflammatory properties reduce redness and support post-procedure healing",
    ],
    whoItsFor:
      "GHK-Cu is ideal for patients over 35 experiencing visible skin aging — fine lines, loss of firmness, sun damage, uneven texture — who want a regenerative approach rather than purely cosmetic interventions. It is also appropriate for patients seeking to support wound healing post-procedure (microneedling, laser, surgery) and for those interested in a science-backed approach to maintaining skin and hair quality as part of a broader anti-aging protocol.",
    whatToExpect:
      "GHK-Cu is available in topical formulations (serums, creams) and subcutaneous injection. Topical application typically shows visible improvements in skin texture and firmness within 8–12 weeks of daily use. Subcutaneous injection provides systemic regenerative effects and is often cycled for 4–8 weeks. The most dramatic visible results come from combining GHK-Cu with procedures like microneedling, which enhances penetration. Side effects are uncommon — occasional mild skin irritation with topical application has been reported.",
    researchNotes:
      "Pickart et al. (BioMed Research International, 2015) published a comprehensive review of GHK-Cu's gene modulation effects, documenting activation of over 4,000 genes with a net shift toward regeneration, anti-inflammation, and DNA repair. Leyden et al. (Journal of Cosmetic Dermatology, 2002) conducted double-blind, placebo-controlled trials showing that GHK-Cu cream significantly improved skin laxity, reduced fine lines, and increased skin density compared to placebo and vitamin C controls after 12 weeks. Finkley et al. (International Journal of Cosmetic Science, 2005) demonstrated improved skin clarity, reduction in photodamage, and increased skin thickness. Lamb et al. (Archives of Dermatology, 2003) showed that GHK-Cu accelerated wound healing and reduced scarring post-procedure. The gene expression data from Pickart's genome-wide studies are among the most extensive for any peptide used in dermatology.",
  },
  {
    name: "Tretinoin",
    slug: "tretinoin",
    category: "Dermatology",
    goals: ["Hair & Skin"],
    tagline: "Gold standard for anti-aging skin - FDA-approved and extensively validated.",
    whatItIs:
      "Tretinoin (all-trans retinoic acid) is the biologically active form of vitamin A and the most extensively studied topical anti-aging compound in dermatology. It has been FDA-approved since 1971 for acne vulgaris and has accumulated over 50 years of clinical evidence for photoaging treatment. It is available in prescription formulations ranging from 0.01% to 0.1% concentration in cream, gel, and microsphere vehicles.",
    howItWorks:
      "Tretinoin binds to retinoic acid receptors (RARs) in the nucleus of skin cells, directly modulating gene expression. It upregulates procollagen I and III synthesis in the dermis, rebuilding the collagen matrix degraded by UV exposure and aging. It normalizes keratinocyte differentiation and turnover in the epidermis, accelerating the replacement of damaged surface cells with healthier ones. It reduces the expression of matrix metalloproteinases (MMPs) — the enzymes responsible for collagen breakdown. It also inhibits melanin transfer to keratinocytes, reducing hyperpigmentation. The net effect is thicker, more organized dermis, smoother epidermis, and more even pigmentation.",
    benefits: [
      "Increases dermal collagen synthesis and skin thickness — measurable on ultrasound",
      "Reduces fine lines and wrinkles with the most robust evidence of any topical agent",
      "Improves hyperpigmentation and evens skin tone by normalizing melanocyte activity",
      "Reduces acne by normalizing follicular keratinization and reducing comedones",
      "Over 50 years of safety and efficacy data in dermatological literature",
    ],
    whoItsFor:
      "Tretinoin is appropriate for virtually any adult concerned about photoaging, fine lines, uneven skin tone, or acne. It is the foundation of evidence-based dermatological anti-aging protocols. Patients new to retinoids should start with low concentrations (0.025%) and titrate up. It is particularly valuable for patients in their 30s–50s who want to prevent and reverse visible signs of UV damage.",
    whatToExpect:
      "Tretinoin is applied topically once daily, typically in the evening. The first 4–6 weeks often involve an adjustment period (retinization) with mild peeling, dryness, and redness as skin turnover accelerates. This is normal and generally resolves. Visible improvements in skin texture and tone begin around weeks 8–12. Collagen rebuilding and wrinkle reduction continue to improve through 6–12 months of consistent use. Sun protection is essential during treatment, as tretinoin increases photosensitivity.",
    researchNotes:
      "Griffiths et al. (New England Journal of Medicine, 1993) published the landmark randomized controlled trial demonstrating that tretinoin cream significantly improved fine wrinkles, mottled hyperpigmentation, and skin roughness in photodamaged skin over 24 weeks. Kang et al. (Journal of Investigative Dermatology, 1995) showed that tretinoin increased procollagen I mRNA and protein in sun-damaged human skin. Fisher et al. (Nature, 1996) elucidated the molecular mechanism by which UV radiation degrades collagen through MMP induction and how tretinoin blocks this pathway. Mukherjee et al. (Clinical Interventions in Aging, 2006) reviewed 40 years of evidence confirming tretinoin as the most effective topical anti-aging agent available. Long-term studies (Olsen et al., JAAD, 1997) confirmed sustained benefit over 2+ years of continuous use with stable tolerability.",
  },
  {
    name: "Minoxidil",
    slug: "minoxidil",
    category: "Hair Restore",
    popular: true,
    goals: ["Hair & Skin"],
    tagline: "Proven hair regrowth - extends the anagen phase and revives follicles.",
    whatItIs:
      "Minoxidil is an FDA-approved vasodilator originally developed as an oral antihypertensive in the 1960s. Its hair growth properties were discovered as a side effect — patients on oral minoxidil for blood pressure developed hypertrichosis (excessive hair growth). It has been FDA-approved in topical form (2% and 5% solutions) for androgenetic alopecia since 1988, and oral low-dose formulations are increasingly used off-label for hair restoration.",
    howItWorks:
      "Minoxidil opens potassium channels (K-ATP channels) in vascular smooth muscle surrounding hair follicles, increasing local blood flow and nutrient delivery. More importantly, it directly stimulates hair follicle cells: it prolongs the anagen (active growth) phase of the hair cycle, increases follicular size (converting vellus hairs back to terminal hairs), and stimulates VEGF expression in dermal papilla cells. When taken orally at low doses (0.25–2.5 mg), it provides systemic follicular stimulation with reported superior efficacy to topical application.",
    benefits: [
      "Extends the anagen (growth) phase, keeping hairs in active growth longer",
      "Increases hair follicle size, converting thin vellus hairs to thicker terminal hairs",
      "FDA-approved with over 35 years of safety data in topical formulations",
      "Oral low-dose formulation shows superior efficacy to topical in emerging clinical data",
      "Effective in both men and women with androgenetic alopecia",
      "Can be combined with finasteride, PRP, or GHK-Cu for synergistic results",
    ],
    whoItsFor:
      "Minoxidil is appropriate for men and women experiencing androgenetic alopecia (pattern hair loss), diffuse thinning, or telogen effluvium. It is particularly effective when started early, before significant miniaturization has occurred. Patients who find topical application impractical or irritating are candidates for oral low-dose formulations under physician supervision.",
    whatToExpect:
      "Topical minoxidil is applied twice daily (5% for men, 2–5% for women). Oral low-dose is taken once daily. A temporary shedding phase (increased hair fall) commonly occurs in the first 2–6 weeks — this indicates the treatment is working, as it pushes resting hairs out to make room for new growth. Visible new growth typically appears at 3–4 months, with maximum results at 12 months. Continued use is required to maintain results; discontinuation leads to gradual return to pretreatment hair density.",
    researchNotes:
      "Randolph and Tosti (Journal of the American Academy of Dermatology, 2021) published a systematic review of oral low-dose minoxidil (0.25–5 mg daily), demonstrating superior hair regrowth compared to topical formulations with acceptable cardiovascular tolerability at doses below 2.5 mg. Olsen et al. (JAAD, 2002) conducted large-scale RCTs of topical minoxidil establishing the 5% formulation as significantly more effective than 2% in men. Price et al. (JAAD, 1999) demonstrated efficacy of 2% topical minoxidil in women with androgenetic alopecia. Lucky et al. (JAAD, 2004) confirmed 5% efficacy in women. Oral minoxidil studies by Sinclair et al. (International Journal of Dermatology, 2018) showed that 0.25 mg daily was effective in women with a favorable safety profile.",
  },
  {
    name: "Finasteride",
    slug: "finasteride",
    category: "Hair Restore",
    goals: ["Hair & Skin"],
    tagline: "Stops DHT-driven hair loss at the source.",
    whatItIs:
      "Finasteride is a selective inhibitor of type II 5-alpha-reductase, the enzyme that converts testosterone to dihydrotestosterone (DHT) in the scalp, prostate, and other androgen-sensitive tissues. It was originally developed and FDA-approved for benign prostatic hyperplasia (Proscar, 5 mg) and subsequently approved at 1 mg (Propecia) for male androgenetic alopecia. It is the most effective oral monotherapy for preventing DHT-driven hair loss.",
    howItWorks:
      "Finasteride inhibits the type II isoform of 5-alpha-reductase, reducing conversion of testosterone to DHT by approximately 65–70% in serum and scalp tissue. DHT is the primary androgen responsible for miniaturizing hair follicles in genetically susceptible individuals (androgenetic alopecia). By reducing DHT exposure, finasteride halts the progressive miniaturization of hair follicles, prevents further hair loss, and in many cases allows partially miniaturized follicles to recover and produce thicker, longer hairs. Serum testosterone may increase slightly as less is converted to DHT, but this is generally clinically insignificant.",
    benefits: [
      "Reduces scalp and serum DHT by 65–70%, directly addressing the cause of androgenetic alopecia",
      "Maintains or increases hair count in over 80% of men in clinical trials",
      "5-year data shows 48% increase in hair count vs. baseline (vs. continued loss in placebo)",
      "Once-daily oral dosing with established long-term safety profile",
      "Can be combined with minoxidil for additive efficacy",
    ],
    whoItsFor:
      "Finasteride is primarily indicated for men with androgenetic alopecia (male pattern hair loss) who are experiencing progressive thinning, particularly at the vertex and frontal hairline. It is most effective when initiated early, before significant follicular loss. Comprehensive patient counseling is required regarding potential sexual side effects and the rare reports of persistent symptoms (post-finasteride syndrome). It is not FDA-approved for use in women of childbearing potential due to teratogenicity risk.",
    whatToExpect:
      "Finasteride is taken as a 1 mg oral tablet once daily. Reduced hair shedding is typically the first sign of efficacy, noticeable within 1–3 months. Visible improvements in hair density generally appear at 6–12 months. Maximum benefit is observed at 1–2 years of continuous use. As with minoxidil, finasteride requires ongoing use — discontinuation results in loss of benefit over 6–12 months. Sexual side effects (reduced libido, erectile changes) are reported in 2–4% of clinical trial participants and are reversible upon discontinuation in the vast majority.",
    researchNotes:
      "Kaufman et al. (Journal of the American Academy of Dermatology, 1998) published the pivotal 5-year RCT in 1,553 men, demonstrating a 48% increase in hair count from baseline with finasteride 1 mg vs. progressive decline in the placebo group. The study also showed significant improvements in patient-assessed appearance and investigator-assessed hair growth. The Prostate Cancer Prevention Trial (Thompson et al., NEJM, 2003) provided extensive long-term safety data in over 18,000 men taking finasteride 5 mg. Regarding post-finasteride syndrome — persistent sexual, neurological, and psychological symptoms after discontinuation — Traish et al. (Journal of Steroid Biochemistry and Molecular Biology, 2015) characterized the reported cases, though causality remains debated and the FDA label now includes this risk. Irwig and Kolukula (Journal of Sexual Medicine, 2011) reported persistent sexual dysfunction in a subset of young men, which informed updated labeling.",
  },

  // ── IMMUNITY ───────────────────────────────────────────────────────────────
  {
    name: "Thymosin Alpha-1",
    slug: "thymosin-alpha-1",
    category: "Wellness",
    goals: ["Immunity", "Anti-Aging"],
    tagline: "Supercharges your immune system - used in 35+ countries for chronic infections.",
    whatItIs:
      "Thymosin Alpha-1 (Tα1) is a 28-amino-acid peptide originally isolated from thymosin fraction 5, a preparation derived from calf thymus tissue. It is the N-terminal fragment of prothymosin alpha, a nuclear protein involved in immune regulation. Thymosin Alpha-1 has been approved in over 35 countries (marketed as Zadaxin) for the treatment of hepatitis B, hepatitis C, and immune deficiency, and holds FDA orphan drug designation for hepatocellular carcinoma.",
    howItWorks:
      "Thymosin Alpha-1 acts on dendritic cells and T lymphocytes to shift the immune system toward a Th1 (cell-mediated) response. It upregulates toll-like receptors (TLR-2, TLR-9) on dendritic cells, enhancing pathogen recognition and antigen presentation. It increases production of Th1 cytokines (IL-2, IFN-γ) while downregulating excessive Th2 and inflammatory cytokine production (IL-4, IL-10, IL-6). It also activates natural killer (NK) cells and enhances cytotoxic T lymphocyte (CTL) activity. This rebalancing makes the immune system more effective at clearing infections and surveilling for abnormal cells without promoting the excessive inflammation that causes collateral tissue damage.",
    benefits: [
      "Upregulates Th1 immunity, enhancing the body's ability to fight viral and intracellular infections",
      "Activates NK cells and cytotoxic T lymphocytes for improved immune surveillance",
      "Enhances dendritic cell maturation and antigen presentation",
      "Reduces excessive inflammatory cytokine production, rebalancing the immune response",
      "Approved in 35+ countries with an extensive clinical safety and efficacy record",
      "Studied as adjunctive therapy in chronic hepatitis, immunodeficiency, and oncology",
    ],
    whoItsFor:
      "Thymosin Alpha-1 is appropriate for patients with recurrent infections, chronic viral conditions (including hepatitis B/C), post-chemotherapy immune suppression, or age-related immune decline (immunosenescence). It is also used proactively by patients who want to optimize immune function during high-risk periods or who have documented low NK cell or T-cell activity on immune panels.",
    whatToExpect:
      "Thymosin Alpha-1 is administered as a subcutaneous injection, typically twice weekly. Patients with recurrent infections often notice reduced frequency and severity of illness within 4–8 weeks. Immune biomarkers (NK cell counts, T-cell subsets) may show measurable improvement on repeat testing at 8–12 weeks. Treatment duration varies from 3–6 months for immune optimization to longer-term use in chronic viral conditions. Side effects are uncommon and generally limited to mild injection site reactions.",
    researchNotes:
      "Romani et al. (Annals of the New York Academy of Sciences, 2012) reviewed the extensive clinical evidence for Thymosin Alpha-1, documenting its mechanism of action on dendritic cells, TLR signaling, and Th1/Th2 balance. Garaci et al. (International Immunopharmacology, 2000) published clinical data showing enhanced immune reconstitution in HIV patients receiving Tα1 as adjunctive therapy. The largest body of clinical evidence comes from hepatitis B trials: Chan et al. (Hepatology, 2001) and Mutchnick et al. (Hepatology, 1991) demonstrated enhanced viral clearance when Tα1 was added to standard antiviral therapy. During the COVID-19 pandemic, Liu et al. (Clinical Infectious Diseases, 2020) reported that Tα1 administration in critically ill COVID-19 patients was associated with reduced mortality and restored T-cell counts, though this was an observational study. Zadaxin has maintained regulatory approval across 35+ countries based on decades of safety and efficacy data.",
  },
  {
    name: "VIP",
    slug: "vip",
    category: "Wellness",
    goals: ["Immunity"],
    tagline: "Powerful anti-inflammatory - studied for autoimmune and lung conditions.",
    whatItIs:
      "VIP (Vasoactive Intestinal Peptide) is a 28-amino-acid neuropeptide that functions as both a neurotransmitter and a potent immunomodulatory agent. It is widely distributed throughout the central and peripheral nervous systems, the gastrointestinal tract, and immune tissue. VIP was first isolated from porcine intestine in 1970 and has since been recognized as one of the body's most important endogenous anti-inflammatory molecules.",
    howItWorks:
      "VIP activates two G-protein-coupled receptors: VPAC1 (predominantly on immune cells) and VPAC2 (predominantly on smooth muscle and epithelial cells). Through VPAC1, VIP suppresses the production of pro-inflammatory cytokines including TNF-α, IL-6, IL-12, and nitric oxide by macrophages and dendritic cells. It simultaneously promotes the differentiation of regulatory T cells (Tregs), which actively suppress autoimmune and hyperinflammatory responses. Through VPAC2, VIP promotes bronchodilation, pulmonary vasodilation, and mucosal barrier integrity. This dual mechanism makes VIP both an anti-inflammatory agent and a tissue-protective molecule.",
    benefits: [
      "Potent suppression of TNF-α, IL-6, IL-12, and nitric oxide production",
      "Promotes regulatory T-cell differentiation for lasting immune balance",
      "Supports pulmonary vasodilation and improved oxygenation in lung conditions",
      "Protects mucosal barrier integrity in the gut and respiratory tract",
      "Studied in rheumatoid arthritis, Crohn's disease, and pulmonary hypertension",
    ],
    whoItsFor:
      "VIP is appropriate for patients with chronic inflammatory conditions, autoimmune disorders, or mast cell activation syndrome (MCAS) who have not achieved adequate control with conventional therapies. It is also used in the treatment of chronic inflammatory response syndrome (CIRS) related to mold or biotoxin exposure. Patients with pulmonary symptoms, chronic fatigue with inflammatory biomarkers, or treatment-resistant autoimmune conditions are common candidates.",
    whatToExpect:
      "VIP is most commonly administered intranasally, with dosing typically starting low and titrating based on response. Patients with inflammatory conditions often report gradual improvement in symptoms over 2–8 weeks, including reduced fatigue, improved breathing, and decreased pain. Inflammatory biomarkers (CRP, cytokine panels) may show measurable improvement at 4–8 weeks. Treatment duration depends on the underlying condition — CIRS protocols may run 1–3 months, while autoimmune support may be longer-term. Side effects are generally mild and may include transient nasal congestion or loose stools.",
    researchNotes:
      "Delgado et al. (Nature Medicine, 2001; Annals of the New York Academy of Sciences, 2004) published extensive research demonstrating VIP's potent anti-inflammatory effects through suppression of TNF-α, IL-6, and IL-12, and promotion of Treg differentiation. Delgado et al. showed that VIP administration prevented and treated collagen-induced arthritis in animal models. Gonzalez-Rey and Delgado (Annals of the Rheumatic Diseases, 2007) demonstrated efficacy in experimental models of Crohn's disease and sepsis. Petkov et al. (Thorax, 2003) showed that inhaled VIP improved pulmonary hemodynamics in patients with primary pulmonary hypertension. Shoemaker et al. (based on the Surviving Mold protocol) have described VIP nasal spray as the final step in CIRS treatment, targeting persistent pulmonary and systemic inflammation in biotoxin-exposed patients. While these clinical applications are supported by mechanistic data and smaller clinical studies, large-scale RCTs are limited.",
  },

  // ── HORMONES ───────────────────────────────────────────────────────────────
  {
    name: "Testosterone",
    slug: "testosterone",
    category: "Hormone Restoration",
    popular: true,
    goals: ["Hormones", "Muscle & Recovery", "Sexual Health"],
    tagline: "Restores energy, strength, libido, and body composition in hypogonadal men.",
    whatItIs:
      "Testosterone is the primary male sex hormone (androgen) produced mainly by the Leydig cells of the testes, with smaller amounts from the adrenal cortex. It is a C-19 steroid hormone that governs sexual development, body composition, bone density, erythropoiesis, cognitive function, and mood. Testosterone replacement therapy (TRT) uses bioidentical testosterone (identical to the molecule produced naturally) delivered via intramuscular injection, transdermal cream/gel, subcutaneous pellet, or nasal spray.",
    howItWorks:
      "Testosterone binds to the androgen receptor (AR), a nuclear receptor that directly modulates gene expression in muscle, bone, fat, brain, and reproductive tissue. In skeletal muscle, it activates satellite cells and increases protein synthesis, driving lean mass accretion. In adipose tissue, it promotes lipolysis and inhibits lipogenesis. In bone, it stimulates osteoblast differentiation and mineral deposition. In the brain, it modulates dopaminergic neurotransmission (affecting motivation and mood) and directly influences libido through hypothalamic pathways. Some effects are mediated through conversion to estradiol via aromatase, which is necessary for bone density and cardiovascular health in men.",
    benefits: [
      "Increases lean muscle mass and reduces visceral fat in hypogonadal men",
      "Restores libido, erectile function, and overall sexual satisfaction",
      "Improves energy, motivation, and reduces symptoms of depression and fatigue",
      "Increases bone mineral density, reducing fracture risk",
      "Stimulates erythropoiesis, improving oxygen delivery and exercise capacity",
      "Enhances cognitive function including verbal memory and spatial ability",
    ],
    whoItsFor:
      "TRT is indicated for men with documented hypogonadism — defined as total testosterone below 300 ng/dL with consistent symptoms including fatigue, reduced libido, erectile dysfunction, loss of muscle mass, increased body fat, depressed mood, or cognitive decline. It is appropriate for both primary hypogonadism (testicular) and secondary hypogonadism (pituitary/hypothalamic), though the underlying cause should be evaluated before initiating therapy.",
    whatToExpect:
      "The delivery method determines the timeline. Injectable testosterone cypionate or enanthate is typically administered weekly or biweekly. Improved libido and energy are often the first changes, noticeable within 2–4 weeks. Body composition changes (muscle gain, fat loss) develop over 3–6 months. Maximum benefits in bone density, metabolic parameters, and body composition require 12+ months. Regular monitoring of hematocrit, PSA, estradiol, and lipids is essential. Common side effects include acne, increased hematocrit, mild fluid retention, and estrogen-related effects (gynecomastia, mood changes) that are managed through dose adjustment or aromatase inhibition.",
    researchNotes:
      "Bhasin et al. (New England Journal of Medicine, 2010) published the Testosterone in Older Men with Mobility Limitations (TOM) trial, establishing TRT's efficacy for body composition and physical function while highlighting cardiovascular monitoring needs. The Testosterone Trials (TTrials; Snyder et al., NEJM, 2016) — a coordinated set of seven placebo-controlled trials in 788 men over 65 — demonstrated that testosterone improved sexual function, walking distance, mood, and bone mineral density. Travers et al. (Journal of Clinical Endocrinology & Metabolism, 2018) provided meta-analytic evidence for improved lean mass and reduced fat mass. The TRAVERSE trial (Lincoff et al., NEJM, 2023) — the largest cardiovascular safety trial of TRT (5,246 men) — demonstrated non-inferiority to placebo for major adverse cardiovascular events, addressing longstanding safety concerns.",
  },
  {
    name: "Estradiol",
    slug: "estradiol",
    category: "Hormone Restoration",
    popular: true,
    goals: ["Hormones", "Anti-Aging"],
    tagline: "Bioidentical estrogen - restores hormonal balance, bone density, and cognitive function.",
    whatItIs:
      "Estradiol (17β-estradiol, or E2) is the most potent and predominant endogenous estrogen in premenopausal women, produced primarily by the ovarian follicles. It is a steroid hormone essential for reproductive function, bone metabolism, cardiovascular protection, cognitive function, and skin integrity. Bioidentical estradiol used in hormone replacement therapy is structurally identical to the molecule produced by the ovaries and is available in transdermal patches, topical gels, oral tablets, and vaginal preparations.",
    howItWorks:
      "Estradiol binds to estrogen receptors ERα and ERβ, which are nuclear transcription factors distributed throughout virtually every tissue in the body. In bone, it suppresses osteoclast activity and promotes osteoblast function, maintaining bone density. In the cardiovascular system, it promotes nitric oxide-mediated vasodilation and favorable lipid profiles. In the brain, it supports synaptic plasticity, cholinergic neurotransmission, and neuronal survival in the hippocampus and prefrontal cortex. Transdermal delivery is preferred because it avoids first-pass hepatic metabolism, eliminating the increased clotting factor production and VTE risk associated with oral estrogen.",
    benefits: [
      "Eliminates or dramatically reduces vasomotor symptoms (hot flashes, night sweats)",
      "Prevents and partially reverses postmenopausal bone loss — reduces fracture risk by 30–40%",
      "Maintains cardiovascular protection when initiated within 10 years of menopause onset",
      "Supports cognitive function and may reduce risk of Alzheimer's disease when started early",
      "Improves urogenital health, reducing vaginal atrophy and recurrent UTIs",
      "Enhances skin collagen, thickness, and elasticity",
    ],
    whoItsFor:
      "Estradiol therapy is appropriate for perimenopausal and postmenopausal women experiencing vasomotor symptoms, sleep disruption, bone loss, vaginal atrophy, or cognitive changes related to estrogen decline. The timing hypothesis strongly supports initiation within 10 years of menopause onset or before age 60 for maximum cardiovascular and cognitive benefit. Women with premature ovarian insufficiency or surgical menopause particularly benefit from estrogen replacement.",
    whatToExpect:
      "Transdermal estradiol patches (typically 0.025–0.1 mg) are applied twice weekly; gels are applied daily. Hot flashes and night sweats often improve within 1–2 weeks. Sleep quality and mood stabilize over 2–4 weeks. Vaginal symptoms improve over 4–12 weeks (vaginal estrogen may be added for localized benefit). Bone density improvements are measurable at 12–24 months. Women with an intact uterus must take progesterone alongside estradiol to prevent endometrial hyperplasia. Common side effects during adjustment include breast tenderness and spotting, which typically resolve within 1–3 months.",
    researchNotes:
      "The Women's Health Initiative (WHI; Rossouw et al., JAMA, 2002) initially raised concerns about HRT, but subsequent reanalysis and the WHI estrogen-alone arm (Manson et al., JAMA, 2013, 2017) demonstrated that women aged 50–59 initiating conjugated equine estrogen alone had reduced coronary heart disease and total mortality. Hodis et al. (New England Journal of Medicine, 2016) published the ELITE (Early versus Late Intervention Trial with Estradiol) study, showing that estradiol initiated within 6 years of menopause significantly slowed carotid intima-media thickness progression (a surrogate for atherosclerosis) while later initiation did not — establishing the timing hypothesis. The Kronos Early Estrogen Prevention Study (KEEPS; Harman et al., Annals of Internal Medicine, 2014) confirmed cardiovascular safety and symptomatic benefit of transdermal estradiol in recently menopausal women. Transdermal route-specific safety was established by the ESTHER study (Canonico et al., Circulation, 2007), showing no increased VTE risk with transdermal estrogen.",
  },
  {
    name: "DHEA",
    slug: "dhea",
    category: "Hormone Restoration",
    goals: ["Hormones", "Sexual Health", "Anti-Aging"],
    tagline: "The precursor to all sex hormones - declines 80% by age 70.",
    whatItIs:
      "DHEA (dehydroepiandrosterone) is the most abundant circulating steroid hormone in the human body, produced primarily by the adrenal cortex. It serves as the biochemical precursor to both testosterone and estradiol, converting peripherally in target tissues through enzymatic pathways. DHEA levels peak in the mid-20s and decline steadily, falling approximately 80% by age 70 — a process termed adrenopause. Intravaginal DHEA (prasterone, marketed as Intrarosa) is FDA-approved for dyspareunia due to vulvovaginal atrophy.",
    howItWorks:
      "DHEA is converted to androstenedione, testosterone, and estradiol by tissue-specific enzymes (3β-HSD, 17β-HSD, aromatase) in a process called intracrinology — the local production of active hormones from circulating precursors. This means DHEA supplementation provides building blocks that each tissue converts according to its own needs, rather than flooding the entire body with a single active hormone. DHEA also binds directly to the sigma-1 receptor (modulating neuroprotection and mood), enhances insulin sensitivity through PPAR-α activation, and supports osteoblast differentiation in bone tissue.",
    benefits: [
      "Restores adrenal androgen precursor levels that decline 2–5% per year after age 25",
      "Improves libido and sexual function in both men and women through peripheral androgen conversion",
      "Supports bone mineral density through both direct osteoblast effects and downstream sex hormone production",
      "Enhances insulin sensitivity and metabolic parameters",
      "Improves vaginal health and reduces dyspareunia (FDA-approved indication as Intrarosa)",
      "Supports mood and well-being through sigma-1 receptor modulation and downstream hormone effects",
    ],
    whoItsFor:
      "DHEA is appropriate for adults over 40 with documented low DHEA-S levels and symptoms of adrenal androgen deficiency, including reduced libido, fatigue, loss of well-being, or declining bone density. Women with adrenal insufficiency or hypopituitarism particularly benefit, as do postmenopausal women with vulvovaginal atrophy. It is also used as an adjunct in comprehensive hormone restoration protocols where upstream precursor support is desired.",
    whatToExpect:
      "DHEA is taken orally (typically 25–50 mg daily for women, 50–100 mg for men) or applied intravaginally for localized urogenital benefit. Improvements in energy, libido, and well-being are commonly reported within 2–4 weeks. Effects on bone density require 6–12 months to measure. DHEA levels should be monitored with lab testing (DHEA-S) to ensure dosing is appropriate, as excessive levels can cause acne, oily skin, or androgenic side effects (particularly in women). Downstream testosterone and estradiol should also be monitored periodically.",
    researchNotes:
      "Labrie et al. (Menopause, 2009; Journal of Steroid Biochemistry and Molecular Biology, 2015) conducted the clinical trials leading to FDA approval of intravaginal DHEA (Intrarosa) for moderate-to-severe dyspareunia, demonstrating significant improvements in vaginal pH, parabasal cell percentage, and pain scores without meaningful increases in systemic sex hormone levels. Baulieu et al. (Proceedings of the National Academy of Sciences, 2000) published the DHEAge study — a 12-month placebo-controlled trial in 280 elderly subjects showing improvements in skin hydration, bone turnover markers, and libido in women over 70. Arlt et al. (New England Journal of Medicine, 1999) demonstrated that DHEA replacement in women with adrenal insufficiency significantly improved well-being, mood, and sexual function. Morales et al. (Journal of Clinical Endocrinology & Metabolism, 1994) showed improved energy, well-being, and immune function in both men and women after 6 months of DHEA supplementation.",
  },
];

export function findPeptideBySlug(slug: string): PeptideDetail | undefined {
  return PEPTIDE_DETAILS.find((p) => p.slug === slug);
}
