
import React, { memo, useEffect, useRef } from "react";

interface ModelViewerDisplayProps {
  modelUrl: string | null;
  isModelViewerLoaded: boolean;
  rotateModel: boolean;
  modelRotation: number;
  zoomLevel?: number;
  backgroundColor?: string;
  showHotspots?: boolean;
  hotspots?: Array<{
    id: string;
    position: string;
    normal: string;
    label: string;
    active?: boolean;
  }>;
}

// Default sample model URL as fallback
const DEFAULT_MODEL_URL = "https://modelviewer.dev/shared-assets/models/Astronaut.glb";

const ModelViewerDisplay: React.FC<ModelViewerDisplayProps> = memo(({
  modelUrl,
  isModelViewerLoaded,
  rotateModel,
  modelRotation,
  zoomLevel = 100,
  backgroundColor = "#f5f5f5",
  showHotspots = true,
  hotspots = []
}) => {
  const modelViewerRef = useRef<HTMLElement | null>(null);
  const effectiveModelUrl = modelUrl || DEFAULT_MODEL_URL;

  useEffect(() => {
    const modelViewer = modelViewerRef.current as any;
    if (!modelViewer || !isModelViewerLoaded) return;

    console.log("[ModelViewerDisplay] Loading model URL:", effectiveModelUrl);
    try {
      modelViewer.src = effectiveModelUrl;
      modelViewer.cameraControls = true;
      modelViewer.autoRotate = false;
      modelViewer.exposure = 1;
      modelViewer.shadowIntensity = 1;
      modelViewer.skyboxImage = null;
      modelViewer.environmentImage = null;
      modelViewer.setAttribute("camera-orbit", `0deg 75deg ${zoomLevel}%`);
      console.log("[ModelViewerDisplay] Model configured successfully");
    } catch (error) {
      console.error("[ModelViewerDisplay] Error configuring 3D model viewer:", error);
    }
  }, [effectiveModelUrl, isModelViewerLoaded, zoomLevel]);

  useEffect(() => {
    const modelViewer = modelViewerRef.current as any;
    if (!rotateModel || !modelViewer) return;

    console.log("[ModelViewerDisplay] Updating model rotation:", modelRotation);
    try {
      const rotation = `${modelRotation}deg 75deg ${zoomLevel}%`;
      modelViewer.setAttribute("camera-orbit", rotation);
    } catch (error) {
      console.log("[ModelViewerDisplay] Error applying camera rotation:", error);
    }
  }, [modelRotation, rotateModel, zoomLevel]);

  if (!isModelViewerLoaded) {
    console.log("[ModelViewerDisplay] 3D viewer not yet loaded");
    return (
      <div className="w-full aspect-video bg-gray-100 rounded-md flex items-center justify-center">
        <p className="text-gray-500">Loading 3D viewer...</p>
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-video bg-gray-100 rounded-md overflow-hidden">
      <model-viewer
        ref={modelViewerRef}
        camera-controls
        auto-rotate={rotateModel}
        exposure="1"
        shadow-intensity="1"
        autoplay
        ar
        ar-modes="webxr scene-viewer quick-look"
        camera-orbit={`0deg 75deg ${zoomLevel}%`}
        style={{ width: "100%", height: "100%", backgroundColor }}
      >
        {showHotspots && hotspots.map(hotspot => (
          <button
            key={hotspot.id}
            className={`hotspot ${hotspot.active ? 'active' : ''}`}
            slot={`hotspot-${hotspot.id}`}
            data-position={hotspot.position}
            data-normal={hotspot.normal}
            data-visibility-attribute="visible"
          >
            <div className="annotation">{hotspot.label}</div>
          </button>
        ))}
      </model-viewer>
        
      <style>
        {`
          .hotspot {
            display: block;
            width: 24px;
            height: 24px;
            border-radius: 12px;
            border: none;
            background-color: #8B5CF6;
            box-sizing: border-box;
            pointer-events: none;
            transition: all 0.3s ease;
            box-shadow: 0 0 5px rgba(0,0,0,0.5);
          }
          
          .hotspot.active {
            background-color: #ef4444;
            transform: scale(1.2);
          }

          .hotspot[data-visibility-attribute]:not([visible]) {
            background-color: transparent;
            border: 3px solid #8B5CF6;
          }
          
          .annotation {
            background-color: #ffffff;
            position: absolute;
            transform: translate(12px, 12px);
            border-radius: 10px;
            padding: 10px;
            width: max-content;
            max-width: 250px;
            color: rgba(0, 0, 0, 0.8);
            font-size: 12px;
            display: none;
            pointer-events: none;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          }
          
          .hotspot:hover .annotation {
            display: block;
          }
        `}
      </style>
    </div>
  );
});

ModelViewerDisplay.displayName = "ModelViewerDisplay";

export default ModelViewerDisplay;
