import { useState, useEffect, useRef, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, ArrowRight, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

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

const SQUARE_APP_ID = "sq0idp-kWcPexAAa-82PgTZwZqotA";
const SQUARE_LOCATION_ID = "L85CTM0203T96";

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA",
  "KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT",
  "VA","WA","WV","WI","WY",
];

const SubscriptionCheckout = ({
  open,
  onOpenChange,
  tier,
  billingCycle,
  onSuccess,
}: SubscriptionCheckoutProps) => {
  const [step, setStep] = useState<1 | 2>(1);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dobStr, setDobStr] = useState(""); // MM/DD/YYYY
  const [address, setAddress] = useState({
    line1: "",
    line2: "",
    city: "",
    state: "",
    zip: "",
  });

  const [loading, setLoading] = useState(false);
  const [cardReady, setCardReady] = useState(false);
  const cardRef = useRef<SquareCard | null>(null);
  const initRef = useRef(false);

  // Pre-fill from auth user
  useEffect(() => {
    if (open) {
      supabase.auth.getUser().then(({ data }) => {
        const u = data?.user;
        if (u) {
          setEmail(u.email || "");
          setFirstName(u.user_metadata?.first_name || "");
          setLastName(u.user_metadata?.last_name || "");
        }
      });
    }
  }, [open]);

  // Reset on close
  useEffect(() => {
    if (!open) {
      setStep(1);
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
    if (step === 2 && !initRef.current) {
      initRef.current = true;
      const t = setTimeout(() => initializeCard(), 300);
      return () => clearTimeout(t);
    }
  }, [step, initializeCard]);

  // Auto-format DOB as MM/DD/YYYY
  const handleDobChange = (val: string) => {
    // Strip non-digits
    const digits = val.replace(/\D/g, "").slice(0, 8);
    let formatted = "";
    if (digits.length <= 2) {
      formatted = digits;
    } else if (digits.length <= 4) {
      formatted = `${digits.slice(0, 2)}/${digits.slice(2)}`;
    } else {
      formatted = `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
    }
    setDobStr(formatted);
  };

  const parseDob = (): string | null => {
    const parts = dobStr.split("/");
    if (parts.length !== 3) return null;
    const [mm, dd, yyyy] = parts;
    if (mm.length !== 2 || dd.length !== 2 || yyyy.length !== 4) return null;
    const m = parseInt(mm), d = parseInt(dd), y = parseInt(yyyy);
    if (m < 1 || m > 12 || d < 1 || d > 31 || y < 1900 || y > new Date().getFullYear()) return null;
    return `${yyyy}-${mm}-${dd}`;
  };

  const validateStep1 = () => {
    if (!firstName.trim()) { toast({ title: "First name is required", variant: "destructive" }); return false; }
    if (!lastName.trim()) { toast({ title: "Last name is required", variant: "destructive" }); return false; }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { toast({ title: "Valid email is required", variant: "destructive" }); return false; }
    if (!phone.trim() || phone.replace(/\D/g, "").length < 10) { toast({ title: "Valid phone number is required", variant: "destructive" }); return false; }
    if (!parseDob()) { toast({ title: "Valid date of birth is required (MM/DD/YYYY)", variant: "destructive" }); return false; }
    if (!address.line1.trim() || !address.city.trim() || !address.state || !address.zip.trim()) { toast({ title: "Please fill in all address fields", variant: "destructive" }); return false; }
    return true;
  };

  const handleContinue = () => { if (validateStep1()) setStep(2); };

  const handleSubmit = async () => {
    if (!cardRef.current || !tier) return;
    setLoading(true);
    try {
      const result = await cardRef.current.tokenize();
      if (result.status !== "OK" || !result.token) {
        const msg = result.errors?.[0]?.message || "Card tokenization failed";
        toast({ title: msg, variant: "destructive" });
        setLoading(false);
        return;
      }

      const res = await supabase.functions.invoke("create-subscription", {
        body: {
          tier_id: tier.id,
          billing_cycle: billingCycle,
          card_nonce: result.token,
          address: { line1: address.line1, line2: address.line2, city: address.city, state: address.state, zip: address.zip },
          first_name: firstName,
          last_name: lastName,
          phone,
          email,
          dob: parseDob(),
        },
      });

      if (res.error) throw new Error(res.error.message || "Subscription failed");
      const data = res.data as { success?: boolean; error?: string; details?: Array<{ detail?: string }> };
      if (!data?.success) {
        throw new Error(data?.details?.[0]?.detail || data?.error || "Subscription creation failed");
      }

      toast({ title: "Subscription created!", description: "Welcome to Premier Vitality." });
      onOpenChange(false);
      onSuccess();
    } catch (e: unknown) {
      toast({ title: e instanceof Error ? e.message : "Something went wrong", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const price = tier ? (billingCycle === "monthly" ? tier.monthly_price : tier.annual_price) : 0;
  const inputCls = "bg-secondary border-border text-foreground font-body font-light text-sm";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-card border-border max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-heading font-light text-2xl text-foreground">
            {step === 1 ? "Your Information" : "Payment"}
          </DialogTitle>
          <DialogDescription className="font-body font-light text-muted-foreground text-sm">
            {step === 1
              ? `${tier?.name} — $${price}/mo, billed ${billingCycle === "annual" ? "annually" : "monthly"}`
              : "Enter your card details to complete your subscription"}
          </DialogDescription>
        </DialogHeader>

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-2">
          <div className={cn("h-1 flex-1 rounded-full transition-colors", step >= 1 ? "bg-primary" : "bg-secondary")} />
          <div className={cn("h-1 flex-1 rounded-full transition-colors", step >= 2 ? "bg-primary" : "bg-secondary")} />
        </div>

        {step === 1 && (
          <div className="space-y-4 mt-2">
            {/* Name */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-muted-foreground font-body font-light">First Name</Label>
                <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="John" className={cn("mt-1", inputCls)} />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground font-body font-light">Last Name</Label>
                <Input value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Doe" className={cn("mt-1", inputCls)} />
              </div>
            </div>

            {/* Email & Phone */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-muted-foreground font-body font-light">Email</Label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="john@email.com" className={cn("mt-1", inputCls)} />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground font-body font-light">Phone</Label>
                <Input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(555) 123-4567" className={cn("mt-1", inputCls)} />
              </div>
            </div>

            {/* Date of Birth */}
            <div>
              <Label className="text-xs text-muted-foreground font-body font-light">Date of Birth</Label>
              <Input
                value={dobStr}
                onChange={(e) => handleDobChange(e.target.value)}
                placeholder="MM/DD/YYYY"
                maxLength={10}
                className={cn("mt-1", inputCls)}
              />
            </div>

            {/* Address */}
            <p className="text-xs tracking-[0.2em] uppercase text-primary font-body font-light pt-2">Shipping Address</p>
            <div>
              <Label className="text-xs text-muted-foreground font-body font-light">Street Address</Label>
              <Input value={address.line1} onChange={(e) => setAddress((a) => ({ ...a, line1: e.target.value }))} placeholder="123 Main St" className={cn("mt-1", inputCls)} />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground font-body font-light">Apt / Suite (optional)</Label>
              <Input value={address.line2} onChange={(e) => setAddress((a) => ({ ...a, line2: e.target.value }))} placeholder="Apt 4B" className={cn("mt-1", inputCls)} />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label className="text-xs text-muted-foreground font-body font-light">City</Label>
                <Input value={address.city} onChange={(e) => setAddress((a) => ({ ...a, city: e.target.value }))} placeholder="Houston" className={cn("mt-1", inputCls)} />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground font-body font-light">State</Label>
                <select
                  value={address.state}
                  onChange={(e) => setAddress((a) => ({ ...a, state: e.target.value }))}
                  className={cn("mt-1 flex h-10 w-full rounded-md border px-3 py-2", inputCls)}
                >
                  <option value="">—</option>
                  {US_STATES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground font-body font-light">Zip</Label>
                <Input value={address.zip} onChange={(e) => setAddress((a) => ({ ...a, zip: e.target.value }))} placeholder="77001" maxLength={10} className={cn("mt-1", inputCls)} />
              </div>
            </div>

            <button
              onClick={handleContinue}
              className="w-full py-3 text-xs tracking-[0.2em] uppercase font-body font-light bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 mt-2"
            >
              Continue to Payment <ArrowRight size={14} />
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5 mt-2">
            {/* Summary */}
            <div className="bg-secondary/50 border border-border p-4 space-y-1">
              <p className="text-sm text-foreground font-body">{firstName} {lastName}</p>
              <p className="text-xs text-muted-foreground font-body font-light">
                {address.line1}{address.line2 ? `, ${address.line2}` : ""}, {address.city}, {address.state} {address.zip}
              </p>
              <p className="text-xs text-muted-foreground font-body font-light">{email} · {phone}</p>
            </div>

            {/* Card */}
            <div className="space-y-3">
              <p className="text-xs tracking-[0.2em] uppercase text-primary font-body font-light">Card Details</p>
              <div id="square-card-container" className="min-h-[90px] rounded border border-border bg-secondary p-3" />
              {!cardReady && (
                <p className="text-xs text-muted-foreground font-body animate-pulse">Loading payment form…</p>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="flex-1 py-3 text-xs tracking-[0.2em] uppercase font-body font-light border border-primary/40 text-primary hover:bg-primary/10 transition-colors flex items-center justify-center gap-2"
              >
                <ArrowLeft size={14} /> Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading || !cardReady}
                className="flex-[2] py-3 text-xs tracking-[0.2em] uppercase font-body font-light bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <><Loader2 size={14} className="animate-spin" /> Processing…</>
                ) : (
                  `Pay Now — $${price}/mo`
                )}
              </button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SubscriptionCheckout;
