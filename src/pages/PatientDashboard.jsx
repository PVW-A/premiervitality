import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

// ── SVG PRODUCT IMAGES ────────────────────────────────────────────────────────

const VialSVG = ({ label }) => (
  <svg viewBox="0 0 160 220" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
    <defs>
      <linearGradient id={`vialGrad-${label}`} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#2a2a2a" />
        <stop offset="40%" stopColor="#4a4a4a" />
        <stop offset="100%" stopColor="#1a1a1a" />
      </linearGradient>
      <linearGradient id={`capGrad-${label}`} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#111" />
        <stop offset="50%" stopColor="#333" />
        <stop offset="100%" stopColor="#111" />
      </linearGradient>
    </defs>
    <rect x="42" y="18" width="76" height="38" rx="6" fill={`url(#capGrad-${label})`} />
    <rect x="48" y="14" width="64" height="12" rx="4" fill="#222" />
    <rect x="52" y="56" width="56" height="10" fill="#222" />
    <rect x="28" y="66" width="104" height="130" rx="4" fill={`url(#vialGrad-${label})`} />
    <rect x="36" y="72" width="10" height="118" rx="5" fill="white" fillOpacity="0.06" />
    <rect x="38" y="86" width="84" height="90" rx="2" fill="white" fillOpacity="0.04" />
    <text x="80" y="112" textAnchor="middle" fill="white" fillOpacity="0.9" fontSize="9" fontFamily="'Helvetica Neue', sans-serif" fontWeight="300" letterSpacing="2">PREMIER</text>
    <text x="80" y="126" textAnchor="middle" fill="white" fillOpacity="0.9" fontSize="9" fontFamily="'Helvetica Neue', sans-serif" fontWeight="300" letterSpacing="2">VITALITY</text>
    <rect x="50" y="132" width="60" height="0.5" fill="white" fillOpacity="0.3" />
    <text x="80" y="148" textAnchor="middle" fill="white" fillOpacity="0.6" fontSize="7" fontFamily="'Helvetica Neue', sans-serif" fontWeight="300" letterSpacing="3">{label.toUpperCase()}</text>
    <text x="80" y="162" textAnchor="middle" fill="white" fillOpacity="0.35" fontSize="6" fontFamily="'Helvetica Neue', sans-serif" letterSpacing="1">[INJECTABLE]</text>
  </svg>
);

const CapsuleSVG = ({ label }) => (
  <svg viewBox="0 0 160 220" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
    <defs>
      <linearGradient id={`jarGrad-${label}`} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#1e1a10" />
        <stop offset="40%" stopColor="#3d3420" />
        <stop offset="100%" stopColor="#1e1a10" />
      </linearGradient>
      <linearGradient id={`lidGrad-${label}`} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#111" />
        <stop offset="50%" stopColor="#2a2a2a" />
        <stop offset="100%" stopColor="#111" />
      </linearGradient>
    </defs>
    <rect x="28" y="22" width="104" height="28" rx="4" fill={`url(#lidGrad-${label})`} />
    <ellipse cx="80" cy="22" rx="52" ry="8" fill="#1a1a1a" />
    <rect x="22" y="48" width="116" height="140" rx="6" fill={`url(#jarGrad-${label})`} />
    <ellipse cx="80" cy="48" rx="58" ry="10" fill="#2a2210" />
    <rect x="32" y="56" width="10" height="124" rx="5" fill="white" fillOpacity="0.05" />
    <rect x="36" y="72" width="88" height="88" rx="2" fill="white" fillOpacity="0.03" />
    <text x="80" y="102" textAnchor="middle" fill="white" fillOpacity="0.9" fontSize="9" fontFamily="'Helvetica Neue', sans-serif" fontWeight="300" letterSpacing="2">PREMIER</text>
    <text x="80" y="116" textAnchor="middle" fill="white" fillOpacity="0.9" fontSize="9" fontFamily="'Helvetica Neue', sans-serif" fontWeight="300" letterSpacing="2">VITALITY</text>
    <rect x="50" y="122" width="60" height="0.5" fill="white" fillOpacity="0.3" />
    <text x="80" y="138" textAnchor="middle" fill="white" fillOpacity="0.6" fontSize="7" fontFamily="'Helvetica Neue', sans-serif" fontWeight="300" letterSpacing="3">{label.toUpperCase()}</text>
    <text x="80" y="152" textAnchor="middle" fill="white" fillOpacity="0.35" fontSize="6" fontFamily="'Helvetica Neue', sans-serif" letterSpacing="1">[CAPSULES]</text>
    <ellipse cx="62" cy="170" rx="10" ry="5" fill="#8B6914" fillOpacity="0.7" />
    <ellipse cx="82" cy="174" rx="10" ry="5" fill="#8B6914" fillOpacity="0.6" />
    <ellipse cx="100" cy="169" rx="10" ry="5" fill="#8B6914" fillOpacity="0.7" />
  </svg>
);

// ── BADGE / STATUS CONFIG ─────────────────────────────────────────────────────

const statusStyle = {
  active:  { dot: "#4ade80", label: "Active" },
  pending: { dot: "#facc15", label: "Pending" },
  paused:  { dot: "#6b7280", label: "Paused" },
  approved: { dot: "#4ade80", label: "Active" },
  denied:  { dot: "#f87171", label: "Denied" },
};

const badgeStyle = {
  "Active Rx":    { bg: "rgba(74,222,128,0.12)",  color: "#4ade80", border: "rgba(74,222,128,0.25)" },
  "Lab Required": { bg: "rgba(250,204,21,0.1)",   color: "#facc15", border: "rgba(250,204,21,0.25)" },
  "Paused":       { bg: "rgba(107,114,128,0.12)", color: "#9ca3af", border: "rgba(107,114,128,0.25)" },
};

// Derive badge + type from order data
function deriveBadge(order) {
  if (order.status === "approved") return "Active Rx";
  if (order.status === "pending")  return "Lab Required";
  if (order.status === "denied")   return null;
  return null;
}

function deriveType(productName = "") {
  const oral = ["enclomiphene", "dhea", "methylene blue", "finasteride", "minoxidil", "mk-677"];
  return oral.some(n => productName.toLowerCase().includes(n)) ? "capsule" : "vial";
}

// ── MAIN COMPONENT ────────────────────────────────────────────────────────────

export default function PatientDashboard() {
  const navigate = useNavigate();
  const [user, setUser]               = useState(null);
  const [profile, setProfile]         = useState(null);
  const [activeTab, setActiveTab]     = useState("treatments");
  const [treatFilter, setTreatFilter] = useState("All");
  const [orders, setOrders]           = useState([]);
  const [labs, setLabs]               = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading]         = useState(true);

  // ── Auth guard ──────────────────────────────────────────────────────────────
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user: u } }) => {
      if (!u) { navigate("/auth"); return; }
      setUser(u);
      loadData(u);
    });
  }, []);

  const loadData = async (u) => {
    // Fetch orders (treatment cards)
    const { data: orderData } = await supabase
      .from("orders")
      .select("*")
      .eq("patient_id", u.id)
      .order("created_at", { ascending: false });

    // Fetch biomarker results (labs)
    const { data: labData } = await supabase
      .from("biomarker_results")
      .select("id, marker_name, tested_at, status, result_value, unit")
      .eq("user_id", u.id)
      .order("tested_at", { ascending: false });

    // Fetch appointments / calendly bookings if table exists
    const { data: apptData } = await supabase
      .from("appointments")
      .select("*")
      .eq("user_id", u.id)
      .gte("scheduled_at", new Date().toISOString())
      .order("scheduled_at", { ascending: true })
      .limit(5);

    // Fetch profile for display name
    const { data: profileData } = await supabase
      .from("profiles")
      .select("first_name, last_name, created_at")
      .eq("user_id", u.id)
      .single();

    setOrders(orderData || []);
    setLabs(labData || []);
    setAppointments(apptData || []);
    setProfile(profileData || null);
    setLoading(false);
  };

  // ── Derived stats ───────────────────────────────────────────────────────────
  const activeCount   = orders.filter(o => o.status === "approved").length;
  const pendingLabs   = labs.filter(l => l.status === "pending").length;
  const nextAppt      = appointments[0];
  const memberSince   = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString("en-US", { month: "short", year: "numeric" })
    : user?.created_at
    ? new Date(user.created_at).toLocaleDateString("en-US", { month: "short", year: "numeric" })
    : "—";

  const firstName = profile?.first_name
    || user?.user_metadata?.first_name
    || user?.email?.split("@")[0]
    || "there";

  const initials = [profile?.first_name, profile?.last_name]
    .filter(Boolean).map(n => n[0].toUpperCase()).join("")
    || (user?.email?.[0]?.toUpperCase() ?? "?");

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  // ── Filtered treatments ─────────────────────────────────────────────────────
  const filteredOrders = orders.filter(o => {
    if (treatFilter === "All")     return true;
    if (treatFilter === "Active")  return o.status === "approved";
    if (treatFilter === "Pending") return o.status === "pending";
    if (treatFilter === "Denied")  return o.status === "denied";
    return true;
  });

  const refillsDue = orders.filter(o => o.status === "approved").length;

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  if (loading) {
    return (
      <div style={{
        minHeight: "100vh", background: "#0d0d0d", display: "flex",
        alignItems: "center", justifyContent: "center",
        fontFamily: "'Helvetica Neue', sans-serif", color: "rgba(255,255,255,0.2)",
        fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase",
      }}>
        Loading
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0d0d0d",
      color: "white",
      fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
      fontWeight: 300,
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #111; }
        ::-webkit-scrollbar-thumb { background: #333; border-radius: 2px; }
        .card-hover { transition: transform 0.3s ease, border-color 0.3s ease; }
        .card-hover:hover { transform: translateY(-3px); border-color: rgba(255,255,255,0.15) !important; }
        .refill-btn { transition: all 0.2s ease; cursor: pointer; border: 1px solid rgba(255,255,255,0.2); background: transparent; color: rgba(255,255,255,0.7); padding: 6px 14px; font-size: 9px; letter-spacing: 0.12em; text-transform: uppercase; font-family: 'Helvetica Neue', sans-serif; }
        .refill-btn:hover { background: white !important; color: black !important; }
        .nav-link { transition: color 0.2s ease; cursor: pointer; }
        .nav-link:hover { color: white !important; }
        .filter-btn { transition: all 0.2s ease; cursor: pointer; font-family: 'Helvetica Neue', sans-serif; }
        .sign-out-btn { background: transparent; border: none; cursor: pointer; font-family: 'Helvetica Neue', sans-serif; transition: color 0.2s ease; }
        .sign-out-btn:hover { color: white !important; }
      `}</style>

      {/* ── TOP NAV ───────────────────────────────────────────────────────────── */}
      <nav style={{
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        padding: "0 32px",
        height: "64px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        background: "#0d0d0d",
        zIndex: 100,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "48px" }}>
          <div style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "17px",
            fontWeight: 400,
            letterSpacing: "0.05em",
            cursor: "pointer",
          }} onClick={() => navigate("/")}>
            Premier Vitality
          </div>
          <div style={{ display: "flex", gap: "32px" }}>
            {["Treatments", "Lab Results", "Appointments", "Messages"].map(item => (
              <span
                key={item}
                className="nav-link"
                onClick={() => setActiveTab(item.toLowerCase())}
                style={{
                  fontSize: "11px",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: activeTab === item.toLowerCase() ? "white" : "rgba(255,255,255,0.4)",
                  borderBottom: activeTab === item.toLowerCase() ? "1px solid white" : "1px solid transparent",
                  paddingBottom: "2px",
                }}
              >
                {item}
              </span>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <button
            className="sign-out-btn"
            onClick={handleSignOut}
            style={{ fontSize: "10px", letterSpacing: "0.15em", color: "rgba(255,255,255,0.25)", textTransform: "uppercase" }}
          >
            Sign Out
          </button>
          <div style={{
            fontSize: "10px",
            letterSpacing: "0.15em",
            color: "rgba(255,255,255,0.4)",
            textTransform: "uppercase",
          }}>
            {firstName}
          </div>
          <div style={{
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.12)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "11px",
            color: "rgba(255,255,255,0.7)",
            cursor: "pointer",
          }}>
            {initials}
          </div>
        </div>
      </nav>

      {/* ── PAGE HEADER ───────────────────────────────────────────────────────── */}
      <div style={{
        padding: "48px 32px 32px",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
      }}>
        <div style={{ fontSize: "10px", letterSpacing: "0.2em", color: "rgba(255,255,255,0.35)", textTransform: "uppercase", marginBottom: "10px" }}>
          Patient Portal
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <h1 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "36px",
              fontWeight: 300,
              letterSpacing: "0.02em",
              lineHeight: 1.1,
              marginBottom: "8px",
            }}>
              {greeting}, {firstName}.
            </h1>
            <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", letterSpacing: "0.05em" }}>
              {refillsDue > 0
                ? `You have ${refillsDue} active protocol${refillsDue !== 1 ? "s" : ""}${pendingLabs > 0 ? ` and ${pendingLabs} pending lab result${pendingLabs !== 1 ? "s" : ""}` : ""}.`
                : "Welcome to your clinical dashboard."}
            </p>
          </div>
          <button
            onClick={() => navigate("/portal")}
            style={{
              background: "white",
              color: "black",
              border: "none",
              padding: "10px 22px",
              fontSize: "10px",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              cursor: "pointer",
              fontFamily: "'Helvetica Neue', sans-serif",
              fontWeight: 400,
            }}>
            Full Portal
          </button>
        </div>
      </div>

      {/* ── STATS ROW ─────────────────────────────────────────────────────────── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
      }}>
        {[
          { label: "Active Protocols",  value: activeCount || "0" },
          { label: "Next Appointment",  value: nextAppt ? new Date(nextAppt.scheduled_at).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "None" },
          { label: "Labs Pending",      value: String(pendingLabs) },
          { label: "Member Since",      value: memberSince },
        ].map((stat, i) => (
          <div key={i} style={{
            padding: "24px 32px",
            borderRight: i < 3 ? "1px solid rgba(255,255,255,0.05)" : "none",
          }}>
            <div style={{ fontSize: "10px", letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: "8px" }}>
              {stat.label}
            </div>
            <div style={{ fontSize: "22px", fontFamily: "'Cormorant Garamond', serif", fontWeight: 300 }}>
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      {/* ── TREATMENTS TAB ────────────────────────────────────────────────────── */}
      {activeTab === "treatments" && (
        <div style={{ padding: "40px 32px" }}>
          <div style={{ marginBottom: "28px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
            <div>
              <h2 style={{ fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)", marginBottom: "6px" }}>
                Your Protocols
              </h2>
              <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.25)", letterSpacing: "0.03em" }}>
                {activeCount} active treatment{activeCount !== 1 ? "s" : ""} under physician oversight
              </p>
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              {["All", "Active", "Pending", "Denied"].map(f => (
                <button
                  key={f}
                  className="filter-btn"
                  onClick={() => setTreatFilter(f)}
                  style={{
                    background: treatFilter === f ? "rgba(255,255,255,0.08)" : "transparent",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: treatFilter === f ? "white" : "rgba(255,255,255,0.4)",
                    padding: "6px 14px",
                    fontSize: "10px",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                  }}>
                  {f}
                </button>
              ))}
            </div>
          </div>

          {filteredOrders.length === 0 ? (
            <div style={{
              padding: "60px",
              textAlign: "center",
              background: "#111",
              border: "1px solid rgba(255,255,255,0.06)",
            }}>
              <div style={{ fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.2)" }}>
                No treatment requests found
              </div>
            </div>
          ) : (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "16px",
            }}>
              {filteredOrders.map(order => {
                const statusKey = order.status === "approved" ? "active" : order.status in statusStyle ? order.status : "pending";
                const s = statusStyle[statusKey];
                const badge = deriveBadge(order);
                const b = badge ? badgeStyle[badge] : null;
                const type = deriveType(order.product_name);
                const refillDate = order.refill_due
                  ? new Date(order.refill_due).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                  : null;

                return (
                  <div
                    key={order.id}
                    className="card-hover"
                    style={{
                      background: "#111",
                      border: "1px solid rgba(255,255,255,0.06)",
                      borderRadius: "2px",
                      overflow: "hidden",
                      cursor: "pointer",
                    }}
                  >
                    {/* Product image */}
                    <div style={{
                      background: "#181818",
                      height: "200px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "20px",
                      position: "relative",
                    }}>
                      <div style={{ width: "100px", height: "160px" }}>
                        {type === "vial"
                          ? <VialSVG label={order.product_name} />
                          : <CapsuleSVG label={order.product_name} />}
                      </div>
                      {b && (
                        <div style={{ position: "absolute", top: "12px", left: "12px" }}>
                          <span style={{
                            background: b.bg,
                            color: b.color,
                            border: `1px solid ${b.border}`,
                            fontSize: "9px",
                            letterSpacing: "0.1em",
                            padding: "3px 8px",
                            textTransform: "uppercase",
                            borderRadius: "2px",
                          }}>
                            {badge}
                          </span>
                        </div>
                      )}
                      <div style={{
                        position: "absolute", top: "14px", right: "14px",
                        display: "flex", alignItems: "center", gap: "5px",
                      }}>
                        <div style={{
                          width: "6px", height: "6px", borderRadius: "50%",
                          background: s.dot,
                          boxShadow: `0 0 6px ${s.dot}`,
                        }} />
                        <span style={{ fontSize: "9px", letterSpacing: "0.1em", color: s.dot, textTransform: "uppercase" }}>
                          {s.label}
                        </span>
                      </div>
                    </div>

                    {/* Card body */}
                    <div style={{ padding: "20px" }}>
                      <div style={{ fontSize: "9px", letterSpacing: "0.15em", color: "rgba(255,255,255,0.35)", textTransform: "uppercase", marginBottom: "6px" }}>
                        {order.product_category || "Treatment"}
                      </div>
                      <h3 style={{
                        fontSize: "18px",
                        fontFamily: "'Cormorant Garamond', serif",
                        fontWeight: 300,
                        marginBottom: "8px",
                        letterSpacing: "0.02em",
                      }}>
                        {order.product_name}
                      </h3>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.8)", letterSpacing: "0.05em" }}>
                          {order.price ? `$${Number(order.price).toFixed(2)}` : ""}
                        </span>
                        {order.status === "approved" ? (
                          <button className="refill-btn">
                            {refillDate ? `Refill — ${refillDate}` : "Request Refill"}
                          </button>
                        ) : order.status === "pending" ? (
                          <span style={{ fontSize: "9px", letterSpacing: "0.1em", color: "#facc15", textTransform: "uppercase" }}>
                            Lab Required
                          </span>
                        ) : (
                          <span style={{ fontSize: "9px", letterSpacing: "0.1em", color: "rgba(255,255,255,0.2)", textTransform: "uppercase" }}>
                            {order.status === "denied" ? "Not Approved" : "Paused"}
                          </span>
                        )}
                      </div>
                      {order.admin_notes && (
                        <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.25)", marginTop: "10px", lineHeight: 1.5, letterSpacing: "0.02em" }}>
                          {order.admin_notes}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── LAB RESULTS TAB ───────────────────────────────────────────────────── */}
      {activeTab === "lab results" && (
        <div style={{ padding: "40px 32px" }}>
          <h2 style={{ fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)", marginBottom: "28px" }}>
            Lab Results
          </h2>
          {labs.length === 0 ? (
            <div style={{ padding: "60px", textAlign: "center", background: "#111", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.2)" }}>
                No lab results on file
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
              {labs.map((lab) => (
                <div
                  key={lab.id}
                  className="card-hover"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "20px 24px",
                    background: "#111",
                    border: "1px solid rgba(255,255,255,0.06)",
                    cursor: "pointer",
                  }}
                >
                  <div>
                    <div style={{ fontSize: "13px", marginBottom: "4px", letterSpacing: "0.03em" }}>
                      {lab.marker_name}
                    </div>
                    <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.35)", letterSpacing: "0.08em" }}>
                      {lab.tested_at ? new Date(lab.tested_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "—"}
                      {lab.result_value != null && ` · ${lab.result_value}${lab.unit ? " " + lab.unit : ""}`}
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{
                      fontSize: "9px",
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      color: lab.status === "reviewed" ? "#4ade80" : "#facc15",
                      padding: "4px 10px",
                      border: `1px solid ${lab.status === "reviewed" ? "rgba(74,222,128,0.25)" : "rgba(250,204,21,0.25)"}`,
                      background: lab.status === "reviewed" ? "rgba(74,222,128,0.08)" : "rgba(250,204,21,0.08)",
                    }}>
                      {lab.status === "reviewed" ? "Reviewed" : "Pending"}
                    </span>
                    <span style={{ color: "rgba(255,255,255,0.2)", fontSize: "16px" }}>›</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── APPOINTMENTS TAB ──────────────────────────────────────────────────── */}
      {activeTab === "appointments" && (
        <div style={{ padding: "40px 32px" }}>
          <h2 style={{ fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)", marginBottom: "28px" }}>
            Upcoming Appointments
          </h2>
          {appointments.length === 0 ? (
            <div style={{ padding: "60px", textAlign: "center", background: "#111", border: "1px solid rgba(255,255,255,0.06)", marginBottom: "24px" }}>
              <div style={{ fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.2)" }}>
                No upcoming appointments
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "24px" }}>
              {appointments.map((appt) => {
                const d = new Date(appt.scheduled_at);
                const month = d.toLocaleDateString("en-US", { month: "short" });
                const day   = d.toLocaleDateString("en-US", { day: "numeric" });
                const time  = d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
                return (
                  <div
                    key={appt.id}
                    className="card-hover"
                    style={{
                      display: "grid",
                      gridTemplateColumns: "80px 1fr auto",
                      gap: "24px",
                      alignItems: "center",
                      padding: "24px",
                      background: "#111",
                      border: "1px solid rgba(255,255,255,0.06)",
                    }}
                  >
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "24px", fontWeight: 300 }}>{day}</div>
                      <div style={{ fontSize: "9px", letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)" }}>{month}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: "14px", marginBottom: "4px", letterSpacing: "0.02em" }}>
                        {appt.type || appt.title || "Appointment"}
                      </div>
                      <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.35)", letterSpacing: "0.05em" }}>
                        {appt.provider || "Dr. Loo"} · {time}
                      </div>
                    </div>
                    <button style={{
                      background: "transparent",
                      border: "1px solid rgba(255,255,255,0.15)",
                      color: "rgba(255,255,255,0.6)",
                      padding: "8px 18px",
                      fontSize: "9px",
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      cursor: "pointer",
                      fontFamily: "'Helvetica Neue', sans-serif",
                    }}>
                      Details
                    </button>
                  </div>
                );
              })}
            </div>
          )}
          <button
            onClick={() => navigate("/portal")}
            style={{
              background: "white",
              color: "black",
              border: "none",
              padding: "12px 28px",
              fontSize: "10px",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              cursor: "pointer",
              fontFamily: "'Helvetica Neue', sans-serif",
              fontWeight: 400,
            }}>
            Schedule New Appointment
          </button>
        </div>
      )}

      {/* ── MESSAGES TAB ──────────────────────────────────────────────────────── */}
      {activeTab === "messages" && (
        <div style={{ padding: "40px 32px" }}>
          <h2 style={{ fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)", marginBottom: "28px" }}>
            Messages
          </h2>
          <div style={{
            padding: "60px",
            textAlign: "center",
            background: "#111",
            border: "1px solid rgba(255,255,255,0.06)",
          }}>
            <div style={{ fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.2)" }}>
              No new messages
            </div>
          </div>
        </div>
      )}

      {/* ── FOOTER ────────────────────────────────────────────────────────────── */}
      <div style={{
        borderTop: "1px solid rgba(255,255,255,0.05)",
        padding: "24px 32px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: "40px",
        flexWrap: "wrap",
        gap: "12px",
      }}>
        <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.2)", letterSpacing: "0.05em" }}>
          Premier Vitality &amp; Wellness — San Tan Valley, AZ
        </div>
        <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.2)", letterSpacing: "0.05em" }}>
          Physician-directed therapy. All treatments require medical oversight.
        </div>
      </div>
    </div>
  );
}
