import { useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Layers, FlaskConical, Pill } from "lucide-react";
import { openCalendly } from "@/hooks/useCalendly";

const navItems = [
  { label: "Membership", href: "/services", icon: Layers },
  { label: "Protocols", href: "/protocols", icon: FlaskConical },
  { label: "Peptides", href: "/peptides", icon: Pill },
];

const Navbar = () => {
  const { pathname } = useLocation();

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
                    {/* Background glow */}
                    <motion.div
                      layoutId="lamp"
                      className="absolute inset-0 rounded-full bg-primary/5"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                    />
                    {/* Top lamp indicator */}
                    <motion.div
                      layoutId="lamp-glow"
                      className="absolute -top-1 left-1/2 -translate-x-1/2 w-8 h-1"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                    >
                      <div className="w-full h-full bg-primary rounded-full" />
                      <div className="absolute inset-0 bg-primary rounded-full blur-[4px]" />
                      <div className="absolute -inset-1 bg-primary/40 rounded-full blur-[8px]" />
                    </motion.div>
                  </>
                )}
              </Link>
            ))}
          </div>
        </div>

        {/* Book a Consult */}
        <button
          onClick={openCalendly}
          className="px-5 py-2 text-[10px] tracking-[0.2em] uppercase font-body font-light bg-primary text-primary-foreground hover:bg-primary/90 rounded-full transition-colors duration-200"
        >
          Book a Consult
        </button>
      </nav>

      {/* Mobile Bottom Pill Bar */}
      <div className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
        <div className="relative flex items-center gap-1 bg-background/80 border border-border backdrop-blur-lg rounded-full px-2 py-2 shadow-lg shadow-black/30">
          {navItems.map((item, i) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                to={item.href}
                className={`relative z-10 p-3 rounded-full transition-colors duration-200 ${
                  activeIndex === i ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <Icon size={20} strokeWidth={1.5} />
                {activeIndex === i && (
                  <>
                    <motion.div
                      layoutId="lamp-mobile"
                      className="absolute inset-0 rounded-full bg-primary/5"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                    />
                    <motion.div
                      layoutId="lamp-glow-mobile"
                      className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-6 h-0.5"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                    >
                      <div className="w-full h-full bg-primary rounded-full" />
                      <div className="absolute inset-0 bg-primary rounded-full blur-[3px]" />
                      <div className="absolute -inset-1 bg-primary/40 rounded-full blur-[6px]" />
                    </motion.div>
                  </>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Navbar;
