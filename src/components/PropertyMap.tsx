
import React, { useRef } from 'react';
import MapControls from './map/MapControls';
import ModelJobInfo from './map/ModelJobInfo';
import LocationMarkers from './map/LocationMarkers';
import { useGoogleMapInstance } from '@/hooks/useGoogleMapInstance';
import { usePropertyMap } from '@/hooks/usePropertyMap';
import PropertyMapDisplay from './map/PropertyMapDisplay';

interface PropertyMapProps {
  address: string;
  onZoomComplete?: () => void;
}

const PropertyMap: React.FC<PropertyMapProps> = ({ address, onZoomComplete }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [modelJobId, setModelJobId] = React.useState<string | null>(null);
  
  const {
    view,
    setView,
    is3DModelGenerating,
    isAnalyzing,
    weatherTemp,
    handleModelGeneration,
  } = usePropertyMap(address);

  const { mapInstance, isLoaded } = useGoogleMapInstance({
    mapContainerRef,
    address,
    view,
    initialZoom: 12,
    onZoomComplete,
  });

  // Sample asset markers for the map
  const assetMarkers = [
    { type: 'solar', position: { top: '30%', left: '50%' }, label: 'Solar Panel Location' },
    { type: 'internet', position: { top: '45%', left: '60%' }, label: 'Internet Sharing Point' },
    { type: 'ev', position: { top: '60%', left: '40%' }, label: 'EV Charging Station' },
    { type: 'garden', position: { top: '35%', left: '70%' }, label: 'Garden Space' },
    { type: 'storage', position: { top: '55%', left: '30%' }, label: 'Storage Area' }
  ];

  const toggleMapType = () => {
    if (!mapInstance) return;
    const newView = view === 'satellite' ? 'map' : 'satellite';
    mapInstance.setMapTypeId(newView === 'satellite' ? 'satellite' : 'roadmap');
    setView(newView);
  };

  React.useEffect(() => {
    const handleModelJobCreated = (event: CustomEvent) => {
      if (event.detail?.jobId) {
        setModelJobId(event.detail.jobId);
      }
    };
    
    document.addEventListener('modelJobCreated', handleModelJobCreated as EventListener);
    return () => {
      document.removeEventListener('modelJobCreated', handleModelJobCreated as EventListener);
    };
  }, []);

  const generate3DModel = () => {
    handleModelGeneration(mapContainerRef);
  };

  return (
    <>
      <PropertyMapDisplay
        mapContainerRef={mapContainerRef}
        isLoaded={isLoaded}
        weatherTemp={weatherTemp}
        isAnalyzing={isAnalyzing}
        view={view}
      />
      
      {isLoaded && (
        <>
          <div className="relative">
            <LocationMarkers markers={assetMarkers} />
          </div>
          
          <MapControls
            view={view}
            onToggleView={toggleMapType}
            onGenerate3DModel={generate3DModel}
            isGenerating={is3DModelGenerating}
          />
          
          {modelJobId && <ModelJobInfo jobId={modelJobId} />}
        </>
      )}
    </>
  );
};

export default PropertyMap;
