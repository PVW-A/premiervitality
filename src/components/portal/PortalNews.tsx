import { useEffect, useState } from "react";
import { ExternalLink, Newspaper, RefreshCw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  url: string;
  source: string;
  category: string | null;
  published_at: string;
}

// Fallback curated articles when DB is empty
const fallbackArticles: Omit<NewsArticle, "id" | "published_at">[] = [
  {
    title: "FDA Updates on Peptide Regulations",
    summary: "Stay informed about the latest FDA guidance on peptide therapies and compounding regulations affecting patient access.",
    url: "https://www.fda.gov/drugs/human-drug-compounding",
    source: "FDA.gov",
    category: "Regulatory",
  },
  {
    title: "Eli Lilly's GLP-1 Pipeline Expands",
    summary: "Eli Lilly continues to advance its portfolio of GLP-1 receptor agonists, with tirzepatide leading clinical outcomes in weight management and type 2 diabetes.",
    url: "https://investor.lilly.com/news-releases",
    source: "Eli Lilly",
    category: "Pharma",
  },
  {
    title: "Novo Nordisk: Semaglutide Long-Term Outcomes",
    summary: "Novo Nordisk publishes new data on long-term cardiovascular and metabolic benefits of semaglutide across multiple patient populations.",
    url: "https://www.novonordisk.com/science-and-technology.html",
    source: "Novo Nordisk",
    category: "Pharma",
  },
  {
    title: "BPC-157: Mechanisms of Action & Clinical Review",
    summary: "A comprehensive review of BPC-157's gastroprotective and wound-healing properties across multiple organ systems.",
    url: "https://pubmed.ncbi.nlm.nih.gov/?term=BPC-157+review",
    source: "PubMed",
    category: "Research",
  },
  {
    title: "Eli Lilly Invests in Peptide Manufacturing",
    summary: "Lilly announces multi-billion dollar expansion of peptide and injectable drug manufacturing capacity to meet surging global demand.",
    url: "https://investor.lilly.com/news-releases",
    source: "Eli Lilly",
    category: "Pharma",
  },
  {
    title: "Growth Hormone Secretagogues Overview",
    summary: "Clinical perspectives on Ipamorelin, CJC-1295, and Tesamorelin in age management and body composition protocols.",
    url: "https://pubmed.ncbi.nlm.nih.gov/?term=growth+hormone+secretagogue",
    source: "PubMed",
    category: "Clinical",
  },
  {
    title: "Novo Nordisk & Obesity Treatment Revolution",
    summary: "How Novo Nordisk's peptide-based therapies are reshaping the obesity treatment landscape and driving a new era of metabolic medicine.",
    url: "https://www.novonordisk.com/sustainable-business/zero-environmental-impact.html",
    source: "Novo Nordisk",
    category: "Pharma",
  },
  {
    title: "International Peptide Society Resources",
    summary: "Access educational resources, upcoming conferences, and the latest developments in peptide science worldwide.",
    url: "https://www.peptidesociety.org/",
    source: "IPS",
    category: "Education",
  },
  {
    title: "NAD+ and Cellular Aging: What the Science Says",
    summary: "Emerging research on NAD+ precursors and peptide-based strategies for supporting mitochondrial function and longevity.",
    url: "https://pubmed.ncbi.nlm.nih.gov/?term=NAD%2B+aging+peptide",
    source: "PubMed",
    category: "Research",
  },
  {
    title: "Thymosin Alpha-1: Immune Modulation Benefits",
    summary: "Review of Thymosin Alpha-1's role in immune regulation, viral defense, and its therapeutic applications in clinical medicine.",
    url: "https://pubmed.ncbi.nlm.nih.gov/?term=thymosin+alpha+1+immune",
    source: "PubMed",
    category: "Clinical",
  },
  {
    title: "Semaglutide and Metabolic Health Outcomes",
    summary: "Latest clinical trial data on GLP-1 receptor agonists for weight management and cardiovascular risk reduction.",
    url: "https://pubmed.ncbi.nlm.nih.gov/?term=semaglutide+metabolic+outcomes",
    source: "PubMed",
    category: "Research",
  },
  {
    title: "Eli Lilly: Retatrutide Triple-Agonist Progress",
    summary: "Lilly's investigational triple hormone receptor agonist retatrutide shows promising results in Phase 3 obesity and metabolic trials.",
    url: "https://investor.lilly.com/news-releases",
    source: "Eli Lilly",
    category: "Pharma",
  },
  {
    title: "Peptide Therapy Research & Advances",
    summary: "Explore the latest peer-reviewed research on therapeutic peptides including GHRPs, Semaglutide, and more.",
    url: "https://pubmed.ncbi.nlm.nih.gov/?term=therapeutic+peptides",
    source: "PubMed",
    category: "Research",
  },
];

const categoryColors: Record<string, string> = {
  Regulatory: "border-yellow-500/30 text-yellow-400",
  Research: "border-blue-400/30 text-blue-400",
  Clinical: "border-green-400/30 text-green-400",
  Education: "border-purple-400/30 text-purple-400",
  Pharma: "border-primary/30 text-primary",
};

export default function PortalNews() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const fetchArticles = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("news_articles")
      .select("*")
      .order("published_at", { ascending: false })
      .limit(20);

    if (data && data.length > 0) {
      setArticles(data as NewsArticle[]);
    } else {
      // Use shuffled fallback articles
      const shuffled = [...fallbackArticles]
        .sort(() => Math.random() - 0.5)
        .map((a, i) => ({
          ...a,
          id: `fallback-${i}`,
          published_at: new Date(Date.now() - i * 86400000 * Math.random() * 7).toISOString(),
        }));
      setArticles(shuffled);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const categories = Array.from(new Set(articles.map((a) => a.category).filter(Boolean))) as string[];
  const filtered = activeCategory ? articles.filter((a) => a.category === activeCategory) : articles;

  const timeSince = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const hours = Math.floor(diff / 3600000);
    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Newspaper size={18} strokeWidth={1.2} className="text-primary" />
            <h2 className="text-2xl font-heading font-light text-foreground">Peptide News</h2>
          </div>
          <p className="text-sm text-muted-foreground font-body font-light">
            Curated research, regulatory updates, and clinical developments - refreshed regularly.
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={fetchArticles}
          disabled={loading}
          className="text-muted-foreground hover:text-primary"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
        </Button>
      </div>

      {/* Category filters */}
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveCategory(null)}
            className={`px-3 py-1.5 text-[10px] tracking-[0.15em] uppercase font-body font-light border rounded-full transition-colors ${
              !activeCategory ? "border-primary/60 text-primary bg-primary/10" : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
              className={`px-3 py-1.5 text-[10px] tracking-[0.15em] uppercase font-body font-light border rounded-full transition-colors ${
                activeCategory === cat ? "border-primary/60 text-primary bg-primary/10" : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-5 h-5 border border-primary/40 border-t-primary rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((article) => (
            <Card key={article.id} className="border-border bg-card hover:border-primary/30 transition-colors group">
              <CardContent className="py-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    {article.category && (
                      <Badge variant="outline" className={`text-[9px] tracking-wider uppercase ${categoryColors[article.category] || "border-border text-muted-foreground"}`}>
                        {article.category}
                      </Badge>
                    )}
                    <span className="text-[10px] text-muted-foreground font-body font-light">
                      {timeSince(article.published_at)}
                    </span>
                  </div>
                  <h3 className="text-base font-heading font-light text-foreground group-hover:text-primary transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-sm text-muted-foreground font-body font-light leading-relaxed">
                    {article.summary}
                  </p>
                  <span className="text-xs text-primary/70 font-body font-light">{article.source}</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="text-xs tracking-wider uppercase font-body font-light rounded-none border-primary/40 text-primary hover:bg-primary/10 shrink-0"
                >
                  <a href={article.url} target="_blank" rel="noopener noreferrer">
                    Read <ExternalLink size={12} className="ml-1" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
