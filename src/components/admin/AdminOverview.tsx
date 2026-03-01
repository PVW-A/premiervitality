import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, Users, Package, TrendingUp, AlertTriangle, UserPlus, ClipboardList, Shield, CalendarIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format, formatDistanceToNow, startOfDay, subDays, startOfYear, isWithinInterval, endOfDay } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

interface Patient {
  user_id: string;
  first_name: string | null;
  last_name: string | null;
}

interface Order {
  id: string;
  user_id: string;
  status: string;
  total_amount: number;
  created_at: string;
  expected_delivery: string | null;
  patient_name?: string;
}

interface PatientPeptide {
  id: string;
  user_id: string;
  peptide_name?: string;
  patient_name?: string;
  quantity_remaining: number | null;
  usage_per_day: number | null;
  dosage: string | null;
}

interface Peptide {
  id: string;
  name: string;
  price: number | null;
  cost: number | null;
}

interface PeptideRequestItem {
  id: string;
  peptide_id: string;
  peptide_name: string;
  price: number | null;
  status: string;
  include_injection_kit: boolean;
  delivery_method: string | null;
  created_at: string;
  patient_name?: string;
}

interface ActivityItem {
  type: string;
  label: string;
  detail: string;
  resource?: string;
  status?: string;
  timestamp: string;
}

interface Props {
  patients: Patient[];
  orders: Order[];
  patientPeptides: PatientPeptide[];
  peptides: Peptide[];
  recentActivity: ActivityItem[];
  peptideRequests: PeptideRequestItem[];
}

const KIT_PRICE = 30;
const KIT_COST = 12;
const SHIPPING_PRICE = 35;
const SHIPPING_COST = 35;
const COURIER_PRICE = 50;
const COURIER_COST = 35;

type PresetKey = "today" | "7d" | "30d" | "90d" | "ytd" | "all";

const PRESETS: { key: PresetKey; label: string }[] = [
  { key: "today", label: "Today" },
  { key: "7d", label: "7D" },
  { key: "30d", label: "30D" },
  { key: "90d", label: "90D" },
  { key: "ytd", label: "YTD" },
  { key: "all", label: "All Time" },
];

function getPresetRange(key: PresetKey): { from: Date; to: Date } {
  const now = new Date();
  const to = endOfDay(now);
  switch (key) {
    case "today": return { from: startOfDay(now), to };
    case "7d": return { from: startOfDay(subDays(now, 6)), to };
    case "30d": return { from: startOfDay(subDays(now, 29)), to };
    case "90d": return { from: startOfDay(subDays(now, 89)), to };
    case "ytd": return { from: startOfYear(now), to };
    case "all": return { from: new Date("2020-01-01"), to };
  }
}

const fmt = (n: number) => n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const AdminOverview = ({ patients, orders, patientPeptides, peptides, recentActivity, peptideRequests }: Props) => {
  const [activePreset, setActivePreset] = useState<PresetKey>("30d");
  const [customFrom, setCustomFrom] = useState<Date | undefined>();
  const [customTo, setCustomTo] = useState<Date | undefined>();

  const dateRange = useMemo(() => {
    if (customFrom && customTo) return { from: startOfDay(customFrom), to: endOfDay(customTo) };
    return getPresetRange(activePreset);
  }, [activePreset, customFrom, customTo]);

  const handlePreset = (key: PresetKey) => {
    setActivePreset(key);
    setCustomFrom(undefined);
    setCustomTo(undefined);
  };

  const handleCustomDate = (type: "from" | "to", date: Date | undefined) => {
    if (type === "from") setCustomFrom(date);
    else setCustomTo(date);
    setActivePreset("all"); // deselect presets visually
  };

  const isCustom = !!(customFrom && customTo);

  // Build a cost lookup from peptides
  const costMap = new Map(peptides.filter(p => p.cost != null).map(p => [p.id, p.cost!]));

  // Filter paid requests by date range
  const allPaidRequests = peptideRequests.filter(r => r.status === "paid");
  const filteredRequests = useMemo(() => {
    return allPaidRequests.filter(r => {
      const d = new Date(r.created_at);
      return isWithinInterval(d, { start: dateRange.from, end: dateRange.to });
    });
  }, [allPaidRequests, dateRange]);

  // Calculate financials
  const financials = useMemo(() => {
    let peptideRevenue = 0, peptideCost = 0, kitRevenue = 0, kitCost = 0, shippingRevenue = 0, shippingCost = 0, kitCount = 0, shipCount = 0;
    filteredRequests.forEach(r => {
      peptideRevenue += r.price || 0;
      peptideCost += costMap.get(r.peptide_id) || 0;
      if (r.include_injection_kit) { kitCount++; kitRevenue += KIT_PRICE; kitCost += KIT_COST; }
      if (r.delivery_method === "ship" || r.delivery_method === "shipping") { shipCount++; shippingRevenue += SHIPPING_PRICE; shippingCost += SHIPPING_COST; }
      if (r.delivery_method === "courier") { shipCount++; shippingRevenue += COURIER_PRICE; shippingCost += COURIER_COST; }
    });
    const totalRevenue = peptideRevenue + kitRevenue + shippingRevenue;
    const totalCost = peptideCost + kitCost + shippingCost;
    return { peptideRevenue, peptideCost, kitRevenue, kitCost, kitCount, shippingRevenue, shippingCost, shipCount, totalRevenue, totalCost, profit: totalRevenue - totalCost };
  }, [filteredRequests, costMap]);

  // Build daily chart data
  const chartData = useMemo(() => {
    const buckets = new Map<string, { revenue: number; profit: number; orders: number }>();
    filteredRequests.forEach(r => {
      const day = format(new Date(r.created_at), "MMM d");
      const existing = buckets.get(day) || { revenue: 0, profit: 0, orders: 0 };
      const rev = (r.price || 0) + (r.include_injection_kit ? KIT_PRICE : 0) + (r.delivery_method === "ship" ? SHIPPING_PRICE : 0);
      const cost = (costMap.get(r.peptide_id) || 0) + (r.include_injection_kit ? KIT_COST : 0) + (r.delivery_method === "ship" ? SHIPPING_COST : 0);
      existing.revenue += rev;
      existing.profit += rev - cost;
      existing.orders += 1;
      buckets.set(day, existing);
    });
    return Array.from(buckets.entries()).map(([date, data]) => ({ date, ...data }));
  }, [filteredRequests, costMap]);

  // Paid transactions list for the period
  const recentTransactions = useMemo(() => {
    return filteredRequests
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 10);
  }, [filteredRequests]);

  

  // Low supply alerts
  const lowSupply = patientPeptides
    .filter(pp => {
      if (!pp.quantity_remaining || !pp.usage_per_day || pp.usage_per_day <= 0) return false;
      return pp.quantity_remaining / pp.usage_per_day <= 7;
    })
    .map(pp => ({ ...pp, daysLeft: Math.floor((pp.quantity_remaining || 0) / (pp.usage_per_day || 1)) }))
    .sort((a, b) => a.daysLeft - b.daysLeft);

  // Top spenders
  const spendByPatient = new Map<string, { name: string; total: number; orderCount: number }>();
  orders.filter(o => o.status !== "cancelled").forEach(o => {
    const existing = spendByPatient.get(o.user_id) || { name: o.patient_name || "Unknown", total: 0, orderCount: 0 };
    existing.total += o.total_amount || 0;
    existing.orderCount += 1;
    spendByPatient.set(o.user_id, existing);
  });
  const topSpenders = Array.from(spendByPatient.values()).sort((a, b) => b.total - a.total).slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Date Range Bar — Square-style */}
      <div className="flex flex-wrap items-center gap-2">
        {PRESETS.map(p => (
          <Button
            key={p.key}
            variant={activePreset === p.key && !isCustom ? "default" : "outline"}
            size="sm"
            onClick={() => handlePreset(p.key)}
            className="text-[10px] tracking-wider uppercase font-body font-light rounded-none h-8 px-3"
          >
            {p.label}
          </Button>
        ))}
        <div className="h-5 w-px bg-border mx-1" />
        <Popover>
          <PopoverTrigger asChild>
            <Button variant={isCustom ? "default" : "outline"} size="sm" className="text-[10px] tracking-wider uppercase font-body font-light rounded-none h-8 px-3 gap-1.5">
              <CalendarIcon size={12} />
              {isCustom ? `${format(customFrom!, "MMM d")} – ${format(customTo!, "MMM d")}` : "Custom"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-4 space-y-3" align="end">
            <div className="flex gap-4">
              <div className="space-y-1.5">
                <p className="text-[10px] text-muted-foreground font-body font-light tracking-wider uppercase">From</p>
                <Calendar mode="single" selected={customFrom} onSelect={(d) => handleCustomDate("from", d)} className={cn("p-2 pointer-events-auto")} disabled={(d) => d > new Date()} />
              </div>
              <div className="space-y-1.5">
                <p className="text-[10px] text-muted-foreground font-body font-light tracking-wider uppercase">To</p>
                <Calendar mode="single" selected={customTo} onSelect={(d) => handleCustomDate("to", d)} className={cn("p-2 pointer-events-auto")} disabled={(d) => d > new Date() || (customFrom ? d < customFrom : false)} />
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Card className="border-border bg-card">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-body font-light tracking-wider uppercase">Patients</p>
                <p className="text-2xl font-heading font-light text-foreground mt-1">{patients.length}</p>
              </div>
              <Users size={20} className="text-primary" strokeWidth={1.2} />
            </div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-body font-light tracking-wider uppercase">Revenue</p>
                <p className="text-2xl font-heading font-light text-foreground mt-1">${fmt(financials.totalRevenue)}</p>
              </div>
              <DollarSign size={20} className="text-primary" strokeWidth={1.2} />
            </div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-body font-light tracking-wider uppercase">Orders</p>
                <p className="text-2xl font-heading font-light text-foreground mt-1">{filteredRequests.length}</p>
              </div>
              <Package size={20} className="text-primary" strokeWidth={1.2} />
            </div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-body font-light tracking-wider uppercase">Profit</p>
                <p className="text-2xl font-heading font-light text-foreground mt-1">${fmt(financials.profit)}</p>
              </div>
              <TrendingUp size={20} className="text-primary" strokeWidth={1.2} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Chart */}
      {chartData.length > 0 && (
        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-heading font-light text-foreground flex items-center gap-2">
              <TrendingUp size={14} className="text-primary" /> Revenue & Profit
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} barGap={2}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 4, fontSize: 12 }}
                    labelStyle={{ color: "hsl(var(--foreground))", fontWeight: 500 }}
                    formatter={(value: number, name: string) => [`$${fmt(value)}`, name === "revenue" ? "Revenue" : "Profit"]}
                  />
                  <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="profit" fill="hsl(var(--primary) / 0.4)" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Revenue Breakdown + Transactions */}
      <div className="grid gap-6 lg:grid-cols-5">
        {/* Revenue Breakdown */}
        <Card className="border-border bg-card lg:col-span-3">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-heading font-light text-foreground">Revenue Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredRequests.length === 0 ? (
              <p className="text-xs text-muted-foreground font-body font-light">No paid orders in this period.</p>
            ) : (
              <div className="space-y-3">
                <div className="grid gap-3 md:grid-cols-3">
                  <div className="py-3 px-4 bg-secondary/50 rounded border border-border">
                    <p className="text-[10px] text-muted-foreground font-body font-light tracking-wider uppercase mb-1">Peptide Sales</p>
                    <p className="text-lg font-heading font-light text-foreground">${fmt(financials.peptideRevenue)}</p>
                    <p className="text-[10px] text-muted-foreground font-body font-light mt-0.5">Cost: ${fmt(financials.peptideCost)}</p>
                  </div>
                  <div className="py-3 px-4 bg-secondary/50 rounded border border-border">
                    <p className="text-[10px] text-muted-foreground font-body font-light tracking-wider uppercase mb-1">Injection Kits ({financials.kitCount})</p>
                    <p className="text-lg font-heading font-light text-foreground">${fmt(financials.kitRevenue)}</p>
                    <p className="text-[10px] text-muted-foreground font-body font-light mt-0.5">Cost: ${fmt(financials.kitCost)} · Profit: ${fmt(financials.kitRevenue - financials.kitCost)}</p>
                  </div>
                  <div className="py-3 px-4 bg-secondary/50 rounded border border-border">
                    <p className="text-[10px] text-muted-foreground font-body font-light tracking-wider uppercase mb-1">Shipping ({financials.shipCount})</p>
                    <p className="text-lg font-heading font-light text-foreground">${fmt(financials.shippingRevenue)}</p>
                    <p className="text-[10px] text-muted-foreground font-body font-light mt-0.5">Cost: ${fmt(financials.shippingCost)} · Net: $0.00</p>
                  </div>
                </div>
                <div className="flex items-center justify-between py-3 px-4 bg-primary/10 rounded border border-primary/20">
                  <div>
                    <p className="text-[10px] text-muted-foreground font-body font-light tracking-wider uppercase">Total Revenue → Profit</p>
                    <p className="text-xs text-muted-foreground font-body font-light mt-0.5">{filteredRequests.length} paid order{filteredRequests.length !== 1 ? "s" : ""}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-heading font-light text-foreground">
                      ${fmt(financials.totalRevenue)} → <span className="text-primary">${fmt(financials.profit)}</span>
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card className="border-border bg-card lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-heading font-light text-foreground">Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            {recentTransactions.length === 0 ? (
              <p className="text-xs text-muted-foreground font-body font-light">No transactions in this period.</p>
            ) : (
              <div className="space-y-1">
                {recentTransactions.map(t => {
                  const total = (t.price || 0) + (t.include_injection_kit ? KIT_PRICE : 0) + (t.delivery_method === "ship" ? SHIPPING_PRICE : 0);
                  return (
                    <div key={t.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                      <div className="min-w-0">
                        <p className="text-sm font-body font-light text-foreground truncate">{t.patient_name || "Patient"}</p>
                        <p className="text-[10px] text-muted-foreground font-body font-light">{t.peptide_name} · {format(new Date(t.created_at), "MMM d")}</p>
                      </div>
                      <span className="text-sm font-body font-light text-foreground shrink-0 ml-2">${fmt(total)}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Low Supply Alerts */}
        <Card className="border-border bg-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-heading font-light text-foreground flex items-center gap-2">
              <AlertTriangle size={14} className="text-destructive" /> Low Supply Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            {lowSupply.length === 0 ? (
              <p className="text-xs text-muted-foreground font-body font-light">All patients have adequate supply.</p>
            ) : (
              <div className="space-y-2">
                {lowSupply.map(pp => (
                  <div key={pp.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <div>
                      <p className="text-sm font-body font-light text-foreground">{pp.patient_name}</p>
                      <p className="text-xs text-muted-foreground font-body font-light">{pp.peptide_name}</p>
                    </div>
                    <Badge variant="outline" className={pp.daysLeft <= 3 ? "bg-destructive/20 text-destructive border-destructive/30" : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"}>
                      {pp.daysLeft <= 0 ? "Empty" : `${pp.daysLeft}d left`}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Spenders */}
        <Card className="border-border bg-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-heading font-light text-foreground flex items-center gap-2">
              <DollarSign size={14} className="text-primary" /> Top Patients by Spend
            </CardTitle>
          </CardHeader>
          <CardContent>
            {topSpenders.length === 0 ? (
              <p className="text-xs text-muted-foreground font-body font-light">No order data yet.</p>
            ) : (
              <div className="space-y-2">
                {topSpenders.map((s, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <div>
                      <p className="text-sm font-body font-light text-foreground">{s.name}</p>
                      <p className="text-xs text-muted-foreground font-body font-light">{s.orderCount} order{s.orderCount !== 1 ? "s" : ""}</p>
                    </div>
                    <span className="text-sm font-body font-light text-foreground">${s.total.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Feed */}
      <Card className="border-border bg-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-heading font-light text-foreground flex items-center gap-2">
            <ClipboardList size={14} className="text-primary" /> Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentActivity.length === 0 ? (
            <p className="text-xs text-muted-foreground font-body font-light">No recent activity.</p>
          ) : (
            <div className="space-y-1">
              {recentActivity.map((a, i) => (
                <div key={i} className="flex items-start gap-3 py-2.5 border-b border-border last:border-0">
                  <div className="mt-0.5 shrink-0">
                    {a.type === "signup" ? (
                      <UserPlus size={14} className="text-green-400" />
                    ) : a.type === "request" ? (
                      <ClipboardList size={14} className="text-primary" />
                    ) : (
                      <Shield size={14} className="text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-body font-light text-foreground">
                      <span className="font-medium">{a.label}</span>{" "}
                      <span className="text-muted-foreground">{a.detail}</span>
                      {a.resource && (
                        <span className="text-muted-foreground"> · {a.resource}</span>
                      )}
                    </p>
                    <p className="text-[10px] text-muted-foreground font-body font-light mt-0.5">
                      {formatDistanceToNow(new Date(a.timestamp), { addSuffix: true })}
                    </p>
                  </div>
                  {a.status && (
                    <Badge variant="outline" className={
                      a.status === "pending" ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" :
                      a.status === "approved" ? "bg-green-500/20 text-green-400 border-green-500/30" :
                      a.status === "denied" ? "bg-destructive/20 text-destructive border-destructive/30" :
                      a.status === "paid" ? "bg-primary/20 text-primary border-primary/30" :
                      "bg-secondary text-muted-foreground border-border"
                    }>
                      {a.status}
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminOverview;
