import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import {
  LayoutDashboard, Users, ClipboardList, RefreshCw,
  MessageSquare, Package, ChevronRight, TrendingUp,
  Clock, CheckCircle, XCircle, AlertCircle, Search,
  Phone, Mail, Calendar, DollarSign, Activity,
  Bell, Settings, LogOut, Zap, ChevronDown, ChevronUp,
  Send, Eye, MoreHorizontal
} from "lucide-react";

// ── TYPES ──────────────────────────────────────────────────────────────────

interface Order {
  id: string;
  patient_name: string;
  patient_email: string;
  patient_phone: string;
  product_name: string;
  product_category: string;
  size: string | null;
  price: number | null;
  status: "pending" | "approved" | "denied";
  admin_notes: string | null;
  square_payment_link: string | null;
  created_at: string;
}

interface Patient {
  id: string;
  email: string;
  created_at: string;
  // from orders
  name?: string;
  phone?: string;
  orderCount?: number;
  lastOrder?: string;
  totalSpent?: number;
}

type NavItem = "dashboard" | "orders" | "patients" | "sms" | "settings";

// ── STAT CARD ───────────────────────────────────────────────────────────────

const StatCard = ({ label, value, sub, icon: Icon, accent }: {
  label: string; value: string | number; sub?: string;
  icon: any; accent: string;
}) => (
  <div className="relative overflow-hidden border border-white/5 bg-white/[0.02] p-5 group hover:border-white/10 transition-all duration-300">
    <div className={`absolute top-0 left-0 w-1 h-full ${accent}`} />
    <div className="flex items-start justify-between mb-4">
      <div className={`p-2 rounded-sm ${accent.replace('bg-', 'bg-').replace('-500', '-500/10')}`}>
        <Icon size={14} className={accent.replace('bg-', 'text-').replace('/50', '')} strokeWidth={1.5} />
      </div>
      <TrendingUp size={12} className="text-white/10 group-hover:text-white/20 transition-colors" />
    </div>
    <p className="text-2xl font-light text-white/90 tracking-tight mb-0.5">{value}</p>
    <p className="text-[10px] tracking-[0.2em] uppercase text-white/30 font-light">{label}</p>
    {sub && <p className="text-[10px] text-white/20 mt-1">{sub}</p>}
  </div>
);

// ── ORDER ROW ───────────────────────────────────────────────────────────────

const OrderRow = ({ order, onAction }: { order: Order; onAction: (id: string, status: "approved" | "denied", notes: string) => void }) => {
  const [expanded, setExpanded] = useState(false);
  const [notes, setNotes] = useState("");
  const [processing, setProcessing] = useState(false);

  const statusConfig = {
    pending: { color: "text-amber-400", bg: "bg-amber-400/10 border-amber-400/20", dot: "bg-amber-400" },
    approved: { color: "text-emerald-400", bg: "bg-emerald-400/10 border-emerald-400/20", dot: "bg-emerald-400" },
    denied: { color: "text-red-400", bg: "bg-red-400/10 border-red-400/20", dot: "bg-red-400" },
  }[order.status];

  const handle = async (status: "approved" | "denied") => {
    setProcessing(true);
    await onAction(order.id, status, notes);
    setProcessing(false);
    setExpanded(false);
  };

  return (
    <div className="border-b border-white/5 last:border-0">
      <div
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-4 px-5 py-3.5 hover:bg-white/[0.02] cursor-pointer transition-colors group"
      >
        <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${statusConfig.dot}`} />
        <div className="flex-1 min-w-0">
          <p className="text-xs text-white/80 font-light truncate">{order.product_name}</p>
          <p className="text-[10px] text-white/30 mt-0.5">{order.patient_name} · {new Date(order.created_at).toLocaleDateString()}</p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          {order.price && <span className="text-[10px] text-white/30">${order.price.toFixed(2)}</span>}
          <span className={`px-2 py-0.5 rounded-sm border text-[9px] tracking-[0.12em] uppercase ${statusConfig.bg} ${statusConfig.color}`}>
            {order.status}
          </span>
          {expanded ? <ChevronUp size={12} className="text-white/20" /> : <ChevronDown size={12} className="text-white/20" />}
        </div>
      </div>

      {expanded && (
        <div className="px-5 pb-4 pt-1 bg-white/[0.015] border-t border-white/5">
          <div className="grid grid-cols-3 gap-4 mb-4 text-[10px]">
            <div>
              <p className="text-white/25 uppercase tracking-[0.15em] mb-1">Patient</p>
              <p className="text-white/60">{order.patient_name}</p>
              <p className="text-white/40">{order.patient_email}</p>
              <p className="text-white/40">{order.patient_phone}</p>
            </div>
            <div>
              <p className="text-white/25 uppercase tracking-[0.15em] mb-1">Product</p>
              <p className="text-white/60">{order.product_name}</p>
              {order.size && <p className="text-white/40">{order.size}</p>}
              {order.price && <p className="text-cyan-400/70">${order.price.toFixed(2)}</p>}
            </div>
            <div>
              <p className="text-white/25 uppercase tracking-[0.15em] mb-1">Submitted</p>
              <p className="text-white/60">{new Date(order.created_at).toLocaleString()}</p>
              {order.square_payment_link && (
                <a href={order.square_payment_link} target="_blank" rel="noopener noreferrer"
                  className="text-cyan-400/60 underline mt-1 block truncate">Payment link</a>
              )}
            </div>
          </div>

          {order.status === "pending" && (
            <div className="space-y-3">
              <textarea
                rows={2}
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Notes for patient (sent via SMS on approval/denial)..."
                className="w-full bg-black/30 border border-white/10 px-3 py-2 text-[11px] text-white/60 placeholder:text-white/15 focus:outline-none focus:border-white/20 resize-none font-light"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => handle("approved")}
                  disabled={processing}
                  className="flex-1 flex items-center justify-center gap-2 py-2 bg-emerald-500/10 border border-emerald-400/20 text-emerald-400/80 text-[10px] tracking-[0.15em] uppercase hover:bg-emerald-500/20 transition-colors disabled:opacity-40"
                >
                  <CheckCircle size={12} />
                  {processing ? "Processing..." : "Approve + Send Payment"}
                </button>
                <button
                  onClick={() => handle("denied")}
                  disabled={processing}
                  className="flex-1 flex items-center justify-center gap-2 py-2 bg-red-500/10 border border-red-400/20 text-red-400/80 text-[10px] tracking-[0.15em] uppercase hover:bg-red-500/20 transition-colors disabled:opacity-40"
                >
                  <XCircle size={12} />
                  Deny
                </button>
              </div>
            </div>
          )}
          {order.admin_notes && order.status !== "pending" && (
            <div className="mt-2 p-2 bg-white/5 border border-white/5">
              <p className="text-[9px] text-white/25 uppercase tracking-[0.15em] mb-1">Notes Sent</p>
              <p className="text-[11px] text-white/50">{order.admin_notes}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ── PATIENT ROW ─────────────────────────────────────────────────────────────

const PatientRow = ({ patient, onSMS }: { patient: Patient; onSMS: (p: Patient) => void }) => (
  <div className="flex items-center gap-4 px-5 py-3.5 border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors group">
    <div className="w-7 h-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
      <span className="text-[10px] text-white/40 font-light">
        {(patient.name || patient.email).charAt(0).toUpperCase()}
      </span>
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-xs text-white/70 font-light truncate">{patient.name || "—"}</p>
      <p className="text-[10px] text-white/30 truncate">{patient.email}</p>
    </div>
    <div className="hidden md:flex items-center gap-6 text-[10px] text-white/25 shrink-0">
      <span>{patient.phone || "—"}</span>
      <span>{patient.orderCount || 0} orders</span>
      {patient.totalSpent ? <span className="text-cyan-400/50">${patient.totalSpent.toFixed(0)}</span> : <span>$0</span>}
      <span>{patient.lastOrder ? new Date(patient.lastOrder).toLocaleDateString() : "—"}</span>
    </div>
    <button
      onClick={() => onSMS(patient)}
      className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 border border-white/10 text-white/30 hover:text-white/60 hover:border-white/20"
    >
      <MessageSquare size={11} />
    </button>
  </div>
);

// ── SMS COMPOSER ─────────────────────────────────────────────────────────────

const SMSComposer = ({ target, onClose }: { target: Patient | null; onClose: () => void }) => {
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const send = async () => {
    if (!message.trim() || !target?.phone) return;
    setSending(true);
    const { error } = await supabase.functions.invoke("send-sms", {
      body: { to: target.phone, body: `Premier Vitality & Wellness: ${message} Reply STOP to opt out.` }
    });
    setSending(false);
    if (!error) { setSent(true); setTimeout(() => { setSent(false); onClose(); }, 1500); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-[#0a0a0a] border border-white/10">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
          <div>
            <p className="text-[9px] tracking-[0.25em] uppercase text-white/25 mb-0.5">Manual SMS</p>
            <p className="text-sm text-white/70 font-light">{target?.name || target?.email}</p>
          </div>
          <button onClick={onClose} className="text-white/20 hover:text-white/50 text-xs">✕</button>
        </div>
        <div className="p-5 space-y-4">
          <div className="text-[10px] text-white/30 font-mono bg-black/30 px-3 py-2 border border-white/5">
            To: {target?.phone || "No phone on file"}
          </div>
          <div>
            <p className="text-[9px] tracking-[0.15em] uppercase text-white/25 mb-1.5">Your message</p>
            <textarea
              rows={4}
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="w-full bg-black/30 border border-white/10 px-3 py-2.5 text-xs text-white/60 placeholder:text-white/15 focus:outline-none focus:border-white/20 resize-none"
            />
            <p className="text-[9px] text-white/15 mt-1">
              Will send as: "Premier Vitality &amp; Wellness: {message || "..."} Reply STOP to opt out."
            </p>
          </div>
          {sent ? (
            <div className="flex items-center gap-2 text-emerald-400/70 text-xs">
              <CheckCircle size={12} /> Sent successfully
            </div>
          ) : (
            <button
              onClick={send}
              disabled={sending || !message.trim() || !target?.phone}
              className="w-full py-2.5 bg-cyan-500/10 border border-cyan-400/20 text-cyan-400/80 text-[10px] tracking-[0.2em] uppercase hover:bg-cyan-500/20 transition-colors disabled:opacity-30 flex items-center justify-center gap-2"
            >
              <Send size={11} />
              {sending ? "Sending..." : "Send SMS"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// ── MAIN ADMIN PANEL ────────────────────────────────────────────────────────

const ADMIN_USER_ID = "4b63e9d9-1cf9-49a1-9427-89e4035f8115";

const AdminPanel = () => {
  const navigate = useNavigate();
  const [authChecked, setAuthChecked] = useState(false);
  const [nav, setNav] = useState<NavItem>("dashboard");
  const [orders, setOrders] = useState<Order[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [orderFilter, setOrderFilter] = useState<"all" | "pending" | "approved" | "denied">("pending");
  const [patientSearch, setPatientSearch] = useState("");
  const [smsTarget, setSmsTarget] = useState<Patient | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate("/auth"); return; }
      if (user.id === ADMIN_USER_ID) { setAuthChecked(true); return; }
      const { data: isAdmin } = await supabase.rpc("has_role", { _user_id: user.id, _role: "admin" });
      if (isAdmin) { setAuthChecked(true); } else { navigate("/portal"); }
    };
    checkAuth();
  }, [navigate]);

  const fetchData = async () => {
    setRefreshing(true);
    // Orders
    const { data: orderData } = await supabase
      .from("orders").select("*").order("created_at", { ascending: false });
    if (orderData) setOrders(orderData as Order[]);

    // Patients from auth — use orders to build roster
    const { data: allOrders } = await supabase
      .from("orders").select("patient_id, patient_name, patient_email, patient_phone, price, created_at")
      .order("created_at", { ascending: false });

    if (allOrders) {
      const patientMap = new Map<string, Patient>();
      for (const o of allOrders) {
        if (!o.patient_id) continue;
        if (!patientMap.has(o.patient_id)) {
          patientMap.set(o.patient_id, {
            id: o.patient_id,
            email: o.patient_email,
            name: o.patient_name,
            phone: o.patient_phone,
            created_at: o.created_at,
            orderCount: 0,
            totalSpent: 0,
            lastOrder: o.created_at,
          });
        }
        const p = patientMap.get(o.patient_id)!;
        p.orderCount = (p.orderCount || 0) + 1;
        p.totalSpent = (p.totalSpent || 0) + (o.price || 0);
        if (o.created_at > (p.lastOrder || "")) p.lastOrder = o.created_at;
      }
      setPatients(Array.from(patientMap.values()));
    }

    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleOrderAction = async (orderId: string, status: "approved" | "denied", notes: string) => {
    await supabase.functions.invoke("notify-order-status", {
      body: { orderId, status, adminNotes: notes || null }
    });
    await fetchData();
  };

  // Stats
  const pendingCount = orders.filter(o => o.status === "pending").length;
  const approvedCount = orders.filter(o => o.status === "approved").length;
  const totalRevenue = orders.filter(o => o.status === "approved").reduce((s, o) => s + (o.price || 0), 0);
  const thisMonthOrders = orders.filter(o => new Date(o.created_at).getMonth() === new Date().getMonth()).length;

  const filteredOrders = orders.filter(o => orderFilter === "all" || o.status === orderFilter);
  const filteredPatients = patients.filter(p =>
    !patientSearch || p.name?.toLowerCase().includes(patientSearch.toLowerCase()) ||
    p.email.toLowerCase().includes(patientSearch.toLowerCase()) ||
    p.phone?.includes(patientSearch)
  );

  const navItems = [
    { id: "dashboard" as NavItem, label: "Dashboard", icon: LayoutDashboard },
    { id: "orders" as NavItem, label: "Requests", icon: ClipboardList, badge: pendingCount },
    { id: "patients" as NavItem, label: "Patients", icon: Users },
    { id: "sms" as NavItem, label: "SMS Center", icon: MessageSquare },
    { id: "settings" as NavItem, label: "Settings", icon: Settings },
  ];

  if (!authChecked) return null;

  return (
    <div className="flex h-screen bg-[#050505] text-white overflow-hidden font-body">

      {/* ── SIDEBAR ── */}
      <aside className="w-56 shrink-0 border-r border-white/5 flex flex-col">
        {/* Logo */}
        <div className="px-5 py-5 border-b border-white/5">
          <p className="text-[9px] tracking-[0.35em] uppercase text-white/25 mb-0.5">Premier Vitality</p>
          <p className="text-xs font-light text-white/60">Admin Console</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-3 space-y-0.5">
          {navItems.map(item => {
            const Icon = item.icon;
            const active = nav === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setNav(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-sm text-left transition-all duration-200 group ${
                  active ? "bg-white/5 text-white/80" : "text-white/30 hover:text-white/50 hover:bg-white/[0.02]"
                }`}
              >
                <Icon size={14} strokeWidth={1.5} className={active ? "text-cyan-400/70" : ""} />
                <span className="text-[11px] font-light tracking-wide flex-1">{item.label}</span>
                {item.badge ? (
                  <span className="px-1.5 py-0.5 rounded-sm bg-amber-400/15 text-amber-400/80 text-[9px] font-light">
                    {item.badge}
                  </span>
                ) : null}
                {active && <ChevronRight size={10} className="text-white/20" />}
              </button>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="px-3 py-4 border-t border-white/5">
          <button
            onClick={fetchData}
            disabled={refreshing}
            className="w-full flex items-center gap-2 px-3 py-2 text-white/20 hover:text-white/40 transition-colors"
          >
            <RefreshCw size={12} className={refreshing ? "animate-spin" : ""} />
            <span className="text-[10px]">{refreshing ? "Refreshing..." : "Refresh"}</span>
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <main className="flex-1 overflow-y-auto">

        {/* ── DASHBOARD ── */}
        {nav === "dashboard" && (
          <div className="p-8">
            <div className="mb-8">
              <p className="text-[9px] tracking-[0.3em] uppercase text-white/20 mb-1">
                {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
              </p>
              <h1 className="text-2xl font-extralight text-white/80">Good morning, Dr. Loo</h1>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
              <StatCard label="Pending Review" value={pendingCount} icon={Clock} accent="bg-amber-500/50" sub="Awaiting physician" />
              <StatCard label="Approved" value={approvedCount} icon={CheckCircle} accent="bg-emerald-500/50" sub="All time" />
              <StatCard label="Total Revenue" value={`$${totalRevenue.toFixed(0)}`} icon={DollarSign} accent="bg-cyan-500/50" sub="Approved orders" />
              <StatCard label="This Month" value={thisMonthOrders} icon={Activity} accent="bg-violet-500/50" sub="New requests" />
            </div>

            {/* Pending orders quick view */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="border border-white/5 bg-white/[0.01]">
                <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
                  <p className="text-xs font-light text-white/50 tracking-wide">Pending Requests</p>
                  <button onClick={() => setNav("orders")} className="text-[9px] text-cyan-400/50 hover:text-cyan-400/80 tracking-[0.15em] uppercase transition-colors">
                    View all →
                  </button>
                </div>
                {orders.filter(o => o.status === "pending").slice(0, 5).map(o => (
                  <div key={o.id} className="flex items-center gap-3 px-5 py-3 border-b border-white/[0.03] last:border-0">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] text-white/60 truncate">{o.product_name}</p>
                      <p className="text-[9px] text-white/25">{o.patient_name}</p>
                    </div>
                    <span className="text-[9px] text-white/20">{new Date(o.created_at).toLocaleDateString()}</span>
                  </div>
                ))}
                {orders.filter(o => o.status === "pending").length === 0 && (
                  <div className="py-8 text-center">
                    <p className="text-[10px] text-white/15">No pending requests</p>
                  </div>
                )}
              </div>

              <div className="border border-white/5 bg-white/[0.01]">
                <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
                  <p className="text-xs font-light text-white/50 tracking-wide">Recent Patients</p>
                  <button onClick={() => setNav("patients")} className="text-[9px] text-cyan-400/50 hover:text-cyan-400/80 tracking-[0.15em] uppercase transition-colors">
                    View all →
                  </button>
                </div>
                {patients.slice(0, 5).map(p => (
                  <div key={p.id} className="flex items-center gap-3 px-5 py-3 border-b border-white/[0.03] last:border-0">
                    <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                      <span className="text-[9px] text-white/30">{(p.name || p.email).charAt(0).toUpperCase()}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] text-white/60 truncate">{p.name || p.email}</p>
                      <p className="text-[9px] text-white/25">{p.orderCount} orders</p>
                    </div>
                    <span className="text-[9px] text-cyan-400/40">${(p.totalSpent || 0).toFixed(0)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── ORDERS ── */}
        {nav === "orders" && (
          <div className="p-8">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-[9px] tracking-[0.3em] uppercase text-white/20 mb-1">Treatment</p>
                <h2 className="text-xl font-extralight text-white/80">Requests</h2>
              </div>
              <div className="flex gap-1.5">
                {(["pending", "approved", "denied", "all"] as const).map(f => (
                  <button
                    key={f}
                    onClick={() => setOrderFilter(f)}
                    className={`px-3 py-1.5 text-[9px] tracking-[0.15em] uppercase border transition-all ${
                      orderFilter === f ? "border-cyan-400/30 bg-cyan-400/10 text-cyan-400/80" : "border-white/5 text-white/20 hover:border-white/10 hover:text-white/40"
                    }`}
                  >
                    {f}{f === "pending" && pendingCount > 0 && ` (${pendingCount})`}
                  </button>
                ))}
              </div>
            </div>
            <div className="border border-white/5 bg-white/[0.01]">
              {filteredOrders.length === 0 && !loading && (
                <div className="py-16 text-center">
                  <Clock size={20} className="text-white/10 mx-auto mb-3" strokeWidth={1} />
                  <p className="text-[10px] text-white/15">No {orderFilter !== "all" ? orderFilter : ""} requests</p>
                </div>
              )}
              {filteredOrders.map(o => (
                <OrderRow key={o.id} order={o} onAction={handleOrderAction} />
              ))}
            </div>
          </div>
        )}

        {/* ── PATIENTS ── */}
        {nav === "patients" && (
          <div className="p-8">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-[9px] tracking-[0.3em] uppercase text-white/20 mb-1">Roster</p>
                <h2 className="text-xl font-extralight text-white/80">Patients <span className="text-white/20 text-sm">({patients.length})</span></h2>
              </div>
              <div className="relative">
                <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" />
                <input
                  value={patientSearch}
                  onChange={e => setPatientSearch(e.target.value)}
                  placeholder="Search patients..."
                  className="pl-8 pr-4 py-2 bg-white/[0.03] border border-white/5 text-[11px] text-white/50 placeholder:text-white/15 focus:outline-none focus:border-white/10 w-52"
                />
              </div>
            </div>
            <div className="border border-white/5 bg-white/[0.01]">
              <div className="grid grid-cols-5 px-5 py-2.5 border-b border-white/5 text-[9px] tracking-[0.15em] uppercase text-white/20">
                <span className="col-span-1">Name</span>
                <span className="hidden md:block">Phone</span>
                <span className="hidden md:block">Orders</span>
                <span className="hidden md:block">Revenue</span>
                <span className="hidden md:block">Last Order</span>
              </div>
              {filteredPatients.length === 0 && (
                <div className="py-16 text-center">
                  <Users size={20} className="text-white/10 mx-auto mb-3" strokeWidth={1} />
                  <p className="text-[10px] text-white/15">No patients yet</p>
                </div>
              )}
              {filteredPatients.map(p => (
                <PatientRow key={p.id} patient={p} onSMS={setSmsTarget} />
              ))}
            </div>
          </div>
        )}

        {/* ── SMS CENTER ── */}
        {nav === "sms" && (
          <div className="p-8">
            <div className="mb-6">
              <p className="text-[9px] tracking-[0.3em] uppercase text-white/20 mb-1">Communications</p>
              <h2 className="text-xl font-extralight text-white/80">SMS Center</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Manual blast */}
              <div className="border border-white/5 bg-white/[0.01] p-6">
                <p className="text-xs text-white/40 font-light mb-1">Broadcast Message</p>
                <p className="text-[10px] text-white/20 mb-5">Send to all patients or a filtered group</p>
                <div className="space-y-3">
                  <div>
                    <p className="text-[9px] tracking-[0.15em] uppercase text-white/20 mb-1.5">Recipients</p>
                    <select className="w-full bg-black/30 border border-white/10 px-3 py-2 text-[11px] text-white/50 focus:outline-none">
                      <option>All patients ({patients.length})</option>
                      <option>Patients with pending orders</option>
                      <option>Patients with approved orders</option>
                    </select>
                  </div>
                  <div>
                    <p className="text-[9px] tracking-[0.15em] uppercase text-white/20 mb-1.5">Message</p>
                    <textarea
                      rows={4}
                      placeholder="Your message to patients..."
                      className="w-full bg-black/30 border border-white/10 px-3 py-2.5 text-[11px] text-white/50 placeholder:text-white/15 focus:outline-none focus:border-white/15 resize-none"
                    />
                  </div>
                  <button className="w-full py-2.5 bg-cyan-500/10 border border-cyan-400/20 text-cyan-400/70 text-[10px] tracking-[0.2em] uppercase hover:bg-cyan-500/20 transition-colors flex items-center justify-center gap-2">
                    <Send size={11} /> Send Broadcast
                  </button>
                </div>
              </div>

              {/* Refill automation info */}
              <div className="border border-white/5 bg-white/[0.01] p-6">
                <div className="flex items-center gap-2 mb-1">
                  <Zap size={12} className="text-cyan-400/60" strokeWidth={1.5} />
                  <p className="text-xs text-white/40 font-light">Automated Refill Reminders</p>
                </div>
                <p className="text-[10px] text-white/20 mb-5">Auto-triggers when patient supply runs low</p>
                <div className="space-y-3">
                  <div className="p-3 bg-amber-400/5 border border-amber-400/10">
                    <p className="text-[9px] text-amber-400/60 uppercase tracking-[0.15em] mb-1">Status</p>
                    <p className="text-[11px] text-white/40">Pending Twilio A2P campaign approval</p>
                  </div>
                  <div className="space-y-2 text-[10px] text-white/30">
                    <p>Once approved, the system will:</p>
                    <p className="pl-3 border-l border-white/10">→ Check daily for patients with &lt;10 days supply</p>
                    <p className="pl-3 border-l border-white/10">→ Send "Reply Y to reorder, N to skip"</p>
                    <p className="pl-3 border-l border-white/10">→ Auto-create order on YES reply</p>
                    <p className="pl-3 border-l border-white/10">→ Send Square payment link immediately</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Patient SMS quick-send list */}
            <div className="mt-6 border border-white/5 bg-white/[0.01]">
              <div className="px-5 py-4 border-b border-white/5">
                <p className="text-xs text-white/40 font-light">Quick Send — Individual Patient</p>
              </div>
              {patients.slice(0, 10).map(p => (
                <div key={p.id} className="flex items-center justify-between px-5 py-3 border-b border-white/[0.03] last:border-0">
                  <div>
                    <p className="text-[11px] text-white/50">{p.name || p.email}</p>
                    <p className="text-[9px] text-white/25">{p.phone || "No phone"}</p>
                  </div>
                  <button
                    onClick={() => setSmsTarget(p)}
                    disabled={!p.phone}
                    className="px-3 py-1.5 border border-white/10 text-[9px] text-white/30 hover:text-white/60 hover:border-white/20 transition-colors disabled:opacity-20 disabled:cursor-not-allowed flex items-center gap-1.5"
                  >
                    <MessageSquare size={10} /> Send SMS
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── SETTINGS ── */}
        {nav === "settings" && (
          <div className="p-8">
            <div className="mb-6">
              <p className="text-[9px] tracking-[0.3em] uppercase text-white/20 mb-1">Configuration</p>
              <h2 className="text-xl font-extralight text-white/80">Settings</h2>
            </div>
            <div className="max-w-lg space-y-4">
              {[
                { label: "Twilio Status", value: "Pending A2P approval", status: "warning" },
                { label: "Square Integration", value: "Connected", status: "ok" },
                { label: "Supabase Edge Functions", value: "notify-order-status deployed", status: "ok" },
                { label: "SMS Webhook", value: "handle-sms-reply (pending build)", status: "warning" },
                { label: "Refill Automation", value: "Requires A2P approval + cron setup", status: "warning" },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between px-5 py-4 border border-white/5 bg-white/[0.01]">
                  <p className="text-[11px] text-white/40">{item.label}</p>
                  <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${item.status === "ok" ? "bg-emerald-400" : "bg-amber-400"}`} />
                    <p className="text-[10px] text-white/25">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* SMS Composer overlay */}
      {smsTarget && <SMSComposer target={smsTarget} onClose={() => setSmsTarget(null)} />}
    </div>
  );
};

export default AdminPanel;
