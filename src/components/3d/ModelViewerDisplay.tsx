
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
  // Show model-viewer if GLB and script loaded, else fallback image + animation
  if (modelUrl?.endsWith(".glb") && isModelViewerLoaded) {
    // @ts-ignore
    return (
      <model-viewer
        src={modelUrl}
        alt="3D model of property"
        auto-rotate={rotateModel}
        camera-controls
        shadow-intensity="1"
        style={{
          width: "100%",
          height: "200px",
          background: "#f5f5f5",
          borderRadius: "0.375rem"
        }}
        poster="/lovable-uploads/4bc6d236-25b5-4fab-a4ef-10142c7c48e5.png"
      />
    );
  }

  return (
    <motion.div
      className="w-full h-48 bg-gray-100 rounded-md overflow-hidden"
      style={{ transform: `perspective(800px) rotateY(${modelRotation}deg)` }}
    >
      {modelUrl && (
        <img
          src={modelUrl}
          alt="Property 3D Model"
          className="w-full h-full object-cover"
        />
      )}
    </motion.div>
  );
};

export default ModelViewerDisplay;

