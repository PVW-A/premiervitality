import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ThemeProvider } from "next-themes";
import Index from "./pages/Index";
import About from "./pages/About";
import Auth from "./pages/Auth";
import Portal from "./pages/Portal";
import Admin from "./pages/Admin";
import Catalog from "./pages/Catalog";
import PeptidesPage from "./pages/Peptides";
import OurWhy from "./pages/OurWhy";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Terms from "./pages/Terms";
import Disclaimer from "./pages/Disclaimer";
import Services from "./pages/Services";
import DrJamesStory from "./pages/DrJamesStory";
import ServiceArea from "./pages/ServiceArea";
import FAQ from "./pages/FAQ";
import SmsConsent from "./pages/SmsConsent";
import ResetPassword from "./pages/ResetPassword";
import AuthCallback from "./pages/AuthCallback";
import Protocols from "./pages/Protocols";
import PatientDashboard from "./pages/PatientDashboard";
import NotFound from "./pages/NotFound";
import ChatButton from "./components/chat/ChatButton";
import SessionTimeoutDialog from "./components/SessionTimeoutDialog";
import { useSessionTimeout } from "./hooks/useSessionTimeout";

const queryClient = new QueryClient();

const SessionTimeoutWrapper = () => {
  const { showWarning, stayLoggedIn } = useSessionTimeout();
  return <SessionTimeoutDialog open={showWarning} onStay={stayLoggedIn} />;
};

const App = () => (
  <HelmetProvider>
  <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <SessionTimeoutWrapper />
            <ChatButton />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/portal" element={<Portal />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/catalog" element={<Catalog />} />
              <Route path="/peptides" element={<PeptidesPage />} />
              <Route path="/our-why" element={<OurWhy />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/disclaimer" element={<Disclaimer />} />
              <Route path="/services" element={<Services />} />
              <Route path="/dr-james-story" element={<DrJamesStory />} />
              <Route path="/service-area" element={<ServiceArea />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/sms-consent" element={<SmsConsent />} />
              <Route path="/protocols" element={<Protocols />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route path="/dashboard" element={<PatientDashboard />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
  </HelmetProvider>
);

export default App;
