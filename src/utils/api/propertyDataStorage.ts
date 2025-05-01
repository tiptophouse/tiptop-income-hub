
/**
 * Utility for storing property data
 */

export const storePropertyData = async (address: string, imageData: any) => {
  try {
    // Store the address and image data in localStorage for now
    // In a real app, this would store to Supabase or another database
    localStorage.setItem('property_address', address);
    
    if (imageData.streetView) {
      localStorage.setItem('property_street_view', imageData.streetView.substring(0, 100) + '...');
    }
    
    if (imageData.satellite) {
      localStorage.setItem('property_satellite', imageData.satellite.substring(0, 100) + '...');
    }
    
    return true;
  } catch (error) {
    console.error("Error storing property data:", error);
    return false;
  }
};
