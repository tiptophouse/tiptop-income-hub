
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Satellite, Map as MapIcon, ZoomIn } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PropertyMapProps {
  address: string;
  onZoomComplete?: () => void;
}

const PropertyMap: React.FC<PropertyMapProps> = ({ address, onZoomComplete }) => {
  const [view, setView] = useState<'satellite' | 'map'>('satellite');
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!address || !window.google?.maps) return;
    
    const initializeMap = () => {
      if (!mapContainerRef.current || !window.google?.maps) return;
      
      const geocoder = new window.google.maps.Geocoder();
      
      geocoder.geocode({ address }, (results, status) => {
        if (status === "OK" && results?.[0]?.geometry?.location) {
          const location = results[0].geometry.location;
          
          const mapInstance = new window.google.maps.Map(mapContainerRef.current!, {
            center: { lat: location.lat(), lng: location.lng() },
            zoom: 18, // Set initial zoom to 18 for property view
            mapTypeId: view === 'satellite' ? 'satellite' : 'roadmap',
            tilt: 0,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false,
            zoomControl: false,
          });
          
          mapRef.current = mapInstance;
          
          const marker = new window.google.maps.Marker({
            map: mapInstance,
            position: location,
            animation: window.google.maps.Animation.DROP,
          });
          
          markerRef.current = marker;
          setIsLoaded(true);
          
          if (onZoomComplete) {
            setTimeout(onZoomComplete, 1000);
          }
        }
      });
    };

    initializeMap();
  }, [address, view, onZoomComplete]);

  const toggleMapType = () => {
    if (!mapRef.current) return;
    
    const newView = view === 'satellite' ? 'map' : 'satellite';
    mapRef.current.setMapTypeId(newView === 'satellite' ? 'satellite' : 'roadmap');
    setView(newView);
  };

  return (
    <motion.div
      className="relative w-full h-80 rounded-xl overflow-hidden shadow-md border border-gray-200"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div 
        ref={mapContainerRef} 
        className="w-full h-full"
      />
      
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-tiptop-accent" />
        </div>
      )}
      
      {isLoaded && (
        <div className="absolute bottom-4 right-4 flex gap-2">
          <Button 
            variant="secondary" 
            size="sm" 
            className="bg-white shadow-md"
            onClick={toggleMapType}
          >
            {view === 'satellite' ? <MapIcon className="h-4 w-4" /> : <Satellite className="h-4 w-4" />}
          </Button>
        </div>
      )}
    </motion.div>
  );
};

export default PropertyMap;
