
import React, { useState, useEffect } from 'react';
import { Building, Play, Pause, ZoomIn, ZoomOut } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import ModelViewerDisplay from '@/components/3d/ModelViewerDisplay';
import ModelViewerScript from '@/components/ModelViewerScript';

// Sample model URL - replace with your actual Meshy model URL when available
const DEMO_MODEL_URL = "https://raw.githubusercontent.com/google/model-viewer/master/packages/shared-assets/models/glTF-Sample-Models/2.0/House/glTF/House.gltf";

const Property3DModelCard = () => {
  const isMobile = useIsMobile();
  const [isPlaying, setIsPlaying] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(105);
  const [modelRotation, setModelRotation] = useState(0);
  const [isModelViewerLoaded, setIsModelViewerLoaded] = useState(false);

  // Load the model-viewer script
  useEffect(() => {
    // Check if the script is already loaded
    if (customElements.get('model-viewer')) {
      setIsModelViewerLoaded(true);
      return;
    }

    // Create script element if not already loaded
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js';
    script.type = 'module';
    
    script.onload = () => {
      console.log("model-viewer script loaded successfully");
      setIsModelViewerLoaded(true);
    };
    
    script.onerror = (error) => {
      console.error("Error loading model-viewer script:", error);
    };
    
    document.head.appendChild(script);
  }, []);

  // Handle rotation when play is active
  useEffect(() => {
    let rotationInterval: number | null = null;
    
    if (isPlaying) {
      rotationInterval = window.setInterval(() => {
        setModelRotation((prev) => (prev + 1) % 360);
      }, 100);
    }
    
    return () => {
      if (rotationInterval !== null) {
        clearInterval(rotationInterval);
      }
    };
  }, [isPlaying]);

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 20, 200));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 20, 50));
  };

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader className={`${isMobile ? 'p-3' : 'pb-2'}`}>
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
          <Building className="h-4 w-4 sm:h-5 sm:w-5 text-tiptop-accent" />
          Property 3D Model
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          Interactive 3D view of your property
        </CardDescription>
      </CardHeader>
      <CardContent className={isMobile ? 'p-3 pt-0' : 'pt-0'}>
        <div className="w-full overflow-hidden rounded-lg">
          {isModelViewerLoaded ? (
            <ModelViewerDisplay 
              modelUrl={DEMO_MODEL_URL}
              isModelViewerLoaded={isModelViewerLoaded}
              rotateModel={isPlaying}
              modelRotation={modelRotation}
              zoomLevel={zoomLevel}
              backgroundColor="#f5f5f5"
              showHotspots={false}
              hotspots={[]}
            />
          ) : (
            <img 
              src="/lovable-uploads/bc1d5ec4-4a58-4238-85d9-66e0d999e65a.png"
              alt="Property 3D Model"
              className="w-full h-auto object-cover"
            />
          )}
        </div>
        <div className="mt-4 flex justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-24"
          >
            {isPlaying ? (
              <><Pause className="h-4 w-4 mr-2" /> Pause</>
            ) : (
              <><Play className="h-4 w-4 mr-2" /> Play</>
            )}
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleZoomIn}
          >
            <ZoomIn className="h-4 w-4 mr-2" />
            Zoom In
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleZoomOut}
          >
            <ZoomOut className="h-4 w-4 mr-2" />
            Zoom Out
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Property3DModelCard;
