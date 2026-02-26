import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import nicolasPhoto from "@/assets/nicolas-loo.jpg";
import jamesPhoto from "@/assets/dr-james-loo.jpg";
const values = [
  {
    title: "Evidence-Based Protocols",
    description:
      "Every treatment we offer is grounded in peer-reviewed research and clinical data. We don't follow trends; we follow the science.",
  },
  {
    title: "Physician-Led Care",
    description:
      "Our protocols are designed and supervised by licensed physicians with deep expertise in regenerative medicine and peptide therapy.",
  },
  {
    title: "Personalized Treatment Plans",
    description:
      "No two patients are the same. We build every protocol around your labs, health history, lifestyle, and goals.",
  },
  {
    title: "Transparency & Trust",
    description:
      "We believe in full transparency with our patients. You'll always know what you're taking, why you're taking it, and what to expect.",
  },
];

const stats = [
  { value: "500+", label: "Patients Treated" },
  { value: "98%", label: "Satisfaction Rate" },
  { value: "15+", label: "Peptide Protocols" },
  { value: "24/7", label: "Patient Support" },
];

const About = () => (
  <div className="min-h-screen bg-background">
    <SEO
      title="About Us"
      description="Learn about Premier Vitality & Wellness, our mission to advance peptide therapy and longevity medicine with physician-directed, evidence-based protocols."
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
            Science Meets Vitality
          </h1>
          <p className="text-muted-foreground font-body font-light text-sm leading-relaxed max-w-2xl mx-auto">
            Premier Vitality & Wellness is a physician-led clinic specializing in peptide therapy and regenerative medicine. We combine cutting-edge research with personalized care to help our patients achieve optimal health, longevity, and performance.
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

        {/* Mission */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-24"
        >
          <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-3 font-body font-light">
            Our Mission
          </p>
          <h2 className="text-2xl md:text-4xl font-extralight mb-6 tracking-tight">
            Redefining What's Possible
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <p className="text-muted-foreground font-body font-light text-sm leading-relaxed">
              We founded Premier Vitality with a simple belief: that modern medicine should do more than manage symptoms. It should optimize how you feel, perform, and age. Peptide therapy represents the frontier of that vision, offering targeted, research-backed solutions that work with your body's own biology.
            </p>
            <p className="text-muted-foreground font-body font-light text-sm leading-relaxed">
              Our team stays at the forefront of peptide research, continuously refining our protocols based on the latest clinical evidence. We partner with compounding pharmacies that meet the highest standards of quality and purity, ensuring every treatment we provide is safe, effective, and tailored to you.
            </p>
          </div>
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
                  <img src={jamesPhoto} alt="Dr. James Loo" className="w-full h-full object-cover scale-[1.2]" style={{ objectPosition: "85% 15%" }} />
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
                Driven by watching family members battle degenerative brain disease, Nicolas turned grief into purpose. His relentless pursuit of cutting-edge science and refusal to accept the status quo is the foundation of Premier Vitality's mission.
              </p>
              <span className="inline-flex items-center gap-1.5 text-xs text-primary font-body font-light tracking-wider uppercase group-hover:gap-2.5 transition-all">
                Read His Story <ArrowRight size={12} />
              </span>
            </Link>
          </div>
        </motion.div>

        {/* Values */}
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
            Our Core Values
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {values.map((v, i) => (
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
      </div>
    </main>
    <Footer />
  </div>
);

export default About;
