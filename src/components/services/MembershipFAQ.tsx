import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "Can I cancel my membership at any time?",
    a: "Yes. There are no long-term contracts. You can cancel from your member portal at any time and your benefits remain active through the end of your current billing cycle.",
  },
  {
    q: "How do the blood panels work?",
    a: "After joining, you'll receive a lab requisition form. Visit any Quest Diagnostics or Labcorp location near you — no appointment needed. Results are uploaded to your portal within 3–5 business days and reviewed by your physician.",
  },
  {
    q: "Do I need a membership to purchase peptides?",
    a: "Yes. All peptide therapies are physician-directed and require an active membership so our medical team can monitor your health through regular bloodwork and consultations.",
  },
  {
    q: "What is the Vitality Score?",
    a: "Your Vitality Score is a proprietary composite metric calculated from your bloodwork biomarkers. It gives you a single number (0–100) that reflects your overall metabolic, hormonal, and inflammatory health.",
  },
  {
    q: "Can I upgrade or downgrade my plan?",
    a: "Absolutely. You can upgrade at any time from your member portal and we'll prorate the difference. Downgrades take effect at your next billing cycle.",
  },
  {
    q: "Is this covered by insurance?",
    a: "Membership fees and peptide therapies are not covered by insurance. However, many members use HSA/FSA funds for lab work and consultations. We provide itemized receipts for reimbursement.",
  },
];

const MembershipFAQ = () => (
  <section className="max-w-3xl mx-auto px-6 mb-20">
    <motion.p
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="text-center text-xs tracking-[0.35em] uppercase text-primary font-body font-light mb-3"
    >
      Frequently Asked Questions
    </motion.p>
    <motion.h2
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="text-2xl md:text-3xl font-heading font-light text-foreground text-center mb-10"
    >
      Common Questions
    </motion.h2>

    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Accordion type="single" collapsible className="space-y-2">
        {faqs.map((faq, i) => (
          <AccordionItem
            key={i}
            value={`faq-${i}`}
            className="border border-border px-5"
          >
            <AccordionTrigger className="text-sm font-body font-light text-foreground hover:text-primary py-4 text-left">
              {faq.q}
            </AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground font-body font-light leading-relaxed pb-4">
              {faq.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </motion.div>
  </section>
);

export default MembershipFAQ;
