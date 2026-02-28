import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import FoundersSection from "@/components/FoundersSection";
import VitalityScoreSection from "@/components/VitalityScoreSection";
import BiologicalAgeSection from "@/components/BiologicalAgeSection";
import BloodworkPanelsSection from "@/components/BloodworkPanelsSection";
import PopularPeptidesCarousel from "@/components/PopularPeptidesCarousel";
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
      <AboutSection />
      <VitalityScoreSection />
      <BiologicalAgeSection />
      <BloodworkPanelsSection />
      <PopularPeptidesCarousel />
      <FoundersSection />
      <CTASection />
    </main>
    <Footer />
  </div>
);

export default Index;
