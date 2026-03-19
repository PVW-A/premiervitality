import SEO from "@/components/SEO";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { openCalendly } from "@/hooks/useCalendly";
import {
  Scale, Heart, Flame, Sparkles, Scissors, Bandage, Zap, Shield,
  Brain, ArrowRight,
} from "lucide-react";

/* ───────────────────────────── types ───────────────────────────── */

interface ProtocolCard {
  id: string;
  name: string;
  duration: string;
  price: number;
}

type TieredProtocols = {
  premier: ProtocolCard[];
  core: ProtocolCard[];
  essential: ProtocolCard[];
};

interface StandardCategory {
  id: string;
  name: string;
  icon: React.ElementType;
  description: string;
  gendered: false;
  tiers: TieredProtocols;
}

interface GenderedCategory {
  id: string;
  name: string;
  icon: React.ElementType;
  description: string;
  gendered: true;
  her: TieredProtocols;
  him: TieredProtocols;
}

type CategoryData = StandardCategory | GenderedCategory;

/* ───────────────────────────── tier meta ───────────────────────── */

const tierMeta = {
  premier: {
    label: "Premier",
    badge: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    border: "rgba(251,191,36,0.25)",
    description: "Elevated solutions for full-spectrum optimization",
  },
  core: {
    label: "Core",
    badge: "bg-sky-500/15 text-sky-400 border-sky-500/30",
    border: "rgba(56,189,248,0.2)",
    description: "Strategic balance of efficacy and value",
  },
  essential: {
    label: "Essential",
    badge: "bg-rose-400/15 text-rose-400 border-rose-400/30",
    border: "rgba(251,113,133,0.2)",
    description: "Foundational support for targeted needs",
  },
} as const;

const TIERS = ["premier", "core", "essential"] as const;

/* ───────────────────────────── data ───────────────────────────── */

const CATEGORIES: CategoryData[] = [
  /* ── Weight Management ── */
  {
    id: "weight",
    name: "Weight Management",
    icon: Scale,
    description: "Physician-directed protocols targeting metabolic optimization, appetite regulation, and sustainable body composition change.",
    gendered: false,
    tiers: {
      premier: [
        { id: "wm-p1", name: "GLP-1+GIP / GH Secretagogue", duration: "12 weeks", price: 819.80 },
        { id: "wm-p2", name: "GLP-1+GIP / Mitochondrial Uncoupler", duration: "12 weeks", price: 781.30 },
        { id: "wm-p3", name: "GLP-1+GIP / Weight Loss / Thermogenesis", duration: "12 weeks", price: 791.90 },
        { id: "wm-p4", name: "Lyophilized GLP-1+GIP / GH Secretagogue", duration: "12 weeks", price: 674.80 },
        { id: "wm-p5", name: "Capsule Mitochondrial Uncoupler", duration: "12 weeks", price: 857.50 },
      ],
      core: [
        { id: "wm-c1", name: "GLP-1+GIP / GH Secretagogue", duration: "12 weeks", price: 581.00 },
        { id: "wm-c2", name: "GLP-1+GIP / Mitochondrial Uncoupler", duration: "12 weeks", price: 534.00 },
        { id: "wm-c3", name: "GLP-1+GIP / Weight Loss / Thermogenesis", duration: "12 weeks", price: 546.00 },
        { id: "wm-c4", name: "Lyophilized GLP-1+GIP / GH Secretagogue", duration: "12 weeks", price: 446.00 },
        { id: "wm-c5", name: "Capsule Mitochondrial Uncoupler", duration: "12 weeks", price: 574.00 },
      ],
      essential: [
        { id: "wm-e1", name: "GLP-1+GIP / GH Secretagogue", duration: "12 weeks", price: 479.00 },
        { id: "wm-e2", name: "GLP-1+GIP / Mitochondrial Uncoupler", duration: "12 weeks", price: 398.00 },
        { id: "wm-e3", name: "GLP-1+GIP / Weight Loss / Thermogenesis", duration: "12 weeks", price: 411.00 },
        { id: "wm-e4", name: "Lyophilized GLP-1+GIP / GH Secretagogue", duration: "12 weeks", price: 211.00 },
        { id: "wm-e5", name: "Capsule Mitochondrial Uncoupler", duration: "12 weeks", price: 453.00 },
      ],
    },
  },

  /* ── Injury & Repair ── */
  {
    id: "injury",
    name: "Injury & Repair",
    icon: Bandage,
    description: "Targeted tissue repair protocols combining healing peptides with growth factors for accelerated recovery from injury.",
    gendered: false,
    tiers: {
      premier: [
        { id: "ir-p1", name: "Tissue Repair / GH Secretagogue", duration: "8 weeks", price: 1076.40 },
        { id: "ir-p2", name: "Tissue Repair / Immuno-Modulating I", duration: "8 weeks", price: 1058.30 },
        { id: "ir-p3", name: "Tissue Repair / Immuno-Modulating II", duration: "8 weeks", price: 1190.10 },
        { id: "ir-p4", name: "Lyophilized Tissue Repair", duration: "8 weeks", price: 833.30 },
        { id: "ir-p5", name: "Capsule Tissue Repair Protocol", duration: "8 weeks", price: 700.00 },
      ],
      core: [
        { id: "ir-c1", name: "Tissue Repair / GH Secretagogue", duration: "8 weeks", price: 736.00 },
        { id: "ir-c2", name: "Tissue Repair / Immuno-Modulating I", duration: "8 weeks", price: 658.00 },
        { id: "ir-c3", name: "Tissue Repair / Immuno-Modulating II", duration: "8 weeks", price: 692.00 },
        { id: "ir-c4", name: "Lyophilized Tissue Repair", duration: "8 weeks", price: 536.00 },
        { id: "ir-c5", name: "Capsule Tissue Repair Protocol", duration: "8 weeks", price: 436.00 },
      ],
      essential: [
        { id: "ir-e1", name: "Tissue Repair / GH Secretagogue", duration: "8 weeks", price: 526.00 },
        { id: "ir-e2", name: "Tissue Repair / Immuno-Modulating I", duration: "8 weeks", price: 424.00 },
        { id: "ir-e3", name: "Tissue Repair / Immuno-Modulating II", duration: "8 weeks", price: 468.00 },
        { id: "ir-e4", name: "Lyophilized Tissue Repair", duration: "8 weeks", price: 312.00 },
        { id: "ir-e5", name: "Capsule Tissue Repair Protocol", duration: "8 weeks", price: 224.00 },
      ],
    },
  },

  /* ── Performance ── */
  {
    id: "performance",
    name: "Performance",
    icon: Zap,
    description: "Elite protocols for athletic performance, lean mass, and accelerated recovery between training sessions.",
    gendered: false,
    tiers: {
      premier: [
        { id: "pf-p1", name: "GH Secretagogue / Mitochondrial", duration: "12 weeks", price: 1026.40 },
        { id: "pf-p2", name: "GH Secretagogue High-Dose / IGF-1", duration: "12 weeks", price: 969.70 },
        { id: "pf-p3", name: "GH / Vitamin / Neuropeptide", duration: "12 weeks", price: 1040.00 },
        { id: "pf-p4", name: "Lyophilized GH Secretagogue", duration: "12 weeks", price: 869.70 },
        { id: "pf-p5", name: "Capsule Performance Protocol", duration: "12 weeks", price: 1055.60 },
      ],
      core: [
        { id: "pf-c1", name: "GH Secretagogue / Mitochondrial", duration: "12 weeks", price: 698.00 },
        { id: "pf-c2", name: "GH Secretagogue High-Dose / IGF-1", duration: "12 weeks", price: 642.00 },
        { id: "pf-c3", name: "GH / Vitamin / Neuropeptide", duration: "12 weeks", price: 679.00 },
        { id: "pf-c4", name: "Lyophilized GH Secretagogue", duration: "12 weeks", price: 549.00 },
        { id: "pf-c5", name: "Capsule Performance Protocol", duration: "12 weeks", price: 499.00 },
      ],
      essential: [
        { id: "pf-e1", name: "GH Secretagogue / Mitochondrial", duration: "12 weeks", price: 436.00 },
        { id: "pf-e2", name: "GH Secretagogue / IGF-1", duration: "12 weeks", price: 421.00 },
        { id: "pf-e3", name: "GH / Vitamin / Neuropeptide", duration: "12 weeks", price: 418.00 },
        { id: "pf-e4", name: "Lyophilized GH Secretagogue", duration: "12 weeks", price: 397.00 },
        { id: "pf-e5", name: "Capsule Performance Protocol", duration: "12 weeks", price: 387.00 },
      ],
    },
  },

  /* ── Immunity ── */
  {
    id: "immunity",
    name: "Immunity",
    icon: Shield,
    description: "Immune-modulating protocols designed to strengthen resilience, support gut barrier integrity, and optimize immune surveillance.",
    gendered: false,
    tiers: {
      premier: [
        { id: "im-p1", name: "Thymosin Alpha-1 / Beta-4", duration: "8 weeks", price: 813.30 },
        { id: "im-p2", name: "TA1 / Glutathione / Larazotide", duration: "8 weeks", price: 863.00 },
        { id: "im-p3", name: "Lyophilized Immune Protocol", duration: "8 weeks", price: 853.30 },
        { id: "im-p4", name: "Capsule Immune Protocol", duration: "8 weeks", price: 728.00 },
      ],
      core: [
        { id: "im-c1", name: "Thymosin Alpha-1 / Beta-4", duration: "8 weeks", price: 653.00 },
        { id: "im-c2", name: "TA1 / Glutathione / Larazotide", duration: "8 weeks", price: 598.00 },
        { id: "im-c3", name: "Lyophilized Immune Protocol", duration: "8 weeks", price: 520.00 },
        { id: "im-c4", name: "Capsule Immune Protocol", duration: "8 weeks", price: 420.00 },
      ],
      essential: [
        { id: "im-e1", name: "Thymosin Alpha-1 / Beta-4", duration: "8 weeks", price: 513.00 },
        { id: "im-e2", name: "TA1 / Glutathione / Larazotide", duration: "8 weeks", price: 468.00 },
        { id: "im-e3", name: "Lyophilized Immune Protocol", duration: "8 weeks", price: 402.00 },
        { id: "im-e4", name: "Capsule Immune Protocol", duration: "8 weeks", price: 350.00 },
      ],
    },
  },

  /* ── Sexual Well-Being (gendered) ── */
  {
    id: "sexual",
    name: "Sexual Well-Being",
    icon: Heart,
    description: "Targeted protocols for sexual health, libido, and intimate wellness — with formulations designed specifically for her and for him.",
    gendered: true,
    her: {
      premier: [
        { id: "sx-hp1", name: "SQ Injectable & Topical", duration: "4 weeks", price: 209.90 },
      ],
      core: [
        { id: "sx-hc1", name: "Nasal Spray & Topical", duration: "4 weeks", price: 201.00 },
      ],
      essential: [
        { id: "sx-he1", name: "Nasal Spray", duration: "4 weeks", price: 100.00 },
        { id: "sx-he2", name: "Troche Protocol", duration: "4 weeks", price: 120.00 },
      ],
    },
    him: {
      premier: [
        { id: "sx-mp1", name: "Injectable & SQ", duration: "4 weeks", price: 244.80 },
      ],
      core: [
        { id: "sx-mc1", name: "Nasal Spray & Troche", duration: "4 weeks", price: 240.00 },
      ],
      essential: [
        { id: "sx-me1", name: "Troche Protocol", duration: "4 weeks", price: 130.00 },
      ],
    },
  },

  /* ── Cognitive Enhancement ── */
  {
    id: "cognitive",
    name: "Cognitive Enhancement",
    icon: Brain,
    description: "Neuropeptide protocols for focus, memory, and cognitive longevity — from foundational nootropic support to advanced neurotrophin stacks.",
    gendered: false,
    tiers: {
      premier: [
        { id: "ce-p1", name: "Rg3 / Methylcobalamin / Alpha-GPC / Dihexa", duration: "8 weeks", price: 361.25 },
        { id: "ce-p2", name: "Semax / Dihexa", duration: "8 weeks", price: 371.25 },
        { id: "ce-p3", name: "Rg3 / NAD+ / Dihexa", duration: "8 weeks", price: 401.25 },
      ],
      core: [
        { id: "ce-c1", name: "Rg3 / Methylcobalamin / Alpha-GPC", duration: "8 weeks", price: 172.00 },
        { id: "ce-c2", name: "Semax / Nootropic Support", duration: "8 weeks", price: 168.00 },
        { id: "ce-c3", name: "Rg3 / NAD+", duration: "8 weeks", price: 162.00 },
      ],
      essential: [
        { id: "ce-e1", name: "Rg3 / Methylcobalamin", duration: "8 weeks", price: 103.00 },
        { id: "ce-e2", name: "Semax Nasal", duration: "8 weeks", price: 98.00 },
        { id: "ce-e3", name: "Rg3 / NAD+", duration: "8 weeks", price: 93.00 },
      ],
    },
  },

  /* ── Hair Restore (gendered) ── */
  {
    id: "hair",
    name: "Hair Restore",
    icon: Scissors,
    description: "Clinically informed hair restoration protocols combining growth factors, DHT blockers, and follicle-stimulating peptides.",
    gendered: true,
    her: {
      premier: [
        { id: "hr-hp1", name: "GHK-Cu + Zinc Thymulin / Bimatoprost", duration: "12 weeks", price: 295.00 },
      ],
      core: [
        { id: "hr-hc1", name: "GHK-Cu / Bimatoprost", duration: "12 weeks", price: 215.00 },
      ],
      essential: [
        { id: "hr-he1", name: "GHK-Cu Topical Combo", duration: "12 weeks", price: 170.00 },
      ],
    },
    him: {
      premier: [
        { id: "hr-mp1", name: "Dutasteride / Minoxidil / Bimatoprost", duration: "12 weeks", price: 285.00 },
      ],
      core: [
        { id: "hr-mc1", name: "Bimatoprost / Finasteride", duration: "12 weeks", price: 275.00 },
      ],
      essential: [
        { id: "hr-me1", name: "Finasteride Topical", duration: "12 weeks", price: 147.00 },
        { id: "hr-me2", name: "Minoxidil Combo", duration: "12 weeks", price: 138.00 },
      ],
    },
  },

  /* ── Derm & Aesthetics ── */
  {
    id: "derm",
    name: "Derm & Aesthetics",
    icon: Sparkles,
    description: "Skin rejuvenation and anti-aging protocols combining collagen-stimulating peptides, growth factors, and targeted topicals.",
    gendered: false,
    tiers: {
      premier: [
        { id: "da-p1", name: "GAL Cream / NAD+ / GH Secretagogue", duration: "12 weeks", price: 533.20 },
        { id: "da-p2", name: "GHK-Cu / BPC-157 / Oxytocin", duration: "12 weeks", price: 565.20 },
        { id: "da-p3", name: "GAL Cream / GHK-Cu / BPC-157", duration: "12 weeks", price: 558.20 },
      ],
      core: [
        { id: "da-c1", name: "GAL Cream / NAD+", duration: "12 weeks", price: 408.00 },
        { id: "da-c2", name: "GHK-Cu / BPC-157", duration: "12 weeks", price: 378.00 },
        { id: "da-c3", name: "GAL Cream / GHK-Cu", duration: "12 weeks", price: 348.00 },
      ],
      essential: [
        { id: "da-e1", name: "GAL Cream Topical", duration: "12 weeks", price: 152.00 },
        { id: "da-e2", name: "GHK-Cu Topical", duration: "12 weeks", price: 118.00 },
        { id: "da-e3", name: "BPC-157 Topical", duration: "12 weeks", price: 75.00 },
      ],
    },
  },

  /* ── Anti-Inflammatory ── */
  {
    id: "antiinflam",
    name: "Anti-Inflammatory",
    icon: Flame,
    description: "Systemic anti-inflammatory protocols combining tissue-repair peptides with immune modulators to reduce chronic inflammation.",
    gendered: false,
    tiers: {
      premier: [
        { id: "ai-p1", name: "BPC-157+TB4 / GH Secretagogue", duration: "8 weeks", price: 1076.40 },
        { id: "ai-p2", name: "BPC-157+TB4 / ABP-7 I", duration: "8 weeks", price: 1058.30 },
        { id: "ai-p3", name: "BPC-157+TB4 / ABP-7 II", duration: "8 weeks", price: 1190.10 },
        { id: "ai-p4", name: "Lyophilized Anti-Inflammatory", duration: "8 weeks", price: 833.30 },
        { id: "ai-p5", name: "Capsule Anti-Inflammatory Protocol", duration: "8 weeks", price: 700.00 },
      ],
      core: [
        { id: "ai-c1", name: "BPC-157+TB4 / GH Secretagogue", duration: "8 weeks", price: 736.00 },
        { id: "ai-c2", name: "BPC-157+TB4 / ABP-7 I", duration: "8 weeks", price: 612.00 },
        { id: "ai-c3", name: "BPC-157+TB4 / ABP-7 II", duration: "8 weeks", price: 648.00 },
        { id: "ai-c4", name: "Lyophilized Anti-Inflammatory", duration: "8 weeks", price: 468.00 },
        { id: "ai-c5", name: "Capsule Anti-Inflammatory Protocol", duration: "8 weeks", price: 308.00 },
      ],
      essential: [
        { id: "ai-e1", name: "BPC-157+TB4 / GH Secretagogue", duration: "8 weeks", price: 526.00 },
        { id: "ai-e2", name: "BPC-157+TB4 / ABP-7 I", duration: "8 weeks", price: 398.00 },
        { id: "ai-e3", name: "BPC-157+TB4 / ABP-7 II", duration: "8 weeks", price: 436.00 },
        { id: "ai-e4", name: "Lyophilized Anti-Inflammatory", duration: "8 weeks", price: 278.00 },
        { id: "ai-e5", name: "Capsule Anti-Inflammatory Protocol", duration: "8 weeks", price: 189.00 },
      ],
    },
  },
];

/* ───────────────────────── card component ──────────────────────── */

const CARD_STYLE = (borderColor: string): React.CSSProperties => ({
  background: "rgba(255,255,255,0.03)",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  border: `1px solid ${borderColor}`,
  boxShadow: "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)",
});

const ProtocolCardEl = ({ card, tier }: { card: ProtocolCard; tier: keyof typeof tierMeta }) => (
  <div
    className="pv-card-reveal pv-hover-lift flex flex-col p-5"
    style={CARD_STYLE(tierMeta[tier].border)}
  >
    <h3 className="text-sm font-heading font-light text-foreground mb-2 leading-snug">
      {card.name}
    </h3>
    <p className="text-[10px] text-muted-foreground/50 font-body font-extralight mb-4">
      {card.duration}
    </p>
    <div className="mt-auto">
      <span className="text-2xl font-heading font-light text-foreground">
        ${card.price.toFixed(2)}
      </span>
      <button
        onClick={openCalendly}
        className="w-full mt-4 py-2.5 flex items-center justify-center gap-2 text-[10px] tracking-[0.2em] uppercase font-body font-light bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
      >
        Book a Consultation
        <ArrowRight size={12} />
      </button>
    </div>
  </div>
);

/* ─────────────── tier section (badge + card grid) ─────────────── */

const TierSection = ({ tier, cards }: { tier: keyof typeof tierMeta; cards: ProtocolCard[] }) => {
  if (cards.length === 0) return null;
  const meta = tierMeta[tier];
  return (
    <div className="mb-10">
      <div className="flex items-center gap-3 mb-5">
        <span className={`text-[10px] tracking-[0.25em] uppercase font-body px-3 py-1 border ${meta.badge}`}>
          {meta.label}
        </span>
        <div className="flex-1 h-px bg-border/40" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <ProtocolCardEl key={c.id} card={c} tier={tier} />
        ))}
      </div>
    </div>
  );
};

/* ───────────────────────── page component ─────────────────────── */

const Protocols = () => {
  const [activeCatId, setActiveCatId] = useState(CATEGORIES[0].id);
  const activeCat = CATEGORIES.find((c) => c.id === activeCatId) || CATEGORIES[0];

  const contentRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const cards = contentRef.current?.querySelectorAll<HTMLElement>(".pv-card-reveal");
    if (!cards?.length) return;
    const obs = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            (e.target as HTMLElement).classList.add("pv-visible");
            obs.unobserve(e.target);
          }
        }),
      { threshold: 0.04 },
    );
    cards.forEach((c, i) => {
      c.style.animationDelay = `${Math.min(i * 0.04, 0.16)}s`;
      obs.observe(c);
    });
    return () => obs.disconnect();
  }, [activeCatId]);

  return (
    <div
      className="min-h-screen bg-background"
      style={{
        backgroundImage:
          "radial-gradient(ellipse 60% 40% at 70% 10%, hsl(39 38% 60% / 0.05) 0%, transparent 55%), radial-gradient(ellipse 50% 35% at 20% 80%, hsl(39 38% 40% / 0.04) 0%, transparent 55%)",
      }}
    >
      <SEO
        title="Precision Protocols | Tiered Treatment Packages"
        description="Explore our physician-directed precision protocols across Weight Management, Injury & Repair, Performance, Immunity, and more. Choose Premier, Core, or Essential tiers."
        canonical="/protocols"
      />
      <Navbar />

      <main className="pt-24 pb-20">
        {/* Header */}
        <section className="max-w-4xl mx-auto text-center px-6 mb-14">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="text-xs tracking-[0.35em] uppercase text-primary font-body font-light mb-4"
          >
            Precision Protocols
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.05 }}
            className="text-4xl md:text-5xl lg:text-6xl font-heading font-light text-foreground mb-6"
          >
            Curated Treatment Packages
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.1 }}
            className="text-muted-foreground font-body font-light text-sm md:text-base max-w-2xl mx-auto leading-relaxed"
          >
            Physician-directed multi-compound protocols designed for specific health
            goals. Each protocol is available in three tiers — Premier, Core, and
            Essential — so you can choose the intensity that fits your journey.
          </motion.p>
        </section>

        {/* Category Tabs — scrollable on mobile */}
        <div className="max-w-6xl mx-auto px-4 mb-14">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide sm:flex-wrap sm:justify-center sm:overflow-visible sm:pb-0">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isActive = cat.id === activeCatId;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCatId(cat.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 md:px-4 md:py-2.5 text-[9px] md:text-[10px] tracking-[0.15em] uppercase font-body font-light border whitespace-nowrap transition-all duration-200 shrink-0 ${
                    isActive
                      ? "bg-primary text-primary-foreground border-primary"
                      : "border-border/50 text-muted-foreground hover:text-foreground hover:border-primary/40"
                  }`}
                >
                  <Icon size={13} strokeWidth={1.2} className="hidden sm:block" />
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Category Description */}
        <motion.div
          key={activeCat.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-3xl mx-auto text-center px-6 mb-12"
        >
          <p className="text-muted-foreground font-body font-light text-sm leading-relaxed">
            {activeCat.description}
          </p>
        </motion.div>

        {/* Tier Legend */}
        <div className="max-w-4xl mx-auto px-6 mb-10">
          <div className="grid grid-cols-3 gap-4">
            {TIERS.map((t) => {
              const meta = tierMeta[t];
              return (
                <div key={t} className="text-center">
                  <span
                    className={`inline-block text-[10px] tracking-[0.2em] uppercase font-body px-3 py-1 border ${meta.badge} mb-2`}
                  >
                    {meta.label}
                  </span>
                  <p className="text-[10px] text-muted-foreground font-body font-light leading-relaxed">
                    {meta.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Protocol content */}
        <div ref={contentRef} className="max-w-6xl mx-auto px-6">
          {activeCat.gendered ? (
            /* ── Gendered layout: two columns ── */
            <div className="grid md:grid-cols-2 gap-8 md:gap-12">
              {(["her", "him"] as const).map((gender) => {
                const genderTiers = (activeCat as GenderedCategory)[gender];
                return (
                  <div key={gender}>
                    <h2 className="text-center text-sm tracking-[0.25em] uppercase font-body font-light text-foreground/70 mb-8 pb-3 border-b border-border/30">
                      {gender === "her" ? "For Her" : "For Him"}
                    </h2>
                    {TIERS.map((tier) => (
                      <TierSection key={tier} tier={tier} cards={genderTiers[tier]} />
                    ))}
                  </div>
                );
              })}
            </div>
          ) : (
            /* ── Standard tiered layout ── */
            <>
              {TIERS.map((tier) => (
                <TierSection
                  key={tier}
                  tier={tier}
                  cards={(activeCat as StandardCategory).tiers[tier]}
                />
              ))}
            </>
          )}
        </div>

        {/* Bottom CTA */}
        <section className="max-w-3xl mx-auto text-center px-6 mt-16">
          <p className="text-muted-foreground font-body font-light text-sm leading-relaxed">
            All protocols are physician-directed and customized to your lab results.
            Need guidance choosing the right protocol?{" "}
            <button onClick={openCalendly} className="text-primary hover:underline">
              Book a free consultation
            </button>{" "}
            with our clinical team.
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Protocols;
