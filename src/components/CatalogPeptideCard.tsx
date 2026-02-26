import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Syringe, SprayCan, Pill, Droplets, Check, CheckCircle, Loader2 } from "lucide-react";
import peptideVial from "@/assets/peptide-vial.png";
import type { PeptideGroup } from "@/components/PeptideCard";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const categoryColors: Record<string, string> = {
  "Recovery & Healing": "text-green-400/80 border-green-500/15",
  "Weight Management": "text-orange-400/80 border-orange-500/15",
  "Anti-Aging & Performance": "text-purple-400/80 border-purple-500/15",
  "Sexual Wellness": "text-pink-400/80 border-pink-500/15",
  "Immune Support": "text-blue-400/80 border-blue-500/15",
  "Cognitive & Mood": "text-cyan-400/80 border-cyan-500/15",
  "Skin & Hair": "text-amber-400/80 border-amber-500/15",
  "Sleep & Recovery": "text-indigo-400/80 border-indigo-500/15",
  "Joint & Mobility": "text-teal-400/80 border-teal-500/15",
  "Hormone Optimization": "text-rose-400/80 border-rose-500/15",
};

const routeIcon = (route: string) => {
  const r = route.toLowerCase();
  if (r.includes("nasal")) return <SprayCan size={12} strokeWidth={1} />;
  if (r.includes("capsule") || r.includes("tablet") || r.includes("oral")) return <Pill size={12} strokeWidth={1} />;
  if (r.includes("topical") || r.includes("cream")) return <Droplets size={12} strokeWidth={1} />;
  return <Syringe size={12} strokeWidth={1} />;
};

interface CatalogPeptideCardProps {
  group: PeptideGroup;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
  selectedVariationId: string | null;
  onSelectVariation: (id: string | null) => void;
  requestedPeptideIds: Set<string>;
  onRequestSubmitted: (peptideId: string) => void;
  hasActiveMembership: boolean;
}

const CatalogPeptideCard = ({
  group,
  index,
  isExpanded,
  onToggle,
  selectedVariationId,
  onSelectVariation,
  requestedPeptideIds,
  onRequestSubmitted,
  hasActiveMembership,
}: CatalogPeptideCardProps) => {
  const { user } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const candidatesList = group.candidates?.split(", ").filter(Boolean) || [];
  const selectedVariation = group.variations.find(v => v.id === selectedVariationId);
  const isRequested = selectedVariation ? requestedPeptideIds.has(selectedVariation.id) : false;

  const handleRequest = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user || !selectedVariation) return;
    setSubmitting(true);
    const label = selectedVariation.name.replace(group.baseName, "").replace(/^\s*—\s*/, "").trim() || selectedVariation.name;
    const { error } = await supabase.from("peptide_requests").insert({
      user_id: user.id,
      peptide_id: selectedVariation.id,
      peptide_name: group.baseName,
      variation_label: label,
      price: selectedVariation.price,
    });
    setSubmitting(false);
    if (error) {
      toast.error("Failed to submit request. Please try again.");
    } else {
      toast.success("Peptide request submitted!");
      onRequestSubmitted(selectedVariation.id);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.02, 0.2) }}
    >
      <div
        onClick={onToggle}
        className={`group bg-card/60 backdrop-blur-sm border overflow-hidden cursor-pointer transition-all duration-500 ${
          isExpanded
            ? "border-primary/20 shadow-[0_0_40px_-12px_hsl(var(--primary)/0.08)]"
            : "border-border/60 hover:border-primary/10 hover:bg-card/80"
        }`}
      >
        {/* Header */}
        <div className="flex items-center gap-4 p-5 sm:p-6">
          <div className="w-11 h-11 flex-shrink-0 rounded bg-secondary/30 overflow-hidden flex items-center justify-center">
            <img src={peptideVial} alt="" className="w-9 h-9 object-contain opacity-70" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <h3 className="text-base font-heading font-light text-foreground tracking-wide">{group.baseName}</h3>
              {group.category && (
                <span className={`inline-flex px-2.5 py-0.5 text-[8px] tracking-[0.2em] uppercase font-body font-light border ${categoryColors[group.category] || "text-muted-foreground border-border/50"}`}>
                  {group.category}
                </span>
              )}
            </div>
            <div className="flex items-center gap-3 mt-1.5">
              {group.routes.map(route => (
                <span key={route} className="inline-flex items-center gap-1 text-[10px] text-muted-foreground/70 font-body font-extralight tracking-wide">
                  {routeIcon(route)}
                  {route}
                </span>
              ))}
            </div>
          </div>

          {!isExpanded && selectedVariation && selectedVariation.price != null && (
            <span className="text-lg font-heading font-light text-primary">${selectedVariation.price.toFixed(2)}</span>
          )}

          <ChevronDown
            size={14}
            strokeWidth={1}
            className={`flex-shrink-0 text-muted-foreground/40 transition-transform duration-500 ${isExpanded ? "rotate-180" : ""}`}
          />
        </div>

        {/* Expanded content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
              className="overflow-hidden"
            >
              <div className="px-5 sm:px-6 pb-7 pt-3 space-y-5">
                <div className="w-full h-px bg-gradient-to-r from-transparent via-primary/15 to-transparent" />

                <div className="grid md:grid-cols-[1fr,auto] gap-6 md:gap-10">
                  {/* Left: Description + Selectable Formulations */}
                  <div className="space-y-4">
                    {group.description && (
                      <p className="text-sm text-foreground/60 font-body font-extralight leading-[1.8] italic">
                        {group.description}
                      </p>
                    )}

                    {group.variations.length > 0 && (
                      <div>
                        <p className="text-[10px] tracking-[0.3em] uppercase text-primary/70 font-body font-extralight mb-2.5">
                          Select Concentration
                        </p>
                        <div className="flex flex-col gap-1.5">
                          {group.variations.map(v => {
                            const label = v.name.replace(group.baseName, "").replace(/^\s*—\s*/, "").trim() || v.name;
                            const isSelected = selectedVariationId === v.id;
                            const variationRequested = requestedPeptideIds.has(v.id);
                            return (
                              <button
                                key={v.id}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onSelectVariation(isSelected ? null : v.id);
                                }}
                                className={`flex items-center gap-2 py-2.5 px-4 text-[11px] font-body font-extralight border w-full text-left transition-all duration-300 ${
                                  isSelected
                                    ? "border-primary/40 bg-primary/10 text-foreground"
                                    : "border-border/30 text-foreground/50 hover:border-primary/20 hover:bg-primary/5"
                                }`}
                              >
                                <div className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 transition-colors ${
                                  isSelected ? "border-primary bg-primary" : "border-muted-foreground/30"
                                }`}>
                                  {isSelected && <Check size={10} className="text-primary-foreground" strokeWidth={2} />}
                                </div>
                                {v.administration && routeIcon(v.administration)}
                                <span className="flex-1">{label}</span>
                                {variationRequested && (
                                  <span className="flex items-center gap-1 text-green-400 text-[10px]">
                                    <CheckCircle size={10} /> Requested
                                  </span>
                                )}
                                {v.price != null && (
                                  <span className={`font-heading transition-colors ${isSelected ? "text-primary text-sm" : "text-foreground/40"}`}>
                                    ${v.price.toFixed(2)}
                                  </span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {selectedVariation && selectedVariation.price != null && (
                      <div className="flex items-center justify-between py-3 px-4 border border-primary/20 bg-primary/5">
                        <div>
                          <p className="text-[10px] tracking-[0.2em] uppercase text-primary/70 font-body font-extralight">Selected</p>
                          <p className="text-sm font-body font-light text-foreground mt-0.5">
                            {selectedVariation.name.replace(group.baseName, "").replace(/^\s*—\s*/, "").trim() || selectedVariation.name}
                          </p>
                        </div>
                        <p className="text-2xl font-heading font-light text-primary">${selectedVariation.price.toFixed(2)}</p>
                      </div>
                    )}
                  </div>

                  {/* Right: Ideal Candidates */}
                  {candidatesList.length > 0 && (
                    <div className="md:w-56 md:border-l md:border-border/20 md:pl-8">
                      <p className="text-[10px] tracking-[0.3em] uppercase text-primary/70 font-body font-extralight mb-3">
                        Ideal For
                      </p>
                      <ul className="space-y-2">
                        {candidatesList.map((c, j) => (
                          <li key={j} className="text-[12px] text-foreground/50 font-body font-extralight leading-relaxed flex items-start gap-2">
                            <span className="mt-1.5 w-[3px] h-[3px] rounded-full bg-primary/40 flex-shrink-0" />
                            {c}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* CTA */}
                <div className="pt-1">
                  {!hasActiveMembership ? (
                    <div className="space-y-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); window.location.href = "/services"; }}
                        className="inline-flex items-center gap-2 px-6 py-2.5 text-[10px] font-body font-extralight tracking-[0.3em] uppercase border border-primary/30 text-primary hover:bg-primary/5 transition-all duration-300"
                      >
                        Subscribe to Request Peptides
                      </button>
                      <p className="text-[10px] text-muted-foreground/40 font-body font-extralight tracking-wide">
                        An active membership is required to request peptides.
                      </p>
                    </div>
                  ) : selectedVariation ? (
                    isRequested ? (
                      <button
                        disabled
                        className="inline-flex items-center gap-2 px-6 py-2.5 text-[10px] font-body font-extralight tracking-[0.3em] uppercase border border-green-500/30 text-green-400 bg-green-500/5 cursor-default"
                      >
                        <CheckCircle size={12} strokeWidth={1} />
                        Peptide Requested
                      </button>
                    ) : (
                      <button
                        onClick={handleRequest}
                        disabled={submitting}
                        className="inline-flex items-center gap-2 px-6 py-2.5 text-[10px] font-body font-extralight tracking-[0.3em] uppercase border border-primary/30 text-primary hover:bg-primary/5 transition-all duration-300 disabled:opacity-50"
                      >
                        {submitting ? <Loader2 size={12} strokeWidth={1} className="animate-spin" /> : <Pill size={12} strokeWidth={1} />}
                        Request This Peptide
                      </button>
                    )
                  ) : (
                    <p className="text-[10px] text-muted-foreground/40 font-body font-extralight tracking-wide">
                      Select a concentration above to request this peptide.
                    </p>
                  )}
                  <p className="text-[10px] text-muted-foreground/40 font-body font-extralight mt-2 tracking-wide">
                    Comprehensive lab work required prior to prescribing this protocol.
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

export default CatalogPeptideCard;
