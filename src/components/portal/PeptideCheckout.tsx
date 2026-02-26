import { useState, useEffect, useRef, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, ArrowLeft, MapPin, Truck, Syringe } from "lucide-react";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

declare global {
  interface Window {
    Square?: {
      payments: (appId: string, locationId: string) => Promise<SquarePayments>;
    };
  }
}

interface SquarePayments {
  card: () => Promise<SquareCard>;
}

interface SquareCard {
  attach: (el: string) => Promise<void>;
  tokenize: () => Promise<{
    status: string;
    token?: string;
    errors?: Array<{ message: string }>;
  }>;
  destroy: () => void;
}

interface PeptideCheckoutProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  request: {
    id: string;
    peptide_name: string;
    variation_label: string | null;
    price: number;
    peptide_id: string;
  } | null;
  includeKit: boolean;
  deliveryMethod: "pickup" | "shipping";
  isInjectable: boolean;
  onSuccess: () => void;
}

const SQUARE_APP_ID = "sq0idp-kWcPexAAa-82PgTZwZqotA";
const SQUARE_LOCATION_ID = "L85CTM0203T96";
const INJECTION_KIT_PRICE = 30;
const SHIPPING_PRICE = 35;
const PICKUP_ADDRESS = "1870 W. Fry Rd. Ste 1, Chandler, AZ 85224";

export default function PeptideCheckout({
  open,
  onOpenChange,
  request,
  includeKit: initialKit,
  deliveryMethod: initialDelivery,
  isInjectable,
  onSuccess,
}: PeptideCheckoutProps) {
  const [loading, setLoading] = useState(false);
  const [cardReady, setCardReady] = useState(false);
  const [kit, setKit] = useState(initialKit);
  const [delivery, setDelivery] = useState(initialDelivery);
  const cardRef = useRef<SquareCard | null>(null);
  const initRef = useRef(false);

  // Sync initial values when dialog opens
  useEffect(() => {
    if (open) {
      setKit(initialKit);
      setDelivery(initialDelivery);
    }
  }, [open, initialKit, initialDelivery]);

  // Reset on close
  useEffect(() => {
    if (!open) {
      setCardReady(false);
      initRef.current = false;
      if (cardRef.current) {
        try { cardRef.current.destroy(); } catch { /* ignore */ }
        cardRef.current = null;
      }
    }
  }, [open]);

  const initializeCard = useCallback(async () => {
    if (!window.Square || !SQUARE_APP_ID || !SQUARE_LOCATION_ID) {
      console.error("Square SDK not loaded");
      return;
    }
    try {
      const payments = await window.Square.payments(SQUARE_APP_ID, SQUARE_LOCATION_ID);
      const card = await payments.card();
      await card.attach("#peptide-card-container");
      cardRef.current = card;
      setCardReady(true);
    } catch (e) {
      console.error("Failed to initialize Square card:", e);
    }
  }, []);

  useEffect(() => {
    if (open && !initRef.current) {
      initRef.current = true;
      const t = setTimeout(() => initializeCard(), 300);
      return () => clearTimeout(t);
    }
  }, [open, initializeCard]);

  const calcTotal = () => {
    if (!request) return 0;
    let total = request.price;
    if (kit && isInjectable) total += INJECTION_KIT_PRICE;
    if (delivery === "shipping") total += SHIPPING_PRICE;
    return total;
  };

  const handlePay = async () => {
    if (!cardRef.current || !request) return;
    setLoading(true);
    try {
      const result = await cardRef.current.tokenize();
      if (result.status !== "OK" || !result.token) {
        toast.error(result.errors?.[0]?.message || "Card tokenization failed");
        setLoading(false);
        return;
      }

      const res = await supabase.functions.invoke("process-peptide-payment", {
        body: {
          request_id: request.id,
          card_nonce: result.token,
          include_injection_kit: kit && isInjectable,
          delivery_method: delivery,
        },
      });

      if (res.error) throw new Error(res.error.message || "Payment failed");
      const data = res.data as { success?: boolean; error?: string; details?: Array<{ detail?: string }> };
      if (!data?.success) {
        throw new Error(data?.details?.[0]?.detail || data?.error || "Payment failed");
      }

      toast.success("Payment successful! Your order is confirmed.");
      onOpenChange(false);
      onSuccess();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const displayName = request
    ? request.variation_label
      ? `${request.peptide_name} — ${request.variation_label}`
      : request.peptide_name
    : "";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-card border-border max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-heading font-light text-2xl text-foreground">
            Complete Your Order
          </DialogTitle>
          <DialogDescription className="font-body font-light text-muted-foreground text-sm">
            {displayName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 mt-2">
          {/* Order summary */}
          <div className="space-y-3">
            <p className="text-xs tracking-[0.15em] uppercase text-primary font-body font-light">Order Summary</p>

            <div className="bg-secondary/50 border border-border p-4 space-y-2">
              <div className="flex justify-between text-sm font-body font-light">
                <span className="text-foreground">{displayName}</span>
                <span className="text-foreground">${request?.price.toFixed(2)}</span>
              </div>

              {/* Injection kit toggle */}
              {isInjectable && (
                <div className="flex items-center justify-between pt-2 border-t border-border/50">
                  <div className="flex items-center gap-2">
                    <Syringe size={14} strokeWidth={1.2} className="text-muted-foreground" />
                    <div>
                      <p className="text-sm font-body font-light text-foreground">Injection Kit — $30.00</p>
                      <p className="text-[10px] text-muted-foreground font-body font-light">35 needles & 35 alcohol swabs</p>
                    </div>
                  </div>
                  <Switch checked={kit} onCheckedChange={setKit} />
                </div>
              )}

              {/* Delivery method */}
              <div className="pt-2 border-t border-border/50 space-y-2">
                <Label className="text-[10px] tracking-wider uppercase text-muted-foreground font-body font-light">
                  Delivery
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setDelivery("pickup")}
                    className={cn(
                      "flex items-start gap-2 p-3 rounded border transition-colors text-left",
                      delivery === "pickup"
                        ? "border-primary bg-primary/5"
                        : "border-border bg-secondary/50 hover:border-muted-foreground/30"
                    )}
                  >
                    <MapPin size={14} strokeWidth={1.2} className={delivery === "pickup" ? "text-primary mt-0.5" : "text-muted-foreground mt-0.5"} />
                    <div>
                      <p className="text-xs font-body font-light text-foreground">Pickup</p>
                      <p className="text-[10px] text-muted-foreground font-body font-light mt-0.5">Free</p>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDelivery("shipping")}
                    className={cn(
                      "flex items-start gap-2 p-3 rounded border transition-colors text-left",
                      delivery === "shipping"
                        ? "border-primary bg-primary/5"
                        : "border-border bg-secondary/50 hover:border-muted-foreground/30"
                    )}
                  >
                    <Truck size={14} strokeWidth={1.2} className={delivery === "shipping" ? "text-primary mt-0.5" : "text-muted-foreground mt-0.5"} />
                    <div>
                      <p className="text-xs font-body font-light text-foreground">Ship — $35.00</p>
                      <p className="text-[10px] text-muted-foreground font-body font-light mt-0.5">Overnight priority</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between pt-2 border-t border-border/50">
                <span className="text-sm font-body font-light text-muted-foreground">Total</span>
                <span className="text-lg font-heading font-light text-foreground">${calcTotal().toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Card */}
          <div className="space-y-3">
            <p className="text-xs tracking-[0.15em] uppercase text-primary font-body font-light">Card Details</p>
            <div id="peptide-card-container" className="min-h-[90px] rounded border border-border bg-secondary p-3" />
            {!cardReady && (
              <p className="text-xs text-muted-foreground font-body animate-pulse">Loading payment form…</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={() => onOpenChange(false)}
              className="flex-1 py-3 text-xs tracking-[0.2em] uppercase font-body font-light border border-primary/40 text-primary hover:bg-primary/10 transition-colors flex items-center justify-center gap-2"
            >
              <ArrowLeft size={14} /> Cancel
            </button>
            <button
              onClick={handlePay}
              disabled={loading || !cardReady}
              className="flex-[2] py-3 text-xs tracking-[0.2em] uppercase font-body font-light bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <><Loader2 size={14} className="animate-spin" /> Processing…</>
              ) : (
                `Pay Now — $${calcTotal().toFixed(2)}`
              )}
            </button>
          </div>

          {delivery === "pickup" && (
            <p className="text-[10px] text-muted-foreground/60 font-body font-light text-center">
              Pickup at {PICKUP_ADDRESS}
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
