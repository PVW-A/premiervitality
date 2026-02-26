import SEO from "@/components/SEO";
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
              This company wasn't born in a boardroom. It was born from watching the people I love most slowly lose themselves, and feeling completely powerless to stop it.
            </p>
            <p>
              Several members of my family have battled degenerative brain disease. I've watched brilliant, vibrant people fade, their memories slipping, their independence shrinking, the spark in their eyes dimming. That kind of loss doesn't leave you. It rewires you.
            </p>
            <p>
              So I did what I knew how to do. I started digging. I read the studies, followed the clinical trials, sought out physicians and researchers who were asking the same hard questions. That's when I found peptide therapy, and the growing body of evidence behind its potential to support neurological health, cellular repair, and lasting vitality. For the first time, I wasn't just grieving. I was looking at possibility.
            </p>
            <p>
              I'm not here to make promises. I'm here because the science is real, the need is urgent, and I refuse to stand on the sidelines while the people I love, and people just like them, wait for answers that conventional medicine alone may never deliver.
            </p>
            <p>
              Premier Vitality exists because of that refusal. Every protocol we build, every person we serve, is a step toward the future I want for my family. And for yours.
            </p>
          </div>
        </motion.div>
      </div>
    </main>
    <Footer />
  </div>
);

export default OurWhy;
