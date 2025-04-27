
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";
import GoogleMapsInit from "./components/GoogleMapsInit";
import ModelsGallery from "./pages/ModelsGallery";
import InternetAssetDetail from "./pages/dashboard/assetDetails/InternetAssetDetail";
import EVAssetDetail from "./pages/dashboard/assetDetails/EVAssetDetail";
import SolarAssetDetail from "./pages/dashboard/assetDetails/SolarAssetDetail";
import AddAssetPage from "./pages/dashboard/AddAssetPage";
import AccountPage from "./pages/dashboard/AccountPage";
import ModelViewerScript from "./components/ModelViewerScript";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

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
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/models" element={<ModelsGallery />} />
            <Route path="/dashboard/rooftop" element={<SolarAssetDetail />} />
            <Route path="/dashboard/internet" element={<InternetAssetDetail />} />
            <Route path="/dashboard/ev-charging" element={<EVAssetDetail />} />
            <Route path="/dashboard/add-asset" element={<AddAssetPage />} />
            <Route path="/dashboard/account" element={<AccountPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
          <Sonner />
        </GoogleMapsInit>
      </TooltipProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
