import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, ArrowUp, ArrowLeft, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { sanitizeName, sanitizePhone, sanitizeAddress, sanitizeZip } from "@/lib/sanitize";

interface CurrentMembership {
  id: string;
  tier_id: string;
  billing_cycle: string;
  started_at: string;
  tier_name: string;
  tier_slug: string;
  monthly_price: number;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentMembership: CurrentMembership;
  userId: string;
  onUpgraded: () => void;
}

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA",
  "KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT",
  "VA","WA","WV","WI","WY",
];

export default function MembershipUpgradeDialog({
  open,
  onOpenChange,
  currentMembership,
  userId,
  onUpgraded,
}: Props) {
  const [upgrading, setUpgrading] = useState<string | null>(null);
  const [step, setStep] = useState<"select" | "info">("select");
  const [selectedTier, setSelectedTier] = useState<{ id: string; name: string } | null>(null);

  // Personal info form
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [birthday, setBirthday] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressCity, setAddressCity] = useState("");
  const [addressState, setAddressState] = useState("");
  const [addressZip, setAddressZip] = useState("");

  // Pre-fill from profile
  useEffect(() => {
    if (!open) {
      setStep("select");
      setSelectedTier(null);
      return;
    }
    const loadProfile = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("first_name, last_name, phone, birthday, address_line1, address_city, address_state, address_zip")
        .eq("user_id", userId)
        .maybeSingle();
      if (data) {
        setFirstName(data.first_name || "");
        setLastName(data.last_name || "");
        setPhone(data.phone || "");
        setBirthday(data.birthday || "");
        setAddressLine1(data.address_line1 || "");
        setAddressCity(data.address_city || "");
        setAddressState(data.address_state || "");
        setAddressZip(data.address_zip || "");
      }
    };
    loadProfile();
  }, [open, userId]);

  const { data: tiers } = useQuery({
    queryKey: ["upgrade-tiers"],
    enabled: open,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("membership_tiers")
        .select("*")
        .order("sort_order");
      if (error) throw error;
      return data;
    },
  });

  const isLegacy = currentMembership.tier_slug === "legacy";
  const essentialTier = tiers?.find((t) => t.slug === "essential");
  const baselinePrice = isLegacy && essentialTier ? essentialTier.monthly_price : currentMembership.monthly_price;

  const getProratedAmount = (newMonthlyPrice: number) => {
    const startDate = new Date(currentMembership.started_at);
    const now = new Date();
    const daysSinceStart = Math.floor(
      (now.getTime() - startDate.getTime()) / 86400000
    );
    const daysInMonth = 30;
    const daysRemaining = Math.max(0, daysInMonth - (daysSinceStart % daysInMonth));
    const dailyDifference = (newMonthlyPrice - baselinePrice) / daysInMonth;
    const prorated = Math.max(0, Math.round(dailyDifference * daysRemaining * 100) / 100);
    return { prorated, daysRemaining, dailyDifference: Math.round(dailyDifference * 100) / 100 };
  };

  const getMonthlyExtra = (newMonthlyPrice: number) => {
    return Math.max(0, newMonthlyPrice - baselinePrice);
  };

  const validateInfo = () => {
    if (!firstName.trim() || !lastName.trim()) {
      toast.error("Please enter your full name");
      return false;
    }
    if (!phone.trim()) {
      toast.error("Please enter your phone number");
      return false;
    }
    if (!addressLine1.trim() || !addressCity.trim() || !addressState || !addressZip.trim()) {
      toast.error("Please enter your full address");
      return false;
    }
    return true;
  };

  const handleSelectTier = (tierId: string, tierName: string) => {
    setSelectedTier({ id: tierId, name: tierName });
    setStep("info");
  };

  const handleUpgrade = async () => {
    if (!selectedTier) return;
    if (!validateInfo()) return;

    setUpgrading(selectedTier.id);
    try {
      const res = await supabase.functions.invoke("upgrade-subscription", {
        body: {
          new_tier_id: selectedTier.id,
          customer_info: {
            first_name: firstName.trim(),
            last_name: lastName.trim(),
            phone: phone.trim(),
            birthday: birthday || null,
            address: {
              line1: addressLine1.trim(),
              city: addressCity.trim(),
              state: addressState,
              zip: addressZip.trim(),
            },
          },
        },
      });

      if (res.error) throw new Error(res.error.message || "Upgrade failed");
      const data = res.data as { success?: boolean; error?: string; details?: Array<{ detail?: string }> };
      if (!data?.success) {
        throw new Error(data?.details?.[0]?.detail || data?.error || "Upgrade failed");
      }

      toast.success(`Upgraded to ${selectedTier.name}!`, {
        description: "Your subscription has been updated. New benefits are active immediately.",
      });
      onOpenChange(false);
      onUpgraded();
    } catch (e: unknown) {
      console.error("Upgrade error:", e);
      toast.error(e instanceof Error ? e.message : "Failed to upgrade membership");
    } finally {
      setUpgrading(null);
    }
  };

  const upgradeTiers = tiers?.filter((t) => {
    const currentTier = tiers.find((ct) => ct.id === currentMembership.tier_id);
    return currentTier ? t.sort_order > currentTier.sort_order : false;
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg bg-card border-border max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-heading font-light text-foreground">
            {step === "select" ? "Upgrade Your Membership" : "Your Information"}
          </DialogTitle>
          <DialogDescription className="text-sm font-body font-light text-muted-foreground">
            {step === "select" ? (
              <>
                You're currently on the{" "}
                <span className="text-primary">{currentMembership.tier_name}</span>{" "}
                plan{isLegacy ? " (equivalent to Essential)" : ` at $${currentMembership.monthly_price}/mo`}. Upgrade to unlock more benefits.
              </>
            ) : (
              <>Please confirm your details below to complete your upgrade to <span className="text-primary">{selectedTier?.name}</span>.</>
            )}
          </DialogDescription>
        </DialogHeader>

        {step === "select" && (
          <div className="space-y-4 mt-2">
            {upgradeTiers?.map((tier) => {
              const { prorated, daysRemaining } = getProratedAmount(tier.monthly_price);
              const monthlyExtra = getMonthlyExtra(tier.monthly_price);
              const features = (tier.features as string[]) || [];
              const isPopular = tier.slug === "premium";

              return (
                <Card
                  key={tier.id}
                  className={`relative border ${isPopular ? "border-primary/60" : "border-border"} bg-background`}
                >
                  {isPopular && (
                    <div className="absolute -top-2.5 left-4">
                      <span className="inline-flex items-center gap-1 bg-primary text-primary-foreground text-[8px] tracking-[0.2em] uppercase font-body px-2 py-0.5">
                        <Sparkles size={8} /> Recommended
                      </span>
                    </div>
                  )}
                  <CardHeader className="pb-2 pt-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xs tracking-[0.3em] uppercase text-primary font-body font-light">
                        {tier.name}
                      </CardTitle>
                      <div className="text-right">
                        {isLegacy ? (
                          <>
                            <span className="text-xs text-muted-foreground font-body line-through mr-1.5">
                              ${tier.monthly_price.toFixed(2)}
                            </span>
                            <span className="text-xl font-heading font-light text-foreground">
                              +${monthlyExtra.toFixed(2)}
                            </span>
                            <span className="text-muted-foreground text-xs font-body">/mo extra</span>
                          </>
                        ) : (
                          <>
                            <span className="text-xl font-heading font-light text-foreground">
                              ${tier.monthly_price.toFixed(2)}
                            </span>
                            <span className="text-muted-foreground text-xs font-body">/mo</span>
                          </>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2 pb-4">
                    {tier.discount_pct > 0 && (
                      <div className="flex items-start gap-2 text-xs text-muted-foreground font-body font-light">
                        <Check size={12} className="text-primary mt-0.5 shrink-0" />
                        <span>{tier.discount_pct}% peptide discount</span>
                      </div>
                    )}
                    <div className="flex items-start gap-2 text-xs text-muted-foreground font-body font-light">
                      <Check size={12} className="text-primary mt-0.5 shrink-0" />
                      <span>{tier.blood_work_frequency} blood work</span>
                    </div>
                    <div className="flex items-start gap-2 text-xs text-muted-foreground font-body font-light">
                      <Check size={12} className="text-primary mt-0.5 shrink-0" />
                      <span>{tier.consultation_frequency}</span>
                    </div>
                    {features.slice(0, 2).map((f, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-muted-foreground font-body font-light">
                        <Check size={12} className="text-primary mt-0.5 shrink-0" />
                        <span>{f}</span>
                      </div>
                    ))}

                    <div className="mt-3 pt-3 border-t border-border">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[10px] tracking-[0.1em] uppercase text-muted-foreground font-body font-light">
                            Due today ({daysRemaining} days remaining)
                          </p>
                          <p className="text-lg font-heading font-light text-foreground">
                            ${prorated.toFixed(2)}
                          </p>
                        </div>
                        <button
                          onClick={() => handleSelectTier(tier.id, tier.name)}
                          className={`flex items-center gap-1.5 px-5 py-2.5 text-[10px] tracking-[0.2em] uppercase font-body font-light transition-colors ${
                            isPopular
                              ? "bg-primary text-primary-foreground hover:bg-primary/90"
                              : "border border-primary/40 text-primary hover:bg-primary/10"
                          }`}
                        >
                          <ArrowUp size={12} />
                          Select
                        </button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            {(!upgradeTiers || upgradeTiers.length === 0) && (
              <p className="text-sm text-muted-foreground font-body font-light text-center py-4">
                You're already on the highest tier!
              </p>
            )}
          </div>
        )}

        {step === "info" && (
          <div className="space-y-4 mt-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-body font-light text-muted-foreground">First Name *</Label>
                <Input value={firstName} onChange={(e) => setFirstName(sanitizeName(e.target.value))} maxLength={100} className="bg-background border-border text-sm" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-body font-light text-muted-foreground">Last Name *</Label>
                <Input value={lastName} onChange={(e) => setLastName(sanitizeName(e.target.value))} maxLength={100} className="bg-background border-border text-sm" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-body font-light text-muted-foreground">Phone *</Label>
                <Input value={phone} onChange={(e) => setPhone(sanitizePhone(e.target.value))} placeholder="(555) 123-4567" className="bg-background border-border text-sm" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-body font-light text-muted-foreground">Date of Birth</Label>
                <Input type="date" value={birthday} onChange={(e) => setBirthday(e.target.value)} className="bg-background border-border text-sm" />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-body font-light text-muted-foreground">Street Address *</Label>
              <Input value={addressLine1} onChange={(e) => setAddressLine1(sanitizeAddress(e.target.value))} maxLength={200} className="bg-background border-border text-sm" />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-body font-light text-muted-foreground">City *</Label>
                <Input value={addressCity} onChange={(e) => setAddressCity(sanitizeAddress(e.target.value, 100))} maxLength={100} className="bg-background border-border text-sm" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-body font-light text-muted-foreground">State *</Label>
                <select
                  value={addressState}
                  onChange={(e) => setAddressState(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring text-foreground"
                >
                  <option value="">—</option>
                  {US_STATES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-body font-light text-muted-foreground">ZIP *</Label>
                <Input value={addressZip} onChange={(e) => setAddressZip(e.target.value)} className="bg-background border-border text-sm" />
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-border">
              <button
                onClick={() => setStep("select")}
                className="flex items-center gap-1.5 px-4 py-2 text-[10px] tracking-[0.2em] uppercase font-body font-light text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft size={12} />
                Back
              </button>
              <button
                onClick={handleUpgrade}
                disabled={!!upgrading}
                className="flex items-center gap-1.5 px-6 py-2.5 text-[10px] tracking-[0.2em] uppercase font-body font-light bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                <ArrowUp size={12} />
                {upgrading ? "Upgrading..." : `Upgrade to ${selectedTier?.name}`}
              </button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
