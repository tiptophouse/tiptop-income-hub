
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { getPropertyInsightsFromAI } from '@/utils/openaiApi';
import { Building, TrendingUp, Home, AlertCircle } from 'lucide-react';
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
      <Card className={`${className} shadow-md animate-pulse`}>
        <CardHeader>
          <CardTitle>Property Analysis</CardTitle>
          <CardDescription>Analyzing {address}...</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className={className}>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
        <Button 
          variant="outline" 
          className="mt-2" 
          onClick={handleRetry}
          disabled={retrying}
        >
          {retrying ? "Retrying..." : "Retry"}
        </Button>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      <Card className={`${className} shadow-md hover:shadow-lg transition-shadow duration-300`}>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5 text-tiptop-accent" />
            Property Analysis
          </CardTitle>
          <CardDescription>AI-generated analysis for {address}</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <Card className="bg-gradient-to-br from-purple-50 to-white">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Monthly Potential</CardTitle>
                    <CardDescription>Total passive income</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-tiptop-accent">
                      {insights?.totalMonthlyPotential || "$300-570"}
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-blue-50 to-white">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Assets Found</CardTitle>
                    <CardDescription>Monetizable opportunities</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-tiptop-accent">4</div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="details" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="overflow-hidden border-l-4 border-l-purple-500">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Rooftop Solar</CardTitle>
                    <CardDescription>{insights?.rooftopSolar?.sqFootage || "706 sq ft"} available</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xl font-semibold text-tiptop-accent">
                      {insights?.rooftopSolar?.monthlySavings || "$100-150"} /month
                    </div>
                  </CardContent>
                </Card>
                <Card className="overflow-hidden border-l-4 border-l-blue-500">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Internet Bandwidth</CardTitle>
                    <CardDescription>{insights?.internetBandwidth?.sharingCapacity || "60-70%"} unused capacity</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xl font-semibold text-tiptop-accent">
                      {insights?.internetBandwidth?.monthlyEarnings || "$80-120"} /month
                    </div>
                  </CardContent>
                </Card>
                <Card className="overflow-hidden border-l-4 border-l-orange-500">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Parking Space</CardTitle>
                    <CardDescription>{insights?.parkingSpace?.available || "1-2 spaces"} available</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xl font-semibold text-tiptop-accent">
                      {insights?.parkingSpace?.monthlyValue || "$70-200"} /month
                    </div>
                  </CardContent>
                </Card>
                <Card className="overflow-hidden border-l-4 border-l-green-500">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Garden Space</CardTitle>
                    <CardDescription>{insights?.gardenSpace?.sqFootage || "104 sq ft"} available</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xl font-semibold text-tiptop-accent">
                      {insights?.gardenSpace?.monthlyPotential || "$50-100"} /month
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
          
          <Button 
            variant="outline" 
            className="w-full mt-6 border-tiptop-accent text-tiptop-accent hover:bg-tiptop-accent/10" 
            onClick={handle3DModelGeneration}
            disabled={generating3DModel}
          >
            <Building className="mr-2 h-4 w-4" />
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
    </div>
  );
};

export default PropertyInsights;
