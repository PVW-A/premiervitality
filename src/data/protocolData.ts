/* ═══════════════════════════════════════════════════════════════════
   Protocol Data — shared between Protocols listing + ProtocolDetail
   ═══════════════════════════════════════════════════════════════════ */

/* ───────────────────────────── types ───────────────────────────── */

export interface Product {
  name: string;
  compound: string;
  dosing: string;
  doseSummary: string;
  form: string;
}

export interface ProtocolCard {
  id: string;
  name: string;
  duration: string;
  products: Product[];
  protocolDescription: string;
  synergyRationale: string;
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
  /* ══════════════════════════════════════════════════════════════
     Weight Management
     ══════════════════════════════════════════════════════════════ */
  {
    id: "weight",
    name: "Weight Management",
    description: "Physician-directed protocols targeting metabolic optimization, appetite regulation, and sustainable body composition change.",
    gendered: false,
    tiers: {
      premier: [
        {
          id: "wm-p1",
          name: "GLP-1+GIP / GH Secretagogue",
          duration: "12 weeks",
          protocolDescription: "This premier weight management protocol pairs Tirzepatide, a dual GLP-1/GIP receptor agonist, with a potent Ipamorelin/Tesamorelin growth hormone secretagogue stack. Tirzepatide drives appetite suppression and improved glycemic control while the GH secretagogue promotes visceral fat reduction and lean mass preservation. Together they address both the hormonal and metabolic drivers of excess body weight.",
          synergyRationale: "Tirzepatide suppresses appetite and improves insulin sensitivity from the top down, while Ipamorelin/Tesamorelin amplifies lipolysis and preserves muscle through pulsatile GH release — attacking fat loss from two independent physiological axes.",
          products: [
            {
              name: "Tirzepatide (GLP-1/GIP Agonist) 10mg per mL - SQ Injectable [5mL]",
              compound: "GLP-1+GIP",
              dosing: "INJECT 0.25ML (2.5MG) SUBCUTANEOUSLY ONCE WEEKLY. TITRATE UP BY 2.5MG EVERY 4 WEEKS AS TOLERATED TO A MAX OF 15MG WEEKLY.",
              doseSummary: "Dose: 2.5mg - 15mg weekly",
              form: "injectable",
            },
            {
              name: "N-Acetyl Ipamorelin (500mcg) + Tesamorelin (2500mcg) per mL - SQ Injectable [10mL]",
              compound: "GH Secretagogue",
              dosing: "INJECT 0.2ML (100MCG IPAMORELIN + 500MCG TESAMORELIN) SUBCUTANEOUSLY 60 MINUTES AWAY FROM FOOD PRIOR TO BED FIVE NIGHTS PER WEEK.",
              doseSummary: "Dose: 100mcg Ipamorelin + 500mcg Tesamorelin",
              form: "injectable",
            },
          ],
        },
        {
          id: "wm-p2",
          name: "GLP-1+GIP / Mitochondrial Uncoupler",
          duration: "12 weeks",
          protocolDescription: "This protocol combines Tirzepatide for central appetite suppression and glycemic control with a mitochondrial uncoupling agent that elevates basal metabolic rate. The dual mechanism targets both caloric intake reduction and increased energy expenditure at the cellular level. Patients experience accelerated fat loss through complementary thermogenic and hormonal pathways.",
          synergyRationale: "Tirzepatide reduces caloric intake through GLP-1/GIP receptor activation while the mitochondrial uncoupler independently increases resting energy expenditure, creating a potent caloric deficit from both sides of the energy balance equation.",
          products: [
            {
              name: "Tirzepatide (GLP-1/GIP Agonist) 10mg per mL - SQ Injectable [5mL]",
              compound: "GLP-1+GIP",
              dosing: "INJECT 0.25ML (2.5MG) SUBCUTANEOUSLY ONCE WEEKLY. TITRATE UP BY 2.5MG EVERY 4 WEEKS AS TOLERATED TO A MAX OF 15MG WEEKLY.",
              doseSummary: "Dose: 2.5mg - 15mg weekly",
              form: "injectable",
            },
            {
              name: "DNP Analog (Mitochondrial Uncoupler) 50mg - Oral Capsule [60ct]",
              compound: "Mitochondrial Uncoupler",
              dosing: "TAKE ONE CAPSULE (50MG) BY MOUTH ONCE DAILY WITH FOOD. DO NOT EXCEED ONE CAPSULE PER DAY.",
              doseSummary: "Dose: 50mg daily",
              form: "capsule",
            },
          ],
        },
        {
          id: "wm-p3",
          name: "GLP-1+GIP / Weight Loss / Thermogenesis",
          duration: "12 weeks",
          protocolDescription: "This advanced protocol pairs Tirzepatide with AOD-9604, a fat-targeting growth hormone fragment that selectively promotes lipolysis in adipose tissue without affecting blood glucose or growth. AOD-9604 mimics the fat-burning action of natural growth hormone while Tirzepatide provides appetite control and metabolic optimization. The combination delivers targeted fat reduction with minimal systemic side effects.",
          synergyRationale: "Tirzepatide addresses appetite and insulin resistance centrally, while AOD-9604 directly stimulates lipolysis in adipose tissue through GH-receptor fragment activity — providing both systemic metabolic support and localized fat mobilization.",
          products: [
            {
              name: "Tirzepatide (GLP-1/GIP Agonist) 10mg per mL - SQ Injectable [5mL]",
              compound: "GLP-1+GIP",
              dosing: "INJECT 0.25ML (2.5MG) SUBCUTANEOUSLY ONCE WEEKLY. TITRATE UP BY 2.5MG EVERY 4 WEEKS AS TOLERATED TO A MAX OF 15MG WEEKLY.",
              doseSummary: "Dose: 2.5mg - 15mg weekly",
              form: "injectable",
            },
            {
              name: "AOD-9604 (Fat-Targeting GH Fragment) 3mg per mL - SQ Injectable [5mL]",
              compound: "AOD-9604",
              dosing: "INJECT 0.1ML (300MCG) SUBCUTANEOUSLY ONCE DAILY IN THE MORNING ON AN EMPTY STOMACH.",
              doseSummary: "Dose: 300mcg daily",
              form: "injectable",
            },
          ],
        },
        {
          id: "wm-p4",
          name: "Lyophilized GLP-1+GIP / GH Secretagogue",
          duration: "12 weeks",
          protocolDescription: "This lyophilized protocol delivers the same clinically proven Tirzepatide and Ipamorelin combination in a freeze-dried format that offers extended shelf life and precise reconstitution dosing. The lyophilized formulation preserves molecular integrity and allows for flexible storage and travel. Patients receive the full benefits of dual GLP-1/GIP agonism paired with pulsatile GH release.",
          synergyRationale: "Tirzepatide controls appetite and glycemic response while Ipamorelin stimulates natural GH pulses for fat metabolism and lean mass support — the lyophilized format ensures maximum peptide stability and potency.",
          products: [
            {
              name: "Tirzepatide (GLP-1/GIP) 10mg - Lyophilized Powder for Reconstitution [1 vial]",
              compound: "GLP-1+GIP",
              dosing: "RECONSTITUTE WITH 1ML BACTERIOSTATIC WATER. INJECT 0.25ML (2.5MG) SUBCUTANEOUSLY ONCE WEEKLY. TITRATE UP BY 2.5MG EVERY 4 WEEKS AS TOLERATED TO A MAX OF 15MG WEEKLY.",
              doseSummary: "Dose: 2.5mg - 15mg weekly",
              form: "lyophilized powder",
            },
            {
              name: "Ipamorelin (5mg) - Lyophilized Powder [1 vial]",
              compound: "Ipamorelin",
              dosing: "RECONSTITUTE WITH 2.5ML BACTERIOSTATIC WATER. INJECT 0.2ML (200MCG) SUBCUTANEOUSLY PRIOR TO BED FIVE NIGHTS PER WEEK.",
              doseSummary: "Dose: 200mcg nightly",
              form: "lyophilized powder",
            },
          ],
        },
        {
          id: "wm-p5",
          name: "Capsule Mitochondrial Uncoupler",
          duration: "12 weeks",
          protocolDescription: "This oral protocol combines Tirzepatide injection with a Berberine HCl and Dihydroberberine capsule stack that activates AMPK to mimic metabolic benefits similar to exercise. Berberine improves glucose metabolism, reduces lipogenesis, and enhances mitochondrial function through a natural plant-derived pathway. The combination provides robust metabolic support with a convenient oral adjunct.",
          synergyRationale: "Tirzepatide drives appetite suppression via incretin pathways while Berberine/DHB activates AMPK — the cellular energy sensor — independently improving glucose uptake, fatty acid oxidation, and mitochondrial biogenesis.",
          products: [
            {
              name: "Tirzepatide (GLP-1/GIP Agonist) 10mg per mL - SQ Injectable [5mL]",
              compound: "GLP-1+GIP",
              dosing: "INJECT 0.25ML (2.5MG) SUBCUTANEOUSLY ONCE WEEKLY. TITRATE UP BY 2.5MG EVERY 4 WEEKS AS TOLERATED TO A MAX OF 15MG WEEKLY.",
              doseSummary: "Dose: 2.5mg - 15mg weekly",
              form: "injectable",
            },
            {
              name: "Berberine HCl (500mg) + Dihydroberberine (200mg) - Oral Capsule [90ct]",
              compound: "Mitochondrial Uncoupler",
              dosing: "TAKE ONE CAPSULE THREE TIMES DAILY WITH MEALS.",
              doseSummary: "Dose: 500mg Berberine + 200mg DHB per capsule, 3x daily",
              form: "capsule",
            },
          ],
        },
      ],
      core: [
        {
          id: "wm-c1",
          name: "GLP-1+GIP / GH Secretagogue",
          duration: "12 weeks",
          protocolDescription: "This core weight management protocol pairs a moderate-dose Tirzepatide with Ipamorelin/Tesamorelin for balanced appetite suppression and growth hormone support. The lower Tirzepatide concentration allows for a gentler titration while still delivering meaningful metabolic improvement. The GH secretagogue component preserves lean body mass during the weight loss phase.",
          synergyRationale: "Moderate-dose Tirzepatide provides effective appetite control with a more gradual titration curve, while the GH secretagogue stack supports fat metabolism and muscle preservation throughout the protocol.",
          products: [
            {
              name: "Tirzepatide (GLP-1/GIP Agonist) 5mg per mL - SQ Injectable [5mL]",
              compound: "GLP-1+GIP",
              dosing: "INJECT 0.25ML (1.25MG) SUBCUTANEOUSLY ONCE WEEKLY. TITRATE UP BY 1.25MG EVERY 4 WEEKS AS TOLERATED TO A MAX OF 7.5MG WEEKLY.",
              doseSummary: "Dose: 1.25mg - 7.5mg weekly",
              form: "injectable",
            },
            {
              name: "N-Acetyl Ipamorelin (300mcg) + Tesamorelin (1500mcg) per mL - SQ Injectable [5mL]",
              compound: "GH Secretagogue",
              dosing: "INJECT 0.2ML (60MCG IPAMORELIN + 300MCG TESAMORELIN) SUBCUTANEOUSLY 60 MINUTES AWAY FROM FOOD PRIOR TO BED FIVE NIGHTS PER WEEK.",
              doseSummary: "Dose: 60mcg Ipamorelin + 300mcg Tesamorelin",
              form: "injectable",
            },
          ],
        },
        {
          id: "wm-c2",
          name: "GLP-1+GIP / Mitochondrial Uncoupler",
          duration: "12 weeks",
          protocolDescription: "This core-tier protocol combines moderate-dose Tirzepatide with an oral mitochondrial uncoupling agent for dual-mechanism fat loss. The reduced Tirzepatide concentration provides effective appetite suppression with fewer GI side effects during titration. The mitochondrial uncoupler independently boosts resting metabolic rate.",
          synergyRationale: "A moderate Tirzepatide dose manages appetite while the mitochondrial uncoupler increases basal caloric expenditure, achieving meaningful fat loss through complementary metabolic pathways.",
          products: [
            {
              name: "Tirzepatide (GLP-1/GIP Agonist) 5mg per mL - SQ Injectable [5mL]",
              compound: "GLP-1+GIP",
              dosing: "INJECT 0.25ML (1.25MG) SUBCUTANEOUSLY ONCE WEEKLY. TITRATE UP BY 1.25MG EVERY 4 WEEKS AS TOLERATED TO A MAX OF 7.5MG WEEKLY.",
              doseSummary: "Dose: 1.25mg - 7.5mg weekly",
              form: "injectable",
            },
            {
              name: "DNP Analog (Mitochondrial Uncoupler) 25mg - Oral Capsule [60ct]",
              compound: "Mitochondrial Uncoupler",
              dosing: "TAKE ONE CAPSULE (25MG) BY MOUTH ONCE DAILY WITH FOOD. DO NOT EXCEED ONE CAPSULE PER DAY.",
              doseSummary: "Dose: 25mg daily",
              form: "capsule",
            },
          ],
        },
        {
          id: "wm-c3",
          name: "GLP-1+GIP / Weight Loss / Thermogenesis",
          duration: "12 weeks",
          protocolDescription: "This core-tier protocol delivers moderate-dose Tirzepatide alongside AOD-9604 for targeted fat reduction. The lower Tirzepatide concentration enables comfortable titration while AOD-9604 selectively promotes lipolysis in adipose tissue. Patients benefit from dual-mechanism fat loss at a balanced dosing level.",
          synergyRationale: "Moderate Tirzepatide controls appetite and glucose metabolism while AOD-9604 directly targets adipose tissue lipolysis, delivering effective thermogenic support without excess dosing.",
          products: [
            {
              name: "Tirzepatide (GLP-1/GIP Agonist) 5mg per mL - SQ Injectable [5mL]",
              compound: "GLP-1+GIP",
              dosing: "INJECT 0.25ML (1.25MG) SUBCUTANEOUSLY ONCE WEEKLY. TITRATE UP BY 1.25MG EVERY 4 WEEKS AS TOLERATED TO A MAX OF 7.5MG WEEKLY.",
              doseSummary: "Dose: 1.25mg - 7.5mg weekly",
              form: "injectable",
            },
            {
              name: "AOD-9604 (Fat-Targeting GH Fragment) 2mg per mL - SQ Injectable [3mL]",
              compound: "AOD-9604",
              dosing: "INJECT 0.1ML (200MCG) SUBCUTANEOUSLY ONCE DAILY IN THE MORNING ON AN EMPTY STOMACH.",
              doseSummary: "Dose: 200mcg daily",
              form: "injectable",
            },
          ],
        },
        {
          id: "wm-c4",
          name: "Lyophilized GLP-1+GIP / GH Secretagogue",
          duration: "12 weeks",
          protocolDescription: "This core lyophilized protocol provides moderate-dose Tirzepatide and Ipamorelin in freeze-dried format for convenient storage and travel. The reconstitution process ensures accurate dosing while the lyophilized form maintains full peptide stability. Patients receive effective weight management support with the flexibility of shelf-stable formulations.",
          synergyRationale: "Moderate-dose Tirzepatide manages appetite and glycemic control while Ipamorelin supports natural GH pulsatility for fat metabolism — delivered in a stable lyophilized format.",
          products: [
            {
              name: "Tirzepatide (GLP-1/GIP) 5mg - Lyophilized Powder for Reconstitution [1 vial]",
              compound: "GLP-1+GIP",
              dosing: "RECONSTITUTE WITH 1ML BACTERIOSTATIC WATER. INJECT 0.25ML (1.25MG) SUBCUTANEOUSLY ONCE WEEKLY. TITRATE UP BY 1.25MG EVERY 4 WEEKS AS TOLERATED TO A MAX OF 7.5MG WEEKLY.",
              doseSummary: "Dose: 1.25mg - 7.5mg weekly",
              form: "lyophilized powder",
            },
            {
              name: "Ipamorelin (2.5mg) - Lyophilized Powder [1 vial]",
              compound: "Ipamorelin",
              dosing: "RECONSTITUTE WITH 2.5ML BACTERIOSTATIC WATER. INJECT 0.2ML (200MCG) SUBCUTANEOUSLY PRIOR TO BED FIVE NIGHTS PER WEEK.",
              doseSummary: "Dose: 200mcg nightly",
              form: "lyophilized powder",
            },
          ],
        },
        {
          id: "wm-c5",
          name: "Capsule Mitochondrial Uncoupler",
          duration: "12 weeks",
          protocolDescription: "This core oral protocol pairs moderate-dose Tirzepatide with Berberine HCl capsules for AMPK-driven metabolic enhancement. The reduced Berberine dose provides effective glucose metabolism support with excellent GI tolerability. This combination delivers meaningful metabolic improvement through both incretin and AMPK pathways.",
          synergyRationale: "Moderate Tirzepatide suppresses appetite via incretin receptors while Berberine activates AMPK to improve glucose uptake and fatty acid oxidation at a well-tolerated dose.",
          products: [
            {
              name: "Tirzepatide (GLP-1/GIP Agonist) 5mg per mL - SQ Injectable [5mL]",
              compound: "GLP-1+GIP",
              dosing: "INJECT 0.25ML (1.25MG) SUBCUTANEOUSLY ONCE WEEKLY. TITRATE UP BY 1.25MG EVERY 4 WEEKS AS TOLERATED TO A MAX OF 7.5MG WEEKLY.",
              doseSummary: "Dose: 1.25mg - 7.5mg weekly",
              form: "injectable",
            },
            {
              name: "Berberine HCl (500mg) - Oral Capsule [60ct]",
              compound: "Mitochondrial Uncoupler",
              dosing: "TAKE ONE CAPSULE TWICE DAILY WITH MEALS.",
              doseSummary: "Dose: 500mg Berberine, 2x daily",
              form: "capsule",
            },
          ],
        },
      ],
      essential: [
        {
          id: "wm-e1",
          name: "GLP-1+GIP / GH Secretagogue",
          duration: "12 weeks",
          protocolDescription: "This essential weight management protocol provides a foundational Tirzepatide dose paired with a single-agent Ipamorelin GH secretagogue. The lower concentration allows for the gentlest titration curve while still delivering clinically significant appetite suppression. Ipamorelin provides clean GH pulsatility with minimal cortisol or prolactin elevation.",
          synergyRationale: "Low-dose Tirzepatide initiates appetite control and metabolic improvement while Ipamorelin alone provides targeted GH support for fat metabolism without the complexity of a multi-peptide stack.",
          products: [
            {
              name: "Tirzepatide (GLP-1/GIP Agonist) 2.5mg per mL - SQ Injectable [3mL]",
              compound: "GLP-1+GIP",
              dosing: "INJECT 0.25ML (0.625MG) SUBCUTANEOUSLY ONCE WEEKLY. TITRATE UP BY 0.625MG EVERY 4 WEEKS AS TOLERATED TO A MAX OF 5MG WEEKLY.",
              doseSummary: "Dose: 0.625mg - 5mg weekly",
              form: "injectable",
            },
            {
              name: "N-Acetyl Ipamorelin (300mcg) per mL - SQ Injectable [5mL]",
              compound: "GH Secretagogue",
              dosing: "INJECT 0.2ML (60MCG) SUBCUTANEOUSLY 60 MINUTES AWAY FROM FOOD PRIOR TO BED FIVE NIGHTS PER WEEK.",
              doseSummary: "Dose: 60mcg Ipamorelin nightly",
              form: "injectable",
            },
          ],
        },
        {
          id: "wm-e2",
          name: "GLP-1+GIP / Mitochondrial Uncoupler",
          duration: "12 weeks",
          protocolDescription: "This essential protocol provides foundational Tirzepatide dosing with a low-dose oral mitochondrial uncoupler for gentle metabolic enhancement. The minimal Tirzepatide concentration eases initial titration while the uncoupler provides a modest boost to resting energy expenditure. Ideal for patients beginning their weight management journey.",
          synergyRationale: "Low-dose Tirzepatide provides initial appetite management while a conservative mitochondrial uncoupler dose gently elevates basal metabolic rate for early fat loss momentum.",
          products: [
            {
              name: "Tirzepatide (GLP-1/GIP Agonist) 2.5mg per mL - SQ Injectable [3mL]",
              compound: "GLP-1+GIP",
              dosing: "INJECT 0.25ML (0.625MG) SUBCUTANEOUSLY ONCE WEEKLY. TITRATE UP BY 0.625MG EVERY 4 WEEKS AS TOLERATED TO A MAX OF 5MG WEEKLY.",
              doseSummary: "Dose: 0.625mg - 5mg weekly",
              form: "injectable",
            },
            {
              name: "DNP Analog (Mitochondrial Uncoupler) 25mg - Oral Capsule [30ct]",
              compound: "Mitochondrial Uncoupler",
              dosing: "TAKE ONE CAPSULE (25MG) BY MOUTH ONCE DAILY WITH FOOD. DO NOT EXCEED ONE CAPSULE PER DAY.",
              doseSummary: "Dose: 25mg daily",
              form: "capsule",
            },
          ],
        },
        {
          id: "wm-e3",
          name: "GLP-1+GIP / Weight Loss / Thermogenesis",
          duration: "12 weeks",
          protocolDescription: "This essential protocol delivers foundational Tirzepatide with a lower-dose AOD-9604 for gentle targeted fat reduction. The conservative dosing provides a comfortable entry point for patients new to peptide therapy. AOD-9604 selectively supports lipolysis without impacting IGF-1 levels or glucose metabolism.",
          synergyRationale: "Low-dose Tirzepatide initiates appetite regulation while a conservative AOD-9604 dose gently targets adipose tissue, providing an accessible introduction to dual-mechanism fat loss.",
          products: [
            {
              name: "Tirzepatide (GLP-1/GIP Agonist) 2.5mg per mL - SQ Injectable [3mL]",
              compound: "GLP-1+GIP",
              dosing: "INJECT 0.25ML (0.625MG) SUBCUTANEOUSLY ONCE WEEKLY. TITRATE UP BY 0.625MG EVERY 4 WEEKS AS TOLERATED TO A MAX OF 5MG WEEKLY.",
              doseSummary: "Dose: 0.625mg - 5mg weekly",
              form: "injectable",
            },
            {
              name: "AOD-9604 (Fat-Targeting GH Fragment) 1mg per mL - SQ Injectable [3mL]",
              compound: "AOD-9604",
              dosing: "INJECT 0.1ML (100MCG) SUBCUTANEOUSLY ONCE DAILY IN THE MORNING ON AN EMPTY STOMACH.",
              doseSummary: "Dose: 100mcg daily",
              form: "injectable",
            },
          ],
        },
        {
          id: "wm-e4",
          name: "Lyophilized GLP-1+GIP / GH Secretagogue",
          duration: "12 weeks",
          protocolDescription: "This essential lyophilized protocol offers foundational Tirzepatide and Ipamorelin in freeze-dried vials for maximum shelf stability. The lower peptide content allows a gentle introduction to GLP-1/GIP therapy paired with basic GH secretagogue support. Reconstitution is simple and yields consistent dosing across the treatment course.",
          synergyRationale: "Foundational Tirzepatide manages initial appetite changes while low-dose Ipamorelin provides a clean GH pulse for basic metabolic support — all in a stable, travel-friendly lyophilized format.",
          products: [
            {
              name: "Tirzepatide (GLP-1/GIP) 5mg - Lyophilized Powder for Reconstitution [1 vial]",
              compound: "GLP-1+GIP",
              dosing: "RECONSTITUTE WITH 2ML BACTERIOSTATIC WATER. INJECT 0.25ML (0.625MG) SUBCUTANEOUSLY ONCE WEEKLY. TITRATE UP BY 0.625MG EVERY 4 WEEKS AS TOLERATED TO A MAX OF 5MG WEEKLY.",
              doseSummary: "Dose: 0.625mg - 5mg weekly",
              form: "lyophilized powder",
            },
            {
              name: "Ipamorelin (2mg) - Lyophilized Powder [1 vial]",
              compound: "Ipamorelin",
              dosing: "RECONSTITUTE WITH 2ML BACTERIOSTATIC WATER. INJECT 0.2ML (200MCG) SUBCUTANEOUSLY PRIOR TO BED FIVE NIGHTS PER WEEK.",
              doseSummary: "Dose: 200mcg nightly",
              form: "lyophilized powder",
            },
          ],
        },
        {
          id: "wm-e5",
          name: "Capsule Mitochondrial Uncoupler",
          duration: "12 weeks",
          protocolDescription: "This essential oral protocol pairs foundational Tirzepatide with a simple Berberine capsule for AMPK activation and glucose metabolism support. The streamlined formulation provides an accessible entry into metabolic optimization. Berberine has decades of clinical evidence supporting its effects on blood sugar and lipid profiles.",
          synergyRationale: "Low-dose Tirzepatide provides baseline appetite regulation while Berberine independently activates AMPK to support glucose disposal and fat oxidation at a gentle, well-tolerated dose.",
          products: [
            {
              name: "Tirzepatide (GLP-1/GIP Agonist) 2.5mg per mL - SQ Injectable [3mL]",
              compound: "GLP-1+GIP",
              dosing: "INJECT 0.25ML (0.625MG) SUBCUTANEOUSLY ONCE WEEKLY. TITRATE UP BY 0.625MG EVERY 4 WEEKS AS TOLERATED TO A MAX OF 5MG WEEKLY.",
              doseSummary: "Dose: 0.625mg - 5mg weekly",
              form: "injectable",
            },
            {
              name: "Berberine HCl (500mg) - Oral Capsule [30ct]",
              compound: "Mitochondrial Uncoupler",
              dosing: "TAKE ONE CAPSULE ONCE DAILY WITH A MEAL.",
              doseSummary: "Dose: 500mg Berberine, 1x daily",
              form: "capsule",
            },
          ],
        },
      ],
    },
  },

  /* ══════════════════════════════════════════════════════════════
     Injury & Repair
     ══════════════════════════════════════════════════════════════ */
  {
    id: "injury",
    name: "Injury & Repair",
    description: "Targeted tissue repair protocols combining healing peptides with growth factors for accelerated recovery from injury.",
    gendered: false,
    tiers: {
      premier: [
        {
          id: "ir-p1",
          name: "Tissue Repair / GH Secretagogue",
          duration: "8 weeks",
          protocolDescription: "This premier injury protocol combines BPC-157 and Thymosin Beta-4 for comprehensive tissue repair alongside an Ipamorelin/CJC-1295 GH secretagogue stack for amplified recovery. BPC-157 accelerates tendon, ligament, and gut healing while TB4 promotes cell migration and angiogenesis at injury sites. The GH secretagogue drives systemic growth factor release to support full-body recovery.",
          synergyRationale: "BPC-157/TB4 directly repair damaged tissue through local growth factor upregulation, while Ipamorelin/CJC-1295 amplifies systemic GH and IGF-1 levels to accelerate the entire recovery cascade from the pituitary level down.",
          products: [
            {
              name: "BPC-157 (5mg) + Thymosin Beta-4 (5mg) per mL - SQ Injectable [10mL]",
              compound: "BPC-157",
              dosing: "INJECT 0.2ML (1MG BPC-157 + 1MG TB4) SUBCUTANEOUSLY NEAR THE SITE OF INJURY ONCE DAILY. ROTATE INJECTION SITES.",
              doseSummary: "Dose: 1mg BPC-157 + 1mg TB4 daily",
              form: "injectable",
            },
            {
              name: "N-Acetyl Ipamorelin (500mcg) + CJC-1295 (2000mcg) per mL - SQ Injectable [10mL]",
              compound: "GH Secretagogue",
              dosing: "INJECT 0.2ML (100MCG IPAMORELIN + 400MCG CJC-1295) SUBCUTANEOUSLY 60 MINUTES AWAY FROM FOOD PRIOR TO BED FIVE NIGHTS PER WEEK.",
              doseSummary: "Dose: 100mcg Ipamorelin + 400mcg CJC-1295",
              form: "injectable",
            },
          ],
        },
        {
          id: "ir-p2",
          name: "Tissue Repair / Immuno-Modulating I",
          duration: "8 weeks",
          protocolDescription: "This protocol pairs the BPC-157/TB4 tissue repair stack with Thymosin Alpha-1, a powerful immune modulator that enhances the body's innate and adaptive immune responses. TA1 optimizes immune surveillance to ensure proper inflammatory resolution at injury sites while the repair peptides accelerate structural healing. The combination addresses both the repair and immune components of recovery.",
          synergyRationale: "BPC-157/TB4 drive local tissue regeneration and angiogenesis, while Thymosin Alpha-1 ensures the immune environment is optimized for healing rather than chronic inflammation — clearing the path for faster, cleaner recovery.",
          products: [
            {
              name: "BPC-157 (5mg) + Thymosin Beta-4 (5mg) per mL - SQ Injectable [10mL]",
              compound: "BPC-157",
              dosing: "INJECT 0.2ML (1MG BPC-157 + 1MG TB4) SUBCUTANEOUSLY NEAR THE SITE OF INJURY ONCE DAILY. ROTATE INJECTION SITES.",
              doseSummary: "Dose: 1mg BPC-157 + 1mg TB4 daily",
              form: "injectable",
            },
            {
              name: "Thymosin Alpha-1 (3mg) per mL - SQ Injectable [5mL]",
              compound: "Thymosin Alpha-1",
              dosing: "INJECT 0.3ML (0.9MG) SUBCUTANEOUSLY TWICE WEEKLY. SPACE INJECTIONS AT LEAST 3 DAYS APART.",
              doseSummary: "Dose: 0.9mg twice weekly",
              form: "injectable",
            },
          ],
        },
        {
          id: "ir-p3",
          name: "Tissue Repair / Immuno-Modulating II",
          duration: "8 weeks",
          protocolDescription: "This advanced repair protocol combines BPC-157/TB4 with ABP-7, an anti-inflammatory peptide that targets key inflammatory mediators to resolve chronic inflammation at injury sites. ABP-7 shifts macrophage polarization toward the M2 (repair) phenotype, creating an optimal healing microenvironment. The dual approach ensures both structural repair and inflammatory resolution proceed in concert.",
          synergyRationale: "BPC-157/TB4 build new tissue through growth factor and angiogenic signaling, while ABP-7 resolves the inflammatory microenvironment by suppressing TNF-alpha, IL-6, and promoting anti-inflammatory macrophage polarization.",
          products: [
            {
              name: "BPC-157 (5mg) + Thymosin Beta-4 (5mg) per mL - SQ Injectable [10mL]",
              compound: "BPC-157",
              dosing: "INJECT 0.2ML (1MG BPC-157 + 1MG TB4) SUBCUTANEOUSLY NEAR THE SITE OF INJURY ONCE DAILY. ROTATE INJECTION SITES.",
              doseSummary: "Dose: 1mg BPC-157 + 1mg TB4 daily",
              form: "injectable",
            },
            {
              name: "ABP-7 (500mcg) per mL - SQ Injectable [5mL]",
              compound: "ABP-7",
              dosing: "INJECT 0.2ML (100MCG) SUBCUTANEOUSLY ONCE DAILY. MAY INJECT NEAR INJURY SITE OR ABDOMEN.",
              doseSummary: "Dose: 100mcg daily",
              form: "injectable",
            },
          ],
        },
        {
          id: "ir-p4",
          name: "Lyophilized Tissue Repair",
          duration: "8 weeks",
          protocolDescription: "This lyophilized tissue repair protocol delivers BPC-157 and TB4 Fragment in freeze-dried vials for maximum stability and precise reconstitution. The format preserves full peptide bioactivity while allowing flexible storage and dosing customization. Patients receive the same clinically proven repair peptides in a convenient shelf-stable format.",
          synergyRationale: "BPC-157 and TB4 Fragment work through complementary repair mechanisms — BPC-157 upregulates growth factors and promotes angiogenesis while TB4 drives cell migration and reduces scarring — delivered in a stable lyophilized format for optimal potency.",
          products: [
            {
              name: "BPC-157 (5mg) - Lyophilized Powder [1 vial]",
              compound: "BPC-157",
              dosing: "RECONSTITUTE WITH 2.5ML BACTERIOSTATIC WATER. INJECT 0.25ML (500MCG) SUBCUTANEOUSLY NEAR THE SITE OF INJURY ONCE DAILY.",
              doseSummary: "Dose: 500mcg daily",
              form: "lyophilized powder",
            },
            {
              name: "TB4 Fragment (5mg) - Lyophilized Powder [1 vial]",
              compound: "TB4",
              dosing: "RECONSTITUTE WITH 2.5ML BACTERIOSTATIC WATER. INJECT 0.25ML (500MCG) SUBCUTANEOUSLY NEAR THE SITE OF INJURY ONCE DAILY.",
              doseSummary: "Dose: 500mcg daily",
              form: "lyophilized powder",
            },
          ],
        },
        {
          id: "ir-p5",
          name: "Capsule Tissue Repair Protocol",
          duration: "8 weeks",
          protocolDescription: "This oral tissue repair protocol provides BPC-157 and TB4 Fragment in convenient capsule form for patients who prefer non-injectable administration. Enteric-coated capsules protect the peptides from gastric degradation for improved oral bioavailability. The protocol supports systemic tissue repair, gut healing, and recovery from musculoskeletal injury.",
          synergyRationale: "Oral BPC-157 provides systemic cytoprotection and gut-mucosal healing, while oral TB4 Fragment supports cell migration and anti-inflammatory signaling throughout the body — offering repair support without injections.",
          products: [
            {
              name: "BPC-157 (500mcg) - Oral Capsule [60ct]",
              compound: "BPC-157",
              dosing: "TAKE ONE CAPSULE (500MCG) BY MOUTH TWICE DAILY ON AN EMPTY STOMACH, 30 MINUTES BEFORE MEALS.",
              doseSummary: "Dose: 500mcg twice daily",
              form: "capsule",
            },
            {
              name: "TB4 Fragment Oral (750mcg) - Oral Capsule [60ct]",
              compound: "TB4",
              dosing: "TAKE ONE CAPSULE (750MCG) BY MOUTH TWICE DAILY ON AN EMPTY STOMACH, 30 MINUTES BEFORE MEALS.",
              doseSummary: "Dose: 750mcg twice daily",
              form: "capsule",
            },
          ],
        },
      ],
      core: [
        {
          id: "ir-c1",
          name: "Tissue Repair / GH Secretagogue",
          duration: "8 weeks",
          protocolDescription: "This core injury protocol provides a moderate-dose BPC-157/TB4 combination with an Ipamorelin/CJC-1295 GH secretagogue at reduced concentration. The balanced dosing supports effective tissue repair and GH-mediated recovery while offering a more accessible entry point. Ideal for moderate injuries or maintenance recovery phases.",
          synergyRationale: "Moderate-dose BPC-157/TB4 provides meaningful tissue repair signaling while a reduced GH secretagogue dose supports systemic recovery through growth factor elevation at an accessible concentration.",
          products: [
            {
              name: "BPC-157 (3mg) + Thymosin Beta-4 (3mg) per mL - SQ Injectable [5mL]",
              compound: "BPC-157",
              dosing: "INJECT 0.2ML (600MCG BPC-157 + 600MCG TB4) SUBCUTANEOUSLY NEAR THE SITE OF INJURY ONCE DAILY. ROTATE INJECTION SITES.",
              doseSummary: "Dose: 600mcg BPC-157 + 600mcg TB4 daily",
              form: "injectable",
            },
            {
              name: "N-Acetyl Ipamorelin (300mcg) + CJC-1295 (1500mcg) per mL - SQ Injectable [5mL]",
              compound: "GH Secretagogue",
              dosing: "INJECT 0.2ML (60MCG IPAMORELIN + 300MCG CJC-1295) SUBCUTANEOUSLY 60 MINUTES AWAY FROM FOOD PRIOR TO BED FIVE NIGHTS PER WEEK.",
              doseSummary: "Dose: 60mcg Ipamorelin + 300mcg CJC-1295",
              form: "injectable",
            },
          ],
        },
        {
          id: "ir-c2",
          name: "Tissue Repair / Immuno-Modulating I",
          duration: "8 weeks",
          protocolDescription: "This core-tier protocol combines moderate-dose BPC-157/TB4 with Thymosin Alpha-1 for balanced tissue repair and immune optimization. The reduced concentrations still deliver meaningful healing support while the TA1 component helps regulate the immune response at injury sites. A solid mid-tier option for recovery with immune modulation.",
          synergyRationale: "Moderate BPC-157/TB4 dosing drives tissue repair while Thymosin Alpha-1 ensures the immune system supports rather than hinders recovery through balanced T-cell and NK cell modulation.",
          products: [
            {
              name: "BPC-157 (3mg) + Thymosin Beta-4 (3mg) per mL - SQ Injectable [5mL]",
              compound: "BPC-157",
              dosing: "INJECT 0.2ML (600MCG BPC-157 + 600MCG TB4) SUBCUTANEOUSLY NEAR THE SITE OF INJURY ONCE DAILY. ROTATE INJECTION SITES.",
              doseSummary: "Dose: 600mcg BPC-157 + 600mcg TB4 daily",
              form: "injectable",
            },
            {
              name: "Thymosin Alpha-1 (1.6mg) per mL - SQ Injectable [3mL]",
              compound: "Thymosin Alpha-1",
              dosing: "INJECT 0.3ML (0.48MG) SUBCUTANEOUSLY TWICE WEEKLY. SPACE INJECTIONS AT LEAST 3 DAYS APART.",
              doseSummary: "Dose: 0.48mg twice weekly",
              form: "injectable",
            },
          ],
        },
        {
          id: "ir-c3",
          name: "Tissue Repair / Immuno-Modulating II",
          duration: "8 weeks",
          protocolDescription: "This core-tier protocol pairs moderate-dose BPC-157/TB4 with ABP-7 at a reduced concentration for balanced tissue repair and inflammation resolution. The lower ABP-7 dose still provides meaningful anti-inflammatory signaling while the repair peptides support structural healing. Effective for moderate injuries requiring inflammatory management.",
          synergyRationale: "Moderate BPC-157/TB4 repairs tissue while a balanced ABP-7 dose resolves local inflammation, creating an environment where healing can proceed without excessive inflammatory burden.",
          products: [
            {
              name: "BPC-157 (3mg) + Thymosin Beta-4 (3mg) per mL - SQ Injectable [5mL]",
              compound: "BPC-157",
              dosing: "INJECT 0.2ML (600MCG BPC-157 + 600MCG TB4) SUBCUTANEOUSLY NEAR THE SITE OF INJURY ONCE DAILY. ROTATE INJECTION SITES.",
              doseSummary: "Dose: 600mcg BPC-157 + 600mcg TB4 daily",
              form: "injectable",
            },
            {
              name: "ABP-7 (300mcg) per mL - SQ Injectable [3mL]",
              compound: "ABP-7",
              dosing: "INJECT 0.2ML (60MCG) SUBCUTANEOUSLY ONCE DAILY. MAY INJECT NEAR INJURY SITE OR ABDOMEN.",
              doseSummary: "Dose: 60mcg daily",
              form: "injectable",
            },
          ],
        },
        {
          id: "ir-c4",
          name: "Lyophilized Tissue Repair",
          duration: "8 weeks",
          protocolDescription: "This core lyophilized protocol provides BPC-157 and TB4 Fragment in smaller freeze-dried vials for cost-effective tissue repair support. The reduced peptide content still delivers effective healing signaling through the same proven mechanisms. Ideal for patients who want lyophilized convenience at a moderate dose.",
          synergyRationale: "BPC-157 and TB4 Fragment complement each other through distinct repair pathways — growth factor upregulation and cell migration respectively — at a moderate lyophilized dose for balanced recovery support.",
          products: [
            {
              name: "BPC-157 (2.5mg) - Lyophilized Powder [1 vial]",
              compound: "BPC-157",
              dosing: "RECONSTITUTE WITH 2.5ML BACTERIOSTATIC WATER. INJECT 0.25ML (250MCG) SUBCUTANEOUSLY NEAR THE SITE OF INJURY ONCE DAILY.",
              doseSummary: "Dose: 250mcg daily",
              form: "lyophilized powder",
            },
            {
              name: "TB4 Fragment (2.5mg) - Lyophilized Powder [1 vial]",
              compound: "TB4",
              dosing: "RECONSTITUTE WITH 2.5ML BACTERIOSTATIC WATER. INJECT 0.25ML (250MCG) SUBCUTANEOUSLY NEAR THE SITE OF INJURY ONCE DAILY.",
              doseSummary: "Dose: 250mcg daily",
              form: "lyophilized powder",
            },
          ],
        },
        {
          id: "ir-c5",
          name: "Capsule Tissue Repair Protocol",
          duration: "8 weeks",
          protocolDescription: "This core oral protocol provides moderate-dose BPC-157 and TB4 Fragment capsules for non-injectable tissue repair. The reduced capsule counts provide effective healing support at a balanced cost point. Enteric coating protects peptide integrity through the stomach for improved absorption.",
          synergyRationale: "Oral BPC-157 and TB4 Fragment deliver complementary systemic repair signaling through the GI tract, supporting recovery from injury through convenient non-injectable administration.",
          products: [
            {
              name: "BPC-157 (500mcg) - Oral Capsule [30ct]",
              compound: "BPC-157",
              dosing: "TAKE ONE CAPSULE (500MCG) BY MOUTH ONCE DAILY ON AN EMPTY STOMACH, 30 MINUTES BEFORE A MEAL.",
              doseSummary: "Dose: 500mcg once daily",
              form: "capsule",
            },
            {
              name: "TB4 Fragment Oral (750mcg) - Oral Capsule [30ct]",
              compound: "TB4",
              dosing: "TAKE ONE CAPSULE (750MCG) BY MOUTH ONCE DAILY ON AN EMPTY STOMACH, 30 MINUTES BEFORE A MEAL.",
              doseSummary: "Dose: 750mcg once daily",
              form: "capsule",
            },
          ],
        },
      ],
      essential: [
        {
          id: "ir-e1",
          name: "Tissue Repair / GH Secretagogue",
          duration: "8 weeks",
          protocolDescription: "This essential injury protocol provides foundational BPC-157 with a single-agent Ipamorelin GH secretagogue for basic tissue repair and growth factor support. The simplified stack focuses on the most clinically proven repair peptide combined with clean GH pulsatility. A solid starting point for recovery support.",
          synergyRationale: "BPC-157 provides direct tissue repair signaling while Ipamorelin alone delivers clean GH pulsatility for systemic recovery support — a streamlined approach to the repair/GH secretagogue combination.",
          products: [
            {
              name: "BPC-157 (2mg) per mL - SQ Injectable [5mL]",
              compound: "BPC-157",
              dosing: "INJECT 0.2ML (400MCG) SUBCUTANEOUSLY NEAR THE SITE OF INJURY ONCE DAILY. ROTATE INJECTION SITES.",
              doseSummary: "Dose: 400mcg daily",
              form: "injectable",
            },
            {
              name: "N-Acetyl Ipamorelin (300mcg) per mL - SQ Injectable [5mL]",
              compound: "GH Secretagogue",
              dosing: "INJECT 0.2ML (60MCG) SUBCUTANEOUSLY 60 MINUTES AWAY FROM FOOD PRIOR TO BED FIVE NIGHTS PER WEEK.",
              doseSummary: "Dose: 60mcg Ipamorelin nightly",
              form: "injectable",
            },
          ],
        },
        {
          id: "ir-e2",
          name: "Tissue Repair / Immuno-Modulating I",
          duration: "8 weeks",
          protocolDescription: "This essential protocol pairs foundational BPC-157 with low-dose Thymosin Alpha-1 for basic tissue repair and immune support. The simplified formulation focuses on the most critical repair and immune components. Ideal for patients seeking gentle recovery support with immune optimization.",
          synergyRationale: "BPC-157 drives local repair through growth factor upregulation while low-dose Thymosin Alpha-1 provides foundational immune modulation to support the healing process.",
          products: [
            {
              name: "BPC-157 (2mg) per mL - SQ Injectable [5mL]",
              compound: "BPC-157",
              dosing: "INJECT 0.2ML (400MCG) SUBCUTANEOUSLY NEAR THE SITE OF INJURY ONCE DAILY. ROTATE INJECTION SITES.",
              doseSummary: "Dose: 400mcg daily",
              form: "injectable",
            },
            {
              name: "Thymosin Alpha-1 (1.6mg) per mL - SQ Injectable [3mL]",
              compound: "Thymosin Alpha-1",
              dosing: "INJECT 0.2ML (0.32MG) SUBCUTANEOUSLY TWICE WEEKLY. SPACE INJECTIONS AT LEAST 3 DAYS APART.",
              doseSummary: "Dose: 0.32mg twice weekly",
              form: "injectable",
            },
          ],
        },
        {
          id: "ir-e3",
          name: "Tissue Repair / Immuno-Modulating II",
          duration: "8 weeks",
          protocolDescription: "This essential protocol provides foundational BPC-157 with low-dose ABP-7 for basic tissue repair and anti-inflammatory support. The conservative dosing provides gentle inflammatory resolution alongside direct tissue repair signaling. A streamlined approach for patients with mild to moderate inflammation.",
          synergyRationale: "BPC-157 repairs tissue while low-dose ABP-7 gently resolves local inflammation — a simplified but effective combination for foundational injury recovery with anti-inflammatory support.",
          products: [
            {
              name: "BPC-157 (2mg) per mL - SQ Injectable [5mL]",
              compound: "BPC-157",
              dosing: "INJECT 0.2ML (400MCG) SUBCUTANEOUSLY NEAR THE SITE OF INJURY ONCE DAILY. ROTATE INJECTION SITES.",
              doseSummary: "Dose: 400mcg daily",
              form: "injectable",
            },
            {
              name: "ABP-7 (250mcg) per mL - SQ Injectable [3mL]",
              compound: "ABP-7",
              dosing: "INJECT 0.2ML (50MCG) SUBCUTANEOUSLY ONCE DAILY. MAY INJECT NEAR INJURY SITE OR ABDOMEN.",
              doseSummary: "Dose: 50mcg daily",
              form: "injectable",
            },
          ],
        },
        {
          id: "ir-e4",
          name: "Lyophilized Tissue Repair",
          duration: "8 weeks",
          protocolDescription: "This essential lyophilized protocol provides a single BPC-157 vial in freeze-dried format for foundational tissue repair. The streamlined single-peptide approach focuses on the most clinically validated repair compound. Reconstitution is straightforward and yields consistent dosing.",
          synergyRationale: "BPC-157 alone provides broad-spectrum tissue repair through VEGF upregulation, angiogenesis, and nitric oxide pathway modulation — the single most versatile repair peptide in a stable lyophilized format.",
          products: [
            {
              name: "BPC-157 (2mg) - Lyophilized Powder [1 vial]",
              compound: "BPC-157",
              dosing: "RECONSTITUTE WITH 2ML BACTERIOSTATIC WATER. INJECT 0.2ML (200MCG) SUBCUTANEOUSLY NEAR THE SITE OF INJURY ONCE DAILY.",
              doseSummary: "Dose: 200mcg daily",
              form: "lyophilized powder",
            },
          ],
        },
        {
          id: "ir-e5",
          name: "Capsule Tissue Repair Protocol",
          duration: "8 weeks",
          protocolDescription: "This essential oral protocol provides BPC-157 capsules for the most accessible form of tissue repair support. The single oral peptide offers systemic healing benefits with particular affinity for gut mucosal repair. Ideal for patients seeking simple, non-injectable recovery support.",
          synergyRationale: "Oral BPC-157 provides systemic cytoprotection and healing signaling through the GI tract, offering the foundational tissue repair peptide in the most convenient possible delivery format.",
          products: [
            {
              name: "BPC-157 (250mcg) - Oral Capsule [30ct]",
              compound: "BPC-157",
              dosing: "TAKE ONE CAPSULE (250MCG) BY MOUTH ONCE DAILY ON AN EMPTY STOMACH, 30 MINUTES BEFORE A MEAL.",
              doseSummary: "Dose: 250mcg once daily",
              form: "capsule",
            },
          ],
        },
      ],
    },
  },

  /* ══════════════════════════════════════════════════════════════
     Performance
     ══════════════════════════════════════════════════════════════ */
  {
    id: "performance",
    name: "Performance",
    description: "Elite protocols for athletic performance, lean mass, and accelerated recovery between training sessions.",
    gendered: false,
    tiers: {
      premier: [
        {
          id: "pf-p1",
          name: "GH Secretagogue / Mitochondrial",
          duration: "12 weeks",
          protocolDescription: "This premier performance protocol combines the Ipamorelin/Tesamorelin GH secretagogue stack with a CoQ10/PQQ/Shilajit mitochondrial support complex. The GH secretagogue drives pulsatile growth hormone release for lean mass and recovery while the mitochondrial complex optimizes cellular energy production. Together they support sustained athletic output and accelerated inter-session recovery.",
          synergyRationale: "Ipamorelin/Tesamorelin elevates GH for muscle repair and fat metabolism at the hormonal level, while CoQ10/PQQ/Shilajit enhances mitochondrial electron transport and biogenesis at the cellular level — optimizing performance from both directions.",
          products: [
            {
              name: "N-Acetyl Ipamorelin (500mcg) + Tesamorelin (2500mcg) per mL - SQ Injectable [10mL]",
              compound: "GH Secretagogue",
              dosing: "INJECT 0.2ML (100MCG IPAMORELIN + 500MCG TESAMORELIN) SUBCUTANEOUSLY 60 MINUTES AWAY FROM FOOD PRIOR TO BED FIVE NIGHTS PER WEEK.",
              doseSummary: "Dose: 100mcg Ipamorelin + 500mcg Tesamorelin",
              form: "injectable",
            },
            {
              name: "CoQ10 (200mg) + PQQ (20mg) + Shilajit (250mg) - Oral Capsule [60ct]",
              compound: "Mitochondrial Uncoupler",
              dosing: "TAKE ONE CAPSULE BY MOUTH TWICE DAILY WITH MEALS.",
              doseSummary: "Dose: 200mg CoQ10 + 20mg PQQ + 250mg Shilajit, 2x daily",
              form: "capsule",
            },
          ],
        },
        {
          id: "pf-p2",
          name: "GH Secretagogue High-Dose / IGF-1",
          duration: "12 weeks",
          protocolDescription: "This elite performance protocol combines high-dose Ipamorelin/CJC-1295 for sustained GH release with IGF-1 LR3, a long-acting insulin-like growth factor variant that directly drives muscle protein synthesis and satellite cell activation. The GH secretagogue amplifies endogenous GH pulsatility while IGF-1 LR3 provides direct anabolic signaling. This is the most potent combination for lean mass accrual and recovery.",
          synergyRationale: "Ipamorelin/CJC-1295 drives GH release from the pituitary for systemic anabolic signaling, while IGF-1 LR3 directly activates muscle satellite cells and PI3K/Akt pathways — providing both upstream hormonal drive and downstream tissue-level anabolism.",
          products: [
            {
              name: "Ipamorelin (500mcg) + CJC-1295 (2500mcg) per mL - SQ Injectable [10mL]",
              compound: "GH Secretagogue",
              dosing: "INJECT 0.2ML (100MCG IPAMORELIN + 500MCG CJC-1295) SUBCUTANEOUSLY 60 MINUTES AWAY FROM FOOD PRIOR TO BED FIVE NIGHTS PER WEEK.",
              doseSummary: "Dose: 100mcg Ipamorelin + 500mcg CJC-1295",
              form: "injectable",
            },
            {
              name: "IGF-1 LR3 (100mcg) per mL - SQ Injectable [5mL]",
              compound: "IGF-1 LR3",
              dosing: "INJECT 0.5ML (50MCG) SUBCUTANEOUSLY ONCE DAILY POST-WORKOUT, OR IN THE MORNING ON REST DAYS. CYCLE 4 WEEKS ON, 2 WEEKS OFF.",
              doseSummary: "Dose: 50mcg daily, 4 weeks on / 2 weeks off",
              form: "injectable",
            },
          ],
        },
        {
          id: "pf-p3",
          name: "GH / Vitamin / Neuropeptide",
          duration: "12 weeks",
          protocolDescription: "This comprehensive performance protocol combines Sermorelin for GH optimization with a Methylcobalamin/MIC injectable for B-vitamin support and energy metabolism, plus Selank nasal spray for anxiolytic focus and stress resilience. The multi-system approach supports physical recovery, neural drive, and mental clarity during intense training phases. Each component addresses a different performance bottleneck.",
          synergyRationale: "Sermorelin optimizes GH for recovery and body composition, Methylcobalamin/MIC supports methylation and energy metabolism, and Selank enhances focus and reduces performance anxiety — a three-pillar approach covering hormonal, metabolic, and neurological performance.",
          products: [
            {
              name: "Sermorelin (3mg) per mL - SQ Injectable [10mL]",
              compound: "Sermorelin",
              dosing: "INJECT 0.1ML (300MCG) SUBCUTANEOUSLY PRIOR TO BED FIVE NIGHTS PER WEEK. INJECT ON AN EMPTY STOMACH.",
              doseSummary: "Dose: 300mcg nightly",
              form: "injectable",
            },
            {
              name: "Methylcobalamin (5mg) + MIC (B12/Methionine/Inositol/Choline) - IM Injectable [10mL]",
              compound: "Methylcobalamin",
              dosing: "INJECT 1ML INTRAMUSCULARLY ONCE WEEKLY INTO THE DELTOID OR GLUTEAL MUSCLE.",
              doseSummary: "Dose: 5mg Methylcobalamin + MIC complex weekly",
              form: "injectable",
            },
            {
              name: "Selank (5mg) per mL - Nasal Spray [10mL]",
              compound: "Selank",
              dosing: "ADMINISTER ONE SPRAY INTO EACH NOSTRIL TWICE DAILY, MORNING AND AFTERNOON.",
              doseSummary: "Dose: 2 sprays twice daily",
              form: "nasal spray",
            },
          ],
        },
        {
          id: "pf-p4",
          name: "Lyophilized GH Secretagogue",
          duration: "12 weeks",
          protocolDescription: "This lyophilized performance protocol delivers CJC-1295 and Ipamorelin in separate freeze-dried vials for maximum potency and flexible dosing. The dual-vial format allows precise reconstitution and independent dose adjustment. Patients receive sustained GHRH analog signaling from CJC-1295 paired with clean GH pulsatility from Ipamorelin.",
          synergyRationale: "CJC-1295 provides sustained GHRH analog activity for prolonged GH elevation while Ipamorelin triggers acute GH pulses — together they create a robust, physiologically mimetic GH release pattern for performance and recovery.",
          products: [
            {
              name: "CJC-1295 (5mg) - Lyophilized Powder [1 vial]",
              compound: "CJC-1295",
              dosing: "RECONSTITUTE WITH 2.5ML BACTERIOSTATIC WATER. INJECT 0.25ML (500MCG) SUBCUTANEOUSLY PRIOR TO BED THREE NIGHTS PER WEEK.",
              doseSummary: "Dose: 500mcg three nights per week",
              form: "lyophilized powder",
            },
            {
              name: "Ipamorelin (5mg) - Lyophilized Powder [1 vial]",
              compound: "Ipamorelin",
              dosing: "RECONSTITUTE WITH 2.5ML BACTERIOSTATIC WATER. INJECT 0.2ML (200MCG) SUBCUTANEOUSLY PRIOR TO BED FIVE NIGHTS PER WEEK.",
              doseSummary: "Dose: 200mcg nightly",
              form: "lyophilized powder",
            },
          ],
        },
        {
          id: "pf-p5",
          name: "Capsule Performance Protocol",
          duration: "12 weeks",
          protocolDescription: "This oral performance protocol combines MK-677 (Ibutamoren), a potent oral GH secretagogue, with a Creatine Monohydrate and HMB capsule stack for lean mass support. MK-677 elevates GH and IGF-1 through oral ghrelin-receptor activation while Creatine and HMB directly support muscle protein synthesis and reduce catabolism. An entirely non-injectable performance solution.",
          synergyRationale: "MK-677 stimulates GH release orally through the ghrelin receptor for systemic anabolic signaling, while Creatine replenishes ATP for power output and HMB reduces muscle protein breakdown — covering hormonal drive, energy substrate, and anti-catabolic protection.",
          products: [
            {
              name: "MK-677 (Ibutamoren) 25mg - Oral Capsule [30ct]",
              compound: "MK-677",
              dosing: "TAKE ONE CAPSULE (25MG) BY MOUTH ONCE DAILY AT BEDTIME. TAKE WITH A SMALL AMOUNT OF FOOD TO REDUCE GI DISCOMFORT.",
              doseSummary: "Dose: 25mg daily at bedtime",
              form: "capsule",
            },
            {
              name: "Creatine Monohydrate (5000mg) + HMB (3000mg) - Oral Capsule [60ct]",
              compound: "Capsule",
              dosing: "TAKE TWO CAPSULES BY MOUTH TWICE DAILY WITH MEALS. ON TRAINING DAYS, TAKE ONE DOSE 30 MINUTES PRE-WORKOUT.",
              doseSummary: "Dose: 5g Creatine + 3g HMB, 2x daily",
              form: "capsule",
            },
          ],
        },
      ],
      core: [
        {
          id: "pf-c1",
          name: "GH Secretagogue / Mitochondrial",
          duration: "12 weeks",
          protocolDescription: "This core performance protocol provides moderate-dose Ipamorelin/Tesamorelin with a CoQ10/PQQ mitochondrial support capsule. The reduced GH secretagogue concentration still delivers meaningful GH pulsatility while the mitochondrial complex supports cellular energy output. A balanced approach to performance optimization.",
          synergyRationale: "Moderate Ipamorelin/Tesamorelin elevates GH for recovery and body composition, while CoQ10/PQQ supports mitochondrial energy production and efficiency at the cellular level.",
          products: [
            {
              name: "N-Acetyl Ipamorelin (300mcg) + Tesamorelin (1500mcg) per mL - SQ Injectable [5mL]",
              compound: "GH Secretagogue",
              dosing: "INJECT 0.2ML (60MCG IPAMORELIN + 300MCG TESAMORELIN) SUBCUTANEOUSLY 60 MINUTES AWAY FROM FOOD PRIOR TO BED FIVE NIGHTS PER WEEK.",
              doseSummary: "Dose: 60mcg Ipamorelin + 300mcg Tesamorelin",
              form: "injectable",
            },
            {
              name: "CoQ10 (100mg) + PQQ (10mg) - Oral Capsule [60ct]",
              compound: "Mitochondrial Uncoupler",
              dosing: "TAKE ONE CAPSULE BY MOUTH TWICE DAILY WITH MEALS.",
              doseSummary: "Dose: 100mg CoQ10 + 10mg PQQ, 2x daily",
              form: "capsule",
            },
          ],
        },
        {
          id: "pf-c2",
          name: "GH Secretagogue High-Dose / IGF-1",
          duration: "12 weeks",
          protocolDescription: "This core-tier performance protocol combines moderate-dose Ipamorelin/CJC-1295 with IGF-1 LR3 at a reduced concentration for effective anabolic support. The balanced dosing provides meaningful GH elevation and direct IGF-1 signaling without the intensity of the premier stack. Effective for athletes seeking recovery and lean mass support.",
          synergyRationale: "Moderate Ipamorelin/CJC-1295 provides reliable GH pulsatility while a reduced IGF-1 LR3 dose delivers targeted anabolic signaling to muscle tissue for balanced performance enhancement.",
          products: [
            {
              name: "Ipamorelin (300mcg) + CJC-1295 (1500mcg) per mL - SQ Injectable [5mL]",
              compound: "GH Secretagogue",
              dosing: "INJECT 0.2ML (60MCG IPAMORELIN + 300MCG CJC-1295) SUBCUTANEOUSLY 60 MINUTES AWAY FROM FOOD PRIOR TO BED FIVE NIGHTS PER WEEK.",
              doseSummary: "Dose: 60mcg Ipamorelin + 300mcg CJC-1295",
              form: "injectable",
            },
            {
              name: "IGF-1 LR3 (50mcg) per mL - SQ Injectable [3mL]",
              compound: "IGF-1 LR3",
              dosing: "INJECT 0.5ML (25MCG) SUBCUTANEOUSLY ONCE DAILY POST-WORKOUT, OR IN THE MORNING ON REST DAYS. CYCLE 4 WEEKS ON, 2 WEEKS OFF.",
              doseSummary: "Dose: 25mcg daily, 4 weeks on / 2 weeks off",
              form: "injectable",
            },
          ],
        },
        {
          id: "pf-c3",
          name: "GH / Vitamin / Neuropeptide",
          duration: "12 weeks",
          protocolDescription: "This core-tier protocol provides Sermorelin for GH optimization paired with Methylcobalamin/MIC B-vitamin support. The two-component stack addresses hormonal recovery and energy metabolism without the neuropeptide add-on. A streamlined approach to the GH/vitamin performance combination.",
          synergyRationale: "Sermorelin drives GH release for recovery and body composition while Methylcobalamin/MIC supports methylation, energy metabolism, and neural function — two pillars of performance support.",
          products: [
            {
              name: "Sermorelin (2mg) per mL - SQ Injectable [5mL]",
              compound: "Sermorelin",
              dosing: "INJECT 0.1ML (200MCG) SUBCUTANEOUSLY PRIOR TO BED FIVE NIGHTS PER WEEK. INJECT ON AN EMPTY STOMACH.",
              doseSummary: "Dose: 200mcg nightly",
              form: "injectable",
            },
            {
              name: "Methylcobalamin (5mg) + MIC (B12/Methionine/Inositol/Choline) - IM Injectable [5mL]",
              compound: "Methylcobalamin",
              dosing: "INJECT 1ML INTRAMUSCULARLY ONCE WEEKLY INTO THE DELTOID OR GLUTEAL MUSCLE.",
              doseSummary: "Dose: 5mg Methylcobalamin + MIC complex weekly",
              form: "injectable",
            },
          ],
        },
        {
          id: "pf-c4",
          name: "Lyophilized GH Secretagogue",
          duration: "12 weeks",
          protocolDescription: "This core lyophilized protocol provides CJC-1295 and Ipamorelin in smaller freeze-dried vials for moderate GH secretagogue support. The reduced peptide content still delivers effective GHRH analog and GH secretagogue activity. A cost-effective lyophilized option for consistent performance support.",
          synergyRationale: "CJC-1295 sustains GHRH analog signaling while Ipamorelin provides acute GH pulses — the lyophilized format ensures stability at a moderate dose for reliable performance gains.",
          products: [
            {
              name: "CJC-1295 (2.5mg) - Lyophilized Powder [1 vial]",
              compound: "CJC-1295",
              dosing: "RECONSTITUTE WITH 2.5ML BACTERIOSTATIC WATER. INJECT 0.25ML (250MCG) SUBCUTANEOUSLY PRIOR TO BED THREE NIGHTS PER WEEK.",
              doseSummary: "Dose: 250mcg three nights per week",
              form: "lyophilized powder",
            },
            {
              name: "Ipamorelin (2.5mg) - Lyophilized Powder [1 vial]",
              compound: "Ipamorelin",
              dosing: "RECONSTITUTE WITH 2.5ML BACTERIOSTATIC WATER. INJECT 0.2ML (200MCG) SUBCUTANEOUSLY PRIOR TO BED FIVE NIGHTS PER WEEK.",
              doseSummary: "Dose: 200mcg nightly",
              form: "lyophilized powder",
            },
          ],
        },
        {
          id: "pf-c5",
          name: "Capsule Performance Protocol",
          duration: "12 weeks",
          protocolDescription: "This core oral protocol provides MK-677 at a moderate dose with Creatine Monohydrate for fundamental performance support. The reduced MK-677 dose still provides meaningful GH elevation while Creatine directly supports ATP regeneration for power output. A straightforward non-injectable performance stack.",
          synergyRationale: "Moderate-dose MK-677 elevates GH through oral ghrelin-receptor activation while Creatine directly replenishes phosphocreatine for explosive performance — hormonal and substrate-level support in capsule form.",
          products: [
            {
              name: "MK-677 (Ibutamoren) 12.5mg - Oral Capsule [30ct]",
              compound: "MK-677",
              dosing: "TAKE ONE CAPSULE (12.5MG) BY MOUTH ONCE DAILY AT BEDTIME. TAKE WITH A SMALL AMOUNT OF FOOD.",
              doseSummary: "Dose: 12.5mg daily at bedtime",
              form: "capsule",
            },
            {
              name: "Creatine Monohydrate (5000mg) - Oral Capsule [60ct]",
              compound: "Capsule",
              dosing: "TAKE TWO CAPSULES BY MOUTH TWICE DAILY WITH MEALS. ON TRAINING DAYS, TAKE ONE DOSE 30 MINUTES PRE-WORKOUT.",
              doseSummary: "Dose: 5g Creatine, 2x daily",
              form: "capsule",
            },
          ],
        },
      ],
      essential: [
        {
          id: "pf-e1",
          name: "GH Secretagogue / Mitochondrial",
          duration: "12 weeks",
          protocolDescription: "This essential performance protocol provides a single-agent Ipamorelin GH secretagogue with a basic CoQ10 mitochondrial supplement. The simplified stack focuses on clean GH pulsatility and foundational mitochondrial support. An accessible entry point to performance peptide therapy.",
          synergyRationale: "Ipamorelin alone provides selective GH release for recovery and body composition, while CoQ10 supports electron transport chain efficiency for baseline mitochondrial performance.",
          products: [
            {
              name: "N-Acetyl Ipamorelin (300mcg) per mL - SQ Injectable [5mL]",
              compound: "GH Secretagogue",
              dosing: "INJECT 0.2ML (60MCG) SUBCUTANEOUSLY 60 MINUTES AWAY FROM FOOD PRIOR TO BED FIVE NIGHTS PER WEEK.",
              doseSummary: "Dose: 60mcg Ipamorelin nightly",
              form: "injectable",
            },
            {
              name: "CoQ10 (100mg) - Oral Capsule [30ct]",
              compound: "Mitochondrial Uncoupler",
              dosing: "TAKE ONE CAPSULE BY MOUTH ONCE DAILY WITH A MEAL.",
              doseSummary: "Dose: 100mg CoQ10 daily",
              form: "capsule",
            },
          ],
        },
        {
          id: "pf-e2",
          name: "GH Secretagogue / IGF-1",
          duration: "12 weeks",
          protocolDescription: "This essential protocol provides foundational Ipamorelin GH secretagogue support for basic growth hormone optimization. The single-agent approach focuses on clean, selective GH pulsatility with minimal side effects. Ideal for athletes beginning their peptide performance journey.",
          synergyRationale: "Ipamorelin delivers selective GH pulses without elevating cortisol or prolactin, providing the cleanest possible foundation for growth hormone-mediated performance and recovery enhancement.",
          products: [
            {
              name: "N-Acetyl Ipamorelin (300mcg) per mL - SQ Injectable [5mL]",
              compound: "GH Secretagogue",
              dosing: "INJECT 0.2ML (60MCG) SUBCUTANEOUSLY 60 MINUTES AWAY FROM FOOD PRIOR TO BED FIVE NIGHTS PER WEEK.",
              doseSummary: "Dose: 60mcg Ipamorelin nightly",
              form: "injectable",
            },
          ],
        },
        {
          id: "pf-e3",
          name: "GH / Vitamin / Neuropeptide",
          duration: "12 weeks",
          protocolDescription: "This essential protocol provides foundational Sermorelin for basic GH optimization at the lowest effective dose. The single-peptide approach offers a gentle introduction to GHRH analog therapy for performance and recovery. Sermorelin supports natural GH pulsatility without the complexity of a multi-compound stack.",
          synergyRationale: "Sermorelin alone provides GHRH analog activity to support natural GH release patterns for fundamental recovery and body composition optimization at an entry-level dose.",
          products: [
            {
              name: "Sermorelin (1mg) per mL - SQ Injectable [5mL]",
              compound: "Sermorelin",
              dosing: "INJECT 0.1ML (100MCG) SUBCUTANEOUSLY PRIOR TO BED FIVE NIGHTS PER WEEK. INJECT ON AN EMPTY STOMACH.",
              doseSummary: "Dose: 100mcg nightly",
              form: "injectable",
            },
          ],
        },
        {
          id: "pf-e4",
          name: "Lyophilized GH Secretagogue",
          duration: "12 weeks",
          protocolDescription: "This essential lyophilized protocol provides a single Ipamorelin vial in freeze-dried format for foundational GH secretagogue support. The simplified single-vial approach focuses on the cleanest GH secretagogue with minimal hormonal side effects. Reconstitution yields consistent dosing across the treatment course.",
          synergyRationale: "Ipamorelin alone provides selective GH pulsatility with the lowest side-effect profile of any GH secretagogue — delivered in a stable lyophilized format for maximum convenience and potency.",
          products: [
            {
              name: "Ipamorelin (2mg) - Lyophilized Powder [1 vial]",
              compound: "Ipamorelin",
              dosing: "RECONSTITUTE WITH 2ML BACTERIOSTATIC WATER. INJECT 0.2ML (200MCG) SUBCUTANEOUSLY PRIOR TO BED FIVE NIGHTS PER WEEK.",
              doseSummary: "Dose: 200mcg nightly",
              form: "lyophilized powder",
            },
          ],
        },
        {
          id: "pf-e5",
          name: "Capsule Performance Protocol",
          duration: "12 weeks",
          protocolDescription: "This essential oral protocol provides Creatine Monohydrate capsules for the most fundamental performance supplement support. Creatine is the most extensively studied performance compound, proven to increase power output, lean mass, and exercise capacity. A zero-risk entry point for performance supplementation.",
          synergyRationale: "Creatine Monohydrate directly replenishes phosphocreatine stores for ATP regeneration during high-intensity efforts — the most evidence-based single supplement for athletic performance.",
          products: [
            {
              name: "Creatine Monohydrate (5000mg) - Oral Capsule [30ct]",
              compound: "Capsule",
              dosing: "TAKE TWO CAPSULES BY MOUTH ONCE DAILY WITH A MEAL. ON TRAINING DAYS, TAKE 30 MINUTES PRE-WORKOUT.",
              doseSummary: "Dose: 5g Creatine daily",
              form: "capsule",
            },
          ],
        },
      ],
    },
  },

  /* ══════════════════════════════════════════════════════════════
     Immunity
     ══════════════════════════════════════════════════════════════ */
  {
    id: "immunity",
    name: "Immunity",
    description: "Immune-modulating protocols designed to strengthen resilience, support gut barrier integrity, and optimize immune surveillance.",
    gendered: false,
    tiers: {
      premier: [
        {
          id: "im-p1",
          name: "Thymosin Alpha-1 / Beta-4",
          duration: "8 weeks",
          protocolDescription: "This premier immune protocol combines Thymosin Alpha-1 and Thymosin Beta-4 for comprehensive immune modulation and tissue-level immune support. TA1 enhances dendritic cell maturation, T-cell differentiation, and NK cell activity while TB4 supports tissue repair at sites of immune-mediated damage. The dual thymic peptide approach addresses both surveillance and repair arms of the immune response.",
          synergyRationale: "Thymosin Alpha-1 strengthens immune surveillance through adaptive immune enhancement while Thymosin Beta-4 repairs tissue damage from inflammatory processes — together they restore and protect immune function from both the detection and recovery sides.",
          products: [
            {
              name: "Thymosin Alpha-1 (3mg) per mL - SQ Injectable [5mL]",
              compound: "Thymosin Alpha-1",
              dosing: "INJECT 0.3ML (0.9MG) SUBCUTANEOUSLY TWICE WEEKLY. SPACE INJECTIONS AT LEAST 3 DAYS APART.",
              doseSummary: "Dose: 0.9mg twice weekly",
              form: "injectable",
            },
            {
              name: "Thymosin Beta-4 (5mg) per mL - SQ Injectable [5mL]",
              compound: "Thymosin Beta-4",
              dosing: "INJECT 0.2ML (1MG) SUBCUTANEOUSLY ONCE DAILY FOR THE FIRST 2 WEEKS, THEN THREE TIMES PER WEEK THEREAFTER.",
              doseSummary: "Dose: 1mg daily (loading), then 3x weekly",
              form: "injectable",
            },
          ],
        },
        {
          id: "im-p2",
          name: "TA1 / Glutathione / Larazotide",
          duration: "8 weeks",
          protocolDescription: "This comprehensive immune protocol combines Thymosin Alpha-1 for immune surveillance with injectable Glutathione for master antioxidant and detoxification support, plus oral Larazotide for gut barrier restoration. The three-compound approach addresses immune function, oxidative stress, and intestinal permeability simultaneously. Particularly effective for patients with immune dysregulation linked to gut permeability issues.",
          synergyRationale: "TA1 boosts adaptive immune function, Glutathione neutralizes oxidative stress that impairs immune cells, and Larazotide seals the gut barrier to prevent antigen translocation — a three-pronged attack on the most common drivers of immune dysfunction.",
          products: [
            {
              name: "Thymosin Alpha-1 (1.6mg) per mL - SQ Injectable [5mL]",
              compound: "Thymosin Alpha-1",
              dosing: "INJECT 0.3ML (0.48MG) SUBCUTANEOUSLY TWICE WEEKLY. SPACE INJECTIONS AT LEAST 3 DAYS APART.",
              doseSummary: "Dose: 0.48mg twice weekly",
              form: "injectable",
            },
            {
              name: "Glutathione (200mg) per mL - SQ Injectable [10mL]",
              compound: "Glutathione",
              dosing: "INJECT 0.5ML (100MG) SUBCUTANEOUSLY THREE TIMES PER WEEK. MAY ALSO BE ADMINISTERED INTRAMUSCULARLY.",
              doseSummary: "Dose: 100mg three times weekly",
              form: "injectable",
            },
            {
              name: "Larazotide Acetate (1mg) - Oral Capsule [30ct]",
              compound: "Larazotide",
              dosing: "TAKE ONE CAPSULE (1MG) BY MOUTH THREE TIMES DAILY, 15 MINUTES BEFORE EACH MEAL.",
              doseSummary: "Dose: 1mg three times daily before meals",
              form: "capsule",
            },
          ],
        },
        {
          id: "im-p3",
          name: "Lyophilized Immune Protocol",
          duration: "8 weeks",
          protocolDescription: "This lyophilized immune protocol delivers Thymosin Alpha-1 and TB4 Fragment in freeze-dried vials for stable, potent immune support. The dual thymic peptide combination enhances both innate and adaptive immune responses while supporting tissue repair. The lyophilized format ensures maximum peptide integrity and flexible dosing.",
          synergyRationale: "Thymosin Alpha-1 drives T-cell maturation and NK cell activation while TB4 Fragment supports tissue repair and anti-inflammatory signaling — together they provide balanced immune enhancement and recovery in a stable lyophilized format.",
          products: [
            {
              name: "Thymosin Alpha-1 (3mg) - Lyophilized Powder [1 vial]",
              compound: "Thymosin Alpha-1",
              dosing: "RECONSTITUTE WITH 1ML BACTERIOSTATIC WATER. INJECT 0.3ML (0.9MG) SUBCUTANEOUSLY TWICE WEEKLY. SPACE INJECTIONS AT LEAST 3 DAYS APART.",
              doseSummary: "Dose: 0.9mg twice weekly",
              form: "lyophilized powder",
            },
            {
              name: "TB4 Fragment (5mg) - Lyophilized Powder [1 vial]",
              compound: "TB4",
              dosing: "RECONSTITUTE WITH 2.5ML BACTERIOSTATIC WATER. INJECT 0.25ML (500MCG) SUBCUTANEOUSLY ONCE DAILY FOR 2 WEEKS, THEN THREE TIMES PER WEEK.",
              doseSummary: "Dose: 500mcg daily (loading), then 3x weekly",
              form: "lyophilized powder",
            },
          ],
        },
        {
          id: "im-p4",
          name: "Capsule Immune Protocol",
          duration: "8 weeks",
          protocolDescription: "This oral immune protocol combines Thymosin Alpha-1 capsules with a Lactoferrin/Beta-Glucan immune-activating complex for comprehensive non-injectable immune support. TA1 capsules provide systemic immune modulation while Lactoferrin and Beta-Glucan activate innate immune pathways through gut-associated lymphoid tissue. A convenient all-oral approach to robust immune enhancement.",
          synergyRationale: "Oral Thymosin Alpha-1 modulates adaptive immunity through T-cell and dendritic cell activation, while Lactoferrin and Beta-Glucan stimulate innate immune defenses through TLR and dectin-1 receptor pathways — covering both arms of the immune system orally.",
          products: [
            {
              name: "Thymosin Alpha-1 (450mcg) - Oral Capsule [60ct]",
              compound: "Thymosin Alpha-1",
              dosing: "TAKE ONE CAPSULE (450MCG) BY MOUTH TWICE DAILY ON AN EMPTY STOMACH, 30 MINUTES BEFORE MEALS.",
              doseSummary: "Dose: 450mcg twice daily",
              form: "capsule",
            },
            {
              name: "Lactoferrin (250mg) + Beta-Glucan (500mg) - Oral Capsule [60ct]",
              compound: "Lactoferrin",
              dosing: "TAKE ONE CAPSULE BY MOUTH TWICE DAILY WITH MEALS.",
              doseSummary: "Dose: 250mg Lactoferrin + 500mg Beta-Glucan, 2x daily",
              form: "capsule",
            },
          ],
        },
      ],
      core: [
        {
          id: "im-c1",
          name: "Thymosin Alpha-1 / Beta-4",
          duration: "8 weeks",
          protocolDescription: "This core immune protocol provides moderate-dose Thymosin Alpha-1 and Thymosin Beta-4 for balanced immune modulation. The reduced concentrations still deliver meaningful immune enhancement through both thymic peptide pathways. An effective mid-tier option for immune system optimization.",
          synergyRationale: "Moderate TA1 enhances immune surveillance while moderate TB4 supports tissue repair at sites of immune activity — providing balanced dual-thymic support at an accessible dose.",
          products: [
            {
              name: "Thymosin Alpha-1 (1.6mg) per mL - SQ Injectable [3mL]",
              compound: "Thymosin Alpha-1",
              dosing: "INJECT 0.3ML (0.48MG) SUBCUTANEOUSLY TWICE WEEKLY. SPACE INJECTIONS AT LEAST 3 DAYS APART.",
              doseSummary: "Dose: 0.48mg twice weekly",
              form: "injectable",
            },
            {
              name: "Thymosin Beta-4 (3mg) per mL - SQ Injectable [3mL]",
              compound: "Thymosin Beta-4",
              dosing: "INJECT 0.2ML (600MCG) SUBCUTANEOUSLY THREE TIMES PER WEEK.",
              doseSummary: "Dose: 600mcg three times weekly",
              form: "injectable",
            },
          ],
        },
        {
          id: "im-c2",
          name: "TA1 / Glutathione / Larazotide",
          duration: "8 weeks",
          protocolDescription: "This core-tier protocol provides Thymosin Alpha-1 and Glutathione at moderate doses for balanced immune and antioxidant support. The two-component approach addresses immune function and oxidative stress without the gut barrier component. Effective for patients seeking immune optimization with detoxification support.",
          synergyRationale: "Moderate TA1 boosts immune cell function while Glutathione neutralizes oxidative damage that impairs immune performance — two key pillars of immune health in a streamlined combination.",
          products: [
            {
              name: "Thymosin Alpha-1 (1.6mg) per mL - SQ Injectable [3mL]",
              compound: "Thymosin Alpha-1",
              dosing: "INJECT 0.3ML (0.48MG) SUBCUTANEOUSLY TWICE WEEKLY. SPACE INJECTIONS AT LEAST 3 DAYS APART.",
              doseSummary: "Dose: 0.48mg twice weekly",
              form: "injectable",
            },
            {
              name: "Glutathione (200mg) per mL - SQ Injectable [5mL]",
              compound: "Glutathione",
              dosing: "INJECT 0.5ML (100MG) SUBCUTANEOUSLY TWICE PER WEEK.",
              doseSummary: "Dose: 100mg twice weekly",
              form: "injectable",
            },
          ],
        },
        {
          id: "im-c3",
          name: "Lyophilized Immune Protocol",
          duration: "8 weeks",
          protocolDescription: "This core lyophilized protocol provides Thymosin Alpha-1 in a smaller freeze-dried vial for moderate immune support. The single-vial approach focuses on the most clinically validated immune-modulating peptide in a stable format. Reconstitution is straightforward for consistent dosing.",
          synergyRationale: "Thymosin Alpha-1 alone provides comprehensive immune modulation through dendritic cell maturation, T-cell differentiation, and NK cell activation — the single most effective immune peptide in a stable lyophilized format.",
          products: [
            {
              name: "Thymosin Alpha-1 (1.5mg) - Lyophilized Powder [1 vial]",
              compound: "Thymosin Alpha-1",
              dosing: "RECONSTITUTE WITH 1ML BACTERIOSTATIC WATER. INJECT 0.3ML (0.45MG) SUBCUTANEOUSLY TWICE WEEKLY. SPACE INJECTIONS AT LEAST 3 DAYS APART.",
              doseSummary: "Dose: 0.45mg twice weekly",
              form: "lyophilized powder",
            },
          ],
        },
        {
          id: "im-c4",
          name: "Capsule Immune Protocol",
          duration: "8 weeks",
          protocolDescription: "This core oral protocol provides a moderate Lactoferrin/Beta-Glucan immune complex for convenient non-injectable immune support. The innate immune activators stimulate gut-associated lymphoid tissue for systemic immune enhancement. A simple oral approach to foundational immune health.",
          synergyRationale: "Lactoferrin provides antimicrobial and immune-modulating activity while Beta-Glucan activates innate immune cells through dectin-1 and TLR pathways — a complementary oral immune-activating combination.",
          products: [
            {
              name: "Lactoferrin (250mg) + Beta-Glucan (500mg) - Oral Capsule [30ct]",
              compound: "Lactoferrin",
              dosing: "TAKE ONE CAPSULE BY MOUTH ONCE DAILY WITH A MEAL.",
              doseSummary: "Dose: 250mg Lactoferrin + 500mg Beta-Glucan daily",
              form: "capsule",
            },
          ],
        },
      ],
      essential: [
        {
          id: "im-e1",
          name: "Thymosin Alpha-1 / Beta-4",
          duration: "8 weeks",
          protocolDescription: "This essential immune protocol provides low-dose Thymosin Alpha-1 for foundational immune modulation. The single-peptide approach focuses on the most critical immune-enhancing thymic peptide at the lowest effective dose. A gentle introduction to immune peptide therapy.",
          synergyRationale: "Low-dose Thymosin Alpha-1 provides foundational immune enhancement through T-cell and NK cell modulation — the most essential immune peptide at a conservative, well-tolerated dose.",
          products: [
            {
              name: "Thymosin Alpha-1 (1.6mg) per mL - SQ Injectable [3mL]",
              compound: "Thymosin Alpha-1",
              dosing: "INJECT 0.2ML (0.32MG) SUBCUTANEOUSLY TWICE WEEKLY. SPACE INJECTIONS AT LEAST 3 DAYS APART.",
              doseSummary: "Dose: 0.32mg twice weekly",
              form: "injectable",
            },
          ],
        },
        {
          id: "im-e2",
          name: "TA1 / Glutathione / Larazotide",
          duration: "8 weeks",
          protocolDescription: "This essential protocol provides foundational Glutathione support for antioxidant defense and detoxification. As the body's master antioxidant, Glutathione supports immune cell function by neutralizing reactive oxygen species that impair lymphocyte activity. A gentle entry into immune-supportive antioxidant therapy.",
          synergyRationale: "Glutathione alone provides broad antioxidant and detoxification support that underpins healthy immune function — neutralizing free radicals, regenerating vitamins C and E, and supporting hepatic phase II conjugation.",
          products: [
            {
              name: "Glutathione (200mg) per mL - SQ Injectable [5mL]",
              compound: "Glutathione",
              dosing: "INJECT 0.5ML (100MG) SUBCUTANEOUSLY TWICE PER WEEK.",
              doseSummary: "Dose: 100mg twice weekly",
              form: "injectable",
            },
          ],
        },
        {
          id: "im-e3",
          name: "Lyophilized Immune Protocol",
          duration: "8 weeks",
          protocolDescription: "This essential lyophilized protocol provides a single small Thymosin Alpha-1 vial for basic immune support in freeze-dried format. The conservative dose provides gentle immune modulation suitable for maintenance or initial therapy. Simple reconstitution yields consistent dosing.",
          synergyRationale: "Low-dose Thymosin Alpha-1 in lyophilized format provides the most essential immune peptide support with maximum shelf stability and minimal complexity.",
          products: [
            {
              name: "Thymosin Alpha-1 (1mg) - Lyophilized Powder [1 vial]",
              compound: "Thymosin Alpha-1",
              dosing: "RECONSTITUTE WITH 1ML BACTERIOSTATIC WATER. INJECT 0.3ML (0.3MG) SUBCUTANEOUSLY TWICE WEEKLY.",
              doseSummary: "Dose: 0.3mg twice weekly",
              form: "lyophilized powder",
            },
          ],
        },
        {
          id: "im-e4",
          name: "Capsule Immune Protocol",
          duration: "8 weeks",
          protocolDescription: "This essential oral protocol provides a basic Beta-Glucan capsule for foundational innate immune support. Beta-Glucan is one of the most well-studied natural immune activators, stimulating macrophages and NK cells through the gut-associated lymphoid tissue. The simplest possible immune support protocol.",
          synergyRationale: "Beta-Glucan activates innate immune defenses through dectin-1 and complement receptor 3 pathways — providing the most accessible and well-tolerated foundational immune support in oral form.",
          products: [
            {
              name: "Beta-Glucan (500mg) - Oral Capsule [30ct]",
              compound: "Beta-Glucan",
              dosing: "TAKE ONE CAPSULE (500MG) BY MOUTH ONCE DAILY ON AN EMPTY STOMACH.",
              doseSummary: "Dose: 500mg daily",
              form: "capsule",
            },
          ],
        },
      ],
    },
  },

  /* ══════════════════════════════════════════════════════════════
     Sexual Well-Being (gendered)
     ══════════════════════════════════════════════════════════════ */
  {
    id: "sexual",
    name: "Sexual Well-Being",
    description: "Targeted protocols for sexual health, libido, and intimate wellness - with formulations designed specifically for her and for him.",
    gendered: true,
    her: {
      premier: [
        {
          id: "sx-hp1",
          name: "SQ Injectable & Topical",
          duration: "4 weeks",
          protocolDescription: "This premier women's protocol combines Bremelanotide (PT-141) injectable for central nervous system arousal enhancement with Oxytocin topical cream for peripheral intimate wellness support. PT-141 activates melanocortin-4 receptors in the hypothalamus to stimulate desire through dopaminergic pathways, while Oxytocin enhances physical sensitivity and emotional connection. The dual-route approach addresses both neurological and physiological aspects of female sexual health.",
          synergyRationale: "PT-141 acts centrally on MC4R to stimulate desire and arousal at the brain level, while topical Oxytocin enhances peripheral sensitivity and promotes bonding — addressing sexual wellness from both the neurological and tissue levels.",
          products: [
            {
              name: "Bremelanotide (PT-141) 2mg per mL - SQ Injectable [5mL]",
              compound: "PT-141",
              dosing: "INJECT 0.5ML (1MG) SUBCUTANEOUSLY 45 MINUTES BEFORE ANTICIPATED SEXUAL ACTIVITY. DO NOT USE MORE THAN ONCE IN 24 HOURS OR MORE THAN 8 DOSES PER MONTH.",
              doseSummary: "Dose: 1mg as needed, max 8x/month",
              form: "injectable",
            },
            {
              name: "Oxytocin (40IU) per mL - Topical Cream [30mL]",
              compound: "Oxytocin",
              dosing: "APPLY 0.5ML TO INNER THIGHS OR LOWER ABDOMEN 30 MINUTES BEFORE ANTICIPATED SEXUAL ACTIVITY.",
              doseSummary: "Dose: 20IU topically as needed",
              form: "topical",
            },
          ],
        },
      ],
      core: [
        {
          id: "sx-hc1",
          name: "Nasal Spray & Topical",
          duration: "4 weeks",
          protocolDescription: "This core women's protocol provides Bremelanotide (PT-141) via nasal spray for convenient non-injectable arousal support, paired with a moderate Oxytocin topical cream. The nasal delivery enables rapid absorption through the nasal mucosa for efficient melanocortin receptor activation. Oxytocin cream enhances peripheral sensitivity for a complete intimate wellness approach.",
          synergyRationale: "Nasal PT-141 provides rapid central arousal enhancement through direct nasal-to-brain delivery, while topical Oxytocin supports peripheral intimate wellness — a needle-free dual-route approach to sexual health.",
          products: [
            {
              name: "Bremelanotide (PT-141) 1mg per spray - Nasal Spray [10mL]",
              compound: "PT-141",
              dosing: "ADMINISTER ONE SPRAY INTO ONE NOSTRIL 45 MINUTES BEFORE ANTICIPATED SEXUAL ACTIVITY. DO NOT USE MORE THAN ONCE IN 24 HOURS OR MORE THAN 8 DOSES PER MONTH.",
              doseSummary: "Dose: 1mg nasal as needed, max 8x/month",
              form: "nasal spray",
            },
            {
              name: "Oxytocin (24IU) per dose - Topical Cream [15mL]",
              compound: "Oxytocin",
              dosing: "APPLY 0.5ML TO INNER THIGHS OR LOWER ABDOMEN 30 MINUTES BEFORE ANTICIPATED SEXUAL ACTIVITY.",
              doseSummary: "Dose: 12IU topically as needed",
              form: "topical",
            },
          ],
        },
      ],
      essential: [
        {
          id: "sx-he1",
          name: "Nasal Spray",
          duration: "4 weeks",
          protocolDescription: "This essential women's protocol provides Bremelanotide (PT-141) nasal spray as a single-agent solution for central arousal enhancement. The nasal delivery offers rapid absorption and convenient non-injectable administration. PT-141 targets melanocortin-4 receptors in the hypothalamus to support desire and arousal through dopaminergic activation.",
          synergyRationale: "PT-141 nasal spray provides targeted melanocortin receptor activation for central arousal enhancement — the most direct, convenient single-agent approach to supporting female sexual desire.",
          products: [
            {
              name: "Bremelanotide (PT-141) 1mg per spray - Nasal Spray [5mL]",
              compound: "PT-141",
              dosing: "ADMINISTER ONE SPRAY INTO ONE NOSTRIL 45 MINUTES BEFORE ANTICIPATED SEXUAL ACTIVITY. DO NOT USE MORE THAN ONCE IN 24 HOURS OR MORE THAN 8 DOSES PER MONTH.",
              doseSummary: "Dose: 1mg nasal as needed, max 8x/month",
              form: "nasal spray",
            },
          ],
        },
        {
          id: "sx-he2",
          name: "Troche Protocol",
          duration: "4 weeks",
          protocolDescription: "This essential women's troche protocol provides Bremelanotide (PT-141) in sublingual troche form for the most convenient possible administration. The troche dissolves under the tongue for mucosal absorption, bypassing first-pass metabolism. A discreet, needle-free option for supporting sexual desire and arousal.",
          synergyRationale: "Sublingual PT-141 delivery provides melanocortin receptor activation through direct mucosal absorption — offering the simplest, most accessible route to central arousal enhancement without injections or nasal sprays.",
          products: [
            {
              name: "Bremelanotide (PT-141) 2mg - Sublingual Troche [8ct]",
              compound: "PT-141",
              dosing: "DISSOLVE ONE TROCHE UNDER THE TONGUE 45 MINUTES BEFORE ANTICIPATED SEXUAL ACTIVITY. DO NOT CHEW OR SWALLOW. DO NOT USE MORE THAN ONCE IN 24 HOURS.",
              doseSummary: "Dose: 2mg sublingual as needed",
              form: "troche",
            },
          ],
        },
      ],
    },
    him: {
      premier: [
        {
          id: "sx-mp1",
          name: "Injectable & SQ",
          duration: "4 weeks",
          protocolDescription: "This premier men's protocol combines Bremelanotide (PT-141) for central arousal enhancement with Kisspeptin-10, a GnRH activator that supports testosterone production and libido through the hypothalamic-pituitary-gonadal axis. PT-141 drives desire through melanocortin pathways while Kisspeptin stimulates endogenous testosterone and reproductive hormone signaling. The dual approach addresses both neurological desire and hormonal drive.",
          synergyRationale: "PT-141 activates central arousal pathways through MC4R/dopamine signaling, while Kisspeptin-10 stimulates the HPG axis to support endogenous testosterone and fertility — addressing sexual function from both the brain and the endocrine system.",
          products: [
            {
              name: "Bremelanotide (PT-141) 2mg per mL - SQ Injectable [5mL]",
              compound: "PT-141",
              dosing: "INJECT 0.5ML (1MG) SUBCUTANEOUSLY 45 MINUTES BEFORE ANTICIPATED SEXUAL ACTIVITY. DO NOT USE MORE THAN ONCE IN 24 HOURS OR MORE THAN 8 DOSES PER MONTH.",
              doseSummary: "Dose: 1mg as needed, max 8x/month",
              form: "injectable",
            },
            {
              name: "Kisspeptin-10 (1000mcg) per mL - SQ Injectable [5mL]",
              compound: "Kisspeptin",
              dosing: "INJECT 0.2ML (200MCG) SUBCUTANEOUSLY ONCE DAILY IN THE MORNING.",
              doseSummary: "Dose: 200mcg daily",
              form: "injectable",
            },
          ],
        },
      ],
      core: [
        {
          id: "sx-mc1",
          name: "Nasal Spray & Troche",
          duration: "4 weeks",
          protocolDescription: "This core men's protocol provides Bremelanotide (PT-141) nasal spray for rapid central arousal support paired with Kisspeptin-10 sublingual troches for convenient HPG axis stimulation. The entirely non-injectable approach offers PT-141 through nasal delivery for fast melanocortin activation and Kisspeptin through sublingual absorption for hormonal support. Ideal for men seeking effective sexual wellness support without injections.",
          synergyRationale: "Nasal PT-141 rapidly activates central arousal pathways while sublingual Kisspeptin-10 supports endogenous testosterone signaling through the HPG axis — a needle-free dual-mechanism approach to male sexual health.",
          products: [
            {
              name: "Bremelanotide (PT-141) 1mg per spray - Nasal Spray [10mL]",
              compound: "PT-141",
              dosing: "ADMINISTER ONE SPRAY INTO ONE NOSTRIL 45 MINUTES BEFORE ANTICIPATED SEXUAL ACTIVITY. DO NOT USE MORE THAN ONCE IN 24 HOURS OR MORE THAN 8 DOSES PER MONTH.",
              doseSummary: "Dose: 1mg nasal as needed, max 8x/month",
              form: "nasal spray",
            },
            {
              name: "Kisspeptin-10 (500mcg) - Sublingual Troche [8ct]",
              compound: "Kisspeptin",
              dosing: "DISSOLVE ONE TROCHE UNDER THE TONGUE ONCE DAILY IN THE MORNING. DO NOT CHEW OR SWALLOW.",
              doseSummary: "Dose: 500mcg sublingual daily",
              form: "troche",
            },
          ],
        },
      ],
      essential: [
        {
          id: "sx-me1",
          name: "Troche Protocol",
          duration: "4 weeks",
          protocolDescription: "This essential men's protocol provides Bremelanotide (PT-141) in sublingual troche form for the most accessible approach to central arousal enhancement. The troche dissolves under the tongue for direct mucosal absorption, activating melanocortin receptors to support desire and arousal. A discreet, convenient single-agent solution for men's sexual wellness.",
          synergyRationale: "Sublingual PT-141 provides direct melanocortin-4 receptor activation through mucosal absorption — the simplest and most accessible approach to central arousal enhancement for male sexual health.",
          products: [
            {
              name: "Bremelanotide (PT-141) 2mg - Sublingual Troche [8ct]",
              compound: "PT-141",
              dosing: "DISSOLVE ONE TROCHE UNDER THE TONGUE 45 MINUTES BEFORE ANTICIPATED SEXUAL ACTIVITY. DO NOT CHEW OR SWALLOW. DO NOT USE MORE THAN ONCE IN 24 HOURS.",
              doseSummary: "Dose: 2mg sublingual as needed",
              form: "troche",
            },
          ],
        },
      ],
    },
  },

  /* ══════════════════════════════════════════════════════════════
     Cognitive Enhancement
     ══════════════════════════════════════════════════════════════ */
  {
    id: "cognitive",
    name: "Cognitive Enhancement",
    description: "Neuropeptide protocols for focus, memory, and cognitive longevity - from foundational nootropic support to advanced neurotrophin stacks.",
    gendered: false,
    tiers: {
      premier: [
        {
          id: "ce-p1",
          name: "Rg3 / Methylcobalamin / Alpha-GPC / Dihexa",
          duration: "8 weeks",
          protocolDescription: "This premier cognitive protocol combines four synergistic compounds: Ginsenoside Rg3 nasal spray for neuroprotection and cerebral blood flow, Methylcobalamin/Alpha-GPC capsules for cholinergic and methylation support, and Dihexa nasal spray for potent neurotrophin-like synaptogenesis. Dihexa is extraordinarily potent at picomolar concentrations for promoting new synaptic connections. Together, this stack addresses memory, focus, neuroprotection, and cognitive longevity.",
          synergyRationale: "Rg3 enhances cerebral blood flow and BDNF expression, Methylcobalamin/Alpha-GPC fuels acetylcholine synthesis and methylation, and Dihexa drives synaptogenesis through HGF/c-Met potentiation — a comprehensive approach covering vascular, neurotransmitter, and structural aspects of cognition.",
          products: [
            {
              name: "Ginsenoside Rg3 (10mg) per mL - Nasal Spray [10mL]",
              compound: "Rg3",
              dosing: "ADMINISTER ONE SPRAY INTO EACH NOSTRIL TWICE DAILY, MORNING AND EARLY AFTERNOON.",
              doseSummary: "Dose: 2 sprays twice daily",
              form: "nasal spray",
            },
            {
              name: "Methylcobalamin (5000mcg) + Alpha-GPC (300mg) - Oral Capsule [60ct]",
              compound: "Methylcobalamin",
              dosing: "TAKE ONE CAPSULE BY MOUTH TWICE DAILY WITH MEALS. TAKE THE SECOND DOSE BEFORE 2PM TO AVOID SLEEP INTERFERENCE.",
              doseSummary: "Dose: 5000mcg B12 + 300mg Alpha-GPC, 2x daily",
              form: "capsule",
            },
            {
              name: "Dihexa (20mg) per mL - Nasal Spray [5mL]",
              compound: "Dihexa",
              dosing: "ADMINISTER ONE SPRAY INTO ONE NOSTRIL ONCE DAILY IN THE MORNING. CYCLE 5 DAYS ON, 2 DAYS OFF.",
              doseSummary: "Dose: 1 spray daily, 5 days on / 2 off",
              form: "nasal spray",
            },
          ],
        },
        {
          id: "ce-p2",
          name: "Semax / Dihexa",
          duration: "8 weeks",
          protocolDescription: "This premier neuropeptide protocol pairs Semax nasal spray for BDNF/NGF upregulation and dopaminergic focus enhancement with Dihexa nasal spray for potent synaptogenesis through HGF/c-Met potentiation. Semax enhances attention, working memory, and neural plasticity while Dihexa promotes new synaptic connections at extraordinarily low concentrations. The dual nasal delivery provides efficient brain-targeted administration.",
          synergyRationale: "Semax upregulates BDNF, NGF, and GDNF for broad neuroprotection and focus, while Dihexa drives synaptogenesis through HGF/c-Met — together they enhance both the maintenance of existing neural circuits and the formation of new synaptic connections.",
          products: [
            {
              name: "Semax (0.1%) - Nasal Spray [10mL]",
              compound: "Semax",
              dosing: "ADMINISTER ONE SPRAY INTO EACH NOSTRIL THREE TIMES DAILY: MORNING, MIDDAY, AND EARLY AFTERNOON. DO NOT USE AFTER 3PM.",
              doseSummary: "Dose: 2 sprays three times daily",
              form: "nasal spray",
            },
            {
              name: "Dihexa (20mg) per mL - Nasal Spray [5mL]",
              compound: "Dihexa",
              dosing: "ADMINISTER ONE SPRAY INTO ONE NOSTRIL ONCE DAILY IN THE MORNING. CYCLE 5 DAYS ON, 2 DAYS OFF.",
              doseSummary: "Dose: 1 spray daily, 5 days on / 2 off",
              form: "nasal spray",
            },
          ],
        },
        {
          id: "ce-p3",
          name: "Rg3 / NAD+ / Dihexa",
          duration: "8 weeks",
          protocolDescription: "This premier cognitive longevity protocol combines Ginsenoside Rg3 for cerebral blood flow and neuroprotection, injectable NAD+ for mitochondrial energy and sirtuin activation in neurons, and Dihexa nasal spray for synaptogenesis. NAD+ restores age-related mitochondrial decline in neural tissue while Rg3 and Dihexa promote synaptic plasticity and new connections. The combination targets both cognitive performance and long-term brain health.",
          synergyRationale: "Rg3 protects neurons and enhances cerebral perfusion, NAD+ restores mitochondrial energy production and DNA repair in aging neural tissue, and Dihexa drives new synaptic formation — a three-pronged approach to cognitive performance, cellular health, and structural neuroplasticity.",
          products: [
            {
              name: "Ginsenoside Rg3 (10mg) per mL - Nasal Spray [10mL]",
              compound: "Rg3",
              dosing: "ADMINISTER ONE SPRAY INTO EACH NOSTRIL TWICE DAILY, MORNING AND EARLY AFTERNOON.",
              doseSummary: "Dose: 2 sprays twice daily",
              form: "nasal spray",
            },
            {
              name: "NAD+ (100mg) per mL - SQ Injectable [10mL]",
              compound: "NAD+",
              dosing: "INJECT 0.5ML (50MG) SUBCUTANEOUSLY ONCE DAILY. START WITH 0.25ML (25MG) FOR THE FIRST WEEK TO ASSESS TOLERANCE.",
              doseSummary: "Dose: 50mg daily (start at 25mg)",
              form: "injectable",
            },
            {
              name: "Dihexa (20mg) per mL - Nasal Spray [5mL]",
              compound: "Dihexa",
              dosing: "ADMINISTER ONE SPRAY INTO ONE NOSTRIL ONCE DAILY IN THE MORNING. CYCLE 5 DAYS ON, 2 DAYS OFF.",
              doseSummary: "Dose: 1 spray daily, 5 days on / 2 off",
              form: "nasal spray",
            },
          ],
        },
      ],
      core: [
        {
          id: "ce-c1",
          name: "Rg3 / Methylcobalamin / Alpha-GPC",
          duration: "8 weeks",
          protocolDescription: "This core cognitive protocol combines Ginsenoside Rg3 nasal spray for neuroprotection and cerebral blood flow with Methylcobalamin/Alpha-GPC capsules for cholinergic and methylation support. The two-component approach addresses both vascular brain health and neurotransmitter synthesis. An effective mid-tier option for focus, memory, and cognitive maintenance.",
          synergyRationale: "Rg3 enhances cerebral blood flow and BDNF expression while Methylcobalamin/Alpha-GPC fuel acetylcholine synthesis and support methylation — addressing both the vascular and neurotransmitter pillars of cognitive function.",
          products: [
            {
              name: "Ginsenoside Rg3 (5mg) per mL - Nasal Spray [5mL]",
              compound: "Rg3",
              dosing: "ADMINISTER ONE SPRAY INTO EACH NOSTRIL ONCE DAILY IN THE MORNING.",
              doseSummary: "Dose: 2 sprays once daily",
              form: "nasal spray",
            },
            {
              name: "Methylcobalamin (5000mcg) + Alpha-GPC (300mg) - Oral Capsule [30ct]",
              compound: "Methylcobalamin",
              dosing: "TAKE ONE CAPSULE BY MOUTH ONCE DAILY WITH BREAKFAST.",
              doseSummary: "Dose: 5000mcg B12 + 300mg Alpha-GPC daily",
              form: "capsule",
            },
          ],
        },
        {
          id: "ce-c2",
          name: "Semax / Nootropic Support",
          duration: "8 weeks",
          protocolDescription: "This core neuropeptide protocol provides Semax nasal spray for BDNF upregulation and focused cognitive enhancement. The single-compound approach targets the most versatile cognitive neuropeptide for attention, working memory, and stress resilience. Semax modulates both serotonergic and dopaminergic neurotransmission for balanced cognitive support.",
          synergyRationale: "Semax alone provides broad nootropic support through simultaneous BDNF/NGF/GDNF upregulation, dopaminergic modulation, and cerebral microcirculation enhancement — the most versatile single neuropeptide for cognitive function.",
          products: [
            {
              name: "Semax (0.1%) - Nasal Spray [5mL]",
              compound: "Semax",
              dosing: "ADMINISTER ONE SPRAY INTO EACH NOSTRIL TWICE DAILY, MORNING AND EARLY AFTERNOON. DO NOT USE AFTER 3PM.",
              doseSummary: "Dose: 2 sprays twice daily",
              form: "nasal spray",
            },
          ],
        },
        {
          id: "ce-c3",
          name: "Rg3 / NAD+",
          duration: "8 weeks",
          protocolDescription: "This core cognitive protocol combines Ginsenoside Rg3 nasal spray for neuroprotection with moderate-dose injectable NAD+ for mitochondrial energy and sirtuin activation. The combination addresses cerebral blood flow and cellular energy production in neural tissue. Effective for patients seeking cognitive performance support with cellular longevity benefits.",
          synergyRationale: "Rg3 enhances cerebral perfusion and reduces neuroinflammation while NAD+ restores mitochondrial function and activates sirtuins in aging neurons — two complementary mechanisms for brain health and cognitive performance.",
          products: [
            {
              name: "Ginsenoside Rg3 (5mg) per mL - Nasal Spray [5mL]",
              compound: "Rg3",
              dosing: "ADMINISTER ONE SPRAY INTO EACH NOSTRIL ONCE DAILY IN THE MORNING.",
              doseSummary: "Dose: 2 sprays once daily",
              form: "nasal spray",
            },
            {
              name: "NAD+ (50mg) per mL - SQ Injectable [5mL]",
              compound: "NAD+",
              dosing: "INJECT 0.5ML (25MG) SUBCUTANEOUSLY THREE TIMES PER WEEK.",
              doseSummary: "Dose: 25mg three times weekly",
              form: "injectable",
            },
          ],
        },
      ],
      essential: [
        {
          id: "ce-e1",
          name: "Rg3 / Methylcobalamin",
          duration: "8 weeks",
          protocolDescription: "This essential cognitive protocol provides Ginsenoside Rg3 nasal spray at a foundational dose for basic neuroprotection and cerebral blood flow support. The single-compound approach focuses on the most accessible neuroprotective ginsenoside. Rg3 modulates NMDA receptors and promotes BDNF expression for gentle cognitive support.",
          synergyRationale: "Rg3 provides foundational neuroprotection through BDNF promotion, NF-kB suppression, and enhanced cerebral blood flow — the most essential single compound for baseline brain health and cognitive maintenance.",
          products: [
            {
              name: "Ginsenoside Rg3 (5mg) per mL - Nasal Spray [5mL]",
              compound: "Rg3",
              dosing: "ADMINISTER ONE SPRAY INTO ONE NOSTRIL ONCE DAILY IN THE MORNING.",
              doseSummary: "Dose: 1 spray once daily",
              form: "nasal spray",
            },
          ],
        },
        {
          id: "ce-e2",
          name: "Semax Nasal",
          duration: "8 weeks",
          protocolDescription: "This essential protocol provides Semax nasal spray at a conservative dose for foundational nootropic support. Semax enhances BDNF and NGF expression while modulating dopaminergic neurotransmission for improved focus and memory. A gentle introduction to neuropeptide cognitive enhancement.",
          synergyRationale: "Low-dose Semax provides broad nootropic support through neurotrophic factor upregulation and dopaminergic modulation — the most accessible entry point to neuropeptide-based cognitive enhancement.",
          products: [
            {
              name: "Semax (0.1%) - Nasal Spray [3mL]",
              compound: "Semax",
              dosing: "ADMINISTER ONE SPRAY INTO ONE NOSTRIL ONCE DAILY IN THE MORNING.",
              doseSummary: "Dose: 1 spray once daily",
              form: "nasal spray",
            },
          ],
        },
        {
          id: "ce-e3",
          name: "Rg3 / NAD+",
          duration: "8 weeks",
          protocolDescription: "This essential protocol provides foundational NAD+ support for basic mitochondrial energy and sirtuin activation in neural tissue. NAD+ is a critical coenzyme that declines with age, and restoring levels supports cognitive function, DNA repair, and cellular energy. A gentle introduction to NAD+ therapy for brain health.",
          synergyRationale: "NAD+ alone restores the fundamental cellular energy currency needed for optimal neural function — supporting mitochondrial electron transport, sirtuin-mediated neuroprotection, and PARP-dependent DNA repair in aging brain tissue.",
          products: [
            {
              name: "NAD+ (50mg) per mL - SQ Injectable [3mL]",
              compound: "NAD+",
              dosing: "INJECT 0.5ML (25MG) SUBCUTANEOUSLY TWICE PER WEEK.",
              doseSummary: "Dose: 25mg twice weekly",
              form: "injectable",
            },
          ],
        },
      ],
    },
  },

  /* ══════════════════════════════════════════════════════════════
     Hair Restore (gendered)
     ══════════════════════════════════════════════════════════════ */
  {
    id: "hair",
    name: "Hair Restore",
    description: "Clinically informed hair restoration protocols combining growth factors, DHT blockers, and follicle-stimulating peptides.",
    gendered: true,
    her: {
      premier: [
        {
          id: "hr-hp1",
          name: "GHK-Cu + Zinc Thymulin / Bimatoprost",
          duration: "12 weeks",
          protocolDescription: "This premier women's hair restoration protocol combines GHK-Cu with Zinc Thymulin in a topical solution for follicular growth factor stimulation and immune modulation, paired with Bimatoprost for prostaglandin-mediated anagen phase extension. GHK-Cu activates hair follicle stem cells and promotes collagen synthesis while Zinc Thymulin supports follicular immune health. Bimatoprost independently extends the active growth phase for thicker, denser hair.",
          synergyRationale: "GHK-Cu/Zinc Thymulin stimulates follicular stem cells and modulates local immune responses, while Bimatoprost extends the anagen growth phase through prostamide receptor activation — combining growth stimulation with cycle extension for maximum hair density.",
          products: [
            {
              name: "GHK-Cu (1%) + Zinc Thymulin (0.01%) - Topical Solution [60mL]",
              compound: "GHK-Cu",
              dosing: "APPLY 1ML TO AFFECTED SCALP AREAS ONCE DAILY AT BEDTIME. MASSAGE GENTLY INTO SCALP FOR 60 SECONDS. DO NOT WASH HAIR FOR AT LEAST 4 HOURS AFTER APPLICATION.",
              doseSummary: "Dose: 1mL topically nightly",
              form: "topical",
            },
            {
              name: "Bimatoprost (0.03%) - Topical Solution [5mL]",
              compound: "Bimatoprost",
              dosing: "APPLY A THIN LINE ALONG THE HAIRLINE AND THINNING AREAS USING THE APPLICATOR ONCE DAILY AT BEDTIME.",
              doseSummary: "Dose: Thin application nightly",
              form: "topical",
            },
          ],
        },
      ],
      core: [
        {
          id: "hr-hc1",
          name: "GHK-Cu / Bimatoprost",
          duration: "12 weeks",
          protocolDescription: "This core women's protocol provides GHK-Cu topical solution for follicular growth factor stimulation paired with Bimatoprost for anagen phase extension. The simplified formulation omits the Zinc Thymulin component while retaining the most clinically impactful compounds. Effective for women seeking targeted hair restoration support.",
          synergyRationale: "GHK-Cu stimulates follicular stem cells and collagen synthesis while Bimatoprost extends the active growth phase — the two most essential mechanisms for female hair restoration in a streamlined combination.",
          products: [
            {
              name: "GHK-Cu (0.5%) - Topical Solution [30mL]",
              compound: "GHK-Cu",
              dosing: "APPLY 1ML TO AFFECTED SCALP AREAS ONCE DAILY AT BEDTIME. MASSAGE GENTLY INTO SCALP FOR 60 SECONDS.",
              doseSummary: "Dose: 1mL topically nightly",
              form: "topical",
            },
            {
              name: "Bimatoprost (0.03%) - Topical Solution [3mL]",
              compound: "Bimatoprost",
              dosing: "APPLY A THIN LINE ALONG THE HAIRLINE AND THINNING AREAS USING THE APPLICATOR ONCE DAILY AT BEDTIME.",
              doseSummary: "Dose: Thin application nightly",
              form: "topical",
            },
          ],
        },
      ],
      essential: [
        {
          id: "hr-he1",
          name: "GHK-Cu Topical Combo",
          duration: "12 weeks",
          protocolDescription: "This essential women's protocol provides GHK-Cu topical solution as a single-agent approach to hair follicle stimulation. GHK-Cu activates follicular stem cells, promotes angiogenesis to the hair bulb, and stimulates collagen synthesis for improved scalp health. A gentle, foundational approach to supporting hair growth and quality.",
          synergyRationale: "GHK-Cu alone provides multi-faceted follicular support through stem cell activation, angiogenesis, and collagen synthesis — the most essential single compound for female hair restoration.",
          products: [
            {
              name: "GHK-Cu (0.5%) - Topical Solution [30mL]",
              compound: "GHK-Cu",
              dosing: "APPLY 1ML TO AFFECTED SCALP AREAS ONCE DAILY AT BEDTIME. MASSAGE GENTLY INTO SCALP FOR 60 SECONDS.",
              doseSummary: "Dose: 1mL topically nightly",
              form: "topical",
            },
          ],
        },
      ],
    },
    him: {
      premier: [
        {
          id: "hr-mp1",
          name: "Dutasteride / Minoxidil / Bimatoprost",
          duration: "12 weeks",
          protocolDescription: "This premier men's hair restoration protocol combines topical Dutasteride/Minoxidil for dual DHT blockade and vasodilation with Bimatoprost for prostaglandin-mediated anagen phase extension. Dutasteride blocks both type I and II 5-alpha-reductase enzymes to reduce scalp DHT by over 90%, while Minoxidil opens potassium channels for increased follicular blood flow. Bimatoprost independently extends the active growth phase for thicker, denser hair.",
          synergyRationale: "Dutasteride blocks DHT-driven miniaturization, Minoxidil increases follicular blood supply and VEGF expression, and Bimatoprost extends the anagen growth phase — a three-mechanism approach covering hormonal protection, vascular support, and growth cycle optimization.",
          products: [
            {
              name: "Dutasteride (0.5%) + Minoxidil (5%) - Topical Solution [60mL]",
              compound: "Dutasteride",
              dosing: "APPLY 1ML TO AFFECTED SCALP AREAS ONCE DAILY AT BEDTIME. MASSAGE GENTLY INTO SCALP. DO NOT WASH HAIR FOR AT LEAST 4 HOURS AFTER APPLICATION.",
              doseSummary: "Dose: 1mL topically nightly",
              form: "topical",
            },
            {
              name: "Bimatoprost (0.03%) - Topical Solution [5mL]",
              compound: "Bimatoprost",
              dosing: "APPLY A THIN LINE ALONG THE HAIRLINE AND THINNING AREAS USING THE APPLICATOR ONCE DAILY AT BEDTIME.",
              doseSummary: "Dose: Thin application nightly",
              form: "topical",
            },
          ],
        },
      ],
      core: [
        {
          id: "hr-mc1",
          name: "Bimatoprost / Finasteride",
          duration: "12 weeks",
          protocolDescription: "This core men's protocol combines Bimatoprost topical for anagen phase extension with topical Finasteride for targeted DHT reduction at the scalp level. Finasteride selectively inhibits type II 5-alpha-reductase to lower scalp DHT while Bimatoprost extends the growth cycle. A focused two-compound approach for effective hair restoration.",
          synergyRationale: "Finasteride reduces DHT-driven follicular miniaturization while Bimatoprost extends the active growth phase through prostamide receptor activation — two complementary mechanisms for preserving and enhancing hair density.",
          products: [
            {
              name: "Finasteride (0.25%) - Topical Solution [30mL]",
              compound: "Finasteride",
              dosing: "APPLY 1ML TO AFFECTED SCALP AREAS ONCE DAILY AT BEDTIME. MASSAGE GENTLY INTO SCALP.",
              doseSummary: "Dose: 1mL topically nightly",
              form: "topical",
            },
            {
              name: "Bimatoprost (0.03%) - Topical Solution [3mL]",
              compound: "Bimatoprost",
              dosing: "APPLY A THIN LINE ALONG THE HAIRLINE AND THINNING AREAS USING THE APPLICATOR ONCE DAILY AT BEDTIME.",
              doseSummary: "Dose: Thin application nightly",
              form: "topical",
            },
          ],
        },
      ],
      essential: [
        {
          id: "hr-me1",
          name: "Finasteride Topical",
          duration: "12 weeks",
          protocolDescription: "This essential men's protocol provides topical Finasteride as a single-agent approach to DHT-driven hair loss. Topical application targets the scalp directly while minimizing systemic exposure compared to oral formulations. Finasteride reduces follicular miniaturization and slows progression of androgenetic alopecia.",
          synergyRationale: "Topical Finasteride provides targeted type II 5-alpha-reductase inhibition at the scalp level — the most essential single mechanism for slowing male pattern hair loss with minimal systemic effects.",
          products: [
            {
              name: "Finasteride (0.25%) - Topical Solution [30mL]",
              compound: "Finasteride",
              dosing: "APPLY 1ML TO AFFECTED SCALP AREAS ONCE DAILY AT BEDTIME. MASSAGE GENTLY INTO SCALP.",
              doseSummary: "Dose: 1mL topically nightly",
              form: "topical",
            },
          ],
        },
        {
          id: "hr-me2",
          name: "Minoxidil Combo",
          duration: "12 weeks",
          protocolDescription: "This essential men's protocol provides topical Minoxidil for vasodilatory hair growth stimulation. Minoxidil opens potassium channels in vascular smooth muscle to increase dermal papilla blood flow and VEGF expression. The most widely used and extensively studied topical hair growth treatment available.",
          synergyRationale: "Minoxidil provides vasodilation and VEGF upregulation at the follicular level — the most established and accessible single compound for stimulating hair growth through enhanced blood supply.",
          products: [
            {
              name: "Minoxidil (5%) - Topical Solution [60mL]",
              compound: "Minoxidil",
              dosing: "APPLY 1ML TO AFFECTED SCALP AREAS TWICE DAILY, MORNING AND BEDTIME. MASSAGE GENTLY INTO SCALP.",
              doseSummary: "Dose: 1mL topically twice daily",
              form: "topical",
            },
          ],
        },
      ],
    },
  },

  /* ══════════════════════════════════════════════════════════════
     Derm & Aesthetics
     ══════════════════════════════════════════════════════════════ */
  {
    id: "derm",
    name: "Derm & Aesthetics",
    description: "Skin rejuvenation and anti-aging protocols combining collagen-stimulating peptides, growth factors, and targeted topicals.",
    gendered: false,
    tiers: {
      premier: [
        {
          id: "da-p1",
          name: "GAL Cream / NAD+ / GH Secretagogue",
          duration: "12 weeks",
          protocolDescription: "This premier aesthetics protocol combines GAL Cream (Glycolic Acid/Retinol/Niacinamide) for topical skin renewal with injectable NAD+ for cellular energy and sirtuin-mediated anti-aging, plus Sermorelin for GH-driven collagen synthesis. GAL Cream accelerates epidermal turnover and collagen deposition while NAD+ restores mitochondrial function in skin cells. Sermorelin amplifies endogenous GH for systemic skin quality improvement.",
          synergyRationale: "GAL Cream renews skin topically through exfoliation and retinoid signaling, NAD+ restores cellular energy and activates longevity pathways in dermal cells, and Sermorelin drives GH-mediated collagen synthesis — addressing skin health from the surface, cellular, and systemic levels.",
          products: [
            {
              name: "GAL (Glycolic Acid/Retinol/Niacinamide) - Topical Cream [50g]",
              compound: "GAL Cream",
              dosing: "APPLY A PEA-SIZED AMOUNT TO CLEAN, DRY FACE AND NECK ONCE DAILY AT BEDTIME. AVOID EYE AREA. USE SUNSCREEN DAILY DURING TREATMENT.",
              doseSummary: "Dose: Pea-sized amount nightly",
              form: "topical",
            },
            {
              name: "NAD+ (100mg) per mL - SQ Injectable [10mL]",
              compound: "NAD+",
              dosing: "INJECT 0.5ML (50MG) SUBCUTANEOUSLY THREE TIMES PER WEEK.",
              doseSummary: "Dose: 50mg three times weekly",
              form: "injectable",
            },
            {
              name: "Sermorelin (2mg) per mL - SQ Injectable [5mL]",
              compound: "Sermorelin",
              dosing: "INJECT 0.1ML (200MCG) SUBCUTANEOUSLY PRIOR TO BED FIVE NIGHTS PER WEEK. INJECT ON AN EMPTY STOMACH.",
              doseSummary: "Dose: 200mcg nightly",
              form: "injectable",
            },
          ],
        },
        {
          id: "da-p2",
          name: "GHK-Cu / BPC-157 / Oxytocin",
          duration: "12 weeks",
          protocolDescription: "This premier aesthetics protocol combines GHK-Cu topical for collagen stimulation and skin remodeling, injectable BPC-157 for systemic tissue repair and angiogenesis, and Oxytocin cream for skin regeneration and cortisol-mediated aging reduction. GHK-Cu activates fibroblasts and metalloproteinases for controlled remodeling while BPC-157 supports vascularity and healing. Oxytocin reduces stress-related skin aging.",
          synergyRationale: "GHK-Cu drives collagen synthesis and skin remodeling topically, BPC-157 enhances vascular supply and tissue repair systemically, and Oxytocin reduces cortisol-mediated skin aging — a three-pronged approach to skin quality from structural, vascular, and hormonal angles.",
          products: [
            {
              name: "GHK-Cu (1%) - Topical Solution [60mL]",
              compound: "GHK-Cu",
              dosing: "APPLY 0.5ML TO FACE AND NECK ONCE DAILY AT BEDTIME AFTER CLEANSING.",
              doseSummary: "Dose: 0.5mL topically nightly",
              form: "topical",
            },
            {
              name: "BPC-157 (5mg) per mL - SQ Injectable [5mL]",
              compound: "BPC-157",
              dosing: "INJECT 0.1ML (500MCG) SUBCUTANEOUSLY IN THE ABDOMEN ONCE DAILY.",
              doseSummary: "Dose: 500mcg daily",
              form: "injectable",
            },
            {
              name: "Oxytocin (40IU) per mL - Topical Cream [30mL]",
              compound: "Oxytocin",
              dosing: "APPLY 0.5ML TO FACE AND NECK ONCE DAILY IN THE MORNING AFTER CLEANSING.",
              doseSummary: "Dose: 20IU topically daily",
              form: "topical",
            },
          ],
        },
        {
          id: "da-p3",
          name: "GAL Cream / GHK-Cu / BPC-157",
          duration: "12 weeks",
          protocolDescription: "This premier protocol pairs GAL Cream for epidermal renewal with GHK-Cu for deep collagen stimulation and injectable BPC-157 for systemic tissue repair. GAL Cream accelerates cell turnover at the surface while GHK-Cu activates fibroblasts and metalloproteinases for structural remodeling. BPC-157 supports the vascular infrastructure needed for healthy, radiant skin.",
          synergyRationale: "GAL Cream exfoliates and renews the epidermis, GHK-Cu rebuilds collagen and elastin in the dermis, and BPC-157 supports angiogenesis and tissue repair from within — comprehensive skin renewal from surface to systemic levels.",
          products: [
            {
              name: "GAL (Glycolic Acid/Retinol/Niacinamide) - Topical Cream [50g]",
              compound: "GAL Cream",
              dosing: "APPLY A PEA-SIZED AMOUNT TO CLEAN, DRY FACE AND NECK ONCE DAILY AT BEDTIME. AVOID EYE AREA. USE SUNSCREEN DAILY.",
              doseSummary: "Dose: Pea-sized amount nightly",
              form: "topical",
            },
            {
              name: "GHK-Cu (1%) - Topical Solution [60mL]",
              compound: "GHK-Cu",
              dosing: "APPLY 0.5ML TO FACE AND NECK IN THE MORNING AFTER CLEANSING. ALLOW TO DRY BEFORE APPLYING SUNSCREEN.",
              doseSummary: "Dose: 0.5mL topically daily",
              form: "topical",
            },
            {
              name: "BPC-157 (5mg) per mL - SQ Injectable [5mL]",
              compound: "BPC-157",
              dosing: "INJECT 0.1ML (500MCG) SUBCUTANEOUSLY IN THE ABDOMEN ONCE DAILY.",
              doseSummary: "Dose: 500mcg daily",
              form: "injectable",
            },
          ],
        },
      ],
      core: [
        {
          id: "da-c1",
          name: "GAL Cream / NAD+",
          duration: "12 weeks",
          protocolDescription: "This core aesthetics protocol combines GAL Cream for topical skin renewal with moderate-dose injectable NAD+ for cellular energy and anti-aging support. The two-component approach addresses both surface-level skin quality and cellular mitochondrial function. Effective for patients seeking visible skin improvement with cellular longevity benefits.",
          synergyRationale: "GAL Cream accelerates epidermal turnover and collagen deposition topically while NAD+ restores mitochondrial function and sirtuin activity in dermal cells — addressing skin aging from both the outside and the cellular level.",
          products: [
            {
              name: "GAL (Glycolic Acid/Retinol/Niacinamide) - Topical Cream [30g]",
              compound: "GAL Cream",
              dosing: "APPLY A PEA-SIZED AMOUNT TO CLEAN, DRY FACE AND NECK ONCE DAILY AT BEDTIME. AVOID EYE AREA. USE SUNSCREEN DAILY.",
              doseSummary: "Dose: Pea-sized amount nightly",
              form: "topical",
            },
            {
              name: "NAD+ (50mg) per mL - SQ Injectable [5mL]",
              compound: "NAD+",
              dosing: "INJECT 0.5ML (25MG) SUBCUTANEOUSLY TWICE PER WEEK.",
              doseSummary: "Dose: 25mg twice weekly",
              form: "injectable",
            },
          ],
        },
        {
          id: "da-c2",
          name: "GHK-Cu / BPC-157",
          duration: "12 weeks",
          protocolDescription: "This core protocol provides GHK-Cu topical for collagen stimulation paired with moderate-dose injectable BPC-157 for tissue repair and angiogenesis. The combination supports dermal remodeling from the surface and vascular health from within. A focused two-compound approach to skin rejuvenation.",
          synergyRationale: "GHK-Cu drives collagen and elastin synthesis topically while BPC-157 supports the vascular infrastructure and tissue repair needed for healthy skin — surface remodeling paired with systemic support.",
          products: [
            {
              name: "GHK-Cu (0.5%) - Topical Solution [30mL]",
              compound: "GHK-Cu",
              dosing: "APPLY 0.5ML TO FACE AND NECK ONCE DAILY AT BEDTIME AFTER CLEANSING.",
              doseSummary: "Dose: 0.5mL topically nightly",
              form: "topical",
            },
            {
              name: "BPC-157 (3mg) per mL - SQ Injectable [3mL]",
              compound: "BPC-157",
              dosing: "INJECT 0.1ML (300MCG) SUBCUTANEOUSLY IN THE ABDOMEN ONCE DAILY.",
              doseSummary: "Dose: 300mcg daily",
              form: "injectable",
            },
          ],
        },
        {
          id: "da-c3",
          name: "GAL Cream / GHK-Cu",
          duration: "12 weeks",
          protocolDescription: "This core protocol combines GAL Cream for epidermal renewal with GHK-Cu topical for deep collagen stimulation. The all-topical approach provides comprehensive skin rejuvenation without injections. GAL Cream accelerates surface turnover while GHK-Cu activates fibroblasts for structural improvement.",
          synergyRationale: "GAL Cream exfoliates and renews the epidermal surface while GHK-Cu rebuilds collagen and elastin in the dermis — a complementary all-topical regimen addressing both layers of the skin.",
          products: [
            {
              name: "GAL (Glycolic Acid/Retinol/Niacinamide) - Topical Cream [30g]",
              compound: "GAL Cream",
              dosing: "APPLY A PEA-SIZED AMOUNT TO CLEAN, DRY FACE AND NECK ONCE DAILY AT BEDTIME. AVOID EYE AREA. USE SUNSCREEN DAILY.",
              doseSummary: "Dose: Pea-sized amount nightly",
              form: "topical",
            },
            {
              name: "GHK-Cu (0.5%) - Topical Solution [30mL]",
              compound: "GHK-Cu",
              dosing: "APPLY 0.5ML TO FACE AND NECK IN THE MORNING AFTER CLEANSING. ALLOW TO DRY BEFORE APPLYING SUNSCREEN.",
              doseSummary: "Dose: 0.5mL topically daily",
              form: "topical",
            },
          ],
        },
      ],
      essential: [
        {
          id: "da-e1",
          name: "GAL Cream Topical",
          duration: "12 weeks",
          protocolDescription: "This essential protocol provides GAL Cream as a single-agent topical for foundational skin renewal. The Glycolic Acid/Retinol/Niacinamide formula accelerates epidermal turnover, stimulates collagen deposition, and improves skin texture and radiance. The most accessible entry point to clinical skin care.",
          synergyRationale: "GAL Cream provides multi-active topical renewal through glycolic acid exfoliation, retinoid receptor activation for collagen synthesis, and niacinamide for barrier repair and pigmentation control — comprehensive surface treatment in a single product.",
          products: [
            {
              name: "GAL (Glycolic Acid/Retinol/Niacinamide) - Topical Cream [30g]",
              compound: "GAL Cream",
              dosing: "APPLY A PEA-SIZED AMOUNT TO CLEAN, DRY FACE AND NECK ONCE DAILY AT BEDTIME. AVOID EYE AREA. USE SUNSCREEN DAILY.",
              doseSummary: "Dose: Pea-sized amount nightly",
              form: "topical",
            },
          ],
        },
        {
          id: "da-e2",
          name: "GHK-Cu Topical",
          duration: "12 weeks",
          protocolDescription: "This essential protocol provides GHK-Cu topical solution for foundational collagen stimulation and skin remodeling. GHK-Cu activates fibroblasts, promotes collagen I and III synthesis, and functions as a potent antioxidant through superoxide dismutase activation. A gentle, peptide-based approach to skin rejuvenation.",
          synergyRationale: "GHK-Cu alone provides multi-faceted dermal support through fibroblast activation, collagen/elastin synthesis, controlled tissue remodeling, and antioxidant protection — the most versatile single peptide for skin health.",
          products: [
            {
              name: "GHK-Cu (0.5%) - Topical Solution [30mL]",
              compound: "GHK-Cu",
              dosing: "APPLY 0.5ML TO FACE AND NECK ONCE DAILY AT BEDTIME AFTER CLEANSING.",
              doseSummary: "Dose: 0.5mL topically nightly",
              form: "topical",
            },
          ],
        },
        {
          id: "da-e3",
          name: "BPC-157 Topical",
          duration: "12 weeks",
          protocolDescription: "This essential protocol provides BPC-157 in a topical formulation for localized tissue repair and skin healing support. Topical BPC-157 promotes angiogenesis and growth factor expression directly at the application site. Ideal for patients seeking targeted skin repair without systemic administration.",
          synergyRationale: "Topical BPC-157 delivers localized tissue repair signaling through VEGF upregulation and nitric oxide modulation directly at the skin surface — the most targeted approach to peptide-based skin healing.",
          products: [
            {
              name: "BPC-157 (0.1%) - Topical Cream [30g]",
              compound: "BPC-157",
              dosing: "APPLY A THIN LAYER TO TARGET AREAS ONCE DAILY AT BEDTIME AFTER CLEANSING. FOCUS ON AREAS OF CONCERN.",
              doseSummary: "Dose: Thin layer topically nightly",
              form: "topical",
            },
          ],
        },
      ],
    },
  },

  /* ══════════════════════════════════════════════════════════════
     Anti-Inflammatory
     ══════════════════════════════════════════════════════════════ */
  {
    id: "antiinflam",
    name: "Anti-Inflammatory",
    description: "Systemic anti-inflammatory protocols combining tissue-repair peptides with immune modulators to reduce chronic inflammation.",
    gendered: false,
    tiers: {
      premier: [
        {
          id: "ai-p1",
          name: "BPC-157+TB4 / GH Secretagogue",
          duration: "8 weeks",
          protocolDescription: "This premier anti-inflammatory protocol combines BPC-157 and Thymosin Beta-4 for comprehensive tissue repair and inflammatory resolution alongside an Ipamorelin/CJC-1295 GH secretagogue stack for systemic growth factor support. BPC-157 modulates nitric oxide pathways and reduces pro-inflammatory cytokines while TB4 promotes anti-inflammatory cell migration. The GH secretagogue amplifies tissue recovery through IGF-1 elevation.",
          synergyRationale: "BPC-157/TB4 directly resolve inflammation through cytokine modulation and anti-inflammatory cell recruitment, while Ipamorelin/CJC-1295 drives systemic tissue recovery through GH/IGF-1 elevation — attacking chronic inflammation from both local and systemic levels.",
          products: [
            {
              name: "BPC-157 (5mg) + Thymosin Beta-4 (5mg) per mL - SQ Injectable [10mL]",
              compound: "BPC-157",
              dosing: "INJECT 0.2ML (1MG BPC-157 + 1MG TB4) SUBCUTANEOUSLY ONCE DAILY. ROTATE INJECTION SITES BETWEEN ABDOMEN AND AREAS OF INFLAMMATION.",
              doseSummary: "Dose: 1mg BPC-157 + 1mg TB4 daily",
              form: "injectable",
            },
            {
              name: "Ipamorelin (500mcg) + CJC-1295 (2000mcg) per mL - SQ Injectable [10mL]",
              compound: "GH Secretagogue",
              dosing: "INJECT 0.2ML (100MCG IPAMORELIN + 400MCG CJC-1295) SUBCUTANEOUSLY 60 MINUTES AWAY FROM FOOD PRIOR TO BED FIVE NIGHTS PER WEEK.",
              doseSummary: "Dose: 100mcg Ipamorelin + 400mcg CJC-1295",
              form: "injectable",
            },
          ],
        },
        {
          id: "ai-p2",
          name: "BPC-157+TB4 / ABP-7 I",
          duration: "8 weeks",
          protocolDescription: "This premier anti-inflammatory protocol pairs BPC-157/TB4 for tissue repair with ABP-7 for targeted inflammatory cytokine suppression. ABP-7 inhibits TNF-alpha, IL-6, and IL-1beta while promoting M2 macrophage polarization for inflammatory resolution. The combination provides both structural repair and active inflammation suppression for chronic inflammatory conditions.",
          synergyRationale: "BPC-157/TB4 repair damaged tissue and promote angiogenesis while ABP-7 actively suppresses the pro-inflammatory cytokine cascade — combining tissue rebuilding with inflammatory resolution for comprehensive anti-inflammatory action.",
          products: [
            {
              name: "BPC-157 (5mg) + Thymosin Beta-4 (5mg) per mL - SQ Injectable [10mL]",
              compound: "BPC-157",
              dosing: "INJECT 0.2ML (1MG BPC-157 + 1MG TB4) SUBCUTANEOUSLY ONCE DAILY. ROTATE INJECTION SITES BETWEEN ABDOMEN AND AREAS OF INFLAMMATION.",
              doseSummary: "Dose: 1mg BPC-157 + 1mg TB4 daily",
              form: "injectable",
            },
            {
              name: "ABP-7 (500mcg) per mL - SQ Injectable [5mL]",
              compound: "ABP-7",
              dosing: "INJECT 0.2ML (100MCG) SUBCUTANEOUSLY ONCE DAILY. MAY INJECT NEAR AREAS OF INFLAMMATION OR ABDOMEN.",
              doseSummary: "Dose: 100mcg daily",
              form: "injectable",
            },
          ],
        },
        {
          id: "ai-p3",
          name: "BPC-157+TB4 / ABP-7 II",
          duration: "8 weeks",
          protocolDescription: "This advanced anti-inflammatory protocol combines BPC-157/TB4 with high-dose ABP-7 for maximum inflammatory cytokine suppression in severe or chronic inflammation. The elevated ABP-7 concentration provides more aggressive NF-kB pathway inhibition and accelerated M2 macrophage polarization. Designed for patients with significant chronic inflammatory burden requiring intensive intervention.",
          synergyRationale: "BPC-157/TB4 provide robust tissue repair while high-dose ABP-7 delivers maximum anti-inflammatory cytokine suppression — an intensive combination for severe chronic inflammation requiring aggressive intervention.",
          products: [
            {
              name: "BPC-157 (5mg) + Thymosin Beta-4 (5mg) per mL - SQ Injectable [10mL]",
              compound: "BPC-157",
              dosing: "INJECT 0.2ML (1MG BPC-157 + 1MG TB4) SUBCUTANEOUSLY ONCE DAILY. ROTATE INJECTION SITES BETWEEN ABDOMEN AND AREAS OF INFLAMMATION.",
              doseSummary: "Dose: 1mg BPC-157 + 1mg TB4 daily",
              form: "injectable",
            },
            {
              name: "ABP-7 (1000mcg) per mL - SQ Injectable [5mL]",
              compound: "ABP-7",
              dosing: "INJECT 0.2ML (200MCG) SUBCUTANEOUSLY ONCE DAILY. MAY INJECT NEAR AREAS OF INFLAMMATION OR ABDOMEN.",
              doseSummary: "Dose: 200mcg daily",
              form: "injectable",
            },
          ],
        },
        {
          id: "ai-p4",
          name: "Lyophilized Anti-Inflammatory",
          duration: "8 weeks",
          protocolDescription: "This lyophilized anti-inflammatory protocol delivers BPC-157 and TB4 Fragment in freeze-dried vials for stable, potent inflammatory resolution support. The dual-peptide combination targets both tissue repair and anti-inflammatory pathways in a convenient shelf-stable format. Reconstitution ensures precise dosing across the treatment course.",
          synergyRationale: "BPC-157 modulates nitric oxide and pro-inflammatory cytokines while TB4 Fragment promotes anti-inflammatory cell migration and tissue repair — complementary anti-inflammatory mechanisms in a stable lyophilized format.",
          products: [
            {
              name: "BPC-157 (5mg) - Lyophilized Powder [1 vial]",
              compound: "BPC-157",
              dosing: "RECONSTITUTE WITH 2.5ML BACTERIOSTATIC WATER. INJECT 0.25ML (500MCG) SUBCUTANEOUSLY ONCE DAILY.",
              doseSummary: "Dose: 500mcg daily",
              form: "lyophilized powder",
            },
            {
              name: "TB4 Fragment (5mg) - Lyophilized Powder [1 vial]",
              compound: "TB4",
              dosing: "RECONSTITUTE WITH 2.5ML BACTERIOSTATIC WATER. INJECT 0.25ML (500MCG) SUBCUTANEOUSLY ONCE DAILY.",
              doseSummary: "Dose: 500mcg daily",
              form: "lyophilized powder",
            },
          ],
        },
        {
          id: "ai-p5",
          name: "Capsule Anti-Inflammatory Protocol",
          duration: "8 weeks",
          protocolDescription: "This oral anti-inflammatory protocol provides BPC-157 and TB4 Fragment in enteric-coated capsules for convenient non-injectable inflammatory resolution support. Oral BPC-157 has particular affinity for gut-associated inflammation and systemic cytoprotection. The combination supports whole-body anti-inflammatory signaling through the GI tract.",
          synergyRationale: "Oral BPC-157 provides systemic anti-inflammatory and cytoprotective signaling with gut mucosal specificity, while oral TB4 Fragment supports anti-inflammatory cell migration — comprehensive oral anti-inflammatory support without injections.",
          products: [
            {
              name: "BPC-157 (500mcg) - Oral Capsule [60ct]",
              compound: "BPC-157",
              dosing: "TAKE ONE CAPSULE (500MCG) BY MOUTH TWICE DAILY ON AN EMPTY STOMACH, 30 MINUTES BEFORE MEALS.",
              doseSummary: "Dose: 500mcg twice daily",
              form: "capsule",
            },
            {
              name: "TB4 Fragment Oral (750mcg) - Oral Capsule [60ct]",
              compound: "TB4",
              dosing: "TAKE ONE CAPSULE (750MCG) BY MOUTH TWICE DAILY ON AN EMPTY STOMACH, 30 MINUTES BEFORE MEALS.",
              doseSummary: "Dose: 750mcg twice daily",
              form: "capsule",
            },
          ],
        },
      ],
      core: [
        {
          id: "ai-c1",
          name: "BPC-157+TB4 / GH Secretagogue",
          duration: "8 weeks",
          protocolDescription: "This core anti-inflammatory protocol provides moderate-dose BPC-157/TB4 with an Ipamorelin/CJC-1295 GH secretagogue at reduced concentration. The balanced dosing supports effective inflammatory resolution and systemic recovery at an accessible level. Ideal for moderate chronic inflammation or maintenance phases.",
          synergyRationale: "Moderate BPC-157/TB4 dosing resolves inflammation and repairs tissue while a reduced GH secretagogue dose supports systemic recovery through growth factor elevation at an accessible concentration.",
          products: [
            {
              name: "BPC-157 (3mg) + Thymosin Beta-4 (3mg) per mL - SQ Injectable [5mL]",
              compound: "BPC-157",
              dosing: "INJECT 0.2ML (600MCG BPC-157 + 600MCG TB4) SUBCUTANEOUSLY ONCE DAILY. ROTATE INJECTION SITES.",
              doseSummary: "Dose: 600mcg BPC-157 + 600mcg TB4 daily",
              form: "injectable",
            },
            {
              name: "N-Acetyl Ipamorelin (300mcg) + CJC-1295 (1500mcg) per mL - SQ Injectable [5mL]",
              compound: "GH Secretagogue",
              dosing: "INJECT 0.2ML (60MCG IPAMORELIN + 300MCG CJC-1295) SUBCUTANEOUSLY 60 MINUTES AWAY FROM FOOD PRIOR TO BED FIVE NIGHTS PER WEEK.",
              doseSummary: "Dose: 60mcg Ipamorelin + 300mcg CJC-1295",
              form: "injectable",
            },
          ],
        },
        {
          id: "ai-c2",
          name: "BPC-157+TB4 / ABP-7 I",
          duration: "8 weeks",
          protocolDescription: "This core-tier protocol pairs moderate-dose BPC-157/TB4 with ABP-7 at a balanced concentration for effective anti-inflammatory support. The reduced dosing still delivers meaningful cytokine modulation and tissue repair. A practical mid-tier option for chronic inflammatory management.",
          synergyRationale: "Moderate BPC-157/TB4 repairs tissue while balanced ABP-7 dosing suppresses pro-inflammatory cytokines — effective anti-inflammatory action at an accessible concentration.",
          products: [
            {
              name: "BPC-157 (3mg) + Thymosin Beta-4 (3mg) per mL - SQ Injectable [5mL]",
              compound: "BPC-157",
              dosing: "INJECT 0.2ML (600MCG BPC-157 + 600MCG TB4) SUBCUTANEOUSLY ONCE DAILY. ROTATE INJECTION SITES.",
              doseSummary: "Dose: 600mcg BPC-157 + 600mcg TB4 daily",
              form: "injectable",
            },
            {
              name: "ABP-7 (300mcg) per mL - SQ Injectable [3mL]",
              compound: "ABP-7",
              dosing: "INJECT 0.2ML (60MCG) SUBCUTANEOUSLY ONCE DAILY.",
              doseSummary: "Dose: 60mcg daily",
              form: "injectable",
            },
          ],
        },
        {
          id: "ai-c3",
          name: "BPC-157+TB4 / ABP-7 II",
          duration: "8 weeks",
          protocolDescription: "This core-tier protocol provides moderate-dose BPC-157/TB4 with a slightly higher ABP-7 concentration for enhanced anti-inflammatory cytokine suppression at the core tier. The elevated ABP-7 compared to ABP-7 I provides more aggressive inflammatory resolution while maintaining balanced tissue repair dosing.",
          synergyRationale: "Moderate BPC-157/TB4 repairs tissue while elevated ABP-7 dosing provides stronger inflammatory cytokine suppression — a step up in anti-inflammatory intensity within the core tier.",
          products: [
            {
              name: "BPC-157 (3mg) + Thymosin Beta-4 (3mg) per mL - SQ Injectable [5mL]",
              compound: "BPC-157",
              dosing: "INJECT 0.2ML (600MCG BPC-157 + 600MCG TB4) SUBCUTANEOUSLY ONCE DAILY. ROTATE INJECTION SITES.",
              doseSummary: "Dose: 600mcg BPC-157 + 600mcg TB4 daily",
              form: "injectable",
            },
            {
              name: "ABP-7 (500mcg) per mL - SQ Injectable [3mL]",
              compound: "ABP-7",
              dosing: "INJECT 0.2ML (100MCG) SUBCUTANEOUSLY ONCE DAILY.",
              doseSummary: "Dose: 100mcg daily",
              form: "injectable",
            },
          ],
        },
        {
          id: "ai-c4",
          name: "Lyophilized Anti-Inflammatory",
          duration: "8 weeks",
          protocolDescription: "This core lyophilized protocol provides BPC-157 in a smaller freeze-dried vial for moderate anti-inflammatory support. The single-vial approach focuses on the most versatile anti-inflammatory and tissue repair peptide in a convenient format. Reconstitution yields consistent dosing.",
          synergyRationale: "BPC-157 alone provides broad anti-inflammatory activity through nitric oxide modulation, cytokine regulation, and growth factor upregulation — the most essential single peptide for inflammatory resolution in a stable lyophilized format.",
          products: [
            {
              name: "BPC-157 (2.5mg) - Lyophilized Powder [1 vial]",
              compound: "BPC-157",
              dosing: "RECONSTITUTE WITH 2.5ML BACTERIOSTATIC WATER. INJECT 0.25ML (250MCG) SUBCUTANEOUSLY ONCE DAILY.",
              doseSummary: "Dose: 250mcg daily",
              form: "lyophilized powder",
            },
          ],
        },
        {
          id: "ai-c5",
          name: "Capsule Anti-Inflammatory Protocol",
          duration: "8 weeks",
          protocolDescription: "This core oral protocol provides moderate-dose BPC-157 capsules for convenient non-injectable anti-inflammatory support. Oral BPC-157 has particular affinity for gut-associated inflammation and provides systemic cytoprotective signaling. An accessible oral approach to anti-inflammatory peptide therapy.",
          synergyRationale: "Oral BPC-157 delivers systemic anti-inflammatory and cytoprotective signaling with emphasis on gut mucosal healing — the most practical single-agent oral approach to inflammatory resolution.",
          products: [
            {
              name: "BPC-157 (500mcg) - Oral Capsule [30ct]",
              compound: "BPC-157",
              dosing: "TAKE ONE CAPSULE (500MCG) BY MOUTH ONCE DAILY ON AN EMPTY STOMACH, 30 MINUTES BEFORE A MEAL.",
              doseSummary: "Dose: 500mcg once daily",
              form: "capsule",
            },
          ],
        },
      ],
      essential: [
        {
          id: "ai-e1",
          name: "BPC-157+TB4 / GH Secretagogue",
          duration: "8 weeks",
          protocolDescription: "This essential anti-inflammatory protocol provides foundational BPC-157 with a single-agent Ipamorelin GH secretagogue for basic inflammatory resolution and recovery support. The simplified stack focuses on the most proven anti-inflammatory peptide with clean GH pulsatility. An accessible starting point for anti-inflammatory peptide therapy.",
          synergyRationale: "BPC-157 provides direct anti-inflammatory signaling while Ipamorelin alone delivers clean GH pulsatility for systemic recovery — a streamlined approach to the anti-inflammatory/GH secretagogue combination.",
          products: [
            {
              name: "BPC-157 (2mg) per mL - SQ Injectable [5mL]",
              compound: "BPC-157",
              dosing: "INJECT 0.2ML (400MCG) SUBCUTANEOUSLY ONCE DAILY. ROTATE INJECTION SITES.",
              doseSummary: "Dose: 400mcg daily",
              form: "injectable",
            },
            {
              name: "N-Acetyl Ipamorelin (300mcg) per mL - SQ Injectable [5mL]",
              compound: "GH Secretagogue",
              dosing: "INJECT 0.2ML (60MCG) SUBCUTANEOUSLY 60 MINUTES AWAY FROM FOOD PRIOR TO BED FIVE NIGHTS PER WEEK.",
              doseSummary: "Dose: 60mcg Ipamorelin nightly",
              form: "injectable",
            },
          ],
        },
        {
          id: "ai-e2",
          name: "BPC-157+TB4 / ABP-7 I",
          duration: "8 weeks",
          protocolDescription: "This essential protocol provides foundational BPC-157 with low-dose ABP-7 for basic anti-inflammatory support. The conservative dosing provides gentle inflammatory cytokine modulation alongside BPC-157's tissue repair signaling. A streamlined approach for patients with mild to moderate chronic inflammation.",
          synergyRationale: "BPC-157 provides tissue repair and anti-inflammatory signaling while low-dose ABP-7 gently modulates pro-inflammatory cytokines — a simplified but effective foundation for inflammatory resolution.",
          products: [
            {
              name: "BPC-157 (2mg) per mL - SQ Injectable [5mL]",
              compound: "BPC-157",
              dosing: "INJECT 0.2ML (400MCG) SUBCUTANEOUSLY ONCE DAILY. ROTATE INJECTION SITES.",
              doseSummary: "Dose: 400mcg daily",
              form: "injectable",
            },
            {
              name: "ABP-7 (250mcg) per mL - SQ Injectable [3mL]",
              compound: "ABP-7",
              dosing: "INJECT 0.2ML (50MCG) SUBCUTANEOUSLY ONCE DAILY.",
              doseSummary: "Dose: 50mcg daily",
              form: "injectable",
            },
          ],
        },
        {
          id: "ai-e3",
          name: "BPC-157+TB4 / ABP-7 II",
          duration: "8 weeks",
          protocolDescription: "This essential protocol provides foundational BPC-157 with a slightly higher ABP-7 dose for enhanced anti-inflammatory cytokine suppression at the essential tier. The conservative but elevated ABP-7 provides more targeted inflammatory resolution while BPC-157 supports tissue repair. For patients needing slightly more aggressive anti-inflammatory support.",
          synergyRationale: "BPC-157 repairs tissue while a modestly elevated ABP-7 dose provides stronger inflammatory cytokine suppression — a step up in anti-inflammatory intensity at the essential tier.",
          products: [
            {
              name: "BPC-157 (2mg) per mL - SQ Injectable [5mL]",
              compound: "BPC-157",
              dosing: "INJECT 0.2ML (400MCG) SUBCUTANEOUSLY ONCE DAILY. ROTATE INJECTION SITES.",
              doseSummary: "Dose: 400mcg daily",
              form: "injectable",
            },
            {
              name: "ABP-7 (300mcg) per mL - SQ Injectable [3mL]",
              compound: "ABP-7",
              dosing: "INJECT 0.2ML (60MCG) SUBCUTANEOUSLY ONCE DAILY.",
              doseSummary: "Dose: 60mcg daily",
              form: "injectable",
            },
          ],
        },
        {
          id: "ai-e4",
          name: "Lyophilized Anti-Inflammatory",
          duration: "8 weeks",
          protocolDescription: "This essential lyophilized protocol provides a single BPC-157 vial in freeze-dried format for foundational anti-inflammatory support. The streamlined single-peptide approach focuses on the most clinically validated anti-inflammatory and cytoprotective peptide. Simple reconstitution for consistent dosing.",
          synergyRationale: "BPC-157 alone provides broad-spectrum anti-inflammatory activity through nitric oxide modulation, cytokine regulation, and tissue repair — the single most versatile anti-inflammatory peptide in a stable lyophilized format.",
          products: [
            {
              name: "BPC-157 (2mg) - Lyophilized Powder [1 vial]",
              compound: "BPC-157",
              dosing: "RECONSTITUTE WITH 2ML BACTERIOSTATIC WATER. INJECT 0.2ML (200MCG) SUBCUTANEOUSLY ONCE DAILY.",
              doseSummary: "Dose: 200mcg daily",
              form: "lyophilized powder",
            },
          ],
        },
        {
          id: "ai-e5",
          name: "Capsule Anti-Inflammatory Protocol",
          duration: "8 weeks",
          protocolDescription: "This essential oral protocol provides BPC-157 capsules at the lowest effective dose for foundational anti-inflammatory and cytoprotective support. Oral BPC-157 provides systemic healing benefits with particular affinity for gut mucosal repair and inflammation reduction. The simplest possible anti-inflammatory peptide protocol.",
          synergyRationale: "Oral BPC-157 provides foundational anti-inflammatory signaling through the GI tract with systemic cytoprotective effects — the most accessible entry point to anti-inflammatory peptide therapy.",
          products: [
            {
              name: "BPC-157 (250mcg) - Oral Capsule [30ct]",
              compound: "BPC-157",
              dosing: "TAKE ONE CAPSULE (250MCG) BY MOUTH ONCE DAILY ON AN EMPTY STOMACH, 30 MINUTES BEFORE A MEAL.",
              doseSummary: "Dose: 250mcg once daily",
              form: "capsule",
            },
          ],
        },
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
  "AOD-9604": {
    description:
      "A modified fragment (amino acids 177-191) of human growth hormone that retains the fat-reducing activity of GH without its growth-promoting or diabetogenic effects. Specifically targets adipose tissue for lipolysis.",
    mechanism:
      "Stimulates lipolysis and inhibits lipogenesis in adipose tissue through interaction with the beta-3 adrenergic receptor pathway, mimicking the fat-metabolizing portion of natural growth hormone. Does not affect IGF-1 levels, blood glucose, or tissue growth, providing targeted fat reduction without systemic hormonal effects.",
  },
  Tirzepatide: {
    description:
      "A dual GLP-1/GIP receptor agonist engineered for superior glycemic control, appetite suppression, and weight loss compared to single-incretin agents. Represents the newest generation of incretin-based therapies.",
    mechanism:
      "Simultaneously activates glucagon-like peptide-1 (GLP-1) and glucose-dependent insulinotropic polypeptide (GIP) receptors, producing complementary effects on appetite, gastric emptying, insulin secretion, and energy balance. The dual agonism produces greater weight loss and metabolic improvement than GLP-1-only agents.",
  },
  "CJC-1295": {
    description:
      "A synthetic analog of growth hormone-releasing hormone (GHRH) with a Drug Affinity Complex (DAC) modification that extends its half-life for sustained GH release over days rather than minutes.",
    mechanism:
      "Binds to the GHRH receptor on somatotroph cells in the anterior pituitary, stimulating sustained growth hormone release while preserving the natural pulsatile secretion pattern. The DAC modification enables albumin binding for a half-life of 6-8 days, providing continuous GH axis stimulation between doses.",
  },
  Ipamorelin: {
    description:
      "A highly selective growth hormone secretagogue peptide that stimulates GH release with minimal impact on cortisol, prolactin, or appetite — the cleanest GH secretagogue available.",
    mechanism:
      "Selectively activates the ghrelin/GHS-R1a receptor on pituitary somatotrophs to trigger GH release without significantly stimulating ACTH, cortisol, or prolactin secretion. Produces dose-dependent, pulsatile GH release that closely mimics natural physiological patterns.",
  },
  Tesamorelin: {
    description:
      "A GHRH analog specifically developed and FDA-approved for the reduction of excess abdominal (visceral) adipose tissue. Stimulates natural GH production with particular efficacy against truncal obesity.",
    mechanism:
      "Binds the GHRH receptor to stimulate pulsatile GH release from the anterior pituitary, with demonstrated specificity for reducing visceral adipose tissue through enhanced lipolysis. Improves trunk fat, triglyceride levels, and body composition while preserving the physiological GH feedback loop.",
  },
  Sermorelin: {
    description:
      "A synthetic analog of the first 29 amino acids of GHRH, the shortest fragment retaining full biological activity for stimulating growth hormone release from the pituitary gland.",
    mechanism:
      "Binds the GHRH receptor on anterior pituitary somatotrophs to stimulate endogenous GH production in a pulsatile, physiologically natural pattern. Preserves the negative feedback loop through somatostatin, preventing GH excess while optimizing baseline levels for recovery, body composition, and sleep quality.",
  },
  "MK-677": {
    description:
      "Ibutamoren mesylate (MK-677), a potent, orally active growth hormone secretagogue that mimics ghrelin's stimulatory effect on the GHS-R1a receptor for sustained GH and IGF-1 elevation.",
    mechanism:
      "Acts as a non-peptide agonist of the ghrelin receptor (GHS-R1a), stimulating GH release from the anterior pituitary. Produces sustained elevation of GH and IGF-1 levels for up to 24 hours per oral dose. Also improves sleep architecture by increasing Stage 4 (deep) sleep duration.",
  },
  Selank: {
    description:
      "A synthetic heptapeptide analog of the naturally occurring immunomodulatory peptide tuftsin, developed for its anxiolytic, nootropic, and immune-modulating properties without sedative or addictive effects.",
    mechanism:
      "Modulates the balance of T-helper lymphocyte activity, enhances IL-6 expression, and stabilizes enkephalin levels in the brain. Reduces anxiety through GABAergic modulation without cognitive impairment, enhances BDNF expression, and supports memory consolidation while promoting calm focus and stress resilience.",
  },
  Kisspeptin: {
    description:
      "A neuropeptide encoded by the KISS1 gene that serves as the master regulator of the hypothalamic-pituitary-gonadal (HPG) axis, controlling GnRH release for reproductive hormone signaling, fertility, and libido.",
    mechanism:
      "Binds the kisspeptin receptor (KISS1R/GPR54) on GnRH neurons in the hypothalamus, triggering pulsatile GnRH release that drives downstream LH and FSH secretion. Stimulates endogenous testosterone production, supports spermatogenesis and oocyte maturation, and enhances libido through both hormonal and central arousal mechanisms.",
  },
  Lactoferrin: {
    description:
      "An iron-binding glycoprotein found in milk, mucosal secretions, and neutrophil granules with broad antimicrobial, anti-inflammatory, and immune-modulating properties essential for innate immune defense.",
    mechanism:
      "Sequesters free iron to inhibit bacterial growth, directly disrupts microbial cell membranes through the lactoferricin domain, modulates TLR4 signaling to reduce excessive inflammatory responses, and promotes the growth of beneficial gut microbiota (Bifidobacterium and Lactobacillus species). Enhances NK cell activity and macrophage function.",
  },
  "Beta-Glucan": {
    description:
      "A group of immunologically active polysaccharides derived from yeast, mushrooms, or oat cell walls that potently activate innate immune defenses through pattern recognition receptor engagement.",
    mechanism:
      "Binds dectin-1 and complement receptor 3 (CR3) on macrophages, dendritic cells, and neutrophils, triggering phagocytosis, cytokine production, and antigen presentation. Primes innate immune cells for enhanced pathogen recognition and elimination, increases NK cell cytotoxicity, and supports trained immunity — long-lasting innate immune memory.",
  },
  "IGF-1 LR3": {
    description:
      "A modified, long-acting variant of Insulin-like Growth Factor-1 with an extended half-life due to reduced IGF binding protein affinity, resulting in more potent and sustained anabolic signaling compared to native IGF-1.",
    mechanism:
      "The Arg3 substitution and 13-amino-acid N-terminal extension reduce binding to IGFBPs, increasing free circulating IGF-1 LR3 bioavailability by approximately 2-3x compared to native IGF-1. Activates the IGF-1R/PI3K/Akt pathway for enhanced muscle protein synthesis, satellite cell proliferation, and nitrogen retention with a prolonged duration of action.",
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
