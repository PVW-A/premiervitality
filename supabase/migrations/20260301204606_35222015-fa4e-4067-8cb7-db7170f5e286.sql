
-- Add rationale field to each protocol item based on product name pattern matching
CREATE OR REPLACE FUNCTION add_protocol_rationales() RETURNS void AS $$
DECLARE
  proto RECORD;
  items_arr jsonb;
  new_items jsonb;
  item jsonb;
  product_name text;
  rationale text;
  i int;
BEGIN
  FOR proto IN SELECT id, items FROM protocols LOOP
    items_arr := proto.items::jsonb;
    new_items := '[]'::jsonb;
    
    FOR i IN 0..jsonb_array_length(items_arr) - 1 LOOP
      item := items_arr->i;
      product_name := item->>'product';
      
      -- Match product name patterns to assign rationale
      IF product_name ILIKE '%Tirzepatide%' AND product_name ILIKE '%Carnitine%' THEN
        rationale := 'Dual GLP-1/GIP receptor agonist that suppresses appetite through two hormonal pathways simultaneously, combined with L-Carnitine to enhance fat oxidation and preserve lean muscle during weight loss.';
      ELSIF product_name ILIKE '%Tirzepatide%' AND product_name ILIKE '%Cyanocobalamin%' THEN
        rationale := 'Dual GLP-1/GIP agonist in lyophilized form for maximum stability and potency, paired with Vitamin B12 to support energy levels and neurological function during weight loss.';
      ELSIF product_name ILIKE '%Semaglutide%' AND product_name ILIKE '%BPC-157%' THEN
        rationale := 'GLP-1 receptor agonist for powerful appetite suppression and blood sugar regulation, paired with BPC-157 to protect gut lining integrity and minimize common GI side effects.';
      ELSIF product_name ILIKE '%Semaglutide%' AND product_name ILIKE '%Pyridoxine%' THEN
        rationale := 'GLP-1 receptor agonist in lyophilized form for maximum potency, combined with Vitamin B6 to support serotonin production and help reduce injection-related nausea.';
      ELSIF product_name ILIKE '%Ipamorelin%' AND product_name ILIKE '%Tesamorelin%' THEN
        rationale := 'Premium growth hormone secretagogue duo that stimulates natural GH release — Tesamorelin specifically targets visceral fat reduction while Ipamorelin enhances deep restorative sleep and recovery.';
      ELSIF product_name ILIKE '%Ipamorelin%' AND product_name ILIKE '%Sermorelin%' AND product_name ILIKE '%CJC%' THEN
        rationale := 'Triple-action growth hormone secretagogue blend providing sustained GH elevation throughout the day for enhanced fat burning, muscle preservation, and accelerated recovery.';
      ELSIF product_name ILIKE '%Ipamorelin%' AND product_name ILIKE '%Sermorelin%' THEN
        rationale := 'Growth hormone secretagogue blend that promotes natural GH pulses for improved body composition, better sleep quality, and enhanced tissue recovery.';
      ELSIF product_name ILIKE '%Ipamorelin%' AND NOT product_name ILIKE '%Sermorelin%' AND NOT product_name ILIKE '%Tesamorelin%' THEN
        rationale := 'Selective growth hormone secretagogue that triggers natural GH release without spiking cortisol or prolactin, supporting improved sleep, recovery, and gradual body composition improvements.';
      ELSIF product_name ILIKE '%Sermorelin%' AND NOT product_name ILIKE '%Ipamorelin%' THEN
        rationale := 'Growth hormone-releasing hormone analog that stimulates the pituitary to produce its own GH naturally, supporting metabolism, sleep quality, and cellular repair.';
      ELSIF product_name ILIKE '%5-Amino%' OR product_name ILIKE '%BAM%' THEN
        rationale := 'Mitochondrial uncoupler that safely increases metabolic rate by dissipating energy as heat, boosting caloric expenditure without raising heart rate or body temperature.';
      ELSIF product_name ILIKE '%Epitalon%' THEN
        rationale := 'Telomerase-activating peptide that supports chromosomal integrity and cellular longevity — helps slow biological aging at the DNA level and promotes healthier cell division.';
      ELSIF product_name ILIKE '%IGF-1 LR3%' AND product_name ILIKE '%Nasal%' THEN
        rationale := 'Long-acting growth factor delivered nasally for systemic absorption, supporting collagen production and cellular turnover for skin vitality.';
      ELSIF product_name ILIKE '%IGF-1 LR3%' THEN
        rationale := 'Long-acting insulin-like growth factor that drives cellular regeneration, collagen synthesis, and tissue repair — essential for accelerating healing and maintaining structural integrity.';
      ELSIF product_name ILIKE '%Humanin%' THEN
        rationale := 'Mitochondrial-derived peptide with powerful cytoprotective properties that shields cells from oxidative stress, supports immune function, and promotes systemic resilience.';
      ELSIF product_name ILIKE '%Glutathione%' THEN
        rationale := 'The body''s master antioxidant delivered nasally for optimal absorption — neutralizes free radicals, supports liver detoxification, and protects every cell from oxidative damage.';
      ELSIF product_name ILIKE '%Arginine%' THEN
        rationale := 'Nitric oxide precursor that enhances blood flow throughout the body, supporting vascular health, hormonal signaling, and improved circulation for libido and performance.';
      ELSIF product_name ILIKE '%MOTs-C%' OR product_name ILIKE '%MOTS%' THEN
        rationale := 'Mitochondrial-derived peptide that enhances cellular energy production and metabolic flexibility — improves exercise capacity and helps regulate glucose metabolism.';
      ELSIF product_name ILIKE '%Adipotide%' THEN
        rationale := 'Targets white adipose tissue by selectively cutting off blood supply to fat cells, enabling direct and targeted fat reduction in stubborn areas.';
      ELSIF product_name ILIKE '%Aspirin%' AND product_name ILIKE '%Caffeine%' AND product_name ILIKE '%Ephedrine%' THEN
        rationale := 'Classic ECA thermogenic stack that synergistically increases metabolic rate — ephedrine stimulates fat mobilization, caffeine amplifies energy expenditure, and aspirin prolongs the effect.';
      ELSIF product_name ILIKE '%Albuterol%' AND product_name ILIKE '%Yohimbine%' THEN
        rationale := 'Advanced thermogenic combination — Albuterol activates beta-2 receptors for fat mobilization, Yohimbine blocks alpha-2 receptors in stubborn fat areas, and Vitamin C provides antioxidant support.';
      ELSIF product_name ILIKE '%Tesofensine%' THEN
        rationale := 'Triple monoamine reuptake inhibitor that reduces appetite centrally and increases resting metabolic rate, providing dual-mechanism support for sustained weight management.';
      ELSIF product_name ILIKE '%Naltrexone%' THEN
        rationale := 'Low-dose opioid receptor antagonist that modulates reward pathways in the brain, reducing food cravings and supporting healthier eating behaviors long-term.';
      ELSIF product_name ILIKE '%ACE-031%' THEN
        rationale := 'Myostatin inhibitor that blocks the protein limiting muscle growth, allowing for enhanced lean muscle development, improved strength, and better athletic performance.';
      ELSIF product_name ILIKE '%Hexarelin%' THEN
        rationale := 'Potent growth hormone secretagogue that stimulates robust GH release for accelerated muscle recovery, improved cardiac function, and enhanced athletic performance.';
      ELSIF product_name ILIKE '%EGCG%' THEN
        rationale := 'Concentrated green tea catechin in liposomal form for superior absorption — supports fat oxidation, provides antioxidant protection, and enhances metabolic efficiency.';
      ELSIF product_name ILIKE '%Easy Touch%' OR product_name ILIKE '%Syringe%' OR product_name ILIKE '%Alcohol Pad%' THEN
        rationale := 'Medical-grade injection supplies included for safe, sterile self-administration at home — everything you need for proper technique and hygiene.';
      ELSE
        rationale := NULL;
      END IF;
      
      IF rationale IS NOT NULL THEN
        item := jsonb_set(item, '{rationale}', to_jsonb(rationale));
      END IF;
      
      new_items := new_items || jsonb_build_array(item);
    END LOOP;
    
    UPDATE protocols SET items = new_items WHERE id = proto.id;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Execute the function
SELECT add_protocol_rationales();

-- Clean up
DROP FUNCTION add_protocol_rationales();
