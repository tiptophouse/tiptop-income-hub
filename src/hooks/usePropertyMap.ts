
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
    
    console.log("Capturing map image from container element");
    
    try {
      // Try to use html2canvas with more options for better capture
      const canvas = await html2canvas(mapContainerRef.current, {
        useCORS: true,
        allowTaint: true,
        logging: true,
        width: mapContainerRef.current.clientWidth,
        height: mapContainerRef.current.clientHeight,
        scale: 2 // Higher quality
      });
      
      const imageData = canvas.toDataURL('image/png', 0.95);
      console.log("Map image captured successfully, size:", imageData.length);
      return imageData;
    } catch (htmlCanvasError) {
      console.error("Error with html2canvas:", htmlCanvasError);
      
      // Fallback approach - try to use toBlob and convert to base64
      try {
        console.log("Trying fallback screenshot method");
        return new Promise((resolve, reject) => {
          const canvas = document.createElement('canvas');
          canvas.width = mapContainerRef.current!.clientWidth * 2;
          canvas.height = mapContainerRef.current!.clientHeight * 2;
          const ctx = canvas.getContext('2d');
          
          if (!ctx) {
            reject(new Error("Failed to get canvas context"));
            return;
          }
          
          // Draw a white background first
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
          // Draw the map element
          const htmlToImage = new Image();
          htmlToImage.src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="${canvas.width}" height="${canvas.height}"><foreignObject width="100%" height="100%"><div xmlns="http://www.w3.org/1999/xhtml">${mapContainerRef.current!.innerHTML}</div></foreignObject></svg>`;
          
          htmlToImage.onload = () => {
            ctx.drawImage(htmlToImage, 0, 0, canvas.width, canvas.height);
            const imageData = canvas.toDataURL('image/png', 0.95);
            resolve(imageData);
          };
          
          htmlToImage.onerror = (error) => {
            reject(new Error("Failed to create image from map container"));
          };
        });
      } catch (fallbackError) {
        console.error("Fallback screenshot method failed:", fallbackError);
        throw fallbackError;
      }
    }
  };

  const handleModelGeneration = async (
    mapContainerRef: React.RefObject<HTMLDivElement>,
    webhookUrl?: string
  ) => {
    if (is3DModelGenerating) {
      console.log("Model generation already in progress");
      return;
    }
    
    try {
      setIs3DModelGenerating(true);
      
      toast({
        title: "Processing",
        description: "Capturing property view...",
      });
      
      console.log("Starting 3D model generation for address:", address);
      
      // Get both Street View and satellite images
      const imageData = await captureStreetViewForModel(address);
      let primaryImage = imageData.streetView;
      
      console.log("Image capture results:", {
        streetView: imageData.streetView ? "✓" : "✗",
        satellite: imageData.satellite ? "✓" : "✗",
        aerial: imageData.aerialView ? "✓" : "✗"
      });
      
      // If Street View isn't available, try using the satellite image
      if (!primaryImage && imageData.satellite) {
        console.log("Using satellite image as primary image");
        primaryImage = imageData.satellite;
      }
      
      // If both failed, try to capture the map view as a last resort
      if (!primaryImage && mapContainerRef.current) {
        console.log("Falling back to map screenshot");
        try {
          primaryImage = await captureMapImage(mapContainerRef);
          console.log("Successfully captured map image:", primaryImage ? "✓" : "✗");
        } catch (mapCaptureError) {
          console.error("Error capturing map image:", mapCaptureError);
        }
      }
      
      // If we still don't have an image, try aerial view
      if (!primaryImage && imageData.aerialView) {
        console.log("Using aerial view as last resort");
        primaryImage = imageData.aerialView;
      }

      if (!primaryImage) {
        throw new Error("Failed to capture any property image");
      }
      
      console.log("Image for 3D model captured successfully, size:", primaryImage.length);

      try {
        console.log("Sending image to Meshy API");
        const jobId = await generateModelFromImage(primaryImage);
        console.log("3D model generation job created:", jobId);
        
        const modelEvent = new CustomEvent('modelJobCreated', {
          detail: { 
            jobId,
            hasSatelliteImage: !!imageData.satellite
          }
        });
        document.dispatchEvent(modelEvent);
        
        toast({
          title: "Success",
          description: "3D model generation started! It may take a few minutes to complete.",
        });
      } catch (error) {
        console.error("Error calling Meshy API:", error);
        
        // Create and dispatch a custom error event
        const errorEvent = new CustomEvent('modelGenerationError', {
          detail: { error: error instanceof Error ? error.message : "Unknown API error" }
        });
        document.dispatchEvent(errorEvent);
        
        const demoJobId = "demo-3d-model-" + Math.random().toString(36).substring(2, 8);
        
        const modelEvent = new CustomEvent('modelJobCreated', {
          detail: { 
            jobId: demoJobId,
            hasSatelliteImage: !!imageData.satellite 
          }
        });
        document.dispatchEvent(modelEvent);
        
        toast({
          title: "Using Demo Model",
          description: "We encountered an issue with the 3D model API. Showing a demo model instead.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error in 3D model generation process:", error);
      
      // Create and dispatch a custom error event
      const errorEvent = new CustomEvent('modelGenerationError', {
        detail: { error: error instanceof Error ? error.message : "Unknown error" }
      });
      document.dispatchEvent(errorEvent);
      
      toast({
        title: "Error",
        description: "Failed to generate 3D model. Using demo model instead.",
        variant: "destructive"
      });
      
      const fallbackId = "demo-3d-model-" + Math.random().toString(36).substring(2, 8);
      const modelEvent = new CustomEvent('modelJobCreated', {
        detail: { 
          jobId: fallbackId,
          hasSatelliteImage: false 
        }
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
