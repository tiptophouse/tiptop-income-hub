
import React, { useEffect, useRef } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

interface ModelViewerDisplayProps {
  modelUrl: string | null;
  isModelViewerLoaded: boolean;
  rotateModel: boolean;
  modelRotation: number;
  zoomLevel?: number;
  backgroundColor?: string;
  showHotspots?: boolean;
}

const ModelViewerDisplay: React.FC<ModelViewerDisplayProps> = ({
  modelUrl,
  isModelViewerLoaded,
  rotateModel,
  modelRotation,
  zoomLevel = 105,
  backgroundColor = "#f5f5f5",
  showHotspots = true
}) => {
  const isMobile = useIsMobile();
  const modelViewerRef = useRef<HTMLElement | null>(null);
  
  useEffect(() => {
    // This is needed to reinitialize model-viewer hotspots after the model loads
    if (isModelViewerLoaded && modelUrl && showHotspots) {
      const timer = setTimeout(() => {
        if (modelViewerRef.current) {
          // Force a redraw of the model viewer
          modelViewerRef.current.dispatchEvent(new CustomEvent('load'));
        }
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [isModelViewerLoaded, modelUrl, showHotspots]);
  
  useEffect(() => {
    // Initialize hotspots with animated data when model loads
    const handleModelLoad = () => {
      if (modelViewerRef.current) {
        // Add pulse animation to hotspots
        const hotspots = modelViewerRef.current.querySelectorAll('.hotspot');
        hotspots.forEach(hotspot => {
          hotspot.classList.add('pulse');
        });
      }
    };
    
    const modelViewer = modelViewerRef.current;
    if (modelViewer) {
      modelViewer.addEventListener('load', handleModelLoad);
    }
    
    return () => {
      if (modelViewer) {
        modelViewer.removeEventListener('load', handleModelLoad);
      }
    };
  }, [modelUrl, isModelViewerLoaded]);
  
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
  
  const hotspotStyle = `
    .hotspot {
      display: block;
      width: 20px;
      height: 20px;
      border-radius: 10px;
      border: none;
      background-color: blue;
      box-sizing: border-box;
      pointer-events: all;
      position: absolute;
      transform: translate3d(-50%, -50%, 0);
      transition: transform 0.3s ease;
    }
    
    .hotspot:hover {
      transform: translate3d(-50%, -50%, 0) scale(1.2);
    }
    
    .hotspot[data-type="solar"] {
      background-color: #f59e0b;
      box-shadow: 0 0 10px 2px rgba(245, 158, 11, 0.7);
    }
    
    .hotspot[data-type="ev"] {
      background-color: #10b981;
      box-shadow: 0 0 10px 2px rgba(16, 185, 129, 0.7);
    }
    
    .hotspot[data-type="internet"] {
      background-color: #3b82f6;
      box-shadow: 0 0 10px 2px rgba(59, 130, 246, 0.7);
    }
    
    .hotspot-annotation {
      background-color: #ffffff;
      border-radius: 4px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.25);
      color: rgba(0, 0, 0, 0.8);
      display: block;
      font-family: system-ui, sans-serif;
      font-size: 12px;
      font-weight: 700;
      left: calc(100% + 8px);
      max-width: 128px;
      overflow-wrap: break-word;
      padding: 0.5em 1em;
      position: absolute;
      top: 50%;
      width: max-content;
      transform: translateY(-50%);
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.3s;
    }
    
    .hotspot:hover + .hotspot-annotation {
      opacity: 1;
    }
    
    @keyframes pulse {
      0% {
        transform: translate3d(-50%, -50%, 0) scale(1);
        opacity: 1;
      }
      50% {
        transform: translate3d(-50%, -50%, 0) scale(1.2);
        opacity: 0.8;
      }
      100% {
        transform: translate3d(-50%, -50%, 0) scale(1);
        opacity: 1;
      }
    }
    
    .hotspot.pulse {
      animation: pulse 2s infinite;
    }
  `;

  // Using model-viewer web component but with correct TypeScript handling
  return (
    <div className="model-viewer-container w-full">
      <style>{hotspotStyle}</style>
      {/* @ts-ignore - model-viewer element is added by the script */}
      <model-viewer
        ref={modelViewerRef as any}
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
      >
        {showHotspots && (
          <>
            {/* Solar panel hotspot on roof */}
            <button className="hotspot" slot="hotspot-roof" data-type="solar" data-position="0 3 0"></button>
            <div className="hotspot-annotation" slot="hotspot-roof">Solar Panel Opportunity: <br/>$400/month</div>
            
            {/* EV charging hotspot on driveway */}
            <button className="hotspot" slot="hotspot-driveway" data-type="ev" data-position="-3 0 3"></button>
            <div className="hotspot-annotation" slot="hotspot-driveway">EV Charging: <br/>$250/month</div>
            
            {/* Internet sharing hotspot on side of house */}
            <button className="hotspot" slot="hotspot-attic" data-type="internet" data-position="3 2 0"></button>
            <div className="hotspot-annotation" slot="hotspot-attic">Internet Sharing: <br/>$180/month</div>
            
            {/* Additional hotspot for roof edge */}
            <button className="hotspot" slot="hotspot-roof-edge" data-type="solar" data-position="2 3 -2"></button>
            <div className="hotspot-annotation" slot="hotspot-roof-edge">Additional Solar Potential: <br/>$150/month</div>
          </>
        )}
      </model-viewer>
    </div>
  );
};

export default ModelViewerDisplay;
