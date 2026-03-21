import { useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Home, Layers, FlaskConical, Pill, Users, Menu, X, User } from "lucide-react";
import { openCalendly } from "@/hooks/useCalendly";
import { NavBar } from "@/components/ui/tubelight-navbar";

const navItems = [
  { name: "Home", url: "/", icon: Home },
  { name: "Membership", url: "/services", icon: Layers },
  { name: "Protocols", url: "/protocols", icon: FlaskConical },
  { name: "Peptides", url: "/peptides", icon: Pill },
  { name: "About", url: "/about", icon: Users },
];

const drawerLinks = [
  { label: "FAQ", href: "/faq" },
  { label: "Sign In", href: "/auth" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms & Conditions", href: "/terms" },
  { label: "SMS Consent", href: "/sms-consent" },
  { label: "Disclaimer", href: "/disclaimer" },
];

const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="hidden md:flex fixed top-0 left-0 right-0 z-50 items-center justify-between px-8 h-16 bg-background/80 backdrop-blur-xl border-b border-border/50">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img src="/logo-emblem.svg" alt="Premier Vitality & Wellness" className="h-8 w-auto" style={{ filter: "brightness(0) saturate(100%) invert(72%) sepia(28%) saturate(600%) hue-rotate(5deg)" }} />
        </Link>

        {/* Center Tubelight Nav */}
        <NavBar items={navItems} className="!fixed !top-0 !bottom-auto !mb-0 !pt-3.5" />

        {/* Hamburger */}
        <button
          onClick={() => setDrawerOpen(true)}
          className="p-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <Menu size={20} strokeWidth={1.5} />
        </button>
      </nav>

      {/* Mobile Top Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 h-14 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <Link to="/" className="flex items-center">
          <img src="/logo-emblem.svg" alt="Premier Vitality & Wellness" className="h-8 w-auto" style={{ filter: "brightness(0) saturate(100%) invert(72%) sepia(28%) saturate(600%) hue-rotate(5deg)" }} />
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
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] bg-black/60"
              onClick={() => setDrawerOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 z-[70] w-72 bg-background border-l border-border shadow-2xl"
            >
              <div className="flex items-center justify-between px-6 h-16 border-b border-border/50">
                <span className="text-xs tracking-[0.2em] uppercase text-muted-foreground">Menu</span>
                <button onClick={() => setDrawerOpen(false)} className="p-2 text-muted-foreground hover:text-foreground transition-colors">
                  <X size={18} strokeWidth={1.5} />
                </button>
              </div>
              <div className="flex flex-col px-6 py-8 gap-1">
                <div className="md:hidden flex flex-col gap-1 mb-2">
                  {navItems.map((item) => (
                    <Link key={item.name} to={item.url} onClick={() => setDrawerOpen(false)} className="flex items-center gap-3 px-3 py-3 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/50 rounded-lg transition-colors">
                      <item.icon size={16} strokeWidth={1.5} />
                      {item.name}
                    </Link>
                  ))}
                  <div className="my-2 h-px bg-border/50" />
                </div>
                {drawerLinks.map((link) => (
                  <Link key={link.label} to={link.href} onClick={() => setDrawerOpen(false)} className="flex items-center gap-3 px-3 py-3 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/50 rounded-lg transition-colors">
                    {link.label === "Sign In" && <User size={16} strokeWidth={1.5} />}
                    {link.label}
                  </Link>
                ))}
                <div className="my-4 h-px bg-border/50" />
                <button onClick={() => { setDrawerOpen(false); openCalendly(); }} className="w-full py-3 text-xs tracking-[0.2em] uppercase bg-primary text-primary-foreground hover:bg-primary/90 rounded-full transition-colors duration-200">
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
