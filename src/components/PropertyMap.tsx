import React, { useRef } from 'react';
import MapControls from './map/MapControls';
import ModelJobInfo from './map/ModelJobInfo';
import { useGoogleMapInstance } from '@/hooks/useGoogleMapInstance';
import { usePropertyMap } from '@/hooks/usePropertyMap';
import PropertyMapDisplay from './map/PropertyMapDisplay';
import { toast } from '@/components/ui/use-toast';

interface PropertyMapProps {
  address: string;
  onZoomComplete?: () => void;
}

const PropertyMap: React.FC<PropertyMapProps> = ({ address, onZoomComplete }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [modelJobId, setModelJobId] = React.useState<string | null>(null);
  const [showError, setShowError] = React.useState<boolean>(false);
  
  const {
    view,
    setView,
    is3DModelGenerating,
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

  // Add a helper function to add touch instructions for mobile users
  React.useEffect(() => {
    if (mapInstance && mapContainerRef.current) {
      // Add a small instruction tooltip for mobile users
      const instructionEl = document.createElement('div');
      instructionEl.className = 'absolute bottom-14 left-1/2 transform -translate-x-1/2 bg-black/70 text-white text-xs px-3 py-1 rounded-full pointer-events-none z-10 opacity-80 transition-opacity duration-300';
      instructionEl.textContent = 'Use two fingers to move map';
      mapContainerRef.current.appendChild(instructionEl);

      // Hide instruction after 5 seconds
      setTimeout(() => {
        instructionEl.style.opacity = '0';
        
        // Remove element after fade out
        setTimeout(() => {
          if (mapContainerRef.current?.contains(instructionEl)) {
            mapContainerRef.current.removeChild(instructionEl);
          }
        }, 300);
      }, 5000);
    }
  }, [mapInstance]);

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
        setShowError(false);
      }
    };
    
    const handleModelError = (event: CustomEvent) => {
      if (event.detail?.error) {
        setShowError(true);
        toast({
          title: "Error",
          description: "Failed to generate 3D model. Using demo model instead.",
          variant: "destructive"
        });
      }
    };
    
    document.addEventListener('modelJobCreated', handleModelJobCreated as EventListener);
    document.addEventListener('modelGenerationError', handleModelError as EventListener);
    
    return () => {
      document.removeEventListener('modelJobCreated', handleModelJobCreated as EventListener);
      document.removeEventListener('modelGenerationError', handleModelError as EventListener);
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
        analysisText={isAnalyzing ? "Analyzing Property..." : "Check Results"}
        view={view}
        showError={showError}
      />
      
      {isLoaded && (
        <>
          <MapControls
            view={view}
            onToggleView={toggleMapType}
          />
          
          {modelJobId && <ModelJobInfo jobId={modelJobId} />}
        </>
      )}
    </>
  );
};

export default PropertyMap;
