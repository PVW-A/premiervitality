import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, ChevronRight, Syringe, Droplets, Target } from "lucide-react";
import drawFromVial from "@/assets/draw-from-vial.mp4";
import prepareInjection from "@/assets/prepare-injection.mp4";

const steps = [
  {
    title: "Draw from Vial",
    description:
      "Insert the needle through the rubber stopper, invert the vial, and slowly draw the prescribed dose into the syringe.",
    icon: Droplets,
    video: drawFromVial,
  },
  {
    title: "Prepare the Syringe",
    description:
      "Tap the syringe barrel to move air bubbles to the top, then gently push the plunger to expel any trapped air.",
    icon: Syringe,
    video: prepareInjection,
  },
  {
    title: "Inject Subcutaneously",
    description:
      "Pinch a fold of skin at the injection site (abdomen or upper thigh), insert the needle at a 45° angle, and slowly depress the plunger.",
    icon: Target,
    video: null, // could not generate due to content policy
  },
];

export default function InjectionGuide() {
  const [activeStep, setActiveStep] = useState(0);
  const current = steps[activeStep];

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2">
        <Syringe size={16} strokeWidth={1.2} className="text-primary" />
        <h2 className="text-xs tracking-[0.2em] uppercase text-foreground font-body font-light">
          Injection Guide
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-4">
        {/* Steps nav */}
        <div className="space-y-2">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <button
                key={i}
                onClick={() => setActiveStep(i)}
                className={`w-full flex items-center gap-3 p-3 rounded border transition-colors text-left ${
                  activeStep === i
                    ? "border-primary bg-primary/5"
                    : "border-border bg-card hover:border-muted-foreground/30"
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-body ${
                    activeStep === i
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-body font-light text-foreground truncate">
                    {step.title}
                  </p>
                </div>
                <ChevronRight
                  size={14}
                  className={
                    activeStep === i
                      ? "text-primary"
                      : "text-muted-foreground/40"
                  }
                />
              </button>
            );
          })}
        </div>

        {/* Video + description */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="rounded border border-border bg-card overflow-hidden"
          >
            {current.video ? (
              <video
                src={current.video}
                controls
                autoPlay
                muted
                loop
                playsInline
                className="w-full aspect-video object-cover bg-background"
              />
            ) : (
              <div className="w-full aspect-video bg-muted/30 flex items-center justify-center">
                <div className="text-center space-y-2 px-6">
                  <Play size={32} className="text-muted-foreground/40 mx-auto" />
                  <p className="text-xs text-muted-foreground font-body font-light">
                    Your physician will walk you through proper injection
                    technique during your consultation.
                  </p>
                </div>
              </div>
            )}
            <div className="p-4 space-y-1">
              <p className="text-sm font-heading font-light text-foreground">
                Step {activeStep + 1}: {current.title}
              </p>
              <p className="text-xs text-muted-foreground font-body font-light leading-relaxed">
                {current.description}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
