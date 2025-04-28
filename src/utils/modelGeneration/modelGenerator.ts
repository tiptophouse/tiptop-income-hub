
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { generateModelFromImage, analyzePropertyImage } from '../meshyApi';
import { storePropertyData, storePropertyFeatures, storeModelJobId } from './propertyStorage';
import { capturePropertyImages, captureMapAsBackup } from './imageProcessor';
import { notifyModelJobCreated, createFallbackModelId } from './eventNotifier';

/**
 * Main function to generate 3D models of a property
 * @param address - The property address
 * @returns The model job ID or null if generation failed
 */
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

    // Capture property images
    const { streetViewImage, satelliteImage, aerialView, hasSatelliteImage } = 
      await capturePropertyImages(address, user);
    
    // If no street view or satellite image, try to capture map screenshot
    let primaryImage = streetViewImage || satelliteImage;
    if (!primaryImage) {
      primaryImage = await captureMapAsBackup();
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
      await storePropertyFeatures(propertyFeatures);
    }
    
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
      await storeModelJobId(modelJobId, hasSatelliteImage, propertyFeatures);
      
      // Dispatch event for the dashboard to pick up
      notifyModelJobCreated(modelJobId, hasSatelliteImage, propertyFeatures);

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
    return createFallbackModelId();
  }
};
