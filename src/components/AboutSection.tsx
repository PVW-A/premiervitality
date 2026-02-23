import { motion } from "framer-motion";

const stats = [
  { value: "500+", label: "Patients Treated" },
  { value: "98%", label: "Satisfaction Rate" },
  { value: "15+", label: "Peptide Protocols" },
];

const AboutSection = () => (
  <section id="about" className="py-28 px-6 bg-card/50">
    <div className="max-w-5xl mx-auto">
      <div className="grid md:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-3 font-body font-light">
            About Us
          </p>
          <h2 className="text-3xl md:text-5xl font-extralight mb-6 tracking-tight">
            Science Meets Vitality
          </h2>
          <p className="text-muted-foreground font-body font-light text-sm leading-relaxed mb-4">
            We are a physician-led vitality clinic specializing in peptide therapy. Our evidence-based approach combines cutting-edge research with personalized treatment plans.
          </p>
          <p className="text-muted-foreground font-body font-light text-sm leading-relaxed">
            Every protocol is designed around your labs, lifestyle, and goals — because optimal health isn't one-size-fits-all.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="grid grid-cols-3 gap-4"
        >
          {stats.map((s) => (
            <div key={s.label} className="text-center p-6 bg-secondary rounded-lg">
              <p className="font-heading text-3xl font-bold text-primary mb-1">{s.value}</p>
              <p className="text-xs tracking-widest uppercase text-muted-foreground font-body">
                {s.label}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  </section>
);

export default AboutSection;
