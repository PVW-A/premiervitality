import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ChevronDown, ChevronUp, Download, LogOut, Search } from "lucide-react";

const ADMIN_EMAIL = "admin@premiervitalityandwellness.com";
const ADMIN_USER_ID = "4b63e9d9-1cf9-49a1-9427-89e4035f8115";

interface IntakeRecord {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  date_of_birth: string;
  sex: string;
  address: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  current_medications: string | null;
  known_allergies: string | null;
  reason_for_visit: string;
  current_symptoms: string;
  health_conditions: string[];
  prior_surgeries: boolean;
  prior_surgeries_description: string | null;
  blood_clots: boolean;
  prior_hormone_therapy: boolean;
  exercise_frequency: string;
  sleep_quality: string;
  stress_level: number;
  tobacco_use: string;
  alcohol_use: string;
  wellness_goals: string;
  additional_notes: string | null;
  consent_self_pay: boolean;
  consent_medical_services: boolean;
  consent_hipaa: boolean;
  submission_date: string;
  status: string;
  membership_tier: string | null;
  pdf_url: string | null;
}

const TIERS = ["", "Legacy", "Essential", "Premium", "Elite"];
const STATUSES = ["New", "Reviewed", "Active", "Inactive"];

const AdminPanel = () => {
  const navigate = useNavigate();
  const [authChecked, setAuthChecked] = useState(false);
  const [records, setRecords] = useState<IntakeRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  // Auth check
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate("/auth"); return; }
      if (user.id === ADMIN_USER_ID || user.email === ADMIN_EMAIL) {
        setAuthChecked(true);
        return;
      }
      const { data: isAdmin } = await supabase.rpc("has_role", { _user_id: user.id, _role: "admin" });
      if (isAdmin) { setAuthChecked(true); } else { navigate("/portal"); }
    };
    checkAuth();
  }, [navigate]);

  // Fetch intake records
  const fetchRecords = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("patient_intake" as any)
      .select("*")
      .order("submission_date", { ascending: false });
    if (!error && data) setRecords(data as IntakeRecord[]);
    setLoading(false);
  };

  useEffect(() => {
    if (authChecked) fetchRecords();
  }, [authChecked]);

  // Update a field on a record
  const updateField = async (id: string, field: string, value: string) => {
    await supabase
      .from("patient_intake" as any)
      .update({ [field]: value || null })
      .eq("id", id);
    setRecords((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: value || null } : r))
    );
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0a0a0a" }}>
        <p className="text-primary text-sm tracking-[0.2em] uppercase animate-pulse">Verifying access...</p>
      </div>
    );
  }

  const filtered = records.filter((r) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      r.first_name.toLowerCase().includes(s) ||
      r.last_name.toLowerCase().includes(s) ||
      r.email.toLowerCase().includes(s) ||
      r.phone.includes(s)
    );
  });

  return (
    <div className="min-h-screen" style={{ background: "#0a0a0a", fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <header className="border-b border-border/30 sticky top-0 z-50" style={{ background: "rgba(10,10,10,0.95)", backdropFilter: "blur(12px)" }}>
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            <img src="/logo-emblem.svg" alt="PVW" className="h-7 w-auto" style={{ filter: "brightness(0) saturate(100%) invert(72%) sepia(28%) saturate(600%) hue-rotate(5deg)" }} />
            <span className="text-xs tracking-[0.2em] uppercase text-primary">Admin</span>
          </div>
          <button onClick={handleSignOut} className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors">
            <LogOut size={14} /> Sign Out
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <p className="text-[10px] tracking-[0.35em] uppercase text-primary mb-1">Dashboard</p>
            <h1 className="text-xl font-light text-foreground">Patient Intake Submissions</h1>
          </div>
          {/* Search */}
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search patients..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 w-full sm:w-72 text-sm rounded-lg border border-border/40 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-center text-muted-foreground text-sm py-20">No intake records found.</p>
        ) : (
          <div className="border border-border/30 rounded-xl overflow-hidden">
            {/* Table Header */}
            <div className="hidden md:grid md:grid-cols-[1.5fr_2fr_1fr_1fr_1fr_1fr_1fr_40px] gap-2 px-4 py-3 text-[10px] tracking-[0.15em] uppercase text-muted-foreground border-b border-border/20" style={{ background: "rgba(255,255,255,0.02)" }}>
              <span>Name</span>
              <span>Email</span>
              <span>Phone</span>
              <span>DOB</span>
              <span>Submitted</span>
              <span>Tier</span>
              <span>Status</span>
              <span />
            </div>

            {/* Rows */}
            {filtered.map((r) => {
              const expanded = expandedId === r.id;
              return (
                <div key={r.id} className="border-b border-border/10 last:border-b-0">
                  {/* Summary row */}
                  <button
                    onClick={() => setExpandedId(expanded ? null : r.id)}
                    className="w-full grid grid-cols-1 md:grid-cols-[1.5fr_2fr_1fr_1fr_1fr_1fr_1fr_40px] gap-2 px-4 py-3 text-left text-sm text-foreground hover:bg-white/[0.02] transition-colors items-center"
                  >
                    <span className="font-light">{r.first_name} {r.last_name}</span>
                    <span className="text-muted-foreground text-xs truncate">{r.email}</span>
                    <span className="text-muted-foreground text-xs hidden md:block">{r.phone}</span>
                    <span className="text-muted-foreground text-xs hidden md:block">{r.date_of_birth}</span>
                    <span className="text-muted-foreground text-xs hidden md:block">{r.submission_date}</span>
                    {/* Tier dropdown - stop propagation so click doesn't toggle expand */}
                    <span className="hidden md:block" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={r.membership_tier || ""}
                        onChange={(e) => updateField(r.id, "membership_tier", e.target.value)}
                        className="w-full bg-transparent border border-border/30 rounded px-1.5 py-1 text-xs text-foreground focus:outline-none focus:border-primary/50 cursor-pointer"
                      >
                        {TIERS.map((t) => (
                          <option key={t} value={t} className="bg-[#0a0a0a]">{t || "—"}</option>
                        ))}
                      </select>
                    </span>
                    {/* Status dropdown */}
                    <span className="hidden md:block" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={r.status || "New"}
                        onChange={(e) => updateField(r.id, "status", e.target.value.toLowerCase())}
                        className="w-full bg-transparent border border-border/30 rounded px-1.5 py-1 text-xs text-foreground focus:outline-none focus:border-primary/50 cursor-pointer"
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s.toLowerCase()} className="bg-[#0a0a0a]">{s}</option>
                        ))}
                      </select>
                    </span>
                    <span className="flex justify-end">
                      {expanded ? <ChevronUp size={16} className="text-muted-foreground" /> : <ChevronDown size={16} className="text-muted-foreground" />}
                    </span>
                  </button>

                  {/* Expanded detail */}
                  {expanded && (
                    <div className="px-4 pb-6 pt-2 space-y-6" style={{ background: "rgba(255,255,255,0.01)" }}>
                      {/* Mobile-only tier/status selectors */}
                      <div className="grid grid-cols-2 gap-4 md:hidden">
                        <div>
                          <label className="text-[10px] tracking-wider uppercase text-muted-foreground block mb-1">Tier</label>
                          <select
                            value={r.membership_tier || ""}
                            onChange={(e) => updateField(r.id, "membership_tier", e.target.value)}
                            className="w-full bg-transparent border border-border/30 rounded px-2 py-1.5 text-xs text-foreground"
                          >
                            {TIERS.map((t) => (
                              <option key={t} value={t} className="bg-[#0a0a0a]">{t || "—"}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="text-[10px] tracking-wider uppercase text-muted-foreground block mb-1">Status</label>
                          <select
                            value={r.status || "New"}
                            onChange={(e) => updateField(r.id, "status", e.target.value.toLowerCase())}
                            className="w-full bg-transparent border border-border/30 rounded px-2 py-1.5 text-xs text-foreground"
                          >
                            {STATUSES.map((s) => (
                              <option key={s} value={s.toLowerCase()} className="bg-[#0a0a0a]">{s}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* PDF download */}
                      {r.pdf_url && (
                        <a
                          href={r.pdf_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-xs text-primary hover:text-primary/80 transition-colors"
                        >
                          <Download size={14} /> Download Intake PDF
                        </a>
                      )}

                      {/* Detail sections */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <DetailSection title="Personal Information">
                          <DetailField label="Name" value={`${r.first_name} ${r.last_name}`} />
                          <DetailField label="Date of Birth" value={r.date_of_birth} />
                          <DetailField label="Sex" value={r.sex} />
                          <DetailField label="Phone" value={r.phone} />
                          <DetailField label="Email" value={r.email} />
                          <DetailField label="Address" value={r.address} />
                        </DetailSection>

                        <DetailSection title="Emergency Contact">
                          <DetailField label="Name" value={r.emergency_contact_name} />
                          <DetailField label="Phone" value={r.emergency_contact_phone} />
                        </DetailSection>

                        <DetailSection title="Medical History">
                          <DetailField label="Current Medications" value={r.current_medications} />
                          <DetailField label="Allergies" value={r.known_allergies} />
                          <DetailField label="Reason for Visit" value={r.reason_for_visit} />
                          <DetailField label="Current Symptoms" value={r.current_symptoms} />
                          <DetailField label="Health Conditions" value={r.health_conditions?.length ? r.health_conditions.join(", ") : "None"} />
                          <DetailField label="Prior Surgeries" value={r.prior_surgeries ? `Yes${r.prior_surgeries_description ? ` — ${r.prior_surgeries_description}` : ""}` : "No"} />
                          <DetailField label="Blood Clots" value={r.blood_clots ? "Yes" : "No"} />
                          <DetailField label="Prior Hormone Therapy" value={r.prior_hormone_therapy ? "Yes" : "No"} />
                        </DetailSection>

                        <DetailSection title="Lifestyle">
                          <DetailField label="Exercise" value={r.exercise_frequency} />
                          <DetailField label="Sleep Quality" value={r.sleep_quality} />
                          <DetailField label="Stress Level" value={`${r.stress_level}/10`} />
                          <DetailField label="Tobacco Use" value={r.tobacco_use} />
                          <DetailField label="Alcohol Use" value={r.alcohol_use} />
                        </DetailSection>

                        <DetailSection title="Goals & Notes">
                          <DetailField label="Wellness Goals" value={r.wellness_goals} />
                          <DetailField label="Additional Notes" value={r.additional_notes} />
                        </DetailSection>

                        <DetailSection title="Consent">
                          <DetailField label="Self-Pay Agreement" value={r.consent_self_pay ? "Agreed" : "Not agreed"} />
                          <DetailField label="Medical Services" value={r.consent_medical_services ? "Agreed" : "Not agreed"} />
                          <DetailField label="HIPAA" value={r.consent_hipaa ? "Agreed" : "Not agreed"} />
                        </DetailSection>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

const DetailSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div>
    <p className="text-[10px] tracking-[0.2em] uppercase text-primary mb-3">{title}</p>
    <div className="space-y-2">{children}</div>
  </div>
);

const DetailField = ({ label, value }: { label: string; value: string | null | undefined }) => (
  <div className="flex gap-2 text-xs">
    <span className="text-muted-foreground min-w-[120px] shrink-0">{label}:</span>
    <span className="text-foreground font-light">{value || "N/A"}</span>
  </div>
);

export default AdminPanel;
