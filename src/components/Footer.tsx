import { Link } from "react-router-dom";
import { Phone, Mail, MapPin } from "lucide-react";

const legalLinks = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  { label: "Disclaimer", href: "/disclaimer" },
];

const Footer = () => (
  <footer className="border-t border-border py-12 px-6">
    <div className="max-w-6xl mx-auto">
      {/* Top row — brand + contact */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mb-8">
        <div>
          <p className="text-lg font-light tracking-[0.2em] uppercase text-foreground mb-2">
            Premier Vitality
          </p>
          <p className="text-xs text-muted-foreground font-body font-light max-w-sm leading-relaxed">
            Physician-directed peptide therapy for longevity, performance, and recovery.
          </p>
        </div>

        <div className="flex flex-col gap-2.5">
          <a
            href="tel:+14809102359"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors font-body font-light"
          >
            <Phone size={14} strokeWidth={1.2} className="text-primary" />
            (480) 234-9108
          </a>
          <a
            href="mailto:contact@premiervitalityandwellness.com"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors font-body font-light"
          >
            <Mail size={14} strokeWidth={1.2} className="text-primary" />
            contact@premiervitalityandwellness.com
          </a>
          <div className="flex items-center gap-2 text-sm text-muted-foreground font-body font-light">
            <MapPin size={14} strokeWidth={1.2} className="text-primary shrink-0" />
            <span>1870 W Frye Rd, Ste 1, Chandler, AZ 85224</span>
          </div>
        </div>
      </div>

      {/* Bottom row — legal */}
      <div className="border-t border-border/50 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-xs text-muted-foreground font-body">
          © {new Date().getFullYear()} Premier Vitality & Wellness. All rights reserved.
        </p>
        <div className="flex gap-6">
          {legalLinks.map((l) => (
            <Link
              key={l.label}
              to={l.href}
              className="text-xs text-muted-foreground hover:text-primary transition-colors font-body"
            >
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
