
import { toast } from '@/components/ui/use-toast';

interface GeocodeAddressProps {
  address: string;
  onSuccess: (location: { lat: number; lng: number }) => void;
  onError?: (error: any) => void; // Changed to accept error parameter
}

interface GeocodeLocationProps {
  location: { lat: number; lng: number };
  onSuccess: (address: string) => void;
  onError?: (error: any) => void; // Changed to accept error parameter
}

// Simple cache to reduce redundant API calls
const geocodeCache: Record<string, { lat: number; lng: number }> = {};
const reverseGeocodeCache: Record<string, string> = {};

// Rate limiting setup
const MAX_REQUESTS_PER_INTERVAL = 4; // 4 requests maximum
const INTERVAL_MS = 1000; // per second
let requestCount = 0;
let lastIntervalStart = Date.now();

// Queue for pending requests
interface QueuedRequest {
  type: 'geocode' | 'reverse';
  params: any;
  resolve: () => void;
}
const requestQueue: QueuedRequest[] = [];

// Function to process the queue
const processQueue = () => {
  if (requestQueue.length === 0) return;

  const now = Date.now();
  if (now - lastIntervalStart >= INTERVAL_MS) {
    // Reset counter for new interval
    requestCount = 0;
    lastIntervalStart = now;
  }

  while (requestQueue.length > 0 && requestCount < MAX_REQUESTS_PER_INTERVAL) {
    const request = requestQueue.shift();
    if (!request) continue;

    requestCount++;
    if (request.type === 'geocode') {
      processGeocodeRequest(request.params);
    } else {
      processReverseGeocodeRequest(request.params);
    }
    request.resolve();
  }

  // Schedule next queue processing
  if (requestQueue.length > 0) {
    setTimeout(processQueue, Math.max(0, INTERVAL_MS - (Date.now() - lastIntervalStart)));
  }
};

// Function to add request to queue
const queueRequest = (type: 'geocode' | 'reverse', params: any): Promise<void> => {
  return new Promise((resolve) => {
    requestQueue.push({ type, params, resolve });
    if (requestQueue.length === 1) { // If this is the first request, start processing
      processQueue();
    }
  });
};

// Internal function to process geocode request
const processGeocodeRequest = ({ address, onSuccess, onError }: GeocodeAddressProps) => {
  if (!window.google) {
    console.error('Google Maps API not loaded');
    if (onError) onError(new Error('Google Maps API not loaded'));
    return;
  }
  
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
      
      geocodeCache[cacheKey] = result;
      onSuccess(result);
    } else {
      console.error('Geocode was not successful:', status);
      if (onError) onError(status);
    }
  });
};

// Internal function to process reverse geocode request
const processReverseGeocodeRequest = ({ location, onSuccess, onError }: GeocodeLocationProps) => {
  if (!window.google) {
    console.error('Google Maps API not loaded');
    if (onError) onError(new Error('Google Maps API not loaded'));
    return;
  }

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
      reverseGeocodeCache[cacheKey] = address;
      onSuccess(address);
    } else {
      console.error('Reverse geocode was not successful:', status);
      if (onError) onError(status);
    }
  });
};

// Public geocode function with rate limiting
export const geocodeAddress = async (params: GeocodeAddressProps): Promise<void> => {
  await queueRequest('geocode', params);
};

// Public reverse geocode function with rate limiting
export const reverseGeocode = async (params: GeocodeLocationProps): Promise<void> => {
  await queueRequest('reverse', params);
};

// Function to get the user's current location
export const getCurrentLocation = (
  onSuccess: (location: { lat: number; lng: number }) => void,
  onError: (error: any) => void // Changed to accept error parameter
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
        onError(error);
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
  } else {
    toast({
      title: "Geolocation Not Supported",
      description: "Your browser does not support geolocation.",
      variant: "destructive"
    });
    onError(new Error("Geolocation not supported"));
  }
};
