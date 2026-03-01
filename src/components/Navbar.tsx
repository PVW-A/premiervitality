import { useState } from "react";
import { Menu, X, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  const links = [
    { label: "About", href: "/about" },
    { label: "Membership", href: "/services" },
    { label: "Peptides", href: "/peptides" },
    { label: "FAQ", href: "/faq" },
    { label: "News", href: "/news" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="max-w-7xl mx-auto px-6 flex items-center h-16">
        {/* Left — Text wordmark */}
        <div className="flex-1 flex items-center">
          <a href="/" className="flex items-baseline gap-1.5 group">
            <span className="text-lg font-heading font-light tracking-wide text-foreground group-hover:text-primary transition-colors duration-300">
              Premier
            </span>
            <span className="text-lg font-heading font-light italic tracking-wide text-primary">
              Vitality
            </span>
          </a>
        </div>

        {/* Center — nav links */}
        <div className="hidden md:flex items-center gap-9">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="text-[11px] font-body font-light tracking-[0.22em] uppercase text-muted-foreground hover:text-primary transition-colors duration-300"
            >
              {l.label}
            </a>
          ))}
        </div>

        {/* Right — Sign In */}
        <div className="flex-1 hidden md:flex items-center justify-end">
          <a
            href="/auth"
            className="flex items-center gap-2 px-5 py-2 text-[10px] font-body font-light tracking-[0.2em] uppercase border border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300"
          >
            <User size={14} strokeWidth={1.2} />
            Sign In
          </a>
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden text-foreground p-1" onClick={() => setOpen(!open)}>
          {open ? <X size={22} strokeWidth={1.2} /> : <Menu size={22} strokeWidth={1.2} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background/95 backdrop-blur-xl border-b border-border/50 overflow-hidden"
          >
            <div className="flex flex-col items-center px-6 py-6 gap-5">
              {links.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="text-[11px] tracking-[0.25em] uppercase text-muted-foreground hover:text-primary transition-colors font-body font-light"
                >
                  {l.label}
                </a>
              ))}
              <div className="w-12 h-px bg-border/60 my-1" />
              <a
                href="/auth"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 px-6 py-2.5 text-[10px] font-body font-light tracking-[0.2em] uppercase border border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300"
              >
                <User size={14} strokeWidth={1.2} />
                Sign In
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
