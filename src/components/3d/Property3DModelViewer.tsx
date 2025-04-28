
import React, { useState } from "react";
import ModelViewer from "./ModelViewer";
import ModelControls from "./ModelControls";
import { useIsMobile } from "@/hooks/use-mobile";
import { use3DModelControls } from "@/hooks/use3DModelControls";

interface Property3DModelViewerProps {
  modelUrl: string | null;
  jobId: string;
  zoomLevel?: number;
  backgroundColor?: string;
  hasSatelliteImage?: boolean;
  propertyFeatures?: {
    roofSize?: number;
    solarPotentialKw?: number;
    internetMbps?: number;
    parkingSpaces?: number;
    gardenSqFt?: number;
    hasPool?: boolean;
    hasGarden?: boolean;
    hasParking?: boolean;
    hasEVCharging?: boolean;
  };
}

const DEFAULT_MODEL_URL = "https://modelviewer.dev/shared-assets/models/Astronaut.glb";

const Property3DModelViewer: React.FC<Property3DModelViewerProps> = ({
  modelUrl,
  jobId,
  zoomLevel = 105,
  backgroundColor = "#f5f5f5",
  hasSatelliteImage = false,
  propertyFeatures
}) => {
  const [showHotspots, setShowHotspots] = useState(true);
  const [isModelViewerLoaded, setIsModelViewerLoaded] = useState(false);
  const effectiveModelUrl = modelUrl || DEFAULT_MODEL_URL;
  
  const {
    rotateModel,
    modelRotation,
    selectedAsset,
    setSelectedAsset,
    zoomLevel: currentZoom,
  } = use3DModelControls(false, zoomLevel);

  React.useEffect(() => {
    const checkModelViewerLoaded = () => {
      if (customElements.get('model-viewer')) {
        setIsModelViewerLoaded(true);
      } else {
        setTimeout(checkModelViewerLoaded, 100);
      }
    };
    checkModelViewerLoaded();
  }, []);

  const hotspots = React.useMemo(() => {
    const spots = [];
    
    if (propertyFeatures?.roofSize) {
      spots.push({
        id: "solar",
        position: "0 1 0",
        normal: "0 1 0",
        label: `${propertyFeatures.roofSize} sq ft usable with ${propertyFeatures.solarPotentialKw || 6.5}kW potential`,
        active: selectedAsset === "solar"
      });
    }
    
    if (propertyFeatures?.internetMbps) {
      spots.push({
        id: "internet",
        position: "0 0.5 0.5",
        normal: "0 0 1",
        label: `${propertyFeatures.internetMbps} Mbps available for sharing`,
        active: selectedAsset === "internet"
      });
    }
    
    if (propertyFeatures?.hasParking) {
      spots.push({
        id: "parking",
        position: "0.5 0 0.5",
        normal: "0 1 0",
        label: propertyFeatures?.parkingSpaces
          ? `${propertyFeatures.parkingSpaces} parking spaces available`
          : "Parking Space Rental",
        active: selectedAsset === "parking"
      });
    }
    
    if (propertyFeatures?.hasGarden) {
      spots.push({
        id: "garden",
        position: "-0.5 0 0.5",
        normal: "0 1 0",
        label: propertyFeatures?.gardenSqFt
          ? `${propertyFeatures.gardenSqFt} sq ft garden space`
          : "Garden Space",
        active: selectedAsset === "garden"
      });
    }
    
    if (propertyFeatures?.hasPool) {
      spots.push({
        id: "pool",
        position: "-0.5 0 -0.5",
        normal: "0 1 0",
        label: "Swimming Pool - Smart Pool System",
        active: selectedAsset === "pool"
      });
    }
    
    return spots;
  }, [propertyFeatures, selectedAsset]);

  const handleDownload = () => {
    if (modelUrl) {
      window.open(modelUrl, '_blank');
    }
  };

  return (
    <div className="space-y-2 sm:space-y-4 relative">
      <ModelViewer
        modelUrl={effectiveModelUrl}
        isModelViewerLoaded={isModelViewerLoaded}
        rotateModel={rotateModel}
        modelRotation={modelRotation}
        zoomLevel={currentZoom}
        backgroundColor={backgroundColor}
        showHotspots={showHotspots}
        hotspots={hotspots}
      />
      
      <ModelControls
        showHotspots={showHotspots}
        onHotspotsToggle={setShowHotspots}
        onDownload={handleDownload}
        jobId={jobId}
      />
      
      {hasSatelliteImage && (
        <div className="text-xs text-center text-muted-foreground">
          Using combined satellite and street view imagery for enhanced accuracy
        </div>
      )}
    </div>
  );
};

export default Property3DModelViewer;
