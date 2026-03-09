import SEO from "@/components/SEO";
import { useState, useEffect, useRef } from "react";
import { openCalendly } from "@/hooks/useCalendly";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SubscriptionCheckout from "@/components/SubscriptionCheckout";
import BloodworkBreakdown from "@/components/services/BloodworkBreakdown";
import HowItWorks from "@/components/services/HowItWorks";
import TierComparisonTable from "@/components/services/TierComparisonTable";
import MembershipFAQ from "@/components/services/MembershipFAQ";
import SocialProofStrip from "@/components/services/SocialProofStrip";

const Services = () => {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  // Allow browsing without auth; gate checkout only


  const { data: tiers, isLoading } = useQuery({
    queryKey: ["membership-tiers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("membership_tiers")
        .select("*")
        .order("sort_order")
        .neq("slug", "legacy");
      if (error) throw error;
      return data;
    },
  });

  const { data: membership } = useQuery({
    queryKey: ["my-membership", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("memberships")
        .select("*, membership_tiers(*)")
        .eq("user_id", user!.id)
        .eq("status", "active")
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const [checkoutTier, setCheckoutTier] = useState<{
    id: string;
    name: string;
    slug: string;
    monthly_price: number;
    annual_price: number;
  } | null>(null);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const tiersGridRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const cards = tiersGridRef.current?.querySelectorAll<HTMLElement>(".pv-card-reveal");
    if (!cards?.length) return;
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) { (e.target as HTMLElement).classList.add("pv-visible"); obs.unobserve(e.target); }
      }),
      { threshold: 0.04 }
    );
    cards.forEach((c, i) => { c.style.animationDelay = `${Math.min(i * 0.04, 0.12)}s`; obs.observe(c); });
    return () => obs.disconnect();
  }, [tiers]);

  const handleJoin = (tier: NonNullable<typeof tiers>[number]) => {
    if (!user) {
      navigate("/auth?redirect=/services");
      return;
    }
    setCheckoutTier({
      id: tier.id,
      name: tier.name,
      slug: tier.slug,
      monthly_price: tier.monthly_price,
      annual_price: tier.annual_price,
    });
    setCheckoutOpen(true);
  };

  const tierAccents: Record<string, string> = {
    essential: "border-border",
    premium: "border-primary/60",
    elite: "border-primary",
  };
  const savingsPercent = (monthly: number, annual: number) =>
    Math.round(((monthly - annual) / monthly) * 100);

  return (
    <div className="min-h-screen bg-background" style={{ backgroundImage: "radial-gradient(ellipse 70% 40% at 50% 0%, hsl(39 38% 60% / 0.06) 0%, transparent 55%), radial-gradient(ellipse 50% 35% at 80% 70%, hsl(39 38% 40% / 0.04) 0%, transparent 55%)" }}>
      <SEO
        title="Membership Plans & Pricing"
        description="Join Premier Vitality & Wellness. Choose a membership plan for physician-directed peptide therapy, bloodwork analysis, and personalized longevity protocols."
        canonical="/services"
      />
      <Navbar />
      <main className="pt-24 pb-20">
        {/* Header */}
        <section className="max-w-4xl mx-auto text-center px-6 mb-16">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="text-xs tracking-[0.35em] uppercase text-primary font-body font-light mb-4"
          >
            Membership Plans
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.05 }}
            className="text-4xl md:text-5xl lg:text-6xl font-heading font-light text-foreground mb-6"
          >
            Invest in Your Vitality
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.1 }}
            className="text-muted-foreground font-body font-light text-sm md:text-base max-w-2xl mx-auto leading-relaxed"
          >
            Choose a membership to unlock access to our premium peptide catalog,
            scheduled blood work, physician consultations, and exclusive member
            discounts.
          </motion.p>
        </section>

        {/* How It Works */}
        <HowItWorks />

        {/* Billing Toggle */}
        <div className="flex justify-center mt-16 mb-14" style={{ position: "relative", zIndex: 30, isolation: "isolate" }}>
          <div className="inline-flex items-center bg-secondary rounded-full p-1 gap-1">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-5 py-2 text-xs tracking-[0.15em] uppercase font-body font-light rounded-full transition-colors duration-200 ${
                billingCycle === "monthly"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle("annual")}
              className={`px-5 py-2 text-xs tracking-[0.15em] uppercase font-body font-light rounded-full transition-colors duration-200 ${
                billingCycle === "annual"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Annual
            </button>
          </div>
        </div>

        {/* Tier Cards */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="w-6 h-6 border border-primary/40 border-t-primary rounded-full animate-spin" />
          </div>
        ) : (
          <div ref={tiersGridRef} className="max-w-6xl mx-auto px-6 grid gap-8 md:grid-cols-3" style={{ position: "relative", zIndex: 1 }}>
            {tiers?.map((tier, i) => {
              const price =
                billingCycle === "monthly" ? tier.monthly_price : tier.annual_price;
              const isPopular = tier.slug === "premium";
              const isCurrentTier = membership?.tier_id === tier.id;
              const features = (tier.features as string[]) || [];

              return (
                <div
                  key={tier.id}
                  className={`pv-card-reveal pv-hover-lift relative flex flex-col p-8 md:p-10 ${
                    isPopular ? "md:-mt-4 md:mb-0 md:pb-12" : ""
                  }`}
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
                    border: `1px solid ${isPopular ? "hsl(39 38% 60% / 0.4)" : "rgba(255,255,255,0.08)"}`,
                    boxShadow: isPopular
                      ? "0 12px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)"
                      : "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)",
                  }}
                >
                  {isPopular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                      <span className="inline-flex items-center gap-1.5 bg-primary text-primary-foreground text-[10px] tracking-[0.2em] uppercase font-body px-4 py-1.5">
                        <Sparkles size={12} /> Most Popular
                      </span>
                    </div>
                  )}

                  <h3 className="text-xs tracking-[0.3em] uppercase text-primary font-body font-light mb-3">
                    {tier.name}
                  </h3>

                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="text-4xl font-heading font-light text-foreground">
                      ${price.toFixed(2)}
                    </span>
                    <span className="text-muted-foreground text-xs font-body">/mo</span>
                  </div>

                  {billingCycle === "annual" && (
                    <span className="text-xs text-primary font-body mb-6">
                      Save {savingsPercent(tier.monthly_price, tier.annual_price)}% — billed
                      annually
                    </span>
                  )}
                  {billingCycle === "monthly" && <div className="mb-6" />}

                  <div className="flex-1 flex flex-col gap-3 mb-8">
                    {features.map((f, fi) => (
                      <div
                        key={fi}
                        className="flex items-start gap-2.5 text-sm text-muted-foreground font-body font-light"
                      >
                        <Check size={15} className="text-primary mt-0.5 shrink-0" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>

                  <BloodworkBreakdown slug={tier.slug} />

                  <button
                    onClick={() => handleJoin(tier)}
                    disabled={isCurrentTier}
                    className={`w-full py-3 text-xs tracking-[0.2em] uppercase font-body font-light transition-colors duration-200 ${
                      isCurrentTier
                        ? "bg-secondary text-muted-foreground cursor-default"
                        : isPopular
                        ? "bg-primary text-primary-foreground hover:bg-primary/90"
                        : "border border-primary/40 text-primary hover:bg-primary/10"
                    }`}
                  >
                    {isCurrentTier ? "Current Plan" : "Get Started"}
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Comparison Table */}
        <TierComparisonTable />

        {/* Social Proof */}
        <SocialProofStrip />

        {/* FAQ */}
        <MembershipFAQ />

        {/* Bottom CTA */}
        <section className="max-w-3xl mx-auto text-center px-6">
          <p className="text-muted-foreground font-body font-light text-sm leading-relaxed">
            All memberships include access to our complete peptide catalog with
            member-exclusive pricing. Need help choosing?{" "}
            <button onClick={openCalendly} className="text-primary hover:underline">
              Contact us
            </button>{" "}
            for a free consultation.
          </p>
        </section>
      </main>
      <SubscriptionCheckout
        open={checkoutOpen}
        onOpenChange={setCheckoutOpen}
        tier={checkoutTier}
        billingCycle={billingCycle}
        onSuccess={() => navigate("/portal")}
      />
      <Footer />
    </div>
  );
};

export default Services;
