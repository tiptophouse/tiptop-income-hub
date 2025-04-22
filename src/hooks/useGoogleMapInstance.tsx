
import { useEffect, useState, RefObject } from 'react';
import { toast } from '@/components/ui/use-toast';

// Use the Window interface extension from the types file
declare global {
  interface Window {
    google: any;
  }
}

interface UseGoogleMapInstanceProps {
  mapContainerRef: RefObject<HTMLDivElement>;
  address: string;
  view: 'satellite' | 'map';
  onZoomComplete?: () => void;
}

export function useGoogleMapInstance({
  mapContainerRef,
  address,
  view,
  onZoomComplete
}: UseGoogleMapInstanceProps) {
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);
  const [marker, setMarker] = useState<google.maps.Marker | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!address || !window.google?.maps || !mapContainerRef.current) return;
    
    const geocoder = new window.google.maps.Geocoder();
    
    geocoder.geocode({ address }, (results: any, status: string) => {
      if (status === "OK" && results?.[0]?.geometry?.location) {
        const location = results[0].geometry.location;
        
        const map = new window.google.maps.Map(mapContainerRef.current!, {
          center: { lat: location.lat(), lng: location.lng() },
          zoom: 19, // Closer zoom for better 3D effect
          mapTypeId: view === 'satellite' ? 'satellite' : 'roadmap',
          tilt: 45, // Add tilt for 3D effect
          heading: 45, // Rotate the map for better perspective
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          zoomControl: false,
        });
        
        const newMarker = new window.google.maps.Marker({
          map: map,
          position: location,
          animation: window.google.maps.Animation.DROP,
        });
        
        setMapInstance(map);
        setMarker(newMarker);
        setIsLoaded(true);
        
        map.addListener('tilesloaded', () => {
          if (onZoomComplete) {
            onZoomComplete();
          }
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to load location on map",
          variant: "destructive"
        });
      }
    });
  }, [address, view, onZoomComplete]);

  return { mapInstance, marker, isLoaded };
}
