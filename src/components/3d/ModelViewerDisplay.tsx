
import React from "react";
import { motion } from "framer-motion";

interface ModelViewerDisplayProps {
  modelUrl: string | null;
  isModelViewerLoaded: boolean;
  rotateModel: boolean;
  modelRotation: number;
}

const ModelViewerDisplay: React.FC<ModelViewerDisplayProps> = ({
  modelUrl,
  isModelViewerLoaded,
  rotateModel,
  modelRotation
}) => {
  if (!modelUrl) {
    return (
      <div className="w-full h-48 bg-gray-100 rounded-md flex items-center justify-center">
        <p className="text-gray-500">Loading 3D model...</p>
      </div>
    );
  }

  // @ts-ignore - model-viewer element is added by the script
  return (
    <model-viewer
      src={modelUrl}
      alt="3D property model"
      camera-controls
      auto-rotate={rotateModel}
      rotation-per-second="30deg"
      style={{
        width: "100%",
        height: "300px",
        backgroundColor: "#f5f5f5",
        borderRadius: "0.375rem"
      }}
      camera-orbit={`${modelRotation}deg 75deg 105%`}
      exposure="0.5"
      shadow-intensity="1"
      shadow-softness="0.7"
      environment-image="neutral"
    />
  );
};

export default ModelViewerDisplay;
