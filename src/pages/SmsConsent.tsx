import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const SmsConsent = () => (
  <div className="min-h-screen">
    <Navbar />
    <main className="pt-32 pb-20 px-6">
      <div className="max-w-3xl mx-auto prose-sm">
        <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-3 font-body font-light">Legal</p>
        <h1 className="text-3xl md:text-5xl font-extralight mb-4 tracking-tight">SMS &amp; Text Message Consent</h1>
        <p className="text-sm text-muted-foreground font-body font-light mb-10">Message and data rates may apply. Message frequency varies.</p>

        <div className="space-y-6 text-muted-foreground font-body font-light text-sm leading-relaxed">
          <p><strong className="text-foreground">Effective Date:</strong> February 25, 2026</p>

          <h2 className="text-lg font-extralight text-foreground pt-4">1. Consent to Receive Messages</h2>
          <p>By creating an account with Premier Vitality &amp; Wellness and providing your mobile phone number, you expressly consent to receive text messages (SMS and MMS) from Premier Vitality &amp; Wellness at the phone number you provided. These messages may include:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong className="text-foreground">Two-Factor Authentication (2FA):</strong> Security verification codes when signing in from a new device to protect your account.</li>
            <li><strong className="text-foreground">Account Notifications:</strong> Order status updates, bloodwork result alerts, appointment reminders, membership renewal notices, and delivery confirmations.</li>
            <li><strong className="text-foreground">Customer Care:</strong> Responses to your inquiries, prescription-related communications, and clinical follow-ups from our care team.</li>
            <li><strong className="text-foreground">Promotional Messages:</strong> Wellness tips, membership updates, and exclusive member offers.</li>
          </ul>

          <h2 className="text-lg font-extralight text-foreground pt-4">2. Message Frequency</h2>
          <p>Message frequency varies. You may receive up to 5 messages per month including account notifications, appointment reminders, order status updates, lab result alerts, and two-factor authentication (2FA) security codes. Message and data rates may apply.</p>

          <h2 className="text-lg font-extralight text-foreground pt-4">3. Opt-In Method</h2>
          <p>You opt in to receive SMS messages by entering your mobile phone number during account registration at premiervitalityandwellness.com and clicking "Create Account." By completing registration, you confirm you have read and agree to this SMS Consent Policy. We do not send SMS to users who have not explicitly opted in.</p>

          <h2 className="text-lg font-extralight text-foreground pt-4">4. Opt-Out Instructions</h2>
          <p>Reply <strong className="text-foreground" style={{ fontWeight: 700 }}>STOP</strong> to any message to opt out at any time. You will receive one final confirmation message after opting out and will receive no further messages. For help, reply <strong className="text-foreground" style={{ fontWeight: 700 }}>HELP</strong> or contact us at contact@premiervitalityandwellness.com.</p>

          <h2 className="text-lg font-extralight text-foreground pt-4">5. Help</h2>
          <p>For assistance, reply <strong className="text-foreground" style={{ fontWeight: 700 }}>HELP</strong> to any message or email <strong className="text-foreground">contact@premiervitalityandwellness.com</strong>.</p>

          <h2 className="text-lg font-extralight text-foreground pt-4">6. Message &amp; Data Rates</h2>
          <p>Standard message and data rates may apply based on your mobile carrier plan. Premier Vitality &amp; Wellness is not responsible for any charges incurred from your wireless provider.</p>

          <h2 className="text-lg font-extralight text-foreground pt-4">7. Supported Carriers</h2>
          <p>Our SMS service is supported on all major U.S. carriers including AT&amp;T, Verizon, T-Mobile, Sprint, and others. Carrier support may vary. We are not liable for delayed or undelivered messages.</p>

          <h2 className="text-lg font-extralight text-foreground pt-4">8. Privacy</h2>
          <p>Your phone number and message data are handled in accordance with our <a href="/privacy" className="underline text-foreground hover:text-primary transition-colors">Privacy Policy</a> at premiervitalityandwellness.com/privacy. Your information is shared only with Twilio, our SMS delivery provider, solely for the purpose of delivering messages on our behalf. We do not sell, rent, or share your phone number with any third party for marketing purposes.</p>

          <h2 className="text-lg font-extralight text-foreground pt-4">9. Terms &amp; Conditions</h2>
          <p>By opting in to our SMS program, you also agree to our <a href="/terms" className="underline text-foreground hover:text-primary transition-colors">Terms of Service</a>. This SMS Consent Policy is incorporated into and subject to those Terms.</p>

          <h2 className="text-lg font-extralight text-foreground pt-4">10. Contact Information</h2>
          <p>Premier Vitality &amp; Wellness<br />
          Email: <strong className="text-foreground">contact@premiervitalityandwellness.com</strong><br />
          Website: <strong className="text-foreground">www.premiervitalityandwellness.com</strong><br />
          SMS Support: Reply <strong className="text-foreground" style={{ fontWeight: 700 }}>HELP</strong> for assistance or <strong className="text-foreground" style={{ fontWeight: 700 }}>STOP</strong> to opt out.</p>
        </div>
      </div>
    </main>
    <Footer />
  </div>
);

export default SmsConsent;
