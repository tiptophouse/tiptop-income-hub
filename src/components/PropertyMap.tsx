import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from '@/components/ui/use-toast';
import { generateModelFromImage } from '@/utils/meshyApi';
import MapControls from './map/MapControls';
import ModelJobInfo from './map/ModelJobInfo';
import { useGoogleMapInstance } from '@/hooks/useGoogleMapInstance';

interface PropertyMapProps {
  address: string;
  onZoomComplete?: () => void;
}

const PropertyMap: React.FC<PropertyMapProps> = ({ address, onZoomComplete }) => {
  const [view, setView] = useState<'satellite' | 'map'>('satellite');
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [is3DModelGenerating, setIs3DModelGenerating] = useState(false);
  const [modelJobId, setModelJobId] = useState<string | null>(null);

  const { mapInstance, isLoaded } = useGoogleMapInstance({
    mapContainerRef,
    address,
    view,
    onZoomComplete
  });

  const toggleMapType = () => {
    if (!mapInstance) return;
    const newView = view === 'satellite' ? 'map' : 'satellite';
    mapInstance.setMapTypeId(newView === 'satellite' ? 'satellite' : 'roadmap');
    setView(newView);
  };

  const captureMapImage = (): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!mapContainerRef.current) {
        reject("Map container not found");
        return;
      }

      try {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        const mapContainer = mapContainerRef.current;
        
        canvas.width = mapContainer.clientWidth;
        canvas.height = mapContainer.clientHeight;
        
        if (context) {
          context.fillStyle = '#ffffff';
          context.fillRect(0, 0, canvas.width, canvas.height);
          context.drawImage(mapContainer as any, 0, 0);
          
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
      
      const imageData = await captureMapImage();
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
        <MapControls
          view={view}
          onToggleView={toggleMapType}
          onGenerate3DModel={generateHouse3DModel}
          isGenerating={is3DModelGenerating}
        />
      )}
      
      {modelJobId && <ModelJobInfo jobId={modelJobId} />}
    </motion.div>
  );
};

export default PropertyMap;
