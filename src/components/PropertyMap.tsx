
import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from '@/components/ui/use-toast';
import { generateModelFromImage } from '@/utils/meshyApi';
import MapControls from './map/MapControls';
import ModelJobInfo from './map/ModelJobInfo';
import { useGoogleMapInstance } from '@/hooks/useGoogleMapInstance';
import html2canvas from 'html2canvas';

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
  const [currentZoomLevel, setCurrentZoomLevel] = useState(12); // Track the current zoom level
  const analysisTimerRef = useRef<NodeJS.Timeout | null>(null);
  const zoomTimerRef = useRef<NodeJS.Timeout | null>(null);

  const { mapInstance, isLoaded, zoomMap } = useGoogleMapInstance({
    mapContainerRef,
    address,
    view,
    initialZoom: 12, // Initial zoom level during analysis
    onZoomComplete: () => {
      // Initial map loading is complete
      console.log("Map initial loading complete");
    }
  });

  // Handle analysis completion and zooming
  useEffect(() => {
    if (!isLoaded || !mapInstance || !isAnalyzing) return;
    
    console.log("Starting property analysis timer");
    
    // Clear any existing timers
    if (analysisTimerRef.current) {
      clearTimeout(analysisTimerRef.current);
    }
    
    if (zoomTimerRef.current) {
      clearTimeout(zoomTimerRef.current);
    }
    
    // Set a timer to complete "analysis" and trigger zoom
    analysisTimerRef.current = setTimeout(() => {
      console.log("Analysis complete, preparing to zoom");
      setIsAnalyzing(false);
      
      // Wait a moment before zooming to make the transition apparent to the user
      zoomTimerRef.current = setTimeout(() => {
        console.log("Executing zoom to level 18");
        const success = zoomMap(18);
        
        if (success) {
          setCurrentZoomLevel(18);
          console.log("Zoom level updated to 18");
          
          if (onZoomComplete) {
            onZoomComplete();
          }
        }
      }, 500);
    }, 3000); // 3 seconds analysis time
    
    // Cleanup
    return () => {
      if (analysisTimerRef.current) {
        clearTimeout(analysisTimerRef.current);
      }
      if (zoomTimerRef.current) {
        clearTimeout(zoomTimerRef.current);
      }
    };
  }, [isLoaded, mapInstance, isAnalyzing, onZoomComplete, zoomMap]);

  // Monitor map zoom level changes
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

  const captureMapImage = async (): Promise<string> => {
    try {
      if (!mapContainerRef.current) {
        throw new Error("Map container not found");
      }
      const canvas = await html2canvas(mapContainerRef.current);
      const imageData = canvas.toDataURL('image/png');
      console.log("Map image captured successfully");
      return imageData;
    } catch (error) {
      console.error("Error capturing map image:", error);
      throw error;
    }
  };

  const generate3DModel = async () => {
    if (is3DModelGenerating) return;
    try {
      setIs3DModelGenerating(true);
      
      toast({
        title: "Processing",
        description: "Capturing property view...",
      });
      
      const imageData = await captureMapImage();
      
      toast({
        title: "Processing",
        description: "Generating 3D model from satellite imagery...",
      });

      try {
        // Actually call the Meshy API
        const jobId = await generateModelFromImage(imageData);
        console.log("3D model generation job created:", jobId);
        setModelJobId(jobId);
        
        // Dispatch event to notify other components
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
        
        // Fallback to demo model if API fails
        const demoJobId = "demo-3d-model-" + Math.random().toString(36).substring(2, 8);
        setModelJobId(demoJobId);
        
        // Dispatch event for demo model
        const modelEvent = new CustomEvent('modelJobCreated', {
          detail: { jobId: demoJobId }
        });
        document.dispatchEvent(modelEvent);
        
        toast({
          title: "Using Demo Model",
          description: "We encountered an issue with the 3D model API. Showing a demo model instead.",
        });
      }
    } catch (error) {
      console.error("Error in 3D model generation process:", error);
      
      toast({
        title: "Error",
        description: "Failed to generate 3D model. Please try again later.",
        variant: "destructive"
      });
      
      // Always provide a fallback
      const fallbackId = "demo-3d-model-" + Math.random().toString(36).substring(2, 8);
      setModelJobId(fallbackId);
      
      const modelEvent = new CustomEvent('modelJobCreated', {
        detail: { jobId: fallbackId }
      });
      document.dispatchEvent(modelEvent);
    } finally {
      setIs3DModelGenerating(false);
    }
  };

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
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-tiptop-accent" />
        </div>
      )}
      {isLoaded && (
        <>
          <MapControls
            view={view}
            onToggleView={toggleMapType}
            onGenerate3DModel={generate3DModel}
            isGenerating={is3DModelGenerating}
          />
          <div className="absolute bottom-4 left-4 bg-black/70 text-white rounded-full p-2 flex items-center justify-center">
            <span className="text-yellow-300 mr-1">☀</span>{weatherTemp}
          </div>
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
