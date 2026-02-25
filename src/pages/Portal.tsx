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
import PortalNews from "@/components/portal/PortalNews";
import LoyaltyRewards from "@/components/portal/LoyaltyRewards";
import SubscriptionCheckout from "@/components/SubscriptionCheckout";
import BloodworkUploader from "@/components/portal/BloodworkUploader";
import VitalityScoreBadge from "@/components/portal/VitalityScoreBadge";
import VitalityScoreDrawer from "@/components/portal/VitalityScoreDrawer";
import { LogOut, Pill, Package, Clock, BookOpen, Activity, Newspaper, Star, Check, Sparkles } from "lucide-react";
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
  pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  processing: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  shipped: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  delivered: "bg-green-500/20 text-green-400 border-green-500/30",
  cancelled: "bg-destructive/20 text-destructive border-destructive/30",
};

const Portal = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [peptides, setPeptides] = useState<PatientPeptide[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [profile, setProfile] = useState<{ first_name: string | null; last_name: string | null } | null>(null);
  const [bloodworkUploads, setBloodworkUploads] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");
  const [checkoutTier, setCheckoutTier] = useState<{
    id: string; name: string; slug: string; monthly_price: number; annual_price: number;
  } | null>(null);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [biomarkerResults, setBiomarkerResults] = useState<BiomarkerResult[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);

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
      .select("first_name, last_name")
      .eq("user_id", user.id)
      .single();
    setProfile(profileData);

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

    // Fetch biomarker results for the vitality badge
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
    if (!perDay || perDay <= 0) return "—";
    const days = Math.floor(qty / perDay);
    return days <= 0 ? "Reorder needed" : `~${days} days`;
  };

  const vitalityScore = computeVitalityScore(biomarkerResults, getAllMarkers());

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
          <div className="flex items-center gap-3">
            <PVMonogram className="w-8 h-8" />
            <span className="text-xs tracking-[0.25em] uppercase text-foreground font-body font-light hidden sm:inline">
              Patient Portal
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground font-body font-light">
              {profile?.first_name} {profile?.last_name}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => { signOut(); navigate("/auth"); }}
              className="text-muted-foreground hover:text-foreground"
            >
              <LogOut size={16} strokeWidth={1.2} />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10 space-y-8">
        {/* Welcome + Vitality Badge */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-heading font-light text-foreground">
              Welcome{profile?.first_name ? `, ${profile.first_name}` : ""}
            </h1>
            <p className="text-sm text-muted-foreground font-body font-light mt-1">
              Your peptide inventory, biomarkers, and clinical resources — all in one place.
            </p>
          </div>
          <VitalityScoreBadge score={vitalityScore} onClick={() => setDrawerOpen(true)} />
        </div>

        {/* Vitality Score Drawer */}
        <VitalityScoreDrawer
          open={drawerOpen}
          onOpenChange={setDrawerOpen}
          results={biomarkerResults}
          onViewAll={() => setActiveTab("markers")}
        />

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-card border border-border rounded-none h-auto p-0 w-full justify-start gap-0 hidden sm:flex">
            <TabsTrigger
              value="dashboard"
              className="rounded-none px-5 py-3 text-xs tracking-[0.15em] uppercase font-body font-light data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-primary"
            >
              <Pill size={14} className="mr-2" /> Dashboard
            </TabsTrigger>
            <TabsTrigger
              value="markers"
              className="rounded-none px-5 py-3 text-xs tracking-[0.15em] uppercase font-body font-light data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-primary"
            >
              <Activity size={14} className="mr-2" /> Vitality Score
            </TabsTrigger>
            <TabsTrigger
              value="news"
              className="rounded-none px-5 py-3 text-xs tracking-[0.15em] uppercase font-body font-light data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-primary"
            >
              <Newspaper size={14} className="mr-2" /> Peptide News
            </TabsTrigger>
            <TabsTrigger
              value="rewards"
              className="rounded-none px-5 py-3 text-xs tracking-[0.15em] uppercase font-body font-light data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-primary"
            >
              <Star size={14} className="mr-2" /> Rewards
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="mt-8 space-y-10">
            {/* Membership Upsell for non-subscribers */}
            {!membership && tiers && tiers.length > 0 && (
              <section className="space-y-6">
                <div>
                  <h2 className="text-xs tracking-[0.3em] uppercase text-primary font-body font-light mb-2">
                    Choose Your Plan
                  </h2>
                  <p className="text-sm text-muted-foreground font-body font-light">
                    Subscribe to unlock member pricing, lab work, and the ability to request peptides.
                  </p>
                </div>
                <div className="flex justify-start mb-2">
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
                </div>
                <div className="grid gap-6 md:grid-cols-3">
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
                        <CardHeader className="pb-3">
                          <CardTitle className="text-xs tracking-[0.3em] uppercase text-primary font-body font-light">
                            {tier.name}
                          </CardTitle>
                          <div className="flex items-baseline gap-1">
                            <span className="text-3xl font-heading font-light text-foreground">${price}</span>
                            <span className="text-muted-foreground text-xs font-body">/mo</span>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div className="flex items-start gap-2 text-xs text-muted-foreground font-body font-light">
                            <Check size={13} className="text-primary mt-0.5 shrink-0" />
                            <span>{tier.discount_pct}% peptide discount</span>
                          </div>
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
                            className={`w-full mt-4 py-2.5 text-[10px] tracking-[0.2em] uppercase font-body font-light transition-colors ${
                              isPopular
                                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                                : "border border-primary/40 text-primary hover:bg-primary/10"
                            }`}
                          >
                            Get Started
                          </button>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Active membership badge */}
            {membership && (
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="border-primary/40 text-primary text-xs tracking-wider uppercase font-body font-light px-3 py-1">
                  {(membership as any).membership_tiers?.name ?? "Active"} Member
                </Badge>
              </div>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/catalog")}
              className="text-xs tracking-wider uppercase font-body font-light rounded-none border-primary/40 text-primary hover:bg-primary/10"
            >
              <BookOpen size={14} className="mr-1.5" /> View Full Catalog & Pricing
            </Button>
            {/* Peptide Inventory */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <Pill size={16} strokeWidth={1.2} className="text-primary" />
                <h2 className="text-xs tracking-[0.2em] uppercase text-foreground font-body font-light">
                  Your Peptides
                </h2>
              </div>
              {peptides.length === 0 ? (
                <Card className="border-border bg-card">
                  <CardContent className="py-10 text-center">
                    <p className="text-sm text-muted-foreground font-body font-light">
                      No peptides assigned yet. Your provider will add them to your account.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {peptides.map((p) => (
                    <Card key={p.id} className="border-border bg-card">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg font-heading font-light text-foreground">
                          {p.peptide_name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
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
                            <Clock size={12} strokeWidth={1.2} /> Supply Duration
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
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </section>

            {/* My Requests */}
            <MyRequests requests={requests} onRefresh={fetchData} />

            {/* Orders */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <Package size={16} strokeWidth={1.2} className="text-primary" />
                <h2 className="text-xs tracking-[0.2em] uppercase text-foreground font-body font-light">
                  Orders
                </h2>
              </div>
              {orders.length === 0 ? (
                <Card className="border-border bg-card">
                  <CardContent className="py-10 text-center">
                    <p className="text-sm text-muted-foreground font-body font-light">
                      No orders yet.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                  {orders.map((o) => (
                    <Card key={o.id} className="border-border bg-card">
                      <CardContent className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className={statusColor[o.status] || ""}>
                              {o.status}
                            </Badge>
                            <span className="text-xs text-muted-foreground font-body font-light">
                              {new Date(o.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          {o.tracking_number && (
                            <p className="text-xs text-muted-foreground font-body font-light">
                              Tracking: {o.tracking_number}
                            </p>
                          )}
                        </div>
                        {o.expected_delivery && (
                          <p className="text-xs text-muted-foreground font-body font-light">
                            Expected: {new Date(o.expected_delivery).toLocaleDateString()}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </section>
          </TabsContent>

          {/* Premier Markers Tab */}
          <TabsContent value="markers" className="mt-8 space-y-10">
            <BloodworkUploader uploads={bloodworkUploads} onRefresh={fetchData} />
            <PremierMarkers />
          </TabsContent>

          {/* Peptide News Tab */}
          <TabsContent value="news" className="mt-8">
            <PortalNews />
          </TabsContent>

          {/* Rewards Tab */}
          <TabsContent value="rewards" className="mt-8">
            <LoyaltyRewards />
          </TabsContent>
        </Tabs>

        {/* Bottom spacer for mobile nav */}
        <div className="h-20 sm:hidden" />
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border sm:hidden">
        <div className="flex justify-around items-center h-16">
          {[
            { value: "dashboard", icon: Pill, label: "Dashboard" },
            { value: "markers", icon: Activity, label: "Markers" },
            { value: "news", icon: Newspaper, label: "News" },
            { value: "rewards", icon: Star, label: "Rewards" },
          ].map(({ value, icon: Icon, label }) => (
            <button
              key={value}
              onClick={() => setActiveTab(value)}
              className={`flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors font-body font-light ${
                activeTab === value
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon size={20} />
              <span className="text-[10px] tracking-[0.1em] uppercase">{label}</span>
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
    </div>
  );
};

export default Portal;
