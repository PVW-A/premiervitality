import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ExternalLink, Newspaper } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const News = () => {
  const articles = [
    {
      title: "FDA Updates on Peptide Regulations",
      summary: "Stay informed about the latest FDA guidance on peptide therapies and compounding regulations.",
      url: "https://www.fda.gov/drugs/human-drug-compounding",
      source: "FDA.gov",
    },
    {
      title: "Peptide Therapy Research & Advances",
      summary: "Explore the latest peer-reviewed research on therapeutic peptides including GHRPs, BPC-157, and more.",
      url: "https://pubmed.ncbi.nlm.nih.gov/?term=therapeutic+peptides",
      source: "PubMed",
    },
    {
      title: "International Peptide Society",
      summary: "Access educational resources, conferences, and the latest developments in peptide science.",
      url: "https://www.peptidesociety.org/",
      source: "IPS",
    },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEO
        title="Peptide Therapy News & Research"
        description="Latest news, FDA updates, and clinical research on peptide therapy, longevity medicine, and regenerative health from Premier Vitality & Wellness."
        canonical="/news"
      />
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto px-6 py-20 w-full">
        <div className="flex items-center gap-3 mb-8">
          <Newspaper size={24} className="text-primary" strokeWidth={1.2} />
          <h1 className="text-3xl font-heading font-light text-foreground">News & Resources</h1>
        </div>
        <p className="text-sm text-muted-foreground font-body font-light mb-8 max-w-2xl">
          Stay current with peptide therapy developments, regulatory updates, and clinical research from trusted sources.
        </p>

        <div className="space-y-4">
          {articles.map((article, i) => (
            <Card key={i} className="border-border bg-card hover:border-primary/30 transition-colors">
              <CardContent className="py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="text-lg font-heading font-light text-foreground">{article.title}</h3>
                  <p className="text-sm text-muted-foreground font-body font-light">{article.summary}</p>
                  <span className="text-xs text-primary font-body font-light">{article.source}</span>
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
      </main>
      <Footer />
    </div>
  );
};

export default News;
