
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
        MapTypeId: {
          ROADMAP: string;
          SATELLITE: string;
        };
        Rectangle: any;
        LatLng: any;
        LatLngBounds: any;
        Polygon: any;
        StreetViewPanorama: any;
        StreetViewService: any;
        places: {
          Autocomplete: any;
        };
        event: {
          clearInstanceListeners: (instance: any) => void;
        };
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
    
    class Polygon {
      constructor(opts?: PolygonOptions);
      setMap(map: Map | null): void;
    }
    
    class LatLng {
      constructor(lat: number, lng: number);
      lat(): number;
      lng(): number;
    }
    
    class LatLngBounds {
      constructor(sw?: LatLng | LatLngLiteral, ne?: LatLng | LatLngLiteral);
    }
    
    class StreetViewPanorama {
      constructor(container: Element, opts?: StreetViewPanoramaOptions);
      setPosition(latLng: LatLng | LatLngLiteral): void;
      setPov(pov: StreetViewPov): void;
    }
    
    class StreetViewService {
      constructor();
      getPanorama(request: StreetViewRequest, callback: (data: StreetViewPanoramaData, status: string) => void): void;
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
    
    interface PolygonOptions {
      paths?: LatLng[] | LatLngLiteral[] | Array<LatLng[] | LatLngLiteral[]>;
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
    
    interface StreetViewPanoramaOptions {
      position?: LatLng | LatLngLiteral;
      pov?: StreetViewPov;
      zoom?: number;
      visible?: boolean;
      [key: string]: any;
    }
    
    interface StreetViewPov {
      heading: number;
      pitch: number;
    }
    
    interface StreetViewRequest {
      location: LatLng | LatLngLiteral;
      preference?: string;
      radius?: number;
      source?: string;
      [key: string]: any;
    }
    
    interface StreetViewPanoramaData {
      location: { latLng: LatLng };
      [key: string]: any;
    }
  }

  namespace places {
    class Autocomplete {
      constructor(input: HTMLInputElement, opts?: {
        types?: string[];
        componentRestrictions?: { country: string };
      });
      addListener(event: string, callback: () => void): void;
      getPlace(): PlaceResult;
    }

    interface PlaceResult {
      formatted_address?: string;
      geometry?: {
        location: google.maps.LatLng;
      };
    }
  }

  namespace event {
    function clearInstanceListeners(instance: any): void;
  }
}

export {};
