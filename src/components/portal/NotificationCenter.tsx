import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  link: string | null;
  read: boolean;
  created_at: string;
  user_id: string | null;
}

const typeIcon: Record<string, string> = {
  order_update: "📦",
  announcement: "📢",
  reminder: "⏰",
  info: "ℹ️",
};

export default function NotificationCenter({ onNavigate }: { onNavigate?: (tab: string) => void }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);

  const fetchNotifications = async () => {
    const { data } = await supabase
      .from("notifications")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(30);
    if (data) setNotifications(data as Notification[]);
  };

  useEffect(() => {
    fetchNotifications();
    // Poll every 60s for new notifications
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read && n.user_id !== null).length;
  // For broadcasts (user_id is null), we track read state client-side via localStorage
  const readBroadcasts = JSON.parse(localStorage.getItem("pv_read_broadcasts") || "[]");
  const unreadBroadcasts = notifications.filter(
    (n) => n.user_id === null && !readBroadcasts.includes(n.id)
  ).length;
  const totalUnread = unreadCount + unreadBroadcasts;

  const markAsRead = async (id: string, userId: string | null) => {
    if (userId === null) {
      // Broadcast — track locally
      const updated = [...readBroadcasts, id];
      localStorage.setItem("pv_read_broadcasts", JSON.stringify(updated));
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    } else {
      await supabase.from("notifications").update({ read: true }).eq("id", id);
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    }
  };

  const markAllRead = async () => {
    const userNotifs = notifications.filter((n) => n.user_id !== null && !n.read);
    if (userNotifs.length > 0) {
      await supabase
        .from("notifications")
        .update({ read: true })
        .in("id", userNotifs.map((n) => n.id));
    }
    const broadcastIds = notifications.filter((n) => n.user_id === null).map((n) => n.id);
    localStorage.setItem("pv_read_broadcasts", JSON.stringify([...readBroadcasts, ...broadcastIds]));
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const timeSince = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
  };

  const handleClick = (n: Notification) => {
    markAsRead(n.id, n.user_id);
    if (n.link && onNavigate) {
      // Parse tab from link like '/portal?tab=requests'
      const tabMatch = n.link.match(/tab=(\w+)/);
      if (tabMatch) {
        onNavigate(tabMatch[1]);
        setOpen(false);
      }
    }
  };

  const isRead = (n: Notification) => {
    if (n.user_id === null) return readBroadcasts.includes(n.id);
    return n.read;
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell size={18} />
          {totalUnread > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">
              {totalUnread > 9 ? "9+" : totalUnread}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <h3 className="text-xs tracking-[0.2em] uppercase font-body font-light text-foreground">
            Notifications
          </h3>
          {totalUnread > 0 && (
            <button
              onClick={markAllRead}
              className="text-[10px] text-primary hover:underline font-body font-light"
            >
              Mark all read
            </button>
          )}
        </div>
        <ScrollArea className="max-h-80">
          {notifications.length === 0 ? (
            <div className="p-6 text-center text-xs text-muted-foreground font-body font-light">
              No notifications yet
            </div>
          ) : (
            <div className="divide-y divide-border">
              {notifications.map((n) => (
                <button
                  key={n.id}
                  onClick={() => handleClick(n)}
                  className={cn(
                    "w-full text-left px-4 py-3 hover:bg-muted/50 transition-colors",
                    !isRead(n) && "bg-primary/5"
                  )}
                >
                  <div className="flex items-start gap-2.5">
                    <span className="text-sm mt-0.5">{typeIcon[n.type] || "ℹ️"}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-foreground truncate">
                          {n.title}
                        </span>
                        {!isRead(n) && (
                          <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                        )}
                      </div>
                      <p className="text-[11px] text-muted-foreground font-body font-light mt-0.5 line-clamp-2">
                        {n.message}
                      </p>
                      <span className="text-[10px] text-muted-foreground/60 font-body mt-1 block">
                        {timeSince(n.created_at)}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
