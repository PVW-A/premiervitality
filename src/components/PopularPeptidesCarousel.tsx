import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import peptideVial from "@/assets/pv-branded-vial.png";

interface PeptideItem {
  id: string;
  name: string;
  category: string;
  benefits: string;
  description: string;
}

const categoryHues: Record<string, number> = {
  "Recovery & Healing": 168,
  "Weight Management": 25,
  "Anti-Aging & Performance": 262,
  "Cognitive & Mood": 200,
  "Immune Support": 45,
  "IV/IM Therapy": 340,
  Other: 0,
};

const AUTO_INTERVAL = 4500;

export default function PopularPeptidesCarousel() {
  const location = useLocation();
  const isOnPeptidePage = location.pathname === "/peptides";
  const [peptides, setPeptides] = useState<PeptideItem[]>([]);
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    supabase
      .from("peptides")
      .select("id, name, category, benefits, description")
      .not("benefits", "is", null)
      .not("description", "is", null)
      .not("name", "like", "%Lyophilized%")
      .not("name", "like", "%Capsule%")
      .order("name")
      .then(({ data }) => {
        if (!data) return;
        // Deduplicate by base name, keep first variation with benefits
        const seen = new Set<string>();
        const unique: PeptideItem[] = [];
        for (const p of data) {
          const base = p.name.split(" — ")[0];
          if (!seen.has(base) && p.benefits && p.description && p.category) {
            seen.add(base);
            unique.push({
              id: p.id,
              name: base,
              category: p.category,
              benefits: p.benefits,
              description: p.description,
            });
          }
        }
        setPeptides(unique.slice(0, 10));
      });
  }, []);

  const go = useCallback(
    (d: number) => {
      if (!peptides.length) return;
      setDirection(d);
      setActive((prev) => (prev + d + peptides.length) % peptides.length);
    },
    [peptides.length],
  );

  // Auto-advance
  useEffect(() => {
    if (paused || !peptides.length) return;
    const t = setInterval(() => go(1), AUTO_INTERVAL);
    return () => clearInterval(t);
  }, [paused, peptides.length, go]);

  if (!peptides.length) return null;

  const current = peptides[active];
  const hue = categoryHues[current.category] ?? 200;
  const benefitsList = current.benefits.split(",").map((b) => b.trim()).filter(Boolean);

  return (
    <section className="py-24 px-6 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          key={active}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(ellipse 60% 50% at 50% 50%, hsl(${hue} 60% 50% / 0.04), transparent 70%)`,
          }}
        />
      </div>

      <div className="max-w-5xl mx-auto relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-5"
            style={{
              background: "hsl(var(--primary) / 0.08)",
              border: "1px solid hsl(var(--primary) / 0.15)",
            }}
          >
            <Sparkles size={12} strokeWidth={1.5} className="text-primary" />
            <span className="text-[10px] tracking-[0.3em] uppercase text-primary font-body font-light">
              Popular Peptides
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl font-heading font-extralight text-foreground tracking-tight">
            Popular Peptides
          </h2>
        </motion.div>

        {/* Carousel card */}
        <div
          className="relative"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={current.id}
              custom={direction}
              initial={{ opacity: 0, x: direction * 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -60 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="rounded-2xl p-8 md:p-10"
              style={{
                background:
                  "linear-gradient(160deg, hsl(var(--card) / 0.9), hsl(var(--background) / 0.6))",
                border: "1px solid hsl(var(--border) / 0.5)",
                boxShadow: `0 0 60px -20px hsl(${hue} 60% 50% / 0.08), inset 0 1px 0 hsl(0 0% 100% / 0.03)`,
              }}
            >
              <div className="flex flex-col md:flex-row gap-8 items-center">
                {/* Vial visual */}
                <div className="flex-shrink-0 relative">
                  <div
                    className="w-28 h-28 rounded-2xl flex items-center justify-center relative"
                    style={{
                      background: `hsl(${hue} 50% 50% / 0.06)`,
                      border: `1px solid hsl(${hue} 50% 50% / 0.1)`,
                    }}
                  >
                    <img
                      src={peptideVial}
                      alt=""
                      className="w-16 h-16 object-contain"
                      style={{ filter: `drop-shadow(0 0 12px hsl(${hue} 60% 50% / 0.3))` }}
                    />
                  </div>
                  {/* Category badge */}
                  <div
                    className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full whitespace-nowrap"
                    style={{
                      background: `hsl(${hue} 50% 50% / 0.1)`,
                      border: `1px solid hsl(${hue} 50% 50% / 0.15)`,
                    }}
                  >
                    <span
                      className="text-[8px] tracking-[0.15em] uppercase font-body"
                      style={{ color: `hsl(${hue} 60% 55%)` }}
                    >
                      {current.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-2xl md:text-3xl font-heading font-extralight text-foreground mb-3">
                    {current.name}
                  </h3>
                  <p className="text-xs text-muted-foreground/60 font-body font-light leading-relaxed mb-5 max-w-lg">
                    {current.description}
                  </p>

                  {/* Benefits pills */}
                  <div className="flex flex-wrap gap-1.5 justify-center md:justify-start">
                    {benefitsList.map((b) => (
                      <span
                        key={b}
                        className="text-[10px] font-body font-light px-2.5 py-1 rounded-full text-foreground/70"
                        style={{
                          background: `hsl(${hue} 40% 50% / 0.06)`,
                          border: `1px solid hsl(${hue} 40% 50% / 0.08)`,
                        }}
                      >
                        {b}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Nav arrows */}
          <button
            onClick={() => go(-1)}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center transition-colors bg-card/80 border border-border/40 hover:border-primary/30 text-muted-foreground hover:text-foreground backdrop-blur-sm"
            aria-label="Previous peptide"
          >
            <ChevronLeft size={16} strokeWidth={1.3} />
          </button>
          <button
            onClick={() => go(1)}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center transition-colors bg-card/80 border border-border/40 hover:border-primary/30 text-muted-foreground hover:text-foreground backdrop-blur-sm"
            aria-label="Next peptide"
          >
            <ChevronRight size={16} strokeWidth={1.3} />
          </button>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-1.5 mt-6">
          {peptides.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setDirection(i > active ? 1 : -1);
                setActive(i);
              }}
              className="transition-all duration-300"
              aria-label={`Go to peptide ${i + 1}`}
            >
              <div
                className="rounded-full transition-all duration-300"
                style={{
                  width: i === active ? 20 : 6,
                  height: 6,
                  background:
                    i === active
                      ? `hsl(${hue} 60% 55%)`
                      : "hsl(var(--foreground) / 0.08)",
                  boxShadow:
                    i === active ? `0 0 8px hsl(${hue} 60% 55% / 0.4)` : "none",
                }}
              />
            </button>
          ))}
        </div>

        {/* CTA — hide when already on peptides page */}
        {!isOnPeptidePage && (
          <div className="text-center mt-10">
            <Link
              to="/peptides"
              className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase font-body font-light text-primary hover:text-foreground transition-colors"
            >
              View All Peptides
              <ChevronRight size={14} strokeWidth={1.3} />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
