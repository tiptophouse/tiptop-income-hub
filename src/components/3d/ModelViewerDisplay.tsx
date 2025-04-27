import React, { memo } from "react";

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
  }>;
}

const ModelViewerDisplay: React.FC<ModelViewerDisplayProps> = memo(
  ({
    modelUrl,
    isModelViewerLoaded,
    rotateModel,
    modelRotation,
    zoomLevel = 100,
    backgroundColor = "#f5f5f5",
    showHotspots = true,
    hotspots = []
  }) => {
    const modelViewerRef = React.useRef<HTMLElement | null>(null);

    // Effect to load model
    React.useEffect(() => {
      const modelViewer = modelViewerRef.current;
      if (!modelViewer || !modelUrl) return;

      try {
        // Set the model source
        modelViewer.src = modelUrl;

        // Set camera controls
        modelViewer.cameraControls = true;
        modelViewer.autoRotate = false;
        modelViewer.exposure = 1;
        modelViewer.shadowIntensity = 1;
        modelViewer.skyboxImage = null; 
        modelViewer.environmentImage = null;
        
        // Set initial camera orbit
        modelViewer.setAttribute("camera-orbit", `0deg 75deg ${zoomLevel}%`);
      } catch (error) {
        console.error("Error configuring 3D model viewer:", error);
      }
    }, [modelUrl, zoomLevel]);

    // Effect for rotation
    React.useEffect(() => {
      if (!rotateModel || !modelViewerRef.current) return;

      try {
        const rotation = `${modelRotation}deg 75deg ${zoomLevel}%`;
        modelViewerRef.current.setAttribute("camera-orbit", rotation);
      } catch (error) {
        console.log("Error applying camera rotation:", error);
      }
    }, [modelRotation, rotateModel, zoomLevel]);

    // Effect for zoom level
    React.useEffect(() => {
      const modelViewer = modelViewerRef.current;
      if (!modelViewer) return;

      try {
        const currentOrbit = modelViewer.getAttribute("camera-orbit") || "0deg 75deg 100%";
        const orbitParts = currentOrbit.split(" ");
        
        // Replace the zoom percentage while keeping the rotation angles
        const newOrbit = `${orbitParts[0]} ${orbitParts[1]} ${zoomLevel}%`;
        modelViewer.setAttribute("camera-orbit", newOrbit);
      } catch (error) {
        console.log("Error applying zoom:", error);
      }
    }, [zoomLevel]);

    // Effect for background color
    React.useEffect(() => {
      const modelViewer = modelViewerRef.current;
      if (!modelViewer) return;
      
      try {
        modelViewer.style.backgroundColor = backgroundColor;
      } catch (error) {
        console.log("Error applying background color:", error);
      }
    }, [backgroundColor]);

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
          ref={modelViewerRef as React.RefObject<HTMLElement>}
          bounds="tight"
          enable-pan
          shadow-intensity="1"
          autoplay
          ar
          ar-modes="webxr scene-viewer quick-look"
          camera-orbit="0deg 75deg 105%"
          style={{ width: "100%", height: "100%", backgroundColor }}
        >
          {showHotspots && hotspots.map(hotspot => (
            <button
              key={hotspot.id}
              className="hotspot"
              slot={`hotspot-${hotspot.id}`}
              data-position={hotspot.position}
              data-normal={hotspot.normal}
              data-visibility-attribute="visible"
            >
              <div className="annotation">{hotspot.label}</div>
            </button>
          ))}
          
          <div className="progress-bar hide" slot="progress-bar">
            <div className="update-bar"></div>
          </div>
          <button slot="ar-button" id="ar-button">
            View in your space
          </button>
        </model-viewer>
        
        <style jsx>{`
          .hotspot {
            display: block;
            width: 20px;
            height: 20px;
            border-radius: 10px;
            border: none;
            background-color: blue;
            box-sizing: border-box;
            pointer-events: none;
          }

          .hotspot[data-visibility-attribute]:not([visible]) {
            background-color: transparent;
            border: 3px solid blue;
          }
          
          .annotation {
            background-color: #ffffff;
            position: absolute;
            transform: translate(10px, 10px);
            border-radius: 10px;
            padding: 10px;
            width: max-content;
            max-width: 250px;
            color: rgba(0, 0, 0, 0.8);
            font-size: 12px;
            display: none;
          }
          
          .hotspot:hover .annotation {
            display: block;
          }
        `}</style>
      </div>
    );
  }
);

ModelViewerDisplay.displayName = "ModelViewerDisplay";

export default ModelViewerDisplay;
