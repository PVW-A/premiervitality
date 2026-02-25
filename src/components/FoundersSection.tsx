import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import nicolasPhoto from "@/assets/nicolas-loo.jpg";

const founders = [
  {
    initials: "JL",
    name: "Dr. James Loo",
    title: "Physician & Co-Founder",
    bio: "A board-certified physician with decades of clinical experience, Dr. James Loo brings deep medical expertise and an unwavering commitment to evidence-based peptide therapy.",
    link: "/dr-james-story",
  },
  {
    initials: "NL",
    name: "Nicolas Loo",
    title: "Co-Founder",
    photo: nicolasPhoto,
    bio: "Driven by a passion for innovation and patient experience, Nicolas bridges cutting-edge science with modern wellness, ensuring every protocol is as seamless as it is effective.",
    link: "/our-why",
  },
];

const FoundersSection = () => (
  <section id="founders" className="py-28 px-6 bg-background">
    <div className="max-w-5xl mx-auto text-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-3 font-body font-light">
          Our Founders
        </p>
        <h2 className="text-3xl md:text-5xl font-extralight mb-4 tracking-tight">
          A Legacy of Innovation
        </h2>
        <p className="text-muted-foreground font-body font-light text-sm max-w-xl mx-auto mb-16">
          A father-son partnership rooted in medicine, united by a shared vision for modern vitality.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-10">
        {founders.map((f, i) => (
          <motion.div
            key={f.name}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.15 }}
            className="flex flex-col items-center"
          >
            <div className="w-24 h-24 rounded-full border-2 border-primary/40 bg-secondary flex items-center justify-center mb-6 overflow-hidden">
              {f.photo ? (
                <img src={f.photo} alt={f.name} className="w-full h-full object-cover object-[center_30%]" />
              ) : (
                <span className="text-2xl font-heading font-extralight text-primary">
                  {f.initials}
                </span>
              )}
            </div>
            <h3 className="text-xl font-extralight tracking-tight mb-1">{f.name}</h3>
            <p className="text-xs tracking-[0.2em] uppercase text-primary/70 font-body mb-4">
              {f.title}
            </p>
            <p className="text-muted-foreground font-body font-light text-sm leading-relaxed max-w-sm">
              {f.bio}
            </p>
            {f.link && (
              <Link to={f.link} className="mt-3 text-xs tracking-[0.2em] uppercase text-primary/80 hover:text-primary transition-colors font-body">
                Read My Story →
              </Link>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default FoundersSection;
