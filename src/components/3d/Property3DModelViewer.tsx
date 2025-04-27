
import React from "react";
import ModelViewerDisplay from "./ModelViewerDisplay";
import ModelViewerControls from "./ModelViewerControls";
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";

interface Property3DModelViewerProps {
  modelUrl: string | null;
  isModelViewerLoaded: boolean;
  rotateModel: boolean;
  modelRotation: number;
  toggleRotate: () => void;
  handleRefresh: () => void;
  handleDownload: () => void;
  jobId: string;
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
}) => (
  <div className="space-y-4 relative">
    <ModelViewerDisplay
      modelUrl={modelUrl}
      isModelViewerLoaded={isModelViewerLoaded}
      rotateModel={rotateModel}
      modelRotation={modelRotation}
    />
    <ModelViewerControls
      onRotate={toggleRotate}
      onRefresh={handleRefresh}
      onDownload={handleDownload}
    />
    <div className="text-center">
      <p className="text-sm text-muted-foreground mb-2">
        3D Model ID: #{jobId.substring(0, 6)}
      </p>
      <Button
        variant="outline"
        size="sm"
        onClick={handleDownload}
        className="w-full"
      >
        <FileDown className="mr-2 h-4 w-4" />
        Download 3D Model
      </Button>
    </div>
  </div>
);

export default Property3DModelViewer;
