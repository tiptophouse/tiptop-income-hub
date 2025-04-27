
import { supabase } from '@/integrations/supabase/client';
import { getStreetViewImageAsBase64, captureStreetViewForModel, captureMapScreenshot } from './streetViewService';
import { generateModelFromImage } from './meshyApi';
import { toast } from '@/components/ui/use-toast';

export const generatePropertyModels = async (address: string) => {
  try {
    console.log("Starting property model generation for address:", address);
    
    toast({
      title: "Property Analysis",
      description: "Capturing property views for 3D model generation...",
    });

    // Get street view image
    let imageData = await captureStreetViewForModel(address);
    
    // If no Street View image is available, try to find a map element to screenshot
    if (!imageData) {
      console.log("No Street View available, looking for map container to capture");
      
      // Find a map container
      const mapElement = document.querySelector('[id^="map-"], [class*="map-container"]') ||
        document.querySelector('[class*="property-map"]');
      
      if (mapElement) {
        console.log("Found map element, capturing screenshot");
        imageData = await captureMapScreenshot({ current: mapElement as HTMLElement });
      }
    }
    
    if (!imageData) {
      console.error("Failed to capture any property image");
      throw new Error("Failed to capture property image");
    }

    console.log(`Successfully captured property image: ${imageData.substring(0, 50)}... (${imageData.length} chars)`);

    // Generate 3D model using Meshy
    console.log("Calling Meshy API to generate 3D model...");
    try {
      const modelJobId = await generateModelFromImage(imageData);
      console.log("Started 3D model generation with job ID:", modelJobId);
      
      // Store model ID in user metadata
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        console.log("Updating user metadata with model job ID:", modelJobId);
        const { error: updateError } = await supabase.auth.updateUser({
          data: { 
            propertyModelJobId: modelJobId,
            propertyAddress: address
          }
        });

        if (updateError) {
          console.error("Error updating user metadata:", updateError);
        } else {
          console.log("Successfully updated user metadata");
        }
      }

      // Dispatch event for the dashboard to pick up
      console.log("Dispatching modelJobCreated event");
      const modelEvent = new CustomEvent('modelJobCreated', {
        detail: { jobId: modelJobId }
      });
      document.dispatchEvent(modelEvent);

      return modelJobId;
    } catch (meshyError) {
      console.error("Error in Meshy API call:", meshyError);
      throw meshyError; // Let the outer catch handle this
    }
  } catch (error) {
    console.error("Error in generatePropertyModels:", error);
    toast({
      title: "Error",
      description: "Failed to generate 3D model. Using demo model instead.",
      variant: "destructive"
    });

    // Return a demo model ID as fallback
    const fallbackId = "demo-3d-model-" + Math.random().toString(36).substring(2, 8);
    console.log("Using fallback demo model ID:", fallbackId);
    const modelEvent = new CustomEvent('modelJobCreated', {
      detail: { jobId: fallbackId }
    });
    document.dispatchEvent(modelEvent);
    return fallbackId;
  }
};
