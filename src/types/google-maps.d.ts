
/// <reference types="google.maps" />

declare global {
  interface Window {
    google: {
      maps: {
        Map: any;
        Marker: any;
        Geocoder: any;
        Animation: {
          DROP: number;
        };
        Rectangle: any;
        LatLng: any;
        LatLngBounds: any;
      }
    };
  }
}

// Define the google namespace and common types
declare namespace google {
  namespace maps {
    class Map {
      constructor(mapDiv: Element, opts?: MapOptions);
      setCenter(latLng: LatLng | LatLngLiteral): void;
    }
    
    class Marker {
      constructor(opts?: MarkerOptions);
      setPosition(latLng: LatLng | LatLngLiteral): void;
      setAnimation(animation: number): void;
    }
    
    class Geocoder {
      constructor();
      geocode(request: GeocoderRequest, callback: (results: GeocoderResult[], status: string) => void): void;
    }
    
    class Rectangle {
      constructor(opts?: RectangleOptions);
    }
    
    class LatLng {
      constructor(lat: number, lng: number);
      lat(): number;
      lng(): number;
    }
    
    class LatLngBounds {
      constructor(sw?: LatLng | LatLngLiteral, ne?: LatLng | LatLngLiteral);
    }

    // Interface definitions
    interface MapOptions {
      center?: LatLng | LatLngLiteral;
      zoom?: number;
      [key: string]: any;
    }
    
    interface MarkerOptions {
      position?: LatLng | LatLngLiteral;
      map?: Map;
      animation?: number;
      [key: string]: any;
    }
    
    interface RectangleOptions {
      bounds?: {
        north: number;
        south: number;
        east: number;
        west: number;
      };
      map?: Map;
      strokeColor?: string;
      strokeOpacity?: number;
      strokeWeight?: number;
      fillColor?: string;
      fillOpacity?: number;
      [key: string]: any;
    }
    
    interface LatLngLiteral {
      lat: number;
      lng: number;
    }
    
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
}

export {};
