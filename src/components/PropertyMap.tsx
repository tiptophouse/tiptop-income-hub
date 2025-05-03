
import React, { useRef } from 'react';
import { usePropertyMap } from '@/hooks/usePropertyMap';
import { useGoogleMapInstance } from '@/hooks/useGoogleMapInstance';
import MapControls from './map/MapControls';
import PropertyMapDisplay from './map/PropertyMapDisplay';
import ModelJobInfo from './map/ModelJobInfo';
import ModelGenerationHandler from './map/ModelGenerationHandler';
import { motion } from 'framer-motion';

interface PropertyMapProps {
  address: string;
  onZoomComplete?: () => void;
}

const PropertyMap: React.FC<PropertyMapProps> = ({ address, onZoomComplete }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  
  const {
    view,
    setView,
    isAnalyzing,
    setIsAnalyzing,
    weatherTemp,
    handleModelGeneration,
  } = usePropertyMap(address);

  const { mapInstance, isLoaded } = useGoogleMapInstance({
    mapContainerRef,
    address,
    view,
    initialZoom: 15, // Increased initial zoom for better view
    onZoomComplete: () => {
      setIsAnalyzing(false);
      if (onZoomComplete) onZoomComplete();
    },
  });

  const toggleMapType = () => {
    if (!mapInstance) return;
    const newView = view === 'satellite' ? 'map' : 'satellite';
    mapInstance.setMapTypeId(newView === 'satellite' ? 'satellite' : 'roadmap');
    setView(newView);
  };

  return (
    <motion.div
      className="w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-xl sm:text-2xl font-semibold text-[#6E59A5] mb-3">Property Details</h2>
      <PropertyMapDisplay
        mapContainerRef={mapContainerRef}
        isLoaded={isLoaded}
        weatherTemp={weatherTemp}
        isAnalyzing={isAnalyzing}
        analysisText={isAnalyzing ? "Analyzing Property..." : "Analysis Complete"}
        view={view}
      />
      
      {isLoaded && (
        <div className="relative z-10">
          <MapControls
            view={view}
            onToggleView={toggleMapType}
          />
          
          <ModelGenerationHandler 
            address={address}
            mapContainerRef={mapContainerRef} 
            handleModelGeneration={handleModelGeneration} 
          />
        </div>
      )}
    </motion.div>
  );
};

export default PropertyMap;
