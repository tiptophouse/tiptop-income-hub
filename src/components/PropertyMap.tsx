
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Satellite, Map as MapIcon, Maximize } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Instead of importing from a separate file, define the necessary types inline
// or reference the global window.google object directly
interface PropertyMapProps {
  address: string;
  onZoomComplete?: () => void;
}

const PropertyMap: React.FC<PropertyMapProps> = ({ address, onZoomComplete }) => {
  const [zoomLevel, setZoomLevel] = useState<'far' | 'medium' | 'close'>('far');
  const [view, setView] = useState<'satellite' | 'map'>('satellite');
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null); // Use any for Google Maps objects
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!address) return;
    
    // Initialize the map if address is provided
    if (mapContainerRef.current && !map.current && window.google) {
      initializeMap();
    }
  }, [address]);

  const initializeMap = () => {
    if (!mapContainerRef.current || !window.google) return;
    
    // Use the global Google Maps object directly
    const geocoder = new window.google.maps.Geocoder();
    
    geocoder.geocode({ address }, (results, status) => {
      if (status === "OK" && results && results[0] && results[0].geometry) {
        const location = results[0].geometry.location;
        
        // Create the map
        const mapInstance = new window.google.maps.Map(mapContainerRef.current!, {
          center: { lat: location.lat(), lng: location.lng() },
          zoom: 16,
          mapTypeId: view === 'satellite' ? 'satellite' : 'roadmap',
          tilt: 0,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          zoomControl: false,
        });
        
        map.current = mapInstance;
        setIsLoaded(true);
        
        // Add a marker for the property
        new window.google.maps.Marker({
          map: mapInstance,
          position: { lat: location.lat(), lng: location.lng() },
          animation: window.google.maps.Animation.DROP,
        });
      }
    });
  };

  const handleZoomIn = () => {
    if (!map.current) return;
    
    if (zoomLevel === 'far') {
      map.current.setZoom(18);
      setZoomLevel('medium');
    } else if (zoomLevel === 'medium') {
      map.current.setZoom(20);
      map.current.setTilt(45);
      setZoomLevel('close');
      
      // Notify parent component that zoom is complete
      if (onZoomComplete) {
        setTimeout(() => {
          onZoomComplete();
        }, 1000);
      }
    }
  };

  const toggleMapType = () => {
    if (!map.current) return;
    
    const newView = view === 'satellite' ? 'map' : 'satellite';
    map.current.setMapTypeId(newView === 'satellite' ? 'satellite' : 'roadmap');
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
      ></div>
      
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-tiptop-accent"></div>
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
          
          <Button 
            variant="secondary" 
            size="sm" 
            className="bg-white shadow-md"
            onClick={handleZoomIn}
            disabled={zoomLevel === 'close'}
          >
            <Maximize className="h-4 w-4" />
          </Button>
        </div>
      )}
      
      {zoomLevel === 'close' && (
        <motion.div 
          className="absolute inset-0 pointer-events-none flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="bg-white/80 px-4 py-2 rounded-full text-tiptop-accent font-semibold text-sm">
            Analysis Complete
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default PropertyMap;
