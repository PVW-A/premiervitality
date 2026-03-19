import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Bell, BellOff, AlertTriangle, Clock } from "lucide-react";
import { toast } from "sonner";

// Convert local HH:MM to UTC HH:MM
const localToUtc = (localTime: string): string => {
  const [h, m] = localTime.split(":").map(Number);
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return `${String(d.getUTCHours()).padStart(2, "0")}:${String(d.getUTCMinutes()).padStart(2, "0")}`;
};

// Convert UTC HH:MM to local HH:MM
const utcToLocal = (utcTime: string): string => {
  const [h, m] = utcTime.split(":").map(Number);
  const d = new Date();
  d.setUTCHours(h, m, 0, 0);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
};

interface PatientPeptide {
  id: string;
  peptide_id: string;
  peptide_name?: string;
  dosage: string | null;
  quantity_remaining: number;
  usage_per_day: number;
}

interface ReminderConfig {
  id?: string;
  active: boolean;
  times_per_day: number;
  reminder_times: string[];
  low_vial_alert_sent: boolean;
}

interface Props {
  peptide: PatientPeptide;
  userId: string;
}

const DEFAULT_TIMES: Record<number, string[]> = {
  1: ["08:00"],
  2: ["08:00", "20:00"],
  3: ["08:00", "14:00", "20:00"],
};

export default function PeptideReminders({ peptide, userId }: Props) {
  const [config, setConfig] = useState<ReminderConfig>({
    active: false,
    times_per_day: 1,
    reminder_times: ["08:00"],
    low_vial_alert_sent: false,
  });
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);

  const daysRemaining =
    peptide.usage_per_day > 0
      ? Math.floor(peptide.quantity_remaining / peptide.usage_per_day)
      : null;

  useEffect(() => {
    loadReminder();
  }, [peptide.id]);

  const loadReminder = async () => {
    const { data, error } = await supabase
      .from("peptide_reminders")
      .select("*")
      .eq("patient_peptide_id", peptide.id)
      .eq("user_id", userId)
      .maybeSingle();

    if (data && !error) {
      const utcTimes = Array.isArray(data.reminder_times)
        ? data.reminder_times as string[]
        : ["08:00"];
      // Convert stored UTC times to local for display
      const localTimes = utcTimes.map(utcToLocal);
      setConfig({
        id: data.id,
        active: data.active,
        times_per_day: data.times_per_day,
        reminder_times: localTimes,
        low_vial_alert_sent: data.low_vial_alert_sent,
      });
    }
    setLoaded(true);
  };

  const saveReminder = async (updates: Partial<ReminderConfig>) => {
    setSaving(true);
    const merged = { ...config, ...updates };

    // Convert local times to UTC for storage
    const utcTimes = merged.reminder_times.map(localToUtc);

    const payload = {
      user_id: userId,
      patient_peptide_id: peptide.id,
      peptide_name: peptide.peptide_name || "Unknown",
      dosage: peptide.dosage,
      active: merged.active,
      times_per_day: merged.times_per_day,
      reminder_times: utcTimes,
    };

    let error;
    if (config.id) {
      ({ error } = await supabase
        .from("peptide_reminders")
        .update(payload)
        .eq("id", config.id));
    } else {
      const { data, error: insertErr } = await supabase
        .from("peptide_reminders")
        .insert(payload)
        .select("id")
        .single();
      error = insertErr;
      if (data) {
        setConfig((prev) => ({ ...prev, ...updates, id: data.id }));
        setSaving(false);
        return;
      }
    }

    if (error) {
      console.error("Save reminder error:", error);
      toast.error("Failed to save reminder settings");
    } else {
      setConfig((prev) => ({ ...prev, ...updates }));
      toast.success("Reminder settings saved");
    }
    setSaving(false);
  };

  const handleToggle = (checked: boolean) => {
    saveReminder({ active: checked });
  };

  const handleFrequencyChange = (val: string) => {
    const freq = parseInt(val);
    const times = DEFAULT_TIMES[freq] || ["08:00"];
    saveReminder({ times_per_day: freq, reminder_times: times });
  };

  const handleTimeChange = (index: number, value: string) => {
    const newTimes = [...config.reminder_times];
    newTimes[index] = value;
    saveReminder({ reminder_times: newTimes });
  };

  if (!loaded) return null;

  const tzAbbr = Intl.DateTimeFormat().resolvedOptions().timeZone;

  return (
    <div className="pt-3 border-t border-border space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {config.active ? (
            <Bell size={14} className="text-primary" />
          ) : (
            <BellOff size={14} className="text-muted-foreground" />
          )}
          <span className="text-xs tracking-[0.15em] uppercase font-body font-light text-muted-foreground">
            SMS Reminders
          </span>
        </div>
        <Switch
          checked={config.active}
          onCheckedChange={handleToggle}
          disabled={saving}
        />
      </div>

      {/* Low vial warning */}
      {daysRemaining !== null && daysRemaining <= 10 && (
        <div className="flex items-center gap-2 text-xs text-destructive font-body font-light bg-destructive/10 border border-destructive/20 px-3 py-2 rounded">
          <AlertTriangle size={13} />
          <span>~{daysRemaining} days remaining - low supply alert active</span>
        </div>
      )}

      {config.active && (
        <div className="space-y-3 pl-1">
          {/* Frequency */}
          <div className="space-y-1">
            <Label className="text-xs font-body font-light text-muted-foreground">
              Frequency
            </Label>
            <Select
              value={String(config.times_per_day)}
              onValueChange={handleFrequencyChange}
              disabled={saving}
            >
              <SelectTrigger className="h-8 text-xs font-body font-light">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border z-[100]">
                <SelectItem value="1" className="text-xs font-body font-light">1× per day</SelectItem>
                <SelectItem value="2" className="text-xs font-body font-light">2× per day</SelectItem>
                <SelectItem value="3" className="text-xs font-body font-light">3× per day</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Time pickers */}
          <div className="space-y-1">
            <Label className="text-xs font-body font-light text-muted-foreground flex items-center gap-1">
              <Clock size={12} /> Reminder Times ({tzAbbr})
            </Label>
            <div className="flex flex-wrap gap-3">
              {config.reminder_times.map((time, i) => {
                const [hour, minute] = time.split(":");
                const hourNum = parseInt(hour);
                const isPM = hourNum >= 12;
                const display12 = hourNum === 0 ? 12 : hourNum > 12 ? hourNum - 12 : hourNum;

                return (
                  <div key={i} className="flex items-center gap-1">
                    {/* Hour select */}
                    <Select
                      value={hour}
                      onValueChange={(val) => handleTimeChange(i, `${val}:${minute}`)}
                      disabled={saving}
                    >
                      <SelectTrigger className="h-8 w-[4.5rem] text-xs font-body font-light">
                        <SelectValue>{display12}</SelectValue>
                      </SelectTrigger>
                      <SelectContent className="bg-popover border-border z-[100] max-h-48">
                        {Array.from({ length: 12 }, (_, h) => {
                          const actualHour = isPM ? (h === 0 ? 12 : h + 12) : h;
                          const padded = String(actualHour).padStart(2, "0");
                          const label = h === 0 ? "12" : String(h);
                          return (
                            <SelectItem key={padded} value={padded} className="text-xs font-body font-light">
                              {label}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>

                    <span className="text-xs text-muted-foreground">:</span>

                    {/* Minute select */}
                    <Select
                      value={minute}
                      onValueChange={(val) => handleTimeChange(i, `${hour}:${val}`)}
                      disabled={saving}
                    >
                      <SelectTrigger className="h-8 w-[4.5rem] text-xs font-body font-light">
                        <SelectValue>{minute}</SelectValue>
                      </SelectTrigger>
                      <SelectContent className="bg-popover border-border z-[100] max-h-48">
                        {["00", "05", "10", "15", "20", "25", "30", "35", "40", "45", "50", "55"].map((m) => (
                          <SelectItem key={m} value={m} className="text-xs font-body font-light">
                            {m}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {/* AM/PM toggle */}
                    <Select
                      value={isPM ? "PM" : "AM"}
                      onValueChange={(val) => {
                        const h12 = hourNum % 12;
                        const newHour = val === "PM" ? (h12 === 0 ? 12 : h12 + 12) : h12;
                        handleTimeChange(i, `${String(newHour).padStart(2, "0")}:${minute}`);
                      }}
                      disabled={saving}
                    >
                      <SelectTrigger className="h-8 w-[4.5rem] text-xs font-body font-light">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-popover border-border z-[100]">
                        <SelectItem value="AM" className="text-xs font-body font-light">AM</SelectItem>
                        <SelectItem value="PM" className="text-xs font-body font-light">PM</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
