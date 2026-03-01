import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { openCalendly } from "@/hooks/useCalendly";

const serviceAreas = [
  { name: "Chandler", description: "Our home base — located at 1870 W Frye Rd, Ste 1." },
  { name: "Gilbert", description: "Serving Gilbert residents with advanced peptide protocols and bloodwork analysis." },
  { name: "Tempe", description: "Convenient access for Tempe professionals seeking performance optimization." },
  { name: "Mesa", description: "Comprehensive longevity programs for the Mesa community." },
  { name: "Scottsdale", description: "Premium vitality services for Scottsdale's health-conscious clientele." },
  { name: "Phoenix", description: "Serving the greater Phoenix metro with physician-directed wellness." },
  { name: "Queen Creek", description: "Extending our evidence-based care to the Queen Creek area." },
  { name: "Ahwatukee", description: "Personalized peptide therapy and consultations for Ahwatukee residents." },
];

const localJsonLd = {
  "@context": "https://schema.org",
  "@type": "MedicalBusiness",
  "name": "Premier Vitality & Wellness",
  "description":
    "Physician-directed peptide therapy clinic in Chandler, AZ serving the East Valley. Specializing in longevity, anti-aging, hormone optimization, and cellular recovery.",
  "url": "https://www.premiervitalityandwellness.com/service-area",
  "telephone": "+1-772-280-2912",
  "email": "contact@premiervitalityandwellness.com",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "1870 W Frye Rd, Ste 1",
    "addressLocality": "Chandler",
    "addressRegion": "AZ",
    "postalCode": "85224",
    "addressCountry": "US",
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 33.3062,
    "longitude": -111.8713,
  },
  "areaServed": serviceAreas.map((a) => ({
    "@type": "City",
    "name": `${a.name}, AZ`,
  })),
  "medicalSpecialty": "Longevity Medicine",
  "priceRange": "$$",
};

const ServiceArea = () => (
  <div className="min-h-screen bg-background">
    <SEO
      title="Service Areas — Chandler, Gilbert, Tempe & East Valley AZ"
      description="Premier Vitality & Wellness serves Chandler, Gilbert, Tempe, Mesa, Scottsdale, and the greater Phoenix East Valley with physician-directed peptide therapy, bloodwork analysis, and longevity protocols."
      canonical="/service-area"
      jsonLd={localJsonLd}
    />
    <Navbar />

    <main className="pt-24 pb-20">
      {/* Hero */}
      <section className="max-w-4xl mx-auto text-center px-6 mb-16">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-xs tracking-[0.35em] uppercase text-primary font-body font-light mb-4"
        >
          Service Areas
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl md:text-5xl lg:text-6xl font-heading font-light text-foreground mb-6"
        >
          Serving Arizona's East Valley
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-muted-foreground font-body font-light text-sm md:text-base max-w-2xl mx-auto leading-relaxed"
        >
          Located in the heart of Chandler, we provide physician-directed peptide
          therapy, comprehensive bloodwork analysis, and personalized longevity
          protocols to patients across the East Valley and greater Phoenix area.
        </motion.p>
      </section>

      {/* Location card */}
      <section className="max-w-4xl mx-auto px-6 mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="border border-primary/30 bg-card p-8 md:p-10 flex flex-col md:flex-row gap-8"
        >
          <div className="flex-1">
            <p className="text-xs tracking-[0.3em] uppercase text-primary font-body font-light mb-3">
              Our Location
            </p>
            <h2 className="text-2xl font-heading font-light text-foreground mb-4">
              Premier Vitality & Wellness
            </h2>
            <div className="flex flex-col gap-3">
              <div className="flex items-start gap-2.5 text-sm text-muted-foreground font-body font-light">
                <MapPin size={15} className="text-primary mt-0.5 shrink-0" />
                <span>1870 W Frye Rd, Ste 1<br />Chandler, AZ 85224</span>
              </div>
              <a
                href="tel:+17722802912"
                className="flex items-center gap-2.5 text-sm text-muted-foreground font-body font-light hover:text-primary transition-colors"
              >
                <Phone size={15} className="text-primary shrink-0" />
                (772) 280-2912
              </a>
              <a
                href="mailto:contact@premiervitalityandwellness.com"
                className="flex items-center gap-2.5 text-sm text-muted-foreground font-body font-light hover:text-primary transition-colors"
              >
                <Mail size={15} className="text-primary shrink-0" />
                contact@premiervitalityandwellness.com
              </a>
            </div>
          </div>

          {/* Google Maps Embed */}
          <div className="flex-1 min-h-[240px]">
            <iframe
              title="Premier Vitality & Wellness location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3331.2!2d-111.8713!3d33.3062!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2z1870+W+Frye+Rd+Ste+1+Chandler+AZ+85224!5e0!3m2!1sen!2sus!4v1700000000000"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: 240 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full"
            />
          </div>
        </motion.div>
      </section>

      {/* Area grid */}
      <section className="max-w-5xl mx-auto px-6 mb-20">
        <motion.h2
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-2xl md:text-3xl font-heading font-light text-foreground text-center mb-10"
        >
          Communities We Serve
        </motion.h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {serviceAreas.map((area, i) => (
            <motion.div
              key={area.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="border border-border bg-card p-6 flex flex-col"
            >
              <h3 className="text-xs tracking-[0.25em] uppercase text-primary font-body font-light mb-2">
                {area.name}, AZ
              </h3>
              <p className="text-sm text-muted-foreground font-body font-light leading-relaxed flex-1">
                {area.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-3xl mx-auto text-center px-6">
        <p className="text-muted-foreground font-body font-light text-sm leading-relaxed mb-6">
          Whether you're in Chandler, Gilbert, Tempe, or anywhere in the East
          Valley, our physician-directed programs are designed to optimize your
          health and longevity.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={openCalendly}
            className="inline-flex items-center justify-center gap-2 px-8 py-3 text-xs tracking-[0.2em] uppercase font-body font-light bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Book a Consultation
            <ArrowRight size={14} strokeWidth={1.2} />
          </button>
          <Link
            to="/services"
            className="inline-flex items-center justify-center gap-2 px-8 py-3 text-xs tracking-[0.2em] uppercase font-body font-light border border-primary/40 text-primary hover:bg-primary/10 transition-colors"
          >
            View Membership Plans
          </Link>
        </div>
      </section>
    </main>

    <Footer />
  </div>
);

export default ServiceArea;
