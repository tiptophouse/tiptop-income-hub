
import React, { useEffect, useState } from 'react';

interface ModelViewerProps {
  modelUrl: string;
  autoRotate?: boolean;
  zoomLevel?: number;
  aspectRatio?: string;
  className?: string;
  onLoad?: () => void;
}

const ModelViewer: React.FC<ModelViewerProps> = ({
  modelUrl,
  autoRotate = false,
  zoomLevel = 100,
  aspectRatio = "aspect-video",
  className = "",
  onLoad
}) => {
  const [isModelViewerDefined, setIsModelViewerDefined] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    // Check if model-viewer is already defined
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
  }, []);

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
        src={modelUrl}
        alt="3D model of property"
        shadow-intensity="1"
        camera-controls
        auto-rotate={autoRotate}
        camera-orbit={`0deg 75deg ${zoomLevel}%`}
        style={{ width: "100%", height: "100%" }}
        className="w-full h-full rounded-lg bg-gray-50"
        onLoad={handleModelLoad}
        onError={handleModelError}
      >
        {!isLoaded && (
          <div slot="poster" className="w-full h-full flex items-center justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-violet-400"></div>
          </div>
        )}
      </model-viewer>
    </div>
  );
};

export default ModelViewer;
