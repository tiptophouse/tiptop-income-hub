import React from "react";
import ModelViewerDisplay from "./ModelViewerDisplay";
import ModelViewerControls from "./ModelViewerControls";
import { Button } from "@/components/ui/button";
import { FileDown, Eye, EyeOff } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import PropertyHotspots from "../PropertyHotspots";

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

const Property3DModelViewer: React.FC<Property3DModelViewerProps> = ({
  modelUrl,
  jobId,
  zoomLevel = 105,
  backgroundColor = "#f5f5f5",
  hasSatelliteImage = false,
  propertyFeatures
}) => {
  const isMobile = useIsMobile();
  const [showHotspots, setShowHotspots] = React.useState(true);
  const [selectedAsset, setSelectedAsset] = React.useState<string | null>(null);
  const [isModelViewerLoaded, setIsModelViewerLoaded] = React.useState(false);
  const [rotateModel, setRotateModel] = React.useState(false);
  const [modelRotation, setModelRotation] = React.useState(0);

  React.useEffect(() => {
    console.log("[Property3DModelViewer] Initializing with model URL:", modelUrl);
    const checkModelViewerLoaded = () => {
      if (customElements.get('model-viewer')) {
        console.log("[Property3DModelViewer] model-viewer element loaded successfully");
        setIsModelViewerLoaded(true);
      } else {
        console.log("[Property3DModelViewer] Waiting for model-viewer to load...");
        setTimeout(checkModelViewerLoaded, 100);
      }
    };
    checkModelViewerLoaded();
  }, []);

  React.useEffect(() => {
    if (!rotateModel) return;
    
    const rotationInterval = setInterval(() => {
      setModelRotation(prev => (prev + 1) % 360);
    }, 50);

    return () => clearInterval(rotationInterval);
  }, [rotateModel]);

  const toggleRotate = () => {
    console.log("[Property3DModelViewer] Toggling rotation:", !rotateModel);
    setRotateModel(prev => !prev);
  };

  const handleRefresh = () => {
    console.log("[Property3DModelViewer] Refreshing model view");
    window.location.reload();
  };

  const handleDownload = () => {
    if (modelUrl) {
      console.log("[Property3DModelViewer] Downloading model from URL:", modelUrl);
      window.open(modelUrl, '_blank');
    }
  };

  const hotspots = React.useMemo(() => {
    console.log("[Property3DModelViewer] Generating hotspots from features:", propertyFeatures);
    const spots = [];
    
    spots.push({
      id: "solar",
      position: "0 1 0",
      normal: "0 1 0",
      label: propertyFeatures?.roofSize 
        ? `${propertyFeatures.roofSize} sq ft usable with ${propertyFeatures.solarPotentialKw || 6.5}kW potential`
        : "Solar Panel Potential",
      active: selectedAsset === "solar"
    });
    
    spots.push({
      id: "internet",
      position: "0 0.5 0.5",
      normal: "0 0 1",
      label: propertyFeatures?.internetMbps
        ? `${propertyFeatures.internetMbps} Mbps available for sharing`
        : "Internet Bandwidth Sharing",
      active: selectedAsset === "internet"
    });
    
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
  
  return (
    <div className="space-y-2 sm:space-y-4 relative">
      <div className="relative">
        <ModelViewerDisplay
          modelUrl={modelUrl}
          isModelViewerLoaded={isModelViewerLoaded}
          rotateModel={rotateModel}
          modelRotation={modelRotation}
          zoomLevel={zoomLevel}
          backgroundColor={backgroundColor}
          showHotspots={showHotspots}
          hotspots={hotspots}
        />
        
        {showHotspots && propertyFeatures && (
          <PropertyHotspots 
            features={propertyFeatures} 
            selectedAsset={selectedAsset}
            onSelectAsset={setSelectedAsset}
          />
        )}
      </div>
      
      <ModelViewerControls
        onRotate={toggleRotate}
        onRefresh={handleRefresh}
        onDownload={handleDownload}
      />
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Switch 
            id="hotspots-toggle"
            checked={showHotspots}
            onCheckedChange={setShowHotspots}
          />
          <Label htmlFor="hotspots-toggle" className="text-xs sm:text-sm cursor-pointer">
            {showHotspots ? 
              <span className="flex items-center gap-1"><Eye className="h-3 w-3" /> Show monetizable areas</span> : 
              <span className="flex items-center gap-1"><EyeOff className="h-3 w-3" /> Hide monetizable areas</span>
            }
          </Label>
        </div>
        
        <p className="text-xs text-muted-foreground">
          3D Model ID: #{jobId.substring(0, 6)}
        </p>
      </div>
      
      <Button
        variant="outline"
        size={isMobile ? "sm" : "default"}
        onClick={handleDownload}
        className="w-full text-xs sm:text-sm"
      >
        <FileDown className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
        Download 3D Model
      </Button>
      
      {hasSatelliteImage && (
        <div className="text-xs text-center text-muted-foreground">
          Using combined satellite and street view imagery for enhanced accuracy
        </div>
      )}
    </div>
  );
};

export default Property3DModelViewer;
