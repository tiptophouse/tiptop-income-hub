import React, { useEffect, useState } from 'react';

interface ModelViewerProps {
  modelUrl: string;
  autoRotate?: boolean;
  zoomLevel?: number;
  aspectRatio?: string;
  className?: string;
  onLoad?: () => void;
  isModelViewerLoaded?: boolean;
  rotateModel?: boolean;
  modelRotation?: number;
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

const ModelViewer: React.FC<ModelViewerProps> = ({
  modelUrl,
  autoRotate = false,
  zoomLevel = 100,
  aspectRatio = "aspect-video",
  className = "",
  onLoad,
  isModelViewerLoaded = false,
  rotateModel = false,
  modelRotation = 0,
  backgroundColor = "#f5f5f5",
  showHotspots = false,
  hotspots = []
}) => {
  const [isModelViewerDefined, setIsModelViewerDefined] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const modelViewerRef = React.useRef<HTMLElement | null>(null);

  useEffect(() => {
    // If isModelViewerLoaded is provided, use it
    if (isModelViewerLoaded) {
      setIsModelViewerDefined(true);
      return;
    }
    
    // Otherwise check if model-viewer is already defined
    if (customElements.get('model-viewer')) {
      setIsModelViewerDefined(true);
      return;
    }
    
    // Load the model-viewer script
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js';
    script.type = 'module';
    
    script.onload = () => {
      console.log("model-viewer script loaded successfully");
      setIsModelViewerDefined(true);
    };
    
    script.onerror = () => {
      console.error("Failed to load model-viewer script");
      setIsError(true);
    };
    
    document.head.appendChild(script);
    
    // Clean up - but don't remove the script as it should be available globally
    return () => {
      // We don't remove the script to avoid conflicts with other components
    };
  }, [isModelViewerLoaded]);

  useEffect(() => {
    // Apply rotation and other configurations when the model-viewer is defined
    if (isModelViewerDefined && modelViewerRef.current) {
      const modelViewer = modelViewerRef.current as any;
      
      if (rotateModel) {
        const rotation = `${modelRotation}deg 75deg ${zoomLevel}%`;
        modelViewer.setAttribute("camera-orbit", rotation);
      }
    }
  }, [isModelViewerDefined, modelRotation, rotateModel, zoomLevel]);

  const handleModelLoad = () => {
    console.log("Model loaded successfully");
    setIsLoaded(true);
    if (onLoad) onLoad();
  };

  const handleModelError = () => {
    console.error("Error loading 3D model");
    setIsError(true);
  };

  if (!isModelViewerDefined) {
    return (
      <div className={`w-full ${aspectRatio} bg-gray-100 rounded-lg flex items-center justify-center ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-violet-400 mx-auto mb-2"></div>
          <p className="text-sm text-gray-500">Loading 3D viewer...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className={`w-full ${aspectRatio} bg-gray-100 rounded-lg flex items-center justify-center ${className}`}>
        <div className="text-center text-red-500">
          <p className="font-semibold">Failed to load 3D model</p>
          <p className="text-sm mt-1">Please try refreshing the page</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative w-full ${aspectRatio} ${className}`}>
      <model-viewer
        ref={modelViewerRef}
        src={modelUrl}
        alt="3D model of property"
        shadow-intensity="1"
        camera-controls
        auto-rotate={autoRotate || rotateModel}
        camera-orbit={`0deg 75deg ${zoomLevel}%`}
        style={{ width: "100%", height: "100%", backgroundColor }}
        className="w-full h-full rounded-lg bg-gray-50"
        onLoad={handleModelLoad}
        onError={handleModelError}
      >
        {!isLoaded && (
          <div slot="poster" className="w-full h-full flex items-center justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-violet-400"></div>
          </div>
        )}
        
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
      
      {showHotspots && (
        <style jsx>{`
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
        `}</style>
      )}
    </div>
  );
};

export default ModelViewer;
