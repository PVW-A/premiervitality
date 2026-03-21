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
          <p><strong className="text-foreground">Effective Date:</strong> February 26, 2026</p>

          <h2 className="text-lg font-extralight text-foreground pt-4">1. Information We Collect</h2>
          <p>We may collect personal information you voluntarily provide, including your name, email address, phone number, and health-related information necessary for consultation and treatment. This may include Protected Health Information (PHI) such as lab results, biomarker data, medication history, and treatment records that you choose to share with us through our portal. We also automatically collect certain technical data such as IP addresses, browser type, device identifiers, and usage patterns through cookies and similar technologies.</p>

          <h2 className="text-lg font-extralight text-foreground pt-4">2. How We Use Your Information</h2>
          <p>We use your information to provide and improve our services, communicate with you about treatments and appointments, process orders, comply with legal obligations, and protect the safety and security of our platform and users. Health-related information is used exclusively for the purpose of providing clinical wellness services, generating vitality assessments, and facilitating peptide therapy consultations under the supervision of licensed healthcare providers.</p>

          <h2 className="text-lg font-extralight text-foreground pt-4">3. Protected Health Information (PHI)</h2>
          <p>When you voluntarily submit health-related information through our platform, including lab results, bloodwork files, and biomarker data, we treat this information with the highest level of care. All PHI is encrypted in transit and at rest, access is restricted to authorized clinical personnel on a minimum-necessary basis, and all access to patient records is logged in an immutable audit trail. We implement administrative, technical, and physical safeguards consistent with HIPAA guidelines to protect your health information.</p>

          <h2 className="text-lg font-extralight text-foreground pt-4">4. Information Sharing and Business Associates</h2>
          <p>We do not sell, trade, or rent your personal information to third parties. We may share information with trusted service providers who assist in operating our platform, provided they are bound by agreements that require them to protect your information to the same standard we do. These service providers include our cloud infrastructure provider, payment processor, and communications provider. Where applicable, we maintain Business Associate Agreements (BAAs) with third-party vendors who may access, process, or store PHI on our behalf.</p>

          <h2 className="text-lg font-extralight text-foreground pt-4">5. Data Security</h2>
          <p>We implement reasonable administrative, technical, and physical safeguards to protect your personal and health information. These include role-based access controls, two-factor authentication for portal access, automatic session timeouts after periods of inactivity, encryption of data in transit and at rest, and comprehensive audit logging of all administrative access to patient records. However, no method of transmission over the internet or electronic storage is 100% secure, and we cannot guarantee absolute security.</p>

          <h2 className="text-lg font-extralight text-foreground pt-4">6. Data Retention</h2>
          <p>We retain your personal information and health records for as long as necessary to provide our services and comply with applicable legal and regulatory requirements. Health records and biomarker data are retained for a minimum of seven (7) years from the date of last service, consistent with medical record retention standards. Upon account deletion, non-essential personal data is removed within 30 days, while health records are retained as required by law.</p>

          <h2 className="text-lg font-extralight text-foreground pt-4">7. Your Rights</h2>
          <p>You may request access to, correction of, or deletion of your personal information at any time by contacting us. You have the right to request an accounting of disclosures of your PHI, to request restrictions on certain uses of your health information, and to receive a copy of your health records in a portable format. You may also opt out of marketing communications at any time.</p>

          <h2 className="text-lg font-extralight text-foreground pt-4">8. Third-Party Links</h2>
          <p>Our website may contain links to third-party sites. We are not responsible for the privacy practices or content of those sites.</p>

          <h2 className="text-lg font-extralight text-foreground pt-4">9. Changes to This Policy</h2>
          <p>We reserve the right to update this Privacy Policy at any time. Changes will be posted on this page with an updated effective date. Material changes affecting PHI handling will be communicated directly to affected users.</p>

          <h2 className="text-lg font-extralight text-foreground pt-4">10. Contact Us</h2>
          <p>If you have questions about this Privacy Policy, wish to exercise your rights regarding your health information, or have concerns about how your data is handled, please contact us through the information provided on our website.</p>
        </div>
      </div>
    </main>
    <Footer />
  </div>
);

export default PrivacyPolicy;
