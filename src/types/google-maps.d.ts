
/// <reference types="google.maps" />

declare global {
  interface Window {
    google: typeof google;
  }
}

declare namespace google.maps {
  interface GeocoderRequest {
    location?: LatLng | LatLngLiteral;
  }

  interface GeocoderResult {
    formatted_address: string;
  }
}
