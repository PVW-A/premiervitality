import SEO from "@/components/SEO";
import { useState } from "react";
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

const Protocols = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [expandedProtocol, setExpandedProtocol] = useState<string | null>(null);

  const { data: categories } = useQuery({
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

  const { data: protocols, isLoading } = useQuery({
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

  const selectedCatId = activeCategory || categories?.[0]?.id || null;
  const selectedCat = categories?.find((c) => c.id === selectedCatId);
  const catProtocols = protocols?.filter((p) => p.category_id === selectedCatId) || [];

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
            transition={{ duration: 0.5 }}
            className="text-xs tracking-[0.35em] uppercase text-primary font-body font-light mb-4"
          >
            Precision Protocols
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-heading font-light text-foreground mb-6"
          >
            Curated Treatment Packages
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
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
          <div className="max-w-6xl mx-auto px-6">
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
                    {tierProtos.map((proto, i) => {
                      const isExpanded = expandedProtocol === proto.id;
                      return (
                        <motion.div
                          key={proto.id}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true, margin: "-40px" }}
                          transition={{ duration: 0.5, delay: i * 0.05 }}
                          whileHover={{ y: -4 }}
                          className="flex flex-col"
                          style={{
                            background: "rgba(255,255,255,0.03)",
                            backdropFilter: "blur(12px)",
                            WebkitBackdropFilter: "blur(12px)",
                            border: `1px solid ${tier === "premier" ? "rgba(251,191,36,0.25)" : tier === "core" ? "rgba(56,189,248,0.2)" : "rgba(251,113,133,0.2)"}`,
                            boxShadow: "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)",
                            transition: "transform 0.3s ease, box-shadow 0.3s ease",
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
                        </motion.div>
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
