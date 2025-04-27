
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
  isModelViewerLoaded: boolean;
  rotateModel: boolean;
  modelRotation: number;
  toggleRotate: () => void;
  handleRefresh: () => void;
  handleDownload: () => void;
  jobId: string;
  zoomLevel?: number;
  backgroundColor?: string;
  hasSatelliteImage?: boolean;
  propertyFeatures?: {
    roofSize?: number;
    hasPool?: boolean;
    hasGarden?: boolean;
    hasParking?: boolean;
    hasEVCharging?: boolean;
  };
}

const Property3DModelViewer: React.FC<Property3DModelViewerProps> = ({
  modelUrl,
  isModelViewerLoaded,
  rotateModel,
  modelRotation,
  toggleRotate,
  handleRefresh,
  handleDownload,
  jobId,
  zoomLevel = 105,
  backgroundColor = "#f5f5f5",
  hasSatelliteImage = false,
  propertyFeatures
}) => {
  const isMobile = useIsMobile();
  const [showHotspots, setShowHotspots] = React.useState(true);
  
  // Generate hotspots based on propertyFeatures
  const hotspots = React.useMemo(() => {
    const spots = [];
    
    // Always add roof hotspot
    spots.push({
      id: "roof",
      position: "0 1 0",
      normal: "0 1 0",
      label: propertyFeatures?.roofSize 
        ? `Roof (${propertyFeatures.roofSize}sq ft) - Solar Panel Potential`
        : "Roof - Solar Panel Potential"
    });
    
    if (propertyFeatures?.hasParking) {
      spots.push({
        id: "parking",
        position: "0.5 0 0.5",
        normal: "0 1 0",
        label: "Parking - EV Charging Potential"
      });
    }
    
    if (propertyFeatures?.hasGarden) {
      spots.push({
        id: "garden",
        position: "-0.5 0 0.5",
        normal: "0 1 0",
        label: "Garden - Smart Irrigation Potential"
      });
    }
    
    if (propertyFeatures?.hasPool) {
      spots.push({
        id: "pool",
        position: "-0.5 0 -0.5",
        normal: "0 1 0",
        label: "Swimming Pool - Smart Pool System"
      });
    }
    
    // Always add facade/internet hotspot
    spots.push({
      id: "internet",
      position: "0 0.5 0.5",
      normal: "0 0 1",
      label: "Facade - Internet Antenna Potential"
    });
    
    return spots;
  }, [propertyFeatures]);
  
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
          <PropertyHotspots features={propertyFeatures} />
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
