import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const PrivacyPolicy = () => (
  <div className="min-h-screen">
    <Navbar />
    <main className="pt-32 pb-20 px-6">
      <div className="max-w-3xl mx-auto prose-sm">
        <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-3 font-body font-light">Legal</p>
        <h1 className="text-3xl md:text-5xl font-extralight mb-10 tracking-tight">Privacy Policy</h1>

        <div className="space-y-6 text-muted-foreground font-body font-light text-sm leading-relaxed">
          <p><strong className="text-foreground">Effective Date:</strong> April 1, 2026</p>

          <p className="uppercase font-medium text-foreground">THIS NOTICE DESCRIBES HOW MEDICAL INFORMATION ABOUT YOU MAY BE USED AND DISCLOSED AND HOW YOU CAN GET ACCESS TO THIS INFORMATION. PLEASE REVIEW IT CAREFULLY.</p>

          <h2 className="text-lg font-extralight text-foreground pt-4">1. Information We Collect</h2>
          <p>We collect: (a) personal identification information (name, date of birth, address, phone, email); (b) protected health information (PHI) including medical history, diagnoses, treatment records, prescriptions, and lab results; (c) payment information; (d) device and usage data when you use our Site.</p>

          <h2 className="text-lg font-extralight text-foreground pt-4">2. How We Use Your Information</h2>
          <p>We use your information to: (a) provide medical services and treatment; (b) process payments; (c) communicate about your care; (d) send appointment reminders and wellness updates (with your consent); (e) comply with legal obligations; (f) improve our services.</p>

          <h2 className="text-lg font-extralight text-foreground pt-4">3. HIPAA Compliance</h2>
          <p>As a covered entity under HIPAA, we are required to maintain the privacy of your Protected Health Information (PHI) and to provide you with this Notice of Privacy Practices.</p>
          <p><strong className="text-foreground">Permitted Uses and Disclosures Without Authorization:</strong></p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong className="text-foreground">Treatment:</strong> We may share PHI with other providers involved in your care.</li>
            <li><strong className="text-foreground">Payment:</strong> We may use PHI to process billing and payment.</li>
            <li><strong className="text-foreground">Health Care Operations:</strong> We may use PHI for quality assessment, staff training, and compliance activities.</li>
            <li><strong className="text-foreground">As Required by Law:</strong> We will disclose PHI when required by federal, state, or local law.</li>
            <li><strong className="text-foreground">Public Health:</strong> We may disclose PHI to public health authorities as required.</li>
            <li><strong className="text-foreground">Health Oversight:</strong> We may disclose PHI to government oversight agencies.</li>
            <li><strong className="text-foreground">Legal Proceedings:</strong> We may disclose PHI in response to court orders or lawful process.</li>
            <li><strong className="text-foreground">Law Enforcement:</strong> We may disclose PHI for law enforcement purposes as permitted by law.</li>
          </ul>
          <p><strong className="text-foreground">Uses Requiring Your Authorization:</strong> All other uses and disclosures of your PHI require your written authorization. You may revoke authorization in writing at any time.</p>

          <h2 className="text-lg font-extralight text-foreground pt-4">4. Your Rights</h2>
          <p>You have the right to:<br />
          (a) Inspect and copy your PHI.<br />
          (b) Request amendment of your PHI if you believe it is incorrect.<br />
          (c) Request restrictions on use or disclosure of your PHI.<br />
          (d) Request confidential communications by alternative means.<br />
          (e) Receive an accounting of disclosures.<br />
          (f) Obtain a paper copy of this Notice.</p>

          <h2 className="text-lg font-extralight text-foreground pt-4">5. In-Person and Telehealth Privacy</h2>
          <p>For in-person visits, reasonable physical and administrative safeguards are in place to protect your PHI. For telehealth visits, we use encrypted, HIPAA-compliant video and messaging platforms. You are responsible for ensuring privacy on your end during telehealth sessions.</p>

          <h2 className="text-lg font-extralight text-foreground pt-4">6. Data Security</h2>
          <p>We implement administrative, technical, and physical safeguards to protect your information. However, no method of transmission or storage is 100% secure.</p>

          <h2 className="text-lg font-extralight text-foreground pt-4">7. Third Parties</h2>
          <p>We may share information with: licensed pharmacies fulfilling your prescriptions; laboratories processing your tests; billing and payment processors; and other business associates under written HIPAA-compliant agreements.</p>

          <h2 className="text-lg font-extralight text-foreground pt-4">8. Changes to This Policy</h2>
          <p>We reserve the right to change the terms of this Notice. Changes will be effective for all PHI we maintain. Updated notices will be posted on our Site.</p>

          <h2 className="text-lg font-extralight text-foreground pt-4">9. Complaints</h2>
          <p>If you believe your privacy rights have been violated, you may file a complaint with us or with the U.S. Department of Health and Human Services at hhs.gov/hipaa. We will not retaliate against you for filing a complaint.</p>

          <h2 className="text-lg font-extralight text-foreground pt-4">10. Contact — Privacy Officer</h2>
          <p>Premier Vitality and Wellness LLC<br />
          admin@premiervitalityandwellness.com<br />
          premiervitalityandwellness.com</p>
        </div>
      </div>
    </main>
    <Footer />
  </div>
);

export default PrivacyPolicy;
