import { useEffect, useState, useRef, RefObject } from 'react';

interface UseGoogleMapProps {
  mapRef: React.RefObject<HTMLDivElement>;
  gestureHandling?: 'cooperative' | 'greedy' | 'auto' | 'none';
}

export function useGoogleMap({ 
  mapRef,
  gestureHandling = 'cooperative'  // Default to cooperative to require two fingers on mobile
}: UseGoogleMapProps) {
  const [map, setMap] = useState<any | null>(null);
  const [marker, setMarker] = useState<any | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [propertyDetails, setPropertyDetails] = useState<any>(null);
  const roofOverlayRef = useRef<any | null>(null);
  const streetViewRef = useRef<any | null>(null);
  const [mapInitialized, setMapInitialized] = useState(false);

  const defaultLocation = { lat: 40.7128, lng: -74.006 }; // Default NYC

  useEffect(() => {
    if (!window.google?.maps || !mapRef.current || mapInitialized) return;

    const mapOptions = {
      center: { lat: defaultLocation.lat, lng: defaultLocation.lng },
      zoom: 12,
      mapTypeId: "roadmap",
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      zoomControl: false,
      gestureHandling: gestureHandling, // Use the passed gesture handling option
    };

    const newMap = new window.google.maps.Map(mapRef.current, mapOptions);
    setMap(newMap);
    setMapInitialized(true);
    setIsLoaded(true);
  }, [mapInitialized, gestureHandling]); // Add gestureHandling to dependencies

  const setMapCenter = (location: { lat: number; lng: number }) => {
    if (map && marker) {
      map.setCenter(location);
      marker.setPosition(location);
      
      // Initialize Street View when setting location
      if (window.google && window.google.maps && window.google.maps.StreetViewService) {
        const streetViewService = new window.google.maps.StreetViewService();
        const STREET_VIEW_MAX_DISTANCE = 50;
        
        // Check if Street View is available at this location
        streetViewService.getPanorama(
          {
            location: location,
            preference: 'nearest',
            radius: STREET_VIEW_MAX_DISTANCE,
            source: 'outdoor'
          },
          (data, status) => {
            if (status === 'OK') {
              // Street view exists, create panorama
              if (streetViewRef.current) {
                streetViewRef.current.setPosition(data.location.latLng);
              }
            }
          }
        );
      }
      
      // Try to get property details
      fetchPropertyDetails(location);
    }
  };

  const fetchPropertyDetails = async (location: { lat: number; lng: number }) => {
    try {
      // For demo purposes, we'll simulate property size data
      // In a real app, you would call a property data API like Zillow, Redfin, etc.
      const simulatedData = {
        squareFootage: Math.floor(Math.random() * 3000) + 1000,
        bedrooms: Math.floor(Math.random() * 5) + 1,
        bathrooms: Math.floor(Math.random() * 3) + 1,
        lotSize: ((Math.random() * 0.5) + 0.1).toFixed(2) + " acres",
        yearBuilt: Math.floor(Math.random() * 70) + 1950,
      };
      
      setPropertyDetails(simulatedData);
    } catch (error) {
      console.error("Error fetching property details:", error);
    }
  };

  const addRoofOverlay = (center: { lat: number; lng: number }) => {
    if (!map || !window.google) return;

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

    // Check if Polygon exists in window.google.maps
    if (window.google.maps.Polygon) {
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
    } else {
      console.warn('Google Maps Polygon is not available');
    }
  };

  const createStreetView = (container: HTMLElement, location: { lat: number; lng: number }) => {
    if (!window.google || !window.google.maps || !window.google.maps.StreetViewPanorama) return null;
    
    const panorama = new window.google.maps.StreetViewPanorama(container, {
      position: location,
      pov: { heading: 34, pitch: 10 },
      zoom: 1,
      addressControl: false,
      linksControl: true,
    });
    
    streetViewRef.current = panorama;
    return panorama;
  };

  return { 
    map, 
    marker, 
    isLoaded, 
    setMapCenter, 
    addRoofOverlay, 
    createStreetView, 
    propertyDetails 
  };
}
