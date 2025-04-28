
import React, { useEffect, useRef } from 'react';
import ModelHotspots from './ModelHotspots';

interface ModelViewerProps {
  modelUrl: string;
  isModelViewerLoaded: boolean;
  rotateModel: boolean;
  modelRotation: number;
  zoomLevel: number;
  backgroundColor: string;
  showHotspots: boolean;
  hotspots: Array<{
    id: string;
    position: string;
    normal: string;
    label: string;
    active?: boolean;
  }>;
}

const ModelViewer: React.FC<ModelViewerProps> = ({
  modelUrl,
  isModelViewerLoaded,
  rotateModel,
  modelRotation,
  zoomLevel,
  backgroundColor,
  showHotspots,
  hotspots
}) => {
  const modelViewerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const modelViewer = modelViewerRef.current as any;
    if (!modelViewer || !isModelViewerLoaded) return;

    try {
      modelViewer.src = modelUrl;
      modelViewer.cameraControls = true;
      modelViewer.autoRotate = false;
      modelViewer.exposure = 1;
      modelViewer.shadowIntensity = 1;
      modelViewer.skyboxImage = null;
      modelViewer.environmentImage = null;
      modelViewer.setAttribute("camera-orbit", `0deg 75deg ${zoomLevel}%`);
    } catch (error) {
      console.error("[ModelViewer] Error configuring 3D model viewer:", error);
    }
  }, [modelUrl, isModelViewerLoaded, zoomLevel]);

  useEffect(() => {
    const modelViewer = modelViewerRef.current as any;
    if (!rotateModel || !modelViewer) return;

    try {
      const rotation = `${modelRotation}deg 75deg ${zoomLevel}%`;
      modelViewer.setAttribute("camera-orbit", rotation);
    } catch (error) {
      console.log("[ModelViewer] Error applying camera rotation:", error);
    }
  }, [modelRotation, rotateModel, zoomLevel]);

  if (!isModelViewerLoaded) {
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
        {showHotspots && <ModelHotspots hotspots={hotspots} />}
      </model-viewer>
    </div>
  );
};

export default ModelViewer;
