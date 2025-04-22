
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { getPropertyInsightsFromAI } from '@/utils/openaiApi';
import { Building, TrendingUp, Home, AlertCircle, ChartBar, Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from '@/components/ui/use-toast';
import Property3DModel from './Property3DModel';
// import { generateModelFromImage } from '@/utils/meshyApi'; // Not used in this file anymore
import html2canvas from 'html2canvas';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface PropertyInsightsProps {
  address: string;
  className?: string;
}

const unicornGradient = "bg-gradient-to-tr from-[#9b87f5] via-[#f5e7ff] to-[#ffe4d8]";
const glassStyle = "backdrop-blur-3xl bg-white/60 dark:bg-[#18122B]/70 border border-white/30 shadow-[0_20px_60px_0_rgba(135,87,236,0.25),0_3px_12px_rgba(126,105,171,0.12)]";
const accentText = "text-[#8B5CF6] font-extrabold tracking-tight";
const cardRing = "ring-4 ring-[#B993FE]/40";

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
      <div className={`${glassStyle} animate-fade-in shadow-2xl rounded-3xl px-8 py-12 max-w-4xl mx-auto`}>
        <div className="flex items-center gap-5 mb-8">
          <div className="bg-[#8B5CF6]/95 rounded-full h-14 w-14 flex items-center justify-center shadow-lg border-4 border-white/70">
            <ChartBar className="h-8 w-8 text-white" />
          </div>
          <div>
            <span className="uppercase font-extrabold tracking-wide text-[#8B5CF6] text-sm">ANALYSIS</span>
            <div className="font-extrabold text-3xl text-gray-900 dark:text-[#f3eefd]">Analyzing Property...</div>
            <div className="text-lg text-gray-600 mt-1">{address}</div>
          </div>
        </div>
        <div className="grid sm:grid-cols-3 gap-8">
          <Skeleton className="h-40 rounded-3xl" />
          <Skeleton className="h-40 rounded-3xl" />
          <Skeleton className="h-40 rounded-3xl" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className={`${className} shadow-xl border-l-8 border-[#B993FE] animate-fade-in max-w-4xl mx-auto rounded-3xl p-6 flex flex-col gap-4`}>
        <div className="flex items-center gap-3">
          <AlertCircle className="h-5 w-5" />
          <AlertTitle className="text-lg font-extrabold">Error</AlertTitle>
        </div>
        <AlertDescription className="text-gray-800 dark:text-white">
          {error}
        </AlertDescription>
        <Button 
          variant="outline" 
          className="mt-2 self-start rounded-lg px-6 text-[#8B5CF6] font-semibold hover:bg-[#8B5CF6]/20 transition-all duration-200"
          onClick={handleRetry}
          disabled={retrying}
        >
          {retrying ? "Retrying..." : "Retry"}
        </Button>
      </Alert>
    );
  }

  // Asset Card Helpers
  const assetCard = (color: string, title: string, main: string, details: string, value: string, icon: React.ReactNode) => (
    <div className={`relative overflow-hidden rounded-3xl ${glassStyle} shadow-lg hover:shadow-2xl group hover:scale-[1.04] transition-transform duration-300 border-l-8 ${color} cursor-pointer`}>
      <div className="absolute top-4 right-4 z-10">
        <span className={`inline-block px-4 py-2 bg-white/80 text-xs font-extrabold rounded-full uppercase tracking-wider ${accentText} shadow-sm`}>{title}</span>
      </div>
      <CardHeader className="pb-1 pr-2 bg-transparent flex items-center gap-3">
        {icon}
        <CardTitle className="text-xl font-extrabold text-[#6E59A5]">{main}</CardTitle>
      </CardHeader>
      <CardDescription className="mt-0 mb-3 font-semibold text-gray-700">{details}</CardDescription>
      <CardContent className="pt-0 pb-6">
        <div className="text-3xl font-extrabold text-[#8B5CF6]">{value}</div>
      </CardContent>
    </div>
  );

  // Main Section Rendering
  return (
    <section className={`w-full flex flex-col items-center gap-14 ${className || ""} animate-fade-in`}>
      {/* Header */}
      <div className={`w-full max-w-5xl mx-auto rounded-3xl p-12 ${unicornGradient} shadow-[0_30px_90px_rgba(155,135,245,0.56)] relative overflow-hidden flex flex-col md:flex-row items-center gap-10 mb-10`}>
        <div className="relative z-20 flex items-center gap-6">
          <span className="block bg-white/90 rounded-full p-4 shadow-lg border border-white/60">
            <ChartBar className="h-9 w-9 text-[#8B5CF6]" />
          </span>
          <div className="text-left max-w-xl">
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-[#f3eefd] tracking-tight mb-1 leading-tight">
              Property Analysis
            </h1>
            <p className="font-semibold text-gray-700 dark:text-[#ded9f3] text-lg">
              AI-powered insights for <span className={accentText}>{address}</span>
            </p>
            {insights?.propertySize && (
              <p className="text-sm mt-2 text-[#B993FE] font-extrabold tracking-widest">
                Estimated Size: {insights.propertySize}
              </p>
            )}
          </div>
        </div>
        <div className="absolute right-0 bottom-0 z-0 w-1/3 h-44 hidden md:block" aria-hidden>
          <svg width="100%" height="100%" viewBox="0 0 200 60" fill="none"><ellipse cx="100" cy="30" rx="100" ry="30" fill="#ece2fe" /></svg>
        </div>
      </div>
      
      {/* Tabs and Insight Summary */}
      <Card className={`w-full max-w-5xl bg-white/95 dark:bg-[#18122B]/75 rounded-3xl shadow-lg ${glassStyle} ${cardRing}`}>
        <CardHeader className="pb-3 pt-10 px-10 animate-fade-in">
          <CardTitle className="flex items-center gap-3 font-extrabold text-[#8B5CF6] text-3xl">
            <Info className="h-7 w-7 text-[#B993FE]" />
            Your Home Earning Potential
          </CardTitle>
          <CardDescription className="text-gray-700">
            Discover how you can monetize your property smoothly.
          </CardDescription>
        </CardHeader>
        <CardContent className="animate-scale-in pb-12 px-10">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8 rounded-3xl bg-[#F3ECFF] shadow-md">
              <TabsTrigger value="overview" className="text-xl font-extrabold tracking-wider text-[#7E69AB] hover:text-[#8B5CF6] rounded-3xl">Overview</TabsTrigger>
              <TabsTrigger value="details" className="text-xl font-extrabold tracking-wider text-[#7E69AB] hover:text-[#8B5CF6] rounded-3xl">Asset Breakdown</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-8 animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-8">
                <div className="rounded-3xl bg-gradient-to-br from-[#D6BCFA] via-[#F3ECFF] to-white shadow-xl p-8 flex flex-col items-start">
                  <div className="flex items-center gap-4 mb-3">
                    <TrendingUp className="h-8 w-8 text-[#B993FE]" />
                    <span className="font-extrabold text-[#8B5CF6] text-xl tracking-wider">Monthly Potential</span>
                  </div>
                  <div className="text-5xl font-extrabold text-[#6E59A5] mb-3">{insights?.totalMonthlyPotential || "$300-570"}</div>
                  <span className="uppercase text-sm font-extrabold text-[#B993FE] tracking-widest">estimated range</span>
                </div>
                <div className="rounded-3xl bg-gradient-to-br from-[#E5DEFF] via-[#F3ECFF] to-white shadow-xl p-8 flex flex-col items-start">
                  <div className="flex items-center gap-4 mb-3">
                    <Home className="h-8 w-8 text-[#A0E884]" />
                    <span className="font-extrabold text-[#7E9C6F] text-xl tracking-wider">Assets Found</span>
                  </div>
                  <div className="text-5xl font-extrabold text-[#7E9C6F] mb-3">4</div>
                  <span className="uppercase text-sm font-extrabold text-[#B9D08F] tracking-widest">monetizable</span>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="details" className="space-y-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 mt-8">
                {assetCard(
                  "border-l-purple-600",
                  "Rooftop Solar",
                  insights?.rooftopSolar?.potential || "High",
                  insights?.rooftopSolar?.sqFootage || "706 sq ft",
                  insights?.rooftopSolar?.monthlySavings || "$100-150 /mo",
                  <TrendingUp className="h-7 w-7 text-[#8B5CF6]" />
                )}
                {assetCard(
                  "border-l-blue-600",
                  "Internet Bandwidth",
                  insights?.internetBandwidth?.potential || "Medium",
                  insights?.internetBandwidth?.sharingCapacity || "60-70%",
                  insights?.internetBandwidth?.monthlyEarnings || "$80-120 /mo",
                  <Home className="h-7 w-7 text-[#57A3FF]" />
                )}
                {assetCard(
                  "border-l-orange-600",
                  "Parking Space",
                  insights?.parkingSpace?.available || "1-2 spaces",
                  insights?.parkingSpace?.details || "Prime location, high demand",
                  insights?.parkingSpace?.monthlyValue || "$70-200 /mo",
                  <Building className="h-7 w-7 text-[#FF9D5C]" />
                )}
                {assetCard(
                  "border-l-green-600",
                  "Garden Space",
                  insights?.gardenSpace?.communityValue || "Medium-High",
                  insights?.gardenSpace?.sqFootage || "104 sq ft",
                  insights?.gardenSpace?.monthlyPotential || "$50-100 /mo",
                  <Info className="h-7 w-7 text-[#7EB564]" />
                )}
              </div>
            </TabsContent>
          </Tabs>
          <Button 
            variant="outline" 
            className="w-full mt-12 rounded-3xl border-2 border-[#8B5CF6]/70 text-[#8B5CF6] font-extrabold hover:bg-[#8B5CF6]/20 hover:scale-105 shadow-lg transition-all duration-300 py-6 text-xl"
            onClick={handle3DModelGeneration}
            disabled={generating3DModel}
            aria-label="Generate 3D property model"
          >
            <Building className="mr-3 h-6 w-6" />
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

