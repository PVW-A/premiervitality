import { useState, useEffect, useRef, useCallback } from "react";
import { useLocation, Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Home, Layers, FlaskConical, Pill, Users, Menu, X, User } from "lucide-react";
import { openCalendly } from "@/hooks/useCalendly";

const navItems = [
  { label: "Home", href: "/", icon: Home },
  { label: "Membership", href: "/services", icon: Layers },
  { label: "Protocols", href: "/protocols", icon: FlaskConical },
  { label: "Peptides", href: "/peptides", icon: Pill },
  { label: "About", href: "/about", icon: Users },
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
  const { pathname } = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [canAnimate, setCanAnimate] = useState(false);
  const [indicatorStyle, setIndicatorStyle] = useState<React.CSSProperties>({ opacity: 0 });
  const navContainerRef = useRef<HTMLDivElement>(null);
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  const activeIndex = navItems.findIndex((item) =>
    item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)
  );

  const updateIndicator = useCallback((animate: boolean) => {
    const container = navContainerRef.current;
    const activeLink = linkRefs.current[activeIndex];
    if (!container || !activeLink || activeIndex < 0) {
      setIndicatorStyle({ opacity: 0 });
      return;
    }
    const containerRect = container.getBoundingClientRect();
    const linkRect = activeLink.getBoundingClientRect();
    setIndicatorStyle({
      left: linkRect.left - containerRect.left,
      width: linkRect.width,
      opacity: 1,
      transition: animate ? "left 0.3s ease, width 0.3s ease, opacity 0.15s ease" : "none",
    });
  }, [activeIndex]);

  // On mount or route change: snap instantly, then enable animation after 50ms
  useEffect(() => {
    setCanAnimate(false);
    updateIndicator(false);
    const timer = setTimeout(() => setCanAnimate(true), 50);
    return () => clearTimeout(timer);
  }, [pathname, updateIndicator]);

  // On activeIndex change from in-page click: animate
  useEffect(() => {
    if (canAnimate) updateIndicator(true);
  }, [activeIndex, canAnimate, updateIndicator]);

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="hidden md:flex fixed top-0 left-0 right-0 z-50 items-center justify-between px-8 h-16 bg-background/80 backdrop-blur-xl border-b border-border/50">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img src="/logo-emblem.svg" alt="Premier Vitality & Wellness" className="h-8 w-auto" style={{ filter: "brightness(0) saturate(100%) invert(72%) sepia(28%) saturate(600%) hue-rotate(5deg)" }} />
        </Link>

        {/* Center Nav */}
        <div className="absolute left-1/2 -translate-x-1/2">
          <div
            ref={navContainerRef}
            className="relative flex items-center gap-1 bg-background/5 border border-border backdrop-blur-lg rounded-full px-1.5 py-1.5"
          >
            {/* Sliding indicator */}
            <span
              className="absolute top-0 h-[2px] rounded-full"
              style={{ background: "#AB8F5F", ...indicatorStyle }}
            />
            <span
              className="absolute rounded-full bg-primary/5"
              style={{
                top: 0,
                bottom: 0,
                ...indicatorStyle,
              }}
            />

            {navItems.map((item, i) => (
              <Link
                key={item.label}
                to={item.href}
                ref={(el) => { linkRefs.current[i] = el; }}
                className={`relative z-10 px-5 py-1.5 text-[11px] tracking-[0.18em] uppercase rounded-full transition-colors duration-200 ${
                  activeIndex === i ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

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
                    <Link key={item.label} to={item.href} onClick={() => setDrawerOpen(false)} className="flex items-center gap-3 px-3 py-3 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/50 rounded-lg transition-colors">
                      <item.icon size={16} strokeWidth={1.5} />
                      {item.label}
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
