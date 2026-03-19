import { useState, useEffect } from "react";
import { CheckCircle, XCircle, Clock, ChevronDown, ChevronUp, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

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

const STATUS_STYLES = {
  pending: "bg-yellow-500/10 text-yellow-400/80 border-yellow-400/20",
  approved: "bg-green-500/10 text-green-400/80 border-green-400/20",
  denied: "bg-red-500/10 text-red-400/80 border-red-400/20",
};

const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "denied">("pending");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [adminNotes, setAdminNotes] = useState<Record<string, string>>({});

  const fetchOrders = async () => {
    setLoading(true);
    const query = supabase.from("orders").select("*").order("created_at", { ascending: false });
    if (filter !== "all") query.eq("status", filter);
    const { data } = await query;
    if (data) setOrders(data as Order[]);
    setLoading(false);
  };

  useEffect(() => { fetchOrders(); }, [filter]);

  const handleAction = async (orderId: string, status: "approved" | "denied") => {
    setProcessingId(orderId);
    try {
      const { data } = await supabase.functions.invoke("notify-order-status", {
        body: { orderId, status, adminNotes: adminNotes[orderId] || null },
      });
      if (data?.success) {
        await fetchOrders();
        setExpandedId(null);
      } else {
        alert("Something went wrong. Check the edge function logs.");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to process order.");
    }
    setProcessingId(null);
  };

  const pendingCount = orders.filter(o => o.status === "pending").length;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[9px] tracking-[0.25em] uppercase text-muted-foreground/40 font-body font-extralight mb-1">
            Admin
          </p>
          <h2 className="text-lg font-body font-light text-foreground/90">
            Treatment Requests
            {pendingCount > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-yellow-500/10 border border-yellow-400/20 text-yellow-400/80 text-[9px] tracking-[0.1em] uppercase font-body">
                {pendingCount} pending
              </span>
            )}
          </h2>
        </div>
        <button onClick={fetchOrders} className="p-2 border border-border/30 text-muted-foreground/40 hover:text-muted-foreground/80 transition-colors">
          <RefreshCw size={14} />
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2">
        {(["pending", "approved", "denied", "all"] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 text-[9px] tracking-[0.2em] uppercase font-body font-extralight border transition-all ${
              filter === f ? "bg-primary/10 text-primary/80 border-primary/20" : "border-border/40 text-muted-foreground/50 hover:border-border/60"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Orders list */}
      {loading && <p className="text-xs text-muted-foreground/40 font-body py-6 text-center animate-pulse">Loading orders...</p>}

      <div className="space-y-2">
        {orders.map(order => {
          const isExpanded = expandedId === order.id;
          const isProcessing = processingId === order.id;

          return (
            <div key={order.id} className="border border-border/30 bg-card/20">
              {/* Row */}
              <button
                onClick={() => setExpandedId(isExpanded ? null : order.id)}
                className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-card/40 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <p className="text-sm font-body font-light text-foreground/90 truncate">{order.product_name}</p>
                    <span className={`shrink-0 px-2 py-0.5 border text-[8px] tracking-[0.15em] uppercase font-body ${STATUS_STYLES[order.status]}`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="text-[10px] font-body font-extralight text-muted-foreground/50">
                    {order.patient_name} · {order.patient_email} · {new Date(order.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0 ml-4">
                  {order.price && <span className="text-xs font-body text-muted-foreground/40">${order.price.toFixed(2)}</span>}
                  {isExpanded ? <ChevronUp size={14} className="text-muted-foreground/30" /> : <ChevronDown size={14} className="text-muted-foreground/30" />}
                </div>
              </button>

              {/* Expanded detail */}
              {isExpanded && (
                <div className="border-t border-border/20 p-5 space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-xs font-body font-extralight">
                    <div>
                      <p className="text-[9px] tracking-[0.15em] uppercase text-muted-foreground/30 mb-1">Patient</p>
                      <p className="text-foreground/70">{order.patient_name}</p>
                      <p className="text-muted-foreground/50">{order.patient_email}</p>
                      <p className="text-muted-foreground/50">{order.patient_phone}</p>
                    </div>
                    <div>
                      <p className="text-[9px] tracking-[0.15em] uppercase text-muted-foreground/30 mb-1">Product</p>
                      <p className="text-foreground/70">{order.product_name}</p>
                      {order.size && <p className="text-muted-foreground/50">Size: {order.size}</p>}
                      {order.price && <p className="text-primary/60">${order.price.toFixed(2)}</p>}
                    </div>
                  </div>

                  {order.square_payment_link && (
                    <div>
                      <p className="text-[9px] tracking-[0.15em] uppercase text-muted-foreground/30 mb-1">Payment Link</p>
                      <a href={order.square_payment_link} target="_blank" rel="noopener noreferrer" className="text-xs text-primary/60 underline break-all">{order.square_payment_link}</a>
                    </div>
                  )}

                  {order.admin_notes && (
                    <div>
                      <p className="text-[9px] tracking-[0.15em] uppercase text-muted-foreground/30 mb-1">Notes Sent</p>
                      <p className="text-xs text-muted-foreground/60">{order.admin_notes}</p>
                    </div>
                  )}

                  {/* Actions - only for pending */}
                  {order.status === "pending" && (
                    <div className="space-y-3 pt-2 border-t border-border/20">
                      <div>
                        <label className="block text-[9px] tracking-[0.15em] uppercase text-muted-foreground/30 font-body mb-1.5">
                          Notes for patient (optional - sent via SMS)
                        </label>
                        <textarea
                          rows={2}
                          value={adminNotes[order.id] || ""}
                          onChange={e => setAdminNotes(p => ({ ...p, [order.id]: e.target.value }))}
                          placeholder="Reason for denial, dosage instructions, follow-up info..."
                          className="w-full bg-background border border-border/40 px-3 py-2 text-xs font-body font-extralight text-foreground/70 placeholder:text-muted-foreground/30 focus:outline-none focus:border-primary/30 resize-none"
                        />
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleAction(order.id, "approved")}
                          disabled={isProcessing}
                          className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-green-500/10 border border-green-400/20 text-green-400/80 text-xs font-body font-extralight tracking-[0.15em] uppercase hover:bg-green-500/20 transition-colors disabled:opacity-50"
                        >
                          <CheckCircle size={13} />
                          {isProcessing ? "Processing..." : "Approve & Send Payment Link"}
                        </button>
                        <button
                          onClick={() => handleAction(order.id, "denied")}
                          disabled={isProcessing}
                          className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-red-500/10 border border-red-400/20 text-red-400/80 text-xs font-body font-extralight tracking-[0.15em] uppercase hover:bg-red-500/20 transition-colors disabled:opacity-50"
                        >
                          <XCircle size={13} />
                          {isProcessing ? "Processing..." : "Deny"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {!loading && orders.length === 0 && (
          <div className="text-center py-12">
            <Clock size={24} className="text-muted-foreground/20 mx-auto mb-3" strokeWidth={1} />
            <p className="text-xs text-muted-foreground/40 font-body">No {filter !== "all" ? filter : ""} orders.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
