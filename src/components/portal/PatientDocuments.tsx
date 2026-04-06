import { useState, useEffect, useCallback } from "react";
import { FileText, Download, Eye, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface Document {
  id: string;
  name: string;
  type: string;
  file_path: string;
  file_size: number | null;
  uploaded_at: string;
}

const typeLabel: Record<string, string> = {
  intake_form: "Intake Form",
  lab_order: "Lab Order",
  consent: "Consent Form",
  other: "Document",
};

export default function PatientDocuments() {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState<string | null>(null);

  const fetchDocuments = useCallback(async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("patient_documents" as any)
      .select("id, name, type, file_path, file_size, uploaded_at")
      .eq("user_id", user.id)
      .order("uploaded_at", { ascending: false });

    if (error) console.error("Failed to fetch documents:", error);
    else if (data) setDocuments(data as Document[]);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const handleDownload = async (doc: Document) => {
    setDownloading(doc.id);
    try {
      const { data, error } = await supabase.storage
        .from("patient-documents")
        .download(doc.file_path);

      if (error) throw error;

      const url = URL.createObjectURL(data);
      const a = document.createElement("a");
      a.href = url;
      a.download = doc.name.endsWith(".pdf") ? doc.name : `${doc.name}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download error:", err);
    } finally {
      setDownloading(null);
    }
  };

  const handleView = async (doc: Document) => {
    setDownloading(doc.id);
    try {
      const { data, error } = await supabase.storage
        .from("patient-documents")
        .createSignedUrl(doc.file_path, 300); // 5 min expiry

      if (error) throw error;
      if (data?.signedUrl) {
        window.open(data.signedUrl, "_blank");
      }
    } catch (err) {
      console.error("View error:", err);
      // Fallback to download
      handleDownload(doc);
    } finally {
      setDownloading(null);
    }
  };

  const formatSize = (bytes: number | null) => {
    if (!bytes) return "";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      <div>
        <p className="text-[10px] tracking-[0.35em] uppercase text-primary mb-2">
          Patient Records
        </p>
        <h2 className="text-2xl sm:text-3xl font-light tracking-tight text-foreground">
          Documents
        </h2>
        <p className="text-sm text-muted-foreground font-light mt-2">
          Signed consent forms, intake documents, and lab orders.
        </p>
      </div>

      {documents.length === 0 ? (
        <div
          className="rounded-xl border border-border/30 overflow-hidden"
          style={{ background: "rgba(255,255,255,0.02)" }}
        >
          <div className="px-6 py-12 flex flex-col items-center gap-4 text-center">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/5">
              <FileText size={28} className="text-primary/40" strokeWidth={1.2} />
            </div>
            <div>
              <p className="text-sm font-body font-light text-foreground">No documents yet</p>
              <p className="text-[10px] text-muted-foreground font-body font-light mt-1">
                Documents will appear here after you complete your intake form or receive lab orders.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          {documents.map((doc) => {
            const isLoading = downloading === doc.id;
            return (
              <div
                key={doc.id}
                className="rounded-xl border border-border/30 overflow-hidden"
                style={{ background: "rgba(255,255,255,0.02)" }}
              >
                <div className="px-4 sm:px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="flex items-center justify-center w-10 h-10 sm:w-9 sm:h-9 rounded-lg bg-primary/5 shrink-0">
                      <FileText size={16} className="text-primary/60" strokeWidth={1.2} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-body font-light text-foreground truncate">
                        {doc.name}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                        <span className="text-[10px] text-primary/50 font-body uppercase tracking-wider">
                          {typeLabel[doc.type] || doc.type}
                        </span>
                        <span className="text-[10px] text-muted-foreground/30">·</span>
                        <span className="text-[10px] text-muted-foreground/40 font-body font-light">
                          {new Date(doc.uploaded_at).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                        {doc.file_size && (
                          <>
                            <span className="text-[10px] text-muted-foreground/30">·</span>
                            <span className="text-[10px] text-muted-foreground/40 font-body font-light">
                              {formatSize(doc.file_size)}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleView(doc)}
                      disabled={isLoading}
                      className="flex items-center justify-center gap-1.5 px-4 py-2.5 sm:px-3 sm:py-1.5 text-xs sm:text-[10px] tracking-[0.1em] uppercase font-body font-extralight border border-border/40 text-muted-foreground/60 hover:text-foreground hover:border-border/60 transition-colors flex-1 sm:flex-none"
                    >
                      {isLoading ? (
                        <Clock size={12} className="animate-spin" />
                      ) : (
                        <Eye size={12} />
                      )}
                      View
                    </button>
                    <button
                      onClick={() => handleDownload(doc)}
                      disabled={isLoading}
                      className="flex items-center justify-center gap-1.5 px-4 py-2.5 sm:px-3 sm:py-1.5 text-xs sm:text-[10px] tracking-[0.1em] uppercase font-body font-extralight border border-primary/30 text-primary/60 hover:text-primary hover:border-primary/50 transition-colors flex-1 sm:flex-none"
                    >
                      <Download size={12} />
                      Download
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
