import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ClipboardList, CreditCard, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import PeptideCheckout from "./PeptideCheckout";
import { toast } from "sonner";

interface PeptideRequest {
  id: string;
  peptide_id: string;
  peptide_name: string;
  variation_label: string | null;
  price: number | null;
  status: string;
  deny_reason: string | null;
  payment_url: string | null;
  include_injection_kit: boolean;
  delivery_method: string | null;
  created_at: string;
}

const INJECTABLE_ROUTES = ["Subcutaneous Injectable", "Lyophilized Powder"];

const statusBadge: Record<string, string> = {
  pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  approved: "bg-green-500/20 text-green-400 border-green-500/30",
  denied: "bg-destructive/20 text-destructive border-destructive/30",
  paid: "bg-primary/20 text-primary border-primary/30",
};

const PICKUP_ADDRESS = "1870 W. Fry Rd. Ste 1, Chandler, AZ 85224";
const INJECTION_KIT_PRICE = 30;
const SHIPPING_PRICE = 35;
const COURIER_PRICE = 50;

export default function MyRequests({
  requests,
  onRefresh,
  membership,
}: {
  requests: PeptideRequest[];
  onRefresh: () => void;
  membership?: any;
}) {
  const [adminRoutes, setAdminRoutes] = useState<Record<string, string>>({});
  const [checkoutRequest, setCheckoutRequest] = useState<PeptideRequest | null>(null);

  // Fetch administration routes for all peptides in requests
  useEffect(() => {
    const peptideIds = [...new Set(requests.map((r) => r.peptide_id).filter(Boolean))];
    if (peptideIds.length === 0) return;
    supabase
      .from("peptides")
      .select("id, administration")
      .in("id", peptideIds)
      .then(({ data }) => {
        if (data) {
          const map: Record<string, string> = {};
          data.forEach((p) => { if (p.administration) map[p.id] = p.administration; });
          setAdminRoutes(map);
        }
      });
  }, [requests]);

  const isInjectable = (peptideId: string) =>
    INJECTABLE_ROUTES.includes(adminRoutes[peptideId] || "");

  const openCheckout = (r: PeptideRequest) => {
    setCheckoutRequest(r);
  };

  return (
    <section>
      <div className="flex items-center gap-2 mb-4">
        <ClipboardList size={16} strokeWidth={1.2} className="text-primary" />
        <h2 className="text-xs tracking-[0.2em] uppercase text-foreground font-body font-light">
          My Requests
        </h2>
      </div>

      {/* Ordering cadence notice */}
      <div className="mb-4 p-3 rounded border border-primary/20 bg-primary/5">
        <p className="text-xs font-body font-light text-foreground">
          <span className="font-medium">Ordering Cadence:</span> We place supplier orders every <span className="text-primary font-medium">Monday</span>. 
          Submit and pay for your order by Sunday evening to be included in the next batch. 
          Orders received after Monday will ship with the following week's order.
        </p>
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
          {requests.map((r) => {
            const needsOptions = r.status === "approved";

            return (
              <Card key={r.id} className="border-border bg-card">
                <CardContent className="py-4 space-y-4">
                  {/* Header row */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
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
                        <Badge
                          variant="outline"
                          className={statusBadge[r.status] || ""}
                        >
                          {r.status === "paid" ? "Order Confirmed · On Its Way" : r.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground font-body font-light">
                        Requested{" "}
                        {new Date(r.created_at).toLocaleDateString()}
                        {r.price != null && (
                          <span className="ml-2 text-foreground">
                            {r.status === "paid" ? (
                              <>${(
                                r.price +
                                (r.include_injection_kit ? INJECTION_KIT_PRICE : 0) +
                                (r.delivery_method === "shipping" ? SHIPPING_PRICE : 0)
                              ).toFixed(2)}</>
                            ) : (
                              <>${r.price.toFixed(2)}</>
                            )}
                          </span>
                        )}
                      </p>
                      {r.status === "denied" && r.deny_reason && (
                        <p className="text-xs text-destructive font-body font-light mt-1">
                          Reason: {r.deny_reason}
                        </p>
                      )}
                      {r.status === "paid" && r.delivery_method && (
                        <p className="text-[10px] text-muted-foreground/60 font-body font-light mt-1">
                          {r.delivery_method === "shipping" ? "📦 Shipping overnight" : `📍 Pickup at ${PICKUP_ADDRESS}`}
                          {r.include_injection_kit && " · Injection kit included"}
                        </p>
                      )}
                      {/* Subscribe Monthly button for paid requests when user has membership */}
                      {r.status === "paid" && membership && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={async () => {
                            const nextCharge = new Date();
                            nextCharge.setDate(nextCharge.getDate() + 30);
                            const { error } = await supabase
                              .from("peptide_subscriptions")
                              .insert({
                                user_id: (await supabase.auth.getUser()).data.user?.id!,
                                peptide_id: r.peptide_id,
                                peptide_name: r.peptide_name,
                                variation_label: r.variation_label,
                                price: r.price ?? 0,
                                include_injection_kit: r.include_injection_kit,
                                delivery_method: r.delivery_method || "pickup",
                                next_charge_at: nextCharge.toISOString().split("T")[0],
                              });
                            if (error) {
                              toast.error("Failed to set up auto-order");
                            } else {
                              toast.success("Monthly auto-order activated! Your card will be charged automatically.");
                              onRefresh();
                            }
                          }}
                          className="mt-2 text-[10px] tracking-wider uppercase font-body font-light rounded-none gap-1.5 border-primary/30 text-primary hover:bg-primary/10"
                        >
                          <RefreshCw size={12} /> Subscribe Monthly
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Pay button for approved requests */}
                  {needsOptions && (
                    <div className="border-t border-border pt-4 flex items-center justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground font-body font-light">Starting at</p>
                        <p className="text-lg font-heading font-light text-foreground">${(r.price ?? 0).toFixed(2)}</p>
                      </div>
                      <Button
                        onClick={() => openCheckout(r)}
                        className="text-xs tracking-wider uppercase font-body font-light rounded-none gap-1.5"
                      >
                        <CreditCard size={14} /> Pay Now
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* In-app checkout dialog */}
      <PeptideCheckout
        open={!!checkoutRequest}
        onOpenChange={(v) => { if (!v) setCheckoutRequest(null); }}
        request={checkoutRequest ? {
          id: checkoutRequest.id,
          peptide_name: checkoutRequest.peptide_name,
          variation_label: checkoutRequest.variation_label,
          price: checkoutRequest.price ?? 0,
          peptide_id: checkoutRequest.peptide_id,
        } : null}
        includeKit={false}
        deliveryMethod={"pickup"}
        isInjectable={checkoutRequest ? isInjectable(checkoutRequest.peptide_id) : false}
        onSuccess={onRefresh}
      />
    </section>
  );
}
