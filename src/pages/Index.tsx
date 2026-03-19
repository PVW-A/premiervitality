import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import HowItWorksHome from "@/components/HowItWorksHome";
import TestimonialsMarquee from "@/components/TestimonialsMarquee";
import FoundersSection from "@/components/FoundersSection";
import AboutSection from "@/components/AboutSection";
import HealthIntelligenceSection from "@/components/HealthIntelligenceSection";
import BloodworkPanelsSection from "@/components/BloodworkPanelsSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

const Index = () => (
  <div className="min-h-screen bg-background">
    <SEO
      canonical="/"
      description="Premier Vitality & Wellness offers physician-directed peptide therapy for longevity, anti-aging, performance, and recovery. Evidence-based protocols tailored to your biology."
    />
    <Navbar />
    <main>
      <HeroSection />
      <HowItWorksHome />
      <TestimonialsMarquee />
      <FoundersSection />
      <AboutSection />
      <HealthIntelligenceSection />
      <BloodworkPanelsSection />
      <CTASection />
    </main>
    <Footer />
  </div>
);

export default Index;
