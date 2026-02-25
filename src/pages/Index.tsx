import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import FoundersSection from "@/components/FoundersSection";
import VitalityScoreSection from "@/components/VitalityScoreSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

const Index = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <main>
      <HeroSection />
      <AboutSection />
      <VitalityScoreSection />
      <FoundersSection />
      <CTASection />
    </main>
    <Footer />
  </div>
);

export default Index;
