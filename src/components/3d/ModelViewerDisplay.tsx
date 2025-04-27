
import React from "react";

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
  if (!modelUrl) {
    return (
      <div className="w-full h-48 bg-gray-100 rounded-md flex items-center justify-center">
        <p className="text-gray-500">Loading 3D model...</p>
      </div>
    );
  }

  if (!isModelViewerLoaded) {
    return (
      <div className="w-full h-48 bg-gray-100 rounded-md flex items-center justify-center">
        <p className="text-gray-500">Loading model viewer...</p>
      </div>
    );
  }

  // Using model-viewer web component but with correct TypeScript handling
  return (
    <div className="model-viewer-container w-full h-[300px]">
      {/* @ts-ignore - model-viewer element is added by the script */}
      <model-viewer
        src={modelUrl}
        alt="3D property model"
        camera-controls={true}
        auto-rotate={rotateModel}
        rotation-per-second="30deg"
        style={{
          width: "100%",
          height: "300px",
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
