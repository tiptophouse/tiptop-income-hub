
import React from "react";
import ModelViewerDisplay from "./ModelViewerDisplay";
import ModelViewerControls from "./ModelViewerControls";
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

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
  backgroundColor = "#f5f5f5"
}) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="space-y-2 sm:space-y-4 relative">
      <ModelViewerDisplay
        modelUrl={modelUrl}
        isModelViewerLoaded={isModelViewerLoaded}
        rotateModel={rotateModel}
        modelRotation={modelRotation}
        zoomLevel={zoomLevel}
        backgroundColor={backgroundColor}
      />
      <ModelViewerControls
        onRotate={toggleRotate}
        onRefresh={handleRefresh}
        onDownload={handleDownload}
      />
      <div className="text-center">
        <p className="text-xs sm:text-sm text-muted-foreground mb-2">
          3D Model ID: #{jobId.substring(0, 6)}
        </p>
        <Button
          variant="outline"
          size={isMobile ? "sm" : "default"}
          onClick={handleDownload}
          className="w-full text-xs sm:text-sm"
        >
          <FileDown className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
          Download 3D Model
        </Button>
      </div>
    </div>
  );
};

export default Property3DModelViewer;
