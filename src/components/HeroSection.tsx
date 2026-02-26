import { motion } from "framer-motion";
import PVMonogram from "./PVMonogram";
import { openCalendly } from "@/hooks/useCalendly";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => (
  <section
    className="relative min-h-screen flex items-center justify-center overflow-hidden"
    id="home"
  >
    {/* Background image */}
    <div className="absolute inset-0">
      <img src={heroBg} alt="" className="w-full h-full object-cover opacity-30" />
      <div className="absolute inset-0 bg-background/70" />
    </div>

    {/* Grid overlay */}
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        backgroundImage:
          "linear-gradient(hsl(var(--foreground) / 0.02) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground) / 0.02) 1px, transparent 1px)",
        backgroundSize: "80px 80px",
        maskImage:
          "radial-gradient(ellipse 70% 60% at 50% 50%, black 10%, transparent 80%)",
        WebkitMaskImage:
          "radial-gradient(ellipse 70% 60% at 50% 50%, black 10%, transparent 80%)",
      }}
    />

    {/* Radial glow behind monogram */}
    <div
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] pointer-events-none"
      style={{
        background:
          "radial-gradient(circle, hsl(var(--primary) / 0.06) 0%, transparent 60%)",
      }}
    />


    <div className="relative z-10 max-w-3xl mx-auto px-6 pt-20 sm:pt-0 text-center flex flex-col items-center">
      {/* Monogram with ring */}
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2 }}
        className="relative mb-10"
      >
        {/* Orbit ring */}
        <motion.div
          className="absolute -inset-4 rounded-full"
          style={{
            border: "1px solid hsl(var(--primary) / 0.1)",
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute -inset-8 rounded-full"
          style={{
            border: "1px solid hsl(var(--primary) / 0.05)",
          }}
          animate={{ rotate: -360 }}
          transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
        />
        {/* Ambient pulse */}
        <motion.div
          className="absolute -inset-6 rounded-full"
          animate={{
            boxShadow: [
              "0 0 20px 0px hsl(var(--primary) / 0.0)",
              "0 0 40px 10px hsl(var(--primary) / 0.06)",
              "0 0 20px 0px hsl(var(--primary) / 0.0)",
            ],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <PVMonogram className="w-20 h-20 md:w-28 md:h-28 relative z-10" />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.15 }}
        className="font-heading text-5xl md:text-7xl font-light italic tracking-wide mb-8"
      >
        Premier Vitality
      </motion.h1>

      {/* Horizontal accent line */}
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
        className="text-xs tracking-[0.35em] uppercase text-muted-foreground mb-8 font-body font-light"
      >
        Bridging the Gap Between Modern Medicine and Innovative Science
      </motion.p>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.65 }}
        className="text-sm md:text-base text-muted-foreground max-w-xl mx-auto mb-12 font-body font-light leading-relaxed"
      >
        Precision longevity protocols engineered for those who refuse to accept the
        conventional trajectory of aging. Evidence-based. Physician-directed. Uncompromising.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        className="flex flex-col sm:flex-row gap-6 items-center justify-center"
      >
        <motion.a
          href="/auth"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="px-10 py-3 text-xs font-body font-light tracking-[0.25em] uppercase text-foreground transition-all"
          style={{
            border: "1px solid hsl(var(--primary) / 0.25)",
            boxShadow: "0 0 20px -6px hsl(var(--primary) / 0.1)",
          }}
        >
          Create Your Account
        </motion.a>
        <a
          href="/peptides"
          className="text-xs font-body font-light tracking-[0.25em] uppercase text-muted-foreground hover:text-foreground transition-colors"
        >
          Explore Protocols
        </a>
      </motion.div>
    </div>
  </section>
);

export default HeroSection;
