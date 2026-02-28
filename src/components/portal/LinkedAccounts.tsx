import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Users, UserPlus, X, Eye, Pill, Activity, Package, Clock, Trash2, Check } from "lucide-react";
import { toast } from "sonner";
import { type BiomarkerResult, getAllMarkers, computeVitalityScore, computeCategoryScores, getScoreColor } from "@/lib/vitality";

interface AccountLink {
  id: string;
  inviter_user_id: string;
  invitee_user_id: string | null;
  invitee_email: string;
  status: string;
  relationship: string | null;
  created_at: string;
  accepted_at: string | null;
}

interface LinkedMemberData {
  profile: { first_name: string | null; last_name: string | null };
  peptides: Array<{ id: string; peptide_name: string; dosage: string | null; quantity_remaining: number }>;
  requests: Array<{ id: string; peptide_name: string; status: string; created_at: string }>;
  orders: Array<{ id: string; status: string; created_at: string }>;
  vitalityScore: number | null;
  biomarkerResults: BiomarkerResult[];
}

export default function LinkedAccounts() {
  const { user } = useAuth();
  const [links, setLinks] = useState<AccountLink[]>([]);
  const [pendingInvites, setPendingInvites] = useState<AccountLink[]>([]);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteOpen, setInviteOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [viewingMember, setViewingMember] = useState<{ userId: string; name: string } | null>(null);
  const [memberData, setMemberData] = useState<LinkedMemberData | null>(null);
  const [loadingMember, setLoadingMember] = useState(false);

  const fetchLinks = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from("account_links")
      .select("*")
      .or(`inviter_user_id.eq.${user.id},invitee_user_id.eq.${user.id}`)
      .order("created_at", { ascending: false });
    if (data) {
      setLinks(data.filter((l: any) => l.status === "accepted") as AccountLink[]);
      setPendingInvites(data.filter((l: any) => l.status === "pending") as AccountLink[]);
    }
  }, [user]);

  useEffect(() => { fetchLinks(); }, [fetchLinks]);

  const handleSendInvite = async () => {
    if (!user || !inviteEmail.trim()) return;
    setSending(true);
    const normalizedEmail = inviteEmail.trim().toLowerCase();
    try {
      const { error } = await supabase.from("account_links").insert({
        inviter_user_id: user.id,
        invitee_email: normalizedEmail,
      } as any);
      if (error) {
        if (error.code === "23505") toast.error("An invite to this email already exists.");
        else toast.error(error.message);
        return;
      }

      // Fetch inviter's name for the email
      const { data: profile } = await supabase
        .from("profiles")
        .select("first_name, last_name")
        .eq("user_id", user.id)
        .single();
      const inviterName = profile
        ? `${profile.first_name || ""} ${profile.last_name || ""}`.trim()
        : user.email || "A member";

      // Fire invite email + in-app notification + Slack alert
      supabase.functions.invoke("send-invite-email", {
        body: {
          invitee_email: normalizedEmail,
          inviter_name: inviterName,
          inviter_user_id: user.id,
        },
      }).catch((err) => console.error("Invite notification error:", err));

      toast.success("Invite sent! They'll receive an email notification.");
      setInviteEmail("");
      setInviteOpen(false);
      fetchLinks();
    } finally {
      setSending(false);
    }
  };

  const handleAcceptInvite = async (linkId: string) => {
    if (!user) return;
    const { error } = await supabase
      .from("account_links")
      .update({ status: "accepted", invitee_user_id: user.id, accepted_at: new Date().toISOString() } as any)
      .eq("id", linkId);
    if (error) toast.error("Failed to accept invite");
    else { toast.success("Account linked!"); fetchLinks(); }
  };

  const handleRemoveLink = async (linkId: string) => {
    const { error } = await supabase.from("account_links").delete().eq("id", linkId);
    if (error) toast.error("Failed to remove link");
    else { toast.success("Link removed"); fetchLinks(); }
  };

  const viewMember = async (userId: string, name: string) => {
    setViewingMember({ userId, name });
    setLoadingMember(true);
    setMemberData(null);
    try {
      const [profileRes, peptidesRes, requestsRes, ordersRes, bioRes] = await Promise.all([
        supabase.from("profiles").select("first_name, last_name").eq("user_id", userId).single(),
        supabase.from("patient_peptides").select("*, peptides(name)").eq("user_id", userId),
        supabase.from("peptide_requests").select("*").eq("user_id", userId).order("created_at", { ascending: false }).limit(10),
        supabase.from("orders").select("*").eq("user_id", userId).order("created_at", { ascending: false }).limit(10),
        supabase.from("biomarker_results").select("*").eq("user_id", userId).order("lab_date", { ascending: false }),
      ]);
      const bioResults = (bioRes.data || []) as BiomarkerResult[];
      setMemberData({
        profile: profileRes.data || { first_name: null, last_name: null },
        peptides: (peptidesRes.data || []).map((p: any) => ({
          id: p.id,
          peptide_name: p.peptides?.name ?? "Unknown",
          dosage: p.dosage,
          quantity_remaining: p.quantity_remaining ?? 0,
        })),
        requests: (requestsRes.data || []).map((r: any) => ({
          id: r.id,
          peptide_name: r.peptide_name,
          status: r.status,
          created_at: r.created_at,
        })),
        orders: (ordersRes.data || []).map((o: any) => ({
          id: o.id,
          status: o.status,
          created_at: o.created_at,
        })),
        vitalityScore: computeVitalityScore(bioResults, getAllMarkers()),
        biomarkerResults: bioResults,
      });
    } finally {
      setLoadingMember(false);
    }
  };

  // Check for pending invites addressed to the current user's email
  const [myIncomingInvites, setMyIncomingInvites] = useState<AccountLink[]>([]);
  useEffect(() => {
    if (!user?.email) return;
    const incoming = pendingInvites.filter(
      (l) => l.invitee_email === user.email && l.inviter_user_id !== user.id
    );
    setMyIncomingInvites(incoming);
  }, [pendingInvites, user]);

  const myOutgoingInvites = pendingInvites.filter((l) => l.inviter_user_id === user?.id);

  const getLinkedUserId = (link: AccountLink) =>
    link.inviter_user_id === user?.id ? link.invitee_user_id : link.inviter_user_id;

  const statusBadge: Record<string, string> = {
    pending: "bg-yellow-600/15 text-yellow-700 dark:text-yellow-400 border-yellow-600/30",
    accepted: "bg-emerald-700/15 text-emerald-700 dark:text-emerald-400 border-emerald-700/30",
  };

  const categoryScores = memberData ? computeCategoryScores(memberData.biomarkerResults) : [];

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xs tracking-[0.3em] uppercase text-primary font-body font-light mb-1">
            Linked Accounts
          </h2>
          <p className="text-sm text-muted-foreground font-body font-light">
            Link family members to manage payments and view health data.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setInviteOpen(true)}
          className="text-[10px] tracking-[0.15em] uppercase font-body font-light"
        >
          <UserPlus size={14} className="mr-1.5" /> Invite
        </Button>
      </div>

      {/* Incoming invites */}
      {myIncomingInvites.length > 0 && (
        <Card className="border-primary/30 bg-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs tracking-[0.2em] uppercase font-body font-light text-primary">
              Pending Invites for You
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {myIncomingInvites.map((invite) => (
              <div key={invite.id} className="flex items-center justify-between">
                <span className="text-sm font-body font-light text-foreground">
                  Someone invited you to link accounts
                </span>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => handleAcceptInvite(invite.id)} className="text-[10px] uppercase tracking-wider font-body font-light">
                    <Check size={12} className="mr-1" /> Accept
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => handleRemoveLink(invite.id)}>
                    <X size={14} />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Active links */}
      {links.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {links.map((link) => {
            const linkedId = getLinkedUserId(link);
            return (
              <Card key={link.id} className="border-border">
                <CardContent className="flex items-center justify-between py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                      <Users size={16} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-body font-light text-foreground">{link.invitee_email}</p>
                      <Badge variant="outline" className={`text-[9px] uppercase tracking-wider font-body ${statusBadge.accepted}`}>
                        Linked
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {linkedId && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => viewMember(linkedId, link.invitee_email)}
                        title="View data"
                      >
                        <Eye size={16} />
                      </Button>
                    )}
                    <Button variant="ghost" size="icon" onClick={() => handleRemoveLink(link.id)} title="Remove link">
                      <Trash2 size={14} className="text-destructive" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : myOutgoingInvites.length === 0 && (
        <Card className="border-border border-dashed">
          <CardContent className="py-8 text-center">
            <Users size={32} className="mx-auto text-muted-foreground/40 mb-3" />
            <p className="text-sm text-muted-foreground font-body font-light">
              No linked accounts yet. Invite a family member to get started.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Outgoing pending invites */}
      {myOutgoingInvites.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground font-body font-light">
            Pending Invitations
          </h3>
          {myOutgoingInvites.map((invite) => (
            <div key={invite.id} className="flex items-center justify-between py-2 px-3 bg-card border border-border rounded">
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-muted-foreground" />
                <span className="text-sm font-body font-light text-foreground">{invite.invitee_email}</span>
                <Badge variant="outline" className={`text-[9px] uppercase tracking-wider font-body ${statusBadge.pending}`}>
                  Pending
                </Badge>
              </div>
              <Button variant="ghost" size="icon" onClick={() => handleRemoveLink(invite.id)}>
                <X size={14} />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Invite dialog */}
      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-heading font-light text-foreground">Invite Family Member</DialogTitle>
            <DialogDescription className="text-sm font-body font-light text-muted-foreground">
              Enter their email address. They'll see the invite when they log into their account.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              type="email"
              placeholder="spouse@example.com"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              className="font-body font-light"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setInviteOpen(false)} className="text-[10px] uppercase tracking-wider font-body font-light">
              Cancel
            </Button>
            <Button onClick={handleSendInvite} disabled={sending || !inviteEmail.trim()} className="text-[10px] uppercase tracking-wider font-body font-light">
              {sending ? "Sending..." : "Send Invite"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View linked member data dialog */}
      <Dialog open={!!viewingMember} onOpenChange={(o) => !o && setViewingMember(null)}>
        <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-heading font-light text-foreground">
              {memberData?.profile.first_name
                ? `${memberData.profile.first_name}'s Health Dashboard`
                : viewingMember?.name}
            </DialogTitle>
          </DialogHeader>

          {loadingMember ? (
            <div className="py-12 text-center text-sm text-muted-foreground font-body font-light animate-pulse">
              Loading...
            </div>
          ) : memberData ? (
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="bg-card border border-border rounded-none h-auto p-0 w-full justify-start gap-0">
                {[
                  { value: "overview", icon: Activity, label: "Overview" },
                  { value: "peptides", icon: Pill, label: "Peptides" },
                  { value: "orders", icon: Package, label: "Orders" },
                ].map(({ value, icon: Icon, label }) => (
                  <TabsTrigger
                    key={value}
                    value={value}
                    className="rounded-none px-4 py-2.5 text-[10px] tracking-[0.15em] uppercase font-body font-light data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
                  >
                    <Icon size={12} className="mr-1.5" /> {label}
                  </TabsTrigger>
                ))}
              </TabsList>

              <TabsContent value="overview" className="mt-4 space-y-4">
                {/* Vitality Score */}
                <Card className="border-border">
                  <CardContent className="py-5">
                    <div className="flex items-center gap-4">
                      <div
                        className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-heading"
                        style={{
                          background: memberData.vitalityScore
                            ? `conic-gradient(${getScoreColor(memberData.vitalityScore)} ${(memberData.vitalityScore / 100) * 360}deg, hsl(var(--muted)) 0deg)`
                            : undefined,
                        }}
                      >
                        <span className="w-12 h-12 rounded-full bg-background flex items-center justify-center text-foreground">
                          {memberData.vitalityScore ?? "—"}
                        </span>
                      </div>
                      <div>
                        <p className="text-xs tracking-[0.2em] uppercase text-primary font-body font-light">Vitality Score</p>
                        <p className="text-sm text-muted-foreground font-body font-light">
                          {memberData.vitalityScore
                            ? memberData.vitalityScore >= 80 ? "Excellent" : memberData.vitalityScore >= 60 ? "Good" : "Needs attention"
                            : "No data yet"}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Category breakdown */}
                {categoryScores.length > 0 && (
                  <div className="grid gap-2">
                    {categoryScores.map((cat) => (
                      <div key={cat.catName} className="flex items-center gap-3 text-sm font-body font-light">
                        <span className="text-muted-foreground w-28 text-xs">{cat.catName}</span>
                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${cat.score}%`, backgroundColor: cat.color }} />
                        </div>
                        <span className="text-xs text-foreground w-8 text-right">{Math.round(cat.score)}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Quick stats */}
                <div className="grid grid-cols-3 gap-3">
                  <Card className="border-border">
                    <CardContent className="py-3 text-center">
                      <p className="text-2xl font-heading font-light text-foreground">{memberData.peptides.length}</p>
                      <p className="text-[10px] tracking-wider uppercase text-muted-foreground font-body">Active Peptides</p>
                    </CardContent>
                  </Card>
                  <Card className="border-border">
                    <CardContent className="py-3 text-center">
                      <p className="text-2xl font-heading font-light text-foreground">{memberData.requests.length}</p>
                      <p className="text-[10px] tracking-wider uppercase text-muted-foreground font-body">Requests</p>
                    </CardContent>
                  </Card>
                  <Card className="border-border">
                    <CardContent className="py-3 text-center">
                      <p className="text-2xl font-heading font-light text-foreground">{memberData.orders.length}</p>
                      <p className="text-[10px] tracking-wider uppercase text-muted-foreground font-body">Orders</p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="peptides" className="mt-4 space-y-3">
                {memberData.peptides.length > 0 ? memberData.peptides.map((p) => (
                  <Card key={p.id} className="border-border">
                    <CardContent className="py-3 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-body font-light text-foreground">{p.peptide_name}</p>
                        {p.dosage && <p className="text-xs text-muted-foreground font-body font-light">{p.dosage}</p>}
                      </div>
                      <Badge variant="outline" className="text-[9px] uppercase tracking-wider font-body">
                        {p.quantity_remaining} remaining
                      </Badge>
                    </CardContent>
                  </Card>
                )) : (
                  <p className="text-sm text-muted-foreground font-body font-light text-center py-6">No active peptides</p>
                )}

                {memberData.requests.length > 0 && (
                  <>
                    <h3 className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground font-body font-light pt-2">
                      Recent Requests
                    </h3>
                    {memberData.requests.map((r) => (
                      <div key={r.id} className="flex items-center justify-between py-2 px-3 bg-card border border-border rounded">
                        <span className="text-sm font-body font-light text-foreground">{r.peptide_name}</span>
                        <Badge variant="outline" className="text-[9px] uppercase tracking-wider font-body">
                          {r.status}
                        </Badge>
                      </div>
                    ))}
                  </>
                )}
              </TabsContent>

              <TabsContent value="orders" className="mt-4 space-y-3">
                {memberData.orders.length > 0 ? memberData.orders.map((o) => (
                  <div key={o.id} className="flex items-center justify-between py-2 px-3 bg-card border border-border rounded">
                    <span className="text-sm font-body font-light text-muted-foreground">
                      {new Date(o.created_at).toLocaleDateString()}
                    </span>
                    <Badge variant="outline" className="text-[9px] uppercase tracking-wider font-body">
                      {o.status}
                    </Badge>
                  </div>
                )) : (
                  <p className="text-sm text-muted-foreground font-body font-light text-center py-6">No orders yet</p>
                )}
              </TabsContent>
            </Tabs>
          ) : null}
        </DialogContent>
      </Dialog>
    </section>
  );
}
