import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ClipboardList, ExternalLink } from "lucide-react";

interface PeptideRequest {
  id: string;
  peptide_name: string;
  variation_label: string | null;
  status: string;
  deny_reason: string | null;
  payment_url: string | null;
  created_at: string;
}

const statusBadge: Record<string, string> = {
  pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  approved: "bg-green-500/20 text-green-400 border-green-500/30",
  denied: "bg-destructive/20 text-destructive border-destructive/30",
};

export default function MyRequests({ requests }: { requests: PeptideRequest[] }) {
  return (
    <section>
      <div className="flex items-center gap-2 mb-4">
        <ClipboardList size={16} strokeWidth={1.2} className="text-primary" />
        <h2 className="text-xs tracking-[0.2em] uppercase text-foreground font-body font-light">
          My Requests
        </h2>
      </div>

      {requests.length === 0 ? (
        <Card className="border-border bg-card">
          <CardContent className="py-10 text-center">
            <p className="text-sm text-muted-foreground font-body font-light">
              No peptide requests yet. Browse the catalog to get started.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {requests.map((r) => (
            <Card key={r.id} className="border-border bg-card">
              <CardContent className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-heading font-light text-foreground">
                      {r.peptide_name}
                    </span>
                    {r.variation_label && (
                      <span className="text-xs text-muted-foreground font-body font-light">
                        ({r.variation_label})
                      </span>
                    )}
                    <Badge variant="outline" className={statusBadge[r.status] || ""}>
                      {r.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground font-body font-light">
                    Requested {new Date(r.created_at).toLocaleDateString()}
                  </p>
                  {r.status === "denied" && r.deny_reason && (
                    <p className="text-xs text-destructive font-body font-light mt-1">
                      Reason: {r.deny_reason}
                    </p>
                  )}
                </div>

                {r.status === "approved" && r.payment_url && (
                  <Button
                    size="sm"
                    onClick={() => window.open(r.payment_url!, "_blank")}
                    className="text-xs tracking-wider uppercase font-body font-light rounded-none gap-1.5"
                  >
                    <ExternalLink size={14} /> Pay Now
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}
