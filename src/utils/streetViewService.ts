
export const getStreetViewImageUrl = (
  address: string,
  size: { width: number; height: number } = { width: 600, height: 400 }
): string => {
  // Base64 encode the address for URL safety
  const encodedAddress = encodeURIComponent(address);
  
  // Use the same API key as the map
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
        radius: 50, // Look for Street View panoramas within 50 meters
        source: 'outdoor'
      },
      (data, status) => {
        resolve(status === 'OK');
      }
    );
  });
};
