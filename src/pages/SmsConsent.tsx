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
          <p><strong className="text-foreground">Last Updated:</strong> April 1, 2026</p>

          <p>By providing your mobile phone number and creating an account or submitting an intake form with Premier Vitality and Wellness LLC, you consent to receive text messages (SMS) from Premier Vitality &amp; Wellness at the mobile number provided.</p>

          <h2 className="text-lg font-extralight text-foreground pt-4">Types of Messages You May Receive</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Appointment reminders and confirmations</li>
            <li>Two-factor authentication and security codes</li>
            <li>Order and prescription status notifications</li>
            <li>Wellness reminders and refill alerts</li>
            <li>Important updates about your care</li>
          </ul>

          <h2 className="text-lg font-extralight text-foreground pt-4">Message Frequency</h2>
          <p>Message frequency varies based on your care plan and account activity.</p>

          <h2 className="text-lg font-extralight text-foreground pt-4">Costs</h2>
          <p>Message and data rates may apply. Contact your wireless carrier for details.</p>

          <h2 className="text-lg font-extralight text-foreground pt-4">To Opt Out</h2>
          <p>Reply <strong className="text-foreground" style={{ fontWeight: 700 }}>STOP</strong> to any text message to unsubscribe. You will receive one confirmation message and then no further messages. Note: Opting out of marketing messages does not affect messages required for your clinical care or account security.</p>

          <h2 className="text-lg font-extralight text-foreground pt-4">To Get Help</h2>
          <p>Reply <strong className="text-foreground" style={{ fontWeight: 700 }}>HELP</strong> to any message or contact us at <strong className="text-foreground">admin@premiervitalityandwellness.com</strong>.</p>

          <h2 className="text-lg font-extralight text-foreground pt-4">HIPAA Notice</h2>
          <p>SMS messages may contain health-related information. Standard SMS is not encrypted. If you are concerned about privacy, please indicate your preference for secure messaging through the patient portal.</p>

          <p>Premier Vitality and Wellness LLC will not sell or share your mobile number with third parties for marketing purposes.</p>
        </div>
      </div>
    </main>
    <Footer />
  </div>
);

export default SmsConsent;
