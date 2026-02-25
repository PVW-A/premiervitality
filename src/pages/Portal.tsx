import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import PVMonogram from "@/components/PVMonogram";
import MyRequests from "@/components/portal/MyRequests";
import PremierMarkers from "@/components/portal/PremierMarkers";
import PortalNews from "@/components/portal/PortalNews";
import LoyaltyRewards from "@/components/portal/LoyaltyRewards";
import { LogOut, Pill, Package, Clock, BookOpen, Activity, Newspaper, Star } from "lucide-react";

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
  const [activeTab, setActiveTab] = useState("dashboard");

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
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const getDaysRemaining = (qty: number, perDay: number) => {
    if (!perDay || perDay <= 0) return "—";
    const days = Math.floor(qty / perDay);
    return days <= 0 ? "Reorder needed" : `~${days} days`;
  };

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
        {/* Welcome */}
        <div>
          <h1 className="text-3xl font-heading font-light text-foreground">
            Welcome{profile?.first_name ? `, ${profile.first_name}` : ""}
          </h1>
          <p className="text-sm text-muted-foreground font-body font-light mt-1">
            Your peptide inventory, biomarkers, and clinical resources — all in one place.
          </p>
        </div>

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
              <Activity size={14} className="mr-2" /> Premier Markers
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
          <TabsContent value="markers" className="mt-8">
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
    </div>
  );
};

export default Portal;
