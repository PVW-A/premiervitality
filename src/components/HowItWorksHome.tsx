import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";

const steps = [
  {
    title: "Get Your Labs",
    description:
      "We start with advanced bloodwork panels and a physician consultation to map your unique biology - hormones, metabolic markers, inflammation, and more.",
  },
  {
    title: "Physician Review",
    description:
      "Your physician builds a precision protocol tailored to your goals - whether it's performance, recovery, longevity, or all three. Every peptide, every dose, backed by your data.",
  },
  {
    title: "Protocol Delivered",
    description:
      "Regular lab rechecks, protocol adjustments, and concierge-level support keep you progressing. Your biology evolves - your protocol evolves with it.",
  },
];

const INTERVAL = 5000;

const HowItWorksHome = () => {
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);

  const advance = useCallback(() => {
    setActive((prev) => (prev + 1) % steps.length);
    setProgress(0);
  }, []);

  useEffect(() => {
    const tick = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          advance();
          return 0;
        }
        return p + 100 / (INTERVAL / 50);
      });
    }, 50);
    return () => clearInterval(tick);
  }, [advance]);

  const select = (i: number) => {
    setActive(i);
    setProgress(0);
  };

  return (
    <section className="py-20 px-6">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-xs tracking-[0.3em] uppercase text-primary font-body font-light mb-3">
            How It Works
          </p>
          <h2 className="text-2xl md:text-4xl font-heading font-light text-foreground">
            Three Steps to Optimization
          </h2>
        </div>

        <div className="flex flex-col gap-2">
          {steps.map((step, i) => (
            <button
              key={i}
              onClick={() => select(i)}
              className={`text-left p-5 rounded-lg transition-all duration-300 ${
                active === i
                  ? "bg-secondary border border-primary/20"
                  : "border border-transparent hover:bg-secondary/50"
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <span
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-body ${
                    active === i
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-muted-foreground"
                  }`}
                >
                  {i + 1}
                </span>
                <h3
                  className={`text-sm font-light tracking-wide ${
                    active === i ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {step.title}
                </h3>
              </div>
              {active === i && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="text-sm text-muted-foreground font-body font-light leading-relaxed pl-10"
                >
                  {step.description}
                </motion.p>
              )}
              {active === i && (
                <div className="mt-3 ml-10 h-0.5 bg-border rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-100 ease-linear"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksHome;
