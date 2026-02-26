import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ClipboardList, MapPin, Truck, CreditCard } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import PeptideCheckout from "./PeptideCheckout";

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

export default function MyRequests({
  requests,
  onRefresh,
}: {
  requests: PeptideRequest[];
  onRefresh: () => void;
}) {
  const [options, setOptions] = useState<
    Record<string, { kit: boolean; delivery: "pickup" | "shipping" }>
  >({});
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

  const getOptions = (id: string) =>
    options[id] ?? { kit: false, delivery: "pickup" as const };

  const setOption = (
    id: string,
    patch: Partial<{ kit: boolean; delivery: "pickup" | "shipping" }>
  ) => {
    setOptions((prev) => ({
      ...prev,
      [id]: { ...getOptions(id), ...patch },
    }));
  };

  const calcTotal = (r: PeptideRequest) => {
    const opts = getOptions(r.id);
    let total = r.price ?? 0;
    if (opts.kit && isInjectable(r.peptide_id)) total += INJECTION_KIT_PRICE;
    if (opts.delivery === "shipping") total += SHIPPING_PRICE;
    return total;
  };

  const openCheckout = (r: PeptideRequest) => {
    setCheckoutRequest(r);
  };

  const checkoutOpts = checkoutRequest ? getOptions(checkoutRequest.id) : { kit: false, delivery: "pickup" as const };

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
          {requests.map((r) => {
            const opts = getOptions(r.id);
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
                    </div>
                  </div>

                  {/* Options picker for approved requests */}
                  {needsOptions && (
                    <div className="border-t border-border pt-4 space-y-4">
                      <p className="text-xs tracking-[0.15em] uppercase text-primary font-body font-light">
                        Configure your order
                      </p>

                      {/* Injection Kit — only for injectables */}
                      {isInjectable(r.peptide_id) && (
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label className="text-sm font-body font-light text-foreground">
                              Injection Kit — $30.00
                            </Label>
                            <p className="text-xs text-muted-foreground font-body font-light">
                              Includes 35 needles &amp; 35 alcohol swabs
                            </p>
                          </div>
                          <Switch
                            checked={opts.kit}
                            onCheckedChange={(v) => setOption(r.id, { kit: v })}
                          />
                        </div>
                      )}

                      {/* Delivery method */}
                      <div className="space-y-2">
                        <Label className="text-xs tracking-wider uppercase text-muted-foreground font-body font-light">
                          Delivery Method
                        </Label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => setOption(r.id, { delivery: "pickup" })}
                            className={`flex items-start gap-3 p-3 rounded border transition-colors text-left ${
                              opts.delivery === "pickup"
                                ? "border-primary bg-primary/5"
                                : "border-border bg-secondary/50 hover:border-muted-foreground/30"
                            }`}
                          >
                            <MapPin size={16} strokeWidth={1.2} className={opts.delivery === "pickup" ? "text-primary mt-0.5" : "text-muted-foreground mt-0.5"} />
                            <div>
                              <p className="text-sm font-body font-light text-foreground">Pickup</p>
                              <p className="text-xs text-muted-foreground font-body font-light mt-0.5">{PICKUP_ADDRESS}</p>
                            </div>
                          </button>
                          <button
                            type="button"
                            onClick={() => setOption(r.id, { delivery: "shipping" })}
                            className={`flex items-start gap-3 p-3 rounded border transition-colors text-left ${
                              opts.delivery === "shipping"
                                ? "border-primary bg-primary/5"
                                : "border-border bg-secondary/50 hover:border-muted-foreground/30"
                            }`}
                          >
                            <Truck size={16} strokeWidth={1.2} className={opts.delivery === "shipping" ? "text-primary mt-0.5" : "text-muted-foreground mt-0.5"} />
                            <div>
                              <p className="text-sm font-body font-light text-foreground">Ship to my address — $35.00</p>
                              <p className="text-xs text-muted-foreground font-body font-light mt-0.5">Overnight priority</p>
                            </div>
                          </button>
                        </div>
                      </div>

                      {/* Total + Pay */}
                      <div className="flex items-center justify-between pt-2 border-t border-border">
                        <div>
                          <p className="text-xs text-muted-foreground font-body font-light">Order Total</p>
                          <p className="text-lg font-heading font-light text-foreground">${calcTotal(r).toFixed(2)}</p>
                        </div>
                        <Button
                          onClick={() => openCheckout(r)}
                          className="text-xs tracking-wider uppercase font-body font-light rounded-none gap-1.5"
                        >
                          <CreditCard size={14} /> Pay Now
                        </Button>
                      </div>
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
        includeKit={checkoutOpts.kit}
        deliveryMethod={checkoutOpts.delivery}
        isInjectable={checkoutRequest ? isInjectable(checkoutRequest.peptide_id) : false}
        onSuccess={onRefresh}
      />
    </section>
  );
}
