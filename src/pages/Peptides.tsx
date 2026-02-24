import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FlaskConical, ChevronDown, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import peptideVial from "@/assets/peptide-vial.png";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const peptides = [
  {
    name: "BPC-157",
    category: "Recovery & Healing",
    price: 350,
    description: "Body Protection Compound, a naturally occurring peptide found in gastric juice. Promotes tissue repair, reduces inflammation, and accelerates healing of muscles, tendons, and ligaments.",
    benefits: ["Accelerates wound and tissue healing", "Reduces inflammation", "Supports gut health", "Promotes tendon and ligament repair", "Neuroprotective properties"],
    candidates: ["Athletes recovering from injury", "Individuals with chronic joint or tendon pain", "Those with gut issues like leaky gut or IBS", "Post-surgical recovery patients"],
    administration: "Subcutaneous injection, typically once or twice daily",
  },
  {
    name: "Semaglutide",
    category: "Weight Management",
    price: 450,
    description: "A GLP-1 receptor agonist that regulates appetite and blood sugar. Slows gastric emptying and promotes satiety for sustainable weight loss.",
    benefits: ["Significant and sustained weight loss", "Improved blood sugar regulation", "Reduced appetite and cravings", "Cardiovascular health benefits", "Reduced inflammation"],
    candidates: ["Individuals with BMI ≥27 seeking medical weight loss", "Those with insulin resistance or pre-diabetes", "Patients who have struggled with diet and exercise alone"],
    administration: "Weekly subcutaneous injection, dose titrated gradually",
  },
  {
    name: "Tirzepatide",
    category: "Weight Management",
    price: 550,
    description: "A dual GIP/GLP-1 receptor agonist offering enhanced weight loss and metabolic benefits. Targets two incretin pathways for superior appetite control and glucose regulation.",
    benefits: ["Superior weight loss compared to single-agonist therapies", "Improved insulin sensitivity", "Reduced appetite", "Cardiovascular risk reduction", "Better glycemic control"],
    candidates: ["Individuals seeking aggressive medical weight loss", "Patients with type 2 diabetes", "Those who plateaued on other GLP-1 therapies"],
    administration: "Weekly subcutaneous injection, dose titrated over several weeks",
  },
  {
    name: "CJC-1295 / Ipamorelin",
    category: "Anti-Aging & Performance",
    price: 300,
    description: "A synergistic combination that stimulates natural growth hormone release. CJC-1295 extends GH release while Ipamorelin provides a clean, targeted GH pulse without cortisol spikes.",
    benefits: ["Increased lean muscle mass", "Improved fat metabolism", "Better sleep quality", "Enhanced recovery", "Improved skin elasticity", "Stronger immune function"],
    candidates: ["Adults over 30 experiencing age-related decline", "Athletes seeking natural performance enhancement", "Individuals with poor sleep or slow recovery"],
    administration: "Subcutaneous injection, typically before bed 5 days per week",
  },
  {
    name: "PT-141 (Bremelanotide)",
    category: "Sexual Wellness",
    price: 400,
    description: "A melanocortin receptor agonist that works through the central nervous system to enhance sexual desire and arousal. Works differently from PDE5 inhibitors by targeting brain pathways.",
    benefits: ["Increased sexual desire and arousal", "Works for both men and women", "Addresses hypoactive sexual desire disorder", "Does not require timing around activity"],
    candidates: ["Men and women experiencing low libido", "Individuals who haven't responded to traditional ED medications", "Those with hypoactive sexual desire disorder"],
    administration: "Subcutaneous injection or nasal spray, taken as needed",
  },
  {
    name: "Thymosin Alpha-1",
    category: "Immune Support",
    price: 380,
    description: "A naturally occurring peptide that modulates and enhances immune system function. Used clinically to boost immunity in immunocompromised patients and support overall immune resilience.",
    benefits: ["Enhanced immune system function", "Improved T-cell activity", "Antiviral and antibacterial properties", "Supports vaccine response", "Anti-inflammatory effects"],
    candidates: ["Immunocompromised individuals", "Those with chronic infections", "Patients undergoing cancer treatment", "Frequent travelers"],
    administration: "Subcutaneous injection, typically 2-3 times per week",
  },
  {
    name: "TB-500 (Thymosin Beta-4)",
    category: "Recovery & Healing",
    price: 350,
    description: "A peptide involved in tissue repair and regeneration. Promotes cell migration, reduces inflammation, and supports healing of injured tissues including muscle, tendon, and cardiac tissue.",
    benefits: ["Promotes tissue regeneration", "Reduces scar tissue formation", "Anti-inflammatory", "Supports cardiac repair", "Enhances flexibility and mobility"],
    candidates: ["Athletes with soft tissue injuries", "Individuals recovering from surgery", "Those with chronic inflammatory conditions"],
    administration: "Subcutaneous injection, typically 2 times per week during loading phase",
  },
  {
    name: "NAD+",
    category: "Anti-Aging & Performance",
    price: 500,
    description: "A coenzyme essential for cellular energy production and DNA repair. Levels decline with age, and supplementation supports mitochondrial function, cognitive health, and longevity.",
    benefits: ["Enhanced cellular energy production", "Improved cognitive function", "DNA repair support", "Anti-aging at the cellular level", "Addiction recovery support"],
    candidates: ["Adults experiencing age-related fatigue", "Individuals seeking cognitive enhancement", "Those in addiction recovery", "Longevity-focused individuals"],
    administration: "IV infusion, subcutaneous injection, or nasal spray",
  },
  {
    name: "Selank",
    category: "Cognitive & Mood",
    price: 280,
    description: "A synthetic peptide derived from the naturally occurring immunomodulatory peptide tuftsin. Provides anxiolytic effects while enhancing cognitive function without sedation or dependency risk.",
    benefits: ["Anxiety reduction without sedation", "Improved memory and learning", "Enhanced cognitive function", "Mood stabilization", "No dependency risk"],
    candidates: ["Individuals with anxiety or stress-related conditions", "Students or professionals seeking cognitive enhancement", "Those looking for non-addictive anxiety relief"],
    administration: "Nasal spray, typically 2-3 times daily",
  },
  {
    name: "Semax",
    category: "Cognitive & Mood",
    price: 280,
    description: "A synthetic peptide analog of ACTH that enhances brain-derived neurotrophic factor (BDNF). Supports cognitive performance, neuroprotection, and recovery from neurological conditions.",
    benefits: ["Enhanced BDNF production", "Improved focus and attention", "Neuroprotective effects", "Supports stroke recovery", "Boosts learning and memory"],
    candidates: ["Individuals seeking cognitive enhancement", "Patients recovering from TBI or stroke", "Those with ADHD-like symptoms", "Professionals needing sustained mental performance"],
    administration: "Nasal spray, typically 2-3 times daily",
  },
  {
    name: "GHK-Cu (Copper Peptide)",
    category: "Skin & Hair",
    price: 320,
    description: "A naturally occurring copper complex peptide that declines with age. Stimulates collagen synthesis, promotes skin remodeling, and has powerful anti-aging effects on skin and hair.",
    benefits: ["Stimulates collagen and elastin production", "Reduces fine lines and wrinkles", "Promotes hair growth", "Accelerates wound healing", "Antioxidant protection"],
    candidates: ["Individuals seeking skin rejuvenation", "Those experiencing hair thinning", "Post-procedure skin recovery", "Anyone seeking topical anti-aging benefits"],
    administration: "Topical application, subcutaneous injection, or microneedling",
  },
  {
    name: "Epithalon",
    category: "Anti-Aging & Performance",
    price: 400,
    description: "A synthetic version of the naturally produced Epithalamin peptide. Activates telomerase to lengthen telomeres, the protective caps on chromosomes that shorten with age.",
    benefits: ["Telomere lengthening", "Improved sleep cycle regulation", "Enhanced antioxidant defenses", "Neuroendocrine regulation", "Potential lifespan extension"],
    candidates: ["Longevity-focused individuals", "Those experiencing premature aging", "Patients with disrupted sleep-wake cycles"],
    administration: "Subcutaneous injection, typically in 10-20 day cycles",
  },
  {
    name: "DSIP",
    category: "Sleep & Recovery",
    price: 300,
    description: "Delta Sleep-Inducing Peptide — a neuropeptide that promotes deep, restorative delta-wave sleep. Helps normalize sleep architecture without grogginess or dependency.",
    benefits: ["Promotes deep delta-wave sleep", "Reduces sleep latency", "Normalizes circadian rhythm", "No morning grogginess", "Stress hormone regulation", "Non-addictive"],
    candidates: ["Individuals with insomnia or disrupted sleep", "Shift workers", "Those with high stress affecting sleep", "Patients seeking alternatives to prescription sleep aids"],
    administration: "Subcutaneous injection or nasal spray, taken 30-60 minutes before bed",
  },
  {
    name: "Pentosan Polysulfate",
    category: "Joint & Mobility",
    price: 380,
    description: "A semi-synthetic polysaccharide with anti-inflammatory and cartilage-protective properties. Supports joint health by inhibiting cartilage degradation and promoting synovial fluid production.",
    benefits: ["Cartilage protection and regeneration", "Increased synovial fluid production", "Anti-inflammatory", "Improved joint mobility", "Pain reduction"],
    candidates: ["Individuals with osteoarthritis", "Athletes with joint wear", "Those seeking alternatives to joint replacement", "Patients with interstitial cystitis"],
    administration: "Subcutaneous or intramuscular injection, typically weekly",
  },
  {
    name: "Kisspeptin",
    category: "Hormone Optimization",
    price: 420,
    description: "A neuropeptide that plays a crucial role in reproductive hormone regulation. Stimulates GnRH release, supporting natural testosterone and estrogen production through the HPG axis.",
    benefits: ["Stimulates natural hormone production", "Supports fertility", "Regulates reproductive axis", "May improve libido", "Maintains testicular function during TRT"],
    candidates: ["Men on or considering TRT who want to maintain fertility", "Women with hypothalamic amenorrhea", "Individuals with low hormone levels seeking natural stimulation"],
    administration: "Subcutaneous injection, frequency varies by protocol",
  },
];

const categoryColors: Record<string, string> = {
  "Recovery & Healing": "bg-green-500/15 text-green-400 border-green-500/25",
  "Weight Management": "bg-orange-500/15 text-orange-400 border-orange-500/25",
  "Anti-Aging & Performance": "bg-purple-500/15 text-purple-400 border-purple-500/25",
  "Sexual Wellness": "bg-pink-500/15 text-pink-400 border-pink-500/25",
  "Immune Support": "bg-blue-500/15 text-blue-400 border-blue-500/25",
  "Cognitive & Mood": "bg-cyan-500/15 text-cyan-400 border-cyan-500/25",
  "Skin & Hair": "bg-amber-500/15 text-amber-400 border-amber-500/25",
  "Sleep & Recovery": "bg-indigo-500/15 text-indigo-400 border-indigo-500/25",
  "Joint & Mobility": "bg-teal-500/15 text-teal-400 border-teal-500/25",
  "Hormone Optimization": "bg-rose-500/15 text-rose-400 border-rose-500/25",
};

const categories = [...new Set(peptides.map(p => p.category))];

const Peptides = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filtered = activeCategory ? peptides.filter(p => p.category === activeCategory) : peptides;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground transition-colors font-body font-light mb-10"
          >
            <ArrowLeft size={14} strokeWidth={1.2} />
            Back to Home
          </Link>

          <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground text-center mb-3 font-body font-light">
            Our Protocols
          </p>
          <h1 className="text-3xl md:text-5xl font-extralight text-center mb-4 tracking-tight font-heading">
            Peptide Catalog
          </h1>
          <p className="text-muted-foreground text-center max-w-lg mx-auto mb-12 font-body font-light text-sm">
            Explore our complete range of peptide therapies. Click any protocol to learn more.
          </p>

          {/* Category filters */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            <button
              onClick={() => setActiveCategory(null)}
              className={`px-4 py-2 text-[10px] tracking-[0.15em] uppercase font-body font-light border rounded transition-colors ${
                !activeCategory ? "bg-primary/15 text-primary border-primary/30" : "border-border text-muted-foreground hover:text-foreground hover:border-muted-foreground"
              }`}
            >
              All
            </button>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
                className={`px-4 py-2 text-[10px] tracking-[0.15em] uppercase font-body font-light border rounded transition-colors ${
                  activeCategory === cat ? "bg-primary/15 text-primary border-primary/30" : "border-border text-muted-foreground hover:text-foreground hover:border-muted-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Peptide cards */}
          <div className="space-y-4">
            {filtered.map((p, i) => {
              const globalIndex = peptides.indexOf(p);
              const isExpanded = expandedIndex === globalIndex;

              return (
                <motion.div
                  key={p.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                >
                  <div
                    onClick={() => setExpandedIndex(isExpanded ? null : globalIndex)}
                    className={`bg-card border rounded-lg overflow-hidden cursor-pointer transition-all duration-300 ${
                      isExpanded ? "border-primary/30" : "border-border hover:border-primary/20"
                    }`}
                  >
                    <div className="flex items-center gap-5 p-5 sm:p-6">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 rounded-lg bg-secondary/50 overflow-hidden flex items-center justify-center">
                        <img src={peptideVial} alt={p.name} className="w-12 h-12 sm:w-16 sm:h-16 object-contain" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h3 className="text-lg font-heading font-light text-foreground tracking-tight">{p.name}</h3>
                          <span className={`inline-flex px-2 py-0.5 text-[9px] tracking-wider uppercase font-body font-light border rounded ${categoryColors[p.category] || ""}`}>
                            {p.category}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground font-body font-light leading-relaxed line-clamp-2">{p.description}</p>
                      </div>
                      <div className="flex-shrink-0 text-right hidden sm:block">
                        <p className="text-2xl font-heading font-light text-foreground">${p.price}</p>
                        <p className="text-[10px] tracking-wider uppercase text-muted-foreground font-body font-light">per protocol</p>
                      </div>
                      <ChevronDown
                        size={18}
                        strokeWidth={1.2}
                        className={`flex-shrink-0 text-muted-foreground transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
                      />
                    </div>

                    <div className="px-5 pb-3 sm:hidden flex items-center justify-between">
                      <p className="text-xl font-heading font-light text-foreground">${p.price} <span className="text-[10px] tracking-wider uppercase text-muted-foreground font-body font-light">per protocol</span></p>
                    </div>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="px-5 sm:px-6 pb-6 pt-2 border-t border-border space-y-5">
                            <div className="grid md:grid-cols-2 gap-6">
                              <div>
                                <p className="text-xs tracking-[0.2em] uppercase text-primary font-body font-light mb-3">Benefits</p>
                                <ul className="space-y-2">
                                  {p.benefits.map((b, j) => (
                                    <li key={j} className="text-sm text-muted-foreground font-body font-light flex items-start gap-2.5">
                                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                                      {b}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              <div>
                                <p className="text-xs tracking-[0.2em] uppercase text-primary font-body font-light mb-3">Ideal Candidates</p>
                                <ul className="space-y-2">
                                  {p.candidates.map((c, j) => (
                                    <li key={j} className="text-sm text-muted-foreground font-body font-light flex items-start gap-2.5">
                                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                                      {c}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>

                            <div>
                              <p className="text-xs tracking-[0.2em] uppercase text-primary font-body font-light mb-2">Administration</p>
                              <p className="text-sm text-muted-foreground font-body font-light">{p.administration}</p>
                            </div>

                            <div className="pt-2">
                              <a
                                href="/#contact"
                                onClick={(e) => e.stopPropagation()}
                                className="inline-flex items-center gap-2 px-6 py-3 text-xs font-body font-light tracking-[0.2em] uppercase bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                              >
                                <FlaskConical size={14} strokeWidth={1.5} />
                                Labs Required
                              </a>
                              <p className="text-[11px] text-muted-foreground font-body font-light mt-2">
                                Lab work must be completed before this protocol can be prescribed.
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Peptides;
