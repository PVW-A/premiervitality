import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import MyRequests from "@/components/portal/MyRequests";
import PremierMarkers from "@/components/portal/PremierMarkers";
import LoyaltyRewards from "@/components/portal/LoyaltyRewards";
import SubscriptionCheckout from "@/components/SubscriptionCheckout";
import BloodworkUploader from "@/components/portal/BloodworkUploader";
import PeptideReminders from "@/components/portal/PeptideReminders";
import InjectionGuide from "@/components/portal/InjectionGuide";
import PeptideSubscriptions from "@/components/portal/PeptideSubscriptions";
import VitalityScoreBadge from "@/components/portal/VitalityScoreBadge";
import VitalityScoreDrawer from "@/components/portal/VitalityScoreDrawer";
import MembershipUpgradeDialog from "@/components/portal/MembershipUpgradeDialog";
import ForcePasswordChangeDialog from "@/components/portal/ForcePasswordChangeDialog";
import UserSettingsMenu from "@/components/portal/UserSettingsMenu";
import NotificationCenter from "@/components/portal/NotificationCenter";
import LinkedAccounts from "@/components/portal/LinkedAccounts";
import { Pill, Package, Clock, Activity, Star, Check, Sparkles, ArrowUp, ShoppingBag } from "lucide-react";
import { type BiomarkerResult, getAllMarkers, computeVitalityScore } from "@/lib/vitality";

interface PatientPeptide {
  id: string;
  dosage: string | null;
  quantity_remaining: number;
  usage_per_day: number;
  started_at: string | null;
  notes: string | null;
  peptide_id: string;
  peptide_name?: string;
}

interface Order {
  id: string;
  status: string;
  tracking_number: string | null;
  expected_delivery: string | null;
  notes: string | null;
  created_at: string;
}

const statusColor: Record<string, string> = {
  pending: "bg-yellow-600/15 text-yellow-700 dark:text-yellow-400 border-yellow-600/30",
  processing: "bg-blue-600/15 text-blue-700 dark:text-blue-400 border-blue-600/30",
  shipped: "bg-purple-600/15 text-purple-700 dark:text-purple-400 border-purple-600/30",
  delivered: "bg-emerald-700/15 text-emerald-700 dark:text-emerald-400 border-emerald-700/30",
  cancelled: "bg-destructive/20 text-destructive border-destructive/30",
};

const Portal = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [peptides, setPeptides] = useState<PatientPeptide[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [profile, setProfile] = useState<{ first_name: string | null; last_name: string | null; force_password_change?: boolean } | null>(null);
  const [forcePasswordChange, setForcePasswordChange] = useState(false);
  const [bloodworkUploads, setBloodworkUploads] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");
  const [checkoutTier, setCheckoutTier] = useState<{
    id: string; name: string; slug: string; monthly_price: number; annual_price: number;
  } | null>(null);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [biomarkerResults, setBiomarkerResults] = useState<BiomarkerResult[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [upgradeOpen, setUpgradeOpen] = useState(false);

  const { data: membership } = useQuery({
    queryKey: ["my-membership", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("memberships")
        .select("*, membership_tiers(*)")
        .eq("user_id", user!.id)
        .eq("status", "active")
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const { data: tiers } = useQuery({
    queryKey: ["membership-tiers"],
    enabled: !!user && !membership,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("membership_tiers")
        .select("*")
        .order("sort_order");
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (!loading && !user) navigate("/auth");
  }, [user, loading, navigate]);

  const fetchData = useCallback(async () => {
    if (!user) return;

    const { data: profileData } = await supabase
      .from("profiles")
      .select("first_name, last_name, force_password_change")
      .eq("user_id", user.id)
      .single();
    setProfile(profileData as any);
    if (profileData?.force_password_change) {
      setForcePasswordChange(true);
    }

    const { data: ppData } = await supabase
      .from("patient_peptides")
      .select("*, peptides(name)")
      .eq("user_id", user.id);

    if (ppData) {
      setPeptides(
        ppData.map((pp: any) => ({
          ...pp,
          peptide_name: pp.peptides?.name ?? "Unknown",
        }))
      );
    }

    const { data: orderData } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    if (orderData) setOrders(orderData);

    const { data: reqData } = await supabase
      .from("peptide_requests")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    if (reqData) setRequests(reqData);

    const { data: bwData } = await supabase
      .from("bloodwork_uploads")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    if (bwData) setBloodworkUploads(bwData);

    const { data: bioData } = await supabase
      .from("biomarker_results")
      .select("*")
      .eq("user_id", user.id)
      .order("lab_date", { ascending: false });
    if (bioData) setBiomarkerResults(bioData as BiomarkerResult[]);
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const getDaysRemaining = (qty: number, perDay: number) => {
    if (!perDay || perDay <= 0) return "-";
    const days = Math.floor(qty / perDay);
    return days <= 0 ? "Reorder needed" : `~${days} days`;
  };

  const vitalityScore = computeVitalityScore(biomarkerResults, getAllMarkers());

  // Determine if the dashboard has any actual data to show beyond membership
  const hasActivity = peptides.length > 0 || orders.length > 0 || requests.length > 0;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground text-sm font-body font-light tracking-wider uppercase animate-pulse">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-border sticky top-0 z-50" style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}>
        <div className="max-w-5xl mx-auto px-4 md:px-6 flex items-center justify-between h-16">
          <a href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <img src="/logo-emblem.svg" alt="Premier Vitality & Wellness" className="h-8 w-auto" style={{ filter: "brightness(0) saturate(100%) invert(72%) sepia(28%) saturate(600%) hue-rotate(5deg)" }} />
            <span className="text-xs tracking-[0.25em] uppercase text-foreground hidden sm:inline">
              Premier Vitality & Wellness
            </span>
          </a>
          <div className="flex items-center gap-4">
            <NotificationCenter onNavigate={(tab) => setActiveTab(tab)} />
            <UserSettingsMenu
              firstName={profile?.first_name ?? null}
              lastName={profile?.last_name ?? null}
              userId={user?.id ?? ""}
              onSignOut={signOut}
              onProfileUpdated={fetchData}
            />
          </div>
        </div>
      </header>

      {user && forcePasswordChange && (
        <ForcePasswordChangeDialog
          open={forcePasswordChange}
          userId={user.id}
          onComplete={() => setForcePasswordChange(false)}
        />
      )}

      <main className="max-w-5xl mx-auto px-4 md:px-6 py-10 md:py-14 space-y-10">
        {/* Welcome + Vitality Badge */}
        <div className="flex items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-[10px] tracking-[0.35em] uppercase text-primary mb-2">Patient Portal</p>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-light tracking-tight text-foreground">
              Welcome{profile?.first_name ? `, ${profile.first_name}` : ""}
            </h1>
            {membership && (
              <button
                onClick={() => setUpgradeOpen(true)}
                className="group inline-flex items-center gap-2 mt-3"
              >
                <Badge variant="outline" className="border-primary/40 text-primary text-[10px] tracking-[0.2em] uppercase px-2.5 py-0.5 group-hover:bg-primary/10 transition-colors cursor-pointer">
                  {(membership as any).membership_tiers?.name ?? "Active"} Member
                </Badge>
                <span className="text-[10px] text-muted-foreground group-hover:text-primary transition-colors flex items-center gap-0.5">
                  <ArrowUp size={9} /> Upgrade
                </span>
              </button>
            )}
          </div>
          <VitalityScoreBadge score={vitalityScore} onClick={() => setDrawerOpen(true)} />
        </div>

        <VitalityScoreDrawer
          open={drawerOpen}
          onOpenChange={setDrawerOpen}
          results={biomarkerResults}
          onViewAll={() => setActiveTab("markers")}
        />

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(v) => {
          setActiveTab(v);
        }} className="w-full">
          <TabsList className="border border-border/30 rounded-none h-auto p-0 w-full justify-start gap-0 hidden sm:flex" style={{ background: "rgba(255,255,255,0.02)", backdropFilter: "blur(12px)" }}>
            {[
              { value: "dashboard", icon: Pill, label: "Dashboard" },
              { value: "markers", icon: Activity, label: "Vitality Score" },
              { value: "rewards", icon: Star, label: "Rewards" },
            ].map(({ value, icon: Icon, label }) => (
              <TabsTrigger
                key={value}
                value={value}
                className="rounded-none px-6 py-3.5 text-[10px] tracking-[0.2em] uppercase data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-primary text-muted-foreground"
              >
                <Icon size={13} className="mr-2" strokeWidth={1.5} /> {label}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="mt-8 space-y-10">
            {/* Membership Upsell for non-subscribers */}
            {!membership && tiers && tiers.length > 0 && (
              <section className="space-y-8">
                <div className="text-center">
                  <p className="text-[10px] tracking-[0.35em] uppercase text-primary mb-3">Membership Plans</p>
                  <h2 className="text-2xl md:text-3xl font-light tracking-tight text-foreground mb-3">
                    Choose Your Plan
                  </h2>
                  <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
                    Subscribe to unlock physician-directed protocols, member pricing, and comprehensive lab work.
                  </p>
                </div>
                <div className="flex justify-center items-center gap-3">
                  <div className="inline-flex items-center rounded-full p-1 gap-1" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                    <button
                      onClick={() => setBillingCycle("monthly")}
                      className={`px-5 py-2 text-[10px] tracking-[0.15em] uppercase rounded-full transition-colors ${
                        billingCycle === "monthly" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                      }`}
                    >Monthly</button>
                    <button
                      onClick={() => setBillingCycle("annual")}
                      className={`px-5 py-2 text-[10px] tracking-[0.15em] uppercase rounded-full transition-colors ${
                        billingCycle === "annual" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                      }`}
                    >Annual</button>
                  </div>
                  {billingCycle === "monthly" && (
                    <p className="text-[10px] text-primary">
                      Save up to 17% with annual
                    </p>
                  )}
                </div>
                <div className="grid gap-6 md:grid-cols-3">
                  {tiers.map((tier) => {
                    const price = billingCycle === "monthly" ? tier.monthly_price : tier.annual_price;
                    const isPopular = tier.slug === "premium";
                    const features = (tier.features as string[]) || [];
                    return (
                      <div
                        key={tier.id}
                        className={`relative flex flex-col p-6 md:p-8 ${isPopular ? "md:-mt-3 md:pb-10" : ""}`}
                        style={{
                          background: "rgba(255,255,255,0.03)",
                          backdropFilter: "blur(12px)",
                          WebkitBackdropFilter: "blur(12px)",
                          border: `1px solid ${isPopular ? "rgba(171,143,95,0.4)" : "rgba(255,255,255,0.08)"}`,
                          boxShadow: isPopular
                            ? "0 12px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)"
                            : "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)",
                        }}
                      >
                        {isPopular && (
                          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                            <span className="inline-flex items-center gap-1.5 bg-primary text-primary-foreground text-[9px] tracking-[0.2em] uppercase px-4 py-1.5">
                              <Sparkles size={10} /> Most Popular
                            </span>
                          </div>
                        )}
                        <p className="text-[10px] tracking-[0.3em] uppercase text-primary mb-3">
                          {tier.name}
                        </p>
                        <div className="flex items-baseline gap-1 mb-1">
                          <span className="text-3xl font-light text-foreground">${price}</span>
                          <span className="text-muted-foreground text-xs">/mo</span>
                          {billingCycle === "annual" && tier.monthly_price > price && (
                            <span className="ml-2 text-[10px] text-primary bg-primary/10 border border-primary/20 px-1.5 py-0.5 rounded-full">
                              Save ${tier.monthly_price - price}/mo
                            </span>
                          )}
                        </div>
                        <div className="mb-6" />
                        <div className="flex-1 flex flex-col gap-2.5 mb-6">
                          {tier.discount_pct > 0 && (
                            <div className="flex items-start gap-2.5 text-sm text-muted-foreground">
                              <Check size={14} className="text-primary mt-0.5 shrink-0" />
                              <span>{tier.discount_pct}% peptide discount</span>
                            </div>
                          )}
                          <div className="flex items-start gap-2.5 text-sm text-muted-foreground">
                            <Check size={14} className="text-primary mt-0.5 shrink-0" />
                            <span>{tier.blood_work_frequency} blood work</span>
                          </div>
                          <div className="flex items-start gap-2.5 text-sm text-muted-foreground">
                            <Check size={14} className="text-primary mt-0.5 shrink-0" />
                            <span>{tier.consultation_frequency}</span>
                          </div>
                          {features.slice(0, 3).map((f, fi) => (
                            <div key={fi} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                              <Check size={14} className="text-primary mt-0.5 shrink-0" />
                              <span>{f}</span>
                            </div>
                          ))}
                        </div>
                        <button
                          onClick={() => {
                            setCheckoutTier({ id: tier.id, name: tier.name, slug: tier.slug, monthly_price: tier.monthly_price, annual_price: tier.annual_price });
                            setCheckoutOpen(true);
                          }}
                          className={`w-full py-3 text-[10px] tracking-[0.2em] uppercase transition-all duration-200 ${
                            isPopular
                              ? "bg-primary text-primary-foreground hover:bg-primary/90"
                              : "text-primary hover:bg-primary/10"
                          }`}
                          style={isPopular ? undefined : { border: "1px solid rgba(171,143,95,0.4)" }}
                        >
                          Begin Your Protocol
                        </button>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Member-only sections */}
            {membership ? (
              <>
                {/* Quick action */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => navigate("/catalog")}
                    className="text-[10px] tracking-[0.2em] uppercase text-primary hover:bg-primary/10 transition-colors px-5 py-2.5 flex items-center gap-2"
                    style={{ border: "1px solid rgba(171,143,95,0.4)" }}
                  >
                    <ShoppingBag size={13} strokeWidth={1.5} /> Browse Catalog
                  </button>
                </div>

                {/* Linked Accounts */}
                <LinkedAccounts />

                {/* Peptide Inventory */}
                {peptides.length > 0 && (
                  <section>
                    <div className="flex items-center gap-2 mb-5">
                      <Pill size={14} strokeWidth={1.5} className="text-primary" />
                      <h2 className="text-[10px] tracking-[0.3em] uppercase text-primary">
                        Your Peptides
                      </h2>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      {peptides.map((p) => (
                        <div
                          key={p.id}
                          style={{
                            background: "rgba(255,255,255,0.03)",
                            backdropFilter: "blur(12px)",
                            border: "1px solid rgba(255,255,255,0.08)",
                            boxShadow: "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)",
                          }}
                          className="p-5"
                        >
                          <p className="text-base font-light text-foreground mb-3">
                            {p.peptide_name}
                          </p>
                          <div className="space-y-2">
                            {p.dosage && (
                              <div className="flex justify-between text-sm font-body font-light">
                                <span className="text-muted-foreground">Dosage</span>
                                <span className="text-foreground">{p.dosage}</span>
                              </div>
                            )}
                            <div className="flex justify-between text-sm font-body font-light">
                              <span className="text-muted-foreground">Remaining</span>
                              <span className="text-foreground">{p.quantity_remaining} units</span>
                            </div>
                            <div className="flex justify-between text-sm font-body font-light items-center">
                              <span className="text-muted-foreground flex items-center gap-1">
                                <Clock size={12} strokeWidth={1.2} /> Supply
                              </span>
                              <span className={`text-foreground ${p.quantity_remaining / p.usage_per_day <= 7 ? "text-destructive" : ""}`}>
                                {getDaysRemaining(p.quantity_remaining, p.usage_per_day)}
                              </span>
                            </div>
                            {p.notes && (
                              <p className="text-xs text-muted-foreground font-body font-light pt-2 border-t border-border">
                                {p.notes}
                              </p>
                            )}
                            {user && <PeptideReminders peptide={p} userId={user.id} />}
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Monthly Auto-Orders */}
                {user && <PeptideSubscriptions userId={user.id} />}

                {/* My Requests */}
                {requests.length > 0 && (
                  <MyRequests requests={requests} onRefresh={fetchData} membership={membership} />
                )}
                {/* Injection Guide */}
                <InjectionGuide />

                {/* Orders */}
                {orders.length > 0 && (
                  <section>
                    <div className="flex items-center gap-2 mb-5">
                      <Package size={14} strokeWidth={1.5} className="text-primary" />
                      <h2 className="text-[10px] tracking-[0.3em] uppercase text-primary">
                        Orders
                      </h2>
                    </div>
                    <div className="space-y-3">
                      {orders.map((o) => (
                        <div key={o.id} className="py-3 px-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className={statusColor[o.status] || ""}>
                                {o.status}
                              </Badge>
                              <span className="text-xs text-muted-foreground font-body font-light">
                                {new Date(o.created_at).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="flex items-center gap-3">
                              {o.tracking_number && (
                                <span className="text-xs text-muted-foreground font-body font-light">
                                  Tracking: {o.tracking_number}
                                </span>
                              )}
                              {o.expected_delivery && (
                                <span className="text-xs text-muted-foreground font-body font-light">
                                  ETA: {new Date(o.expected_delivery).toLocaleDateString()}
                                </span>
                              )}
                            </div>
                          </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Empty state for members with no activity */}
                {!hasActivity && (
                  <div className="py-12 text-center space-y-3" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
                      <Pill size={28} strokeWidth={1} className="text-primary/40 mx-auto" />
                      <p className="text-sm text-muted-foreground font-body font-light">
                        You're all set! Browse the catalog to request your first peptide.
                      </p>
                      <button
                        onClick={() => navigate("/catalog")}
                        className="text-[10px] tracking-[0.2em] uppercase text-primary hover:bg-primary/10 transition-colors px-5 py-2.5"
                        style={{ border: "1px solid rgba(171,143,95,0.4)" }}
                      >
                        Browse Catalog
                      </button>
                  </div>
                )}
              </>
            ) : (
              /* Non-member - just show a prompt to subscribe */
              !tiers && (
                <div className="py-12 text-center space-y-3" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
                    <Sparkles size={28} strokeWidth={1} className="text-primary/40 mx-auto" />
                    <p className="text-sm text-muted-foreground">
                      Choose a membership plan above to unlock your dashboard.
                    </p>
                </div>
              )
            )}
          </TabsContent>

          {/* Premier Markers Tab */}
          <TabsContent value="markers" className="mt-6 space-y-8">
            <BloodworkUploader uploads={bloodworkUploads} onRefresh={fetchData} />
            <PremierMarkers />
          </TabsContent>




          {/* Rewards Tab */}
          <TabsContent value="rewards" className="mt-6">
            <LoyaltyRewards />
          </TabsContent>
        </Tabs>

        {/* Bottom spacer for mobile nav */}
        <div className="h-20 sm:hidden" />
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border sm:hidden">
        <div className="flex justify-around items-center h-14">
          {[
            { value: "dashboard", icon: Pill, label: "Dashboard" },
            { value: "markers", icon: Activity, label: "Markers" },
            { value: "rewards", icon: Star, label: "Rewards" },
          ].map(({ value, icon: Icon, label }) => (
            <button
              key={value}
              onClick={() => setActiveTab(value)}
              className={`flex flex-col items-center justify-center gap-0.5 flex-1 h-full transition-colors font-body font-light ${
                activeTab === value
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon size={18} />
              <span className="text-[9px] tracking-[0.1em] uppercase">{label}</span>
            </button>
          ))}
        </div>
      </nav>

      <SubscriptionCheckout
        open={checkoutOpen}
        onOpenChange={setCheckoutOpen}
        tier={checkoutTier}
        billingCycle={billingCycle}
        onSuccess={() => { setCheckoutOpen(false); fetchData(); }}
      />
      {membership && user && (
        <MembershipUpgradeDialog
          open={upgradeOpen}
          onOpenChange={setUpgradeOpen}
          currentMembership={{
            id: membership.id,
            tier_id: membership.tier_id,
            billing_cycle: membership.billing_cycle,
            started_at: membership.started_at,
            tier_name: (membership as any).membership_tiers?.name ?? "Active",
            tier_slug: (membership as any).membership_tiers?.slug ?? "",
            monthly_price: (membership as any).membership_tiers?.monthly_price ?? 0,
          }}
          userId={user.id}
          onUpgraded={fetchData}
        />
      )}
    </div>
  );
};

export default Portal;
