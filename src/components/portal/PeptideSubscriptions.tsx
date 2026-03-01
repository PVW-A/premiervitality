import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RefreshCw, Pause, Play, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface PeptideSub {
  id: string;
  peptide_name: string;
  variation_label: string | null;
  price: number;
  include_injection_kit: boolean;
  delivery_method: string;
  status: string;
  next_charge_at: string;
  last_charged_at: string | null;
}

const INJECTION_KIT_PRICE = 30;
const SHIPPING_PRICE = 35;
const COURIER_PRICE = 50;

export default function PeptideSubscriptions({ userId }: { userId: string }) {
  const [subs, setSubs] = useState<PeptideSub[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSubs = async () => {
    const { data, error } = await supabase
      .from("peptide_subscriptions")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    if (!error && data) setSubs(data as PeptideSub[]);
    setLoading(false);
  };

  useEffect(() => {
    fetchSubs();
  }, [userId]);

  const toggleStatus = async (sub: PeptideSub, newStatus: "active" | "paused" | "cancelled") => {
    const { error } = await supabase
      .from("peptide_subscriptions")
      .update({ status: newStatus })
      .eq("id", sub.id);
    if (error) {
      toast.error("Failed to update subscription");
    } else {
      toast.success(
        newStatus === "cancelled"
          ? "Subscription cancelled"
          : newStatus === "paused"
          ? "Subscription paused"
          : "Subscription resumed"
      );
      fetchSubs();
    }
  };

  if (loading || subs.length === 0) return null;

  const statusBadge: Record<string, string> = {
    active: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    paused: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    cancelled: "bg-destructive/20 text-destructive border-destructive/30",
  };

  return (
    <section>
      <div className="flex items-center gap-2 mb-4">
        <RefreshCw size={16} strokeWidth={1.2} className="text-primary" />
        <h2 className="text-xs tracking-[0.2em] uppercase text-foreground font-body font-light">
          Monthly Auto-Orders
        </h2>
      </div>
      <div className="space-y-3">
        {subs.map((sub) => {
          const total =
            sub.price +
            (sub.include_injection_kit ? INJECTION_KIT_PRICE : 0) +
            (sub.delivery_method === "shipping" ? SHIPPING_PRICE : sub.delivery_method === "courier" ? COURIER_PRICE : 0);

          return (
            <Card key={sub.id} className="border-border bg-card">
              <CardContent className="py-4 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-heading font-light text-foreground">
                        {sub.peptide_name}
                      </span>
                      {sub.variation_label && (
                        <span className="text-xs text-muted-foreground font-body font-light">
                          ({sub.variation_label})
                        </span>
                      )}
                      <Badge variant="outline" className={statusBadge[sub.status] || ""}>
                        {sub.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground font-body font-light">
                      ${total.toFixed(2)}/month
                      {sub.include_injection_kit && " · Kit included"}
                      {" · "}
                      {sub.delivery_method === "shipping" ? "Shipped" : "Pickup"}
                    </p>
                    {sub.status !== "cancelled" && (
                      <p className="text-[10px] text-muted-foreground/70 font-body font-light">
                        Next charge: {new Date(sub.next_charge_at).toLocaleDateString()}
                        {sub.last_charged_at && (
                          <> · Last charged: {new Date(sub.last_charged_at).toLocaleDateString()}</>
                        )}
                      </p>
                    )}
                  </div>
                  {sub.status !== "cancelled" && (
                    <div className="flex items-center gap-2">
                      {sub.status === "active" ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleStatus(sub, "paused")}
                          className="text-[10px] tracking-wider uppercase font-body font-light rounded-none gap-1"
                        >
                          <Pause size={12} /> Pause
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleStatus(sub, "active")}
                          className="text-[10px] tracking-wider uppercase font-body font-light rounded-none gap-1"
                        >
                          <Play size={12} /> Resume
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleStatus(sub, "cancelled")}
                        className="text-[10px] tracking-wider uppercase font-body font-light rounded-none gap-1 text-destructive hover:text-destructive"
                      >
                        <X size={12} /> Cancel
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
