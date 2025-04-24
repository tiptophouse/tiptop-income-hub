
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
  const [hasInitialized, setHasInitialized] = useState(false);
  const [hasCompletedZoom, setHasCompletedZoom] = useState(false);

  useEffect(() => {
    if (!address || !window.google?.maps || !mapContainerRef.current || hasInitialized) return;
    
    try {
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
          setHasInitialized(true);
          
          // Only trigger onZoomComplete once when tiles are loaded
          const tileListener = map.addListener('tilesloaded', () => {
            if (!hasCompletedZoom && onZoomComplete) {
              setHasCompletedZoom(true);
              onZoomComplete();
              
              // Clean up listener after first trigger
              if (window.google && window.google.maps) {
                window.google.maps.event.removeListener(tileListener);
              }
            }
          });
        } else {
          console.error("Geocoding error:", status);
          toast({
            title: "Error",
            description: "Failed to load location on map",
            variant: "destructive"
          });
        }
      });
    } catch (error) {
      console.error("Map initialization error:", error);
    }
  }, [address, view, initialZoom, onZoomComplete, hasInitialized, hasCompletedZoom]);

  // Update map type if view changes
  useEffect(() => {
    if (mapInstance && view) {
      mapInstance.setMapTypeId(view === 'satellite' ? 'satellite' : 'roadmap');
    }
  }, [view, mapInstance]);

  return { mapInstance, marker, isLoaded };
}
