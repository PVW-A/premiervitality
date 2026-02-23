import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import PVMonogram from "@/components/PVMonogram";
import { LogOut, ArrowLeft, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

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

const Catalog = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [peptides, setPeptides] = useState<Peptide[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) navigate("/auth");
  }, [user, loading, navigate]);

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
    fetchPeptides();
  }, [user]);

  const categories = [...new Set(peptides.map(p => p.category).filter(Boolean))] as string[];

  const filtered = peptides.filter(p => {
    const matchSearch = !search || 
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description?.toLowerCase().includes(search.toLowerCase()) ||
      p.benefits?.toLowerCase().includes(search.toLowerCase());
    const matchCategory = !selectedCategory || p.category === selectedCategory;
    return matchSearch && matchCategory;
  });

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
          <div className="flex items-center gap-3">
            <PVMonogram className="w-8 h-8" />
            <span className="text-xs tracking-[0.25em] uppercase text-foreground font-body font-light hidden sm:inline">
              Peptide Catalog
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate("/portal")} className="text-xs tracking-wider uppercase text-muted-foreground font-body font-light">
              <ArrowLeft size={14} className="mr-1" /> Portal
            </Button>
            <Button variant="ghost" size="icon" onClick={() => { signOut(); navigate("/auth"); }} className="text-muted-foreground hover:text-foreground">
              <LogOut size={16} strokeWidth={1.2} />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10 space-y-8">
        <div>
          <h1 className="text-3xl font-heading font-light text-foreground">Peptide Catalog</h1>
          <p className="text-sm text-muted-foreground font-body font-light mt-1">
            Complete pricing and protocols available to our patients.
          </p>
        </div>

        {/* Search & Filters */}
        <div className="space-y-4">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search peptides, benefits, conditions..."
              className="pl-10 bg-secondary border-border font-body font-light text-sm"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-3 py-1.5 text-xs tracking-wider uppercase font-body font-light border rounded transition-colors ${
                !selectedCategory ? "bg-primary/15 text-primary border-primary/30" : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              All
            </button>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
                className={`px-3 py-1.5 text-xs tracking-wider uppercase font-body font-light border rounded transition-colors ${
                  selectedCategory === cat ? "bg-primary/15 text-primary border-primary/30" : "border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Peptide Cards */}
        <div className="space-y-4">
          {filtered.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.3 }}
            >
              <Card
                className={`border-border bg-card cursor-pointer transition-colors hover:border-primary/20 ${expandedId === p.id ? "border-primary/30" : ""}`}
                onClick={() => setExpandedId(expandedId === p.id ? null : p.id)}
              >
                <CardContent className="py-5">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="text-lg font-heading font-light text-foreground">{p.name}</h3>
                        {p.category && (
                          <Badge variant="outline" className={`text-[10px] tracking-wider uppercase ${categoryColors[p.category] || ""}`}>
                            {p.category}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground font-body font-light leading-relaxed">{p.description}</p>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      {p.price && (
                        <div>
                          <p className="text-2xl font-heading font-light text-foreground">${p.price}</p>
                          <p className="text-[10px] tracking-wider uppercase text-muted-foreground font-body font-light">per protocol</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {expandedId === p.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-5 pt-5 border-t border-border space-y-4"
                    >
                      {p.benefits && (
                        <div>
                          <p className="text-xs tracking-[0.2em] uppercase text-primary font-body font-light mb-2">Benefits</p>
                          <ul className="space-y-1">
                            {p.benefits.split(", ").map((b, i) => (
                              <li key={i} className="text-sm text-muted-foreground font-body font-light flex items-start gap-2">
                                <span className="text-primary mt-1.5 w-1 h-1 rounded-full bg-primary flex-shrink-0" />
                                {b}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {p.candidates && (
                        <div>
                          <p className="text-xs tracking-[0.2em] uppercase text-primary font-body font-light mb-2">Ideal Candidates</p>
                          <ul className="space-y-1">
                            {p.candidates.split(", ").map((c, i) => (
                              <li key={i} className="text-sm text-muted-foreground font-body font-light flex items-start gap-2">
                                <span className="text-primary mt-1.5 w-1 h-1 rounded-full bg-primary flex-shrink-0" />
                                {c}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {p.administration && (
                        <div>
                          <p className="text-xs tracking-[0.2em] uppercase text-primary font-body font-light mb-2">Administration</p>
                          <p className="text-sm text-muted-foreground font-body font-light">{p.administration}</p>
                        </div>
                      )}
                      <div className="pt-2">
                        <a
                          href="#contact"
                          onClick={(e) => { e.stopPropagation(); navigate("/#contact"); }}
                          className="inline-block px-5 py-2 text-xs font-body font-light tracking-[0.2em] uppercase border border-primary/40 text-primary hover:bg-primary/10 transition-colors"
                        >
                          Request Consultation
                        </a>
                      </div>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
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
