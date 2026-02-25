import { useState, useRef } from "react";
import { Upload, FileText, CheckCircle, Clock } from "lucide-react";
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
  pending_review: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  reviewed: "bg-green-500/20 text-green-400 border-green-500/30",
  needs_resubmit: "bg-destructive/20 text-destructive border-destructive/30",
};

const statusLabel: Record<string, string> = {
  pending_review: "Pending Review",
  reviewed: "Reviewed",
  needs_resubmit: "Resubmit Needed",
};

interface Props {
  uploads: BloodworkUpload[];
  onRefresh: () => void;
}

export default function BloodworkUploader({ uploads, onRefresh }: Props) {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    const maxSize = 20 * 1024 * 1024; // 20MB
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

      const { error: dbError } = await supabase.from("bloodwork_uploads").insert({
        user_id: user.id,
        file_path: filePath,
        file_name: file.name,
      });

      if (dbError) throw dbError;

      toast.success("Bloodwork uploaded — your provider will review it shortly.");
      onRefresh();
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
            Upload your lab results (PDF or image) and your provider will enter the values into your tracker.
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
          disabled={uploading}
          className="text-xs tracking-wider uppercase font-body font-light rounded-none border-primary/40 text-primary hover:bg-primary/10"
        >
          {uploading ? (
            <div className="w-4 h-4 border border-primary/40 border-t-primary rounded-full animate-spin mr-2" />
          ) : (
            <Upload size={14} className="mr-2" />
          )}
          {uploading ? "Uploading..." : "Choose File"}
        </Button>
        <span className="text-[10px] text-muted-foreground font-body font-light">
          PDF, JPG, PNG — max 20MB
        </span>
      </div>

      {uploads.length > 0 && (
        <div className="space-y-2">
          {uploads.map((u) => (
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
                  <Badge variant="outline" className={`text-[9px] ${statusStyles[u.status] || statusStyles.pending_review}`}>
                    {u.status === "reviewed" ? <CheckCircle size={10} className="mr-1" /> : <Clock size={10} className="mr-1" />}
                    {statusLabel[u.status] || u.status}
                  </Badge>
                </div>
              </CardContent>
              {u.admin_notes && (
                <div className="px-6 pb-3">
                  <p className="text-xs text-muted-foreground font-body font-light italic border-t border-border pt-2">
                    Provider note: {u.admin_notes}
                  </p>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
