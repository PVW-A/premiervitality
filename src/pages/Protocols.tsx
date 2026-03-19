import SEO from "@/components/SEO";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { openCalendly } from "@/hooks/useCalendly";
import {
  Scale, Heart, Flame, Sparkles, Scissors, Bandage, Zap, Shield,
  ChevronDown, ArrowRight,
} from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  Scale, Heart, Flame, Sparkles, Scissors, Bandage, Zap, Shield,
};

const tierMeta: Record<string, { label: string; color: string; border: string; badge: string; description: string }> = {
  premier: {
    label: "Premier",
    color: "text-amber-400",
    border: "border-amber-500/40",
    badge: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    description: "Elevated solutions for full-spectrum optimization",
  },
  core: {
    label: "Core",
    color: "text-sky-400",
    border: "border-sky-500/40",
    badge: "bg-sky-500/15 text-sky-400 border-sky-500/30",
    description: "Strategic balance of efficacy and value",
  },
  essential: {
    label: "Essential",
    color: "text-rose-400",
    border: "border-rose-500/40",
    badge: "bg-rose-400/15 text-rose-400 border-rose-400/30",
    description: "Foundational support for targeted needs",
  },
};

interface ProtocolItem {
  product: string;
  dose: string;
  cost: number;
  price: number;
  rationale?: string;
}

interface Protocol {
  id: string;
  category_id: string;
  name: string;
  tier: string;
  description: string | null;
  items: unknown;
  total_cost: number;
  total_price: number;
  duration_weeks: number;
  sort_order: number;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  sort_order: number;
}

const FALLBACK_CATEGORIES: Category[] = [
  { id: "weight", name: "Weight Management", slug: "weight", description: "Physician-directed protocols targeting metabolic optimization, appetite regulation, and sustainable body composition change.", icon: "Scale", sort_order: 1 },
  { id: "wellness", name: "Wellness & Longevity", slug: "wellness", description: "Comprehensive protocols designed to enhance cellular health, immune resilience, and overall vitality for long-term well-being.", icon: "Heart", sort_order: 2 },
  { id: "performance", name: "Performance & Recovery", slug: "performance", description: "Targeted protocols for athletic performance, tissue repair, and accelerated recovery between training sessions.", icon: "Zap", sort_order: 3 },
  { id: "hormones", name: "Hormone Optimization", slug: "hormones", description: "Precision protocols to restore and optimize hormonal balance for energy, mood, and metabolic function.", icon: "Flame", sort_order: 4 },
];

const FALLBACK_PROTOCOLS: Protocol[] = [
  // Weight Management
  { id: "w-premier", category_id: "weight", name: "Elite Metabolic Reset", tier: "premier", description: "Our most comprehensive weight management protocol combining GLP-1 therapy with metabolic support peptides for maximum results.", items: [{ product: "Semaglutide", dose: "0.25–2.4 mg/week titration", cost: 0, price: 299, rationale: "GLP-1 receptor agonist for appetite regulation and metabolic optimization" }, { product: "BPC-157", dose: "500 mcg/day SQ", cost: 0, price: 89, rationale: "Gut healing and systemic tissue repair support" }, { product: "AOD 9604", dose: "300 mcg/day", cost: 0, price: 119, rationale: "Fat metabolism fragment of growth hormone" }], total_cost: 0, total_price: 507, duration_weeks: 12, sort_order: 1 },
  { id: "w-core", category_id: "weight", name: "Metabolic Accelerator", tier: "core", description: "Strategic weight management combining GLP-1 therapy with targeted metabolic support.", items: [{ product: "Semaglutide", dose: "0.25–2.4 mg/week titration", cost: 0, price: 299, rationale: "Primary appetite regulation and metabolic support" }, { product: "AOD 9604", dose: "300 mcg/day", cost: 0, price: 119, rationale: "Targeted fat metabolism support" }], total_cost: 0, total_price: 418, duration_weeks: 12, sort_order: 2 },
  { id: "w-essential", category_id: "weight", name: "Metabolic Foundations", tier: "essential", description: "Foundational GLP-1 protocol for steady, physician-guided weight management.", items: [{ product: "Semaglutide", dose: "0.25–1.0 mg/week titration", cost: 0, price: 249, rationale: "Clinically proven GLP-1 agonist for weight management" }], total_cost: 0, total_price: 249, duration_weeks: 12, sort_order: 3 },
  // Wellness & Longevity
  { id: "l-premier", category_id: "wellness", name: "Total Vitality Protocol", tier: "premier", description: "A full-spectrum longevity protocol targeting cellular repair, immune defense, and systemic rejuvenation.", items: [{ product: "NAD+ IV Therapy", dose: "500 mg IV weekly", cost: 0, price: 350, rationale: "Cellular energy and DNA repair" }, { product: "Thymosin Alpha-1", dose: "1.6 mg 2x/week SQ", cost: 0, price: 199, rationale: "Immune system modulation and resilience" }, { product: "BPC-157", dose: "500 mcg/day SQ", cost: 0, price: 89, rationale: "Systemic tissue repair and gut health" }], total_cost: 0, total_price: 638, duration_weeks: 8, sort_order: 4 },
  { id: "l-core", category_id: "wellness", name: "Cellular Renewal", tier: "core", description: "Targeted longevity support combining cellular energy optimization with immune modulation.", items: [{ product: "NAD+ IV Therapy", dose: "250 mg IV bi-weekly", cost: 0, price: 225, rationale: "Cellular energy restoration" }, { product: "Thymosin Alpha-1", dose: "1.6 mg 2x/week SQ", cost: 0, price: 199, rationale: "Immune optimization" }], total_cost: 0, total_price: 424, duration_weeks: 8, sort_order: 5 },
  { id: "l-essential", category_id: "wellness", name: "Longevity Basics", tier: "essential", description: "Essential immune and cellular support for everyday vitality.", items: [{ product: "Thymosin Alpha-1", dose: "1.6 mg 2x/week SQ", cost: 0, price: 199, rationale: "Foundational immune support" }], total_cost: 0, total_price: 199, duration_weeks: 8, sort_order: 6 },
  // Performance & Recovery
  { id: "p-premier", category_id: "performance", name: "Peak Performance Stack", tier: "premier", description: "Elite-level recovery and performance protocol for serious athletes and active individuals.", items: [{ product: "BPC-157", dose: "500 mcg/day SQ", cost: 0, price: 89, rationale: "Accelerated tissue repair and recovery" }, { product: "TB-500", dose: "750 mcg 2x/week SQ", cost: 0, price: 129, rationale: "Systemic tissue regeneration and flexibility" }, { product: "CJC-1295/Ipamorelin", dose: "300 mcg/300 mcg nightly SQ", cost: 0, price: 179, rationale: "Growth hormone optimization for recovery and lean mass" }], total_cost: 0, total_price: 397, duration_weeks: 10, sort_order: 7 },
  { id: "p-core", category_id: "performance", name: "Recovery Accelerator", tier: "core", description: "Targeted recovery support combining tissue repair peptides for faster bounce-back.", items: [{ product: "BPC-157", dose: "500 mcg/day SQ", cost: 0, price: 89, rationale: "Tissue healing and anti-inflammatory support" }, { product: "TB-500", dose: "750 mcg 2x/week SQ", cost: 0, price: 129, rationale: "Complementary tissue regeneration" }], total_cost: 0, total_price: 218, duration_weeks: 10, sort_order: 8 },
  { id: "p-essential", category_id: "performance", name: "Recovery Foundations", tier: "essential", description: "Foundational peptide support for injury recovery and general tissue health.", items: [{ product: "BPC-157", dose: "500 mcg/day SQ", cost: 0, price: 89, rationale: "Versatile healing peptide for gut and musculoskeletal repair" }], total_cost: 0, total_price: 89, duration_weeks: 10, sort_order: 9 },
  // Hormone Optimization
  { id: "h-premier", category_id: "hormones", name: "Complete Hormonal Reset", tier: "premier", description: "Comprehensive hormone optimization protocol addressing multiple axes for total endocrine balance.", items: [{ product: "CJC-1295/Ipamorelin", dose: "300 mcg/300 mcg nightly SQ", cost: 0, price: 179, rationale: "Growth hormone axis optimization" }, { product: "Gonadorelin", dose: "100 mcg 2x/week SQ", cost: 0, price: 99, rationale: "LH/FSH support for reproductive hormone balance" }, { product: "DHEA", dose: "25 mg/day oral", cost: 0, price: 45, rationale: "Adrenal precursor for downstream hormone support" }], total_cost: 0, total_price: 323, duration_weeks: 12, sort_order: 10 },
  { id: "h-core", category_id: "hormones", name: "Growth Hormone Support", tier: "core", description: "Targeted growth hormone optimization for energy, sleep, and body composition.", items: [{ product: "CJC-1295/Ipamorelin", dose: "300 mcg/300 mcg nightly SQ", cost: 0, price: 179, rationale: "Stimulates natural GH release" }, { product: "DHEA", dose: "25 mg/day oral", cost: 0, price: 45, rationale: "Hormonal precursor support" }], total_cost: 0, total_price: 224, duration_weeks: 12, sort_order: 11 },
  { id: "h-essential", category_id: "hormones", name: "GH Foundations", tier: "essential", description: "Entry-level growth hormone secretagogue protocol for sleep and recovery benefits.", items: [{ product: "CJC-1295/Ipamorelin", dose: "300 mcg/300 mcg nightly SQ", cost: 0, price: 179, rationale: "Clinically studied GH secretagogue combination" }], total_cost: 0, total_price: 179, duration_weeks: 12, sort_order: 12 },
];

const Protocols = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [expandedProtocol, setExpandedProtocol] = useState<string | null>(null);

  const { data: dbCategories } = useQuery({
    queryKey: ["protocol-categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("protocol_categories")
        .select("*")
        .order("sort_order");
      if (error) throw error;
      return data as Category[];
    },
  });

  const { data: dbProtocols, isLoading } = useQuery({
    queryKey: ["protocols"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("protocols")
        .select("*")
        .order("sort_order");
      if (error) throw error;
      return data as unknown as Protocol[];
    },
  });

  // Use DB data if available, otherwise fall back to hardcoded content
  const categories = dbCategories && dbCategories.length > 0 ? dbCategories : FALLBACK_CATEGORIES;
  const protocols = dbProtocols && dbProtocols.length > 0 ? dbProtocols : FALLBACK_PROTOCOLS;

  const selectedCatId = activeCategory || categories?.[0]?.id || null;
  const selectedCat = categories?.find((c) => c.id === selectedCatId);
  const catProtocols = protocols?.filter((p) => p.category_id === selectedCatId) || [];

  const protocolsRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const cards = protocolsRef.current?.querySelectorAll<HTMLElement>(".pv-card-reveal");
    if (!cards?.length) return;
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) { (e.target as HTMLElement).classList.add("pv-visible"); obs.unobserve(e.target); }
      }),
      { threshold: 0.04 }
    );
    cards.forEach((c, i) => { c.style.animationDelay = `${Math.min(i * 0.04, 0.16)}s`; obs.observe(c); });
    return () => obs.disconnect();
  }, [protocols, selectedCatId]);

  const tiers = ["premier", "core", "essential"] as const;

  return (
    <div className="min-h-screen bg-background" style={{ backgroundImage: "radial-gradient(ellipse 60% 40% at 70% 10%, hsl(39 38% 60% / 0.05) 0%, transparent 55%), radial-gradient(ellipse 50% 35% at 20% 80%, hsl(39 38% 40% / 0.04) 0%, transparent 55%)" }}>
      <SEO
        title="Precision Protocols | Tiered Treatment Packages"
        description="Explore our physician-directed precision protocols across Weight Management, Wellness, Performance, and more. Choose Premier, Core, or Essential tiers for your health goals."
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

        {/* Category Tabs */}
        <div className="max-w-5xl mx-auto px-4 mb-14">
          <div className="flex flex-wrap justify-center gap-2">
            {categories?.map((cat) => {
              const Icon = iconMap[cat.icon || ""] || Heart;
              const isActive = cat.id === selectedCatId;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setActiveCategory(cat.id);
                    setExpandedProtocol(null);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-2 md:px-5 md:py-3 text-[9px] md:text-[10px] tracking-[0.15em] uppercase font-body font-light rounded-none border transition-all duration-200 ${
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
        {selectedCat && (
          <motion.div
            key={selectedCat.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-3xl mx-auto text-center px-6 mb-12"
          >
            <p className="text-muted-foreground font-body font-light text-sm leading-relaxed">
              {selectedCat.description}
            </p>
          </motion.div>
        )}

        {/* Tier Legend */}
        <div className="max-w-4xl mx-auto px-6 mb-10">
          <div className="grid grid-cols-3 gap-4">
            {tiers.map((t) => {
              const meta = tierMeta[t];
              return (
                <div key={t} className="text-center">
                  <span className={`inline-block text-[10px] tracking-[0.2em] uppercase font-body px-3 py-1 border ${meta.badge} mb-2`}>
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

        {/* Protocols Grid */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="w-6 h-6 border border-primary/40 border-t-primary rounded-full animate-spin" />
          </div>
        ) : (
          <div ref={protocolsRef} className="max-w-6xl mx-auto px-6">
            {/* Group by protocol name similarity across tiers */}
            {tiers.map((tier) => {
              const tierProtos = catProtocols.filter((p) => p.tier === tier);
              if (tierProtos.length === 0) return null;
              const meta = tierMeta[tier];

              return (
                <div key={tier} className="mb-12">
                  <div className="flex items-center gap-3 mb-6">
                    <span className={`text-[10px] tracking-[0.25em] uppercase font-body px-3 py-1 border ${meta.badge}`}>
                      {meta.label}
                    </span>
                    <div className="flex-1 h-px bg-border/40" />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {tierProtos.map((proto) => {
                      const isExpanded = expandedProtocol === proto.id;
                      return (
                        <div
                          key={proto.id}
                          className="pv-card-reveal pv-hover-lift flex flex-col"
                          style={{
                            background: "rgba(255,255,255,0.03)",
                            backdropFilter: "blur(12px)",
                            WebkitBackdropFilter: "blur(12px)",
                            border: `1px solid ${tier === "premier" ? "rgba(251,191,36,0.25)" : tier === "core" ? "rgba(56,189,248,0.2)" : "rgba(251,113,133,0.2)"}`,
                            boxShadow: "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)",
                          }}
                        >
                          <button
                            onClick={() => setExpandedProtocol(isExpanded ? null : proto.id)}
                            className="w-full text-left p-6 pb-4"
                          >
                            <h3 className="text-sm font-heading font-light text-foreground mb-2 leading-snug">
                              {proto.name}
                            </h3>
                            <p className="text-[11px] text-muted-foreground font-body font-light leading-relaxed line-clamp-2 mb-4">
                              {proto.description}
                            </p>
                            <div className="flex items-baseline justify-between">
                              <div className="flex items-baseline gap-1">
                                <span className="text-2xl font-heading font-light text-foreground">
                                  ${proto.total_price.toFixed(2)}
                                </span>
                                <span className="text-[10px] text-muted-foreground font-body">
                                  / {proto.duration_weeks}-week protocol
                                </span>
                              </div>
                              <ChevronDown
                                size={16}
                                className={`text-muted-foreground transition-transform duration-200 ${
                                  isExpanded ? "rotate-180" : ""
                                }`}
                              />
                            </div>
                          </button>

                          <AnimatePresence>
                            {isExpanded && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="overflow-hidden"
                              >
                                <div className="px-6 pb-6 border-t border-border/30 pt-4">
                                  <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground font-body mb-3">
                                    Included Products
                                  </p>
                                  <div className="flex flex-col gap-4">
                                    {(proto.items as ProtocolItem[]).map((item, ii) => (
                                      <div key={ii} className="border-l-2 border-border/40 pl-3">
                                        <div className="flex items-start justify-between gap-2">
                                          <p className="text-[11px] font-body font-light text-foreground leading-snug flex-1">
                                            {item.product}
                                          </p>
                                          <span className="text-xs font-body text-primary shrink-0">
                                            ${item.price.toFixed(2)}
                                          </span>
                                        </div>
                                        {item.rationale && (
                                          <p className="text-[10px] text-primary/70 font-body font-light leading-relaxed mt-1.5 italic">
                                            {item.rationale}
                                          </p>
                                        )}
                                        <p className="text-[10px] text-muted-foreground/50 font-body font-light leading-relaxed mt-1">
                                          {item.dose}
                                        </p>
                                      </div>
                                    ))}
                                  </div>

                                  <div className="mt-5 pt-4 border-t border-border/30 flex items-center justify-between">
                                    <span className="text-xs text-muted-foreground font-body">
                                      Protocol Total
                                    </span>
                                    <span className="text-lg font-heading font-light text-foreground">
                                      ${proto.total_price.toFixed(2)}
                                    </span>
                                  </div>

                                  <button
                                    onClick={openCalendly}
                                    className="w-full mt-4 py-3 flex items-center justify-center gap-2 text-[10px] tracking-[0.2em] uppercase font-body font-light bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                                  >
                                    Schedule Consultation
                                    <ArrowRight size={13} />
                                  </button>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

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
