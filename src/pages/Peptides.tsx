import SEO from "@/components/SEO";
import { useState, useEffect, useMemo } from "react";
import { Search, ChevronDown, ChevronUp } from "lucide-react";
import Navbar from "@/components/Navbar";
import PopularPeptidesCarousel from "@/components/PopularPeptidesCarousel";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";

interface Product {
  id: string;
  category: string;
  subcategory: string | null;
  name: string;
  size: string;
  price: number;
}

interface Variant {
  id: string;
  size: string;
  price: number;
}

interface Formulation {
  fullName: string;
  displayName: string;
  variants: Variant[];
}

interface ProductGroup {
  baseName: string;
  category: string;
  formulations: Formulation[];
}

const extractBaseName = (name: string): string => {
  return name
    .split(/\s+\+\s+/)[0]
    .replace(/\s+per\s+mL.*/i, "")
    .replace(/\s+in\s+(MCT|Ethyl).*/i, "")
    .replace(/\s+--\s+.*/g, "")
    .replace(/\s+\*\*.*?\*\*.*/g, "")
    .replace(/\s+\*.*?\*.*/g, "")
    .replace(/\s+(Topical|Injectable|Capsule|Tablet|Nasal|Oral|Ophthalmic|SQ|IM|IV|Lyophilized|Inhalation|Suspension|Lollipop|Troche|Suppository|Foam|Gel|Ointment|Solution|Spray|Cream)\b.*/i, "")
    .replace(/\s+\[\d+.*?\]\s*$/i, "")
    .trim();
};

const getDisplayName = (fullName: string, baseName: string): string => {
  if (fullName.toLowerCase().startsWith(baseName.toLowerCase())) {
    const rest = fullName.slice(baseName.length).replace(/^\s*\+?\s*/, "").trim();
    if (rest) {
      return rest
        .replace(/\s+per\s+mL\s*--\s*/i, " — ")
        .replace(/\s+in\s+Serum\s+Pump\s*$/i, "")
        .replace(/\s+in\s+Dropper\s+Bottle\s*$/i, "")
        .replace(/\s+in\s+Ointment\s+Jar\s*$/i, "")
        .replace(/\s+--\s+.*/g, "")
        .replace(/\s+\[\d+mL\]\s*$/i, "")
        .trim();
    }
  }
  return fullName
    .replace(/\s+per\s+mL\s*--\s*/i, " — ")
    .replace(/\s+in\s+Serum\s+Pump\s*$/i, "")
    .replace(/\s+--\s+.*/g, "")
    .trim();
};

const Peptides = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);
  const [expandedFormulation, setExpandedFormulation] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await supabase
        .from("products")
        .select("id, category, subcategory, name, size, price")
        .eq("active", true)
        .order("category")
        .order("name")
        .order("size");
      if (data) setProducts(data);
      setLoading(false);
    };
    fetchProducts();
  }, []);

  const groups = useMemo(() => {
    const groupMap = new Map<string, ProductGroup>();
    for (const p of products) {
      const base = extractBaseName(p.name);
      const groupKey = `${p.category}__${base}`;
      if (!groupMap.has(groupKey)) {
        groupMap.set(groupKey, { baseName: base, category: p.category, formulations: [] });
      }
      const group = groupMap.get(groupKey)!;
      let formulation = group.formulations.find(f => f.fullName === p.name);
      if (!formulation) {
        formulation = { fullName: p.name, displayName: getDisplayName(p.name, base), variants: [] };
        group.formulations.push(formulation);
      }
      formulation.variants.push({ id: p.id, size: p.size, price: p.price });
    }
    return Array.from(groupMap.values());
  }, [products]);

  const categories = useMemo(() => {
    return [...new Set(groups.map(g => g.category))].sort();
  }, [groups]);

  const filtered = useMemo(() => {
    return groups.filter(g => {
      const matchCategory = !activeCategory || g.category === activeCategory;
      const matchSearch = !search ||
        g.baseName.toLowerCase().includes(search.toLowerCase()) ||
        g.category.toLowerCase().includes(search.toLowerCase()) ||
        g.formulations.some(f => f.fullName.toLowerCase().includes(search.toLowerCase()));
      return matchCategory && matchSearch;
    });
  }, [groups, search, activeCategory]);

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Peptide Therapy Catalog"
        description="Browse our full catalog of compounded peptide therapy products."
        canonical="/peptides"
      />
      <Navbar />
      <PopularPeptidesCarousel />
      <main className="pb-20 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-muted-foreground/60 text-center max-w-md mx-auto mb-8 font-body font-extralight text-sm leading-relaxed">
            Select a compound to review available formulations, sizes, and pricing.
          </p>

          <div className="max-w-md mx-auto mb-6">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search compounds, categories..."
                className="pl-10 bg-card/40 border-border/50 font-body font-extralight text-sm tracking-wide placeholder:text-muted-foreground/30"
              />
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-2 mb-12">
            <button
              onClick={() => setActiveCategory(null)}
              className={`px-4 py-2 text-[9px] tracking-[0.2em] uppercase font-body font-extralight border transition-all duration-300 ${
                !activeCategory ? "bg-primary/10 text-primary/80 border-primary/20" : "border-border/40 text-muted-foreground/50 hover:text-foreground/60 hover:border-border/60"
              }`}
            >
              All
            </button>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
                className={`px-4 py-2 text-[9px] tracking-[0.2em] uppercase font-body font-extralight border transition-all duration-300 ${
                  activeCategory === cat ? "bg-primary/10 text-primary/80 border-primary/20" : "border-border/40 text-muted-foreground/50 hover:text-foreground/60 hover:border-border/60"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {loading && (
            <p className="text-center text-sm text-muted-foreground font-body font-light py-10 animate-pulse">
              Loading catalog...
            </p>
          )}

          <div className="space-y-2">
            {filtered.map((group) => {
              const groupKey = `${group.category}__${group.baseName}`;
              const isGroupOpen = expandedGroup === groupKey;

              return (
                <div key={groupKey} className="border border-border/40 bg-card/20">
                  <button
                    onClick={() => {
                      setExpandedGroup(isGroupOpen ? null : groupKey);
                      setExpandedFormulation(null);
                    }}
                    className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-card/40 transition-colors"
                  >
                    <div>
                      <p className="text-sm font-body font-light tracking-wide text-foreground/90">
                        {group.baseName}
                      </p>
                      <p className="text-[10px] tracking-[0.15em] uppercase text-muted-foreground/50 font-body font-extralight mt-0.5">
                        {group.category}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-[9px] tracking-[0.15em] uppercase text-muted-foreground/30 font-body">
                        {group.formulations.length} {group.formulations.length === 1 ? "formulation" : "formulations"}
                      </span>
                      {isGroupOpen
                        ? <ChevronUp size={14} className="text-muted-foreground/40" />
                        : <ChevronDown size={14} className="text-muted-foreground/40" />
                      }
                    </div>
                  </button>

                  {isGroupOpen && (
                    <div className="border-t border-border/20 divide-y divide-border/10">
                      {group.formulations.map((formulation) => {
                        const fKey = formulation.fullName;
                        const isFormOpen = expandedFormulation === fKey;
                        const isSingleVariant = formulation.variants.length === 1;
                        const selectedSize = selectedSizes[fKey];
                        const selectedVariant = formulation.variants.find(v => v.size === selectedSize);

                        return (
                          <div key={fKey} className="bg-card/10">
                            <button
                              onClick={() => {
                                if (isSingleVariant) return;
                                setExpandedFormulation(isFormOpen ? null : fKey);
                              }}
                              className={`w-full flex items-center justify-between px-6 py-3 text-left transition-colors ${!isSingleVariant ? "hover:bg-card/30" : "cursor-default"}`}
                            >
                              <p className="text-xs font-body font-extralight tracking-wide text-foreground/70 flex-1 pr-4 truncate">
                                {formulation.displayName || formulation.fullName}
                              </p>
                              <div className="flex items-center gap-3 shrink-0">
                                {isSingleVariant ? (
                                  <span className="text-[10px] font-body text-muted-foreground/40">
                                    {formulation.variants[0].size} · ${formulation.variants[0].price.toFixed(2)}
                                  </span>
                                ) : selectedVariant ? (
                                  <span className="text-xs font-body text-primary/70">
                                    {selectedVariant.size} · ${selectedVariant.price.toFixed(2)}
                                  </span>
                                ) : (
                                  <span className="text-[9px] tracking-[0.1em] uppercase text-muted-foreground/30 font-body">
                                    select size
                                  </span>
                                )}
                                {!isSingleVariant && (
                                  isFormOpen
                                    ? <ChevronUp size={12} className="text-muted-foreground/30" />
                                    : <ChevronDown size={12} className="text-muted-foreground/30" />
                                )}
                              </div>
                            </button>

                            {isFormOpen && !isSingleVariant && (
                              <div className="px-6 pb-4 flex flex-wrap gap-2">
                                {formulation.variants.map((v) => {
                                  const isSelected = selectedSizes[fKey] === v.size;
                                  return (
                                    <button
                                      key={v.id}
                                      onClick={() => setSelectedSizes(prev => ({ ...prev, [fKey]: v.size }))}
                                      className={`px-4 py-2 border text-xs font-body font-extralight tracking-wide transition-all duration-200 ${
                                        isSelected
                                          ? "border-primary/40 bg-primary/10 text-primary/80"
                                          : "border-border/30 text-muted-foreground/50 hover:border-border/50 hover:text-foreground/60"
                                      }`}
                                    >
                                      {v.size}{isSelected && <span className="ml-2 text-primary/70">${v.price.toFixed(2)}</span>}
                                    </button>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}

            {!loading && filtered.length === 0 && (
              <p className="text-center text-sm text-muted-foreground font-body font-light py-10">
                No products match your search.
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
