
import React, { useRef } from 'react';
import { usePropertyMap } from '@/hooks/usePropertyMap';
import { useGoogleMapInstance } from '@/hooks/useGoogleMapInstance';
import MapControls from './map/MapControls';
import PropertyMapDisplay from './map/PropertyMapDisplay';
import ModelJobInfo from './map/ModelJobInfo';
import ModelGenerationHandler from './map/ModelGenerationHandler';

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
    initialZoom: 12,
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
    <>
      <PropertyMapDisplay
        mapContainerRef={mapContainerRef}
        isLoaded={isLoaded}
        weatherTemp={weatherTemp}
        isAnalyzing={isAnalyzing}
        analysisText={isAnalyzing ? "Analyzing Property..." : "Check Results"}
        view={view}
      />
      
      {isLoaded && (
        <>
          <MapControls
            view={view}
            onToggleView={toggleMapType}
          />
          
          <ModelGenerationHandler 
            address={address}
            mapContainerRef={mapContainerRef} 
            handleModelGeneration={handleModelGeneration} 
          />
        </>
      )}
    </>
  );
};

export default PropertyMap;
