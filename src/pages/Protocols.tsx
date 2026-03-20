import SEO from "@/components/SEO";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { openCalendly } from "@/hooks/useCalendly";
import {
  Scale, Heart, Flame, Sparkles, Scissors, Bandage, Zap, Shield,
  Brain, ArrowRight,
} from "lucide-react";
import {
  CATEGORIES,
  TIERS,
  tierMeta,
  slugify,
  type CategoryData,
  type StandardCategory,
  type GenderedCategory,
  type ProtocolCard,
  type Tier,
} from "@/data/protocolData";

/* ───────────── icon map (icons are view-layer, not in data module) ── */

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  weight: Scale,
  injury: Bandage,
  performance: Zap,
  immunity: Shield,
  sexual: Heart,
  cognitive: Brain,
  hair: Scissors,
  derm: Sparkles,
  antiinflam: Flame,
};

/* ───────────────────────── card styles ──────────────────────────── */

const CARD_GLASS: React.CSSProperties = {
  background: "rgba(255,255,255,0.03)",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  boxShadow: "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)",
};

/* ───────────────────────── card component ──────────────────────── */

const ProtocolCardEl = ({ card, tier, categoryId }: { card: ProtocolCard; tier: Tier; categoryId: string }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      to={`/protocols/${categoryId}/${slugify(card.name)}`}
      className="flex flex-col h-full"
      style={{
        ...CARD_GLASS,
        border: `1px solid ${hovered ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.08)"}`,
        boxShadow: hovered
          ? "0 16px 48px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)"
          : CARD_GLASS.boxShadow as string,
        transition: "border-color 0.3s ease, box-shadow 0.3s ease",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="p-5 flex-1">
        {/* Tier badge */}
        <p className="text-[8px] tracking-[0.2em] uppercase font-body font-extralight text-muted-foreground/40 mb-3">
          {tierMeta[tier].label}
        </p>

        {/* Protocol name */}
        <p className="text-lg font-heading font-light text-foreground/90 mb-1">
          {card.name}
        </p>
        <p className="text-[10px] tracking-[0.15em] uppercase text-muted-foreground/50 font-body font-extralight mb-4">
          {card.duration}
        </p>
      </div>

      {/* CTA */}
      <div className="px-5 pb-5">
        <span className="w-full py-2.5 border border-border/40 text-center text-[10px] font-body font-extralight tracking-[0.2em] uppercase text-muted-foreground/50 hover:text-foreground/70 hover:border-border/60 transition-colors flex items-center justify-center gap-2">
          View Protocol
          <ArrowRight size={10} />
        </span>
      </div>
    </Link>
  );
};

/* ─────────────── tier section (centered divider + card grid) ───── */

const TierSection = ({ tier, cards, categoryId }: { tier: Tier; cards: ProtocolCard[]; categoryId: string }) => {
  if (cards.length === 0) return null;
  const meta = tierMeta[tier];

  return (
    <div className="mb-14">
      {/* Centered tier divider */}
      <div className="flex items-center gap-4 mb-8">
        <div className="flex-1 h-px" style={{ background: `linear-gradient(to right, transparent, ${meta.borderIdle})` }} />
        <div
          className="flex items-center gap-2.5 px-5 py-1.5 rounded-sm"
          style={{ background: meta.badgeBg, border: `1px solid ${meta.badgeBorder}` }}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-white/30" />
          <span className={`text-[10px] tracking-[0.3em] uppercase font-body font-light ${meta.badge}`}>
            {meta.label}
          </span>
        </div>
        <div className="flex-1 h-px" style={{ background: `linear-gradient(to left, transparent, ${meta.borderIdle})` }} />
      </div>

      {/* Cards */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <ProtocolCardEl key={c.id} card={c} tier={tier} categoryId={categoryId} />
        ))}
      </div>
    </div>
  );
};

/* ───────────────────────── page component ─────────────────────── */

const Protocols = () => {
  const [activeCatId, setActiveCatId] = useState(CATEGORIES[0].id);
  const activeCat = CATEGORIES.find((c) => c.id === activeCatId) || CATEGORIES[0];
  const tabsRef = useRef<HTMLDivElement>(null);

  /* Scroll active tab into view on mobile */
  useEffect(() => {
    const container = tabsRef.current;
    if (!container) return;
    const activeBtn = container.querySelector("[data-active='true']") as HTMLElement | null;
    if (activeBtn) {
      activeBtn.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
  }, [activeCatId]);

  return (
    <div
      className="min-h-screen bg-background"
      style={{
        backgroundImage: [
          "radial-gradient(ellipse 80% 50% at 20% 0%, hsl(39 38% 60% / 0.06) 0%, transparent 60%)",
          "radial-gradient(ellipse 60% 40% at 80% 100%, hsl(39 38% 40% / 0.04) 0%, transparent 55%)",
          "radial-gradient(ellipse 40% 30% at 50% 50%, hsl(220 20% 30% / 0.03) 0%, transparent 50%)",
        ].join(", "),
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
        <section className="max-w-4xl mx-auto text-center px-6 mb-16">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-xs tracking-[0.35em] uppercase font-body font-light mb-4 text-primary"
          >
            Precision Protocols
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="text-4xl md:text-5xl lg:text-6xl font-heading font-light text-foreground mb-6"
          >
            Curated Treatment Packages
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-muted-foreground font-body font-light text-sm md:text-base max-w-2xl mx-auto leading-relaxed"
          >
            Physician-directed multi-compound protocols designed for specific health
            goals. Each protocol is available in three tiers - Premier, Core, and
            Essential - so you can choose the intensity that fits your journey.
          </motion.p>
        </section>

        {/* Category Tabs */}
        <div className="max-w-6xl mx-auto px-4 mb-16">
          <div
            ref={tabsRef}
            className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide sm:flex-wrap sm:justify-center sm:overflow-visible sm:pb-0"
          >
            {CATEGORIES.map((cat) => {
              const Icon = CATEGORY_ICONS[cat.id] || Zap;
              const isActive = cat.id === activeCatId;
              return (
                <button
                  key={cat.id}
                  data-active={isActive}
                  onClick={() => setActiveCatId(cat.id)}
                  className={`flex items-center gap-1.5 px-4 py-2 text-[9px] tracking-[0.2em] uppercase font-body font-extralight border whitespace-nowrap shrink-0 transition-all duration-300 ${
                    isActive
                      ? "bg-primary/10 text-primary/80 border-primary/20"
                      : "border-border/40 text-muted-foreground/50 hover:text-foreground/60 hover:border-border/60"
                  }`}
                >
                  <Icon size={9} strokeWidth={1.5} className="hidden sm:inline" />
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Category Description */}
        <motion.div
          key={activeCat.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="max-w-3xl mx-auto text-center px-6 mb-14"
        >
          <p className="text-muted-foreground font-body font-light text-sm leading-relaxed">
            {activeCat.description}
          </p>
        </motion.div>

        {/* Tier Legend */}
        <div className="max-w-4xl mx-auto px-6 mb-12">
          <div className="grid grid-cols-3 gap-6">
            {TIERS.map((t) => {
              const meta = tierMeta[t];
              return (
                <div key={t} className="text-center">
                  <div className="inline-flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-white/30" />
                    <span className={`text-[10px] tracking-[0.25em] uppercase font-body font-light ${meta.badge}`}>
                      {meta.label}
                    </span>
                  </div>
                  <p className="text-[10px] text-muted-foreground/50 font-body font-extralight leading-relaxed">
                    {meta.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Protocol content */}
        <div className="max-w-6xl mx-auto px-6">
          {activeCat.gendered ? (
            <div className="grid md:grid-cols-2 gap-8 md:gap-14">
              {(["her", "him"] as const).map((gender) => {
                const genderTiers = (activeCat as GenderedCategory)[gender];
                return (
                  <div key={gender}>
                    <div className="flex items-center gap-4 mb-10">
                      <div className="flex-1 h-px bg-gradient-to-r from-transparent to-border/30" />
                      <h2 className="text-sm tracking-[0.3em] uppercase font-body font-light px-4 text-primary/70">
                        {gender === "her" ? "For Her" : "For Him"}
                      </h2>
                      <div className="flex-1 h-px bg-gradient-to-l from-transparent to-border/30" />
                    </div>
                    {TIERS.map((tier) => (
                      <TierSection key={tier} tier={tier} cards={genderTiers[tier]} categoryId={activeCat.id} />
                    ))}
                  </div>
                );
              })}
            </div>
          ) : (
            <>
              {TIERS.map((tier) => (
                <TierSection
                  key={tier}
                  tier={tier}
                  cards={(activeCat as StandardCategory).tiers[tier]}
                  categoryId={activeCat.id}
                />
              ))}
            </>
          )}
        </div>

        {/* Bottom CTA */}
        <section className="max-w-3xl mx-auto text-center px-6 mt-20">
          <div className="h-px w-24 mx-auto mb-8 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
          <p className="text-muted-foreground font-body font-light text-sm leading-relaxed">
            All protocols are physician-directed and customized to your lab results.
            Need guidance choosing the right protocol?{" "}
            <button onClick={openCalendly} className="text-primary hover:underline transition-colors">
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
