
import { toast } from '@/components/ui/use-toast';

interface GeocodeAddressProps {
  address: string;
  onSuccess: (location: { lat: number; lng: number }) => void;
  onError?: () => void;
}

interface GeocodeLocationProps {
  location: { lat: number; lng: number };
  onSuccess: (address: string) => void;
  onError?: () => void;
}

// Simple cache to reduce redundant API calls
const geocodeCache: Record<string, { lat: number; lng: number }> = {};
const reverseGeocodeCache: Record<string, string> = {};

// Function to geocode an address to coordinates
export const geocodeAddress = ({ address, onSuccess, onError }: GeocodeAddressProps): void => {
  if (!window.google) {
    console.error('Google Maps API not loaded');
    if (onError) onError();
    return;
  }
  
  // Check cache first
  const cacheKey = address.trim().toLowerCase();
  if (geocodeCache[cacheKey]) {
    console.log('Using cached geocode result for:', address);
    onSuccess(geocodeCache[cacheKey]);
    return;
  }

  const geocoder = new window.google.maps.Geocoder();
  geocoder.geocode({ address }, (results, status) => {
    if (status === "OK" && results && results[0]) {
      const location = results[0].geometry.location;
      const result = { 
        lat: location.lat(), 
        lng: location.lng() 
      };
      
      // Cache the result
      geocodeCache[cacheKey] = result;
      onSuccess(result);
    } else {
      console.error('Geocode was not successful:', status);
      if (onError) onError();
    }
  });
};

// Function to reverse geocode coordinates to an address
export const reverseGeocode = ({ location, onSuccess, onError }: GeocodeLocationProps): void => {
  if (!window.google) {
    console.error('Google Maps API not loaded');
    if (onError) onError();
    return;
  }

  // Check cache first
  const cacheKey = `${location.lat},${location.lng}`;
  if (reverseGeocodeCache[cacheKey]) {
    console.log('Using cached reverse geocode result for:', cacheKey);
    onSuccess(reverseGeocodeCache[cacheKey]);
    return;
  }

  const geocoder = new window.google.maps.Geocoder();
  geocoder.geocode({ location }, (results, status) => {
    if (status === "OK" && results && results[0]) {
      const address = results[0].formatted_address;
      
      // Cache the result
      reverseGeocodeCache[cacheKey] = address;
      onSuccess(address);
    } else {
      console.error('Reverse geocode was not successful:', status);
      if (onError) onError();
    }
  });
};

// Function to get the user's current location
export const getCurrentLocation = (
  onSuccess: (location: { lat: number; lng: number }) => void,
  onError: () => void
): void => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        onSuccess(userLocation);
      },
      (error) => {
        console.error('Error getting current location:', error);
        toast({
          title: "Location Error",
          description: "Unable to get your location. Please check your browser permissions.",
          variant: "destructive"
        });
        onError();
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
  } else {
    toast({
      title: "Geolocation Not Supported",
      description: "Your browser does not support geolocation.",
      variant: "destructive"
    });
    onError();
  }
};
