
import { getGoogleMapsApiKey } from '../api/meshyConfig';
import { blobToBase64 } from './imageUtils';

/**
 * Gets a Street View image URL for the specified address
 * 
 * @param address The address to get the Street View for
 * @returns URL to the Street View image or null if not available
 */
export const getStreetViewImageUrl = async (address: string): Promise<string | null> => {
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

        // Check if Street View is available
        const streetViewService = new window.google.maps.StreetViewService();
        
        try {
          const streetViewData = await new Promise((resolveStreetView, rejectStreetView) => {
            streetViewService.getPanorama({
              location: { lat, lng },
              radius: 50,
              source: window.google.maps.StreetViewSource.OUTDOOR
            }, (data, status) => {
              if (status === "OK" && data) {
                resolveStreetView(data);
              } else {
                rejectStreetView(new Error("Street View not available"));
              }
            });
          });

          // Street View is available, return the URL
          const imageUrl = `https://maps.googleapis.com/maps/api/streetview?size=600x400&location=${lat},${lng}&key=${apiKey}`;
          resolve(imageUrl);
        } catch (err) {
          console.log("Street View not available for this location");
          resolve(null);
        }
      });
    });
  } catch (error) {
    console.error("Error getting Street View image URL:", error);
    return null;
  }
};

/**
 * Gets a static Street View image for the specified address as base64
 * 
 * @param address The address to get the Street View for
 * @returns Base64 encoded image or null if not available
 */
export const getStreetViewImageAsBase64 = async (address: string): Promise<string | null> => {
  try {
    const imageUrl = await getStreetViewImageUrl(address);
    if (!imageUrl) return null;
    
    // Fetch the image and convert to base64
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const base64 = await blobToBase64(blob);
    return base64;
  } catch (error) {
    console.error("Error getting Street View image as base64:", error);
    return null;
  }
};
