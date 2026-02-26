import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Key, Sun, Moon, LogOut, UserCircle, CalendarIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA",
  "KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT",
  "VA","WA","WV","WI","WY",
];

interface UserSettingsMenuProps {
  firstName: string | null;
  lastName: string | null;
  userId: string;
  onSignOut: () => void;
  onProfileUpdated?: () => void;
}

const UserSettingsMenu = ({ firstName, lastName, userId, onSignOut, onProfileUpdated }: UserSettingsMenuProps) => {
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  // Profile fields
  const [profileLoading, setProfileLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [fName, setFName] = useState("");
  const [lName, setLName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressCity, setAddressCity] = useState("");
  const [addressState, setAddressState] = useState("");
  const [addressZip, setAddressZip] = useState("");
  const [birthday, setBirthday] = useState<Date | undefined>();
  const [birthdayLocked, setBirthdayLocked] = useState(false);
  const [savedBirthday, setSavedBirthday] = useState<string | null>(null);
  const [confirmBirthdayOpen, setConfirmBirthdayOpen] = useState(false);
  const [pendingBirthday, setPendingBirthday] = useState<Date | undefined>();

  const displayName = [firstName, lastName].filter(Boolean).join(" ") || "Account";

  const loadProfile = async () => {
    setProfileLoading(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      setEmail(userData?.user?.email || "");

      const { data } = await supabase
        .from("profiles")
        .select("first_name, last_name, phone, address_line1, address_city, address_state, address_zip, birthday, birthday_locked")
        .eq("user_id", userId)
        .single();
      if (data) {
        setFName(data.first_name || "");
        setLName(data.last_name || "");
        setPhone(data.phone || "");
        setAddressLine1(data.address_line1 || "");
        setAddressCity(data.address_city || "");
        setAddressState(data.address_state || "");
        setAddressZip(data.address_zip || "");
        setBirthdayLocked(data.birthday_locked || false);
        setSavedBirthday(data.birthday || null);
        if (data.birthday) {
          setBirthday(new Date(data.birthday + "T00:00:00"));
        } else {
          setBirthday(undefined);
        }
      }
    } catch (e) {
      console.error("Failed to load profile", e);
    } finally {
      setProfileLoading(false);
    }
  };

  useEffect(() => {
    if (profileDialogOpen) loadProfile();
  }, [profileDialogOpen]);

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const update: Record<string, unknown> = {
        first_name: fName.trim() || null,
        last_name: lName.trim() || null,
        phone: phone.trim() || null,
        address_line1: addressLine1.trim() || null,
        address_city: addressCity.trim() || null,
        address_state: addressState || null,
        address_zip: addressZip.trim() || null,
      };

      const { error } = await supabase
        .from("profiles")
        .update(update)
        .eq("user_id", userId);
      if (error) throw error;
      toast.success("Profile updated");
      onProfileUpdated?.();
    } catch (e: any) {
      toast.error(e.message || "Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  const handleBirthdaySelect = (date: Date | undefined) => {
    if (!date || birthdayLocked) return;
    setPendingBirthday(date);
    setConfirmBirthdayOpen(true);
  };

  const handleConfirmBirthday = async () => {
    if (!pendingBirthday) return;
    setSaving(true);
    try {
      const dateStr = format(pendingBirthday, "yyyy-MM-dd");
      const { error } = await supabase
        .from("profiles")
        .update({ birthday: dateStr, birthday_locked: true } as any)
        .eq("user_id", userId);
      if (error) throw error;
      setBirthday(pendingBirthday);
      setSavedBirthday(dateStr);
      setBirthdayLocked(true);
      toast.success("Birthday saved and locked.");
    } catch (e: any) {
      toast.error(e.message || "Failed to save birthday");
    } finally {
      setSaving(false);
      setConfirmBirthdayOpen(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      toast.success("Password updated successfully");
      setPasswordDialogOpen(false);
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      toast.error(err.message || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  const isDark = theme === "dark" || theme === "system" || !theme;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-2 text-xs text-muted-foreground font-body font-light hover:text-foreground transition-colors cursor-pointer outline-none">
            <User size={14} strokeWidth={1.2} />
            {displayName}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-52">
          <DropdownMenuItem onClick={() => setProfileDialogOpen(true)} className="cursor-pointer">
            <UserCircle size={14} className="mr-2" />
            My Info
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="cursor-pointer"
          >
            {isDark ? <Sun size={14} className="mr-2" /> : <Moon size={14} className="mr-2" />}
            {isDark ? "Light Mode" : "Dark Mode"}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => { onSignOut(); navigate("/auth"); }}
            className="cursor-pointer text-destructive"
          >
            <LogOut size={14} className="mr-2" />
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* My Info Dialog */}
      <Dialog open={profileDialogOpen} onOpenChange={setProfileDialogOpen}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-heading text-xl font-light">My Information</DialogTitle>
          </DialogHeader>

          {profileLoading ? (
            <div className="flex items-center justify-center py-8">
              <p className="text-muted-foreground text-sm font-body font-light animate-pulse">Loading…</p>
            </div>
          ) : (
            <div className="space-y-5 mt-2">
              {/* Name */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="font-body text-[10px] uppercase tracking-[0.15em] text-muted-foreground">First Name</Label>
                  <Input value={fName} onChange={(e) => setFName(e.target.value)} placeholder="First" className="font-body font-light" />
                </div>
                <div className="space-y-1.5">
                  <Label className="font-body text-[10px] uppercase tracking-[0.15em] text-muted-foreground">Last Name</Label>
                  <Input value={lName} onChange={(e) => setLName(e.target.value)} placeholder="Last" className="font-body font-light" />
                </div>
              </div>

              {/* Email (read-only) */}
              <div className="space-y-1.5">
                <Label className="font-body text-[10px] uppercase tracking-[0.15em] text-muted-foreground">Email</Label>
                <Input value={email} disabled className="font-body font-light bg-secondary/50 text-muted-foreground cursor-not-allowed" />
                <p className="text-[10px] text-muted-foreground/60 font-body font-light">Email cannot be changed here.</p>
              </div>

              {/* Phone */}
              <div className="space-y-1.5">
                <Label className="font-body text-[10px] uppercase tracking-[0.15em] text-muted-foreground">Phone</Label>
                <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(555) 000-0000" className="font-body font-light" />
              </div>

              {/* Address */}
              <div className="space-y-3">
                <Label className="font-body text-[10px] uppercase tracking-[0.15em] text-muted-foreground">Address</Label>
                <Input value={addressLine1} onChange={(e) => setAddressLine1(e.target.value)} placeholder="Street address" className="font-body font-light" />
                <div className="grid grid-cols-3 gap-2">
                  <Input value={addressCity} onChange={(e) => setAddressCity(e.target.value)} placeholder="City" className="font-body font-light" />
                  <Select value={addressState} onValueChange={setAddressState}>
                    <SelectTrigger className="font-body font-light">
                      <SelectValue placeholder="State" />
                    </SelectTrigger>
                    <SelectContent>
                      {US_STATES.map((s) => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input value={addressZip} onChange={(e) => setAddressZip(e.target.value)} placeholder="ZIP" className="font-body font-light" maxLength={10} />
                </div>
              </div>

              {/* Date of Birth */}
              <div className="space-y-1.5">
                <Label className="font-body text-[10px] uppercase tracking-[0.15em] text-muted-foreground">Date of Birth</Label>
                {birthdayLocked && savedBirthday ? (
                  <div className="flex items-center gap-2 py-2">
                    <span className="text-lg">🎂</span>
                    <div>
                      <p className="text-foreground font-body font-light">
                        {format(new Date(savedBirthday + "T00:00:00"), "MMMM d, yyyy")}
                      </p>
                      <p className="text-[10px] text-muted-foreground/60 font-body font-light">
                        🔒 Locked — contact support to change
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
                          onSelect={handleBirthdaySelect}
                          disabled={(date) => date > new Date() || date < new Date("1920-01-01")}
                          initialFocus
                          className={cn("p-3 pointer-events-auto")}
                          captionLayout="dropdown-buttons"
                          fromYear={1920}
                          toYear={new Date().getFullYear()}
                        />
                      </PopoverContent>
                    </Popover>
                    <p className="text-[10px] text-destructive/80 font-body font-light">
                      ⚠️ You can only set your birthday once. It will be permanently locked after saving.
                    </p>
                  </>
                )}
              </div>

              {/* Save button */}
              <Button onClick={handleSaveProfile} className="w-full text-xs tracking-wider uppercase font-body font-light rounded-none" disabled={saving}>
                {saving ? "Saving…" : "Save Changes"}
              </Button>

              {/* Change Password — inline */}
              <div className="border-t border-border/30 pt-4 space-y-3">
                <Label className="font-body text-[10px] uppercase tracking-[0.15em] text-muted-foreground">Change Password</Label>
                <form onSubmit={handleChangePassword} className="space-y-3">
                  <Input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="New password (min. 8 characters)"
                    className="font-body font-light"
                    minLength={8}
                  />
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="font-body font-light"
                  />
                  <Button
                    type="submit"
                    variant="outline"
                    className="w-full text-xs tracking-wider uppercase font-body font-light rounded-none"
                    disabled={loading || (!newPassword && !confirmPassword)}
                  >
                    <Key size={12} className="mr-2" />
                    {loading ? "Updating…" : "Update Password"}
                  </Button>
                </form>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Birthday confirmation */}
      <AlertDialog open={confirmBirthdayOpen} onOpenChange={setConfirmBirthdayOpen}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-heading font-light text-foreground">
              Confirm Your Birthday
            </AlertDialogTitle>
            <AlertDialogDescription className="font-body font-light text-muted-foreground">
              You are about to set your date of birth to{" "}
              <span className="text-foreground font-medium">
                {pendingBirthday ? format(pendingBirthday, "MMMM d, yyyy") : ""}
              </span>
              . This action <span className="text-destructive font-medium">cannot be undone</span> — your birthday will be permanently locked after saving.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="font-body font-light text-xs tracking-wider uppercase rounded-none">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmBirthday}
              disabled={saving}
              className="font-body font-light text-xs tracking-wider uppercase rounded-none"
            >
              {saving ? "Saving…" : "Yes, Lock My Birthday"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Password Dialog */}
      <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-heading text-xl">Change Password</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleChangePassword} className="space-y-4 mt-2">
            <div className="space-y-2">
              <Label htmlFor="settings-new-pw" className="font-body text-xs uppercase tracking-wider">New Password</Label>
              <Input
                id="settings-new-pw"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Min. 8 characters"
                required
                minLength={8}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="settings-confirm-pw" className="font-body text-xs uppercase tracking-wider">Confirm Password</Label>
              <Input
                id="settings-confirm-pw"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Updating..." : "Update Password"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UserSettingsMenu;