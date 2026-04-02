import { useState } from "react";
import { useLocation } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ChatPanel from "./ChatPanel";

const ChatButton = () => {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  // Hide on intake form pages to prevent overlay issues on iPad
  if (pathname.startsWith("/intake")) return null;

  return (
    <>
      <ChatPanel open={open} onClose={() => setOpen(false)} />
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            onClick={() => setOpen(true)}
            className="fixed bottom-5 right-4 z-50 flex items-center gap-2 rounded-full border border-primary/30 bg-background/90 backdrop-blur-sm px-4 py-2.5 text-primary hover:border-primary/50 hover:bg-card/80 transition-all shadow-lg sm:right-6"
            aria-label="Open PV Concierge"
          >
            <MessageCircle className="w-4 h-4" />
            <span className="text-xs font-medium tracking-wide hidden sm:inline">
              PV Concierge
            </span>
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatButton;
