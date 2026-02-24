import { useState, useEffect, useMemo } from "react";
import { ArrowLeft, Search } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import PeptideCard from "@/components/PeptideCard";
import type { PeptideGroup, PeptideVariation } from "@/components/PeptideCard";

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

const extractBaseName = (name: string): string => {
  const idx = name.indexOf(" — ");
  return idx > -1 ? name.substring(0, idx) : name;
};

const Peptides = () => {
  const [peptides, setPeptides] = useState<Peptide[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedName, setExpandedName] = useState<string | null>(null);
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

  const groups = useMemo(() => {
    const map = new Map<string, PeptideGroup>();
    for (const p of peptides) {
      const base = extractBaseName(p.name);
      if (!map.has(base)) {
        map.set(base, {
          baseName: base,
          category: p.category,
          description: p.description,
          benefits: p.benefits,
          candidates: p.candidates,
          routes: [],
          variations: [],
        });
      }
      const group = map.get(base)!;
      group.variations.push({
        id: p.id,
        name: p.name,
        price: p.price,
        unit: p.unit,
        administration: p.administration,
      });
      if (p.administration && !group.routes.includes(p.administration)) {
        group.routes.push(p.administration);
      }
      // Use the richest description/benefits/candidates available
      if (p.benefits && !group.benefits) group.benefits = p.benefits;
      if (p.candidates && !group.candidates) group.candidates = p.candidates;
      if (p.description && p.description.length > (group.description?.length || 0)) {
        group.description = p.description;
      }
    }
    return Array.from(map.values());
  }, [peptides]);

  const categories = useMemo(() => {
    return [...new Set(groups.map(g => g.category).filter(Boolean))] as string[];
  }, [groups]);

  const filtered = useMemo(() => {
    return groups.filter(g => {
      const matchSearch = !search ||
        g.baseName.toLowerCase().includes(search.toLowerCase()) ||
        g.description?.toLowerCase().includes(search.toLowerCase()) ||
        g.routes.some(r => r.toLowerCase().includes(search.toLowerCase()));
      const matchCategory = !activeCategory || g.category === activeCategory;
      return matchSearch && matchCategory;
    });
  }, [groups, search, activeCategory]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-20 px-6">
        <div className="max-w-5xl mx-auto">
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
          <p className="text-muted-foreground text-center max-w-lg mx-auto mb-10 font-body font-light text-sm">
            Explore our complete range of peptide therapies. Click any protocol to learn more.
          </p>

          {/* Search */}
          <div className="max-w-md mx-auto mb-6">
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
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            <button
              onClick={() => setActiveCategory(null)}
              className={`px-4 py-2 text-[10px] tracking-[0.15em] uppercase font-body font-light border rounded transition-colors ${
                !activeCategory ? "bg-primary/15 text-primary border-primary/30" : "border-border text-muted-foreground hover:text-foreground hover:border-muted-foreground"
              }`}
            >
              All ({groups.length})
            </button>
            {categories.map(cat => {
              const count = groups.filter(g => g.category === cat).length;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
                  className={`px-4 py-2 text-[10px] tracking-[0.15em] uppercase font-body font-light border rounded transition-colors ${
                    activeCategory === cat ? "bg-primary/15 text-primary border-primary/30" : "border-border text-muted-foreground hover:text-foreground hover:border-muted-foreground"
                  }`}
                >
                  {cat} ({count})
                </button>
              );
            })}
          </div>

          {/* Loading */}
          {loading && (
            <p className="text-center text-sm text-muted-foreground font-body font-light py-10 animate-pulse">
              Loading catalog...
            </p>
          )}

          {/* Cards */}
          <div className="space-y-3">
            {filtered.map((group, i) => (
              <PeptideCard
                key={group.baseName}
                group={group}
                index={i}
                isExpanded={expandedName === group.baseName}
                onToggle={() => setExpandedName(expandedName === group.baseName ? null : group.baseName)}
              />
            ))}
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
