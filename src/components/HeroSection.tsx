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
      {/* Monogram with yin-yang animated reveal */}
      <div className="relative mb-10 w-32 h-32 md:w-36 md:h-36 flex items-center justify-center aspect-square">
        {/* Phase 1-2: Double Helix — starts tiny, expands, then fades as ring forms */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          initial={{ opacity: 0, scale: 0.08 }}
          animate={{
            opacity: [0, 1, 1, 1, 0],
            scale: [0.08, 0.08, 1, 1, 1.1],
            rotate: [0, 0, 0, 180, 360],
          }}
          transition={{
            duration: 3.2,
            times: [0, 0.05, 0.4, 0.7, 1],
            ease: [0.22, 1, 0.36, 1],
            delay: 0.1,
          }}
        >
          <svg viewBox="0 0 100 100" className="w-28 h-28 md:w-32 md:h-32">
            {/* Strand 1 */}
            <motion.path
              d="M25 8 C58 22, 58 35, 25 50 C-8 65, -8 78, 25 92"
              fill="none"
              stroke="hsl(var(--primary) / 0.6)"
              strokeWidth="1.5"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: [0, 1] }}
              transition={{ duration: 1.6, ease: "easeInOut", delay: 0.15 }}
            />
            {/* Strand 2 */}
            <motion.path
              d="M75 8 C42 22, 42 35, 75 50 C108 65, 108 78, 75 92"
              fill="none"
              stroke="hsl(var(--primary) / 0.4)"
              strokeWidth="1.5"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: [0, 1] }}
              transition={{ duration: 1.6, ease: "easeInOut", delay: 0.25 }}
            />
            {/* Rungs connecting the strands */}
            {[15, 27, 39, 50, 61, 73, 85].map((y, i) => {
              const t = (y - 50) / 42;
              const offset = Math.sin(t * Math.PI) * 25;
              return (
                <motion.line
                  key={i}
                  x1={50 - 25 + offset}
                  y1={y}
                  x2={50 + 25 - offset}
                  y2={y}
                  stroke="hsl(var(--primary) / 0.2)"
                  strokeWidth="0.7"
                  initial={{ opacity: 0, scaleX: 0 }}
                  animate={{ opacity: [0, 1], scaleX: [0, 1] }}
                  transition={{ duration: 0.35, delay: 0.4 + i * 0.12 }}
                />
              );
            })}
          </svg>
        </motion.div>

        {/* Phase 3: Circle ring — helix "unwraps" into this ring */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
        >
          <motion.div
            className="rounded-full"
            style={{ border: "1.5px solid hsl(var(--primary) / 0.4)" }}
            initial={{ width: 0, height: 0, opacity: 0 }}
            animate={{ width: 120, height: 120, opacity: 1 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 2.8 }}
          />
        </motion.div>

        {/* Outer orbit ring */}
        <motion.div
          className="absolute -inset-4 rounded-full"
          style={{ border: "1px solid hsl(var(--primary) / 0.08)" }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1, rotate: 360 }}
          transition={{
            opacity: { duration: 0.5, delay: 3.2 },
            scale: { duration: 0.5, delay: 3.2 },
            rotate: { duration: 30, repeat: Infinity, ease: "linear", delay: 3.2 },
          }}
        />

        {/* Ambient pulse */}
        <motion.div
          className="absolute -inset-6 rounded-full"
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            boxShadow: [
              "0 0 20px 0px hsl(var(--primary) / 0.0)",
              "0 0 40px 10px hsl(var(--primary) / 0.06)",
              "0 0 20px 0px hsl(var(--primary) / 0.0)",
            ],
          }}
          transition={{
            opacity: { duration: 0.5, delay: 3.2 },
            boxShadow: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: 3.5 },
          }}
        />

        {/* Phase 4: PV — starts as a dot and grows into the monogram */}
        <motion.div
          className="relative z-10"
          initial={{ opacity: 0, scale: 0.05 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 2.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <PVMonogram className="w-20 h-20 md:w-28 md:h-28" />
        </motion.div>
      </div>

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
        className="flex flex-col gap-6 items-center justify-center"
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
