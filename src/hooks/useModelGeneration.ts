
import { useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import { generateModelFromImage } from '@/utils/api/modelGeneration';
import { captureStreetViewForModel } from '@/utils/streetView';
import html2canvas from 'html2canvas';
import { supabase } from '@/integrations/supabase/client';
import { canMakeModelApiCall } from '@/utils/api/meshyConfig';

export const useModelGeneration = () => {
  const [is3DModelGenerating, setIs3DModelGenerating] = useState(false);

  const captureMapImage = async (mapContainerRef: React.RefObject<HTMLDivElement>): Promise<string> => {
    if (!mapContainerRef?.current) {
      throw new Error("Map container not found");
    }
    const canvas = await html2canvas(mapContainerRef.current);
    const imageData = canvas.toDataURL('image/png');
    console.log("Map image captured successfully");
    return imageData;
  };

  const handleModelGeneration = async (
    mapContainerRef: React.RefObject<HTMLDivElement> | null,
    address?: string,
    webhookUrl?: string
  ) => {
    if (is3DModelGenerating) return;
    
    try {
      setIs3DModelGenerating(true);
      
      toast({
        title: "Processing",
        description: "Preparing to generate 3D model...",
      });
      
      if (!address) {
        throw new Error("Address is required for model generation");
      }
      
      // Check if we should proceed with actual API call or use demo model
      const shouldUseRealApi = canMakeModelApiCall();
      
      toast({
        title: "Processing",
        description: shouldUseRealApi ? 
          "Capturing property images for 3D model generation..." : 
          "Using demo mode for 3D model generation.",
      });
      
      // Get both Street View and satellite images
      const imageData = await captureStreetViewForModel(address);
      let primaryImage = imageData.streetView;
      
      // If Street View isn't available, try using the satellite image
      if (!primaryImage && imageData.satellite) {
        primaryImage = imageData.satellite;
      }
      
      // If both failed and map container ref exists, try to capture the map view as a last resort
      if (!primaryImage && mapContainerRef?.current) {
        console.log("Falling back to map screenshot");
        primaryImage = await captureMapImage(mapContainerRef);
      }

      if (!primaryImage) {
        throw new Error("Failed to capture property image");
      }

      console.log("Captured primary image for 3D model generation");
      
      // Save the image data to user metadata for future use
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const metadata = user.user_metadata || {};
          await supabase.auth.updateUser({
            data: { 
              ...metadata,
              propertySatelliteImage: imageData.satellite ? true : false,
              propertyStreetView: imageData.streetView ? true : false,
              propertyAddress: address
            }
          });
        }
      } catch (metadataError) {
        console.error("Error updating user metadata with image info:", metadataError);
      }

      try {
        toast({
          title: "Processing",
          description: "Generating 3D model with Meshy API...",
        });
        
        // Generate 3D model using the Meshy API
        const jobId = await generateModelFromImage(primaryImage);
        console.log("3D model generation job created:", jobId);
        
        // Dispatch event to notify components about the new model job
        const modelEvent = new CustomEvent('modelJobCreated', {
          detail: { 
            jobId,
            hasSatelliteImage: !!imageData.satellite,
            hasAerialImage: !!imageData.aerialView
          }
        });
        document.dispatchEvent(modelEvent);
        
        const isDemoModel = localStorage.getItem('meshy_demo_model') === 'true';
        
        toast({
          title: isDemoModel ? "Demo Mode" : "Success",
          description: isDemoModel
            ? "Using a demo 3D model. To use the actual Meshy API, ensure API access is enabled."
            : "3D model generation started! It may take a few minutes to complete.",
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
            hasSatelliteImage: !!imageData.satellite,
            hasAerialImage: !!imageData.aerialView,
            demo: true 
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
        title: "Using Demo Model",
        description: "Using a demo 3D model due to an error during processing.",
        variant: "default"
      });
      
      const fallbackId = "demo-3d-model-" + Math.random().toString(36).substring(2, 8);
      const modelEvent = new CustomEvent('modelJobCreated', {
        detail: { 
          jobId: fallbackId,
          hasSatelliteImage: false,
          hasAerialImage: false,
          demo: true
        }
      });
      document.dispatchEvent(modelEvent);
    } finally {
      setIs3DModelGenerating(false);
    }
  };

  return {
    is3DModelGenerating,
    handleModelGeneration,
  };
};
