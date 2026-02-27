import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Users, Package, TrendingUp, AlertTriangle, UserPlus, ClipboardList, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";

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
  price: number | null;
  status: string;
  include_injection_kit: boolean;
  delivery_method: string | null;
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

const AdminOverview = ({ patients, orders, patientPeptides, peptides, recentActivity, peptideRequests }: Props) => {
  const activeOrders = orders.filter(o => ["pending", "processing", "shipped"].includes(o.status));

  // Build a cost lookup from peptides
  const costMap = new Map(peptides.filter(p => p.cost != null).map(p => [p.id, p.cost!]));

  // Calculate financials from paid requests
  const paidRequests = peptideRequests.filter(r => r.status === "paid");
  
  let peptideRevenue = 0;
  let peptideCost = 0;
  let kitRevenue = 0;
  let kitCost = 0;
  let shippingRevenue = 0;
  let shippingCost = 0;
  

  paidRequests.forEach(r => {
    peptideRevenue += r.price || 0;
    peptideCost += costMap.get(r.peptide_id) || 0;
    if (r.include_injection_kit) {
      kitCount++;
      kitRevenue += KIT_PRICE;
      kitCost += KIT_COST;
    }
    if (r.delivery_method === "ship") {
      shippingRevenue += SHIPPING_PRICE;
      shippingCost += SHIPPING_COST;
    }
  });

  const totalRevenue = peptideRevenue + kitRevenue + shippingRevenue;
  const totalCost = peptideCost + kitCost + shippingCost;
  const totalProfit = totalRevenue - totalCost;

  // Spend per patient
  const spendByPatient = new Map<string, { name: string; total: number; orderCount: number }>();
  orders.filter(o => o.status !== "cancelled").forEach(o => {
    const existing = spendByPatient.get(o.user_id) || { name: o.patient_name || "Unknown", total: 0, orderCount: 0 };
    existing.total += o.total_amount || 0;
    existing.orderCount += 1;
    spendByPatient.set(o.user_id, existing);
  });
  const topSpenders = Array.from(spendByPatient.values()).sort((a, b) => b.total - a.total).slice(0, 5);

  // Low supply alerts
  const lowSupply = patientPeptides
    .filter(pp => {
      if (!pp.quantity_remaining || !pp.usage_per_day || pp.usage_per_day <= 0) return false;
      return pp.quantity_remaining / pp.usage_per_day <= 7;
    })
    .map(pp => ({
      ...pp,
      daysLeft: Math.floor((pp.quantity_remaining || 0) / (pp.usage_per_day || 1)),
    }))
    .sort((a, b) => a.daysLeft - b.daysLeft);

  return (
    <div className="space-y-6">
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
                <p className="text-xs text-muted-foreground font-body font-light tracking-wider uppercase">Total Revenue</p>
                <p className="text-2xl font-heading font-light text-foreground mt-1">${totalRevenue.toLocaleString()}</p>
              </div>
              <DollarSign size={20} className="text-primary" strokeWidth={1.2} />
            </div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-body font-light tracking-wider uppercase">Active Orders</p>
                <p className="text-2xl font-heading font-light text-foreground mt-1">{activeOrders.length}</p>
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
                <p className="text-2xl font-heading font-light text-foreground mt-1">
                  ${(totalRevenue - totalCost).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
              <TrendingUp size={20} className="text-primary" strokeWidth={1.2} />
            </div>
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

        {/* Revenue Breakdown */}
        <Card className="border-border bg-card lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-heading font-light text-foreground flex items-center gap-2">
              <TrendingUp size={14} className="text-primary" /> Revenue Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            {paidRequests.length === 0 ? (
              <p className="text-xs text-muted-foreground font-body font-light">No paid orders yet.</p>
            ) : (
              <div className="space-y-3">
                <div className="grid gap-3 md:grid-cols-3">
                  <div className="py-3 px-4 bg-secondary/50 rounded border border-border">
                    <p className="text-[10px] text-muted-foreground font-body font-light tracking-wider uppercase mb-1">Peptide Sales</p>
                    <p className="text-lg font-heading font-light text-foreground">${peptideRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                    <p className="text-[10px] text-muted-foreground font-body font-light mt-0.5">Cost: ${peptideCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                  </div>
                  <div className="py-3 px-4 bg-secondary/50 rounded border border-border">
                    <p className="text-[10px] text-muted-foreground font-body font-light tracking-wider uppercase mb-1">Injection Kits</p>
                    <p className="text-lg font-heading font-light text-foreground">${kitRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                    <p className="text-[10px] text-muted-foreground font-body font-light mt-0.5">Cost: ${kitCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} · Profit: ${(kitRevenue - kitCost).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                  </div>
                  <div className="py-3 px-4 bg-secondary/50 rounded border border-border">
                    <p className="text-[10px] text-muted-foreground font-body font-light tracking-wider uppercase mb-1">Shipping</p>
                    <p className="text-lg font-heading font-light text-foreground">${shippingRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                    <p className="text-[10px] text-muted-foreground font-body font-light mt-0.5">Cost: ${shippingCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} · Net: $0.00</p>
                  </div>
                </div>
                <div className="flex items-center justify-between py-3 px-4 bg-primary/10 rounded border border-primary/20">
                  <div>
                    <p className="text-[10px] text-muted-foreground font-body font-light tracking-wider uppercase">Total Revenue → Profit</p>
                    <p className="text-xs text-muted-foreground font-body font-light mt-0.5">{paidRequests.length} paid order{paidRequests.length !== 1 ? "s" : ""}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-heading font-light text-foreground">
                      ${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} → <span className="text-primary">${(totalRevenue - totalCost).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </p>
                  </div>
                </div>
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
