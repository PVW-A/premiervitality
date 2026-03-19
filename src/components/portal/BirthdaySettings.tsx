import { useState, useEffect } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

interface BirthdaySettingsProps {
  userId: string;
}

const BirthdaySettings = ({ userId }: BirthdaySettingsProps) => {
  const [birthday, setBirthday] = useState<Date | undefined>();
  const [savedBirthday, setSavedBirthday] = useState<string | null>(null);
  const [locked, setLocked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("birthday, birthday_locked")
        .eq("user_id", userId)
        .single();
      if (data) {
        setSavedBirthday((data as any).birthday || null);
        setLocked((data as any).birthday_locked || false);
        if ((data as any).birthday) {
          setBirthday(new Date((data as any).birthday + "T00:00:00"));
        }
      }
      setLoading(false);
    };
    fetchProfile();
  }, [userId]);

  const handleSave = async () => {
    if (!birthday) return;
    setSaving(true);
    try {
      const dateStr = format(birthday, "yyyy-MM-dd");
      const { error } = await supabase
        .from("profiles")
        .update({ birthday: dateStr, birthday_locked: true } as any)
        .eq("user_id", userId);
      if (error) throw error;
      setSavedBirthday(dateStr);
      setLocked(true);
      toast.success("Birthday saved and locked.");
    } catch (e: any) {
      toast.error(e.message || "Failed to save birthday");
    } finally {
      setSaving(false);
      setConfirmOpen(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground text-sm font-body font-light animate-pulse">Loading…</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-lg font-heading font-light text-foreground">
            Date of Birth
          </CardTitle>
          <p className="text-xs text-muted-foreground font-body font-light mt-1">
            {locked
              ? "Your birthday has been set and is now locked."
              : "You may only set your birthday once. After saving, it cannot be changed."}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {locked && savedBirthday ? (
            <div className="flex items-center gap-3 py-4">
              <span className="text-2xl">🎂</span>
              <div>
                <p className="text-foreground font-body font-light text-lg">
                  {format(new Date(savedBirthday + "T00:00:00"), "MMMM d, yyyy")}
                </p>
                <p className="text-[11px] text-muted-foreground/60 font-body font-light mt-0.5">
                  🔒 Locked - contact support to change
                </p>
              </div>
            </div>
          ) : (
            <>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-body font-light bg-secondary border-border",
                      !birthday && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {birthday ? format(birthday, "MMMM d, yyyy") : "Select your birthday"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={birthday}
                    onSelect={setBirthday}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1920-01-01")
                    }
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                    captionLayout="dropdown-buttons"
                    fromYear={1920}
                    toYear={new Date().getFullYear()}
                  />
                </PopoverContent>
              </Popover>

              <Button
                onClick={() => setConfirmOpen(true)}
                disabled={!birthday}
                className="w-full text-xs tracking-wider uppercase font-body font-light rounded-none"
              >
                Save Birthday
              </Button>

              <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
                <AlertDialogContent className="bg-card border-border">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="font-heading font-light text-foreground">
                      Confirm Your Birthday
                    </AlertDialogTitle>
                    <AlertDialogDescription className="font-body font-light text-muted-foreground">
                      You are about to set your date of birth to{" "}
                      <span className="text-foreground font-medium">
                        {birthday ? format(birthday, "MMMM d, yyyy") : ""}
                      </span>
                      . This action <span className="text-destructive font-medium">cannot be undone</span> - your birthday will be permanently locked after saving.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="font-body font-light text-xs tracking-wider uppercase rounded-none">
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleSave}
                      disabled={saving}
                      className="font-body font-light text-xs tracking-wider uppercase rounded-none"
                    >
                      {saving ? "Saving…" : "Yes, Lock My Birthday"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BirthdaySettings;
