import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, FlaskConical, Clock, Tag, Layers, Syringe, Pill, Wind } from "lucide-react";
import { openCalendly } from "@/hooks/useCalendly";
import {
  findProtocol,
  tierMeta,
  COMPOUND_INFO,
  type Product,
} from "@/data/protocolData";

const CARD_GLASS: React.CSSProperties = {
  background: "rgba(255,255,255,0.03)",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  border: "1px solid rgba(255,255,255,0.08)",
  boxShadow: "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)",
};

const formIcon = (form: string) => {
  if (form.includes("capsule") || form.includes("troche")) return Pill;
  if (form.includes("nasal") || form.includes("spray")) return Wind;
  return Syringe;
};

const formLabel = (form: string) => {
  const f = form.toLowerCase();
  if (f.includes("injectable")) return "Subcutaneous Injection";
  if (f.includes("lyophilized")) return "Lyophilized Powder (Reconstituted)";
  if (f.includes("capsule")) return "Oral Capsule";
  if (f.includes("nasal")) return "Nasal Spray";
  if (f.includes("topical")) return "Topical Application";
  if (f.includes("troche")) return "Sublingual Troche";
  return form;
};

const getCompoundDescription = (product: Product): string | null => {
  const info = COMPOUND_INFO[product.compound];
  return info ? info.description : null;
};

const ProtocolDetail = () => {
  const { categorySlug, protocolSlug } = useParams<{
    categorySlug: string;
    protocolSlug: string;
  }>();

  const result = findProtocol(categorySlug ?? "", protocolSlug ?? "");

  if (!result) {
    return (
      <div className="min-h-screen bg-background" style={{ backgroundImage: "radial-gradient(ellipse 80% 50% at 20% 0%, hsl(39 38% 60% / 0.06) 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 80% 100%, hsl(39 38% 40% / 0.04) 0%, transparent 55%)" }}>
        <SEO title="Protocol Not Found" />
        <Navbar />
        <main className="pt-32 pb-20 text-center px-6">
          <h1 className="text-3xl md:text-4xl font-heading font-light text-foreground mb-4">Protocol Not Found</h1>
          <p className="text-muted-foreground font-body font-light text-sm mb-8 max-w-md mx-auto">
            The protocol you are looking for does not exist or may have been moved.
          </p>
          <Link to="/protocols" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-body text-sm tracking-wide transition-colors">
            <ArrowLeft size={14} strokeWidth={1.5} />
            Back to Protocols
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const { category, tier, card, gender } = result;
  const meta = tierMeta[tier];

  return (
    <div className="min-h-screen bg-background" style={{ backgroundImage: "radial-gradient(ellipse 80% 50% at 20% 0%, hsl(39 38% 60% / 0.06) 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 80% 100%, hsl(39 38% 40% / 0.04) 0%, transparent 55%), radial-gradient(ellipse 40% 30% at 50% 50%, hsl(220 20% 30% / 0.03) 0%, transparent 50%)" }}>
      <SEO
        title={`${card.name} | ${category.name} Protocol`}
        description={card.protocolDescription}
        canonical={`/protocols/${categorySlug}/${protocolSlug}`}
      />
      <Navbar />

      <main className="pt-24 pb-20">
        {/* Back link */}
        <div className="max-w-4xl mx-auto px-6 mb-10">
          <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
            <Link to="/protocols" className="inline-flex items-center gap-2 text-muted-foreground/60 hover:text-primary font-body text-xs tracking-[0.15em] uppercase transition-colors">
              <ArrowLeft size={12} strokeWidth={1.5} />
              All Protocols
            </Link>
          </motion.div>
        </div>

        {/* Header */}
        <section className="max-w-4xl mx-auto px-6 mb-14">
          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-3xl md:text-4xl lg:text-5xl font-heading font-light text-foreground mb-6"
          >
            {card.name}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="flex flex-wrap items-center gap-3"
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-sm text-[9px] tracking-[0.25em] uppercase font-body font-light" style={{ background: meta.badgeBg, border: `1px solid ${meta.badgeBorder}`, color: "rgba(255,255,255,0.5)" }}>
              <Layers size={9} strokeWidth={1.5} />
              {meta.label}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-sm text-[9px] tracking-[0.25em] uppercase font-body font-light text-muted-foreground/50 border border-border/30">
              <Clock size={9} strokeWidth={1.5} />
              {card.duration}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-sm text-[9px] tracking-[0.25em] uppercase font-body font-light text-muted-foreground/50 border border-border/30">
              <Tag size={9} strokeWidth={1.5} />
              {category.name}
              {gender ? ` - For ${gender === "her" ? "Her" : "Him"}` : ""}
            </span>
          </motion.div>
        </section>

        {/* What This Protocol Does */}
        <section className="max-w-4xl mx-auto px-6 mb-16">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
            <h2 className="text-xs tracking-[0.35em] uppercase font-body font-light text-primary mb-6">
              What This Protocol Does
            </h2>
            <div style={CARD_GLASS} className="rounded-sm p-6 md:p-8">
              <p className="text-muted-foreground font-body font-light text-sm md:text-base leading-relaxed mb-4">
                {card.protocolDescription}
              </p>
              {card.synergyRationale && (
                <div className="pt-4 border-t border-border/20">
                  <p className="text-[10px] tracking-[0.2em] uppercase font-body font-extralight text-primary/50 mb-2">
                    Why These Compounds Are Paired
                  </p>
                  <p className="text-muted-foreground/70 font-body font-light text-sm leading-relaxed">
                    {card.synergyRationale}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </section>

        {/* What's Included */}
        {card.products.length > 0 && (
          <section className="max-w-4xl mx-auto px-6 mb-16">
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.15 }}>
              <h2 className="text-xs tracking-[0.35em] uppercase font-body font-light text-primary mb-6">
                What&rsquo;s Included
              </h2>
              <div className="grid gap-4">
                {card.products.map((product, i) => {
                  const FormIcon = formIcon(product.form);
                  const compoundDesc = getCompoundDescription(product);

                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, delay: 0.18 + i * 0.06 }}
                      style={CARD_GLASS}
                      className="rounded-sm p-5 md:p-6"
                    >
                      {/* Product header */}
                      <div className="flex items-start gap-3 mb-4">
                        <div className="mt-0.5 flex items-center justify-center w-7 h-7 rounded-sm shrink-0" style={{ background: "rgba(171,143,95,0.08)", border: "1px solid rgba(171,143,95,0.15)" }}>
                          <FlaskConical size={13} strokeWidth={1.5} className="text-primary/70" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-base md:text-lg font-heading font-light text-foreground/90 mb-1">
                            {product.name}
                          </h3>
                          <div className="flex items-center gap-2 text-muted-foreground/40">
                            <FormIcon size={11} strokeWidth={1.5} />
                            <span className="text-[10px] tracking-[0.15em] uppercase font-body font-extralight">
                              {formLabel(product.form)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* What this compound does */}
                      {compoundDesc && (
                        <div className="mb-4 pl-10">
                          <p className="text-[10px] tracking-[0.2em] uppercase font-body font-extralight text-primary/50 mb-1.5">
                            What This Does
                          </p>
                          <p className="text-muted-foreground font-body font-light text-sm leading-relaxed">
                            {compoundDesc}
                          </p>
                        </div>
                      )}

                      {/* Dosing */}
                      <div className="pl-10 space-y-3">
                        <div>
                          <p className="text-[10px] tracking-[0.2em] uppercase font-body font-extralight text-primary/50 mb-1.5">
                            Dosing Instructions
                          </p>
                          <p className="text-muted-foreground/70 font-body font-extralight text-xs leading-relaxed">
                            {product.dosing}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] tracking-[0.2em] uppercase font-body font-extralight text-primary/50 mb-1.5">
                            Dose Per Administration
                          </p>
                          <p className="text-muted-foreground/70 font-body font-extralight text-xs leading-relaxed">
                            {product.doseSummary}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </section>
        )}

        {/* Disclaimer */}
        <section className="max-w-4xl mx-auto px-6 mb-16">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.25 }} className="text-center">
            <div className="h-px w-24 mx-auto mb-6 bg-gradient-to-r from-transparent via-border/40 to-transparent" />
            <p className="text-muted-foreground/40 font-body font-extralight text-[11px] leading-relaxed max-w-2xl mx-auto">
              All protocols require physician oversight and a valid prescription.
              Individual results may vary. This information is for educational
              purposes only and does not constitute medical advice.
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

export default ProtocolDetail;
