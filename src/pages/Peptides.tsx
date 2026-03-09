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

interface ProductGroup {
  name: string;
  category: string;
  subcategory: string | null;
  variants: { id: string; size: string; price: number }[];
}

const Peptides = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedName, setExpandedName] = useState<string | null>(null);
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

  // Group products by name
  const groups = useMemo(() => {
    const map = new Map<string, ProductGroup>();
    for (const p of products) {
      if (!map.has(p.name)) {
        map.set(p.name, {
          name: p.name,
          category: p.category,
          subcategory: p.subcategory,
          variants: [],
        });
      }
      map.get(p.name)!.variants.push({ id: p.id, size: p.size, price: p.price });
    }
    return Array.from(map.values());
  }, [products]);

  const categories = useMemo(() => {
    return [...new Set(groups.map(g => g.category).filter(Boolean))].sort() as string[];
  }, [groups]);

  const filtered = useMemo(() => {
    return groups.filter(g => {
      const matchSearch = !search ||
        g.name.toLowerCase().includes(search.toLowerCase()) ||
        g.category.toLowerCase().includes(search.toLowerCase()) ||
        (g.subcategory?.toLowerCase().includes(search.toLowerCase()) ?? false);
      const matchCategory = !activeCategory || g.category === activeCategory;
      return matchSearch && matchCategory;
    });
  }, [groups, search, activeCategory]);

  const getSelectedVariant = (group: ProductGroup) => {
    const selectedSize = selectedSizes[group.name];
    return group.variants.find(v => v.size === selectedSize) ?? group.variants[0];
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Peptide Therapy Catalog"
        description="Browse our full catalog of peptide therapy compounds including BPC-157, Semaglutide, Sermorelin, and more. Physician-directed treatments for longevity, recovery, and performance."
        canonical="/peptides"
      />
      <Navbar />
      <PopularPeptidesCarousel />
      <main className="pb-20 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-muted-foreground/60 text-center max-w-md mx-auto mb-8 font-body font-extralight text-sm leading-relaxed">
            Select a compound below to review available sizes and pricing.
          </p>

          {/* Search */}
          <div className="max-w-md mx-auto mb-6">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, category, or method..."
                className="pl-10 bg-card/40 border-border/50 font-body font-extralight text-sm tracking-wide placeholder:text-muted-foreground/30"
              />
            </div>
          </div>

          {/* Category filters */}
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

          {/* Product list */}
          <div className="space-y-3">
            {filtered.map((group) => {
              const isExpanded = expandedName === group.name;
              const selected = getSelectedVariant(group);

              return (
                <div
                  key={group.name}
                  className="border border-border/40 bg-card/20 transition-all duration-300"
                >
                  {/* Header row */}
                  <button
                    onClick={() => setExpandedName(isExpanded ? null : group.name)}
                    className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-card/40 transition-colors"
                  >
                    <div className="flex-1 min-w-0 pr-4">
                      <p className="text-sm font-body font-light tracking-wide text-foreground/90 truncate">
                        {group.name}
                      </p>
                      <p className="text-[10px] tracking-[0.15em] uppercase text-muted-foreground/50 font-body font-extralight mt-0.5">
                        {group.category}{group.subcategory ? ` · ${group.subcategory}` : ""}
                      </p>
                    </div>
                    <div className="flex items-center gap-4 shrink-0">
                      {group.variants.length === 1 ? (
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground/50 font-body">{group.variants[0].size}</p>
                          <p className="text-sm font-body font-light text-primary/80">${group.variants[0].price.toFixed(2)}</p>
                        </div>
                      ) : (
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground/50 font-body">{selected.size}</p>
                          <p className="text-sm font-body font-light text-primary/80">${selected.price.toFixed(2)}</p>
                        </div>
                      )}
                      {group.variants.length > 1 && (
                        isExpanded
                          ? <ChevronUp size={14} className="text-muted-foreground/40" />
                          : <ChevronDown size={14} className="text-muted-foreground/40" />
                      )}
                    </div>
                  </button>

                  {/* Expanded size selector */}
                  {isExpanded && group.variants.length > 1 && (
                    <div className="px-5 pb-5 border-t border-border/20">
                      <p className="text-[9px] tracking-[0.2em] uppercase text-muted-foreground/40 font-body font-extralight mt-4 mb-3">
                        Select size
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {group.variants.map((v) => {
                          const isSelected = (selectedSizes[group.name] ?? group.variants[0].size) === v.size;
                          return (
                            <button
                              key={v.id}
                              onClick={() => setSelectedSizes(prev => ({ ...prev, [group.name]: v.size }))}
                              className={`px-4 py-2 border text-xs font-body font-extralight tracking-wide transition-all duration-200 ${
                                isSelected
                                  ? "border-primary/40 bg-primary/10 text-primary/80"
                                  : "border-border/40 text-muted-foreground/60 hover:border-border/60 hover:text-foreground/70"
                              }`}
                            >
                              {v.size} — <span className="text-primary/70">${v.price.toFixed(2)}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
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
