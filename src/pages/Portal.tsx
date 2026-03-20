import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import PVMonogram from "@/components/PVMonogram";
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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground text-sm font-body font-light tracking-wider uppercase animate-pulse">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 flex items-center justify-between h-16">
          <a href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <PVMonogram className="w-8 h-8" />
            <span className="text-xs tracking-[0.25em] uppercase text-foreground font-body font-light hidden sm:inline">
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

      <main className="max-w-5xl mx-auto px-6 py-8 space-y-6">
        {/* Welcome + Vitality Badge */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-heading font-light text-foreground">
              Welcome{profile?.first_name ? `, ${profile.first_name}` : ""}
            </h1>
            {membership && (
              <button
                onClick={() => setUpgradeOpen(true)}
                className="group inline-flex items-center gap-2 mt-1.5"
              >
                <Badge variant="outline" className="border-primary/40 text-primary text-[10px] tracking-wider uppercase font-body font-light px-2.5 py-0.5 group-hover:bg-primary/10 transition-colors cursor-pointer">
                  {(membership as any).membership_tiers?.name ?? "Active"} Member
                </Badge>
                <span className="text-[10px] text-muted-foreground font-body font-light group-hover:text-primary transition-colors flex items-center gap-0.5">
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
          <TabsList className="bg-card border border-border rounded-none h-auto p-0 w-full justify-start gap-0 hidden sm:flex">
            {[
              { value: "dashboard", icon: Pill, label: "Dashboard" },
              { value: "markers", icon: Activity, label: "Vitality Score" },
              { value: "rewards", icon: Star, label: "Rewards" },
            ].map(({ value, icon: Icon, label }) => (
              <TabsTrigger
                key={value}
                value={value}
                className="rounded-none px-5 py-3 text-xs tracking-[0.15em] uppercase font-body font-light data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-primary"
              >
                <Icon size={14} className="mr-2" /> {label}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="mt-6 space-y-8">
            {/* Membership Upsell for non-subscribers */}
            {!membership && tiers && tiers.length > 0 && (
              <section className="space-y-5">
                <div>
                  <h2 className="text-xs tracking-[0.3em] uppercase text-primary font-body font-light mb-1">
                    Choose Your Plan
                  </h2>
                  <p className="text-sm text-muted-foreground font-body font-light">
                    Subscribe to unlock member pricing, lab work, and the ability to request peptides.
                  </p>
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="inline-flex items-center bg-secondary rounded-full p-1 gap-1">
                    <button
                      onClick={() => setBillingCycle("monthly")}
                      className={`px-4 py-1.5 text-[10px] tracking-[0.15em] uppercase font-body font-light rounded-full transition-colors ${
                        billingCycle === "monthly" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                      }`}
                    >Monthly</button>
                    <button
                      onClick={() => setBillingCycle("annual")}
                      className={`px-4 py-1.5 text-[10px] tracking-[0.15em] uppercase font-body font-light rounded-full transition-colors ${
                        billingCycle === "annual" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                      }`}
                    >Annual</button>
                  </div>
                  {billingCycle === "monthly" && (
                    <p className="text-[10px] text-primary font-body font-light animate-pulse">
                      💰 Save up to 17% with annual
                    </p>
                  )}
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  {tiers.map((tier) => {
                    const price = billingCycle === "monthly" ? tier.monthly_price : tier.annual_price;
                    const isPopular = tier.slug === "premium";
                    const features = (tier.features as string[]) || [];
                    return (
                      <Card key={tier.id} className={`relative border ${isPopular ? "border-primary/60" : "border-border"} bg-card`}>
                        {isPopular && (
                          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                            <span className="inline-flex items-center gap-1 bg-primary text-primary-foreground text-[9px] tracking-[0.2em] uppercase font-body px-3 py-1">
                              <Sparkles size={10} /> Most Popular
                            </span>
                          </div>
                        )}
                        <CardHeader className="pb-2">
                          <CardTitle className="text-xs tracking-[0.3em] uppercase text-primary font-body font-light">
                            {tier.name}
                          </CardTitle>
                          <div className="flex items-baseline gap-1">
                            <span className="text-3xl font-heading font-light text-foreground">${price}</span>
                            <span className="text-muted-foreground text-xs font-body">/mo</span>
                            {billingCycle === "annual" && tier.monthly_price > price && (
                              <span className="ml-1.5 text-[10px] font-body font-light text-primary bg-primary/10 border border-primary/20 px-1.5 py-0.5 rounded-full">
                                Save ${tier.monthly_price - price}/mo
                              </span>
                            )}
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-1.5 pt-0">
                          {tier.discount_pct > 0 && (
                            <div className="flex items-start gap-2 text-xs text-muted-foreground font-body font-light">
                              <Check size={13} className="text-primary mt-0.5 shrink-0" />
                              <span>{tier.discount_pct}% peptide discount</span>
                            </div>
                          )}
                          <div className="flex items-start gap-2 text-xs text-muted-foreground font-body font-light">
                            <Check size={13} className="text-primary mt-0.5 shrink-0" />
                            <span>{tier.blood_work_frequency} blood work</span>
                          </div>
                          <div className="flex items-start gap-2 text-xs text-muted-foreground font-body font-light">
                            <Check size={13} className="text-primary mt-0.5 shrink-0" />
                            <span>{tier.consultation_frequency}</span>
                          </div>
                          {features.slice(0, 2).map((f, fi) => (
                            <div key={fi} className="flex items-start gap-2 text-xs text-muted-foreground font-body font-light">
                              <Check size={13} className="text-primary mt-0.5 shrink-0" />
                              <span>{f}</span>
                            </div>
                          ))}
                          <button
                            onClick={() => {
                              setCheckoutTier({ id: tier.id, name: tier.name, slug: tier.slug, monthly_price: tier.monthly_price, annual_price: tier.annual_price });
                              setCheckoutOpen(true);
                            }}
                            className={`w-full mt-3 py-2.5 text-[10px] tracking-[0.2em] uppercase font-body font-light transition-colors ${
                              isPopular
                                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                                : "border border-primary/40 text-primary hover:bg-primary/10"
                            }`}
                          >
                            Begin Your Protocol
                          </button>
                        </CardContent>
                      </Card>
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
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate("/catalog")}
                    className="text-xs tracking-wider uppercase font-body font-light rounded-none border-primary/40 text-primary hover:bg-primary/10"
                  >
                    <ShoppingBag size={14} className="mr-1.5" /> Browse Catalog
                  </Button>
                </div>

                {/* Linked Accounts */}
                <LinkedAccounts />

                {/* Peptide Inventory */}
                {peptides.length > 0 && (
                  <section>
                    <div className="flex items-center gap-2 mb-3">
                      <Pill size={16} strokeWidth={1.2} className="text-primary" />
                      <h2 className="text-xs tracking-[0.2em] uppercase text-foreground font-body font-light">
                        Your Peptides
                      </h2>
                    </div>
                    <div className="grid gap-3 md:grid-cols-2">
                      {peptides.map((p) => (
                        <Card key={p.id} className="border-border bg-card">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base font-heading font-light text-foreground">
                              {p.peptide_name}
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-2">
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
                          </CardContent>
                        </Card>
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
                    <div className="flex items-center gap-2 mb-3">
                      <Package size={16} strokeWidth={1.2} className="text-primary" />
                      <h2 className="text-xs tracking-[0.2em] uppercase text-foreground font-body font-light">
                        Orders
                      </h2>
                    </div>
                    <div className="space-y-2">
                      {orders.map((o) => (
                        <Card key={o.id} className="border-border bg-card">
                          <CardContent className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
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
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </section>
                )}

                {/* Empty state for members with no activity */}
                {!hasActivity && (
                  <Card className="border-border bg-card/50">
                    <CardContent className="py-12 text-center space-y-3">
                      <Pill size={28} strokeWidth={1} className="text-primary/40 mx-auto" />
                      <p className="text-sm text-muted-foreground font-body font-light">
                        You're all set! Browse the catalog to request your first peptide.
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate("/catalog")}
                        className="text-xs tracking-wider uppercase font-body font-light rounded-none border-primary/40 text-primary hover:bg-primary/10"
                      >
                        Browse Catalog
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </>
            ) : (
              /* Non-member - just show a prompt to subscribe */
              !tiers && (
                <Card className="border-border bg-card/50">
                  <CardContent className="py-12 text-center space-y-3">
                    <Sparkles size={28} strokeWidth={1} className="text-primary/40 mx-auto" />
                    <p className="text-sm text-muted-foreground font-body font-light">
                      Choose a membership plan above to unlock your dashboard.
                    </p>
                  </CardContent>
                </Card>
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
