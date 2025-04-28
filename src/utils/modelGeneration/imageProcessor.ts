
import { captureStreetViewForModel, captureMapScreenshot } from '../streetViewService';

/**
 * Capture and retrieve property images
 * @param address - The property address
 * @param user - Authenticated user object (optional)
 * @returns Object containing property images
 */
export const capturePropertyImages = async (address: string, user?: any) => {
  try {
    console.log("Starting property image capture for address:", address);
    
    // Capture both street view and satellite images with improved error handling
    const capturedImages = await captureStreetViewForModel(address);
    let streetViewImage = capturedImages.streetView;
    let satelliteImage = capturedImages.satellite;
    let aerialView = capturedImages.aerialView;
    const hasSatelliteImage = !!satelliteImage;
    
    console.log("Image capture results:", {
      streetView: streetViewImage ? "✓" : "✗", 
      satelliteImage: satelliteImage ? "✓" : "✗",
      aerialView: aerialView ? "✓" : "✗" 
    });
    
    // If no street view is available, try to use stored images from user metadata
    if (!streetViewImage && user?.user_metadata) {
      console.log("No street view available, checking user metadata");
      streetViewImage = user.user_metadata.propertyStreetViewImage;
      if (streetViewImage) {
        console.log("Retrieved street view from user metadata");
      }
    }
    
    if (!satelliteImage && user?.user_metadata) {
      console.log("No satellite image available, checking user metadata");
      satelliteImage = user.user_metadata.propertySatelliteImage;
      if (satelliteImage) {
        console.log("Retrieved satellite image from user metadata");
      }
    }
    
    // Log the image sizes for debugging
    if (streetViewImage) {
      console.log("Street view image size:", streetViewImage.length);
    }
    if (satelliteImage) {
      console.log("Satellite image size:", satelliteImage.length);
    }
    
    return {
      streetViewImage,
      satelliteImage,
      aerialView,
      hasSatelliteImage
    };
  } catch (error) {
    console.error("Error in capturePropertyImages:", error);
    return {
      streetViewImage: null,
      satelliteImage: null,
      aerialView: null,
      hasSatelliteImage: false
    };
  }
};

/**
 * Attempt to capture a map screenshot when other images aren't available
 * @param mapContainerRef - Reference to the map container element
 * @returns The map screenshot as a data URL, or null if not available
 */
export const captureMapAsBackup = async (mapContainerRef?: React.RefObject<HTMLDivElement>) => {
  try {
    console.log("No property views available, looking for map container to capture");
    
    if (mapContainerRef?.current) {
      console.log("Using provided map container for screenshot");
      const mapImage = await captureMapScreenshot({ current: mapContainerRef.current });
      if (mapImage) {
        console.log("Successfully captured map screenshot, size:", mapImage.length);
      }
      return mapImage;
    }
    
    const mapElement = document.querySelector('[id^="map-"], [class*="map-container"]') ||
      document.querySelector('[class*="property-map"]');
    
    if (mapElement) {
      console.log("Found map element, capturing screenshot");
      const mapImage = await captureMapScreenshot({ current: mapElement as HTMLElement });
      if (mapImage) {
        console.log("Successfully captured map screenshot, size:", mapImage.length);
      }
      return mapImage;
    } else {
      console.log("No map element found to capture");
    }
  } catch (error) {
    console.error("Error capturing map screenshot:", error);
  }
  
  return null;
};
