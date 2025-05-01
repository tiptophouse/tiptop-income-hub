
import { getStreetViewImageUrl, getStreetViewImageAsBase64 } from './streetViewService';
import { getSatelliteImageUrl, getSatelliteImageAsBase64 } from './satelliteViewService';
import { getAerialImageZoom12Url, getAerialImageZoom12AsBase64 } from './aerialViewService';
import { blobToBase64, captureMapScreenshot } from './imageUtils';

/**
 * Captures Street View and satellite images for a given address
 * 
 * @param address Address to capture images for
 * @returns Object with street view, satellite, and aerial images
 */
export const captureStreetViewForModel = async (address: string): Promise<{ 
  streetView: string | null;
  satellite: string | null;
  aerialView: string | null;
}> => {
  // Get all images in parallel
  const [streetViewImage, satelliteImage, aerialImage] = await Promise.all([
    getStreetViewImageAsBase64(address).catch(err => {
      console.error("Error capturing Street View:", err);
      return null;
    }),
    getSatelliteImageAsBase64(address).catch(err => {
      console.error("Error capturing Satellite View:", err);
      return null;
    }),
    getAerialImageZoom12AsBase64(address).catch(err => {
      console.error("Error capturing Aerial View at zoom 12:", err);
      return null;
    })
  ]);
  
  return {
    streetView: streetViewImage,
    satellite: satelliteImage,
    aerialView: aerialImage
  };
};

// Re-export all functions
export {
  getStreetViewImageUrl,
  getStreetViewImageAsBase64,
  getSatelliteImageUrl,
  getSatelliteImageAsBase64,
  getAerialImageZoom12Url,
  getAerialImageZoom12AsBase64,
  blobToBase64,
  captureMapScreenshot
};
