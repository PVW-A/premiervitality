import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface LegalModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const LegalModal = ({ open, onClose, title, children }: LegalModalProps) => (
  <AnimatePresence>
    {open && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[80] flex items-center justify-center px-4"
        style={{ backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)" }}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/80" onClick={onClose} />

        {/* Modal card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-2xl bg-background border border-border rounded-lg shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border/50">
            <div>
              <p className="text-[9px] tracking-[0.3em] uppercase text-muted-foreground font-body font-light mb-1">
                Legal
              </p>
              <h2 className="text-lg font-heading font-light text-foreground">{title}</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-secondary/50"
            >
              <X size={18} strokeWidth={1.5} />
            </button>
          </div>

          {/* Scrollable content */}
          <div className="px-6 py-6 overflow-y-auto" style={{ maxHeight: "70vh" }}>
            <div className="space-y-6 text-muted-foreground font-body font-light text-sm leading-relaxed">
              {children}
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-border/50">
            <button
              onClick={onClose}
              className="w-full py-2.5 text-xs tracking-[0.2em] uppercase font-body font-light border border-border/40 text-muted-foreground hover:text-foreground hover:border-border/60 transition-colors"
            >
              Close
            </button>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

export default LegalModal;
