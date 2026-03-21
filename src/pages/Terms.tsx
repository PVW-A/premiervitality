import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Terms = () => (
  <div className="min-h-screen">
    <Navbar />
    <main className="pt-32 pb-20 px-6">
      <div className="max-w-3xl mx-auto prose-sm">
        <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-3 font-body font-light">Legal</p>
        <h1 className="text-3xl md:text-5xl font-extralight mb-10 tracking-tight">Terms of Service</h1>

        <div className="space-y-6 text-muted-foreground font-body font-light text-sm leading-relaxed">
          <p><strong className="text-foreground">Effective Date:</strong> February 23, 2026</p>

          <h2 className="text-lg font-extralight text-foreground pt-4">1. Acceptance of Terms</h2>
          <p>By accessing or using the Premier Vitality & Wellness website and services, you agree to be bound by these Terms of Service. If you do not agree, you must discontinue use immediately.</p>

          <h2 className="text-lg font-extralight text-foreground pt-4">2. Medical Disclaimer</h2>
          <p>The information provided on this website is for general informational and educational purposes only and does not constitute medical advice, diagnosis, or treatment. Peptide therapy and related services are provided under the supervision of licensed healthcare providers. Always seek the advice of a qualified healthcare professional with any questions you may have regarding a medical condition. Never disregard professional medical advice or delay seeking it because of something you have read on this website.</p>

          <h2 className="text-lg font-extralight text-foreground pt-4">3. No Guarantees</h2>
          <p>We make no guarantees, representations, or warranties regarding the outcomes or results of any treatments, therapies, or protocols offered through our services. Individual results may vary significantly. Past performance or testimonials do not guarantee future results.</p>

          <h2 className="text-lg font-extralight text-foreground pt-4">4. Limitation of Liability</h2>
          <p>To the fullest extent permitted by applicable law, Premier Vitality & Wellness, its founders, officers, employees, agents, and affiliates shall not be liable for any direct, indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, health outcomes, or other intangible losses, arising out of or in connection with your use of our website or services, even if we have been advised of the possibility of such damages.</p>

          <h2 className="text-lg font-extralight text-foreground pt-4">5. Assumption of Risk</h2>
          <p>You acknowledge that peptide therapy and related treatments carry inherent risks, including but not limited to adverse reactions, side effects, and interactions with other medications. By using our services, you voluntarily assume all risks associated with such treatments and agree to hold Premier Vitality & Wellness harmless from any claims arising therefrom.</p>

          <h2 className="text-lg font-extralight text-foreground pt-4">6. Indemnification</h2>
          <p>You agree to indemnify, defend, and hold harmless Premier Vitality & Wellness and its founders, employees, and affiliates from and against any and all claims, liabilities, damages, losses, and expenses (including reasonable attorneys' fees) arising out of or in connection with your use of our services, your violation of these Terms, or your violation of any rights of another party.</p>

          <h2 className="text-lg font-extralight text-foreground pt-4">7. Intellectual Property</h2>
          <p>All content on this website, including text, graphics, logos, and images, is the property of Premier Vitality & Wellness and is protected by applicable intellectual property laws. You may not reproduce, distribute, or create derivative works without our prior written consent.</p>

          <h2 className="text-lg font-extralight text-foreground pt-4">8. Governing Law</h2>
          <p>These Terms shall be governed by and construed in accordance with the laws of the state in which Premier Vitality & Wellness operates, without regard to its conflict of law provisions.</p>

          <h2 className="text-lg font-extralight text-foreground pt-4">9. Severability</h2>
          <p>If any provision of these Terms is found to be unenforceable, the remaining provisions shall continue in full force and effect.</p>

          <h2 className="text-lg font-extralight text-foreground pt-4">10. Changes to Terms</h2>
          <p>We reserve the right to modify these Terms at any time. Continued use of our services after any changes constitutes your acceptance of the new Terms.</p>

          <h2 className="text-lg font-extralight text-foreground pt-4">11. Contact</h2>
          <p>For questions regarding these Terms of Service, please contact us through the information provided on our website.</p>
        </div>
      </div>
    </main>
    <Footer />
  </div>
);

export default Terms;
