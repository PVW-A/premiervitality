import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import nicolasPhoto from "@/assets/nicolas-loo.jpg";

const OurWhy = () => (
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
            Our Why
          </p>
          <h1 className="text-3xl md:text-5xl font-extralight mb-6 tracking-tight">
            Why This Work Matters to Me
          </h1>

          <div className="flex items-center gap-4 mb-10">
            <div className="w-16 h-16 rounded-full border-2 border-primary/40 overflow-hidden shrink-0">
              <img src={nicolasPhoto} alt="Nicolas Loo" className="w-full h-full object-cover object-[center_30%]" />
            </div>
            <div>
              <p className="font-extralight text-lg">Nicolas Loo</p>
              <p className="text-xs tracking-[0.2em] uppercase text-primary/70 font-body">Co-Founder</p>
            </div>
          </div>

          <div className="space-y-6 text-muted-foreground font-body font-light text-sm leading-relaxed">
            <p>
              This company was never just a business idea for me. It was born from watching the people I love the most struggle with something I couldn't fix.
            </p>
            <p>
              Several members of my family have battled degenerative brain diseases. I've watched brilliant, vibrant people slowly lose pieces of themselves: their memories, their independence, their spark. It's the kind of thing that changes you permanently.
            </p>
            <p>
              I started researching everything I could find. I read the studies, followed the clinical trials, talked to physicians and researchers. That's when I discovered peptide therapy and the growing body of evidence behind its potential to support neurological health, cellular repair, and overall vitality.
            </p>
            <p>
              I'm not here to make promises. I'm here because I believe the science is worth pursuing, and because I refuse to sit on the sidelines while the people I care about — and people like them — wait for answers that may never come from conventional medicine alone.
            </p>
            <p>
              Peptide Vitality exists because of that urgency. Every protocol we develop, every patient we serve, is a step closer to the future I want for my family — and for yours.
            </p>
          </div>
        </motion.div>
      </div>
    </main>
    <Footer />
  </div>
);

export default OurWhy;
