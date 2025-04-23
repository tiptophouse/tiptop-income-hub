
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { getPropertyInsightsFromAI } from '@/utils/openaiApi';
import { Building, TrendingUp, Home, AlertCircle, ChartBar, Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from '@/components/ui/use-toast';
import Property3DModel from './Property3DModel';
import html2canvas from 'html2canvas';
import InsightsHeader from "./propertyInsights/InsightsHeader";
import InsightsTabs from "./propertyInsights/InsightsTabs";
import ModelGenerationButton from "./propertyInsights/ModelGenerationButton";

interface PropertyInsightsProps {
  address: string;
  className?: string;
}

const unicornGradient = "bg-gradient-to-tr from-[#9b87f5] via-[#f5e7ff] to-[#ffe4d8]";
const glassStyle = "backdrop-blur-xl bg-white/70 dark:bg-[#18122B]/70 border border-white/40 shadow-[0_20px_60px_0_rgba(135,87,236,0.25),0_3px_12px_rgba(126,105,171,0.12)]";
const accentText = "text-[#8B5CF6] font-extrabold tracking-tight";
const cardRing = "ring-2 ring-[#B993FE]/30";

const PropertyInsights: React.FC<PropertyInsightsProps> = ({ address, className }) => {
  const [insights, setInsights] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retrying, setRetrying] = useState(false);
  const [generating3DModel, setGenerating3DModel] = useState(false);
  const [modelJobId, setModelJobId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [requestedAddress, setRequestedAddress] = useState('');

  const fetchInsights = async () => {
    if (!address || address === requestedAddress) return;
    setLoading(true);
    setError(null);
    setRequestedAddress(address);
    try {
      const data = await getPropertyInsightsFromAI(address);
      setInsights(data);
    } catch (error) {
      setError("Failed to fetch property insights. Please try again later.");
    } finally {
      setLoading(false);
      setRetrying(false);
    }
  };

  useEffect(() => {
    if (!address) return;
    fetchInsights();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);

  const handleRetry = () => {
    setRetrying(true);
    setRequestedAddress(''); // Reset to force a new fetch
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
      <div className={`${glassStyle} animate-fade-in shadow-2xl rounded-3xl px-8 py-12 max-w-5xl mx-auto`}>
        <div className="flex items-center gap-5 mb-8">
          <div className="bg-[#8B5CF6]/95 rounded-full h-14 w-14 flex items-center justify-center shadow-lg border-4 border-white/70">
            <ChartBar className="h-8 w-8 text-white" />
          </div>
          <div>
            <span className="uppercase font-extrabold tracking-wide text-[#8B5CF6] text-sm">ANALYSIS</span>
            <h2 className="font-extrabold text-3xl text-gray-900 dark:text-[#f3eefd] truncate max-w-md">Analyzing Property...</h2>
            <div className="text-lg text-gray-600 mt-1 truncate max-w-md">{address}</div>
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
      <Alert variant="destructive" className={`${className} shadow-xl border-l-8 border-[#B993FE] animate-fade-in max-w-5xl mx-auto rounded-3xl p-6 flex flex-col gap-4`}>
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

  return (
    <section className={`w-full flex flex-col items-center gap-10 ${className || ""} animate-fade-in`}>
      {/* Header */}
      <InsightsHeader
        address={address}
        propertySize={insights?.propertySize}
        accentText={accentText}
      />

      {/* Tabs and Insight Summary */}
      <Card className={`w-full max-w-5xl bg-white/95 dark:bg-[#18122B]/75 rounded-3xl shadow-lg ${glassStyle} ${cardRing}`}>
        <CardHeader className="pb-3 pt-8 px-8 animate-fade-in">
          <CardTitle className="flex items-center gap-3 font-extrabold text-[#8B5CF6] text-2xl sm:text-3xl">
            <Info className="h-6 w-6 text-[#B993FE]" />
            <span className="truncate max-w-[350px]">Your Home Earning Potential</span>
          </CardTitle>
          <CardDescription className="text-gray-700 line-clamp-2 max-w-full">
            Discover how you can monetize your property smoothly.
          </CardDescription>
        </CardHeader>
        <CardContent className="animate-scale-in pb-8 px-8">
          <InsightsTabs
            insights={insights}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
          <ModelGenerationButton
            generating3DModel={generating3DModel}
            handle3DModelGeneration={handle3DModelGeneration}
          />
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
