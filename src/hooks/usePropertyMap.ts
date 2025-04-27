
import { useState, useRef, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import { generateModelFromImage } from '@/utils/meshyApi';
import { captureStreetViewForModel } from '@/utils/streetViewService';
import html2canvas from 'html2canvas';

export const usePropertyMap = (address: string) => {
  const [view, setView] = useState<'satellite' | 'map'>('satellite');
  const [is3DModelGenerating, setIs3DModelGenerating] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [weatherTemp] = useState<string>("26°");
  const [currentZoomLevel, setCurrentZoomLevel] = useState(12);
  const hasExecutedZoom = useRef(false);
  const screenshotCaptured = useRef(false);

  const captureMapImage = async (mapContainerRef: React.RefObject<HTMLDivElement>): Promise<string> => {
    if (!mapContainerRef.current) {
      throw new Error("Map container not found");
    }
    const canvas = await html2canvas(mapContainerRef.current);
    const imageData = canvas.toDataURL('image/png');
    console.log("Map image captured successfully");
    return imageData;
  };

  const handleModelGeneration = async (
    mapContainerRef: React.RefObject<HTMLDivElement>,
    webhookUrl?: string
  ) => {
    if (is3DModelGenerating) return;
    
    try {
      setIs3DModelGenerating(true);
      
      toast({
        title: "Processing",
        description: "Capturing property view...",
      });
      
      let imageData = await captureStreetViewForModel(address);
      
      if (!imageData && mapContainerRef.current) {
        console.log("Falling back to map screenshot");
        imageData = await captureMapImage(mapContainerRef);
      }

      if (!imageData) {
        throw new Error("Failed to capture property image");
      }

      try {
        const jobId = await generateModelFromImage(imageData);
        console.log("3D model generation job created:", jobId);
        
        const modelEvent = new CustomEvent('modelJobCreated', {
          detail: { jobId }
        });
        document.dispatchEvent(modelEvent);
        
        toast({
          title: "Success",
          description: "3D model generation started! It may take a few minutes to complete.",
        });
      } catch (error) {
        console.error("Error calling Meshy API:", error);
        
        const demoJobId = "demo-3d-model-" + Math.random().toString(36).substring(2, 8);
        
        const modelEvent = new CustomEvent('modelJobCreated', {
          detail: { jobId: demoJobId }
        });
        document.dispatchEvent(modelEvent);
        
        toast({
          title: "Using Demo Model",
          description: "We encountered an issue with the 3D model API. Showing a demo model instead.",
        });
      }
    } catch (error) {
      console.error("Error in 3D model generation process:", error);
      toast({
        title: "Error",
        description: "Failed to generate 3D model. Please try again later.",
        variant: "destructive"
      });
      
      const fallbackId = "demo-3d-model-" + Math.random().toString(36).substring(2, 8);
      const modelEvent = new CustomEvent('modelJobCreated', {
        detail: { jobId: fallbackId }
      });
      document.dispatchEvent(modelEvent);
    } finally {
      setIs3DModelGenerating(false);
    }
  };

  return {
    view,
    setView,
    is3DModelGenerating,
    isAnalyzing,
    setIsAnalyzing,
    weatherTemp,
    currentZoomLevel,
    setCurrentZoomLevel,
    hasExecutedZoom,
    screenshotCaptured,
    handleModelGeneration,
  };
};
