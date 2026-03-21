import SEO from "@/components/SEO";
import { useState, useEffect, useRef } from "react";
import { openCalendly } from "@/hooks/useCalendly";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
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

  const hardcodedPlans = [
    {
      slug: "essential",
      name: "Essential",
      monthlyPrice: 99,
      annualPrice: 82,
      popular: false,
      features: [
        "Access to peptide catalog",
        "Full-price peptide access",
        "1 Baseline Panel at sign-up (100+ biomarkers)",
        "1 Core Checkup per year (40+ biomarkers)",
        "Email support",
      ],
    },
    {
      slug: "premium",
      name: "Premium",
      monthlyPrice: 199,
      annualPrice: 165,
      popular: true,
      features: [
        "Access to peptide catalog",
        "15% discount on peptides",
        "1 Baseline Panel at sign-up (100+ biomarkers)",
        "2 Core Checkups per year (40+ biomarkers each)",
        "Quarterly physician check-ins",
        "Priority support",
      ],
    },
    {
      slug: "elite",
      name: "Elite",
      monthlyPrice: 349,
      annualPrice: 290,
      popular: false,
      features: [
        "Access to peptide catalog",
        "25% discount on peptides",
        "1 Baseline Panel at sign-up (100+ biomarkers)",
        "3 Core Checkups per year (40+ biomarkers each)",
        "Monthly physician check-ins",
        "Dedicated wellness concierge",
        "Early access to new protocols",
      ],
    },
  ];

  const handleToggleAnnual = () => {
    setBillingCycle("annual");
  };

  const handleJoinPlan = (slug: string) => {
    if (!user) {
      navigate("/auth?redirect=/services");
      return;
    }
    const tier = tiers?.find((t) => t.slug === slug);
    if (tier) {
      handleJoin(tier);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundImage: "radial-gradient(ellipse 70% 40% at 50% 0%, hsl(39 38% 60% / 0.06) 0%, transparent 55%), radial-gradient(ellipse 50% 35% at 80% 70%, hsl(39 38% 40% / 0.04) 0%, transparent 55%)" }}>
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
        <div className="flex flex-col items-center pt-4 mb-14 gap-3">
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
              onClick={handleToggleAnnual}
              className={`px-5 py-2 text-xs tracking-[0.15em] uppercase font-body font-light rounded-full transition-colors duration-200 ${
                billingCycle === "annual"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Annual
            </button>
          </div>
          <AnimatePresence>
            {billingCycle === "annual" && (
              <motion.span
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="text-xs text-primary font-body font-light"
              >
                Save 17% annually
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Tier Cards */}
        <div ref={tiersGridRef} className="max-w-6xl mx-auto px-6 grid gap-8 md:grid-cols-3">
          {hardcodedPlans.map((plan) => {
            const price = billingCycle === "monthly" ? plan.monthlyPrice : plan.annualPrice;
            const supabaseTier = tiers?.find((t) => t.slug === plan.slug);
            const isCurrentTier = supabaseTier && membership?.tier_id === supabaseTier.id;

            return (
              <div
                key={plan.slug}
                className={`pv-card-reveal pv-hover-lift relative flex flex-col p-8 md:p-10 ${
                  plan.popular ? "md:-mt-4 md:mb-0 md:pb-12" : ""
                }`}
                style={{
                  background: "rgba(255,255,255,0.03)",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                  border: `1px solid ${plan.popular ? "hsl(39 38% 60% / 0.4)" : "rgba(255,255,255,0.08)"}`,
                  boxShadow: plan.popular
                    ? "0 12px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)"
                    : "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)",
                }}
              >
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1.5 bg-primary text-primary-foreground text-[10px] tracking-[0.2em] uppercase font-body px-4 py-1.5">
                      <Sparkles size={12} /> Most Popular
                    </span>
                  </div>
                )}

                <h3 className="text-xs tracking-[0.3em] uppercase text-primary font-body font-light mb-3">
                  {plan.name}
                </h3>

                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-4xl font-heading font-light text-foreground">
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={price}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="inline-block"
                      >
                        ${price}
                      </motion.span>
                    </AnimatePresence>
                  </span>
                  <span className="text-muted-foreground text-xs font-body">/mo</span>
                </div>

                {billingCycle === "annual" ? (
                  <span className="text-xs text-primary font-body mb-6">
                    Save 17% - billed annually
                  </span>
                ) : (
                  <div className="mb-6" />
                )}

                <div className="flex-1 flex flex-col gap-3 mb-8">
                  {plan.features.map((f, fi) => (
                    <div
                      key={fi}
                      className="flex items-start gap-2.5 text-sm text-muted-foreground font-body font-light"
                    >
                      <Check size={15} className="text-primary mt-0.5 shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>

                <BloodworkBreakdown slug={plan.slug} />

                <button
                  onClick={() => handleJoinPlan(plan.slug)}
                  disabled={!!isCurrentTier}
                  className={`w-full py-3 text-xs tracking-[0.2em] uppercase font-body font-light transition-colors duration-200 ${
                    isCurrentTier
                      ? "bg-secondary text-muted-foreground cursor-default"
                      : plan.popular
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "border border-primary/40 text-primary hover:bg-primary/10"
                  }`}
                >
                  {isCurrentTier ? "Current Plan" : "Begin Your Protocol"}
                </button>
              </div>
            );
          })}
        </div>

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
