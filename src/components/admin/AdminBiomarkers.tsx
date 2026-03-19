import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { FileText, Plus, Eye, CheckCircle, Activity } from "lucide-react";
import { toast } from "sonner";

interface Patient {
  user_id: string;
  first_name: string | null;
  last_name: string | null;
}

interface BloodworkUpload {
  id: string;
  user_id: string;
  file_name: string;
  file_path: string;
  status: string;
  admin_notes: string | null;
  created_at: string;
  patient_name?: string;
}

const markerOptions = [
  { name: "Testosterone (Total)", category: "Hormones", unit: "ng/dL", low: 300, high: 1000 },
  { name: "Free Testosterone", category: "Hormones", unit: "ng/dL", low: 9, high: 30 },
  { name: "Estradiol (E2)", category: "Hormones", unit: "pg/mL", low: 20, high: 50 },
  { name: "IGF-1", category: "Hormones", unit: "ng/mL", low: 100, high: 300 },
  { name: "DHEA-S", category: "Hormones", unit: "µg/dL", low: 100, high: 400 },
  { name: "Fasting Glucose", category: "Metabolic Panel", unit: "mg/dL", low: 70, high: 99 },
  { name: "HbA1c", category: "Metabolic Panel", unit: "%", low: 4.0, high: 5.7 },
  { name: "Insulin (Fasting)", category: "Metabolic Panel", unit: "µIU/mL", low: 2, high: 25 },
  { name: "TSH", category: "Thyroid", unit: "mIU/L", low: 0.4, high: 4.0 },
  { name: "Free T3", category: "Thyroid", unit: "pg/mL", low: 2.3, high: 4.2 },
  { name: "Free T4", category: "Thyroid", unit: "ng/dL", low: 0.8, high: 1.8 },
  { name: "hs-CRP", category: "Inflammation", unit: "mg/L", low: 0, high: 1.0 },
  { name: "Homocysteine", category: "Inflammation", unit: "µmol/L", low: 5, high: 15 },
  { name: "ESR", category: "Inflammation", unit: "mm/hr", low: 0, high: 20 },
  { name: "ALT", category: "Liver & Kidney", unit: "U/L", low: 7, high: 56 },
  { name: "AST", category: "Liver & Kidney", unit: "U/L", low: 10, high: 40 },
  { name: "Creatinine", category: "Liver & Kidney", unit: "mg/dL", low: 0.7, high: 1.3 },
  { name: "BUN", category: "Liver & Kidney", unit: "mg/dL", low: 7, high: 20 },
  { name: "Vitamin D (25-OH)", category: "Cognitive & Neuro", unit: "ng/mL", low: 40, high: 80 },
  { name: "Vitamin B12", category: "Cognitive & Neuro", unit: "pg/mL", low: 200, high: 900 },
  { name: "Folate", category: "Cognitive & Neuro", unit: "ng/mL", low: 2.7, high: 17 },
];

interface Props {
  patients: Patient[];
}

export default function AdminBiomarkers({ patients }: Props) {
  const [uploads, setUploads] = useState<BloodworkUpload[]>([]);
  const [entryDialogOpen, setEntryDialogOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState("");
  const [labDate, setLabDate] = useState("");
  const [markerValues, setMarkerValues] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [reviewNotes, setReviewNotes] = useState("");
  const [reviewingId, setReviewingId] = useState<string | null>(null);

  const fetchUploads = useCallback(async () => {
    const { data } = await supabase
      .from("bloodwork_uploads")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) {
      const patientMap = new Map(patients.map(p => [p.user_id, `${p.first_name || ""} ${p.last_name || ""}`.trim() || "Unknown"]));
      setUploads(data.map((u: any) => ({
        ...u,
        patient_name: patientMap.get(u.user_id) || "Unknown",
      })));
    }
  }, [patients]);

  useEffect(() => {
    fetchUploads();
  }, [fetchUploads]);

  const handleViewFile = async (filePath: string) => {
    const { data } = await supabase.storage.from("bloodwork").createSignedUrl(filePath, 300);
    if (data?.signedUrl) {
      window.open(data.signedUrl, "_blank");
    } else {
      toast.error("Could not generate download link");
    }
  };

  const handleMarkReviewed = async (uploadId: string) => {
    await supabase.from("bloodwork_uploads").update({
      status: "reviewed",
      admin_notes: reviewNotes || null,
      reviewed_at: new Date().toISOString(),
    }).eq("id", uploadId);
    setReviewingId(null);
    setReviewNotes("");
    toast.success("Upload marked as reviewed");
    fetchUploads();
  };

  const handleSaveMarkers = async () => {
    if (!selectedPatient || !labDate) {
      toast.error("Select a patient and lab date");
      return;
    }

    const entries = Object.entries(markerValues)
      .filter(([, val]) => val.trim() !== "")
      .map(([name, val]) => {
        const marker = markerOptions.find(m => m.name === name)!;
        const value = parseFloat(val);
        let status = "in_range";
        if (value < marker.low) status = "below";
        if (value > marker.high) status = "above";
        return {
          user_id: selectedPatient,
          marker_name: marker.name,
          category: marker.category,
          value,
          unit: marker.unit,
          reference_low: marker.low,
          reference_high: marker.high,
          status,
          lab_date: labDate,
        };
      });

    if (entries.length === 0) {
      toast.error("Enter at least one marker value");
      return;
    }

    setSaving(true);
    const { error } = await supabase.from("biomarker_results").insert(entries);
    setSaving(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success(`${entries.length} biomarker${entries.length > 1 ? "s" : ""} saved`);
    setMarkerValues({});
    setLabDate("");
    setSelectedPatient("");
    setEntryDialogOpen(false);
  };

  const pendingUploads = uploads.filter(u => u.status === "pending_review");

  // Group markers by category for the entry form
  const groupedMarkers = markerOptions.reduce((acc, m) => {
    if (!acc[m.category]) acc[m.category] = [];
    acc[m.category].push(m);
    return acc;
  }, {} as Record<string, typeof markerOptions>);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-heading font-light text-foreground">Biomarkers & Lab Work</h2>
          <p className="text-sm text-muted-foreground font-body font-light mt-1">
            Review patient bloodwork uploads and enter biomarker values.
          </p>
        </div>
        <Dialog open={entryDialogOpen} onOpenChange={setEntryDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="text-xs tracking-wider uppercase font-body font-light rounded-none">
              <Plus size={14} className="mr-1" /> Enter Lab Results
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border max-w-2xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-heading font-light text-foreground">Enter Biomarker Results</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label className="text-xs tracking-wider uppercase text-muted-foreground font-body font-light">Patient</Label>
                  <Select value={selectedPatient} onValueChange={setSelectedPatient}>
                    <SelectTrigger className="bg-secondary border-border"><SelectValue placeholder="Select patient" /></SelectTrigger>
                    <SelectContent>
                      {patients.map(p => (
                        <SelectItem key={p.user_id} value={p.user_id}>{p.first_name} {p.last_name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs tracking-wider uppercase text-muted-foreground font-body font-light">Lab Date</Label>
                  <Input type="date" value={labDate} onChange={e => setLabDate(e.target.value)} className="bg-secondary border-border" />
                </div>
              </div>

              <p className="text-xs text-muted-foreground font-body font-light">
                Enter values for any markers from this lab draw. Leave blank for markers not tested.
              </p>

              {Object.entries(groupedMarkers).map(([category, markers]) => (
                <div key={category}>
                  <h4 className="text-[10px] tracking-[0.2em] uppercase text-primary font-body font-light mb-2">{category}</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {markers.map((m) => (
                      <div key={m.name} className="flex items-center gap-2">
                        <div className="flex-1">
                          <Input
                            type="number"
                            step="0.01"
                            placeholder={`${m.name} (${m.unit})`}
                            value={markerValues[m.name] || ""}
                            onChange={e => setMarkerValues(prev => ({ ...prev, [m.name]: e.target.value }))}
                            className="bg-secondary border-border text-sm h-9"
                          />
                        </div>
                        <span className="text-[9px] text-muted-foreground font-body font-light w-16 text-right">
                          {m.low}–{m.high}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <Button
                onClick={handleSaveMarkers}
                disabled={saving}
                className="w-full text-xs tracking-wider uppercase font-body font-light rounded-none"
              >
                {saving ? "Saving..." : "Save Biomarkers"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Pending uploads */}
      {pendingUploads.length > 0 && (
        <div>
          <h3 className="text-xs tracking-[0.2em] uppercase text-foreground font-body font-light mb-3 flex items-center gap-2">
            <FileText size={14} className="text-primary" />
            Pending Review ({pendingUploads.length})
          </h3>
          <div className="space-y-2">
            {pendingUploads.map((u) => (
              <Card key={u.id} className="border-border bg-card">
                <CardContent className="py-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText size={16} strokeWidth={1.2} className="text-primary/60" />
                      <div>
                        <p className="text-sm font-body font-light text-foreground">{u.patient_name}</p>
                        <p className="text-xs text-muted-foreground font-body font-light">
                          {u.file_name} · {new Date(u.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewFile(u.file_path)}
                        className="text-xs font-body font-light rounded-none border-primary/40 text-primary hover:bg-primary/10 h-8"
                      >
                        <Eye size={12} className="mr-1" /> View
                      </Button>
                      {reviewingId === u.id ? (
                        <div className="flex items-center gap-2">
                          <Input
                            placeholder="Notes (optional)"
                            value={reviewNotes}
                            onChange={e => setReviewNotes(e.target.value)}
                            className="bg-secondary border-border text-xs h-8 w-40"
                          />
                          <Button
                            size="sm"
                            onClick={() => handleMarkReviewed(u.id)}
                            className="text-xs font-body font-light rounded-none h-8"
                          >
                            <CheckCircle size={12} className="mr-1" /> Done
                          </Button>
                        </div>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setReviewingId(u.id)}
                          className="text-xs font-body font-light rounded-none h-8"
                        >
                          Mark Reviewed
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* All uploads */}
      <div>
        <h3 className="text-xs tracking-[0.2em] uppercase text-foreground font-body font-light mb-3 flex items-center gap-2">
          <Activity size={14} className="text-primary" />
          All Uploads
        </h3>
        {uploads.length === 0 ? (
          <Card className="border-border bg-card">
            <CardContent className="py-8 text-center">
              <p className="text-sm text-muted-foreground font-body font-light">No bloodwork uploads yet.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {uploads.map((u) => (
              <Card key={u.id} className="border-border bg-card">
                <CardContent className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText size={14} strokeWidth={1.2} className="text-muted-foreground" />
                    <div>
                      <p className="text-sm font-body font-light text-foreground">{u.patient_name} - {u.file_name}</p>
                      <p className="text-[10px] text-muted-foreground font-body font-light">
                        {new Date(u.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={`text-[9px] ${
                      u.status === "reviewed" ? "bg-green-500/20 text-green-400 border-green-500/30" : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                    }`}>
                      {u.status === "reviewed" ? "Reviewed" : "Pending"}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleViewFile(u.file_path)}
                      className="text-muted-foreground hover:text-primary h-8 w-8"
                    >
                      <Eye size={14} />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
