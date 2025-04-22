
// Global type declarations for the application
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
  }
}

