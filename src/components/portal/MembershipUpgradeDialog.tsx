import { useState } from "react";
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
import { Check, ArrowUp, Sparkles } from "lucide-react";
import { toast } from "sonner";

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

export default function MembershipUpgradeDialog({
  open,
  onOpenChange,
  currentMembership,
  userId,
  onUpgraded,
}: Props) {
  const [upgrading, setUpgrading] = useState<string | null>(null);

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

  // For Legacy users, treat their baseline as Essential's price for upgrade pricing
  const isLegacy = currentMembership.tier_slug === "legacy";
  const essentialTier = tiers?.find((t) => t.slug === "essential");
  const baselinePrice = isLegacy && essentialTier ? essentialTier.monthly_price : currentMembership.monthly_price;

  // Calculate prorated amount for upgrade
  const getProratedAmount = (newMonthlyPrice: number) => {
    const startDate = new Date(currentMembership.started_at);
    const now = new Date();

    // Days into current billing period
    const daysSinceStart = Math.floor(
      (now.getTime() - startDate.getTime()) / 86400000
    );
    const daysInMonth = 30;
    const daysRemaining = Math.max(0, daysInMonth - (daysSinceStart % daysInMonth));
    const dailyDifference = (newMonthlyPrice - baselinePrice) / daysInMonth;
    const prorated = Math.max(0, Math.round(dailyDifference * daysRemaining * 100) / 100);

    return { prorated, daysRemaining, dailyDifference: Math.round(dailyDifference * 100) / 100 };
  };

  // Get the ongoing monthly extra cost for display
  const getMonthlyExtra = (newMonthlyPrice: number) => {
    return Math.max(0, newMonthlyPrice - baselinePrice);
  };

  const handleUpgrade = async (tierId: string, tierName: string) => {
    setUpgrading(tierId);
    try {
      // Update the membership tier in the database
      const { error } = await supabase
        .from("memberships")
        .update({ tier_id: tierId, updated_at: new Date().toISOString() })
        .eq("id", currentMembership.id);

      if (error) throw error;

      toast.success(`Upgraded to ${tierName}!`, {
        description: "Your membership has been upgraded. New benefits are active immediately.",
      });
      onOpenChange(false);
      onUpgraded();
    } catch (e) {
      console.error("Upgrade error:", e);
      toast.error("Failed to upgrade membership");
    } finally {
      setUpgrading(null);
    }
  };

  // Filter to only tiers above current
  const upgradeTiers = tiers?.filter((t) => {
    const currentTier = tiers.find((ct) => ct.id === currentMembership.tier_id);
    return currentTier ? t.sort_order > currentTier.sort_order : false;
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-lg font-heading font-light text-foreground">
            Upgrade Your Membership
          </DialogTitle>
          <DialogDescription className="text-sm font-body font-light text-muted-foreground">
            You're currently on the{" "}
            <span className="text-primary">{currentMembership.tier_name}</span>{" "}
            plan{isLegacy ? " (equivalent to Essential)" : ` at $${currentMembership.monthly_price}/mo`}. Upgrade to unlock more benefits — {isLegacy ? "you'll only pay the difference from Essential pricing" : "you'll only pay the prorated difference for this billing period"}.
          </DialogDescription>
        </DialogHeader>

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

                  {/* Prorated pricing callout */}
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
                        onClick={() => handleUpgrade(tier.id, tier.name)}
                        disabled={upgrading === tier.id}
                        className={`flex items-center gap-1.5 px-5 py-2.5 text-[10px] tracking-[0.2em] uppercase font-body font-light transition-colors ${
                          isPopular
                            ? "bg-primary text-primary-foreground hover:bg-primary/90"
                            : "border border-primary/40 text-primary hover:bg-primary/10"
                        } disabled:opacity-50`}
                      >
                        <ArrowUp size={12} />
                        {upgrading === tier.id ? "Upgrading..." : "Upgrade"}
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {(!upgradeTiers || upgradeTiers.length === 0) && (
            <p className="text-sm text-muted-foreground font-body font-light text-center py-4">
              You're already on the highest tier! 🎉
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
