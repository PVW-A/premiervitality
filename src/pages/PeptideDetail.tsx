import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Check, Clock, Users, FlaskConical, BookOpen, ChevronDown, ChevronUp, Sparkles, ArrowRight } from "lucide-react";
import { openCalendly } from "@/hooks/useCalendly";
import { findPeptideBySlug } from "@/data/peptideDetailData";
import { CATEGORIES, slugify, type StandardCategory, type GenderedCategory } from "@/data/protocolData";
import { useState } from "react";

const CARD_GLASS: React.CSSProperties = {
  background: "rgba(255,255,255,0.03)",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  border: "1px solid rgba(255,255,255,0.08)",
  boxShadow: "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)",
};

function findRelatedProtocols(peptideName: string): Array<{ name: string; categoryId: string; categoryName: string; tier: string; slug: string }> {
  const results: Array<{ name: string; categoryId: string; categoryName: string; tier: string; slug: string }> = [];
  const lowerName = peptideName.toLowerCase();

  for (const cat of CATEGORIES) {
    const searchTiers = (tiers: { premier: any[]; core: any[]; essential: any[] }, prefix?: string) => {
      for (const [tierName, cards] of Object.entries(tiers)) {
        for (const card of cards as any[]) {
          const hasMatch = card.products?.some((p: any) =>
            p.name.toLowerCase().includes(lowerName) ||
            p.compound.toLowerCase().includes(lowerName)
          );
          if (hasMatch) {
            results.push({
              name: card.name,
              categoryId: cat.id,
              categoryName: cat.name + (prefix ? ` (${prefix})` : ""),
              tier: tierName,
              slug: slugify(card.name),
            });
          }
        }
      }
    };

    if (cat.gendered) {
      const g = cat as GenderedCategory;
      searchTiers(g.her, "For Her");
      searchTiers(g.him, "For Him");
    } else {
      searchTiers((cat as StandardCategory).tiers);
    }
  }

  // Deduplicate by slug (same protocol name appears in multiple tiers)
  const seen = new Set<string>();
  return results.filter((r) => {
    const key = `${r.categoryId}-${r.slug}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

const PeptideDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const peptide = findPeptideBySlug(slug ?? "");
  const [researchOpen, setResearchOpen] = useState(false);

  if (!peptide) {
    return (
      <div className="min-h-screen">
        <SEO title="Peptide Not Found" />
        <Navbar />
        <main className="pt-32 pb-20 text-center px-6">
          <h1 className="text-3xl md:text-4xl font-heading font-light text-foreground mb-4">Peptide Not Found</h1>
          <p className="text-muted-foreground font-body font-light text-sm mb-8 max-w-md mx-auto">
            The peptide you are looking for does not exist or may have been moved.
          </p>
          <Link to="/peptides" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-body text-sm tracking-wide transition-colors">
            <ArrowLeft size={14} strokeWidth={1.5} />
            Back to Peptides
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const relatedProtocols = findRelatedProtocols(peptide.name);

  return (
    <div className="min-h-screen" style={{ backgroundImage: "radial-gradient(ellipse 80% 50% at 20% 0%, hsl(39 38% 60% / 0.06) 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 80% 100%, hsl(39 38% 40% / 0.04) 0%, transparent 55%)" }}>
      <SEO
        title={`${peptide.name} | Peptide Therapy`}
        description={peptide.tagline}
        canonical={`/peptides/${peptide.slug}`}
      />
      <Navbar />

      <main className="pt-24 pb-20">
        {/* Back link */}
        <div className="max-w-4xl mx-auto px-6 mb-10">
          <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
            <Link to="/peptides" className="inline-flex items-center gap-2 text-muted-foreground/60 hover:text-primary font-body text-xs tracking-[0.15em] uppercase transition-colors">
              <ArrowLeft size={12} strokeWidth={1.5} />
              All Peptides
            </Link>
          </motion.div>
        </div>

        {/* Header */}
        <section className="max-w-4xl mx-auto px-6 mb-14">
          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-3xl md:text-4xl lg:text-5xl font-heading font-light text-foreground mb-4"
          >
            {peptide.name}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="text-muted-foreground font-body font-light text-sm md:text-base leading-relaxed mb-6 max-w-2xl"
          >
            {peptide.tagline}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="flex flex-wrap items-center gap-2"
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-sm text-[9px] tracking-[0.25em] uppercase font-body font-light text-muted-foreground/50 border border-border/30">
              {peptide.category}
            </span>
            {peptide.popular && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-sm text-[9px] tracking-[0.2em] uppercase font-body font-light text-primary/60 border border-primary/20 bg-primary/5">
                <Sparkles size={9} />
                Popular
              </span>
            )}
            {peptide.goals.map((g) => (
              <span key={g} className="px-2.5 py-1 text-[8px] tracking-[0.15em] uppercase font-body font-extralight text-muted-foreground/40 border border-border/20 bg-muted/10">
                {g}
              </span>
            ))}
          </motion.div>
        </section>

        {/* What It Is */}
        <section className="max-w-4xl mx-auto px-6 mb-12">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.12 }}>
            <h2 className="text-xs tracking-[0.35em] uppercase font-body font-light text-primary mb-6">What It Is</h2>
            <div style={CARD_GLASS} className="rounded-sm p-6 md:p-8">
              <p className="text-muted-foreground font-body font-light text-sm md:text-base leading-relaxed">
                {peptide.whatItIs}
              </p>
            </div>
          </motion.div>
        </section>

        {/* How It Works */}
        <section className="max-w-4xl mx-auto px-6 mb-12">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.15 }}>
            <h2 className="text-xs tracking-[0.35em] uppercase font-body font-light text-primary mb-6">How It Works</h2>
            <div style={CARD_GLASS} className="rounded-sm p-6 md:p-8">
              <p className="text-muted-foreground font-body font-light text-sm md:text-base leading-relaxed">
                {peptide.howItWorks}
              </p>
            </div>
          </motion.div>
        </section>

        {/* Key Benefits */}
        <section className="max-w-4xl mx-auto px-6 mb-12">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.18 }}>
            <h2 className="text-xs tracking-[0.35em] uppercase font-body font-light text-primary mb-6">Key Benefits</h2>
            <div style={CARD_GLASS} className="rounded-sm p-6 md:p-8">
              <div className="grid gap-3">
                {peptide.benefits.map((b, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <Check size={14} strokeWidth={1.5} className="text-primary/60 mt-0.5 shrink-0" />
                    <p className="text-muted-foreground font-body font-light text-sm leading-relaxed">{b}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </section>

        {/* Who It's For */}
        <section className="max-w-4xl mx-auto px-6 mb-12">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }}>
            <h2 className="text-xs tracking-[0.35em] uppercase font-body font-light text-primary mb-6">
              <Users size={12} className="inline mr-2" />
              Who It&rsquo;s For
            </h2>
            <div style={CARD_GLASS} className="rounded-sm p-6 md:p-8">
              <p className="text-muted-foreground font-body font-light text-sm md:text-base leading-relaxed">
                {peptide.whoItsFor}
              </p>
            </div>
          </motion.div>
        </section>

        {/* What to Expect */}
        <section className="max-w-4xl mx-auto px-6 mb-12">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.22 }}>
            <h2 className="text-xs tracking-[0.35em] uppercase font-body font-light text-primary mb-6">
              <Clock size={12} className="inline mr-2" />
              What to Expect
            </h2>
            <div style={CARD_GLASS} className="rounded-sm p-6 md:p-8">
              <p className="text-muted-foreground font-body font-light text-sm md:text-base leading-relaxed">
                {peptide.whatToExpect}
              </p>
            </div>
          </motion.div>
        </section>

        {/* Research & Evidence (collapsible) */}
        <section className="max-w-4xl mx-auto px-6 mb-12">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.24 }}>
            <button
              onClick={() => setResearchOpen(!researchOpen)}
              className="flex items-center gap-2 text-xs tracking-[0.35em] uppercase font-body font-light text-primary mb-6 hover:text-primary/80 transition-colors"
            >
              <BookOpen size={12} />
              Research & Evidence
              {researchOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            </button>
            {researchOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                style={CARD_GLASS}
                className="rounded-sm p-6 md:p-8"
              >
                <p className="text-muted-foreground/70 font-body font-extralight text-sm leading-relaxed">
                  {peptide.researchNotes}
                </p>
                <p className="text-muted-foreground/30 font-body font-extralight text-[10px] mt-4 italic">
                  For informational purposes only. Not medical advice. Consult a physician before starting any treatment.
                </p>
              </motion.div>
            )}
          </motion.div>
        </section>

        {/* Protocols That Include This Peptide */}
        {relatedProtocols.length > 0 && (
          <section className="max-w-4xl mx-auto px-6 mb-16">
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.26 }}>
              <h2 className="text-xs tracking-[0.35em] uppercase font-body font-light text-primary mb-6">
                <FlaskConical size={12} className="inline mr-2" />
                Protocols That Include {peptide.name}
              </h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {relatedProtocols.map((p) => (
                  <Link
                    key={`${p.categoryId}-${p.slug}`}
                    to={`/protocols/${p.categoryId}/${p.slug}`}
                    className="group flex items-center justify-between p-4 rounded-sm transition-all duration-300"
                    style={{
                      ...CARD_GLASS,
                      border: "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    <div>
                      <p className="text-sm font-heading font-light text-foreground/80 group-hover:text-foreground transition-colors">
                        {p.name}
                      </p>
                      <p className="text-[9px] tracking-[0.15em] uppercase text-muted-foreground/40 font-body font-extralight mt-1">
                        {p.categoryName}
                      </p>
                    </div>
                    <ArrowRight size={12} className="text-muted-foreground/30 group-hover:text-primary transition-colors shrink-0" />
                  </Link>
                ))}
              </div>
            </motion.div>
          </section>
        )}

        {/* FDA Disclaimer */}
        <section className="max-w-4xl mx-auto px-6 mb-16">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.28 }} className="text-center">
            <div className="h-px w-24 mx-auto mb-6 bg-gradient-to-r from-transparent via-border/40 to-transparent" />
            <p className="text-muted-foreground/40 font-body font-extralight text-[11px] leading-relaxed max-w-2xl mx-auto">
              These statements have not been evaluated by the Food and Drug Administration.
              This product is not intended to diagnose, treat, cure, or prevent any disease.
              All treatments require physician oversight and a valid prescription.
              Individual results may vary.
            </p>
          </motion.div>
        </section>

        {/* CTA */}
        <section className="max-w-4xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 }} className="text-center">
            <button
              onClick={openCalendly}
              className="inline-flex items-center gap-2 px-8 py-3.5 font-body text-xs tracking-[0.2em] uppercase border border-primary/30 text-primary hover:bg-primary/10 hover:border-primary/50 transition-all duration-300"
            >
              Book a Consultation
            </button>
            <p className="text-muted-foreground/40 font-body font-extralight text-[10px] mt-4 tracking-wide">
              Complimentary clinical consultation with our medical team
            </p>
          </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default PeptideDetail;
