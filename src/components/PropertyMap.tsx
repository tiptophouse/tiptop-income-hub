import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from '@/components/ui/use-toast';
import { generateModelFromImage } from '@/utils/meshyApi';
import MapControls from './map/MapControls';
import ModelJobInfo from './map/ModelJobInfo';
import WeatherDisplay from './map/WeatherDisplay';
import MapLoading from './map/MapLoading';
import { useGoogleMapInstance } from '@/hooks/useGoogleMapInstance';
import { usePropertyScreenshot } from '@/hooks/usePropertyScreenshot';

interface PropertyMapProps {
  address: string;
  onZoomComplete?: () => void;
}

const PropertyMap: React.FC<PropertyMapProps> = ({ address, onZoomComplete }) => {
  const [view, setView] = useState<'satellite' | 'map'>('satellite');
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [is3DModelGenerating, setIs3DModelGenerating] = useState(false);
  const [modelJobId, setModelJobId] = useState<string | null>(null);
  const [weatherTemp, setWeatherTemp] = useState<string>("26°");
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [currentZoomLevel, setCurrentZoomLevel] = useState(12);
  const analysisTimerRef = useRef<NodeJS.Timeout | null>(null);
  const zoomTimerRef = useRef<NodeJS.Timeout | null>(null);
  const hasExecutedZoom = useRef(false);

  const { mapInstance, isLoaded, zoomMap } = useGoogleMapInstance({
    mapContainerRef,
    address,
    view,
    initialZoom: 12,
    onZoomComplete: () => {
      console.log("Map initial loading complete");
    }
  });

  const { 
    isCapturingScreenshot, 
    screenshotCaptured,
    captureAndSendPropertyScreenshot 
  } = usePropertyScreenshot({
    address,
    mapContainerRef
  });

  useEffect(() => {
    if (!isLoaded || !mapInstance || !isAnalyzing || hasExecutedZoom.current) return;
    
    console.log("Starting property analysis timer");
    
    if (analysisTimerRef.current) {
      clearTimeout(analysisTimerRef.current);
    }
    
    if (zoomTimerRef.current) {
      clearTimeout(zoomTimerRef.current);
    }
    
    analysisTimerRef.current = setTimeout(() => {
      console.log("Analysis complete, preparing to zoom");
      setIsAnalyzing(false);
      
      zoomTimerRef.current = setTimeout(() => {
        console.log("Executing zoom to level 18");
        
        hasExecutedZoom.current = true;
        
        const success = zoomMap(18);
        
        if (success) {
          setCurrentZoomLevel(18);
          console.log("Zoom operation initiated to level 18");
          
          setTimeout(() => {
            if (onZoomComplete) {
              onZoomComplete();
            }
            
            if (!screenshotCaptured) {
              captureAndSendPropertyScreenshot();
            }
          }, 1500);
        } else {
          console.error("Zoom operation failed");
          if (mapInstance) {
            try {
              console.log("Attempting direct zoom to level 18");
              mapInstance.setZoom(18);
              setCurrentZoomLevel(18);
              
              setTimeout(() => {
                if (!screenshotCaptured) {
                  captureAndSendPropertyScreenshot();
                }
              }, 1500);
            } catch (e) {
              console.error("Direct zoom failed:", e);
            }
          }
        }
      }, 500);
    }, 3000);
    
    return () => {
      if (analysisTimerRef.current) {
        clearTimeout(analysisTimerRef.current);
      }
      if (zoomTimerRef.current) {
        clearTimeout(zoomTimerRef.current);
      }
    };
  }, [isLoaded, mapInstance, isAnalyzing, onZoomComplete, zoomMap]);

  useEffect(() => {
    if (!mapInstance) return;
    
    const zoomListener = mapInstance.addListener('zoom_changed', () => {
      const newZoom = mapInstance.getZoom();
      console.log(`Map zoom changed to: ${newZoom}`);
      setCurrentZoomLevel(newZoom);
    });
    
    return () => {
      if (window.google && window.google.maps && zoomListener) {
        window.google.maps.event.removeListener(zoomListener);
      }
    };
  }, [mapInstance]);

  const toggleMapType = () => {
    if (!mapInstance) return;
    const newView = view === 'satellite' ? 'map' : 'satellite';
    mapInstance.setMapTypeId(newView === 'satellite' ? 'satellite' : 'roadmap');
    setView(newView);
  };

  const generate3DModel = async () => {
    if (is3DModelGenerating) return;
    
    try {
      setIs3DModelGenerating(true);
      
      toast({
        title: "Processing",
        description: "Capturing property view...",
      });
      
      const canvas = await html2canvas(mapContainerRef.current!);
      const imageData = canvas.toDataURL('image/png');
      
      toast({
        title: "Processing",
        description: "Generating 3D model from satellite imagery...",
      });

      try {
        const jobId = await generateModelFromImage(imageData);
        console.log("3D model generation job created:", jobId);
        setModelJobId(jobId);
        
        const modelEvent = new CustomEvent('modelJobCreated', {
          detail: { jobId }
        });
        document.dispatchEvent(modelEvent);
        
        toast({
          title: "Success",
          description: "3D model generation started! It may take a few minutes to complete.",
        });
      } catch (error) {
        console.error("Error calling Meshy API:", error);
        handleModelGenerationFallback();
      }
    } catch (error) {
      console.error("Error in 3D model generation process:", error);
      handleModelGenerationFallback();
    } finally {
      setIs3DModelGenerating(false);
    }
  };

  const handleModelGenerationFallback = () => {
    const demoJobId = "demo-3d-model-" + Math.random().toString(36).substring(2, 8);
    setModelJobId(demoJobId);
    
    const modelEvent = new CustomEvent('modelJobCreated', {
      detail: { jobId: demoJobId }
    });
    document.dispatchEvent(modelEvent);
    
    toast({
      title: "Using Demo Model",
      description: "We encountered an issue with the 3D model API. Showing a demo model instead.",
    });
  };

  useEffect(() => {
    if (!isLoaded || !mapInstance || !address || isAnalyzing || !hasExecutedZoom.current || isCapturingScreenshot) return;
    
    if (currentZoomLevel >= 18 && !screenshotCaptured) {
      console.log("Map zoomed in, capturing screenshot");
      captureAndSendPropertyScreenshot();
    }
  }, [currentZoomLevel, isLoaded, mapInstance, address, isAnalyzing, hasExecutedZoom.current, isCapturingScreenshot]);

  return (
    <motion.div
      className="relative w-full h-80 rounded-xl overflow-hidden shadow-md border border-gray-200"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div 
        ref={mapContainerRef} 
        className="w-full h-full"
      />
      {!isLoaded && <MapLoading />}
      {isLoaded && (
        <>
          <MapControls
            view={view}
            onToggleView={toggleMapType}
            onGenerate3DModel={generate3DModel}
            isGenerating={is3DModelGenerating}
          />
          <WeatherDisplay temperature={weatherTemp} />
          <div className="absolute top-4 left-4 bg-tiptop-accent/90 text-white rounded-lg px-3 py-1 text-xs font-bold shadow-lg">
            {isAnalyzing ? 'Analyzing Property...' : view === 'satellite' ? 'Satellite View' : 'Map View'}
          </div>
        </>
      )}
      {modelJobId && <ModelJobInfo jobId={modelJobId} />}
    </motion.div>
  );
};

export default PropertyMap;
