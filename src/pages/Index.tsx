import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import PeptidesSection from "@/components/PeptidesSection";
import AboutSection from "@/components/AboutSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

const Index = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <main>
      <HeroSection />
      <PeptidesSection />
      <AboutSection />
      <CTASection />
    </main>
    <Footer />
  </div>
);

export default Index;
