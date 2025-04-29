
import { useEffect, useState, RefObject, useCallback } from 'react';
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
  initialZoom = 12,
  onZoomComplete
}: UseGoogleMapInstanceProps) {
  const [mapInstance, setMapInstance] = useState<any>(null);
  const [marker, setMarker] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);
  const [isZooming, setIsZooming] = useState(false);
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
            gestureHandling: 'cooperative', // Require two fingers for scrolling/panning on mobile
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

          // Set up the delayed zoom animation
          setTimeout(() => {
            console.log('Starting zoom animation to level 18');
            map.setZoom(18);
            
            // Listen for the zoom animation to complete
            const zoomListener = map.addListener('idle', () => {
              console.log('Zoom animation completed');
              if (onZoomComplete) {
                onZoomComplete();
              }
              // Remove the listener after it fires
              window.google.maps.event.removeListener(zoomListener);
            });
          }, 3000);
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
  }, [address, view, initialZoom, onZoomComplete, hasInitialized]);

  useEffect(() => {
    if (mapInstance && view) {
      mapInstance.setMapTypeId(view === 'satellite' ? 'satellite' : 'roadmap');
    }
  }, [view, mapInstance]);

  const zoomMap = useCallback((zoomLevel: number) => {
    if (!mapInstance) return false;
    
    console.log(`Zooming map to level: ${zoomLevel}`);
    setIsZooming(true);
    
    try {
      // Force a smooth animated zoom transition
      mapInstance.animateCamera = true;
      mapInstance.setZoom(zoomLevel);
      
      console.log(`Zoom command sent to level: ${zoomLevel}, current zoom: ${mapInstance.getZoom()}`);
      
      // Use a timeout to make sure the zoom animation has time to complete
      setTimeout(() => {
        setIsZooming(false);
        console.log(`Zoom animation completed to level: ${mapInstance.getZoom()}`);
      }, 1500);
      
      return true;
    } catch (e) {
      console.error("Error during zoom operation:", e);
      setIsZooming(false);
      return false;
    }
  }, [mapInstance]);

  return { mapInstance, marker, isLoaded, zoomMap };
}
