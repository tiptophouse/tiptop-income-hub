
import { useState, useEffect, RefObject } from 'react';

interface UseGoogleMapProps {
  mapRef: RefObject<HTMLDivElement>;
  initialLocation?: { lat: number; lng: number };
}

interface UseGoogleMapReturn {
  map: google.maps.Map | null;
  marker: google.maps.Marker | null;
  isLoaded: boolean;
  setMapCenter: (location: { lat: number; lng: number }) => void;
  addRoofOverlay: (location: { lat: number; lng: number }) => void;
}

export const useGoogleMap = ({ 
  mapRef, 
  initialLocation = { lat: 34.0522, lng: -118.2437 } // Los Angeles as default
}: UseGoogleMapProps): UseGoogleMapReturn => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [marker, setMarker] = useState<google.maps.Marker | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Initialize map on component load
  useEffect(() => {
    if (!window.google || !mapRef.current) return;
    
    setIsLoaded(true);
    
    const mapInstance = new window.google.maps.Map(mapRef.current, {
      center: initialLocation,
      zoom: 12,
      mapTypeControl: false,
      streetViewControl: false,
      styles: [
        {
          featureType: 'administrative',
          elementType: 'geometry',
          stylers: [{ visibility: 'off' }]
        },
        {
          featureType: 'poi',
          stylers: [{ visibility: 'off' }]
        },
        {
          featureType: 'road',
          elementType: 'labels.icon',
          stylers: [{ visibility: 'off' }]
        },
        {
          featureType: 'transit',
          stylers: [{ visibility: 'off' }]
        },
        {
          featureType: 'water',
          elementType: 'geometry',
          stylers: [{ color: '#c9c9c9' }]
        }
      ]
    });

    setMap(mapInstance);

    const markerInstance = new window.google.maps.Marker({
      map: mapInstance,
      position: initialLocation,
      animation: window.google.maps.Animation.DROP,
    });

    setMarker(markerInstance);
  }, [mapRef, initialLocation]);
  
  // Function to set the map center and marker position
  const setMapCenter = (location: { lat: number; lng: number }) => {
    if (!map || !marker) return;
    
    map.setCenter(location);
    marker.setPosition(location);
    marker.setAnimation(window.google.maps.Animation.DROP);
  };
  
  // Function to add a roof overlay to the map
  const addRoofOverlay = (location: { lat: number; lng: number }) => {
    if (!map) return;
    
    new window.google.maps.Rectangle({
      strokeColor: '#AA94E2',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#AA94E2',
      fillOpacity: 0.35,
      map,
      bounds: {
        north: location.lat + 0.0005,
        south: location.lat - 0.0005,
        east: location.lng + 0.0008,
        west: location.lng - 0.0008
      }
    });
  };
  
  return { map, marker, isLoaded, setMapCenter, addRoofOverlay };
};
