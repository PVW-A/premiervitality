import { useState, useEffect } from "react";
import { X, CheckCircle, AlertCircle, Tag } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { getTierById, getDiscountedPrice, formatDiscount } from "@/data/membershipConfig";

interface RequestOrderDialogProps {
  isOpen: boolean;
  onClose: () => void;
  compound: string;
  category: string;
  size?: string;
  price?: number;
  user: { id: string; email?: string } | null;
}

const RequestOrderDialog = ({
  isOpen, onClose, compound, category, size, price, user,
}: RequestOrderDialogProps) => {
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [memberTier, setMemberTier] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !isOpen) return;
    supabase
      .from("memberships")
      .select("tier")
      .eq("user_id", user.id)
      .eq("status", "active")
      .single()
      .then(({ data }) => { if (data) setMemberTier(data.tier); });
  }, [user, isOpen]);

  if (!isOpen) return null;

  const tier = memberTier ? getTierById(memberTier) : null;
  const discountedPrice = price && memberTier ? getDiscountedPrice(price, memberTier) : price;
  const discountLabel = memberTier ? formatDiscount(memberTier) : null;
  const savings = price && discountedPrice ? price - discountedPrice : 0;

  const handleSubmit = async () => {
    if (!user) return;
    if (!name.trim() || !phone.trim()) { alert("Please enter your name and phone number."); return; }
    setLoading(true);
    const { error } = await supabase.from("orders").insert({
      patient_id: user.id,
      patient_email: user.email,
      patient_phone: phone,
      patient_name: name,
      product_name: compound,
      product_category: category,
      size: size || null,
      price: discountedPrice || null,
      status: "pending",
    });
    setLoading(false);
    setStatus(error ? "error" : "success");
  };

  if (status === "success") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
        <div className="bg-card border border-border/40 max-w-md w-full p-8 text-center">
          <CheckCircle size={40} className="text-primary/70 mx-auto mb-4" strokeWidth={1} />
          <p className="text-sm font-body font-light text-foreground/90 mb-2">Request Submitted</p>
          <p className="text-xs font-body font-extralight text-muted-foreground/60 leading-relaxed mb-6">
            Your request for <strong className="font-light">{compound}</strong> has been sent to our clinical team. You'll receive a text message once your physician reviews it.
          </p>
          <button onClick={() => { setStatus("idle"); onClose(); }} className="px-8 py-2.5 border border-border/40 text-xs font-body font-extralight tracking-[0.2em] uppercase text-muted-foreground/60 hover:text-foreground/80 transition-colors">
            Close
          </button>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
        <div className="bg-card border border-border/40 max-w-md w-full p-8 text-center">
          <AlertCircle size={40} className="text-red-400/70 mx-auto mb-4" strokeWidth={1} />
          <p className="text-sm font-body font-light text-foreground/90 mb-2">Something went wrong</p>
          <p className="text-xs font-body font-extralight text-muted-foreground/60 mb-6">Please try again or contact us directly.</p>
          <button onClick={() => setStatus("idle")} className="px-8 py-2.5 bg-primary/10 border border-primary/20 text-xs font-body font-extralight tracking-[0.2em] uppercase text-primary/70 hover:bg-primary/20 transition-colors">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
      <div className="bg-card border border-border/40 max-w-lg w-full">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-border/20">
          <div>
            <p className="text-[9px] tracking-[0.25em] uppercase text-muted-foreground/40 font-body font-extralight mb-1">Treatment Request</p>
            <p className="text-base font-body font-light text-foreground/90">{compound}</p>
            <p className="text-[10px] tracking-[0.15em] uppercase text-muted-foreground/40 font-body mt-0.5">{category}</p>
          </div>
          <button onClick={onClose} className="text-muted-foreground/40 hover:text-muted-foreground/80 transition-colors mt-1">
            <X size={16} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-xs font-body font-extralight text-muted-foreground/50 leading-relaxed">
            Your physician will review this request and respond within 1 business day via SMS.
          </p>

          {/* Pricing with discount */}
          {price && (
            <div className="border border-border/20 bg-background/30 p-4">
              <p className="text-[9px] tracking-[0.2em] uppercase text-muted-foreground/30 font-body mb-2">Pricing</p>
              {discountLabel ? (
                <>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-body font-extralight text-muted-foreground/40 line-through">${price.toFixed(2)}</span>
                    <span className="text-xs font-body font-light text-foreground/80">${discountedPrice?.toFixed(2)}</span>
                  </div>
                  {size && <p className="text-[10px] text-muted-foreground/40 font-body mb-2">{size}</p>}
                  <div className="flex items-center gap-1.5 pt-2 border-t border-border/10">
                    <Tag size={9} className="text-emerald-400/60" />
                    <p className="text-[10px] font-body text-emerald-400/70">{discountLabel}</p>
                    {savings > 0 && <p className="text-[10px] font-body text-emerald-400/50 ml-auto">You save ${savings.toFixed(2)}</p>}
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-muted-foreground/40 font-body">{size}</span>
                  <span className="text-xs font-body font-light text-foreground/70">${price.toFixed(2)}</span>
                </div>
              )}
            </div>
          )}

          <div>
            <label className="block text-[9px] tracking-[0.2em] uppercase text-muted-foreground/40 font-body mb-1.5">Full Name *</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Your full name"
              className="w-full bg-background border border-border/40 px-3 py-2.5 text-xs font-body font-extralight text-foreground/80 placeholder:text-muted-foreground/30 focus:outline-none focus:border-primary/30 transition-colors" />
          </div>

          <div>
            <label className="block text-[9px] tracking-[0.2em] uppercase text-muted-foreground/40 font-body mb-1.5">Mobile Phone * (for SMS updates)</label>
            <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+1 (555) 000-0000"
              className="w-full bg-background border border-border/40 px-3 py-2.5 text-xs font-body font-extralight text-foreground/80 placeholder:text-muted-foreground/30 focus:outline-none focus:border-primary/30 transition-colors" />
          </div>

          <div>
            <label className="block text-[9px] tracking-[0.2em] uppercase text-muted-foreground/40 font-body mb-1.5">Notes for physician (optional)</label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Any health conditions, questions, or context..." rows={3}
              className="w-full bg-background border border-border/40 px-3 py-2.5 text-xs font-body font-extralight text-foreground/80 placeholder:text-muted-foreground/30 focus:outline-none focus:border-primary/30 transition-colors resize-none" />
          </div>

          <p className="text-[9px] font-body font-extralight text-muted-foreground/30 leading-relaxed">
            By submitting, you consent to receiving SMS updates. Standard rates may apply. This is a request for physician review - not a guaranteed prescription.
          </p>
        </div>

        <div className="px-6 pb-6 flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 border border-border/40 text-xs font-body font-extralight tracking-[0.15em] uppercase text-muted-foreground/50 hover:text-muted-foreground/80 transition-colors">
            Cancel
          </button>
          <button onClick={handleSubmit} disabled={loading} className="flex-1 py-3 bg-primary/90 text-primary-foreground text-xs font-body font-extralight tracking-[0.15em] uppercase hover:bg-primary transition-colors disabled:opacity-50">
            {loading ? "Submitting..." : "Submit Request"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RequestOrderDialog;
