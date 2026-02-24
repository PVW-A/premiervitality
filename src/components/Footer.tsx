import { Link } from "react-router-dom";

const legalLinks = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  { label: "Disclaimer", href: "/disclaimer" },
];

const Footer = () => (
  <footer className="border-t border-border py-12 px-6">
    <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
      <p className="text-lg font-light tracking-[0.2em] uppercase text-foreground">Premier Vitality</p>
      <p className="text-sm text-muted-foreground font-body">
        © {new Date().getFullYear()} Premier Vitality & Wellness. All rights reserved.
      </p>
      <div className="flex gap-6">
        {legalLinks.map((l) => (
          <Link key={l.label} to={l.href} className="text-sm text-muted-foreground hover:text-primary transition-colors font-body">
            {l.label}
          </Link>
        ))}
      </div>
    </div>
  </footer>
);

export default Footer;
