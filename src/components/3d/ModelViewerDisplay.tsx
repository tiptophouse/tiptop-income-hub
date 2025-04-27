
import React from "react";
import { useIsMobile } from "@/hooks/use-mobile";

interface ModelViewerDisplayProps {
  modelUrl: string | null;
  isModelViewerLoaded: boolean;
  rotateModel: boolean;
  modelRotation: number;
  zoomLevel?: number;
  backgroundColor?: string;
}

const ModelViewerDisplay: React.FC<ModelViewerDisplayProps> = ({
  modelUrl,
  isModelViewerLoaded,
  rotateModel,
  modelRotation,
  zoomLevel = 105,
  backgroundColor = "#f5f5f5"
}) => {
  const isMobile = useIsMobile();
  
  if (!modelUrl) {
    return (
      <div className="w-full h-36 sm:h-48 bg-gray-100 rounded-md flex items-center justify-center">
        <p className="text-gray-500 text-xs sm:text-sm">Loading 3D model...</p>
      </div>
    );
  }

  if (!isModelViewerLoaded) {
    return (
      <div className="w-full h-36 sm:h-48 bg-gray-100 rounded-md flex items-center justify-center">
        <p className="text-gray-500 text-xs sm:text-sm">Loading model viewer...</p>
      </div>
    );
  }

  const modelHeight = isMobile ? "180px" : "300px";

  // Using model-viewer web component but with correct TypeScript handling
  return (
    <div className="model-viewer-container w-full">
      {/* @ts-ignore - model-viewer element is added by the script */}
      <model-viewer
        src={modelUrl}
        alt="3D property model"
        camera-controls={true}
        auto-rotate={rotateModel}
        rotation-per-second="30deg"
        style={{
          width: "100%",
          height: modelHeight,
          backgroundColor: backgroundColor,
          borderRadius: "0.375rem"
        }}
        camera-orbit={`${modelRotation}deg 75deg ${zoomLevel}%`}
        shadow-intensity="1"
        shadow-softness="0.7"
        environment-image="neutral"
        exposure="1"
        interaction-prompt="none"
        ar
        ar-modes="webxr scene-viewer quick-look"
        touch-action="pan-y"
      />
    </div>
  );
};

export default ModelViewerDisplay;
