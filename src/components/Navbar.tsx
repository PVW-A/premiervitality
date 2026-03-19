import { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Layers, FlaskConical, Pill, Menu, X, User } from "lucide-react";
import { openCalendly } from "@/hooks/useCalendly";

const navItems = [
  { label: "Membership", href: "/services", icon: Layers },
  { label: "Protocols", href: "/protocols", icon: FlaskConical },
  { label: "Peptides", href: "/peptides", icon: Pill },
];

const drawerLinks = [
  { label: "Sign In", href: "/auth" },
  { label: "FAQ", href: "/faq" },
];

const allMobileLinks = [
  { label: "Membership", href: "/services" },
  { label: "Protocols", href: "/protocols" },
  { label: "Peptides", href: "/peptides" },
  { label: "Sign In", href: "/auth" },
  { label: "FAQ", href: "/faq" },
];

const Navbar = () => {
  const { pathname } = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const activeIndex = navItems.findIndex((item) => pathname.startsWith(item.href));

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="hidden md:flex fixed top-0 left-0 right-0 z-50 items-center justify-between px-8 h-16 bg-background/80 backdrop-blur-xl border-b border-border/50">
        {/* Logo */}
        <Link to="/" className="flex items-baseline gap-1.5 group">
          {/* LOGO SWAP: Replace with <img src="/logo.png" alt="Premier Vitality" className="h-8" /> when new logo is ready */}
          <span className="text-lg font-heading font-light tracking-wide text-foreground group-hover:text-primary transition-colors duration-300">
            Premier
          </span>
          <span className="text-lg font-heading font-light italic tracking-wide text-primary">
            Vitality
          </span>
        </Link>

        {/* Center Tubelight Pill Nav */}
        <div className="absolute left-1/2 -translate-x-1/2">
          <div className="relative flex items-center gap-1 bg-background/5 border border-border backdrop-blur-lg rounded-full px-1.5 py-1.5">
            {navItems.map((item, i) => (
              <Link
                key={item.label}
                to={item.href}
                className={`relative z-10 px-5 py-1.5 text-[11px] tracking-[0.18em] uppercase font-body font-light rounded-full transition-colors duration-200 ${
                  activeIndex === i ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {item.label}
                {activeIndex === i && (
                  <>
                    {/* Background highlight */}
                    <motion.div
                      layoutId="lamp"
                      className="absolute inset-0 rounded-full bg-primary/5"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                    />
                    {/* Top indicator bar — clean, sharp */}
                    <motion.div
                      layoutId="lamp-bar"
                      className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-amber-400 rounded-full"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                    />
                  </>
                )}
              </Link>
            ))}
          </div>
        </div>

        {/* Hamburger button (desktop right) */}
        <button
          onClick={() => setDrawerOpen(true)}
          className="p-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <Menu size={20} strokeWidth={1.5} />
        </button>
      </nav>

      {/* Mobile Top Bar — Logo + Hamburger only */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 h-14 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <Link to="/" className="flex items-baseline gap-1.5">
          {/* LOGO SWAP: Replace with <img src="/logo.png" alt="Premier Vitality" className="h-7" /> when new logo is ready */}
          <span className="text-base font-heading font-light tracking-wide text-foreground">
            Premier
          </span>
          <span className="text-base font-heading font-light italic tracking-wide text-primary">
            Vitality
          </span>
        </Link>
        <button
          onClick={() => setDrawerOpen(true)}
          className="p-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <Menu size={20} strokeWidth={1.5} />
        </button>
      </div>

      {/* Slide-in Drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] bg-black/60"
              onClick={() => setDrawerOpen(false)}
            />
            {/* Drawer panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 z-[70] w-72 bg-background border-l border-border shadow-2xl"
            >
              <div className="flex items-center justify-between px-6 h-16 border-b border-border/50">
                <span className="text-xs tracking-[0.2em] uppercase text-muted-foreground font-body font-light">
                  Menu
                </span>
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X size={18} strokeWidth={1.5} />
                </button>
              </div>

              <div className="flex flex-col px-6 py-8 gap-1">
                {/* On mobile show all links; on desktop show only drawer-specific links */}
                <div className="md:hidden flex flex-col gap-1">
                  {allMobileLinks.map((link) => (
                    <Link
                      key={link.label}
                      to={link.href}
                      onClick={() => setDrawerOpen(false)}
                      className="flex items-center gap-3 px-3 py-3 text-sm font-body font-light text-muted-foreground hover:text-foreground hover:bg-secondary/50 rounded-lg transition-colors"
                    >
                      {link.label === "Sign In" && <User size={16} strokeWidth={1.5} />}
                      {link.label}
                    </Link>
                  ))}
                </div>
                <div className="hidden md:flex flex-col gap-1">
                  {drawerLinks.map((link) => (
                    <Link
                      key={link.label}
                      to={link.href}
                      onClick={() => setDrawerOpen(false)}
                      className="flex items-center gap-3 px-3 py-3 text-sm font-body font-light text-muted-foreground hover:text-foreground hover:bg-secondary/50 rounded-lg transition-colors"
                    >
                      {link.label === "Sign In" && <User size={16} strokeWidth={1.5} />}
                      {link.label}
                    </Link>
                  ))}
                </div>

                <div className="my-4 h-px bg-border/50" />

                <button
                  onClick={() => {
                    setDrawerOpen(false);
                    openCalendly();
                  }}
                  className="w-full py-3 text-xs tracking-[0.2em] uppercase font-body font-light bg-primary text-primary-foreground hover:bg-primary/90 rounded-full transition-colors duration-200"
                >
                  Book a Consult
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
