import { useState, useEffect } from "react";
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

const Services = () => {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  // Gate: redirect unauthenticated users to auth
  useEffect(() => {
    if (!loading && !user) navigate("/auth?redirect=/services");
  }, [user, loading, navigate]);

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
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-20">
        {/* Header */}
        <section className="max-w-4xl mx-auto text-center px-6 mb-16">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-xs tracking-[0.35em] uppercase text-primary font-body font-light mb-4"
          >
            Membership Plans
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-heading font-light text-foreground mb-6"
          >
            Invest in Your Vitality
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-muted-foreground font-body font-light text-sm md:text-base max-w-2xl mx-auto leading-relaxed"
          >
            Choose a membership to unlock access to our premium peptide catalog,
            scheduled blood work, physician consultations, and exclusive member
            discounts.
          </motion.p>
        </section>

        {/* Billing Toggle */}
        <div className="flex justify-center mb-14">
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
          <div className="max-w-6xl mx-auto px-6 grid gap-8 md:grid-cols-3">
            {tiers?.map((tier, i) => {
              const price =
                billingCycle === "monthly" ? tier.monthly_price : tier.annual_price;
              const isPopular = tier.slug === "premium";
              const isCurrentTier = membership?.tier_id === tier.id;
              const features = (tier.features as string[]) || [];

              return (
                <motion.div
                  key={tier.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.12 }}
                  className={`relative flex flex-col border ${tierAccents[tier.slug] || "border-border"} bg-card p-8 md:p-10 ${
                    isPopular ? "md:-mt-4 md:mb-0 md:pb-12" : ""
                  }`}
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
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Bottom CTA */}
        <section className="max-w-3xl mx-auto text-center px-6 mt-20">
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
