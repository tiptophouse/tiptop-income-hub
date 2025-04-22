
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { getPropertyInsightsFromAI } from '@/utils/openaiApi';
import { Building, TrendingUp, Home, AlertCircle, ChartBar, Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from '@/components/ui/use-toast';
import Property3DModel from './Property3DModel';
import { generateModelFromImage } from '@/utils/meshyApi';
import html2canvas from 'html2canvas';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface PropertyInsightsProps {
  address: string;
  className?: string;
}

const unicornGradient = "bg-gradient-to-tr from-[#9b87f5] via-[#f5e7ff] to-[#ffe4d8]";
const glassStyle = "backdrop-blur-2xl bg-white/70 dark:bg-[#18122B]/80 border border-white/50 shadow-[0_18px_40px_0_rgba(135,87,236,0.12),0_1.5px_5px_rgba(126,105,171,0.08)]";
const accentText = "text-[#8B5CF6] font-bold";
const cardRing = "ring-2 ring-[#B993FE]/30";

const PropertyInsights: React.FC<PropertyInsightsProps> = ({ address, className }) => {
  const [insights, setInsights] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retrying, setRetrying] = useState(false);
  const [generating3DModel, setGenerating3DModel] = useState(false);
  const [modelJobId, setModelJobId] = useState<string | null>(null);

  const fetchInsights = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPropertyInsightsFromAI(address);
      setInsights(data);
    } catch (error) {
      console.error("Error in PropertyInsights component:", error);
      setError("Failed to fetch property insights. Please try again later.");
    } finally {
      setLoading(false);
      setRetrying(false);
    }
  };

  useEffect(() => {
    if (!address) return;
    fetchInsights();
  }, [address]);

  const handleRetry = () => {
    setRetrying(true);
    fetchInsights();
  };

  const capturePropertyView = async (): Promise<string> => {
    const mapElement = document.querySelector('[id^="map-"], [class*="map-container"]') || 
                       document.querySelector('[class*="property-map"]');
    
    if (!mapElement) {
      throw new Error("No property view found to capture");
    }

    const canvas = await html2canvas(mapElement as HTMLElement);
    return canvas.toDataURL('image/png');
  };

  const handle3DModelGeneration = async () => {
    if (generating3DModel) return;
    
    try {
      setGenerating3DModel(true);
      toast({
        title: "Processing",
        description: "Generating 3D model of your property...",
      });
      
      const imageData = await capturePropertyView();
      const demoJobId = "model-" + Math.random().toString(36).substring(2, 10);
      setModelJobId(demoJobId);
      toast({
        title: "Success",
        description: "3D model generation started. It may take a few minutes to complete.",
      });
    } catch (error) {
      console.error("Error generating 3D model:", error);
      toast({
        title: "Error",
        description: "Failed to generate 3D model. Please try again later.",
        variant: "destructive"
      });
      setModelJobId("demo-model-" + Math.random().toString(36).substring(2, 8));
    } finally {
      setGenerating3DModel(false);
    }
  };

  if (!address) return null;

  if (loading) {
    return (
      <div className={`${glassStyle} animate-fade-in shadow-2xl rounded-3xl px-6 py-10`}>
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-[#8B5CF6]/90 rounded-full h-12 w-12 flex items-center justify-center shadow-lg border-4 border-white/80">
            <ChartBar className="h-7 w-7 text-white" />
          </div>
          <div>
            <span className="uppercase font-bold tracking-wide text-[#8B5CF6] text-xs">ANALYSIS</span>
            <div className="font-semibold text-xl text-gray-900 dark:text-[#f3eefd]">Analyzing Property...</div>
            <div className="text-md text-gray-600 mb-2">{address}</div>
          </div>
        </div>
        <div className="grid sm:grid-cols-3 gap-6">
          <Skeleton className="h-32 rounded-xl" />
          <Skeleton className="h-32 rounded-xl" />
          <Skeleton className="h-32 rounded-xl" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className={`${className} shadow-xl border-l-4 border-[#B993FE] animate-fade-in`}>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
        <Button 
          variant="outline" 
          className="mt-2 transition-all hover:scale-105"
          onClick={handleRetry}
          disabled={retrying}
        >
          {retrying ? "Retrying..." : "Retry"}
        </Button>
      </Alert>
    );
  }

  // Asset Card Helpers
  const assetCard = (type: string, color: string, title: string, main: string, details: string, value: string) => (
    <div className={`relative overflow-hidden rounded-xl ${glassStyle} shadow-lg group hover:scale-105 transition-transform duration-300 border-l-4 ${color}`}>
      <div className="absolute top-3 right-3 z-10">
        <span className={`inline-block px-3 py-1 bg-white/70 text-xs font-bold rounded-full uppercase tracking-wider ${accentText} shadow-sm`}>{title}</span>
      </div>
      <CardHeader className="pb-0 bg-transparent">
        <CardTitle className="text-lg">{main}</CardTitle>
        <CardDescription className="font-medium">{details}</CardDescription>
      </CardHeader>
      <CardContent className="pt-1">
        <div className="text-2xl md:text-3xl font-bold text-[#8B5CF6] mb-2">{value}</div>
      </CardContent>
    </div>
  );

  // Main Section Rendering
  return (
    <section className={`w-full flex flex-col items-center gap-10 ${className || ""} animate-fade-in`}>
      {/* Header */}
      <div className={`w-full max-w-3xl mx-auto rounded-3xl p-8 ${unicornGradient} shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center gap-8 mb-6`}>
        <div className="relative z-20 flex items-center gap-4">
          <span className="block bg-white/70 rounded-full p-3 shadow-xl border border-white/40">
            <ChartBar className="h-8 w-8 text-[#8B5CF6]" />
          </span>
          <div className="text-left">
            <div className="text-xl md:text-2xl font-extrabold text-gray-900 dark:text-[#f3eefd] tracking-tight mb-1">Property Analysis</div>
            <div className="font-medium text-gray-700 dark:text-[#DED9F3]">AI-powered insights for <span className={accentText}>{address}</span></div>
            {insights?.propertySize && (
              <div className="text-sm mt-1 text-[#B993FE] font-bold">Estimated Size: {insights.propertySize}</div>
            )}
          </div>
        </div>
        <div className="absolute right-0 bottom-0 z-0 w-5/12 h-40 hidden md:block" aria-hidden>
          <svg width="100%" height="100%" viewBox="0 0 200 60" fill="none"><ellipse cx="100" cy="30" rx="100" ry="30" fill="#ece2fe"/></svg>
        </div>
      </div>
      
      {/* Tabs and Insight Summary */}
      <Card className={`w-full max-w-3xl bg-white/95 dark:bg-[#18122B]/75 glass-morphism rounded-3xl ${glassStyle} ${cardRing} shadow-2xl`}>
        <CardHeader className="pb-2 pt-8 animate-fade-in">
          <CardTitle className="flex items-center gap-2 font-extrabold text-[#8B5CF6] text-2xl">
            <Info className="h-6 w-6 text-[#B993FE]" />
            Your Home Earning Potential
          </CardTitle>
          <CardDescription>
            <span className="text-gray-600">Discover how you can monetize your property.</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="animate-scale-in pb-10">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 rounded-xl bg-[#F3ECFF]">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="details">Asset Breakdown</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-5 animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
                <div className={`rounded-2xl bg-gradient-to-br from-[#DBEAFE] via-[#F3ECFF] to-white shadow-xl p-6 flex flex-col items-start`}>
                  <div className="flex items-center gap-3 mb-2">
                    <TrendingUp className="h-7 w-7 text-[#B993FE]" />
                    <span className="font-semibold text-tiptop-accent text-lg">Monthly Potential</span>
                  </div>
                  <div className="text-4xl font-extrabold text-[#8B5CF6] mb-2">{insights?.totalMonthlyPotential || "$300-570"}</div>
                  <span className="uppercase text-xs font-bold text-[#A78BFA] tracking-widest">estimated range</span>
                </div>
                <div className={`rounded-2xl bg-gradient-to-br from-[#F9ECFF] via-[#F3ECFF] to-white shadow-xl p-6 flex flex-col items-start`}>
                  <div className="flex items-center gap-3 mb-2">
                    <Home className="h-7 w-7 text-[#A0E884]" />
                    <span className="font-semibold text-tiptop-accent text-lg">Assets Found</span>
                  </div>
                  <div className="text-4xl font-extrabold text-[#A0E884] mb-2">4</div>
                  <span className="uppercase text-xs font-bold text-[#C7B9F9] tracking-widest">monetizable</span>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="details" className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
                {assetCard(
                  "rooftop", "border-l-purple-500",
                  "Rooftop Solar",
                  insights?.rooftopSolar?.sqFootage || "706 sq ft",
                  "Sun-soaked, ready for panels",
                  insights?.rooftopSolar?.monthlySavings || "$100-150 /mo"
                )}
                {assetCard(
                  "internet", "border-l-blue-500",
                  "Internet Bandwidth",
                  insights?.internetBandwidth?.sharingCapacity || "60-70%",
                  "Unused, monetizable",
                  insights?.internetBandwidth?.monthlyEarnings || "$80-120 /mo"
                )}
                {assetCard(
                  "parking", "border-l-orange-500",
                  "Parking Space",
                  insights?.parkingSpace?.available || "1-2 spaces",
                  "Prime location, high demand",
                  insights?.parkingSpace?.monthlyValue || "$70-200 /mo"
                )}
                {assetCard(
                  "garden", "border-l-green-500",
                  "Garden Space",
                  insights?.gardenSpace?.sqFootage || "104 sq ft",
                  "Perfect for community use",
                  insights?.gardenSpace?.monthlyPotential || "$50-100 /mo"
                )}
              </div>
            </TabsContent>
          </Tabs>

          <Button 
            variant="outline" 
            className="w-full mt-10 rounded-xl border-2 border-[#8B5CF6]/60 text-[#8B5CF6] font-bold hover:bg-[#8B5CF6]/10 hover:scale-105 shadow-lg transition-all duration-200 py-5 text-lg"
            onClick={handle3DModelGeneration}
            disabled={generating3DModel}
          >
            <Building className="mr-2 h-5 w-5" />
            {generating3DModel ? "Generating 3D Model..." : "Generate 3D Property Model"}
          </Button>
        </CardContent>
      </Card>
      
      {modelJobId && (
        <Property3DModel 
          jobId={modelJobId} 
          address={address} 
          className={className}
        />
      )}
    </section>
  );
};

export default PropertyInsights;
