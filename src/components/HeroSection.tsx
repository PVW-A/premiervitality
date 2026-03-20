import { motion } from "framer-motion";
import { openCalendly } from "@/hooks/useCalendly";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => (
  <section
    className="relative min-h-screen flex items-center justify-center overflow-hidden"
    id="home"
  >
    {/* Background image + warm radial atmosphere */}
    <div className="absolute inset-0">
      <img src={heroBg} alt="" className="w-full h-full object-cover opacity-15" />
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 40%, #2a2418 0%, #1a1610 30%, #0a0a08 60%, #000000 100%)" }} />
    </div>

    {/* Warm golden atmospheric glow */}
    <div
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
      style={{
        width: 800,
        height: 800,
        background: "radial-gradient(circle, rgba(171,143,95,0.08) 0%, transparent 70%)",
        filter: "blur(40px)",
      }}
    />

    <div className="relative z-10 max-w-5xl mx-auto px-4 md:px-6 pt-20 sm:pt-0 text-center flex flex-col items-center">
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.15 }}
        className="text-[28px] sm:text-[36px] md:text-[52px] lg:text-[60px] xl:text-[64px] font-light tracking-wide mb-8 md:whitespace-nowrap"
      >
        Premier Vitality{" "}<img src="/logo-emblem.svg" alt="&" className="inline-block h-[0.8em] w-auto align-middle" style={{ filter: "brightness(0) invert(1)" }} />{" "}Wellness
      </motion.h1>

      {/* Accent line */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.8, delay: 0.35 }}
        className="w-24 h-px mb-8"
        style={{
          background:
            "linear-gradient(90deg, transparent, hsl(var(--primary) / 0.4), transparent)",
        }}
      />

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="text-[11px] tracking-[0.35em] uppercase text-muted-foreground mb-8"
      >
        Bridging the Gap Between Modern Medicine and Innovative Science
      </motion.p>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.65 }}
        className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto mb-12 leading-relaxed"
      >
        Physician-directed precision medicine for those who demand measurable results.
        Evidence-based protocols engineered to optimize your biology at every level.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        className="flex flex-col gap-6 items-center justify-center"
      >
        <motion.a
          href="/auth"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="px-10 py-3 text-xs tracking-[0.25em] uppercase text-foreground transition-all"
          style={{
            border: "1px solid hsl(var(--primary) / 0.25)",
            boxShadow: "0 0 20px -6px hsl(var(--primary) / 0.1)",
          }}
        >
          Begin Your Protocol
        </motion.a>
        <a
          href="/protocols"
          className="text-xs tracking-[0.25em] uppercase text-muted-foreground hover:text-foreground transition-colors"
        >
          Explore Protocols
        </a>
      </motion.div>
    </div>
  </section>
);

export default HeroSection;
