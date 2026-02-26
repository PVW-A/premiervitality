import { useState } from "react";
import { Menu, X, User, ShoppingCart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PVMonogram from "./PVMonogram";
import { openCalendly } from "@/hooks/useCalendly";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const links = [
    { label: "About", href: "/about" },
    { label: "FAQ", href: "/faq" },
    { label: "Peptides", href: "/peptides" },
    { label: "News", href: "/news" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
        <a href="/" className="flex items-center gap-3">
          <PVMonogram className="w-8 h-8" />
          <span className="text-xs tracking-[0.35em] uppercase text-foreground font-body font-light hidden sm:inline">
            Premier Vitality
          </span>
        </a>
        <div className="hidden md:flex items-center gap-10">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="text-xs font-body font-light tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground transition-colors duration-300 cursor-pointer"
            >
              {l.label}
            </a>
          ))}
        </div>
        <div className="hidden md:flex items-center gap-5">
          <a href="/auth" className="text-muted-foreground hover:text-foreground transition-colors">
            <User size={18} strokeWidth={1.2} />
          </a>
          <a
            href="/auth"
            className="ml-2 px-5 py-2 text-xs font-body font-light tracking-[0.2em] uppercase border border-primary/40 text-primary hover:bg-primary/10 transition-colors rounded-none"
          >
            Create Account
          </a>
        </div>
        <button className="md:hidden text-foreground" onClick={() => setOpen(!open)}>
          {open ? <X size={22} strokeWidth={1.2} /> : <Menu size={22} strokeWidth={1.2} />}
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background border-b border-border overflow-hidden"
          >
            <div className="flex flex-col px-6 py-4 gap-4">
              {links.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="text-xs tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground transition-colors font-body font-light cursor-pointer"
                >
                  {l.label}
                </a>
              ))}
              <button
                onClick={() => { openCalendly(); setOpen(false); }}
                className="px-5 py-2 text-xs font-body font-light tracking-[0.2em] uppercase border border-primary/40 text-primary text-center"
              >
                Order
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
