import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TestimonialsMarquee from "@/components/TestimonialsMarquee";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import nicolasPhoto from "@/assets/nicolas-loo.jpg";
import jamesPhoto from "@/assets/dr-james-loo.jpg";

const pillars = [
  {
    title: "Physician-Directed Precision",
    description:
      "Every protocol is designed and supervised by licensed physicians. No generic guidelines, no guesswork. Your data drives every decision.",
  },
  {
    title: "Performance Infrastructure",
    description:
      "This is not a wellness shop. It is a structured system of precision protocols, clinical check-ins, and evolving optimization tools that scale with you.",
  },
  {
    title: "Uncompromising Science",
    description:
      "We follow the evidence, not the trends. Every treatment is grounded in peer-reviewed research and clinical data, refined continuously as the science advances.",
  },
  {
    title: "Concierge-Level Access",
    description:
      "High-touch clinical care historically reserved for the highest-net-worth circles. We have made it accessible without compromising an inch of the standard.",
  },
];

const stats = [
  { value: "500+", label: "Patients Optimized" },
  { value: "98%", label: "Satisfaction Rate" },
  { value: "80+", label: "Precision Protocols" },
  { value: "24/7", label: "Concierge Support" },
];

const About = () => (
  <div className="min-h-screen">
    <SEO
      title="About Us"
      description="Premier Vitality & Wellness is a physician-led health optimization and longevity practice built for entrepreneurs, executives, and elite professionals who demand their biology keep up."
      canonical="/about"
    />
    <Navbar />
    <main className="pt-32 pb-20 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-3 font-body font-light">
            About Us
          </p>
          <h1 className="text-3xl md:text-5xl font-extralight mb-6 tracking-tight">
            This Is Not a Wellness Shop
          </h1>
          <p className="text-muted-foreground font-body font-light text-sm leading-relaxed max-w-2xl mx-auto">
            Premier Vitality & Wellness is a physician-led health optimization and longevity practice built for people who operate at the highest levels and demand their biology keep up. We bridge the precision of modern clinical medicine with the cutting edge of performance science to deliver something the traditional healthcare system was never designed to offer: a measurable, sustainable edge.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-24"
        >
          {stats.map((s) => (
            <div key={s.label} className="text-center p-6 bg-secondary rounded-lg">
              <p className="text-2xl font-extralight text-foreground mb-1">{s.value}</p>
              <p className="text-xs tracking-widest uppercase text-muted-foreground font-body">
                {s.label}
              </p>
            </div>
          ))}
        </motion.div>

        {/* Who We Serve */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-24"
        >
          <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-3 font-body font-light">
            Who We Serve
          </p>
          <h2 className="text-2xl md:text-4xl font-extralight mb-6 tracking-tight">
            Built for the Exceptional
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <p className="text-muted-foreground font-body font-light text-sm leading-relaxed">
              Our clients are entrepreneurs, executives, and elite professionals who have already built something exceptional. They are not here because something is wrong. They are here because good enough never was, and because they understand that energy, focus, cognitive sharpness, hormonal optimization, and physical resilience are not luxuries. They are leverage.
            </p>
            <p className="text-muted-foreground font-body font-light text-sm leading-relaxed">
              What we offer is not a product. It is a system: a membership-based ecosystem of precision protocols, structured check-ins, and evolving optimization tools that scale with you as your goals evolve. The deeper you go, the more powerful it becomes. We do not guess. We do not cut corners. And we do not settle for anything less than elite.
            </p>
          </div>
        </motion.div>

        {/* Tagline divider */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-24 py-12 border-y border-border"
        >
          <p className="text-lg md:text-2xl font-extralight tracking-tight text-foreground">
            Precision protocols. Engineered for longevity. Built for performance.
          </p>
        </motion.div>

        {/* Meet the Founders */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-24"
        >
          <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-3 font-body font-light">
            Leadership
          </p>
          <h2 className="text-2xl md:text-4xl font-extralight mb-10 tracking-tight">
            Meet the Founders
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Dr. James Loo */}
            <Link
              to="/dr-james-story"
              className="group p-6 bg-secondary/50 rounded-lg border border-border hover:border-primary/30 transition-colors"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-full border-2 border-primary/40 overflow-hidden shrink-0">
                  <img src={jamesPhoto} alt="Dr. James Loo" className="w-full h-full object-cover scale-[1.6]" style={{ objectPosition: "48% 15%" }} />
                </div>
                <div>
                  <p className="font-extralight text-lg text-foreground">Dr. James Loo</p>
                  <p className="text-[10px] tracking-[0.2em] uppercase text-primary/70 font-body">
                    Medical Director & Co-Founder
                  </p>
                </div>
              </div>
              <p className="text-muted-foreground font-body font-light text-sm leading-relaxed mb-4">
                With over 40 years of clinical experience spanning neuroplasticity research at UC Davis, training at Barrow Neurological Institute, and decades in addiction medicine, Dr. James Loo brings a rare depth of knowledge to peptide therapy and regenerative medicine.
              </p>
              <span className="inline-flex items-center gap-1.5 text-xs text-primary font-body font-light tracking-wider uppercase group-hover:gap-2.5 transition-all">
                Read His Story <ArrowRight size={12} />
              </span>
            </Link>

            {/* Nicolas Loo */}
            <Link
              to="/our-why"
              className="group p-6 bg-secondary/50 rounded-lg border border-border hover:border-primary/30 transition-colors"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-full border-2 border-primary/40 overflow-hidden shrink-0">
                  <img src={nicolasPhoto} alt="Nicolas Loo" className="w-full h-full object-cover object-[center_30%]" />
                </div>
                <div>
                  <p className="font-extralight text-lg text-foreground">Nicolas Loo</p>
                  <p className="text-[10px] tracking-[0.2em] uppercase text-primary/70 font-body">
                    Co-Founder & Innovation
                  </p>
                </div>
              </div>
              <p className="text-muted-foreground font-body font-light text-sm leading-relaxed mb-4">
                Driven by watching family members battle degenerative brain disease, Nicolas turned grief into purpose. His relentless pursuit of cutting-edge science and refusal to accept the status quo is the foundation of Premier Vitality & Wellness's mission.
              </p>
              <span className="inline-flex items-center gap-1.5 text-xs text-primary font-body font-light tracking-wider uppercase group-hover:gap-2.5 transition-all">
                Read His Story <ArrowRight size={12} />
              </span>
            </Link>
          </div>
        </motion.div>

        {/* Pillars */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-3 font-body font-light">
            What Sets Us Apart
          </p>
          <h2 className="text-2xl md:text-4xl font-extralight mb-10 tracking-tight">
            Performance Infrastructure
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {pillars.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="p-6 bg-secondary/50 rounded-lg border border-border"
              >
                <h3 className="text-base font-extralight tracking-tight mb-2 text-foreground">
                  {v.title}
                </h3>
                <p className="text-muted-foreground font-body font-light text-sm leading-relaxed">
                  {v.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <TestimonialsMarquee />
      </div>
    </main>
    <Footer />
  </div>
);

export default About;
