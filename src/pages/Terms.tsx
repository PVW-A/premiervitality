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
          <p><strong className="text-foreground">Last Updated:</strong> April 1, 2026</p>

          <h2 className="text-lg font-extralight text-foreground pt-4">1. Overview</h2>
          <p>Premier Vitality and Wellness LLC ("Premier Vitality &amp; Wellness," "we," "us," or "our") operates the website located at premiervitalityandwellness.com (the "Site"). By accessing or using our Site, Services, or Products, you agree to be bound by these Terms of Service. If you do not agree, do not use our Services.</p>
          <p>Our Services are available only to individuals who are at least 18 years of age.</p>
          <p><strong className="text-foreground">ARBITRATION NOTICE:</strong> Except as described in Section 12, disputes arising under these Terms will be resolved by binding individual arbitration. BY ACCEPTING THESE TERMS, YOU WAIVE THE RIGHT TO A TRIAL BY JURY OR TO PARTICIPATE IN ANY CLASS ACTION.</p>

          <h2 className="text-lg font-extralight text-foreground pt-4">2. Services</h2>
          <p>Premier Vitality &amp; Wellness provides physician-directed wellness and optimization services including but not limited to: peptide therapy, hormone optimization, biomarker analysis, nutritional counseling, and related medical services. Services are provided both in-person at our Arizona location and via telehealth/telemedicine.</p>

          <h2 className="text-lg font-extralight text-foreground pt-4">3. In-Person Care</h2>
          <p>By receiving in-person medical services at Premier Vitality &amp; Wellness, you acknowledge and agree that:</p>
          <p>(a) You are voluntarily presenting yourself for evaluation, examination, and treatment at our facility.<br />
          (b) In-person care involves direct physical examination, potential blood draws, injections, and other procedures as determined medically appropriate by your Provider.<br />
          (c) You have disclosed all relevant medical history, medications, allergies, and conditions to your Provider prior to receiving care.<br />
          (d) You understand that no guarantee of outcome is made for any treatment or procedure.<br />
          (e) You consent to the presence of clinical staff necessary to assist in your care.<br />
          (f) You understand that photography or imaging of treatment areas may be taken for clinical documentation purposes with your verbal consent at time of service.</p>

          <h2 className="text-lg font-extralight text-foreground pt-4">4. Telehealth Services</h2>
          <p>You consent to receive medical services via telemedicine technology including video conferencing, telephone consultation, and secure messaging. You understand that:</p>
          <p>(a) The same confidentiality laws that apply to in-person care apply to telehealth interactions.<br />
          (b) You may withdraw consent to telehealth at any time without affecting your right to in-person care.<br />
          (c) Potential risks include technical interruptions and, in rare circumstances, security breaches.<br />
          (d) Your Provider may determine that in-person care is required for your specific situation.<br />
          (e) You are responsible for ensuring a private, secure environment on your end during telehealth consultations.</p>

          <h2 className="text-lg font-extralight text-foreground pt-4">5. Self-Pay; Insurance Not Accepted</h2>
          <p>Premier Vitality &amp; Wellness does not accept managed care plans, Medicare, Medicaid, or any government health care programs. All services are provided on a self-pay basis. Payment is due at time of service unless otherwise arranged in writing.</p>
          <p>By using our Services, you acknowledge personal responsibility for all charges regardless of any insurance coverage. You agree not to submit claims to Medicare, Medicaid, or any government health care program for services rendered by Premier Vitality &amp; Wellness.</p>
          <p>Accepted payment methods include credit card, debit card, and ACH bank transfer. You authorize Premier Vitality &amp; Wellness to store payment information securely and charge for outstanding balances, membership fees, or approved treatment costs as they become due.</p>

          <h2 className="text-lg font-extralight text-foreground pt-4">6. Refund Policy</h2>
          <p>All fees for services, treatments, memberships, and products are non-refundable. Once payment is processed, no refunds will be issued for any reason including dissatisfaction with outcomes, early termination of membership, unused services, or missed appointments. Appointments cancelled with less than 24 hours notice may be subject to a cancellation fee.</p>

          <h2 className="text-lg font-extralight text-foreground pt-4">7. Prescription Products</h2>
          <p>Certain services involve prescription medications including peptides and compounded formulations. You may not receive prescription products without a valid consultation with a licensed Provider and a written prescription. Premier Vitality &amp; Wellness works with licensed compounding pharmacies. Prescription medications are compounded specifically for you and cannot be returned or refunded.</p>

          <h2 className="text-lg font-extralight text-foreground pt-4">8. Your Responsibilities</h2>
          <p>You agree to: (a) provide complete and accurate medical history; (b) report any changes in health status; (c) follow treatment instructions; (d) attend scheduled follow-up appointments; (e) promptly report adverse reactions; (f) maintain the security of your patient portal account; (g) submit only truthful and accurate information.</p>

          <h2 className="text-lg font-extralight text-foreground pt-4">9. Intellectual Property</h2>
          <p>All content on the Site is the exclusive property of Premier Vitality &amp; Wellness. You may not reproduce, distribute, or create derivative works without written permission.</p>

          <h2 className="text-lg font-extralight text-foreground pt-4">10. Disclaimer of Warranties</h2>
          <p>ALL SERVICES AND CONTENT ARE PROVIDED "AS IS" WITHOUT WARRANTY OF ANY KIND. PREMIER VITALITY &amp; WELLNESS DOES NOT WARRANT THAT SERVICES WILL BE ACCURATE, COMPLETE, OR ERROR-FREE.</p>

          <h2 className="text-lg font-extralight text-foreground pt-4">11. Limitation of Liability</h2>
          <p>PREMIER VITALITY &amp; WELLNESS AND ITS OFFICERS, DIRECTORS, EMPLOYEES, AND AGENTS SHALL NOT BE LIABLE FOR ANY INDIRECT, SPECIAL, INCIDENTAL, OR CONSEQUENTIAL DAMAGES. LIABILITY SHALL NOT EXCEED THE AMOUNT PAID FOR SERVICES IN THE SIX MONTHS PRECEDING THE CLAIM.</p>

          <h2 className="text-lg font-extralight text-foreground pt-4">12. Dispute Resolution and Arbitration</h2>
          <p>Any dispute arising out of or relating to these Terms or our Services shall be resolved by binding arbitration administered by the American Arbitration Association under its Consumer Arbitration Rules. Arbitration shall take place in Maricopa County, Arizona. The arbitrator's decision is final and may be entered as judgment in any court. YOU WAIVE THE RIGHT TO PARTICIPATE IN CLASS ACTION LITIGATION.</p>
          <p>Exceptions: Either party may bring an individual action in small claims court or seek injunctive relief in a court of law.</p>

          <h2 className="text-lg font-extralight text-foreground pt-4">13. Governing Law</h2>
          <p>These Terms are governed by the laws of the State of Arizona.</p>

          <h2 className="text-lg font-extralight text-foreground pt-4">14. Changes to Terms</h2>
          <p>We reserve the right to update these Terms at any time. Continued use of our Services after changes constitutes acceptance.</p>

          <h2 className="text-lg font-extralight text-foreground pt-4">15. Contact</h2>
          <p>Premier Vitality and Wellness LLC<br />
          admin@premiervitalityandwellness.com<br />
          premiervitalityandwellness.com</p>
        </div>
      </div>
    </main>
    <Footer />
  </div>
);

export default Terms;
