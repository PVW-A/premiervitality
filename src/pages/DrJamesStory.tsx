import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

const DrJamesStory = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <main className="pt-32 pb-20 px-6">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-3 font-body font-light">
            My Story
          </p>
          <h1 className="text-3xl md:text-5xl font-extralight mb-6 tracking-tight">
            How I Got Here
          </h1>

          <div className="flex items-center gap-4 mb-10">
            <div className="w-16 h-16 rounded-full border-2 border-primary/40 bg-secondary flex items-center justify-center shrink-0">
              <span className="text-xl font-heading font-extralight text-primary">JL</span>
            </div>
            <div>
              <p className="font-extralight text-lg">Dr. James Loo</p>
              <p className="text-xs tracking-[0.2em] uppercase text-primary/70 font-body">Physician & Co-Founder</p>
            </div>
          </div>

          <div className="space-y-6 text-muted-foreground font-body font-light text-sm leading-relaxed">
            <p>
              It started in a lab at UC Davis, over 40 years ago. I was an undergrad doing research on neuroplasticity — basically, how the brain rewires itself. At the time, most people hadn't even heard that word. But I was hooked. There was something about understanding how the brain adapts, heals, and changes that just made sense to me.
            </p>
            <p>
              That curiosity followed me into medical school, where I kept digging into neuroplasticity research. I wanted to understand what happens when the brain's ability to adapt gets disrupted — and more importantly, what we could do about it. That question drove everything that came next.
            </p>
            <p>
              It paved the way to my residency at Barrow Neurological Institute in neurology, where I got to work alongside some of the best minds in brain science. Being in that environment, seeing patients with real neurological challenges every day, it sharpened everything I'd been studying and gave it a clinical edge.
            </p>
            <p>
              From there, the path led naturally into addiction medicine. When you spend years studying how the brain rewires itself, you start to see addiction differently. It's not a character flaw — it's a brain that got stuck in a loop. The neurology background gave me real tools to help people find their way out, and I got board-certified in addiction medicine because the patients needed someone who understood the why behind it.
            </p>
            <p>
              I also became board-certified in family practice because I've always wanted to take care of the whole person, not just one piece of the puzzle. Families, kids, grandparents — the full picture. That's always been important to me.
            </p>
            <p>
              After decades of practicing medicine, I've learned that the best care doesn't come from textbooks alone. It comes from listening, staying curious, and being willing to look at things from a different angle. Peptide therapy is a natural extension of everything I've studied — it's about giving the body the right signals to heal and optimize at the cellular level.
            </p>
            <p>
              I didn't start this company to chase a trend. I started it because after 40 years of research and clinical work, I know what's possible when you combine real science with genuine care. That's what we're building here.
            </p>
          </div>
        </motion.div>
      </div>
    </main>
    <Footer />
  </div>
);

export default DrJamesStory;
