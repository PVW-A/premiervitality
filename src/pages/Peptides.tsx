import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FlaskConical, ChevronDown, ArrowLeft, Search } from "lucide-react";
import { Link } from "react-router-dom";
import peptideVial from "@/assets/peptide-vial.png";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";

interface Peptide {
  id: string;
  name: string;
  description: string | null;
  unit: string | null;
  price: number | null;
  category: string | null;
  benefits: string | null;
  candidates: string | null;
  administration: string | null;
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

const Peptides = () => {
  const [peptides, setPeptides] = useState<Peptide[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchPeptides = async () => {
      const { data } = await supabase
        .from("peptides")
        .select("*")
        .order("category")
        .order("name");
      if (data) setPeptides(data);
      setLoading(false);
    };
    fetchPeptides();
  }, []);

  const categories = [...new Set(peptides.map(p => p.category).filter(Boolean))] as string[];

  const filtered = peptides.filter(p => {
    const matchSearch = !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description?.toLowerCase().includes(search.toLowerCase()) ||
      p.benefits?.toLowerCase().includes(search.toLowerCase());
    const matchCategory = !activeCategory || p.category === activeCategory;
    return matchSearch && matchCategory;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground transition-colors font-body font-light mb-10"
          >
            <ArrowLeft size={14} strokeWidth={1.2} />
            Back to Home
          </Link>

          <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground text-center mb-3 font-body font-light">
            Our Protocols
          </p>
          <h1 className="text-3xl md:text-5xl font-extralight text-center mb-4 tracking-tight font-heading">
            Peptide Catalog
          </h1>
          <p className="text-muted-foreground text-center max-w-lg mx-auto mb-12 font-body font-light text-sm">
            Explore our complete range of peptide therapies. Click any protocol to learn more.
          </p>

          {/* Search */}
          <div className="max-w-md mx-auto mb-8">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search peptides..."
                className="pl-10 bg-secondary border-border font-body font-light text-sm"
              />
            </div>
          </div>

          {/* Category filters */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            <button
              onClick={() => setActiveCategory(null)}
              className={`px-4 py-2 text-[10px] tracking-[0.15em] uppercase font-body font-light border rounded transition-colors ${
                !activeCategory ? "bg-primary/15 text-primary border-primary/30" : "border-border text-muted-foreground hover:text-foreground hover:border-muted-foreground"
              }`}
            >
              All
            </button>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
                className={`px-4 py-2 text-[10px] tracking-[0.15em] uppercase font-body font-light border rounded transition-colors ${
                  activeCategory === cat ? "bg-primary/15 text-primary border-primary/30" : "border-border text-muted-foreground hover:text-foreground hover:border-muted-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Loading state */}
          {loading && (
            <p className="text-center text-sm text-muted-foreground font-body font-light py-10 animate-pulse">
              Loading catalog...
            </p>
          )}

          {/* Peptide cards */}
          <div className="space-y-4">
            {filtered.map((p, i) => {
              const isExpanded = expandedId === p.id;
              const benefitsList = p.benefits?.split(", ") || [];
              const candidatesList = p.candidates?.split(", ") || [];

              return (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.5, delay: Math.min(i * 0.03, 0.3) }}
                >
                  <div
                    onClick={() => setExpandedId(isExpanded ? null : p.id)}
                    className={`bg-card border rounded-lg overflow-hidden cursor-pointer transition-all duration-300 ${
                      isExpanded ? "border-primary/30" : "border-border hover:border-primary/20"
                    }`}
                  >
                    <div className="flex items-center gap-5 p-5 sm:p-6">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 rounded-lg bg-secondary/50 overflow-hidden flex items-center justify-center">
                        <img src={peptideVial} alt={p.name} className="w-12 h-12 sm:w-16 sm:h-16 object-contain" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h3 className="text-lg font-heading font-light text-foreground tracking-tight">{p.name}</h3>
                          {p.category && (
                            <span className={`inline-flex px-2 py-0.5 text-[9px] tracking-wider uppercase font-body font-light border rounded ${categoryColors[p.category] || ""}`}>
                              {p.category}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground font-body font-light leading-relaxed line-clamp-2">{p.description}</p>
                      </div>
                      {p.price && (
                        <div className="flex-shrink-0 text-right hidden sm:block">
                          <p className="text-2xl font-heading font-light text-foreground">${p.price}</p>
                          <p className="text-[10px] tracking-wider uppercase text-muted-foreground font-body font-light">per protocol</p>
                        </div>
                      )}
                      <ChevronDown
                        size={18}
                        strokeWidth={1.2}
                        className={`flex-shrink-0 text-muted-foreground transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
                      />
                    </div>

                    {p.price && (
                      <div className="px-5 pb-3 sm:hidden flex items-center justify-between">
                        <p className="text-xl font-heading font-light text-foreground">${p.price} <span className="text-[10px] tracking-wider uppercase text-muted-foreground font-body font-light">per protocol</span></p>
                      </div>
                    )}

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="px-5 sm:px-6 pb-6 pt-2 border-t border-border space-y-5">
                            <div className="grid md:grid-cols-2 gap-6">
                              {benefitsList.length > 0 && (
                                <div>
                                  <p className="text-xs tracking-[0.2em] uppercase text-primary font-body font-light mb-3">Benefits</p>
                                  <ul className="space-y-2">
                                    {benefitsList.map((b, j) => (
                                      <li key={j} className="text-sm text-muted-foreground font-body font-light flex items-start gap-2.5">
                                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                                        {b}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              {candidatesList.length > 0 && (
                                <div>
                                  <p className="text-xs tracking-[0.2em] uppercase text-primary font-body font-light mb-3">Ideal Candidates</p>
                                  <ul className="space-y-2">
                                    {candidatesList.map((c, j) => (
                                      <li key={j} className="text-sm text-muted-foreground font-body font-light flex items-start gap-2.5">
                                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                                        {c}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>

                            {p.administration && (
                              <div>
                                <p className="text-xs tracking-[0.2em] uppercase text-primary font-body font-light mb-2">Administration</p>
                                <p className="text-sm text-muted-foreground font-body font-light">{p.administration}</p>
                              </div>
                            )}

                            <div className="pt-2">
                              <a
                                href="/#contact"
                                onClick={(e) => e.stopPropagation()}
                                className="inline-flex items-center gap-2 px-6 py-3 text-xs font-body font-light tracking-[0.2em] uppercase bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                              >
                                <FlaskConical size={14} strokeWidth={1.5} />
                                Labs Required
                              </a>
                              <p className="text-[11px] text-muted-foreground font-body font-light mt-2">
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
            })}
            {!loading && filtered.length === 0 && (
              <p className="text-center text-sm text-muted-foreground font-body font-light py-10">
                No peptides match your search.
              </p>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Peptides;
