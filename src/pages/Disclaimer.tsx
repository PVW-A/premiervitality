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
          <p><strong className="text-foreground">Last Updated:</strong> April 1, 2026</p>

          <h2 className="text-lg font-extralight text-foreground pt-4">1. Not Emergency Care</h2>
          <p>IF YOU ARE EXPERIENCING A MEDICAL EMERGENCY, CALL 911 OR GO TO THE NEAREST EMERGENCY ROOM IMMEDIATELY. Premier Vitality &amp; Wellness does not provide emergency medical services.</p>

          <h2 className="text-lg font-extralight text-foreground pt-4">2. Scope of Services</h2>
          <p>Premier Vitality &amp; Wellness provides physician-directed elective wellness and optimization services. Our services are not intended to replace your primary care physician, emergency services, or specialist care for acute medical conditions.</p>

          <h2 className="text-lg font-extralight text-foreground pt-4">3. Peptide Therapy and Compounded Medications</h2>
          <p>Peptide therapies and compounded medications are prescribed and supervised by licensed physicians. You acknowledge that:</p>
          <p>(a) Compounded medications are not FDA-approved as finished drug products, though the individual ingredients may be FDA-approved.<br />
          (b) Results vary by individual. No specific outcome is guaranteed.<br />
          (c) All therapies carry inherent risks including adverse reactions, injection site reactions, allergic responses, and other known or unknown side effects.<br />
          (d) Your Provider will discuss specific risks prior to initiating any treatment.<br />
          (e) You must disclose all current medications, supplements, and health conditions to avoid contraindications.</p>

          <h2 className="text-lg font-extralight text-foreground pt-4">4. In-Person Procedures</h2>
          <p>For in-person services including injections, blood draws, and physical examinations:</p>
          <p>(a) Procedures are performed by or under the supervision of licensed medical professionals.<br />
          (b) You will be informed of the nature of each procedure before it is performed.<br />
          (c) You have the right to refuse any procedure at any time.<br />
          (d) Minor bruising, soreness, or discomfort at injection or blood draw sites is normal and expected.<br />
          (e) Serious adverse events, while rare, are possible. Report any concerning symptoms immediately.</p>

          <h2 className="text-lg font-extralight text-foreground pt-4">5. Telehealth Limitations</h2>
          <p>Telehealth services have inherent limitations. Your Provider may determine that your condition requires in-person evaluation. The absence of a physical examination may limit diagnostic accuracy.</p>

          <h2 className="text-lg font-extralight text-foreground pt-4">6. No Physician-Patient Relationship Via Website</h2>
          <p>Browsing our website or contacting us does not establish a physician-patient relationship. A physician-patient relationship is established only after a formal consultation with one of our licensed Providers and mutual agreement to proceed with care.</p>

          <h2 className="text-lg font-extralight text-foreground pt-4">7. Individual Results</h2>
          <p>Results from peptide therapy, hormone optimization, and other wellness services vary significantly between individuals based on genetics, lifestyle, compliance, and other factors. Testimonials or case studies do not guarantee similar results.</p>

          <h2 className="text-lg font-extralight text-foreground pt-4">8. Off-Label Use</h2>
          <p>Some treatments provided by Premier Vitality &amp; Wellness may constitute off-label use of medications. Your Provider will inform you when this applies and will explain the evidence base for the recommended treatment.</p>
        </div>
      </div>
    </main>
    <Footer />
  </div>
);

export default Disclaimer;
