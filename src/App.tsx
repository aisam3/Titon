import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import ResetPassword from "./pages/ResetPassword.tsx";
import Success from "./pages/checkout/Success.tsx";
import Cancel from "./pages/checkout/Cancel.tsx";
import NotFound from "./pages/NotFound.tsx";
import PopPage from "./pages/PopPage.tsx";
import KMVault from "./pages/KM/KMVault.tsx";
import R6Audit from "./pages/R6Audit/R6Audit.tsx";
import About from "./pages/About.tsx";
import StartHere from "./pages/StartHere.tsx";
import HowItWorks from "./pages/HowItWorks.tsx";




const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/success" element={<Success />} />
          <Route path="/cancel" element={<Cancel />} />
          <Route path="/pop" element={<PopPage />} />
          <Route path="/kmvault" element={<KMVault />} />
          <Route path="/r6-audit" element={<R6Audit />} />
          <Route path="/about" element={<About />} />
          <Route path="/start-here" element={<StartHere />} />
          <Route path="/how-titon-works" element={<HowItWorks />} />



          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
