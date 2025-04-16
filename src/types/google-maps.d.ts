
/// <reference types="google.maps" />

declare global {
  interface Window {
    google: {
      maps: {
        Map: typeof google.maps.Map;
        Marker: typeof google.maps.Marker;
        Geocoder: typeof google.maps.Geocoder;
        Animation: {
          DROP: number;
        };
        Rectangle: typeof google.maps.Rectangle;
        LatLng: typeof google.maps.LatLng;
        LatLngBounds: typeof google.maps.LatLngBounds;
      }
    };
  }
}

// Additional type definitions for Google Maps geocoding
declare namespace google.maps {
  interface GeocoderRequest {
    address?: string;
    location?: LatLng | LatLngLiteral;
  }

  interface GeocoderResult {
    geometry: {
      location: LatLng;
    };
    formatted_address: string;
  }
}

export {};
