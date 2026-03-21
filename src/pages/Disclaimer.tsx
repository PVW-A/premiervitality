import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Disclaimer = () => (
  <div className="min-h-screen">
    <Navbar />
    <main className="pt-32 pb-20 px-6">
      <div className="max-w-3xl mx-auto prose-sm">
        <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-3 font-body font-light">Legal</p>
        <h1 className="text-3xl md:text-5xl font-extralight mb-10 tracking-tight">Medical Disclaimer</h1>

        <div className="space-y-6 text-muted-foreground font-body font-light text-sm leading-relaxed">
          <p><strong className="text-foreground">Effective Date:</strong> February 23, 2026</p>

          <h2 className="text-lg font-extralight text-foreground pt-4">General Information Only</h2>
          <p>The content provided on this website, including all text, graphics, images, and other material, is for informational purposes only and is not intended to be a substitute for professional medical advice, diagnosis, or treatment.</p>

          <h2 className="text-lg font-extralight text-foreground pt-4">Not Medical Advice</h2>
          <p>Nothing on this website should be construed as medical advice. The information provided does not create a physician-patient relationship. Always consult with a qualified, licensed healthcare provider before starting any new treatment, therapy, medication, or supplement, including peptide therapy.</p>

          <h2 className="text-lg font-extralight text-foreground pt-4">No Guaranteed Results</h2>
          <p>Premier Vitality & Wellness makes no claims, promises, or guarantees about the efficacy, safety, or outcomes of any treatments described on this website. Individual results vary and depend on numerous factors including, but not limited to, age, health status, genetics, lifestyle, and adherence to protocols.</p>

          <h2 className="text-lg font-extralight text-foreground pt-4">Assumption of Risk</h2>
          <p>Peptide therapy and related treatments involve inherent risks including, but not limited to, allergic reactions, injection site reactions, hormonal imbalances, drug interactions, and unknown long-term effects. By engaging with our services, you acknowledge these risks and accept full responsibility for your decision to pursue treatment.</p>

          <h2 className="text-lg font-extralight text-foreground pt-4">FDA Disclaimer</h2>
          <p>The statements made on this website have not been evaluated by the Food and Drug Administration (FDA). The products and services offered are not intended to diagnose, treat, cure, or prevent any disease.</p>

          <h2 className="text-lg font-extralight text-foreground pt-4">Limitation of Liability</h2>
          <p>Under no circumstances shall Premier Vitality & Wellness, its founders, physicians, employees, or affiliates be held liable for any damages whatsoever, including direct, indirect, incidental, punitive, or consequential damages, arising from your use of this website or any treatments, products, or services referenced herein.</p>

          <h2 className="text-lg font-extralight text-foreground pt-4">Emergency Situations</h2>
          <p>If you are experiencing a medical emergency, call 911 or your local emergency services immediately. Do not rely on this website for emergency medical guidance.</p>
        </div>
      </div>
    </main>
    <Footer />
  </div>
);

export default Disclaimer;
