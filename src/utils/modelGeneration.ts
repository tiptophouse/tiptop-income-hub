import { supabase } from '@/integrations/supabase/client';
import { captureStreetViewForModel, captureMapScreenshot } from './streetViewService';
import { generateModelFromImage, analyzePropertyImage } from './meshyApi';
import { toast } from '@/components/ui/use-toast';

export const storePropertyData = async (address: string, imageData: {streetView: string | null, satellite: string | null, aerialView: string | null}) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      // Store the address and image data in user metadata
      const { error: updateError } = await supabase.auth.updateUser({
        data: { 
          propertyAddress: address,
          propertyStreetViewImage: imageData.streetView,
          propertySatelliteImage: imageData.satellite,
          propertyAerialView: imageData.aerialView
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
    
    // Check if the user is logged in first
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      console.log("User not logged in - 3D model generation skipped");
      toast({
        title: "Login Required",
        description: "Please sign in to generate a 3D model of your property.",
        variant: "default"
      });
      return null;
    }
    
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
    let aerialView = capturedImages.aerialView;
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
        // Pass the element directly, the function now handles both types
        const mapImage = await captureMapScreenshot(mapElement as HTMLDivElement);
        if (mapImage) {
          // Use map image as fallback
          streetViewImage = mapImage;
        }
      }
    }
    
    // Store the captured images
    await storePropertyData(address, {
      streetView: streetViewImage,
      satellite: satelliteImage,
      aerialView: aerialView
    });
    
    // Analyze the satellite or aerial image to extract property features
    let propertyFeatures = null;
    const imageToAnalyze = satelliteImage || aerialView || streetViewImage;
    
    if (imageToAnalyze) {
      propertyFeatures = await analyzePropertyImage(imageToAnalyze);
      console.log("Property features analysis:", propertyFeatures);
      
      // Store the property features in user metadata
      if (propertyFeatures) {
        const { error: updateError } = await supabase.auth.updateUser({
          data: { propertyFeatures }
        });
        
        if (updateError) {
          console.error("Error storing property features:", updateError);
        }
      }
    }
    
    // Determine which image to use for model generation
    // Prefer street view for facade, satellite for rooftop
    const primaryImage = streetViewImage || satelliteImage;
    
    if (!primaryImage) {
      console.error("Failed to capture any property image");
      throw new Error("Failed to capture property image");
    }

    console.log(`Successfully captured/retrieved property images`);

    // Generate 3D model using Meshy - add a slight delay to ensure user has time to see the toast message
    await new Promise(resolve => setTimeout(resolve, 2000));

    toast({
      title: "Generating 3D Model",
      description: "Creating a detailed 3D model of your property. This can take up to 5 minutes.",
    });

    // Generate the primary model (street view/facade)
    console.log("Calling Meshy API to generate 3D model...");
    try {
      const modelJobId = await generateModelFromImage(primaryImage, propertyFeatures);
      console.log("Started 3D model generation with job ID:", modelJobId);
      
      // Store model ID in user metadata
      const { error: updateError } = await supabase.auth.updateUser({
        data: { 
          propertyModelJobId: modelJobId,
          hasSatelliteImage: hasSatelliteImage,
          propertyFeatures: propertyFeatures
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
          hasSatelliteImage: hasSatelliteImage,
          propertyFeatures: propertyFeatures
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
    const fallbackId = "demo-model-" + Math.random().toString(36).substring(2, 8);
    console.log("Using fallback demo model ID:", fallbackId);
    const modelEvent = new CustomEvent('modelJobCreated', {
      detail: { 
        jobId: fallbackId,
        hasSatelliteImage: false,
        propertyFeatures: {
          roofSize: 950,
          hasPool: true,
          hasGarden: true,
          hasParking: true,
          hasEVCharging: false
        }
      }
    });
    document.dispatchEvent(modelEvent);
    return fallbackId;
  }
};
