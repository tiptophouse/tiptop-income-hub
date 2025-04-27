
declare const google: any;

export const getStreetViewImageUrl = (
  address: string,
  size: { width: number; height: number } = { width: 600, height: 400 }
): string => {
  const encodedAddress = encodeURIComponent(address);
  const API_KEY = "AIzaSyBVn7lLjUZ1_bZXGwdqXFC11fNM8Pax4SE";
  
  return `https://maps.googleapis.com/maps/api/streetview?size=${size.width}x${size.height}&location=${encodedAddress}&key=${API_KEY}`;
};

export const checkStreetViewAvailability = async (
  location: { lat: number; lng: number }
): Promise<boolean> => {
  return new Promise((resolve) => {
    if (!window.google?.maps?.StreetViewService) {
      resolve(false);
      return;
    }

    const streetViewService = new window.google.maps.StreetViewService();
    streetViewService.getPanorama(
      {
        location: location,
        radius: 50,
        source: 'outdoor'
      },
      (data: any, status: string) => {
        resolve(status === 'OK');
      }
    );
  });
};

export const getStreetViewImageAsBase64 = async (address: string): Promise<string> => {
  try {
    const streetViewUrl = getStreetViewImageUrl(address);
    console.log("Fetching Street View image from:", streetViewUrl);
    
    const response = await fetch(streetViewUrl);
    const blob = await response.blob();
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error("Error getting Street View image:", error);
    throw error;
  }
};

export const captureStreetViewForModel = async (address: string): Promise<string | null> => {
  try {
    console.log("Capturing Street View image for:", address);
    
    if (!window.google?.maps?.Geocoder) {
      throw new Error("Google Maps API not loaded");
    }

    const geocoder = new window.google.maps.Geocoder();
    const geocodeResult = await new Promise<google.maps.GeocoderResult[]>((resolve, reject) => {
      geocoder.geocode({ address }, (results: any, status: string) => {
        if (status === 'OK' && results) {
          resolve(results);
        } else {
          reject(new Error(`Geocoding failed: ${status}`));
        }
      });
    });
    
    const location = {
      lat: geocodeResult[0].geometry.location.lat(),
      lng: geocodeResult[0].geometry.location.lng()
    };
    
    const hasStreetView = await checkStreetViewAvailability(location);
    
    if (!hasStreetView) {
      console.log("No Street View available for this location");
      return null;
    }
    
    return await getStreetViewImageAsBase64(address);
  } catch (error) {
    console.error("Error capturing Street View:", error);
    return null;
  }
};
