const testimonials = [
  {
    quote:
      "I've tried every biohacking trend out there. This is the first program that actually moved my bloodwork in the right direction — and I feel it every morning.",
    name: "Marcus T.",
    location: "Scottsdale, AZ",
    initials: "MT",
  },
  {
    quote:
      "The physician oversight makes all the difference. I'm not just taking peptides — I have a team monitoring my labs and adjusting my protocol in real time.",
    name: "Dr. Sarah K.",
    location: "Austin, TX",
    initials: "SK",
  },
  {
    quote:
      "Within 8 weeks my sleep quality improved dramatically, my recovery time cut in half, and my focus at work is sharper than it's been in years.",
    name: "Jason R.",
    location: "Miami, FL",
    initials: "JR",
  },
  {
    quote:
      "I was skeptical about peptide therapy until I saw my before-and-after labs. The data doesn't lie — this is the real deal.",
    name: "Amanda L.",
    location: "San Diego, CA",
    initials: "AL",
  },
  {
    quote:
      "As a competitive athlete, recovery is everything. Premier Vitality's protocols gave me back the edge I thought I'd lost to age.",
    name: "David H.",
    location: "Denver, CO",
    initials: "DH",
  },
  {
    quote:
      "The concierge experience is unlike anything I've had with traditional medicine. Questions answered same-day, protocols adjusted weekly. This is how healthcare should work.",
    name: "Rachel M.",
    location: "Newport Beach, CA",
    initials: "RM",
  },
];

const Card = ({ t }: { t: (typeof testimonials)[number] }) => (
  <div
    className="flex-shrink-0 w-[340px] p-6 rounded-xl mx-3"
    style={{
      background: "rgba(255,255,255,0.03)",
      backdropFilter: "blur(12px)",
      WebkitBackdropFilter: "blur(12px)",
      border: "1px solid rgba(255,255,255,0.06)",
      boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
    }}
  >
    <p className="text-sm text-muted-foreground font-body font-light leading-relaxed mb-5">
      "{t.quote}"
    </p>
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-xs font-body text-primary tracking-wide">
        {t.initials}
      </div>
      <div>
        <p className="text-sm font-light text-foreground">{t.name}</p>
        <p className="text-xs text-muted-foreground font-body">{t.location}</p>
      </div>
    </div>
  </div>
);

const TestimonialsMarquee = () => (
  <section className="py-20 overflow-hidden">
    <div className="max-w-4xl mx-auto text-center px-6 mb-12">
      <p className="text-xs tracking-[0.3em] uppercase text-primary font-body font-light mb-3">
        Testimonials
      </p>
      <h2 className="text-2xl md:text-4xl font-heading font-light text-foreground">
        What Our Members Say
      </h2>
    </div>

    <div className="relative group">
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-20 z-10 bg-gradient-to-r from-background to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-20 z-10 bg-gradient-to-l from-background to-transparent pointer-events-none" />

      <div className="flex animate-marquee group-hover:[animation-play-state:paused]">
        {[...testimonials, ...testimonials].map((t, i) => (
          <Card key={i} t={t} />
        ))}
      </div>
    </div>

    <style>{`
      @keyframes marquee {
        0% { transform: translateX(0); }
        100% { transform: translateX(-50%); }
      }
      .animate-marquee {
        animation: marquee 40s linear infinite;
        width: max-content;
      }
    `}</style>
  </section>
);

export default TestimonialsMarquee;
