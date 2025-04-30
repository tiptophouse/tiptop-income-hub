
import { getGoogleMapsApiKey } from './api/meshyConfig';
import html2canvas from 'html2canvas';

/**
 * Gets a static Street View image for the specified address as base64
 * 
 * @param address The address to get the Street View for
 * @returns Base64 encoded image or null if not available
 */
export const getStreetViewImageAsBase64 = async (address: string): Promise<string | null> => {
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

          // Street View is available, get the image directly via Static API
          const imageUrl = `https://maps.googleapis.com/maps/api/streetview?size=600x400&location=${lat},${lng}&key=${apiKey}`;
          
          // Fetch the image and convert to base64
          const response = await fetch(imageUrl);
          const blob = await response.blob();
          const base64 = await blobToBase64(blob);
          resolve(base64);
        } catch (err) {
          console.log("Street View not available for this location");
          resolve(null);
        }
      });
    });
  } catch (error) {
    console.error("Error getting Street View image:", error);
    return null;
  }
};

/**
 * Gets a static satellite image for the specified address as base64
 * 
 * @param address The address to get the satellite view for
 * @returns Base64 encoded image or null if not available
 */
export const getSatelliteImageAsBase64 = async (address: string): Promise<string | null> => {
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

        // Get satellite image via Static API
        const imageUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=18&size=600x400&maptype=satellite&key=${apiKey}`;
        
        // Fetch the image and convert to base64
        try {
          const response = await fetch(imageUrl);
          const blob = await response.blob();
          const base64 = await blobToBase64(blob);
          resolve(base64);
        } catch (err) {
          console.error("Error fetching satellite image:", err);
          resolve(null);
        }
      });
    });
  } catch (error) {
    console.error("Error getting satellite image:", error);
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

        // Get aerial image via Static API at zoom level 12
        const imageUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=12&size=600x400&maptype=satellite&key=${apiKey}`;
        
        // Fetch the image and convert to base64
        try {
          const response = await fetch(imageUrl);
          const blob = await response.blob();
          const base64 = await blobToBase64(blob);
          resolve(base64);
        } catch (err) {
          console.error("Error fetching aerial image:", err);
          resolve(null);
        }
      });
    });
  } catch (error) {
    console.error("Error getting aerial image:", error);
    return null;
  }
};

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

/**
 * Captures a screenshot of a map container element
 * @param mapElement Can be either a React ref object or a direct HTMLDivElement
 */
export const captureMapScreenshot = async (
  mapElement: React.RefObject<HTMLDivElement> | HTMLDivElement
): Promise<string | null> => {
  try {
    // Check if it's a ref object or direct element
    const element = 'current' in mapElement ? mapElement.current : mapElement;
    
    if (!element) {
      console.error("Map container not found");
      return null;
    }
    
    const canvas = await html2canvas(element);
    const base64 = canvas.toDataURL('image/png');
    return base64;
  } catch (error) {
    console.error("Error capturing map screenshot:", error);
    return null;
  }
};

/**
 * Converts a Blob to base64
 */
const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};
