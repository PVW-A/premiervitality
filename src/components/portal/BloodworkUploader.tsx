import { useState, useRef } from "react";
import { Upload, FileText, CheckCircle, Clock, Sparkles, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface BloodworkUpload {
  id: string;
  file_name: string;
  file_path: string;
  status: string;
  admin_notes: string | null;
  created_at: string;
  reviewed_at: string | null;
}

const statusStyles: Record<string, string> = {
  pending_review: "bg-yellow-600/15 text-yellow-700 dark:text-yellow-400 border-yellow-600/30",
  reviewed: "bg-emerald-700/15 text-emerald-700 dark:text-emerald-400 border-emerald-700/30",
  needs_resubmit: "bg-destructive/20 text-destructive border-destructive/30",
  parsing: "bg-primary/20 text-primary border-primary/30",
};

const statusLabel: Record<string, string> = {
  pending_review: "Pending Review",
  reviewed: "Reviewed",
  needs_resubmit: "Resubmit Needed",
  parsing: "AI Analyzing…",
};

interface Props {
  uploads: BloodworkUpload[];
  onRefresh: () => void;
}

export default function BloodworkUploader({ uploads, onRefresh }: Props) {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [parsingId, setParsingId] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    const maxSize = 20 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("File must be under 20MB");
      return;
    }

    const allowed = ["application/pdf", "image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(file.type)) {
      toast.error("Please upload a PDF or image (JPG, PNG, WebP)");
      return;
    }

    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const filePath = `${user.id}/${Date.now()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("bloodwork")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: insertData, error: dbError } = await supabase
        .from("bloodwork_uploads")
        .insert({
          user_id: user.id,
          file_path: filePath,
          file_name: file.name,
        })
        .select("id")
        .single();

      if (dbError) throw dbError;

      toast.success("Bloodwork uploaded - AI is analyzing your results…");
      onRefresh();

      // Trigger AI parsing
      if (insertData?.id) {
        setParsingId(insertData.id);
        try {
          const { data: parseResult, error: parseError } = await supabase.functions.invoke(
            "parse-bloodwork",
            { body: { upload_id: insertData.id } }
          );

          if (parseError) {
            console.error("Parse error:", parseError);
            toast.error("AI analysis had an issue - your provider can still review manually.");
          } else if (parseResult?.markers_found > 0) {
            toast.success(
              `AI found ${parseResult.markers_found} biomarker${parseResult.markers_found > 1 ? "s" : ""} - check your Premier Markers!`,
              { duration: 6000 }
            );
          } else {
            toast.info("AI couldn't extract markers from this file - your provider will review manually.");
          }
        } catch {
          toast.error("AI analysis unavailable - your provider will review manually.");
        } finally {
          setParsingId(null);
          onRefresh();
        }
      }
    } catch (err: any) {
      toast.error(err.message || "Upload failed");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-xs tracking-[0.2em] uppercase text-foreground font-body font-light flex items-center gap-2">
            <Upload size={14} strokeWidth={1.2} className="text-primary" />
            Upload Bloodwork
          </h3>
          <p className="text-xs text-muted-foreground font-body font-light mt-1">
            Upload your lab results (PDF or image) - AI will automatically extract and chart your biomarkers.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <input
          ref={fileRef}
          type="file"
          accept=".pdf,.jpg,.jpeg,.png,.webp"
          className="hidden"
          onChange={handleUpload}
        />
        <Button
          variant="outline"
          size="sm"
          onClick={() => fileRef.current?.click()}
          disabled={uploading || !!parsingId}
          className="text-xs tracking-wider uppercase font-body font-light rounded-none border-primary/40 text-primary hover:bg-primary/10"
        >
          {uploading ? (
            <div className="w-4 h-4 border border-primary/40 border-t-primary rounded-full animate-spin mr-2" />
          ) : parsingId ? (
            <Loader2 size={14} className="mr-2 animate-spin" />
          ) : (
            <Upload size={14} className="mr-2" />
          )}
          {uploading ? "Uploading…" : parsingId ? "AI Analyzing…" : "Choose File"}
        </Button>
        <span className="text-[10px] text-muted-foreground font-body font-light">
          PDF, JPG, PNG - max 20MB
        </span>
      </div>

      {uploads.length > 0 && (
        <div className="space-y-2">
          {uploads.map((u) => {
            const isParsing = parsingId === u.id;
            const displayStatus = isParsing ? "parsing" : u.status;

            return (
              <Card key={u.id} className="border-border bg-card">
                <CardContent className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText size={16} strokeWidth={1.2} className="text-primary/60" />
                    <div>
                      <p className="text-sm font-body font-light text-foreground">{u.file_name}</p>
                      <p className="text-[10px] text-muted-foreground font-body font-light">
                        {new Date(u.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={`text-[9px] ${statusStyles[displayStatus] || statusStyles.pending_review}`}>
                      {isParsing ? (
                        <Sparkles size={10} className="mr-1 animate-pulse" />
                      ) : displayStatus === "reviewed" ? (
                        <CheckCircle size={10} className="mr-1" />
                      ) : (
                        <Clock size={10} className="mr-1" />
                      )}
                      {statusLabel[displayStatus] || displayStatus}
                    </Badge>
                  </div>
                </CardContent>
                {u.admin_notes && (
                  <div className="px-6 pb-3">
                    <p className="text-xs text-muted-foreground font-body font-light italic border-t border-border pt-2">
                      {u.admin_notes}
                    </p>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
