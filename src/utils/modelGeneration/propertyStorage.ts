
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

/**
 * Store property data in user metadata
 * @param address - The property address
 * @param imageData - Object containing various property images
 */
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

/**
 * Store property features in user metadata
 * @param propertyFeatures - The property features to store
 */
export const storePropertyFeatures = async (propertyFeatures: any) => {
  try {
    const { error: updateError } = await supabase.auth.updateUser({
      data: { propertyFeatures }
    });
    
    if (updateError) {
      console.error("Error storing property features:", updateError);
    }
    
    return !updateError;
  } catch (error) {
    console.error("Error storing property features:", error);
    return false;
  }
};

/**
 * Store model job ID in user metadata
 * @param modelJobId - The model job ID to store
 * @param hasSatelliteImage - Whether a satellite image is available
 * @param propertyFeatures - The property features
 */
export const storeModelJobId = async (
  modelJobId: string, 
  hasSatelliteImage: boolean, 
  propertyFeatures: any
) => {
  try {
    const { error: updateError } = await supabase.auth.updateUser({
      data: { 
        propertyModelJobId: modelJobId,
        hasSatelliteImage: hasSatelliteImage,
        propertyFeatures: propertyFeatures
      }
    });
    
    return !updateError;
  } catch (error) {
    console.error("Error storing model job ID:", error);
    return false;
  }
};
