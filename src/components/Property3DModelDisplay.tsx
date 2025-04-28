import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Building } from "lucide-react";
import Property3DModelFailed from "./3d/Property3DModelFailed";
import Property3DModelViewer from "./3d/Property3DModelViewer";
import ModelAlert from "./3d/ModelAlert";
import ModelProcessingStatus from "./3d/ModelProcessingStatus";
import ModelViewerAdvancedControls from "./3d/ModelViewerAdvancedControls";
import { use3DModel } from "@/hooks/use3DModel";
import { useIsMobile } from "@/hooks/use-mobile";

interface Property3DModelDisplayProps {
  jobId: string;
  address: string;
  className?: string;
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

const Property3DModelDisplay: React.FC<Property3DModelDisplayProps> = ({
  jobId,
  address,
  className,
  hasSatelliteImage = false,
  propertyFeatures
}) => {
  const [showControls, setShowControls] = useState(false);
  const [errorDismissed, setErrorDismissed] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(105);
  const [backgroundColor, setBackgroundColor] = useState("#f5f5f5");
  const isMobile = useIsMobile();

  const { 
    modelStatus, 
    modelUrl, 
    isLoading, 
    error, 
    statusMessage, 
    progress, 
    handleRefresh 
  } = use3DModel(jobId);

  if (modelStatus === "failed" && !modelUrl) {
    return <Property3DModelFailed onRetry={handleRefresh} address={address} className={className} />;
  }

  const propertyFeaturesText = propertyFeatures ? [
    propertyFeatures.roofSize ? `Solar potential: ${propertyFeatures.roofSize}sq ft roof` : null,
    propertyFeatures.hasPool ? "Pool: Available for smart systems" : null,
    propertyFeatures.hasGarden ? "Garden: Perfect for smart irrigation" : null,
    propertyFeatures.hasParking ? "Parking: Ideal for EV charging" : null,
    propertyFeatures.hasEVCharging ? "EV Charging: Already installed" : null
  ].filter(Boolean).join(" • ") : "";

  return (
    <Card className={`${className} shadow-md hover:shadow-lg transition-shadow duration-300`}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
          <Building className="h-4 w-4 sm:h-5 sm:w-5 text-tiptop-accent" />
          Property 3D Model
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm flex justify-between items-center">
          <span className="truncate">{address}</span>
          <button 
            className="p-0 h-auto text-[10px] sm:text-xs text-tiptop-accent"
            onClick={() => setShowControls(!showControls)}
          >
            {showControls ? "Hide advanced controls" : "Show advanced controls"}
          </button>
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && !errorDismissed && (
          <ModelAlert onDismiss={() => setErrorDismissed(true)} />
        )}
        
        {modelStatus === 'processing' && (
          <ModelProcessingStatus 
            statusMessage={statusMessage}
            progress={progress}
          />
        )}
        
        {showControls && (
          <ModelViewerAdvancedControls 
            zoomLevel={zoomLevel}
            onZoomChange={(value) => setZoomLevel(value[0])}
            backgroundColor={backgroundColor}
            onBackgroundChange={setBackgroundColor}
          />
        )}

        <Property3DModelViewer
          modelUrl={modelUrl}
          jobId={jobId}
          zoomLevel={zoomLevel}
          backgroundColor={backgroundColor}
          hasSatelliteImage={hasSatelliteImage}
          propertyFeatures={propertyFeatures}
        />
        
        {(hasSatelliteImage || propertyFeaturesText) && (
          <div className="mt-2 text-xs text-center text-tiptop-accent font-medium">
            {hasSatelliteImage && "Enhanced 3D model using satellite imagery"}
            {hasSatelliteImage && propertyFeaturesText && " • "}
            {propertyFeaturesText}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Property3DModelDisplay;
