import SEO from "@/components/SEO";
import { useState, useEffect, useMemo, useRef } from "react";
import { Search, ChevronDown, ChevronUp, FlaskConical } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { FEATURED_COMPOUNDS, GOALS, GOAL_ICONS, CATEGORY_ICONS, type Goal, type FeaturedCompound } from "@/data/peptideGoals";
import RequestOrderDialog from "@/components/RequestOrderDialog";

interface Product {
  id: string;
  category: string;
  name: string;
  size: string;
  price: number;
}

interface Variant { id: string; size: string; price: number; }
interface Formulation { fullName: string; displayName: string; variants: Variant[]; }
interface ProductGroup { baseName: string; category: string; formulations: Formulation[]; }

const extractBaseName = (name: string): string =>
  name.split(/\s+\+\s+/)[0]
    .replace(/\s+per\s+mL.*/i, "").replace(/\s+in\s+(MCT|Ethyl).*/i, "")
    .replace(/\s+--\s+.*/g, "").replace(/\s+\*\*.*?\*\*.*/g, "")
    .replace(/\s+(Topical|Injectable|Capsule|Tablet|Nasal|Oral|Ophthalmic|SQ|IM|IV|Lyophilized|Suspension|Lollipop|Troche|Suppository|Foam|Gel|Ointment|Solution|Spray|Cream)\b.*/i, "")
    .replace(/\s+\[\d+.*?\]\s*$/i, "").trim();

const getDisplayName = (fullName: string, baseName: string): string => {
  if (fullName.toLowerCase().startsWith(baseName.toLowerCase())) {
    const rest = fullName.slice(baseName.length).replace(/^\s*\+?\s*/, "").trim();
    if (rest) return rest.replace(/\s+per\s+mL\s*--\s*/i, " — ").replace(/\s+in\s+\w+\s+(Pump|Bottle|Jar)\s*$/i, "").replace(/\s+--\s+.*/g, "").replace(/\s+\[\d+mL\]\s*$/i, "").trim();
  }
  return fullName.replace(/\s+--\s+.*/g, "").trim();
};

const CARD_GLASS: React.CSSProperties = {
  background: "rgba(255,255,255,0.03)",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  boxShadow: "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)",
};

const CompoundCard = ({
  compound,
  onRequest,
  isLoggedIn,
}: {
  compound: FeaturedCompound;
  onRequest: (c: FeaturedCompound) => void;
  isLoggedIn: boolean;
}) => {
  const [expanded, setExpanded] = useState(false);
  const [hovered, setHovered] = useState(false);

  return (
    <div
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
      {/* Card header */}
      <div className="p-5 flex-1">
        <div className="flex items-start justify-between mb-3">
          {(() => { const Icon: LucideIcon = CATEGORY_ICONS[compound.category] || FlaskConical; return <Icon size={16} style={{ opacity: 0.6 }} strokeWidth={1.3} className="text-primary" />; })()}
          {compound.popular && (
            <span className="text-[8px] tracking-[0.2em] uppercase font-body font-extralight px-2 py-0.5 border border-primary/20 text-primary/60 bg-primary/5">
              Popular
            </span>
          )}
        </div>
        <p className="text-lg font-heading font-light text-foreground/90 mb-1">{compound.name}</p>
        <p className="text-[10px] tracking-[0.15em] uppercase text-muted-foreground/50 font-body font-extralight mb-3">
          {compound.category}
        </p>
        <p className="text-xs font-body font-extralight text-muted-foreground/70 leading-relaxed">
          {compound.tagline}
        </p>

        {/* Goal tags */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {compound.goals.map(g => {
            const GoalIcon = GOAL_ICONS[g];
            return (
              <span key={g} className="inline-flex items-center gap-1 text-[8px] tracking-[0.1em] uppercase font-body font-extralight px-2 py-0.5 bg-muted/20 text-muted-foreground/50 border border-border/20">
                <GoalIcon size={9} strokeWidth={1.5} />{g}
              </span>
            );
          })}
        </div>

        {/* Clinical detail toggle */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-4 flex items-center gap-1.5 text-[9px] tracking-[0.15em] uppercase text-muted-foreground/40 hover:text-muted-foreground/70 font-body font-extralight transition-colors"
        >
          <FlaskConical size={10} strokeWidth={1.5} />
          Clinical Research
          {expanded ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
        </button>

        {expanded && (
          <div className="mt-3 pt-3 border-t border-border/20">
            <p className="text-[11px] font-body font-extralight text-muted-foreground/60 leading-relaxed">
              {compound.clinicalSummary}
            </p>
            <p className="text-[9px] font-body font-extralight text-muted-foreground/30 mt-2 italic">
              For informational purposes only. Not medical advice.
            </p>
          </div>
        )}
      </div>

      {/* CTA */}
      <div className="px-5 pb-5">
        {isLoggedIn ? (
          <button
            onClick={() => onRequest(compound)}
            className="w-full py-2.5 bg-primary/90 text-primary-foreground text-[10px] font-body font-extralight tracking-[0.2em] uppercase hover:bg-primary transition-colors"
          >
            Request Treatment
          </button>
        ) : (
          <a
            href="/auth"
            className="block w-full py-2.5 border border-border/40 text-center text-[10px] font-body font-extralight tracking-[0.2em] uppercase text-muted-foreground/50 hover:text-foreground/70 hover:border-border/60 transition-colors"
          >
            Sign In to Request
          </a>
        )}
      </div>
    </div>
  );
};

const useRevealGrid = (dep: unknown) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const cards = ref.current?.querySelectorAll<HTMLElement>(".pv-card-reveal");
    if (!cards?.length) return;
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) { (e.target as HTMLElement).classList.add("pv-visible"); obs.unobserve(e.target); }
      }),
      { threshold: 0.04 }
    );
    cards.forEach((c, i) => { c.style.animationDelay = `${Math.min(i * 0.04, 0.16)}s`; obs.observe(c); });
    return () => obs.disconnect();
  }, [dep]);
  return ref;
};

const Peptides = () => {
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeGoal, setActiveGoal] = useState<Goal | null>(null);
  const [search, setSearch] = useState("");
  const [showFullCatalog, setShowFullCatalog] = useState(false);
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);
  const [expandedFormulation, setExpandedFormulation] = useState<string | null>(null);
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({});
  const [orderDialog, setOrderDialog] = useState<{ open: boolean; compound: FeaturedCompound | null }>({ open: false, compound: null });
  const featuredGridRef = useRevealGrid(filteredFeatured);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setUser({ id: data.user.id, email: data.user.email ?? undefined });
    });
    supabase
      .from("products").select("id, category, name, size, price").eq("active", true)
      .order("category").order("name").order("size")
      .then(({ data }) => { if (data) setProducts(data); setLoading(false); });
  }, []);

  // Featured compounds filtered by goal/search
  const filteredFeatured = useMemo(() => {
    return FEATURED_COMPOUNDS.filter(c => {
      const matchGoal = !activeGoal || c.goals.includes(activeGoal);
      const matchSearch = !search ||
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.tagline.toLowerCase().includes(search.toLowerCase()) ||
        c.goals.some(g => g.toLowerCase().includes(search.toLowerCase()));
      return matchGoal && matchSearch;
    });
  }, [activeGoal, search]);

  // Full catalog groups
  const groups = useMemo(() => {
    const map = new Map<string, ProductGroup>();
    for (const p of products) {
      const base = extractBaseName(p.name);
      const key = `${p.category}__${base}`;
      if (!map.has(key)) map.set(key, { baseName: base, category: p.category, formulations: [] });
      const group = map.get(key)!;
      let form = group.formulations.find(f => f.fullName === p.name);
      if (!form) { form = { fullName: p.name, displayName: getDisplayName(p.name, base), variants: [] }; group.formulations.push(form); }
      form.variants.push({ id: p.id, size: p.size, price: p.price });
    }
    return Array.from(map.values());
  }, [products]);

  const catalogCategories = useMemo(() => [...new Set(groups.map(g => g.category))].sort(), [groups]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const filteredGroups = useMemo(() =>
    groups.filter(g => (!activeCategory || g.category === activeCategory) &&
      (!search || g.baseName.toLowerCase().includes(search.toLowerCase()) || g.category.toLowerCase().includes(search.toLowerCase()))
    ), [groups, activeCategory, search]);

  return (
    <div className="min-h-screen bg-background" style={{ backgroundImage: "radial-gradient(ellipse 80% 40% at 20% 10%, hsl(39 38% 60% / 0.05) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 80% 80%, hsl(39 38% 40% / 0.04) 0%, transparent 55%)" }}>
      <SEO title="Treatments & Peptide Catalog" description="Physician-directed peptide therapy and longevity treatments. Browse by goal — weight loss, anti-aging, hormones, recovery, and more." canonical="/peptides" />
      <Navbar />

      <main>
        {/* ── HERO ── */}
        <section className="pt-20 pb-12 px-6 text-center border-b border-border/20">
          <div className="max-w-2xl mx-auto">
            <p className="text-[9px] tracking-[0.35em] uppercase text-muted-foreground/40 font-body font-extralight mb-4">
              Physician-Directed Treatments
            </p>
            <h1 className="text-3xl md:text-5xl font-heading font-extralight tracking-tight mb-4">
              What do you want to achieve?
            </h1>
            <p className="text-sm font-body font-extralight text-muted-foreground/50 leading-relaxed max-w-md mx-auto">
              Browse our compounded peptide catalog by health goal. Each treatment is reviewed and prescribed by a licensed physician.
            </p>
          </div>
        </section>

        {/* ── GOAL FILTERS ── */}
        <section className="py-6 px-6 border-b border-border/20 bg-card/10">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-wrap justify-center gap-2">
              <button
                onClick={() => setActiveGoal(null)}
                className={`px-4 py-2 text-[9px] tracking-[0.2em] uppercase font-body font-extralight border transition-all duration-300 ${
                  !activeGoal ? "bg-primary/10 text-primary/80 border-primary/20" : "border-border/40 text-muted-foreground/50 hover:text-foreground/60 hover:border-border/60"
                }`}
              >
                All Goals
              </button>
              {GOALS.map(goal => (
                <button
                  key={goal}
                  onClick={() => setActiveGoal(activeGoal === goal ? null : goal)}
                  className={`px-4 py-2 text-[9px] tracking-[0.2em] uppercase font-body font-extralight border transition-all duration-300 ${
                    activeGoal === goal ? "bg-primary/10 text-primary/80 border-primary/20" : "border-border/40 text-muted-foreground/50 hover:text-foreground/60 hover:border-border/60"
                  }`}
                >
                  {(() => { const GoalIcon = GOAL_ICONS[goal]; return <><GoalIcon size={9} strokeWidth={1.5} className="inline mr-1" />{goal}</>; })()}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ── SEARCH ── */}
        <section className="py-6 px-6">
          <div className="max-w-md mx-auto">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/40" />
              <Input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search treatments..."
                className="pl-9 bg-card/40 border-border/40 font-body font-extralight text-sm placeholder:text-muted-foreground/30"
              />
            </div>
          </div>
        </section>

        {/* ── FEATURED COMPOUNDS GRID ── */}
        <section className="px-6 pb-16">
          <div className="max-w-6xl mx-auto">
            {!search && !activeGoal && (
              <p className="text-[9px] tracking-[0.25em] uppercase text-muted-foreground/30 font-body font-extralight mb-6 text-center">
                Featured Treatments
              </p>
            )}

            {filteredFeatured.length > 0 ? (
              <div ref={featuredGridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredFeatured.map(compound => (
                  <div key={compound.name} className="pv-card-reveal pv-hover-lift">
                    <CompoundCard
                      compound={compound}
                      onRequest={c => setOrderDialog({ open: true, compound: c })}
                      isLoggedIn={!!user}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-sm text-muted-foreground/40 font-body font-light py-10">
                No treatments match your search.
              </p>
            )}
          </div>
        </section>

        {/* ── FULL CATALOG ACCORDION ── */}
        <section className="px-6 pb-20 border-t border-border/20 pt-12">
          <div className="max-w-5xl mx-auto">
            <button
              onClick={() => setShowFullCatalog(!showFullCatalog)}
              className="w-full flex items-center justify-between py-4 group"
            >
              <div className="text-left">
                <p className="text-sm font-body font-light text-foreground/70 group-hover:text-foreground/90 transition-colors">
                  Full Compounding Catalog
                </p>
                <p className="text-[9px] tracking-[0.15em] uppercase text-muted-foreground/30 font-body font-extralight mt-0.5">
                  {groups.length} compounds · {products.length} formulations
                </p>
              </div>
              {showFullCatalog ? <ChevronUp size={16} className="text-muted-foreground/40" /> : <ChevronDown size={16} className="text-muted-foreground/40" />}
            </button>

            {showFullCatalog && (
              <div className="mt-4">
                {/* Category filters */}
                <div className="flex flex-wrap gap-2 mb-6">
                  <button onClick={() => setActiveCategory(null)} className={`px-3 py-1.5 text-[9px] tracking-[0.2em] uppercase font-body font-extralight border transition-all ${!activeCategory ? "bg-primary/10 text-primary/80 border-primary/20" : "border-border/40 text-muted-foreground/50 hover:border-border/60"}`}>All</button>
                  {catalogCategories.map(cat => (
                    <button key={cat} onClick={() => setActiveCategory(activeCategory === cat ? null : cat)} className={`px-3 py-1.5 text-[9px] tracking-[0.2em] uppercase font-body font-extralight border transition-all ${activeCategory === cat ? "bg-primary/10 text-primary/80 border-primary/20" : "border-border/40 text-muted-foreground/50 hover:border-border/60"}`}>{cat}</button>
                  ))}
                </div>

                {loading && <p className="text-center text-xs text-muted-foreground/40 font-body py-8 animate-pulse">Loading catalog...</p>}

                <div className="space-y-1.5">
                  {filteredGroups.map(group => {
                    const gKey = `${group.category}__${group.baseName}`;
                    const isOpen = expandedGroup === gKey;
                    return (
                      <div key={gKey} className="border border-border/30 bg-card/10">
                        <button onClick={() => {
                          const opening = !isOpen;
                          setExpandedGroup(opening ? gKey : null);
                          setExpandedFormulation(opening && group.formulations.length === 1 ? group.formulations[0].fullName : null);
                        }} className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-card/30 transition-colors">
                          <div>
                            <p className="text-xs font-body font-light text-foreground/80">{group.baseName}</p>
                            <p className="text-[9px] tracking-[0.15em] uppercase text-muted-foreground/40 font-body mt-0.5">{group.category}</p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-[9px] text-muted-foreground/30 font-body">{group.formulations.length} form.</span>
                            {isOpen ? <ChevronUp size={12} className="text-muted-foreground/30" /> : <ChevronDown size={12} className="text-muted-foreground/30" />}
                          </div>
                        </button>

                        {isOpen && (
                          <div className="border-t border-border/20 divide-y divide-border/10">
                            {group.formulations.map(form => {
                              const fKey = form.fullName;
                              const isFOpen = expandedFormulation === fKey;
                              const isSingle = form.variants.length === 1;
                              const selSize = selectedSizes[fKey];
                              const selVariant = form.variants.find(v => v.size === selSize);

                              return (
                                <div key={fKey}>
                                  <button
                                    onClick={() => { if (!isSingle) setExpandedFormulation(isFOpen ? null : fKey); }}
                                    className={`w-full flex items-center justify-between px-5 py-2.5 text-left ${!isSingle ? "hover:bg-card/20" : "cursor-default"}`}
                                  >
                                    <p className="text-xs font-body font-extralight text-foreground/60 flex-1 pr-3 truncate">{form.displayName || form.fullName}</p>
                                    <div className="flex items-center gap-2 shrink-0">
                                      {isSingle ? (
                                        <span className="text-[10px] font-body text-muted-foreground/40">{form.variants[0].size} · ${form.variants[0].price.toFixed(2)}</span>
                                      ) : selVariant ? (
                                        <span className="text-xs font-body text-primary/60">{selVariant.size} · ${selVariant.price.toFixed(2)}</span>
                                      ) : (
                                        <span className="text-[9px] uppercase tracking-[0.1em] text-muted-foreground/30 font-body">select size</span>
                                      )}
                                      {!isSingle && (isFOpen ? <ChevronUp size={10} className="text-muted-foreground/30" /> : <ChevronDown size={10} className="text-muted-foreground/30" />)}
                                    </div>
                                  </button>
                                  {(isFOpen || group.formulations.length === 1) && !isSingle && (
                                    <div className="px-5 pb-3 flex flex-wrap gap-1.5">
                                      {form.variants.map(v => {
                                        const isSel = selectedSizes[fKey] === v.size;
                                        return (
                                          <button key={v.id} onClick={() => setSelectedSizes(p => ({ ...p, [fKey]: v.size }))} className={`px-3 py-1.5 border text-[10px] font-body font-extralight transition-all ${isSel ? "border-primary/40 bg-primary/10 text-primary/70" : "border-border/30 text-muted-foreground/50 hover:border-border/50"}`}>
                                            {v.size}{isSel && <span className="ml-1.5 text-primary/60">${v.price.toFixed(2)}</span>}
                                          </button>
                                        );
                                      })}
                                      {user && selVariant && (
                                        <button
                                          onClick={() => setOrderDialog({ open: true, compound: { name: group.baseName, tagline: "", clinicalSummary: "", goals: [], category: group.category } })}
                                          className="ml-auto px-3 py-1.5 bg-primary/80 text-primary-foreground text-[10px] font-body font-extralight tracking-[0.1em] uppercase hover:bg-primary transition-colors"
                                        >
                                          Request
                                        </button>
                                      )}
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
                  {!loading && filteredGroups.length === 0 && (
                    <p className="text-center text-xs text-muted-foreground/40 font-body py-8">No products match.</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />

      {orderDialog.compound && (
        <RequestOrderDialog
          isOpen={orderDialog.open}
          onClose={() => setOrderDialog({ open: false, compound: null })}
          compound={orderDialog.compound.name}
          category={orderDialog.compound.category}
          user={user}
        />
      )}
    </div>
  );
};

export default Peptides;
