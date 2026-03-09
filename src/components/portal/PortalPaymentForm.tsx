// Native Square Web Payments SDK — no redirect, card form embedded in portal
// Drop this into any page: <PortalPaymentForm tierId="premium" billing="monthly" onSuccess={...} />

import { useState, useEffect, useRef } from "react";
import { CheckCircle, Lock, AlertCircle, Loader } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { MEMBERSHIP_TIERS, getTierById } from "@/data/membershipConfig";

interface PortalPaymentFormProps {
  tierId: string;
  billing: "monthly" | "annual";
  onSuccess: () => void;
  onCancel: () => void;
}

declare global {
  interface Window { Square: any; }
}

const SQUARE_APP_ID = import.meta.env.VITE_SQUARE_APP_ID;
const SQUARE_LOCATION_ID = import.meta.env.VITE_SQUARE_LOCATION_ID;

const PortalPaymentForm = ({ tierId, billing, onSuccess, onCancel }: PortalPaymentFormProps) => {
  const tier = getTierById(tierId);
  const cardRef = useRef<HTMLDivElement>(null);
  const cardInstanceRef = useRef<any>(null);
  const paymentsRef = useRef<any>(null);

  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [cardReady, setCardReady] = useState(false);

  const price = tier ? (billing === "annual" ? tier.annualPrice : tier.price) : 0;

  useEffect(() => {
    if (!tier || tier.price === 0) { setLoading(false); return; }

    const loadSquare = async () => {
      // Load Square SDK if not already loaded
      if (!window.Square) {
        const script = document.createElement("script");
        script.src = "https://web.squarecdn.com/v1/square.js";
        script.onload = () => initSquare();
        document.head.appendChild(script);
      } else {
        initSquare();
      }
    };

    const initSquare = async () => {
      try {
        const payments = window.Square.payments(SQUARE_APP_ID, SQUARE_LOCATION_ID);
        paymentsRef.current = payments;

        const card = await payments.card({
          style: {
            input: {
              backgroundColor: "transparent",
              color: "#ffffff",
              fontFamily: "inherit",
              fontSize: "13px",
            },
            "input::placeholder": { color: "rgba(255,255,255,0.2)" },
            ".message-text": { color: "rgba(255,255,255,0.4)" },
            ".message-icon": { color: "rgba(255,255,255,0.4)" },
          },
        });

        await card.attach(cardRef.current);
        cardInstanceRef.current = card;
        setCardReady(true);
        setLoading(false);
      } catch (e) {
        console.error("Square init error:", e);
        setError("Payment form failed to load. Please refresh and try again.");
        setLoading(false);
      }
    };

    loadSquare();

    return () => {
      if (cardInstanceRef.current) {
        try { cardInstanceRef.current.destroy(); } catch {}
      }
    };
  }, [tierId]);

  const handleSubmit = async () => {
    if (!cardInstanceRef.current || !tier) return;
    setProcessing(true);
    setError(null);

    try {
      // Tokenize the card
      const result = await cardInstanceRef.current.tokenize();
      if (result.status !== "OK") {
        setError(result.errors?.[0]?.message || "Card tokenization failed.");
        setProcessing(false);
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setError("Not authenticated."); setProcessing(false); return; }

      // Call edge function to charge + create subscription
      const { data, error: fnError } = await supabase.functions.invoke("square-payment", {
        body: {
          sourceId: result.token,
          tierId,
          billing,
          amount: Math.round(price * 100), // cents
          userId: user.id,
          email: user.email,
        },
      });

      if (fnError || !data?.success) {
        setError(data?.error || "Payment failed. Please try again.");
        setProcessing(false);
        return;
      }

      // Update membership in Supabase
      await supabase.from("memberships").upsert({
        user_id: user.id,
        tier: tierId,
        billing_cycle: billing,
        status: "active",
        square_subscription_id: data.subscriptionId,
        next_billing_date: data.nextBillingDate,
        updated_at: new Date().toISOString(),
      }, { onConflict: "user_id" });

      setSuccess(true);
      setTimeout(onSuccess, 2000);
    } catch (e) {
      console.error(e);
      setError("An unexpected error occurred.");
      setProcessing(false);
    }
  };

  if (!tier) return null;

  if (success) {
    return (
      <div className="text-center py-10">
        <CheckCircle size={40} className="text-emerald-400/70 mx-auto mb-4" strokeWidth={1} />
        <p className="text-sm font-body font-light text-foreground/90 mb-1">Payment Successful</p>
        <p className="text-xs text-muted-foreground/50 font-body">
          Welcome to {tier.name}. Your benefits are now active.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Order summary */}
      <div className="border border-border/30 bg-card/20 p-4">
        <p className="text-[9px] tracking-[0.2em] uppercase text-muted-foreground/30 font-body mb-3">Order Summary</p>
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-body font-light text-foreground/80">{tier.name} Membership</p>
          <p className="text-sm font-body font-light text-foreground/80">${price}/mo</p>
        </div>
        {billing === "annual" && (
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-body text-muted-foreground/40">Billed annually (save 17%)</p>
            <p className="text-[10px] font-body text-emerald-400/60">Save ${(tier.price - tier.annualPrice) * 12}/yr</p>
          </div>
        )}
        {tier.showDiscount && (
          <div className="mt-3 pt-3 border-t border-border/20 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400/60" />
            <p className="text-[10px] font-body text-emerald-400/60">{tier.discount}% peptide discount activates immediately</p>
          </div>
        )}
      </div>

      {/* Card form */}
      <div>
        <p className="text-[9px] tracking-[0.2em] uppercase text-muted-foreground/30 font-body mb-2">Payment Details</p>
        <div className="border border-border/30 bg-card/10 p-4 min-h-[60px] relative">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader size={14} className="animate-spin text-muted-foreground/30" />
            </div>
          )}
          <div ref={cardRef} className={loading ? "opacity-0" : "opacity-100"} />
        </div>
        <div className="flex items-center gap-1.5 mt-2">
          <Lock size={9} className="text-muted-foreground/25" />
          <p className="text-[9px] text-muted-foreground/25 font-body">Secured by Square · PCI DSS compliant · Never stored on our servers</p>
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-2 p-3 bg-red-500/5 border border-red-400/15">
          <AlertCircle size={12} className="text-red-400/60 mt-0.5 shrink-0" />
          <p className="text-[11px] text-red-400/60 font-body">{error}</p>
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={onCancel}
          className="flex-1 py-3 border border-border/30 text-[10px] font-body font-extralight tracking-[0.15em] uppercase text-muted-foreground/40 hover:text-muted-foreground/70 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={processing || !cardReady || loading}
          className="flex-1 py-3 bg-primary/90 text-primary-foreground text-[10px] font-body font-extralight tracking-[0.15em] uppercase hover:bg-primary transition-colors disabled:opacity-40 flex items-center justify-center gap-2"
        >
          {processing ? <><Loader size={11} className="animate-spin" /> Processing...</> : `Subscribe · $${price}/mo`}
        </button>
      </div>
    </div>
  );
};

export default PortalPaymentForm;
