import { useState, useEffect, useRef, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

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
  tokenize: () => Promise<{ status: string; token?: string; errors?: Array<{ message: string }> }>;
  destroy: () => void;
}

interface SubscriptionCheckoutProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tier: {
    id: string;
    name: string;
    slug: string;
    monthly_price: number;
    annual_price: number;
  } | null;
  billingCycle: "monthly" | "annual";
  onSuccess: () => void;
}

const SQUARE_APP_ID = import.meta.env.VITE_SQUARE_APP_ID || "";
const SQUARE_LOCATION_ID = import.meta.env.VITE_SQUARE_LOCATION_ID || "";

const SubscriptionCheckout = ({
  open,
  onOpenChange,
  tier,
  billingCycle,
  onSuccess,
}: SubscriptionCheckoutProps) => {
  const [address, setAddress] = useState({
    line1: "",
    city: "",
    state: "",
    zip: "",
  });
  const [loading, setLoading] = useState(false);
  const [cardReady, setCardReady] = useState(false);
  const cardRef = useRef<SquareCard | null>(null);
  const initRef = useRef(false);

  const initializeCard = useCallback(async () => {
    if (!window.Square || !SQUARE_APP_ID || !SQUARE_LOCATION_ID) {
      console.error("Square SDK not loaded or missing app/location ID");
      return;
    }

    try {
      const payments = await window.Square.payments(SQUARE_APP_ID, SQUARE_LOCATION_ID);
      const card = await payments.card();
      await card.attach("#square-card-container");
      cardRef.current = card;
      setCardReady(true);
    } catch (e) {
      console.error("Failed to initialize Square card:", e);
    }
  }, []);

  useEffect(() => {
    if (open && !initRef.current) {
      initRef.current = true;
      // Small delay for DOM to be ready
      const t = setTimeout(() => initializeCard(), 300);
      return () => clearTimeout(t);
    }
    if (!open) {
      initRef.current = false;
      setCardReady(false);
      if (cardRef.current) {
        try { cardRef.current.destroy(); } catch { /* ignore */ }
        cardRef.current = null;
      }
    }
  }, [open, initializeCard]);

  const handleSubmit = async () => {
    if (!cardRef.current || !tier) return;

    if (!address.line1 || !address.city || !address.state || !address.zip) {
      toast({ title: "Please fill in all address fields", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const result = await cardRef.current.tokenize();
      if (result.status !== "OK" || !result.token) {
        const msg = result.errors?.[0]?.message || "Card tokenization failed";
        toast({ title: msg, variant: "destructive" });
        setLoading(false);
        return;
      }

      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData?.session?.access_token;

      const res = await supabase.functions.invoke("create-subscription", {
        body: {
          tier_id: tier.id,
          billing_cycle: billingCycle,
          card_nonce: result.token,
          address,
        },
      });

      if (res.error) {
        throw new Error(res.error.message || "Subscription failed");
      }

      const data = res.data as { success?: boolean; error?: string; details?: Array<{ detail?: string }> };

      if (!data?.success) {
        const detail = data?.details?.[0]?.detail || data?.error || "Subscription creation failed";
        throw new Error(detail);
      }

      toast({ title: "Subscription created!", description: "Welcome to Premier Vitality." });
      onOpenChange(false);
      onSuccess();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Something went wrong";
      toast({ title: msg, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const price = tier
    ? billingCycle === "monthly"
      ? tier.monthly_price
      : tier.annual_price
    : 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-card border-border">
        <DialogHeader>
          <DialogTitle className="font-heading font-light text-2xl text-foreground">
            Subscribe to {tier?.name}
          </DialogTitle>
          <DialogDescription className="font-body font-light text-muted-foreground text-sm">
            ${price}/mo — billed {billingCycle === "annual" ? "annually" : "monthly"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 mt-2">
          {/* Address Section */}
          <div className="space-y-3">
            <p className="text-xs tracking-[0.2em] uppercase text-primary font-body font-light">
              Shipping Address
            </p>
            <div>
              <Label htmlFor="line1" className="text-xs text-muted-foreground font-body font-light">
                Street Address
              </Label>
              <Input
                id="line1"
                value={address.line1}
                onChange={(e) => setAddress((a) => ({ ...a, line1: e.target.value }))}
                placeholder="123 Main St"
                className="mt-1 bg-secondary border-border text-foreground font-body font-light text-sm"
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label htmlFor="city" className="text-xs text-muted-foreground font-body font-light">
                  City
                </Label>
                <Input
                  id="city"
                  value={address.city}
                  onChange={(e) => setAddress((a) => ({ ...a, city: e.target.value }))}
                  placeholder="City"
                  className="mt-1 bg-secondary border-border text-foreground font-body font-light text-sm"
                />
              </div>
              <div>
                <Label htmlFor="state" className="text-xs text-muted-foreground font-body font-light">
                  State
                </Label>
                <Input
                  id="state"
                  value={address.state}
                  onChange={(e) => setAddress((a) => ({ ...a, state: e.target.value }))}
                  placeholder="TX"
                  maxLength={2}
                  className="mt-1 bg-secondary border-border text-foreground font-body font-light text-sm"
                />
              </div>
              <div>
                <Label htmlFor="zip" className="text-xs text-muted-foreground font-body font-light">
                  Zip
                </Label>
                <Input
                  id="zip"
                  value={address.zip}
                  onChange={(e) => setAddress((a) => ({ ...a, zip: e.target.value }))}
                  placeholder="77001"
                  maxLength={10}
                  className="mt-1 bg-secondary border-border text-foreground font-body font-light text-sm"
                />
              </div>
            </div>
          </div>

          {/* Card Section */}
          <div className="space-y-3">
            <p className="text-xs tracking-[0.2em] uppercase text-primary font-body font-light">
              Payment
            </p>
            <div
              id="square-card-container"
              className="min-h-[90px] rounded border border-border bg-secondary p-3"
            />
            {!cardReady && (
              <p className="text-xs text-muted-foreground font-body animate-pulse">
                Loading payment form…
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={loading || !cardReady}
            className="w-full py-3 text-xs tracking-[0.2em] uppercase font-body font-light bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Processing…
              </>
            ) : (
              `Pay Now — $${price}/mo`
            )}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SubscriptionCheckout;
