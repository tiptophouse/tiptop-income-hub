
import { captureStreetViewForModel, captureMapScreenshot } from '../streetViewService';

/**
 * Capture and retrieve property images
 * @param address - The property address
 * @param user - Authenticated user object (optional)
 * @returns Object containing property images
 */
export const capturePropertyImages = async (address: string, user?: any) => {
  // Capture both street view and satellite images
  const capturedImages = await captureStreetViewForModel(address);
  let streetViewImage = capturedImages.streetView;
  let satelliteImage = capturedImages.satellite;
  let aerialView = capturedImages.aerialView;
  const hasSatelliteImage = !!satelliteImage;
  
  // If no street view is available, try to use stored images from user metadata
  if (!streetViewImage && user?.user_metadata) {
    streetViewImage = user.user_metadata.propertyStreetViewImage;
  }
  
  if (!satelliteImage && user?.user_metadata) {
    satelliteImage = user.user_metadata.propertySatelliteImage;
  }
  
  return {
    streetViewImage,
    satelliteImage,
    aerialView,
    hasSatelliteImage
  };
};

/**
 * Attempt to capture a map screenshot when other images aren't available
 * @returns The map screenshot as a data URL, or null if not available
 */
export const captureMapAsBackup = async () => {
  try {
    console.log("No property views available, looking for map container to capture");
    const mapElement = document.querySelector('[id^="map-"], [class*="map-container"]') ||
      document.querySelector('[class*="property-map"]');
    
    if (mapElement) {
      console.log("Found map element, capturing screenshot");
      const mapImage = await captureMapScreenshot({ current: mapElement as HTMLElement });
      return mapImage;
    }
  } catch (error) {
    console.error("Error capturing map screenshot:", error);
  }
  
  return null;
};
