import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const PrivacyPolicy = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <main className="pt-32 pb-20 px-6">
      <div className="max-w-3xl mx-auto prose-sm">
        <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-3 font-body font-light">Legal</p>
        <h1 className="text-3xl md:text-5xl font-extralight mb-10 tracking-tight">Privacy Policy</h1>

        <div className="space-y-6 text-muted-foreground font-body font-light text-sm leading-relaxed">
          <p><strong className="text-foreground">Effective Date:</strong> February 23, 2026</p>

          <h2 className="text-lg font-extralight text-foreground pt-4">1. Information We Collect</h2>
          <p>We may collect personal information you voluntarily provide, including your name, email address, phone number, and health-related information necessary for consultation and treatment. We also automatically collect certain technical data such as IP addresses, browser type, and usage patterns through cookies and similar technologies.</p>

          <h2 className="text-lg font-extralight text-foreground pt-4">2. How We Use Your Information</h2>
          <p>We use your information to provide and improve our services, communicate with you about treatments and appointments, process orders, comply with legal obligations, and protect the safety and security of our platform and users.</p>

          <h2 className="text-lg font-extralight text-foreground pt-4">3. Information Sharing</h2>
          <p>We do not sell, trade, or rent your personal information to third parties. We may share information with trusted service providers who assist in operating our website and conducting our business, provided they agree to keep this information confidential. We may also disclose information when required by law or to protect our rights.</p>

          <h2 className="text-lg font-extralight text-foreground pt-4">4. Data Security</h2>
          <p>We implement reasonable administrative, technical, and physical safeguards to protect your personal information. However, no method of transmission over the internet or electronic storage is 100% secure, and we cannot guarantee absolute security.</p>

          <h2 className="text-lg font-extralight text-foreground pt-4">5. Your Rights</h2>
          <p>You may request access to, correction of, or deletion of your personal information at any time by contacting us. You may also opt out of marketing communications.</p>

          <h2 className="text-lg font-extralight text-foreground pt-4">6. Third-Party Links</h2>
          <p>Our website may contain links to third-party sites. We are not responsible for the privacy practices or content of those sites.</p>

          <h2 className="text-lg font-extralight text-foreground pt-4">7. Changes to This Policy</h2>
          <p>We reserve the right to update this Privacy Policy at any time. Changes will be posted on this page with an updated effective date.</p>

          <h2 className="text-lg font-extralight text-foreground pt-4">8. Contact Us</h2>
          <p>If you have questions about this Privacy Policy, please contact us through the information provided on our website.</p>
        </div>
      </div>
    </main>
    <Footer />
  </div>
);

export default PrivacyPolicy;
