
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import GoogleMapsInit from "./components/GoogleMapsInit";
import InternetSpeedDisplay from "./components/InternetSpeedDisplay";
import ModelViewerScript from "./components/ModelViewerScript";
import ModelsGallery from "./pages/ModelsGallery";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <TooltipProvider>
        <GoogleMapsInit>
          <ModelViewerScript />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/models" element={<ModelsGallery />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <InternetSpeedDisplay />
          <Toaster />
          <Sonner />
        </GoogleMapsInit>
      </TooltipProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
