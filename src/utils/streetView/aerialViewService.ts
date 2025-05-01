
import { getGoogleMapsApiKey } from '../api/meshyConfig';
import { blobToBase64 } from './imageUtils';

/**
 * Gets an aerial image URL at zoom level 12 for the specified address
 * 
 * @param address The address to get the aerial view for
 * @returns URL to the aerial image or null if not available
 */
export const getAerialImageZoom12Url = async (address: string): Promise<string | null> => {
  try {
    if (!window.google?.maps) {
      console.error("Google Maps API not loaded");
      return null;
    }

    // Get API key
    const apiKey = await getGoogleMapsApiKey();
    
    // First geocode the address
    const geocoder = new window.google.maps.Geocoder();
    
    return new Promise((resolve, reject) => {
      geocoder.geocode({ address }, async (results, status) => {
        if (status !== "OK" || !results || !results[0]) {
          console.error("Geocoding failed:", status);
          resolve(null);
          return;
        }

        const location = results[0].geometry.location;
        const lat = location.lat();
        const lng = location.lng();

        // Return aerial image URL at zoom level 12
        const imageUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=12&size=600x400&maptype=satellite&key=${apiKey}`;
        resolve(imageUrl);
      });
    });
  } catch (error) {
    console.error("Error getting aerial image URL:", error);
    return null;
  }
};

/**
 * Gets a static aerial image at zoom level 12 for the specified address as base64
 * 
 * @param address The address to get the aerial view for
 * @returns Base64 encoded image or null if not available
 */
export const getAerialImageZoom12AsBase64 = async (address: string): Promise<string | null> => {
  try {
    const imageUrl = await getAerialImageZoom12Url(address);
    if (!imageUrl) return null;
    
    // Fetch the image and convert to base64
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const base64 = await blobToBase64(blob);
    return base64;
  } catch (error) {
    console.error("Error getting aerial image as base64:", error);
    return null;
  }
};
