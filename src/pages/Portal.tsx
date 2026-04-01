import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import UserSettingsMenu from "@/components/portal/UserSettingsMenu";
import BloodworkUploader from "@/components/portal/BloodworkUploader";
import PremierMarkers from "@/components/portal/PremierMarkers";
import { Calendar, CheckCircle2, ClipboardList, ChevronDown, LayoutDashboard, Pill, Activity, FileText, MessageSquare } from "lucide-react";
import { syncIntakeToProfile } from "@/lib/syncIntakeToProfile";

type Tab = "dashboard" | "protocol" | "health" | "documents" | "messages";

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "protocol", label: "My Protocol", icon: Pill },
  { id: "health", label: "Health Report", icon: Activity },
  { id: "documents", label: "Documents", icon: FileText },
  { id: "messages", label: "Messages", icon: MessageSquare },
];

const Portal = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState<{ first_name: string | null; last_name: string | null } | null>(null);
  const [intakeComplete, setIntakeComplete] = useState<boolean | null>(null);
  const [showCalendly, setShowCalendly] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");

  useEffect(() => {
    if (!loading && !user) navigate("/auth");
  }, [user, loading, navigate]);

  const fetchData = useCallback(async () => {
    if (!user) return;

    const { data: prof } = await supabase
      .from("profiles")
      .select("first_name, last_name, phone")
      .eq("user_id", user.id)
      .single();

    if (prof && (!prof.first_name || !prof.last_name || !prof.phone) && user.email) {
      await syncIntakeToProfile(user.id, user.email);
      const { data: updated } = await supabase
        .from("profiles")
        .select("first_name, last_name")
        .eq("user_id", user.id)
        .single();
      if (updated) setProfile(updated);
    } else if (prof) {
      setProfile(prof);
    }

    const email = user.email;
    if (email) {
      const { count } = await supabase
        .from("patient_intake" as any)
        .select("id", { count: "exact", head: true })
        .eq("email", email);
      setIntakeComplete((count ?? 0) > 0);
    }
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading || !user) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <p className="text-primary text-sm tracking-[0.2em] uppercase animate-pulse">Loading...</p>
      </div>
    );
  }

  const firstName = profile?.first_name || "";

  return (
    <div className="min-h-screen w-full relative">
      {/* Header */}
      <header className="border-b border-border/30 sticky top-0 z-50" style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}>
        <div className="w-full px-6 flex items-center justify-between h-16">
          <a href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <img src="/logo-emblem.svg" alt="PVW" className="h-8 w-auto" style={{ filter: "brightness(0) saturate(100%) invert(72%) sepia(28%) saturate(600%) hue-rotate(5deg)" }} />
            <span className="text-xs tracking-[0.25em] uppercase text-foreground hidden sm:inline">Premier Vitality &amp; Wellness</span>
          </a>
          <UserSettingsMenu
            firstName={profile?.first_name ?? null}
            lastName={profile?.last_name ?? null}
            userId={user.id}
            onSignOut={signOut}
            onProfileUpdated={fetchData}
          />
        </div>

        {/* Tab Bar */}
        <nav className="w-full overflow-x-auto scrollbar-hide">
          <div className="flex items-center gap-1 px-6 min-w-max">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center gap-2 px-4 py-3 text-[11px] tracking-[0.18em] uppercase transition-colors whitespace-nowrap ${
                    active ? "text-primary" : "text-foreground/50 hover:text-foreground/80"
                  }`}
                >
                  <Icon size={14} strokeWidth={active ? 2 : 1.5} />
                  <span className="hidden sm:inline">{tab.label}</span>
                  {active && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-[2px] bg-primary rounded-full" />
                  )}
                </button>
              );
            })}
          </div>
        </nav>
      </header>

      {/* Tab Content */}
      <main className="max-w-3xl mx-auto px-6 py-10 md:py-14 space-y-10">
        {activeTab === "dashboard" && <DashboardTab firstName={firstName} intakeComplete={intakeComplete} showCalendly={showCalendly} setShowCalendly={setShowCalendly} navigate={navigate} />}
        {activeTab === "protocol" && <PlaceholderTab title="My Protocol" description="Your active peptides, dosing schedule, and protocol details will appear here once your provider activates your treatment plan." icon={Pill} />}
        {activeTab === "health" && <HealthTab />}
        {activeTab === "documents" && <PlaceholderTab title="Documents" description="Signed consent forms, lab orders, and other documents will be available here." icon={FileText} />}
        {activeTab === "messages" && <PlaceholderTab title="Messages" description="Secure messages with your care team will appear here." icon={MessageSquare} />}
      </main>
    </div>
  );
};

/* ─── Dashboard Tab ─── */
const DashboardTab = ({ firstName, intakeComplete, showCalendly, setShowCalendly, navigate }: {
  firstName: string;
  intakeComplete: boolean | null;
  showCalendly: boolean;
  setShowCalendly: (v: boolean) => void;
  navigate: (path: string) => void;
}) => (
  <>
    {/* Welcome */}
    <div>
      <p className="text-[10px] tracking-[0.35em] uppercase text-primary mb-2">Patient Portal</p>
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-light tracking-tight text-foreground">
        Welcome{firstName ? `, ${firstName}` : ""}
      </h1>
    </div>

    {/* Hero CTA */}
    <button
      onClick={() => {
        const next = !showCalendly;
        setShowCalendly(next);
        if (next) setTimeout(() => document.getElementById("calendly-embed")?.scrollIntoView({ behavior: "smooth" }), 100);
      }}
      className="group flex items-center justify-between w-full p-6 rounded-xl border border-primary/30 hover:border-primary/60 transition-all duration-300 text-left"
      style={{ background: "linear-gradient(135deg, rgba(171,143,95,0.08) 0%, rgba(171,143,95,0.02) 100%)" }}
    >
      <div className="flex items-center gap-4">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
          <Calendar size={22} className="text-primary" />
        </div>
        <div>
          <p className="text-xs tracking-[0.2em] uppercase text-primary mb-1">Ready to begin?</p>
          <p className="text-lg font-light text-foreground">Book Your Consultation</p>
        </div>
      </div>
      <ChevronDown size={20} className={`text-primary opacity-50 group-hover:opacity-100 transition-all ${showCalendly ? "rotate-180" : ""}`} />
    </button>

    {/* Calendly Inline Embed */}
    {showCalendly && (
      <div id="calendly-embed" className="rounded-xl border border-border/30 overflow-hidden" style={{ background: "rgba(0,0,0,0.4)" }}>
        <div className="px-6 py-3 border-b border-border/20 flex items-center justify-between">
          <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground">Schedule Your Consultation</p>
          <button onClick={() => setShowCalendly(false)} className="text-xs text-muted-foreground hover:text-foreground transition-colors">Close</button>
        </div>
        <iframe
          src="https://calendly.com/admin-premiervitalityandwellness/prerequisite?background_color=0a0a0a&text_color=ebe5d5&primary_color=c4a24e&hide_gdpr_banner=1"
          title="Schedule Your Consultation"
          style={{ width: "100%", height: "700px", border: "none", background: "#0a0a0a", minWidth: "320px" }}
        />
      </div>
    )}

    {/* Intake Status */}
    {intakeComplete !== null && (
      <div className="rounded-xl border border-border/30 overflow-hidden" style={{ background: "rgba(255,255,255,0.02)" }}>
        <div className="px-6 py-4 border-b border-border/20">
          <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground">Intake Form Status</p>
        </div>
        <div className="px-6 py-5 flex items-center gap-4">
          {intakeComplete ? (
            <>
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-emerald-500/10">
                <CheckCircle2 size={20} className="text-emerald-400" />
              </div>
              <div>
                <p className="text-sm font-light text-foreground">Intake Form Submitted</p>
                <p className="text-xs text-muted-foreground mt-0.5">Our team is reviewing your information.</p>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-amber-500/10">
                <ClipboardList size={20} className="text-amber-400" />
              </div>
              <div>
                <p className="text-sm font-light text-foreground">Intake Form Not Completed</p>
                <p className="text-xs text-muted-foreground mt-0.5">Please complete your intake form to get started.</p>
              </div>
            </>
          )}
        </div>
      </div>
    )}

    {/* Your Next Step */}
    <div className="rounded-xl border border-border/30 overflow-hidden" style={{ background: "rgba(255,255,255,0.02)" }}>
      <div className="px-6 py-4 border-b border-border/20">
        <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground">Your Next Step</p>
      </div>
      <div className="px-6 py-6">
        {intakeComplete === false ? (
          <div className="text-center space-y-4">
            <p className="text-sm text-muted-foreground font-light">Complete your patient intake form so our team can prepare for your consultation.</p>
            <button
              onClick={() => navigate("/intake")}
              className="inline-flex items-center gap-2 px-8 py-3 text-xs tracking-[0.2em] uppercase rounded-full border border-primary/40 text-primary hover:bg-primary/10 transition-colors"
            >
              <ClipboardList size={14} />
              Complete Your Intake Form
            </button>
          </div>
        ) : intakeComplete === true ? (
          <div className="text-center space-y-4">
            <p className="text-sm text-muted-foreground font-light">Your intake form is on file. Schedule your consultation to meet with a provider.</p>
            <button
              onClick={() => {
                const next = !showCalendly;
                setShowCalendly(next);
                if (next) setTimeout(() => document.getElementById("calendly-embed")?.scrollIntoView({ behavior: "smooth" }), 100);
              }}
              className="inline-flex items-center gap-2 px-8 py-3 text-xs tracking-[0.2em] uppercase rounded-full border border-primary/40 text-primary hover:bg-primary/10 transition-colors"
            >
              <Calendar size={14} />
              Book Your Consultation
            </button>
          </div>
        ) : (
          <div className="flex justify-center py-4">
            <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
        )}
      </div>
    </div>
  </>
);

/* ─── Health Report Tab ─── */
const HealthTab = () => (
  <>
    <div>
      <p className="text-[10px] tracking-[0.35em] uppercase text-primary mb-2">Health Intelligence</p>
      <h2 className="text-2xl sm:text-3xl font-light tracking-tight text-foreground">Health Report</h2>
      <p className="text-sm text-muted-foreground font-light mt-2">Upload bloodwork and track your biomarkers over time.</p>
    </div>
    <BloodworkUploader />
    <PremierMarkers />
  </>
);

/* ─── Placeholder Tab ─── */
const PlaceholderTab = ({ title, description, icon: Icon }: { title: string; description: string; icon: React.ElementType }) => (
  <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
    <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/5">
      <Icon size={28} className="text-primary/40" />
    </div>
    <h2 className="text-xl font-light text-foreground">{title}</h2>
    <p className="text-sm text-muted-foreground font-light max-w-md">{description}</p>
  </div>
);

export default Portal;
