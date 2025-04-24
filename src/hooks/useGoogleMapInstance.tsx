
import { useEffect, useState, RefObject } from 'react';
import { toast } from '@/components/ui/use-toast';

interface UseGoogleMapInstanceProps {
  mapContainerRef: RefObject<HTMLDivElement>;
  address: string;
  view: 'satellite' | 'map';
  initialZoom?: number;
  onZoomComplete?: () => void;
}

export function useGoogleMapInstance({
  mapContainerRef,
  address,
  view,
  initialZoom = 18,
  onZoomComplete
}: UseGoogleMapInstanceProps) {
  const [mapInstance, setMapInstance] = useState<any>(null);
  const [marker, setMarker] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!address || !window.google?.maps || !mapContainerRef.current) return;
    
    const geocoder = new window.google.maps.Geocoder();
    
    geocoder.geocode({ address }, (results: any, status: string) => {
      if (status === "OK" && results?.[0]?.geometry?.location) {
        const location = results[0].geometry.location;
        
        const map = new window.google.maps.Map(mapContainerRef.current!, {
          center: { lat: location.lat(), lng: location.lng() },
          zoom: initialZoom,
          mapTypeId: view === 'satellite' ? 'satellite' : 'roadmap',
          tilt: 0,
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
        
        // Trigger onZoomComplete when tiles are loaded
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
  }, [address, view, initialZoom, onZoomComplete]);

  return { mapInstance, marker, isLoaded };
}
