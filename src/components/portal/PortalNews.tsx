import { ExternalLink, Newspaper } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
  {
    title: "BPC-157: Mechanisms of Action",
    summary: "A comprehensive review of BPC-157's gastroprotective and wound-healing properties across multiple organ systems.",
    url: "https://pubmed.ncbi.nlm.nih.gov/?term=BPC-157+review",
    source: "PubMed",
  },
  {
    title: "Growth Hormone Secretagogues Overview",
    summary: "Clinical perspectives on GHRPs, Ipamorelin, and CJC-1295 in age management protocols.",
    url: "https://pubmed.ncbi.nlm.nih.gov/?term=growth+hormone+secretagogue",
    source: "PubMed",
  },
];

export default function PortalNews() {
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Newspaper size={18} strokeWidth={1.2} className="text-primary" />
          <h2 className="text-2xl font-heading font-light text-foreground">Peptide News</h2>
        </div>
        <p className="text-sm text-muted-foreground font-body font-light">
          Curated research, regulatory updates, and clinical developments from trusted sources.
        </p>
      </div>

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
    </div>
  );
}
