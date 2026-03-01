import { motion } from "framer-motion";
import { Check, Minus } from "lucide-react";

const features = [
  { label: "Baseline Panel (100+ biomarkers)", essential: true, premium: true, elite: true },
  { label: "Core Checkups / year", essential: "1", premium: "2", elite: "3" },
  { label: "Physician Consultation", essential: "Annual", premium: "Bi-annual", elite: "Quarterly" },
  { label: "Peptide Catalog Access", essential: true, premium: true, elite: true },
  { label: "Member Peptide Discount", essential: "10%", premium: "15%", elite: "25%" },
  { label: "Priority Support", essential: false, premium: true, elite: true },
  { label: "Vitality Score Dashboard", essential: true, premium: true, elite: true },
  { label: "Dedicated Wellness Concierge", essential: false, premium: false, elite: true },
];

const tiers = ["Essential", "Premium", "Elite"] as const;

const CellContent = ({ value }: { value: boolean | string }) => {
  if (value === true)
    return <Check size={16} className="text-primary mx-auto" />;
  if (value === false)
    return <Minus size={16} className="text-muted-foreground/40 mx-auto" />;
  return (
    <span className="text-xs font-body font-light text-foreground">{value}</span>
  );
};

const TierComparisonTable = () => (
  <section className="max-w-5xl mx-auto px-6 mt-20 mb-20">
    <motion.p
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="text-center text-xs tracking-[0.35em] uppercase text-primary font-body font-light mb-3"
    >
      Compare Plans
    </motion.p>
    <motion.h2
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="text-2xl md:text-3xl font-heading font-light text-foreground text-center mb-10"
    >
      Find Your Perfect Fit
    </motion.h2>

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="overflow-x-auto"
    >
      <table className="w-full border-collapse min-w-[540px]">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-4 pr-4 text-xs tracking-[0.2em] uppercase text-muted-foreground font-body font-light w-[40%]">
              Feature
            </th>
            {tiers.map((t) => (
              <th
                key={t}
                className={`py-4 text-center text-xs tracking-[0.2em] uppercase font-body font-light ${
                  t === "Premium" ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {t}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {features.map((f, i) => (
            <tr
              key={f.label}
              className={`border-b border-border/50 ${
                i % 2 === 0 ? "bg-secondary/30" : ""
              }`}
            >
              <td className="py-3.5 pr-4 text-sm text-foreground font-body font-light">
                {f.label}
              </td>
              <td className="py-3.5 text-center">
                <CellContent value={f.essential} />
              </td>
              <td className="py-3.5 text-center">
                <CellContent value={f.premium} />
              </td>
              <td className="py-3.5 text-center">
                <CellContent value={f.elite} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  </section>
);

export default TierComparisonTable;
