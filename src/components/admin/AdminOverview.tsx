import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Users, Package, TrendingUp, Clock, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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

interface Props {
  patients: Patient[];
  orders: Order[];
  patientPeptides: PatientPeptide[];
  peptides: Peptide[];
}

const AdminOverview = ({ patients, orders, patientPeptides, peptides }: Props) => {
  const activeOrders = orders.filter(o => ["pending", "processing", "shipped"].includes(o.status));
  const deliveredOrders = orders.filter(o => o.status === "delivered");
  const totalRevenue = orders
    .filter(o => o.status !== "cancelled")
    .reduce((sum, o) => sum + (o.total_amount || 0), 0);

  // Profit margin calculation
  const peptidesWithMargin = peptides
    .filter(p => p.price && p.cost && p.cost > 0)
    .map(p => ({
      name: p.name,
      price: p.price!,
      cost: p.cost!,
      margin: ((p.price! - p.cost!) / p.price!) * 100,
    }));
  const avgMargin = peptidesWithMargin.length > 0
    ? peptidesWithMargin.reduce((sum, p) => sum + p.margin, 0) / peptidesWithMargin.length
    : 0;

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
                <p className="text-xs text-muted-foreground font-body font-light tracking-wider uppercase">Avg Margin</p>
                <p className="text-2xl font-heading font-light text-foreground mt-1">
                  {avgMargin > 0 ? `${avgMargin.toFixed(1)}%` : "—"}
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

        {/* Profit Margins */}
        <Card className="border-border bg-card lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-heading font-light text-foreground flex items-center gap-2">
              <TrendingUp size={14} className="text-primary" /> Peptide Profit Margins
            </CardTitle>
          </CardHeader>
          <CardContent>
            {peptidesWithMargin.length === 0 ? (
              <p className="text-xs text-muted-foreground font-body font-light">
                Set cost prices in the Peptides tab to see margin data.
              </p>
            ) : (
              <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
                {peptidesWithMargin.map((p, i) => (
                  <div key={i} className="flex items-center justify-between py-2 px-3 bg-secondary/50 rounded border border-border">
                    <div>
                      <p className="text-sm font-body font-light text-foreground">{p.name}</p>
                      <p className="text-xs text-muted-foreground font-body font-light">
                        ${p.cost} → ${p.price}
                      </p>
                    </div>
                    <Badge variant="outline" className={p.margin >= 40 ? "bg-green-500/20 text-green-400 border-green-500/30" : p.margin >= 20 ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" : "bg-destructive/20 text-destructive border-destructive/30"}>
                      {p.margin.toFixed(1)}%
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminOverview;
