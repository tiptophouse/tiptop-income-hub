
import { supabase } from '@/integrations/supabase/client';
import { captureStreetViewForModel, captureMapScreenshot } from './streetViewService';
import { generateModelFromImage } from './meshyApi';
import { toast } from '@/components/ui/use-toast';

export const storePropertyData = async (address: string, imageData: {streetView: string | null, satellite: string | null}) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      // Store the address and image data in user metadata
      const { error: updateError } = await supabase.auth.updateUser({
        data: { 
          propertyAddress: address,
          propertyStreetViewImage: imageData.streetView,
          propertySatelliteImage: imageData.satellite
        }
      });

      if (updateError) {
        console.error("Error storing property data:", updateError);
        throw updateError;
      }
    }
  } catch (error) {
    console.error("Error in storePropertyData:", error);
    throw error;
  }
};

export const generatePropertyModels = async (address: string) => {
  try {
    console.log("Starting property model generation for address:", address);
    
    toast({
      title: "Property Analysis",
      description: "Capturing property views for 3D model generation...",
    });

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error("User not authenticated");
    }

    // Capture both street view and satellite images
    const capturedImages = await captureStreetViewForModel(address);
    let streetViewImage = capturedImages.streetView;
    let satelliteImage = capturedImages.satellite;
    const hasSatelliteImage = !!satelliteImage;
    
    // If no street view is available, try to use stored images
    if (!streetViewImage) {
      streetViewImage = user.user_metadata.propertyStreetViewImage;
    }
    
    if (!satelliteImage) {
      satelliteImage = user.user_metadata.propertySatelliteImage;
    }
    
    // If still no images available, try to capture map screenshot
    if (!streetViewImage && !satelliteImage) {
      console.log("No property views available, looking for map container to capture");
      const mapElement = document.querySelector('[id^="map-"], [class*="map-container"]') ||
        document.querySelector('[class*="property-map"]');
      
      if (mapElement) {
        console.log("Found map element, capturing screenshot");
        const mapImage = await captureMapScreenshot({ current: mapElement as HTMLElement });
        if (mapImage) {
          // Use map image as fallback
          streetViewImage = mapImage;
        }
      }
    }
    
    // Store the captured images
    await storePropertyData(address, {
      streetView: streetViewImage,
      satellite: satelliteImage
    });
    
    // Determine which image to use for model generation
    // Prefer street view for facade, satellite for rooftop
    const primaryImage = streetViewImage || satelliteImage;
    
    if (!primaryImage) {
      console.error("Failed to capture any property image");
      throw new Error("Failed to capture property image");
    }

    console.log(`Successfully captured/retrieved property images`);

    // Generate 3D model using Meshy
    console.log("Calling Meshy API to generate 3D model...");
    try {
      // Generate the primary model (street view/facade)
      const modelJobId = await generateModelFromImage(primaryImage);
      console.log("Started 3D model generation with job ID:", modelJobId);
      
      // Store model ID in user metadata
      const { error: updateError } = await supabase.auth.updateUser({
        data: { 
          propertyModelJobId: modelJobId,
          hasSatelliteImage: hasSatelliteImage
        }
      });

      if (updateError) {
        console.error("Error updating user metadata:", updateError);
      } else {
        console.log("Successfully updated user metadata");
      }

      // Dispatch event for the dashboard to pick up
      console.log("Dispatching modelJobCreated event with satellite flag:", hasSatelliteImage);
      const modelEvent = new CustomEvent('modelJobCreated', {
        detail: { 
          jobId: modelJobId,
          hasSatelliteImage: hasSatelliteImage
        }
      });
      document.dispatchEvent(modelEvent);

      return modelJobId;
    } catch (meshyError) {
      console.error("Error in Meshy API call:", meshyError);
      throw meshyError;
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
      detail: { 
        jobId: fallbackId,
        hasSatelliteImage: false
      }
    });
    document.dispatchEvent(modelEvent);
    return fallbackId;
  }
};
