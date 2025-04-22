
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Satellite, Map as MapIcon, ZoomIn, Download3D } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { generateModelFromImage } from '@/utils/meshyApi';

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
  const [is3DModelGenerating, setIs3DModelGenerating] = useState(false);
  const [modelJobId, setModelJobId] = useState<string | null>(null);

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
          
          // Capture satellite image after map fully loaded
          mapInstance.addListener('tilesloaded', () => {
            // Only run this once after initial load
            if (onZoomComplete) {
              onZoomComplete();
            }
          });
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

  const captureMapImage = (): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!mapContainerRef.current) {
        reject("Map container not found");
        return;
      }

      try {
        // Use html2canvas to capture the map
        // This is a simplified version - in production, you'd want to use
        // the Google Maps Static API or a proper screenshot library
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        const mapContainer = mapContainerRef.current;
        
        canvas.width = mapContainer.clientWidth;
        canvas.height = mapContainer.clientHeight;
        
        if (context) {
          // Draw a placeholder - in reality you'd need html2canvas or similar
          context.fillStyle = '#ffffff';
          context.fillRect(0, 0, canvas.width, canvas.height);
          context.drawImage(mapContainer as any, 0, 0);
          
          // Convert to base64
          const imageData = canvas.toDataURL('image/png');
          resolve(imageData);
        } else {
          reject("Could not get canvas context");
        }
      } catch (error) {
        console.error("Error capturing map image:", error);
        reject(error);
      }
    });
  };

  const generateHouse3DModel = async () => {
    if (!isLoaded || is3DModelGenerating) return;
    
    try {
      setIs3DModelGenerating(true);
      toast({
        title: "Processing",
        description: "Extracting house layout and generating 3D model...",
      });
      
      // Capture the current map view as an image
      const imageData = await captureMapImage();
      
      // Call Meshy API to generate 3D model
      const jobId = await generateModelFromImage(imageData);
      
      setModelJobId(jobId);
      toast({
        title: "Success",
        description: "3D model generation started. This may take a few minutes to complete.",
      });
    } catch (error) {
      console.error("Error generating 3D model:", error);
      toast({
        title: "Error",
        description: "Failed to generate 3D model. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIs3DModelGenerating(false);
    }
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
          
          <Button
            variant="secondary"
            size="sm"
            className="bg-white shadow-md"
            onClick={generateHouse3DModel}
            disabled={is3DModelGenerating}
          >
            {is3DModelGenerating ? (
              <div className="animate-spin h-4 w-4 border-t-2 border-tiptop-accent rounded-full" />
            ) : (
              <span className="flex items-center gap-1">
                <ZoomIn className="h-4 w-4" />
                <span className="text-xs">Extract 3D</span>
              </span>
            )}
          </Button>
        </div>
      )}
      
      {modelJobId && (
        <div className="absolute top-4 left-4 bg-white p-2 rounded shadow-md">
          <p className="text-xs text-gray-600">3D Model Job ID: {modelJobId}</p>
        </div>
      )}
    </motion.div>
  );
};

export default PropertyMap;
