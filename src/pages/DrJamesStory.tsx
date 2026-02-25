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
              It started in a lab at UC Davis, more than 40 years ago. I was an undergraduate researcher studying neuroplasticity, how the brain rewires itself. Most people hadn't heard that word yet. But I was captivated. There was something profound about understanding how the brain adapts, heals, and rebuilds that felt like the most important question in medicine.
            </p>
            <p>
              That fascination carried me through medical school, where I continued digging into neuroplasticity research. I wanted to understand what happens when the brain's capacity to adapt breaks down, and more importantly, what we could do to restore it. That question shaped everything that came next.
            </p>
            <p>
              It led me to a residency at Barrow Neurological Institute, one of the world's foremost centers for brain science. Working alongside exceptional colleagues and caring for patients with complex neurological conditions every day sharpened my thinking and gave my research a clinical edge it had been missing.
            </p>
            <p>
              From there, the path led naturally to addiction medicine. When you spend years studying how the brain rewires itself, you begin to see addiction differently. Not as a moral failing, but as a brain caught in a destructive loop. My neurology background gave me real, evidence-based tools to help people find their way out. Over more than 30 years in addiction medicine, I've witnessed what becomes possible when you treat the brain with the respect and precision it deserves.
            </p>
            <p>
              I also pursued board certification in family practice, because I've always believed in treating the whole person. Families, children, grandparents, the full picture has always mattered to me, not just one piece of the puzzle.
            </p>
            <p>
              After decades in clinical medicine, I've learned that the best care rarely comes from textbooks alone. It comes from listening carefully, staying relentlessly curious, and being willing to look at old problems from new angles. Peptide therapy is a natural extension of that philosophy, giving the body the precise signals it needs to heal and optimize at the cellular level.
            </p>
            <p>
              I didn't start this company to chase a trend. I started it because after 40 years of research and clinical practice, I know what's possible when rigorous science meets genuine human care. That's what we're building here, and I'm proud to be building it with you.
            </p>
          </div>
        </motion.div>
      </div>
    </main>
    <Footer />
  </div>
);

export default DrJamesStory;
