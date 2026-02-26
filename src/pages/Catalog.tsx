import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useMemo, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import PVMonogram from "@/components/PVMonogram";
import CatalogPeptideCard from "@/components/CatalogPeptideCard";
import { LogOut, ArrowLeft, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { PeptideGroup } from "@/components/PeptideCard";

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

const Catalog = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [peptides, setPeptides] = useState<Peptide[]>([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [expandedName, setExpandedName] = useState<string | null>(null);
  const [selectedVariation, setSelectedVariation] = useState<string | null>(null);
  const [requestedPeptideIds, setRequestedPeptideIds] = useState<Set<string>>(new Set());
  const [hasActiveMembership, setHasActiveMembership] = useState(false);

  useEffect(() => {
    if (!loading && !user) navigate("/auth");
  }, [user, loading, navigate]);

  const fetchRequests = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from("peptide_requests")
      .select("peptide_id")
      .eq("user_id", user.id)
      .eq("status", "pending");
    if (data) {
      setRequestedPeptideIds(new Set(data.map(r => r.peptide_id)));
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const fetchPeptides = async () => {
      const { data } = await supabase
        .from("peptides")
        .select("*")
        .order("category")
        .order("name");
      if (data) setPeptides(data);
    };
    const fetchMembership = async () => {
      const { data } = await supabase
        .from("memberships")
        .select("id")
        .eq("user_id", user.id)
        .eq("status", "active")
        .limit(1);
      setHasActiveMembership(!!(data && data.length > 0));
    };
    fetchPeptides();
    fetchRequests();
    fetchMembership();
  }, [user, fetchRequests]);

  const handleRequestSubmitted = useCallback((peptideId: string) => {
    setRequestedPeptideIds(prev => new Set(prev).add(peptideId));
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

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground text-sm font-body font-light tracking-wider uppercase animate-pulse">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 flex items-center justify-between h-16">
          <a href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <PVMonogram className="w-8 h-8" />
            <span className="text-xs tracking-[0.25em] uppercase text-foreground font-body font-light hidden sm:inline">
              Premier Vitality
            </span>
          </a>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={() => navigate("/portal")} className="text-xs tracking-wider uppercase font-body font-light rounded-none border-primary/30 text-primary hover:bg-primary/10">
              <ArrowLeft size={14} className="mr-1" /> My Portal
            </Button>
            <Button variant="ghost" size="icon" onClick={() => { signOut(); navigate("/auth"); }} className="text-muted-foreground hover:text-foreground">
              <LogOut size={16} strokeWidth={1.2} />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10 space-y-8">
        <div className="text-center">
          <p className="text-[10px] tracking-[0.4em] uppercase text-primary/60 mb-4 font-body font-extralight">
            Patient Catalog
          </p>
          <h1 className="text-3xl md:text-4xl font-extralight mb-4 tracking-tight font-heading">
            Peptide Collection & Pricing
          </h1>
          <p className="text-muted-foreground/60 max-w-md mx-auto mb-8 font-body font-extralight text-sm leading-relaxed">
            Select a peptide, choose your preferred concentration, and request it instantly.
          </p>
        </div>

        {/* Search */}
        <div className="max-w-md mx-auto">
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
        <div className="flex flex-wrap justify-center gap-2">
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

        {/* Peptide Cards */}
        <div className="space-y-3">
          {filtered.map((group, i) => (
            <CatalogPeptideCard
              key={group.baseName}
              group={group}
              index={i}
              isExpanded={expandedName === group.baseName}
              onToggle={() => setExpandedName(expandedName === group.baseName ? null : group.baseName)}
              selectedVariationId={selectedVariation}
              onSelectVariation={setSelectedVariation}
              requestedPeptideIds={requestedPeptideIds}
              onRequestSubmitted={handleRequestSubmitted}
              hasActiveMembership={hasActiveMembership}
            />
          ))}
          {filtered.length === 0 && (
            <p className="text-center text-sm text-muted-foreground font-body font-light py-10">
              No peptides match your search.
            </p>
          )}
        </div>
      </main>
    </div>
  );
};

export default Catalog;
