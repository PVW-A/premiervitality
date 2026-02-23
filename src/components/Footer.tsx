const Footer = () => (
  <footer className="border-t border-border py-12 px-6">
    <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
      <p className="font-heading text-xl font-semibold text-primary tracking-wide">VITALIS</p>
      <p className="text-sm text-muted-foreground font-body">
        © {new Date().getFullYear()} Vitalis Clinic. All rights reserved.
      </p>
      <div className="flex gap-6">
        {["Privacy", "Terms"].map((l) => (
          <a key={l} href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors font-body">
            {l}
          </a>
        ))}
      </div>
    </div>
  </footer>
);

export default Footer;
