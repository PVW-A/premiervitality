import { useAuth } from "@/hooks/useAuth";
import { logAdminAction } from "@/lib/auditLog";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import PVMonogram from "@/components/PVMonogram";
import AdminOverview from "@/components/admin/AdminOverview";
import AdminBiomarkers from "@/components/admin/AdminBiomarkers";
import { LogOut, Users, Pill, Package, Plus, Trash2, BarChart3, ClipboardList, CheckCircle, XCircle, Activity } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";
import { Textarea } from "@/components/ui/textarea";

type OrderStatus = Database["public"]["Enums"]["order_status"];

interface Patient {
  user_id: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  square_customer_id: string | null;
}

interface MergedCustomer {
  square_id: string;
  given_name: string | null;
  family_name: string | null;
  email: string | null;
  phone: string | null;
  birthday: string | null;
  square_created_at: string | null;
  note: string | null;
  company_name: string | null;
  address: any | null;
  has_account: boolean;
  app_user_id: string | null;
}

interface Peptide {
  id: string;
  name: string;
  description: string | null;
  unit: string | null;
  price: number | null;
  cost: number | null;
}

interface PatientPeptide {
  id: string;
  user_id: string;
  peptide_id: string;
  dosage: string | null;
  quantity_remaining: number | null;
  usage_per_day: number | null;
  notes: string | null;
  peptide_name?: string;
  patient_name?: string;
}

interface Order {
  id: string;
  user_id: string;
  status: OrderStatus;
  tracking_number: string | null;
  expected_delivery: string | null;
  notes: string | null;
  created_at: string;
  total_amount: number;
  patient_name?: string;
}

interface PeptideRequest {
  id: string;
  user_id: string;
  peptide_id: string;
  peptide_name: string;
  variation_label: string | null;
  price: number | null;
  status: string;
  deny_reason: string | null;
  created_at: string;
  patient_name?: string;
}

const ORDER_STATUSES: OrderStatus[] = ["pending", "processing", "shipped", "delivered", "cancelled"];

const statusColor: Record<string, string> = {
  pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  processing: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  shipped: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  delivered: "bg-green-500/20 text-green-400 border-green-500/30",
  cancelled: "bg-destructive/20 text-destructive border-destructive/30",
};

const Admin = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [peptides, setPeptides] = useState<Peptide[]>([]);
  const [patientPeptides, setPatientPeptides] = useState<PatientPeptide[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [peptideRequests, setPeptideRequests] = useState<PeptideRequest[]>([]);
  const [denyDialogOpen, setDenyDialogOpen] = useState<string | null>(null);
  const [denyReason, setDenyReason] = useState("");
  const [allCustomers, setAllCustomers] = useState<MergedCustomer[]>([]);

  // Dialog states
  const [peptideDialogOpen, setPeptideDialogOpen] = useState(false);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [orderDialogOpen, setOrderDialogOpen] = useState(false);

  // Form states
  const [newPeptide, setNewPeptide] = useState({ name: "", description: "", unit: "mg", price: "", cost: "" });
  const [newAssignment, setNewAssignment] = useState({ user_id: "", peptide_id: "", dosage: "", quantity_remaining: "0", usage_per_day: "1", notes: "" });
  const [newOrder, setNewOrder] = useState({ user_id: "", status: "pending" as OrderStatus, tracking_number: "", expected_delivery: "", notes: "", total_amount: "" });

  useEffect(() => {
    if (!loading && !user) navigate("/auth");
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!user) return;
    const checkAdmin = async () => {
      const { data } = await supabase.rpc("has_role", { _user_id: user.id, _role: "admin" });
      setIsAdmin(!!data);
      if (!data) navigate("/portal");
    };
    checkAdmin();
  }, [user, navigate]);

  const fetchAll = useCallback(async () => {
    if (!user || !isAdmin) return;

    const [profilesRes, peptidesRes, ppRes, ordersRes, requestsRes] = await Promise.all([
      supabase.from("profiles").select("user_id, first_name, last_name, phone, square_customer_id"),
      supabase.from("peptides").select("*").order("name"),
      supabase.from("patient_peptides").select("*, peptides(name)"),
      supabase.from("orders").select("*").order("created_at", { ascending: false }),
      supabase.from("peptide_requests").select("*").order("created_at", { ascending: false }),
    ]);

    if (profilesRes.data) {
      setPatients(profilesRes.data);
    }

    // Fetch ALL Square customers
    supabase.functions.invoke("square-list-customers").then(({ data }) => {
      if (data?.customers) {
        const profileMap = new Map((profilesRes.data || []).map(p => [p.square_customer_id, p.user_id]));
        const merged: MergedCustomer[] = data.customers.map((c: any) => ({
          square_id: c.id,
          given_name: c.given_name,
          family_name: c.family_name,
          email: c.email,
          phone: c.phone,
          birthday: c.birthday,
          square_created_at: c.created_at,
          note: c.note,
          company_name: c.company_name,
          address: c.address,
          has_account: profileMap.has(c.id),
          app_user_id: profileMap.get(c.id) || null,
        }));
        // Sort: accounts first, then alphabetical
        merged.sort((a, b) => {
          if (a.has_account !== b.has_account) return a.has_account ? -1 : 1;
          const nameA = `${a.given_name || ""} ${a.family_name || ""}`.trim().toLowerCase();
          const nameB = `${b.given_name || ""} ${b.family_name || ""}`.trim().toLowerCase();
          return nameA.localeCompare(nameB);
        });
        setAllCustomers(merged);
      }
    }).catch(() => {});

    if (peptidesRes.data) setPeptides(peptidesRes.data);

    const patientMap = new Map((profilesRes.data || []).map(p => [p.user_id, `${p.first_name || ""} ${p.last_name || ""}`.trim() || "Unknown"]));

    if (ppRes.data) {
      setPatientPeptides(ppRes.data.map((pp: any) => ({
        ...pp,
        peptide_name: pp.peptides?.name ?? "Unknown",
        patient_name: patientMap.get(pp.user_id) || "Unknown",
      })));
    }

    if (ordersRes.data) {
      setOrders(ordersRes.data.map((o: any) => ({
        ...o,
        patient_name: patientMap.get(o.user_id) || "Unknown",
      })));
    }

    if (requestsRes.data) {
      setPeptideRequests(requestsRes.data.map((r: any) => ({
        ...r,
        patient_name: patientMap.get(r.user_id) || "Unknown",
      })));
    }
  }, [user, isAdmin]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const handleAddPeptide = async () => {
    if (!newPeptide.name.trim()) return;
    const { data } = await supabase.from("peptides").insert({
      name: newPeptide.name,
      description: newPeptide.description || null,
      unit: newPeptide.unit || "mg",
      price: newPeptide.price ? parseFloat(newPeptide.price) : null,
      cost: newPeptide.cost ? parseFloat(newPeptide.cost) : null,
    }).select("id").single();
    if (data) logAdminAction({ action: "create", resource_type: "peptide", resource_id: data.id });
    setNewPeptide({ name: "", description: "", unit: "mg", price: "", cost: "" });
    setPeptideDialogOpen(false);
    fetchAll();
  };

  const handleDeletePeptide = async (id: string) => {
    await supabase.from("peptides").delete().eq("id", id);
    fetchAll();
  };

  const handleAssignPeptide = async () => {
    if (!newAssignment.user_id || !newAssignment.peptide_id) return;
    await supabase.from("patient_peptides").insert({
      user_id: newAssignment.user_id,
      peptide_id: newAssignment.peptide_id,
      dosage: newAssignment.dosage || null,
      quantity_remaining: parseFloat(newAssignment.quantity_remaining) || 0,
      usage_per_day: parseFloat(newAssignment.usage_per_day) || 1,
      notes: newAssignment.notes || null,
    });
    setNewAssignment({ user_id: "", peptide_id: "", dosage: "", quantity_remaining: "0", usage_per_day: "1", notes: "" });
    setAssignDialogOpen(false);
    fetchAll();
  };

  const handleRemoveAssignment = async (id: string) => {
    await supabase.from("patient_peptides").delete().eq("id", id);
    fetchAll();
  };

  const [approvingId, setApprovingId] = useState<string | null>(null);

  const handleApproveRequest = async (id: string) => {
    setApprovingId(id);
    try {
      const req = peptideRequests.find(r => r.id === id);
      await supabase.from("peptide_requests").update({ status: "approved" }).eq("id", id);
      logAdminAction({ action: "approve_request", resource_type: "peptide_request", resource_id: id, patient_user_id: req?.user_id });
      const { toast } = await import("sonner");
      toast.success("Request approved — patient can now configure & pay");
    } catch (e: any) {
      const { toast } = await import("sonner");
      toast.error(e.message || "Failed to approve request");
    } finally {
      setApprovingId(null);
      fetchAll();
    }
  };

  const handleDenyRequest = async (id: string) => {
    const req = peptideRequests.find(r => r.id === id);
    await supabase.from("peptide_requests").update({ status: "denied", deny_reason: denyReason || null }).eq("id", id);
    logAdminAction({ action: "deny_request", resource_type: "peptide_request", resource_id: id, patient_user_id: req?.user_id, metadata: { reason: denyReason } });
    setDenyDialogOpen(null);
    setDenyReason("");
    fetchAll();
  };

  const handleDeleteRequest = async (id: string) => {
    await supabase.from("peptide_requests").delete().eq("id", id);
    fetchAll();
  };

  const handleCreateOrder = async () => {
    if (!newOrder.user_id) return;
    await supabase.from("orders").insert({
      user_id: newOrder.user_id,
      status: newOrder.status,
      tracking_number: newOrder.tracking_number || null,
      expected_delivery: newOrder.expected_delivery || null,
      notes: newOrder.notes || null,
      total_amount: newOrder.total_amount ? parseFloat(newOrder.total_amount) : 0,
    });
    setNewOrder({ user_id: "", status: "pending", tracking_number: "", expected_delivery: "", notes: "", total_amount: "" });
    setOrderDialogOpen(false);
    fetchAll();
  };

  const handleUpdateOrderStatus = async (orderId: string, status: OrderStatus) => {
    const order = orders.find(o => o.id === orderId);
    await supabase.from("orders").update({ status }).eq("id", orderId);
    logAdminAction({ action: "update_order_status", resource_type: "order", resource_id: orderId, patient_user_id: order?.user_id, metadata: { new_status: status } });
    fetchAll();
  };

  const handleDeleteOrder = async (id: string) => {
    await supabase.from("orders").delete().eq("id", id);
    fetchAll();
  };

  if (loading || isAdmin === null) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground text-sm font-body font-light tracking-wider uppercase animate-pulse">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <PVMonogram className="w-8 h-8" />
            <span className="text-xs tracking-[0.25em] uppercase text-foreground font-body font-light hidden sm:inline">
              Admin Dashboard
            </span>
          </div>
          <Button variant="ghost" size="icon" onClick={() => { signOut(); navigate("/auth"); }} className="text-muted-foreground hover:text-foreground">
            <LogOut size={16} strokeWidth={1.2} />
          </Button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-secondary border border-border">
            <TabsTrigger value="overview" className="text-xs tracking-wider uppercase font-body font-light data-[state=active]:bg-background">
              <BarChart3 size={14} className="mr-1.5" /> Overview
            </TabsTrigger>
            <TabsTrigger value="patients" className="text-xs tracking-wider uppercase font-body font-light data-[state=active]:bg-background">
              <Users size={14} className="mr-1.5" /> Patients
            </TabsTrigger>
            <TabsTrigger value="peptides" className="text-xs tracking-wider uppercase font-body font-light data-[state=active]:bg-background">
              <Pill size={14} className="mr-1.5" /> Peptides
            </TabsTrigger>
            <TabsTrigger value="orders" className="text-xs tracking-wider uppercase font-body font-light data-[state=active]:bg-background">
              <Package size={14} className="mr-1.5" /> Orders
            </TabsTrigger>
            <TabsTrigger value="requests" className="text-xs tracking-wider uppercase font-body font-light data-[state=active]:bg-background">
              <ClipboardList size={14} className="mr-1.5" /> Requests
              {peptideRequests.filter(r => r.status === "pending").length > 0 && (
                <Badge variant="outline" className="ml-1.5 bg-primary/20 text-primary border-primary/30 text-[9px] px-1.5 py-0">
                  {peptideRequests.filter(r => r.status === "pending").length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="biomarkers" className="text-xs tracking-wider uppercase font-body font-light data-[state=active]:bg-background">
              <Activity size={14} className="mr-1.5" /> Biomarkers
            </TabsTrigger>
          </TabsList>

          {/* OVERVIEW TAB */}
          <TabsContent value="overview">
            <AdminOverview patients={patients} orders={orders} patientPeptides={patientPeptides} peptides={peptides} />
          </TabsContent>

          {/* PATIENTS TAB */}
          <TabsContent value="patients" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-heading font-light text-foreground">Patient Records</h2>
              <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="text-xs tracking-wider uppercase font-body font-light rounded-none">
                    <Plus size={14} className="mr-1" /> Assign Peptide
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-card border-border">
                  <DialogHeader>
                    <DialogTitle className="font-heading font-light text-foreground">Assign Peptide to Patient</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-xs tracking-wider uppercase text-muted-foreground font-body font-light">Patient</Label>
                      <Select value={newAssignment.user_id} onValueChange={(v) => setNewAssignment(p => ({ ...p, user_id: v }))}>
                        <SelectTrigger className="bg-secondary border-border"><SelectValue placeholder="Select patient" /></SelectTrigger>
                        <SelectContent>
                          {patients.map(p => (
                            <SelectItem key={p.user_id} value={p.user_id}>{p.first_name} {p.last_name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs tracking-wider uppercase text-muted-foreground font-body font-light">Peptide</Label>
                      <Select value={newAssignment.peptide_id} onValueChange={(v) => setNewAssignment(p => ({ ...p, peptide_id: v }))}>
                        <SelectTrigger className="bg-secondary border-border"><SelectValue placeholder="Select peptide" /></SelectTrigger>
                        <SelectContent>
                          {peptides.map(p => (
                            <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label className="text-xs tracking-wider uppercase text-muted-foreground font-body font-light">Dosage</Label>
                        <Input value={newAssignment.dosage} onChange={e => setNewAssignment(p => ({ ...p, dosage: e.target.value }))} className="bg-secondary border-border" placeholder="e.g. 250mcg" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs tracking-wider uppercase text-muted-foreground font-body font-light">Quantity</Label>
                        <Input type="number" value={newAssignment.quantity_remaining} onChange={e => setNewAssignment(p => ({ ...p, quantity_remaining: e.target.value }))} className="bg-secondary border-border" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs tracking-wider uppercase text-muted-foreground font-body font-light">Usage/Day</Label>
                      <Input type="number" value={newAssignment.usage_per_day} onChange={e => setNewAssignment(p => ({ ...p, usage_per_day: e.target.value }))} className="bg-secondary border-border" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs tracking-wider uppercase text-muted-foreground font-body font-light">Notes</Label>
                      <Input value={newAssignment.notes} onChange={e => setNewAssignment(p => ({ ...p, notes: e.target.value }))} className="bg-secondary border-border" />
                    </div>
                    <Button onClick={handleAssignPeptide} className="w-full text-xs tracking-wider uppercase font-body font-light rounded-none">Assign</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {allCustomers.length === 0 ? (
              <p className="text-xs text-muted-foreground font-body font-light animate-pulse">Loading Square customers…</p>
            ) : (
              allCustomers.map(customer => {
                const pp = customer.app_user_id ? patientPeptides.filter(p => p.user_id === customer.app_user_id) : [];
                const customerOrders = customer.app_user_id ? orders.filter(o => o.user_id === customer.app_user_id) : [];
                const totalSpend = customerOrders.filter(o => o.status !== "cancelled").reduce((s, o) => s + (o.total_amount || 0), 0);
                return (
                  <Card key={customer.square_id} className="border-border bg-card">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg font-heading font-light text-foreground flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span>{customer.given_name} {customer.family_name}</span>
                          {customer.has_account ? (
                            <Badge variant="outline" className="text-[9px] px-1.5 py-0 bg-primary/20 text-primary border-primary/30">
                              App Account
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-[9px] px-1.5 py-0 bg-muted text-muted-foreground border-border">
                              Square Only
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                          {totalSpend > 0 && (
                            <span className="text-xs text-primary font-body font-light">${totalSpend.toLocaleString()} spent</span>
                          )}
                        </div>
                      </CardTitle>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                        {customer.email && (
                          <span className="text-[11px] text-muted-foreground font-body font-light">
                            ✉ {customer.email}
                          </span>
                        )}
                        {customer.phone && (
                          <span className="text-[11px] text-muted-foreground font-body font-light">
                            ☎ {customer.phone}
                          </span>
                        )}
                        {customer.birthday && (
                          <span className="text-[11px] text-muted-foreground font-body font-light">
                            🎂 {customer.birthday.startsWith("0000") 
                              ? (() => { const [, m, d] = customer.birthday.split("-"); return `${m}/${d}`; })()
                              : (() => { const [y, m, d] = customer.birthday.split("-"); return `${m}/${d}/${y}`; })()
                            }
                            {customer.birthday.startsWith("0000") && (
                              <span className="text-destructive ml-1">(year missing)</span>
                            )}
                          </span>
                        )}
                        {customer.company_name && (
                          <span className="text-[11px] text-muted-foreground font-body font-light">
                            🏢 {customer.company_name}
                          </span>
                        )}
                        {customer.square_created_at && (
                          <span className="text-[11px] text-muted-foreground/60 font-body font-light">
                            Since {new Date(customer.square_created_at).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      {customer.note && (
                        <p className="text-[11px] text-muted-foreground/70 font-body font-light italic mt-1">
                          {customer.note}
                        </p>
                      )}
                      {customer.address && (
                        <div className="flex items-start gap-1.5 mt-1">
                          <span className="text-[11px] text-muted-foreground font-body font-light">
                            📍 {[
                              customer.address.address_line_1,
                              customer.address.address_line_2,
                              customer.address.locality,
                              customer.address.administrative_district_level_1,
                              customer.address.postal_code
                            ].filter(Boolean).join(", ")}
                          </span>
                        </div>
                      )}
                    </CardHeader>
                    <CardContent>
                      {pp.length === 0 ? (
                        <p className="text-xs text-muted-foreground font-body font-light">
                          {customer.has_account ? "No peptides assigned" : "—"}
                        </p>
                      ) : (
                        <div className="space-y-2">
                          {pp.map(p => {
                            const daysLeft = p.usage_per_day && p.usage_per_day > 0 && p.quantity_remaining
                              ? Math.floor(p.quantity_remaining / p.usage_per_day) : null;
                            return (
                              <div key={p.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                                <div className="space-y-0.5">
                                  <span className="text-sm text-foreground font-body font-light">{p.peptide_name}</span>
                                  <div className="flex gap-3 text-xs text-muted-foreground font-body font-light">
                                    {p.dosage && <span>{p.dosage}</span>}
                                    <span>{p.quantity_remaining} remaining</span>
                                    <span>{p.usage_per_day}/day</span>
                                    {daysLeft !== null && (
                                      <span className={daysLeft <= 7 ? "text-destructive" : "text-primary"}>
                                        ~{daysLeft}d supply
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => handleRemoveAssignment(p.id)} className="text-muted-foreground hover:text-destructive h-8 w-8">
                                  <Trash2 size={14} />
                                </Button>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })
            )}
          </TabsContent>

          {/* PEPTIDES TAB */}
          <TabsContent value="peptides" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-heading font-light text-foreground">Peptide Catalog</h2>
              <Dialog open={peptideDialogOpen} onOpenChange={setPeptideDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="text-xs tracking-wider uppercase font-body font-light rounded-none">
                    <Plus size={14} className="mr-1" /> Add Peptide
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-card border-border">
                  <DialogHeader>
                    <DialogTitle className="font-heading font-light text-foreground">Add New Peptide</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-xs tracking-wider uppercase text-muted-foreground font-body font-light">Name</Label>
                      <Input value={newPeptide.name} onChange={e => setNewPeptide(p => ({ ...p, name: e.target.value }))} className="bg-secondary border-border" placeholder="e.g. BPC-157" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs tracking-wider uppercase text-muted-foreground font-body font-light">Description</Label>
                      <Input value={newPeptide.description} onChange={e => setNewPeptide(p => ({ ...p, description: e.target.value }))} className="bg-secondary border-border" />
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="space-y-2">
                        <Label className="text-xs tracking-wider uppercase text-muted-foreground font-body font-light">Unit</Label>
                        <Input value={newPeptide.unit} onChange={e => setNewPeptide(p => ({ ...p, unit: e.target.value }))} className="bg-secondary border-border" placeholder="mg" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs tracking-wider uppercase text-muted-foreground font-body font-light">Price ($)</Label>
                        <Input type="number" value={newPeptide.price} onChange={e => setNewPeptide(p => ({ ...p, price: e.target.value }))} className="bg-secondary border-border" placeholder="0.00" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs tracking-wider uppercase text-muted-foreground font-body font-light">Cost ($)</Label>
                        <Input type="number" value={newPeptide.cost} onChange={e => setNewPeptide(p => ({ ...p, cost: e.target.value }))} className="bg-secondary border-border" placeholder="0.00" />
                      </div>
                    </div>
                    <Button onClick={handleAddPeptide} className="w-full text-xs tracking-wider uppercase font-body font-light rounded-none">Add Peptide</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {peptides.map(p => {
                const margin = p.price && p.cost && p.cost > 0 ? ((p.price - p.cost) / p.price * 100) : null;
                return (
                  <Card key={p.id} className="border-border bg-card">
                    <CardContent className="py-4 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-body font-light text-foreground">{p.name}</p>
                        {p.description && <p className="text-xs text-muted-foreground font-body font-light mt-0.5">{p.description}</p>}
                        <div className="flex gap-3 text-xs text-muted-foreground font-body font-light mt-1">
                          <span>Unit: {p.unit}</span>
                          {p.price && <span className="text-primary">${p.price}</span>}
                          {p.cost != null && <span>Cost: ${p.cost}</span>}
                          {margin !== null && (
                            <Badge variant="outline" className={margin >= 50 ? "bg-green-500/20 text-green-400 border-green-500/30 text-[10px]" : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30 text-[10px]"}>
                              {margin.toFixed(0)}%
                            </Badge>
                          )}
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => handleDeletePeptide(p.id)} className="text-muted-foreground hover:text-destructive h-8 w-8">
                        <Trash2 size={14} />
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
              {peptides.length === 0 && (
                <p className="text-sm text-muted-foreground font-body font-light col-span-full text-center py-10">No peptides in catalog yet.</p>
              )}
            </div>
          </TabsContent>

          {/* ORDERS TAB */}
          <TabsContent value="orders" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-heading font-light text-foreground">Order Management</h2>
              <Dialog open={orderDialogOpen} onOpenChange={setOrderDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="text-xs tracking-wider uppercase font-body font-light rounded-none">
                    <Plus size={14} className="mr-1" /> Create Order
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-card border-border">
                  <DialogHeader>
                    <DialogTitle className="font-heading font-light text-foreground">Create New Order</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-xs tracking-wider uppercase text-muted-foreground font-body font-light">Patient</Label>
                      <Select value={newOrder.user_id} onValueChange={(v) => setNewOrder(p => ({ ...p, user_id: v }))}>
                        <SelectTrigger className="bg-secondary border-border"><SelectValue placeholder="Select patient" /></SelectTrigger>
                        <SelectContent>
                          {patients.map(p => (
                            <SelectItem key={p.user_id} value={p.user_id}>{p.first_name} {p.last_name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label className="text-xs tracking-wider uppercase text-muted-foreground font-body font-light">Status</Label>
                        <Select value={newOrder.status} onValueChange={(v) => setNewOrder(p => ({ ...p, status: v as OrderStatus }))}>
                          <SelectTrigger className="bg-secondary border-border"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {ORDER_STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs tracking-wider uppercase text-muted-foreground font-body font-light">Amount ($)</Label>
                        <Input type="number" value={newOrder.total_amount} onChange={e => setNewOrder(p => ({ ...p, total_amount: e.target.value }))} className="bg-secondary border-border" placeholder="0.00" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs tracking-wider uppercase text-muted-foreground font-body font-light">Tracking Number</Label>
                      <Input value={newOrder.tracking_number} onChange={e => setNewOrder(p => ({ ...p, tracking_number: e.target.value }))} className="bg-secondary border-border" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs tracking-wider uppercase text-muted-foreground font-body font-light">Expected Delivery</Label>
                      <Input type="date" value={newOrder.expected_delivery} onChange={e => setNewOrder(p => ({ ...p, expected_delivery: e.target.value }))} className="bg-secondary border-border" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs tracking-wider uppercase text-muted-foreground font-body font-light">Notes</Label>
                      <Input value={newOrder.notes} onChange={e => setNewOrder(p => ({ ...p, notes: e.target.value }))} className="bg-secondary border-border" />
                    </div>
                    <Button onClick={handleCreateOrder} className="w-full text-xs tracking-wider uppercase font-body font-light rounded-none">Create Order</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="space-y-3">
              {orders.map(o => (
                <Card key={o.id} className="border-border bg-card">
                  <CardContent className="py-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-body font-light text-foreground">{o.patient_name}</span>
                          <Badge variant="outline" className={statusColor[o.status] || ""}>{o.status}</Badge>
                          {o.total_amount > 0 && (
                            <span className="text-xs text-primary font-body font-light">${o.total_amount}</span>
                          )}
                        </div>
                        <div className="flex gap-3 text-xs text-muted-foreground font-body font-light">
                          <span>{new Date(o.created_at).toLocaleDateString()}</span>
                          {o.tracking_number && <span>Track: {o.tracking_number}</span>}
                          {o.expected_delivery && <span>ETA: {new Date(o.expected_delivery).toLocaleDateString()}</span>}
                        </div>
                        {o.notes && <p className="text-xs text-muted-foreground font-body font-light">{o.notes}</p>}
                      </div>
                      <div className="flex items-center gap-2">
                        <Select value={o.status} onValueChange={(v) => handleUpdateOrderStatus(o.id, v as OrderStatus)}>
                          <SelectTrigger className="bg-secondary border-border w-32 h-8 text-xs"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {ORDER_STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                          </SelectContent>
                        </Select>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteOrder(o.id)} className="text-muted-foreground hover:text-destructive h-8 w-8">
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {orders.length === 0 && (
                <Card className="border-border bg-card">
                  <CardContent className="py-10 text-center">
                    <p className="text-sm text-muted-foreground font-body font-light">No orders yet.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* REQUESTS TAB */}
          <TabsContent value="requests" className="space-y-4">
            <h2 className="text-xl font-heading font-light text-foreground">Peptide Requests</h2>

            {peptideRequests.length === 0 ? (
              <Card className="border-border bg-card">
                <CardContent className="py-10 text-center">
                  <p className="text-sm text-muted-foreground font-body font-light">No peptide requests yet.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {peptideRequests.map(r => (
                  <Card key={r.id} className="border-border bg-card">
                    <CardContent className="py-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-body font-light text-foreground">{r.patient_name}</span>
                            <Badge variant="outline" className={
                              r.status === "pending" ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" :
                              r.status === "approved" ? "bg-green-500/20 text-green-400 border-green-500/30" :
                              "bg-destructive/20 text-destructive border-destructive/30"
                            }>{r.status}</Badge>
                            {r.price != null && (
                              <span className="text-xs text-primary font-body font-light">${r.price}</span>
                            )}
                          </div>
                          <p className="text-sm text-foreground/80 font-body font-light">
                            {r.peptide_name}{r.variation_label ? ` — ${r.variation_label}` : ""}
                          </p>
                          <p className="text-xs text-muted-foreground font-body font-light">
                            {new Date(r.created_at).toLocaleDateString()} at {new Date(r.created_at).toLocaleTimeString()}
                          </p>
                          {r.status === "denied" && r.deny_reason && (
                            <p className="text-xs text-destructive font-body font-light mt-1">
                              Reason: {r.deny_reason}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {r.status === "pending" && (
                            <>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleApproveRequest(r.id)}
                                disabled={approvingId === r.id}
                                className="text-green-400 hover:text-green-300 hover:bg-green-500/10 h-8 text-xs tracking-wider uppercase font-body font-light"
                              >
                                {approvingId === r.id ? (
                                  <span className="animate-spin mr-1">⏳</span>
                                ) : (
                                  <CheckCircle size={14} className="mr-1" />
                                )}
                                {approvingId === r.id ? "Approving..." : "Approve"}
                              </Button>
                              <Dialog open={denyDialogOpen === r.id} onOpenChange={(open) => { setDenyDialogOpen(open ? r.id : null); if (!open) setDenyReason(""); }}>
                                <DialogTrigger asChild>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="text-destructive hover:text-destructive/80 hover:bg-destructive/10 h-8 text-xs tracking-wider uppercase font-body font-light"
                                  >
                                    <XCircle size={14} className="mr-1" /> Deny
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="bg-card border-border">
                                  <DialogHeader>
                                    <DialogTitle className="font-heading font-light text-foreground">Deny Request</DialogTitle>
                                  </DialogHeader>
                                  <div className="space-y-4">
                                    <p className="text-sm text-muted-foreground font-body font-light">
                                      Denying <span className="text-foreground">{r.peptide_name}</span> for <span className="text-foreground">{r.patient_name}</span>
                                    </p>
                                    <div className="space-y-2">
                                      <Label className="text-xs tracking-wider uppercase text-muted-foreground font-body font-light">Reason (optional)</Label>
                                      <Textarea
                                        value={denyReason}
                                        onChange={(e) => setDenyReason(e.target.value)}
                                        placeholder="e.g. Lab results required before prescribing..."
                                        className="bg-secondary border-border font-body font-light text-sm"
                                        rows={3}
                                      />
                                    </div>
                                    <Button
                                      onClick={() => handleDenyRequest(r.id)}
                                      variant="destructive"
                                      className="w-full text-xs tracking-wider uppercase font-body font-light rounded-none"
                                    >
                                      Confirm Denial
                                    </Button>
                                  </div>
                                </DialogContent>
                              </Dialog>
                            </>
                          )}
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteRequest(r.id)} className="text-muted-foreground hover:text-destructive h-8 w-8">
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* BIOMARKERS TAB */}
          <TabsContent value="biomarkers" className="space-y-4">
            <AdminBiomarkers patients={patients} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;
