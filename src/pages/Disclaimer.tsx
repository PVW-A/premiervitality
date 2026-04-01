import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Disclaimer = () => (
  <div className="min-h-screen">
    <Navbar />
    <main className="pt-32 pb-20 px-6">
      <div className="max-w-3xl mx-auto prose-sm">
        <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-3 font-body font-light">Legal</p>
        <h1 className="text-3xl md:text-5xl font-extralight mb-10 tracking-tight">Medical Disclaimer &amp; Informed Consent</h1>

        <div className="space-y-6 text-muted-foreground font-body font-light text-sm leading-relaxed">
          <p><strong className="text-foreground">Last Updated:</strong> April 1, 2026</p>

          <p className="uppercase font-medium text-foreground">AUTHORIZATION AND CONSENT TO RECEIVE MEDICAL SERVICES (IN-PERSON AND TELEHEALTH)</p>

          <p>The purpose of this document is to obtain your informed consent to receive medical services from Premier Vitality and Wellness LLC, including both in-person care at our facility and telehealth/telemedicine consultations.</p>

          <h2 className="text-lg font-extralight text-foreground pt-4">1. Not Emergency Care</h2>
          <p>IF YOU ARE EXPERIENCING A MEDICAL EMERGENCY, CALL 911 OR GO TO THE NEAREST EMERGENCY ROOM IMMEDIATELY. Premier Vitality and Wellness LLC does not provide emergency medical services. Our services are elective wellness and optimization services and are not intended to replace your primary care physician, emergency services, or specialist care for acute medical conditions.</p>

          <h2 className="text-lg font-extralight text-foreground pt-4">2. Scope of Services</h2>
          <p>Premier Vitality and Wellness LLC provides physician-directed wellness and optimization services including but not limited to: peptide therapy, hormone optimization, biomarker analysis, nutritional counseling, and related medical services. These services are elective in nature.</p>

          <h2 className="text-lg font-extralight text-foreground pt-4">3. In-Person Medical Services Consent</h2>
          <p>By receiving in-person medical services at Premier Vitality and Wellness LLC (located at 1870 W Frye Rd Ste 1, Chandler, AZ 85224), you acknowledge and consent to the following:</p>
          <p><strong className="text-foreground">Nature of In-Person Care:</strong> During in-person visits, your medical history, examinations, and laboratory tests will be reviewed and discussed with your Provider. Physical examination of you will take place. Clinical staff may be present in the examination room to assist in your care. Procedures such as blood draws, injections, and other treatments may be performed as determined medically appropriate by your Provider.</p>
          <p><strong className="text-foreground">Clinical Documentation:</strong> Photography or imaging of treatment areas may be taken for clinical documentation purposes with your verbal consent at the time of service. Video, audio, and/or digital photography may be recorded during your visit only with your explicit consent.</p>
          <p><strong className="text-foreground">Medical Information and Records:</strong> All existing laws regarding your access to medical information and copies of your medical records apply to your in-person care. Dissemination of any patient-identifiable images or information from your visit to researchers or other entities shall not occur without your consent, unless authorized under existing confidentiality laws.</p>
          <p><strong className="text-foreground">Your Rights During In-Person Care:</strong> You have the right to refuse any procedure at any time. You have the right to ask questions about any proposed treatment before it is performed. You have the right to seek a second opinion. You have the right to know the identity of all clinical staff involved in your care.</p>

          <h2 className="text-lg font-extralight text-foreground pt-4">4. Nature of Telehealth Consultation</h2>
          <p>During the telehealth consultation: (a) Details of your medical history, examinations, and laboratory tests will be discussed with your Provider through the use of interactive video, audio and telecommunications technology. (b) Physical examination may take place to the extent possible via video. (c) Nonmedical technical personnel may be present to aid in video transmission. (d) Video, audio, and/or digital recordings may be made during the telemedicine consultation only with your explicit consent.</p>

          <h2 className="text-lg font-extralight text-foreground pt-4">5. Medical Information and Records (Telehealth)</h2>
          <p>All existing laws regarding your access to medical information and copies of your medical records apply to your telehealth consultation. Dissemination of any patient-identifiable images or information from this telemedicine interaction to researchers or other entities shall not occur without your consent, unless authorized under existing confidentiality laws.</p>

          <h2 className="text-lg font-extralight text-foreground pt-4">6. Confidentiality</h2>
          <p>Reasonable and appropriate efforts have been made to eliminate any confidentiality risks associated with both in-person and telehealth consultations. All existing confidentiality protections under federal and state law apply to information disclosed during your care. For telehealth, we use HIPAA-compliant encrypted platforms. You are responsible for ensuring privacy on your end during telehealth sessions.</p>

          <h2 className="text-lg font-extralight text-foreground pt-4">7. Risks and Benefits</h2>
          <p>The benefits of our services include access to physician-directed peptide therapy, hormone optimization, and wellness services in both a convenient in-person setting and via telehealth.</p>
          <p>Potential risks of in-person care include, but are not limited to: adverse reactions to medications or treatments, injection site reactions, bruising, soreness, allergic responses, infection at injection sites, and other known or unknown side effects. Your Provider will discuss specific risks prior to initiating any treatment.</p>
          <p>Potential risks of telehealth include: because of your specific medical condition or due to technical problems, a face-to-face in-person consultation still may be necessary after the telehealth appointment. Additionally, in rare circumstances, security protocols could fail causing a breach of patient privacy. The alternative to a telehealth consultation is a face-to-face visit with a physician at our facility.</p>

          <h2 className="text-lg font-extralight text-foreground pt-4">8. Peptide Therapy and Compounded Medications</h2>
          <p>Peptide therapies and compounded medications are prescribed and supervised by licensed physicians. You acknowledge that: (a) Compounded medications are not FDA-approved as finished drug products, though the individual ingredients may be FDA-approved or otherwise legally marketed. (b) Results vary by individual and no specific outcome is guaranteed. (c) All therapies carry inherent risks including adverse reactions, injection site reactions, allergic responses, and other known or unknown side effects. (d) You must disclose all current medications, supplements, and health conditions to your Provider to avoid contraindications. (e) Some treatments provided by Premier Vitality and Wellness LLC may constitute off-label use of medications. Your Provider will inform you when this applies and will explain the evidence base for the recommended treatment.</p>

          <h2 className="text-lg font-extralight text-foreground pt-4">9. No Physician-Patient Relationship Via Website</h2>
          <p>Browsing our website or contacting us does not establish a physician-patient relationship. A physician-patient relationship is established only after a formal consultation with one of our licensed Providers and mutual agreement to proceed with care.</p>

          <h2 className="text-lg font-extralight text-foreground pt-4">10. Individual Results</h2>
          <p>Results from peptide therapy, hormone optimization, and other wellness services vary significantly between individuals based on genetics, lifestyle, compliance, and other factors. Testimonials or case studies do not guarantee similar results.</p>

          <h2 className="text-lg font-extralight text-foreground pt-4">11. Patient Responsibilities</h2>
          <p>I agree to: (a) provide complete and accurate medical history; (b) report any changes in my health status promptly; (c) follow treatment instructions as directed by my Provider; (d) attend scheduled follow-up appointments; (e) promptly report any adverse reactions or concerns to my Provider; (f) not drive or operate heavy machinery if my Provider advises against it following a procedure.</p>

          <h2 className="text-lg font-extralight text-foreground pt-4">12. Acknowledgment</h2>
          <p>My health care practitioner has discussed with me the information provided in this document. I have had an opportunity to ask questions about this information and all of my questions have been answered. I understand the written information provided above. I voluntarily consent to receive medical services from Premier Vitality and Wellness LLC, including both in-person and telehealth services.</p>

          <h2 className="text-lg font-extralight text-foreground pt-4">13. Contact</h2>
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

export default Disclaimer;
