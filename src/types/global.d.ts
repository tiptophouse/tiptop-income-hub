
// Global type declarations for the application

// Declare the google namespace on the window object
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
    }
  }
}
