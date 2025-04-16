
import { useEffect, useState, useRef, RefObject } from 'react';

interface UseGoogleMapProps {
  mapRef: RefObject<HTMLDivElement>;
}

export function useGoogleMap({ mapRef }: UseGoogleMapProps) {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [marker, setMarker] = useState<google.maps.Marker | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const roofOverlayRef = useRef<google.maps.Polygon | null>(null);

  useEffect(() => {
    // Initialize the map
    if (mapRef.current && !map && window.google && window.google.maps) {
      const mapInstance = new window.google.maps.Map(mapRef.current, {
        center: { lat: 40.7128, lng: -74.006 }, // Default NYC
        zoom: 15,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
      });

      const markerInstance = new window.google.maps.Marker({
        map: mapInstance,
        position: { lat: 40.7128, lng: -74.006 },
        animation: window.google.maps.Animation.DROP,
      });

      setMap(mapInstance);
      setMarker(markerInstance);
      setIsLoaded(true);
    }
  }, [mapRef, map]);

  const setMapCenter = (location: { lat: number; lng: number }) => {
    if (map && marker) {
      map.setCenter(location);
      marker.setPosition(location);
    }
  };

  const addRoofOverlay = (center: { lat: number; lng: number }) => {
    if (!map) return;

    // Remove previous overlay if it exists
    if (roofOverlayRef.current) {
      roofOverlayRef.current.setMap(null);
    }

    // Create a simple polygon to represent a roof
    const roofCoordinates = [
      { lat: center.lat - 0.0002, lng: center.lng - 0.0003 },
      { lat: center.lat + 0.0002, lng: center.lng - 0.0003 },
      { lat: center.lat + 0.0002, lng: center.lng + 0.0003 },
      { lat: center.lat - 0.0002, lng: center.lng + 0.0003 },
    ];

    const roofOverlay = new window.google.maps.Polygon({
      paths: roofCoordinates,
      strokeColor: '#AA94E2',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#AA94E2',
      fillOpacity: 0.35,
    });

    roofOverlay.setMap(map);
    roofOverlayRef.current = roofOverlay;
  };

  return { map, marker, isLoaded, setMapCenter, addRoofOverlay };
}
