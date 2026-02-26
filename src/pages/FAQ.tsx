import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { openCalendly } from "@/hooks/useCalendly";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqSections = [
  {
    title: "Membership & Pricing",
    items: [
      {
        q: "How does the membership work?",
        a: "Premier Vitality offers three membership tiers — Essential, Premium, and Elite. Each tier unlocks access to our peptide catalog with member-exclusive pricing, scheduled blood work, and physician consultations. You can choose monthly or annual billing, and upgrade or change your plan at any time from your patient portal.",
      },
      {
        q: "Can I see the peptide catalog before subscribing?",
        a: "Absolutely. Our peptide education pages are fully public so you can explore what we offer. Once you create an account, you'll be able to view membership tiers, pricing, and choose the plan that's right for you.",
      },
      {
        q: "What's included with each membership tier?",
        a: "Every tier includes access to the full peptide catalog and scheduled blood panels. Essential includes 1 Vitality Panel per year (40+ biomarkers, valued at $199) with full-price peptide access. Premium adds a 15% peptide discount with 2 Premier Panels per year (67+ biomarkers, valued at $499 each). Elite offers 25% off peptides with 4 Premier Panels per year plus dedicated support and early access to new peptides.",
      },
      {
        q: "What does the included bloodwork cover?",
        a: "We offer two panel levels. The Vitality Panel (40+ biomarkers) covers CBC, comprehensive metabolic panel, thyroid, HbA1c, inflammation markers, Vitamin D, iron studies, urinalysis, and more. The Premier Panel (67+ biomarkers) adds advanced cardiovascular markers (ApoB, Lp(a)), full hormone panels (testosterone, estradiol, FSH/LH, SHBG, prolactin), IGF-1, C-peptide, OmegaCheck, homocysteine, and magnesium. The Vitality Panel retails at $199 and the Premier Panel at $499 — both are included with your membership at no extra charge.",
      },
      {
        q: "Can I cancel my membership?",
        a: "Yes. You can cancel at any time from your patient portal. If you're on an annual plan, your benefits remain active through the end of your billing period.",
      },
    ],
  },
  {
    title: "Peptides & Safety",
    items: [
      {
        q: "What are peptides?",
        a: "Peptides are short chains of amino acids that act as signaling molecules in the body. They can support a wide range of functions including tissue repair, immune regulation, metabolic optimization, and cognitive performance. All peptides we provide are pharmaceutical-grade and physician-supervised.",
      },
      {
        q: "Are peptides safe?",
        a: "When prescribed and monitored by a licensed physician, peptides have an excellent safety profile. Every patient at Premier Vitality receives a thorough consultation and ongoing lab monitoring to ensure safety and efficacy throughout their treatment.",
      },
      {
        q: "Do I need a prescription?",
        a: "Yes. All peptide therapies at Premier Vitality are prescribed by our medical team after a clinical evaluation. This ensures each treatment plan is personalized and medically appropriate for you.",
      },
    ],
  },
  {
    title: "Ordering & Shipping",
    items: [
      {
        q: "How do I order peptides?",
        a: "After subscribing to a membership, you can browse the catalog in your patient portal and request specific peptides. Your physician reviews and approves each request, then you complete payment through a secure link. Orders are shipped directly to your door or available for local pickup.",
      },
      {
        q: "How long does shipping take?",
        a: "Most orders ship within 2–3 business days of physician approval and payment. Standard delivery typically arrives within 5–7 business days. Expedited options may be available depending on your location.",
      },
      {
        q: "Can I pick up my order in person?",
        a: "Yes. During checkout you can choose local pickup instead of shipping. We'll notify you when your order is ready for collection.",
      },
    ],
  },
  {
    title: "Consultations & Lab Work",
    items: [
      {
        q: "How do consultations work?",
        a: "Consultations are conducted virtually with our medical team. During your session, your physician will review your health history, lab results, and goals to build a personalized peptide protocol. You can book your consultation directly through our scheduling system.",
      },
      {
        q: "What blood work is required?",
        a: "We use targeted biomarker panels to monitor your health baseline and track progress. The specific labs depend on your treatment plan, and your membership tier determines how frequently labs are included. Your physician will guide you through everything.",
      },
      {
        q: "Do you accept insurance?",
        a: "Premier Vitality operates as a cash-pay concierge practice. While we don't bill insurance directly, we can provide documentation you may use to submit for reimbursement depending on your plan.",
      },
    ],
  },
  {
    title: "Vitality Score & Bloodwork",
    items: [
      {
        q: "What is the Vitality Score?",
        a: "The Vitality Score is your unified health metric — a single number from 0 to 100 that aggregates over 65 biomarkers across hormones, metabolic health, lipids, thyroid, inflammation, liver & kidney function, and more. It gives you an instant snapshot of your overall wellness and shows exactly which areas need attention.",
      },
      {
        q: "Is it free to get my Vitality Score?",
        a: "Yes! Simply create a free account, upload your existing bloodwork (a photo or PDF), and our AI will read it automatically. Within seconds you'll have your Vitality Score along with a full category breakdown and personalized improvement tips — no appointment or membership required.",
      },
      {
        q: "What bloodwork do I need to upload?",
        a: "Any standard blood panel works — a comprehensive metabolic panel, CBC, lipid panel, or hormone panel. The more markers your labs include, the more comprehensive your Vitality Score will be. We support results from any lab provider (Quest, LabCorp, etc.).",
      },
      {
        q: "How is the Vitality Score calculated?",
        a: "Each biomarker is graded against optimal ranges (not just normal reference ranges) and assigned a score. Markers in the optimal zone score 100, normal scores 70, and out-of-range markers score lower depending on severity. Your overall Vitality Score is the weighted average across all tested markers.",
      },
      {
        q: "Will the Vitality Score tell me how to improve?",
        a: "Absolutely. Every marker that's outside the optimal range comes with specific, actionable tips — from diet and supplement recommendations to lifestyle changes. You'll see your top areas to improve at a glance and can drill into each category for detailed guidance.",
      },
    ],
  },
];

const FAQ = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Frequently Asked Questions"
        description="Common questions about peptide therapy, membership plans, bloodwork analysis, ordering, and our Vitality Score. Get answers from Premier Vitality & Wellness."
        canonical="/faq"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            { "@type": "Question", "name": "What is peptide therapy?", "acceptedAnswer": { "@type": "Answer", "text": "Peptide therapy uses short chains of amino acids to support cellular repair, hormone optimization, recovery, and longevity through physician-directed protocols." }},
            { "@type": "Question", "name": "Is peptide therapy safe?", "acceptedAnswer": { "@type": "Answer", "text": "When prescribed and monitored by a licensed physician, peptide therapy has a strong safety profile backed by clinical research." }}
          ]
        }}
      />
      <Navbar />
      <main className="pt-24 pb-20">
        <section className="max-w-3xl mx-auto px-6 mb-16 text-center">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-xs tracking-[0.35em] uppercase text-primary font-body font-light mb-4"
          >
            Frequently Asked Questions
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl font-heading font-light text-foreground mb-6"
          >
            Everything You Need to Know
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-muted-foreground font-body font-light text-sm md:text-base max-w-xl mx-auto leading-relaxed"
          >
            From membership details to peptide safety — find answers to the most
            common questions about Premier Vitality.
          </motion.p>
        </section>

        <section className="max-w-3xl mx-auto px-6 space-y-12">
          {faqSections.map((section, si) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 + si * 0.08 }}
            >
              <h2 className="text-xs tracking-[0.3em] uppercase text-primary font-body font-light mb-4">
                {section.title}
              </h2>
              <Accordion type="single" collapsible className="border-t border-border">
                {section.items.map((item, ii) => (
                  <AccordionItem key={ii} value={`${si}-${ii}`} className="border-border">
                    <AccordionTrigger className="text-sm font-body font-light text-foreground hover:no-underline hover:text-primary py-5">
                      {item.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground font-body font-light leading-relaxed">
                      {item.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </motion.div>
          ))}
        </section>

        {/* CTA */}
        <section className="max-w-3xl mx-auto px-6 mt-20 text-center">
          <p className="text-muted-foreground font-body font-light text-sm leading-relaxed mb-6">
            Still have questions? We're happy to help.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={openCalendly}
              className="px-8 py-3 text-xs font-body font-light tracking-[0.2em] uppercase bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Book a Consultation
            </button>
            <a
              href="/auth"
              className="px-8 py-3 text-xs font-body font-light tracking-[0.2em] uppercase border border-primary/40 text-primary hover:bg-primary/10 transition-colors"
            >
              Create an Account
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default FAQ;
