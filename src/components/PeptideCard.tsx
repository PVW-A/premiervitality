import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, FlaskConical, Syringe, SprayCan, Pill, Droplets } from "lucide-react";
import peptideVial from "@/assets/peptide-vial.png";

interface PeptideVariation {
  id: string;
  name: string;
  price: number | null;
  unit: string | null;
  administration: string | null;
}

interface PeptideGroup {
  baseName: string;
  category: string | null;
  description: string | null;
  benefits: string | null;
  candidates: string | null;
  routes: string[];
  variations: PeptideVariation[];
}

const categoryColors: Record<string, string> = {
  "Recovery & Healing": "bg-green-500/15 text-green-400 border-green-500/25",
  "Weight Management": "bg-orange-500/15 text-orange-400 border-orange-500/25",
  "Anti-Aging & Performance": "bg-purple-500/15 text-purple-400 border-purple-500/25",
  "Sexual Wellness": "bg-pink-500/15 text-pink-400 border-pink-500/25",
  "Immune Support": "bg-blue-500/15 text-blue-400 border-blue-500/25",
  "Cognitive & Mood": "bg-cyan-500/15 text-cyan-400 border-cyan-500/25",
  "Skin & Hair": "bg-amber-500/15 text-amber-400 border-amber-500/25",
  "Sleep & Recovery": "bg-indigo-500/15 text-indigo-400 border-indigo-500/25",
  "Joint & Mobility": "bg-teal-500/15 text-teal-400 border-teal-500/25",
  "Hormone Optimization": "bg-rose-500/15 text-rose-400 border-rose-500/25",
};

const routeIcon = (route: string) => {
  const r = route.toLowerCase();
  if (r.includes("nasal")) return <SprayCan size={13} strokeWidth={1.3} />;
  if (r.includes("capsule") || r.includes("tablet") || r.includes("oral")) return <Pill size={13} strokeWidth={1.3} />;
  if (r.includes("topical") || r.includes("cream")) return <Droplets size={13} strokeWidth={1.3} />;
  return <Syringe size={13} strokeWidth={1.3} />;
};

const extractVariationLabel = (fullName: string, baseName: string): string => {
  const after = fullName.replace(baseName, "").replace(/^\s*—\s*/, "").trim();
  return after || fullName;
};

const priceRange = (variations: PeptideVariation[]): string => {
  const prices = variations.map(v => v.price).filter((p): p is number => p !== null);
  if (prices.length === 0) return "";
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  if (min === max) return `$${min}`;
  return `$${min} – $${max}`;
};

interface PeptideCardProps {
  group: PeptideGroup;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
}

const PeptideCard = ({ group, index, isExpanded, onToggle }: PeptideCardProps) => {
  const range = priceRange(group.variations);
  const benefitsList = group.benefits?.split(", ").filter(Boolean) || [];
  const candidatesList = group.candidates?.split(", ").filter(Boolean) || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.02, 0.2) }}
    >
      <div
        onClick={onToggle}
        className={`bg-card border rounded-lg overflow-hidden cursor-pointer transition-all duration-300 ${
          isExpanded ? "border-primary/30" : "border-border hover:border-primary/20"
        }`}
      >
        {/* Header */}
        <div className="flex items-center gap-4 p-4 sm:p-5">
          <div className="w-12 h-12 sm:w-14 sm:h-14 flex-shrink-0 rounded-lg bg-secondary/50 overflow-hidden flex items-center justify-center">
            <img src={peptideVial} alt={group.baseName} className="w-10 h-10 sm:w-12 sm:h-12 object-contain" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-0.5">
              <h3 className="text-base font-heading font-light text-foreground tracking-tight">{group.baseName}</h3>
              {group.category && (
                <span className={`inline-flex px-2 py-0.5 text-[9px] tracking-wider uppercase font-body font-light border rounded ${categoryColors[group.category] || ""}`}>
                  {group.category}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 flex-wrap mt-1">
              {group.routes.map(route => (
                <span key={route} className="inline-flex items-center gap-1 text-[10px] text-muted-foreground font-body font-light">
                  {routeIcon(route)}
                  {route}
                </span>
              ))}
            </div>
          </div>
          {range && (
            <div className="flex-shrink-0 text-right hidden sm:block">
              <p className="text-lg font-heading font-light text-foreground">{range}</p>
              {group.variations.length > 1 && (
                <p className="text-[10px] tracking-wider uppercase text-muted-foreground font-body font-light">{group.variations.length} options</p>
              )}
            </div>
          )}
          <ChevronDown
            size={16}
            strokeWidth={1.2}
            className={`flex-shrink-0 text-muted-foreground transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
          />
        </div>

        {/* Mobile price */}
        {range && (
          <div className="px-4 pb-2 sm:hidden">
            <p className="text-base font-heading font-light text-foreground">
              {range}
              {group.variations.length > 1 && (
                <span className="text-[10px] tracking-wider uppercase text-muted-foreground font-body font-light ml-2">{group.variations.length} options</span>
              )}
            </p>
          </div>
        )}

        {/* Expanded content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="px-4 sm:px-5 pb-5 pt-2 border-t border-border space-y-4">
                {/* Description */}
                {group.description && (
                  <p className="text-sm text-muted-foreground font-body font-light leading-relaxed">{group.description}</p>
                )}

                {/* Benefits & Candidates */}
                <div className="grid md:grid-cols-2 gap-5">
                  {benefitsList.length > 0 && (
                    <div>
                      <p className="text-xs tracking-[0.2em] uppercase text-primary font-body font-light mb-2">Benefits</p>
                      <ul className="space-y-1.5">
                        {benefitsList.map((b, j) => (
                          <li key={j} className="text-sm text-muted-foreground font-body font-light flex items-start gap-2">
                            <span className="mt-1.5 w-1 h-1 rounded-full bg-primary flex-shrink-0" />
                            {b}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {candidatesList.length > 0 && (
                    <div>
                      <p className="text-xs tracking-[0.2em] uppercase text-primary font-body font-light mb-2">Ideal Candidates</p>
                      <ul className="space-y-1.5">
                        {candidatesList.map((c, j) => (
                          <li key={j} className="text-sm text-muted-foreground font-body font-light flex items-start gap-2">
                            <span className="mt-1.5 w-1 h-1 rounded-full bg-primary flex-shrink-0" />
                            {c}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Available options */}
                <div>
                  <p className="text-xs tracking-[0.2em] uppercase text-primary font-body font-light mb-2">Available Options</p>
                  <div className="grid gap-2">
                    {group.variations.map(v => (
                      <div key={v.id} className="flex items-center justify-between py-2 px-3 rounded bg-secondary/40 border border-border/50">
                        <div className="flex items-center gap-2">
                          {v.administration && routeIcon(v.administration)}
                          <span className="text-sm font-body font-light text-foreground">
                            {extractVariationLabel(v.name, group.baseName)}
                          </span>
                        </div>
                        {v.price && (
                          <span className="text-sm font-heading font-light text-foreground">${v.price}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <div className="pt-1">
                  <a
                    href="/#contact"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-body font-light tracking-[0.2em] uppercase bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                  >
                    <FlaskConical size={13} strokeWidth={1.5} />
                    Labs Required
                  </a>
                  <p className="text-[11px] text-muted-foreground font-body font-light mt-1.5">
                    Lab work must be completed before this protocol can be prescribed.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default PeptideCard;
export type { PeptideGroup, PeptideVariation };
