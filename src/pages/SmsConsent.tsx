import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const SmsConsent = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <main className="pt-32 pb-20 px-6">
      <div className="max-w-3xl mx-auto prose-sm">
        <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-3 font-body font-light">Legal</p>
        <h1 className="text-3xl md:text-5xl font-extralight mb-10 tracking-tight">SMS &amp; Text Message Consent</h1>

        <div className="space-y-6 text-muted-foreground font-body font-light text-sm leading-relaxed">
          <p><strong className="text-foreground">Effective Date:</strong> February 25, 2026</p>

          <h2 className="text-lg font-extralight text-foreground pt-4">1. Consent to Receive Messages</h2>
          <p>By creating an account with Premier Vitality &amp; Wellness and providing your mobile phone number, you expressly consent to receive text messages (SMS and MMS) from Premier Vitality &amp; Wellness at the phone number you provided. These messages may include:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong className="text-foreground">Two-Factor Authentication (2FA):</strong> Security verification codes when signing in from a new device to protect your account.</li>
            <li><strong className="text-foreground">Account Notifications:</strong> Order status updates, bloodwork result alerts, appointment reminders, membership renewal notices, and delivery confirmations.</li>
            <li><strong className="text-foreground">Customer Care:</strong> Responses to your inquiries, prescription-related communications, and clinical follow-ups from our care team.</li>
            <li><strong className="text-foreground">Promotional Messages:</strong> Special offers, new peptide availability, wellness tips, loyalty rewards updates, and exclusive member promotions.</li>
          </ul>

          <h2 className="text-lg font-extralight text-foreground pt-4">2. Message Frequency</h2>
          <p>Message frequency varies based on your account activity, preferences, and security events. If you opt in to wellness reminders (e.g., peptide dosing schedules, supplement timing, hydration prompts), you may receive up to 3 messages per day depending on the reminder frequency you choose. Additional messages may include order updates, bloodwork alerts, promotional offers, and 2FA verification codes. Total monthly volume may exceed 90 messages for users with daily reminders enabled.</p>

          <h2 className="text-lg font-extralight text-foreground pt-4">3. Opt-In Method</h2>
          <p>You opt in to receive SMS messages by entering your phone number during account registration on our website. By clicking "Create Account" or "Sign Up," you confirm that you have read and agree to this SMS Consent Policy and authorize Premier Vitality &amp; Wellness to send you text messages as described herein.</p>

          <h2 className="text-lg font-extralight text-foreground pt-4">4. Opt-Out Instructions</h2>
          <p>You can opt out of receiving text messages at any time by:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Replying <strong className="text-foreground">STOP</strong> to any message you receive from us.</li>
            <li>Contacting us at <strong className="text-foreground">info@premiervitalityandwellness.com</strong>.</li>
            <li>Updating your notification preferences in your account portal settings.</li>
          </ul>
          <p>After opting out, you will receive one final confirmation message. Please note that opting out of promotional messages does not affect 2FA security messages, which are required for account security and can be disabled by turning off two-factor authentication in your portal settings.</p>

          <h2 className="text-lg font-extralight text-foreground pt-4">5. Help</h2>
          <p>For assistance, reply <strong className="text-foreground">HELP</strong> to any of our messages or email us at <strong className="text-foreground">info@premiervitalityandwellness.com</strong>.</p>

          <h2 className="text-lg font-extralight text-foreground pt-4">6. Message &amp; Data Rates</h2>
          <p>Standard message and data rates may apply based on your mobile carrier plan. Premier Vitality &amp; Wellness is not responsible for any charges incurred from your wireless provider.</p>

          <h2 className="text-lg font-extralight text-foreground pt-4">7. Supported Carriers</h2>
          <p>Our SMS service is supported on all major U.S. carriers including AT&amp;T, Verizon, T-Mobile, Sprint, and others. Carrier support may vary. We are not liable for delayed or undelivered messages.</p>

          <h2 className="text-lg font-extralight text-foreground pt-4">8. Privacy</h2>
          <p>Your phone number and messaging data will be handled in accordance with our <a href="/privacy" className="underline text-foreground hover:text-primary transition-colors">Privacy Policy</a>. We will not sell, rent, or share your phone number with third parties for their marketing purposes. Your information may be shared with our SMS service provider (Twilio) solely for the purpose of delivering messages on our behalf.</p>

          <h2 className="text-lg font-extralight text-foreground pt-4">9. Terms &amp; Conditions</h2>
          <p>By opting in to our SMS program, you also agree to our <a href="/terms" className="underline text-foreground hover:text-primary transition-colors">Terms of Service</a>. This SMS Consent Policy is incorporated into and subject to those Terms.</p>

          <h2 className="text-lg font-extralight text-foreground pt-4">10. Contact Information</h2>
          <p>Premier Vitality &amp; Wellness<br />
          Email: <strong className="text-foreground">info@premiervitalityandwellness.com</strong><br />
          Website: <strong className="text-foreground">www.premiervitalityandwellness.com</strong></p>
        </div>
      </div>
    </main>
    <Footer />
  </div>
);

export default SmsConsent;
