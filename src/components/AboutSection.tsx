import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const stats = [
  { value: "500+", label: "Patients Treated" },
  { value: "98%", label: "Satisfaction Rate" },
  { value: "15+", label: "Peptide Protocols" },
];

const AboutSection = () => (
  <section id="about" className="relative py-28 px-6 overflow-hidden">
    {/* Layered luxury background */}
    <div className="absolute inset-0 bg-gradient-to-br from-[hsl(220,20%,6%)] via-[hsl(220,18%,8%)] to-[hsl(230,20%,5%)]" />
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(40,45%,58%,0.04),transparent_60%)]" />
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,hsl(40,45%,58%,0.03),transparent_50%)]" />
    <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")' }} />
    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
    <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
    <div className="max-w-5xl mx-auto relative z-10">
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
            Every protocol is designed around your labs, lifestyle, and goals because optimal health isn't one-size-fits-all.
          </p>
          <Link to="/about" className="mt-4 inline-block text-xs tracking-[0.2em] uppercase text-primary/80 hover:text-primary transition-colors font-body">
            Learn More About Us →
          </Link>
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
              <p className="text-2xl font-extralight text-foreground mb-1">{s.value}</p>
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
