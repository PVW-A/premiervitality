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

          <p>By providing your mobile phone number and creating an account or submitting an intake form with Premier Vitality and Wellness LLC, you consent to receive text messages (SMS and MMS) from Premier Vitality and Wellness LLC at the mobile number provided, including messages sent through an automatic telephone dialing system.</p>

          <h2 className="text-lg font-extralight text-foreground pt-4">Types of Messages You May Receive</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Appointment reminders and confirmations</li>
            <li>Two-factor authentication and account security codes</li>
            <li>Order and prescription status notifications</li>
            <li>Wellness reminders and refill alerts</li>
            <li>Important updates about your care plan</li>
            <li>Promotional messages about services and offers (only with separate marketing consent)</li>
          </ul>

          <h2 className="text-lg font-extralight text-foreground pt-4">Message Frequency</h2>
          <p>Message frequency varies based on your care plan and account activity. You may receive up to several messages per week depending on your treatment schedule and account activity.</p>

          <h2 className="text-lg font-extralight text-foreground pt-4">Costs</h2>
          <p>Message and data rates may apply. Contact your wireless carrier for details. Premier Vitality and Wellness LLC is not responsible for any charges from your wireless carrier.</p>

          <h2 className="text-lg font-extralight text-foreground pt-4">To Opt Out of Marketing Messages</h2>
          <p>Reply <strong className="text-foreground" style={{ fontWeight: 700 }}>STOP</strong> to any marketing text message to unsubscribe from promotional communications. You will receive one confirmation message and then no further marketing messages will be sent.</p>
          <p><strong className="text-foreground">IMPORTANT:</strong> Opting out of marketing messages does NOT affect the following messages which are necessary for your clinical care and account security: appointment reminders, two-factor authentication codes, prescription notifications, and critical care updates. To opt out of all messages including clinical communications, please contact us directly at admin@premiervitalityandwellness.com or call (480) 234-9108.</p>

          <h2 className="text-lg font-extralight text-foreground pt-4">To Get Help</h2>
          <p>Reply <strong className="text-foreground" style={{ fontWeight: 700 }}>HELP</strong> to any message or contact us at <strong className="text-foreground">admin@premiervitalityandwellness.com</strong> or call (480) 234-9108.</p>

          <h2 className="text-lg font-extralight text-foreground pt-4">HIPAA Notice Regarding SMS</h2>
          <p>Standard SMS text messages are not encrypted and are not a secure means of transmitting protected health information. By consenting to receive SMS messages, you acknowledge this limitation. If you are concerned about privacy, please indicate your preference for secure messaging through the patient portal at premiervitalityandwellness.com.</p>

          <h2 className="text-lg font-extralight text-foreground pt-4">Privacy</h2>
          <p>Premier Vitality and Wellness LLC will not sell, rent, or share your mobile phone number with third parties for their marketing purposes. Your mobile number may be shared with service providers who assist us in sending messages, subject to confidentiality obligations.</p>

          <h2 className="text-lg font-extralight text-foreground pt-4">Contact</h2>
          <p>Premier Vitality and Wellness LLC<br />
          1870 W Frye Rd Ste 1<br />
          Chandler, AZ 85224<br />
          Phone: (480) 234-9108<br />
          Email: admin@premiervitalityandwellness.com</p>
        </div>
      </div>
    </main>
    <Footer />
  </div>
);

export default SmsConsent;
