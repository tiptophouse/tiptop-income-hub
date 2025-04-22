
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { getPropertyInsights } from '@/utils/openai';
import { Building, TrendingUp, Home, AlertCircle, Building3 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from '@/components/ui/use-toast';
import Property3DModel from './Property3DModel';
import { generateModelFromImage } from '@/utils/meshyApi';
import html2canvas from 'html2canvas';

interface PropertyInsightsProps {
  address: string;
  className?: string;
}

const PropertyInsights: React.FC<PropertyInsightsProps> = ({ address, className }) => {
  const [insights, setInsights] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retrying, setRetrying] = useState(false);
  const [generating3DModel, setGenerating3DModel] = useState(false);
  const [modelJobId, setModelJobId] = useState<string | null>(null);

  const fetchInsights = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPropertyInsights(address);
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
    // Find a map or property view element to capture
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
      
      // Capture property view
      const imageData = await capturePropertyView();
      
      // In a real app, this would call the actual API
      // For demo purposes, we'll simulate success with a random ID
      const demoJobId = "model-" + Math.random().toString(36).substring(2, 10);
      setModelJobId(demoJobId);
      
      /* Real implementation would be:
      const jobId = await generateModelFromImage(imageData);
      setModelJobId(jobId);
      */
      
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
      
      // For demo purposes, we'll still set a fallback ID
      setModelJobId("demo-model-" + Math.random().toString(36).substring(2, 8));
    } finally {
      setGenerating3DModel(false);
    }
  };

  if (!address) return null;

  return (
    <div className="space-y-4">
      <Card className={`${className} shadow-md hover:shadow-lg transition-shadow duration-300`}>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5 text-tiptop-accent" />
            Property Insights
          </CardTitle>
          <CardDescription>AI-generated analysis for {address}</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-[80%]" />
              <Skeleton className="h-4 w-[70%]" />
              <Skeleton className="h-4 w-full" />
            </div>
          ) : error ? (
            <div className="space-y-4">
              <Alert variant="destructive" className="bg-red-100 border-red-400">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  {error}
                </AlertDescription>
              </Alert>
              <button 
                onClick={handleRetry}
                disabled={retrying}
                className="text-tiptop-accent hover:underline flex items-center gap-1 text-sm"
              >
                {retrying ? "Retrying..." : "Try Again"}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-sm whitespace-pre-line">{insights}</div>
              
              <Button 
                variant="outline" 
                className="w-full mt-4 border-tiptop-accent text-tiptop-accent hover:bg-tiptop-accent/10" 
                onClick={handle3DModelGeneration}
                disabled={generating3DModel}
              >
                <Building3 className="mr-2 h-4 w-4" />
                {generating3DModel ? "Generating 3D Model..." : "Generate 3D Property Model"}
              </Button>
              
              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-4 pt-2 border-t">
                <TrendingUp className="h-3 w-3" />
                <span>Analysis powered by AI</span>
              </div>
            </div>
          )}
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
