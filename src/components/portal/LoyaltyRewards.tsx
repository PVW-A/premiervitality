import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, TrendingUp, Gift, ArrowUp, ArrowDown, Minus } from "lucide-react";

interface RewardTier {
  id: string;
  name: string;
  points: number;
  discount: string;
}

interface LoyaltyEvent {
  id: string;
  type: string;
  created_at: string;
  points: number;
  source: string;
}

interface LoyaltyAccount {
  id: string;
  balance: number;
  lifetime_points: number;
  enrolled_at: string;
}

interface LoyaltyData {
  account?: LoyaltyAccount;
  program?: { reward_tiers: RewardTier[] };
  events?: LoyaltyEvent[];
  error?: string;
  message?: string;
}

const EVENT_LABELS: Record<string, string> = {
  ACCUMULATE_POINTS: "Points Earned",
  ADJUST_POINTS: "Points Adjusted",
  REDEEM_REWARD: "Reward Redeemed",
  EXPIRE_POINTS: "Points Expired",
  CREATE_REWARD: "Reward Created",
  DELETE_REWARD: "Reward Removed",
  OTHER: "Other",
};

const LoyaltyRewards = () => {
  const [data, setData] = useState<LoyaltyData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLoyalty = async () => {
      try {
        const { data: fnData, error } = await supabase.functions.invoke("square-loyalty");
        if (error) throw error;
        setData(fnData);
      } catch (e) {
        console.error("Loyalty fetch error:", e);
        setData({ error: "fetch_error", message: "Unable to load rewards data." });
      } finally {
        setLoading(false);
      }
    };
    fetchLoyalty();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <p className="text-sm text-muted-foreground font-body font-light tracking-wider uppercase animate-pulse">
          Loading rewards...
        </p>
      </div>
    );
  }

  if (!data || data.error === "fetch_error") {
    return (
      <Card className="border-border bg-card">
        <CardContent className="py-10 text-center">
          <p className="text-sm text-muted-foreground font-body font-light">
            {data?.message || "Unable to load rewards data. Please try again later."}
          </p>
        </CardContent>
      </Card>
    );
  }

  const tiers = data.program?.reward_tiers || [];
  const account = data.account;
  const events = data.events || [];

  // Find current and next tier
  const currentTier = account
    ? [...tiers].reverse().find((t) => account.balance >= t.points)
    : null;
  const nextTier = account
    ? tiers.find((t) => t.points > (account?.balance || 0))
    : tiers[0];

  const progressToNext = account && nextTier
    ? Math.min(100, Math.round((account.balance / nextTier.points) * 100))
    : account && !nextTier
      ? 100
      : 0;

  return (
    <div className="space-y-8">
      {/* Points Balance */}
      {account ? (
        <div className="grid gap-4 sm:grid-cols-3">
          <Card className="border-border bg-card sm:col-span-2">
            <CardHeader className="pb-3">
              <CardTitle className="text-xs tracking-[0.2em] uppercase font-body font-light text-muted-foreground flex items-center gap-2">
                <Star size={14} className="text-primary" /> Your Points
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-baseline gap-3">
                <span className="text-5xl font-heading font-light text-primary">
                  {account.balance.toLocaleString()}
                </span>
                <span className="text-sm text-muted-foreground font-body font-light">points available</span>
              </div>
              {nextTier && (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-body font-light text-muted-foreground">
                    <span>{nextTier.points - account.balance} pts to {nextTier.name}</span>
                    <span>{progressToNext}%</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-500"
                      style={{ width: `${progressToNext}%` }}
                    />
                  </div>
                </div>
              )}
              {currentTier && (
                <Badge
                  variant="outline"
                  className="border-primary/30 text-primary text-xs font-body font-light"
                >
                  Current: {currentTier.name} - {currentTier.discount} off
                </Badge>
              )}
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-xs tracking-[0.2em] uppercase font-body font-light text-muted-foreground flex items-center gap-2">
                <TrendingUp size={14} className="text-primary" /> Lifetime
              </CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-3xl font-heading font-light text-foreground">
                {account.lifetime_points.toLocaleString()}
              </span>
              <p className="text-xs text-muted-foreground font-body font-light mt-1">
                total points earned
              </p>
              <p className="text-xs text-muted-foreground font-body font-light mt-3">
                Member since {new Date(account.enrolled_at).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
              </p>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card className="border-border bg-card">
          <CardContent className="py-10 text-center space-y-2">
            <Star size={24} className="text-primary mx-auto" />
            <p className="text-sm text-foreground font-body font-light">
              {data.message || "Your loyalty account will appear here after your first qualifying purchase."}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Reward Tiers */}
      {tiers.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Gift size={16} strokeWidth={1.2} className="text-primary" />
            <h2 className="text-xs tracking-[0.2em] uppercase text-foreground font-body font-light">
              Reward Tiers
            </h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {tiers.map((tier) => {
              const isActive = currentTier?.id === tier.id;
              const isReached = account ? account.balance >= tier.points : false;
              return (
                <Card
                  key={tier.id}
                  className={`border-border bg-card transition-colors ${isActive ? "border-primary/50 bg-primary/5" : ""}`}
                >
                  <CardContent className="py-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-heading font-light text-foreground">
                        {tier.name}
                      </span>
                      {isActive && (
                        <Badge variant="outline" className="border-primary/30 text-primary text-[10px]">
                          Current
                        </Badge>
                      )}
                      {!isActive && isReached && (
                        <Badge variant="outline" className="border-green-500/30 text-green-400 text-[10px]">
                          Unlocked
                        </Badge>
                      )}
                    </div>
                    <div className="flex justify-between text-xs font-body font-light">
                      <span className="text-muted-foreground">{tier.points.toLocaleString()} points</span>
                      <span className="text-primary font-medium">{tier.discount} off</span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>
      )}

      {/* Points History */}
      {events.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={16} strokeWidth={1.2} className="text-primary" />
            <h2 className="text-xs tracking-[0.2em] uppercase text-foreground font-body font-light">
              Points History
            </h2>
          </div>
          <Card className="border-border bg-card">
            <CardContent className="py-0 divide-y divide-border">
              {events.map((event) => {
                const isPositive = ["ACCUMULATE_POINTS", "ADJUST_POINTS"].includes(event.type) && event.points > 0;
                const isNegative = ["REDEEM_REWARD", "EXPIRE_POINTS", "DELETE_REWARD"].includes(event.type) || event.points < 0;

                return (
                  <div key={event.id} className="flex items-center justify-between py-3.5">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center ${
                          isPositive
                            ? "bg-green-500/10 text-green-400"
                            : isNegative
                              ? "bg-red-500/10 text-red-400"
                              : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {isPositive ? (
                          <ArrowUp size={14} />
                        ) : isNegative ? (
                          <ArrowDown size={14} />
                        ) : (
                          <Minus size={14} />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-body font-light text-foreground">
                          {EVENT_LABELS[event.type] || event.type}
                        </p>
                        <p className="text-[11px] text-muted-foreground font-body font-light">
                          {new Date(event.created_at).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`text-sm font-body font-medium ${
                        isPositive ? "text-green-400" : isNegative ? "text-red-400" : "text-muted-foreground"
                      }`}
                    >
                      {isPositive ? "+" : isNegative ? "−" : ""}
                      {Math.abs(event.points).toLocaleString()}
                    </span>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </section>
      )}
    </div>
  );
};

export default LoyaltyRewards;
