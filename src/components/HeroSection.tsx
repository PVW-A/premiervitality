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
          initial={{ opacity: 0, scale: 0.15 }}
          animate={{
            opacity: [0, 0, 1, 1, 1, 0],
            scale: [0.15, 0.15, 0.5, 1, 1, 1.05],
            rotate: [0, 0, 0, 0, 180, 360],
          }}
          transition={{
             duration: 4.6,
            times: [0, 0.35, 0.45, 0.65, 0.82, 1],
            ease: [0.22, 1, 0.36, 1],
            delay: 0.1,
          }}
        >
          {/* Proper double helix: two sine-wave backbones that cross over each other + rungs */}
          <svg viewBox="0 0 100 100" className="w-28 h-28 md:w-32 md:h-32">
            {(() => {
              const steps = 60;
              const amplitude = 22;
              const cx = 50;
              const yStart = 10;
              const yEnd = 90;
              const turns = 1.5;
              const phaseOffset = Math.PI / 2; // start at max spread

              // Generate points for both strands
              const strand1: string[] = [];
              const strand2: string[] = [];
              const rungs: { x1: number; y1: number; x2: number; y2: number; behind: boolean }[] = [];

              for (let i = 0; i <= steps; i++) {
                const t = i / steps;
                const y = yStart + t * (yEnd - yStart);
                const angle = t * turns * Math.PI * 2 + phaseOffset;
                const x1 = cx + Math.sin(angle) * amplitude;
                const x2 = cx + Math.sin(angle + Math.PI) * amplitude;
                strand1.push(`${x1.toFixed(1)},${y.toFixed(1)}`);
                strand2.push(`${x2.toFixed(1)},${y.toFixed(1)}`);
              }

              // Rungs at regular intervals
              const rungCount = 10;
              for (let i = 0; i < rungCount; i++) {
                const t = (i + 0.5) / rungCount;
                const y = yStart + t * (yEnd - yStart);
                const angle = t * turns * Math.PI * 2 + phaseOffset;
                const x1 = cx + Math.sin(angle) * amplitude;
                const x2 = cx + Math.sin(angle + Math.PI) * amplitude;
                // Rung is "behind" when strand1 is crossing in front
                const behind = Math.cos(angle) > 0;
                rungs.push({ x1, y1: y, x2, y2: y, behind });
              }

              const path1 = `M ${strand1[0]} ` + strand1.slice(1).map((p) => `L ${p}`).join(" ");
              const path2 = `M ${strand2[0]} ` + strand2.slice(1).map((p) => `L ${p}`).join(" ");

              return (
                <>
                  {/* Rungs behind */}
                  {rungs.filter((r) => r.behind).map((r, i) => (
                    <motion.line
                      key={`rb-${i}`}
                      x1={r.x1} y1={r.y1} x2={r.x2} y2={r.y2}
                      stroke="hsl(var(--primary) / 0.35)"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.6 + i * 0.18 }}
                    />
                  ))}
                  {/* Strand 1 (back portions appear first) */}
                  <motion.path
                    d={path1}
                    fill="none"
                    stroke="hsl(var(--primary) / 0.85)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 2.2, ease: "easeInOut", delay: 0.15 }}
                  />
                  {/* Strand 2 */}
                  <motion.path
                    d={path2}
                    fill="none"
                    stroke="hsl(var(--primary) / 0.65)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 2.2, ease: "easeInOut", delay: 0.3 }}
                  />
                  {/* Rungs in front */}
                  {rungs.filter((r) => !r.behind).map((r, i) => (
                    <motion.line
                      key={`rf-${i}`}
                      x1={r.x1} y1={r.y1} x2={r.x2} y2={r.y2}
                      stroke="hsl(var(--primary) / 0.45)"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.8 + i * 0.18 }}
                    />
                  ))}
                </>
              );
            })()}
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
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 4.2 }}
          />
        </motion.div>

        {/* Outer orbit ring */}
        <motion.div
          className="absolute -inset-4 rounded-full"
          style={{ border: "1px solid hsl(var(--primary) / 0.08)" }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1, rotate: 360 }}
          transition={{
            opacity: { duration: 0.5, delay: 4.5 },
            scale: { duration: 0.5, delay: 4.5 },
            rotate: { duration: 30, repeat: Infinity, ease: "linear", delay: 4.5 },
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
            opacity: { duration: 0.5, delay: 4.5 },
            boxShadow: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: 5 },
          }}
        />

        {/* Phase 4: PV — starts as a dot and grows into the monogram */}
        <motion.div
          className="relative z-10"
          initial={{ opacity: 0, scale: 0.05 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 4.3, ease: [0.22, 1, 0.36, 1] }}
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
